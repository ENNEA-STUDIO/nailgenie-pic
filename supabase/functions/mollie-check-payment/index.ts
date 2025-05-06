
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import createMollieClient from "https://esm.sh/@mollie/api-client@3.7.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("mollie-check-payment function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const mollieApiKey = Deno.env.get("MOLLIE_API_KEY");
    if (!mollieApiKey) {
      console.error("MOLLIE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ success: false, error: "MOLLIE_API_KEY is not configured" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Initialize Mollie client
    const mollie = createMollieClient({ apiKey: mollieApiKey });

    // Parse the request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request body" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Get the payment ID from the request
    const { paymentId } = requestBody;
    if (!paymentId) {
      console.error("Payment ID is required");
      return new Response(
        JSON.stringify({ success: false, error: "Payment ID is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log(`Checking payment ID: ${paymentId}`);

    try {
      // Get the payment details from Mollie
      const payment = await mollie.payments.get(paymentId);
      console.log(`Payment status: ${payment.status}`);
      
      // Initialize Supabase admin client
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

      // If payment is successful, add credits to the user
      let creditsAdded = false;
      if (payment.status === "paid") {
        // Try to find the user from the payment metadata
        if (payment.metadata?.user_id) {
          const userId = payment.metadata.user_id;
          
          // Add credits to the user
          const { data, error } = await supabaseAdmin.rpc("add_user_credits", {
            user_id_param: userId,
            credits_to_add: 10, // 10 credits for one-time payment
          });
          
          if (error) {
            console.error("Error adding credits:", error);
          } else {
            console.log(`Added 10 credits to user ${userId}`);
            creditsAdded = true;
          }
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          payment: {
            id: payment.id,
            status: payment.status,
            amount: payment.amount,
          },
          isProcessed: payment.status === "paid",
          creditsAdded,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (mollieError) {
      console.error("Mollie API error:", mollieError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Mollie API error: ${mollieError.message || mollieError}` 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error("General error in check payment:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `General error: ${error.message || error}` 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

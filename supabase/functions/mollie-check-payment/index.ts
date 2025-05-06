
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import createMollieClient from "https://esm.sh/@mollie/api-client@3.7.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Helper for detailed logging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[MOLLIE-CHECK-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  logStep("Function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const mollieApiKey = Deno.env.get("MOLLIE_API_KEY");
    if (!mollieApiKey) {
      logStep("Error: MOLLIE_API_KEY is not configured");
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
      logStep("Request body parsed", requestBody);
    } catch (error) {
      logStep("Error parsing request body", { error });
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
      logStep("Error: Payment ID is required");
      return new Response(
        JSON.stringify({ success: false, error: "Payment ID is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    logStep(`Checking payment ID: ${paymentId}`);

    try {
      // Get the payment details from Mollie
      const payment = await mollie.payments.get(paymentId);
      logStep(`Payment status: ${payment.status}`, { 
        id: payment.id, 
        amount: payment.amount,
        metadata: payment.metadata
      });
      
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
          logStep(`Payment successful, adding credits to user: ${userId}`);
          
          // Add credits to the user
          const { data, error } = await supabaseAdmin.rpc("add_user_credits", {
            user_id_param: userId,
            credits_to_add: 10, // 10 credits for one-time payment
          });
          
          if (error) {
            logStep("Error adding credits", { error });
          } else {
            logStep(`Added 10 credits to user ${userId}`, data);
            creditsAdded = true;
          }
        } else {
          logStep("Payment successful but no user_id in metadata", payment.metadata);
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
      logStep("Mollie API error", { error: mollieError.message || mollieError });
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
    logStep("General error", { error: error.message || error });
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

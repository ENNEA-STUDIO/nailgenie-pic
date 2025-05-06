
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import createMollieClient from "https://esm.sh/@mollie/api-client@3.7.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const mollieApiKey = Deno.env.get("MOLLIE_API_KEY");
    if (!mollieApiKey) {
      throw new Error("MOLLIE_API_KEY is not configured");
    }

    // Initialize Mollie client
    const mollie = createMollieClient({ apiKey: mollieApiKey });

    // Get the payment ID from the request
    const { paymentId } = await req.json();
    if (!paymentId) {
      throw new Error("Payment ID is required");
    }

    // Get the payment details from Mollie
    const payment = await mollie.payments.get(paymentId);
    
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
    if (payment.status === "paid") {
      // Find the user by customer ID
      const { data: userData } = await supabaseAdmin.auth
        .admin
        .listUsers();
        
      // Find the user by email
      const user = userData?.users.find(u => {
        const customerInfo = payment.metadata?.customer_id || payment.customerId;
        return customerInfo && customerInfo.includes(u.email);
      });
      
      if (user) {
        // Add credits to the user
        await supabaseAdmin.rpc("add_user_credits", {
          user_id_param: user.id,
          credits_to_add: 10, // 10 credits for one-time payment
        });
        
        console.log(`Added 10 credits to user ${user.id}`);
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
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error checking payment:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

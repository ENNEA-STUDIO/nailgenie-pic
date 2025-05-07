import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Helper for detailed logging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[MOLLIE-CHECK-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  logStep("Function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // const mollieApiKey = "test_rbBTTvzQwFaGkDsa3NUt2wHh5CAzzN";
    const mollieApiKey = Deno.env.get("MOLLIE_API_KEY");
    if (!mollieApiKey) {
      logStep("Error: MOLLIE_API_KEY is not configured");
      return new Response(
        JSON.stringify({
          success: false,
          error: "MOLLIE_API_KEY is not configured",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

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
      const mollieRes = await fetch(
        `https://api.mollie.com/v2/payments/${paymentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${mollieApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!mollieRes.ok) {
        const err = await mollieRes.text();
        logStep("Mollie API error", { error: err });
        return new Response(
          JSON.stringify({ success: false, error: `Mollie API error: ${err}` }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
      const payment = await mollieRes.json();
      logStep("Payment object from Mollie", payment);
      logStep(`Payment status: ${payment.status}`, {
        id: payment.id,
        amount: payment.amount,
        metadata: payment.metadata,
      });

      return new Response(
        JSON.stringify({
          success: true,
          payment,
          isProcessed: payment.status === "paid",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (mollieError) {
      logStep("Mollie API error", {
        error: mollieError.message || mollieError,
      });
      return new Response(
        JSON.stringify({
          success: false,
          error: `Mollie API error: ${mollieError.message || mollieError}`,
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
        error: `General error: ${error.message || error}`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

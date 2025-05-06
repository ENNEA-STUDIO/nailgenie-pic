
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import createMollieClient from "https://esm.sh/@mollie/api-client@3.7.0";

// This endpoint needs to be public, no authentication required
serve(async (req) => {
  try {
    const mollieApiKey = Deno.env.get("MOLLIE_API_KEY");
    if (!mollieApiKey) {
      throw new Error("MOLLIE_API_KEY is not configured");
    }

    // Initialize Mollie client
    const mollie = createMollieClient({ apiKey: mollieApiKey });
    
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

    // Parse the webhook data
    const formData = await req.formData();
    const id = formData.get("id") as string;
    
    if (!id) {
      throw new Error("No ID provided in webhook");
    }
    
    console.log(`Webhook called for ID: ${id}`);

    // Handle webhook
    if (id.startsWith("tr_")) {
      // This is a payment
      const payment = await mollie.payments.get(id);
      console.log(`Payment status: ${payment.status}`);
    } else if (id.startsWith("sub_")) {
      // This is a subscription
      // Get the customer ID from the subscription
      const subscription = await mollie.customers_subscriptions.get(id);
      console.log(`Subscription status: ${subscription.status}`);
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
});

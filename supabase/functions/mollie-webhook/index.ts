
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

    // Check if this is a payment or subscription
    if (id.startsWith("tr_")) {
      // This is a payment
      const payment = await mollie.payments.get(id);
      console.log(`Payment status: ${payment.status}`);
      
      if (payment.status === "paid") {
        // Find the user by customer ID
        const { data: subscriptionData, error: subscriptionError } = await supabaseAdmin
          .from("user_subscriptions")
          .select("user_id")
          .eq("provider", "mollie")
          .eq("provider_id", payment.customerId)
          .maybeSingle();
          
        if (subscriptionError) {
          console.error("Error finding user:", subscriptionError);
          return new Response("Error processing webhook", { status: 500 });
        }
        
        // If we found the user, add credits
        if (subscriptionData?.user_id) {
          await supabaseAdmin.rpc("add_user_credits", {
            user_id_param: subscriptionData.user_id,
            credits_to_add: 10, // 10 credits for one-time payment
          });
          
          console.log(`Added 10 credits to user ${subscriptionData.user_id}`);
        } else {
          console.error("Could not find user for customer ID:", payment.customerId);
        }
      }
    } else if (id.startsWith("sub_")) {
      // This is a subscription
      const subscription = await mollie.customers_subscriptions.get(id);
      console.log(`Subscription status: ${subscription.status}`);
      
      // Update the subscription status in our database
      const { error } = await supabaseAdmin
        .from("user_subscriptions")
        .update({
          status: subscription.status,
          current_period_end: subscription.nextPaymentDate,
        })
        .eq("provider", "mollie")
        .eq("provider_id", subscription.id);
        
      if (error) {
        console.error("Error updating subscription:", error);
      }
    }

    // Always respond with 200 to acknowledge receipt
    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
});

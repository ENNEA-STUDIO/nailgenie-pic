
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

    // Handle webhook based on ID type
    if (id.startsWith("tr_")) {
      // This is a payment
      const payment = await mollie.payments.get(id);
      console.log(`Payment status: ${payment.status}`);
      
      if (payment.status === "paid") {
        console.log(`Payment was successful for ID: ${id}`);
        console.log("Payment metadata:", payment.metadata);
        
        // For one-time payments, we need to find the user from metadata or customerId
        if (payment.metadata && payment.metadata.user_id) {
          // If we included user_id in metadata
          const userId = payment.metadata.user_id;
          console.log(`Adding credits to user ID from metadata: ${userId}`);
          
          await supabaseAdmin.rpc("add_user_credits", {
            user_id_param: userId,
            credits_to_add: 10, // 10 credits for one-time payment
          });
          
          console.log(`Added 10 credits to user ${userId}`);
        } 
        else if (payment.customerId) {
          // Try to find the user by searching for the customer ID in subscription records
          console.log(`Looking up user by Mollie customer ID: ${payment.customerId}`);
          
          const { data: subscriptionData, error: subscriptionError } = await supabaseAdmin
            .from("user_subscriptions")
            .select("user_id")
            .eq("provider", "mollie")
            .eq("customer_id", payment.customerId)
            .maybeSingle();
            
          if (subscriptionError) {
            console.error("Error finding user:", subscriptionError);
          } else if (subscriptionData?.user_id) {
            console.log(`Found user ${subscriptionData.user_id} by customer ID`);
            
            await supabaseAdmin.rpc("add_user_credits", {
              user_id_param: subscriptionData.user_id,
              credits_to_add: 10, // 10 credits for one-time payment
            });
            
            console.log(`Added 10 credits to user ${subscriptionData.user_id}`);
          } else {
            console.log(`Could not find user for customer ID: ${payment.customerId}`);
          }
        }
      }
    } 
    else if (id.startsWith("sub_")) {
      // This is a subscription event
      const subscription = await mollie.customers_subscriptions.get(id);
      console.log(`Subscription ID: ${id}, status: ${subscription.status}`);
      
      // Get the customer ID from the subscription
      const customerId = subscription.customerId;
      
      // Find the user by the subscription ID
      const { data: subscriptionData, error: subscriptionError } = await supabaseAdmin
        .from("user_subscriptions")
        .select("user_id")
        .eq("provider", "mollie")
        .eq("provider_id", id)
        .maybeSingle();
        
      if (subscriptionError) {
        console.error("Error finding subscription:", subscriptionError);
      } else if (subscriptionData?.user_id) {
        console.log(`Found user ${subscriptionData.user_id} for subscription ${id}`);
        
        // Update the subscription status
        const { error: updateError } = await supabaseAdmin
          .from("user_subscriptions")
          .update({
            status: subscription.status,
            current_period_end: subscription.nextPaymentDate,
            updated_at: new Date().toISOString()
          })
          .eq("provider", "mollie")
          .eq("provider_id", id);
          
        if (updateError) {
          console.error("Error updating subscription:", updateError);
        } else {
          console.log(`Updated subscription status to ${subscription.status}`);
          
          // If subscription becomes active, add credits
          if (subscription.status === "active") {
            await supabaseAdmin.rpc("add_user_credits", {
              user_id_param: subscriptionData.user_id,
              credits_to_add: 1000000, // Unlimited credits for subscription
            });
            
            console.log(`Added unlimited credits to user ${subscriptionData.user_id}`);
          }
        }
      } else {
        console.log(`Could not find user for subscription ID: ${id}`);
      }
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
});


import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import createMollieClient from "https://esm.sh/@mollie/api-client@3.7.0";

// This endpoint needs to be public, no authentication required
serve(async (req) => {
  console.log("express-webhook function called");
  
  try {
    const mollieApiKey = Deno.env.get("MOLLIE_API_KEY");
    if (!mollieApiKey) {
      console.error("MOLLIE_API_KEY is not configured");
      return new Response("Configuration error", { status: 500 });
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
    let formData;
    try {
      formData = await req.formData();
    } catch (error) {
      console.error("Error parsing form data:", error);
      return new Response("Error parsing webhook data", { status: 400 });
    }
    
    const id = formData.get("id") as string;
    
    console.log("Webhook data:", Object.fromEntries(formData.entries()));
    
    if (!id) {
      console.error("No ID provided in webhook");
      return new Response("No ID provided", { status: 400 });
    }
    
    console.log(`Webhook called for ID: ${id}`);

    // Handle webhook based on ID type
    if (id.startsWith("tr_")) {
      // This is a payment
      try {
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
            
            const { data, error } = await supabaseAdmin.rpc("add_user_credits", {
              user_id_param: userId,
              credits_to_add: 10, // 10 credits for one-time payment
            });
            
            if (error) {
              console.error("Error adding credits:", error);
            } else {
              console.log(`Added 10 credits to user ${userId}`, data);
            }
          } 
          else if (payment.customerId) {
            // Try to find the user by searching for the customer ID in subscription records
            console.log(`Looking up user by Mollie customer ID: ${payment.customerId}`);
            
            const { data: subscriptionData, error: subscriptionError } = await supabaseAdmin
              .from("user_subscriptions")
              .select("user_id")
              .eq("customer_id", payment.customerId)
              .maybeSingle();
              
            if (subscriptionError) {
              console.error("Error finding user:", subscriptionError);
            } else if (subscriptionData?.user_id) {
              console.log(`Found user ${subscriptionData.user_id} by customer ID`);
              
              const { data, error } = await supabaseAdmin.rpc("add_user_credits", {
                user_id_param: subscriptionData.user_id,
                credits_to_add: 10, // 10 credits for one-time payment
              });
              
              if (error) {
                console.error("Error adding credits:", error);
              } else {
                console.log(`Added 10 credits to user ${subscriptionData.user_id}`, data);
              }
            } else {
              console.log(`Could not find user for customer ID: ${payment.customerId}`);
            }
          }
        }
      } catch (error) {
        console.error("Error processing payment webhook:", error);
        return new Response(`Error processing payment: ${error.message}`, { status: 500 });
      }
    } 
    else if (id.startsWith("sub_")) {
      // This is a subscription event
      try {
        // Extract customerId from ID
        // Format is typically sub_customerId_subscriptionNumber
        const parts = id.split('_');
        if (parts.length < 2) {
          console.error(`Invalid subscription ID format: ${id}`);
          return new Response("Invalid subscription ID format", { status: 400 });
        }
        
        const customerId = parts[1];
        console.log(`Extracted customer ID: ${customerId}`);
        
        const subscription = await mollie.customers_subscriptions.get(id, { customerId });
        console.log(`Subscription ID: ${id}, status: ${subscription.status}`);
        
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
              const { data, error } = await supabaseAdmin.rpc("add_user_credits", {
                user_id_param: subscriptionData.user_id,
                credits_to_add: 1000000, // Unlimited credits for subscription
              });
              
              if (error) {
                console.error("Error adding unlimited credits:", error);
              } else {
                console.log(`Added unlimited credits to user ${subscriptionData.user_id}`, data);
              }
            }
          }
        } else {
          console.log(`Could not find user for subscription ID: ${id}`);
        }
      } catch (error) {
        console.error("Error processing subscription webhook:", error);
        return new Response(`Error processing subscription: ${error.message}`, { status: 500 });
      }
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
});

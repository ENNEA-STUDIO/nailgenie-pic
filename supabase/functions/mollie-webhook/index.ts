
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import createMollieClient from "https://esm.sh/@mollie/api-client@3.7.0";

// Helper for detailed logging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[MOLLIE-WEBHOOK] ${step}${detailsStr}`);
};

// This endpoint needs to be public, no authentication required
serve(async (req) => {
  logStep("Function called");
  
  try {
    const mollieApiKey = Deno.env.get("MOLLIE_API_KEY");
    if (!mollieApiKey) {
      logStep("Error: MOLLIE_API_KEY is not configured");
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
      logStep("Form data parsed", Object.fromEntries(formData.entries()));
    } catch (error) {
      logStep("Error parsing form data, trying JSON", { error });
      try {
        const jsonData = await req.json();
        logStep("Received JSON webhook data", jsonData);
        if (jsonData.id) {
          formData = new FormData();
          formData.append("id", jsonData.id);
        } else {
          return new Response("Invalid webhook data", { status: 400 });
        }
      } catch (jsonError) {
        logStep("Error parsing JSON data", { error: jsonError });
        return new Response("Error parsing webhook data", { status: 400 });
      }
    }
    
    const id = formData.get("id") as string;
    
    if (!id) {
      logStep("Error: No ID provided in webhook");
      return new Response("No ID provided", { status: 400 });
    }
    
    logStep(`Webhook called for ID: ${id}`);

    // Handle webhook based on ID type
    if (id.startsWith("tr_")) {
      // This is a payment
      try {
        const payment = await mollie.payments.get(id);
        logStep(`Payment status: ${payment.status}`, { metadata: payment.metadata });
        
        if (payment.status === "paid") {
          logStep(`Payment was successful for ID: ${id}`);
          
          // For one-time payments, we need to find the user from metadata or customerId
          if (payment.metadata && payment.metadata.user_id) {
            // If we included user_id in metadata
            const userId = payment.metadata.user_id;
            logStep(`Adding credits to user ID from metadata: ${userId}`);
            
            const { data, error } = await supabaseAdmin.rpc("add_user_credits", {
              user_id_param: userId,
              credits_to_add: 10, // 10 credits for one-time payment
            });
            
            if (error) {
              logStep("Error adding credits", { error });
            } else {
              logStep(`Added 10 credits to user ${userId}`, data);
            }
            
            // If this is a subscription payment, handle it specially
            if (payment.metadata.is_subscription) {
              logStep("This is a subscription payment, setting up subscription");
              
              try {
                if (!payment.customerId) {
                  logStep("Error: Customer ID not found in payment");
                } else {
                  // Create a subscription
                  const subscription = await mollie.customers_subscriptions.create({
                    customerId: payment.customerId,
                    amount: { currency: "EUR", value: "8.99" },
                    interval: "1 month",
                    description: "GeNails Unlimited Monthly Subscription",
                    webhookUrl: "https://yvtdpfampfndlnjqoocm.supabase.co/functions/v1/mollie-webhook",
                    metadata: {
                      user_id: userId,
                    },
                  });
                  
                  logStep(`Created subscription with ID: ${subscription.id}`);
  
                  // Record the subscription in the database
                  const { error: subscriptionError } = await supabaseAdmin
                    .from("user_subscriptions")
                    .insert({
                      user_id: userId,
                      provider: "mollie",
                      provider_id: subscription.id,
                      customer_id: payment.customerId,
                      status: subscription.status,
                      price_id: "mollie_unlimited_monthly",
                      current_period_end: subscription.nextPaymentDate,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    });
  
                  if (subscriptionError) {
                    logStep("Error recording subscription", { error: subscriptionError });
                  } else {
                    logStep("Subscription recorded in database");
                  }
                  
                  // Give unlimited credits for subscription users
                  const { error: unlimitedError } = await supabaseAdmin.rpc("add_user_credits", {
                    user_id_param: userId,
                    credits_to_add: 1000000 // High number for "unlimited" 
                  });
                  
                  if (unlimitedError) {
                    logStep("Error adding unlimited credits", { error: unlimitedError });
                  } else {
                    logStep(`Added unlimited credits to subscription user ${userId}`);
                  }
                }
              } catch (subscriptionError) {
                logStep("Error creating subscription", { error: subscriptionError });
              }
            }
          } 
          else if (payment.customerId) {
            // Try to find the user by searching for the customer ID in subscription records
            logStep(`Looking up user by Mollie customer ID: ${payment.customerId}`);
            
            const { data: subscriptionData, error: subscriptionError } = await supabaseAdmin
              .from("user_subscriptions")
              .select("user_id")
              .eq("customer_id", payment.customerId)
              .maybeSingle();
              
            if (subscriptionError) {
              logStep("Error finding user", { error: subscriptionError });
            } else if (subscriptionData?.user_id) {
              logStep(`Found user ${subscriptionData.user_id} by customer ID`);
              
              const { data, error } = await supabaseAdmin.rpc("add_user_credits", {
                user_id_param: subscriptionData.user_id,
                credits_to_add: 10, // 10 credits for one-time payment
              });
              
              if (error) {
                logStep("Error adding credits", { error });
              } else {
                logStep(`Added 10 credits to user ${subscriptionData.user_id}`, data);
              }
            } else {
              logStep(`Could not find user for customer ID: ${payment.customerId}`);
            }
          }
        }
        
        return new Response("Webhook processed successfully", { status: 200 });
      } catch (error) {
        logStep("Error processing payment webhook", { error });
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
          logStep(`Invalid subscription ID format: ${id}`);
          return new Response("Invalid subscription ID format", { status: 400 });
        }
        
        const customerId = parts[1];
        logStep(`Extracted customer ID: ${customerId}`);
        
        const subscription = await mollie.customers_subscriptions.get(id, { customerId });
        logStep(`Subscription ID: ${id}, status: ${subscription.status}`);
        
        // Find the user by the subscription ID
        const { data: subscriptionData, error: subscriptionError } = await supabaseAdmin
          .from("user_subscriptions")
          .select("user_id")
          .eq("provider", "mollie")
          .eq("provider_id", id)
          .maybeSingle();
          
        if (subscriptionError) {
          logStep("Error finding subscription", { error: subscriptionError });
        } else if (subscriptionData?.user_id) {
          logStep(`Found user ${subscriptionData.user_id} for subscription ${id}`);
          
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
            logStep("Error updating subscription", { error: updateError });
          } else {
            logStep(`Updated subscription status to ${subscription.status}`);
            
            // If subscription becomes active, add credits
            if (subscription.status === "active") {
              const { data, error } = await supabaseAdmin.rpc("add_user_credits", {
                user_id_param: subscriptionData.user_id,
                credits_to_add: 1000000, // Unlimited credits for subscription
              });
              
              if (error) {
                logStep("Error adding unlimited credits", { error });
              } else {
                logStep(`Added unlimited credits to user ${subscriptionData.user_id}`, data);
              }
            }
          }
        } else {
          logStep(`Could not find user for subscription ID: ${id}`);
        }
        
        return new Response("Webhook processed successfully", { status: 200 });
      } catch (error) {
        logStep("Error processing subscription webhook", { error });
        return new Response(`Error processing subscription: ${error.message}`, { status: 500 });
      }
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    logStep("General error", { error: error.message || error });
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
});

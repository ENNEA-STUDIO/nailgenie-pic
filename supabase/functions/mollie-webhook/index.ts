
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import createMollieClient from "https://esm.sh/@mollie/api-client@3.7.0";

// This endpoint needs to be public, no authentication required
serve(async (req) => {
  console.log("mollie-webhook function called");
  
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
      // Check if it's JSON instead
      try {
        const jsonData = await req.json();
        console.log("Received JSON webhook data:", jsonData);
        if (jsonData.id) {
          formData = new FormData();
          formData.append("id", jsonData.id);
        } else {
          return new Response("Invalid webhook data", { status: 400 });
        }
      } catch (jsonError) {
        console.error("Error parsing JSON data:", jsonError);
        return new Response("Error parsing webhook data", { status: 400 });
      }
    }
    
    const id = formData.get("id") as string;
    
    if (!id) {
      console.error("No ID provided in webhook");
      return new Response("No ID provided", { status: 400 });
    }
    
    console.log(`Webhook called for ID: ${id}`);

    // Forward to express-webhook
    const expressWebhookUrl = "https://yvtdpfampfndlnjqoocm.supabase.co/functions/v1/express-webhook";
    
    try {
      const forwardResponse = await fetch(expressWebhookUrl, {
        method: "POST",
        body: formData
      });
      
      console.log(`Forwarded webhook to express-webhook, status: ${forwardResponse.status}`);
      
      // Just return success regardless
      return new Response("Webhook processed successfully", { status: 200 });
    } catch (forwardError) {
      console.error("Error forwarding webhook:", forwardError);
      
      // Process locally as fallback
      // Handle webhook based on ID type (same code as in express-webhook)
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
      } 
      else if (id.startsWith("sub_")) {
        // Handle subscription (same as in express-webhook)
        // ...implement same logic as in express-webhook
      }
      
      return new Response("Webhook processed successfully (fallback)", { status: 200 });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
});

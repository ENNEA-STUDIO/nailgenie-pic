
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Helper function for logging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PAYMENT-SUCCESS] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client with service role key to bypass RLS
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  try {
    // Get session_id from the request body
    const { session_id } = await req.json();
    logStep("Processing session", { session_id });

    if (!session_id) {
      throw new Error("Session ID is required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription'] // Expand subscription data to get all details
    });
    
    logStep("Session retrieved", { 
      payment_status: session.payment_status,
      mode: session.mode, 
      customer: session.customer,
      has_subscription: !!session.subscription 
    });

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    const userId = session.metadata?.userId;
    if (!userId) {
      throw new Error("User ID not found in session metadata");
    }

    // Check if this was a subscription or one-time payment
    const mode = session.mode;
    logStep("Payment mode", { mode });
    
    if (mode === 'subscription') {
      // For subscriptions, we need to store the subscription details
      const subscriptionId = typeof session.subscription === 'string' 
        ? session.subscription 
        : session.subscription?.id;
      
      if (!subscriptionId) {
        throw new Error("Subscription ID not found");
      }
      
      // Get the full subscription details
      const subscription = typeof session.subscription === 'object'
        ? session.subscription
        : await stripe.subscriptions.retrieve(subscriptionId);
      
      logStep("Subscription details", { 
        id: subscription.id,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end
      });
      
      // Check if we need to create a user_subscriptions table first
      await supabaseClient.rpc("create_subscription_table");
      
      // Extract price ID from the subscription
      const priceId = subscription.items.data[0].price.id;
      
      // Insert or update the subscription record
      const { error } = await supabaseClient
        .from("user_subscriptions")
        .upsert({
          user_id: userId,
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id,
          status: subscription.status,
          price_id: priceId,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });
          
      if (error) {
        logStep("Error saving subscription", { error });
        throw error;
      }
      
      // For subscription users, also ensure they have high credit count
      const { error: creditError } = await supabaseClient.rpc("add_user_credits", {
        user_id_param: userId,
        credits_to_add: 1000000 // Set a high credit count for unlimited subscription users
      });
      
      if (creditError) {
        logStep("Warning: Error adding credits", { error: creditError });
      } else {
        logStep("Added credits for subscription user");
      }
      
      logStep("Subscription saved successfully");
    } else {
      // For one-time payments, add credits based on the price ID
      const lineItems = await stripe.checkout.sessions.listLineItems(session_id, { limit: 1 });
      const priceId = lineItems.data[0]?.price?.id;
      
      let creditsToAdd = 10; // Default for regular credit pack
      
      // Check if this is the premium credit pack
      if (priceId === 'price_1RDnGiGpMCOJlOLHek9KvjVv') {
        creditsToAdd = 100; // Premium pack gives 100 credits
      }
      
      logStep(`Adding credits`, { creditsToAdd, userId, priceId });
      
      const { error, data } = await supabaseClient.rpc("add_user_credits", {
        user_id_param: userId,
        credits_to_add: creditsToAdd,
      });
      
      if (error) {
        logStep("Error adding credits", { error });
        throw error;
      } else {
        logStep("Credits added successfully", { creditsToAdd });
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      mode: mode
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("Error processing payment success", { error: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

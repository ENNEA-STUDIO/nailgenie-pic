
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
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

    if (!session_id) {
      throw new Error("Session ID is required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    const userId = session.metadata?.userId;

    if (!userId) {
      throw new Error("User ID not found in session metadata");
    }

    console.log("Session details:", session);
    console.log("Processing payment for user:", userId);
    
    // Check if this was a subscription or one-time payment
    const mode = session.mode;
    console.log("Payment mode:", mode);
    
    if (mode === 'subscription') {
      // For subscriptions, we need to store the subscription details
      const subscriptionId = session.subscription as string;
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        // Check if we need to create a user_subscriptions table first
        await supabaseClient.rpc("create_subscription_table");
        
        // Insert or update the subscription record
        const { error } = await supabaseClient
          .from("user_subscriptions")
          .upsert({
            user_id: userId,
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: subscription.customer as string,
            status: subscription.status,
            price_id: subscription.items.data[0].price.id,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          });
          
        if (error) {
          console.error("Error saving subscription:", error);
          throw error;
        }
        
        console.log("Subscription saved successfully");
      }
    } else {
      // For one-time payments, add credits based on the price ID
      const lineItems = await stripe.checkout.sessions.listLineItems(session_id, { limit: 1 });
      const priceId = lineItems.data[0]?.price?.id;
      
      let creditsToAdd = 10; // Default for regular credit pack
      
      // Check if this is the premium credit pack
      if (priceId === 'price_1RDnGiGpMCOJlOLHek9KvjVv') {
        creditsToAdd = 100; // Premium pack gives 100 credits
      }
      
      console.log(`Adding ${creditsToAdd} credits to user ${userId} for price ${priceId}`);
      
      const { error, data } = await supabaseClient.rpc("add_user_credits", {
        user_id_param: userId,
        credits_to_add: creditsToAdd,
      });
      console.log("RPC response:", { error, data });
      
      if (error) {
        throw error;
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
    console.error("Error processing payment success:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

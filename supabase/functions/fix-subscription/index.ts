
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
  console.log(`[FIX-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({ error: "Missing Supabase configuration" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // Use the service role key to bypass RLS
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  try {
    const { email, priceId, subscriptionId, customerId } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    logStep("Processing request for", { email, subscriptionId, priceId });

    // Find the user
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) {
      throw new Error(`Error fetching users: ${userError.message}`);
    }

    const user = userData.users.find(u => u.email === email);
    if (!user) {
      throw new Error(`User not found with email: ${email}`);
    }

    logStep("Found user", { id: user.id });

    // Set default values if not provided
    const finalPriceId = priceId || "price_1RDnGiGpMCOJlOLHek9KvjVv";
    const finalSubscriptionId = subscriptionId || `manual_${Date.now()}`;
    const finalCustomerId = customerId || `cus_manual_${Date.now()}`;

    // Calculate subscription end date (default to 1 year from now)
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);

    // Ensure subscription_table exists (this function should be defined in your Supabase)
    await supabase.rpc("create_subscription_table");

    // Insert or update the subscription record
    const { data: subData, error: subError } = await supabase
      .from("user_subscriptions")
      .upsert({
        user_id: user.id,
        stripe_subscription_id: finalSubscriptionId,
        stripe_customer_id: finalCustomerId,
        status: "active",
        price_id: finalPriceId, 
        current_period_end: currentPeriodEnd.toISOString(),
        cancel_at_period_end: false,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

    if (subError) {
      throw new Error(`Error creating subscription: ${subError.message}`);
    }

    logStep("Subscription created successfully");

    // Also add credits to the user (ensure they have a high amount for unlimited)
    const { data: creditsData, error: creditsError } = await supabase.rpc("add_user_credits", {
      user_id_param: user.id,
      credits_to_add: 1000000
    });

    if (creditsError) {
      logStep("Warning: Could not add credits", { error: creditsError.message });
    } else {
      logStep("Added credits successfully");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Subscription created successfully", 
        user_id: user.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

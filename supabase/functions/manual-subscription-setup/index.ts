
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    // Parse the request body to get email
    const { email } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    console.log(`Setting up unlimited subscription for user: ${email}`);

    // First, get the user ID from the email
    const { data: userData, error: userError } = await supabaseClient
      .from("auth.users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      console.error("Error finding user:", userError);
      throw new Error(`User with email ${email} not found`);
    }

    const userId = userData.id;
    console.log(`Found user with ID: ${userId}`);

    // Calculate subscription end date (1 year from now)
    const currentDate = new Date();
    const oneYearLater = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
    
    // Create a dummy subscription record
    const { error: subscriptionError } = await supabaseClient
      .from("user_subscriptions")
      .upsert({
        user_id: userId,
        stripe_subscription_id: `manual_unlimited_${Date.now()}`,
        stripe_customer_id: `manual_customer_${Date.now()}`,
        status: "active",
        price_id: "price_1RDnGiGpMCOJlOLHek9KvjVv", // The unlimited subscription price ID
        current_period_end: oneYearLater.toISOString(),
        cancel_at_period_end: false,
      });

    if (subscriptionError) {
      console.error("Error setting up subscription:", subscriptionError);
      throw subscriptionError;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Unlimited subscription set up for ${email} until ${oneYearLater.toISOString()}` 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

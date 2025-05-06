
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import createMollieClient from "https://esm.sh/@mollie/api-client@3.7.0";

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

  try {
    const mollieApiKey = Deno.env.get("MOLLIE_API_KEY");
    if (!mollieApiKey) {
      throw new Error("MOLLIE_API_KEY is not configured");
    }

    // Initialize Mollie client
    const mollie = createMollieClient({ apiKey: mollieApiKey });

    // Retrieve authenticated user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }

    const { name, cardToken } = await req.json();

    console.log(`Setting up subscription for user ${user.id} with email ${user.email}`);

    // 1. Create or retrieve customer
    let customerId;
    const customers = await mollie.customers.page({ limit: 10 });
    const existingCustomer = customers.find(customer => customer.email === user.email);
    
    if (existingCustomer) {
      customerId = existingCustomer.id;
      console.log(`Found existing customer with ID: ${customerId}`);
    } else {
      const customer = await mollie.customers.create({
        name: name || user.email.split("@")[0],
        email: user.email
      });
      customerId = customer.id;
      console.log(`Created new customer with ID: ${customerId}`);
    }

    // 2. Create mandate (creditcard)
    const mandate = await mollie.customers_mandates.create({
      customerId,
      method: "creditcard",
      cardToken
    });

    console.log(`Created mandate with status: ${mandate.status}`);

    if (mandate.status !== "valid") {
      throw new Error(`Invalid mandate status: ${mandate.status}`);
    }

    // 3. Create subscription
    const subscription = await mollie.customers_subscriptions.create({
      customerId,
      amount: { currency: "EUR", value: "8.99" },
      interval: "1 month",
      description: "GeNails Unlimited Designs Subscription",
      webhookUrl: `${req.headers.get("origin")}/api/webhook`,
    });

    console.log(`Created subscription with ID: ${subscription.id}`);

    // Create a record in the user_subscriptions table
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

    const { error: subscriptionError } = await supabaseAdmin
      .from("user_subscriptions")
      .insert({
        user_id: user.id,
        provider: "mollie",
        provider_id: subscription.id,
        status: "active",
        price_id: "unlimited_subscription",
        created_at: new Date().toISOString(),
        current_period_end: new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        ).toISOString(),
      });

    if (subscriptionError) {
      console.error("Error recording subscription:", subscriptionError);
    }

    // Add credits for the subscription
    await supabaseAdmin.rpc("add_user_credits", {
      user_id_param: user.id,
      credits_to_add: 1000000,
    });

    return new Response(
      JSON.stringify({
        success: true,
        subscription: subscription.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in setup subscription:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

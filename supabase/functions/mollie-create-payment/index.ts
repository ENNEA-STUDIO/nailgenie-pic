
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
    
    console.log(`Processing one-time payment for user ${user.id} with email ${user.email}`);

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

    // 2. Create payment
    const payment = await mollie.payments.create({
      amount: { currency: "EUR", value: "2.99" },
      description: "GeNails 10 Credits Pack",
      customerId,
      sequenceType: "first",
      redirectUrl: `${req.headers.get("origin")}/payment-success?payment_id={id}`,
      webhookUrl: `${req.headers.get("origin")}/api/webhook`,
      metadata: {
        user_id: user.id, // Include user ID in metadata for webhook processing
      }
    });

    console.log(`Created payment with ID: ${payment.id}`);

    // Return the payment URL for the frontend to redirect to
    return new Response(
      JSON.stringify({
        success: true,
        url: payment.getPaymentUrl(),
        paymentId: payment.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating payment:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

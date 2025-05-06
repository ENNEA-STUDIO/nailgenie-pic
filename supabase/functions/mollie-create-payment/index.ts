
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import createMollieClient from "https://esm.sh/@mollie/api-client@3.7.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("mollie-create-payment function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const mollieApiKey = Deno.env.get("MOLLIE_API_KEY");
    if (!mollieApiKey) {
      console.error("MOLLIE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ success: false, error: "MOLLIE_API_KEY is not configured" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Initialize Mollie client
    const mollie = createMollieClient({ apiKey: mollieApiKey });

    // Retrieve authenticated user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("Missing Authorization header");
      return new Response(
        JSON.stringify({ success: false, error: "Missing Authorization header" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      console.error("User authentication error:", userError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: userError?.message || "User not authenticated" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }
    
    const user = userData.user;
    
    if (!user?.email) {
      console.error("User email not available");
      return new Response(
        JSON.stringify({ success: false, error: "User email not available" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Parse the request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request body" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const { name } = requestBody;
    
    console.log(`Processing one-time payment for user ${user.id} with email ${user.email}`);

    // 1. Create or retrieve customer
    try {
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
      const webhookUrl = "https://yvtdpfampfndlnjqoocm.supabase.co/functions/v1/express-webhook";
      const origin = req.headers.get("origin") || "https://genails.app";
      
      const payment = await mollie.payments.create({
        amount: { currency: "EUR", value: "2.99" },
        description: "GeNails 10 Credits Pack",
        customerId,
        sequenceType: "first",
        redirectUrl: `${origin}/payment-success?payment_id={id}`,
        webhookUrl: webhookUrl,
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
    } catch (molliError) {
      console.error("Mollie API error:", molliError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Mollie API error: ${molliError.message || molliError}` 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error("General error in create payment:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `General error: ${error.message || error}` 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

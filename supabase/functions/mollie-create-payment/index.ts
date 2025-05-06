
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import createMollieClient from "https://esm.sh/@mollie/api-client@3.7.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Helper for detailed logging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[MOLLIE-CREATE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  logStep("Function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const mollieApiKey = Deno.env.get("MOLLIE_API_KEY");
    if (!mollieApiKey) {
      logStep("Error: MOLLIE_API_KEY is not configured");
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
      logStep("Error: Missing Authorization header");
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
      logStep("Error: User authentication failed", { error: userError });
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
      logStep("Error: User email not available");
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
      logStep("Request body parsed", requestBody);
    } catch (error) {
      logStep("Error parsing request body", { error });
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request body" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const { name, email } = requestBody;
    
    // Name is required
    if (!name || typeof name !== 'string' || name.trim() === '') {
      logStep("Error: Name is required");
      return new Response(
        JSON.stringify({ success: false, error: "Name is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 422,
        }
      );
    }
    
    const customerEmail = email || user.email;
    logStep(`Processing one-time payment for user ${user.id} with email ${customerEmail}`);

    // 1. Create or retrieve customer
    try {
      let customerId;
      try {
        // Try to find existing customer by email
        const customers = await mollie.customers.page({ limit: 50 });
        const existingCustomer = customers.find(customer => customer.email === customerEmail);
        
        if (existingCustomer) {
          customerId = existingCustomer.id;
          logStep(`Found existing customer with ID: ${customerId}`);
        } else {
          // Create new customer
          const customer = await mollie.customers.create({
            name: name.trim(),
            email: customerEmail
          });
          customerId = customer.id;
          logStep(`Created new customer with ID: ${customerId}`);
        }
      } catch (customerError) {
        logStep("Error in customer lookup/creation", { error: customerError });
        // Fall back to creating a new customer
        try {
          const customer = await mollie.customers.create({
            name: name.trim(),
            email: customerEmail
          });
          customerId = customer.id;
          logStep(`Created new customer as fallback with ID: ${customerId}`);
        } catch (fallbackError) {
          throw new Error(`Failed to create customer: ${fallbackError.message}`);
        }
      }

      // 2. Create payment
      const webhookUrl = "https://yvtdpfampfndlnjqoocm.supabase.co/functions/v1/mollie-webhook";
      const origin = req.headers.get("origin") || "https://genails.app";
      
      logStep("Creating payment", {
        amount: "2.99",
        description: "GeNails 10 Credits Pack",
        customerId,
        origin,
        webhookUrl
      });
      
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

      logStep(`Created payment with ID: ${payment.id}`, {
        paymentId: payment.id,
        paymentUrl: payment.getPaymentUrl()
      });

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
    } catch (mollieError) {
      logStep("Mollie API error", { error: mollieError.message || mollieError });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Mollie API error: ${mollieError.message || mollieError}` 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  } catch (error) {
    logStep("General error", { error: error.message || error });
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

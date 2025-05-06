
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import createMollieClient from "https://esm.sh/@mollie/api-client@3.7.0";

// Shared headers for CORS
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Helper for detailed logging across functions
export function logStep(functionName: string, step: string, details?: any) {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[${functionName.toUpperCase()}] ${step}${detailsStr}`);
}

// Initialize Mollie client
export function initializeMollie() {
  const mollieApiKey = Deno.env.get("MOLLIE_API_KEY");
  if (!mollieApiKey) {
    throw new Error("MOLLIE_API_KEY is not configured");
  }
  return createMollieClient({ apiKey: mollieApiKey });
}

// Initialize Supabase admin client
export function initializeSupabaseAdmin() {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// Initialize Supabase client from request
export function initializeSupabaseClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );
}

// Authenticate user from request
export async function authenticateUser(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    throw new Error("Missing Authorization header");
  }
  
  const token = authHeader.replace("Bearer ", "");
  const supabaseClient = initializeSupabaseClient();
  const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
  
  if (userError || !userData.user) {
    throw new Error(userError?.message || "User not authenticated");
  }
  
  return userData.user;
}

// Handle options requests for CORS
export function handleOptionsRequest() {
  return new Response(null, { headers: corsHeaders });
}

// Create an error response with proper headers
export function createErrorResponse(error: string, status: number = 400) {
  return new Response(
    JSON.stringify({ success: false, error }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

// Create a success response with proper headers
export function createSuccessResponse(data: any, status: number = 200) {
  return new Response(
    JSON.stringify({ success: true, ...data }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

// Create or retrieve customer
export async function getOrCreateCustomer(mollie: any, name: string, email: string) {
  try {
    // Try to find existing customer by email
    const customers = await mollie.customers.page({ limit: 50 });
    const existingCustomer = customers.find(customer => customer.email === email);
    
    if (existingCustomer) {
      return { customerId: existingCustomer.id, isNew: false };
    } else {
      // Create new customer
      const customer = await mollie.customers.create({
        name: name.trim(),
        email
      });
      return { customerId: customer.id, isNew: true };
    }
  } catch (customerError) {
    // Fall back to creating a new customer
    try {
      const customer = await mollie.customers.create({
        name: name.trim(),
        email
      });
      return { customerId: customer.id, isNew: true };
    } catch (fallbackError) {
      throw new Error(`Failed to create customer: ${fallbackError.message}`);
    }
  }
}

// Process webhook for payment
export async function processPaymentWebhook(mollie: any, supabaseAdmin: any, payment: any) {
  if (payment.status === "paid") {
    // For one-time payments, find the user from metadata or customerId
    if (payment.metadata && payment.metadata.user_id) {
      // If we included user_id in metadata
      const userId = payment.metadata.user_id;
      
      // Add credits to the user
      const { error } = await supabaseAdmin.rpc("add_user_credits", {
        user_id_param: userId,
        credits_to_add: 10, // 10 credits for one-time payment
      });
      
      if (error) {
        throw new Error(`Error adding credits: ${error.message}`);
      }
      
      // If this is a subscription payment, handle it specially
      if (payment.metadata.is_subscription) {
        // Create a subscription
        if (!payment.customerId) {
          throw new Error("Customer ID not found in payment");
        }
        
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
          throw new Error(`Error recording subscription: ${subscriptionError.message}`);
        }
        
        // Give unlimited credits for subscription users
        const { error: unlimitedError } = await supabaseAdmin.rpc("add_user_credits", {
          user_id_param: userId,
          credits_to_add: 1000000 // High number for "unlimited" 
        });
        
        if (unlimitedError) {
          throw new Error(`Error adding unlimited credits: ${unlimitedError.message}`);
        }
      }
      
      return true;
    } 
    else if (payment.customerId) {
      // Try to find the user by searching for the customer ID in subscription records
      const { data: subscriptionData, error: subscriptionError } = await supabaseAdmin
        .from("user_subscriptions")
        .select("user_id")
        .eq("customer_id", payment.customerId)
        .maybeSingle();
        
      if (subscriptionError) {
        throw new Error(`Error finding user: ${subscriptionError.message}`);
      } 
      else if (subscriptionData?.user_id) {
        // Add credits to the user
        const { error } = await supabaseAdmin.rpc("add_user_credits", {
          user_id_param: subscriptionData.user_id,
          credits_to_add: 10,
        });
        
        if (error) {
          throw new Error(`Error adding credits: ${error.message}`);
        }
        
        return true;
      }
    }
  }
  
  return false;
}

// Process webhook for subscription
export async function processSubscriptionWebhook(mollie: any, supabaseAdmin: any, id: string) {
  // Extract customerId from ID
  const parts = id.split('_');
  if (parts.length < 2) {
    throw new Error(`Invalid subscription ID format: ${id}`);
  }
  
  const customerId = parts[1];
  const subscription = await mollie.customers_subscriptions.get(id, { customerId });
  
  // Find the user by the subscription ID
  const { data: subscriptionData, error: subscriptionError } = await supabaseAdmin
    .from("user_subscriptions")
    .select("user_id")
    .eq("provider", "mollie")
    .eq("provider_id", id)
    .maybeSingle();
    
  if (subscriptionError) {
    throw new Error(`Error finding subscription: ${subscriptionError.message}`);
  } 
  else if (subscriptionData?.user_id) {
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
      throw new Error(`Error updating subscription: ${updateError.message}`);
    }
    
    // If subscription becomes active, add credits
    if (subscription.status === "active") {
      const { error } = await supabaseAdmin.rpc("add_user_credits", {
        user_id_param: subscriptionData.user_id,
        credits_to_add: 1000000, // Unlimited credits for subscription
      });
      
      if (error) {
        throw new Error(`Error adding unlimited credits: ${error.message}`);
      }
    }
    
    return true;
  }
  
  return false;
}

// Create a new payment with card token
export async function createPayment(mollie: any, customerId: string, cardToken: string, amount: string, description: string, metadata: any) {
  try {
    const payment = await mollie.customers_payments.create({
      customerId: customerId,
      amount: { currency: "EUR", value: amount },
      description,
      method: "creditcard",
      cardToken: cardToken,
      metadata,
    });
    
    return payment;
  } catch (paymentError: any) {
    // Parse and return the exact Mollie error message if available
    let errorMessage = "Failed to process payment";
    if (paymentError && paymentError.details && paymentError.details.status) {
      errorMessage = `Payment error: ${paymentError.details.title || paymentError.details.status}`;
    } else if (paymentError.message) {
      errorMessage = paymentError.message;
    }
    
    throw new Error(errorMessage);
  }
}

// Add credits to user when payment is successful
export async function addCreditsToUser(supabaseAdmin: any, userId: string, credits: number) {
  const { error } = await supabaseAdmin.rpc("add_user_credits", {
    user_id_param: userId,
    credits_to_add: credits,
  });
  
  if (error) {
    throw new Error(`Error adding credits: ${error.message}`);
  }
}

// Parse webhook data from request
export async function parseWebhookData(req: Request) {
  try {
    const formData = await req.formData();
    return { formData, id: formData.get("id") as string };
  } catch (error) {
    try {
      const jsonData = await req.json();
      if (jsonData.id) {
        const formData = new FormData();
        formData.append("id", jsonData.id);
        return { formData, id: jsonData.id };
      } else {
        throw new Error("Invalid webhook data");
      }
    } catch (jsonError) {
      throw new Error("Error parsing webhook data");
    }
  }
}

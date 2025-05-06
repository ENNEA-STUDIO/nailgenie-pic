
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import {
  logStep,
  initializeMollie,
  initializeSupabaseAdmin,
  authenticateUser,
  handleOptionsRequest,
  createErrorResponse,
  createSuccessResponse,
  getOrCreateCustomer,
  createPayment,
  corsHeaders
} from "../_shared/mollie-utils.ts";

const FUNCTION_NAME = "mollie-setup-subscription";

serve(async (req) => {
  logStep(FUNCTION_NAME, "Function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return handleOptionsRequest();
  }

  try {
    // Initialize Mollie client
    const mollie = initializeMollie();

    // Initialize Supabase admin client
    const supabaseAdmin = initializeSupabaseAdmin();

    // Authenticate user
    let user;
    try {
      user = await authenticateUser(req);
    } catch (authError) {
      logStep(FUNCTION_NAME, "Authentication error", { error: authError.message });
      return createErrorResponse(authError.message, 401);
    }
    
    if (!user?.email) {
      logStep(FUNCTION_NAME, "Error: User email not available");
      return createErrorResponse("User email not available", 400);
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
      logStep(FUNCTION_NAME, "Request body parsed", requestBody);
    } catch (error) {
      logStep(FUNCTION_NAME, "Error parsing request body", { error });
      return createErrorResponse("Invalid request body", 400);
    }

    const { name, email, cardToken } = requestBody;
    
    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      logStep(FUNCTION_NAME, "Error: Name is required");
      return createErrorResponse("Name is required", 422);
    }

    if (!cardToken) {
      logStep(FUNCTION_NAME, "Error: Card token is required");
      return createErrorResponse("Card token is required", 422);
    }

    const customerEmail = email || user.email;
    logStep(FUNCTION_NAME, `Setting up subscription for user ${user.id} with email ${customerEmail}`);

    try {
      // Get or create customer
      const { customerId } = await getOrCreateCustomer(mollie, name, customerEmail);
      logStep(FUNCTION_NAME, `Using customer with ID: ${customerId}`);

      // Create the first payment for the subscription
      logStep(FUNCTION_NAME, "Creating initial payment for subscription with card token", {
        amount: "8.99",
        customerId,
        cardToken
      });
      
      const payment = await createPayment(
        mollie, 
        customerId, 
        cardToken, 
        "8.99", 
        "GeNails Unlimited Monthly Subscription", 
        { user_id: user.id, is_subscription: true }
      );

      logStep(FUNCTION_NAME, `Created initial payment with ID: ${payment.id}`);
      
      // Create subscription if payment was successful
      if (payment.status === "paid") {
        // First payment was successful, set up the recurring subscription
        logStep(FUNCTION_NAME, "Initial payment successful, creating subscription");
        
        const subscription = await mollie.customers_subscriptions.create({
          customerId,
          amount: { currency: "EUR", value: "8.99" },
          interval: "1 month",
          description: "GeNails Unlimited Monthly Subscription",
          webhookUrl: "https://yvtdpfampfndlnjqoocm.supabase.co/functions/v1/mollie-webhook",
          metadata: {
            user_id: user.id,
          },
        });
        
        logStep(FUNCTION_NAME, `Created subscription with ID: ${subscription.id}`);

        // Record the subscription in the database
        const { error: subscriptionError } = await supabaseAdmin
          .from("user_subscriptions")
          .insert({
            user_id: user.id,
            provider: "mollie",
            provider_id: subscription.id,
            customer_id: customerId,
            status: subscription.status,
            price_id: "mollie_unlimited_monthly",
            current_period_end: subscription.nextPaymentDate,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (subscriptionError) {
          logStep(FUNCTION_NAME, "Error recording subscription", { error: subscriptionError });
        } else {
          logStep(FUNCTION_NAME, "Subscription recorded in database");
        }
        
        // Add unlimited credits to the user
        const { error } = await supabaseAdmin.rpc("add_user_credits", {
          user_id_param: user.id,
          credits_to_add: 1000000, // Large number for "unlimited"
        });
        
        if (error) {
          logStep(FUNCTION_NAME, "Error adding credits", { error });
        } else {
          logStep(FUNCTION_NAME, `Added unlimited credits to user ${user.id}`);
        }
        
        return createSuccessResponse({
          status: "active",
          message: "Subscription active and credits added"
        });
      } else {
        // First payment requires additional steps
        logStep(FUNCTION_NAME, `Initial payment status is: ${payment.status}`);
        
        return createSuccessResponse({
          status: payment.status,
          paymentId: payment.id
        });
      }
    } catch (error) {
      logStep(FUNCTION_NAME, "Payment processing error", { error: error.message });
      return createErrorResponse(error.message, 400);
    }
  } catch (error) {
    logStep(FUNCTION_NAME, "General error", { error: error.message || error });
    return createErrorResponse(`General error: ${error.message || error}`, 500);
  }
});

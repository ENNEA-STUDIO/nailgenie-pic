
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
  addCreditsToUser,
  corsHeaders
} from "../_shared/mollie-utils.ts";

const FUNCTION_NAME = "mollie-create-payment";

serve(async (req) => {
  logStep(FUNCTION_NAME, "Function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return handleOptionsRequest();
  }

  try {
    // Initialize Mollie client
    const mollie = initializeMollie();
    
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
    logStep(FUNCTION_NAME, `Processing one-time payment for user ${user.id} with email ${customerEmail}`);

    try {
      // Get or create customer
      const { customerId } = await getOrCreateCustomer(mollie, name, customerEmail);
      logStep(FUNCTION_NAME, `Using customer with ID: ${customerId}`);

      // Create payment
      logStep(FUNCTION_NAME, "Creating payment with card token", {
        amount: "2.99",
        description: "GeNails 10 Credits Pack",
        customerId,
        cardToken
      });
      
      const payment = await createPayment(
        mollie, 
        customerId, 
        cardToken, 
        "2.99", 
        "GeNails 10 Credits Pack", 
        { user_id: user.id }
      );

      logStep(FUNCTION_NAME, `Created payment with ID: ${payment.id}`);

      // Check payment status
      if (payment.status === "paid") {
        logStep(FUNCTION_NAME, "Payment was immediately successful");
        
        // Add credits to the user
        const supabaseAdmin = initializeSupabaseAdmin();
        await addCreditsToUser(supabaseAdmin, user.id, 10);
        logStep(FUNCTION_NAME, `Added 10 credits to user ${user.id}`);
        
        return createSuccessResponse({
          status: "paid",
          message: "Payment successful and credits added",
        });
      } else {
        logStep(FUNCTION_NAME, `Payment status is: ${payment.status}`);
        
        // Return the payment status for the frontend to handle
        return createSuccessResponse({
          status: payment.status,
          paymentId: payment.id,
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

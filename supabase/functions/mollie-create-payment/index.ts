
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import {
  logStep,
  initializeMollie,
  initializeSupabaseAdmin,
  authenticateUser,
  handleOptionsRequest,
  createErrorResponse,
  createSuccessResponse,
  corsHeaders
} from "../_shared/mollie-utils.ts";

const FUNCTION_NAME = "mollie-create-payment";
const REDIRECT_URL = "https://genails.app/payment-success?product=credits";
const WEBHOOK_URL = "https://yvtdpfampfndlnjqoocm.supabase.co/functions/v1/mollie-webhook";

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
      logStep(FUNCTION_NAME, "User authenticated", { id: user.id });
    } catch (authError) {
      logStep(FUNCTION_NAME, "Authentication error", { error: authError.message });
      return createErrorResponse(authError.message, 401);
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

    const { name, email } = requestBody;
    
    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      logStep(FUNCTION_NAME, "Error: Name is required");
      return createErrorResponse("Name is required", 422);
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
      logStep(FUNCTION_NAME, "Error: Email is required");
      return createErrorResponse("Email is required", 422);
    }
    
    logStep(FUNCTION_NAME, `Processing one-time payment for user ${user.id}`);

    try {
      // Create payment directly on Mollie
      const payment = await mollie.payments.create({
        amount: { 
          currency: "EUR", 
          value: "2.99" 
        },
        description: "GeNails 10 Credits Pack",
        redirectUrl: REDIRECT_URL,
        webhookUrl: WEBHOOK_URL,
        metadata: { 
          user_id: user.id,
          product_type: "credits"
        }
      });
      
      logStep(FUNCTION_NAME, `Created payment with ID: ${payment.id}`);
      
      return createSuccessResponse({
        url: payment.getPaymentUrl(),
        paymentId: payment.id
      });
    } catch (error) {
      logStep(FUNCTION_NAME, "Payment creation error", { error: error.message });
      return createErrorResponse(`Error creating payment: ${error.message}`, 400);
    }
  } catch (error) {
    logStep(FUNCTION_NAME, "General error", { error: error.message || error });
    return createErrorResponse(`General error: ${error.message || error}`, 500);
  }
});


import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.22.4";
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

const FUNCTION_NAME = "mollie-setup-subscription";
const REDIRECT_URL = "https://genails.app/payment-success?product=subscription";
const WEBHOOK_URL = "https://yvtdpfampfndlnjqoocm.supabase.co/functions/v1/mollie-webhook";

// Input validation schema
const requestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
});

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
    
    // Validate input
    try {
      requestSchema.parse(requestBody);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        logStep(FUNCTION_NAME, "Validation error", { issues: validationError.issues });
        return createErrorResponse(
          `Validation error: ${validationError.issues.map(i => i.message).join(", ")}`, 
          422
        );
      }
      return createErrorResponse("Invalid input data", 422);
    }

    const { name, email } = requestBody;
    
    logStep(FUNCTION_NAME, `Setting up subscription for user ${user.id}`);
    
    try {
      // Create a first payment that will set up the subscription
      const firstPayment = await mollie.payments.create({
        amount: { 
          currency: "EUR", 
          value: "8.99" 
        },
        description: "GeNails Unlimited Monthly Subscription",
        redirectUrl: REDIRECT_URL,
        webhookUrl: WEBHOOK_URL,
        metadata: { 
          user_id: user.id,
          product_type: "subscription",
          is_first_payment: true,
          name,
          email
        },
        sequenceType: "first" // Mark this as first payment in a sequence
      });
      
      logStep(FUNCTION_NAME, `Created first payment with ID: ${firstPayment.id}`);
      
      return createSuccessResponse({
        success: true,
        url: firstPayment.getPaymentUrl(),
        paymentId: firstPayment.id
      });
    } catch (error) {
      logStep(FUNCTION_NAME, "Subscription setup error", { error: error.message });
      return createErrorResponse(`Error setting up subscription: ${error.message}`, 400);
    }
  } catch (error) {
    logStep(FUNCTION_NAME, "General error", { error: error.message || error });
    return createErrorResponse(`General error: ${error.message || error}`, 500);
  }
});

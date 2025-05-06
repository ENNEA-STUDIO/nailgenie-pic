
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import {
  logStep,
  initializeMollie,
  initializeSupabaseAdmin,
  parseWebhookData,
  processPaymentWebhook,
  processSubscriptionWebhook
} from "../_shared/mollie-utils.ts";

const FUNCTION_NAME = "mollie-webhook";

serve(async (req) => {
  logStep(FUNCTION_NAME, "Function called");
  
  try {
    // Initialize Mollie client
    const mollie = initializeMollie();
    
    // Initialize Supabase admin client
    const supabaseAdmin = initializeSupabaseAdmin();

    // Parse the webhook data
    let id: string;
    try {
      const { id: webhookId } = await parseWebhookData(req);
      id = webhookId;
      
      if (!id) {
        logStep(FUNCTION_NAME, "Error: No ID provided in webhook");
        return new Response("No ID provided", { status: 400 });
      }
    } catch (parseError) {
      logStep(FUNCTION_NAME, "Error parsing webhook data", { error: parseError });
      return new Response("Error parsing webhook data", { status: 400 });
    }
    
    logStep(FUNCTION_NAME, `Webhook called for ID: ${id}`);

    try {
      // Handle webhook based on ID type
      if (id.startsWith("tr_")) {
        // This is a payment webhook
        const payment = await mollie.payments.get(id);
        logStep(FUNCTION_NAME, `Payment status: ${payment.status}`, { metadata: payment.metadata });
        
        await processPaymentWebhook(mollie, supabaseAdmin, payment);
        return new Response("Webhook processed successfully", { status: 200 });
      } 
      else if (id.startsWith("sub_")) {
        // This is a subscription event webhook
        await processSubscriptionWebhook(mollie, supabaseAdmin, id);
        return new Response("Webhook processed successfully", { status: 200 });
      }

      return new Response("Webhook processed", { status: 200 });
    } catch (webhookError) {
      logStep(FUNCTION_NAME, `Error processing ${id.startsWith("tr_") ? "payment" : "subscription"} webhook`, { error: webhookError });
      return new Response(`Error processing webhook: ${webhookError.message}`, { status: 500 });
    }
  } catch (error) {
    logStep(FUNCTION_NAME, "General error", { error: error.message || error });
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
});

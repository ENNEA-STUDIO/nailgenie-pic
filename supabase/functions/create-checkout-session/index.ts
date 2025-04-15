
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function for logging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );

  try {
    // Get user from auth header
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    logStep("User authenticated", { id: user.id, email: user.email });

    const requestData = await req.json();
    const { priceId, mode } = requestData;
    
    if (!priceId) {
      throw new Error('Price ID is required');
    }

    // Force specific mode based on priceId - strict separation of payment flows
    let checkoutMode;
    let metadata = { userId: user.id };
    
    if (priceId === 'price_1RDnGiGpMCOJlOLHek9KvjVv') {
      // Subscription price ID - force subscription mode
      checkoutMode = 'subscription';
      metadata = { ...metadata, isSubscription: 'true' };
      logStep('Creating subscription checkout', { priceId, mode: checkoutMode });
    } else {
      // One-time payment price ID
      checkoutMode = 'payment';
      metadata = { ...metadata, isSubscription: 'false' };
      logStep('Creating one-time payment checkout', { priceId, mode: checkoutMode });
    }

    // We'll continue to use the server-side secret key for security
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Check if customer exists
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    });

    let customerId = undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    }
    
    try {
      // Create a checkout session with the appropriate mode
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        customer_email: customerId ? undefined : user.email,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: checkoutMode,
        success_url: `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}&mode=${checkoutMode}`,
        cancel_url: `${req.headers.get('origin')}/buy-credits`,
        metadata: metadata,
      });

      logStep('Payment session created', { 
        sessionId: session.id, 
        url: session.url, 
        mode: checkoutMode 
      });
      
      return new Response(
        JSON.stringify({ 
          url: session.url,
          mode: checkoutMode
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (stripeError) {
      logStep('Stripe API error', { error: stripeError });
      return new Response(
        JSON.stringify({ error: `Stripe error: ${stripeError.message}` }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep('Error creating checkout session', { error: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

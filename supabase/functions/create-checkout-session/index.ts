
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const requestData = await req.json();
    const { priceId, mode: requestedMode } = requestData;
    
    if (!priceId) {
      throw new Error('Price ID is required');
    }

    console.log('Creating payment session...', { priceId, requestedMode });
    
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
    }

    try {
      // Get price info to determine if it's recurring
      const price = await stripe.prices.retrieve(priceId);
      const isRecurring = price.type === 'recurring';
      
      // Determine the appropriate mode based on price type
      let mode;
      
      // If a mode was explicitly requested, use it
      if (requestedMode) {
        mode = requestedMode;
        console.log(`Using explicitly requested mode: ${mode}`);
        
        // Validate mode and price type compatibility
        if (mode === 'payment' && isRecurring) {
          throw new Error('Cannot use payment mode with a recurring price. Use subscription mode instead.');
        }
        
        if (mode === 'subscription' && !isRecurring) {
          throw new Error('Cannot use subscription mode with a one-time price. Use payment mode instead.');
        }
      } else {
        // Auto-detect mode based on price type if no mode was requested
        mode = isRecurring ? 'subscription' : 'payment';
        console.log(`Auto-detected mode: ${mode} based on price type: ${isRecurring ? 'recurring' : 'one-time'}`);
      }
      
      console.log(`Creating ${mode} session for price ${priceId}`);
      
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
        mode: mode,
        success_url: `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get('origin')}/buy-credits`,
        metadata: {
          userId: user.id,
          mode: mode, // Store the mode in metadata
        },
      });

      console.log('Payment session created:', session.id);
      return new Response(
        JSON.stringify({ url: session.url }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (stripeError) {
      console.error('Stripe API error:', stripeError);
      return new Response(
        JSON.stringify({ error: `Stripe error: ${stripeError.message}` }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400, // Use 400 for client errors
        }
      );
    }
  } catch (error) {
    console.error('Error creating payment session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

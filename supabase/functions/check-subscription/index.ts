
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const { data: userData, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }

    // Get user's subscription from database
    const { data: subscription, error } = await supabaseClient
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userData.user.id)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      console.error("Error checking subscription:", error);
      throw new Error("Failed to check subscription status");
    }

    const hasActiveSubscription = !!subscription;

    return new Response(JSON.stringify({ 
      isSubscribed: hasActiveSubscription,
      subscription: subscription || null
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

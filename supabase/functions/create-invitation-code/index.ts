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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get the user's JWT token from the request headers
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    // Verify the JWT token
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(authHeader.replace("Bearer ", ""));

    if (authError || !user) {
      throw new Error("Unauthorized: Invalid token");
    }

    console.log("Creating invitation code for user:", user.id);

    // Generate a unique invitation code
    const { data: inviteCode, error: rpcError } = await supabaseClient.rpc(
      "create_invitation",
      { user_id_param: user.id }
    );

    if (rpcError) {
      console.error("Error calling create_invitation RPC:", rpcError);
      throw new Error(`Failed to create invitation: ${rpcError.message}`);
    }

    if (!inviteCode) {
      throw new Error("No invitation code was generated");
    }

    console.log("Created invitation code:", inviteCode, "for user:", user.id);

    return new Response(
      JSON.stringify({
        success: true,
        code: inviteCode,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating invitation code:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

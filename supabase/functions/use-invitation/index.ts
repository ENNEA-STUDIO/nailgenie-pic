
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

  try {
    // Get invitation code and new user ID from request body
    const { invitationCode, newUserId } = await req.json();

    if (!invitationCode || !newUserId) {
      throw new Error("Invitation code and new user ID are required");
    }

    // First validate the invitation code exists and is unused
    const { data: inviteData, error: inviteError } = await supabaseClient
      .from("invitations")
      .select("user_id, used_at")
      .eq("code", invitationCode)
      .is("used_at", null)
      .single();

    if (inviteError || !inviteData) {
      throw new Error("Invalid or already used invitation code");
    }

    // Get the referrer's user ID
    const referrerId = inviteData.user_id;

    console.log("Processing invitation. Referrer:", referrerId, "New user:", newUserId);

    // Mark the invitation as used
    const { error: updateError } = await supabaseClient
      .from("invitations")
      .update({
        used_at: new Date().toISOString(),
        used_by: newUserId,
      })
      .eq("code", invitationCode);

    if (updateError) {
      throw new Error("Failed to update invitation status");
    }

    // Add 5 bonus credits to the new user (they already have 5 from registration)
    const { error: newUserCreditsError } = await supabaseClient.rpc("add_user_credits", {
      user_id_param: newUserId,
      credits_to_add: 5,
    });

    if (newUserCreditsError) {
      throw new Error("Failed to add credits to new user");
    }

    // Add 5 credits to the referrer
    const { error: referrerCreditsError } = await supabaseClient.rpc("add_user_credits", {
      user_id_param: referrerId,
      credits_to_add: 5,
    });

    if (referrerCreditsError) {
      throw new Error("Failed to add credits to referrer");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Invitation used successfully. Both users received 5 credits.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing invitation:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

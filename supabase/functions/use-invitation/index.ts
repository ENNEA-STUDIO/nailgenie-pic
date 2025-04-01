
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

    // First validate the invitation code exists
    const { data: inviteData, error: inviteError } = await supabaseClient
      .from("invitations")
      .select("user_id")
      .eq("code", invitationCode)
      .single();

    if (inviteError || !inviteData) {
      throw new Error("Invalid invitation code");
    }

    // Get the referrer's user ID
    const referrerId = inviteData.user_id;

    // Prevent users from using their own invitation link
    if (referrerId === newUserId) {
      throw new Error("You cannot use your own invitation link");
    }

    console.log(
      "Processing invitation. Referrer:",
      referrerId,
      "New user:",
      newUserId
    );

    // Check if this user has already used an invitation code
    const { data: usedInviteData, error: usedInviteError } = await supabaseClient
      .from("invitation_uses")
      .select("used_by")
      .eq("used_by", newUserId);
      
    if (usedInviteError) {
      throw new Error("Failed to check invitation history");
    }
    
    // If the user has already used an invitation, prevent them from using another one
    if (usedInviteData && usedInviteData.length > 0) {
      throw new Error("You have already used an invitation code");
    }

    // Record this usage - we now store an entry for each use instead of marking the invitation as used
    const { error: usageError } = await supabaseClient
      .from("invitation_uses")
      .insert({
        invitation_code: invitationCode,
        used_by: newUserId,
        referrer_id: referrerId
      });

    if (usageError) {
      throw new Error("Failed to record invitation usage");
    }

    // Create initial credits for new user (10 credits total: 5 base + 5 from invitation)
    const { error: newUserCreditsError } = await supabaseClient
      .from("user_credits")
      .insert([{ user_id: newUserId, credits: 10 }])
      .single();

    if (newUserCreditsError) {
      throw new Error("Failed to add credits to new user");
    }

    // Add 5 credits to the referrer
    const { error: referrerCreditsError } = await supabaseClient.rpc(
      "add_user_credits",
      {
        user_id_param: referrerId,
        credits_to_add: 5,
      }
    );

    if (referrerCreditsError) {
      throw new Error("Failed to add credits to referrer");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Invitation used successfully. Both users received credits.",
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


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

    console.log("Processing invitation with code:", invitationCode, "for user:", newUserId);

    // First check if the invitation code exists
    const { data: inviteData, error: inviteQueryError } = await supabaseClient
      .from("invitations")
      .select("user_id, code")
      .eq("code", invitationCode)
      .single();

    if (inviteQueryError) {
      console.error("Error querying invitation:", inviteQueryError);
      throw new Error(`Invalid invitation code: ${inviteQueryError.message}`);
    }

    if (!inviteData) {
      console.error("No invitation found with code:", invitationCode);
      throw new Error("Invalid invitation code: not found");
    }

    // Get the referrer's user ID
    const referrerId = inviteData.user_id;
    console.log("Referrer ID:", referrerId);

    // Prevent users from using their own invitation link
    if (referrerId === newUserId) {
      console.error("User attempting to use their own invite code");
      throw new Error("You cannot use your own invitation link");
    }

    // Check if this user has already used an invitation code
    const { data: usedInviteData, error: usedInviteError } =
      await supabaseClient
        .from("invitation_uses")
        .select("id")
        .eq("used_by", newUserId);

    if (usedInviteError) {
      console.error("Error checking invitation history:", usedInviteError);
      throw new Error("Failed to check invitation history");
    }

    // If the user has already used an invitation, prevent them from using another one
    if (usedInviteData && usedInviteData.length > 0) {
      console.error("User has already used an invitation code");
      throw new Error("You have already used an invitation code");
    }

    // Record this usage in invitation_uses table
    console.log("Recording invitation usage");
    const { error: usageError } = await supabaseClient
      .from("invitation_uses")
      .insert({
        invitation_code: invitationCode,
        used_by: newUserId,
        referrer_id: referrerId,
      });

    if (usageError) {
      console.error("Error recording invitation usage:", usageError);
      throw new Error("Failed to record invitation usage");
    }

    // Give the new user 10 credits (5 base + 5 bonus)
    console.log("Adding credits to new user");
    
    // First check if they already have a credits record
    const { data: existingUserCredits, error: checkUserCreditsError } = 
      await supabaseClient
        .from("user_credits")
        .select("id")
        .eq("user_id", newUserId)
        .maybeSingle();
        
    if (checkUserCreditsError) {
      console.error("Error checking user credits:", checkUserCreditsError);
      throw new Error("Failed to check user credits");
    }
    
    if (existingUserCredits) {
      // User already has a credits record, add 5 bonus credits
      console.log("User already has credits, adding 5 bonus credits");
      
      const { error: addBonusError } = await supabaseClient.rpc(
        "add_user_credits",
        {
          user_id_param: newUserId,
          credits_to_add: 5,
        }
      );
      
      if (addBonusError) {
        console.error("Error adding bonus credits:", addBonusError);
        throw new Error("Failed to add bonus credits to user");
      }
    } else {
      // Create new record with 10 credits (5 base + 5 bonus)
      console.log("Creating new credits record with 10 credits");
      
      const { error: createCreditsError } = await supabaseClient
        .from("user_credits")
        .insert({ user_id: newUserId, credits: 10 });
        
      if (createCreditsError) {
        console.error("Error creating user credits:", createCreditsError);
        throw new Error("Failed to create credits for user");
      }
    }

    // Give the referrer 5 credits
    console.log("Adding 5 credits to referrer");
    
    const { error: addReferrerCreditsError } = await supabaseClient.rpc(
      "add_user_credits",
      {
        user_id_param: referrerId,
        credits_to_add: 5,
      }
    );
    
    if (addReferrerCreditsError) {
      console.error("Error adding credits to referrer:", addReferrerCreditsError);
      throw new Error("Failed to add credits to referrer");
    }

    console.log("Successfully processed invitation and added credits to both users");
    return new Response(
      JSON.stringify({
        success: true,
        message: "Invitation used successfully. You received 10 credits and the referrer received 5 credits.",
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

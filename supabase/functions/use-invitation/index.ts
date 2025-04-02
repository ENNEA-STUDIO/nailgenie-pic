
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
        .select("used_by")
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

    // Check if the user already has a credits record
    const { data: existingCredits, error: checkCreditsError } = await supabaseClient
      .from("user_credits")
      .select("*")
      .eq("user_id", newUserId)
      .single();
      
    if (checkCreditsError && checkCreditsError.code !== 'PGRST116') {
      // PGRST116 is the error when no rows found, which is expected if user is new
      console.error("Error checking if user has credits:", checkCreditsError);
      throw new Error("Failed to check user credits");
    }
    
    // Add 5 BONUS credits for the new user (invitee)
    // If they already have the initial 5 credits, add 5 more for a total of 10
    if (existingCredits) {
      console.log("User already has a credits record with", existingCredits.credits, "credits, adding 5 bonus credits");
      
      const { data: updatedCredits, error: addCreditsError } = await supabaseClient.rpc(
        "add_user_credits",
        {
          user_id_param: newUserId,
          credits_to_add: 5,
        }
      );
      
      if (addCreditsError) {
        console.error("Error adding bonus credits to existing user:", addCreditsError);
        throw new Error("Failed to add bonus credits to new user");
      }
      
      console.log("Successfully added 5 bonus credits to user, new total:", existingCredits.credits + 5);
    } else {
      console.log("Creating new credits record with 10 credits for user (5 base + 5 bonus)");
      // Create new credits record with 10 credits (5 base + 5 bonus)
      const { data: newCredits, error: insertCreditsError } = await supabaseClient
        .from("user_credits")
        .insert([
          { user_id: newUserId, credits: 10 }
        ])
        .select();
        
      if (insertCreditsError) {
        console.error("Error creating credits for new user:", insertCreditsError);
        throw new Error("Failed to create credits for new user");
      }
      
      console.log("Successfully created user credits record with 10 credits:", newCredits);
    }

    // Add 5 credits to the referrer
    console.log("Adding 5 credits to referrer:", referrerId);
    
    // Check if the referrer exists in user_credits table
    const { data: referrerData, error: referrerCheckError } = await supabaseClient
      .from("user_credits")
      .select("credits")
      .eq("user_id", referrerId)
      .single();
    
    if (referrerCheckError && referrerCheckError.code !== 'PGRST116') {
      console.error("Error checking referrer credits:", referrerCheckError);
      throw new Error("Failed to check referrer credits");
    }
    
    if (!referrerData) {
      // Create new record for referrer if it doesn't exist
      console.log("Creating new credits record for referrer with 5 credits");
      const { data: newReferrerCredits, error: createReferrerError } = await supabaseClient
        .from("user_credits")
        .insert([
          { user_id: referrerId, credits: 5 }
        ])
        .select();
      
      if (createReferrerError) {
        console.error("Error creating referrer credits:", createReferrerError);
        throw new Error("Failed to create credits for referrer");
      }
      
      console.log("Successfully created referrer credits record with 5 credits:", newReferrerCredits);
    } else {
      // Update existing record for referrer
      console.log("Updating referrer credits from", referrerData.credits, "to", referrerData.credits + 5);
      const { data: updatedReferrerCredits, error: referrerCreditsError } = await supabaseClient.rpc(
        "add_user_credits",
        {
          user_id_param: referrerId,
          credits_to_add: 5,
        }
      );

      if (referrerCreditsError) {
        console.error("Error adding credits to referrer:", referrerCreditsError);
        throw new Error("Failed to add credits to referrer");
      }
      
      console.log("Successfully added 5 credits to referrer");
    }

    console.log("Successfully processed invitation and added credits to both users");
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

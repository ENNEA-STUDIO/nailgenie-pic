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
    const { invitationCode, newUserId } = await req.json();
    console.log("Processing invitation:", { invitationCode, newUserId });

    if (!invitationCode || !newUserId) {
      throw new Error("Invitation code and user ID are required");
    }

    // Vérifier si le code existe dans la table invitations
    const { data: invites, error: inviteError } = await supabaseClient
      .from("invitations")
      .select("user_id, code")
      .eq("code", invitationCode);

    console.log("Invitation lookup result:", { invites, inviteError });

    if (inviteError) {
      throw new Error(`Error checking invitation code: ${inviteError.message}`);
    }

    if (!invites || invites.length === 0) {
      throw new Error("Invalid invitation code: not found");
    }

    const invite = invites[0]; // On prend le premier résultat

    // Vérifier si l'invitation n'a pas déjà été utilisée
    const { data: existingUses, error: existingError } = await supabaseClient
      .from("invitation_uses")
      .select()
      .eq("invitation_code", invitationCode);

    if (existingError) {
      throw new Error(`Error checking existing uses: ${existingError.message}`);
    }

    if (existingUses && existingUses.length > 0) {
      throw new Error("This invitation code has already been used");
    }

    // Record usage
    const { error: usageError } = await supabaseClient
      .from("invitation_uses")
      .insert({
        invitation_code: invitationCode,
        used_by: newUserId,
        referrer_id: invite.user_id,
      });

    if (usageError) {
      throw new Error(
        `Failed to record invitation usage: ${usageError.message}`
      );
    }

    // Add credits to new user
    const { error: newUserError } = await supabaseClient
      .from("user_credits")
      .insert({ user_id: newUserId, credits: 10 });

    if (newUserError) {
      throw new Error(
        `Failed to add credits to new user: ${newUserError.message}`
      );
    }

    // Add credits to referrer
    const { error: referrerError } = await supabaseClient.rpc(
      "add_user_credits",
      {
        user_id_param: invite.user_id,
        credits_to_add: 5,
      }
    );

    if (referrerError) {
      throw new Error(
        `Failed to add credits to referrer: ${referrerError.message}`
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Invitation processed successfully",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
});

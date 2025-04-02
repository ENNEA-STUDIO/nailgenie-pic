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
    console.log("1. Input validation:", {
      invitationCode,
      invitationCodeType: typeof invitationCode,
      invitationCodeLength: invitationCode?.length,
      newUserId,
    });

    // Vérifions d'abord que la table est accessible
    const { data: tableCheck, error: tableError } = await supabaseClient
      .from("invitations")
      .select("count");

    console.log("Table accessibility check:", {
      data: tableCheck,
      error: tableError,
    });

    // Faisons une requête simple pour voir tous les codes
    const { data: allInvites, error: listError } = await supabaseClient
      .from("invitations")
      .select("code");

    console.log("All invitations in DB:", {
      invites: allInvites,
      error: listError,
    });

    // Maintenant notre requête principale
    const { data: invites, error: inviteError } = await supabaseClient
      .from("invitations")
      .select("*")
      .eq("code", invitationCode);

    console.log("2. Database query:", {
      searchedCode: invitationCode,
      query: "exact match",
      result: invites,
      resultCount: invites?.length,
      error: inviteError,
    });

    if (inviteError) {
      throw new Error(`Error checking invitation code: ${inviteError.message}`);
    }

    if (!invites || invites.length === 0) {
      // Faisons une recherche de tous les codes pour debug
      const { data: allCodes } = await supabaseClient
        .from("invitations")
        .select("code");

      console.log("3. All available codes:", {
        searchedCode: invitationCode,
        availableCodes: allCodes?.map((i) => i.code),
      });

      throw new Error("Invalid invitation code: not found");
    }

    const invite = invites[0];

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

    // Vérifier si l'utilisateur a déjà des crédits
    const { data: existingCredits, error: checkCreditsError } =
      await supabaseClient
        .from("user_credits")
        .select("credits")
        .eq("user_id", newUserId)
        .single();

    if (checkCreditsError && checkCreditsError.code !== "PGRST116") {
      // PGRST116 = not found
      throw new Error(
        `Failed to check user credits: ${checkCreditsError.message}`
      );
    }

    // Add or update credits
    if (existingCredits) {
      // Update existing credits - ajout de seulement 5 crédits bonus
      const { error: updateError } = await supabaseClient.rpc(
        "add_user_credits",
        {
          user_id_param: newUserId,
          credits_to_add: 5,
        }
      );

      if (updateError) {
        throw new Error(
          `Failed to update user credits: ${updateError.message}`
        );
      }
    } else {
      // Create new credits entry - 10 crédits au total (5 base + 5 bonus)
      const { error: newUserError } = await supabaseClient
        .from("user_credits")
        .insert({ user_id: newUserId, credits: 10 });

      if (newUserError) {
        throw new Error(
          `Failed to add credits to new user: ${newUserError.message}`
        );
      }
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

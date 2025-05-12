import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import {
  logStep,
  initializeSupabaseAdmin,
  parseWebhookData,
  corsHeaders,
} from "../_shared/mollie-utils.ts";

const FUNCTION_NAME = "mollie-webhook";

// Helper function to send email via Resend
async function sendEmail(to: string, subject: string, html: string) {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    logStep(FUNCTION_NAME, "RESEND_API_KEY not configured");
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GeNails <noreply@genails.com>",
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      logStep(FUNCTION_NAME, "Error sending email", { error });
      return;
    }

    logStep(FUNCTION_NAME, "Email sent successfully");
  } catch (error) {
    logStep(FUNCTION_NAME, "Error sending email", { error });
  }
}

serve(async (req) => {
  logStep(FUNCTION_NAME, "Function called");

  // Cette fonction de webhook doit être publique, pas d'authentification requise
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // // Initialize Mollie client
    // const mollie = initializeMollie();

    // Initialize Supabase admin client
    const supabaseAdmin = initializeSupabaseAdmin();

    // Parse the webhook data
    let id: string;
    try {
      // On extrait le payment ID de la requête
      let formData;
      try {
        formData = await req.formData();
        id = formData.get("id") as string;
        logStep(FUNCTION_NAME, "Form data parsed", { id });
      } catch (formError) {
        logStep(FUNCTION_NAME, "Error parsing form data, trying JSON", {
          error: formError,
        });

        // Essayer de lire en tant que JSON si FormData échoue
        try {
          const jsonData = await req.json();
          id = jsonData.id as string;
          logStep(FUNCTION_NAME, "JSON data parsed", { id });
        } catch (jsonError) {
          logStep(FUNCTION_NAME, "Failed to parse request data", {
            error: jsonError,
          });
          return new Response("Invalid webhook data", { status: 400 });
        }
      }

      if (!id) {
        logStep(FUNCTION_NAME, "Error: No ID provided in webhook");
        return new Response("No ID provided", { status: 400 });
      }
    } catch (parseError) {
      logStep(FUNCTION_NAME, "Error parsing webhook data", {
        error: parseError,
      });
      return new Response("Error parsing webhook data", { status: 400 });
    }

    logStep(FUNCTION_NAME, `Webhook called for ID: ${id}`);

    try {
      // Gérer le webhook en fonction du type d'ID
      if (id.startsWith("tr_")) {
        // C'est un webhook de paiement
        // 1. Récupérer le paiement via l'API REST Mollie
        const mollieRes = await fetch(
          `https://api.mollie.com/v2/payments/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${Deno.env.get("MOLLIE_API_KEY")}`,
              "Content-Type": "application/json",
            },
          }
        );
        const payment = await mollieRes.json();
        logStep(FUNCTION_NAME, `Payment status: ${payment.status}`, {
          metadata: payment.metadata,
        });

        if (payment.status === "paid") {
          const metadata = payment.metadata as any;
          if (!metadata?.user_id) {
            logStep(FUNCTION_NAME, "Error: No user_id in payment metadata");
            return new Response("No user_id in payment metadata", {
              status: 400,
            });
          }
          const userId = metadata.user_id;

          if (
            metadata.product_type === "subscription" ||
            metadata.is_first_payment
          ) {
            // C'est un paiement pour un abonnement
            logStep(FUNCTION_NAME, "Processing subscription payment", {
              userId,
            });

            // 1. Créer un customer si besoin
            let customerId = payment.customerId;
            if (!customerId) {
              // Créer un customer Mollie
              const customerRes = await fetch(
                "https://api.mollie.com/v2/customers",
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${Deno.env.get("MOLLIE_API_KEY")}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: payment.description || "GeNails User",
                    email: payment.description || undefined,
                  }),
                }
              );
              const customer = await customerRes.json();
              customerId = customer.id;
            }

            // 2. Créer l'abonnement récurrent
            const subRes = await fetch(
              `https://api.mollie.com/v2/customers/${customerId}/subscriptions`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${Deno.env.get("MOLLIE_API_KEY")}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  amount: { currency: "EUR", value: "8.99" },
                  interval: "1 month",
                  description: "GeNails Unlimited Monthly Subscription",
                  webhookUrl:
                    "https://yvtdpfampfndlnjqoocm.supabase.co/functions/v1/mollie-webhook",
                  metadata: { user_id: userId },
                }),
              }
            );
            const subscription = await subRes.json();

            // 3. Enregistrer l'abonnement dans la base de données
            await supabaseAdmin.from("user_subscriptions").insert({
              user_id: userId,
              provider: "mollie",
              provider_id: subscription.id,
              customer_id: customerId,
              status: subscription.status,
              price_id: "mollie_unlimited_monthly",
              current_period_end: subscription.nextPaymentDate,
            });

            // 4. Ajouter des crédits illimités
            await supabaseAdmin.rpc("add_user_credits", {
              user_id_param: userId,
              credits_to_add: 1000000,
            });
            logStep(FUNCTION_NAME, `Added unlimited credits to user ${userId}`);

            // Send subscription confirmation email
            await sendEmail(
              metadata.email,
              "Bienvenue dans votre abonnement GeNails !",
              `
                <h1>Bienvenue dans votre abonnement GeNails !</h1>
                <p>Votre abonnement illimité a été activé avec succès.</p>
                <p>Vous pouvez maintenant générer autant de designs que vous voulez.</p>
                <p>Merci de votre confiance !</p>
              `
            );
          } else {
            // C'est un paiement unique pour des crédits
            logStep(FUNCTION_NAME, "Processing one-time payment for credits", {
              userId,
            });

            // Ajouter 10 crédits à l'utilisateur
            await supabaseAdmin.rpc("add_user_credits", {
              user_id_param: userId,
              credits_to_add: 10,
            });

            logStep(FUNCTION_NAME, `Added 10 credits to user ${userId}`);

            // Send credits confirmation email
            await sendEmail(
              metadata.email,
              "Vos crédits GeNails ont été ajoutés !",
              `
                <h1>Merci pour votre achat !</h1>
                <p>10 crédits ont été ajoutés à votre compte GeNails.</p>
                <p>Vous pouvez maintenant générer plus de designs.</p>
                <p>À bientôt !</p>
              `
            );
          }
        } else {
          logStep(FUNCTION_NAME, `Payment not successful: ${payment.status}`);
        }

        // Toujours renvoyer 200 pour les webhooks Mollie
        return new Response("Webhook processed", { status: 200 });
      } else if (id.startsWith("sub_")) {
        // C'est un événement d'abonnement
        logStep(FUNCTION_NAME, `Processing subscription event: ${id}`);

        // Format: sub_customerId_subscriptionNumber
        const parts = id.split("_");
        if (parts.length < 2) {
          logStep(FUNCTION_NAME, `Invalid subscription ID format: ${id}`);
          return new Response("Invalid subscription ID format", {
            status: 400,
          });
        }

        const customerId = parts[1];
        logStep(FUNCTION_NAME, `Extracted customer ID: ${customerId}`);

        try {
          const subRes = await fetch(
            `https://api.mollie.com/v2/customers/${customerId}/subscriptions/${id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${Deno.env.get("MOLLIE_API_KEY")}`,
                "Content-Type": "application/json",
              },
            }
          );
          const subscription = await subRes.json();
          logStep(FUNCTION_NAME, `Subscription status: ${subscription.status}`);

          // Mettre à jour le statut de l'abonnement dans la base de données
          const { data: subscriptionData, error: fetchError } =
            await supabaseAdmin
              .from("user_subscriptions")
              .select("user_id")
              .eq("provider", "mollie")
              .eq("provider_id", id)
              .maybeSingle();

          if (fetchError || !subscriptionData) {
            logStep(FUNCTION_NAME, "Error finding subscription", {
              error: fetchError,
            });
            return new Response("Subscription not found", { status: 200 }); // 200 pour éviter les retries
          }

          const userId = subscriptionData.user_id;

          // Mettre à jour le statut de l'abonnement
          const { error: updateError } = await supabaseAdmin
            .from("user_subscriptions")
            .update({
              status: subscription.status,
              current_period_end: subscription.nextPaymentDate,
              updated_at: new Date().toISOString(),
            })
            .eq("provider", "mollie")
            .eq("provider_id", id);

          if (updateError) {
            logStep(FUNCTION_NAME, "Error updating subscription", {
              error: updateError,
            });
          } else {
            logStep(
              FUNCTION_NAME,
              `Updated subscription status to ${subscription.status}`
            );
          }

          // Si le paiement récurrent est réussi, ajouter des crédits
          if (subscription.status === "active") {
            await supabaseAdmin.rpc("add_user_credits", {
              user_id_param: userId,
              credits_to_add: 1000000,
            });
            logStep(FUNCTION_NAME, `Added unlimited credits to user ${userId}`);
          }
        } catch (subError) {
          logStep(FUNCTION_NAME, "Error processing subscription webhook", {
            error: subError,
          });
          // On retourne 200 quand même pour éviter les retries de Mollie
        }

        return new Response("Webhook processed", { status: 200 });
      }

      return new Response("Webhook processed", { status: 200 });
    } catch (webhookError) {
      logStep(FUNCTION_NAME, `Error processing webhook`, {
        error: webhookError,
      });
      return new Response("Webhook processed with error", { status: 200 }); // 200 pour éviter les retries
    }
  } catch (error) {
    logStep(FUNCTION_NAME, "General error", { error: error.message || error });
    return new Response(`Error: ${error.message}`, { status: 200 }); // 200 pour éviter les retries
  }
});

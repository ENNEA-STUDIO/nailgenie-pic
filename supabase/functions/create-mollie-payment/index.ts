// supabase/functions/create-mollie-payment/index.ts
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MOLLIE_API_KEY = "test_rbBTTvzQwFaGkDsa3NUt2wHh5CAzzN";

serve(async (req) => {
  console.log("[MOLLIE] Reçu une requête:", req.method, req.url);

  if (req.method === "OPTIONS") {
    console.log("[MOLLIE] Préflight CORS");
    return new Response(null, { headers: corsHeaders });
  }

  let body;
  try {
    body = await req.json();
    console.log("[MOLLIE] Body reçu:", body);
  } catch (e) {
    console.error("[MOLLIE] Erreur parsing JSON:", e);
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const { amount, description, redirectUrl, webhookUrl, offerType } = body;
  console.log("[MOLLIE] Params:", {
    amount,
    description,
    redirectUrl,
    webhookUrl,
    offerType,
  });

  if (!amount || !description || !redirectUrl || !webhookUrl) {
    console.error("[MOLLIE] Paramètres manquants", {
      amount,
      description,
      redirectUrl,
      webhookUrl,
    });
    return new Response(JSON.stringify({ error: "Missing parameters" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  if (!MOLLIE_API_KEY) {
    console.error("[MOLLIE] MOLLIE_API_KEY manquante !");
    return new Response(JSON.stringify({ error: "MOLLIE_API_KEY missing" }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  try {
    console.log("[MOLLIE] Envoi à Mollie:", {
      amount,
      description,
      redirectUrl,
      webhookUrl,
    });

    let paymentData: any = {
      amount: { value: amount, currency: "EUR" },
      description,
      redirectUrl,
      webhookUrl,
      metadata: {
        user_id: body.user_id,
        offerType,
        name: body.name,
        email: body.email,
      },
    };

    if (offerType === "subscription") {
      const { name, email } = body;
      if (!name || !email) {
        return new Response(
          JSON.stringify({ error: "Name and email required for subscription" }),
          {
            status: 400,
            headers: corsHeaders,
          }
        );
      }

      const customerRes = await fetch("https://api.mollie.com/v2/customers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${MOLLIE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
        }),
      });
      const customer = await customerRes.json();

      if (!customer.id) {
        return new Response(
          JSON.stringify({ error: "Failed to create Mollie customer" }),
          {
            status: 500,
            headers: corsHeaders,
          }
        );
      }

      paymentData.customerId = customer.id;
      paymentData.sequenceType = "first";
    }

    const mollieRes = await fetch("https://api.mollie.com/v2/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MOLLIE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const mollieData = await mollieRes.json();
    console.log("[MOLLIE] Réponse Mollie:", mollieData);

    if (!mollieRes.ok) {
      console.error("[MOLLIE] Erreur Mollie:", mollieData);
      return new Response(JSON.stringify({ error: mollieData.message }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({ checkoutUrl: mollieData._links.checkout.href }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (err) {
    console.error("[MOLLIE] Exception:", err);
    return new Response(JSON.stringify({ error: "Erreur serveur Mollie" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

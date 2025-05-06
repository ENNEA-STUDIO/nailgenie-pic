
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import createMollieClient from "https://esm.sh/@mollie/api-client@3.7.0";

// Headers partagés pour CORS
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Helper pour la journalisation détaillée
export function logStep(functionName: string, step: string, details?: any) {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[${functionName.toUpperCase()}] ${step}${detailsStr}`);
}

// Initialiser le client Mollie
export function initializeMollie() {
  const mollieApiKey = Deno.env.get("MOLLIE_API_KEY");
  if (!mollieApiKey) {
    throw new Error("MOLLIE_API_KEY n'est pas configuré");
  }
  return createMollieClient({ apiKey: mollieApiKey });
}

// Initialiser le client Supabase admin
export function initializeSupabaseAdmin() {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!url || !serviceRoleKey) {
    throw new Error("Configuration Supabase incomplète");
  }
  
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Authentifier l'utilisateur à partir de la requête
export async function authenticateUser(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    throw new Error("En-tête d'autorisation manquant");
  }
  
  const token = authHeader.replace("Bearer ", "");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Configuration Supabase incomplète");
  }
  
  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
  
  if (userError || !userData.user) {
    throw new Error(userError?.message || "Utilisateur non authentifié");
  }
  
  return userData.user;
}

// Gérer les requêtes OPTIONS pour CORS
export function handleOptionsRequest() {
  return new Response(null, { headers: corsHeaders });
}

// Créer une réponse d'erreur avec les bons en-têtes
export function createErrorResponse(error: string, status: number = 400) {
  return new Response(
    JSON.stringify({ success: false, error }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

// Créer une réponse de succès avec les bons en-têtes
export function createSuccessResponse(data: any, status: number = 200) {
  return new Response(
    JSON.stringify({ success: true, ...data }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

// Parser les données du webhook à partir de la requête
export async function parseWebhookData(req: Request) {
  try {
    const formData = await req.formData();
    return { id: formData.get("id") as string };
  } catch (error) {
    try {
      const jsonData = await req.json();
      if (jsonData.id) {
        return { id: jsonData.id };
      } else {
        throw new Error("Données de webhook invalides");
      }
    } catch (jsonError) {
      throw new Error("Erreur d'analyse des données de webhook");
    }
  }
}

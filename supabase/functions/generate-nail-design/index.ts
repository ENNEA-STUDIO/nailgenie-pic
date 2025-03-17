
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client } from "https://esm.sh/@gradio/client@2.1.11";

const HUGGINGFACE_TOKEN = Deno.env.get("HUGGINGFACE_TOKEN");
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  console.log("Function called with method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request");
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    console.log("Starting request processing");
    
    // Parse the request body
    const requestBody = await req.text();
    console.log("Request body (text):", requestBody);
    
    let body;
    try {
      body = JSON.parse(requestBody);
      console.log("Parsed request body successfully");
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      throw new Error("Invalid JSON in request body");
    }
    
    const { imageBase64, prompt, nailShape, nailLength, nailColor } = body;

    // Validate inputs
    if (!imageBase64) {
      console.error("Missing imageBase64 in request");
      throw new Error("Image est requis");
    }
    
    if (!prompt) {
      console.error("Missing prompt in request");
      throw new Error("Description est requise");
    }
    
    console.log("Inputs validated. Nail details:", { nailShape, nailLength, nailColor });
    console.log("HF Token available:", !!HUGGINGFACE_TOKEN);
    console.log("Gemini API Key available:", !!GEMINI_API_KEY);

    // Convert base64 to blob
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const byteString = atob(base64Data);
    const buffer = new Uint8Array(byteString.length);
    
    for (let i = 0; i < byteString.length; i++) {
      buffer[i] = byteString.charCodeAt(i);
    }
    
    const imageBlob = new Blob([buffer], { type: "image/jpeg" });
    console.log("Image blob created successfully");

    // Prepare a full prompt that includes nail details
    const fullPrompt = `${prompt} avec des ongles ${nailLength === 'short' ? 'courts' : 
      nailLength === 'medium' ? 'moyens' : 'longs'} de forme ${nailShape} de couleur principale ${nailColor}`;
    
    console.log("Full prompt:", fullPrompt);
    console.log("Connecting to Gemini Image Edit model...");
    
    // Connect to the Gemini Image Edit model
    try {
      const client = await Client.connect("BenKCDQ/Gemini-Image-Edit-nails", { 
        hf_token: HUGGINGFACE_TOKEN 
      });
      
      console.log("Connected to client successfully");
      console.log("Making prediction with prompt:", fullPrompt);
      
      // Make API call to generate the design
      const result = await client.predict("/process_image_and_prompt", {
        composite_pil: imageBlob,
        prompt: fullPrompt,
        gemini_api_key: GEMINI_API_KEY,
      });
      
      console.log("Prediction result received:", result ? "success" : "undefined");
      console.log("Result data:", result.data ? "exists" : "missing");

      // Return the result
      return new Response(JSON.stringify({ 
        success: true, 
        data: result.data
      }), { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    } catch (apiError) {
      console.error("API call error:", apiError);
      throw new Error(`Erreur lors de l'appel à l'API: ${apiError.message}`);
    }
    
  } catch (error) {
    console.error("Error in generate-nail-design function:", error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
});

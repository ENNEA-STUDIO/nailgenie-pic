
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log("Request body length:", requestBody.length);
    
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

    if (!HUGGINGFACE_TOKEN || !GEMINI_API_KEY) {
      throw new Error("Les clés d'API nécessaires ne sont pas configurées");
    }

    // Convert base64 to blob
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const byteString = atob(base64Data);
    const buffer = new Uint8Array(byteString.length);
    
    for (let i = 0; i < byteString.length; i++) {
      buffer[i] = byteString.charCodeAt(i);
    }
    
    const imageBlob = new Blob([buffer], { type: "image/jpeg" });
    console.log("Image blob created successfully");

    // Get color name based on hex code
    const colorName = getColorName(nailColor);

    // Prepare a full prompt that includes nail details with the specific color name
    const fullPrompt = `${prompt} avec des ongles ${nailLength === 'short' ? 'courts' : 
      nailLength === 'medium' ? 'moyens' : 'longs'} de forme ${nailShape} de couleur ${colorName}`;
    
    console.log("Full prompt:", fullPrompt);
    
    // Use Gemini Pro Vision model directly since the HuggingFace model is unavailable
    try {
      console.log("Preparing to send request to Gemini API");
      
      // Prepare the image data for Gemini
      const imageData = `data:image/jpeg;base64,${base64Data}`;
      
      // Call Gemini API directly
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: `Generate a nail design based on this description: ${fullPrompt}. Make the nails ${nailLength === 'short' ? 'short' : nailLength === 'medium' ? 'medium' : 'long'} length, in ${nailShape} shape, with ${colorName} color. The output should be a realistic image showing hands with the described nail design.` },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Data
                }
              }
            ]
          }]
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API call failed:", response.status, errorText);
        throw new Error(`Gemini API call failed with status ${response.status}: ${errorText}`);
      }
      
      // Process the response from Gemini
      const geminiResult = await response.json();
      console.log("Gemini API call successful");
      
      // Get the image from the response if available
      let generatedImageData = null;
      
      if (geminiResult.candidates && 
          geminiResult.candidates[0] && 
          geminiResult.candidates[0].content && 
          geminiResult.candidates[0].content.parts) {
        
        for (const part of geminiResult.candidates[0].content.parts) {
          if (part.inline_data && part.inline_data.mime_type.startsWith('image/')) {
            generatedImageData = part.inline_data.data;
            break;
          }
        }
      }
      
      if (!generatedImageData) {
        console.error("No image generated by Gemini API");
        throw new Error("Aucune image générée par l'API Gemini");
      }
      
      console.log("Image data successfully extracted from Gemini response");
      
      // Upload the generated image to Supabase Storage
      try {
        const imageBlob = await fetch(`data:image/jpeg;base64,${generatedImageData}`).then(r => r.blob());
        console.log("Created image blob from base64 data");
        
        // Return the result with the generated image data
        return new Response(JSON.stringify({ 
          success: true, 
          data: [{
            0: {
              image: {
                url: `data:image/jpeg;base64,${generatedImageData}`
              }
            }
          }]
        }), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      } catch (uploadError) {
        console.error("Error processing/uploading image:", uploadError);
        throw new Error(`Erreur lors du traitement de l'image: ${uploadError.message}`);
      }
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

// Helper function to get a color name from hex code
const getColorName = (hexColor: string): string => {
  // French color mapping
  const colorMap: Record<string, string> = {
    // Nude & Neutrals
    '#E6CCAF': 'beige',
    '#B8A99A': 'taupe',
    '#F8F0DD': 'ivoire',
    '#FFF3D9': 'crème',
    '#A17249': 'cappuccino',
    '#D2B48C': 'sable',
    
    // Cool Tones
    '#0A2463': 'bleu marine',
    '#7EC8E3': 'bleu ciel',
    '#C8A2C8': 'lavande',
    '#C8A4D4': 'lilas',
    '#9CAF88': 'vert sauge',
    '#98D8C8': 'menthe',
    
    // Warm Tones
    '#D2042D': 'rouge cerise',
    '#A52A2A': 'rouge brique',
    '#FF7F50': 'corail',
    '#FFE5B4': 'pêche',
    '#CC5500': 'orange brûlé',
    '#E2725B': 'terre cuite',
    
    // Metallic & Effects
    '#D4AF37': 'or',
    '#C0C0C0': 'argent',
    '#B87333': 'cuivre',
    '#E8E8E8': 'chrome',
    '#EAEAEA': 'holographique',
    '#F2F3F4': 'nacré',
    
    // Dark & Deep
    '#000000': 'noir',
    '#800020': 'bordeaux',
    '#673147': 'prune',
    '#7B3F00': 'chocolat',
    '#046307': 'émeraude',
    '#191970': 'bleu nuit',
    
    // Basic colors
    '#FF0000': 'rouge',
    '#FFA500': 'orange',
    '#FFFF00': 'jaune',
    '#00FF00': 'vert',
    '#0000FF': 'bleu',
    '#800080': 'violet',
    '#FFC0CB': 'rose',
    '#FFFFFF': 'blanc',
    '#FFD700': 'doré'
  };
  
  // Return the color name if it's in our map, otherwise just use a generic description
  return colorMap[hexColor] || `personnalisée ${hexColor}`;
};

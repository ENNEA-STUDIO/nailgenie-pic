import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@gradio/client";

// Types pour les options d'ongles
export type NailShape = 'round' | 'square' | 'oval' | 'almond' | 'stiletto' | 'coffin';
export type NailLength = 'short' | 'medium' | 'long';

interface AppContextType {
  handImage: string | null;
  generatedDesign: string | null;
  isLoading: boolean;
  prompt: string;
  nailShape: NailShape;
  nailLength: NailLength;
  nailColor: string;
  setHandImage: (image: string | null) => void;
  setGeneratedDesign: (design: string | null) => void;
  setPrompt: (prompt: string) => void;
  setNailShape: (shape: NailShape) => void;
  setNailLength: (length: NailLength) => void;
  setNailColor: (color: string) => void;
  generateDesign: () => Promise<void>;
  resetState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [handImage, setHandImage] = useState<string | null>(null);
  const [generatedDesign, setGeneratedDesign] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [nailShape, setNailShape] = useState<NailShape>('oval');
  const [nailLength, setNailLength] = useState<NailLength>('medium');
  const [nailColor, setNailColor] = useState<string>('#E6CCAF'); // Beige as default

  const generateDesign = useCallback(async () => {
    if (!handImage) {
      toast.error("Veuillez prendre une photo de votre main d'abord");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Veuillez fournir une description de design");
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Preparing to generate design with params:", { 
        promptLength: prompt.length,
        imageLength: handImage.length,
        nailShape, 
        nailLength, 
        nailColor 
      });

      // Convert base64 to blob
      const base64Data = handImage.replace(/^data:image\/\w+;base64,/, "");
      const byteString = atob(base64Data);
      const buffer = new Uint8Array(byteString.length);
      
      for (let i = 0; i < byteString.length; i++) {
        buffer[i] = byteString.charCodeAt(i);
      }
      
      const imageBlob = new Blob([buffer], { type: "image/jpeg" });
      
      // Create a standardized prompt format with user input only affecting the pattern part
      const lengthText = nailLength === 'short' ? 'short' : nailLength === 'medium' ? 'medium' : 'long';
      const colorName = getColorName(nailColor);
      
      // Template format where only the pattern (user input) changes
      // Using the specific color name instead of "custom shade"
      const fullPrompt = `Transform nails into ${lengthText} ${nailShape} nails painted in ${colorName}. The nails are adorned with ${prompt}, creating a stylish and eye-catching design.`;
      
      console.log("Full prompt:", fullPrompt);
      console.log("Connecting to Gemini Image Edit model...");
      
      // Connect to the Gemini Image Edit model
      const client = await Client.connect("BenKCDQ/Gemini-Image-Edit-nails", {
        hf_token: import.meta.env.VITE_HUGGINGFACE_TOKEN
      });
      
      console.log("Connected to client successfully");
      console.log("Making prediction with prompt:", fullPrompt);
      
      // Make API call to generate the design
      const result = await client.predict("/process_image_and_prompt", {
        composite_pil: imageBlob,
        prompt: fullPrompt,
        gemini_api_key: import.meta.env.VITE_GEMINI_API_KEY,
      });
      
      console.log("Prediction result received:", result ? "success" : "undefined");
      console.log("Result data:", result.data ? "exists" : "missing");
      
      if (result && result.data) {
        try {
          // Based on the console logs, the image URL is nested in the structure:
          // result.data[0][0].image.url
          if (Array.isArray(result.data) && 
              result.data.length > 0 && 
              Array.isArray(result.data[0]) && 
              result.data[0].length > 0 && 
              result.data[0][0] && 
              result.data[0][0].image && 
              result.data[0][0].image.url) {
            
            const imageUrl = result.data[0][0].image.url;
            console.log("Extracted image URL:", imageUrl);
            
            // We'll keep using this temporary URL for the preview
            // The actual saving to storage happens in ResultPreview component
            setGeneratedDesign(imageUrl);
            toast.success("Design généré avec succès!");
          } else {
            console.error("Could not find image URL in the expected structure");
            throw new Error("Structure de données inattendue");
          }
        } catch (error) {
          console.error("Error extracting image URL:", error);
          throw new Error("Erreur lors de l'extraction de l'URL de l'image");
        }
      } else {
        console.error("Unexpected data format:", result);
        throw new Error("Aucune donnée d'image reçue de l'API");
      }
    } catch (error) {
      console.error("Erreur lors de la génération du design:", error);
      toast.error(`Échec de la génération du design: ${error.message || "Veuillez réessayer."}`);
    } finally {
      setIsLoading(false);
    }
  }, [handImage, prompt, nailShape, nailLength, nailColor]);

  // Helper function to get a color name from hex code
  const getColorName = (hexColor: string): string => {
    // Expanded color mapping for more precise color names
    const colorMap: Record<string, string> = {
      // Nude & Neutrals
      '#E6CCAF': 'beige',
      '#B8A99A': 'taupe',
      '#F8F0DD': 'ivory',
      '#FFF3D9': 'cream',
      '#A17249': 'cappuccino',
      '#D2B48C': 'sand',
      
      // Cool Tones
      '#0A2463': 'navy blue',
      '#7EC8E3': 'sky blue',
      '#C8A2C8': 'lavender',
      '#C8A4D4': 'lilac',
      '#9CAF88': 'sage green',
      '#98D8C8': 'mint',
      
      // Warm Tones
      '#D2042D': 'cherry red',
      '#A52A2A': 'brick red',
      '#FF7F50': 'coral',
      '#FFE5B4': 'peach',
      '#CC5500': 'burnt orange',
      '#E2725B': 'terracotta',
      
      // Metallic & Effects
      '#D4AF37': 'gold',
      '#C0C0C0': 'silver',
      '#B87333': 'copper',
      '#E8E8E8': 'chrome',
      '#EAEAEA': 'holographic',
      '#F2F3F4': 'pearl',
      
      // Dark & Deep
      '#000000': 'black',
      '#800020': 'burgundy',
      '#673147': 'plum',
      '#7B3F00': 'chocolate',
      '#046307': 'emerald',
      '#191970': 'midnight blue',
      
      // Basic colors
      '#FF0000': 'red',
      '#FFA500': 'orange',
      '#FFFF00': 'yellow',
      '#00FF00': 'green',
      '#0000FF': 'blue',
      '#800080': 'purple',
      '#FFC0CB': 'pink',
      '#FFFFFF': 'white',
      '#FFD700': 'gold'
    };
    
    // Return the color name if it's in our map, otherwise just call it by its hex value
    return colorMap[hexColor] || `a custom ${hexColor} shade`;
  };

  const resetState = useCallback(() => {
    setHandImage(null);
    setGeneratedDesign(null);
    setPrompt('');
    setNailShape('oval');
    setNailLength('medium');
    setNailColor('#E6CCAF');
  }, []);

  const value = {
    handImage,
    generatedDesign,
    isLoading,
    prompt,
    nailShape,
    nailLength,
    nailColor,
    setHandImage,
    setGeneratedDesign,
    setPrompt,
    setNailShape,
    setNailLength,
    setNailColor,
    generateDesign,
    resetState
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};

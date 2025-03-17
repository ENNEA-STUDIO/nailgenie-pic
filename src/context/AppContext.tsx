import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';
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

const HUGGINGFACE_TOKEN = "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";

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
      // Convert the base64 image to a Blob
      const base64Response = await fetch(handImage);
      const imageBlob = await base64Response.blob();
      
      // Prepare a full prompt that includes nail details
      const fullPrompt = `${prompt} avec des ongles ${nailLength === 'short' ? 'courts' : 
        nailLength === 'medium' ? 'moyens' : 'longs'} de forme ${nailShape} de couleur principale ${nailColor}`;
      
      // Connect to the Gemini Image Edit model
      const client = await Client.connect("BenKCDQ/Gemini-Image-Edit-nails", { hf_token: HUGGINGFACE_TOKEN });
      
      // Make API call to generate the design
      const result = await client.predict("/process_image_and_prompt", {
        composite_pil: imageBlob,
        prompt: fullPrompt,
        gemini_api_key: "", // This is optional according to the API docs
      });
      
      // The result data should contain the URL to the generated image
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        setGeneratedDesign(result.data[0]);
        toast.success("Design généré avec succès!");
      } else {
        throw new Error("No image data received from API");
      }
    } catch (error) {
      console.error("Error generating design:", error);
      toast.error("Échec de la génération du design. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }, [handImage, prompt, nailShape, nailLength, nailColor]);

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

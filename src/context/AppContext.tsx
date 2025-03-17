
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

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
      console.log("Calling edge function with params:", { 
        promptLength: prompt.length,
        imageLength: handImage.length,
        nailShape, 
        nailLength, 
        nailColor 
      });

      // Appel à notre edge function Supabase
      const { data, error } = await supabase.functions.invoke('generate-nail-design', {
        body: {
          imageBase64: handImage,
          prompt,
          nailShape,
          nailLength,
          nailColor
        }
      });
      
      console.log("Edge function response:", data);
      
      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
      }
      
      if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
        console.log("Generated design URL:", typeof data.data[0]);
        setGeneratedDesign(data.data[0]);
        toast.success("Design généré avec succès!");
      } else {
        console.error("Unexpected data format:", data);
        throw new Error("Aucune donnée d'image reçue de l'API");
      }
    } catch (error) {
      console.error("Erreur lors de la génération du design:", error);
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

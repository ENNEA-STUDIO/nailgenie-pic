import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';

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
      toast.error("Please take a photo of your hand first");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please provide a design description");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate AI processing with a timeout
      // This would be replaced with actual API call to an AI service
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // For demo purposes, we're just using the hand image as the result
      // In a real app, this would be the AI-generated image
      setGeneratedDesign(handImage);
      
      toast.success("Design generated successfully!");
    } catch (error) {
      console.error("Error generating design:", error);
      toast.error("Failed to generate design. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [handImage, prompt]);

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

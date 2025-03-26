
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@gradio/client";

// Types pour les options d'ongles
export type NailShape =
  | "round"
  | "square"
  | "oval"
  | "almond"
  | "stiletto"
  | "coffin";
export type NailLength = "short" | "medium" | "long";

interface AppContextType {
  handImage: string | null;
  generatedDesign: string | null;
  isLoading: boolean;
  prompt: string;
  nailShape: NailShape;
  nailLength: NailLength;
  nailColor: string;
  credits: number;
  setHandImage: (image: string | null) => void;
  setGeneratedDesign: (design: string | null) => void;
  setPrompt: (prompt: string) => void;
  setNailShape: (shape: NailShape) => void;
  setNailLength: (length: NailLength) => void;
  setNailColor: (color: string) => void;
  generateDesign: () => Promise<void>;
  resetState: () => void;
  checkCredits: () => Promise<number>;
  addCredits: (amount: number) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface GradioImageData {
  image: {
    path: string;
    url: string;
    size: number | null;
    orig_name: string | null;
    mime_type: string | null;
    is_stream: boolean;
    meta: {
      _type: string;
    };
  };
  caption: string | null;
}

interface GradioResult {
  type: string;
  time: Date;
  data: [GradioImageData[], string];
  endpoint: string;
  fn_index: number;
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [handImage, setHandImage] = useState<string | null>(null);
  const [generatedDesign, setGeneratedDesign] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [nailShape, setNailShape] = useState<NailShape>("oval");
  const [nailLength, setNailLength] = useState<NailLength>("medium");
  const [nailColor, setNailColor] = useState<string>("#E6CCAF"); // Beige as default
  const [credits, setCredits] = useState<number>(0);

  useEffect(() => {
    checkCredits();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "SIGNED_IN") {
          checkCredits();
        } else if (event === "SIGNED_OUT") {
          setCredits(0);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkCredits = useCallback(async (): Promise<number> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setCredits(0);
        return 0;
      }

      const { data, error } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', sessionData.session.user.id)
        .single();

      if (error) {
        console.error("Error fetching credits:", error);
        return 0;
      }

      if (data) {
        setCredits(data.credits);
        return data.credits;
      } else {
        // Changed from 3 to 5 credits for new users
        const { data: newData, error: insertError } = await supabase
          .from('user_credits')
          .insert([{ user_id: sessionData.session.user.id, credits: 5 }])
          .select()
          .single();

        if (insertError) {
          console.error("Error creating initial credits:", insertError);
          return 0;
        }

        setCredits(newData?.credits || 0);
        return newData?.credits || 0;
      }
    } catch (error) {
      console.error("Error checking credits:", error);
      return 0;
    }
  }, []);

  const addCredits = useCallback(async (amount: number): Promise<boolean> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("You must be logged in to add credits");
        return false;
      }

      const { data, error } = await supabase.rpc('add_user_credits', { 
        user_id_param: sessionData.session.user.id,
        credits_to_add: amount
      });

      if (error) {
        console.error("Error adding credits:", error);
        toast.error("Failed to add credits");
        return false;
      }

      await checkCredits();
      return true;
    } catch (error) {
      console.error("Error adding credits:", error);
      toast.error("Failed to add credits");
      return false;
    }
  }, [checkCredits]);

  const urlToBlob = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    return await response.blob();
  };

  const generateDesign = useCallback(async () => {
    if (!handImage) {
      toast.error("Veuillez prendre une photo de votre main d'abord");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Veuillez fournir une description de design");
      return;
    }

    const currentCredits = await checkCredits();
    if (currentCredits < 1) {
      toast.error("Vous n'avez pas assez de crédits. Achetez-en plus pour continuer.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Preparing to generate design with params:", {
        promptLength: prompt.length,
        imageLength: handImage.length,
        nailShape,
        nailLength,
        nailColor,
      });

      const base64Data = handImage.replace(/^data:image\/\w+;base64,/, "");
      const byteString = atob(base64Data);
      const buffer = new Uint8Array(byteString.length);

      for (let i = 0; i < byteString.length; i++) {
        buffer[i] = byteString.charCodeAt(i);
      }

      const imageBlob = new Blob([buffer], { type: "image/jpeg" });

      const lengthText =
        nailLength === "short"
          ? "short"
          : nailLength === "medium"
          ? "medium"
          : "long";
      const colorName = getColorName(nailColor);

      const fullPrompt = `Transform nails into ${lengthText} ${nailShape} nails painted in ${colorName}. The nails are adorned with ${prompt}, creating a stylish and eye-catching design.`;

      console.log("Full prompt:", fullPrompt);
      console.log("Connecting to Gemini Image Edit model...");

      const client = await Client.connect("BenKCDQ/Gemini-Image-Edit-nails", {
        hf_token: import.meta.env.VITE_HUGGINGFACE_TOKEN,
      });

      console.log("Connected to client successfully");
      console.log("Making prediction with prompt:", fullPrompt);

      const result = await client.predict("/process_image_and_prompt", {
        composite_pil: imageBlob,
        prompt: fullPrompt,
        gemini_api_key: import.meta.env.VITE_GEMINI_API_KEY,
      });

      console.log(
        "Prediction result received:",
        result ? "success" : "undefined"
      );
      console.log("Result data:", result.data ? "exists" : "missing");
      console.log("Full result object:", JSON.stringify(result, null, 2));

      if (result && "data" in result) {
        try {
          const gradioResult = result as unknown as GradioResult;
          const imageUrl = gradioResult.data[0]?.[0]?.image?.url;

          if (!imageUrl) {
            throw new Error("URL de l'image non trouvée");
          }

          console.log("Gradio URL:", imageUrl);

          try {
            const response = await fetch(imageUrl, {
              headers: {
                Authorization: `Bearer ${
                  import.meta.env.VITE_HUGGINGFACE_TOKEN
                }`,
              },
            });

            if (!response.ok) {
              throw new Error(`Failed to fetch image: ${response.status}`);
            }

            const imageBlob = await response.blob();
            console.log("Blob size:", imageBlob.size);

            const fileName = `nail-designs/${Date.now()}.webp`;
            console.log("Attempting upload to:", fileName);

            const { data: uploadData, error: uploadError } =
              await supabase.storage
                .from("nail_designs")
                .upload(fileName, imageBlob, {
                  contentType: "image/webp",
                  upsert: true,
                });

            if (uploadError) {
              console.error("Upload error details:", uploadError);
              throw uploadError;
            }

            const {
              data: { publicUrl },
            } = supabase.storage.from("nail_designs").getPublicUrl(fileName);

            console.log("Final URL:", publicUrl);
            setGeneratedDesign(publicUrl);
            toast.success("Design généré avec succès!");

            const { error: creditError } = await supabase.rpc('use_credit');
            if (creditError) {
              console.error("Error deducting credit:", creditError);
            } else {
              setCredits(prev => Math.max(0, prev - 1));
            }
          } catch (fetchError) {
            console.error("Error fetching/processing image:", fetchError);
            throw new Error(
              `Erreur lors de la récupération de l'image: ${fetchError.message}`
            );
          }
        } catch (error) {
          console.error("Detailed error:", error);
          toast.error(`Erreur: ${error.message || "Erreur inconnue"}`);
        }
      } else {
        console.error("Unexpected data format:", result);
        throw new Error("Aucune donnée d'image reçue de l'API");
      }
    } catch (error) {
      console.error("Erreur lors de la génération du design:", error);
      toast.error(
        `Échec de la génération du design: ${
          error.message || "Veuillez réessayer."
        }`
      );
    } finally {
      setIsLoading(false);
    }
  }, [handImage, prompt, nailShape, nailLength, nailColor, checkCredits]);

  const getColorName = (hexColor: string): string => {
    const colorMap: Record<string, string> = {
      "#E6CCAF": "beige",
      "#B8A99A": "taupe",
      "#F8F0DD": "ivory",
      "#FFF3D9": "cream",
      "#A17249": "cappuccino",
      "#D2B48C": "sand",

      "#0A2463": "navy blue",
      "#7EC8E3": "sky blue",
      "#C8A2C8": "lavender",
      "#C8A4D4": "lilac",
      "#9CAF88": "sage green",
      "#98D8C8": "mint",

      "#D2042D": "cherry red",
      "#A52A2A": "brick red",
      "#FF7F50": "coral",
      "#FFE5B4": "peach",
      "#CC5500": "burnt orange",
      "#E2725B": "terracotta",

      "#D4AF37": "gold",
      "#C0C0C0": "silver",
      "#B87333": "copper",
      "#E8E8E8": "chrome",
      "#EAEAEA": "holographic",
      "#F2F3F4": "pearl",

      "#000000": "black",
      "#800020": "burgundy",
      "#673147": "plum",
      "#7B3F00": "chocolate",
      "#046307": "emerald",
      "#191970": "midnight blue",

      "#FF0000": "red",
      "#FFA500": "orange",
      "#FFFF00": "yellow",
      "#00FF00": "green",
      "#0000FF": "blue",
      "#800080": "purple",
      "#FFC0CB": "pink",
      "#FFFFFF": "white",
      "#FFD700": "gold",
    };

    return colorMap[hexColor] || `a custom ${hexColor} shade`;
  };

  const resetState = useCallback(() => {
    setHandImage(null);
    setGeneratedDesign(null);
    setPrompt("");
    setNailShape("oval");
    setNailLength("medium");
    setNailColor("#E6CCAF");
  }, []);

  const value = {
    handImage,
    generatedDesign,
    isLoading,
    prompt,
    nailShape,
    nailLength,
    nailColor,
    credits,
    setHandImage,
    setGeneratedDesign,
    setPrompt,
    setNailShape,
    setNailLength,
    setNailColor,
    generateDesign,
    resetState,
    checkCredits,
    addCredits,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
};

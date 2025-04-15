
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
import { colorCategories } from "@/utils/colorCategories";

// Types pour les options d'ongles
export type NailShape =
  | "round"
  | "square"
  | "oval"
  | "almond"
  | "stiletto"
  | "coffin"
  | "squoval"
  | "ballerina"
  | "duck"
  | "lips"
  | "edge"
  | "arrowhead"
  | "flare"
  | "lipstick";
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
  hasUnlimitedSubscription: boolean;
  subscriptionStart: string | null;
  subscriptionEnd: string | null;
  setHandImage: (image: string | null) => void;
  setGeneratedDesign: (design: string | null) => void;
  setPrompt: (prompt: string) => void;
  setNailShape: (shape: NailShape) => void;
  setNailLength: (length: NailLength) => void;
  setNailColor: (color: string) => void;
  generateDesign: () => Promise<void>;
  resetState: () => void;
  checkCredits: () => Promise<number>;
  checkSubscription: () => Promise<void>;
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

// Configuration du mécanisme de relance
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

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
  const [isProcessingInvitation, setIsProcessingInvitation] = useState<boolean>(false);
  const [hasUnlimitedSubscription, setHasUnlimitedSubscription] = useState<boolean>(false);
  const [subscriptionStart, setSubscriptionStart] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  useEffect(() => {
    checkCredits();
    checkSubscription();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.id);
        
        if (event === "SIGNED_IN" && session?.user) {
          const pendingInviteCode = localStorage.getItem("pendingInviteCode");
          
          if (pendingInviteCode && session?.user && !isProcessingInvitation) {
            console.log("Found pending invite code:", pendingInviteCode);
            setIsProcessingInvitation(true);
            
            try {
              const { data: response, error } = await supabase.functions.invoke(
                "use-invitation", 
                {
                  body: {
                    invitationCode: pendingInviteCode,
                    newUserId: session.user.id,
                  },
                }
              );
              
              if (error) {
                console.error("Error applying invitation code:", error);
                toast.error(
                  "Impossible d'appliquer votre code d'invitation. Mais ne vous inquiétez pas, vous avez toujours vos crédits de base."
                );
              } else if (response?.success) {
                console.log("Invitation applied successfully:", response);
                toast.success(
                  "Invitation appliquée avec succès! Vous avez reçu 10 crédits (5 de base + 5 bonus)."
                );
              } else if (response && !response.success) {
                console.error("Invitation error:", response.error);
                toast.error(
                  `Impossible d'appliquer l'invitation: ${response.error}`
                );
              }
              
              localStorage.removeItem("pendingInviteCode");
            } catch (err) {
              console.error("Error processing invitation:", err);
              toast.error("Erreur lors du traitement de l'invitation. Veuillez réessayer plus tard.");
            } finally {
              await checkCredits();
              setIsProcessingInvitation(false);
            }
          } else {
            checkCredits();
            checkSubscription();
          }
        } else if (event === "SIGNED_OUT") {
          setCredits(0);
          setHasUnlimitedSubscription(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkSubscription = useCallback(async (): Promise<void> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setHasUnlimitedSubscription(false);
        setSubscriptionStart(null);
        setSubscriptionEnd(null);
        return;
      }

      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("status, price_id, created_at, current_period_end")
        .eq("user_id", sessionData.session.user.id)
        .eq("status", "active")
        .maybeSingle();

      if (error) {
        console.error("Error checking subscription:", error);
        setHasUnlimitedSubscription(false);
        setSubscriptionStart(null);
        setSubscriptionEnd(null);
        return;
      }

      const hasUnlimited = !!data;
      setHasUnlimitedSubscription(hasUnlimited);
      
      if (data) {
        setSubscriptionStart(data.created_at);
        setSubscriptionEnd(data.current_period_end);
      } else {
        setSubscriptionStart(null);
        setSubscriptionEnd(null);
      }
      
      console.log("User subscription status:", data ? "Active" : "None");

      if (hasUnlimited) {
        await ensureHighCreditCount(sessionData.session.user.id);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      setHasUnlimitedSubscription(false);
      setSubscriptionStart(null);
      setSubscriptionEnd(null);
    }
  }, []);

  const ensureHighCreditCount = async (userId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from("user_credits")
        .select("credits")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error checking user credits:", error);
        return;
      }

      if (!data || data.credits < 1000000) {
        const { error: updateError } = await supabase
          .from("user_credits")
          .upsert({
            user_id: userId,
            credits: 1000000,
            updated_at: new Date().toISOString()
          });

        if (updateError) {
          console.error("Error updating credits for unlimited user:", updateError);
        } else {
          console.log("Updated credits to 1,000,000 for unlimited subscription user");
          setCredits(1000000);
        }
      }
    } catch (error) {
      console.error("Error ensuring high credit count:", error);
    }
  };

  const checkCredits = useCallback(async (): Promise<number> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setCredits(0);
        return 0;
      }

      await checkSubscription();
      
      if (hasUnlimitedSubscription) {
        return 1000000;
      }

      const { data, error } = await supabase
        .from("user_credits")
        .select("credits")
        .eq("user_id", sessionData.session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching credits:", error);
        return 0;
      }

      if (data) {
        setCredits(data.credits);
        return data.credits;
      } else {
        console.log("No credits found for user, creating initial credits (5)");
        const { data: newData, error: insertError } = await supabase
          .from("user_credits")
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
  }, [hasUnlimitedSubscription, checkSubscription]);

  const addCredits = useCallback(
    async (amount: number): Promise<boolean> => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          toast.error("Vous devez être connecté pour ajouter des crédits");
          return false;
        }

        const { data, error } = await supabase.rpc("add_user_credits", {
          user_id_param: sessionData.session.user.id,
          credits_to_add: amount,
        });

        if (error) {
          console.error("Error adding credits:", error);
          toast.error("Échec de l'ajout de crédits");
          return false;
        }

        await checkCredits();
        return true;
      } catch (error) {
        console.error("Error adding credits:", error);
        toast.error("Échec de l'ajout de crédits");
        return false;
      }
    },
    [checkCredits]
  );

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

    if (!hasUnlimitedSubscription) {
      const currentCredits = await checkCredits();
      if (currentCredits < 1) {
        toast.error(
          "Vous n'avez pas assez de crédits. Achetez-en plus pour continuer."
        );
        return;
      }
    }

    setIsLoading(true);
    let retryCount = 0;
    let success = false;

    while (retryCount <= MAX_RETRIES && !success) {
      try {
        if (retryCount > 0) {
          console.log(`Tentative de génération #${retryCount + 1}/${MAX_RETRIES + 1}`);
          toast.info(`Relance de la génération (essai ${retryCount + 1}/${MAX_RETRIES + 1})...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * retryCount));
        }

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

        const isGradient = nailColor.includes("gradient");
        const colorKey = isGradient ? `${nailColor}_gradient` : nailColor;
        const colorName = getColorName(colorKey);

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

              if (!hasUnlimitedSubscription) {
                const { error: creditError } = await supabase.rpc("use_credit");
                if (creditError) {
                  console.error("Error deducting credit:", creditError);
                } else {
                  setCredits((prev) => Math.max(0, prev - 1));
                }
              }
              
              success = true;
            } catch (fetchError) {
              console.error("Error fetching/processing image:", fetchError);
              throw new Error(
                `Erreur lors de la récupération de l'image: ${fetchError.message}`
              );
            }
          } catch (error) {
            console.error("Detailed error:", error);
            throw new Error(`Erreur: ${error.message || "Erreur inconnue"}`);
          }
        } else {
          console.error("Unexpected data format:", result);
          throw new Error("Aucune donnée d'image reçue de l'API");
        }
      } catch (error) {
        console.error(`Erreur lors de la génération (essai ${retryCount + 1}/${MAX_RETRIES + 1}):`, error);
        
        if (retryCount === MAX_RETRIES) {
          toast.error(
            `Échec de la génération après ${MAX_RETRIES + 1} tentatives: ${
              error.message || "Veuillez réessayer."
            }`
          );
        }
        
        retryCount++;
      }
    }

    setIsLoading(false);
  }, [handImage, prompt, nailShape, nailLength, nailColor, checkCredits, hasUnlimitedSubscription]);

  const getColorName = (hexColor: string): string => {
    const colorMap: Record<string, string> = {
      "#E6CCAF": "soft beige",
      "#FFFFFF": "milky white",
      "#FFC0CB": "blush pink",
      "#B8A99A": "taupe",
      "#FFF3D9": "cream",
      "#E8E8E8": "icy grey",
      "#F2F3F4": "transparent gloss",

      "#EAEAEA": "holographic pearl",
      "#C0C0C0": "baby chrome",
      "#98D8C8": "soft mint",
      "#FFC0CB_gradient": "blush pink and burgundy gradient",
      "#FFF3D9_gradient": "cream and chocolate gradient",
      "#B0E0E6_gradient": "baby blue and navy gradient",
      "#9CAF88_gradient": "sage green and gold gradient",
      "#C8A4D4_gradient": "lilac and silver gradient",
      "#FFE5B4_gradient": "peach and coral gradient",
      "#E2725B_gradient": "terracotta and olive gradient",
      "#FF69B4_gradient": "pink and electric blue gradient",
      "#000000_gradient1": "black and nude gradient",
      "#014421_gradient": "forest green and champagne gradient",
      "#E6E6FA_gradient1": "lavender and mustard gradient",
      "#7B3F00_gradient": "rust and dusty pink gradient",
      "#FFFFFF_gradient": "white and emerald gradient",
      "#A5F2F3_gradient": "ice blue and pale grey gradient",
      "#B76E79_gradient": "rose gold and matte plum gradient",
      "#98D8C8_gradient": "soft mint and pearl gradient",
      "#FFFACD_gradient1": "pastel yellow and sky blue gradient",
      "#000000_gradient2": "jet black and hot pink gradient",
      "#556B2F_gradient": "olive green and bronze gradient",
      "#C8A2C8_gradient": "mauve and cream gradient",
      "#E6E6FA_gradient2": "soft lavender and frosted white gradient",
      "#B0E0E6_gradient2": "powder blue and citrus orange gradient",
      "#F2F3F4_gradient": "transparent gloss and chrome gradient",
      "#FFFACD_gradient2": "butter yellow and baby pink gradient",
      "#191970_gradient": "midnight blue and silver chrome gradient",

      "#FF0000": "red",
      "#FFA500": "orange",
      "#00FF00": "green",
      "#0000FF": "blue",
      "#800080": "purple",
      "#FFD700": "gold",
    };

    if (hexColor.includes("_gradient")) {
      return colorMap[hexColor] || `a custom two-tone gradient`;
    }

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
    hasUnlimitedSubscription,
    subscriptionStart,
    subscriptionEnd,
    setHandImage,
    setGeneratedDesign,
    setPrompt,
    setNailShape,
    setNailLength,
    setNailColor,
    generateDesign,
    resetState,
    checkCredits,
    checkSubscription,
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

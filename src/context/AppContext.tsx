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
  const [isProcessingInvitation, setIsProcessingInvitation] = useState<boolean>(false);

  useEffect(() => {
    checkCredits();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.id);
        
        if (event === "SIGNED_IN" && session?.user) {
          // When a user signs in (including after email verification)
          // Check if there's a pending invite code
          const pendingInviteCode = localStorage.getItem("pendingInviteCode");
          
          if (pendingInviteCode && session?.user && !isProcessingInvitation) {
            console.log("Found pending invite code:", pendingInviteCode);
            setIsProcessingInvitation(true);
            
            try {
              // Process the invitation
              const { data: inviteResult, error: inviteError } = 
                await supabase.functions.invoke("use-invitation", {
                  body: {
                    invitationCode: pendingInviteCode,
                    newUserId: session.user.id,
                  },
                });
              
              if (inviteError) {
                console.error("Error applying invitation code:", inviteError);
                toast.error(
                  "Couldn't apply your invitation code. But don't worry, you still get base credits."
                );
              } else if (inviteResult && inviteResult.success) {
                console.log("Invitation applied successfully:", inviteResult);
                toast.success(
                  "Invitation applied successfully! You've received bonus credits."
                );
              } else if (inviteResult && !inviteResult.success) {
                console.error("Invitation error:", inviteResult.error);
                toast.error(
                  `Couldn't apply invitation: ${inviteResult.error}`
                );
              }
              
              // Clear the pending invite code
              localStorage.removeItem("pendingInviteCode");
            } catch (err) {
              console.error("Error processing invitation:", err);
              toast.error("Error processing invitation. Please try again later.");
            } finally {
              // Always check credits after processing the invitation
              await checkCredits();
              setIsProcessingInvitation(false);
            }
          } else {
            // No invite code, just check credits
            checkCredits();
          }
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
        // Create initial credits (5) for user
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
  }, []);

  const addCredits = useCallback(
    async (amount: number): Promise<boolean> => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          toast.error("You must be logged in to add credits");
          return false;
        }

        const { data, error } = await supabase.rpc("add_user_credits", {
          user_id_param: sessionData.session.user.id,
          credits_to_add: amount,
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

    const currentCredits = await checkCredits();
    if (currentCredits < 1) {
      toast.error(
        "Vous n'avez pas assez de crédits. Achetez-en plus pour continuer."
      );
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

      // Check if it's a gradient color (from bi-color category)
      const isGradient = nailColor.includes("gradient");
      // For gradient colors, we add a special suffix to use our mapping properly
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

            const { error: creditError } = await supabase.rpc("use_credit");
            if (creditError) {
              console.error("Error deducting credit:", creditError);
            } else {
              setCredits((prev) => Math.max(0, prev - 1));
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
      // Nude & Minimalist
      "#E6CCAF": "soft beige",
      "#FFFFFF": "milky white",
      "#FFC0CB": "blush pink",
      "#B8A99A": "taupe",
      "#FFF3D9": "cream",
      "#E8E8E8": "icy grey",
      "#F2F3F4": "transparent gloss",

      // Glazed & Pearlcore
      // '#E8E8E8': 'glazed donut', // Already defined above
      // '#FFFFFF': 'iridescent white', // Already defined above
      "#EAEAEA": "holographic pearl",
      "#C0C0C0": "baby chrome",
      // '#F2F3F4': 'soft opal', // Already defined above

      // Y2K / Pop Vibes
      "#FF69B4": "hot pink",
      "#1E90FF": "electric blue",
      "#39FF14": "neon green",
      "#FFFF00": "acid yellow",
      "#FF7F50": "candy orange",
      // '#C0C0C0': 'silver chrome', // Already defined above
      "#9370DB": "bubblegum purple",

      // Dark & Mysterious
      "#800020": "deep burgundy",
      "#191970": "midnight blue",
      "#3D0C02": "black cherry",
      "#014421": "forest green",
      "#2C3539": "gunmetal",
      "#000000": "matte black",
      "#551A8B": "cosmic purple",

      // Luxury / Metallic
      "#D4AF37": "24k gold",
      "#B76E79": "rose gold",
      "#E5E4E2": "platinum",
      "#F7E7CE": "champagne",
      "#B87333": "bronze",
      "#8A9A5B": "pewter",
      "#046307": "emerald green",
      "#0F52BA": "sapphire blue",

      // Romantic / Pastelcore
      "#C8A4D4": "pastel lilac",
      "#B0E0E6": "baby blue",
      "#98D8C8": "soft mint",
      // '#FFC0CB': 'powder pink', // Already defined above
      "#FFFACD": "butter yellow",
      "#C8A2C8": "mauve",
      "#FFE5B4": "peachy nude",

      // Bold & Graphic
      "#D2042D": "primary red",
      // '#000000': 'jet black', // Already defined above
      // '#FFFFFF': 'whiteout', // Already defined above
      "#0A2463": "high contrast blue",
      "#FF7F00": "citrus orange",

      // Goth / Punk
      // '#000000': 'matte black', // Already defined above
      "#8B0000": "blood red",
      "#808080": "ash grey",
      "#7B3F00": "rust brown",
      "#673147": "deep plum",
      "#556B2F": "olive green",
      "#343434": "dark chrome",

      // Frozen / Clean Girl
      "#A5F2F3": "ice blue",
      "#E6E6FA": "soft lavender",
      "#F0FFFF": "frosted white",
      // '#C0C0C0': 'shimmering grey', // Already defined above
      "#F5F5F5": "translucent glaze",

      // Artistic / Painterly
      // '#FF7F50': 'coral', // Already defined above
      // '#556B2F': 'olive', // Already defined above
      "#E2725B": "terracotta",
      // '#000000': 'ink black', // Already defined above
      "#CC7722": "ochre",

      // Nature-Inspired
      "#9CAF88": "sage green",
      "#A17249": "clay",
      // '#E2725B': 'terracotta', // Already defined above
      "#C08081": "dusty rose",
      "#0077BE": "ocean blue",
      "#D2B48C": "sand",
      // '#8A9A5B': 'moss', // Already defined above

      // Futuristic
      // '#C0C0C0': 'silver', // Already defined above
      "#4682B4": "reflective blue",
      // '#000000': 'oil-slick black', // Already defined above
      "#8A2BE2": "ultraviolet",
      "#BFFF00": "lime techno",
      // '#EAEAEA': 'holo chrome', // Already defined above

      // New Bi-Color mappings
      // We add them with their gradient names so they'll be used properly in the prompt
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

      // Basic colors
      "#FF0000": "red",
      "#FFA500": "orange",
      "#00FF00": "green",
      "#0000FF": "blue",
      "#800080": "purple",
      "#FFD700": "gold",
    };

    // Check if it's a gradient color by seeing if the hex code has a _gradient suffix
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

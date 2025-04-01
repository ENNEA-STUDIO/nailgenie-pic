
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "./LanguageContext";

interface AppContextType {
  credits: number;
  isSubscribed: boolean;
  subscription: any | null;
  checkCredits: () => Promise<void>;
  checkSubscription: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [credits, setCredits] = useState<number>(0);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<any | null>(null);
  const { language } = useLanguage();

  // Function to check user credits
  const checkCredits = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;

      const { data, error } = await supabase
        .from("user_credits")
        .select("credits")
        .eq("user_id", sessionData.session.user.id)
        .single();

      if (error) {
        if (error.code !== "PGRST116") {
          // PGRST116 is "No rows returned" error, which is expected for new users
          console.error("Error fetching credits:", error);
        }
        setCredits(0);
      } else {
        setCredits(data.credits);
      }
    } catch (error) {
      console.error("Error in checkCredits:", error);
      setCredits(0);
    }
  };

  // Function to check user subscription status
  const checkSubscription = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setIsSubscribed(false);
        setSubscription(null);
        return;
      }

      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      });

      if (error) {
        console.error("Error checking subscription:", error);
        setIsSubscribed(false);
        setSubscription(null);
        return;
      }

      setIsSubscribed(data.isSubscribed);
      setSubscription(data.subscription);
      
      // If subscribed, make sure credits is set to a high number to indicate unlimited
      if (data.isSubscribed) {
        setCredits(9999);
      } else {
        // If not subscribed, refresh regular credits
        await checkCredits();
      }
    } catch (error) {
      console.error("Error in checkSubscription:", error);
      setIsSubscribed(false);
      setSubscription(null);
    }
  };

  // Initial loading of user credits and subscription status
  useEffect(() => {
    const loadUserData = async () => {
      await checkSubscription();
    };

    loadUserData();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "SIGNED_IN") {
          await checkSubscription();
        } else if (event === "SIGNED_OUT") {
          setCredits(0);
          setIsSubscribed(false);
          setSubscription(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider value={{ credits, isSubscribed, subscription, checkCredits, checkSubscription }}>
      {children}
    </AppContext.Provider>
  );
};

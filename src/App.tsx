
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AppProvider } from "./context/AppContext";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { toast } from "sonner";

import Index from "./pages/Index";
import CameraPage from "./pages/CameraPage";
import PromptPage from "./pages/PromptPage";
import PromptInputPage from "./pages/PromptInputPage";
import ResultPage from "./pages/ResultPage";
import OnboardingPage from "./pages/OnboardingPage";
import NotFound from "./pages/NotFound";

// Create authentication context
type AuthUser = {
  id: string;
  email?: string;
};

export type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
};

export const queryClient = new QueryClient();

const App = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check current auth state
    const getCurrentUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session?.user) {
          setAuthState({
            user: {
              id: data.session.user.id,
              email: data.session.user.email,
            },
            isLoading: false,
          });
        } else {
          setAuthState({ user: null, isLoading: false });
        }
      } catch (error) {
        console.error("Error getting current user:", error);
        setAuthState({ user: null, isLoading: false });
      }
    };

    getCurrentUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setAuthState({
            user: {
              id: session.user.id,
              email: session.user.email,
            },
            isLoading: false,
          });
          toast.success("Connexion réussie");
        } else if (event === "SIGNED_OUT") {
          setAuthState({ user: null, isLoading: false });
          toast.info("Vous êtes déconnecté");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (authState.isLoading) {
      return <div className="flex items-center justify-center h-screen">Chargement...</div>;
    }
    
    if (!authState.user) {
      toast.error("Veuillez vous connecter pour accéder à cette page");
      return <Navigate to="/onboarding" replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route 
                  path="/camera" 
                  element={
                    <ProtectedRoute>
                      <CameraPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/prompt" 
                  element={
                    <ProtectedRoute>
                      <PromptPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/prompt-input" 
                  element={
                    <ProtectedRoute>
                      <PromptInputPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/result" 
                  element={
                    <ProtectedRoute>
                      <ResultPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;


import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AppProvider } from "./context/AppContext";
import { LanguageProvider } from "./context/LanguageContext";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";

import CameraPage from "./pages/CameraPage";
import PromptPage from "./pages/PromptPage";
import PromptInputPage from "./pages/PromptInputPage";
import ResultPage from "./pages/ResultPage";
import GalleryPage from "./pages/GalleryPage";
import FeedPage from "./pages/FeedPage";
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
        } else if (event === "SIGNED_OUT") {
          setAuthState({ user: null, isLoading: false });
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
      return <Navigate to="/onboarding" replace />;
    }
    
    return <>{children}</>;
  };

  // Redirect based on auth state
  const HomeRedirect = () => {
    if (authState.isLoading) {
      return <div className="flex items-center justify-center h-screen">Chargement...</div>;
    }
    
    return authState.user ? <Navigate to="/camera" replace /> : <Navigate to="/onboarding" replace />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AppProvider>
            <BrowserRouter>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<HomeRedirect />} />
                  <Route 
                    path="/onboarding" 
                    element={
                      authState.user ? <Navigate to="/camera" replace /> : <OnboardingPage />
                    } 
                  />
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
                  <Route 
                    path="/gallery" 
                    element={
                      <ProtectedRoute>
                        <GalleryPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/feed" 
                    element={
                      <ProtectedRoute>
                        <FeedPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </BrowserRouter>
          </AppProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

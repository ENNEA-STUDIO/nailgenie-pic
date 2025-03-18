
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AppProvider } from "./context/AppContext";

import Index from "./pages/Index";
import CameraPage from "./pages/CameraPage";
import PromptPage from "./pages/PromptPage";
import PromptInputPage from "./pages/PromptInputPage";
import ResultPage from "./pages/ResultPage";
import OnboardingPage from "./pages/OnboardingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/camera" element={<CameraPage />} />
              <Route path="/prompt" element={<PromptPage />} />
              <Route path="/prompt-input" element={<PromptInputPage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

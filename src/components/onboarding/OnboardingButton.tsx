
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';

const OnboardingButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useLanguage();
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const handleButtonClick = () => {
    if (isAuthenticated) {
      navigate('/camera');
    } else {
      navigate('/onboarding');
    }
  };
  
  // Don't render the button on the onboarding page or if already on the camera page
  if (location.pathname === '/onboarding' || (isAuthenticated && location.pathname === '/camera')) {
    return null;
  }
  
  if (isLoading) {
    return null; // Don't show button while checking auth status
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10"
    >
      <Button 
        onClick={handleButtonClick}
        className="shadow-lg px-6 py-6 h-auto rounded-full group"
        size="lg"
      >
        <span>{isAuthenticated ? (language === 'fr' ? "Prendre une photo" : "Take a photo") : (language === 'fr' ? "Se connecter" : "Login")}</span>
        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </motion.div>
  );
};

export default OnboardingButton;

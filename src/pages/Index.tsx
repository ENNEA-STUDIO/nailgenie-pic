
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Camera, UserRound, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/50">
      <Layout className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute top-[20%] left-[10%] w-[25%] h-[25%] bg-pink-200/20 rounded-full blur-3xl" />
        </div>
      
        <div className="flex flex-col items-center justify-center px-6 py-16 h-full">
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="mb-8"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-pink-400/30 to-purple-400/30 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Sparkles size={36} className="text-primary" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="absolute -top-2 -right-2 bg-accent text-white text-xs font-medium px-2 py-1 rounded-full"
              >
                AI
              </motion.div>
            </div>
          </motion.div>
          
          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold mb-3 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            NailGenie
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg text-muted-foreground text-center mb-10 max-w-xs"
          >
            Transform your nails with AI-generated designs
          </motion.p>
          
          {/* Features */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-1 gap-4 w-full max-w-xs mb-12"
          >
            {[
              { id: 1, text: "Take a photo of your hand" },
              { id: 2, text: "Describe your dream nail design" },
              { id: 3, text: "Get AI-generated nail art" }
            ].map((feature) => (
              <div 
                key={feature.id}
                className="flex items-center gap-3 p-3 bg-secondary/80 backdrop-blur-sm rounded-xl border border-white/10 shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400/40 to-purple-400/40 flex items-center justify-center text-primary font-medium shadow-inner">
                  {feature.id}
                </div>
                <p className="text-sm">{feature.text}</p>
              </div>
            ))}
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col gap-4 w-full max-w-xs mt-4"
          >
            {isAuthenticated ? (
              <motion.div 
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0px 0px 25px rgba(214, 31, 255, 0.3)"
                }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden group"
              >
                <Button 
                  onClick={() => navigate('/camera')}
                  className="w-full h-14 rounded-xl font-semibold text-base text-white shadow-md"
                  style={{
                    background: "linear-gradient(45deg, #FF719A 0%, #FF9674 50%, #FFD29F 100%)",
                    boxShadow: "0px 8px 15px rgba(219, 39, 119, 0.25), inset 0px 1px 3px rgba(255, 255, 255, 0.4)",
                  }}
                >
                  <span className="absolute inset-0 overflow-hidden rounded-xl">
                    <span className="absolute inset-0 z-10 opacity-0 group-hover:opacity-70 transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.8),_transparent_60%)] blur-xl"></span>
                  </span>
                  <Camera className="mr-2 h-5 w-5" />
                  <span>Prendre une photo</span>
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div 
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0px 0px 25px rgba(214, 31, 255, 0.3)"
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden group"
                >
                  <Button 
                    onClick={() => navigate('/onboarding')}
                    className="w-full h-14 rounded-xl font-semibold text-base text-white shadow-md"
                    style={{
                      background: "linear-gradient(45deg, #FF719A 0%, #FF9674 50%, #FFD29F 100%)",
                      boxShadow: "0px 8px 15px rgba(219, 39, 119, 0.25), inset 0px 1px 3px rgba(255, 255, 255, 0.4)",
                    }}
                  >
                    <span className="absolute inset-0 overflow-hidden rounded-xl">
                      <span className="absolute inset-0 z-10 opacity-0 group-hover:opacity-70 transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.8),_transparent_60%)] blur-xl"></span>
                    </span>
                    <UserRound className="mr-2 h-5 w-5" />
                    <span>Créer un compte</span>
                  </Button>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button 
                    onClick={() => navigate('/onboarding')}
                    variant="outline"
                    className="w-full h-12 rounded-xl border-pink-200/50 bg-white/50 backdrop-blur-sm hover:bg-white/70 text-foreground"
                  >
                    <LogIn className="mr-2 h-4 w-4 text-primary" />
                    <span>Se connecter</span>
                  </Button>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </Layout>
    </div>
  );
};

export default Index;

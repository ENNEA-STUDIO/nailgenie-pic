
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Camera, UserRound, LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success("Connexion réussie!");
      navigate('/camera');
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      toast.error(error.message || "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/50">
      <Layout className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute top-[20%] left-[10%] w-[25%] h-[25%] bg-pink-200/20 rounded-full blur-3xl" />
        </div>
      
        <div className="flex flex-col items-center justify-center px-6 py-12 h-full">
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="mb-6"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-400/30 to-purple-400/30 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Sparkles size={30} className="text-primary" />
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
            className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            NailGenie
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-sm text-muted-foreground text-center mb-8 max-w-xs"
          >
            Transform your nails with AI-generated designs
          </motion.p>
          
          {isAuthenticated ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-full max-w-xs"
            >
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
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-full max-w-xs"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100/50">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                      <Mail size={16} className="text-pink-500" />
                      <span>Email</span>
                    </Label>
                    <div className="relative">
                      <Input 
                        type="email" 
                        placeholder="votreemail@exemple.com" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 pl-10 rounded-xl border-pink-100 bg-white/90 backdrop-blur-sm focus:border-pink-300 focus:ring-pink-200"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400">
                        <Mail size={18} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                      <Lock size={16} className="text-pink-500" />
                      <span>Mot de passe</span>
                    </Label>
                    <div className="relative">
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 pl-10 rounded-xl border-pink-100 bg-white/90 backdrop-blur-sm focus:border-pink-300 focus:ring-pink-200"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400">
                        <Lock size={18} />
                      </div>
                    </div>
                  </div>
                  
                  <motion.div 
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0px 0px 15px rgba(214, 31, 255, 0.2)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="relative overflow-hidden group pt-2"
                  >
                    <Button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 rounded-xl font-semibold text-white shadow-md flex items-center justify-center gap-2"
                      style={{
                        background: "linear-gradient(45deg, #FF719A 0%, #FF9674 100%)",
                        boxShadow: "0px 6px 12px rgba(219, 39, 119, 0.2), inset 0px 1px 3px rgba(255, 255, 255, 0.4)",
                      }}
                    >
                      <span className="absolute inset-0 overflow-hidden rounded-xl">
                        <span className="absolute inset-0 z-10 opacity-0 group-hover:opacity-70 transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.8),_transparent_60%)] blur-xl"></span>
                      </span>
                      <LogIn className="h-5 w-5" />
                      <span>{isLoading ? "Connexion..." : "Se connecter"}</span>
                    </Button>
                  </motion.div>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-3">Pas encore de compte ?</p>
                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button 
                      onClick={() => navigate('/onboarding')}
                      variant="outline"
                      className="w-full h-12 rounded-xl border-pink-200/50 bg-white/50 backdrop-blur-sm hover:bg-white/70 text-foreground"
                    >
                      <UserRound className="mr-2 h-4 w-4 text-primary" />
                      <span>Créer un compte</span>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Layout>
    </div>
  );
};

export default Index;

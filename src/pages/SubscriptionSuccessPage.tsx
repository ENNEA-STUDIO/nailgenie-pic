
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import confetti from 'canvas-confetti';

const SubscriptionSuccessPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { checkSubscription } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Trigger confetti when component mounts
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      
      const particleCount = 50 * (timeLeft / duration);
      
      // Since they are random anyway, we can use ORs to randomize colors
      confetti({
        particleCount: Math.floor(randomInRange(20, 40)),
        spread: randomInRange(50, 70),
        origin: { y: 0.6 },
        colors: ['#9b87f5', '#7E69AB', '#10B981', '#059669'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!sessionId) {
      navigate('/buy-credits');
      return;
    }

    const processSubscription = async () => {
      try {
        // Call our subscription-success function to validate and record the subscription
        const { error } = await supabase.functions.invoke('subscription-success', {
          body: { session_id: sessionId }
        });
        
        if (error) {
          throw error;
        }
        
        // Check and update subscription status in app context
        await checkSubscription();
        
        setIsProcessing(false);
        toast.success(language === 'fr' 
          ? "Abonnement activé avec succès!" 
          : "Subscription activated successfully!");
      } catch (error) {
        console.error('Error processing subscription:', error);
        toast.error(language === 'fr' 
          ? "Erreur lors de l'activation de l'abonnement" 
          : "Error activating subscription");
        navigate('/buy-credits');
      }
    };

    processSubscription();
  }, [sessionId, navigate, language, checkSubscription]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-6"
    >
      <div className="max-w-md w-full glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-2">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold">
          {language === 'fr' ? "Abonnement réussi!" : "Subscription Successful!"}
        </h1>
        
        <p className="text-muted-foreground">
          {language === 'fr' 
            ? "Votre abonnement a été activé. Vous avez maintenant accès à des crédits illimités pour créer autant de designs que vous souhaitez." 
            : "Your subscription has been activated. You now have access to unlimited credits to create as many designs as you want."}
        </p>
        
        <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg text-green-700 w-full">
          <Zap className="h-5 w-5" />
          <span className="font-medium">
            {language === 'fr' ? "Crédits illimités activés" : "Unlimited Credits Activated"}
          </span>
        </div>
        
        <Button 
          onClick={() => navigate('/camera')} 
          className="w-full" 
          size="lg"
        >
          {language === 'fr' ? "Commencer à créer" : "Start Creating"}
        </Button>
      </div>
    </motion.div>
  );
};

export default SubscriptionSuccessPage;

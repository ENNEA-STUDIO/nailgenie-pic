
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { Infinity, Loader2, Sparkles } from 'lucide-react';

interface SubscriptionCheckoutProps {
  buttonText: string;
  isProcessing: boolean;
}

const SubscriptionCheckout = ({ 
  buttonText, 
  isProcessing
}: SubscriptionCheckoutProps) => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription');
      
      if (error) {
        throw error;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else if (data?.error === 'Already subscribed') {
        toast.info(language === 'fr' 
          ? "Vous avez déjà un abonnement actif" 
          : "You already have an active subscription");
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error creating subscription session:', error);
      toast.error(language === 'fr' 
        ? "Erreur lors de la création de l'abonnement" 
        : "Error creating subscription");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      className="w-full py-6 relative overflow-hidden group" 
      size="lg"
      onClick={handleSubscribe}
      disabled={isLoading || isProcessing}
      style={{
        background: "linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%)",
        boxShadow: "0 10px 25px -5px rgba(155, 135, 245, 0.3)"
      }}
    >
      {/* Animated background sparkles on hover */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute -inset-[100%] opacity-0 group-hover:opacity-20 group-hover:animate-[spin_15s_linear_infinite] bg-white/20 blur-3xl bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.8)_0%,_rgba(255,255,255,0)_70%)]"></div>
      </div>
      
      {isLoading && (
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      )}
      
      {!isLoading ? (
        <Infinity className="w-5 h-5 mr-2" />
      ) : null}
      
      <span className="relative z-10">
        {isLoading
          ? (language === 'fr' ? "Redirection..." : "Redirecting...")
          : buttonText}
      </span>
      
      {/* Subtle sparkle animation */}
      {!isLoading && !isProcessing && (
        <Sparkles className="absolute right-6 opacity-70 w-4 h-4 animate-pulse" />
      )}
    </Button>
  );
};

export default SubscriptionCheckout;


import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle, InfinityIcon, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface StripeSubscriptionProps {
  priceId: string;
  buttonText: string;
  isProcessing: boolean;
  showSuccess: boolean;
  isUnlimited?: boolean;
}

const StripeSubscription = ({ 
  priceId, 
  buttonText, 
  isProcessing, 
  showSuccess,
  isUnlimited = false
}: StripeSubscriptionProps) => {
  const { language } = useLanguage();
  const { checkSubscription } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    try {
      console.log('Initiating subscription checkout with priceId:', priceId);
      
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          priceId,
          mode: 'subscription' // Always explicitly set mode to subscription
        },
      });
      
      if (error) {
        console.error('Subscription checkout error:', error);
        throw error;
      }
      
      if (data?.url) {
        // Try to update subscription status before redirecting
        await checkSubscription();
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned');
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
        background: showSuccess 
          ? "linear-gradient(135deg, #10B981 0%, #059669 100%)" 
          : isUnlimited
            ? "linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%)"
            : "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
        boxShadow: isUnlimited 
          ? "0 10px 25px -5px rgba(155, 135, 245, 0.4)"
          : "0 10px 25px -5px rgba(59, 130, 246, 0.3)"
      }}
    >
      {/* Animated background sparkles on hover */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute -inset-[100%] opacity-0 group-hover:opacity-20 group-hover:animate-[spin_15s_linear_infinite] bg-white/20 blur-3xl bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.8)_0%,_rgba(255,255,255,0)_70%)]"></div>
      </div>
      
      {isLoading && (
        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mr-2" />
      )}
      
      {isProcessing && showSuccess ? (
        <CheckCircle className="w-5 h-5 mr-2" />
      ) : isProcessing ? (
        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mr-2" />
      ) : !isLoading ? (
        isUnlimited ? <InfinityIcon className="w-5 h-5 mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />
      ) : null}
      
      <span className="relative z-10">
        {isLoading
          ? (language === 'fr' ? "Redirection..." : "Redirecting...")
          : isProcessing && showSuccess
            ? (language === 'fr' ? "Succès" : "Success")
            : isProcessing
              ? (language === 'fr' ? "Traitement..." : "Processing...")
              : buttonText}
      </span>
      
      {/* Subtle sparkle animation */}
      {!isLoading && !isProcessing && (
        <Sparkles className="absolute right-6 opacity-70 w-4 h-4 animate-pulse" />
      )}
    </Button>
  );
};

export default StripeSubscription;

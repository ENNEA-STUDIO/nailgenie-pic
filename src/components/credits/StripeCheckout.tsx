
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle, CreditCard, Sparkles } from 'lucide-react';

interface StripeCheckoutProps {
  priceId: string;
  buttonText: string;
  isProcessing: boolean;
  showSuccess: boolean;
}

const StripeCheckout = ({ 
  priceId, 
  buttonText, 
  isProcessing, 
  showSuccess 
}: StripeCheckoutProps) => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          priceId,
          publicKey: "pk_live_51R6wCKGpMCOJlOLHMslPH6XKTxEfUwtlXi1mcg0LOUE4O3rocfRrk2UjYIpwzQNC4FFBzi9g2AVUhsbwaC738Ign00NtCtFx55"
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error(language === 'fr' 
        ? "Erreur lors de la création de la session de paiement" 
        : "Error creating payment session");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      className="w-full py-6 relative overflow-hidden group" 
      size="lg"
      onClick={handleCheckout}
      disabled={isLoading || isProcessing}
      style={{
        background: showSuccess 
          ? "linear-gradient(135deg, #10B981 0%, #059669 100%)" 
          : "linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%)",
        boxShadow: "0 10px 25px -5px rgba(155, 135, 245, 0.3)"
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
        <CreditCard className="w-5 h-5 mr-2" />
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

export default StripeCheckout;

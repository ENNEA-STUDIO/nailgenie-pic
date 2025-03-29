
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle } from 'lucide-react';

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
        body: { priceId },
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
      className="w-full" 
      size="lg"
      onClick={handleCheckout}
      disabled={isLoading || isProcessing}
    >
      {isLoading && (
        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mr-2" />
      )}
      
      {isProcessing && showSuccess ? (
        <CheckCircle className="w-5 h-5 mr-2" />
      ) : isProcessing ? (
        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      
      {isLoading
        ? (language === 'fr' ? "Redirection..." : "Redirecting...")
        : isProcessing && showSuccess
          ? (language === 'fr' ? "Succès" : "Success")
          : isProcessing
            ? (language === 'fr' ? "Traitement..." : "Processing...")
            : buttonText}
    </Button>
  );
};

export default StripeCheckout;

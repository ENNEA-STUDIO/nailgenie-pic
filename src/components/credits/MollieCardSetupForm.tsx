
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window { 
    Mollie: any;
    mollieComponents: Record<string, any>;
  }
}

interface MollieCardSetupFormProps {
  isSubscription: boolean;
  onSuccess?: () => void;
}

export default function MollieCardSetupForm({ isSubscription, onSuccess }: MollieCardSetupFormProps) {
  const { t, language } = useLanguage();
  const { checkCredits, checkSubscription } = useApp();
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // For now, we can't use the card components directly because we're redirecting
    // to Mollie's payment page instead of using the components. This will simplify
    // the integration and make it more reliable.
    setIsLoaded(true);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) {
      toast.error(language === 'fr' 
        ? 'Le formulaire de paiement n\'est pas encore prêt' 
        : 'Payment form is not ready yet');
      return;
    }
    
    if (!name.trim()) {
      toast.error(language === 'fr' 
        ? 'Veuillez entrer votre nom' 
        : 'Please enter your name');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Call appropriate endpoint based on payment type
      const endpoint = isSubscription ? 'mollie-setup-subscription' : 'mollie-create-payment';
      console.log(`Calling ${endpoint} endpoint`);
      
      const { data, error } = await supabase.functions.invoke(endpoint, {
        body: { name }
      });
      
      console.log(`${endpoint} response:`, data, error);
      
      if (error) {
        console.error(`Error calling ${endpoint}:`, error);
        throw new Error(error.message || `Failed to process ${isSubscription ? 'subscription' : 'payment'}`);
      }
      
      if (!data?.success) {
        throw new Error(data?.error || `Unknown error processing ${isSubscription ? 'subscription' : 'payment'}`);
      }
      
      if (data.success && data.url) {
        console.log("Redirecting to payment URL:", data.url);
        
        // Store payment ID in session storage for verification on success page
        if (data.paymentId) {
          sessionStorage.setItem('mollie_payment_id', data.paymentId);
        }
        
        // Redirect to Mollie checkout page
        window.location.href = data.url;
        return;
      } else {
        throw new Error(language === 'fr'
          ? "Aucune URL de redirection fournie par le serveur de paiement"
          : "No redirect URL provided by payment server");
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(language === 'fr'
        ? `Erreur de paiement: ${error.message}`
        : `Payment error: ${error.message}`);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          {language === 'fr' ? 'Nom du titulaire' : 'Cardholder Name'}
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={language === 'fr' ? 'Votre nom' : 'Your name'}
          required
          className="w-full"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full py-6" 
        size="lg"
        disabled={isProcessing || !isLoaded}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {language === 'fr' ? 'Traitement en cours...' : 'Processing...'}
          </>
        ) : (
          isSubscription ? 
            (language === 'fr' ? 'S\'abonner - 8,99 €/mois' : 'Subscribe - €8.99/month') : 
            (language === 'fr' ? 'Payer - 2,99 €' : 'Pay - €2.99')
        )}
      </Button>
    </form>
  );
}

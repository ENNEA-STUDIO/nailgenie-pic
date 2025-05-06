
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface MollieCardSetupFormProps {
  isSubscription: boolean;
  onSuccess?: () => void;
}

export default function MollieCardSetupForm({ isSubscription, onSuccess }: MollieCardSetupFormProps) {
  const { t, language } = useLanguage();
  const { checkCredits, checkSubscription } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated and get user email
  useEffect(() => {
    const getUserEmail = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        setEmail(data.user.email);
      }
    };
    getUserEmail();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
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
      console.log(`Calling ${endpoint} endpoint with name: ${name}`);
      
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
      setError(error.message);
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
          {language === 'fr' ? 'Nom complet' : 'Full Name'}
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={language === 'fr' ? 'Votre nom complet' : 'Your full name'}
          required
          className="w-full"
          disabled={isProcessing}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          {language === 'fr' ? 'Email' : 'Email'}
        </label>
        <Input
          id="email"
          value={email}
          readOnly
          className="w-full bg-muted"
        />
        <p className="text-xs text-muted-foreground">
          {language === 'fr' 
            ? 'Email associé à votre compte' 
            : 'Email associated with your account'}
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      
      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full py-6" 
          size="lg"
          disabled={isProcessing || !name.trim()}
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
      </div>

      {!isProcessing && (
        <p className="text-center text-xs text-muted-foreground mt-2">
          {language === 'fr' 
            ? 'Vous serez redirigé vers Mollie pour finaliser votre paiement en toute sécurité' 
            : 'You will be redirected to Mollie to securely complete your payment'}
        </p>
      )}
    </form>
  );
}

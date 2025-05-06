
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
  const holder = useRef<HTMLDivElement>(null);
  const number = useRef<HTMLDivElement>(null);
  const expiry = useRef<HTMLDivElement>(null);
  const cvc = useRef<HTMLDivElement>(null);
  
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mollie, setMollie] = useState<any>(null);

  useEffect(() => {
    // Load Mollie script if it's not already loaded
    if (!window.Mollie) {
      const script = document.createElement('script');
      script.src = 'https://js.mollie.com/v1/mollie.js';
      script.async = true;
      script.onload = initializeMollie;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    } else {
      initializeMollie();
    }
  }, []);
  
  const initializeMollie = () => {
    try {
      // Use test profile ID in development, replace with your actual profile ID in production
      const m = window.Mollie('pfl_TM3Pb65sXT', {
        locale: language === 'fr' ? 'fr_FR' : 'en_US',
        testmode: true,
      });
      
      setMollie(m);
      
      const components = {
        holder: m.createComponent('cardHolder'),
        number: m.createComponent('cardNumber'),
        expiry: m.createComponent('expiryDate'),
        cvc: m.createComponent('verificationCode'),
      };
      
      if (holder.current) components.holder.mount(holder.current);
      if (number.current) components.number.mount(number.current);
      if (expiry.current) components.expiry.mount(expiry.current);
      if (cvc.current) components.cvc.mount(cvc.current);
      
      // Store components globally to unmount later
      window.mollieComponents = components;
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error initializing Mollie:', error);
      toast.error(language === 'fr' 
        ? 'Erreur lors de l\'initialisation du formulaire de paiement' 
        : 'Error initializing payment form');
    }
  };
  
  useEffect(() => {
    // Cleanup function to unmount components
    return () => {
      if (window.mollieComponents) {
        Object.values(window.mollieComponents).forEach((component: any) => {
          if (component && typeof component.unmount === 'function') {
            component.unmount();
          }
        });
      }
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mollie || !isLoaded) {
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
      // Create token
      const { token, error: tokenError } = await mollie.createToken();
      
      if (tokenError) {
        throw new Error(tokenError.message || 'Error creating payment token');
      }
      
      if (!token) {
        throw new Error(language === 'fr'
          ? 'Impossible de générer un token de paiement'
          : 'Could not generate payment token');
      }
      
      // Call appropriate endpoint based on payment type
      const endpoint = isSubscription ? 'mollie-setup-subscription' : 'mollie-create-payment';
      
      const { data, error } = await supabase.functions.invoke(endpoint, {
        body: { name, cardToken: token }
      });
      
      if (error) {
        console.error(`Error calling ${endpoint}:`, error);
        throw new Error(error.message);
      }
      
      if (data.success) {
        if (isSubscription) {
          toast.success(language === 'fr'
            ? 'Abonnement créé avec succès!'
            : 'Subscription created successfully!');
          
          // Refresh subscription status
          await checkSubscription();
        } else if (data.url) {
          // For one-time payment, redirect to Mollie checkout page if URL is provided
          window.location.href = data.url;
          return;
        } else {
          // If no URL is provided, we assume the payment is being processed
          toast.success(language === 'fr'
            ? 'Paiement en cours de traitement'
            : 'Payment being processed');
            
          // Store payment ID in session storage for verification on success page
          if (data.paymentId) {
            sessionStorage.setItem('mollie_payment_id', data.paymentId);
          }
          
          // Refresh credits
          await checkCredits();
        }
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(language === 'fr'
        ? `Erreur de paiement: ${error.message}`
        : `Payment error: ${error.message}`);
    } finally {
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
      
      <div className="space-y-2">
        <label htmlFor="card-holder" className="text-sm font-medium">
          {language === 'fr' ? 'Nom sur la carte' : 'Name on card'}
        </label>
        <div 
          ref={holder} 
          id="card-holder" 
          className="w-full h-10 border rounded-md px-3 py-2 bg-background"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="card-number" className="text-sm font-medium">
          {language === 'fr' ? 'Numéro de carte' : 'Card number'}
        </label>
        <div 
          ref={number} 
          id="card-number" 
          className="w-full h-10 border rounded-md px-3 py-2 bg-background"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="expiry-date" className="text-sm font-medium">
            {language === 'fr' ? 'Date d\'expiration' : 'Expiry date'}
          </label>
          <div 
            ref={expiry} 
            id="expiry-date" 
            className="w-full h-10 border rounded-md px-3 py-2 bg-background"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="cvc" className="text-sm font-medium">
            {language === 'fr' ? 'Code de sécurité' : 'Security code'}
          </label>
          <div 
            ref={cvc} 
            id="cvc" 
            className="w-full h-10 border rounded-md px-3 py-2 bg-background"
          />
        </div>
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

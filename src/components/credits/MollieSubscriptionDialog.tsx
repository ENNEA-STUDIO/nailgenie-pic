
import {
  Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

type Props = { 
  open: boolean; 
  onOpenChange: (v: boolean) => void;
  isSubscription: boolean;
  onSuccess?: () => void;
};

export default function MollieSubscriptionDialog({ open, onOpenChange, isSubscription, onSuccess }: Props) {
  const { t, language } = useLanguage();
  const { checkCredits, checkSubscription } = useApp();
  
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '' });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const endpoint = isSubscription ? 'mollie-setup-subscription' : 'mollie-create-payment';
      
      // Build proper payment details object
      const paymentDetails = {
        amount: {
          value: isSubscription ? "8.99" : "2.99",
          currency: "EUR"
        },
        description: isSubscription ? "GeNails Unlimited Monthly Subscription" : "GeNails 10 Credits Pack",
        redirectUrl: `${window.location.origin}/payment-success?product=${isSubscription ? "subscription" : "credits"}`,
        webhookUrl: "https://yvtdpfampfndlnjqoocm.supabase.co/functions/v1/mollie-webhook",
        productType: isSubscription ? "subscription" : "credits"
      };
      
      console.log(`Calling ${endpoint} endpoint with:`, { 
        name: form.name,
        email: form.email,
        ...paymentDetails
      });
      
      const { data, error } = await supabase.functions.invoke(endpoint, {
        body: { 
          name: form.name,
          email: form.email,
          ...paymentDetails
        }
      });
      
      console.log(`${endpoint} response:`, data, error);
      
      if (error) {
        console.error(`Error calling ${endpoint}:`, error);
        throw new Error(error.message || `Failed to process ${isSubscription ? 'subscription' : 'payment'}`);
      }
      
      if (!data?.success) {
        console.error(`Error in ${endpoint} response:`, data);
        throw new Error(data?.error || `Unknown error processing ${isSubscription ? 'subscription' : 'payment'}`);
      }
      
      // If we get a payment URL, redirect to it
      if (data.url) {
        console.log("Received Mollie payment URL:", data.url);
        window.location.href = data.url;
        return;
      }
      
      // If we get here without a URL, something went wrong
      throw new Error(`No payment URL returned from ${endpoint}`);
      
    } catch (err: any) {
      console.error('Payment error:', err);
      
      // Handle error response
      let errorMessage = typeof err === 'object' ? (err.message || String(err)) : String(err);
      setError(errorMessage);
      
      // Display error toast
      toast.error(language === 'fr' 
        ? `Erreur de paiement: ${errorMessage}` 
        : `Payment error: ${errorMessage}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isSubscription 
              ? (language === 'fr' ? 'Abonnement Illimité' : 'Unlimited Subscription') 
              : (language === 'fr' ? 'Pack de 10 crédits' : '10 Credits Pack')}
          </DialogTitle>
          <DialogDescription>
            {isSubscription 
              ? (language === 'fr' 
                  ? 'Entrez vos informations pour activer votre abonnement mensuel de 8,99 €.'
                  : 'Enter your information to activate your monthly subscription for €8.99.') 
              : (language === 'fr'
                  ? 'Entrez vos informations pour acheter 10 crédits pour 2,99 €.'
                  : 'Enter your information to buy 10 credits for €2.99.')}
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-destructive">{error}</p>}

        <form onSubmit={submit} className="grid gap-4">
          <Input
            required
            placeholder={language === 'fr' ? 'Nom complet' : 'Full name'}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <DialogFooter className="mt-4">
            <Button type="submit" disabled={pending}>
              {pending 
                ? (language === 'fr' ? 'Traitement...' : 'Processing...') 
                : (isSubscription 
                    ? (language === 'fr' ? 'S\'abonner' : 'Subscribe') 
                    : (language === 'fr' ? 'Payer' : 'Pay'))}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

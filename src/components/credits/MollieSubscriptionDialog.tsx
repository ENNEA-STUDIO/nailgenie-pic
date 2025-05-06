
import {
  Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useRef, useEffect } from 'react';
import { useMollie } from '@/hooks/useMollie';
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
  const { mollie, error: mollieErr } = useMollie();

  const holder = useRef<HTMLDivElement>(null);
  const number = useRef<HTMLDivElement>(null);
  const expiry = useRef<HTMLDivElement>(null);
  const cvc    = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    // Reset form and error states when dialog opens/closes
    if (!open) {
      setMounted(false);
      setError(null);
    }
  }, [open]);

  // Mount Mollie components when dialog opens
  function mountMollie() {
    if (!open || mounted || !mollie) return;
    
    try {
      const components = {
        holder: mollie.createComponent('cardHolder'),
        number: mollie.createComponent('cardNumber'),
        expiry: mollie.createComponent('expiryDate'),
        cvc:    mollie.createComponent('verificationCode'),
      };
      
      components.holder.mount(holder.current);
      components.number.mount(number.current);
      components.expiry.mount(expiry.current);
      components.cvc.mount(cvc.current);
      
      setMounted(true);
    } catch (err) {
      console.error('Error mounting Mollie components:', err);
      setError(language === 'fr' 
        ? "Erreur lors du chargement des composants de paiement." 
        : "Error loading payment components.");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!mollie) return;

    setPending(true);
    setError(null);

    try {
      const { token } = await mollie.createToken();
      console.log('Card token created:', token);
      
      // Call appropriate Edge Function based on product type
      const functionName = isSubscription ? 'mollie-setup-subscription' : 'mollie-create-payment';
      const amount = isSubscription ? '8.99' : '2.99';
      const description = isSubscription 
        ? 'GeNails Unlimited Monthly Subscription' 
        : 'GeNails 10 Credits Pack';
      
      const { data, error: fnError } = await supabase.functions.invoke(
        functionName,
        {
          body: {
            name: form.name,
            email: form.email,
            cardToken: token,
            amountValue: amount,
            amountCurrency: 'EUR',
            description: description,
            interval: isSubscription ? '1 month' : undefined,
            webhookUrl: "https://yvtdpfampfndlnjqoocm.supabase.co/functions/v1/mollie-webhook",
          },
        },
      );
      
      if (fnError) {
        throw fnError;
      }
      
      console.info(isSubscription ? 'Subscription created:' : 'Payment created:', data);
      
      // Refresh user credits/subscription status
      if (isSubscription) {
        await checkSubscription();
      } else {
        await checkCredits();
      }
      
      // Close modal and notify user
      onOpenChange(false);
      
      toast.success(language === 'fr' 
        ? (isSubscription ? 'Abonnement activé avec succès !' : 'Crédits ajoutés avec succès !') 
        : (isSubscription ? 'Subscription activated successfully!' : 'Credits added successfully!'));
      
      if (onSuccess) onSuccess();
      
    } catch (err: any) {
      console.error('Payment error:', err);
      
      // Handle error response
      let errorMessage = typeof err === 'object' ? (err.message || String(err)) : String(err);
      
      // Try to extract more detailed error message if available
      try {
        if (err && typeof err === 'object' && 'message' in err) {
          errorMessage = err.message;
        }
      } catch {
        // If anything fails, use generic error message
        errorMessage = language === 'fr' 
          ? "Une erreur s'est produite lors du traitement du paiement." 
          : "An error occurred while processing the payment.";
      }
      
      setError(errorMessage);
    } finally {
      setPending(false);
    }
  }

  // Setup dialog open event handler that will mount Mollie components
  const handleDialogOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (open) {
      setTimeout(mountMollie, 100); // Small delay to ensure dialog is rendered
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
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

        {mollieErr && <p className="text-destructive">{mollieErr}</p>}
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

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              {language === 'fr' ? 'Titulaire de la carte' : 'Card holder'}
            </label>
            <div ref={holder} className="h-10 border rounded-md p-2" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              {language === 'fr' ? 'Numéro de carte' : 'Card number'}
            </label>
            <div ref={number} className="h-10 border rounded-md p-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                {language === 'fr' ? 'Date d\'expiration' : 'Expiry date'}
              </label>
              <div ref={expiry} className="h-10 border rounded-md p-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">CVC</label>
              <div ref={cvc} className="h-10 border rounded-md p-2" />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" disabled={!mollie || pending}>
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

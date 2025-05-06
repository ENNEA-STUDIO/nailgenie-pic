
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface MollieCardSetupFormProps {
  isSubscription: boolean;
  onSuccess?: () => void;
  amount: string;
}

export default function MollieCardSetupForm({ isSubscription, onSuccess, amount }: MollieCardSetupFormProps) {
  const { t, language } = useLanguage();
  const { checkCredits, checkSubscription } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Créer un schéma de validation avec Zod
  const formSchema = z.object({
    name: z.string().min(2, {
      message: language === 'fr' 
        ? 'Le nom doit contenir au moins 2 caractères' 
        : 'Name must be at least 2 characters'
    })
  });
  
  // Initialiser react-hook-form avec le schéma de validation Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  });

  const submit = async (values: z.infer<typeof formSchema>) => {
    setIsProcessing(true);
    
    try {
      console.log(`Calling ${isSubscription ? 'mollie-setup-subscription' : 'mollie-create-payment'} endpoint with name: ${values.name}`);
      
      // Appeler l'endpoint approprié en fonction du type de paiement
      const endpoint = isSubscription ? 'mollie-setup-subscription' : 'mollie-create-payment';
      
      const { data, error } = await supabase.functions.invoke(endpoint, {
        body: { name: values.name }
      });
      
      console.log(`${endpoint} response:`, data, error);
      
      if (error) {
        console.error(`Error calling ${endpoint}:`, error);
        throw new Error(error.message || `Échec du traitement ${isSubscription ? 'de l\'abonnement' : 'du paiement'}`);
      }
      
      if (!data?.success) {
        throw new Error(data?.error || `Erreur inconnue lors du traitement ${isSubscription ? 'de l\'abonnement' : 'du paiement'}`);
      }
      
      if (data.success && data.url) {
        console.log("Redirection vers l'URL de paiement:", data.url);
        
        // Stocker l'ID de paiement dans le stockage de session pour vérification sur la page de succès
        if (data.paymentId) {
          sessionStorage.setItem('mollie_payment_id', data.paymentId);
        }
        
        // Rediriger vers la page de paiement Mollie
        window.location.href = data.url;
        return;
      } else {
        throw new Error(language === 'fr'
          ? "Aucune URL de redirection fournie par le serveur de paiement"
          : "No redirect URL provided by payment server");
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      // Afficher un message d'erreur adapté
      toast.error(language === 'fr'
        ? `Erreur de paiement: ${error.message}`
        : `Payment error: ${error.message}`);
      
      setIsProcessing(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {language === 'fr' ? 'Nom complet' : 'Full Name'}
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder={language === 'fr' ? 'Votre nom complet' : 'Your full name'}
                  disabled={isProcessing}
                  className="w-full"
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground">
            {language === 'fr' 
              ? 'Vous serez redirigé vers Mollie pour effectuer votre paiement en toute sécurité' 
              : 'You will be redirected to Mollie to securely complete your payment'}
          </p>
          {isSubscription && (
            <p className="font-medium text-amber-600 dark:text-amber-400">
              {language === 'fr'
                ? 'Abonnement mensuel récurrent - Annulable à tout moment'
                : 'Recurring monthly subscription - Cancel anytime'}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full py-6" 
            size="lg"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === 'fr' ? 'Traitement en cours...' : 'Processing...'}
              </>
            ) : (
              isSubscription ? 
                (language === 'fr' ? `S'abonner - ${amount}` : `Subscribe - ${amount}`) : 
                (language === 'fr' ? `Payer - ${amount}` : `Pay - ${amount}`)
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <div className="h-px flex-1 bg-border"></div>
          <p className="text-xs text-muted-foreground">
            {language === 'fr' ? 'Paiement sécurisé via Mollie' : 'Secure payment via Mollie'}
          </p>
          <div className="h-px flex-1 bg-border"></div>
        </div>
      </form>
    </Form>
  );
}

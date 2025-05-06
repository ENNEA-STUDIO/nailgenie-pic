
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CreditCard, ExternalLink, LockIcon } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface MollieCardSetupFormProps {
  isSubscription: boolean;
  onSuccess?: () => void;
  amount: string;
}

export default function MollieCardSetupForm({ isSubscription, onSuccess, amount }: MollieCardSetupFormProps) {
  const { t, language } = useLanguage();
  const { checkCredits, checkSubscription, user } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [showRedirectSheet, setShowRedirectSheet] = useState(false);
  
  // Créer un schéma de validation avec Zod
  const formSchema = z.object({
    name: z.string().min(2, {
      message: language === 'fr' 
        ? 'Le nom doit contenir au moins 2 caractères' 
        : 'Name must be at least 2 characters'
    }),
    email: z.string().email({
      message: language === 'fr'
        ? 'Adresse email invalide'
        : 'Invalid email address'
    }).optional().or(z.literal('')),
  });
  
  // Initialiser react-hook-form avec le schéma de validation Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: user?.email || '',
    }
  });

  // Gérer la fermeture du sheet de redirection
  const handleCloseRedirectSheet = () => {
    setShowRedirectSheet(false);
    setRedirectUrl(null);
    setIsProcessing(false);
  };

  // Gérer la redirection vers Mollie
  const handleRedirect = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  const submit = async (values: z.infer<typeof formSchema>) => {
    setIsProcessing(true);
    
    try {
      const endpoint = isSubscription ? 'mollie-setup-subscription' : 'mollie-create-payment';
      
      console.log(`Calling ${endpoint} endpoint with:`, values);
      
      const { data, error } = await supabase.functions.invoke(endpoint, {
        body: { 
          name: values.name,
          email: values.email || user?.email
        }
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
        console.log("URL de paiement Mollie reçue:", data.url);
        
        // Stocker l'ID de paiement dans le stockage de session pour vérification sur la page de succès
        if (data.paymentId) {
          sessionStorage.setItem('mollie_payment_id', data.paymentId);
        }
        
        // Afficher le sheet de confirmation avant la redirection
        setRedirectUrl(data.url);
        setShowRedirectSheet(true);
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
    <>
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
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {language === 'fr' ? 'Email (facultatif)' : 'Email (optional)'}
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="email"
                    placeholder={user?.email || (language === 'fr' ? 'Votre email' : 'Your email')}
                    disabled={isProcessing}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <LockIcon className="w-4 h-4 text-green-600" />
              <p className="text-muted-foreground">
                {language === 'fr' 
                  ? 'Vous serez redirigé vers la page de paiement sécurisée Mollie' 
                  : 'You will be redirected to Mollie secure payment page'}
              </p>
            </div>
            
            <div className="flex items-center p-3 bg-muted/50 rounded-md">
              <CreditCard className="w-5 h-5 text-primary mr-2" />
              <p className="text-sm">
                {language === 'fr'
                  ? 'Les informations de paiement seront saisies sur la page Mollie, pas ici'
                  : 'Payment information will be entered on the Mollie page, not here'}
              </p>
            </div>
            
            {isSubscription && (
              <p className="font-medium text-amber-600 dark:text-amber-400">
                {language === 'fr'
                  ? 'Abonnement mensuel récurrent - Annulable à tout moment'
                  : 'Recurring monthly subscription - Cancel anytime'}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full py-6" 
            size="lg"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === 'fr' ? 'Préparation du paiement...' : 'Preparing payment...'}
              </>
            ) : (
              isSubscription ? 
                (language === 'fr' ? `S'abonner - ${amount}` : `Subscribe - ${amount}`) : 
                (language === 'fr' ? `Payer - ${amount}` : `Pay - ${amount}`)
            )}
          </Button>

          <div className="flex items-center gap-2 pt-2">
            <div className="h-px flex-1 bg-border"></div>
            <p className="text-xs text-muted-foreground">
              {language === 'fr' ? 'Paiement sécurisé via Mollie' : 'Secure payment via Mollie'}
            </p>
            <div className="h-px flex-1 bg-border"></div>
          </div>
        </form>
      </Form>

      {/* Sheet de redirection */}
      <Sheet open={showRedirectSheet} onOpenChange={setShowRedirectSheet}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {language === 'fr' ? 'Redirection vers la page de paiement' : 'Redirecting to payment page'}
            </SheetTitle>
            <SheetDescription>
              {language === 'fr'
                ? 'Vous allez être redirigé vers la page de paiement sécurisée de Mollie pour finaliser votre transaction.'
                : 'You will be redirected to Mollie\'s secure payment page to finalize your transaction.'}
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex flex-col space-y-6 pt-6">
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-2">
                {language === 'fr' ? 'Détails de la transaction' : 'Transaction Details'}
              </h4>
              <p className="text-sm mb-1">
                {language === 'fr' ? 'Montant:' : 'Amount:'} <span className="font-semibold">{amount}</span>
              </p>
              <p className="text-sm">
                {language === 'fr' ? 'Type:' : 'Type:'} <span className="font-semibold">
                  {isSubscription 
                    ? (language === 'fr' ? 'Abonnement mensuel' : 'Monthly subscription')
                    : (language === 'fr' ? 'Achat unique' : 'One-time purchase')}
                </span>
              </p>
            </div>
            
            <Button 
              onClick={handleRedirect} 
              className="w-full"
              size="lg"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {language === 'fr' ? 'Procéder au paiement' : 'Proceed to payment'}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleCloseRedirectSheet}
              className="w-full"
            >
              {language === 'fr' ? 'Annuler' : 'Cancel'}
            </Button>
            
            <div className="text-center text-xs text-muted-foreground pt-2">
              {language === 'fr' 
                ? 'Vous pourrez entrer vos informations de carte sur la page de Mollie.'
                : 'You will be able to enter your card details on the Mollie page.'}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

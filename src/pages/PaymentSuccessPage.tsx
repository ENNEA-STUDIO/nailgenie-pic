
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle, CreditCard, Infinity } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

const PaymentSuccessPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkCredits, checkSubscription } = useApp();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSubscription, setIsSubscription] = useState(false);
  const [creditsAdded, setCreditsAdded] = useState(0);
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const paymentMode = searchParams.get('mode') || 'payment';
    
    const verifyPayment = async () => {
      try {
        if (!sessionId) {
          toast.error(language === 'fr' 
            ? "Session de paiement invalide" 
            : "Invalid payment session");
          navigate('/buy-credits');
          return;
        }
        
        const { data, error } = await supabase.functions.invoke('payment-success', {
          body: { session_id: sessionId }
        });
        
        if (error) {
          console.error('Payment verification error:', error);
          toast.error(language === 'fr' 
            ? "Erreur lors de la vérification du paiement" 
            : "Error verifying payment");
          navigate('/buy-credits');
          return;
        }
        
        if (data?.success) {
          // Set subscription status
          setIsSubscription(data.isSubscription || data.mode === 'subscription');
          
          // Set credits added if one-time payment
          if (data.creditsAdded) {
            setCreditsAdded(data.creditsAdded);
          }
          
          // Trigger confetti effect
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          
          // Refresh the credits and subscription status
          await checkCredits();
          await checkSubscription();
          
          // Auto-redirect after 3 seconds
          setTimeout(() => {
            navigate('/camera');
          }, 3000);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error(language === 'fr' 
          ? "Une erreur est survenue" 
          : "An error occurred");
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyPayment();
  }, [searchParams, navigate, language, checkCredits, checkSubscription]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 text-center"
    >
      {isVerifying ? (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <h1 className="text-2xl font-bold">
            {language === 'fr' ? "Vérification du paiement..." : "Verifying payment..."}
          </h1>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <CheckCircle className="w-24 h-24 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">
            {language === 'fr' ? "Paiement réussi!" : "Payment Successful!"}
          </h1>
          
          {isSubscription ? (
            <>
              <div className="flex items-center mb-4">
                <Infinity className="w-6 h-6 text-primary mr-2" />
                <p className="text-lg font-medium">
                  {language === 'fr' ? "Abonnement illimité activé" : "Unlimited subscription activated"}
                </p>
              </div>
              <p className="text-md text-muted-foreground mb-8">
                {language === 'fr' 
                  ? "Vous pouvez maintenant générer autant de designs que vous voulez" 
                  : "You can now generate as many designs as you want"}
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center mb-4">
                <CreditCard className="w-6 h-6 text-primary mr-2" />
                <p className="text-lg font-medium">
                  {language === 'fr' 
                    ? `${creditsAdded} crédits ont été ajoutés à votre compte` 
                    : `${creditsAdded} credits have been added to your account`}
                </p>
              </div>
              <p className="text-md text-muted-foreground mb-8">
                {language === 'fr' 
                  ? "Vous pouvez maintenant générer plus de designs" 
                  : "You can now generate more designs"}
              </p>
            </>
          )}
          
          <p className="text-sm text-muted-foreground">
            {language === 'fr' 
              ? "Vous allez être redirigé automatiquement..." 
              : "You'll be redirected automatically..."}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PaymentSuccessPage;

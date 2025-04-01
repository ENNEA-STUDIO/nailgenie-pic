
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CustomBottomNav from '@/components/navigation/CustomBottomNav';
import StripeCheckout from '@/components/credits/StripeCheckout';
import SubscriptionCheckout from '@/components/credits/SubscriptionCheckout';
import InvitationSection from '@/components/credits/InvitationSection';
import { ArrowLeft, Check, CreditCard, Infinity } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

const PRICE_ID_10_CREDITS = 'price_1R989h2cCjTevmPYt4YFzpHP';

const BuyCreditsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { credits, isSubscribed, checkSubscription } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [successfulPayment, setSuccessfulPayment] = useState(false);
  
  // Check for payment success from URL parameters
  useEffect(() => {
    const checkForPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      
      if (sessionId) {
        // Clear the URL parameters without page reload
        window.history.replaceState({}, document.title, window.location.pathname);
        
        setIsProcessing(true);
        // Wait a moment to show the processing state
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccessfulPayment(true);
        // Wait another moment to show the success state
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check subscription status after payment processing
        await checkSubscription();
        setIsProcessing(false);
      }
    };
    
    checkForPayment();
  }, [checkSubscription]);
  
  // When subscription status changes, update the UI
  useEffect(() => {
    if (isSubscribed) {
      toast.success(language === 'fr' 
        ? "Vous avez un abonnement actif avec crédits illimités" 
        : "You have an active subscription with unlimited credits");
    }
  }, [isSubscribed, language]);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20"
    >
      {/* Header */}
      <div className="p-4 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-background/80 backdrop-blur border border-input"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold ml-4">{t.credits.buyCredits}</h1>
      </div>
      
      {/* Content */}
      <div className="flex-1 px-4 py-6 space-y-6 pb-24">
        {/* Credits explanation */}
        <div className="text-center mb-6">
          <p className="text-muted-foreground">
            {t.credits.currentCredits}: <span className="font-semibold text-foreground">{isSubscribed ? '∞' : credits}</span>
          </p>
          <h2 className="text-2xl font-bold mt-2">{t.credits.needMoreCredits}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t.credits.selectOption}</p>
        </div>
        
        {/* Subscription option */}
        <Card className="relative overflow-hidden border-primary/30">
          {isSubscribed && (
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
              {language === 'fr' ? "Actif" : "Active"}
            </div>
          )}
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Infinity className="mr-2 h-5 w-5 text-primary" />
              {language === 'fr' ? "Abonnement Mensuel" : "Monthly Subscription"}
            </CardTitle>
            <CardDescription>
              {language === 'fr' 
                ? "Crédits illimités chaque mois"
                : "Unlimited credits every month"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-baseline mb-4">
              <div className="text-3xl font-bold">$9.99</div>
              <div className="text-muted-foreground text-sm">
                {language === 'fr' ? "par mois" : "per month"}
              </div>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">
                  {language === 'fr' 
                    ? "Crédits illimités pour créer des designs"
                    : "Unlimited credits to create designs"}
                </span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">
                  {language === 'fr' 
                    ? "Annulez à tout moment"
                    : "Cancel anytime"}
                </span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {isSubscribed ? (
              <button 
                className="w-full py-3 text-center bg-green-100 text-green-700 rounded-lg font-medium"
                disabled
              >
                {language === 'fr' ? "Déjà abonné" : "Already subscribed"}
              </button>
            ) : (
              <SubscriptionCheckout
                buttonText={language === 'fr' ? "S'abonner" : "Subscribe"} 
                isProcessing={isProcessing}
              />
            )}
          </CardFooter>
        </Card>
        
        {/* One-time purchase option */}
        <Card className="border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              {language === 'fr' ? "Achat unique" : "One-time Purchase"}
            </CardTitle>
            <CardDescription>
              {language === 'fr' 
                ? "10 crédits pour créer des designs"
                : "10 credits to create designs"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-baseline mb-4">
              <div className="text-3xl font-bold">$4.99</div>
              <div className="text-muted-foreground text-sm">
                {language === 'fr' ? "paiement unique" : "one-time payment"}
              </div>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">
                  {language === 'fr' 
                    ? "10 crédits ajoutés à votre compte"
                    : "10 credits added to your account"}
                </span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">
                  {language === 'fr' 
                    ? "Pas d'abonnement"
                    : "No subscription"}
                </span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <StripeCheckout
              priceId={PRICE_ID_10_CREDITS}
              buttonText={language === 'fr' ? "Acheter 10 crédits" : "Buy 10 Credits"}
              isProcessing={isProcessing}
              showSuccess={successfulPayment}
            />
          </CardFooter>
        </Card>
        
        {/* Invitation section */}
        <InvitationSection />
      </div>
      
      {/* Bottom navigation */}
      <CustomBottomNav />
    </motion.div>
  );
};

export default BuyCreditsPage;

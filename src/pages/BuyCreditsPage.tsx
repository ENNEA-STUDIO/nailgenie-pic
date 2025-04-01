
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, CreditCard, Infinity, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/navigation/BottomNav';
import NailPolishIcon from '@/components/credits/NailPolishIcon';
import InvitationSection from '@/components/credits/InvitationSection';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StripeCheckout from '@/components/credits/StripeCheckout';
import SubscriptionCheckout from '@/components/credits/SubscriptionCheckout';

type OfferType = 'credits' | 'subscription';

// Updated to use the actual Stripe price ID provided by the user
const CREDITS_PRICE_ID = 'price_1R7z0D2cCjTevmPYrexpwwZT';

const BuyCreditsPage: React.FC = () => {
  const { credits, hasSubscription, checkSubscription } = useApp();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingOption, setProcessingOption] = useState<OfferType | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    // Check subscription status when page loads
    checkSubscription();
  }, [checkSubscription]);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20 p-4 pb-24"
    >
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-medium ml-2">{t.credits.buyCredits}</h1>
      </div>
      
      <div className="glass-card rounded-3xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <NailPolishIcon className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-lg font-medium">{t.credits.currentCredits}</h2>
          </div>
          <div className="flex items-center">
            <span className="text-2xl font-bold">{hasSubscription ? '∞' : credits}</span>
            {hasSubscription && (
              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                {language === 'fr' ? 'Abonné' : 'Subscribed'}
              </Badge>
            )}
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm">
          {hasSubscription 
            ? (language === 'fr' 
              ? 'Votre abonnement est actif. Vous avez des crédits illimités pour générer des designs.' 
              : 'Your subscription is active. You have unlimited credits to generate designs.') 
            : t.credits.creditsExplainer}
        </p>
      </div>
      
      <div className="flex-1 space-y-6">
        {/* Pack de crédits */}
        <Card className="border-2 overflow-hidden">
          <CardHeader className="pb-2">
            <Badge variant="outline" className="w-fit mb-2">
              {t.credits.oneTimePurchase}
            </Badge>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              {t.credits.creditPack}
            </CardTitle>
            <CardDescription>
              10 designs = 10 {language === 'fr' ? 'crédits' : 'credits'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-2">
            <div className="flex items-center mb-3">
              <span className="text-3xl font-bold text-primary">{t.credits.creditPackPrice}</span>
            </div>
            
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-green-500" />
                {t.credits.tenCreditsForDesigns}
              </li>
            </ul>
          </CardContent>
          
          <CardFooter>
            <StripeCheckout
              priceId={CREDITS_PRICE_ID}
              buttonText={t.credits.creditPackPrice}
              isProcessing={isProcessing && processingOption === 'credits'}
              showSuccess={showSuccess}
            />
          </CardFooter>
        </Card>
        
        {/* Abonnement illimité */}
        <Card className={`border-2 ${hasSubscription ? 'border-green-500' : 'border-primary'} overflow-hidden relative`}>
          <div className="absolute top-0 right-0">
            <Badge className="m-2 bg-primary">
              {t.credits.mostPopular}
            </Badge>
          </div>
          
          <CardHeader className="pb-2">
            <Badge variant="outline" className="w-fit mb-2">
              {t.credits.subscriptionExplainer}
            </Badge>
            <CardTitle className="flex items-center gap-2">
              <Infinity className="h-5 w-5 text-primary" />
              {t.credits.unlimitedPlan}
            </CardTitle>
            <CardDescription>
              {t.credits.unlimitedExplainer}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-2">
            <div className="flex items-center mb-3">
              <span className="text-3xl font-bold text-primary">{t.credits.unlimitedPlanPrice}</span>
            </div>
            
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-green-500" />
                {t.credits.unlimitedDesigns}
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-green-500" />
                {t.credits.cancelAnytime}
              </li>
            </ul>
          </CardContent>
          
          <CardFooter>
            {hasSubscription ? (
              <Button 
                className="w-full bg-green-500 hover:bg-green-600" 
                size="lg"
                disabled
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {language === 'fr' ? 'Déjà abonné' : 'Already Subscribed'}
              </Button>
            ) : (
              <SubscriptionCheckout
                buttonText={t.credits.subscribe}
                isProcessing={isProcessing}
              />
            )}
          </CardFooter>
        </Card>
        
        <InvitationSection />
      </div>
      
      <BottomNav />
    </motion.div>
  );
};

export default BuyCreditsPage;

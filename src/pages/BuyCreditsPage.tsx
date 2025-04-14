
import React, { useState } from 'react';
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
import { toast } from 'sonner';
import StripeCheckout from '@/components/credits/StripeCheckout';
import StripeSubscription from '@/components/credits/StripeSubscription';

type OfferType = 'credits' | 'subscription';

// Updated to use the actual Stripe price IDs provided by the user
const CREDITS_PRICE_ID = 'price_1R93tLGpMCOJlOLHI0oU3mkY';
// The price ID for the 100 credits pack - this should be a one-time payment price
const PREMIUM_CREDITS_PRICE_ID = 'price_1RDnGiGpMCOJlOLHek9KvjVv';

const BuyCreditsPage: React.FC = () => {
  const { credits, addCredits } = useApp();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingOption, setProcessingOption] = useState<OfferType | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
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
          <span className="text-2xl font-bold">{credits}</span>
        </div>
        
        <p className="text-muted-foreground text-sm">
          {t.credits.creditsExplainer}
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
        
        {/* 100 Credits Pack - now the main offer */}
        <Card className="border-2 border-primary/50 overflow-hidden relative">
          <div className="absolute top-0 right-0">
            <Badge className="m-2 bg-primary">
              {t.credits.mostPopular}
            </Badge>
          </div>
          
          <CardHeader className="pb-2">
            <Badge variant="outline" className="w-fit mb-2">
              {t.credits.oneTimePurchase}
            </Badge>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              {t.credits.premiumCreditPack}
            </CardTitle>
            <CardDescription>
              100 designs = 100 {language === 'fr' ? 'crédits' : 'credits'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-2">
            <div className="flex items-center mb-3">
              <span className="text-3xl font-bold text-primary">$8.99</span>
            </div>
            
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-green-500" />
                {t.credits.hundredCreditsForDesigns}
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-green-500" />
                {t.credits.bestValue}
              </li>
            </ul>
          </CardContent>
          
          <CardFooter>
            <StripeCheckout
              priceId={PREMIUM_CREDITS_PRICE_ID}
              buttonText="$8.99"
              isProcessing={isProcessing && processingOption === 'subscription'}
              showSuccess={showSuccess}
            />
          </CardFooter>
        </Card>
        
        <InvitationSection />
      </div>
      
      <BottomNav />
    </motion.div>
  );
};

export default BuyCreditsPage;


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, CreditCard, Zap } from 'lucide-react';
import { InfinityIcon } from 'lucide-react';  
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/navigation/BottomNav';
import NailPolishIcon from '@/components/credits/NailPolishIcon';
import InvitationSection from '@/components/credits/InvitationSection';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import LogoutButton from '@/components/auth/LogoutButton';
import MollieCardSetupForm from '@/components/credits/MollieCardSetupForm';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type OfferType = 'credits' | 'subscription';

const BuyCreditsPage: React.FC = () => {
  const { credits, hasUnlimitedSubscription, subscriptionStart, subscriptionEnd, checkCredits, checkSubscription } = useApp();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingOption, setProcessingOption] = useState<OfferType | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentType, setPaymentType] = useState<OfferType>('credits');
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const locale = language === 'fr' ? fr : enUS;
    
    return format(date, 'PPP', { locale });
  };
  
  const startDate = subscriptionStart ? formatDate(subscriptionStart) : null;
  const renewalDate = subscriptionEnd ? formatDate(subscriptionEnd) : null;
  
  const handlePaymentSuccess = () => {
    setShowPaymentDialog(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  const openPaymentDialog = (type: OfferType) => {
    setPaymentType(type);
    setShowPaymentDialog(true);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20 p-4 pb-32"
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
      
      <div className="flex-1 space-y-6">
        {!hasUnlimitedSubscription && (
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
                <span className="text-3xl font-bold text-primary">2,99 €</span>
              </div>
              
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-green-500" />
                  {t.credits.tenCreditsForDesigns}
                </li>
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full py-6 relative" 
                size="lg"
                onClick={() => openPaymentDialog('credits')}
                disabled={isProcessing}
              >
                {isProcessing && processingOption === 'credits' ? (
                  <span className="flex items-center">
                    <NailPolishIcon className="animate-bounce mr-2" />
                    {t.credits.processing}
                  </span>
                ) : showSuccess && processingOption === 'credits' ? (
                  <span className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    {t.credits.success}
                  </span>
                ) : (
                  '2,99 €'
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
        
        <Card className={`border-2 ${hasUnlimitedSubscription ? 'border-green-500' : 'border-primary/50'} overflow-hidden relative`}>
          <div className="absolute top-0 right-0">
            <Badge className="m-2 bg-primary">
              {hasUnlimitedSubscription ? t.credits.active : t.credits.mostPopular}
            </Badge>
          </div>
          
          <CardHeader className="pb-2">
            <Badge variant={hasUnlimitedSubscription ? "success" : "outline"} className="w-fit mb-2">
              {t.credits.subscriptionExplainer}
            </Badge>
            <CardTitle className="flex items-center gap-2">
              <InfinityIcon className="h-5 w-5 text-primary" />
              {t.credits.unlimitedPlan}
            </CardTitle>
            <CardDescription>
              {t.credits.unlimitedExplainer}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-2">
            <div className="flex items-center mb-3">
              <span className="text-3xl font-bold text-primary">8,99 €</span>
              <span className="text-sm text-muted-foreground ml-2">/mois</span>
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
            
            {hasUnlimitedSubscription && renewalDate && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md text-sm">
                <p>{language === 'fr' ? 'Renouvellement le' : 'Renews on'}: <strong>{renewalDate}</strong></p>
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            {hasUnlimitedSubscription ? (
              <Button 
                className="w-full py-6 relative overflow-hidden group" 
                size="lg"
                variant="outline"
                disabled
              >
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                <span>
                  {t.credits.alreadySubscribed}
                </span>
              </Button>
            ) : (
              <Button 
                className="w-full py-6 relative" 
                size="lg"
                onClick={() => openPaymentDialog('subscription')}
                disabled={isProcessing}
              >
                {isProcessing && processingOption === 'subscription' ? (
                  <span className="flex items-center">
                    <NailPolishIcon className="animate-bounce mr-2" />
                    {t.credits.processing}
                  </span>
                ) : showSuccess && processingOption === 'subscription' ? (
                  <span className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    {t.credits.success}
                  </span>
                ) : (
                  '8,99 €/mois'
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <InvitationSection />
      </div>
      
      <div className="flex justify-center mb-20">
        <LogoutButton 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-foreground opacity-50 hover:opacity-100 transition-all"
        />
      </div>
      
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {paymentType === 'subscription' 
                ? (language === 'fr' ? 'S\'abonner' : 'Subscribe') 
                : (language === 'fr' ? 'Acheter des crédits' : 'Buy credits')}
            </DialogTitle>
            <DialogDescription>
              {paymentType === 'subscription'
                ? (language === 'fr' ? 'Abonnement mensuel de 8,99 € pour des designs illimités' : 'Monthly subscription of €8.99 for unlimited designs')
                : (language === 'fr' ? '10 crédits pour 2,99 €' : '10 credits for €2.99')}
            </DialogDescription>
          </DialogHeader>
          
          <MollieCardSetupForm 
            isSubscription={paymentType === 'subscription'}
            onSuccess={handlePaymentSuccess}
          />
        </DialogContent>
      </Dialog>
      
      <BottomNav />
    </motion.div>
  );
};

export default BuyCreditsPage;

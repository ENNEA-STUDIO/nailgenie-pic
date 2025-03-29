
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/navigation/BottomNav';
import NailPolishIcon from '@/components/credits/NailPolishIcon';
import InvitationSection from '@/components/credits/InvitationSection';

const BuyCreditsPage: React.FC = () => {
  const { credits, addCredits } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingOption, setProcessingOption] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const creditOptions = [
    { credits: 5, price: '2.99', popular: false },
    { credits: 15, price: '6.99', popular: true },
    { credits: 30, price: '9.99', popular: false },
  ];
  
  const handleBuyCredits = async (amount: number) => {
    setIsProcessing(true);
    setProcessingOption(amount);
    
    // Simulate payment processing
    setTimeout(async () => {
      const success = await addCredits(amount);
      
      if (success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setIsProcessing(false);
          setProcessingOption(null);
        }, 2000);
      } else {
        setIsProcessing(false);
        setProcessingOption(null);
      }
    }, 1500);
  };
  
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
      
      <div className="flex-1">
        <div className="grid gap-4">
          {creditOptions.map((option) => (
            <motion.div
              key={option.credits}
              className={`glass-card rounded-2xl p-5 relative ${
                option.popular ? 'border-2 border-primary' : ''
              }`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {option.popular && (
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                  {t.credits.mostPopular}
                </span>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <NailPolishIcon className="w-5 h-5 text-primary mr-2" />
                  <span className="text-xl font-bold">{option.credits}</span>
                </div>
                <Button
                  onClick={() => handleBuyCredits(option.credits)}
                  disabled={isProcessing}
                  className={`${option.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                >
                  {isProcessing && processingOption === option.credits ? (
                    showSuccess ? (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mr-2" />
                    )
                  ) : null}
                  
                  {isProcessing && processingOption === option.credits && showSuccess
                    ? t.credits.success
                    : isProcessing && processingOption === option.credits
                    ? t.credits.processing
                    : `$${option.price}`}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <InvitationSection />
      </div>
      
      <BottomNav />
    </motion.div>
  );
};

export default BuyCreditsPage;

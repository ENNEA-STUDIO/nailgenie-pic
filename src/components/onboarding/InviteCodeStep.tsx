
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, AlertCircle, CheckCircle, Gift } from 'lucide-react';

interface InviteCodeStepProps {
  onContinue: (code?: string) => void;
}

const InviteCodeStep: React.FC<InviteCodeStepProps> = ({ onContinue }) => {
  const { t } = useLanguage();
  const [inviteCode, setInviteCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  
  const handleSkip = () => {
    onContinue();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      handleSkip();
      return;
    }
    
    setIsVerifying(true);
    setError(null);
    
    try {
      // Store the invite code in localStorage to use after signup
      localStorage.setItem('pendingInviteCode', inviteCode.trim());
      setVerified(true);
      
      // Continue to next step after a brief delay to show success message
      setTimeout(() => {
        onContinue(inviteCode.trim());
      }, 1500);
    } catch (error) {
      console.error('Error verifying invite code:', error);
      setError(t.credits.invalidInviteCode);
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto p-6"
    >
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Gift className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">{t.credits.enterInviteCode}</h2>
        <p className="text-muted-foreground">
          {t.credits.inviteExplainer}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="XXXX-XXXX"
            className="text-center uppercase font-mono text-lg"
            disabled={isVerifying || verified}
          />
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {verified && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">{t.credits.successInviteCode}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col gap-2 pt-2">
          <Button
            type="submit"
            className="w-full"
            disabled={isVerifying || verified}
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
                {t.credits.processing}
              </span>
            ) : verified ? (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {t.credits.success}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {t.common.continue} <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
          
          {!verified && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleSkip}
              disabled={isVerifying}
              className="w-full"
            >
              {t.common.skip}
            </Button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default InviteCodeStep;

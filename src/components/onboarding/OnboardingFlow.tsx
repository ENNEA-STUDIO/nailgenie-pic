
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

type Step = {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
};

interface OnboardingFlowProps {
  steps: Step[];
  onComplete: () => void;
  initialStep?: number;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  steps,
  onComplete,
  initialStep = 0,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const { isMobile } = useIsMobile();

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="w-full max-w-md mx-auto py-4 px-4">
      {/* Step content with animations */}
      <motion.div 
        className="relative"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={cardVariants}
      >
        <Card className="border-none overflow-hidden shadow-xl bg-gradient-to-b from-background to-secondary/5 rounded-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {currentStep.component}
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* Decorative elements */}
        <div className="absolute -z-10 w-60 h-60 rounded-full bg-primary/5 blur-3xl -top-20 -left-20 opacity-70"></div>
        <div className="absolute -z-10 w-60 h-60 rounded-full bg-accent/5 blur-3xl -bottom-20 -right-20 opacity-70"></div>
      </motion.div>

      {/* Navigation buttons - Only show if not on the first screen */}
      {!isFirstStep && (
        <div className="flex justify-between mt-6 px-4">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              onClick={handleBack}
              className="rounded-xl px-6 gap-2 h-14 border-border/50 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Retour</span>
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button 
              onClick={handleNext}
              className="rounded-xl px-6 gap-2 h-14 bg-gradient-to-r from-primary to-accent hover:opacity-90 hover:shadow-md transition-all shadow-sm"
              size="lg"
            >
              <span className="font-medium">{isLastStep ? 'Terminer' : 'Suivant'}</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OnboardingFlow;

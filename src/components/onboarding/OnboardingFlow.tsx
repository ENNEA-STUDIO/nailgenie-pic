
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
    <div className="w-full py-4 px-0 md:px-4">
      {/* Step indicator */}
      <div className="flex justify-between items-center mb-6 px-6">
        <motion.h2 
          key={`title-${currentStep.id}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="text-2xl font-bold text-foreground"
        >
          {currentStep.title}
        </motion.h2>
        
        <motion.div 
          className="text-sm font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {currentStepIndex + 1} / {steps.length}
        </motion.div>
      </div>

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
              className="p-6 lg:p-8 min-h-[400px]"
            >
              {!isMobile && (
                <motion.p 
                  className="text-muted-foreground mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {currentStep.description}
                </motion.p>
              )}
              {currentStep.component}
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* Decorative elements */}
        <div className="absolute -z-10 w-60 h-60 rounded-full bg-primary/5 blur-3xl -top-20 -left-20"></div>
        <div className="absolute -z-10 w-60 h-60 rounded-full bg-accent/5 blur-3xl -bottom-20 -right-20"></div>
      </motion.div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8 px-4">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="rounded-xl px-6 gap-2 h-14 border-border/50 shadow-sm disabled:opacity-0"
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
    </div>
  );
};

export default OnboardingFlow;

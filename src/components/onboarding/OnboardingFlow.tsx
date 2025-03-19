
import React, { useState, useEffect } from 'react';
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
  onStepChange?: (step: number) => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  steps,
  onComplete,
  initialStep = 0,
  onStepChange,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const { isMobile } = useIsMobile();

  // Update the current step if initialStep changes (controlled from parent)
  useEffect(() => {
    setCurrentStepIndex(initialStep);
  }, [initialStep]);

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      const nextStep = currentStepIndex + 1;
      setCurrentStepIndex(nextStep);
      if (onStepChange) {
        onStepChange(nextStep);
      }
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      const prevStep = currentStepIndex - 1;
      setCurrentStepIndex(prevStep);
      if (onStepChange) {
        onStepChange(prevStep);
      }
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
        <Card className="border-none overflow-hidden shadow-xl rounded-3xl backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,240,255,0.9) 100%)',
            boxShadow: '0 25px 50px -12px rgba(219, 39, 119, 0.15), 0 0 1px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.7)'
          }}
        >
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
        <div className="absolute -z-10 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl -top-20 -left-20 opacity-70"></div>
        <div className="absolute -z-10 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl -bottom-20 -right-20 opacity-70"></div>
        <div className="absolute -z-10 w-40 h-40 rounded-full bg-pink-200/20 blur-xl bottom-10 left-20 opacity-50 mix-blend-multiply"></div>
      </motion.div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6 px-4">
        {!isFirstStep && (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              onClick={handleBack}
              className="rounded-full px-6 gap-2 h-12 border-pink-100 bg-white/80 backdrop-blur-sm text-gray-600"
              style={{
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03), inset 0 1px 1px rgba(255,255,255,0.7)'
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Retour</span>
            </Button>
          </motion.div>
        )}
        
        <motion.div 
          whileHover={{ scale: 1.03 }} 
          whileTap={{ scale: 0.97 }}
          className={`${!isFirstStep ? 'ml-auto' : 'mx-auto'}`}
        >
          <Button 
            onClick={handleNext}
            className="rounded-full px-8 gap-2 h-12 text-white"
            style={{
              background: 'linear-gradient(90deg, #D946EF 0%, #9b87f5 100%)',
              boxShadow: '0 10px 15px -3px rgba(214, 31, 255, 0.2), 0 4px 6px -2px rgba(215, 115, 247, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.3)'
            }}
            size="lg"
          >
            <span className="font-medium">{isLastStep ? 'Terminer' : 'Suivant'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingFlow;

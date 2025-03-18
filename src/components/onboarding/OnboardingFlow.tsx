
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const { isMobile } = useIsMobile();

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    setCompletedSteps((prev) => new Set([...prev, currentStepIndex]));
    
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
    <div className="w-full max-w-3xl mx-auto py-6 px-4">
      {/* Progress background with animated gradient */}
      <div className="relative h-2 bg-secondary rounded-full mb-8 overflow-hidden">
        <motion.div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-accent rounded-full"
          initial={{ width: `${(initialStep / steps.length) * 100}%` }}
          animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Progress indicator */}
      <div className="mb-8 flex justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const isCurrent = index === currentStepIndex;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step indicator */}
              <div className="flex flex-col items-center relative z-10">
                <motion.div 
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center 
                    ${isCompleted 
                      ? 'bg-gradient-to-br from-primary to-accent text-white' 
                      : isCurrent 
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' 
                        : 'bg-secondary text-secondary-foreground'}
                    transition-all duration-300 shadow-sm
                  `}
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ 
                    scale: isCurrent || isCompleted ? 1 : 0.8, 
                    opacity: isCurrent || isCompleted ? 1 : 0.5,
                    y: isCurrent ? -5 : 0
                  }}
                  transition={{ duration: 0.4 }}
                  whileHover={index < currentStepIndex ? { scale: 1.1 } : {}}
                  onClick={() => index < currentStepIndex && setCurrentStepIndex(index)}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </motion.div>
                {!isMobile && (
                  <motion.span 
                    className={`text-xs mt-3 ${isCurrent ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}
                    animate={{ opacity: isCurrent ? 1 : 0.7 }}
                  >
                    {step.title}
                  </motion.span>
                )}
              </div>
              
              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div className="flex-1 flex items-center">
                  <div 
                    className="h-[2px] w-full rounded-full"
                    style={{
                      background: `linear-gradient(to right, 
                        ${isCompleted ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'} 0%, 
                        ${index + 1 <= currentStepIndex ? 'hsl(var(--accent))' : 'hsl(var(--secondary))'} 100%)`
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Current step title and description for mobile */}
      {isMobile && (
        <motion.div 
          className="mb-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={`header-${currentStep.id}`}
        >
          <h3 className="text-xl font-semibold">{currentStep.title}</h3>
          <p className="text-sm text-muted-foreground">{currentStep.description}</p>
        </motion.div>
      )}

      {/* Step content with animations */}
      <motion.div 
        className="relative mb-8"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={cardVariants}
      >
        <Card className="border-none overflow-hidden shadow-lg bg-gradient-to-b from-background to-secondary/10">
          <CardContent className="p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="min-h-[320px] lg:min-h-[280px]"
              >
                {!isMobile && (
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-2xl font-semibold text-foreground">{currentStep.title}</h3>
                    <p className="text-muted-foreground">{currentStep.description}</p>
                  </motion.div>
                )}
                {currentStep.component}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Decorative elements */}
        <div className="absolute -z-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl -top-10 -left-10"></div>
        <div className="absolute -z-10 w-40 h-40 rounded-full bg-accent/5 blur-3xl -bottom-10 -right-10"></div>
      </motion.div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="rounded-xl px-5 gap-2 h-12 border-border/50 shadow-sm disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button 
            onClick={handleNext}
            className="rounded-xl px-5 gap-2 h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 hover:shadow-md transition-all shadow-sm"
          >
            <span>{isLastStep ? 'Terminer' : 'Suivant'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingFlow;

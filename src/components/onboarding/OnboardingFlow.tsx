
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
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

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between relative mb-2">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            const isCurrent = index === currentStepIndex;
            
            return (
              <React.Fragment key={step.id}>
                {/* Step indicator */}
                <div className="flex flex-col items-center relative z-10">
                  <motion.div 
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center 
                      ${isCompleted ? 'bg-primary text-primary-foreground' : 
                        isCurrent ? 'bg-primary text-primary-foreground' : 
                        'bg-secondary text-secondary-foreground'}
                    `}
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ 
                      scale: isCurrent || isCompleted ? 1 : 0.8, 
                      opacity: isCurrent || isCompleted ? 1 : 0.5 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </motion.div>
                  {!isMobile && (
                    <span className={`text-xs mt-2 ${isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {step.title}
                    </span>
                  )}
                </div>
                
                {/* Connector line between steps */}
                {index < steps.length - 1 && (
                  <div className="flex-1 flex items-center">
                    <div 
                      className="h-[2px] w-full bg-secondary"
                      style={{
                        background: `linear-gradient(to right, 
                          ${isCompleted ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'} 0%, 
                          ${index + 1 <= currentStepIndex ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'} 100%)`
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Current step title and description for mobile */}
      {isMobile && (
        <div className="mb-4 text-center">
          <h3 className="text-lg font-medium">{currentStep.title}</h3>
          <p className="text-sm text-muted-foreground">{currentStep.description}</p>
        </div>
      )}

      {/* Step content with animations */}
      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="min-h-[280px]"
            >
              {!isMobile && (
                <div className="mb-6">
                  <h3 className="text-xl font-medium">{currentStep.title}</h3>
                  <p className="text-muted-foreground">{currentStep.description}</p>
                </div>
              )}
              {currentStep.component}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStepIndex === 0}
          className="w-28"
        >
          Retour
        </Button>
        
        <Button 
          onClick={handleNext}
          className="w-28"
        >
          {isLastStep ? 'Terminer' : 'Suivant'}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingFlow;

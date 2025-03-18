
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const OnboardingButton: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10"
    >
      <Button 
        onClick={() => navigate('/onboarding')}
        className="shadow-lg px-6 py-6 h-auto rounded-full group"
        size="lg"
      >
        <span>Créer un compte</span>
        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </motion.div>
  );
};

export default OnboardingButton;

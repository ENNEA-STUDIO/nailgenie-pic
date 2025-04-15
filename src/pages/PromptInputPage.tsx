
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PromptInput from '../components/prompt/PromptInput';
import { useApp } from '../context/AppContext';
import BottomNav from '@/components/navigation/BottomNav';
import { useLanguage } from '@/context/LanguageContext';
import ResultLoading from '../components/result/ResultLoading';

const PromptInputPage: React.FC = () => {
  const navigate = useNavigate();
  const { handImage, isLoading, prompt } = useApp();
  const { t } = useLanguage();
  
  // Redirect if no hand image
  useEffect(() => {
    if (!handImage) {
      navigate('/camera');
    }
  }, [handImage, navigate]);

  // Navigate to result page after generation
  useEffect(() => {
    if (isLoading) {
      navigate('/result');
    }
  }, [isLoading, navigate]);

  if (!handImage) return null;
  
  // Show loading if API is processing
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background">
        <ResultLoading prompt={prompt} />
        <BottomNav />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20 p-4 pb-24 overflow-x-hidden"
    >
      <div className="flex-1 w-full flex flex-col max-w-md mx-auto">
        {/* Hand Image Preview */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-card rounded-3xl overflow-hidden shadow-md mb-6 w-full max-w-xs mx-auto"
          style={{
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)"
          }}
        >
          <img 
            src={handImage} 
            alt="Your hand" 
            className="w-full object-cover aspect-square"
          />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-xl font-medium text-center mb-2"
        >
          {t.prompt.describeDesign}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-muted-foreground text-center mb-6"
        >
          {t.prompt.describeHelp}
        </motion.p>
        
        <PromptInput />
      </div>
      
      <BottomNav />
    </motion.div>
  );
};

export default PromptInputPage;

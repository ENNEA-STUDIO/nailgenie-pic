
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PromptInput from '../components/prompt/PromptInput';
import { useApp } from '../context/AppContext';
import { useIsMobile } from '../hooks/use-mobile';
import BottomNav from '@/components/navigation/BottomNav';
import { useLanguage } from '@/context/LanguageContext';
import {
  RoundNailIcon,
  SquareNailIcon,
  OvalNailIcon,
  AlmondNailIcon,
  StilettoNailIcon,
  CoffinNailIcon
} from '../components/NailShapeIcons';

const PromptInputPage: React.FC = () => {
  const navigate = useNavigate();
  const { handImage, generatedDesign, nailShape, nailLength, nailColor } = useApp();
  const { t } = useLanguage();
  
  // Redirects
  useEffect(() => {
    if (!handImage) {
      navigate('/camera');
    }
  }, [handImage, navigate]);
  
  // Redirect when we have generated design
  useEffect(() => {
    if (generatedDesign) {
      navigate('/result');
    }
  }, [generatedDesign, navigate]);

  // Function to get the correct nail shape icon
  const getNailShapeIcon = () => {
    switch (nailShape) {
      case 'round':
        return <RoundNailIcon className="w-5 h-5" />;
      case 'square':
        return <SquareNailIcon className="w-5 h-5" />;
      case 'oval':
        return <OvalNailIcon className="w-5 h-5" />;
      case 'almond':
        return <AlmondNailIcon className="w-5 h-5" />;
      case 'stiletto':
        return <StilettoNailIcon className="w-5 h-5" />;
      case 'coffin':
        return <CoffinNailIcon className="w-5 h-5" />;
      default:
        return <OvalNailIcon className="w-5 h-5" />;
    }
  };

  // Function to get the nail length text
  const getNailLengthText = () => {
    switch (nailLength) {
      case 'short':
        return t.prompt.short;
      case 'medium':
        return t.prompt.medium;
      case 'long':
        return t.prompt.long;
      default:
        return t.prompt.medium;
    }
  };

  if (!handImage) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20 p-4 pb-28"
    >
      <div className="flex flex-col flex-1 pb-16">
        <div className="flex-1">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-3xl overflow-hidden shadow-md mx-auto mb-6 max-w-md"
            style={{
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)"
            }}
          >
            <img 
              src={handImage} 
              alt="Your hand" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <div className="px-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-xl font-medium text-center mb-6"
            >
              {t.prompt.describeDesign}
            </motion.div>
            
            <div className="mb-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="flex justify-center gap-2"
              >
                <div className="bg-background rounded-lg px-3 py-1.5 text-sm border flex items-center gap-1.5">
                  {getNailShapeIcon()}
                </div>
                
                <div className="bg-background rounded-lg px-3 py-1.5 text-sm border flex items-center">
                  {getNailLengthText()}
                </div>
                
                <div 
                  className="bg-background rounded-lg w-8 h-8 border flex items-center justify-center"
                  style={{ backgroundColor: nailColor }}
                >
                  <div className="w-6 h-6 rounded-full border border-white/40" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        <div className="pt-2 pb-6">
          <PromptInput />
        </div>
      </div>
      
      <BottomNav />
    </motion.div>
  );
};

export default PromptInputPage;

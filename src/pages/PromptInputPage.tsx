
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PromptInput from '../components/prompt/PromptInput';
import { useApp } from '../context/AppContext';
import { useIsMobile } from '../hooks/use-mobile';
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
  const isMobile = useIsMobile();
  
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

  if (!handImage) return null;

  return (
    <Layout showBackButton title="Décrivez votre design">
      <div className="flex flex-col h-full max-h-screen overflow-hidden">
        <div className="flex-1">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-3xl overflow-hidden shadow-sm mx-4 mb-4 h-1/2"
          >
            <img 
              src={handImage} 
              alt="Your hand" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <div className="px-4">
            <div className="mb-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <div className="bg-background rounded-lg px-3 py-1.5 text-sm border flex items-center gap-1.5">
                  {getNailShapeIcon()}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        <div className="pt-2 pb-6">
          <PromptInput />
        </div>
      </div>
    </Layout>
  );
};

export default PromptInputPage;

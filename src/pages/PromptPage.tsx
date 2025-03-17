
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PromptInput from '../components/PromptInput';
import { useApp } from '../context/AppContext';

const PromptPage: React.FC = () => {
  const navigate = useNavigate();
  const { handImage, generatedDesign } = useApp();
  
  // Redirect if no hand image
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

  if (!handImage) return null;

  return (
    <Layout showBackButton title="Design your nails">
      <div className="flex flex-col h-full">
        <div className="flex-1 p-4 overflow-hidden">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-3xl overflow-hidden shadow-sm h-full"
          >
            <img 
              src={handImage} 
              alt="Your hand" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
        
        <div className="pt-2 pb-6">
          <PromptInput />
        </div>
      </div>
    </Layout>
  );
};

export default PromptPage;

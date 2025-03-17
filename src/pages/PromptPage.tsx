
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import NailShapeSelector from '../components/NailShapeSelector';
import NailLengthSelector from '../components/NailLengthSelector';
import NailColorSelector from '../components/NailColorSelector';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const PromptPage: React.FC = () => {
  const navigate = useNavigate();
  const { handImage } = useApp();
  
  // Redirect if no hand image
  useEffect(() => {
    if (!handImage) {
      navigate('/camera');
    }
  }, [handImage, navigate]);

  const handleContinue = () => {
    navigate('/prompt-input');
  };

  if (!handImage) return null;

  return (
    <Layout showBackButton title="Personnalisez vos ongles">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pb-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-3xl overflow-hidden shadow-sm mx-4 mb-6"
          >
            <img 
              src={handImage} 
              alt="Your hand" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <div className="px-4 space-y-6">
            <NailShapeSelector />
            <NailLengthSelector />
            <NailColorSelector />
          </div>
        </div>
        
        <div className="px-4 py-4 border-t border-muted">
          <Button 
            onClick={handleContinue} 
            className="w-full py-6" 
            size="lg"
          >
            Continuer <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default PromptPage;

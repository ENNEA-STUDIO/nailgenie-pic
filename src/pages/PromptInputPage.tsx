
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PromptInput from '../components/PromptInput';
import { useApp } from '../context/AppContext';
import { useIsMobile } from '../hooks/use-mobile';

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

  if (!handImage) return null;

  return (
    <Layout showBackButton title="Décrivez votre design">
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
          
          <div className="px-4">
            <div className="mb-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex overflow-x-auto pb-2 gap-2"
              >
                <div className="bg-background rounded-lg px-3 py-1.5 text-sm border whitespace-nowrap">
                  <span className="font-medium mr-1">Forme:</span> 
                  <span className="capitalize">{nailShape}</span>
                </div>
                <div className="bg-background rounded-lg px-3 py-1.5 text-sm border whitespace-nowrap">
                  <span className="font-medium mr-1">Longueur:</span> 
                  <span className="capitalize">{nailLength === 'short' ? 'Court' : nailLength === 'medium' ? 'Moyen' : 'Long'}</span>
                </div>
                <div className="flex items-center bg-background rounded-lg px-3 py-1.5 text-sm border whitespace-nowrap">
                  <span className="font-medium mr-2">Couleur:</span> 
                  <span 
                    className="w-5 h-5 rounded-full border" 
                    style={{ backgroundColor: nailColor }}
                  ></span>
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <h3 className="text-lg font-medium mb-3">Description du design</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Décrivez le design que vous souhaitez pour vos ongles. Soyez aussi précis que possible.
              </p>
            </motion.div>
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


import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CameraComponent from '../components/camera/CameraComponent';
import { useApp } from '../context/AppContext';
import { Camera } from 'lucide-react';
import BottomNav from '@/components/navigation/BottomNav';
import { useLanguage } from '@/context/LanguageContext';
import CreditsDisplay from '@/components/credits/CreditsDisplay';
import { Card } from '@/components/ui/card';

const CameraPage: React.FC = () => {
  const navigate = useNavigate();
  const { handImage } = useApp();
  const { t } = useLanguage();
  const [showTip, setShowTip] = useState(false);
  
  // Show camera tip when page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTip(true);
      
      // Hide tip after a few seconds
      const hideTimer = setTimeout(() => {
        setShowTip(false);
      }, 4000);
      
      return () => clearTimeout(hideTimer);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Redirect to prompt page when we have an image
  useEffect(() => {
    if (handImage) {
      navigate('/prompt');
    }
  }, [handImage, navigate]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4 pb-32 relative"
    >
      {/* Credits Display amélioré */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute top-4 right-4 z-10"
      >
        <Card className="bg-background/70 backdrop-blur-md border border-muted/70 shadow-md px-3 py-1.5 rounded-full">
          <CreditsDisplay variant="large" />
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="w-full max-w-md"
      >
        <CameraComponent />
      </motion.div>
      
      {/* Visual tip instead of toast */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full shadow-lg flex items-center space-x-2"
          >
            <Camera className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">{t.camera.permissionPrompt}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <BottomNav />
    </motion.div>
  );
};

export default CameraPage;

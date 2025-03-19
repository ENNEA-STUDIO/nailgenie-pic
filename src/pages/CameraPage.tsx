
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CameraComponent from '../components/camera/CameraComponent';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import BottomNav from '@/components/navigation/BottomNav';

const CameraPage: React.FC = () => {
  const navigate = useNavigate();
  const { handImage } = useApp();
  
  // Show toast when page loads to guide the user
  useEffect(() => {
    // Give browser a moment to load before showing the toast
    const timer = setTimeout(() => {
      toast.info(
        "Veuillez autoriser l'accès à la caméra lorsque demandé",
        { duration: 4000 }
      );
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
      className="h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4 pb-24"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="w-full max-w-md"
      >
        <CameraComponent />
      </motion.div>
      
      <BottomNav />
    </motion.div>
  );
};

export default CameraPage;


import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CameraComponent from '../components/camera/CameraComponent';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="px-4 py-6 h-screen flex items-center justify-center"
    >
      <div className="w-full max-w-md">
        <CameraComponent />
      </div>
    </motion.div>
  );
};

export default CameraPage;

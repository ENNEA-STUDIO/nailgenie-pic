
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CameraComponent from '../components/Camera';
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
    <Layout showBackButton title="Prendre une photo">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="px-4 py-6 h-full"
      >
        <CameraComponent />
      </motion.div>
    </Layout>
  );
};

export default CameraPage;

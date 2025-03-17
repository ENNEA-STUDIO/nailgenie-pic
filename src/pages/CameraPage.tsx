
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CameraComponent from '../components/Camera';
import { useApp } from '../context/AppContext';

const CameraPage: React.FC = () => {
  const navigate = useNavigate();
  const { handImage } = useApp();
  
  // Redirect to prompt page when we have an image
  React.useEffect(() => {
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

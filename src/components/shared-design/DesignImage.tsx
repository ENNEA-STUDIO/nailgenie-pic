
import React from 'react';
import { motion } from 'framer-motion';

interface DesignImageProps {
  imageUrl: string;
  prompt: string;
}

const DesignImage: React.FC<DesignImageProps> = ({ imageUrl, prompt }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="rounded-2xl overflow-hidden shadow-xl bg-white mb-8"
    >
      <img 
        src={imageUrl} 
        alt={prompt} 
        className="w-full h-auto"
      />
    </motion.div>
  );
};

export default DesignImage;

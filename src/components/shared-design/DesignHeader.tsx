
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface DesignHeaderProps {
  sharerName: string;
  prompt: string;
}

const DesignHeader: React.FC<DesignHeaderProps> = ({ sharerName, prompt }) => {
  const { language } = useLanguage();

  const getFrenchHeaderMessage = () => (
    <>
      <span className="block font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
        {sharerName} te partage
      </span>
      <span className="block">sa création nail art ✨</span>
    </>
  );

  const getEnglishHeaderMessage = () => (
    <>
      <span className="block font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
        {sharerName} shared
      </span>
      <span className="block">this amazing nail design ✨</span>
    </>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-8"
    >
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        {language === 'fr' ? getFrenchHeaderMessage() : getEnglishHeaderMessage()}
      </h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-gray-600 text-sm italic bg-white/50 p-2 rounded-full inline-block mt-2"
      >
        "{prompt}"
      </motion.p>
    </motion.div>
  );
};

export default DesignHeader;

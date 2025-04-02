import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { shapesTranslations } from '@/locales/shapes';
import { getColorNameFromHex } from '@/utils/colorUtils';

interface DesignHeaderProps {
  sharerName: string;
  prompt: string;
  nailShape?: string;
  nailColor?: string;
  nailLength?: string;
}

const DesignHeader: React.FC<DesignHeaderProps> = ({ 
  sharerName, 
  prompt, 
  nailShape, 
  nailColor, 
  nailLength 
}) => {
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

  // Get color name from hex code
  const colorName = nailColor ? getColorNameFromHex(nailColor) : '';

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
      
      {(nailShape || nailColor || nailLength) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mt-3"
        >
          {nailShape && (
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              {language === 'fr' ? 'Forme: ' : 'Shape: '}
              {shapesTranslations[language][nailShape as keyof typeof shapesTranslations.en] || nailShape}
            </span>
          )}
          {nailColor && (
            <span className="text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
              {language === 'fr' ? 'Couleur: ' : 'Color: '}
              {colorName}
            </span>
          )}
          {nailLength && (
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {language === 'fr' ? 'Longueur: ' : 'Length: '}
              {nailLength}
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default DesignHeader;

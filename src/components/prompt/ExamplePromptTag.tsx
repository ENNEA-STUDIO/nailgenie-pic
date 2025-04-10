
import React from 'react';
import { motion } from 'framer-motion';
import { extractMainConcept } from '../../utils/promptUtils';
import { useLanguage } from '@/context/LanguageContext';

interface ExamplePromptTagProps {
  example: string;
  index: number;
  style: {
    color: string;
    size: string;
  };
  onClick: (example: string) => void;
}

const ExamplePromptTag: React.FC<ExamplePromptTagProps> = ({ 
  example, 
  index, 
  style, 
  onClick 
}) => {
  const { language } = useLanguage();
  
  // Extract the main concept and truncate if needed
  const displayName = extractMainConcept(example);
  const truncatedName = displayName.length > 14 ? `${displayName.substring(0, 14)}...` : displayName;
  
  return (
    <motion.button
      key={index}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: "easeOut"
      }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(example)}
      className={`${style.color} ${style.size} px-3 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border whitespace-nowrap touch-manipulation`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {truncatedName}
    </motion.button>
  );
};

export default ExamplePromptTag;

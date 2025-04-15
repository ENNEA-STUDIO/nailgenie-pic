
import React from 'react';
import { motion } from 'framer-motion';
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
  
  // For color-specific prompts, we don't need to truncate as much since they're already focused
  const displayName = example.length > 30 ? `${example.substring(0, 30)}...` : example;
  
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
      className={`${style.color} ${style.size} px-3.5 py-2.5 rounded-full hover:shadow-md transition-all duration-200 cursor-pointer border whitespace-nowrap font-medium`}
    >
      {displayName}
    </motion.button>
  );
};

export default ExamplePromptTag;

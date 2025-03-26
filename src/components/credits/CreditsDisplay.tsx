
import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import NailPolishIcon from './NailPolishIcon';

interface CreditsDisplayProps {
  className?: string;
  showTooltip?: boolean;
}

const CreditsDisplay: React.FC<CreditsDisplayProps> = ({ 
  className = "",
  showTooltip = true
}) => {
  const { credits } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex items-center gap-1.5 relative ${className}`}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate('/buy-credits')}
    >
      <NailPolishIcon className="w-5 h-5 text-primary" />
      
      <span className="font-medium">{credits}</span>
      
      {showTooltip && credits < 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-8 whitespace-nowrap text-xs bg-white/90 backdrop-blur-sm shadow-md px-2 py-1 rounded-md text-gray-700"
        >
          {t.credits.lowCredits}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CreditsDisplay;

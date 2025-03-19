
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ResultErrorProps {
  onTryAgain: () => void;
  isSafari: boolean;
  isIOS: boolean;
}

const ResultError: React.FC<ResultErrorProps> = ({ onTryAgain, isSafari, isIOS }) => {
  const { t } = useLanguage();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card rounded-3xl overflow-hidden p-8 flex flex-col items-center justify-center max-w-md w-full"
      style={{ height: 'auto', minHeight: '320px' }}
    >
      <h3 className="text-lg font-medium mb-2 text-destructive">{t.common.error}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
        {t.result.loadingError}
        {(isSafari || isIOS) && (
          <span className="block mt-2 text-xs">
            {t.result.safariError}
          </span>
        )}
      </p>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onTryAgain}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] text-white shadow-lg"
      >
        <RefreshCw size={28} />
      </motion.button>
    </motion.div>
  );
};

export default ResultError;

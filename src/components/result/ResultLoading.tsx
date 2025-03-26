
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import NailPolishLoader from '../loaders/NailPolishLoader';

interface ResultLoadingProps {
  prompt: string;
}

const ResultLoading: React.FC<ResultLoadingProps> = ({ prompt }) => {
  const { t } = useLanguage();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card rounded-3xl overflow-hidden p-8 flex flex-col items-center justify-center max-w-md w-full"
      style={{ height: 'auto', minHeight: '320px' }}
    >
      <NailPolishLoader text={t.result.working} timeoutMessage={true} />
      
      <p className="text-sm text-muted-foreground text-center max-w-xs mt-2">
        {prompt ? `Creating "${prompt}"` : "Working on your perfect nail design..."}
      </p>
    </motion.div>
  );
};

export default ResultLoading;


import React from 'react';
import { motion } from 'framer-motion';

interface ResultLoadingProps {
  prompt: string;
}

const ResultLoading: React.FC<ResultLoadingProps> = ({ prompt }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card rounded-3xl overflow-hidden p-8 flex flex-col items-center justify-center max-w-md w-full"
      style={{ height: 'auto', minHeight: '320px' }}
    >
      <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-primary animate-spin mb-6"></div>
      <h3 className="text-lg font-medium mb-2">Création de votre design</h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        Nous travaillons sur votre design "{prompt}". Cela peut prendre un moment...
      </p>
    </motion.div>
  );
};

export default ResultLoading;

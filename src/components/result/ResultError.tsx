
import React from 'react';
import { motion } from 'framer-motion';

interface ResultErrorProps {
  onTryAgain: () => void;
  isSafari: boolean;
  isIOS: boolean;
}

const ResultError: React.FC<ResultErrorProps> = ({ onTryAgain, isSafari, isIOS }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card rounded-3xl overflow-hidden p-6 flex flex-col items-center justify-center"
      style={{ height: 'calc(100vh - 18rem)' }}
    >
      <h3 className="text-lg font-medium mb-2 text-destructive">Erreur de chargement</h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs mb-4">
        Impossible de charger l'image générée. Veuillez réessayer.
        {(isSafari || isIOS) && (
          <span className="block mt-2 text-xs">
            Si vous utilisez Safari, essayez d'ouvrir cette application dans Chrome pour de meilleurs résultats.
          </span>
        )}
      </p>
      <button 
        onClick={onTryAgain}
        className="px-4 py-2 bg-primary text-white rounded-xl"
      >
        Réessayer
      </button>
    </motion.div>
  );
};

export default ResultError;

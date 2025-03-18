
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const SuccessStep: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full py-8 space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center"
      >
        <CheckCircle className="w-10 h-10 text-primary" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-bold">Compte créé avec succès!</h2>
        <p className="text-muted-foreground">
          Votre compte a été créé et vous êtes prêt à explorer NailGenie
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-wrap gap-2 justify-center"
      >
        {['Designs personnalisés', 'Inspiration', 'Partage', 'Conseils'].map((tag, i) => (
          <span 
            key={i}
            className="px-3 py-1 bg-muted rounded-full text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default SuccessStep;

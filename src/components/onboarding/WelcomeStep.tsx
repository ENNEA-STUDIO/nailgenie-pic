
import React from 'react';
import { motion } from 'framer-motion';

const WelcomeStep: React.FC = () => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
  };

  const features = [
    {
      icon: "✨",
      text: "Créez des designs uniques pour vos ongles"
    },
    {
      icon: "📸",
      text: "Prenez une photo et visualisez les résultats"
    },
    {
      icon: "🎨",
      text: "Des milliers de styles et couleurs disponibles"
    }
  ];

  return (
    <div className="flex flex-col items-center text-center space-y-8 py-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center"
      >
        <span className="text-4xl">💅</span>
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-2xl font-bold"
      >
        Bienvenue sur NailGenie
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-muted-foreground"
      >
        Votre assistant personnel pour créer des designs d'ongles exceptionnels
      </motion.p>
      
      <div className="grid gap-4 w-full max-w-xs mx-auto">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={variants}
            className="flex items-center gap-3 text-left"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span>{feature.icon}</span>
            </div>
            <span className="text-sm">{feature.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeStep;

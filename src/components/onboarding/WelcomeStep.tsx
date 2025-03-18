
import React from 'react';
import { motion } from 'framer-motion';

const WelcomeStep: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
    <motion.div 
      className="flex flex-col items-center text-center space-y-8 py-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center transform-gpu"
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, 0, -5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <span className="text-5xl">💅</span>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Bienvenue sur NailGenie
        </h2>
        <p className="text-muted-foreground mt-2">
          Votre assistant personnel pour créer des designs d'ongles exceptionnels
        </p>
      </motion.div>
      
      <div className="grid gap-4 w-full max-w-sm mx-auto">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ scale: 1.03, x: 5 }}
            className="flex items-center gap-3 text-left p-3 rounded-xl bg-gradient-to-r from-background to-secondary/50 border border-border/50 shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xl">{feature.icon}</span>
            </div>
            <span>{feature.text}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WelcomeStep;

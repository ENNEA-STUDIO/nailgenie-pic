
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
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
      text: "Designs uniques"
    },
    {
      icon: "📸",
      text: "Visualisation instant"
    },
    {
      icon: "🎨",
      text: "Milliers de styles"
    }
  ];

  return (
    <motion.div 
      className="flex flex-col items-center text-center space-y-6 py-8 px-4 w-full max-w-md mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center transform-gpu shadow-xl"
        style={{
          boxShadow: '0 10px 25px -5px rgba(219, 39, 119, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.5)'
        }}
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
      
      <motion.div variants={itemVariants} className="space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          NailGenie
        </h2>
        <p className="text-base text-muted-foreground max-w-xs mx-auto">
          Votre assistant beauté des ongles
        </p>
      </motion.div>
      
      <div className="grid gap-5 w-full">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ scale: 1.03, x: 5 }}
            className="flex items-center gap-3 text-left p-3 rounded-xl bg-gradient-to-r from-background to-secondary/20 border border-pink-200/40 shadow-sm backdrop-blur-sm"
            style={{
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.3)'
            }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-xl">{feature.icon}</span>
            </div>
            <span className="font-medium text-sm">{feature.text}</span>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full mt-4 pt-4"
      >
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full"
        >
          <button 
            className="w-full py-4 px-6 rounded-full font-medium text-white flex items-center justify-center gap-2 shadow-lg"
            style={{ 
              background: 'linear-gradient(90deg, #D946EF 0%, #9b87f5 100%)',
              boxShadow: '0 10px 15px -3px rgba(214, 31, 255, 0.2), 0 4px 6px -2px rgba(215, 115, 247, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.3)'
            }}
            onClick={onNext}
          >
            <span>Créer mon design</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeStep;

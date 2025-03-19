
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const SuccessStep: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Trigger confetti when component mounts
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
      }));
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
      }));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  
  return (
    <motion.div 
      className="flex flex-col items-center justify-center text-center h-full py-8 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <CheckCircle className="w-14 h-14 text-primary" />
        </motion.div>
      </motion.div>
      
      <motion.div
        variants={itemVariants}
        className="space-y-2"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Compte créé avec succès!
        </h2>
        <p className="text-muted-foreground">
          Votre compte a été créé et vous êtes prêt à explorer NailGenie
        </p>
      </motion.div>
      
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap gap-2 justify-center"
      >
        {['Designs personnalisés', 'Inspiration', 'Partage', 'Conseils'].map((tag, i) => (
          <motion.span 
            key={i}
            className="px-3 py-1 bg-gradient-to-r from-background to-secondary rounded-full text-xs font-medium border border-border/50 shadow-sm"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>
      
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-3 w-full max-w-xs mt-6"
      >
        <motion.div 
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0px 0px 30px rgba(214, 31, 255, 0.4)"
          }}
          whileTap={{ scale: 0.97 }}
          className="relative overflow-hidden group"
        >
          <Button 
            onClick={() => navigate('/camera')}
            className="w-full h-16 rounded-xl font-bold text-lg text-white"
            style={{
              background: "linear-gradient(45deg, #FF719A 0%, #FF9674 50%, #FFD29F 100%)",
              boxShadow: "0px 10px 20px rgba(219, 39, 119, 0.3), inset 0px 1px 3px rgba(255, 255, 255, 0.5)",
              transition: "all 0.5s ease"
            }}
          >
            <span className="absolute inset-0 overflow-hidden rounded-xl">
              <span className="absolute inset-0 z-10 opacity-0 group-hover:opacity-80 transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.8),_transparent_60%)] blur-xl"></span>
            </span>
            <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
            <span>Prendre une photo</span>
            <Camera className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SuccessStep;


import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, LogIn, ArrowRight } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
  showLoginOption?: boolean;
  toggleLoginMode?: () => void;
  isLogin?: boolean;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ 
  onNext, 
  showLoginOption = false, 
  toggleLoginMode,
  isLogin = false 
}) => {
  const { t, language } = useLanguage();
  
  // Animation variants
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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-4 py-6 space-y-8 text-center"
    >
      <motion.div 
        variants={itemVariants}
        className="flex justify-center"
      >
        <div className="rounded-full bg-primary/10 p-4 w-20 h-20 flex items-center justify-center">
          <motion.div
            animate={{ 
              rotate: [0, 5, 0, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Sparkles className="h-10 w-10 text-primary" />
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-center">
          {language === 'fr' ? 'Bienvenue sur NailGenie' : 'Welcome to NailGenie'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'fr' 
            ? 'Votre assistant virtuel pour des ongles parfaits' 
            : 'Your virtual assistant for perfect nails'
          }
        </p>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="flex flex-col space-y-3"
      >
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button 
            onClick={onNext}
            className="w-full"
            size="lg"
            style={{
              background: 'linear-gradient(90deg, #D946EF 0%, #9b87f5 100%)',
              boxShadow: '0 10px 15px -3px rgba(214, 31, 255, 0.2), 0 4px 6px -2px rgba(215, 115, 247, 0.1)'
            }}
          >
            {isLogin 
              ? (language === 'fr' ? 'Se connecter' : 'Login') 
              : (language === 'fr' ? 'Créer un compte' : 'Create an account')
            }
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
        
        {showLoginOption && toggleLoginMode && (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button 
              onClick={toggleLoginMode} 
              variant="outline" 
              className="w-full border-pink-100"
              size="lg"
            >
              {isLogin 
                ? (language === 'fr' ? "S'inscrire" : "Sign up") 
                : (language === 'fr' ? "Se connecter" : "Login")
              }
              {!isLogin && <LogIn className="ml-2 h-4 w-4" />}
            </Button>
          </motion.div>
        )}
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <p className="text-xs text-muted-foreground">
          {language === 'fr' 
            ? 'En continuant, vous acceptez nos Conditions Générales et notre Politique de Confidentialité'
            : 'By continuing, you agree to our Terms of Service and Privacy Policy'
          }
        </p>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeStep;

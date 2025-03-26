
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const content = {
    fr: {
      title: "Visualisez votre manucure parfaite",
      subtitle: "NailGenie utilise l'IA pour vous montrer à quoi ressembleraient différents designs sur vos propres ongles, avant même de vous rendre en salon.",
      reviewText: "Plus de 10 000 designs générés",
      buttonText: "Commencer l'expérience",
      features: [
        { icon: "✨", text: "Gratuit pour commencer" },
        { icon: "🔒", text: "Sans carte bancaire" },
        { icon: "⚡", text: "Résultats instantanés" }
      ]
    },
    en: {
      title: "Visualize your perfect manicure",
      subtitle: "NailGenie uses AI to show you what different designs would look like on your own nails, before you even go to the salon.",
      reviewText: "Over 10,000 designs generated",
      buttonText: "Start the experience",
      features: [
        { icon: "✨", text: "Free to start" },
        { icon: "🔒", text: "No credit card" },
        { icon: "⚡", text: "Instant results" }
      ]
    }
  };
  
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
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <section className="relative z-10 container mx-auto px-4 pt-8 pb-16 flex flex-col items-center text-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto"
      >
        <motion.div 
          variants={itemVariants}
          className="relative"
        >
          <div className="absolute -z-10 w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute top-0 left-1/4 w-24 h-24 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 drop-shadow-sm">
            {content[language].title}
          </h2>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mb-10">
          <p className="text-lg md:text-xl text-gray-700 mb-4 max-w-2xl mx-auto">
            {content[language].subtitle}
          </p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-1.5 mb-6"
          >
            {Array(5).fill(0).map((_, i) => (
              <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            ))}
            <span className="ml-1 text-sm text-gray-600">{content[language].reviewText}</span>
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="flex flex-col items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative mb-4 group"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full opacity-70 blur-lg group-hover:opacity-80 transition-opacity"></div>
            <Button 
              onClick={() => navigate('/onboarding')}
              className="relative rounded-full px-10 py-7 text-lg font-semibold"
              style={{
                background: "linear-gradient(90deg, #D946EF 0%, #9b87f5 100%)",
                boxShadow: "0 10px 25px -3px rgba(214, 31, 255, 0.25), 0 4px 6px -2px rgba(215, 115, 247, 0.15)"
              }}
            >
              <motion.span
                animate={{ 
                  x: [0, 3, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="flex items-center justify-center gap-2"
              >
                {content[language].buttonText}
                <motion.div
                  animate={{ 
                    x: [0, 5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </motion.span>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3 max-w-lg"
          >
            {content[language].features.map((item, i) => (
              <div key={i} className="flex items-center gap-1 bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-fuchsia-700 border border-fuchsia-100">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

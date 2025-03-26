
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const CTA: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const content = {
    fr: {
      title: "Prête à découvrir votre prochaine manucure ?",
      subtitle: "Rejoignez NailGenie aujourd'hui et transformez votre expérience de manucure avec la puissance de l'IA.",
      buttonText: "Commencer l'aventure",
      tagline: "✨ Gratuit pour commencer - Aucune carte de crédit requise"
    },
    en: {
      title: "Ready to discover your next manicure?",
      subtitle: "Join NailGenie today and transform your manicure experience with the power of AI.",
      buttonText: "Start the adventure",
      tagline: "✨ Free to start - No credit card required"
    }
  };
  
  return (
    <section className="relative z-10 container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl overflow-hidden p-8 md:p-16 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(243,232,255,0.9) 100%)",
          boxShadow: "0 25px 50px -12px rgba(219, 39, 119, 0.25), 0 0 1px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.7)",
          backdropFilter: "blur(16px)"
        }}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            {content[language].title}
          </h2>
          <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
            {content[language].subtitle}
          </p>
          
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full opacity-70 blur-lg"></div>
              <Button 
                onClick={() => navigate('/onboarding')}
                className="relative rounded-full px-10 py-6 text-lg font-semibold"
                style={{
                  background: "linear-gradient(90deg, #D946EF 0%, #9b87f5 100%)",
                  boxShadow: "0 10px 15px -3px rgba(214, 31, 255, 0.2), 0 4px 6px -2px rgba(215, 115, 247, 0.1)"
                }}
              >
                <span className="mr-2">{content[language].buttonText}</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-pink-500 mt-6 font-medium"
          >
            {content[language].tagline}
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTA;

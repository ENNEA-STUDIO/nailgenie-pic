import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Image, Sparkles, Star } from 'lucide-react';
import NailPolishIcon from '@/components/credits/NailPolishIcon';
import { useLanguage } from '@/context/LanguageContext';

const Features: React.FC = () => {
  const { language } = useLanguage();
  
  const content = {
    fr: {
      title: "Pourquoi choisir GeNails ?",
      subtitle: "Découvrez les avantages qui font de GeNails l'application préférée des passionnés de manucure",
      benefits: [
        {
          icon: <Star className="h-10 w-10 text-yellow-400" />,
          title: "Designs uniques",
          description: "Des designs personnalisés et uniques générés spécifiquement pour vous"
        },
        {
          icon: <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
            <NailPolishIcon className="h-10 w-10 text-pink-500" />
          </motion.div>,
          title: "Économisez du temps",
          description: "Plus besoin d'essayer différentes manucures, visualisez-les d'abord"
        },
        {
          icon: <Sparkles className="h-10 w-10 text-purple-400" />,
          title: "Inspirez-vous",
          description: "Explorez notre galerie pour découvrir de nouvelles tendances"
        }
      ]
    },
    en: {
      title: "Why choose GeNails?",
      subtitle: "Discover the benefits that make GeNails the preferred app for nail enthusiasts",
      benefits: [
        {
          icon: <Star className="h-10 w-10 text-yellow-400" />,
          title: "Unique Designs",
          description: "Custom, unique designs generated specifically for you"
        },
        {
          icon: <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
            <NailPolishIcon className="h-10 w-10 text-pink-500" />
          </motion.div>,
          title: "Save Time",
          description: "No need to try different manicures, visualize them first"
        },
        {
          icon: <Sparkles className="h-10 w-10 text-purple-400" />,
          title: "Get Inspired",
          description: "Explore our gallery to discover new trends"
        }
      ]
    }
  };

  return (
    <section className="relative z-10 container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          {content[language].title}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {content[language].subtitle}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {content[language].benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            className="glass-card p-6 rounded-2xl text-center"
          >
            <div className="bg-white/40 backdrop-blur-sm w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              {benefit.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-fuchsia-700">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;

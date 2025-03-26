
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from '@/components/ui/accordion';
import { useLanguage } from '@/context/LanguageContext';

const FAQ: React.FC = () => {
  const { language } = useLanguage();
  
  const faqItems = {
    fr: [
      {
        question: "Comment fonctionne NailGenie ?",
        answer: "NailGenie utilise l'intelligence artificielle pour analyser la forme et la taille de vos ongles à partir d'une photo. L'application génère ensuite des designs de manucure personnalisés que vous pouvez visualiser sur vos propres ongles avant de vous rendre en salon."
      },
      {
        question: "Est-ce que NailGenie est gratuit ?",
        answer: "NailGenie propose une version gratuite qui vous permet de générer un nombre limité de designs. Des abonnements premium sont disponibles pour accéder à des fonctionnalités avancées et des designs illimités."
      },
      {
        question: "Puis-je partager mes designs avec mon salon de manucure ?",
        answer: "Absolument ! Vous pouvez facilement enregistrer et partager vos designs préférés avec votre salon de manucure pour vous assurer d'obtenir exactement ce que vous souhaitez."
      },
      {
        question: "Quels types de manucures puis-je essayer ?",
        answer: "NailGenie vous permet d'essayer une variété de styles, incluant le vernis traditionnel, le gel, les ongles en acrylique, les nail arts complexes, et bien plus encore. Vous pouvez également personnaliser les couleurs et les motifs selon vos préférences."
      },
      {
        question: "Comment puis-je prendre une bonne photo de mes ongles ?",
        answer: "Pour de meilleurs résultats, prenez une photo de vos ongles dans un endroit bien éclairé, avec un fond uni. Assurez-vous que vos ongles sont propres et visibles. Notre application vous guidera à travers le processus pour obtenir la meilleure photo possible."
      }
    ],
    en: [
      {
        question: "How does NailGenie work?",
        answer: "NailGenie uses artificial intelligence to analyze the shape and size of your nails from a photo. The app then generates customized manicure designs that you can visualize on your own nails before going to the salon."
      },
      {
        question: "Is NailGenie free?",
        answer: "NailGenie offers a free version that allows you to generate a limited number of designs. Premium subscriptions are available for access to advanced features and unlimited designs."
      },
      {
        question: "Can I share my designs with my nail salon?",
        answer: "Absolutely! You can easily save and share your favorite designs with your nail salon to ensure you get exactly what you want."
      },
      {
        question: "What types of manicures can I try?",
        answer: "NailGenie allows you to try a variety of styles, including traditional polish, gel, acrylic nails, complex nail art, and much more. You can also customize colors and patterns according to your preferences."
      },
      {
        question: "How do I take a good photo of my nails?",
        answer: "For best results, take a photo of your nails in a well-lit place with a plain background. Make sure your nails are clean and visible. Our app will guide you through the process to get the best possible photo."
      }
    ]
  };

  const titles = {
    fr: {
      title: "Questions fréquentes",
      subtitle: "Tout ce que vous devez savoir sur NailGenie"
    },
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about NailGenie"
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
          {titles[language].title}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {titles[language].subtitle}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-3xl mx-auto glass-card rounded-2xl p-6 md:p-8"
      >
        <Accordion type="single" collapsible className="w-full">
          {faqItems[language].map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-pink-100 last:border-0">
              <AccordionTrigger className="text-left font-medium text-fuchsia-800 hover:text-fuchsia-600 py-5">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-5">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
};

export default FAQ;


import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CameraIcon, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface AppPromotionProps {
  inviteCode: string;
}

const AppPromotion: React.FC<AppPromotionProps> = ({ inviteCode }) => {
  const { language } = useLanguage();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 mt-6"
    >
      <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 mb-4">
        <Sparkles className="text-purple-500" size={24} />
        {language === 'fr' ? 'Créez votre propre design d\'ongles' : 'Create Your Own Nail Design'}
      </h2>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
          <CameraIcon className="text-purple-500" size={32} />
        </div>
        <p className="text-gray-600">
          {language === 'fr' 
            ? 'Prenez une photo de vos ongles et voyez instantanément à quoi ressembleraient différents designs grâce à l\'IA.' 
            : 'Take a photo of your nails and instantly see what different designs would look like using AI.'}
        </p>
      </div>
      
      <Link to={`/onboarding?invite=${inviteCode}`}>
        <Button className="w-full py-6 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md">
          {language === 'fr' ? 'Commencer avec 5 crédits gratuits' : 'Get Started with 5 Free Credits'}
        </Button>
      </Link>
    </motion.div>
  );
};

export default AppPromotion;

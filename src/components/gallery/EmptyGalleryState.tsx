
import React from 'react';
import { Image, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const EmptyGalleryState: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  // Redirect to camera/create page
  const handleCreateFirstDesign = () => {
    navigate('/camera');
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto"
    >
      <div className="mb-8 p-7 rounded-full bg-gradient-to-r from-[#FFD1DC] to-[#E6E6FA]">
        <Image size={56} className="text-[#673147]" />
      </div>
      
      <h3 className="text-2xl font-semibold mb-3 text-center">
        {language === 'fr' ? 'Votre galerie est vide' : 'Your gallery is empty'}
      </h3>
      
      <p className="text-muted-foreground text-center mb-8 max-w-xs">
        {language === 'fr' 
          ? 'Créez votre premier design de nails et sauvegardez-le pour commencer votre collection'
          : 'Create your first nail design and save it to start your collection'}
      </p>
      
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          onClick={handleCreateFirstDesign}
          className="px-6 py-6 rounded-xl text-base font-medium flex items-center gap-3"
          style={{
            background: "linear-gradient(135deg, #B76E79 0%, #FF3399 100%)",
            boxShadow: "0 8px 20px -6px rgba(183, 110, 121, 0.6)"
          }}
        >
          <Sparkles className="w-5 h-5" />
          {language === 'fr' ? 'Créer mon premier design' : 'Create my first design'}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default EmptyGalleryState;

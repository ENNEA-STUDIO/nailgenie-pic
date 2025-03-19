
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, Grid } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  // Determine which page is active
  const isCamera = ['/camera', '/prompt', '/prompt-input', '/result'].includes(location.pathname);
  const isGallery = location.pathname === '/gallery';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 left-0 right-0 z-50 px-4"
    >
      <div className="max-w-md mx-auto p-2 rounded-full backdrop-blur-xl bg-white/20 border border-white/30 shadow-lg">
        <div className="flex items-center justify-around">
          <motion.button
            onClick={() => navigate('/camera')}
            className={`flex flex-col items-center px-7 py-3 rounded-full transition-all duration-300 ${isCamera ? 'bg-primary text-white shadow-md' : 'text-foreground/80 hover:bg-white/20'}`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -2 }}
          >
            <Camera className={`w-5 h-5 ${isCamera ? 'text-white' : 'text-foreground/80'}`} />
            <span className="text-xs mt-1 font-medium">{t.common.create}</span>
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/gallery')}
            className={`flex flex-col items-center px-7 py-3 rounded-full transition-all duration-300 ${isGallery ? 'bg-primary text-white shadow-md' : 'text-foreground/80 hover:bg-white/20'}`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -2 }}
          >
            <Grid className={`w-5 h-5 ${isGallery ? 'text-white' : 'text-foreground/80'}`} />
            <span className="text-xs mt-1 font-medium">{t.common.gallery}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BottomNav;

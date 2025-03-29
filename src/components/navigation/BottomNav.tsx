
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, Grid, Rss, Coins } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import CreditsDisplay from '@/components/credits/CreditsDisplay';
import { useApp } from '@/context/AppContext';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  // Determine which page is active
  const isCamera = ['/camera', '/prompt', '/prompt-input', '/result'].includes(location.pathname);
  const isGallery = location.pathname === '/gallery';
  const isFeed = location.pathname === '/feed';
  const isCredits = location.pathname === '/buy-credits';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pointer-events-none"
    >
      <div className="max-w-md mx-auto p-2 rounded-full backdrop-blur-xl bg-white/20 border border-white/30 shadow-lg pointer-events-auto">
        <div className="flex items-center justify-around">
          <motion.button
            onClick={() => navigate('/camera')}
            className={`flex flex-col items-center px-5 py-3 rounded-full transition-all duration-300 ${isCamera ? 'bg-primary text-white shadow-md' : 'text-foreground/80 hover:bg-white/20'}`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -2 }}
          >
            <Camera className={`w-5 h-5 ${isCamera ? 'text-white' : 'text-foreground/80'}`} />
            <span className="text-xs mt-1 font-medium">{t.common.create}</span>
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/gallery')}
            className={`flex flex-col items-center px-5 py-3 rounded-full transition-all duration-300 ${isGallery ? 'bg-primary text-white shadow-md' : 'text-foreground/80 hover:bg-white/20'}`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -2 }}
          >
            <Grid className={`w-5 h-5 ${isGallery ? 'text-white' : 'text-foreground/80'}`} />
            <span className="text-xs mt-1 font-medium">{t.common.gallery}</span>
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/feed')}
            className={`flex flex-col items-center px-5 py-3 rounded-full transition-all duration-300 ${isFeed ? 'bg-primary text-white shadow-md' : 'text-foreground/80 hover:bg-white/20'}`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -2 }}
          >
            <Rss className={`w-5 h-5 ${isFeed ? 'text-white' : 'text-foreground/80'}`} />
            <span className="text-xs mt-1 font-medium">{t.common.feed}</span>
          </motion.button>

          <motion.button
            onClick={() => navigate('/buy-credits')}
            className={`flex flex-col items-center px-5 py-3 rounded-full transition-all duration-300 ${isCredits ? 'bg-primary text-white shadow-md' : 'text-foreground/80 hover:bg-white/20'}`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -2 }}
          >
            <div className="relative">
              <CreditsDisplay 
                variant="compact" 
                showTooltip={false} 
                className={`${isCredits ? 'border-white/30 bg-transparent' : ''}`}
              />
            </div>
            <span className="text-xs mt-1 font-medium">{t.nav.credits}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BottomNav;

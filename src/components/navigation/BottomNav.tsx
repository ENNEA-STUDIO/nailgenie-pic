
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, Grid, Rss } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import CreditsDisplay from '@/components/credits/CreditsDisplay';
import { useApp } from '@/context/AppContext';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { credits } = useApp();
  
  // Determine which page is active
  const isCamera = ['/camera', '/prompt', '/prompt-input', '/result'].includes(location.pathname);
  const isGallery = location.pathname === '/gallery';
  const isFeed = location.pathname === '/feed';
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center">
      {/* Credits Module - Sticky above menu */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-2"
        onClick={() => navigate('/buy-credits')}
      >
        <div className="bg-background/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-primary/20 flex items-center gap-2">
          <CreditsDisplay variant="default" showTooltip={false} />
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs font-medium"
          >
            {t.nav.credits}
          </motion.span>
        </div>
      </motion.div>
      
      {/* Main Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-4 pb-6"
      >
        <div className="max-w-md mx-auto p-2 rounded-full backdrop-blur-xl bg-white/20 border border-white/30 shadow-lg">
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
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BottomNav;

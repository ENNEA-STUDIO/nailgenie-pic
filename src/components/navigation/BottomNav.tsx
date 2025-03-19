
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, Grid } from 'lucide-react';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine which page is active
  const isCamera = ['/camera', '/prompt', '/prompt-input', '/result'].includes(location.pathname);
  const isGallery = location.pathname === '/gallery';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-50 py-2 px-4 bg-white/80 backdrop-blur-lg border-t border-border"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        <button
          onClick={() => navigate('/camera')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${isCamera ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Camera className={`w-6 h-6 ${isCamera ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className="text-xs mt-1">Créer</span>
        </button>
        
        <button
          onClick={() => navigate('/gallery')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${isGallery ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Grid className={`w-6 h-6 ${isGallery ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className="text-xs mt-1">Gallerie</span>
        </button>
      </div>
    </motion.div>
  );
};

export default BottomNav;

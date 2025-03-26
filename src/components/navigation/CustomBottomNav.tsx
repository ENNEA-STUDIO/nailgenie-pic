
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Camera, Image, Home, Cog } from 'lucide-react';
import CreditsDisplay from '../credits/CreditsDisplay';

const CustomBottomNav: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/camera', icon: <Camera className="w-6 h-6" />, label: t.nav.camera },
    { path: '/gallery', icon: <Image className="w-6 h-6" />, label: t.nav.gallery },
    { path: '/feed', icon: <Home className="w-6 h-6" />, label: t.nav.feed },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background backdrop-blur-md bg-opacity-80 z-50 border-t border-gray-200">
      <div className="flex items-center justify-between max-w-md mx-auto px-6 py-2">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className="flex-1">
            <div
              className={`flex flex-col items-center py-2 ${
                isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {isActive(item.path) && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 w-12 h-1 bg-primary rounded-b-md"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </div>
          </Link>
        ))}
        
        {/* Credits display */}
        <Link to="/buy-credits" className="flex-1">
          <div
            className={`flex flex-col items-center py-2 ${
              isActive('/buy-credits') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {isActive('/buy-credits') && (
              <motion.div
                layoutId="activeTab"
                className="absolute top-0 w-12 h-1 bg-primary rounded-b-md"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <CreditsDisplay showTooltip={false} />
            <span className="text-xs mt-1">{t.nav.credits}</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CustomBottomNav;

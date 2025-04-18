import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Camera, Image, Home, Sparkles } from 'lucide-react';
import CreditsDisplay from '../credits/CreditsDisplay';
import { Card } from '../ui/card';
import { useApp } from '@/context/AppContext';
import { InfinityIcon } from 'lucide-react';  // Changed from Infinity to InfinityIcon

const CustomBottomNav: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { credits, hasUnlimitedSubscription } = useApp();
  const hasLowCredits = credits <= 1 && !hasUnlimitedSubscription; // Only show low credits warning if not unlimited
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/camera', icon: <Camera className="w-6 h-6" />, label: t.nav.camera },
    { path: '/gallery', icon: <Image className="w-6 h-6" />, label: t.nav.gallery },
    { path: '/feed', icon: <Home className="w-6 h-6" />, label: t.nav.feed },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 pb-safe pointer-events-none">
      <Card className="bg-background/80 backdrop-blur-lg border-t border-muted rounded-2xl shadow-lg mx-auto max-w-md pointer-events-auto">
        <div className="flex items-center justify-between px-4 py-2">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="flex-1">
              <div
                className={`flex flex-col items-center py-2 relative ${
                  isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-1 w-10 h-1 bg-primary rounded-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </div>
            </Link>
          ))}
          
          {/* Credits display - with attention-grabbing animation when low */}
          <Link to="/buy-credits" className="flex-1">
            <div
              className={`flex flex-col items-center py-2 relative ${
                isActive('/buy-credits') ? 'text-primary' : hasLowCredits ? 'text-amber-500' : 'text-muted-foreground'
              }`}
            >
              {isActive('/buy-credits') && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 w-10 h-1 bg-primary rounded-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              
              {hasLowCredits ? (
                <motion.div 
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 1.5 
                  }}
                  className="relative"
                >
                  <CreditsDisplay showTooltip={false} className="mb-1" />
                  <Sparkles 
                    className="absolute -top-1 -right-1 w-4 h-4 text-amber-500" 
                  />
                </motion.div>
              ) : (
                <CreditsDisplay showTooltip={false} className="mb-1" />
              )}
              
              <span className={`text-xs ${hasLowCredits ? 'font-medium' : ''}`}>
                {hasUnlimitedSubscription ? t.credits.unlimited : (hasLowCredits ? t.credits.buyCredits : t.nav.credits)}
              </span>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default CustomBottomNav;

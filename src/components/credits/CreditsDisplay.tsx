
import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import NailPolishIcon from './NailPolishIcon';
import { InfinityIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CreditsDisplayProps {
  className?: string;
  showTooltip?: boolean;
  variant?: 'default' | 'compact' | 'large';
}

const CreditsDisplay: React.FC<CreditsDisplayProps> = ({ 
  className = "",
  showTooltip = true,
  variant = 'default'
}) => {
  const { credits, hasUnlimitedCredits } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const lowCredits = credits < 2 && !hasUnlimitedCredits;
  
  // Variants pour différentes tailles d'affichage
  const sizes = {
    compact: {
      container: "gap-1",
      icon: "w-4 h-4",
      text: "text-sm",
      tooltip: "-top-7",
    },
    default: {
      container: "gap-1.5",
      icon: "w-5 h-5",
      text: "text-base",
      tooltip: "-top-8",
    },
    large: {
      container: "gap-2",
      icon: "w-6 h-6",
      text: "text-lg",
      tooltip: "-top-9",
    }
  };
  
  const currentSize = sizes[variant];
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`flex items-center ${currentSize.container} relative ${lowCredits ? 'animate-pulse-subtle' : ''} ${className} rounded-full px-2 py-0.5 bg-background/10 backdrop-blur-sm border border-primary/10`}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/buy-credits')}
          >
            {hasUnlimitedCredits ? (
              <InfinityIcon 
                className={`${currentSize.icon} text-purple-400 animate-pulse`} 
              />
            ) : (
              <NailPolishIcon 
                className={`${currentSize.icon} ${lowCredits ? 'text-red-400' : 'text-primary'}`} 
                animate={lowCredits} 
              />
            )}
            
            <span className={`font-medium ${currentSize.text} ${lowCredits ? 'text-red-500' : hasUnlimitedCredits ? 'text-purple-400' : 'text-primary'}`}>
              {hasUnlimitedCredits ? '∞' : credits}
            </span>
            
            {showTooltip && lowCredits && !hasUnlimitedCredits && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`absolute ${currentSize.tooltip} whitespace-nowrap text-xs bg-white/90 backdrop-blur-sm shadow-md px-2 py-1 rounded-md text-red-600 font-medium border border-red-200`}
              >
                {t.credits.lowCredits}
              </motion.div>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-background/90 backdrop-blur-sm border border-primary/20">
          <p>
            {hasUnlimitedCredits 
              ? t.credits.unlimitedDesigns 
              : `${t.credits.currentCredits}: ${credits}`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CreditsDisplay;

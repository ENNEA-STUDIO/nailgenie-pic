
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Progress } from "@/components/ui/progress";
import { getColorNameFromHex } from '@/utils/colorUtils';

interface NailPolishLoaderProps {
  text?: string;
  timeoutMessage?: boolean;
  color?: string;
}

const NailPolishLoader: React.FC<NailPolishLoaderProps> = ({ 
  text, 
  timeoutMessage = false,
  color = "#FF69B4" // Default to pink if no color provided
}) => {
  const [fillPercentage, setFillPercentage] = useState(0);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const { t, language } = useLanguage();
  
  // Handle gradient colors for the nail polish visualization
  const displayColor = color.includes("gradient") 
    ? color.split("_gradient")[0] // Extract base color from gradient string
    : color;
  
  // For the progress bar, use a gradient if available
  const progressColor = color.includes("gradient")
    ? "bg-gradient-to-r from-pink-300 to-pink-500" // Keep default gradient
    : "";
  
  // Animate the fill level of the nail polish
  useEffect(() => {
    const totalDuration = 10000; // 10 seconds
    const interval = 100; // Update every 100ms
    const steps = totalDuration / interval;
    const increment = 100 / steps;
    
    const timer = setInterval(() => {
      setFillPercentage(prev => {
        const newValue = prev + increment;
        if (newValue >= 100) {
          clearInterval(timer);
          if (timeoutMessage) {
            setShowTimeoutMessage(true);
          }
          return 100;
        }
        return newValue;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [timeoutMessage]);
  
  const getTimeoutText = () => {
    if (language === 'fr') {
      return "Encore quelques gouttes de vernis... Patience, votre chef-d'œuvre sera bientôt prêt !";
    }
    return "Just a few more drops of polish... Hang tight, your masterpiece is almost ready!";
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative h-36 mb-4">
        {/* Nail Polish Bottle */}
        <div className="relative w-24 h-36">
          {/* Bottle Cap */}
          <div className="absolute top-0 left-0 right-0 mx-auto w-10 h-16 bg-gray-300 rounded-t-lg z-10" />
          
          {/* Bottle Body */}
          <div className="absolute bottom-0 left-0 right-0 mx-auto w-20 h-24 bg-transparent border-2 border-gray-300 rounded-b-lg overflow-hidden">
            {/* Fill Level - Animated with dynamic color */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0"
              style={{ 
                height: `${fillPercentage}%`,
                backgroundColor: displayColor,
                transition: "height 0.5s ease-in-out" 
              }}
            />
            
            {/* Shine Effect */}
            <div className="absolute top-2 left-2 w-4 h-8 bg-white opacity-30 rounded-full transform rotate-15" />
          </div>
          
          {/* Brush Handle */}
          <div className="absolute top-5 left-0 right-0 mx-auto w-2 h-14 bg-gray-200 z-5" />
          
          {/* Brush with dynamic color */}
          <div 
            className="absolute top-19 left-0 right-0 mx-auto w-3 h-5 rounded-b-lg z-5"
            style={{ backgroundColor: displayColor }}
          />
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-medium mb-1">
          {text || t.common.loading}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4">
          {showTimeoutMessage 
            ? getTimeoutText()
            : "Creating your perfect nail design..."}
        </p>
        
        <div className="w-64 mx-auto">
          <Progress value={fillPercentage} className="h-2 bg-pink-100">
            <div 
              className={`h-full ${progressColor}`} 
              style={!progressColor ? { backgroundColor: displayColor } : {}}
            />
          </Progress>
        </div>
      </div>
    </div>
  );
};

export default NailPolishLoader;

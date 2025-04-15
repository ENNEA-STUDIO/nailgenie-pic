
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useLanguage } from '@/context/LanguageContext';

interface DesignCarouselProps {
  onImageLoad: () => void;
  onImageError: () => void;
}

const DesignCarousel: React.FC<DesignCarouselProps> = ({ 
  onImageLoad, 
  onImageError 
}) => {
  const { generatedDesigns, currentDesignIndex, setCurrentDesignIndex, prompt } = useApp();
  const { language } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState<boolean[]>([]);
  
  useEffect(() => {
    if (generatedDesigns) {
      setImageLoaded(new Array(generatedDesigns.length).fill(false));
    }
  }, [generatedDesigns]);
  
  // If no designs, don't render
  if (!generatedDesigns || generatedDesigns.length === 0) return null;

  const handleImageLoad = (index: number) => {
    const newLoaded = [...imageLoaded];
    newLoaded[index] = true;
    setImageLoaded(newLoaded);
    
    if (index === currentDesignIndex) {
      onImageLoad();
    }
  };
  
  const handleSlideChange = (index: number) => {
    setCurrentDesignIndex(index);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Carousel
        className="w-full"
        defaultIndex={currentDesignIndex}
        onIndexChange={handleSlideChange}
      >
        <CarouselContent>
          {generatedDesigns.map((designUrl, index) => (
            <CarouselItem key={`design-${index}`}>
              <div className="relative flex items-center justify-center">
                {!imageLoaded[index] && (
                  <div 
                    className="w-full flex items-center justify-center bg-muted absolute inset-0"
                    style={{ minHeight: 'calc(100vh - 26rem)' }}
                  >
                    <div className="w-10 h-10 rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
                  </div>
                )}
                
                <img 
                  src={designUrl} 
                  alt={`Design option ${index + 1}`}
                  className={`w-full object-contain rounded-t-3xl ${imageLoaded[index] ? 'block' : 'opacity-0'}`}
                  style={{ maxHeight: 'calc(100vh - 26rem)' }}
                  onLoad={() => handleImageLoad(index)}
                  onError={onImageError}
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent pt-16 pb-4 px-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block px-3 py-1 mb-2 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white"
                  >
                    {prompt}
                  </motion.div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Carousel navigation controls */}
        <div className="flex justify-center items-center gap-2 mt-2">
          <CarouselPrevious className="relative inset-auto mx-0 static" />
          <div className="flex space-x-1">
            {generatedDesigns.map((_, index) => (
              <button
                key={`indicator-${index}`}
                className={`w-2 h-2 rounded-full ${
                  index === currentDesignIndex ? 'bg-primary' : 'bg-muted'
                }`}
                onClick={() => setCurrentDesignIndex(index)}
              />
            ))}
          </div>
          <CarouselNext className="relative inset-auto mx-0 static" />
        </div>
      </Carousel>
    </div>
  );
};

export default DesignCarousel;

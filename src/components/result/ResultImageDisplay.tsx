
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { AlertCircle } from 'lucide-react';

interface ResultImageDisplayProps {
  imageUrl: string;
  prompt: string;
  onImageLoad: () => void;
  onImageError: () => void;
}

const ResultImageDisplay: React.FC<ResultImageDisplayProps> = ({ 
  imageUrl, 
  prompt, 
  onImageLoad, 
  onImageError 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { isIOS, isSafari } = useIsMobile();
  
  const handleImageLoad = () => {
    console.log("Image loaded successfully:", imageUrl);
    setImageLoaded(true);
    setError(false);
    onImageLoad();
  };
  
  const handleImageError = () => {
    console.error("Image failed to load:", imageUrl);
    setError(true);
    setImageLoaded(false);
    onImageError();
  };

  return (
    <div className="relative flex items-center justify-center">
      {!imageLoaded && (
        <div 
          className="w-full flex flex-col items-center justify-center bg-muted"
          style={{ minHeight: 'calc(100vh - 26rem)' }}
        >
          <div className="w-10 h-10 rounded-full border-4 border-t-transparent border-primary animate-spin mb-4"></div>
          {(isIOS || isSafari) && !error && (
            <p className="text-xs text-amber-600 max-w-[250px] text-center">
              Le chargement peut prendre plus de temps sur Safari
            </p>
          )}
        </div>
      )}
      
      <img 
        ref={imgRef}
        src={imageUrl} 
        alt="Generated nail design" 
        className={`w-full object-contain rounded-t-3xl ${imageLoaded ? 'block' : 'hidden'}`}
        style={{ maxHeight: 'calc(100vh - 26rem)' }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        crossOrigin="anonymous"
      />
      
      {imageLoaded && (
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
      )}
    </div>
  );
};

export default ResultImageDisplay;

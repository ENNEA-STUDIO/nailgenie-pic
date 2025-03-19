
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const imgRef = useRef<HTMLImageElement>(null);
  
  const handleImageLoad = () => {
    console.log("Image loaded successfully:", imageUrl);
    setImageLoaded(true);
    onImageLoad();
  };

  return (
    <div className="relative flex items-center justify-center">
      {!imageLoaded && (
        <div 
          className="w-full flex items-center justify-center bg-muted"
          style={{ minHeight: 'calc(100vh - 26rem)' }}
        >
          <div className="w-10 h-10 rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
        </div>
      )}
      
      <img 
        ref={imgRef}
        src={imageUrl} 
        alt="Generated nail design" 
        className={`w-full object-contain rounded-t-3xl ${imageLoaded ? 'block' : 'hidden'}`}
        style={{ maxHeight: 'calc(100vh - 26rem)' }}
        onLoad={handleImageLoad}
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
  );
};

export default ResultImageDisplay;

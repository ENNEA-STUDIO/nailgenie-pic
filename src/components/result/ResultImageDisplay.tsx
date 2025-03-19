
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { AlertCircle, RefreshCw } from 'lucide-react';

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
  const [localRetries, setLocalRetries] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const { isIOS, isSafari } = useIsMobile();
  
  // Add an effect to handle retries locally as a fallback
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    // If we have an error and URL but less than 3 local retries
    if (error && imageUrl && localRetries < 3) {
      timer = setTimeout(() => {
        console.log(`Local retry attempt ${localRetries + 1}/3 for image:`, imageUrl);
        
        // Force a new image instance by updating the ref src with cache buster
        if (imgRef.current) {
          const cacheBuster = `&localRetry=${localRetries + 1}&t=${Date.now()}`;
          imgRef.current.src = imageUrl.includes('?') 
            ? `${imageUrl}${cacheBuster}` 
            : `${imageUrl}?${cacheBuster.substring(1)}`;
        }
        
        setLocalRetries(prev => prev + 1);
      }, 1500 * (localRetries + 1));
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [error, imageUrl, localRetries]);
  
  const handleImageLoad = () => {
    console.log("Image loaded successfully:", imageUrl);
    setImageLoaded(true);
    setError(false);
    setLocalRetries(0);
    onImageLoad();
  };
  
  const handleImageError = () => {
    console.error("Image failed to load:", imageUrl);
    setError(true);
    setImageLoaded(false);
    
    // Only call the parent's error handler if we've exhausted local retries
    if (localRetries >= 3) {
      onImageError();
    }
  };
  
  const handleManualRetry = () => {
    if (imgRef.current) {
      setError(false);
      const cacheBuster = `&manualRetry=true&t=${Date.now()}`;
      imgRef.current.src = imageUrl.includes('?') 
        ? `${imageUrl}${cacheBuster}` 
        : `${imageUrl}?${cacheBuster.substring(1)}`;
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {!imageLoaded && (
        <div 
          className="w-full flex flex-col items-center justify-center bg-muted"
          style={{ minHeight: 'calc(100vh - 26rem)' }}
        >
          <div className="w-10 h-10 rounded-full border-4 border-t-transparent border-primary animate-spin mb-4"></div>
          
          {error && (
            <div className="flex flex-col items-center mt-4">
              <p className="text-sm text-destructive mb-2 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                Erreur de chargement d'image
              </p>
              {localRetries < 3 && (
                <p className="text-xs text-muted-foreground mb-3">
                  Tentative {localRetries + 1}/3...
                </p>
              )}
              {localRetries >= 3 && (
                <button 
                  onClick={handleManualRetry}
                  className="flex items-center px-3 py-1 bg-primary/10 rounded-full text-xs text-primary hover:bg-primary/20 transition-colors"
                >
                  <RefreshCw size={12} className="mr-1" />
                  Réessayer
                </button>
              )}
            </div>
          )}
          
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


import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useImageLoader } from '@/hooks/useImageLoader';

// Import extracted components
import ResultLoading from './result/ResultLoading';
import ResultError from './result/ResultError';
import ResultImageDisplay from './result/ResultImageDisplay';
import ResultActions from './result/ResultActions';

interface ResultPreviewProps {
  onTryAgain?: () => void;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ onTryAgain }) => {
  const { generatedDesign, isLoading, prompt } = useApp();
  const { isIOS, isSafari } = useIsMobile();
  
  const {
    imageUrl,
    imageLoaded,
    imageError,
    retryCount,
    handleImageLoad,
    handleImageError
  } = useImageLoader({ 
    generatedDesign, 
    maxRetries: 5 
  });

  if (isLoading) {
    return (
      <div className="w-full p-4">
        <ResultLoading prompt={prompt} />
      </div>
    );
  }

  if (imageError && retryCount >= 5) {
    return (
      <div className="w-full p-4">
        <ResultError 
          onTryAgain={onTryAgain || (() => {})} 
          isSafari={isSafari} 
          isIOS={isIOS} 
        />
      </div>
    );
  }

  if (!generatedDesign) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full p-4"
    >
      <div className="glass-card rounded-3xl overflow-hidden">
        <ResultImageDisplay 
          imageUrl={imageUrl} 
          prompt={prompt} 
          onImageLoad={handleImageLoad} 
          onImageError={handleImageError} 
        />
        
        <ResultActions 
          onTryAgain={onTryAgain || (() => {})} 
          generatedDesign={generatedDesign} 
          prompt={prompt} 
        />
      </div>
    </motion.div>
  );
};

export default ResultPreview;

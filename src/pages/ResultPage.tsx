
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResultPreview from '../components/ResultPreview';
import { useApp } from '../context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import BottomNav from '@/components/navigation/BottomNav';
import { useLanguage } from '@/context/LanguageContext';
import { useImageLoader } from '@/hooks/useImageLoader';
import ResultError from '@/components/result/ResultError';

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { generatedDesign, resetState } = useApp();
  const { isIOS, isSafari } = useIsMobile();
  const { t } = useLanguage();
  const [manualErrorOverride, setManualErrorOverride] = useState(false);
  
  const { 
    imageLoaded, 
    imageError, 
    imageUrl, 
    retryCount 
  } = useImageLoader({ 
    generatedDesign, 
    maxRetries: 5 
  });
  
  // Log the generated design URL for debugging
  useEffect(() => {
    if (generatedDesign) {
      console.log("Result Page - Generated design URL:", generatedDesign);
    } else {
      console.log("Result Page - No generated design available");
    }
  }, [generatedDesign]);
  
  // Redirect if no design
  useEffect(() => {
    if (!generatedDesign) {
      navigate('/');
    }
  }, [generatedDesign, navigate]);

  const handleTryAgain = () => {
    resetState();
    navigate('/');
  };
  
  const handleImageError = () => {
    console.log("Image error bubbled up to ResultPage");
    setManualErrorOverride(true);
  };

  if (!generatedDesign) return null;
  
  // Show error state if image failed to load after retries or manual override
  if ((imageError && retryCount >= 5) || manualErrorOverride) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background pb-32">
        <ResultError 
          onTryAgain={handleTryAgain} 
          isSafari={isSafari} 
          isIOS={isIOS} 
        />
        <BottomNav />
      </div>
    );
  }
  
  // Show loading state before rendering the preview
  if (!imageLoaded) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
        <p className="mt-4 text-sm text-muted-foreground">{t.common.loading}...</p>
        
        {retryCount > 0 && (
          <p className="mt-2 text-xs text-primary">
            Tentative {retryCount}/{5}...
          </p>
        )}
        
        {/* Add additional information for users experiencing issues */}
        {(isIOS && isSafari) && (
          <p className="mt-4 text-xs text-center max-w-xs text-amber-600">
            {t.result.safariError}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-background pb-32">
      <ResultPreview 
        onTryAgain={handleTryAgain} 
        onImageError={handleImageError}
      />
      <BottomNav />
    </div>
  );
};

export default ResultPage;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResultPreview from '../components/ResultPreview';
import { useApp } from '../context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import BottomNav from '@/components/navigation/BottomNav';
import { useLanguage } from '@/context/LanguageContext';

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { generatedDesign, resetState } = useApp();
  const [imagePreloaded, setImagePreloaded] = useState(false);
  const { isIOS, isSafari } = useIsMobile();
  const { t } = useLanguage();
  
  // Log the generated design URL for debugging
  useEffect(() => {
    if (generatedDesign) {
      console.log("Result Page - Generated design URL:", generatedDesign);
      
      // Check if the generated design is a valid URL or base64 string
      if (generatedDesign.startsWith('data:') || 
          generatedDesign.startsWith('http')) {
        // Pre-load the image to ensure it's available
        const img = new Image();
        
        img.onload = () => {
          console.log("Image pre-loaded successfully with dimensions:", 
                     img.width, "x", img.height);
          setImagePreloaded(true);
        };
        
        img.onerror = (e) => {
          console.error("Failed to pre-load image:", e);
          // Still proceed even if there's an error
          setImagePreloaded(true);
        };
        
        // Set crossOrigin for CORS images
        if (generatedDesign.startsWith('http')) {
          img.crossOrigin = "anonymous";
        }
        
        // Start loading the image
        img.src = generatedDesign;
      } else {
        console.warn("Generated design is not a valid URL or base64 string");
        setImagePreloaded(true);
      }
    } else {
      console.log("Result Page - No generated design available");
      setImagePreloaded(false);
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

  if (!generatedDesign) return null;
  
  // Show loading state briefly before rendering the preview
  if (!imagePreloaded) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
        <p className="mt-4 text-sm text-muted-foreground">{t.common.loading}...</p>
        
        {/* Add additional information for users experiencing issues */}
        {isIOS && isSafari && (
          <p className="mt-4 text-xs text-center max-w-xs text-amber-600">
            {t.result.safariError}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-background pb-32">
      <ResultPreview onTryAgain={handleTryAgain} />
      <BottomNav />
    </div>
  );
};

export default ResultPage;

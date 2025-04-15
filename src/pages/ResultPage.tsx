
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResultPreview from '../components/ResultPreview';
import ResultLoading from '../components/result/ResultLoading';
import { useApp } from '../context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import BottomNav from '@/components/navigation/BottomNav';
import { useLanguage } from '@/context/LanguageContext';

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { generatedDesigns, resetState, isLoading, prompt, generateDesign, currentDesignIndex } = useApp();
  const [imagePreloaded, setImagePreloaded] = useState(false);
  const { isIOS, isSafari } = useIsMobile();
  const { t } = useLanguage();
  
  // Log the generated designs for debugging
  useEffect(() => {
    if (generatedDesigns && generatedDesigns.length > 0) {
      console.log("Result Page - Generated designs:", generatedDesigns);
      
      // Add a short timeout before showing the images to ensure all components are ready
      const timer = setTimeout(() => {
        setImagePreloaded(true);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      console.log("Result Page - No generated designs available");
      setImagePreloaded(false);
    }
  }, [generatedDesigns]);
  
  // Redirect if no designs and not loading
  useEffect(() => {
    if (!generatedDesigns && !isLoading) {
      navigate('/');
    }
  }, [generatedDesigns, navigate, isLoading]);

  const handleTryAgain = () => {
    // Instead of resetting state and navigating away, we'll regenerate with the same prompt
    setImagePreloaded(false);
    generateDesign();
  };

  // Show loading while API is running
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background">
        <ResultLoading prompt={prompt} />
        <BottomNav />
      </div>
    );
  }

  if (!generatedDesigns || generatedDesigns.length === 0) return null;
  
  // Show loading state briefly before rendering the preview
  if (!imagePreloaded) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background">
        <ResultLoading prompt={prompt} />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background pb-32">
      <ResultPreview onTryAgain={handleTryAgain} />
      <BottomNav />
    </div>
  );
};

export default ResultPage;

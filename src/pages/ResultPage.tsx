
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
  const { generatedDesign, resetState, isLoading, prompt } = useApp();
  const [imagePreloaded, setImagePreloaded] = useState(false);
  const { isIOS, isSafari } = useIsMobile();
  const { t } = useLanguage();
  
  // Log the generated design URL for debugging
  useEffect(() => {
    if (generatedDesign) {
      console.log("Result Page - Generated design URL:", generatedDesign);
      
      // Add a short timeout before showing the image to ensure all components are ready
      const timer = setTimeout(() => {
        setImagePreloaded(true);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      console.log("Result Page - No generated design available");
      setImagePreloaded(false);
    }
  }, [generatedDesign]);
  
  // Redirect if no design and not loading
  useEffect(() => {
    if (!generatedDesign && !isLoading) {
      navigate('/');
    }
  }, [generatedDesign, navigate, isLoading]);

  const handleTryAgain = () => {
    resetState();
    navigate('/');
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

  if (!generatedDesign) return null;
  
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

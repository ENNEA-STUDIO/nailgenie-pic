
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ResultPreview from '../components/ResultPreview';
import { useApp } from '../context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { generatedDesign, resetState } = useApp();
  const [imagePreloaded, setImagePreloaded] = useState(false);
  const { isIOS, isSafari } = useIsMobile();
  
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
      <Layout showBackButton title="Votre design">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
          <p className="ml-4 text-sm text-muted-foreground">Chargement de votre design...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showBackButton title="Votre design">
      <ResultPreview onTryAgain={handleTryAgain} />
    </Layout>
  );
};

export default ResultPage;

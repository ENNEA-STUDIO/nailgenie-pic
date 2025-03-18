
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ResultPreview from '../components/ResultPreview';
import { useApp } from '../context/AppContext';

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { generatedDesign, resetState } = useApp();
  const [imagePreloaded, setImagePreloaded] = useState(false);
  
  // Log the generated design URL for debugging
  useEffect(() => {
    if (generatedDesign) {
      console.log("Result Page - Generated design URL:", generatedDesign);
      
      // Force reload the image on iOS by adding a cache buster and preloading
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
      if (isIOS) {
        const cacheBuster = `?t=${Date.now()}`;
        const preloadUrl = `${generatedDesign}${cacheBuster}`;
        
        console.log("iOS device detected, preloading image with cache buster:", preloadUrl);
        
        const img = new Image();
        img.crossOrigin = "anonymous"; // Try to avoid CORS issues
        img.onload = () => {
          console.log("Image preloaded successfully on iOS");
          setImagePreloaded(true);
        };
        img.onerror = (error) => {
          console.error("Error preloading image on iOS:", error);
          // We'll still show the component and let it handle errors
          setImagePreloaded(true);
        };
        img.src = preloadUrl;
      } else {
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
  
  // Only show the ResultPreview once the image is preloaded (on iOS)
  // or immediately on other platforms
  if (!imagePreloaded && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
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

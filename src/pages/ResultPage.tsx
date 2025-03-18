
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
      
      // Check if the browser is Safari
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
      
      if (isSafari || isIOS) {
        console.log("Safari/iOS browser detected, attempting special image loading strategy");
        
        // For Safari, we'll use a more reliable approach with an actual fetch request first
        fetch(generatedDesign, { 
          mode: 'no-cors',
          cache: 'no-cache'
        })
        .then(() => {
          console.log("Image fetch preflight successful on Safari/iOS");
          // Now preload the image after we've confirmed we can reach it
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            console.log("Image preloaded successfully on Safari/iOS");
            setImagePreloaded(true);
          };
          img.onerror = (error) => {
            console.error("Error preloading image on Safari/iOS after fetch:", error);
            // Still show the component and let it handle errors
            setImagePreloaded(true);
          };
          // Add cache buster for Safari
          const cacheBuster = `?t=${Date.now()}`;
          img.src = `${generatedDesign}${cacheBuster}`;
        })
        .catch(error => {
          console.error("Safari/iOS image fetch failed:", error);
          // Still show the component and let it handle errors
          setImagePreloaded(true);
        });
      } else {
        // For other browsers, just set to preloaded
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
  
  // Only show the ResultPreview once the image is preloaded (on Safari/iOS)
  // or immediately on other platforms
  if (!imagePreloaded && (/^((?!chrome|android).)*safari/i.test(navigator.userAgent) || 
                         /iPhone|iPad|iPod/.test(navigator.userAgent))) {
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

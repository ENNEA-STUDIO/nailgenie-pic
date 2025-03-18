
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
      
      if (isSafari || isIOS) {
        console.log("Safari/iOS browser detected, attempting special image loading strategy");
        
        // Try multiple strategies for Safari
        // Strategy 1: Fetch with no-cors and cache-control headers
        fetch(generatedDesign, { 
          mode: 'no-cors',
          cache: 'reload',
          headers: {
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        })
        .then(() => {
          console.log("Image fetch preflight successful on Safari/iOS (Strategy 1)");
          
          // Strategy 2: After fetch succeeds, try Image object with crossOrigin
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            console.log("Image preloaded successfully on Safari/iOS (Strategy 2)");
            setImagePreloaded(true);
          };
          img.onerror = (error) => {
            console.error("Strategy 2 failed on Safari/iOS:", error);
            
            // Strategy 3: Last resort, try with cache buster
            const imgFallback = new Image();
            imgFallback.onload = () => {
              console.log("Image preloaded with cache buster on Safari/iOS (Strategy 3)");
              setImagePreloaded(true);
            };
            imgFallback.onerror = (finalError) => {
              console.error("All Safari/iOS strategies failed:", finalError);
              // Still show the component and let it handle errors
              setImagePreloaded(true);
            };
            // Add cache buster for Safari
            const cacheBuster = `?fallback=true&t=${Date.now()}&r=${Math.random()}`;
            imgFallback.src = `${generatedDesign}${cacheBuster}`;
          };
          
          // Add cache buster for Safari - Strategy 2
          const cacheBuster = `?strategy=2&t=${Date.now()}`;
          img.src = `${generatedDesign}${cacheBuster}`;
        })
        .catch(error => {
          console.error("Safari/iOS initial image fetch failed:", error);
          
          // If fetch fails, still try Strategy 3
          const imgDirect = new Image();
          imgDirect.onload = () => {
            console.log("Direct image load worked after fetch failed");
            setImagePreloaded(true);
          };
          imgDirect.onerror = () => {
            console.error("Direct image load also failed after fetch failed");
            // Still show the component and let it handle errors
            setImagePreloaded(true);
          };
          
          const cacheBuster = `?direct=true&t=${Date.now()}&r=${Math.random()}`;
          imgDirect.src = `${generatedDesign}${cacheBuster}`;
        });
      } else {
        // For other browsers, just set to preloaded immediately
        setImagePreloaded(true);
      }
    } else {
      console.log("Result Page - No generated design available");
      setImagePreloaded(false);
    }
  }, [generatedDesign, isSafari, isIOS]);
  
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
  if (!imagePreloaded && (isSafari || isIOS)) {
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

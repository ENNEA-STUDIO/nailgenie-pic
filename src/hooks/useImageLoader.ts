
import { useState, useEffect, useCallback } from 'react';

interface UseImageLoaderProps {
  generatedDesign: string | null;
  maxRetries?: number;
}

interface UseImageLoaderReturn {
  imageUrl: string;
  imageLoaded: boolean;
  imageError: boolean;
  retryCount: number;
}

export const useImageLoader = ({ 
  generatedDesign, 
  maxRetries = 5 
}: UseImageLoaderProps): UseImageLoaderReturn => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Fonction pour tenter de précharger l'image
  const preloadImage = useCallback((url: string) => {
    console.log("Preloading image:", url);
    const img = new Image();
    
    img.onload = () => {
      console.log("Image pre-loaded successfully with dimensions:", 
                img.width, "x", img.height);
      setImageLoaded(true);
      setImageError(false);
    };
    
    img.onerror = (e) => {
      console.error("Failed to pre-load image:", e);
      setImageError(true);
      setImageLoaded(false);
    };
    
    // Set crossOrigin for CORS images
    if (url.startsWith('http')) {
      img.crossOrigin = "anonymous";
    }
    
    // Ajout d'un cachebuster pour éviter les problèmes de cache
    const cacheBuster = `${url.includes('?') ? '&' : '?'}t=${Date.now()}&r=${Math.random()}`;
    img.src = url + cacheBuster;
  }, []);

  // When generatedDesign changes, set up image with appropriate cache-busting
  useEffect(() => {
    if (generatedDesign) {
      console.log("Setting up new image with URL:", generatedDesign);
      setImageLoaded(false);
      setImageError(false);
      setRetryCount(0);
      
      // Always add a cache buster to prevent caching issues across all browsers
      const cacheBuster = `?t=${Date.now()}&r=${Math.random()}`;
      const finalUrl = `${generatedDesign}${cacheBuster}`;
      setImageUrl(finalUrl);
      
      preloadImage(generatedDesign);
    }
  }, [generatedDesign, preloadImage]);

  // Auto-retry logic when image fails to load
  useEffect(() => {
    if (imageError && generatedDesign && retryCount < maxRetries) {
      console.log(`Attempting to reload image after error (retry ${retryCount + 1}/${maxRetries})`);
      
      const timer = setTimeout(() => {
        // Create a new cache-busting URL with retry information
        const newUrl = `${generatedDesign}?retry=${retryCount + 1}&t=${Date.now()}&r=${Math.random()}`;
        console.log(`Retry ${retryCount + 1}/${maxRetries} with URL:`, newUrl);
        
        setImageUrl(newUrl);
        setRetryCount(prev => prev + 1);
        preloadImage(generatedDesign);
      }, 1000 * (retryCount + 1)); // Incremental backoff
      
      return () => clearTimeout(timer);
    }
  }, [imageError, generatedDesign, retryCount, maxRetries, preloadImage]);

  return {
    imageUrl,
    imageLoaded,
    imageError,
    retryCount
  };
};

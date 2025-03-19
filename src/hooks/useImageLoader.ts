
import { useState, useEffect } from 'react';

interface UseImageLoaderProps {
  generatedDesign: string | null;
  maxRetries?: number;
}

interface UseImageLoaderReturn {
  imageUrl: string;
  imageLoaded: boolean;
  imageError: boolean;
  retryCount: number;
  handleImageLoad: () => void;
  handleImageError: () => void;
}

export const useImageLoader = ({ 
  generatedDesign, 
  maxRetries = 5 
}: UseImageLoaderProps): UseImageLoaderReturn => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // When generatedDesign changes, set up image with appropriate cache-busting
  useEffect(() => {
    if (generatedDesign) {
      console.log("Setting up new image with URL:", generatedDesign);
      setImageLoaded(false);
      setImageError(false);
      setRetryCount(0);
      
      // Always add a cache buster to prevent caching issues across all browsers
      const cacheBuster = `?t=${Date.now()}&r=${Math.random()}`;
      setImageUrl(`${generatedDesign}${cacheBuster}`);
      
      // Pre-fetch for all browsers to ensure content is loaded
      fetch(generatedDesign, { 
        mode: 'no-cors',
        cache: 'reload',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }).catch(error => {
        console.log("Pre-fetch operation completed or failed:", error);
      });
    }
  }, [generatedDesign]);

  // Auto-retry logic when image fails to load
  useEffect(() => {
    if (imageError && generatedDesign && retryCount < maxRetries) {
      console.log(`Attempting to reload image after error (retry ${retryCount + 1}/${maxRetries})`);
      
      const timer = setTimeout(() => {
        // Create a new cache-busting URL with retry information
        const newUrl = `${generatedDesign}?retry=${retryCount + 1}&t=${Date.now()}&r=${Math.random()}`;
        console.log(`Retry ${retryCount + 1}/${maxRetries} with URL:`, newUrl);
        
        setImageUrl(newUrl);
        setImageError(false);
        setRetryCount(prev => prev + 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [imageError, generatedDesign, retryCount, maxRetries]);

  const handleImageLoad = () => {
    console.log("Image loaded successfully:", imageUrl);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error("Image failed to load:", imageUrl);
    setImageError(true);
    setImageLoaded(false);
  };

  return {
    imageUrl,
    imageLoaded,
    imageError,
    retryCount,
    handleImageLoad,
    handleImageError
  };
};

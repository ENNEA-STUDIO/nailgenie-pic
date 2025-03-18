import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Redo, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResultPreviewProps {
  onTryAgain?: () => void;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ onTryAgain }) => {
  const { generatedDesign, isLoading, prompt } = useApp();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const isMobile = useIsMobile();
  const imgRef = useRef<HTMLImageElement>(null);
  
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  
  useEffect(() => {
    if (generatedDesign) {
      console.log("Setting up new image with URL:", generatedDesign);
      setImageLoaded(false);
      setImageError(false);
      setRetryCount(0);
      
      if (isSafari || isIOS) {
        const cacheBuster = `?t=${Date.now()}`;
        console.log("Safari/iOS detected, using cache-busted URL");
        setImageUrl(`${generatedDesign}${cacheBuster}`);
      } else {
        setImageUrl(generatedDesign);
      }
    }
  }, [generatedDesign, isSafari, isIOS]);

  useEffect(() => {
    if (imageError && imgRef.current && generatedDesign && retryCount < 3) {
      console.log(`Attempting to reload image after error (retry ${retryCount + 1}/3)`);
      
      if ((isSafari || isIOS) && retryCount >= 1) {
        const timer = setTimeout(() => {
          console.log("Safari/iOS special retry with fetch first");
          
          fetch(generatedDesign, { 
            mode: 'no-cors',
            cache: 'no-cache'
          })
          .then(() => {
            const newUrl = `${generatedDesign}?safari-retry=${Date.now()}`;
            console.log("Safari fetch successful, retrying with new URL:", newUrl);
            setImageUrl(newUrl);
            setImageError(false);
            setRetryCount(prev => prev + 1);
          })
          .catch(() => {
            const newUrl = `${generatedDesign}?final-retry=${Date.now()}`;
            console.log("Safari fetch failed, trying final URL:", newUrl);
            setImageUrl(newUrl);
            setImageError(false);
            setRetryCount(prev => prev + 1);
          });
        }, 1500);
        
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          const newUrl = `${generatedDesign}?reload=${Date.now()}`;
          console.log("Reloading with new URL:", newUrl);
          setImageUrl(newUrl);
          setImageError(false);
          setRetryCount(prev => prev + 1);
        }, 1500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [imageError, generatedDesign, retryCount, isSafari, isIOS]);

  const handleDownload = () => {
    if (!generatedDesign) return;
    
    try {
      if (isSafari || isIOS) {
        window.open(generatedDesign, '_blank');
        toast.success("Image ouverte dans un nouvel onglet. Appuyez longuement pour l'enregistrer.");
        return;
      }
      
      const link = document.createElement('a');
      link.href = generatedDesign;
      link.download = `nailgenie-design-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Image sauvegardée");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Impossible de télécharger l'image");
    }
  };
  
  const handleShare = async () => {
    if (!generatedDesign || !navigator.share) return;
    
    try {
      if (isMobile) {
        await navigator.share({
          title: 'Mon design NailGenie',
          text: `Découvrez mon design d'ongles "${prompt}" créé avec NailGenie!`,
          url: generatedDesign
        });
      } else {
        const response = await fetch(generatedDesign);
        const blob = await response.blob();
        const file = new File([blob], 'nailgenie-design.jpg', { type: 'image/jpeg' });
        
        await navigator.share({
          title: 'Mon design NailGenie',
          text: `Découvrez mon design d'ongles "${prompt}" créé avec NailGenie!`,
          files: [file]
        });
      }
      
      toast.success("Design partagé avec succès!");
    } catch (error) {
      console.error("Erreur lors du partage:", error);
      toast.error("Impossible de partager le design");
    }
  };

  const handleImageError = () => {
    console.error("Image failed to load:", imageUrl);
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    console.log("Image loaded successfully:", imageUrl);
    setImageLoaded(true);
    setImageError(false);
  };

  if (isLoading) {
    return (
      <div className="w-full p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-3xl overflow-hidden p-6 flex flex-col items-center justify-center"
          style={{ height: 'calc(100vh - 18rem)' }}
        >
          <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-primary animate-spin mb-6"></div>
          <h3 className="text-lg font-medium mb-2">Création de votre design</h3>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            Nous travaillons sur votre design "{prompt}". Cela peut prendre un moment...
          </p>
        </motion.div>
      </div>
    );
  }

  if (imageError && retryCount >= 3) {
    return (
      <div className="w-full p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-3xl overflow-hidden p-6 flex flex-col items-center justify-center"
          style={{ height: 'calc(100vh - 18rem)' }}
        >
          <h3 className="text-lg font-medium mb-2 text-destructive">Erreur de chargement</h3>
          <p className="text-sm text-muted-foreground text-center max-w-xs mb-4">
            Impossible de charger l'image générée. Veuillez réessayer.
          </p>
          <button 
            onClick={onTryAgain}
            className="px-4 py-2 bg-primary text-white rounded-xl"
          >
            Réessayer
          </button>
        </motion.div>
      </div>
    );
  }

  if (!generatedDesign) return null;

  const canShare = navigator.share && navigator.canShare;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full p-4"
    >
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="relative">
          {!imageLoaded && (
            <div 
              className="w-full flex items-center justify-center bg-muted"
              style={{ minHeight: 'calc(100vh - 22rem)' }}
            >
              <div className="w-10 h-10 rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
            </div>
          )}
          
          <img 
            ref={imgRef}
            src={imageUrl} 
            alt="Generated nail design" 
            className={`w-full object-cover rounded-t-3xl ${imageLoaded ? 'block' : 'hidden'}`}
            style={{ maxHeight: 'calc(100vh - 22rem)' }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent pt-16 pb-4 px-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-3 py-1 mb-2 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white"
            >
              {prompt}
            </motion.div>
          </div>
        </div>
        
        <div className="p-5 flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onTryAgain}
            className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl pressed-effect"
          >
            <Redo size={16} />
            <span className="text-sm font-medium">Réessayer</span>
          </motion.button>
          
          <div className="flex gap-2">
            {canShare && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-xl pressed-effect"
              >
                <Share2 size={16} />
                <span className="text-sm font-medium">Partager</span>
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl pressed-effect"
            >
              <Download size={16} />
              <span className="text-sm font-medium">Enregistrer</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultPreview;

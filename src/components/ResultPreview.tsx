import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Download, Save, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { downloadDesignImage } from '@/hooks/gallery/utils';
import { uploadImageToStorage } from '@/utils/storageUtils';
import { useToast } from '@/hooks/use-toast';

interface ResultPreviewProps {
  onTryAgain: () => void;
}

interface ActionFeedback {
  type: 'success' | 'error';
  message: string;
  visible: boolean;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ onTryAgain }) => {
  const { generatedDesign, prompt, nailShape, nailColor, nailLength } = useApp();
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null);
  const { t } = useLanguage();
  const [imageAsBase64, setImageAsBase64] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Convert the generated design URL to base64 when it changes
    if (generatedDesign) {
      convertImageToBase64(generatedDesign);
    }
  }, [generatedDesign]);
  
  const convertImageToBase64 = async (url: string) => {
    try {
      if (url.startsWith('data:')) {
        // It's already a base64 string
        setImageAsBase64(url);
        return;
      }
      
      console.log("Converting image to base64:", url);
      
      // Create a canvas element to draw the image
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Enable CORS
      
      // Set up a promise that resolves when the image loads
      const imageLoadPromise = new Promise<void>((resolve, reject) => {
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Failed to get canvas context'));
              return;
            }
            
            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0);
            
            // Convert the canvas to a base64 data URL
            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
            setImageAsBase64(dataUrl);
            console.log('Successfully converted image to base64');
            resolve();
          } catch (error) {
            console.error('Error converting image to base64:', error);
            reject(error);
          }
        };
        
        img.onerror = (e) => {
          console.error('Error loading image from URL:', url, e);
          toast({
            title: t.result.savedError || "Error",
            description: "Could not load the image",
            variant: "destructive"
          });
          reject(new Error('Failed to load image'));
        };
      });
      
      // Set the src to start loading the image
      img.src = url;
      
      // Wait for the image to load and convert
      await imageLoadPromise;
    } catch (error) {
      console.error('Error in convertImageToBase64:', error);
      toast({
        title: t.result.savedError || "Error",
        description: "Could not process the image",
        variant: "destructive"
      });
    }
  };
  
  if (!generatedDesign) return null;
  
  // Show feedback and automatically hide it after a delay
  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message, visible: true });
    setTimeout(() => {
      setFeedback(prev => prev ? { ...prev, visible: false } : null);
    }, 2000);
  };
  
  const handleDownload = async () => {
    try {
      setDownloading(true);
      
      // Use the base64 version of the image if available
      const imageToDownload = imageAsBase64 || generatedDesign;
      
      // Use our improved download function
      await downloadDesignImage(imageToDownload, 0);
      
      showFeedback('success', t.result.downloadSuccess);
    } catch (error) {
      console.error("Error during download:", error);
      showFeedback('error', t.result.downloadError || "Erreur lors du téléchargement");
    } finally {
      setDownloading(false);
    }
  };
  
  const handleSaveToGallery = async () => {
    try {
      setSaving(true);
      
      // Get current user
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        showFeedback('error', t.common.connectionRequired);
        setSaving(false);
        return;
      }
      
      const userId = sessionData.session.user.id;
      
      // Use the base64 image data if available, otherwise use the original URL
      const imageToUpload = imageAsBase64 || generatedDesign;
      
      if (!imageToUpload) {
        throw new Error('No image available to save');
      }
      
      console.log("Using image for upload:", imageToUpload.substring(0, 100) + "...");
      console.log("Uploading image to Supabase Storage...");
      const publicUrl = await uploadImageToStorage(imageToUpload, userId);
      console.log("Image uploaded successfully, public URL:", publicUrl);
      
      // Insert into saved_designs table with the Storage URL
      const { data, error } = await supabase
        .from('saved_designs')
        .insert([
          {
            user_id: userId,
            image_url: publicUrl,
            prompt: prompt || 'Design personnalisé',
            nail_shape: nailShape,
            nail_color: nailColor,
            nail_length: nailLength
          }
        ]);
        
      if (error) throw error;
      
      showFeedback('success', t.result.savedSuccess);
      
      // Provide additional feedback with toast
      toast({
        title: t.result.savedSuccess || "Succès",
        description: "Le design a été sauvegardé dans votre galerie",
        variant: "default"
      });
    } catch (error) {
      console.error("Error saving design:", error);
      showFeedback('error', t.result.savedError);
      
      // More detailed error with toast
      toast({
        title: t.result.savedError || "Erreur",
        description: "Impossible d'enregistrer le design",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md flex flex-col items-center p-4 relative"
    >
      <h2 className="text-xl font-medium mb-6 text-center">{t.result.yourDesign}</h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="glass-card rounded-3xl overflow-hidden shadow-lg mb-6 w-full"
        style={{
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
        }}
      >
        <img 
          src={imageAsBase64 || generatedDesign} 
          alt="Generated nail design" 
          className="w-full object-cover"
        />
      </motion.div>
      
      <div className="flex justify-center gap-4 w-full">
        <Button 
          onClick={onTryAgain}
          variant="outline" 
          size="icon"
          className="h-12 w-12 rounded-full shadow-md hover:shadow-lg transition-all duration-300 relative"
          title={t.common.tryAgain}
        >
          <RefreshCw size={20} />
        </Button>
        
        <Button 
          onClick={handleDownload}
          variant="outline" 
          size="icon"
          disabled={downloading}
          className="h-12 w-12 rounded-full shadow-md hover:shadow-lg transition-all duration-300 relative"
          title={t.common.download}
        >
          {downloading ? (
            <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-current animate-spin"></div>
          ) : (
            <Download size={20} />
          )}
          
          {/* Download success indicator */}
          <AnimatePresence>
            {feedback?.visible && feedback.type === 'success' && feedback.message === t.result.downloadSuccess && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1"
              >
                <CheckCircle className="w-3 h-3" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
        
        <Button
          onClick={handleSaveToGallery}
          disabled={saving}
          size="icon"
          className="h-12 w-12 rounded-full shadow-md hover:shadow-lg transition-all duration-300 relative"
          style={{
            background: saving ? undefined : "linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%)",
          }}
          title={t.result.saveToGallery}
        >
          {saving ? (
            <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
          ) : (
            <Save size={20} />
          )}
          
          {/* Save success indicator */}
          <AnimatePresence>
            {feedback?.visible && feedback.type === 'success' && feedback.message === t.result.savedSuccess && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1"
              >
                <CheckCircle className="w-3 h-3" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>
      
      {/* Visual feedback instead of toast */}
      <AnimatePresence>
        {feedback && feedback.visible && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 ${
              feedback.type === 'success' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="text-sm font-medium">{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResultPreview;

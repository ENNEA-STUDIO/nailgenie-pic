
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Download, Save, RefreshCw, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { downloadDesignImage } from '@/hooks/gallery/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ResultPreviewProps {
  onTryAgain: () => void;
}

interface ActionFeedback {
  type: 'success' | 'error';
  message: string;
  visible: boolean;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ onTryAgain }) => {
  const { generatedDesign, prompt, nailShape, nailColor, nailLength, credits } = useApp();
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null);
  const { t } = useLanguage();
  
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
      
      // Use our improved download function
      await downloadDesignImage(generatedDesign, 0);
      
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
      
      // Insert into saved_designs table
      const { data, error } = await supabase
        .from('saved_designs')
        .insert([
          {
            user_id: userId,
            image_url: generatedDesign,
            prompt: prompt || 'Design personnalisé',
            nail_shape: nailShape,
            nail_color: nailColor,
            nail_length: nailLength
          }
        ]);
        
      if (error) throw error;
      
      showFeedback('success', t.result.savedSuccess);
    } catch (error) {
      console.error("Error saving design:", error);
      showFeedback('error', t.result.savedError);
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
          src={generatedDesign} 
          alt="Generated nail design" 
          className="w-full object-cover"
        />
      </motion.div>
      
      <div className="flex justify-center gap-4 w-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center gap-1">
                <Button 
                  onClick={onTryAgain}
                  variant="outline" 
                  size="icon"
                  className="h-12 w-12 rounded-full shadow-md hover:shadow-lg transition-all duration-300 relative"
                >
                  <RefreshCw size={20} />
                  <div className="absolute -top-2 -right-2 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full w-6 h-6 border-2 border-white">
                    1
                  </div>
                </Button>
                <span className="text-xs text-muted-foreground">{t.credits.costOneCredit}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-background border border-muted p-3 shadow-lg">
              <div className="flex flex-col gap-1">
                <p className="font-medium">{t.common.tryAgain}</p>
                <div className="flex items-center gap-1 text-primary">
                  <CreditCard size={14} />
                  <p className="text-sm">{t.credits.costOneCredit}</p>
                </div>
                {credits < 1 && (
                  <p className="text-red-500 text-xs mt-1">{t.credits.notEnoughCredits}</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
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

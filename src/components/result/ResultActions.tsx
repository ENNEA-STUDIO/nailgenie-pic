import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, RefreshCw, Share, CheckCircle, XCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { downloadDesignImage, shareImageExternally } from '@/hooks/gallery/utils';

interface ResultActionsProps {
  onTryAgain: () => void;
  generatedDesign: string;
  prompt: string;
}

interface ActionFeedback {
  type: 'success' | 'error';
  message: string;
  visible: boolean;
}

const ResultActions: React.FC<ResultActionsProps> = ({ 
  onTryAgain, 
  generatedDesign, 
  prompt 
}) => {
  const { isMobile, isIOS, isSafari } = useIsMobile();
  const canShare = !!navigator.share && !!navigator.canShare;
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message, visible: true });
    setTimeout(() => {
      setFeedback(prev => prev ? { ...prev, visible: false } : null);
    }, 2000);
  };

  const handleTryAgain = () => {
    onTryAgain();
    navigate('/prompt');
  };

  const handleDownload = async () => {
    if (!generatedDesign) return;
    
    try {
      setActionInProgress('download');
      
      await downloadDesignImage(generatedDesign, 0);
      
      showFeedback('success', t.result.downloadSuccess);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      showFeedback('error', t.result.downloadError);
    } finally {
      setActionInProgress(null);
    }
  };
  
  const handleShare = async () => {
    if (!generatedDesign || !navigator.share) return;
    
    try {
      setActionInProgress('share');
      
      await shareImageExternally(generatedDesign, prompt);
      
      showFeedback('success', t.result.shareSuccess);
    } catch (error) {
      console.error("Erreur lors du partage:", error);
      showFeedback('error', t.result.shareError);
    } finally {
      setActionInProgress(null);
    }
  };

  const iconButtonClass = "flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 relative";

  return (
    <div className="p-6 flex justify-around items-center relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleTryAgain}
        className={cn(iconButtonClass, "bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] text-white")}
        title={t.common.tryAgain}
      >
        <RefreshCw size={28} />
      </motion.button>
      
      {canShare && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleShare}
          disabled={actionInProgress === 'share'}
          className={cn(iconButtonClass, "bg-gradient-to-br from-[#0EA5E9] to-[#3B82F6] text-white")}
          title={t.common.share}
        >
          {actionInProgress === 'share' ? (
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent border-white animate-spin" />
          ) : (
            <Share size={28} />
          )}
          
          <AnimatePresence>
            {feedback?.visible && feedback.type === 'success' && feedback.message === t.result.shareSuccess && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1"
              >
                <CheckCircle className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleDownload}
        disabled={actionInProgress === 'download'}
        className={cn(iconButtonClass, "bg-gradient-to-br from-[#D946EF] to-[#8B5CF6] text-white")}
        title={t.common.download}
      >
        {actionInProgress === 'download' ? (
          <div className="w-6 h-6 rounded-full border-2 border-t-transparent border-white animate-spin" />
        ) : (
          <Download size={28} />
        )}
        
        <AnimatePresence>
          {feedback?.visible && feedback.type === 'success' && 
          (feedback.message === t.result.downloadSuccess || feedback.message === t.result.imageOpened) && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1"
            >
              <CheckCircle className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      
      <AnimatePresence>
        {feedback && feedback.visible && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={cn(
              "absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 z-50",
              feedback.type === 'success' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            )}
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
    </div>
  );
};

export default ResultActions;


import React from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Share } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

interface ResultActionsProps {
  onTryAgain: () => void;
  generatedDesign: string;
  prompt: string;
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

  const handleTryAgain = () => {
    onTryAgain();
    navigate('/prompt');
  };

  const handleDownload = () => {
    if (!generatedDesign) return;
    
    try {
      if (isSafari || isIOS) {
        const win = window.open(generatedDesign, '_blank');
        if (win) {
          win.focus();
          toast.success(t.result.imageOpened);
        } else {
          const link = document.createElement('a');
          link.href = generatedDesign;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success(t.result.imageOpened);
        }
        return;
      }
      
      const link = document.createElement('a');
      link.href = generatedDesign;
      link.download = `nailgenie-design-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(t.result.downloadSuccess);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error(t.result.downloadError);
    }
  };
  
  const handleShare = async () => {
    if (!generatedDesign || !navigator.share) return;
    
    try {
      if (isMobile) {
        const shareText = language === 'fr' 
          ? `Découvrez mon design d'ongles "${prompt}" créé avec NailGenie!`
          : `Check out my nail design "${prompt}" created with NailGenie!`;
          
        await navigator.share({
          title: language === 'fr' ? 'Mon design NailGenie' : 'My NailGenie design',
          text: shareText,
          url: generatedDesign
        });
      } else {
        const response = await fetch(generatedDesign);
        const blob = await response.blob();
        const file = new File([blob], 'nailgenie-design.jpg', { type: 'image/jpeg' });
        
        const shareText = language === 'fr' 
          ? `Découvrez mon design d'ongles "${prompt}" créé avec NailGenie!`
          : `Check out my nail design "${prompt}" created with NailGenie!`;
        
        await navigator.share({
          title: language === 'fr' ? 'Mon design NailGenie' : 'My NailGenie design',
          text: shareText,
          files: [file]
        });
      }
      
      toast.success(t.result.shareSuccess);
    } catch (error) {
      console.error("Erreur lors du partage:", error);
      toast.error(t.result.shareError);
    }
  };

  const iconButtonClass = "flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95";

  return (
    <div className="p-6 flex justify-around items-center">
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
          className={cn(iconButtonClass, "bg-gradient-to-br from-[#0EA5E9] to-[#3B82F6] text-white")}
          title={t.common.share}
        >
          <Share size={28} />
        </motion.button>
      )}
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleDownload}
        className={cn(iconButtonClass, "bg-gradient-to-br from-[#D946EF] to-[#8B5CF6] text-white")}
        title={t.common.download}
      >
        <Download size={28} />
      </motion.button>
    </div>
  );
};

export default ResultActions;

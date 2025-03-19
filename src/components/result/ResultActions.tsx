
import React from 'react';
import { motion } from 'framer-motion';
import { Download, Redo, Share2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

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

  const handleDownload = () => {
    if (!generatedDesign) return;
    
    try {
      if (isSafari || isIOS) {
        const win = window.open(generatedDesign, '_blank');
        if (win) {
          win.focus();
          toast.success("Image ouverte dans un nouvel onglet. Appuyez longuement pour l'enregistrer.");
        } else {
          const link = document.createElement('a');
          link.href = generatedDesign;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success("Image ouverte dans un nouvel onglet. Appuyez longuement pour l'enregistrer.");
        }
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

  return (
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
  );
};

export default ResultActions;

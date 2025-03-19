
import React from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, Rss } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { SavedDesign } from '@/types/gallery';

interface SelectedDesignDetailProps {
  design: SavedDesign;
  onClose: () => void;
  onDelete: (id: string) => void;
  onDownload: (imageUrl: string, index: number) => void;
  onShare: (design: SavedDesign) => void;
  designIndex: number;
  actionInProgress: string | null;
}

const SelectedDesignDetail: React.FC<SelectedDesignDetailProps> = ({
  design,
  onClose,
  onDelete,
  onDownload,
  onShare,
  designIndex,
  actionInProgress
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="mb-6"
    >
      <div className="relative glass-card rounded-2xl overflow-hidden shadow-lg">
        <img 
          src={design.image_url} 
          alt="Design sélectionné"
          className="w-full aspect-square object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-md flex justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDownload(design.image_url, designIndex)}
                  className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                  disabled={actionInProgress === 'download'}
                >
                  {actionInProgress === 'download' ? (
                    <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
                  ) : (
                    <Download size={20} />
                  )}
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Télécharger</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onShare(design)}
                    className={cn(
                      "p-3 rounded-full transition-colors",
                      design.is_shared 
                        ? "bg-green-500/70 hover:bg-green-500/90 text-white" 
                        : "bg-white/10 hover:bg-white/20 text-white"
                    )}
                    disabled={actionInProgress === `share-${design.id}`}
                  >
                    {actionInProgress === `share-${design.id}` ? (
                      <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
                    ) : (
                      <Rss size={20} />
                    )}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{design.is_shared ? 'Déjà partagé' : 'Partager au feed'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(design.id)}
                    className="p-3 bg-white/10 hover:bg-destructive/80 text-white rounded-full transition-colors"
                    disabled={actionInProgress === `delete-${design.id}`}
                  >
                    {actionInProgress === `delete-${design.id}` ? (
                      <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Supprimer</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full"
        >
          &times;
        </button>
      </div>
      <p className="text-sm text-muted-foreground mt-2 text-center">
        {design.prompt || "Sans description"}
      </p>
    </motion.div>
  );
};

export default SelectedDesignDetail;

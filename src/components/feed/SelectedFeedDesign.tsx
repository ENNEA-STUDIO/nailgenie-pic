
import React from 'react';
import { motion } from 'framer-motion';
import { Download, Share2 } from 'lucide-react';
import { SharedDesign } from '@/types/feed';

interface SelectedFeedDesignProps {
  design: SharedDesign;
  onClose: () => void;
  onDownload: (imageUrl: string, index: number) => void;
  onShareExternally?: (imageUrl: string, prompt?: string) => void;
  designIndex: number;
  actionInProgress: string | null;
}

const SelectedFeedDesign: React.FC<SelectedFeedDesignProps> = ({
  design,
  onClose,
  onDownload,
  onShareExternally,
  designIndex,
  actionInProgress
}) => {
  // Handle download click with better error handling
  const handleDownloadClick = () => {
    if (!design.image_url) {
      console.error("Missing image URL for download");
      return;
    }
    
    // Log the URL being downloaded
    console.log("SelectedFeedDesign - Starting download for:", design.image_url);
    onDownload(design.image_url, designIndex);
  };

  // Handle external share click
  const handleShareClick = () => {
    if (!design.image_url || !onShareExternally) {
      console.error("Missing image URL or share function");
      return;
    }
    
    onShareExternally(design.image_url, design.prompt || undefined);
  };

  // Display nail details as badges
  const renderDetailBadges = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-3">
        {design.nail_shape && (
          <span className="px-2 py-1 text-xs bg-primary/10 rounded-full text-primary">
            {design.nail_shape}
          </span>
        )}
        {design.nail_length && (
          <span className="px-2 py-1 text-xs bg-secondary/20 rounded-full text-secondary-foreground">
            {design.nail_length}
          </span>
        )}
        {design.nail_color && (
          <span className="px-2 py-1 text-xs bg-muted rounded-full text-muted-foreground">
            {design.nail_color}
          </span>
        )}
      </div>
    );
  };

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
          <div className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDownloadClick}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              disabled={actionInProgress === 'download'}
            >
              {actionInProgress === 'download' ? (
                <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
              ) : (
                <Download size={20} />
              )}
            </motion.button>
            
            {onShareExternally && (
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShareClick}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                disabled={actionInProgress === 'share-external'}
              >
                {actionInProgress === 'share-external' ? (
                  <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
                ) : (
                  <Share2 size={20} />
                )}
              </motion.button>
            )}
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
      {renderDetailBadges()}
    </motion.div>
  );
};

export default SelectedFeedDesign;

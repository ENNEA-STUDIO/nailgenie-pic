
import React from 'react';
import { motion } from 'framer-motion';
import { Check, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface PhotoPreviewProps {
  photoSrc: string;
  onAccept: () => void;
  onRetake: () => void;
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  photoSrc,
  onAccept,
  onRetake
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      <div className="flex-1 flex flex-col items-center justify-between py-2">
        {/* Header text */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mb-3"
        >
          <div className="bg-black/60 backdrop-blur-md rounded-full text-white text-sm font-medium px-3.5 py-2">
            Vérifiez votre photo
          </div>
        </motion.div>

        {/* Photo container */}
        <div className="w-full max-w-sm">
          <AspectRatio ratio={1 / 1} className="rounded-2xl overflow-hidden shadow-lg border border-white/20">
            <motion.img
              initial={{ scale: 0.9, filter: "blur(5px)" }}
              animate={{ scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.4 }}
              src={photoSrc}
              alt="Photo preview"
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </div>
        
        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex items-center justify-center gap-8 mt-6 mb-2"
        >
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center"
          >
            <Button 
              onClick={onRetake} 
              variant="outline" 
              size="icon" 
              className="h-14 w-14 rounded-full shadow-md"
            >
              <RefreshCcw className="h-6 w-6" />
            </Button>
            <span className="text-xs text-muted-foreground mt-1.5">Reprendre</span>
          </motion.div>
          
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center"
          >
            <Button 
              onClick={onAccept} 
              variant="default" 
              size="icon" 
              className="h-14 w-14 rounded-full shadow-md bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Check className="h-6 w-6" />
            </Button>
            <span className="text-xs text-muted-foreground mt-1.5">Valider</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PhotoPreview;

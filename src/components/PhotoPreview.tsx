
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

const PhotoPreview: React.FC<PhotoPreviewProps> = ({ photoSrc, onAccept, onRetake }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-full flex flex-col"
    >
      <div className="flex-1 overflow-hidden p-4">
        <AspectRatio ratio={4/5} className="rounded-3xl overflow-hidden shadow-lg border border-white/20">
          <motion.img 
            initial={{ scale: 0.95, filter: "blur(5px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            src={photoSrc} 
            alt="Photo preview" 
            className="w-full h-full object-cover"
          />
        </AspectRatio>
        
        {/* Overlay info */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="absolute top-8 left-0 right-0 text-center"
        >
          <div className="inline-block px-5 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-sm font-medium">
            Vérifiez votre photo
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="px-4 pb-6 pt-2 flex gap-4"
      >
        <Button 
          onClick={onRetake}
          variant="outline"
          size="lg"
          className="flex-1 h-14 rounded-xl"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Reprendre
        </Button>
        
        <Button 
          onClick={onAccept}
          variant="default"
          size="lg"
          className="flex-1 h-14 rounded-xl bg-primary hover:bg-primary/90"
        >
          <Check className="mr-2 h-4 w-4" />
          Valider
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PhotoPreview;

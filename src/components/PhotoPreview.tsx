
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
    <div className="relative h-full flex flex-col">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 relative"
      >
        <AspectRatio ratio={1} className="h-full">
          <img 
            src={photoSrc} 
            alt="Photo preview" 
            className="w-full h-full object-cover rounded-3xl"
            style={{ backgroundColor: "#111" }}
          />
        </AspectRatio>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 flex justify-center gap-4"
      >
        <Button 
          onClick={onRetake}
          variant="outline"
          size="lg"
          className="flex-1"
        >
          <RefreshCcw className="mr-2" />
          Reprendre
        </Button>
        
        <Button 
          onClick={onAccept}
          variant="default"
          size="lg"
          className="flex-1"
        >
          <Check className="mr-2" />
          Valider
        </Button>
      </motion.div>
    </div>
  );
};

export default PhotoPreview;

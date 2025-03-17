
import React from 'react';
import { motion } from 'framer-motion';
import { Download, Redo } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ResultPreviewProps {
  onTryAgain?: () => void;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ onTryAgain }) => {
  const { generatedDesign, isLoading, prompt } = useApp();

  const handleDownload = () => {
    if (!generatedDesign) return;
    
    const link = document.createElement('a');
    link.href = generatedDesign;
    link.download = `nailgenie-design-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="w-full p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-3xl overflow-hidden p-6 flex flex-col items-center justify-center"
          style={{ height: 'calc(100vh - 18rem)' }}
        >
          <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-primary animate-spin mb-6"></div>
          <h3 className="text-lg font-medium mb-2">Creating your design</h3>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            We're working on your "{prompt}" design. This may take a moment...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!generatedDesign) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full p-4"
    >
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="relative">
          <img 
            src={generatedDesign} 
            alt="Generated nail design" 
            className="w-full object-cover rounded-t-3xl"
            style={{ maxHeight: 'calc(100vh - 22rem)' }}
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent pt-16 pb-4 px-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-3 py-1 mb-2 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white"
            >
              {prompt}
            </motion.div>
          </div>
        </div>
        
        <div className="p-5 flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onTryAgain}
            className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl pressed-effect"
          >
            <Redo size={16} />
            <span className="text-sm font-medium">Try Again</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl pressed-effect"
          >
            <Download size={16} />
            <span className="text-sm font-medium">Save</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultPreview;

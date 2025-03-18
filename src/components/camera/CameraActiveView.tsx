
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CameraActiveViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoError: string | null;
  capturePhoto: () => void;
  stopCamera: () => void;
}

const CameraActiveView: React.FC<CameraActiveViewProps> = ({
  videoRef,
  videoError,
  capturePhoto,
  stopCamera
}) => {
  return (
    <motion.div 
      key="camera-active"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative h-full flex items-center justify-center"
    >
      {/* Overlay flash effect for photo capture */}
      <div className="capture-flash absolute inset-0 bg-white opacity-0 z-10 pointer-events-none"></div>
      
      {/* Camera frame guidelines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-[85%] h-[85%] border-2 border-white/30 rounded-3xl"></div>
      </div>
      
      {/* Apply object-fit:contain to preserve aspect ratio but add black letterboxing */}
      <video 
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover bg-black rounded-3xl"
      />
      
      {videoError && (
        <Alert variant="destructive" className="absolute top-20 left-4 right-4 z-10">
          <AlertDescription>
            {videoError}
          </AlertDescription>
        </Alert>
      )}
      
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={capturePhoto}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 p-4 bg-white/90 shadow-lg rounded-full z-20"
        aria-label="Prendre une photo"
      >
        <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 transition-colors"></div>
        </div>
      </motion.button>
      
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={stopCamera}
        className="absolute top-8 right-8 p-3 bg-black/50 backdrop-blur-md rounded-full text-white z-20"
        aria-label="Fermer la caméra"
      >
        <X size={22} />
      </motion.button>
    </motion.div>
  );
};

export default CameraActiveView;

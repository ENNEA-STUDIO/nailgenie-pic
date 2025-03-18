
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
      
      {/* Hand positioning guide overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-[85%] h-[85%] border-2 border-white/30 rounded-3xl flex items-center justify-center">
          {/* Improved hand outline SVG */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.5 }}
            className="w-[70%] h-[70%] flex items-center justify-center"
          >
            <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Palm base */}
              <path 
                d="M60,120 Q60,170 120,170 Q180,170 180,120 L180,140 C180,170 150,185 120,185 Q90,185 75,170 L50,145 Q35,130 40,115 L60,120"
                stroke="white" 
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="rgba(255,255,255,0.05)"
              />
              
              {/* Thumb */}
              <path 
                d="M60,120 L60,80 Q60,65 75,65 Q90,65 90,80 L90,110"
                stroke="white" 
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              
              {/* Index finger */}
              <path 
                d="M90,110 L90,60 Q90,45 105,45 Q120,45 120,60 L120,110"
                stroke="white" 
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              
              {/* Middle finger */}
              <path 
                d="M120,110 L120,50 Q120,35 135,35 Q150,35 150,50 L150,110"
                stroke="white" 
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              
              {/* Ring finger */}
              <path 
                d="M150,110 L150,60 Q150,45 165,45 Q180,45 180,60 L180,110"
                stroke="white" 
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              
              {/* Highlight lines */}
              <path 
                d="M80,85 Q90,80 100,85 M110,75 Q120,70 130,75 M140,65 Q150,60 160,65"
                stroke="white" 
                strokeWidth="0.7" 
                strokeOpacity="0.6"
                fill="none"
              />
              
              {/* Fingernails subtle hints */}
              <path
                d="M90,60 L120,60 M120,50 L150,50 M150,60 L180,60"
                stroke="white"
                strokeWidth="0.5"
                strokeOpacity="0.5"
                strokeDasharray="1 2"
              />
            </svg>
          </motion.div>
        </div>
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
      
      {/* Fixed positioning of the capture button to ensure it's centered */}
      <div className="absolute bottom-8 w-full flex justify-center items-center z-20">
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={capturePhoto}
          className="p-4 bg-white/90 shadow-lg rounded-full"
          aria-label="Prendre une photo"
        >
          <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 transition-colors"></div>
          </div>
        </motion.button>
      </div>
      
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

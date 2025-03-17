import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CameraComponent: React.FC = () => {
  const { setHandImage } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraAvailable, setIsCameraAvailable] = useState(true);

  // Initialize camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.muted = true;
        
        // Add event listeners for video loading
        const playVideo = async () => {
          console.log('Video metadata loaded, attempting to play');
          if (videoRef.current) {
            try {
              await videoRef.current.play();
              console.log('Camera started successfully');
              setIsCameraActive(true);
            } catch (err) {
              console.error('Error playing video:', err);
              setIsCameraAvailable(false);
            }
          }
        };
        
        // Try both events to ensure video plays
        videoRef.current.onloadedmetadata = playVideo;
        videoRef.current.oncanplay = playVideo;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCameraAvailable(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  // Take photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setHandImage(imageDataUrl);
        stopCamera();
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="camera-container glass-card">
      {!isCameraActive ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-full flex flex-col items-center justify-center p-6 text-center"
        >
          {isCameraAvailable ? (
            <>
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="p-6 mb-6 rounded-full bg-primary/10"
              >
                <Camera size={48} className="text-primary" />
              </motion.div>
              <h2 className="text-xl font-medium mb-2">Prenez une photo de votre main</h2>
              <p className="text-sm text-muted-foreground mb-8 max-w-xs">
                Positionnez clairement votre main dans le cadre pour obtenir les meilleurs résultats
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startCamera}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-sm"
              >
                Ouvrir la caméra
              </motion.button>
            </>
          ) : (
            <>
              <div className="p-6 mb-6 rounded-full bg-destructive/10">
                <X size={48} className="text-destructive" />
              </div>
              <h2 className="text-xl font-medium mb-2">Caméra non disponible</h2>
              <p className="text-sm text-muted-foreground mb-8 max-w-xs">
                Veuillez vous assurer que votre appareil dispose d'une caméra et que vous avez autorisé son utilisation.
              </p>
            </>
          )}
        </motion.div>
      ) : (
        <div className="relative h-full flex items-center justify-center">
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-3xl"
            style={{ display: 'block' }}
          />
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={capturePhoto}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 p-4 bg-white shadow-lg rounded-full"
          >
            <div className="w-14 h-14 rounded-full border-4 border-primary flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary pressed-effect"></div>
            </div>
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={stopCamera}
            className="absolute top-6 right-6 p-3 bg-black/30 backdrop-blur-sm rounded-full text-white"
          >
            <X size={20} />
          </motion.button>
        </div>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraComponent;

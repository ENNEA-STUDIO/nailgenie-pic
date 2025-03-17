
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
  const [videoError, setVideoError] = useState<string | null>(null);

  // Initialize camera with more robust error handling and debugging
  const startCamera = async () => {
    try {
      console.log('Starting camera acquisition...');
      
      // Clear any previous errors
      setVideoError(null);
      
      const constraints = { 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      };
      
      console.log('Requesting media with constraints:', constraints);
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('Media stream tracks:', mediaStream.getTracks().map(t => t.kind + ':' + t.label));
      setStream(mediaStream);
      
      if (videoRef.current) {
        console.log('Setting video source and preparing to play...');
        const video = videoRef.current;
        
        // Remove any existing event listeners to prevent duplicates
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleVideoError);
        
        // Add our event listeners
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('error', handleVideoError);
        
        // Set source and properties
        video.srcObject = mediaStream;
        video.muted = true;
        video.autoplay = true;
        video.playsInline = true;
        
        // Force play attempt here
        try {
          console.log('Attempting initial play...');
          await video.play();
          console.log('Initial play successful');
          setIsCameraActive(true);
        } catch (err) {
          console.error('Initial play failed:', err);
          // Don't set camera as unavailable yet, let the event handlers try
        }
      } else {
        console.error('Video ref is null, cannot attach stream');
        setVideoError('Video element not found');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCameraAvailable(false);
      setVideoError(error instanceof Error ? error.message : 'Failed to access camera');
    }
  };

  // Event handlers for video element
  const handleLoadedMetadata = async () => {
    console.log('Video metadata loaded');
    await tryPlayVideo();
  };

  const handleCanPlay = async () => {
    console.log('Video can play now');
    await tryPlayVideo();
  };

  const handleVideoError = (e: Event) => {
    console.error('Video error event:', e);
    const videoEl = e.target as HTMLVideoElement;
    setVideoError(videoEl.error ? videoEl.error.message : 'Unknown video error');
  };

  const tryPlayVideo = async () => {
    if (!videoRef.current) return;
    
    try {
      console.log('Attempting to play video from event handler...');
      await videoRef.current.play();
      console.log('Play successful from event handler');
      setIsCameraActive(true);
    } catch (err) {
      console.error('Error playing video from event handler:', err);
      setVideoError('Could not play video stream');
    }
  };

  // Stop camera with improved cleanup
  const stopCamera = () => {
    if (stream) {
      console.log('Stopping camera...');
      
      // Clean up event listeners
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoRef.current.removeEventListener('canplay', handleCanPlay);
        videoRef.current.removeEventListener('error', handleVideoError);
        videoRef.current.srcObject = null;
      }
      
      // Stop all tracks
      stream.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind, track.label);
        track.stop();
      });
      
      setStream(null);
      setIsCameraActive(false);
    }
  };

  // Take photo with improved error handling
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas ref is null during capture');
      return;
    }
    
    try {
      console.log('Capturing photo...');
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Check if video has valid dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.error('Video dimensions are zero, cannot capture');
        setVideoError('Cannot capture photo - no video dimensions');
        return;
      }
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      console.log('Canvas dimensions set to:', canvas.width, canvas.height);
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        console.log('Photo captured, data URL length:', imageDataUrl.length);
        
        if (imageDataUrl.length < 100) {
          console.error('Image data URL too short, likely empty canvas');
          setVideoError('Failed to capture image');
          return;
        }
        
        setHandImage(imageDataUrl);
        stopCamera();
      } else {
        console.error('Could not get canvas context');
        setVideoError('Could not create image');
      }
    } catch (error) {
      console.error('Error during photo capture:', error);
      setVideoError('Failed to capture photo');
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
              {videoError && (
                <p className="text-destructive mb-4 text-sm">
                  Erreur: {videoError}
                </p>
              )}
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
              {videoError && (
                <p className="text-destructive mb-4 text-sm">
                  Détails: {videoError}
                </p>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsCameraAvailable(true);
                  setVideoError(null);
                  startCamera();
                }}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-sm"
              >
                Réessayer
              </motion.button>
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
            style={{ backgroundColor: "#111" }} // Dark background while loading
          />
          {videoError && (
            <div className="absolute top-20 left-0 right-0 bg-destructive text-destructive-foreground p-2 text-center text-sm">
              {videoError}
            </div>
          )}
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

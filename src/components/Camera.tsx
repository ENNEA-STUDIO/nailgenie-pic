
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Alert, AlertDescription } from "@/components/ui/alert";
import PhotoPreview from './PhotoPreview';

const CameraComponent: React.FC = () => {
  const { setHandImage } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraAvailable, setIsCameraAvailable] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Start camera function
  const startCamera = async () => {
    try {
      console.log('Starting camera acquisition...');
      setVideoError(null);
      setCapturedImage(null);
      
      const constraints = { 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      };
      
      console.log('Requesting media with constraints:', constraints);
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Media stream acquired successfully');
      
      // Log tracks for debugging
      console.log('Media stream tracks:', mediaStream.getVideoTracks().map(track => track.label));
      
      // First set state that camera is active, then handle stream in useEffect
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCameraAvailable(false);
      setVideoError(error instanceof Error ? error.message : 'Failed to access camera');
    }
  };

  // Handle stream changes - attach to video element
  useEffect(() => {
    if (!stream || !isCameraActive) return;
    
    console.log('Stream changed, attaching to video element');
    
    // Use timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      // We need to make sure videoRef is available
      if (videoRef.current) {
        console.log('Video ref available, attaching stream');
        videoRef.current.srcObject = stream;
        
        // Try to play the video
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
          setVideoError('Could not play video: ' + err.message);
        });
      } else {
        console.error('Video ref is null, cannot attach stream');
        setVideoError('Video element not available');
      }
    }, 100);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
    };
  }, [stream, isCameraActive]);

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      console.log('Stopping camera...');
      stream.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind, track.label);
        track.stop();
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setStream(null);
      setIsCameraActive(false);
    }
  };

  // Capture photo - Modified to create a square image
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
      
      // Get the smallest dimension to create a square
      const size = Math.min(video.videoWidth, video.videoHeight);
      
      // Calculate offsets to center the crop
      const xOffset = (video.videoWidth - size) / 2;
      const yOffset = (video.videoHeight - size) / 2;
      
      // Set canvas to be square with the determined size
      canvas.width = size;
      canvas.height = size;
      
      console.log('Canvas dimensions set to square:', size, 'x', size);
      
      // Draw video frame to canvas, cropping to a square
      const context = canvas.getContext('2d');
      if (context) {
        // Draw only the square portion of the video frame
        context.drawImage(
          video,
          xOffset, yOffset, size, size,  // Source rectangle (crop)
          0, 0, size, size               // Destination rectangle (canvas)
        );
        
        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        console.log('Square photo captured, data URL length:', imageDataUrl.length);
        
        if (imageDataUrl.length < 100) {
          console.error('Image data URL too short, likely empty canvas');
          setVideoError('Failed to capture image');
          return;
        }
        
        // Instead of immediately saving to context, show preview for validation
        setCapturedImage(imageDataUrl);
        stopCamera(); // Stop camera after capture
      } else {
        console.error('Could not get canvas context');
        setVideoError('Could not create image');
      }
    } catch (error) {
      console.error('Error during photo capture:', error);
      setVideoError('Failed to capture photo');
    }
  };

  // Accept the captured photo
  const acceptPhoto = () => {
    if (capturedImage) {
      setHandImage(capturedImage);
    }
  };
  
  // Retake the photo
  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // If we have a captured image, show the preview with accept/retake buttons
  if (capturedImage) {
    return (
      <div className="camera-container glass-card">
        <PhotoPreview 
          photoSrc={capturedImage}
          onAccept={acceptPhoto}
          onRetake={retakePhoto}
        />
      </div>
    );
  }

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
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>
                    Erreur: {videoError}
                  </AlertDescription>
                </Alert>
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
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>
                    Détails: {videoError}
                  </AlertDescription>
                </Alert>
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
          {/* Apply object-fit:contain to preserve aspect ratio but add black letterboxing */}
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-contain bg-black rounded-3xl"
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

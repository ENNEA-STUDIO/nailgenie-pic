
import { useState, useRef, useEffect, useCallback } from 'react';

interface UseCameraCaptureReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isCameraActive: boolean;
  isCameraAvailable: boolean;
  isLoading: boolean;
  videoError: string | null;
  stream: MediaStream | null;
  capturedImage: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  capturePhoto: () => void;
  setCapturedImage: (image: string | null) => void;
  setIsCameraAvailable: (available: boolean) => void;
  setVideoError: (error: string | null) => void;
}

export const useCameraCapture = (): UseCameraCaptureReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraAvailable, setIsCameraAvailable] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Start camera function
  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Starting camera acquisition...');
      setVideoError(null);
      setCapturedImage(null);
      
      const constraints = { 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
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
    } finally {
      setIsLoading(false);
    }
  }, []);

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
  const stopCamera = useCallback(() => {
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
  }, [stream]);

  // Capture photo - Modified to create a square image
  const capturePhoto = useCallback(() => {
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
        // Add a slight flash effect on the UI
        document.querySelector('.capture-flash')?.classList.add('flashing');
        setTimeout(() => {
          document.querySelector('.capture-flash')?.classList.remove('flashing');
        }, 300);
        
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
  }, [stopCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return {
    videoRef,
    canvasRef,
    isCameraActive,
    isCameraAvailable,
    isLoading,
    videoError,
    stream,
    capturedImage,
    startCamera,
    stopCamera,
    capturePhoto,
    setCapturedImage,
    setIsCameraAvailable,
    setVideoError
  };
};

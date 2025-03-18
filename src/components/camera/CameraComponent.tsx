
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PhotoPreview from '../PhotoPreview';
import CameraActivationView from './CameraActivationView';
import CameraActiveView from './CameraActiveView';
import { useCameraCapture } from './useCameraCapture';

const CameraComponent: React.FC = () => {
  const { setHandImage } = useApp();
  const {
    videoRef,
    canvasRef,
    isCameraActive,
    isCameraAvailable,
    isLoading,
    videoError,
    capturedImage,
    startCamera,
    stopCamera,
    capturePhoto,
    setCapturedImage,
    setIsCameraAvailable,
    setVideoError
  } = useCameraCapture();

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
    <div className="camera-container glass-card overflow-hidden">
      <AnimatePresence mode="wait">
        {!isCameraActive ? (
          <CameraActivationView
            isCameraAvailable={isCameraAvailable}
            isLoading={isLoading}
            videoError={videoError}
            startCamera={startCamera}
          />
        ) : (
          <CameraActiveView
            videoRef={videoRef}
            videoError={videoError}
            capturePhoto={capturePhoto}
            stopCamera={stopCamera}
          />
        )}
      </AnimatePresence>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraComponent;

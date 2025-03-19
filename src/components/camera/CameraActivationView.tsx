
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Loader2, CameraOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CameraActivationViewProps {
  isCameraAvailable: boolean;
  isLoading: boolean;
  videoError: string | null;
  startCamera: () => void;
}

const CameraActivationView: React.FC<CameraActivationViewProps> = ({
  isCameraAvailable,
  isLoading,
  videoError,
  startCamera
}) => {
  return (
    <motion.div 
      key="camera-prompt"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col items-center justify-center p-6 text-center"
    >
      {isCameraAvailable ? (
        <>
          <h2 className="text-xl font-medium mb-2 text-foreground">Prenez une photo de votre main</h2>
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
            disabled={isLoading}
            className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%)",
              boxShadow: "0 10px 25px -5px rgba(155, 135, 245, 0.5)"
            }}
          >
            {isLoading ? (
              <Loader2 className="h-12 w-12 text-white animate-spin" />
            ) : (
              <Camera className="h-12 w-12 text-white" />
            )}
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md"
              style={{
                boxShadow: "0 5px 15px -3px rgba(0, 0, 0, 0.2)"
              }}
            >
              <span className="text-xl font-bold text-primary">+</span>
            </motion.div>
          </motion.button>
        </>
      ) : (
        <>
          <div className="p-6 mb-6 rounded-full bg-destructive/10">
            <CameraOff size={48} className="text-destructive" />
          </div>
          <h2 className="text-xl font-medium mb-2 text-foreground">Caméra non disponible</h2>
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
            onClick={startCamera}
            disabled={isLoading}
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%)",
              boxShadow: "0 10px 25px -5px rgba(155, 135, 245, 0.5)"
            }}
          >
            {isLoading ? (
              <Loader2 className="h-10 w-10 text-white animate-spin" />
            ) : (
              <Camera className="h-10 w-10 text-white" />
            )}
          </motion.button>
        </>
      )}
    </motion.div>
  );
};

export default CameraActivationView;

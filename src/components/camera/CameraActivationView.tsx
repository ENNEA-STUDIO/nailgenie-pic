
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
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Button
              size="icon"
              onClick={startCamera}
              className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-10 w-10 animate-spin" />
              ) : (
                <Camera className="h-10 w-10" />
              )}
            </Button>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground shadow-md"
            >
              <span className="text-xl font-bold">+</span>
            </motion.div>
          </motion.div>
        </>
      ) : (
        <>
          <div className="p-6 mb-6 rounded-full bg-destructive/10">
            <CameraOff size={48} className="text-destructive" />
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
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => {
                startCamera();
              }}
              size="icon"
              className="h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <Camera className="h-8 w-8" />
              )}
            </Button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default CameraActivationView;

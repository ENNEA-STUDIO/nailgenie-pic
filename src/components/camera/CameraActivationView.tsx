
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
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="p-6 mb-6 rounded-full bg-primary/10 shadow-inner"
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
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              size="lg"
              onClick={startCamera}
              className="px-6 py-6 rounded-xl bg-primary text-white font-medium shadow-lg flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Activation...</span>
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5" />
                  <span>Ouvrir la caméra</span>
                </>
              )}
            </Button>
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
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={() => {
                startCamera();
              }}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Réessayer...</span>
                </>
              ) : (
                <span>Réessayer</span>
              )}
            </Button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default CameraActivationView;

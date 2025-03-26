import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CameraComponent from "../components/camera/CameraComponent";
import { useApp } from "../context/AppContext";
import { Camera, AlertCircle } from "lucide-react";
import BottomNav from "@/components/navigation/BottomNav";
import { useLanguage } from "@/context/LanguageContext";
import CreditsDisplay from "@/components/credits/CreditsDisplay";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const CameraPage: React.FC = () => {
  const navigate = useNavigate();
  const { handImage, credits } = useApp();
  const { t } = useLanguage();
  const [showTip, setShowTip] = useState(false);
  const hasNoCredits = credits <= 0;

  // Show camera tip when page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTip(true);

      // Hide tip after a few seconds
      const hideTimer = setTimeout(() => {
        setShowTip(false);
      }, 4000);

      return () => clearTimeout(hideTimer);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleBuyCredits = () => {
    navigate("/buy-credits");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4 pb-32 relative"
    >
      {/* Credits Display amélioré avec animation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute top-4 right-4 z-10"
      >
        <Card className="bg-background/60 backdrop-blur-md border border-primary/20 shadow-md px-3 py-1.5 rounded-full">
          <CreditsDisplay variant="large" />
        </Card>
      </motion.div>

      {/* No Credits Alert */}
      {hasNoCredits && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute top-20 left-4 right-4 z-20"
        >
          <Alert
            variant="destructive"
            className="border-red-300 bg-red-50 shadow-md"
          >
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-red-800">
              {t.credits.notEnoughCredits}
            </AlertTitle>
            <AlertDescription className="text-red-700 mt-2">
              {t.credits.fewMoreDrops}
              <Button
                onClick={handleBuyCredits}
                className="mt-3 bg-primary hover:bg-primary/90 text-white"
                size="sm"
              >
                {t.credits.buyCredits}
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="w-full max-w-md"
      >
        <CameraComponent />
      </motion.div>

      {/* Visual tip instead of toast */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full shadow-lg flex items-center space-x-2"
          >
            <Camera className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">
              {t.camera.permissionPrompt}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </motion.div>
  );
};

export default CameraPage;

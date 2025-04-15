
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CameraComponent from "../components/camera/CameraComponent";
import { useApp } from "../context/AppContext";
import { Camera, AlertCircle, CreditCard, Sparkles } from "lucide-react";
import BottomNav from "@/components/navigation/BottomNav";
import { useLanguage } from "@/context/LanguageContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const CameraPage: React.FC = () => {
  const navigate = useNavigate();
  const { handImage, credits, hasUnlimitedCredits, checkSubscription } = useApp();
  const { t } = useLanguage();
  const [showTip, setShowTip] = useState(false);
  const hasNoCredits = credits <= 0 && !hasUnlimitedCredits;

  // Update subscription status when the page loads
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

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

  // If user has no credits and no unlimited subscription, show the credits purchase page
  if (hasNoCredits) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4 pb-32 relative"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="w-full max-w-md text-center px-4 py-8"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-6 flex flex-col items-center"
          >
            <div className="p-6 mb-4 rounded-full bg-primary/10">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t.credits.notEnoughCredits}</h2>
            <p className="text-muted-foreground max-w-sm mb-4">
              {t.credits.fewMoreDrops}
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full max-w-md mx-auto mb-8 bg-background/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-primary/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">{t.credits.creditPack}</h3>
                <p className="text-sm text-muted-foreground">{t.credits.tenCreditsForDesigns}</p>
              </div>
              <span className="text-xl font-bold">{t.credits.creditPackPrice}</span>
            </div>
            <Button 
              onClick={handleBuyCredits} 
              className="w-full py-6 text-base" 
              size="lg"
              style={{
                background: "linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%)",
                boxShadow: "0 10px 25px -5px rgba(155, 135, 245, 0.3)"
              }}
            >
              <CreditCard className="mr-2 h-5 w-5" /> {t.credits.buyCredits}
            </Button>
          </motion.div>
        </motion.div>

        <BottomNav />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4 pb-32 relative"
    >
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

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="w-full max-w-md"
      >
        <CameraComponent />
      </motion.div>

      <BottomNav />
    </motion.div>
  );
};

export default CameraPage;

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import NailShapeSelector from "../components/NailShapeSelector";
import NailLengthSelector from "../components/NailLengthSelector";
import NailColorSelector from "../components/NailColorSelector";
import { useApp } from "../context/AppContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import BottomNav from "@/components/navigation/BottomNav";
import { useLanguage } from "@/context/LanguageContext";

const PromptPage: React.FC = () => {
  const navigate = useNavigate();
  const { handImage, setGeneratedDesign } = useApp();
  const { t } = useLanguage();

  useEffect(() => {
    if (!handImage) {
      navigate("/camera");
    }
    // Reset only the generated design
    setGeneratedDesign(null);
  }, [handImage, navigate, setGeneratedDesign]);

  const handleContinue = () => {
    navigate("/prompt-input");
  };

  if (!handImage) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20 p-4 pb-24"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pb-4 no-scrollbar">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-3xl overflow-hidden shadow-md mx-auto mb-6 max-w-md"
            style={{
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
            }}
          >
            <img
              src={handImage}
              alt="Your hand"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="space-y-6 max-w-md mx-auto"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-xl font-medium text-center mb-6"
            >
              {t.prompt.customizeNails}
            </motion.h2>

            <div className="p-4 rounded-2xl backdrop-blur-sm bg-white/80">
              <NailShapeSelector />
              <NailLengthSelector />
              <NailColorSelector />
            </div>
          </motion.div>
        </div>

        <div className="px-4 py-4 mt-auto">
          <Button
            onClick={handleContinue}
            className="w-full py-6 rounded-xl"
            size="lg"
            style={{
              background: "linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%)",
              boxShadow: "0 10px 25px -5px rgba(155, 135, 245, 0.3)",
            }}
          >
            {t.prompt.continue} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      <BottomNav />
    </motion.div>
  );
};

export default PromptPage;

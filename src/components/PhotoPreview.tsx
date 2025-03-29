
import React from "react";
import { motion } from "framer-motion";
import { Check, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

interface PhotoPreviewProps {
  photoSrc: string;
  onAccept: () => void;
  onRetake: () => void;
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  photoSrc,
  onAccept,
  onRetake,
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleAccept = () => {
    onAccept();
    navigate("/prompt");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col justify-between"
    >
      {/* Header text */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="absolute top-4 left-0 right-0 z-10 flex justify-center"
      >
        <div className="bg-black/60 backdrop-blur-md rounded-full text-white text-sm font-medium px-4 py-2">
          {t.camera.verifyPhoto}
        </div>
      </motion.div>

      {/* Full-size photo */}
      <div className="h-full w-full">
        <motion.img
          initial={{ scale: 0.95, filter: "blur(5px)" }}
          animate={{ scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.4 }}
          src={photoSrc}
          alt="Photo preview"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-10"
      >
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center"
        >
          <Button
            onClick={onRetake}
            variant="outline"
            size="icon"
            className="h-16 w-16 rounded-full shadow-md bg-white/80 backdrop-blur-sm"
          >
            <RefreshCcw className="h-7 w-7" />
          </Button>
          <span className="text-sm font-medium text-white drop-shadow-md mt-2">
            {t.camera.retake}
          </span>
        </motion.div>

        <motion.div
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center"
        >
          <Button
            onClick={handleAccept}
            variant="default"
            size="icon"
            className="h-16 w-16 rounded-full shadow-md bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Check className="h-7 w-7" />
          </Button>
          <span className="text-sm font-medium text-white drop-shadow-md mt-2">
            {t.camera.accept}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PhotoPreview;

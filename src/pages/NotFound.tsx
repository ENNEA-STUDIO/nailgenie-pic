
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-sm"
      >
        <div className="inline-flex mb-6 p-4 rounded-full bg-muted">
          <span className="text-6xl">🔍</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oops! This page doesn't exist
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-primary text-white rounded-xl font-medium flex items-center gap-2 shadow-md mx-auto"
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;

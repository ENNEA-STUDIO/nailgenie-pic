
import React from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import NailPolishIcon from '@/components/credits/NailPolishIcon';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-purple-50 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-sm"
      >
        <div className="inline-flex mb-6 p-4 rounded-full bg-white/70 backdrop-blur-sm">
          <NailPolishIcon className="h-16 w-16 text-pink-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! Cette page n'existe pas
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-full font-medium flex items-center gap-2 shadow-md mx-auto"
          style={{
            background: "linear-gradient(90deg, #D946EF 0%, #9b87f5 100%)",
            boxShadow: "0 10px 15px -3px rgba(214, 31, 255, 0.2), 0 4px 6px -2px rgba(215, 115, 247, 0.1)"
          }}
        >
          <ArrowLeft size={18} />
          <span>Retour à l'accueil</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;

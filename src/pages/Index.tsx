
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Layout className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-3xl" />
      </div>
    
      <div className="flex flex-col items-center justify-center px-6 py-16 h-full">
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="mb-8"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center">
              <Sparkles size={36} className="text-primary" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="absolute -top-2 -right-2 bg-accent text-white text-xs font-medium px-2 py-1 rounded-full"
            >
              AI
            </motion.div>
          </div>
        </motion.div>
        
        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold mb-3 text-center"
        >
          NailGenie
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg text-muted-foreground text-center mb-10 max-w-xs"
        >
          Transform your nails with AI-generated designs
        </motion.p>
        
        {/* Features */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 gap-4 w-full max-w-xs mb-12"
        >
          {[
            { id: 1, text: "Take a photo of your hand" },
            { id: 2, text: "Describe your dream nail design" },
            { id: 3, text: "Get AI-generated nail art" }
          ].map((feature) => (
            <div 
              key={feature.id}
              className="flex items-center gap-3 p-3 bg-secondary rounded-xl"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                {feature.id}
              </div>
              <p className="text-sm">{feature.text}</p>
            </div>
          ))}
        </motion.div>
        
        {/* Start Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/camera')}
          className="px-8 py-4 bg-primary text-white rounded-xl font-medium flex items-center gap-2 shadow-md"
        >
          <Camera size={20} />
          <span>Start Now</span>
        </motion.button>
      </div>
    </Layout>
  );
};

export default Index;

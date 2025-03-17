
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PromptInput: React.FC = () => {
  const { prompt, setPrompt, generateDesign, isLoading } = useApp();
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateDesign();
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`w-full px-4 mb-6 ${isFocused ? 'scale-[1.02]' : 'scale-100'} transition-transform duration-300`}
    >
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe your dream nails..."
          className="prompt-input pr-16"
          disabled={isLoading}
        />
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg 
            ${prompt.trim() ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
            ${isLoading ? 'opacity-70' : 'opacity-100'} transition-all duration-200`}
          aria-label="Generate design"
        >
          <Wand2 size={20} className={isLoading ? 'animate-pulse-subtle' : ''} />
        </motion.button>
      </form>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs text-muted-foreground mt-3 px-1"
      >
        Try: "French manicure with gold accents" or "Summer gradient with floral designs"
      </motion.p>
    </motion.div>
  );
};

export default PromptInput;

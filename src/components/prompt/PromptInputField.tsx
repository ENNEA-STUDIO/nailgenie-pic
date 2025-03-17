
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Wand2 } from 'lucide-react';

interface PromptInputFieldProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  displayText: string;
  placeholder: string;
  setIsFocused: (isFocused: boolean) => void;
}

const PromptInputField: React.FC<PromptInputFieldProps> = ({
  prompt,
  setPrompt,
  isLoading,
  handleSubmit,
  displayText,
  placeholder,
  setIsFocused
}) => {
  const [localPlaceholder, setLocalPlaceholder] = useState(placeholder);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setIsFocused(true);
    setLocalPlaceholder("Décrivez vos ongles de rêve...");
  };
  
  const handleBlur = () => {
    setIsFocused(false);
  };

  // Animation variants for the button
  const buttonVariants = {
    idle: { scale: 1 },
    active: { 
      scale: [1, 1.05, 1],
      transition: { 
        repeat: Infinity, 
        repeatType: "reverse" as const,
        duration: 1.5
      }
    }
  };

  const isButtonActive = prompt.trim().length > 0 && !isLoading;

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={displayText || localPlaceholder}
        className="prompt-input shadow-md hover:shadow-lg focus:shadow-lg transition-all duration-300 text-base"
        disabled={isLoading}
      />
      
      <motion.button
        variants={buttonVariants}
        animate={isButtonActive ? "active" : "idle"}
        whileHover={isButtonActive ? { scale: 1.1 } : {}}
        whileTap={isButtonActive ? { scale: 0.95 } : {}}
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2.5 rounded-lg transition-all duration-200
          ${prompt.trim() ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground'}
          ${isLoading ? 'opacity-70' : 'opacity-100'}`}
        aria-label="Generate design"
      >
        <Wand2 size={20} className={isLoading ? 'animate-pulse-subtle' : ''} />
      </motion.button>
    </form>
  );
};

export default PromptInputField;

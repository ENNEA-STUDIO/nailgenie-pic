
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        className="prompt-input shadow-md hover:shadow-lg focus:shadow-lg transition-all duration-300 text-base pr-14"
        disabled={isLoading}
      />
      
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center">
        <Button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          size="icon"
          variant={prompt.trim() ? "default" : "ghost"}
          className={`h-10 w-10 rounded-lg ${isLoading ? 'opacity-70' : 'opacity-100'}`}
          aria-label="Generate design"
        >
          <Wand2 size={20} className={isLoading ? 'animate-pulse-subtle' : ''} />
        </Button>
      </div>
    </form>
  );
};

export default PromptInputField;

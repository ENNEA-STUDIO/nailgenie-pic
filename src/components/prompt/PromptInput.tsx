
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { getRandomColor, getRandomSize } from './ExampleTagsContainer';
import ExampleTagsContainer from './ExampleTagsContainer';
import PromptInputField from './PromptInputField';
import { getColorSpecificPrompts, extractMainConcept } from '../../utils/promptUtils';
import useTextAnimation from '../../hooks/useTextAnimation';
import { toast } from 'sonner';
import { getColorNameFromHex } from '../../utils/colorUtils';
import { useLanguage } from '@/context/LanguageContext';

const PromptInput: React.FC = () => {
  const { prompt, setPrompt, generateDesign, isLoading, nailColor } = useApp();
  const { language } = useLanguage();
  const [isFocused, setIsFocused] = useState(false);
  
  // Get color name from hex
  const colorName = getColorNameFromHex(nailColor);
  
  // Get color-specific prompts
  const [exampleTags, setExampleTags] = useState(() => 
    getColorSpecificPrompts(colorName, language)
  );
  
  const [tagStyles, setTagStyles] = useState<Array<{color: string, size: string}>>([]);
  
  // Use the animation hook
  const { displayText } = useTextAnimation(prompt, isFocused);
  
  // Initialize tag styles
  useEffect(() => {
    setTagStyles(exampleTags.map(() => ({
      color: getRandomColor(),
      size: getRandomSize()
    })));
  }, [exampleTags]);

  // Update when color changes
  useEffect(() => {
    const newExamples = getColorSpecificPrompts(colorName, language);
    setExampleTags(newExamples);
  }, [nailColor, colorName, language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await generateDesign();
    } catch (error) {
      console.error("Error during design generation:", error);
      toast.error("Erreur de génération, nous réessayons automatiquement...");
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`w-full px-4 ${isFocused ? 'scale-[1.02]' : 'scale-100'} transition-transform duration-300`}
    >
      <PromptInputField 
        prompt={prompt}
        setPrompt={setPrompt}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        displayText={displayText}
        placeholder={language === 'fr' ? "Décrivez vos ongles de rêve..." : "Describe your dream nails..."}
        setIsFocused={setIsFocused}
      />
      
      <ExampleTagsContainer 
        exampleTags={exampleTags}
        tagStyles={tagStyles}
        handleExampleClick={handleExampleClick}
      />
    </motion.div>
  );
};

export default PromptInput;

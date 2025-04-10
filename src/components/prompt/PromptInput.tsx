
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { getRandomColor, getRandomSize } from './ExampleTagsContainer';
import ExampleTagsContainer from './ExampleTagsContainer';
import PromptInputField from './PromptInputField';
import { getRandomExamples, extractMainConcept } from '../../utils/promptUtils';
import useExamplePrompts from './useExamplePrompts';

const PromptInput: React.FC = () => {
  const { prompt, setPrompt, generateDesign, isLoading } = useApp();
  const [isFocused, setIsFocused] = useState(false);
  
  // Use our custom hook for example management
  const { exampleTags, displayText } = useExamplePrompts(isFocused, prompt);
  
  const [tagStyles, setTagStyles] = useState<Array<{color: string, size: string}>>([]);
  
  // Initialize tag styles with more variety
  useEffect(() => {
    // Ensure each tag gets a unique style combination
    const uniqueStyles = exampleTags.map(() => {
      const randomColor = getRandomColor();
      const randomSize = getRandomSize();
      return { color: randomColor, size: randomSize };
    });
    
    setTagStyles(uniqueStyles);
  }, [exampleTags]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateDesign();
  };

  const handleExampleClick = (example: string) => {
    const mainConcept = extractMainConcept(example);
    setPrompt(mainConcept);
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
        placeholder="Décrivez vos ongles de rêve..."
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

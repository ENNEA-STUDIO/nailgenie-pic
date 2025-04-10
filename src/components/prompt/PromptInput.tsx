import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { getRandomColor, getRandomSize } from './ExampleTagsContainer';
import ExampleTagsContainer from './ExampleTagsContainer';
import PromptInputField from './PromptInputField';
import { getRandomExamples, extractMainConcept } from '../../utils/promptUtils';
import useTextAnimation from '../../hooks/useTextAnimation';
import { toast } from 'sonner';

const PromptInput: React.FC = () => {
  const { prompt, setPrompt, generateDesign, isLoading } = useApp();
  const [isFocused, setIsFocused] = useState(false);
  const [exampleTags, setExampleTags] = useState(getRandomExamples());
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

  // Refresh examples periodically (reduced frequency because we're showing more examples at once)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFocused && !prompt) {
        const newExamples = getRandomExamples(12); // Get more examples for the two rows
        setExampleTags(newExamples);
      }
    }, 30000); // Slightly longer interval since we have more examples

    return () => clearInterval(interval);
  }, [isFocused, prompt]);

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

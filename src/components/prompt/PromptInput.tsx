
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { getRandomColor, getRandomSize } from './ExampleTagsContainer';
import ExampleTagsContainer from './ExampleTagsContainer';
import PromptInputField from './PromptInputField';

// Simplified version of the examplePrompts from the useExamplePrompts hook
const examplePrompts = [
  "Geometric Lines avec un dégradé de bleu",
  "French Manicure avec des accents dorés",
  "Effet Watercolor inspiré par un coucher de soleil",
  "Dégradé pastel avec des motifs fleuris",
  "Marble Effect avec des détails argentés",
  "Negative Space avec des motifs minimalistes",
  "Metallic Drips en rose gold",
  "Jelly Nails avec des paillettes holographiques",
];

const getRandomExamples = (count = 8) => {
  const shuffled = [...examplePrompts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const PromptInput: React.FC = () => {
  const { prompt, setPrompt, generateDesign, isLoading } = useApp();
  const [isFocused, setIsFocused] = useState(false);
  const [placeholder, setPlaceholder] = useState("Décrivez vos ongles de rêve...");
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [exampleTags, setExampleTags] = useState(getRandomExamples());
  const [tagStyles, setTagStyles] = useState<Array<{color: string, size: string}>>([]);
  const typingSpeed = 120;
  const deleteSpeed = 30;
  const pauseDuration = 1000;
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize tag styles
  useEffect(() => {
    setTagStyles(exampleTags.map(() => ({
      color: getRandomColor(),
      size: getRandomSize()
    })));
  }, [exampleTags]);

  // Refresh examples periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFocused && !prompt) {
        const newExamples = getRandomExamples();
        setExampleTags(newExamples);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [isFocused, prompt]);

  // Text animation effect
  useEffect(() => {
    if (!prompt && !isFocused) {
      const currentExample = examplePrompts[currentExampleIndex];
      
      if (isTyping && !isPaused) {
        if (displayText.length < currentExample.length) {
          const timer = setTimeout(() => {
            setDisplayText(currentExample.substring(0, displayText.length + 1));
          }, typingSpeed);
          return () => clearTimeout(timer);
        } else {
          setIsPaused(true);
          const timer = setTimeout(() => {
            setIsPaused(false);
            setIsTyping(false);
            setIsDeleting(true);
          }, pauseDuration);
          return () => clearTimeout(timer);
        }
      } else if (isDeleting && !isPaused) {
        if (displayText.length > 0) {
          const timer = setTimeout(() => {
            setDisplayText(displayText.substring(0, displayText.length - 1));
          }, deleteSpeed);
          return () => clearTimeout(timer);
        } else {
          setIsDeleting(false);
          setIsTyping(true);
          let nextIndex;
          do {
            nextIndex = Math.floor(Math.random() * examplePrompts.length);
          } while (nextIndex === currentExampleIndex);
          setCurrentExampleIndex(nextIndex);
        }
      }
    }
  }, [displayText, isTyping, isDeleting, isPaused, currentExampleIndex, isFocused, prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateDesign();
  };

  const handleExampleClick = (example: string) => {
    const mainConcept = example.split(" avec ")[0].split(" en ")[0].split(" inspiré")[0];
    setPrompt(mainConcept);
    if (inputRef.current) {
      inputRef.current.focus();
    }
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
        placeholder={placeholder}
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

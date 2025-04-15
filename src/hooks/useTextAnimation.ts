
import { useState, useEffect } from 'react';
import { getColorSpecificPrompts } from '../utils/promptUtils';
import { useApp } from '../context/AppContext';
import { getColorNameFromHex } from '../utils/colorUtils';
import { useLanguage } from '@/context/LanguageContext';

interface TextAnimationOptions {
  typingSpeed?: number;
  deleteSpeed?: number;
  maxLength?: number;
}

/**
 * Hook for creating a typewriter text animation effect
 */
const useTextAnimation = (
  prompt: string, 
  isFocused: boolean,
  options: TextAnimationOptions = {}
) => {
  const {
    typingSpeed = 120,
    deleteSpeed = 30,
    maxLength = 28 // Reduced maximum length to ensure it fits better
  } = options;

  const { nailColor } = useApp();
  const { language } = useLanguage();
  const colorName = getColorNameFromHex(nailColor);
  
  // Get color-specific prompts
  const colorPrompts = getColorSpecificPrompts(colorName, language);

  const [displayText, setDisplayText] = useState("");
  const [currentExampleIndex, setCurrentExampleIndex] = useState(
    Math.floor(Math.random() * colorPrompts.length)
  );
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update examples when color changes
  useEffect(() => {
    setCurrentExampleIndex(Math.floor(Math.random() * colorPrompts.length));
    setDisplayText("");
    setIsTyping(true);
    setIsDeleting(false);
  }, [nailColor, colorPrompts.length]);

  // Text animation effect
  useEffect(() => {
    if (!prompt && !isFocused && colorPrompts.length > 0) {
      // Get the current example and trim it if needed
      let currentExample = colorPrompts[currentExampleIndex];
      if (currentExample.length > maxLength) {
        currentExample = currentExample.substring(0, maxLength - 3) + '...';
      }
      
      if (isTyping) {
        if (displayText.length < currentExample.length) {
          const timer = setTimeout(() => {
            setDisplayText(currentExample.substring(0, displayText.length + 1));
          }, typingSpeed);
          return () => clearTimeout(timer);
        } else {
          // Immediately start deleting when typing is complete
          setIsTyping(false);
          setIsDeleting(true);
        }
      } else if (isDeleting) {
        if (displayText.length > 0) {
          const timer = setTimeout(() => {
            setDisplayText(displayText.substring(0, displayText.length - 1));
          }, deleteSpeed);
          return () => clearTimeout(timer);
        } else {
          setIsDeleting(false);
          setIsTyping(true);
          // Select a random example that's different from the current one
          let nextIndex;
          do {
            nextIndex = Math.floor(Math.random() * colorPrompts.length);
          } while (nextIndex === currentExampleIndex && colorPrompts.length > 1);
          
          setCurrentExampleIndex(nextIndex);
        }
      }
    }
  }, [
    displayText, 
    isTyping, 
    isDeleting, 
    currentExampleIndex, 
    isFocused, 
    prompt, 
    typingSpeed, 
    deleteSpeed,
    maxLength,
    colorPrompts,
    nailColor
  ]);

  return { displayText, currentExampleIndex };
};

export default useTextAnimation;

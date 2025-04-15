
import { useState, useEffect } from 'react';
import { getRandomExamples, getColorSpecificPrompts } from '../../utils/promptUtils';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import { getColorNameFromHex } from '@/utils/colorUtils';

interface TextAnimationState {
  displayText: string;
  isTyping: boolean;
  isDeleting: boolean;
  isPaused: boolean;
  currentExampleIndex: number;
}

export const useExamplePrompts = (isFocused: boolean, prompt: string) => {
  const { language } = useLanguage();
  const { nailColor } = useApp();
  
  // Get color name from hex
  const colorName = getColorNameFromHex(nailColor);
  
  // Use color-specific prompts when available
  const [exampleTags, setExampleTags] = useState(() => 
    getColorSpecificPrompts(colorName, language)
  );
  
  const [animationState, setAnimationState] = useState<TextAnimationState>({
    displayText: "",
    isTyping: true,
    isDeleting: false,
    isPaused: false,
    currentExampleIndex: 0
  });

  // Update examples when the selected color changes
  useEffect(() => {
    const newColorName = getColorNameFromHex(nailColor);
    const newExamples = getColorSpecificPrompts(newColorName, language);
    setExampleTags(newExamples);
    
    // Reset animation when color changes
    setAnimationState(prev => ({
      ...prev,
      displayText: "",
      isTyping: true,
      isDeleting: false,
      currentExampleIndex: 0
    }));
  }, [nailColor, language]);

  // Refresh examples periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFocused && !prompt) {
        // Get new examples for the current color
        const newExamples = getColorSpecificPrompts(colorName, language);
        setExampleTags(newExamples);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [isFocused, prompt, language, colorName]);

  // Handle text animation
  useEffect(() => {
    if (!prompt && !isFocused) {
      const { displayText, isTyping, isDeleting, isPaused, currentExampleIndex } = animationState;
      const currentExample = exampleTags[currentExampleIndex] || "";
      const typingSpeed = 120;
      const deleteSpeed = 30;
      const pauseDuration = 1000;
      
      if (isTyping && !isPaused) {
        if (displayText.length < currentExample.length) {
          const timer = setTimeout(() => {
            setAnimationState(prev => ({
              ...prev,
              displayText: currentExample.substring(0, displayText.length + 1)
            }));
          }, typingSpeed);
          return () => clearTimeout(timer);
        } else {
          setAnimationState(prev => ({ ...prev, isPaused: true }));
          const timer = setTimeout(() => {
            setAnimationState(prev => ({ 
              ...prev, 
              isPaused: false, 
              isTyping: false, 
              isDeleting: true 
            }));
          }, pauseDuration);
          return () => clearTimeout(timer);
        }
      } else if (isDeleting && !isPaused) {
        if (displayText.length > 0) {
          const timer = setTimeout(() => {
            setAnimationState(prev => ({
              ...prev,
              displayText: displayText.substring(0, displayText.length - 1)
            }));
          }, deleteSpeed);
          return () => clearTimeout(timer);
        } else {
          let nextIndex;
          do {
            nextIndex = Math.floor(Math.random() * exampleTags.length);
          } while (nextIndex === currentExampleIndex && exampleTags.length > 1);
          
          setAnimationState(prev => ({
            ...prev,
            isDeleting: false,
            isTyping: true,
            currentExampleIndex: nextIndex
          }));
        }
      }
    }
  }, [animationState, isFocused, prompt, exampleTags]);

  return {
    exampleTags,
    displayText: animationState.displayText,
    currentExampleIndex: animationState.currentExampleIndex
  };
};

export default useExamplePrompts;

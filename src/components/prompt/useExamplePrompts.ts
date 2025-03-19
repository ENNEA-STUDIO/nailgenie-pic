
import { useState, useEffect } from 'react';
import { getRandomExamples } from '../../utils/promptUtils';
import { useLanguage } from '@/context/LanguageContext';

interface TextAnimationState {
  displayText: string;
  isTyping: boolean;
  isDeleting: boolean;
  isPaused: boolean;
  currentExampleIndex: number;
}

export const useExamplePrompts = (isFocused: boolean, prompt: string) => {
  const { language } = useLanguage();
  const [exampleTags, setExampleTags] = useState(() => getRandomExamples(8, language));
  const [animationState, setAnimationState] = useState<TextAnimationState>({
    displayText: "",
    isTyping: true,
    isDeleting: false,
    isPaused: false,
    currentExampleIndex: 0
  });

  // Refresh examples periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFocused && !prompt) {
        setExampleTags(getRandomExamples(8, language));
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [isFocused, prompt, language]);

  // Update examples when language changes
  useEffect(() => {
    setExampleTags(getRandomExamples(8, language));
  }, [language]);

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

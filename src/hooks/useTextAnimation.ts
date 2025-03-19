
import { useState, useEffect } from 'react';
import { examplePrompts } from '../utils/promptUtils';

interface TextAnimationOptions {
  typingSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
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
    pauseDuration = 1000
  } = options;

  const [displayText, setDisplayText] = useState("");
  const [currentExampleIndex, setCurrentExampleIndex] = useState(Math.floor(Math.random() * examplePrompts.length));
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

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
          // Select a random example that's different from the current one
          let nextIndex;
          do {
            nextIndex = Math.floor(Math.random() * examplePrompts.length);
          } while (nextIndex === currentExampleIndex);
          
          setCurrentExampleIndex(nextIndex);
        }
      }
    }
  }, [
    displayText, 
    isTyping, 
    isDeleting, 
    isPaused, 
    currentExampleIndex, 
    isFocused, 
    prompt, 
    typingSpeed, 
    deleteSpeed, 
    pauseDuration
  ]);

  return { displayText, currentExampleIndex };
};

export default useTextAnimation;

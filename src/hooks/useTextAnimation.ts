
import { useState, useEffect } from 'react';
import { examplePrompts } from '../utils/promptUtils';

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

  const [displayText, setDisplayText] = useState("");
  const [currentExampleIndex, setCurrentExampleIndex] = useState(Math.floor(Math.random() * examplePrompts.length));
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Text animation effect
  useEffect(() => {
    if (!prompt && !isFocused) {
      // Get the current example and trim it if needed
      let currentExample = examplePrompts[currentExampleIndex];
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
    currentExampleIndex, 
    isFocused, 
    prompt, 
    typingSpeed, 
    deleteSpeed,
    maxLength
  ]);

  return { displayText, currentExampleIndex };
};

export default useTextAnimation;

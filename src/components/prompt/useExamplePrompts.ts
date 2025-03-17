
import { useState, useEffect } from 'react';

// Base example prompts
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

interface TextAnimationState {
  displayText: string;
  isTyping: boolean;
  isDeleting: boolean;
  isPaused: boolean;
  currentExampleIndex: number;
}

export const useExamplePrompts = (isFocused: boolean, prompt: string) => {
  const [exampleTags, setExampleTags] = useState(() => getRandomExamples());
  const [animationState, setAnimationState] = useState<TextAnimationState>({
    displayText: "",
    isTyping: true,
    isDeleting: false,
    isPaused: false,
    currentExampleIndex: 0
  });

  // Get random examples
  const getRandomExamples = (count = 8) => {
    const shuffled = [...examplePrompts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Refresh examples periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFocused && !prompt) {
        setExampleTags(getRandomExamples());
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [isFocused, prompt]);

  // Handle text animation
  useEffect(() => {
    if (!prompt && !isFocused) {
      const { displayText, isTyping, isDeleting, isPaused, currentExampleIndex } = animationState;
      const currentExample = examplePrompts[currentExampleIndex];
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
            nextIndex = Math.floor(Math.random() * examplePrompts.length);
          } while (nextIndex === currentExampleIndex);
          
          setAnimationState(prev => ({
            ...prev,
            isDeleting: false,
            isTyping: true,
            currentExampleIndex: nextIndex
          }));
        }
      }
    }
  }, [animationState, isFocused, prompt]);

  return {
    exampleTags,
    displayText: animationState.displayText,
    currentExampleIndex: animationState.currentExampleIndex
  };
};

export default useExamplePrompts;

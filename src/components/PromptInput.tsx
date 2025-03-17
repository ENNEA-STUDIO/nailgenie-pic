import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Wand2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

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

const getRandomColor = () => {
  const colors = [
    'bg-rose-200/80 border-rose-300',
    'bg-amber-200/80 border-amber-300',
    'bg-lime-200/80 border-lime-300',
    'bg-cyan-200/80 border-cyan-300',
    'bg-purple-200/80 border-purple-300',
    'bg-indigo-200/80 border-indigo-300',
    'bg-pink-200/80 border-pink-300',
    'bg-emerald-200/80 border-emerald-300'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomSize = () => {
  const sizes = [
    'text-xs min-w-24',
    'text-sm min-w-28',
    'text-base min-w-32',
    'text-sm min-w-28 font-medium',
  ];
  return sizes[Math.floor(Math.random() * sizes.length)];
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTagStyles(exampleTags.map(() => ({
      color: getRandomColor(),
      size: getRandomSize()
    })));
  }, [exampleTags]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFocused && !prompt) {
        const newExamples = getRandomExamples();
        setExampleTags(newExamples);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [isFocused, prompt]);

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

  const handleFocus = () => {
    setIsFocused(true);
    setPlaceholder("Décrivez vos ongles de rêve...");
  };
  
  const handleBlur = () => {
    setIsFocused(false);
  };

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
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused ? placeholder : displayText || placeholder}
          className="prompt-input shadow-md hover:shadow-lg focus:shadow-lg transition-all duration-300 text-base"
          disabled={isLoading}
        />
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2.5 rounded-lg 
            ${prompt.trim() ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
            ${isLoading ? 'opacity-70' : 'opacity-100'} transition-all duration-200`}
          aria-label="Generate design"
        >
          <Wand2 size={20} className={isLoading ? 'animate-pulse-subtle' : ''} />
        </motion.button>
      </form>
      
      <motion.div 
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative mt-6 px-1"
      >
        <div className="flex flex-wrap justify-center gap-2.5 py-2">
          {exampleTags.map((example, index) => {
            const displayName = example.split(" avec ")[0].split(" en ")[0].split(" inspiré")[0];
            const style = tagStyles[index] || { color: getRandomColor(), size: getRandomSize() };
            
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleExampleClick(example)}
                className={`${style.color} ${style.size} px-3.5 py-2.5 rounded-full hover:shadow-md transition-all duration-200 cursor-pointer border whitespace-nowrap font-medium`}
              >
                {displayName}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PromptInput;

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
  "Mermaid Scales en violet et turquoise",
  "Crystal Embellishments sur base nude",
  "Textured Velvet rouge profond",
  "Candy Swirls multicolores",
  "Cloud Nails effet pastel",
  "Aurora Borealis inspiré",
  "Psychedelic Swirls néon",
  "Foil Marble avec effet doré",
  "Reverse French Manicure en noir",
  "Pop Art Designs colorés",
  "Tropical Palm Leaves vertes",
  "Abstract Art avec des touches de noir et rouge",
  "Color Block en néon et pastel",
  "Splatter Paint multicolore",
  "Flame Design rouge et orange",
  "Wave Patterns en bleu océan",
  "Cartoon Art style manga",
  "Smiley Faces jaunes sur fond noir",
  "Quartz Effect cristallin",
  "Neon French Tips électrique",
  "Tortoiseshell Print naturel",
  "Sharp Edge Tips graphiques",
  "Floral Stamping délicat",
  "Minimalist Dots en noir et blanc",
  "Starburst Design étincelant",
  "Gemstone-Inspired turquoise et émeraude",
  "Metallic Half-Moon argenté",
  "Holo Glitter Tips scintillant",
  "Abstract Splashes artistiques",
  "Psychedelic Checkerboard multicolore",
  "Edgy Negative Space géométrique",
  "Bold Outlined Nails contrastés",
  "Confetti Nails festifs",
  "Transparent Layers effet verre",
  "Swirling Stripes hypnotiques",
  "Lace Pattern romantique",
  "Snowflake Design hivernal",
  "Pumpkin Spice Theme automnal",
  "Spiderweb Accent gothique",
  "Electric Lightning Bolts énergique",
  "Holiday Ornament Nails festifs",
  "Cosmic Dust stellaire",
  "Multi-Texture Nails tactiles",
  "Futuristic Cyberpunk Style"
];

const getRandomExamples = (count = 9) => {
  const shuffled = [...examplePrompts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const generateTagAnimations = (count: number) => {
  return Array.from({ length: count }).map((_, index) => {
    const row = Math.floor(index / 3);
    const positionInRow = index % 3;
    const direction = row % 2 === 0 ? 1 : -1;
    
    return {
      row,
      positionInRow,
      direction,
      duration: 15 + Math.random() * 10,
      delay: positionInRow * 3 + Math.random() * 2,
    };
  });
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
  const [tagAnimations, setTagAnimations] = useState(generateTagAnimations(exampleTags.length));
  const typingSpeed = 120;
  const deleteSpeed = 30;
  const pauseDuration = 1000;
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFocused && !prompt) {
        const newExamples = getRandomExamples();
        setExampleTags(newExamples);
        setTagAnimations(generateTagAnimations(newExamples.length));
      }
    }, 10000);

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
      className={`w-full px-4 mb-6 ${isFocused ? 'scale-[1.02]' : 'scale-100'} transition-transform duration-300`}
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
          className="prompt-input pr-16"
          disabled={isLoading}
        />
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg 
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
        className="relative h-36 mt-3 px-1 overflow-hidden"
      >
        {exampleTags.map((example, index) => {
          const displayName = example.split(" avec ")[0].split(" en ")[0].split(" inspiré")[0];
          const animation = tagAnimations[index];
          
          const rowHeight = 40;
          const rowTop = 8 + (animation.row * rowHeight);
          
          const initialPosition = animation.direction > 0 
            ? -200 - (animation.positionInRow * 250) 
            : window.innerWidth + (animation.positionInRow * 250);
          
          const finalPosition = animation.direction > 0 
            ? window.innerWidth + 100
            : -300;
          
          return (
            <motion.button
              key={index}
              initial={{ x: initialPosition }}
              animate={{
                x: finalPosition,
              }}
              transition={{
                duration: animation.duration,
                delay: animation.delay,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear"
              }}
              onClick={() => handleExampleClick(example)}
              className="absolute bg-muted/30 px-3 py-2 rounded-full hover:bg-muted/50 transition-colors cursor-pointer active:scale-95 text-xs whitespace-nowrap border border-muted/40"
              style={{
                top: `${rowTop}px`,
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {displayName}
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default PromptInput;

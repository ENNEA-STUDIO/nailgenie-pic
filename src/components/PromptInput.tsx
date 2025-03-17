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

const PromptInput: React.FC = () => {
  const { prompt, setPrompt, generateDesign, isLoading } = useApp();
  const [isFocused, setIsFocused] = useState(false);
  const [placeholder, setPlaceholder] = useState("Décrivez vos ongles de rêve...");
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const typingSpeed = 120; // Increased from 70 to 120 to slow down typing
  const deleteSpeed = 30; // Speed for deleting characters
  const pauseDuration = 1000; // 1 second pause after typing
  const inputRef = useRef<HTMLInputElement>(null);

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
          // Finished typing, start pause
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
          // Finished deleting, move to next example immediately
          setIsDeleting(false);
          setIsTyping(true);
          // Select a random next example that's different from the current one
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs text-muted-foreground mt-3 px-1 flex flex-wrap gap-2"
      >
        <span className="bg-muted/30 px-2 py-1 rounded-md">Geometric Lines</span>
        <span className="bg-muted/30 px-2 py-1 rounded-md">Foil Marble</span>
        <span className="bg-muted/30 px-2 py-1 rounded-md">Watercolor</span>
        <span className="bg-muted/30 px-2 py-1 rounded-md">Pop Art</span>
        <span className="bg-muted/30 px-2 py-1 rounded-md">Pastel Gradient</span>
        <span className="bg-muted/30 px-2 py-1 rounded-md">Metallic Drips</span>
        <span className="bg-muted/30 px-2 py-1 rounded-md">Crystal</span>
      </motion.div>
    </motion.div>
  );
};

export default PromptInput;

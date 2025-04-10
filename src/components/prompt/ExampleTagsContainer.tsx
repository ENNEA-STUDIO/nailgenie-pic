
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ExamplePromptTag from './ExamplePromptTag';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExampleTagsContainerProps {
  exampleTags: string[];
  tagStyles: Array<{ color: string; size: string }>;
  handleExampleClick: (example: string) => void;
}

const ExampleTagsContainer: React.FC<ExampleTagsContainerProps> = ({
  exampleTags,
  tagStyles,
  handleExampleClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Split tags into two rows for staggered effect
  const firstRowTags = exampleTags.filter((_, i) => i % 2 === 0);
  const secondRowTags = exampleTags.filter((_, i) => i % 2 !== 0);

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="relative mt-6"
    >
      <div className="space-y-3">
        {/* First row - slower scroll to the right */}
        <ScrollArea className="w-full overflow-hidden">
          <div className="flex animate-scroll-right py-2">
            {firstRowTags.concat(firstRowTags).map((example, index) => (
              <div key={`first-${index}`} className="pl-3 first:pl-0">
                <ExamplePromptTag
                  example={example}
                  index={index}
                  style={tagStyles[index % tagStyles.length] || { color: getRandomColor(), size: getRandomSize() }}
                  onClick={handleExampleClick}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Second row - faster scroll to the left */}
        <ScrollArea className="w-full overflow-hidden">
          <div className="flex animate-scroll-left py-2">
            {secondRowTags.concat(secondRowTags).map((example, index) => (
              <div key={`second-${index}`} className="pl-3 first:pl-0">
                <ExamplePromptTag
                  example={example}
                  index={index}
                  style={tagStyles[(index + firstRowTags.length) % tagStyles.length] || { color: getRandomColor(), size: getRandomSize() }}
                  onClick={handleExampleClick}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
};

// Helper functions for generating random styles
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

export { getRandomColor, getRandomSize };
export default ExampleTagsContainer;

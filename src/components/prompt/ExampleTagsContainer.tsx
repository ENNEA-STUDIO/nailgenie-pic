import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ExamplePromptTag from './ExamplePromptTag';
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRandomColor, getRandomSize } from './ExampleTagsContainer';
import { getRandomExamples } from '../../utils/promptUtils';

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
  const [dynamicFirstRowTags, setDynamicFirstRowTags] = useState<string[]>([]);
  const [dynamicSecondRowTags, setDynamicSecondRowTags] = useState<string[]>([]);
  
  // Initial split of tags into two rows
  const firstRowTags = exampleTags.filter((_, i) => i % 2 === 0);
  const secondRowTags = exampleTags.filter((_, i) => i % 2 !== 0);

  // Set up the initial dynamic tags
  useEffect(() => {
    setDynamicFirstRowTags([...firstRowTags, ...firstRowTags, ...firstRowTags]);
    setDynamicSecondRowTags([...secondRowTags, ...secondRowTags, ...secondRowTags]);
  }, [exampleTags]);

  // Add new tags periodically for the continuous pop effect
  useEffect(() => {
    const firstInterval = setInterval(() => {
      // Add a new random tag to first row
      const newTag = getRandomExamples(1)[0];
      setDynamicFirstRowTags(prev => {
        const newTags = [...prev];
        // Insert at random position
        const position = Math.floor(Math.random() * newTags.length);
        newTags.splice(position, 0, newTag);
        // Keep array size reasonable
        if (newTags.length > 30) newTags.pop();
        return newTags;
      });
    }, 6000);

    const secondInterval = setInterval(() => {
      // Add a new random tag to second row
      const newTag = getRandomExamples(1)[0];
      setDynamicSecondRowTags(prev => {
        const newTags = [...prev];
        // Insert at random position
        const position = Math.floor(Math.random() * newTags.length);
        newTags.splice(position, 0, newTag);
        // Keep array size reasonable
        if (newTags.length > 30) newTags.pop();
        return newTags;
      });
    }, 7000);
    
    return () => {
      clearInterval(firstInterval);
      clearInterval(secondInterval);
    };
  }, []);

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
            {dynamicFirstRowTags.map((example, index) => (
              <motion.div 
                key={`first-${index}-${example}`} 
                className="pl-3 first:pl-0"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ExamplePromptTag
                  example={example}
                  index={index}
                  style={tagStyles[index % tagStyles.length] || { color: getRandomColor(), size: getRandomSize() }}
                  onClick={handleExampleClick}
                />
              </motion.div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Second row - faster scroll to the left */}
        <ScrollArea className="w-full overflow-hidden">
          <div className="flex animate-scroll-left py-2">
            {dynamicSecondRowTags.map((example, index) => (
              <motion.div 
                key={`second-${index}-${example}`} 
                className="pl-3 first:pl-0"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ExamplePromptTag
                  example={example}
                  index={index}
                  style={tagStyles[(index + firstRowTags.length) % tagStyles.length] || { color: getRandomColor(), size: getRandomSize() }}
                  onClick={handleExampleClick}
                />
              </motion.div>
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

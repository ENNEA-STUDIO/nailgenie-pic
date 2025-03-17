
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ExamplePromptTag from './ExamplePromptTag';

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

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="relative mt-6 px-1"
    >
      <div className="flex flex-wrap justify-center gap-2.5 py-2">
        {exampleTags.map((example, index) => (
          <ExamplePromptTag
            key={index}
            example={example}
            index={index}
            style={tagStyles[index] || { color: getRandomColor(), size: getRandomSize() }}
            onClick={handleExampleClick}
          />
        ))}
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


import React, { useRef, useEffect } from 'react';
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

  // Fix mobile touch issues by ensuring container is fully visible and scrollable
  useEffect(() => {
    if (containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
              });
            }
          });
        },
        { threshold: 0.1 }
      );
      
      const tags = containerRef.current.querySelectorAll('.tag-item');
      tags.forEach(tag => observer.observe(tag));
      
      return () => {
        if (containerRef.current) {
          const tags = containerRef.current.querySelectorAll('.tag-item');
          tags.forEach(tag => observer.unobserve(tag));
        }
      };
    }
  }, [exampleTags]);

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="relative mt-4 mb-16 px-1 pb-4"
    >
      <div className="flex flex-wrap justify-center gap-3 py-2 px-1 max-h-40 overflow-y-auto">
        {exampleTags.map((example, index) => (
          <div key={index} className="tag-item">
            <ExamplePromptTag
              example={example}
              index={index}
              style={tagStyles[index] || { color: getRandomColor(), size: getRandomSize() }}
              onClick={handleExampleClick}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Improved color palette with more variety and better contrast
const getRandomColor = () => {
  const colors = [
    'bg-rose-100 border-rose-300 text-rose-800',
    'bg-amber-100 border-amber-300 text-amber-800',
    'bg-lime-100 border-lime-300 text-lime-800',
    'bg-emerald-100 border-emerald-300 text-emerald-800',
    'bg-cyan-100 border-cyan-300 text-cyan-800',
    'bg-sky-100 border-sky-300 text-sky-800',
    'bg-violet-100 border-violet-300 text-violet-800',
    'bg-purple-100 border-purple-300 text-purple-800',
    'bg-fuchsia-100 border-fuchsia-300 text-fuchsia-800',
    'bg-pink-100 border-pink-300 text-pink-800',
    'bg-indigo-100 border-indigo-300 text-indigo-800',
    'bg-blue-100 border-blue-300 text-blue-800',
    'bg-teal-100 border-teal-300 text-teal-800',
    'bg-green-100 border-green-300 text-green-800',
    'bg-yellow-100 border-yellow-300 text-yellow-800',
    'bg-orange-100 border-orange-300 text-orange-800',
    'bg-red-100 border-red-300 text-red-800',
    'bg-gray-100 border-gray-300 text-gray-800',
    'bg-slate-100 border-slate-300 text-slate-800',
    'bg-zinc-100 border-zinc-300 text-zinc-800',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// More uniform sizes for better mobile experience
const getRandomSize = () => {
  const sizes = [
    'text-xs min-w-20',
    'text-sm min-w-24',
    'text-sm min-w-28',
  ];
  return sizes[Math.floor(Math.random() * sizes.length)];
};

export { getRandomColor, getRandomSize };
export default ExampleTagsContainer;

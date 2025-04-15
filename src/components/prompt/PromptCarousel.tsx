
import React from 'react';
import { motion } from 'framer-motion';
import ExamplePromptTag from './ExamplePromptTag';
import { getRandomColor, getRandomSize } from './ExampleTagsContainer';
import { useLanguage } from '@/context/LanguageContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface PromptCarouselProps {
  colorName: string;
  exampleTags: string[];
  tagStyles: Array<{ color: string; size: string }>;
  handleExampleClick: (example: string) => void;
}

const PromptCarousel: React.FC<PromptCarouselProps> = ({
  colorName,
  exampleTags,
  tagStyles,
  handleExampleClick
}) => {
  const { language } = useLanguage();

  // Group prompts into sets of 5 for each slide
  const promptsPerSlide = 5;
  const promptGroups = [];
  
  for (let i = 0; i < exampleTags.length; i += promptsPerSlide) {
    promptGroups.push(exampleTags.slice(i, i + promptsPerSlide));
  }

  return (
    <div className="mt-6">
      {/* Color name display */}
      <div className="text-center mb-4">
        <span className="inline-block px-3 py-1 bg-secondary/50 rounded-full text-sm font-medium">
          {language === 'fr' ? 'Idées pour ' : 'Ideas for '}
          <span className="font-semibold">{colorName}</span>
        </span>
      </div>
      
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {promptGroups.map((group, groupIndex) => (
            <CarouselItem key={`group-${groupIndex}`} className="flex flex-col space-y-4">
              <div className="flex flex-wrap justify-center gap-2">
                {group.map((example, index) => {
                  const styleIndex = (groupIndex * promptsPerSlide + index) % tagStyles.length;
                  const style = tagStyles[styleIndex] || { color: getRandomColor(), size: getRandomSize() };
                  
                  return (
                    <motion.div
                      key={`prompt-${groupIndex}-${index}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <ExamplePromptTag
                        example={example}
                        index={index}
                        style={style}
                        onClick={handleExampleClick}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default PromptCarousel;

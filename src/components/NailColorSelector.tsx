
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Check } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useLanguage } from '@/context/LanguageContext';
import { colorCategories } from '@/utils/colorCategories';

const NailColorSelector: React.FC = () => {
  const { nailColor, setNailColor } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>(colorCategories[0].name);
  const { t } = useLanguage();
  
  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);
  };
  
  // Find the currently active category
  const currentCategory = colorCategories.find(cat => cat.name === activeCategory) || colorCategories[0];
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3 px-4">Couleur</h3>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {/* Horizontal scrollable tabs for categories */}
        <div className="overflow-x-auto no-scrollbar">
          <div className="pb-2 px-4">
            <Tabs 
              value={activeCategory} 
              onValueChange={handleCategoryChange}
              className="w-full min-w-max"
            >
              <TabsList className="inline-flex h-auto bg-transparent p-0">
                {colorCategories.map((category) => (
                  <TabsTrigger
                    key={category.name}
                    value={category.name}
                    className="px-3 py-1.5 text-sm rounded-full whitespace-nowrap mr-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {category.emoji} {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Display color grid for the active category */}
        <motion.div 
          key={activeCategory}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.25 }}
          className="border border-muted rounded-xl p-3 mx-4"
        >
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-3 min-w-max pb-2">
              {currentCategory.colors.map((color) => {
                const isSelected = nailColor === color.hex;
                
                return (
                  <TooltipProvider key={color.hex + color.name} delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center space-y-2 w-16">
                          <button
                            onClick={() => setNailColor(color.hex)}
                            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected 
                                ? 'border-gray-800 scale-110 shadow-md' 
                                : 'border-transparent hover:border-gray-300 hover:scale-105'
                            }`}
                            style={
                              color.gradient 
                                ? { background: color.gradient } 
                                : { backgroundColor: color.hex }
                            }
                            aria-label={`Select ${color.name} color`}
                          >
                            {isSelected && (
                              <Check 
                                size={14} 
                                className={`z-10 ${
                                  ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#F8F0DD', '#FFF3D9', '#FFE5B4', '#E8E8E8', '#EAEAEA', '#F2F3F4', '#F0FFFF', '#FFFACD'].includes(color.hex) 
                                    ? 'text-black' 
                                    : 'text-white'
                                }`} 
                              />
                            )}
                          </button>
                          <span className="text-xs text-center truncate w-full">
                            {color.name}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        {color.name}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NailColorSelector;

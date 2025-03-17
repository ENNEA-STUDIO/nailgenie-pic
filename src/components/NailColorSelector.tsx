
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

// Organized color palette with categories
const colorCategories = [
  {
    name: "Nude & Neutrals",
    colors: [
      { hex: '#E6CCAF', name: 'Beige' },
      { hex: '#B8A99A', name: 'Taupe' },
      { hex: '#F8F0DD', name: 'Ivory' },
      { hex: '#FFF3D9', name: 'Cream' },
      { hex: '#A17249', name: 'Cappuccino' },
      { hex: '#D2B48C', name: 'Sand' },
    ]
  },
  {
    name: "Cool Tones",
    colors: [
      { hex: '#0A2463', name: 'Navy blue' },
      { hex: '#7EC8E3', name: 'Sky blue' },
      { hex: '#C8A2C8', name: 'Lavender' },
      { hex: '#C8A4D4', name: 'Lilac' },
      { hex: '#9CAF88', name: 'Sage green' },
      { hex: '#98D8C8', name: 'Mint' },
    ]
  },
  {
    name: "Warm Tones",
    colors: [
      { hex: '#D2042D', name: 'Cherry red' },
      { hex: '#A52A2A', name: 'Brick red' },
      { hex: '#FF7F50', name: 'Coral' },
      { hex: '#FFE5B4', name: 'Peach' },
      { hex: '#CC5500', name: 'Burnt orange' },
      { hex: '#E2725B', name: 'Terracotta' },
    ]
  },
  {
    name: "Metallic & Effects",
    colors: [
      { hex: '#D4AF37', name: 'Gold' },
      { hex: '#C0C0C0', name: 'Silver' },
      { hex: '#B87333', name: 'Copper' },
      { hex: '#E8E8E8', name: 'Chrome' },
      { hex: '#EAEAEA', name: 'Holographic', gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
      { hex: '#F2F3F4', name: 'Pearl', gradient: 'linear-gradient(135deg, #E6E6FA 0%, #F8F8FF 50%, #E6E6FA 100%)' },
    ]
  },
  {
    name: "Dark & Deep Tones",
    colors: [
      { hex: '#000000', name: 'Black' },
      { hex: '#800020', name: 'Burgundy' },
      { hex: '#673147', name: 'Plum' },
      { hex: '#7B3F00', name: 'Chocolate' },
      { hex: '#046307', name: 'Emerald' },
      { hex: '#191970', name: 'Midnight blue' },
    ]
  }
];

const NailColorSelector: React.FC = () => {
  const { nailColor, setNailColor } = useApp();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "Nude & Neutrals": true,
    "Cool Tones": false,
    "Warm Tones": false,
    "Metallic & Effects": false,
    "Dark & Deep Tones": false
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Couleur</h3>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <TooltipProvider>
          {colorCategories.map((category) => (
            <div key={category.name} className="rounded-xl border border-muted p-2">
              <button 
                onClick={() => toggleCategory(category.name)}
                className="flex items-center justify-between w-full px-2 py-1.5 font-medium text-left"
              >
                <span>{category.name}</span>
                {expandedCategories[category.name] ? 
                  <ChevronUp size={18} className="text-muted-foreground" /> : 
                  <ChevronDown size={18} className="text-muted-foreground" />
                }
              </button>
              
              {expandedCategories[category.name] && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-6 gap-2 p-2"
                >
                  {category.colors.map((color) => {
                    const isSelected = nailColor === color.hex;
                    
                    return (
                      <Tooltip key={color.hex}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setNailColor(color.hex)}
                            className={`w-full aspect-square rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected 
                                ? 'border-gray-800 scale-110 shadow-md' 
                                : 'border-transparent hover:border-gray-300 hover:scale-105'
                            }`}
                            style={color.gradient ? 
                              { background: color.gradient } : 
                              { backgroundColor: color.hex }
                            }
                            aria-label={`Select ${color.name} color`}
                          >
                            {isSelected && (
                              <Check 
                                size={16} 
                                className={
                                  ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#F8F0DD', '#FFF3D9', '#FFE5B4', '#E8E8E8', '#EAEAEA', '#F2F3F4'].includes(color.hex) 
                                    ? 'text-black' 
                                    : 'text-white'
                                } 
                              />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent 
                          side="bottom"
                          sideOffset={4}
                          className="bg-background/90 backdrop-blur-sm border border-border/40 shadow animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200"
                        >
                          <span className="text-xs">{color.name}</span>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </motion.div>
              )}
            </div>
          ))}
        </TooltipProvider>
      </motion.div>
    </div>
  );
};

export default NailColorSelector;

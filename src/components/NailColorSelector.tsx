
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

// Organized color palette with categories
const colorCategories = [
  {
    name: "Nude & Minimalist",
    colors: [
      { hex: '#E6CCAF', name: 'Soft Beige' },
      { hex: '#FFFFFF', name: 'Milky White' },
      { hex: '#FFC0CB', name: 'Blush Pink' },
      { hex: '#B8A99A', name: 'Taupe' },
      { hex: '#FFF3D9', name: 'Cream' },
      { hex: '#E8E8E8', name: 'Icy Grey' },
      { hex: '#F2F3F4', name: 'Transparent Gloss', gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F8F8FF 50%, #F2F3F4 100%)' },
    ]
  },
  {
    name: "Glazed & Pearlcore",
    colors: [
      { hex: '#E8E8E8', name: 'Glazed Donut', gradient: 'linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)' },
      { hex: '#FFFFFF', name: 'Iridescent White', gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F0F8FF 50%, #FFFFFF 100%)' },
      { hex: '#EAEAEA', name: 'Holographic Pearl', gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
      { hex: '#C0C0C0', name: 'Baby Chrome' },
      { hex: '#F2F3F4', name: 'Soft Opal', gradient: 'linear-gradient(135deg, #E6E6FA 0%, #F8F8FF 50%, #E6E6FA 100%)' },
    ]
  },
  {
    name: "Y2K / Pop Vibes",
    colors: [
      { hex: '#FF69B4', name: 'Hot Pink' },
      { hex: '#1E90FF', name: 'Electric Blue' },
      { hex: '#39FF14', name: 'Neon Green' },
      { hex: '#FFFF00', name: 'Acid Yellow' },
      { hex: '#FF7F50', name: 'Candy Orange' },
      { hex: '#C0C0C0', name: 'Silver Chrome', gradient: 'linear-gradient(135deg, #C0C0C0 0%, #DCDCDC 50%, #C0C0C0 100%)' },
      { hex: '#9370DB', name: 'Bubblegum Purple' },
    ]
  },
  {
    name: "Dark & Mysterious",
    colors: [
      { hex: '#800020', name: 'Deep Burgundy' },
      { hex: '#191970', name: 'Midnight Blue' },
      { hex: '#3D0C02', name: 'Black Cherry' },
      { hex: '#014421', name: 'Forest Green' },
      { hex: '#2C3539', name: 'Gunmetal' },
      { hex: '#000000', name: 'Matte Black' },
      { hex: '#551A8B', name: 'Cosmic Purple' },
    ]
  },
  {
    name: "Luxury / Metallic",
    colors: [
      { hex: '#D4AF37', name: '24K Gold' },
      { hex: '#B76E79', name: 'Rose Gold' },
      { hex: '#E5E4E2', name: 'Platinum' },
      { hex: '#F7E7CE', name: 'Champagne' },
      { hex: '#B87333', name: 'Bronze' },
      { hex: '#8A9A5B', name: 'Pewter' },
      { hex: '#046307', name: 'Emerald Green' },
      { hex: '#0F52BA', name: 'Sapphire Blue' },
    ]
  },
  {
    name: "Romantic / Pastelcore",
    colors: [
      { hex: '#C8A4D4', name: 'Pastel Lilac' },
      { hex: '#B0E0E6', name: 'Baby Blue' },
      { hex: '#98D8C8', name: 'Soft Mint' },
      { hex: '#FFC0CB', name: 'Powder Pink' },
      { hex: '#FFFACD', name: 'Butter Yellow' },
      { hex: '#C8A2C8', name: 'Mauve' },
      { hex: '#FFE5B4', name: 'Peachy Nude' },
    ]
  },
  {
    name: "Bold & Graphic",
    colors: [
      { hex: '#D2042D', name: 'Primary Red' },
      { hex: '#000000', name: 'Jet Black' },
      { hex: '#FFFFFF', name: 'Whiteout' },
      { hex: '#0A2463', name: 'High Contrast Blue' },
      { hex: '#FF7F00', name: 'Citrus Orange' },
    ]
  },
  {
    name: "Goth / Punk",
    colors: [
      { hex: '#000000', name: 'Matte Black' },
      { hex: '#8B0000', name: 'Blood Red' },
      { hex: '#808080', name: 'Ash Grey' },
      { hex: '#7B3F00', name: 'Rust Brown' },
      { hex: '#673147', name: 'Deep Plum' },
      { hex: '#556B2F', name: 'Olive Green' },
      { hex: '#343434', name: 'Dark Chrome' },
    ]
  },
  {
    name: "Frozen / Clean Girl",
    colors: [
      { hex: '#A5F2F3', name: 'Ice Blue' },
      { hex: '#E6E6FA', name: 'Soft Lavender' },
      { hex: '#F0FFFF', name: 'Frosted White' },
      { hex: '#C0C0C0', name: 'Shimmering Grey' },
      { hex: '#F5F5F5', name: 'Translucent Glaze', gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)' },
    ]
  },
  {
    name: "Artistic / Painterly",
    colors: [
      { hex: '#FF7F50', name: 'Coral' },
      { hex: '#556B2F', name: 'Olive' },
      { hex: '#E2725B', name: 'Terracotta' },
      { hex: '#000000', name: 'Ink Black' },
      { hex: '#CC7722', name: 'Ochre' },
    ]
  },
  {
    name: "Nature-Inspired",
    colors: [
      { hex: '#9CAF88', name: 'Sage Green' },
      { hex: '#A17249', name: 'Clay' },
      { hex: '#E2725B', name: 'Terracotta' },
      { hex: '#C08081', name: 'Dusty Rose' },
      { hex: '#0077BE', name: 'Ocean Blue' },
      { hex: '#D2B48C', name: 'Sand' },
      { hex: '#8A9A5B', name: 'Moss' },
    ]
  },
  {
    name: "Futuristic",
    colors: [
      { hex: '#C0C0C0', name: 'Silver' },
      { hex: '#4682B4', name: 'Reflective Blue' },
      { hex: '#000000', name: 'Oil-Slick Black', gradient: 'linear-gradient(135deg, #000000 0%, #434343 50%, #000000 100%)' },
      { hex: '#8A2BE2', name: 'Ultraviolet' },
      { hex: '#BFFF00', name: 'Lime Techno' },
      { hex: '#EAEAEA', name: 'Holo Chrome', gradient: 'linear-gradient(135deg, #C0C0C0 0%, #EAEAEA 50%, #C0C0C0 100%)' },
    ]
  },
  {
    name: "Bi-Color / Color Combos",
    colors: [
      { hex: '#FFC0CB', name: 'Blush Pink & Burgundy', gradient: 'linear-gradient(135deg, #FFC0CB 0%, #800020 100%)' },
      { hex: '#FFF3D9', name: 'Cream & Chocolate', gradient: 'linear-gradient(135deg, #FFF3D9 0%, #7B3F00 100%)' },
      { hex: '#B0E0E6', name: 'Baby Blue & Navy', gradient: 'linear-gradient(135deg, #B0E0E6 0%, #191970 100%)' },
      { hex: '#9CAF88', name: 'Sage Green & Gold', gradient: 'linear-gradient(135deg, #9CAF88 0%, #D4AF37 100%)' },
      { hex: '#C8A4D4', name: 'Lilac & Silver', gradient: 'linear-gradient(135deg, #C8A4D4 0%, #C0C0C0 100%)' },
      { hex: '#FFE5B4', name: 'Peach & Coral', gradient: 'linear-gradient(135deg, #FFE5B4 0%, #FF7F50 100%)' },
      { hex: '#E2725B', name: 'Terracotta & Olive', gradient: 'linear-gradient(135deg, #E2725B 0%, #556B2F 100%)' },
      { hex: '#FF69B4', name: 'Pink & Electric Blue', gradient: 'linear-gradient(135deg, #FF69B4 0%, #1E90FF 100%)' },
      { hex: '#000000', name: 'Black & Nude', gradient: 'linear-gradient(135deg, #000000 0%, #E6CCAF 100%)' },
      { hex: '#014421', name: 'Forest & Champagne', gradient: 'linear-gradient(135deg, #014421 0%, #F7E7CE 100%)' },
      { hex: '#E6E6FA', name: 'Lavender & Mustard', gradient: 'linear-gradient(135deg, #E6E6FA 0%, #E1AD01 100%)' },
      { hex: '#7B3F00', name: 'Rust & Dusty Pink', gradient: 'linear-gradient(135deg, #7B3F00 0%, #C08081 100%)' },
      { hex: '#FFFFFF', name: 'White & Emerald', gradient: 'linear-gradient(135deg, #FFFFFF 0%, #046307 100%)' },
      { hex: '#A5F2F3', name: 'Ice Blue & Grey', gradient: 'linear-gradient(135deg, #A5F2F3 0%, #E8E8E8 100%)' },
      { hex: '#B76E79', name: 'Rose Gold & Plum', gradient: 'linear-gradient(135deg, #B76E79 0%, #673147 100%)' },
      { hex: '#98D8C8', name: 'Mint & Pearl', gradient: 'linear-gradient(135deg, #98D8C8 0%, #EAEAEA 100%)' },
      { hex: '#FFFACD', name: 'Yellow & Sky Blue', gradient: 'linear-gradient(135deg, #FFFACD 0%, #87CEEB 100%)' },
      { hex: '#000000', name: 'Black & Hot Pink', gradient: 'linear-gradient(135deg, #000000 0%, #FF69B4 100%)' },
      { hex: '#556B2F', name: 'Olive & Bronze', gradient: 'linear-gradient(135deg, #556B2F 0%, #B87333 100%)' },
      { hex: '#C8A2C8', name: 'Mauve & Cream', gradient: 'linear-gradient(135deg, #C8A2C8 0%, #FFF3D9 100%)' },
      { hex: '#E6E6FA', name: 'Lavender & White', gradient: 'linear-gradient(135deg, #E6E6FA 0%, #F0FFFF 100%)' },
      { hex: '#B0E0E6', name: 'Powder Blue & Orange', gradient: 'linear-gradient(135deg, #B0E0E6 0%, #FF7F00 100%)' },
      { hex: '#F2F3F4', name: 'Gloss & Chrome', gradient: 'linear-gradient(135deg, #F2F3F4 0%, #C0C0C0 100%)' },
      { hex: '#FFFACD', name: 'Yellow & Baby Pink', gradient: 'linear-gradient(135deg, #FFFACD 0%, #FFC0CB 100%)' },
      { hex: '#191970', name: 'Midnight & Silver', gradient: 'linear-gradient(135deg, #191970 0%, #C0C0C0 100%)' },
    ]
  },
];

const NailColorSelector: React.FC = () => {
  const { nailColor, setNailColor } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>("Nude & Minimalist");
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
                    {category.name}
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
                            style={color.gradient ? 
                              { background: color.gradient } : 
                              { backgroundColor: color.hex }
                            }
                            aria-label={`Select ${color.name} color`}
                          >
                            {isSelected && (
                              <Check 
                                size={14} 
                                className={
                                  ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#F8F0DD', '#FFF3D9', '#FFE5B4', '#E8E8E8', '#EAEAEA', '#F2F3F4', '#F0FFFF', '#FFFACD'].includes(color.hex) 
                                    ? 'text-black' 
                                    : 'text-white'
                                } 
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

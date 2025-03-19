
import React from 'react';
import { motion } from 'framer-motion';
import { Rss } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SavedDesign } from '@/types/gallery';
import { 
  RoundNailIcon, 
  SquareNailIcon, 
  OvalNailIcon, 
  AlmondNailIcon, 
  StilettoNailIcon, 
  CoffinNailIcon 
} from '../NailShapeIcons';

interface DesignGridProps {
  designs: SavedDesign[];
  selectedDesign: SavedDesign | null;
  onSelectDesign: (design: SavedDesign) => void;
  gridCols: "grid-cols-2" | "grid-cols-3";
}

// Map shapes to their respective icon components
const shapeIconMap: Record<string, React.FC<{ className?: string }>> = {
  round: RoundNailIcon,
  square: SquareNailIcon,
  oval: OvalNailIcon,
  almond: AlmondNailIcon,
  stiletto: StilettoNailIcon,
  coffin: CoffinNailIcon,
};

// Color mapping for different nail colors
const colorMap: Record<string, string> = {
  red: 'bg-red-500',
  pink: 'bg-pink-500',
  purple: 'bg-purple-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500',
  brown: 'bg-amber-800',
  black: 'bg-black',
  white: 'bg-white border border-gray-300',
  gray: 'bg-gray-500',
  silver: 'bg-gray-300',
  gold: 'bg-amber-400',
  transparent: 'bg-transparent border border-gray-300',
  nude: 'bg-amber-200',
  beige: 'bg-amber-100',
};

// Length indicators
const lengthSizeMap: Record<string, string> = {
  short: 'w-3',
  medium: 'w-5',
  long: 'w-7',
};

const DesignGrid: React.FC<DesignGridProps> = ({ 
  designs, 
  selectedDesign, 
  onSelectDesign,
  gridCols 
}) => {
  return (
    <div className={cn("grid gap-3 auto-rows-max", gridCols)}>
      {designs.map((design, index) => {
        // Get the icon component based on nail shape
        const ShapeIcon = design.nail_shape ? shapeIconMap[design.nail_shape] : null;
        // Get color class based on nail color
        const colorClass = design.nail_color ? colorMap[design.nail_color] || 'bg-gray-300' : '';
        // Get length class
        const lengthClass = design.nail_length ? lengthSizeMap[design.nail_length] : '';
        
        return (
          <motion.div
            key={design.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={cn(
              "glass-card rounded-xl overflow-hidden relative group cursor-pointer",
              selectedDesign?.id === design.id && "ring-2 ring-primary"
            )}
            onClick={() => onSelectDesign(design)}
          >
            <img 
              src={design.image_url} 
              alt={`Design ${index + 1}`}
              className="w-full aspect-square object-cover"
            />
            
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            
            {/* Shared indicator */}
            {design.is_shared && (
              <div className="absolute top-2 right-2 p-1 bg-green-500/70 rounded-full">
                <Rss size={14} className="text-white" />
              </div>
            )}
            
            {/* Nail properties indicators */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
              {/* Color indicator */}
              {design.nail_color && (
                <div className={cn("h-4 w-4 rounded-full shadow-sm", colorClass)} />
              )}
              
              {/* Shape indicator */}
              {ShapeIcon && (
                <div className="h-5 w-5 flex items-center justify-center">
                  <ShapeIcon className="h-full w-full" />
                </div>
              )}
              
              {/* Length indicator */}
              {design.nail_length && (
                <div className="flex items-center">
                  <div className={cn("h-1 rounded-full bg-white/90 shadow-sm", lengthClass)} />
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DesignGrid;

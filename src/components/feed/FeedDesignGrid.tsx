
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SharedDesign } from '@/types/feed';
import { 
  RoundNailIcon, 
  SquareNailIcon, 
  OvalNailIcon, 
  AlmondNailIcon, 
  StilettoNailIcon, 
  CoffinNailIcon 
} from '../NailShapeIcons';

interface FeedDesignGridProps {
  designs: SharedDesign[];
  selectedDesign: SharedDesign | null;
  onSelectDesign: (design: SharedDesign) => void;
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

// Length indicators
const lengthSizeMap: Record<string, string> = {
  short: 'w-3',
  medium: 'w-5',
  long: 'w-7',
};

const FeedDesignGrid: React.FC<FeedDesignGridProps> = ({ 
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
            
            {/* Nail properties indicators */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
              {/* Color indicator */}
              {design.nail_color && (
                <div 
                  className="h-4 w-4 rounded-full shadow-md border border-gray-200/30" 
                  style={{ 
                    backgroundColor: design.nail_color,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)'
                  }}
                />
              )}
              
              {/* Shape indicator */}
              {ShapeIcon && (
                <div className="h-5 w-5 flex items-center justify-center filter drop-shadow-md">
                  <ShapeIcon className="h-full w-full text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]" />
                </div>
              )}
              
              {/* Length indicator */}
              {design.nail_length && (
                <div className="flex items-center filter drop-shadow">
                  <div className={cn("h-1 rounded-full bg-white/90 shadow-sm", lengthClass)} style={{
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }} />
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FeedDesignGrid;


import React from 'react';
import { motion } from 'framer-motion';
import { Rss } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SavedDesign } from '@/types/gallery';

interface DesignGridProps {
  designs: SavedDesign[];
  selectedDesign: SavedDesign | null;
  onSelectDesign: (design: SavedDesign) => void;
  gridCols: "grid-cols-2" | "grid-cols-3";
}

const DesignGrid: React.FC<DesignGridProps> = ({ 
  designs, 
  selectedDesign, 
  onSelectDesign,
  gridCols 
}) => {
  return (
    <div className={cn("grid gap-3 auto-rows-max", gridCols)}>
      {designs.map((design, index) => (
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
          
          {/* Nail properties indicator */}
          {(design.nail_shape || design.nail_length) && (
            <div className="absolute bottom-2 right-2 bg-black/50 rounded-full px-2 py-1 text-white text-xs">
              {design.nail_shape || ""} {design.nail_length || ""}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default DesignGrid;

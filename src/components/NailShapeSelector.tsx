
import React from 'react';
import { motion } from 'framer-motion';
import { NailShape, useApp } from '../context/AppContext';
import { 
  RoundNailIcon, 
  SquareNailIcon, 
  OvalNailIcon, 
  AlmondNailIcon, 
  StilettoNailIcon, 
  CoffinNailIcon,
  SquovalNailIcon,
  BallerinaNailIcon,
  DuckNailIcon,
  LipsNailIcon,
  EdgeNailIcon,
  ArrowheadNailIcon,
  FlareNailIcon,
  LipstickNailIcon
} from './NailShapeIcons';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useLanguage } from '@/context/LanguageContext';

// Map des icônes pour chaque forme d'ongle
const shapeIcons = {
  round: RoundNailIcon,
  square: SquareNailIcon,
  oval: OvalNailIcon,
  almond: AlmondNailIcon,
  stiletto: StilettoNailIcon,
  coffin: CoffinNailIcon,
  squoval: SquovalNailIcon,
  ballerina: BallerinaNailIcon,
  duck: DuckNailIcon,
  lips: LipsNailIcon,
  edge: EdgeNailIcon,
  arrowhead: ArrowheadNailIcon,
  flare: FlareNailIcon,
  lipstick: LipstickNailIcon,
};

// Composant qui affiche les options de formes d'ongles
const NailShapeSelector: React.FC = () => {
  const { nailShape, setNailShape } = useApp();
  const { t } = useLanguage();
  
  const handleShapeChange = (value: string) => {
    setNailShape(value as NailShape);
  };
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3 px-4">{t.prompt.nailShape}</h3>
      <div className="overflow-x-auto no-scrollbar pb-2">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 px-4 min-w-max"
        >
          <TooltipProvider delayDuration={200}>
            {(Object.keys(shapeIcons) as NailShape[]).map((shape) => {
              const IconComponent = shapeIcons[shape];
              const isSelected = nailShape === shape;
              
              return (
                <Tooltip key={shape}>
                  <TooltipTrigger asChild>
                    <motion.div 
                      onClick={() => handleShapeChange(shape)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex flex-col items-center p-2 rounded-xl cursor-pointer border-2 transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-transparent hover:border-primary/30 hover:bg-secondary/50'
                      }`}
                    >
                      <div className={`p-2 ${isSelected ? 'scale-110' : ''} transition-transform duration-200`}>
                        <IconComponent 
                          className={`w-10 h-10 transition-all duration-300 drop-shadow-md ${
                            isSelected ? '' : 'opacity-80'
                          }`}
                        />
                      </div>
                      <span className="mt-1 text-xs font-medium capitalize">{t.shapes[shape]}</span>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="bottom"
                    sideOffset={4}
                    className="bg-background/90 backdrop-blur-sm border border-border/40 shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200"
                  >
                    <span className="text-xs">{t.shapeDescriptions[shape]}</span>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </motion.div>
      </div>
    </div>
  );
};

export default NailShapeSelector;

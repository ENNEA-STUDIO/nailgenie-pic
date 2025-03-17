
import React from 'react';
import { motion } from 'framer-motion';
import { NailShape, useApp } from '../context/AppContext';
import { 
  RoundNailIcon, 
  SquareNailIcon, 
  OvalNailIcon, 
  AlmondNailIcon, 
  StilettoNailIcon, 
  CoffinNailIcon 
} from './NailShapeIcons';

// Map des icônes pour chaque forme d'ongle
const shapeIcons = {
  round: RoundNailIcon,
  square: SquareNailIcon,
  oval: OvalNailIcon,
  almond: AlmondNailIcon,
  stiletto: StilettoNailIcon,
  coffin: CoffinNailIcon,
};

// Description pour chaque forme
const shapeDescriptions = {
  round: 'Forme classique et naturelle',
  square: 'Bout droit avec coins arrondis',
  oval: 'Forme allongée et élégante',
  almond: 'En pointe arrondie comme une amande',
  stiletto: 'Très pointu et dramatique',
  coffin: 'Rectangulaire avec bout plat',
};

// Composant qui affiche les options de formes d'ongles
const NailShapeSelector: React.FC = () => {
  const { nailShape, setNailShape } = useApp();
  
  const handleShapeChange = (value: string) => {
    setNailShape(value as NailShape);
  };
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Forme d'ongles</h3>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-3"
      >
        {(Object.keys(shapeIcons) as NailShape[]).map((shape) => {
          const IconComponent = shapeIcons[shape];
          const isSelected = nailShape === shape;
          
          return (
            <motion.div 
              key={shape}
              onClick={() => handleShapeChange(shape)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-center p-3 rounded-xl cursor-pointer border-2 transition-all ${
                isSelected 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-transparent hover:border-primary/30 hover:bg-secondary/50'
              }`}
            >
              <div className={`p-3 ${isSelected ? 'scale-110' : ''} transition-transform duration-200`}>
                <IconComponent 
                  className={`w-10 h-10 transition-all duration-300 drop-shadow-md ${
                    isSelected ? '' : 'opacity-80'
                  }`}
                />
              </div>
              <span className="mt-2 text-sm font-medium capitalize">{shape}</span>
              <span className="text-xs text-muted-foreground text-center mt-1">
                {shapeDescriptions[shape]}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default NailShapeSelector;

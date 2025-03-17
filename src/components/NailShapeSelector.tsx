
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { NailShape, NailLength, useApp } from '../context/AppContext';
import { Circle, Square, Triangle, Hexagon, Star, Diamond } from 'lucide-react';

// Map des icônes pour chaque forme d'ongle
const shapeIcons = {
  round: Circle,
  square: Square,
  oval: Circle,
  almond: Triangle,
  stiletto: Diamond,
  coffin: Hexagon,
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
            <div 
              key={shape}
              onClick={() => handleShapeChange(shape)}
              className={`flex flex-col items-center p-3 rounded-xl cursor-pointer border-2 transition-all ${
                isSelected 
                  ? 'border-primary bg-primary/10' 
                  : 'border-transparent hover:border-primary/30'
              }`}
            >
              <div className={`p-3 rounded-full ${isSelected ? 'bg-primary/20' : 'bg-muted'}`}>
                <IconComponent 
                  size={24} 
                  className={isSelected ? 'text-primary' : 'text-muted-foreground'}
                />
              </div>
              <span className="mt-2 text-sm font-medium capitalize">{shape}</span>
              <span className="text-xs text-muted-foreground text-center mt-1">
                {shapeDescriptions[shape]}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default NailShapeSelector;

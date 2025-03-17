
import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Check } from 'lucide-react';

// Palette de couleurs pour les ongles
const colorPalette = [
  // Roses et rouges
  '#F2B8C6', '#F8C3CD', '#FEDFE1', '#FF0000', '#E16B8C', '#8E354A',
  // Bleus
  '#93D6F4', '#58B2DC', '#2EA9DF', '#0089A7', '#1E88E5', '#0D47A1',
  // Verts
  '#A8D8B9', '#66BAB7', '#00896C', '#3AA974', '#006442', '#1B5E20',
  // Jaunes et oranges
  '#FFD700', '#FFC107', '#FB8C00', '#F57C00', '#FF5722', '#E64A19',
  // Violets et mauves
  '#D8BFD8', '#DDA0DD', '#BA68C8', '#9C27B0', '#6A1B9A', '#4A148C',
  // Neutres
  '#F5F5F5', '#E0E0E0', '#9E9E9E', '#616161', '#263238', '#000000',
];

const NailColorSelector: React.FC = () => {
  const { nailColor, setNailColor } = useApp();
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Couleur</h3>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-6 gap-2"
      >
        {colorPalette.map((color) => {
          const isSelected = nailColor === color;
          
          return (
            <button
              key={color}
              onClick={() => setNailColor(color)}
              className={`w-full aspect-square rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected ? 'border-gray-800 scale-110' : 'border-transparent hover:border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select ${color} color`}
            >
              {isSelected && <Check size={16} className={color === '#FFFFFF' || color === '#F5F5F5' || color === '#E0E0E0' ? 'text-black' : 'text-white'} />}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default NailColorSelector;

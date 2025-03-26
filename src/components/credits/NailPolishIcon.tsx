
import React from 'react';
import { motion } from 'framer-motion';

interface NailPolishIconProps {
  className?: string;
  animate?: boolean;
}

const NailPolishIcon: React.FC<NailPolishIconProps> = ({ 
  className = "", 
  animate = false 
}) => {
  return (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={animate ? { rotate: 0 } : undefined}
      animate={animate ? { 
        rotate: [0, -10, 0, 10, 0],
        y: [0, -2, 0]
      } : undefined}
      transition={animate ? { 
        duration: 1.5, 
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 3
      } : undefined}
    >
      {/* Bouteille de vernis */}
      <path d="M19.5 16.5V10A1.5 1.5 0 0 0 18 8.5h-3.5V10c0 .3-.2.5-.5.5s-.5-.2-.5-.5V8.5H10A1.5 1.5 0 0 0 8.5 10v6.5c0 1.5-.6 3-2.1 3.8L5 21h14l-1.4-.7c-1.5-.8-2.1-2.3-2.1-3.8Z" fill="url(#nail-polish-gradient)" />
      
      {/* Bouchon */}
      <path d="M11 8.5V3c0-.3.2-.5.5-.5h1c.3 0 .5.2.5.5v5.5" fill="none" />
      
      {/* Ligne du bouchon */}
      <path d="M11 6h2" />
      
      {/* Gouttes */}
      <motion.path 
        d="M14 12a1 1 0 0 1 2 0v1a1 1 0 0 1-2 0v-1z"
        fill="currentColor"
        opacity="0.8"
        animate={animate ? {
          y: [0, 15, 30],
          opacity: [0.8, 0.6, 0],
          scale: [1, 0.8, 0.6]
        } : undefined}
        transition={animate ? {
          duration: 2,
          repeat: Infinity,
          repeatDelay: 4,
          delay: 1
        } : undefined}
      />
      
      <motion.path 
        d="M16 14a1 1 0 0 1 2 0v1a1 1 0 0 1-2 0v-1z"
        fill="currentColor"
        opacity="0.8"
        animate={animate ? {
          y: [0, 15, 30],
          opacity: [0.8, 0.6, 0],
          scale: [1, 0.8, 0.6]
        } : undefined}
        transition={animate ? {
          duration: 2,
          repeat: Infinity,
          repeatDelay: 4,
          delay: 0.5
        } : undefined}
      />
      
      <defs>
        <linearGradient id="nail-polish-gradient" x1="5" y1="8.5" x2="19" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D6BCFA" />
          <stop offset="1" stopColor="#9b87f5" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

export default NailPolishIcon;

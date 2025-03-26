
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
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={animate ? { rotate: 0 } : undefined}
      animate={animate ? { 
        rotate: [0, -5, 0, 5, 0],
        y: [0, -1, 0]
      } : undefined}
      transition={animate ? { 
        duration: 1.5, 
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 2
      } : undefined}
    >
      {/* Bouteille de vernis principale */}
      <motion.path 
        d="M14.5 21.5h-5c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h5c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2z" 
        fill="url(#nail-polish-gradient)" 
        strokeWidth="1.2"
      />
      
      {/* Bouchon du vernis */}
      <path d="M14 9.5v-4c0-.83-.67-1.5-1.5-1.5h-1c-.83 0-1.5.67-1.5 1.5v4" fill="#f5f5f5" stroke="none" />
      <path d="M14 9.5v-4c0-.83-.67-1.5-1.5-1.5h-1c-.83 0-1.5.67-1.5 1.5v4" strokeWidth="1.2" />
      
      {/* Reflet sur la bouteille */}
      <path d="M10 11l-1 8" strokeWidth="0.8" stroke="white" opacity="0.6" />
      
      {/* Pinceau du vernis */}
      <motion.path 
        d="M11.5 9.5v-3"
        strokeWidth="2.5"
        stroke="currentColor"
        strokeLinecap="round"
        opacity="0.7"
        animate={animate ? {
          y: [0, -0.5, 0],
          opacity: [0.7, 0.9, 0.7]
        } : undefined}
        transition={animate ? {
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1
        } : undefined}
      />
      
      {/* Gouttes de vernis */}
      <motion.circle 
        cx="11.5" 
        cy="13" 
        r="0.8" 
        fill="currentColor"
        opacity="0.9"
        animate={animate ? {
          y: [0, 10],
          opacity: [0.9, 0],
          scale: [1, 0.7]
        } : undefined}
        transition={animate ? {
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 2.5
        } : undefined}
      />
      
      <motion.circle 
        cx="12.5" 
        cy="11" 
        r="0.6" 
        fill="currentColor"
        opacity="0.8"
        animate={animate ? {
          y: [0, 8],
          opacity: [0.8, 0],
          scale: [1, 0.6]
        } : undefined}
        transition={animate ? {
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: 3
        } : undefined}
      />
      
      {/* Gradient pour la couleur du vernis */}
      <defs>
        <linearGradient id="nail-polish-gradient" x1="9.5" y1="9.5" x2="16.5" y2="21.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E9C2FF" />
          <stop offset="0.5" stopColor="#C59BFF" />
          <stop offset="1" stopColor="#9B87F5" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

export default NailPolishIcon;

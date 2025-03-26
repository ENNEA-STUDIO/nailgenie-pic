
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
        rotate: [0, -8, 0, 8, 0],
        y: [0, -1.5, 0]
      } : undefined}
      transition={animate ? { 
        duration: 1.8, 
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 2.5
      } : undefined}
    >
      {/* Bouteille de vernis principale avec une forme plus élégante */}
      <motion.path 
        d="M19.2 16.8V9.8c0-1-.8-1.8-1.8-1.8h-3.2V9c0 .3-.2.5-.5.5s-.5-.2-.5-.5V8h-3.2c-1 0-1.8.8-1.8 1.8v7c0 1.5-.6 3-2 3.8L5 21.5h14l-1.5-.9c-1.4-.8-2-2.3-2-3.8Z" 
        fill="url(#nail-polish-gradient)" 
        strokeWidth="1"
      />
      
      {/* Bouchon avec une forme plus élégante */}
      <path d="M11 8V3c0-.3.2-.5.5-.5h1c.3 0 .5.2.5.5v5" fill="#f5f5f5" stroke="none" />
      <path d="M11 8V3c0-.3.2-.5.5-.5h1c.3 0 .5.2.5.5v5" strokeWidth="1" />
      
      {/* Reflet décoratif sur la bouteille */}
      <path d="M16 11l1 8" strokeWidth="0.8" stroke="white" opacity="0.6" />
      
      {/* Gouttes améliorées */}
      <motion.path 
        d="M15 12c0-.6.4-1 1-1s1 .4 1 1v1c0 .6-.4 1-1 1s-1-.4-1-1v-1z"
        fill="currentColor"
        opacity="0.9"
        animate={animate ? {
          y: [0, 15, 30],
          opacity: [0.9, 0.7, 0],
          scale: [1, 0.9, 0.7]
        } : undefined}
        transition={animate ? {
          duration: 2.2,
          repeat: Infinity,
          repeatDelay: 3.5,
          delay: 1
        } : undefined}
      />
      
      <motion.path 
        d="M17 14c0-.6.4-1 1-1s1 .4 1 1v1c0 .6-.4 1-1 1s-1-.4-1-1v-1z"
        fill="currentColor"
        opacity="0.9"
        animate={animate ? {
          y: [0, 15, 30],
          opacity: [0.9, 0.7, 0],
          scale: [1, 0.9, 0.7]
        } : undefined}
        transition={animate ? {
          duration: 2.2,
          repeat: Infinity,
          repeatDelay: 3.5,
          delay: 0.5
        } : undefined}
      />
      
      {/* Gradient de couleur plus vibrant */}
      <defs>
        <linearGradient id="nail-polish-gradient" x1="5" y1="8" x2="19" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E9C2FF" />
          <stop offset="0.5" stopColor="#C59BFF" />
          <stop offset="1" stopColor="#9B87F5" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

export default NailPolishIcon;

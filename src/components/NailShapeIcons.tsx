
import React from 'react';

export const RoundNailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="roundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e6b980" />
        <stop offset="100%" stopColor="#eacda3" />
      </linearGradient>
    </defs>
    <path 
      d="M5 50 L5 20 Q5 5 20 5 Q35 5 35 20 L35 50 Z" 
      fill="url(#roundGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M10 47 L10 22 Q10 10 20 10 Q30 10 30 22 L30 47 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
  </svg>
);

export const SquareNailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="squareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#accbee" />
        <stop offset="100%" stopColor="#e7f0fd" />
      </linearGradient>
    </defs>
    <path 
      d="M5 50 L5 15 Q5 5 10 5 L30 5 Q35 5 35 15 L35 50 Z" 
      fill="url(#squareGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M10 45 L10 17 Q10 10 13 10 L27 10 Q30 10 30 17 L30 45 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
  </svg>
);

export const OvalNailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ovalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d299c2" />
        <stop offset="100%" stopColor="#fef9d7" />
      </linearGradient>
    </defs>
    <path 
      d="M5 50 L5 25 Q5 5 20 5 Q35 5 35 25 L35 50 Z" 
      fill="url(#ovalGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M10 45 L10 27 Q10 10 20 10 Q30 10 30 27 L30 45 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
  </svg>
);

export const AlmondNailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="almondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFC3A0" />
        <stop offset="100%" stopColor="#FFAFBD" />
      </linearGradient>
    </defs>
    <path 
      d="M5 50 L5 25 Q5 5 20 5 Q35 5 35 25 L35 50 Q35 40 20 30 Q5 40 5 50 Z" 
      fill="url(#almondGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M10 45 L10 27 Q10 10 20 10 Q30 10 30 27 L30 45 Q30 38 20 30 Q10 38 10 45 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
  </svg>
);

export const StilettoNailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="stilettoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#FEC6A1" />
      </linearGradient>
    </defs>
    <path 
      d="M5 50 L5 20 Q5 5 20 5 Q35 5 35 20 L35 50 Q35 30 20 10 Q5 30 5 50 Z" 
      fill="url(#stilettoGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M10 45 L10 22 Q10 10 20 10 Q30 10 30 22 L30 45 Q30 32 20 17 Q10 32 10 45 Z" 
      fill="white" 
      fillOpacity="0.3" 
    />
    <path 
      d="M20 10 L20 30" 
      stroke="white" 
      strokeWidth="0.5" 
      strokeOpacity="0.5"
    />
  </svg>
);

export const CoffinNailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="coffinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9b87f5" />
        <stop offset="100%" stopColor="#D6BCFA" />
      </linearGradient>
    </defs>
    <path 
      d="M5 50 L5 20 Q5 5 15 5 L25 5 Q35 5 35 20 L35 50 L30 45 L10 45 L5 50 Z" 
      fill="url(#coffinGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M10 45 L10 22 Q10 10 16 10 L24 10 Q30 10 30 22 L30 45 L27 42 L13 42 L10 45 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
    <line x1="10" y1="45" x2="30" y2="45" stroke="white" strokeOpacity="0.5" strokeWidth="0.5" />
  </svg>
);

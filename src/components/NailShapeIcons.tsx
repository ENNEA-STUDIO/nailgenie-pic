
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
      <filter id="stilettoGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <path 
      d="M5 50 L5 20 Q5 5 20 5 Q35 5 35 20 L35 50 Q35 30 20 10 Q5 30 5 50 Z" 
      fill="url(#stilettoGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
      filter="url(#stilettoGlow)"
    />
    <path 
      d="M10 45 L10 22 Q10 10 20 10 Q30 10 30 22 L30 45 Q30 32 20 17 Q10 32 10 45 Z" 
      fill="white" 
      fillOpacity="0.3" 
    />
    <path 
      d="M20 10 L20 40" 
      stroke="white" 
      strokeWidth="0.8" 
      strokeOpacity="0.6"
      strokeDasharray="1 2"
    />
    <circle cx="20" cy="10" r="1.5" fill="white" fillOpacity="0.8" />
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

// New shape icons
export const SquovalNailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="squovalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a8edea" />
        <stop offset="100%" stopColor="#fed6e3" />
      </linearGradient>
    </defs>
    <path 
      d="M5 50 L5 20 Q5 5 12 5 L28 5 Q35 5 35 20 L35 50 Z" 
      fill="url(#squovalGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M10 45 L10 22 Q10 10 15 10 L25 10 Q30 10 30 22 L30 45 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
  </svg>
);

export const BallerinaNailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ballerinaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f6d5f7" />
        <stop offset="100%" stopColor="#fbe9d7" />
      </linearGradient>
    </defs>
    <path 
      d="M5 50 L5 20 Q5 5 12 5 L28 5 Q35 5 35 20 L35 50 L30 42 L10 42 L5 50 Z" 
      fill="url(#ballerinaGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M10 42 L10 22 Q10 10 16 10 L24 10 Q30 10 30 22 L30 42 L27 38 L13 38 L10 42 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
  </svg>
);

export const DuckNailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="duckGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FAD961" />
        <stop offset="100%" stopColor="#F76B1C" />
      </linearGradient>
    </defs>
    <path 
      d="M5 50 L5 20 Q5 5 15 5 L25 5 Q35 5 35 20 L35 50 L40 40 L0 40 L5 50 Z" 
      fill="url(#duckGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M10 45 L10 22 Q10 10 16 10 L24 10 Q30 10 30 22 L30 45 L33 37 L7 37 L10 45 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
  </svg>
);

export const LipsNailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lipsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF5E62" />
        <stop offset="100%" stopColor="#FF9966" />
      </linearGradient>
    </defs>
    <path 
      d="M5 50 L5 20 Q5 5 20 5 Q35 5 35 20 L35 50 Q30 45 25 48 Q20 50 15 48 Q10 45 5 50 Z" 
      fill="url(#lipsGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M10 45 L10 22 Q10 10 20 10 Q30 10 30 22 L30 45 Q26 41 20 43 Q14 41 10 45 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
  </svg>
);

export const EdgeNailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8EC5FC" />
        <stop offset="100%" stopColor="#E0C3FC" />
      </linearGradient>
    </defs>
    <path 
      d="M5 50 L5 20 Q5 5 20 5 Q35 5 35 20 L35 50 L28 40 L12 40 L5 50 Z" 
      fill="url(#edgeGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M10 45 L10 22 Q10 10 20 10 Q30 10 30 22 L30 45 L25 37 L15 37 L10 45 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
  </svg>
);

export const ArrowheadNailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="arrowheadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A9C9FF" />
        <stop offset="100%" stopColor="#FFBBEC" />
      </linearGradient>
    </defs>
    <path 
      d="M5 50 L5 20 Q5 5 20 5 Q35 5 35 20 L35 50 Q35 35 20 20 Q5 35 5 50 Z" 
      fill="url(#arrowheadGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M10 45 L10 22 Q10 10 20 10 Q30 10 30 22 L30 45 Q30 35 20 25 Q10 35 10 45 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
  </svg>
);

export const FlareNailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="flareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#84FAB0" />
        <stop offset="100%" stopColor="#8FD3F4" />
      </linearGradient>
    </defs>
    <path 
      d="M5 50 L5 20 Q5 5 20 5 Q35 5 35 20 L35 50 L45 40 L-5 40 L5 50 Z" 
      fill="url(#flareGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M10 45 L10 22 Q10 10 20 10 Q30 10 30 22 L30 45 L37 37 L3 37 L10 45 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
  </svg>
);

export const LipstickNailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lipstickGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5576C" />
        <stop offset="100%" stopColor="#F093FB" />
      </linearGradient>
    </defs>
    <path 
      d="M5 50 L5 20 Q5 5 20 5 Q35 5 35 20 L35 50 L10 40 L5 50 Z" 
      fill="url(#lipstickGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M10 45 L10 22 Q10 10 20 10 Q30 10 30 22 L30 45 L15 37 L10 45 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
  </svg>
);


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

// Updated shape icons based on detailed descriptions
export const SquovalNailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 60" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="squovalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a8edea" />
        <stop offset="100%" stopColor="#fed6e3" />
      </linearGradient>
    </defs>
    <path 
      d="M5 50 L5 20 Q5 5 12 5 L28 5 Q35 5 35 20 L35 50 Q35 45 30 40 L10 40 Q5 45 5 50 Z" 
      fill="url(#squovalGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M10 45 L10 22 Q10 10 15 10 L25 10 Q30 10 30 22 L30 45 Q30 42 25 38 L15 38 Q10 42 10 45 Z" 
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
      d="M8 50 L8 15 Q8 5 15 5 L25 5 Q32 5 32 15 L32 50 L28 42 L12 42 L8 50 Z" 
      fill="url(#ballerinaGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M12 45 L12 18 Q12 10 17 10 L23 10 Q28 10 28 18 L28 45 L25 38 L15 38 L12 45 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
    <line x1="12" y1="42" x2="28" y2="42" stroke="white" strokeOpacity="0.5" strokeWidth="0.5" />
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
      d="M10 50 L10 15 Q10 5 20 5 Q30 5 30 15 L30 50 L40 40 L0 40 L10 50 Z" 
      fill="url(#duckGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M13 45 L13 18 Q13 10 20 10 Q27 10 27 18 L27 45 L35 37 L5 37 L13 45 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
    <line x1="0" y1="40" x2="40" y2="40" stroke="white" strokeOpacity="0.3" strokeWidth="0.5" />
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
      d="M10 50 L10 20 Q10 5 20 5 Q30 5 30 20 L30 50 L45 38 L-5 38 L10 50 Z" 
      fill="url(#lipsGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M13 45 L13 22 Q13 10 20 10 Q27 10 27 22 L27 45 L38 35 L2 35 L13 45 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
    <path d="M5 38 Q20 45 35 38" stroke="white" strokeOpacity="0.3" strokeWidth="0.8" fill="none" />
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
      d="M8 50 L8 15 Q8 5 20 5 Q32 5 32 15 L32 50 L25 40 L20 30 L15 40 L8 50 Z" 
      fill="url(#edgeGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M12 45 L12 18 Q12 10 20 10 Q28 10 28 18 L28 45 L22 37 L20 32 L18 37 L12 45 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
    <path d="M20 10 L20 32" stroke="white" strokeOpacity="0.5" strokeWidth="0.8" />
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
      d="M8 50 L8 25 Q8 15 20 5 Q32 15 32 25 L32 50 Z" 
      fill="url(#arrowheadGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M12 45 L12 27 Q12 20 20 12 Q28 20 28 27 L28 45 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
    <path d="M20 12 L20 30" stroke="white" strokeOpacity="0.4" strokeWidth="0.8" />
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
      d="M10 50 L10 15 Q10 5 20 5 Q30 5 30 15 L30 50 L50 35 L-10 35 L10 50 Z" 
      fill="url(#flareGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M14 45 L14 18 Q14 10 20 10 Q26 10 26 18 L26 45 L40 33 L0 33 L14 45 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
    <line x1="-5" y1="35" x2="45" y2="35" stroke="white" strokeOpacity="0.3" strokeWidth="0.5" />
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
      d="M8 50 L8 15 Q8 5 15 5 L25 5 Q32 5 32 15 L32 50 L8 35 Z" 
      fill="url(#lipstickGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M12 45 L12 18 Q12 10 16 10 L24 10 Q28 10 28 18 L28 45 L12 33 Z" 
      fill="white" 
      fillOpacity="0.2" 
    />
    <line x1="12" y1="35" x2="28" y2="35" stroke="white" strokeOpacity="0.4" strokeWidth="0.5" transform="rotate(15, 20, 35)" />
  </svg>
);

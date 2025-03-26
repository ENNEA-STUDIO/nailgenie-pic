
import React from 'react';

interface NailPolishIconProps {
  className?: string;
}

const NailPolishIcon: React.FC<NailPolishIconProps> = ({ className = "" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M8 9l1.5 1.5c.5.5 1 .5 1.5 0l1-1c.5-.5 1-.5 1.5 0l1.5 1.5" />
      <path d="M8.5 2a4 4 0 0 0-4 4v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V6a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v6c0 1.5-.6 3-2.1 3.8L9 18" />
      <path d="M5.5 12V6h.01" />
      <path d="M19.5 16.5V10A1.5 1.5 0 0 0 18 8.5h-3.5V10c0 .3-.2.5-.5.5s-.5-.2-.5-.5V8.5H11" />
      <path d="M13 19c0-4 4-5 4-9v-.5" />
      <rect x="4" y="19" width="12" height="3" rx="1" />
    </svg>
  );
};

export default NailPolishIcon;

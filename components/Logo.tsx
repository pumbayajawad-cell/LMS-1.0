import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg" 
    aria-label="Learning Module System Logo"
  >
    <g>
      <circle cx="50" cy="50" r="48" fill="#FAF8E9" stroke="#000000" strokeWidth="4" />
      <path d="M25 80 V25 C45 15, 55 15, 75 25 V80 C55 70, 45 70, 25 80 Z" fill="#34A65F" stroke="#000" strokeWidth="4" strokeLinejoin="round"/>
      <path d="M50 20 V 50 L 60 40 V 20 Z" fill="#FDCB34" stroke="#000" strokeWidth="4" />
      <line x1="50" y1="20" x2="50" y2="80" stroke="#000" strokeWidth="4" />
    </g>
  </svg>
);
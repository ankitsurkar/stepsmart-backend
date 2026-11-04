import React from 'react';

interface StepSmartLogoIconProps {
  className?: string;
}

export function StepSmartLogoIcon({ className = "w-8 h-8 shrink-0" }: StepSmartLogoIconProps) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Top-Left Shell & Cutout Step - Charcoal #141413 */}
      <path 
        d="M 41.6 0.7 L 44.0 0.7 L 46.6 1.6 L 76.7 20.1 L 70.0 26.8 L 45.5 11.9 L 43.4 10.9 L 41.7 11.0 L 11.5 29.4 L 10.7 31.5 L 10.7 51.0 L 13.4 48.4 L 22.0 39.4 L 23.0 39.0 L 25.3 39.5 L 28.3 42.7 L 28.8 44.0 L 28.3 46.0 L 6.7 67.6 L 4.1 68.3 L 2.6 67.4 L 1.6 66.0 L 1.4 27.9 L 2.5 24.4 L 6.0 21.4 L 38.9 1.6 L 41.6 0.7 Z" 
        fill="#141413" 
      />
      {/* Middle Step Bar - Charcoal #141413 */}
      <path 
        d="M 45.7 34.2 L 48.0 34.7 L 51.2 38.1 L 51.8 39.1 L 51.2 41.4 L 15.3 78.5 L 14.0 79.0 L 11.7 78.4 L 8.5 75.1 L 8.1 74.1 L 8.5 72.1 L 43.8 35.5 L 45.7 34.2 Z" 
        fill="#141413" 
      />
      {/* Bottom-Right Shell & Ascending Arrow - Signature Warm Amber #D97706 */}
      <path 
        d="M 97.7 10.1 L 98.6 10.2 L 99.0 11.2 L 96.9 25.8 L 95.5 26.0 L 92.6 24.1 L 36.3 82.5 L 44.4 87.4 L 46.7 87.1 L 76.8 67.9 L 78.2 65.4 L 78.2 46.3 L 87.0 37.2 L 87.2 58.8 L 87.0 69.2 L 86.1 71.9 L 84.8 73.6 L 47.6 97.4 L 45.1 97.7 L 43.0 97.2 L 26.2 86.9 L 24.7 85.1 L 24.5 82.0 L 85.8 17.8 L 86.2 17.2 L 83.7 14.5 L 84.2 13.2 L 97.7 10.1 Z" 
        fill="#D97706" 
      />
    </svg>
  );
}

export default StepSmartLogoIcon;

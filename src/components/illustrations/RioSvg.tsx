import React from 'react';

interface SvgProps {
  accentColor: string;
}

export const RioSvg: React.FC<SvgProps> = ({ accentColor }) => {
  return (
    <svg 
      viewBox="0 0 400 280" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full text-neutral-800 transition-colors duration-500"
    >
      {/* Background paper grid lines (subtle) */}
      <line x1="20" y1="20" x2="20" y2="260" stroke="#F1EFEA" strokeWidth="1" strokeDasharray="2 4" />
      <line x1="380" y1="20" x2="380" y2="260" stroke="#F1EFEA" strokeWidth="1" strokeDasharray="2 4" />
      <line x1="20" y1="20" x2="380" y2="20" stroke="#F1EFEA" strokeWidth="1" strokeDasharray="2 4" />
      <line x1="20" y1="260" x2="380" y2="260" stroke="#F1EFEA" strokeWidth="1" strokeDasharray="2 4" />

      {/* Tropical Green Glowing Sun (Emerald sunset accent) */}
      <circle cx="280" cy="95" r="32" fill={accentColor} fillOpacity="0.12" className="transition-all duration-700" />
      <circle cx="280" cy="95" r="32" stroke={accentColor} strokeWidth="1" strokeDasharray="5 3" className="transition-all duration-700" />

      {/* Sunbeams/beams behind Christ the Redeemer Statue */}
      <g stroke={accentColor} strokeWidth="0.6" strokeOpacity="0.25" strokeDasharray="2 3">
        <line x1="130" y1="81" x2="130" y2="60" />
        <line x1="130" y1="81" x2="110" y2="72" />
        <line x1="130" y1="81" x2="150" y2="72" />
        <line x1="130" y1="81" x2="116" y2="64" />
        <line x1="130" y1="81" x2="144" y2="64" />
      </g>

      {/* Mountains curve (Sugarloaf and Corcovado silhouette in background) */}
      <g stroke="currentColor" strokeWidth="1.2" fill="#FBFBF9">
        {/* Left mountain (Corcovado shape, tall and steep) */}
        <path d="M 20 230 C 50 190, 80 80, 130 95 C 160 105, 175 190, 200 230" />
        
        {/* Christ the Redeemer statue (Iconic Rio landmark on peak) */}
        <g transform="translate(130, 80)" stroke="currentColor" strokeWidth="0.9" fill="none">
          {/* Pedestal */}
          <rect x="-3" y="10" width="6" height="5" fill="#FBFBF9" strokeWidth="0.8" />
          {/* Body/Robe */}
          <path d="M -1.5 10 L -1 0 L 1 0 L 1.5 10 Z" fill="#FBFBF9" />
          {/* Head */}
          <circle cx="0" cy="-1.5" r="1.2" fill="#FBFBF9" strokeWidth="0.7" />
          {/* Outstretched Arms (Cross silhouette) */}
          <path d="M -7 1.5 L 7 1.5" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* Right mountain (Sugarloaf dome shape, steep granite dome) */}
        <path d="M 175 230 C 205 160, 240 110, 290 120 C 330 130, 355 190, 380 230" />
      </g>

      {/* Cable Car between peaks */}
      <g>
        <line x1="130" y1="95" x2="290" y2="120" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1 3" strokeOpacity="0.6" />
        
        <g transform="translate(205, 103)" stroke="currentColor" strokeWidth="1" fill="#FBFBF9">
          <path d="M 5 0 L 5 4 L 3 6" />
          <rect x="-3" y="6" width="16" height="12" rx="1.5" />
          <rect x="-1" y="8" width="5" height="4" strokeWidth="0.6" />
          <rect x="6" y="8" width="5" height="4" strokeWidth="0.6" />
        </g>
      </g>

      {/* Tiny Tropical Birds flying in the sky */}
      <g stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.4" fill="none">
        <path d="M 50 60 Q 53 56, 56 60 Q 59 56, 62 60" />
        <path d="M 72 72 Q 75 68, 78 72 Q 81 68, 84 72" />
        <path d="M 230 45 Q 233 41, 236 45 Q 239 41, 242 45" />
      </g>

      {/* Palm Leaves hanging from top-left corner */}
      <g transform="translate(30, -10)" stroke="currentColor" strokeWidth="1" fill="none">
        <path d="M 0 0 C 15 25, 45 40, 80 35" strokeWidth="1.4" />
        <path d="M 20 12 Q 25 28, 12 36" />
        <path d="M 30 19 Q 38 35, 26 44" />
        <path d="M 40 24 Q 52 40, 42 50" />
        <path d="M 50 28 Q 66 42, 58 54" />
        <path d="M 60 31 Q 78 42, 74 54" />

        <path d="M 0 0 C 25 15, 60 20, 95 12" strokeWidth="1.2" />
        <path d="M 25 7 Q 35 22, 28 29" />
        <path d="M 40 11 Q 52 26, 46 33" />
        <path d="M 55 13 Q 70 26, 65 33" />
        <path d="M 70 14 Q 86 24, 82 31" />
      </g>

      {/* Copacabana Wave Lines / Beach line (Wave pattern border) */}
      <g stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4">
        <path d="M 20 220 Q 200 245, 380 220" strokeWidth="1.2" strokeOpacity="0.8" />
        
        <path d="M 20 232 Q 35 224, 50 232 Q 65 240, 80 232 Q 95 224, 110 232 Q 125 240, 140 232 Q 155 224, 170 232 Q 185 240, 200 232 Q 215 224, 230 232 Q 245 240, 260 232 Q 275 224, 290 232 Q 305 240, 320 232 Q 335 224, 350 232 Q 365 240, 380 232" />
        <path d="M 20 242 Q 35 234, 50 242 Q 65 250, 80 242 Q 95 234, 110 242 Q 125 250, 140 242 Q 155 234, 170 242 Q 185 250, 200 242 Q 215 234, 230 242 Q 245 250, 260 242 Q 275 234, 290 242 Q 305 250, 320 242 Q 335 234, 350 242 Q 365 250, 380 242" />
      </g>

      {/* Beach Parasol / Umbrella (Right foreground) */}
      <g transform="translate(320, 200)" stroke="currentColor" strokeWidth="1" fill="none">
        <line x1="0" y1="10" x2="-8" y2="55" strokeWidth="1.2" />
        <path d="M -22 15 Q 0 -5, 14 18 Z" fill="#FBFBF9" strokeWidth="1.2" />
        <path d="M -4 4 Q -7 22, -8 55" strokeWidth="0.8" strokeOpacity="0.4" />
        <path d="M -22 15 Q -6 12, 14 18" strokeWidth="0.8" strokeOpacity="0.5" />
      </g>

      {/* A Football (Left foreground) */}
      <g transform="translate(60, 200)" stroke="currentColor" strokeWidth="1" fill="none">
        <circle cx="10" cy="10" r="10" fill="#FBFBF9" strokeWidth="1.2" />
        <polygon points="10,6 6,9 7,13 13,13 14,9" fill="currentColor" fillOpacity="0.1" strokeWidth="0.8" />
        <line x1="10" y1="6" x2="10" y2="0" strokeWidth="0.8" />
        <line x1="6" y1="9" x2="1" y2="7" strokeWidth="0.8" />
        <line x1="7" y1="13" x2="3" y2="17" strokeWidth="0.8" />
        <line x1="13" y1="13" x2="17" y2="17" strokeWidth="0.8" />
        <line x1="14" y1="9" x2="19" y2="7" strokeWidth="0.8" />
      </g>

      {/* Ground beach lines */}
      <line x1="20" y1="255" x2="380" y2="255" stroke="currentColor" strokeWidth="1.2" />
      <line x1="40" y1="260" x2="360" y2="260" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
    </svg>
  );
};

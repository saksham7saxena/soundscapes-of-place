import React from 'react';

interface SvgProps {
  accentColor: string;
}

export const ParisSvg: React.FC<SvgProps> = ({ accentColor }) => {
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

      {/* Eiffel Tower Searchlight Rays (Accent Color - Sweeping across the sky) */}
      <g stroke={accentColor} strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="3 5" className="transition-colors duration-500">
        <path d="M 285 42 L 380 10" />
        <path d="M 285 42 L 380 25" />
        <path d="M 285 42 L 180 15" />
      </g>

      {/* Distant Eiffel Tower Outline */}
      <g transform="translate(260, 40)" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.45">
        <path d="M 10 160 Q 25 145, 40 160" />
        <path d="M -5 160 L 15 110 L 35 110 L 55 160" strokeWidth="1.2" />
        <line x1="12" y1="110" x2="38" y2="110" strokeWidth="1.5" />
        <path d="M 15 110 L 22 55 L 28 55 L 35 110" />
        <line x1="20" y1="55" x2="30" y2="55" strokeWidth="1.5" />
        <path d="M 22 55 L 25 10 L 28 55" />
        <line x1="25" y1="10" x2="25" y2="2" />
        
        {/* Horizontal structural details */}
        <line x1="10" y1="130" x2="40" y2="130" />
        <line x1="13" y1="120" x2="37" y2="120" />
        <line x1="18" y1="80" x2="32" y2="80" />
        
        {/* Lattice cross braces */}
        <line x1="15" y1="110" x2="35" y2="130" />
        <line x1="35" y1="110" x2="15" y2="130" />
        <line x1="15" y1="130" x2="38" y2="160" />
        <line x1="35" y1="130" x2="12" y2="160" />
      </g>

      {/* Birds flying near the tower (Subtle background details) */}
      <g stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.4">
        <path d="M 210 50 Q 214 47, 218 50 Q 222 47, 226 50" />
        <path d="M 230 62 Q 233 59, 236 62 Q 239 59, 242 62" />
      </g>

      {/* River Seine Curves */}
      <path d="M 20 185 C 100 175, 200 195, 380 185" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.25" />
      <path d="M 20 192 C 120 183, 220 203, 380 192" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.15" />
      <path d="M 20 199 C 90 190, 240 210, 380 199" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.1" />

      {/* Classic Parisian Lamppost (Left Side) */}
      <g transform="translate(90, 50)">
        {/* Glowing Lamp Accent Light */}
        <circle cx="0" cy="20" r="28" fill={accentColor} fillOpacity="0.1" className="transition-all duration-700" />
        <circle cx="0" cy="20" r="16" fill={accentColor} fillOpacity="0.15" className="transition-all duration-700" />
        <circle cx="0" cy="20" r="4" fill="currentColor" />
        
        {/* Dashed light beams radiating from lantern */}
        <g stroke={accentColor} strokeWidth="0.6" strokeOpacity="0.35" strokeDasharray="1.5 2.5">
          <line x1="-12" y1="32" x2="-25" y2="45" />
          <line x1="12" y1="32" x2="25" y2="45" />
          <line x1="0" y1="36" x2="0" y2="55" />
        </g>
        
        {/* Post structure */}
        <line x1="0" y1="20" x2="0" y2="195" stroke="currentColor" strokeWidth="1.6" />
        <rect x="-6" y="180" width="12" height="15" rx="1" fill="#FBFBF9" stroke="currentColor" strokeWidth="1.5" />
        <rect x="-4" y="140" width="8" height="40" stroke="currentColor" strokeWidth="1.2" />
        
        {/* Lamp Head */}
        <path d="M -8 10 L 8 10 L 12 -5 L -12 -5 Z" fill="#FBFBF9" stroke="currentColor" strokeWidth="1.2" />
        <path d="M -12 -5 Q 0 -18, 12 -5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 0 -10 L 0 -24" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="0" cy="-24" r="2.5" fill="currentColor" />
        <line x1="-8" y1="10" x2="-12" y2="-5" stroke="currentColor" strokeWidth="0.8" />
        <line x1="8" y1="10" x2="12" y2="-5" stroke="currentColor" strokeWidth="0.8" />
        <line x1="0" y1="10" x2="0" y2="-5" stroke="currentColor" strokeWidth="0.8" />
        <path d="M -18 25 L 18 25" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="-18" cy="25" r="2" fill="currentColor" />
        <circle cx="18" cy="25" r="2" fill="currentColor" />
        <path d="M -12 25 Q -4 25, 0 32" stroke="currentColor" strokeWidth="0.8" />
        <path d="M 12 25 Q 4 25, 0 32" stroke="currentColor" strokeWidth="0.8" />
      </g>

      {/* Bicycle Leaning on Lamppost */}
      <g transform="translate(70, 175)" stroke="currentColor" strokeWidth="1" fill="none">
        <circle cx="10" cy="50" r="18" strokeWidth="1.2" fill="#FBFBF9" />
        <circle cx="10" cy="50" r="3" fill="currentColor" />
        <circle cx="58" cy="50" r="18" strokeWidth="1.2" fill="#FBFBF9" />
        <circle cx="58" cy="50" r="3" fill="currentColor" />
        <line x1="10" y1="32" x2="10" y2="68" strokeOpacity="0.4" />
        <line x1="-8" y1="50" x2="28" y2="50" strokeOpacity="0.4" />
        <line x1="58" y1="32" x2="58" y2="68" strokeOpacity="0.4" />
        <line x1="40" y1="50" x2="76" y2="50" strokeOpacity="0.4" />
        
        <polygon points="10,50 32,50 46,25 22,25" />
        <line x1="32" y1="50" x2="22" y2="25" />
        <line x1="32" y1="50" x2="20" y2="18" strokeWidth="1.2" />
        <path d="M 15 18 L 25 18" strokeWidth="1.6" strokeLinecap="round" />
        
        <line x1="58" y1="50" x2="48" y2="20" strokeWidth="1.2" />
        <path d="M 44 20 Q 48 16, 52 20" strokeWidth="1.6" strokeLinecap="round" />
        
        <path d="M 10 50 L 5 30 L 20 30 L 22 50" strokeOpacity="0.7" />
        
        <g transform="translate(42, 16)" stroke="currentColor" strokeWidth="0.8" fill="#FBFBF9">
          <rect x="0" y="0" width="5" height="12" rx="1.5" transform="rotate(25)" />
          <line x1="2" y1="4" x2="5" y2="2" />
          <line x1="4" y1="8" x2="7" y2="6" />
        </g>
      </g>

      {/* Parisian Cafe Chair (Right Side - detailed weave patterns) */}
      <g transform="translate(230, 175)" stroke="currentColor" strokeWidth="1" fill="none">
        <path d="M 15 70 L 15 25 Q 15 10, 32 10 Q 49 10, 49 25 L 49 70" strokeWidth="1.2" />
        
        {/* Detailed cross-hatching weave on the backrest */}
        <g strokeOpacity="0.35" strokeWidth="0.8">
          <path d="M 15 20 L 49 45 M 15 30 L 43 65 M 22 10 L 49 35" />
          <path d="M 49 20 L 15 45 M 49 30 L 21 65 M 42 10 L 15 35" />
        </g>
        
        <path d="M 20 20 Q 32 28, 44 20" strokeOpacity="0.5" />
        <path d="M 18 35 Q 32 43, 46 35" strokeOpacity="0.5" />
        
        {/* Woven seat border */}
        <path d="M 12 50 L 52 50" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="12" y1="52" x2="52" y2="52" strokeOpacity="0.4" strokeWidth="0.8" />
        
        {/* Bent metal legs */}
        <path d="M 18 50 L 10 90" strokeWidth="1.2" />
        <path d="M 46 50 L 54 90" strokeWidth="1.2" />
        <path d="M 23 50 L 18 90" strokeWidth="0.8" strokeOpacity="0.7" />
        <path d="M 41 50 L 46 90" strokeWidth="0.8" strokeOpacity="0.7" />
        
        <path d="M 14 70 Q 32 78, 50 70" strokeOpacity="0.6" />
        <path d="M 12 80 L 52 80" strokeOpacity="0.5" />
      </g>

      {/* Parisian Street Sign Post ("RUE DE LA SEINE") */}
      <g transform="translate(325, 130)" stroke="currentColor" strokeWidth="0.9" fill="none">
        <line x1="0" y1="0" x2="0" y2="115" strokeWidth="1.2" />
        <rect x="-18" y="10" width="36" height="20" rx="1.5" fill="#FBFBF9" strokeWidth="1.2" />
        <rect x="-16" y="12" width="32" height="16" stroke={accentColor} strokeWidth="0.8" strokeOpacity="0.6" className="transition-colors duration-500" />
        <line x1="-10" y1="17" x2="10" y2="17" strokeWidth="0.6" strokeOpacity="0.6" />
        <line x1="-12" y1="22" x2="12" y2="22" strokeWidth="0.8" strokeOpacity="0.8" />
        <rect x="-3" y="110" width="6" height="5" fill="currentColor" />
      </g>

      {/* Ground lines */}
      <line x1="20" y1="265" x2="380" y2="265" stroke="currentColor" strokeWidth="1.2" />
      <line x1="40" y1="269" x2="360" y2="269" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
    </svg>
  );
};

import React from 'react';

interface SvgProps {
  accentColor: string;
}

export const DelhiSvg: React.FC<SvgProps> = ({ accentColor }) => {
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

      {/* Accent Sun - Delhi's Terracotta dust sun */}
      <circle cx="200" cy="95" r="30" fill={accentColor} fillOpacity="0.1" className="transition-all duration-700" />
      <circle cx="200" cy="95" r="30" stroke={accentColor} strokeWidth="0.8" strokeDasharray="3 4" className="transition-all duration-700" />
      
      {/* Radiating Sunbeams (Aesthetic thin dashed lines) */}
      <g stroke={accentColor} strokeWidth="0.6" strokeOpacity="0.3" strokeDasharray="2 3">
        <line x1="200" y1="55" x2="200" y2="35" />
        <line x1="230" y1="95" x2="250" y2="95" />
        <line x1="170" y1="95" x2="150" y2="95" />
        <line x1="221" y1="74" x2="236" y2="59" />
        <line x1="179" y1="74" x2="164" y2="59" />
        <line x1="221" y1="116" x2="236" y2="131" />
        <line x1="179" y1="116" x2="164" y2="131" />
      </g>

      {/* India Gate Silhouette (Detailed center background) */}
      <g stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.22" fill="#FBFBF9" fillOpacity="0.15" transform="translate(145, 65)">
        {/* Foundation base */}
        <rect x="0" y="80" width="110" height="15" rx="1" />
        <rect x="10" y="72" width="90" height="8" />
        
        {/* Main Columns and Arch opening */}
        <path d="M 15 72 L 15 25 L 35 25 L 35 45 Q 55 35, 75 45 L 75 25 L 95 25 L 95 72 Z" strokeWidth="1" />
        
        {/* Cornice moldings */}
        <rect x="10" y="20" width="90" height="5" />
        <rect x="5" y="14" width="100" height="6" />
        
        {/* Stepped dome top */}
        <rect x="15" y="7" width="80" height="7" />
        <path d="M 25 7 L 35 0 L 75 0 L 85 7 Z" />
        
        {/* Interior arch detailed moldings */}
        <path d="M 39 72 L 39 49 Q 55 41, 71 49 L 71 72" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
        <circle cx="55" cy="27" r="3.5" strokeWidth="0.7" />
        
        {/* Vertical flutes on pillars (Fine hatching details) */}
        <line x1="23" y1="26" x2="23" y2="72" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="27" y1="26" x2="27" y2="72" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="83" y1="26" x2="83" y2="72" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="87" y1="26" x2="87" y2="72" strokeWidth="0.5" strokeDasharray="3 3" />
      </g>

      {/* Metro Line Bridge */}
      <path d="M 20 160 L 380 160" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
      <path d="M 20 165 L 380 165" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
      {/* Metro pillars */}
      {Array.from({ length: 9 }).map((_, i) => {
        const x = 40 + i * 40;
        return (
          <g key={`metro-pil-${i}`} stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2">
            <line x1={x} y1="165" x2={x} y2="260" />
            <line x1={x - 4} y1="165" x2={x + 4} y2="165" />
          </g>
        );
      })}
      {/* Distant Metro Train */}
      <rect x="250" y="152" width="60" height="8" rx="2" fill="#FBFBF9" stroke="currentColor" strokeWidth="1" />
      <line x1="270" y1="152" x2="270" y2="160" stroke="currentColor" strokeWidth="0.8" />
      <line x1="290" y1="152" x2="290" y2="160" stroke="currentColor" strokeWidth="0.8" />

      {/* Chai Stall / Market Canopy */}
      <path d="M 260 260 L 260 190 Q 285 180, 310 190 Q 335 180, 360 190 L 360 260" stroke="currentColor" strokeWidth="1.2" />
      <path d="M 260 190 L 360 190" stroke="currentColor" strokeWidth="0.8" />
      {/* Canopy Stripes */}
      <path d="M 285 183 L 285 260" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
      <path d="M 310 190 L 310 260" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
      <path d="M 335 183 L 335 260" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
      
      {/* Chai Kettle and Glasses on table */}
      <rect x="280" y="225" width="50" height="35" fill="#FBFBF9" stroke="currentColor" strokeWidth="1" />
      <path d="M 290 225 L 290 215 Q 295 210, 300 215 L 300 225 M 287 220 L 293 220 M 295 220 L 298 217" stroke="currentColor" strokeWidth="1" />
      <path d="M 295 207 Q 293 203, 295 200 Q 297 197, 294 194" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.6" />
      <path d="M 298 209 Q 296 205, 298 202 Q 300 199, 297 196" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="312" y1="225" x2="310" y2="218" stroke="currentColor" strokeWidth="1" />
      <line x1="316" y1="225" x2="314" y2="218" stroke="currentColor" strokeWidth="1" />
      <line x1="320" y1="225" x2="318" y2="218" stroke="currentColor" strokeWidth="1" />

      {/* Auto Rickshaw Silhouette (Left side) */}
      <g transform="translate(45, 185)">
        <circle cx="20" cy="60" r="10" stroke="currentColor" strokeWidth="1.2" fill="#FBFBF9" />
        <circle cx="20" cy="60" r="4" fill="currentColor" />
        <circle cx="70" cy="60" r="10" stroke="currentColor" strokeWidth="1.2" fill="#FBFBF9" />
        <circle cx="70" cy="60" r="4" fill="currentColor" />
        
        <path d="M 10 60 L 5 45 L 15 20 Q 30 10, 55 10 L 80 15 L 85 45 L 80 60 L 60 60" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M 15 20 Q 45 15, 80 15" stroke="currentColor" strokeWidth="0.8" />
        <line x1="38" y1="11" x2="38" y2="40" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="58" y1="12" x2="58" y2="40" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        
        <path d="M 15 20 L 25 45 L 5 45" stroke="currentColor" strokeWidth="1" />
        <line x1="25" y1="45" x2="45" y2="45" stroke="currentColor" strokeWidth="1.2" />
        <line x1="45" y1="45" x2="40" y2="60" stroke="currentColor" strokeWidth="1" />
        <line x1="45" y1="45" x2="45" y2="10" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
        
        <path d="M 10 60 L 12 52 L 22 52" stroke="currentColor" strokeWidth="1" />
        <line x1="17" y1="48" x2="23" y2="43" stroke="currentColor" strokeWidth="1" />
      </g>

      {/* Tangled Electric Wires with Birds sitting */}
      <g stroke="currentColor" fill="none">
        <path d="M 20 10 Q 150 45, 380 20" strokeWidth="0.8" strokeOpacity="0.7" />
        <path d="M 20 25 Q 120 70, 380 40" strokeWidth="0.9" strokeOpacity="0.8" />
        <path d="M 20 18 Q 200 85, 380 15" strokeWidth="0.7" strokeOpacity="0.6" />
        
        {/* Hanging nodes */}
        <path d="M 120 45 L 120 75" strokeWidth="0.8" strokeOpacity="0.5" />
        <circle cx="120" cy="75" r="2" fill="currentColor" fillOpacity="0.7" />
        <path d="M 260 52 L 260 90" strokeWidth="0.8" strokeOpacity="0.5" />
        <circle cx="260" cy="90" r="1.5" fill="currentColor" fillOpacity="0.7" />
        
        {/* Tiny Birds sitting on the wires */}
        <g stroke="currentColor" strokeWidth="1" fill="none" strokeOpacity="0.8">
          {/* Bird 1 */}
          <path d="M 180 34 Q 183 31, 186 34" />
          <path d="M 183 34 L 183 36" />
          {/* Bird 2 */}
          <path d="M 220 38 Q 223 35, 226 38" />
          <path d="M 223 38 L 223 40" />
        </g>
      </g>

      {/* Ground lines */}
      <line x1="20" y1="245" x2="380" y2="245" stroke="currentColor" strokeWidth="1.2" />
      <line x1="30" y1="249" x2="370" y2="249" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
    </svg>
  );
};

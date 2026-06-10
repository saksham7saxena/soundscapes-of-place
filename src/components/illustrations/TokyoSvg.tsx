import React from 'react';

interface SvgProps {
  accentColor: string;
}

export const TokyoSvg: React.FC<SvgProps> = ({ accentColor }) => {
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

      {/* Red Glowing Neon Sun / Disc (Tokyo signature accent) */}
      <circle cx="120" cy="100" r="30" fill={accentColor} fillOpacity="0.14" className="transition-all duration-700" />
      <circle cx="120" cy="100" r="30" stroke={accentColor} strokeWidth="1" className="transition-all duration-700" />

      {/* Mount Fuji Silhouette (Far background) */}
      <g stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" fill="#FBFBF9" fillOpacity="0.05" transform="translate(150, 45)">
        <path d="M 0 110 L 45 40 Q 55 33, 65 33 Q 75 33, 85 40 L 130 110 Z" />
        <path d="M 38 52 Q 55 58, 65 52 Q 75 48, 92 52" strokeWidth="0.7" strokeDasharray="2 2" />
        
        {/* Minimalist clouds framing Mt. Fuji */}
        <path d="M -20 85 Q -10 75, 5 78 Q 20 81, 30 85" strokeWidth="0.6" strokeDasharray="1.5 3" />
        <path d="M 110 90 Q 120 82, 135 85 Q 150 88, 160 90" strokeWidth="0.6" strokeDasharray="1.5 3" />
      </g>

      {/* Traditional Shrine Torii Gate (Under the Sun, in background) */}
      <g transform="translate(75, 90)" stroke="currentColor" strokeWidth="1" fill="none" strokeOpacity="0.5">
        <path d="M -5 15 Q 45 5, 95 15" strokeWidth="1.6" />
        <path d="M 0 23 L 90 23" strokeWidth="1.2" />
        <line x1="12" y1="35" x2="78" y2="35" />
        <line x1="20" y1="23" x2="16" y2="90" strokeWidth="1.6" />
        <line x1="70" y1="23" x2="74" y2="90" strokeWidth="1.6" />
        <rect x="41" y="23" width="8" height="12" fill="#FBFBF9" />
        
        {/* Shimenawa paper tassels (shide) details */}
        <path d="M 30 35 L 30 40 L 32 42" strokeWidth="0.6" />
        <path d="M 45 35 L 45 42 L 47 44" strokeWidth="0.6" />
        <path d="M 60 35 L 60 40 L 62 42" strokeWidth="0.6" />
      </g>

      {/* Overlapping Curved Train Line / Monorail Track */}
      <path d="M 20 120 C 120 70, 280 160, 380 110" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      <path d="M 20 127 C 120 77, 280 167, 380 117" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      {/* Train track ties */}
      {Array.from({ length: 15 }).map((_, i) => {
        const t = 0.08 + i * 0.06;
        const x = 20 + t * 360;
        const y = 120 * (1-t)*(1-t) + 70 * 2 * (1-t) * t + 110 * t * t;
        return (
          <line 
            key={`tie-${i}`} 
            x1={x} y1={y + (12 + t * 10)} 
            x2={x - 2} y2={y - (2 + t * 4)} 
            stroke="currentColor" 
            strokeWidth="0.8" 
            strokeOpacity="0.25" 
          />
        );
      })}

      {/* Dense Vertical Signage (Right Side) */}
      <g transform="translate(290, 30)">
        <rect x="0" y="0" width="22" height="110" fill="#FBFBF9" stroke="currentColor" strokeWidth="1.2" />
        <line x1="4" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="1" />
        <line x1="11" y1="12" x2="11" y2="95" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 5" />
        <rect x="6" y="20" width="10" height="10" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
        <rect x="6" y="38" width="10" height="10" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
        <rect x="6" y="56" width="10" height="10" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
        <circle cx="11" cy="84" r="3" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.6" />

        <rect x="28" y="15" width="28" height="75" fill="#FBFBF9" stroke="currentColor" strokeWidth="1" />
        <rect x="33" y="22" width="18" height="6" fill="currentColor" fillOpacity="0.1" />
        <line x1="33" y1="36" x2="51" y2="36" stroke="currentColor" strokeWidth="1.2" />
        <line x1="33" y1="46" x2="51" y2="46" stroke="currentColor" strokeWidth="0.8" />
        <line x1="33" y1="54" x2="51" y2="54" stroke="currentColor" strokeWidth="0.8" />
        <line x1="33" y1="62" x2="51" y2="62" stroke="currentColor" strokeWidth="0.8" />
        <path d="M 36 74 L 46 74" stroke="currentColor" strokeWidth="1.5" />

        <rect x="-22" y="40" width="16" height="28" rx="2" fill="#FBFBF9" stroke="currentColor" strokeWidth="1" />
        <line x1="-14" y1="35" x2="-14" y2="40" stroke="currentColor" strokeWidth="1" />
        <line x1="-22" y1="46" x2="-6" y2="46" stroke="currentColor" strokeWidth="0.8" />
        <line x1="-22" y1="62" x2="-6" y2="62" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="-14" cy="54" r="4" fill={accentColor} fillOpacity="0.25" className="transition-all duration-700" />
      </g>

      {/* Tokyo Vending Machine (Left bottom) */}
      <g transform="translate(210, 140)">
        <rect x="0" y="0" width="45" height="110" rx="1" fill="#FBFBF9" stroke="currentColor" strokeWidth="1.5" />
        <rect x="4" y="6" width="37" height="12" stroke="currentColor" strokeWidth="1" />
        <line x1="8" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        <circle cx="34" cy="12" r="2" fill={accentColor} fillOpacity="0.8" className="transition-all duration-700" />

        {/* Cans with glowing price tags (accent color) */}
        {Array.from({ length: 4 }).map((_, i) => (
          <g key={`can1-${i}`}>
            <rect x={6 + i * 8} y="26" width="5" height="9" rx="0.5" stroke="currentColor" strokeWidth="0.8" />
            <circle cx={8.5 + i * 8} cy="38" r="0.6" fill={accentColor} fillOpacity="0.6" />
          </g>
        ))}
        <line x1="5" y1="40" x2="38" y2="40" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4" />
        
        {Array.from({ length: 4 }).map((_, i) => (
          <g key={`can2-${i}`}>
            <rect x={6 + i * 8} y="45" width="5" height="9" rx="0.5" stroke="currentColor" strokeWidth="0.8" />
            <circle cx={8.5 + i * 8} cy="57" r="0.6" fill={accentColor} fillOpacity="0.6" />
          </g>
        ))}
        <line x1="5" y1="59" x2="38" y2="59" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4" />

        {/* Push flap */}
        <rect x="6" y="86" width="33" height="16" rx="1" stroke="currentColor" strokeWidth="1" />
        <line x1="12" y1="94" x2="33" y2="94" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3" />

        {/* Coin slot */}
        <rect x="30" y="66" width="8" height="12" stroke="currentColor" strokeWidth="0.8" />
        <line x1="34" y1="69" x2="34" y2="73" stroke="currentColor" strokeWidth="1" />
      </g>

      {/* Open Umbrella */}
      <g transform="translate(60, 185)" stroke="currentColor" strokeWidth="1.2" fill="none">
        <path d="M 0 45 Q 35 15, 70 45" fill="#FBFBF9" strokeWidth="1.5" />
        <path d="M 0 45 Q 18 35, 35 18" strokeWidth="0.8" strokeOpacity="0.5" />
        <path d="M 70 45 Q 52 35, 35 18" strokeWidth="0.8" strokeOpacity="0.5" />
        <path d="M 35 18 L 35 45" strokeWidth="0.8" strokeOpacity="0.6" />
        <line x1="35" y1="18" x2="35" y2="10" strokeWidth="1.5" />
        <line x1="35" y1="45" x2="35" y2="75" strokeWidth="1.2" />
        <path d="M 35 75 Q 35 80, 40 80 Q 45 80, 45 75" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Crossing Lines on crosswalk (Left-to-Right diagonal perspective) */}
      <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.3">
        <line x1="20" y1="245" x2="380" y2="245" strokeOpacity="1" />
        <line x1="20" y1="250" x2="160" y2="250" />
        <line x1="80" y1="254" x2="220" y2="254" />
        <line x1="140" y1="258" x2="320" y2="258" />
        <line x1="200" y1="262" x2="380" y2="262" />
      </g>
    </svg>
  );
};

import React from 'react';

interface SvgProps {
  accentColor: string;
}

export const NewYorkSvg: React.FC<SvgProps> = ({ accentColor }) => {
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

      {/* Skyline Backdrop (Subtle thin lines) */}
      <g stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.25">
        <path d="M 20 180 L 50 180 L 50 110 L 85 110 L 85 180" />
        <path d="M 85 180 L 105 180 L 105 70 L 135 70 L 135 45 L 140 45 L 140 70 L 150 70 L 150 180" />
        <line x1="122" y1="45" x2="122" y2="15" strokeWidth="1" />
        
        <path d="M 150 180 L 180 180 L 180 120 L 210 120 L 210 180" />
        <path d="M 210 180 L 230 180 L 230 85 L 260 55 L 275 85 L 275 180" />
        <line x1="252" y1="55" x2="252" y2="30" strokeWidth="1" />
        
        <path d="M 275 180 L 305 180 L 305 130 L 335 130 L 335 180" />
        <path d="M 335 180 L 380 180 L 380 145 L 380 180" />
        
        {/* Detailed Window grids on Chrysler/Empire style towers */}
        <line x1="115" y1="90" x2="115" y2="160" strokeDasharray="1 3" />
        <line x1="122" y1="90" x2="122" y2="160" strokeDasharray="1 3" />
        <line x1="130" y1="90" x2="130" y2="160" strokeDasharray="1 3" />
        <line x1="138" y1="90" x2="138" y2="160" strokeDasharray="1 3" />
        
        <line x1="242" y1="100" x2="242" y2="170" strokeDasharray="1 3" />
        <line x1="252" y1="100" x2="252" y2="170" strokeDasharray="1 3" />
        <line x1="262" y1="100" x2="262" y2="170" strokeDasharray="1 3" />
      </g>

      {/* Brooklyn Bridge (Crossing center background) */}
      <g stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" fill="none" transform="translate(130, 80)">
        <path d="M 15 100 L 15 30 L 30 10 L 45 30 L 45 100" strokeWidth="1" fill="#FBFBF9" />
        <path d="M 22 100 L 22 55 Q 30 43, 38 55 L 38 100" strokeWidth="0.9" />
        <path d="M 24 45 L 24 35 Q 30 28, 36 35 L 36 45" strokeWidth="0.8" />
        <rect x="12" y="6" width="36" height="4" />
        
        {/* Main Sweeping Suspension Cables */}
        <path d="M -110 35 Q 20 75, 140 50" strokeWidth="1" />
        <path d="M -110 42 Q 20 82, 140 57" strokeWidth="0.6" />
        
        {/* Tiny cable lights (Dotted along the main cable) */}
        <g stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.6">
          <circle cx="-90" cy="38" r="0.6" fill={accentColor} />
          <circle cx="-60" cy="45" r="0.6" fill={accentColor} />
          <circle cx="-30" cy="52" r="0.6" fill={accentColor} />
          <circle cx="0" cy="57" r="0.6" fill={accentColor} />
          <circle cx="30" cy="57" r="0.6" fill={accentColor} />
          <circle cx="60" cy="54" r="0.6" fill={accentColor} />
          <circle cx="90" cy="51" r="0.6" fill={accentColor} />
          <circle cx="120" cy="48" r="0.6" fill={accentColor} />
        </g>
        
        {/* Vertical suspender ropes */}
        <line x1="-80" y1="42" x2="-80" y2="100" strokeWidth="0.4" />
        <line x1="-50" y1="51" x2="-50" y2="100" strokeWidth="0.4" />
        <line x1="-20" y1="60" x2="-20" y2="100" strokeWidth="0.4" />
        <line x1="75" y1="71" x2="75" y2="100" strokeWidth="0.4" />
        <line x1="105" y1="62" x2="105" y2="100" strokeWidth="0.4" />
      </g>

      {/* Building Facade with Fire Escape Zigzags (Right side) */}
      <g transform="translate(290, 40)" stroke="currentColor" strokeWidth="1" fill="none">
        <rect x="0" y="0" width="90" height="210" fill="#FBFBF9" strokeOpacity="0.4" />
        <rect x="15" y="20" width="22" height="35" rx="1" strokeOpacity="0.5" />
        <line x1="26" y1="20" x2="26" y2="55" strokeOpacity="0.3" />
        <line x1="15" y1="37" x2="37" y2="37" strokeOpacity="0.3" />
        
        <rect x="15" y="80" width="22" height="35" rx="1" strokeOpacity="0.5" />
        <line x1="26" y1="80" x2="26" y2="115" strokeOpacity="0.3" />
        <line x1="15" y1="97" x2="37" y2="97" strokeOpacity="0.3" />

        <rect x="15" y="140" width="22" height="35" rx="1" strokeOpacity="0.5" />
        <line x1="26" y1="140" x2="26" y2="175" strokeOpacity="0.3" />
        <line x1="15" y1="157" x2="37" y2="157" strokeOpacity="0.3" />

        {/* Fire Escape Decks */}
        <rect x="45" y="47" width="40" height="6" strokeWidth="1.2" />
        <line x1="45" y1="47" x2="45" y2="37" strokeWidth="0.8" />
        <line x1="85" y1="47" x2="85" y2="37" strokeWidth="0.8" />
        <rect x="45" y="107" width="40" height="6" strokeWidth="1.2" />
        <rect x="45" y="167" width="40" height="6" strokeWidth="1.2" />

        {/* Diagonal Ladders */}
        <line x1="80" y1="53" x2="50" y2="107" strokeWidth="1.2" />
        <line x1="80" y1="113" x2="50" y2="167" strokeWidth="1.2" />
        <line x1="80" y1="173" x2="65" y2="200" strokeWidth="1.2" />
      </g>

      {/* Basketball Hoop (Left high up) */}
      <g transform="translate(45, 60)" stroke="currentColor" strokeWidth="1" fill="none">
        <rect x="0" y="0" width="36" height="24" rx="1" fill="#FBFBF9" strokeWidth="1.2" />
        <rect x="10" y="12" width="16" height="8" strokeOpacity="0.6" />
        <ellipse cx="18" cy="21" rx="8" ry="2" strokeWidth="1.5" />
        <path d="M 10 21 L 12 35 L 18 38 L 24 35 L 26 21" strokeWidth="0.8" strokeOpacity="0.7" />
        <path d="M 14 21 L 18 35 L 22 21" strokeWidth="0.8" strokeOpacity="0.7" />
        <path d="M 12 28 Q 18 31, 24 28" strokeWidth="0.8" strokeOpacity="0.5" />
        <path d="M 0 12 L -15 12" strokeWidth="1.5" strokeOpacity="0.4" />
        
        {/* Basketball mid-air (about to enter hoop) */}
        <circle cx="18" cy="10" r="3.2" fill="#FBFBF9" stroke="currentColor" strokeWidth="1" />
        <path d="M 15.2 10 Q 18 12.5, 20.8 10 M 18 6.8 L 18 13.2" stroke="currentColor" strokeWidth="0.6" />
      </g>

      {/* Coffee Cart / Vendor (Left bottom) */}
      <g transform="translate(40, 160)" stroke="currentColor" strokeWidth="1.2" fill="none">
        <rect x="15" y="30" width="60" height="45" rx="1" fill="#FBFBF9" strokeWidth="1.5" />
        <circle cx="30" cy="80" r="8" fill="#FBFBF9" />
        <circle cx="30" cy="80" r="2.5" fill="currentColor" />
        <circle cx="60" cy="80" r="8" fill="#FBFBF9" />
        <circle cx="60" cy="80" r="2.5" fill="currentColor" />
        <path d="M 10 20 C 25 -5, 65 -5, 80 20 Z" fill="#FBFBF9" />
        <line x1="45" y1="20" x2="45" y2="30" />
        <path d="M 25 25 Q 23 21, 25 18 Q 27 15, 24 12" strokeWidth="0.8" strokeOpacity="0.5" />
        <path d="M 65 24 Q 63 20, 65 17 Q 67 14, 64 11" strokeWidth="0.8" strokeOpacity="0.5" />
        <rect x="22" y="27" width="5" height="3" fill="currentColor" />
        <rect x="29" y="27" width="4" height="3" fill="currentColor" />
      </g>

      {/* Classic Subway Entrance (Center bottom) */}
      <g transform="translate(160, 160)" stroke="currentColor" strokeWidth="1.2" fill="none">
        <rect x="0" y="30" width="75" height="45" rx="1" fill="#FBFBF9" strokeWidth="1.5" />
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`subway-bar-${i}`} x1={8 + i * 7.5} y1="30" x2={8 + i * 7.5} y2="75" strokeWidth="0.8" strokeOpacity="0.5" />
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <circle key={`subway-circ-${i}`} cx={12 + i * 16} cy="40" r="4" strokeWidth="0.8" strokeOpacity="0.4" />
        ))}

        <rect x="15" y="44" width="45" height="12" fill="#FBFBF9" strokeWidth="1" />
        <path d="M 20 50 L 55 50" strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.6" />

        <line x1="4" y1="30" x2="4" y2="-5" strokeWidth="1.5" />
        <line x1="71" y1="30" x2="71" y2="-5" strokeWidth="1.5" />
        
        {/* Glowing Subway Globe Lights - Taxi yellow/accent color */}
        <circle cx="4" cy="-11" r="10" fill={accentColor} fillOpacity="0.16" className="transition-all duration-700" />
        <circle cx="4" cy="-11" r="6" fill={accentColor} fillOpacity="0.25" className="transition-all duration-700" />
        <circle cx="4" cy="-11" r="6" stroke={accentColor} strokeWidth="1.2" className="transition-all duration-700" />
        
        <circle cx="71" cy="-11" r="10" fill={accentColor} fillOpacity="0.16" className="transition-all duration-700" />
        <circle cx="71" cy="-11" r="6" fill={accentColor} fillOpacity="0.25" className="transition-all duration-700" />
        <circle cx="71" cy="-11" r="6" stroke={accentColor} strokeWidth="1.2" className="transition-all duration-700" />
      </g>

      {/* Crosswalk lines at bottom */}
      <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.4">
        <line x1="20" y1="245" x2="380" y2="245" strokeOpacity="1" />
        <line x1="30" y1="252" x2="60" y2="268" strokeWidth="2.5" />
        <line x1="90" y1="252" x2="120" y2="268" strokeWidth="2.5" />
        <line x1="150" y1="252" x2="180" y2="268" strokeWidth="2.5" />
        <line x1="210" y1="252" x2="240" y2="268" strokeWidth="2.5" />
        <line x1="270" y1="252" x2="300" y2="268" strokeWidth="2.5" />
        <line x1="330" y1="252" x2="360" y2="268" strokeWidth="2.5" />
      </g>
    </svg>
  );
};

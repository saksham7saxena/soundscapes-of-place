import React from 'react';

interface SvgProps {
  accentColor: string;
}

export const DubaiSvg: React.FC<SvgProps> = ({ accentColor }) => {
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

      {/* Gold Glowing Sun (Desert golden hour accent) */}
      <circle cx="200" cy="115" r="34" fill={accentColor} fillOpacity="0.12" className="transition-all duration-700" />
      <circle cx="200" cy="115" r="34" stroke={accentColor} strokeWidth="1" strokeDasharray="4 4" className="transition-all duration-700" />

      {/* Burj Al Arab Silhouette (Sail Shape - Left center background) */}
      <g stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" fill="#FBFBF9" fillOpacity="0.1" transform="translate(110, 125)">
        <path d="M 0 120 C 5 60, 25 25, 40 10 L 40 120 Z" strokeWidth="1" />
        <path d="M -8 120 C -2 60, 20 20, 40 10" strokeWidth="1.2" />
        <line x1="26" y1="35" x2="48" y2="35" strokeWidth="1.2" />
        <line x1="32" y1="35" x2="30" y2="120" />
        
        <line x1="0" y1="100" x2="35" y2="85" />
        <line x1="2" y1="80" x2="38" y2="65" />
        <line x1="5" y1="60" x2="39" y2="45" />
        <line x1="12" y1="40" x2="40" y2="25" />
      </g>

      {/* Burj Khalifa Silhouette (Stepped Spire) */}
      <g stroke="currentColor" strokeWidth="1" fill="#FBFBF9" strokeLinejoin="miter" transform="translate(10, 0)">
        <path d="M 175 245 L 180 230 L 185 230 L 185 190 L 190 190 L 190 140 L 193 140 L 193 90 L 196 90 L 196 50 L 199 50 L 199 25 L 201 25 L 201 50 L 204 50 L 204 90 L 207 90 L 207 140 L 210 140 L 210 190 L 215 190 L 215 230 L 220 230 L 225 245 Z" strokeWidth="1.2" />
        <line x1="200" y1="25" x2="200" y2="8" stroke="currentColor" strokeWidth="1.2" />
        
        <line x1="190" y1="190" x2="190" y2="245" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="210" y1="190" x2="210" y2="245" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="195" y1="140" x2="195" y2="245" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="205" y1="140" x2="205" y2="245" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="200" y1="25" x2="200" y2="245" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
        
        {Array.from({ length: 14 }).map((_, i) => {
          const y = 55 + i * 13;
          return (
            <line key={`burj-horiz-${i}`} x1="192" y1={y} x2="208" y2={y} stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.25" />
          );
        })}
      </g>

      {/* Distant Construction Crane (Left back) */}
      <g transform="translate(45, 100)" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5">
        <line x1="0" y1="0" x2="0" y2="105" strokeWidth="1" />
        <line x1="-30" y1="0" x2="40" y2="0" strokeWidth="1" />
        <line x1="0" y1="-5" x2="0" y2="0" strokeWidth="1" />
        <line x1="0" y1="-5" x2="-30" y2="0" />
        <line x1="0" y1="-5" x2="15" y2="0" />
        <line x1="30" y1="0" x2="30" y2="45" />
        <rect x="28" y="45" width="4" height="4" fill="currentColor" />
        <line x1="-10" y1="105" x2="0" y2="90" />
        <line x1="10" y1="105" x2="0" y2="90" />
      </g>

      {/* Modern Metro Line on High Piers (Right background) */}
      <g stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4">
        <path d="M 225 180 L 380 180" strokeWidth="1.2" />
        <path d="M 225 184 L 380 184" />
        <line x1="255" y1="184" x2="255" y2="230" />
        <line x1="295" y1="184" x2="295" y2="235" />
        <line x1="335" y1="184" x2="335" y2="240" />
        <line x1="375" y1="184" x2="375" y2="245" />
      </g>

      {/* Elegant Palm Tree (Left Side foreground) */}
      <g transform="translate(70, 150)" stroke="currentColor" strokeWidth="1" fill="none">
        <path d="M 20 95 Q 12 50, 25 10" strokeWidth="1.6" />
        <path d="M 24 95 Q 17 50, 28 10" strokeWidth="1.2" strokeOpacity="0.4" />
        
        <path d="M 26 10 Q 15 2, 2 8" strokeWidth="1.2" />
        <path d="M 26 10 Q 30 -5, 20 -12" strokeWidth="1.2" />
        <path d="M 26 10 Q 45 0, 52 12" strokeWidth="1.2" />
        <path d="M 26 10 Q 40 22, 32 35" strokeWidth="1.2" />
        <path d="M 26 10 Q 10 20, 8 32" strokeWidth="1.2" />
        
        <path d="M 15 6 C 12 10, 8 12, 5 11" strokeWidth="0.6" strokeOpacity="0.6" />
        <path d="M 21 -4 C 18 -8, 14 -10, 11 -8" strokeWidth="0.6" strokeOpacity="0.6" />
        <path d="M 36 4 C 40 6, 44 8, 48 8" strokeWidth="0.6" strokeOpacity="0.6" />
      </g>

      {/* Marina Waterline Ripples & Sailboat */}
      <g stroke="currentColor" fill="none">
        <path d="M 230 248 C 265 246, 315 252, 380 248" strokeWidth="0.8" strokeOpacity="0.3" />
        <path d="M 230 254 C 275 252, 325 258, 380 254" strokeWidth="0.8" strokeOpacity="0.2" />
        
        {/* Tiny sailboat on the marina line */}
        <g transform="translate(330, 235)" strokeWidth="0.8" strokeOpacity="0.6" fill="#FBFBF9">
          <path d="M 0 6 L 12 6 L 10 10 L 2 10 Z" />
          <path d="M 6 6 L 6 0 L 10 5 Z" />
        </g>
      </g>

      {/* Desert Sand Dune curves with wind ripple lines */}
      <g fill="#FBFBF9" stroke="currentColor" strokeWidth="1.2">
        {/* Back Dune */}
        <path d="M 20 245 Q 120 215, 235 245 L 20 245 Z" />
        <path d="M 130 245 Q 260 225, 380 255 L 130 245 Z" />
        
        {/* Wind ripples on dunes (fine dashed paths) */}
        <path d="M 60 238 Q 90 230, 130 238" strokeWidth="0.6" strokeDasharray="2 3" strokeOpacity="0.4" />
        <path d="M 200 241 Q 240 235, 290 244" strokeWidth="0.6" strokeDasharray="2 3" strokeOpacity="0.4" />
        
        {/* Foreground Dune */}
        <path d="M 20 260 Q 150 240, 380 262" strokeWidth="1.5" />
      </g>
    </svg>
  );
};

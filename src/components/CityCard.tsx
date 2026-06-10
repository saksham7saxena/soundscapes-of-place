import React, { useState, useEffect } from 'react';
import type { City } from '../data/cities';

interface CityCardProps {
  city: City;
  isPlayingAny: boolean;
}

export const CityCard: React.FC<CityCardProps> = ({ city, isPlayingAny }) => {
  const SvgIllustration = city.illustration;
  const [localTime, setLocalTime] = useState<string>('');

  // Setup local clock ticking in sync with the city's timezone
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('en-US', {
          timeZone: city.timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }).format(new Date());
        setLocalTime(timeStr);
      } catch (e) {
        setLocalTime(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [city]);

  return (
    <div className="relative w-full max-w-lg mx-auto bg-[#FBFBF9] border border-neutral-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.015)] p-4 md:p-5 rounded-sm transition-all duration-500 hover:border-neutral-300">
      
      {/* Decorative Stamp Postcard Marking */}
      <div className="absolute top-3 right-3 flex items-center justify-center">
        {/* Retro Postage Stamp */}
        <div 
          className="w-10 h-14 border-2 border-dashed flex flex-col items-center justify-between p-1 select-none transition-all duration-500"
          style={{ 
            borderColor: city.accentColor,
            color: city.accentColor,
            backgroundColor: `${city.accentColor}05`
          }}
        >
          <span className="text-[7px] font-sans tracking-widest font-semibold uppercase opacity-60">POST</span>
          <span className="text-sm font-serif font-bold leading-none">{city.stampIcon}</span>
          <span className="text-[6px] font-sans font-semibold tracking-wider opacity-60">2026</span>
        </div>
      </div>

      {/* Postcard Header */}
      <div className="mb-4 flex flex-col items-start pr-14 border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-1.5 text-[10px] font-sans tracking-widest text-neutral-400 uppercase font-semibold mb-0.5">
          <span>MEMOIR NO.</span>
          <span 
            className="font-bold transition-colors duration-500"
            style={{ color: city.accentColor }}
          >
            0{citiesIndex(city.id)}
          </span>
          <span className="opacity-40">//</span>
          <span className="font-mono tabular-nums tracking-normal text-neutral-500">{localTime}</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-serif font-medium text-neutral-800 tracking-tight flex items-baseline gap-1.5">
          {city.name}
          <span className="text-xs font-sans font-light text-neutral-400 tracking-normal">, {city.country}</span>
        </h2>
        
        <p className="text-[10px] md:text-xs font-sans italic text-neutral-400 tracking-wide mt-0.5">
          {city.subtitle}
        </p>
      </div>

      {/* Postcard Center: Abstract line-art drawing */}
      <div className="relative aspect-[10/7] w-full bg-[#FCFBF8] border border-neutral-100/50 rounded-sm p-3 flex items-center justify-center overflow-hidden group">
        <div className={`w-full h-full transition-editorial ${isPlayingAny ? 'animate-pulse-slow' : ''}`}>
          <SvgIllustration accentColor={city.accentColor} />
        </div>
        
        {/* Subtle decorative target overlay */}
        <div className="absolute inset-0 pointer-events-none border border-transparent group-hover:border-neutral-200/10 transition-all duration-700" />
      </div>

      {/* Postcard Footer: Editorial description */}
      <div className="mt-4 text-left border-t border-neutral-100 pt-3">
        <p className="text-xs font-sans font-light leading-relaxed text-neutral-500 max-w-md">
          {city.description}
        </p>
      </div>
    </div>
  );
};

// Simple index helper
function citiesIndex(id: string): number {
  const map: Record<string, number> = { delhi: 1, paris: 2, tokyo: 3, newyork: 4, dubai: 5, rio: 6 };
  return map[id] || 0;
}

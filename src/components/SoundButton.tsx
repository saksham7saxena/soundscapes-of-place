import React from 'react';
import * as Icons from 'lucide-react';
import type { Sound } from '../data/cities';

interface SoundButtonProps {
  sound: Sound;
  isActive: boolean;
  onToggle: () => void;
  accentColor: string;
  accentGlow: string;
}

// Map of string identifiers to Lucide icon components
const iconMap: Record<string, React.ComponentType<any>> = {
  Megaphone: Icons.Megaphone,
  GlassWater: Icons.GlassWater,
  Mic: Icons.Mic,
  TrainFront: Icons.TrainFront,
  Bell: Icons.Bell,
  Users: Icons.Users,
  Flame: Icons.Flame,
  CloudRain: Icons.CloudRain,
  CupSoda: Icons.CupSoda,
  Sparkles: Icons.Sparkles,
  Music: Icons.Music,
  Activity: Icons.Activity,
  Bird: Icons.Bird,
  BellRing: Icons.BellRing,
  Navigation: Icons.Navigation,
  Timer: Icons.Timer,
  Wind: Icons.Wind,
  Waves: Icons.Waves,
  Footprints: Icons.Footprints,
  Circle: Icons.Circle,
};

export const SoundButton: React.FC<SoundButtonProps> = ({
  sound,
  isActive,
  onToggle,
  accentColor,
  accentGlow,
}) => {
  const IconComponent = iconMap[sound.iconName] || Icons.Volume2;

  return (
    <button
      onClick={onToggle}
      className={`flex flex-col items-center justify-center group focus:outline-none transition-all duration-300`}
      aria-label={`Toggle ${sound.name} soundscape layer`}
      aria-pressed={isActive}
    >
      {/* Outer Circle Container */}
      <div 
        className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border transition-all duration-500 cursor-pointer select-none
          ${isActive 
            ? 'border-neutral-800 animate-subtle-glow' 
            : 'border-neutral-200/80 bg-transparent hover:border-neutral-400/80 hover:scale-[1.03]'
          }
        `}
        style={isActive ? { 
          '--glow-color': accentGlow,
          borderColor: accentColor,
          backgroundColor: `${accentColor}05`
        } as React.CSSProperties : undefined}
      >
        {/* Pulsing expander ring when active */}
        {isActive && (
          <div 
            className="absolute inset-0 rounded-full border opacity-30 animate-ping pointer-events-none"
            style={{ borderColor: accentColor }}
          />
        )}

        {/* Icon */}
        <span 
          className="transition-colors duration-500"
          style={{ color: isActive ? accentColor : '#525252' }}
        >
          <IconComponent size={20} className="stroke-[1.3]" />
        </span>
      </div>

      {/* Mini Label */}
      <span className="text-[10px] md:text-[11px] font-sans tracking-wide text-neutral-400 mt-2 transition-colors duration-300 group-hover:text-neutral-600">
        {sound.name}
      </span>
    </button>
  );
};

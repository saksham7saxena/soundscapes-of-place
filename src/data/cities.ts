import React from 'react';
import { DelhiSvg } from '../components/illustrations/DelhiSvg';
import { ParisSvg } from '../components/illustrations/ParisSvg';
import { TokyoSvg } from '../components/illustrations/TokyoSvg';
import { NewYorkSvg } from '../components/illustrations/NewYorkSvg';
import { DubaiSvg } from '../components/illustrations/DubaiSvg';
import { RioSvg } from '../components/illustrations/RioSvg';

export interface Sound {
  id: string;
  name: string;
  iconName: string; // Lucide icon identifier
  synthType: 'drone' | 'chime' | 'noise' | 'percussion' | 'accordion' | 'saxophone' | 'samba' | 'birds';
  params: {
    frequency?: number;
    detune?: number;
    decay?: number;
    filterFreq?: number;
    filterQ?: number;
    pan?: number;
    playbackRate?: number;
    rhythmSpeed?: number;
    modFrequency?: number;
  };
}

export interface City {
  id: string;
  name: string;
  country: string;
  subtitle: string;
  description: string;
  accentColor: string; // Tailwind/CSS color string for highlight
  accentHex: string; // Exact hex for WebGL/Audio or inline CSS
  accentClass: {
    bg: string;
    text: string;
    border: string;
    glow: string;
  };
  stampIcon: string; // Small SVG icon path or emoji identifier
  illustration: React.FC<{ accentColor: string }>;
  sounds: Sound[];
  timeZone: string;
}

export const cities: City[] = [
  {
    id: 'delhi',
    name: 'Delhi',
    country: 'India',
    subtitle: 'tangled wires & monsoon dust',
    description: 'A city composed of constant friction, where the clink of chai glasses cuts through the rumbling roar of auto-rickshaws and distant train tracks.',
    accentColor: '#C2593F', // Terracotta Terracotta
    accentHex: '#C2593F',
    accentClass: {
      bg: 'bg-[#C2593F]',
      text: 'text-[#C2593F]',
      border: 'border-[#C2593F]',
      glow: 'rgba(194, 89, 63, 0.25)',
    },
    stampIcon: 'दि', // Devanagari for Delhi
    illustration: DelhiSvg,
    timeZone: 'Asia/Kolkata',
    sounds: [
      { id: 'delhi-horn', name: 'Auto Horn', iconName: 'Megaphone', synthType: 'drone', params: { frequency: 380, detune: 5, filterFreq: 1200, pan: -0.4 } },
      { id: 'delhi-chai', name: 'Chai Clink', iconName: 'GlassWater', synthType: 'chime', params: { frequency: 2800, decay: 0.12 } },
      { id: 'delhi-vendor', name: 'Street Cry', iconName: 'Mic', synthType: 'drone', params: { frequency: 220, modFrequency: 8, filterFreq: 800, pan: 0.3 } },
      { id: 'delhi-metro', name: 'Metro Chime', iconName: 'TrainFront', synthType: 'chime', params: { frequency: 650, decay: 0.8 } },
      { id: 'delhi-bell', name: 'Temple Bell', iconName: 'Bell', synthType: 'chime', params: { frequency: 440, decay: 3.5, filterQ: 8 } },
      { id: 'delhi-market', name: 'Market Hum', iconName: 'Users', synthType: 'noise', params: { filterFreq: 300, filterQ: 1, pan: 0.1 } },
      { id: 'delhi-whistle', name: 'Cooker Whistle', iconName: 'Flame', synthType: 'drone', params: { frequency: 1600, detune: 30, filterFreq: 4000, decay: 0.4, pan: 0.6 } },
      { id: 'delhi-rain', name: 'Monsoon Rain', iconName: 'CloudRain', synthType: 'noise', params: { filterFreq: 800, filterQ: 0.5 } }
    ]
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    subtitle: 'cobblestones & accordion air',
    description: 'An echo chamber of steel, zinc rooftops, and slow conversations, where church bells ring over the gentle rustle of pastry bags along the Seine.',
    accentColor: '#4F6D7A', // Seine Blue Sage
    accentHex: '#4F6D7A',
    accentClass: {
      bg: 'bg-[#4F6D7A]',
      text: 'text-[#4F6D7A]',
      border: 'border-[#4F6D7A]',
      glow: 'rgba(79, 109, 122, 0.25)',
    },
    stampIcon: 'RF', // République Française
    illustration: ParisSvg,
    timeZone: 'Europe/Paris',
    sounds: [
      { id: 'paris-cup', name: 'Café Cup', iconName: 'CupSoda', synthType: 'chime', params: { frequency: 3200, decay: 0.08 } },
      { id: 'paris-doors', name: 'Metro Doors', iconName: 'TrainFront', synthType: 'chime', params: { frequency: 580, decay: 0.5 } },
      { id: 'paris-bell', name: 'Bicycle Bell', iconName: 'Bell', synthType: 'chime', params: { frequency: 2200, decay: 0.18 } },
      { id: 'paris-footsteps', name: 'Seine Walk', iconName: 'Footprints', synthType: 'percussion', params: { frequency: 120, decay: 0.05, rhythmSpeed: 2 } },
      { id: 'paris-bag', name: 'Paper Rustle', iconName: 'Sparkles', synthType: 'noise', params: { filterFreq: 2200, filterQ: 4 } },
      { id: 'paris-church', name: 'Church Bell', iconName: 'Activity', synthType: 'chime', params: { frequency: 180, decay: 4.5 } },
      { id: 'paris-murmur', name: 'Café Murmur', iconName: 'Users', synthType: 'noise', params: { filterFreq: 400, filterQ: 2 } },
      { id: 'paris-accordion', name: 'Accordion', iconName: 'Music', synthType: 'accordion', params: { frequency: 440, detune: 12 } }
    ]
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    subtitle: 'neon hums & crossing chirps',
    description: 'A quiet density. The soundscape layers mechanical door chimes, station melodies, and digital crosswalk chirps against a soft canvas of falling rain.',
    accentColor: '#D62246', // Cherry Red
    accentHex: '#D62246',
    accentClass: {
      bg: 'bg-[#D62246]',
      text: 'text-[#D62246]',
      border: 'border-[#D62246]',
      glow: 'rgba(214, 34, 70, 0.25)',
    },
    stampIcon: '東',
    illustration: TokyoSvg,
    timeZone: 'Asia/Tokyo',
    sounds: [
      { id: 'tokyo-melody', name: 'Station Melody', iconName: 'Music', synthType: 'chime', params: { frequency: 880, decay: 1.2 } },
      { id: 'tokyo-chirp', name: 'Crossing Chirp', iconName: 'Bird', synthType: 'chime', params: { frequency: 1500, decay: 0.25, modFrequency: 20 } },
      { id: 'tokyo-beep', name: 'Vending Beep', iconName: 'Megaphone', synthType: 'chime', params: { frequency: 2000, decay: 0.1 } },
      { id: 'tokyo-chime', name: 'Konbini Chime', iconName: 'BellRing', synthType: 'chime', params: { frequency: 1047, decay: 0.6 } },
      { id: 'tokyo-rain', name: 'Umbrella Rain', iconName: 'CloudRain', synthType: 'noise', params: { filterFreq: 1100, filterQ: 0.8 } },
      { id: 'tokyo-izakaya', name: 'Izakaya Hum', iconName: 'Users', synthType: 'noise', params: { filterFreq: 350, filterQ: 3 } },
      { id: 'tokyo-bike', name: 'Passing Bike', iconName: 'Navigation', synthType: 'percussion', params: { frequency: 1800, decay: 0.03, rhythmSpeed: 4, pan: -0.6 } },
      { id: 'tokyo-shrine', name: 'Shrine Gong', iconName: 'Activity', synthType: 'chime', params: { frequency: 120, decay: 5.0, filterQ: 10 } }
    ]
  },
  {
    id: 'newyork',
    name: 'New York',
    country: 'USA',
    subtitle: 'subway steam & basketball bounces',
    description: 'An electric grid. Distant sirens and coffee cart steam clash with the heavy resonance of basketballs on asphalt and the screech of subway lines.',
    accentColor: '#B87D0B', // Taxi Gold Rust
    accentHex: '#B87D0B',
    accentClass: {
      bg: 'bg-[#B87D0B]',
      text: 'text-[#B87D0B]',
      border: 'border-[#B87D0B]',
      glow: 'rgba(184, 125, 11, 0.25)',
    },
    stampIcon: 'NY',
    illustration: NewYorkSvg,
    timeZone: 'America/New_York',
    sounds: [
      { id: 'ny-screech', name: 'Subway Screech', iconName: 'TrainFront', synthType: 'drone', params: { frequency: 1200, detune: 50, filterFreq: 2500, pan: 0.5 } },
      { id: 'ny-crosswalk', name: 'Signal Tick', iconName: 'Timer', synthType: 'percussion', params: { frequency: 3000, decay: 0.01, rhythmSpeed: 8 } },
      { id: 'ny-honk', name: 'Cab Honk', iconName: 'Megaphone', synthType: 'drone', params: { frequency: 430, detune: 10, filterFreq: 1500, pan: -0.3 } },
      { id: 'ny-steam', name: 'Cart Steam', iconName: 'Flame', synthType: 'noise', params: { filterFreq: 3000, filterQ: 1 } },
      { id: 'ny-basketball', name: 'Ball Bounce', iconName: 'Circle', synthType: 'percussion', params: { frequency: 90, decay: 0.15, rhythmSpeed: 1 } },
      { id: 'ny-performer', name: 'Saxophone', iconName: 'Music', synthType: 'saxophone', params: { frequency: 293.66, detune: 0 } },
      { id: 'ny-siren', name: 'Distant Siren', iconName: 'Activity', synthType: 'drone', params: { frequency: 600, modFrequency: 1, filterFreq: 2000, pan: 0.7 } },
      { id: 'ny-elevator', name: 'Elevator Ding', iconName: 'Bell', synthType: 'chime', params: { frequency: 980, decay: 1.5 } }
    ]
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    subtitle: 'desert wind & metro chimes',
    description: 'A futuristic oasis floating on sand dunes. The soundscape blends high-tech metro chimes and construction beeps with sweeping desert winds.',
    accentColor: '#C09540', // Desert Gold
    accentHex: '#C09540',
    accentClass: {
      bg: 'bg-[#C09540]',
      text: 'text-[#C09540]',
      border: 'border-[#C09540]',
      glow: 'rgba(192, 149, 64, 0.25)',
    },
    stampIcon: 'دبي',
    illustration: DubaiSvg,
    timeZone: 'Asia/Dubai',
    sounds: [
      { id: 'dubai-metro', name: 'Metro Chime', iconName: 'TrainFront', synthType: 'chime', params: { frequency: 784, decay: 1.0 } },
      { id: 'dubai-mall', name: 'Mall Ambience', iconName: 'Users', synthType: 'noise', params: { filterFreq: 500, filterQ: 1.5 } },
      { id: 'dubai-fountain', name: 'Fountain Spray', iconName: 'Waves', synthType: 'noise', params: { filterFreq: 600, filterQ: 0.4 } },
      { id: 'dubai-car', name: 'Supercar Pass', iconName: 'Navigation', synthType: 'drone', params: { frequency: 80, modFrequency: 12, filterFreq: 200, pan: -0.8 } },
      { id: 'dubai-wind', name: 'Desert Wind', iconName: 'Wind', synthType: 'noise', params: { filterFreq: 300, filterQ: 0.2 } },
      { id: 'dubai-crane', name: 'Crane Beep', iconName: 'Timer', synthType: 'chime', params: { frequency: 2500, decay: 0.08 } },
      { id: 'dubai-waves', name: 'Marina Waves', iconName: 'Waves', synthType: 'noise', params: { filterFreq: 150, filterQ: 0.6 } },
      { id: 'dubai-airport', name: 'PA Chime', iconName: 'Bell', synthType: 'chime', params: { frequency: 523.25, decay: 1.5 } }
    ]
  },
  {
    id: 'rio',
    name: 'Rio',
    country: 'Brazil',
    subtitle: 'ocean waves & samba steps',
    description: 'A city that dances between the green mountains and the blue sea, echoing with tropical bird calls, flip-flops on the pavement, and warm samba drum rhythms.',
    accentColor: '#1E824C', // Tropical Green
    accentHex: '#1E824C',
    accentClass: {
      bg: 'bg-[#1E824C]',
      text: 'text-[#1E824C]',
      border: 'border-[#1E824C]',
      glow: 'rgba(30, 130, 76, 0.25)',
    },
    stampIcon: 'Rio',
    illustration: RioSvg,
    timeZone: 'America/Sao_Paulo',
    sounds: [
      { id: 'rio-waves', name: 'Beach Waves', iconName: 'Waves', synthType: 'noise', params: { filterFreq: 250, filterQ: 0.3 } },
      { id: 'rio-kick', name: 'Football Kick', iconName: 'Circle', synthType: 'percussion', params: { frequency: 100, decay: 0.1 } },
      { id: 'rio-drums', name: 'Samba Drums', iconName: 'Music', synthType: 'samba', params: { rhythmSpeed: 2 } },
      { id: 'rio-cablecar', name: 'Cable Car Whirr', iconName: 'TrainFront', synthType: 'drone', params: { frequency: 110, filterFreq: 400, pan: -0.2 } },
      { id: 'rio-vendor', name: 'Beach Cry', iconName: 'Mic', synthType: 'drone', params: { frequency: 280, modFrequency: 5, filterFreq: 1000 } },
      { id: 'rio-footprints', name: 'Flip-Flops', iconName: 'Footprints', synthType: 'percussion', params: { frequency: 300, decay: 0.03, rhythmSpeed: 3 } },
      { id: 'rio-birds', name: 'Tropical Birds', iconName: 'Bird', synthType: 'birds', params: { rhythmSpeed: 1 } },
      { id: 'rio-crowd', name: 'Beach Crowd', iconName: 'Users', synthType: 'noise', params: { filterFreq: 450, filterQ: 1 } }
    ]
  }
];

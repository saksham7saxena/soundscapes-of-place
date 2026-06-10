import React, { useState, useEffect, useRef } from 'react';
import { cities } from './data/cities';
import type { City, Sound } from './data/cities';
import { CityCard } from './components/CityCard';
import { SoundButton } from './components/SoundButton';
import { audioEngine } from './services/audioEngine';
import { Volume2, VolumeX, RotateCcw, Sparkles, Headphones } from 'lucide-react';

export const App: React.FC = () => {
  const [activeCity, setActiveCity] = useState<City>(cities[0]);
  const [activeSounds, setActiveSounds] = useState<string[]>([]);
  const [volume, setVolume] = useState<number>(0.6);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [needsGesture, setNeedsGesture] = useState<boolean>(true);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize/unlock audio on interaction
  const unlockAudio = async () => {
    await audioEngine.init();
    if (audioEngine.getState() === 'running') {
      setNeedsGesture(false);
    }
  };

  // Listen to AudioEngine state changes and window-level gestures
  useEffect(() => {
    const checkAudioState = () => {
      const state = audioEngine.getState();
      if (state === 'running') {
        setNeedsGesture(false);
      } else {
        setNeedsGesture(true);
      }
    };

    // Check initially
    checkAudioState();

    // Listen to changes
    audioEngine.addStateListener(checkAudioState);

    // Global gesture listener to unlock/resume context automatically on any touch or click
    const handleGlobalInteraction = async () => {
      await audioEngine.init();
      checkAudioState();
    };

    window.addEventListener('click', handleGlobalInteraction, { capture: true, once: true });
    window.addEventListener('touchstart', handleGlobalInteraction, { capture: true, once: true });

    return () => {
      audioEngine.removeStateListener(checkAudioState);
      window.removeEventListener('click', handleGlobalInteraction);
      window.removeEventListener('touchstart', handleGlobalInteraction);
    };
  }, []);

  // Synchronize audio engine volume/mute states
  useEffect(() => {
    audioEngine.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (audioEngine.getIsMuted() !== isMuted) {
      audioEngine.toggleMute();
    }
  }, [isMuted]);

  // Handle active city transition
  const handleCityChange = async (city: City) => {
    audioEngine.stopAll();
    setActiveSounds([]);
    setActiveCity(city);
    await audioEngine.init();
  };

  // Toggle a specific sound on/off
  const handleSoundToggle = async (sound: Sound) => {
    if (needsGesture) {
      await unlockAudio();
    }

    const isPlaying = activeSounds.includes(sound.id);
    if (isPlaying) {
      audioEngine.stopSound(sound.id);
      setActiveSounds(prev => prev.filter(id => id !== sound.id));
    } else {
      await audioEngine.startSound(sound.id, sound.synthType, sound.params);
      setActiveSounds(prev => [...prev, sound.id]);
    }
  };

  // Reset all sounds in the current city
  const handleReset = () => {
    audioEngine.stopAll();
    setActiveSounds([]);
  };

  // Compose a random soundscape for the active city
  const handleRandomCompose = async () => {
    if (needsGesture) {
      await unlockAudio();
    }

    audioEngine.stopAll();

    const citySounds = activeCity.sounds;
    const numSounds = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4 sounds
    const shuffled = [...citySounds].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numSounds);

    const newActiveIds: string[] = [];
    for (const sound of selected) {
      await audioEngine.startSound(sound.id, sound.synthType, sound.params);
      newActiveIds.push(sound.id);
    }

    setActiveSounds(newActiveIds);
  };

  // Audio Visualizer Canvas Loop (Silk Wave Renderer)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawWave = () => {
      animationRef.current = requestAnimationFrame(drawWave);

      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, width, height);

      const analyser = audioEngine.getAnalyser();
      
      // If no sounds are playing, draw a quiet, breathing line
      if (!analyser || activeSounds.length === 0 || isMuted) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(31, 31, 31, 0.05)';
        ctx.lineWidth = 1.0;
        
        const breatheAmp = 1.2;
        const time = Date.now() * 0.0015;
        
        ctx.moveTo(0, height / 2);
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * 0.008 + time) * breatheAmp;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      const sliceWidth = width / bufferLength;

      // Draw Wave 1: Dynamic Foreground Wave
      ctx.beginPath();
      ctx.strokeStyle = `${activeCity.accentColor}45`;
      ctx.lineWidth = 1.4;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.stroke();

      // Draw Wave 2: Smoothed Secondary Wave (for a silk ribbon effect)
      ctx.beginPath();
      ctx.strokeStyle = `${activeCity.accentColor}25`;
      ctx.lineWidth = 1.0;
      x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const prev = i > 0 ? i - 1 : i;
        const next = i < bufferLength - 1 ? i + 1 : i;
        const smoothed = (dataArray[prev] + dataArray[i] + dataArray[next]) / 3.0;
        const v = smoothed / 128.0;
        const y = (v * height) / 2 + 4; // slight vertical offset
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.stroke();

      // Draw Wave 3: Ambient Echo Wave
      ctx.beginPath();
      ctx.strokeStyle = `${activeCity.accentColor}12`;
      ctx.lineWidth = 0.8;
      x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2 - 3; // offset above
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.stroke();
    };

    drawWave();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeSounds, isMuted, activeCity]);

  useEffect(() => {
    return () => {
      audioEngine.stopAll();
    };
  }, []);

  const activeSoundNames = activeCity.sounds
    .filter(s => activeSounds.includes(s.id))
    .map(s => s.name.toLowerCase());

  const composedSentence = activeSoundNames.length > 0
    ? `You are hearing: ${activeSoundNames.join(' + ')}.`
    : 'Select sounds to compose the city.';

  // Map dynamic airport code for stamps
  const getAirportCode = (id: string): string => {
    const map: Record<string, string> = {
      delhi: 'DEL',
      paris: 'CDG',
      tokyo: 'HND',
      newyork: 'JFK',
      dubai: 'DXB',
      rio: 'GIG'
    };
    return map[id] || 'STAMP';
  };

  return (
    <div className="min-h-screen lg:h-screen overflow-y-auto lg:overflow-hidden paper-texture flex flex-col justify-between py-3 px-4 md:px-8 font-sans selection:bg-neutral-800 selection:text-white transition-all duration-500">
      
      {/* Editorial Mini Header (Takes negligible space, locks layout) */}
      <header className="w-full max-w-6xl mx-auto flex justify-between items-baseline mb-2 border-b border-neutral-200/40 pb-1.5 opacity-80">
        <span className="text-[12px] font-serif font-medium tracking-wide text-neutral-800 lowercase">
          soundscapes of place
        </span>
        <span className="text-[8px] font-sans tracking-widest text-neutral-400 uppercase font-light">
          procedural audio instrument
        </span>
      </header>

      {/* Navigation: Shrunk Passport Stamps */}
      <nav className="w-full max-w-3xl mx-auto mb-2 md:mb-4">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 justify-items-center">
          {cities.map((city) => {
            const isActive = activeCity.id === city.id;
            return (
              <button
                key={city.id}
                onClick={() => handleCityChange(city)}
                className={`relative w-16 h-20 md:w-20 md:h-24 border flex flex-col items-center justify-between p-1.5 cursor-pointer transition-all duration-500 group rounded-sm
                  ${isActive 
                    ? 'border-neutral-800 shadow-[0_4px_12px_rgba(0,0,0,0.025)] translate-y-[-1px]' 
                    : 'border-neutral-200/80 bg-[#FCFAF5]/30 hover:border-neutral-400 hover:translate-y-[-0.5px]'
                  }
                `}
                style={isActive ? { 
                  borderColor: city.accentColor,
                  backgroundColor: `${city.accentColor}05`
                } : undefined}
              >
                {/* Stamp Outer Scalloped Dashed Edge */}
                <div 
                  className={`absolute inset-0.5 border border-dashed rounded-xs pointer-events-none transition-colors duration-500
                    ${isActive ? 'opacity-80' : 'border-neutral-200 opacity-40 group-hover:opacity-60'}
                  `}
                  style={isActive ? { borderColor: city.accentColor } : undefined}
                />
                
                {/* Dynamic Airport Code instead of "STAMP" */}
                <span 
                  className="text-[9px] font-sans tracking-wider font-bold opacity-30 group-hover:opacity-55 transition-colors duration-500"
                  style={isActive ? { color: city.accentColor, opacity: 0.7 } : undefined}
                >
                  {getAirportCode(city.id)}
                </span>

                {/* Main Initials / Icon */}
                <span 
                  className="text-lg md:text-xl font-serif font-bold transition-all duration-500"
                  style={{ color: isActive ? city.accentColor : '#404040' }}
                >
                  {city.stampIcon}
                </span>

                {/* City Name */}
                <span 
                  className={`text-[9px] md:text-[10px] font-sans tracking-wide font-medium transition-colors duration-500
                    ${isActive ? 'text-neutral-800' : 'text-neutral-500'}
                  `}
                >
                  {city.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Composition Panel: Flex-1 handles dynamic sizing */}
      <main className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center items-center gap-2 md:gap-4 mb-2 min-h-0">
        
        {/* Playback gesture warning */}
        {needsGesture && (
          <div 
            onClick={unlockAudio}
            className="flex items-center gap-2 px-3 py-1 bg-neutral-100/80 border border-neutral-200/50 rounded-sm text-[10px] font-sans text-neutral-500 cursor-pointer hover:bg-neutral-200/50 transition-editorial animate-bounce mb-1"
          >
            <Headphones size={12} className="animate-pulse" />
            <span>Click to enable browser audio synthesis</span>
          </div>
        )}

        {/* Balanced Columns Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center flex-1 min-h-0">
          
          {/* Left Column: 4 Sound Controls */}
          <div className="lg:col-span-3 grid grid-cols-4 lg:grid-cols-2 gap-3 md:gap-4 justify-items-center order-2 lg:order-1">
            {activeCity.sounds.slice(0, 4).map((sound) => (
              <SoundButton
                key={sound.id}
                sound={sound}
                isActive={activeSounds.includes(sound.id)}
                onToggle={() => handleSoundToggle(sound)}
                accentColor={activeCity.accentColor}
                accentGlow={activeCity.accentClass.glow}
              />
            ))}
          </div>

          {/* Center Column: Postcard Frame */}
          <div className="lg:col-span-6 w-full order-1 lg:order-2 flex justify-center items-center min-h-0">
            <CityCard 
              city={activeCity} 
              isPlayingAny={activeSounds.length > 0 && !isMuted} 
            />
          </div>

          {/* Right Column: Remaining 4 Sound Controls */}
          <div className="lg:col-span-3 grid grid-cols-4 lg:grid-cols-2 gap-3 md:gap-4 justify-items-center order-3">
            {activeCity.sounds.slice(4).map((sound) => (
              <SoundButton
                key={sound.id}
                sound={sound}
                isActive={activeSounds.includes(sound.id)}
                onToggle={() => handleSoundToggle(sound)}
                accentColor={activeCity.accentColor}
                accentGlow={activeCity.accentClass.glow}
              />
            ))}
          </div>

        </div>
      </main>

      {/* Bottom Control Bar */}
      <footer className="w-full max-w-5xl mx-auto border-t border-neutral-200/60 pt-3 mt-1 flex flex-col md:flex-row justify-between items-center gap-3">
        
        {/* Dynamic Composed Sentence with Canvas Wave Background */}
        <div className="relative flex-1 w-full text-center md:text-left py-1 min-h-[36px] flex items-center justify-center md:justify-start overflow-hidden">
          <canvas 
            ref={canvasRef} 
            className="absolute inset-x-0 bottom-0 top-0 h-full w-full pointer-events-none opacity-40"
          />
          <p className="relative z-10 text-xs md:text-sm font-serif italic text-neutral-700 tracking-wide pr-6">
            {composedSentence}
          </p>
        </div>

        {/* Master Audio Controls */}
        <div className="flex items-center gap-5 w-full md:w-auto justify-center md:justify-end border-l-0 md:border-l border-neutral-100 pl-0 md:pl-5">
          
          {/* Sparkles / Random composition generator */}
          <button
            onClick={handleRandomCompose}
            className="flex items-center gap-1.5 text-[10px] font-sans tracking-widest text-neutral-400 hover:text-neutral-700 font-semibold uppercase transition-colors duration-300"
            title="Generate random soundscape composition"
          >
            <Sparkles size={13} style={{ color: activeCity.accentColor }} />
            <span>Compose</span>
          </button>

          {/* Reset Control */}
          <button
            onClick={handleReset}
            disabled={activeSounds.length === 0}
            className={`flex items-center gap-1.5 text-[10px] font-sans tracking-widest font-semibold uppercase transition-colors duration-300
              ${activeSounds.length > 0 
                ? 'text-neutral-400 hover:text-neutral-700' 
                : 'text-neutral-200 cursor-not-allowed'
              }
            `}
            title="Reset active sounds"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>

          {/* Divider */}
          <div className="w-[1px] h-3 bg-neutral-200/80" />

          {/* Master Volume Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMuted(prev => !prev)}
              className="text-neutral-400 hover:text-neutral-700 transition-colors duration-300 focus:outline-none"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 md:w-20 h-[3px] bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-800 focus:outline-none hover:bg-neutral-300 transition-colors"
              aria-label="Master volume slider"
            />
          </div>

        </div>
      </footer>
    </div>
  );
};

export default App;

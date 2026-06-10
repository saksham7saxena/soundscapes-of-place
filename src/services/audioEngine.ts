// Web Audio API Ambient Synthesis Engine for "Soundscapes of Place"

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private analyser: AnalyserNode | null = null;
  private activeSounds: Map<string, {
    sources: any[]; // Nodes associated with this sound
    gainNode: GainNode;
    intervalIds: number[];
  }> = new Map();
  private volume: number = 0.6; // Default master volume
  private isMuted: boolean = false;
  private stateListeners: Set<() => void> = new Set();

  constructor() {
    // We don't initialize here to prevent browser blocking.
    // Initialization happens on first user interaction.
  }

  // Retrieve the analyser node for visualizer drawings
  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  // State subscription methods for React integration
  public addStateListener(listener: () => void) {
    this.stateListeners.add(listener);
  }

  public removeStateListener(listener: () => void) {
    this.stateListeners.delete(listener);
  }

  private notifyStateListeners() {
    this.stateListeners.forEach(listener => {
      try {
        listener();
      } catch (e) {
        console.error('State listener failed:', e);
      }
    });
  }

  public getState(): string {
    return this.ctx ? this.ctx.state : 'uninitialized';
  }

  // Initialize the context
  public async init(): Promise<void> {
    if (this.ctx) {
      if (this.ctx.state !== 'running') {
        try {
          await this.ctx.resume();
        } catch (e) {
          console.error('Failed to resume AudioContext:', e);
        }
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      // Setup limiter/compressor for clean layering
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -12; // dB
      this.compressor.knee.value = 10;
      this.compressor.ratio.value = 4;
      this.compressor.attack.value = 0.05; // seconds
      this.compressor.release.value = 0.25; // seconds

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;

      // Subtle global feedback delay loop for dark, warm reflections (spatial depth)
      const delayNode = this.ctx.createDelay(1.0);
      delayNode.delayTime.setValueAtTime(0.42, this.ctx.currentTime); // 420ms reflection delay
      const delayGain = this.ctx.createGain();
      delayGain.gain.setValueAtTime(0.12, this.ctx.currentTime); // soft feedback echo volume
      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(1000, this.ctx.currentTime); // filter out harsh high tones from echo

      // Connect delay loop
      delayNode.connect(delayFilter);
      delayFilter.connect(delayGain);
      delayGain.connect(delayNode);

      // Connections:
      // Synth Channels -> Compressor -> MasterGain -> Analyser -> Destination
      //              Compressor -> DelayNode -> MasterGain (mix delay output in)
      this.compressor.connect(this.masterGain);
      this.compressor.connect(delayNode);
      delayGain.connect(this.masterGain);
      
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Listen to state changes on the AudioContext
      this.ctx.onstatechange = () => {
        this.notifyStateListeners();
      };

      // Try to resume if it starts suspended
      if (this.ctx.state !== 'running') {
        try {
          await this.ctx.resume();
        } catch (e) {
          console.error('Failed to resume AudioContext during creation:', e);
        }
      }

      // Play a short silent buffer to warm up / unlock audio output on iOS
      this.unlockSilentBuffer();
      
      this.notifyStateListeners();
    } catch (e) {
      console.error('Failed to initialize Web Audio API:', e);
    }
  }

  private unlockSilentBuffer() {
    if (!this.ctx) return;
    try {
      const buffer = this.ctx.createBuffer(1, 1, 22050);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.ctx.destination);
      source.start(0);
      source.onended = () => {
        try {
          source.disconnect();
        } catch (e) {}
      };
    } catch (e) {
      console.warn('Failed to play silent buffer:', e);
    }
  }

  // Set master volume
  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx?.currentTime || 0);
    }
  }

  // Get current master volume
  public getVolume(): number {
    return this.volume;
  }

  // Toggle master mute
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx?.currentTime || 0
      );
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Track an active source node (oscillator or buffer source) and automatically clean it up on completion
  private trackSource(source: any, soundObj: any) {
    if (!source) return;
    soundObj.sources.push(source);
    source.onended = () => {
      const idx = soundObj.sources.indexOf(source);
      if (idx > -1) {
        soundObj.sources.splice(idx, 1);
      }
    };
  }

  // Start playing a sound
  public async startSound(soundId: string, synthType: string, params: any) {
    await this.init(); // Auto-init if not done

    if (!this.ctx || !this.compressor) return;

    // If already playing, don't restart
    if (this.activeSounds.has(soundId)) return;

    // Create a local gain node for this specific sound channel
    const channelGain = this.ctx.createGain();
    channelGain.gain.setValueAtTime(0, this.ctx.currentTime); // Start silent
    channelGain.connect(this.compressor);

    // Fade in softly over 1.5 seconds
    channelGain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 1.5);

    const soundObj: {
      sources: any[];
      gainNode: GainNode;
      intervalIds: number[];
    } = {
      sources: [],
      gainNode: channelGain,
      intervalIds: []
    };

    this.activeSounds.set(soundId, soundObj);

    // Call specific synthesizer builder
    try {
      switch (synthType) {
        case 'drone':
          this.buildDrone(channelGain, params, soundObj);
          break;
        case 'chime':
          this.buildChime(channelGain, params, soundObj);
          break;
        case 'noise':
          this.buildNoise(channelGain, params, soundObj);
          break;
        case 'percussion':
          this.buildPercussion(channelGain, params, soundObj);
          break;
        case 'accordion':
          this.buildAccordion(channelGain, params, soundObj);
          break;
        case 'saxophone':
          this.buildSaxophone(channelGain, params, soundObj);
          break;
        case 'samba':
          this.buildSamba(channelGain, params, soundObj);
          break;
        case 'birds':
          this.buildBirds(channelGain, params, soundObj);
          break;
        default:
          this.buildDrone(channelGain, params, soundObj);
      }
    } catch (e) {
      console.error(`Error building synth type ${synthType} for sound ${soundId}:`, e);
    }
  }

  // Stop playing a sound with a clean fadeout
  public stopSound(soundId: string) {
    const soundObj = this.activeSounds.get(soundId);
    if (!soundObj) return;

    const currentCtx = this.ctx;
    if (!currentCtx) return;

    const fadeOutTime = 1.0; // 1 second fadeout

    // Fade out gain
    soundObj.gainNode.gain.cancelScheduledValues(currentCtx.currentTime);
    soundObj.gainNode.gain.setValueAtTime(soundObj.gainNode.gain.value, currentCtx.currentTime);
    soundObj.gainNode.gain.linearRampToValueAtTime(0, currentCtx.currentTime + fadeOutTime);

    // Clear loops
    soundObj.intervalIds.forEach(id => clearInterval(id));

    // Stop and disconnect nodes after fadeout finishes
    setTimeout(() => {
      soundObj.sources.forEach(node => {
        try {
          if (node.stop) {
            node.stop();
          }
          node.disconnect();
        } catch (e) {
          // Node might have already finished
        }
      });
      try {
        soundObj.gainNode.disconnect();
      } catch (e) {}
      this.activeSounds.delete(soundId);
    }, fadeOutTime * 1050);
  }

  // Stop all sounds
  public stopAll() {
    Array.from(this.activeSounds.keys()).forEach(soundId => {
      this.stopSound(soundId);
    });
  }

  // Active sounds list helper
  public isSoundPlaying(soundId: string): boolean {
    return this.activeSounds.has(soundId);
  }

  // ==========================================
  // SYNTHESIZER BUILDERS
  // ==========================================

  // 1. Drones / Ambient Hums (Auto Horns, Sirens, Supercars, Screeches)
  private buildDrone(gainNode: GainNode, params: any, soundObj: any) {
    if (!this.ctx) return;

    const baseFreq = params.frequency || 200;
    const filterFreq = params.filterFreq || 1000;
    const pan = params.pan || 0;

    // Create Stereo Panner (defensively fallback if unsupported in some mobile browsers/webviews)
    let panner: any;
    if (this.ctx.createStereoPanner) {
      panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(pan, this.ctx.currentTime);
      panner.connect(gainNode);
    } else {
      panner = this.ctx.createGain();
      panner.connect(gainNode);
    }

    // Setup Filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, this.ctx.currentTime);
    filter.connect(panner);

    // Determine drone style based on parameters
    if (baseFreq === 380) {
      // Delhi Auto Horn style - periodic double honk
      const triggerHonk = () => {
        if (!this.ctx) return;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const honkGain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(380, this.ctx.currentTime);
        osc2.frequency.setValueAtTime(450, this.ctx.currentTime); // slightly dissonant interval
        
        honkGain.gain.setValueAtTime(0, this.ctx.currentTime);
        
        // Double honk envelope
        const now = this.ctx.currentTime;
        // First honk
        honkGain.gain.linearRampToValueAtTime(0.3, now + 0.05);
        honkGain.gain.setValueAtTime(0.3, now + 0.25);
        honkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        // Second honk
        honkGain.gain.linearRampToValueAtTime(0.3, now + 0.45);
        honkGain.gain.setValueAtTime(0.3, now + 0.65);
        honkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc1.connect(honkGain);
        osc2.connect(honkGain);
        honkGain.connect(filter);

        this.trackSource(osc1, soundObj);
        this.trackSource(osc2, soundObj);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.8);
        osc2.stop(now + 0.8);
      };

      triggerHonk();
      const interval = setInterval(triggerHonk, 6000 + Math.random() * 3000);
      soundObj.intervalIds.push(interval);

    } else if (baseFreq === 430) {
      // NYC Cab Honk style - quick sharp double honks
      const triggerHonk = () => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const honkGain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(430, this.ctx.currentTime);
        honkGain.gain.setValueAtTime(0, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        honkGain.gain.linearRampToValueAtTime(0.2, now + 0.02);
        honkGain.gain.setValueAtTime(0.2, now + 0.12);
        honkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        
        // Second quick honk
        honkGain.gain.linearRampToValueAtTime(0.2, now + 0.22);
        honkGain.gain.setValueAtTime(0.2, now + 0.32);
        honkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(honkGain);
        honkGain.connect(filter);

        this.trackSource(osc, soundObj);

        osc.start(now);
        osc.stop(now + 0.5);
      };

      setTimeout(triggerHonk, 1000);
      const interval = setInterval(triggerHonk, 7000 + Math.random() * 4000);
      soundObj.intervalIds.push(interval);

    } else if (baseFreq === 1200) {
      // NY Subway Screech style - metallic squeals
      const triggerScreech = () => {
        if (!this.ctx) return;
        
        // Use filtered noise + sine sweep
        const bufferSize = this.ctx.sampleRate * 2.5; // 2.5 seconds
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = buffer;

        const screechFilter = this.ctx.createBiquadFilter();
        screechFilter.type = 'bandpass';
        screechFilter.frequency.setValueAtTime(2500, this.ctx.currentTime);
        screechFilter.Q.setValueAtTime(8, this.ctx.currentTime);

        const localGain = this.ctx.createGain();
        localGain.gain.setValueAtTime(0, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        // Long build up screech
        localGain.gain.linearRampToValueAtTime(0.05, now + 0.8);
        // Modulate filter frequency to sound like movement
        screechFilter.frequency.exponentialRampToValueAtTime(4000, now + 1.2);
        screechFilter.frequency.exponentialRampToValueAtTime(1800, now + 2.0);
        
        localGain.gain.setValueAtTime(0.05, now + 2.0);
        localGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

        noiseNode.connect(screechFilter);
        screechFilter.connect(localGain);
        localGain.connect(panner);

        this.trackSource(noiseNode, soundObj);

        noiseNode.start(now);
        noiseNode.stop(now + 2.5);
      };

      triggerScreech();
      const interval = setInterval(triggerScreech, 9000 + Math.random() * 5000);
      soundObj.intervalIds.push(interval);

    } else if (baseFreq === 600) {
      // NYC Siren style - sweeping pitch LFO
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.3, this.ctx.currentTime); // slow sweep
      lfoGain.gain.setValueAtTime(200, this.ctx.currentTime); // pitch width (400Hz to 800Hz)

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      const localGain = this.ctx.createGain();
      localGain.gain.setValueAtTime(0, this.ctx.currentTime);

      // Periodic siren passing
      const triggerSiren = () => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        localGain.gain.linearRampToValueAtTime(0.08, now + 3.0);
        // Slow pan from left to right
        panner.pan.setValueAtTime(-0.8, now);
        panner.pan.linearRampToValueAtTime(0.8, now + 6.0);
        
        localGain.gain.setValueAtTime(0.08, now + 4.5);
        localGain.gain.exponentialRampToValueAtTime(0.001, now + 6.5);
      };

      osc.connect(localGain);
      localGain.connect(panner);

      this.trackSource(osc, soundObj);
      this.trackSource(lfo, soundObj);

      osc.start(this.ctx.currentTime);
      lfo.start(this.ctx.currentTime);

      triggerSiren();
      const interval = setInterval(triggerSiren, 14000);
      soundObj.intervalIds.push(interval);

    } else if (baseFreq === 80) {
      // Dubai Supercar pass-by - low rumbling engine sweep
      const triggerCar = () => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(45, this.ctx.currentTime); // Low engine note

        const carFilter = this.ctx.createBiquadFilter();
        carFilter.type = 'lowpass';
        carFilter.frequency.setValueAtTime(80, this.ctx.currentTime);

        const localGain = this.ctx.createGain();
        localGain.gain.setValueAtTime(0, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        // Panning sweep left-to-right
        panner.pan.setValueAtTime(-0.9, now);
        panner.pan.linearRampToValueAtTime(0.9, now + 3.5);

        // Engine rev and filter open
        localGain.gain.linearRampToValueAtTime(0.3, now + 1.2);
        osc.frequency.linearRampToValueAtTime(120, now + 1.2); // pitch rise (accel)
        carFilter.frequency.exponentialRampToValueAtTime(350, now + 1.2);

        // Doppler effect and fade away
        localGain.gain.setValueAtTime(0.3, now + 1.5);
        osc.frequency.linearRampToValueAtTime(60, now + 2.5); // pitch drop
        carFilter.frequency.exponentialRampToValueAtTime(70, now + 3.0);
        localGain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

        osc.connect(carFilter);
        carFilter.connect(localGain);
        localGain.connect(panner);

        this.trackSource(osc, soundObj);

        osc.start(now);
        osc.stop(now + 3.6);
      };

      triggerCar();
      const interval = setInterval(triggerCar, 11000 + Math.random() * 5000);
      soundObj.intervalIds.push(interval);

    } else if (baseFreq === 1600) {
      // Delhi Pressure Cooker Whistle style - high pitch steam rattle
      const triggerWhistle = () => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        // Pitch sweep up as pressure builds
        osc.frequency.linearRampToValueAtTime(1700, now + 1.2);
        osc.frequency.setValueAtTime(1700, now + 1.2);
        
        // Rapid frequency modulation LFO to simulate the rattling weight (14Hz)
        const rattle = this.ctx.createOscillator();
        const rattleGain = this.ctx.createGain();
        rattle.frequency.setValueAtTime(14, now);
        rattleGain.gain.setValueAtTime(30, now); // frequency wobble width

        rattle.connect(rattleGain);
        rattleGain.connect(osc.frequency);

        // Steam noise
        const steamBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 2.2, this.ctx.sampleRate);
        const steamData = steamBuffer.getChannelData(0);
        for (let i = 0; i < steamData.length; i++) {
          steamData[i] = (Math.random() * 2 - 1) * 0.04;
        }
        const steamSource = this.ctx.createBufferSource();
        steamSource.buffer = steamBuffer;

        const steamFilter = this.ctx.createBiquadFilter();
        steamFilter.type = 'highpass';
        steamFilter.frequency.setValueAtTime(2500, now);

        const whistleGain = this.ctx.createGain();
        whistleGain.gain.setValueAtTime(0, now);
        
        // Whistle crescendo and decrescendo envelope
        whistleGain.gain.linearRampToValueAtTime(0.12, now + 1.2); // build up
        whistleGain.gain.setValueAtTime(0.12, now + 1.6); // sustain screech
        whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0); // sudden pressure release

        osc.connect(whistleGain);
        steamSource.connect(steamFilter);
        steamFilter.connect(whistleGain);
        whistleGain.connect(filter);

        this.trackSource(osc, soundObj);
        this.trackSource(rattle, soundObj);
        this.trackSource(steamSource, soundObj);

        osc.start(now);
        rattle.start(now);
        steamSource.start(now);

        osc.stop(now + 2.1);
        rattle.stop(now + 2.1);
        steamSource.stop(now + 2.1);
      };

      triggerWhistle();
      const interval = setInterval(triggerWhistle, 13000 + Math.random() * 4000);
      soundObj.intervalIds.push(interval);

    } else if (baseFreq === 220 || baseFreq === 280) {
      // Formant-based vocal synthesizer for realistic street calls (Delhi & Rio)
      const triggerCry = () => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        
        // Base voice oscillators (sawtooth + triangle for rich vocal harmonics)
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc2.type = 'triangle';
        
        const voiceGain = this.ctx.createGain();
        voiceGain.gain.setValueAtTime(0, now);
        
        // Vocal Formant parallel filters (F1 and F2 formants)
        const formant1 = this.ctx.createBiquadFilter();
        const formant2 = this.ctx.createBiquadFilter();
        formant1.type = 'bandpass';
        formant2.type = 'bandpass';
        
        let stopTime = now + 1.0;

        if (baseFreq === 220) {
          // Delhi chai vendor voice ("Chai-i!")
          osc1.frequency.setValueAtTime(160, now);
          osc2.frequency.setValueAtTime(162, now); // detuned
          
          // Pitch inflection
          osc1.frequency.linearRampToValueAtTime(210, now + 0.3);
          osc1.frequency.exponentialRampToValueAtTime(140, now + 0.8);
          osc2.frequency.linearRampToValueAtTime(212, now + 0.3);
          osc2.frequency.exponentialRampToValueAtTime(142, now + 0.8);
          
          // Formant center frequencies for "Ah-ee" vowel transition
          formant1.frequency.setValueAtTime(800, now);
          formant1.frequency.exponentialRampToValueAtTime(450, now + 0.8);
          formant1.Q.setValueAtTime(10, now);
          
          formant2.frequency.setValueAtTime(1300, now);
          formant2.frequency.exponentialRampToValueAtTime(2200, now + 0.8);
          formant2.Q.setValueAtTime(10, now);
          
          // Vocal envelope
          voiceGain.gain.linearRampToValueAtTime(0.15, now + 0.15);
          voiceGain.gain.setValueAtTime(0.15, now + 0.5);
          voiceGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
          
          stopTime = now + 1.0;
        } else {
          // Rio beach vendor voice ("Olha-a!")
          osc1.frequency.setValueAtTime(240, now);
          osc2.frequency.setValueAtTime(242, now);
          
          osc1.frequency.linearRampToValueAtTime(280, now + 0.2);
          osc1.frequency.exponentialRampToValueAtTime(190, now + 0.9);
          osc2.frequency.linearRampToValueAtTime(282, now + 0.2);
          osc2.frequency.exponentialRampToValueAtTime(192, now + 0.9);
          
          // Formant center frequencies for "Oh-ah" vowel transition
          formant1.frequency.setValueAtTime(500, now);
          formant1.frequency.exponentialRampToValueAtTime(800, now + 0.9);
          formant1.Q.setValueAtTime(8, now);
          
          formant2.frequency.setValueAtTime(900, now);
          formant2.frequency.exponentialRampToValueAtTime(1400, now + 0.9);
          formant2.Q.setValueAtTime(8, now);
          
          // Vocal envelope
          voiceGain.gain.linearRampToValueAtTime(0.12, now + 0.1);
          voiceGain.gain.setValueAtTime(0.12, now + 0.6);
          voiceGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
          
          stopTime = now + 1.1;
        }
        
        // Add subtle throat noise (soft breath friction)
        const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 1.2, this.ctx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseData.length; i++) {
          noiseData[i] = (Math.random() * 2 - 1) * 0.02; // very quiet
        }
        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.08, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
        
        // Connections: parallel formant filters
        osc1.connect(voiceGain);
        osc2.connect(voiceGain);
        
        voiceGain.connect(formant1);
        voiceGain.connect(formant2);
        
        noiseNode.connect(noiseGain);
        noiseGain.connect(formant1);
        
        formant1.connect(filter);
        formant2.connect(filter);
        
        this.trackSource(osc1, soundObj);
        this.trackSource(osc2, soundObj);
        this.trackSource(noiseNode, soundObj);
        
        osc1.start(now);
        osc2.start(now);
        noiseNode.start(now);

        osc1.stop(stopTime);
        osc2.stop(stopTime);
        noiseNode.stop(stopTime);
      };

      triggerCry();
      const interval = setInterval(triggerCry, 8000 + Math.random() * 4000);
      soundObj.intervalIds.push(interval);

    } else {
      // Continuous low drone default (e.g. Delhi metro rail hum, Rio Cable car whirr)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc2.frequency.setValueAtTime(baseFreq * 1.5 + 1, this.ctx.currentTime); // fifth interval + detune

      const localGain = this.ctx.createGain();
      localGain.gain.setValueAtTime(0.08, this.ctx.currentTime); // quiet

      osc1.connect(localGain);
      osc2.connect(localGain);
      localGain.connect(filter);

      this.trackSource(osc1, soundObj);
      this.trackSource(osc2, soundObj);

      osc1.start(this.ctx.currentTime);
      osc2.start(this.ctx.currentTime);
    }
  }

  private buildChime(gainNode: GainNode, params: any, soundObj: any) {
    if (!this.ctx) return;

    const baseFreq = params.frequency || 880;
    const decay = params.decay || 1.5;

    // Direct connection to gainNode, chimes are simple
    const triggerBell = () => {
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      if (decay > 2.0) {
        // Multi-frequency rich metallic bell (church bell or temple bell)
        // Frequencies are inharmonic overtones
        const overtones = [1.0, 1.5, 2.0, 2.5, 3.2, 4.0];
        const gainRatios = [1.0, 0.6, 0.4, 0.3, 0.15, 0.1];
        
        overtones.forEach((ratio, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const oscGain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(baseFreq * ratio, now);

          oscGain.gain.setValueAtTime(0, now);
          oscGain.gain.linearRampToValueAtTime(0.2 * gainRatios[idx], now + 0.01);
          oscGain.gain.exponentialRampToValueAtTime(0.0001, now + (decay * (1 - idx * 0.12)));

          osc.connect(oscGain);
          oscGain.connect(gainNode); // Bypass chimeGain to prevent double decay

          this.trackSource(osc, soundObj);

          osc.start(now);
          osc.stop(now + decay + 0.2);
        });
      } else if (baseFreq === 1047) {
        // Tokyo Konbini Family Mart Chime
        // Sequence: F#5, D5, A4, D5, E5, A5
        const notes = [739.99, 587.33, 440.00, 587.33, 659.25, 880.00];
        const timing = [0.0, 0.25, 0.5, 0.75, 1.0, 1.25];
        const noteDuration = 0.35;

        notes.forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const oscGain = this.ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + timing[idx]);

          oscGain.gain.setValueAtTime(0, now + timing[idx]);
          oscGain.gain.linearRampToValueAtTime(0.15, now + timing[idx] + 0.008);
          oscGain.gain.exponentialRampToValueAtTime(0.001, now + timing[idx] + noteDuration);

          osc.connect(oscGain);
          oscGain.connect(gainNode); // Connect directly
          
          this.trackSource(osc, soundObj);

          osc.start(now + timing[idx]);
          osc.stop(now + timing[idx] + noteDuration + 0.1);
        });
      } else if (baseFreq === 880) {
        // Tokyo Station Melody Chime - simple sweet 4 note repeating sequence
        const notes = [880, 987.77, 1174.66, 1318.51];
        const timing = [0.0, 0.2, 0.4, 0.6];
        const noteDuration = 0.45;

        notes.forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const oscGain = this.ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + timing[idx]);

          oscGain.gain.setValueAtTime(0, now + timing[idx]);
          oscGain.gain.linearRampToValueAtTime(0.12, now + timing[idx] + 0.008);
          oscGain.gain.exponentialRampToValueAtTime(0.001, now + timing[idx] + noteDuration);

          osc.connect(oscGain);
          oscGain.connect(gainNode); // Connect directly
          
          this.trackSource(osc, soundObj);

          osc.start(now + timing[idx]);
          osc.stop(now + timing[idx] + noteDuration + 0.1);
        });
      } else if (baseFreq === 1500) {
        // Tokyo Crossing Chirp - bird crossing chirp sound (freq sweep)
        const chirpCount = 2;
        const noteDuration = 0.22;
        
        for (let i = 0; i < chirpCount; i++) {
          const startTime = now + (i * 0.4);
          const osc = this.ctx.createOscillator();
          const oscGain = this.ctx.createGain();

          osc.type = 'sine';
          // Sweep from 1200Hz up to 2600Hz
          osc.frequency.setValueAtTime(1200, startTime);
          osc.frequency.exponentialRampToValueAtTime(2600, startTime + noteDuration);

          oscGain.gain.setValueAtTime(0, startTime);
          oscGain.gain.linearRampToValueAtTime(0.18, startTime + 0.01);
          oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);

          osc.connect(oscGain);
          oscGain.connect(gainNode); // Connect directly

          this.trackSource(osc, soundObj);

          osc.start(startTime);
          osc.stop(startTime + noteDuration + 0.1);
        }
      } else if (baseFreq === 580) {
        // Paris Metro Door warning buzzer (classic raw buzz tone)
        const buzzOsc = this.ctx.createOscillator();
        const buzzGain = this.ctx.createGain();
        
        buzzOsc.type = 'sawtooth'; // rich buzzy harmonic
        buzzOsc.frequency.setValueAtTime(440, now);
        
        // Lowpass filter to make it sound slightly vintage and muffled
        const buzzFilter = this.ctx.createBiquadFilter();
        buzzFilter.type = 'lowpass';
        buzzFilter.frequency.setValueAtTime(1000, now);

        buzzGain.gain.setValueAtTime(0, now);
        buzzGain.gain.linearRampToValueAtTime(0.15, now + 0.05);
        buzzGain.gain.setValueAtTime(0.15, now + 1.2); // play for 1.2s
        buzzGain.gain.exponentialRampToValueAtTime(0.001, now + 1.35);

        // Add the pneumatic "clack" closing thud at 1.3s
        const clackOsc = this.ctx.createOscillator();
        const clackGain = this.ctx.createGain();
        clackOsc.type = 'triangle';
        clackOsc.frequency.setValueAtTime(100, now + 1.3);
        clackOsc.frequency.exponentialRampToValueAtTime(40, now + 1.45);
        
        clackGain.gain.setValueAtTime(0, now);
        clackGain.gain.setValueAtTime(0.25, now + 1.3);
        clackGain.gain.exponentialRampToValueAtTime(0.001, now + 1.45);

        buzzOsc.connect(buzzFilter);
        buzzFilter.connect(buzzGain);
        buzzGain.connect(gainNode);

        clackOsc.connect(clackGain);
        clackGain.connect(gainNode);

        this.trackSource(buzzOsc, soundObj);
        this.trackSource(clackOsc, soundObj);

        buzzOsc.start(now);
        clackOsc.start(now + 1.3);

        buzzOsc.stop(now + 1.5);
        clackOsc.stop(now + 1.6);

      } else if (baseFreq === 650) {
        // Delhi Metro Door Chime (bright ascending three-tone chime: G5, C6, E6)
        const notes = [783.99, 1046.50, 1318.51];
        const timing = [0.0, 0.18, 0.36];
        const noteDuration = 0.5;

        notes.forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const oscGain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + timing[idx]);

          oscGain.gain.setValueAtTime(0, now + timing[idx]);
          oscGain.gain.linearRampToValueAtTime(0.2, now + timing[idx] + 0.005);
          oscGain.gain.exponentialRampToValueAtTime(0.001, now + timing[idx] + noteDuration);

          osc.connect(oscGain);
          oscGain.connect(gainNode);

          this.trackSource(osc, soundObj);

          osc.start(now + timing[idx]);
          osc.stop(now + timing[idx] + noteDuration + 0.1);
        });

      } else if (baseFreq === 784) {
        // Dubai Metro Door Chime (High-tech two-tone electronic alert: Bb5, Eb6)
        const notes = [932.33, 1244.51];
        const timing = [0.0, 0.3];
        const noteDuration = 0.6;

        notes.forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const oscGain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + timing[idx]);

          oscGain.gain.setValueAtTime(0, now + timing[idx]);
          oscGain.gain.linearRampToValueAtTime(0.18, now + timing[idx] + 0.005);
          oscGain.gain.exponentialRampToValueAtTime(0.001, now + timing[idx] + noteDuration);

          osc.connect(oscGain);
          oscGain.connect(gainNode);

          this.trackSource(osc, soundObj);

          osc.start(now + timing[idx]);
          osc.stop(now + timing[idx] + noteDuration + 0.1);
        });

      } else {
        // Standard high single chime (Chai Glass, Bicycle Bell, elevator ding, metro chime)
        const chimeGain = this.ctx.createGain();
        chimeGain.gain.setValueAtTime(0, now);
        chimeGain.gain.linearRampToValueAtTime(0.25, now + 0.005);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + decay);

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        
        osc1.type = 'sine';
        osc2.type = 'sine';
        
        osc1.frequency.setValueAtTime(baseFreq, now);
        
        // Determine overtone ratio
        const overtoneFreq = baseFreq * (baseFreq > 2000 ? 1.25 : 1.5);
        osc2.frequency.setValueAtTime(overtoneFreq, now);

        const osc2Gain = this.ctx.createGain();
        osc2Gain.gain.setValueAtTime(0, now);
        osc2Gain.gain.linearRampToValueAtTime(0.08, now + 0.002);
        osc2Gain.gain.exponentialRampToValueAtTime(0.0001, now + (decay * 0.6));

        osc1.connect(chimeGain);
        osc2.connect(osc2Gain);
        osc2Gain.connect(chimeGain);
        chimeGain.connect(gainNode);
        
        this.trackSource(osc1, soundObj);
        this.trackSource(osc2, soundObj);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + decay + 0.2);
        osc2.stop(now + decay + 0.2);
      }
    };

    triggerBell();
    // Repeating interval based on sound category
    let loopDelay = 6000;
    if (baseFreq === 2800) loopDelay = 4200 + Math.random() * 2000; // chai clink
    if (baseFreq === 2200) loopDelay = 5000 + Math.random() * 3000; // bicycle bell
    if (baseFreq === 1047) loopDelay = 12000; // konbini door chime
    if (baseFreq === 880) loopDelay = 8000; // station melody
    if (baseFreq === 1500) loopDelay = 4000; // crossing chirp
    if (baseFreq === 440) loopDelay = 14000; // temple bell
    if (baseFreq === 180) loopDelay = 15000; // church bell
    if (baseFreq === 980) loopDelay = 11000; // elevator ding
    if (baseFreq === 784) loopDelay = 12000; // Dubai metro chime
    if (baseFreq === 523.25) loopDelay = 14000; // PA chime

    const interval = setInterval(triggerBell, loopDelay);
    soundObj.intervalIds.push(interval);
  }

  // 3. Noise / Textures (Monsoon Rain, Waves, Murmurs, Wind, Steam)
  private buildNoise(gainNode: GainNode, params: any, soundObj: any) {
    if (!this.ctx) return;

    // Generate White Noise Buffer (approx 4 seconds loop)
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1; // white noise
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Configure Bandpass/Lowpass Filter
    const filter = this.ctx.createBiquadFilter();
    const filterFreq = params.filterFreq || 800;
    const filterQ = params.filterQ || 1.0;

    if (params.filterFreq && params.filterFreq > 2000) {
      filter.type = 'highpass';
    } else {
      filter.type = params.filterQ ? 'bandpass' : 'lowpass';
    }
    
    filter.frequency.setValueAtTime(filterFreq, this.ctx.currentTime);
    filter.Q.setValueAtTime(filterQ, this.ctx.currentTime);

    // Modulation for swell behaviors (Waves / Wind)
    const localGain = this.ctx.createGain();
    localGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    // Connections
    noiseSource.connect(filter);
    filter.connect(localGain);
    localGain.connect(gainNode);

    noiseSource.start(this.ctx.currentTime);
    this.trackSource(noiseSource, soundObj);

    // Apply LFO wave/wind swells
    if (filterFreq === 250 || filterFreq === 150) {
      // Beach / Marina Waves swell envelope (sine LFO)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.16, this.ctx.currentTime); // 6-second wave cycle
      
      lfoGain.gain.setValueAtTime(100, this.ctx.currentTime); // filter sweep width
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      // Volume swell LFO
      const volLfo = this.ctx.createOscillator();
      const volGain = this.ctx.createGain();
      volLfo.frequency.setValueAtTime(0.16, this.ctx.currentTime);
      volGain.gain.setValueAtTime(0.12, this.ctx.currentTime); // volume fluctuate

      // Offset
      localGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      volLfo.connect(volGain);
      volGain.connect(localGain.gain);

      this.trackSource(volLfo, soundObj);
      this.trackSource(lfo, soundObj);

      volLfo.start(this.ctx.currentTime);
      lfo.start(this.ctx.currentTime);

    } else if (filterFreq === 300 && filterQ === 0.2) {
      // Desert Wind - howling filter sweeps
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // very slow shift
      
      lfoGain.gain.setValueAtTime(180, this.ctx.currentTime); // sweeping range
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      this.trackSource(lfo, soundObj);

      lfo.start(this.ctx.currentTime);
    }

    // Cozy granular raindrop generator for Rain soundscapes
    if (filterFreq === 800 || filterFreq === 1100) {
      const triggerDrop = () => {
        if (!this.ctx || Math.random() > 0.35) return;
        const now = this.ctx.currentTime;
        const dropOsc = this.ctx.createOscillator();
        const dropGain = this.ctx.createGain();
        
        dropOsc.type = 'sine';
        // Random high frequency drops
        dropOsc.frequency.setValueAtTime(1400 + Math.random() * 900, now);
        dropOsc.frequency.exponentialRampToValueAtTime(120, now + 0.015);
        
        dropGain.gain.setValueAtTime(0, now);
        dropGain.gain.linearRampToValueAtTime(0.003, now + 0.001); // extremely soft
        dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);
        
        dropOsc.connect(dropGain);
        dropGain.connect(gainNode);
        
        this.trackSource(dropOsc, soundObj);

        dropOsc.start(now);
        dropOsc.stop(now + 0.03);
      };
      
      const rainTimer = setInterval(triggerDrop, 90);
      soundObj.intervalIds.push(rainTimer);
    }
  }

  // 4. Percussion / Rhythmic Thuds (Footsteps, Flip-Flops, Basketballs)
  private buildPercussion(gainNode: GainNode, params: any, soundObj: any) {
    if (!this.ctx) return;

    const baseFreq = params.frequency || 120;
    const decay = params.decay || 0.1;
    const rhythmSpeed = params.rhythmSpeed || 1; // times per second

    const triggerThud = () => {
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const localGain = this.ctx.createGain();

      osc.type = 'sine';
      
      if (baseFreq === 90) {
        // Basketball bounce - pitch drop
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + decay);
        
        // Add a hollow court resonance ring
        const ringOsc = this.ctx.createOscillator();
        const ringGain = this.ctx.createGain();
        ringOsc.type = 'sine';
        ringOsc.frequency.setValueAtTime(950, now);
        ringGain.gain.setValueAtTime(0.012, now);
        ringGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        
        ringOsc.connect(ringGain);
        ringGain.connect(gainNode);
        
        this.trackSource(ringOsc, soundObj);
        
        ringOsc.start(now);
        ringOsc.stop(now + 0.1);
      } else if (baseFreq === 100) {
        // Football Kick - sweep pitch down and add transient click for speaker audibility
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + decay);

        // Transient leather impact click
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(1000, now);
        clickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.012);

        clickGain.gain.setValueAtTime(0.08, now);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

        clickOsc.connect(clickGain);
        clickGain.connect(gainNode);

        this.trackSource(clickOsc, soundObj);

        clickOsc.start(now);
        clickOsc.stop(now + 0.03);
      } else if (baseFreq === 300) {
        // Flip-flops: double slap (sole tapping pavement)
        osc.frequency.setValueAtTime(baseFreq, now);
        
        const slapTime = now + 0.07;
        const slapOsc = this.ctx.createOscillator();
        const slapGain = this.ctx.createGain();
        
        slapOsc.type = 'triangle';
        slapOsc.frequency.setValueAtTime(550, slapTime);
        
        slapGain.gain.setValueAtTime(0, now);
        slapGain.gain.setValueAtTime(0, slapTime);
        slapGain.gain.linearRampToValueAtTime(0.08, slapTime + 0.002);
        slapGain.gain.exponentialRampToValueAtTime(0.0001, slapTime + 0.018);
        
        slapOsc.connect(slapGain);
        slapGain.connect(gainNode);
        
        this.trackSource(slapOsc, soundObj);
        
        slapOsc.start(now);
        slapOsc.stop(now + 0.12);
      } else {
        osc.frequency.setValueAtTime(baseFreq, now);
      }

      localGain.gain.setValueAtTime(0, now);
      localGain.gain.linearRampToValueAtTime(0.22, now + 0.005);
      localGain.gain.exponentialRampToValueAtTime(0.001, now + decay);

      // Add a tiny bit of noise scuff for footsteps
      if (baseFreq === 120 || baseFreq === 300) {
        const bufferSize = this.ctx.sampleRate * 0.05; // 50ms scuff
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = buffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(600, now);
        noiseFilter.Q.setValueAtTime(3, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.12, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        noiseNode.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(gainNode);

        this.trackSource(noiseNode, soundObj);

        noiseNode.start(now);
      }

      osc.connect(localGain);
      localGain.connect(gainNode);

      this.trackSource(osc, soundObj);

      osc.start(now);
      osc.stop(now + decay + 0.1);
    };

    // Trigger rhythmically
    let pulseInterval = 1000 / rhythmSpeed;
    
    if (baseFreq === 90) {
      // Basketball bounce - irregular basketball dribble pattern rather than grid clock
      const triggerIrregularDribble = () => {
        // 5 bounces in quick succession, then a pause
        setTimeout(triggerThud, 0);
        setTimeout(triggerThud, 450);
        setTimeout(triggerThud, 800);
        setTimeout(triggerThud, 1100);
        setTimeout(triggerThud, 1300);
      };
      
      triggerIrregularDribble();
      const interval = setInterval(triggerIrregularDribble, 4500);
      soundObj.intervalIds.push(interval);
    } else {
      triggerThud();
      const interval = setInterval(triggerThud, pulseInterval);
      soundObj.intervalIds.push(interval);
    }
  }

  // 5. Accordion (Parisian street instrument)
  private buildAccordion(gainNode: GainNode, params: any, soundObj: any) {
    if (!this.ctx) return;

    // We synthesize a lovely C-major or A-minor accordion drone
    // Accordion uses detuned triangle waves (representing reeds)
    const baseFreq = params.frequency || 440;
    const reedsCount = 3;
    const detuneSpread = params.detune || 8;

    const chordNode = this.ctx.createGain();
    chordNode.gain.setValueAtTime(0.15, this.ctx.currentTime);
    chordNode.connect(gainNode);

    // Play a lovely major triad (1, 1.25, 1.5 - root, third, fifth)
    // C4, E4, G4 or similar
    const chordRatios = [1.0, 1.25, 1.5];

    // Accordion reed tremolo LFO (fast 5.8Hz vibrato)
    const vibratoLfo = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibratoLfo.frequency.setValueAtTime(5.8, this.ctx.currentTime);
    vibratoGain.gain.setValueAtTime(4, this.ctx.currentTime); // detune modulation width
    
    vibratoLfo.connect(vibratoGain);
    
    this.trackSource(vibratoLfo, soundObj);

    vibratoLfo.start(this.ctx.currentTime);

    chordRatios.forEach(ratio => {
      if (!this.ctx) return;
      
      // For each note, build detuned reeds
      for (let i = 0; i < reedsCount; i++) {
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        
        const freqVal = baseFreq * ratio;
        const detuneVal = (i - 1) * detuneSpread;

        osc.frequency.setValueAtTime(freqVal, this.ctx.currentTime);
        osc.detune.setValueAtTime(detuneVal, this.ctx.currentTime);

        // Modulate frequency with vibrato LFO
        vibratoGain.connect(osc.detune);

        osc.connect(chordNode);
        
        this.trackSource(osc, soundObj);

        osc.start(this.ctx.currentTime);
      }
    });

    // Modulate overall volume to simulate bellows (slow breathing LFO)
    const bellowsLfo = this.ctx.createOscillator();
    const bellowsGain = this.ctx.createGain();

    bellowsLfo.frequency.setValueAtTime(0.25, this.ctx.currentTime); // 4 seconds breathe
    bellowsGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    bellowsLfo.connect(bellowsGain);
    bellowsGain.connect(chordNode.gain);

    this.trackSource(bellowsLfo, soundObj);

    bellowsLfo.start(this.ctx.currentTime);
  }

  // 6. Samba Drums (Rio samba step shaker and drum hits)
  private buildSamba(gainNode: GainNode, _params: any, soundObj: any) {
    if (!this.ctx) return;

    const tempo = 120; // BPM
    const stepTime = 60 / tempo / 4; // 16th note step in seconds

    // Synthesize simple drums programmatically
    const playShaker = (time: number, accent: boolean) => {
      if (!this.ctx) return;
      
      // Tiny bandpass white noise burst
      const bufferSize = this.ctx.sampleRate * 0.04;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(8000, time);
      filter.Q.setValueAtTime(4, time);

      const sGain = this.ctx.createGain();
      sGain.gain.setValueAtTime(0, time);
      sGain.gain.linearRampToValueAtTime(accent ? 0.06 : 0.02, time + 0.002);
      sGain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

      noiseNode.connect(filter);
      filter.connect(sGain);
      sGain.connect(gainNode);

      this.trackSource(noiseNode, soundObj);

      noiseNode.start(time);
      noiseNode.stop(time + 0.05);
    };

    const playSurdo = (time: number, pitch: number) => {
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const dGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, time);
      osc.frequency.linearRampToValueAtTime(pitch * 0.8, time + 0.15); // pitch slide

      dGain.gain.setValueAtTime(0, time);
      dGain.gain.linearRampToValueAtTime(0.2, time + 0.005);
      dGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

      osc.connect(dGain);
      dGain.connect(gainNode);

      this.trackSource(osc, soundObj);

      osc.start(time);
      osc.stop(time + 0.25);
    };

    const playLoop = () => {
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // 16th note steps loop (1 bar = 16 steps)
      for (let step = 0; step < 16; step++) {
        const time = now + step * stepTime;
        
        // Shaker constant pattern
        const isAccent = (step % 4 === 2 || step % 4 === 0);
        playShaker(time, isAccent);

        // Surdo drum on beats 1 and 3 (step 0 and step 8)
        if (step === 0) {
          playSurdo(time, 65); // Low Surdo
        }
        if (step === 8) {
          playSurdo(time, 55); // Deep Surdo
        }

        // Tamborim high click on steps 3, 6, 11, 14
        if (step === 3 || step === 6 || step === 11 || step === 14) {
          const tTime = time;
          const osc = this.ctx.createOscillator();
          const tGain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(450, tTime);

          tGain.gain.setValueAtTime(0, tTime);
          tGain.gain.linearRampToValueAtTime(0.05, tTime + 0.002);
          tGain.gain.exponentialRampToValueAtTime(0.001, tTime + 0.04);

          osc.connect(tGain);
          tGain.connect(gainNode);
          
          this.trackSource(osc, soundObj);

          osc.start(tTime);
          osc.stop(tTime + 0.05);
        }
      }
    };

    playLoop();
    const loopInterval = stepTime * 16 * 1000; // loop length in ms
    const interval = setInterval(playLoop, loopInterval);
    soundObj.intervalIds.push(interval);
  }

  // 7. Tropical Birds (Rio high whistling birds)
  private buildBirds(gainNode: GainNode, _params: any, soundObj: any) {
    if (!this.ctx) return;

    // Trigger bird whistle calls periodically
    const triggerBirdCall = () => {
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      
      osc.type = 'sine';
      
      // Determine bird type randomly
      const rand = Math.random();
      bGain.gain.setValueAtTime(0, now);

      if (rand < 0.4) {
        // Quick upward sweep
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(3200, now + 0.15);

        bGain.gain.linearRampToValueAtTime(0.06, now + 0.01);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(bGain);
        bGain.connect(gainNode);
        
        this.trackSource(osc, soundObj);

        osc.start(now);
        osc.stop(now + 0.2);
      } else if (rand < 0.8) {
        // Chirp chirp chirp (triple note)
        const chirpCount = 3;
        for (let i = 0; i < chirpCount; i++) {
          const cTime = now + i * 0.15;
          const oscChirp = this.ctx.createOscillator();
          const cGain = this.ctx.createGain();

          oscChirp.type = 'sine';
          oscChirp.frequency.setValueAtTime(2500, cTime);
          oscChirp.frequency.exponentialRampToValueAtTime(1800, cTime + 0.08);

          cGain.gain.setValueAtTime(0, cTime);
          cGain.gain.linearRampToValueAtTime(0.05, cTime + 0.005);
          cGain.gain.exponentialRampToValueAtTime(0.001, cTime + 0.08);

          oscChirp.connect(cGain);
          cGain.connect(gainNode);

          this.trackSource(oscChirp, soundObj);

          oscChirp.start(cTime);
          oscChirp.stop(cTime + 0.1);
        }
      } else {
        // Trill (warble)
        const duration = 0.4;
        osc.frequency.setValueAtTime(2200, now);
        
        const fm = this.ctx.createOscillator();
        const fmGain = this.ctx.createGain();
        fm.frequency.setValueAtTime(25, now); // fast vibrato
        fmGain.gain.setValueAtTime(150, now);

        fm.connect(fmGain);
        fmGain.connect(osc.frequency);

        bGain.gain.linearRampToValueAtTime(0.04, now + 0.05);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(bGain);
        bGain.connect(gainNode);
        
        this.trackSource(osc, soundObj);
        this.trackSource(fm, soundObj);

        fm.start(now);
        osc.start(now);
        fm.stop(now + duration + 0.1);
        osc.stop(now + duration + 0.1);
      }
    };

    // Trigger bird calls at random interval times
    triggerBirdCall();
    const interval = setInterval(triggerBirdCall, 5000 + Math.random() * 4000);
    soundObj.intervalIds.push(interval);
  }

  // 8. Saxophone (New York street performer saxophone)
  private buildSaxophone(gainNode: GainNode, _params: any, soundObj: any) {
    if (!this.ctx) return;

    const phraseLength = 5.0; // seconds

    const triggerPhrase = () => {
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Soulful jazz pentatonic lick: D4, F4, G4, Bb4, A4, G4, F4
      const melody = [293.66, 349.23, 392.00, 466.16, 440.00, 392.00, 349.23];
      const noteTimes = [0.0, 0.6, 1.2, 1.8, 2.4, 3.0, 3.6];
      const noteDurations = [0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.8];

      // Saxophone voice: detuned sawtooth + triangle reed waves
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      const saxGain = this.ctx.createGain();
      saxGain.gain.setValueAtTime(0, now);

      // Formant bandpass filter centered around throat resonance
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(3.0, now);

      // Slow expressive vibrato LFO (4.8Hz)
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();
      vibrato.frequency.setValueAtTime(4.8, now);
      vibratoGain.gain.setValueAtTime(5, now); // vibrato pitch depth
      
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc1.frequency);
      vibratoGain.connect(osc2.frequency);

      // Connect soft highpass breath noise to simulate wind/air breath friction
      const breathBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * phraseLength, this.ctx.sampleRate);
      const breathData = breathBuffer.getChannelData(0);
      for (let i = 0; i < breathData.length; i++) {
        breathData[i] = (Math.random() * 2 - 1) * 0.015;
      }
      const breathSource = this.ctx.createBufferSource();
      breathSource.buffer = breathBuffer;

      const breathGain = this.ctx.createGain();
      breathGain.gain.setValueAtTime(0, now);

      const breathFilter = this.ctx.createBiquadFilter();
      breathFilter.type = 'highpass';
      breathFilter.frequency.setValueAtTime(2000, now);

      // Sequence the melody with legato pitch portamento slides
      melody.forEach((freq, idx) => {
        const t = now + noteTimes[idx];
        const dur = noteDurations[idx];

        // Legato pitch glide
        if (idx === 0) {
          osc1.frequency.setValueAtTime(freq, t);
          osc2.frequency.setValueAtTime(freq + 2, t);
        } else {
          osc1.frequency.exponentialRampToValueAtTime(freq, t);
          osc2.frequency.exponentialRampToValueAtTime(freq + 2, t);
        }

        // Vowel formant shift
        filter.frequency.exponentialRampToValueAtTime(700 + Math.random() * 300, t);

        // Breathing/blowing envelope
        saxGain.gain.linearRampToValueAtTime(0.18, t + 0.08);
        saxGain.gain.setValueAtTime(0.18, t + dur - 0.05);
        saxGain.gain.linearRampToValueAtTime(0.005, t + dur);

        // Breath noise volume track
        breathGain.gain.linearRampToValueAtTime(0.05, t + 0.08);
        breathGain.gain.setValueAtTime(0.05, t + dur - 0.05);
        breathGain.gain.linearRampToValueAtTime(0.001, t + dur);
      });

      // Decrescendo at the very end of phrase
      const endPhraseTime = now + phraseLength;
      saxGain.gain.setValueAtTime(0.005, now + 4.4);
      saxGain.gain.exponentialRampToValueAtTime(0.0001, endPhraseTime);
      breathGain.gain.setValueAtTime(0.001, now + 4.4);
      breathGain.gain.exponentialRampToValueAtTime(0.0001, endPhraseTime);

      // Connections
      osc1.connect(saxGain);
      osc2.connect(saxGain);
      saxGain.connect(filter);
      
      breathSource.connect(breathFilter);
      breathFilter.connect(breathGain);
      breathGain.connect(filter);

      filter.connect(gainNode);

      this.trackSource(osc1, soundObj);
      this.trackSource(osc2, soundObj);
      this.trackSource(vibrato, soundObj);
      this.trackSource(breathSource, soundObj);

      osc1.start(now);
      osc2.start(now);
      vibrato.start(now);
      breathSource.start(now);

      osc1.stop(endPhraseTime);
      osc2.stop(endPhraseTime);
      vibrato.stop(endPhraseTime);
      breathSource.stop(endPhraseTime);
    };

    triggerPhrase();
    const phraseInterval = phraseLength * 1000 + 1000; // 6 seconds loop (1s breath space)
    const interval = setInterval(triggerPhrase, phraseInterval);
    soundObj.intervalIds.push(interval);
  }
}

// Export a singleton instance
export const audioEngine = new AudioEngine();
export default audioEngine;

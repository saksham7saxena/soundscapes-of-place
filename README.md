# Soundscapes of Place
> A procedural audio instrument capturing the ambient textures of the world's cities.

*Soundscapes of Place* is an interactive, web-based auditory canvas that synthesizes the acoustic soul of six global cities. Built entirely on the **Web Audio API**, it generates complex soundscapes programmatically—without loading a single static audio file. From the high-pitch hiss of a pressure cooker in Delhi to the rhythmic echo of a saxophone in a New York subway tunnel, every tone, hum, clink, and breeze is synthesized live in your browser.

---

## 🗺️ The Cities

### 🇮🇳 Delhi
*“Tangled wires & monsoon dust.”*
A city composed of constant friction, where the clink of chai glasses cuts through the rumbling roar of auto-rickshaws, the hiss of pressure cookers, and the distant warning bells of the metro.
* **Acoustic signatures:** Auto horn drone, chai glass clinks, street cries, metro bells, and the heavy wash of monsoon rain.

### 🇫🇷 Paris
*“Cobblestones & accordion air.”*
An echo chamber of steel, zinc rooftops, and slow cafés. The sonic atmosphere layers pneumatic door warnings, café cup chatter, and the soft rustle of paper pastry bags over a warm, breathing accordion drone.
* **Acoustic signatures:** Café cup clinks, metro door buzzers, bicycle bells, footsteps along the Seine, and a detuned-reed accordion.

### 🇯🇵 Tokyo
*“Neon hums & crossing chirps.”*
A quiet density. Tokyo's soundscape layers mechanical door melodies, digital crossing chirps, and vending machine hums against the delicate, rhythmic drops of rain on stretched umbrellas.
* **Acoustic signatures:** East Japan Railway station melodies, electronic pedestrian crossing chirps, konbini door whistles, and soft rain grains.

### 🇺🇸 New York
*“Subway steam & basketball bounces.”*
An electric grid of concrete and steel. Distant pitch-sweeping sirens and hot food cart steam clash with the heavy, hollow resonance of basketballs on asphalt and the metallic squeal of subway wheels.
* **Acoustic signatures:** Subway rail screech, taxi horn dual-tones, signal ticks, basketball dribbles, and a soulful, legato street saxophone.

### 🇦🇪 Dubai
*“Desert wind & metro chimes.”*
A futuristic oasis floating on sand dunes. High-tech metro arrivals and crane warning alerts blend seamlessly with the deep rumblings of passing supercars and sweeping desert winds.
* **Acoustic signatures:** Futuristic metro door alerts, mall chatter hums, fountain spray textures, supercar Doppler sweeps, and low-frequency wind swells.

### 🇧🇷 Rio de Janeiro
*“Ocean waves & samba steps.”*
A city dancing between green peaks and blue surf. Rio’s sonic landscape vibrates with tropical bird calls, loose flip-flops slapping the pavement, beach vendor street cries, and warm, syncopated samba rhythms.
* **Acoustic signatures:** Atlantic ocean swells, beach vendor calls, flip-flop footsteps, tropical bird trills, and a live-synthesized 16th-note samba percussion loop.

---

## 🎛️ The Synthesis Engine
The application uses pure Web Audio API nodes to construct complex soundscapes:
* **Drones & Hums:** Generated using detuned sawtooth and triangle oscillators, shaped by low-pass filters and modulated by Low-Frequency Oscillators (LFOs) to simulate passing traffic, sirens, and horns.
* **Chimes & Bells:** Formed using inharmonic overtone ratios (`sine` oscillators) and exponential gain decay envelopes to recreate the metallic ring of bells, glass, and digital chimes.
* **Atmospheres & Winds:** Synthesized using dynamic white noise buffers fed through custom bandpass, lowpass, or highpass filters with slow LFO sweeps to simulate waves, wind, and rain.
* **Percussion & Rhythms:** Programmatic schedulers trigger low-frequency pitches with rapid decay envelopes, accompanied by short bursts of filtered noise to capture the acoustic transient of kicks, footsteps, and bounces.

---

## 🛠️ Technology Stack
* **Framework:** React + TypeScript + Vite
* **Styling:** Custom Editorial CSS (inspired by physical postcards, stamps, and minimalist typography)
* **Audio:** Web Audio API (with the iOS `AudioSession` API to support playback ignoring the physical mute switch)
* **Icons:** Lucide React

---

*“To listen to a city is to map its heart.”*

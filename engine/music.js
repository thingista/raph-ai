/**
 * Raph AI // Studio-Grade Polyphonic WebAudio Music Composer & Synthesizer
 * Features:
 * - Master Dynamics Compressor + Stereo Echo/Reverb Delay bus for studio depth
 * - Rich 7th chords (Maj7 / Min7), Arpeggiator, Multi-Harmonic Grand Piano,
 *   Detuned SuperSaw Leads, Deep 808 Sub-Bass, and Studio Drum Kit (Kick, Snare/Clap, Open/Closed Hats)
 * - 8 Distinct Genres: Pop, Lo-Fi, Grand Piano, Electronic EDM, Hip-Hop Beat, Rock, 8-Bit Game, Epic Orchestra
 */

class MusicComposerEngine {
  constructor() {
    this.ctx = null;
    this.masterBus = null;
    this.fxBus = null;
    this.isPlaying = false;
    this.stepTimer = null;
    this.activeCardId = null;
    this.currentStep = 0;

    this.scales = {
      happy: {
        name: "Sunshine Pop Anthem",
        bpm: 122,
        leadType: "pop",
        // Cmaj7 - G6 - Am7 - Fmaj7
        chords: [
          [60, 64, 67, 71],
          [55, 59, 62, 67],
          [57, 60, 64, 69],
          [53, 57, 60, 64]
        ],
        bass: [48, 43, 45, 41],
        scaleNotes: [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 79, 81],
        melody: [
          7, -1, 9, 7, 4, 7, 9, -1,
          10, 9, 7, 4, 5, 4, 2, -1,
          7, -1, 9, 10, 11, 9, 7, 4,
          5, 7, 4, 2, 0, -1, 7, -1
        ]
      },
      chill: {
        name: "Late Night Lo-Fi Chillhop",
        bpm: 86,
        leadType: "epiano",
        // Dm9 - G13 - Cmaj9 - A7alt
        chords: [
          [50, 53, 57, 60, 64],
          [55, 59, 62, 64, 67],
          [48, 52, 55, 59, 62],
          [45, 49, 52, 55, 60]
        ],
        bass: [38, 43, 36, 33],
        scaleNotes: [60, 62, 64, 67, 69, 71, 72, 74, 76, 79, 81],
        melody: [
          8, -1, 7, 6, 4, -1, 2, 4,
          6, -1, 4, 2, 0, -1, -1, -1,
          9, -1, 8, 6, 4, -1, 6, 7,
          4, -1, 2, 1, 0, -1, -1, -1
        ]
      },
      piano: {
        name: "Grand Piano & Warm Strings",
        bpm: 98,
        leadType: "piano",
        // Am - Fmaj7 - C - G
        chords: [
          [57, 60, 64, 69],
          [53, 57, 60, 64],
          [60, 64, 67, 72],
          [55, 59, 62, 67]
        ],
        bass: [45, 41, 48, 43],
        scaleNotes: [57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 79],
        melody: [
          7, 9, 10, 9, 7, 4, 7, -1,
          5, 7, 8, 7, 5, 2, 4, -1,
          9, 10, 11, 10, 9, 7, 5, 4,
          3, 5, 4, 2, 0, -1, 7, -1
        ]
      },
      electronic: {
        name: "Neon Synthwave & Festival EDM",
        bpm: 128,
        leadType: "supersaw",
        // Fm7 - DbMaj7 - Ab - Eb
        chords: [
          [53, 56, 60, 63],
          [49, 53, 56, 60],
          [56, 60, 63, 68],
          [51, 55, 58, 63]
        ],
        bass: [41, 37, 44, 39],
        scaleNotes: [65, 67, 68, 70, 72, 73, 75, 77, 79, 80, 84],
        melody: [
          0, 4, 7, 4, 0, 4, 7, 6,
          3, 6, 8, 6, 3, 6, 8, 7,
          4, 7, 9, 7, 4, 7, 10, 9,
          6, 7, 6, 4, 2, 4, 0, -1
        ]
      },
      hiphop: {
        name: "808 Hip-Hop & Trap Bounce",
        bpm: 94,
        leadType: "bell",
        // Cm7 - Gm7 - AbMaj7 - G7
        chords: [
          [48, 51, 55, 58],
          [43, 46, 50, 53],
          [44, 48, 51, 55],
          [43, 47, 50, 55]
        ],
        bass: [36, 31, 32, 31],
        scaleNotes: [60, 62, 63, 65, 67, 68, 70, 72, 74, 75, 79],
        melody: [
          7, -1, 7, 5, 4, -1, 2, 0,
          -1, 4, 5, 4, 2, -1, 0, -1,
          7, -1, 8, 7, 5, -1, 4, 2,
          4, 5, 4, 2, 0, -1, -1, -1
        ]
      },
      rock: {
        name: "Electric Guitar Stadium Rock",
        bpm: 132,
        leadType: "guitar",
        // E5 - C5 - G5 - D5
        chords: [
          [52, 59, 64, 67],
          [48, 55, 60, 64],
          [55, 62, 67, 71],
          [50, 57, 62, 66]
        ],
        bass: [40, 36, 43, 38],
        scaleNotes: [64, 67, 69, 71, 74, 76, 79, 81, 83],
        melody: [
          0, 0, 3, 0, 4, 3, 2, 0,
          1, 1, 3, 1, 5, 4, 3, 1,
          2, 2, 5, 4, 6, 5, 4, 2,
          3, 4, 3, 2, 0, -1, 5, -1
        ]
      },
      arcade: {
        name: "8-Bit Retro Arcade Chiptune",
        bpm: 142,
        leadType: "chip",
        chords: [
          [60, 64, 67, 72],
          [53, 57, 60, 65],
          [55, 59, 62, 67],
          [60, 64, 67, 72]
        ],
        bass: [48, 41, 43, 48],
        scaleNotes: [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 79, 84],
        melody: [
          7, 4, 0, 4, 7, 10, 9, 7,
          5, 2, 0, 2, 5, 9, 7, 5,
          4, 7, 9, 10, 11, 10, 9, 7,
          8, 7, 5, 4, 7, -1, 11, -1
        ]
      },
      epic: {
        name: "Epic Cinematic Orchestra",
        bpm: 112,
        leadType: "strings",
        // Dm - Bb - F - C
        chords: [
          [50, 53, 57, 62],
          [46, 50, 53, 58],
          [53, 57, 60, 65],
          [48, 52, 55, 60]
        ],
        bass: [38, 34, 41, 36],
        scaleNotes: [62, 64, 65, 67, 69, 70, 72, 74, 76, 77, 81],
        melody: [
          0, -1, 0, 2, 3, -1, 5, 3,
          4, -1, 2, 0, 1, -1, -1, -1,
          7, -1, 6, 5, 4, -1, 5, 7,
          8, 7, 5, 4, 7, -1, -1, -1
        ]
      }
    };
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Dynamics Compressor for warm, punchy studio output
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.setValueAtTime(-16, this.ctx.currentTime);
      comp.knee.setValueAtTime(18, this.ctx.currentTime);
      comp.ratio.setValueAtTime(4, this.ctx.currentTime);
      comp.attack.setValueAtTime(0.005, this.ctx.currentTime);
      comp.release.setValueAtTime(0.18, this.ctx.currentTime);
      comp.connect(this.ctx.destination);
      this.masterBus = comp;

      // Stereo Delay / Lush Echo Bus
      const delay = this.ctx.createDelay(1.0);
      delay.delayTime.setValueAtTime(0.24, this.ctx.currentTime);
      const feedback = this.ctx.createGain();
      feedback.gain.setValueAtTime(0.28, this.ctx.currentTime);
      const dampFilter = this.ctx.createBiquadFilter();
      dampFilter.type = "lowpass";
      dampFilter.frequency.setValueAtTime(2400, this.ctx.currentTime);

      const wetGain = this.ctx.createGain();
      wetGain.gain.setValueAtTime(0.24, this.ctx.currentTime);

      delay.connect(dampFilter);
      dampFilter.connect(feedback);
      feedback.connect(delay);
      delay.connect(wetGain);
      wetGain.connect(this.masterBus);
      this.fxBus = delay;
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  detectGenre(promptText) {
    const lower = (promptText || "").toLowerCase();
    if (/\b(chill|lofi|lo-fi|relax|calm|sleep|study|smooth|jazz)\b/.test(lower)) return "chill";
    if (/\b(piano|classical|sad|emotional|gentle|acoustic)\b/.test(lower)) return "piano";
    if (/\b(hip\s*hop|hiphop|rap|trap|808|boom\s*bap)\b/.test(lower)) return "hiphop";
    if (/\b(rock|guitar|metal|punk|band)\b/.test(lower)) return "rock";
    if (/\b(techno|electronic|edm|dance|club|synth|synthwave|party|house|rave)\b/.test(lower)) return "electronic";
    if (/\b(8-bit|8bit|retro|game|arcade|chiptune|mario)\b/.test(lower)) return "arcade";
    if (/\b(epic|cinematic|movie|space|dramatic|orchestra|hero)\b/.test(lower)) return "epic";
    return "happy";
  }

  // Multi-harmonic studio lead & grand piano synthesizer
  playLeadInstrument(midi, durationSec, leadType = "pop", volume = 0.14) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freq = this.midiToFreq(midi);

    const outGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";

    if (leadType === "piano" || leadType === "epiano") {
      // Layered harmonics for realistic Grand / Rhodes Piano tone
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = "triangle";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 2, now); // 2nd harmonic warmth

      const harmGain = this.ctx.createGain();
      harmGain.gain.setValueAtTime(0.22, now);
      harmGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec * 0.45);

      filter.frequency.setValueAtTime(leadType === "piano" ? 3800 : 2200, now);
      filter.frequency.exponentialRampToValueAtTime(800, now + durationSec);

      outGain.gain.setValueAtTime(0.001, now);
      outGain.gain.linearRampToValueAtTime(volume * 1.25, now + 0.012);
      outGain.gain.exponentialRampToValueAtTime(0.0008, now + durationSec * 1.25);

      osc1.connect(filter);
      osc2.connect(harmGain);
      harmGain.connect(filter);
      filter.connect(outGain);
      outGain.connect(this.masterBus);
      outGain.connect(this.fxBus);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + durationSec * 1.3);
      osc2.stop(now + durationSec * 1.3);
      return;
    }

    if (leadType === "supersaw" || leadType === "guitar" || leadType === "strings") {
      // Dual detuned oscillators for lush stereo chorus richness
      const oscA = this.ctx.createOscillator();
      const oscB = this.ctx.createOscillator();
      oscA.type = "sawtooth";
      oscB.type = leadType === "guitar" ? "square" : "sawtooth";
      oscA.frequency.setValueAtTime(freq * 0.996, now);
      oscB.frequency.setValueAtTime(freq * 1.004, now);

      filter.frequency.setValueAtTime(leadType === "guitar" ? 2600 : 3400, now);
      outGain.gain.setValueAtTime(0.001, now);
      outGain.gain.linearRampToValueAtTime(volume * 0.7, now + (leadType === "strings" ? 0.06 : 0.015));
      outGain.gain.exponentialRampToValueAtTime(0.0008, now + durationSec);

      oscA.connect(filter);
      oscB.connect(filter);
      filter.connect(outGain);
      outGain.connect(this.masterBus);
      outGain.connect(this.fxBus);

      oscA.start(now);
      oscB.start(now);
      oscA.stop(now + durationSec + 0.03);
      oscB.stop(now + durationSec + 0.03);
      return;
    }

    // Pop / Bell / 8-Bit Chiptune Lead
    const osc = this.ctx.createOscillator();
    osc.type = leadType === "chip" ? "square" : "triangle";
    osc.frequency.setValueAtTime(freq, now);

    filter.frequency.setValueAtTime(leadType === "chip" ? 4200 : 3200, now);
    outGain.gain.setValueAtTime(0.001, now);
    outGain.gain.linearRampToValueAtTime(volume, now + 0.015);
    outGain.gain.exponentialRampToValueAtTime(0.0008, now + durationSec);

    osc.connect(filter);
    filter.connect(outGain);
    outGain.connect(this.masterBus);
    outGain.connect(this.fxBus);

    osc.start(now);
    osc.stop(now + durationSec + 0.03);
  }

  // Lush Warm 7th Chord Pad
  playChordVoicing(notesArray, durationSec, volume = 0.048) {
    if (!this.ctx || !notesArray) return;
    notesArray.forEach((midi, idx) => {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(this.midiToFreq(midi), now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1900, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + durationSec);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterBus);
      gain.connect(this.fxBus);

      osc.start(now);
      osc.stop(now + durationSec + 0.05);
    });
  }

  // Deep Punchy Sub-Bass + Pluck Bass
  playBassNote(midi, durationSec, volume = 0.19) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(this.midiToFreq(midi), now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(620, now);
    filter.frequency.exponentialRampToValueAtTime(140, now + durationSec);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterBus);

    osc.start(now);
    osc.stop(now + durationSec + 0.02);
  }

  playKick() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(36, now + 0.14);

    gain.gain.setValueAtTime(0.38, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.masterBus);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  playSnare() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.04));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1800, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterBus);
    gain.connect(this.fxBus);
    noise.start(now);
  }

  playHiHat(open = false) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const dur = open ? 0.14 : 0.045;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(6500, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(open ? 0.07 : 0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterBus);
    noise.start(now);
  }

  stop() {
    if (this.stepTimer) {
      clearInterval(this.stepTimer);
      this.stepTimer = null;
    }
    this.isPlaying = false;
    this.updateUIState(null);
  }

  updateUIState(playingCardId) {
    document.querySelectorAll(".music-player-card").forEach(card => {
      const id = card.getAttribute("data-music-id");
      const btn = card.querySelector(".music-play-btn");
      const eq = card.querySelector(".music-eq");
      if (id === playingCardId && this.isPlaying) {
        if (btn) btn.textContent = "⏸️ Pause Music";
        if (eq) eq.classList.add("playing");
      } else {
        if (btn) btn.textContent = "▶️ Play Music";
        if (eq) eq.classList.remove("playing");
      }
    });
  }

  togglePlay(genreKey = "happy", cardId = "") {
    if (this.isPlaying && this.activeCardId === cardId) {
      this.stop();
      return;
    }
    this.playTrack(genreKey, cardId);
  }

  playTrack(genreKey = "happy", cardId = "") {
    this.stop();
    this.ensureContext();

    const preset = this.scales[genreKey] || this.scales.happy;
    const stepMs = (60 / preset.bpm / 2) * 1000; // 8th-note steps
    const stepSec = stepMs / 1000;

    this.isPlaying = true;
    this.activeCardId = cardId;
    this.currentStep = 0;
    this.updateUIState(cardId);

    const runStep = () => {
      if (!this.isPlaying) return;
      const step32 = this.currentStep % 32;
      const bar = Math.floor(step32 / 8) % 4;
      const chordNotes = preset.chords[bar];
      const bassNote = preset.bass[bar];

      // 1. Lush 7th Chord Pad at start of each bar (and half-bar for upbeat styles)
      if (step32 % 8 === 0) {
        this.playChordVoicing(chordNotes, stepSec * 7.5, 0.048);
      }

      // 2. Arpeggiator background sparkle (soft background notes from current chord)
      const arpNote = chordNotes[step32 % chordNotes.length] + 12;
      this.playLeadInstrument(arpNote, stepSec * 0.9, "piano", 0.032);

      // 3. Groovy Bassline
      if (step32 % 4 === 0) {
        this.playBassNote(bassNote, stepSec * 1.9, 0.2);
      } else if (step32 % 4 === 2 && genreKey !== "piano") {
        this.playBassNote(bassNote + 12, stepSec * 0.9, 0.13);
      } else if (step32 % 8 === 7) {
        this.playBassNote(bassNote + 7, stepSec * 0.8, 0.14);
      }

      // 4. Studio Drum Groove
      if (genreKey !== "piano") {
        if (genreKey === "hiphop") {
          if (step32 % 8 === 0 || step32 % 8 === 3 || step32 % 8 === 5) this.playKick();
          if (step32 % 8 === 4) this.playSnare();
          this.playHiHat(step32 % 4 === 2);
        } else {
          if (step32 % 4 === 0) this.playKick();
          if (step32 % 8 === 4) this.playSnare();
          if (step32 % 2 === 0) this.playHiHat(false);
          else if (genreKey === "electronic" || genreKey === "rock") this.playHiHat(step32 % 4 === 3);
        }
      }

      // 5. Expressive Lead Melody
      const scaleIdx = preset.melody[step32];
      if (scaleIdx >= 0 && scaleIdx < preset.scaleNotes.length) {
        const note = preset.scaleNotes[scaleIdx];
        this.playLeadInstrument(note, stepSec * 1.7, preset.leadType, 0.145);
      }

      this.currentStep++;
      if (this.currentStep >= 96) {
        this.stop();
      }
    };

    runStep();
    this.stepTimer = setInterval(runStep, stepMs);
  }
}

window.MusicComposerEngine = MusicComposerEngine;

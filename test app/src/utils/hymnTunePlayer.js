// Web Audio API Hymn Tune Synthesizer (Organ / Chime style)
class HymnTunePlayer {
  constructor() {
    this.audioCtx = null;
    this.isPlayingTune = false;
    this.currentTimeout = null;
    this.activeNodes = [];
    this.onEndCallback = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Note frequency map
  getNoteFreq(note) {
    const notes = {
      'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
      'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99,
      'G4': 392.00, 'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
      'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99,
      'G5': 783.99, 'Ab5': 830.61, 'A5': 880.00, 'Bb5': 932.33, 'B5': 987.77,
      'C6': 1046.50, 'REST': 0
    };
    return notes[note] || 440;
  }

  // Tune melody definitions: [note, duration in seconds]
  getTuneForHymn(hymnId) {
    switch (Number(hymnId)) {
      case 1: // Coronation (All Hail the Power)
        return [
          { note: 'G4', dur: 0.5 }, { note: 'B4', dur: 0.5 }, { note: 'D5', dur: 0.5 }, { note: 'D5', dur: 0.5 },
          { note: 'C5', dur: 0.5 }, { note: 'B4', dur: 0.5 }, { note: 'A4', dur: 1.0 },
          { note: 'B4', dur: 0.5 }, { note: 'C5', dur: 0.5 }, { note: 'B4', dur: 0.5 }, { note: 'A4', dur: 0.5 },
          { note: 'G4', dur: 0.5 }, { note: 'F#4', dur: 0.5 }, { note: 'G4', dur: 1.0 },
          { note: 'D5', dur: 0.5 }, { note: 'E5', dur: 0.5 }, { note: 'D5', dur: 0.5 }, { note: 'C5', dur: 0.5 },
          { note: 'B4', dur: 0.5 }, { note: 'A4', dur: 0.5 }, { note: 'B4', dur: 1.0 },
          { note: 'G4', dur: 0.5 }, { note: 'C5', dur: 0.5 }, { note: 'B4', dur: 0.5 }, { note: 'A4', dur: 0.5 },
          { note: 'G4', dur: 1.5 }
        ];

      case 2: // Duke Street / Forth in Thy Name
        return [
          { note: 'D4', dur: 0.5 }, { note: 'F#4', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'A4', dur: 1.0 },
          { note: 'B4', dur: 0.5 }, { note: 'C#5', dur: 0.5 }, { note: 'D5', dur: 1.0 },
          { note: 'A4', dur: 0.5 }, { note: 'B4', dur: 0.5 }, { note: 'A4', dur: 0.5 }, { note: 'G4', dur: 0.5 },
          { note: 'F#4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'D4', dur: 1.2 }
        ];

      case 3: // Amazing Grace (New Britain)
        return [
          { note: 'G4', dur: 0.4 }, { note: 'C5', dur: 0.8 }, { note: 'E5', dur: 0.4 }, { note: 'C5', dur: 0.4 },
          { note: 'E5', dur: 0.8 }, { note: 'D5', dur: 0.4 }, { note: 'C5', dur: 0.8 }, { note: 'A4', dur: 0.4 },
          { note: 'G4', dur: 1.0 }, { note: 'G4', dur: 0.4 }, { note: 'C5', dur: 0.8 }, { note: 'E5', dur: 0.4 },
          { note: 'C5', dur: 0.4 }, { note: 'E5', dur: 0.8 }, { note: 'D5', dur: 0.4 }, { note: 'G5', dur: 1.4 },
          { note: 'E5', dur: 0.4 }, { note: 'G5', dur: 0.8 }, { note: 'E5', dur: 0.4 }, { note: 'C5', dur: 0.4 },
          { note: 'E5', dur: 0.8 }, { note: 'D5', dur: 0.4 }, { note: 'C5', dur: 0.8 }, { note: 'A4', dur: 0.4 },
          { note: 'G4', dur: 1.0 }, { note: 'G4', dur: 0.4 }, { note: 'C5', dur: 0.8 }, { note: 'E5', dur: 0.4 },
          { note: 'C5', dur: 0.4 }, { note: 'D5', dur: 0.8 }, { note: 'C5', dur: 1.4 }
        ];

      case 45: // Eventide (Abide With Me)
        return [
          { note: 'Eb4', dur: 0.8 }, { note: 'G4', dur: 0.8 }, { note: 'Bb4', dur: 0.8 }, { note: 'G4', dur: 0.8 },
          { note: 'F4', dur: 0.8 }, { note: 'Eb4', dur: 0.8 }, { note: 'Ab4', dur: 1.0 }, { note: 'G4', dur: 1.2 },
          { note: 'G4', dur: 0.8 }, { note: 'F4', dur: 0.8 }, { note: 'Eb4', dur: 0.8 }, { note: 'F4', dur: 0.8 },
          { note: 'G4', dur: 1.0 }, { note: 'Ab4', dur: 0.6 }, { note: 'G4', dur: 1.2 },
          { note: 'Eb4', dur: 0.8 }, { note: 'G4', dur: 0.8 }, { note: 'Bb4', dur: 0.8 }, { note: 'C5', dur: 0.8 },
          { note: 'Bb4', dur: 0.8 }, { note: 'Ab4', dur: 0.8 }, { note: 'G4', dur: 1.0 }, { note: 'F4', dur: 1.2 },
          { note: 'Eb4', dur: 0.8 }, { note: 'F4', dur: 0.8 }, { note: 'G4', dur: 0.8 }, { note: 'Ab4', dur: 0.8 },
          { note: 'G4', dur: 0.8 }, { note: 'F4', dur: 0.8 }, { note: 'Eb4', dur: 1.6 }
        ];

      case 47: // Blessed Assurance
        return [
          { note: 'C5', dur: 0.5 }, { note: 'C5', dur: 0.3 }, { note: 'C5', dur: 0.3 }, { note: 'C5', dur: 0.8 },
          { note: 'A4', dur: 0.4 }, { note: 'F4', dur: 0.8 }, { note: 'G4', dur: 0.4 }, { note: 'A4', dur: 1.0 },
          { note: 'A4', dur: 0.4 }, { note: 'A4', dur: 0.4 }, { note: 'Bb4', dur: 0.4 }, { note: 'C5', dur: 0.8 },
          { note: 'A4', dur: 0.4 }, { note: 'G4', dur: 1.4 }
        ];

      default: // Traditional Sacred Tune
        return [
          { note: 'F4', dur: 0.6 }, { note: 'A4', dur: 0.6 }, { note: 'C5', dur: 0.6 }, { note: 'C5', dur: 0.6 },
          { note: 'D5', dur: 0.6 }, { note: 'C5', dur: 0.6 }, { note: 'Bb4', dur: 0.6 }, { note: 'A4', dur: 1.0 },
          { note: 'G4', dur: 0.6 }, { note: 'A4', dur: 0.6 }, { note: 'Bb4', dur: 0.6 }, { note: 'G4', dur: 0.6 },
          { note: 'F4', dur: 1.4 }
        ];
    }
  }

  // Play a single organ pipe tone
  playOrganTone(ctx, freq, startTime, duration) {
    if (freq <= 0) return;

    // Pipe 1 (Fundamental Sine)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Pipe 2 (Warm Triangle octave + harmonics)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq, startTime);

    // Pipe 3 (Subtle Organ Flute octave higher)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 2, startTime);

    // Master Envelope
    const masterGain = ctx.createGain();
    const attack = 0.06;
    const release = 0.12;

    masterGain.gain.setValueAtTime(0.0001, startTime);
    masterGain.gain.exponentialRampToValueAtTime(0.35, startTime + attack);
    masterGain.gain.setValueAtTime(0.32, startTime + duration - release);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    // Lowpass filter for smooth ecclesiastical tone
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, startTime);

    gain1.gain.setValueAtTime(0.5, startTime);
    gain2.gain.setValueAtTime(0.35, startTime);
    gain3.gain.setValueAtTime(0.15, startTime);

    osc1.connect(gain1).connect(filter);
    osc2.connect(gain2).connect(filter);
    osc3.connect(gain3).connect(filter);
    filter.connect(masterGain).connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);

    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
    osc3.stop(startTime + duration);

    this.activeNodes.push(osc1, osc2, osc3);
  }

  // Play hymn tune sequence
  play(hymnId, onEnd) {
    this.stop();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.isPlayingTune = true;
    this.onEndCallback = onEnd;

    const melody = this.getTuneForHymn(hymnId);
    let currentTime = ctx.currentTime + 0.05;

    melody.forEach((item) => {
      const freq = this.getNoteFreq(item.note);
      this.playOrganTone(ctx, freq, currentTime, item.dur);
      currentTime += item.dur;
    });

    const totalDurationMs = (currentTime - ctx.currentTime) * 1000;
    this.currentTimeout = setTimeout(() => {
      this.isPlayingTune = false;
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    }, totalDurationMs);
  }

  // Stop playback immediately
  stop() {
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    this.activeNodes.forEach((node) => {
      try {
        node.stop();
        node.disconnect();
      } catch {
        // Ignore already stopped
      }
    });
    this.activeNodes = [];
    this.isPlayingTune = false;
  }

  isPlaying() {
    return this.isPlayingTune;
  }
}

export const hymnTunePlayer = new HymnTunePlayer();


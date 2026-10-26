// Format seconds to mm:ss format
export const formatDuration = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Format large play counts e.g. 1.4M plays
export const formatPlayCount = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Procedural futuristic ambient/synth track generator using Web Audio API
// Acts as a zero-latency ultra-reliable fallback if remote audio network fails or is blocked
export class CyberAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isSynthesizing: boolean = false;
  private gainNode: GainNode | null = null;
  private timer: number | null = null;
  private analyser: AnalyserNode | null = null;

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  start(bpm: number = 120, mood: string = 'Cyberpunk') {
    this.init();
    if (!this.ctx || this.isSynthesizing) return;
    this.isSynthesizing = true;

    // Musical scale based on mood
    // Minor pentatonic for cyberpunk / synthwave
    const baseFreq = mood === 'Midnight Chill' ? 174.61 : mood === 'Hyperdrive' ? 261.63 : 220; // F3 / C4 / A3
    const intervals = [0, 3, 5, 7, 10, 12, 15, 17];
    const beatInterval = (60 / bpm) * 1000 / 2; // eighth notes

    let step = 0;

    const playStep = () => {
      if (!this.isSynthesizing || !this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Bass / Kick on quarter notes
      if (step % 2 === 0) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.frequency.setValueAtTime(120, now);
        kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
        kickGain.gain.setValueAtTime(0.4, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        kickOsc.connect(kickGain);
        kickGain.connect(this.gainNode!);
        kickOsc.start(now);
        kickOsc.stop(now + 0.15);
      }

      // 2. Cyber arpeggio synth
      const noteIdx = intervals[(step * 3) % intervals.length];
      const freq = baseFreq * Math.pow(2, noteIdx / 12);
      const synthOsc = this.ctx.createOscillator();
      const synthGain = this.ctx.createGain();
      
      synthOsc.type = (step % 4 === 0) ? 'sawtooth' : 'sine';
      synthOsc.frequency.setValueAtTime(freq, now);

      synthGain.gain.setValueAtTime(0.12, now);
      synthGain.gain.exponentialRampToValueAtTime(0.001, now + (beatInterval / 1000) * 0.9);

      synthOsc.connect(synthGain);
      synthGain.connect(this.gainNode!);
      synthOsc.start(now);
      synthOsc.stop(now + (beatInterval / 1000));

      // 3. Cyber hi-hat on off-beats
      if (step % 2 === 1) {
        const bufferSize = this.ctx.sampleRate * 0.05;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 7000;
        const hatGain = this.ctx.createGain();
        hatGain.gain.setValueAtTime(0.06, now);
        hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        noise.connect(filter);
        filter.connect(hatGain);
        hatGain.connect(this.gainNode!);
        noise.start(now);
      }

      step++;
      this.timer = window.setTimeout(playStep, beatInterval);
    };

    playStep();
  }

  setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, vol)) * 0.35, this.ctx.currentTime);
    }
  }

  stop() {
    this.isSynthesizing = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

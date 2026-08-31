// Web Audio API Procedural Sound Synthesizer for Presentations

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getAudioContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playClick() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  public playSlideTransition() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.25);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.25);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  public playDrumRoll(durationSec: number = 2.5) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * durationSec;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Noise with amplitude modulation to simulate rapid snare drum strikes
      const mod = Math.sin((i / ctx.sampleRate) * Math.PI * 35) > 0 ? 1 : 0.4;
      data[i] = (Math.random() * 2 - 1) * mod;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, now);
    filter.frequency.linearRampToValueAtTime(700, now + durationSec);
    filter.Q.value = 3;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.35, now + durationSec - 0.2);
    gain.gain.linearRampToValueAtTime(0.0, now + durationSec);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  }

  public playFanfare() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Chords / Arpeggio fanfare notes: C5, E5, G5, high C6
    const notes = [
      { freq: 523.25, time: 0.0, dur: 0.18 },
      { freq: 659.25, time: 0.15, dur: 0.18 },
      { freq: 783.99, time: 0.30, dur: 0.22 },
      { freq: 1046.50, time: 0.50, dur: 0.8 },
      { freq: 1318.51, time: 0.55, dur: 0.75 },
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.freq, now + n.time);

      gain.gain.setValueAtTime(0.001, now + n.time);
      gain.gain.linearRampToValueAtTime(0.22, now + n.time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + n.time);
      osc.stop(now + n.time + n.dur);
    });

    // Also trigger cheer
    this.playCheer(0.5);
  }

  public playCheer(delay: number = 0) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const dur = 2.0;
    const bufferSize = ctx.sampleRate * dur;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  }

  public playCurtainRope() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Heavy velvet fabric swish & rope pulley friction
    const bufferSize = ctx.sampleRate * 0.7;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.linearRampToValueAtTime(1200, now + 0.35);
    filter.frequency.linearRampToValueAtTime(300, now + 0.7);
    filter.Q.value = 1.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  }

  public playShutterSlam() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Mechanical roll down followed by metallic clank
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.3);
    oscGain.gain.setValueAtTime(0.2, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);

    // Clank impact
    setTimeout(() => {
      const impactCtx = this.getAudioContext();
      if (!impactCtx) return;
      const t = impactCtx.currentTime;
      const o = impactCtx.createOscillator();
      const g = impactCtx.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(320, t);
      o.frequency.exponentialRampToValueAtTime(80, t + 0.25);
      g.gain.setValueAtTime(0.3, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      o.connect(g);
      g.connect(impactCtx.destination);
      o.start(t);
      o.stop(t + 0.25);
    }, 280);
  }

  public playWaterSplash() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Water splash swoosh + bubbles
    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(2800, now + 0.3);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.8);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);

    // Bubble blips
    [0.15, 0.25, 0.4, 0.55].forEach((d, idx) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(400 + idx * 180, now + d);
      o.frequency.exponentialRampToValueAtTime(900 + idx * 250, now + d + 0.08);
      g.gain.setValueAtTime(0.12, now + d);
      g.gain.exponentialRampToValueAtTime(0.001, now + d + 0.08);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(now + d);
      o.stop(now + d + 0.08);
    });
  }

  public playMagicPortal() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Cosmic arpeggio shimmer
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0];
    notes.forEach((freq, idx) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, now + idx * 0.08);
      o.frequency.exponentialRampToValueAtTime(freq * 1.5, now + idx * 0.08 + 0.4);
      g.gain.setValueAtTime(0.001, now + idx * 0.08);
      g.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(now + idx * 0.08);
      o.stop(now + idx * 0.08 + 0.45);
    });
  }

  public playSqueegeeWipe() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Squeak sound
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(1400, now);
    o.frequency.linearRampToValueAtTime(600, now + 0.15);
    o.frequency.linearRampToValueAtTime(1800, now + 0.35);
    g.gain.setValueAtTime(0.08, now);
    g.gain.linearRampToValueAtTime(0.15, now + 0.15);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(now);
    o.stop(now + 0.4);
  }

  public playConfettiPop() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);

    // Sparkle chime following pop
    this.playMagicPortal();
  }

  public playLaunchCountdownBeep(isHigh: boolean = false) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isHigh ? 1200 : 600, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isHigh ? 0.4 : 0.15));

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + (isHigh ? 0.4 : 0.15));
  }
}

export const soundFx = new SoundEffectsEngine();

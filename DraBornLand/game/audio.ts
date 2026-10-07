// Original procedural soundscape. No licensed samples or network dependency.
export class Soundscape {
  private context?: AudioContext;
  private master?: GainNode;
  private ambience?: GainNode;
  private noise?: AudioBuffer;
  enabled = true;
  async start() {
    if (!this.context) {
      const C = window.AudioContext || (window as any).webkitAudioContext;
      if (!C) return;
      const c: AudioContext = this.context = new C();
      this.master = c.createGain(); this.master.gain.value = this.enabled ? .25 : 0; this.master.connect(c.destination);
      this.noise = c.createBuffer(1, c.sampleRate * 3, c.sampleRate);
      const data = this.noise.getChannelData(0); let last = 0;
      for (let i = 0; i < data.length; i++) { last = (last + (Math.random() * 2 - 1) * .035) / 1.015; data[i] = last * 3; }
      const source = c.createBufferSource(); source.buffer = this.noise; source.loop = true;
      const low = c.createBiquadFilter(); low.type = 'lowpass'; low.frequency.value = 450;
      this.ambience = c.createGain(); this.ambience.gain.value = .18;
      source.connect(low); low.connect(this.ambience); this.ambience.connect(this.master); source.start();
    }
    await this.context?.resume().catch(() => {});
  }
  setEnabled(enabled: boolean) { this.enabled = enabled; if (this.master && this.context) this.master.gain.setTargetAtTime(enabled ? .25 : 0, this.context.currentTime, .15); }
  update(time: number, night: boolean) { if (this.ambience && this.context) this.ambience.gain.setTargetAtTime((night ? .1 : .15) + Math.sin(time * .4) * .045, this.context.currentTime, .5); }
  tone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = .4, delay = 0, end?: number) {
    const c = this.context; if (!c || !this.master || !this.enabled) return;
    const osc = c.createOscillator(), amp = c.createGain(), t = c.currentTime + delay;
    osc.type = type; osc.frequency.setValueAtTime(frequency, t); if (end) osc.frequency.exponentialRampToValueAtTime(end, t + duration);
    amp.gain.setValueAtTime(.001, t); amp.gain.exponentialRampToValueAtTime(volume, t + .008); amp.gain.exponentialRampToValueAtTime(.001, t + duration);
    osc.connect(amp); amp.connect(this.master); osc.start(t); osc.stop(t + duration + .02);
  }
  sound(kind: string) {
    if (/relic|repair|craft|win|complete|bossDefeated/.test(kind)) { [220,330,440,660].forEach((f,i) => this.tone(f,.6,'sine',.22,i*.13)); return; }
    if (/hurt|damage|death/.test(kind)) { this.tone(105,.24,'sawtooth',.3,0,42); return; }
    if (/attack|hit|harvest|gather/.test(kind)) { this.tone(160,.1,'triangle',.6,0,45); this.tone(750,.08,'square',.055); return; }
    if (/fire|dragon/.test(kind)) { this.tone(75,.55,'sawtooth',.24,0,35); return; }
    if (kind === 'step') { this.tone(70,.045,'triangle',.09,0,45); return; }
    this.tone(440,.1,'sine',.1);
  }
  suspend() { this.context?.suspend().catch(() => {}); }
}

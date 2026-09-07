export class dkd_Audio {
  constructor(dkd_state) { this.dkd_state = dkd_state; this.dkd_context = null; this.dkd_track = 0; this.dkd_beat = 0; this.dkd_nextBeat = 0; this.dkd_muted = false; this.dkd_tracks = ['Gece Yarısı Siparişi', 'Asfaltta Yağmur', 'Son Işık', 'Sinyalin Ardından', 'Şafaktan Önce Evde']; }
  dkd_start() {
    if (!this.dkd_context) {
      const dkd_Context = window.AudioContext || window.webkitAudioContext; if (!dkd_Context) return;
      this.dkd_context = new dkd_Context(); this.dkd_master = this.dkd_context.createGain(); this.dkd_master.gain.value = .65; const dkd_compressor = this.dkd_context.createDynamicsCompressor(); this.dkd_master.connect(dkd_compressor); dkd_compressor.connect(this.dkd_context.destination);
      this.dkd_music = this.dkd_context.createGain(); this.dkd_music.connect(this.dkd_master); this.dkd_effects = this.dkd_context.createGain(); this.dkd_effects.connect(this.dkd_master);
      this.dkd_motor = this.dkd_context.createOscillator(); this.dkd_motor.type = 'sawtooth'; this.dkd_motor.frequency.value = 43; this.dkd_motorGain = this.dkd_context.createGain(); this.dkd_motorGain.gain.value = 0; const dkd_filter = this.dkd_context.createBiquadFilter(); dkd_filter.type = 'lowpass'; dkd_filter.frequency.value = 400; this.dkd_motor.connect(dkd_filter); dkd_filter.connect(this.dkd_motorGain); this.dkd_motorGain.connect(this.dkd_effects); this.dkd_motor.start();
      const dkd_noise = this.dkd_context.createBuffer(1, this.dkd_context.sampleRate * 2, this.dkd_context.sampleRate);
      const dkd_samples = dkd_noise.getChannelData(0); let dkd_previous = 0;
      for (let dkd_i = 0; dkd_i < dkd_samples.length; dkd_i++) { dkd_previous = (dkd_previous + (Math.random() * 2 - 1) * .025) / 1.025; dkd_samples[dkd_i] = dkd_previous * 4; }
      this.dkd_rainSource = this.dkd_context.createBufferSource(); this.dkd_rainSource.buffer = dkd_noise; this.dkd_rainSource.loop = true;
      this.dkd_rainGain = this.dkd_context.createGain(); this.dkd_rainGain.gain.value = 0; this.dkd_rainSource.connect(this.dkd_rainGain); this.dkd_rainGain.connect(this.dkd_effects); this.dkd_rainSource.start();
      this.dkd_nextBeat = this.dkd_context.currentTime + .1;
    }
    if (this.dkd_context.state === 'suspended' && !this.dkd_muted) this.dkd_context.resume().catch(() => {});
  }
  dkd_note(dkd_frequency, dkd_duration, dkd_volume, dkd_type = 'sine', dkd_target = this.dkd_music, dkd_when = null) {
    if (!this.dkd_context || this.dkd_muted) return; const dkd_at = dkd_when ?? this.dkd_context.currentTime; const dkd_osc = this.dkd_context.createOscillator(); const dkd_gain = this.dkd_context.createGain(); dkd_osc.type = dkd_type; dkd_osc.frequency.setValueAtTime(dkd_frequency, dkd_at); dkd_gain.gain.setValueAtTime(0, dkd_at); dkd_gain.gain.linearRampToValueAtTime(dkd_volume, dkd_at + .012); dkd_gain.gain.exponentialRampToValueAtTime(.0001, dkd_at + dkd_duration); dkd_osc.connect(dkd_gain); dkd_gain.connect(dkd_target); dkd_osc.start(dkd_at); dkd_osc.stop(dkd_at + dkd_duration + .025); dkd_osc.onended = () => { dkd_osc.disconnect(); dkd_gain.disconnect(); };
  }
  dkd_effect(dkd_kind) {
    this.dkd_start(); if (!this.dkd_context) return; const dkd_now = this.dkd_context.currentTime;
    if (dkd_kind === 'ding' || dkd_kind === 'success') { this.dkd_note(660, .35, .18, 'sine', this.dkd_effects); this.dkd_note(990, .5, .14, 'sine', this.dkd_effects, dkd_now + .13); if (dkd_kind === 'success') this.dkd_note(1320, .6, .1, 'sine', this.dkd_effects, dkd_now + .28); }
    else if (dkd_kind === 'horn') { this.dkd_note(349, .42, .22, 'sawtooth', this.dkd_effects); this.dkd_note(440, .42, .12, 'square', this.dkd_effects); }
    else if (dkd_kind === 'hit') { this.dkd_note(68, .28, .35, 'sawtooth', this.dkd_effects); this.dkd_note(133, .12, .20, 'square', this.dkd_effects); }
    else this.dkd_note(540, .06, .09, 'sine', this.dkd_effects);
  }
  dkd_update(dkd_run) {
    if (!this.dkd_context || this.dkd_context.state !== 'running') return;
    this.dkd_music.gain.value = this.dkd_state.dkd_settings.dkd_music; this.dkd_effects.gain.value = this.dkd_state.dkd_settings.dkd_effects;
    const dkd_active = dkd_run && !dkd_run.dkd_paused && !dkd_run.dkd_finished && !dkd_run.dkd_failed;
    this.dkd_motorGain.gain.setTargetAtTime(dkd_active ? .015 + dkd_run.dkd_speed * .004 : 0, this.dkd_context.currentTime, .08); this.dkd_motor.frequency.setTargetAtTime(dkd_active ? 42 + dkd_run.dkd_speed * 5 : 42, this.dkd_context.currentTime, .07);
    this.dkd_rainGain.gain.setTargetAtTime(dkd_active ? dkd_run.dkd_weather.dkd_rain * .45 + Math.abs(dkd_run.dkd_weather.dkd_wind || 0) * .012 : 0, this.dkd_context.currentTime, .3);
    const dkd_notes = [[110, 130.81, 164.81, 146.83], [98, 116.54, 146.83, 130.81], [130.81, 155.56, 196, 174.61], [123.47, 146.83, 185, 164.81], [87.31, 103.83, 130.81, 116.54]][this.dkd_track];
    const dkd_now = this.dkd_context.currentTime; if (this.dkd_nextBeat < dkd_now - 1) this.dkd_nextBeat = dkd_now + .05;
    while (this.dkd_nextBeat < dkd_now + .12) {
      const dkd_root = dkd_notes[Math.floor(this.dkd_beat / 16) % 4];
      if (this.dkd_beat % 4 === 0) { this.dkd_note(dkd_root / 2, .45, .20, 'sine', this.dkd_music, this.dkd_nextBeat); this.dkd_note(48, .17, .25, 'sine', this.dkd_music, this.dkd_nextBeat); }
      if (this.dkd_beat % 8 === 4) this.dkd_note(190, .09, .055, 'triangle', this.dkd_music, this.dkd_nextBeat);
      if (this.dkd_beat % 2 === 0) this.dkd_note(dkd_root * [2, 3, 2.5, 4][Math.floor(this.dkd_beat / 2) % 4], .23, .035, 'triangle', this.dkd_music, this.dkd_nextBeat);
      if (this.dkd_beat % 16 === 0) { this.dkd_note(dkd_root * 2, 2, .026, 'sine', this.dkd_music, this.dkd_nextBeat); this.dkd_note(dkd_root * 3, 2, .024, 'sine', this.dkd_music, this.dkd_nextBeat); }
      this.dkd_beat++; this.dkd_nextBeat += .19 + this.dkd_track * .009;
    }
  }
  dkd_pause(dkd_paused) { this.dkd_muted = dkd_paused; if (this.dkd_context) { if (dkd_paused) this.dkd_context.suspend().catch(() => {}); else this.dkd_context.resume().catch(() => {}); } }
}

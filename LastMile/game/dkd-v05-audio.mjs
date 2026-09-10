// DraBornGo / Last Mile v0.5 procedural music layer.
const dkd_v05Previous = {
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_startRun: dkd_Game.prototype.dkd_startRun,
  dkd_view_music: dkd_Game.prototype.dkd_view_music,
  dkd_view_vault: dkd_Game.prototype.dkd_view_vault,
  dkd_audioStart: dkd_Audio.prototype.dkd_start,
  dkd_audioUpdate: dkd_Audio.prototype.dkd_update,
  dkd_sceneBuildTraffic: dkd_Scene.prototype.dkd_buildTraffic,
  dkd_sceneUpdate: dkd_Scene.prototype.dkd_update,
  dkd_sceneSetRoute: dkd_Scene.prototype.dkd_setRoute,
  dkd_initTraffic,
};

const dkd_v05Tracks = [
  { dkd_name: 'Neon Vardiya', dkd_sub: 'Synthwave', dkd_menuBpm: 96, dkd_driveBpm: 128, dkd_accent: '#e982b7', dkd_roots: [73.42, 58.27, 87.31, 65.41], dkd_pattern: [2, 3, 4, 5, 3, 4, 6, 5] },
  { dkd_name: 'Gece Rotası', dkd_sub: 'Deep House', dkd_menuBpm: 104, dkd_driveBpm: 122, dkd_accent: '#8aa7ee', dkd_roots: [65.41, 77.78, 58.27, 73.42], dkd_pattern: [2, 2.5, 3, 4, 2.5, 5, 3, 4] },
  { dkd_name: 'Yağmur Hattı', dkd_sub: 'Liquid Night', dkd_menuBpm: 88, dkd_driveBpm: 116, dkd_accent: '#56cfc6', dkd_roots: [58.27, 69.30, 51.91, 65.41], dkd_pattern: [2, 3, 2.5, 4, 3, 5, 4, 2.5] },
  { dkd_name: 'Şehir Nabzı', dkd_sub: 'Electro', dkd_menuBpm: 112, dkd_driveBpm: 132, dkd_accent: '#edc56e', dkd_roots: [61.74, 73.42, 82.41, 55], dkd_pattern: [2, 4, 3, 6, 4, 5, 3, 8] },
  { dkd_name: 'Son Paket', dkd_sub: 'Cinematic Pulse', dkd_menuBpm: 92, dkd_driveBpm: 118, dkd_accent: '#aa9bea', dkd_roots: [49, 58.27, 65.41, 43.65], dkd_pattern: [2, 3, 5, 4, 3, 6, 4, 5] },
  { dkd_name: 'Kızılay Rush', dkd_sub: 'Breakbeat', dkd_menuBpm: 108, dkd_driveBpm: 136, dkd_accent: '#ef8767', dkd_roots: [69.30, 82.41, 61.74, 77.78], dkd_pattern: [2, 4, 2.5, 5, 3, 6, 4, 8] },
  { dkd_name: 'Asfalt 06', dkd_sub: 'Basswave', dkd_menuBpm: 100, dkd_driveBpm: 124, dkd_accent: '#72cbe9', dkd_roots: [55, 65.41, 49, 73.42], dkd_pattern: [2, 2.5, 4, 3, 5, 4, 6, 3] },
  { dkd_name: 'Sabaha Karşı', dkd_sub: 'Chill Drive', dkd_menuBpm: 84, dkd_driveBpm: 110, dkd_accent: '#9fd578', dkd_roots: [82.41, 65.41, 73.42, 61.74], dkd_pattern: [2, 3, 4, 3, 5, 4, 2.5, 3] },
];

function dkd_v05Noise(dkd_index, dkd_seed) {
  let dkd_value = Math.imul((dkd_index + 1) ^ dkd_seed, 1597334677);
  dkd_value ^= dkd_value >>> 13;
  dkd_value = Math.imul(dkd_value, 3812015801);
  dkd_value ^= dkd_value >>> 16;
  return ((dkd_value >>> 0) / 2147483648) - 1;
}

function dkd_v05Clip(dkd_value) {
  return dkd_value / (1 + Math.abs(dkd_value) * .68);
}

function dkd_v05CreateTrackBuffer(dkd_context, dkd_trackIndex, dkd_mode) {
  const dkd_track = dkd_v05Tracks[((Number(dkd_trackIndex) || 0) % dkd_v05Tracks.length + dkd_v05Tracks.length) % dkd_v05Tracks.length];
  const dkd_drive = dkd_mode === 'drive';
  const dkd_bpm = dkd_drive ? dkd_track.dkd_driveBpm : dkd_track.dkd_menuBpm;
  const dkd_beats = 16;
  const dkd_sampleRate = dkd_context.sampleRate;
  const dkd_seconds = dkd_beats * 60 / dkd_bpm;
  const dkd_length = Math.max(1, Math.floor(dkd_seconds * dkd_sampleRate));
  const dkd_buffer = dkd_context.createBuffer(1, dkd_length, dkd_sampleRate);
  const dkd_data = dkd_buffer.getChannelData(0);
  const dkd_tau = Math.PI * 2;
  const dkd_variant = ((Number(dkd_trackIndex) || 0) % dkd_v05Tracks.length + dkd_v05Tracks.length) % dkd_v05Tracks.length;

  for (let dkd_index = 0; dkd_index < dkd_length; dkd_index++) {
    const dkd_time = dkd_index / dkd_sampleRate;
    const dkd_beat = dkd_time * dkd_bpm / 60;
    const dkd_beatIndex = Math.floor(dkd_beat);
    const dkd_beatPhase = dkd_beat - dkd_beatIndex;
    const dkd_eighth = dkd_beat * 2;
    const dkd_eighthIndex = Math.floor(dkd_eighth);
    const dkd_eighthPhase = dkd_eighth - dkd_eighthIndex;
    const dkd_sixteenth = dkd_beat * 4;
    const dkd_sixteenthIndex = Math.floor(dkd_sixteenth);
    const dkd_sixteenthPhase = dkd_sixteenth - dkd_sixteenthIndex;
    const dkd_root = dkd_track.dkd_roots[Math.floor(dkd_beatIndex / 4) % dkd_track.dkd_roots.length];
    let dkd_sample = 0;

    if (dkd_drive) {
      const dkd_kickEnvelope = Math.exp(-dkd_beatPhase * (15 + (dkd_variant % 3) * 2));
      const dkd_kickFrequency = 43 + dkd_variant * 1.3 + 31 * Math.exp(-dkd_beatPhase * 19);
      dkd_sample += Math.sin(dkd_tau * dkd_kickFrequency * dkd_time) * dkd_kickEnvelope * (.27 + (dkd_variant % 2) * .035);

      const dkd_bassMultiplier = [1, 1, 1.5, 1, 1.25, 1, 2, 1.5][dkd_eighthIndex % 8];
      const dkd_bassFrequency = dkd_root * dkd_bassMultiplier;
      const dkd_bassEnvelope = .40 + .60 * Math.exp(-dkd_eighthPhase * (3.9 + dkd_variant * .12));
      dkd_sample += Math.sin(dkd_tau * dkd_bassFrequency * dkd_time) * dkd_bassEnvelope * .19;
      dkd_sample += Math.sin(dkd_tau * dkd_bassFrequency * 2 * dkd_time) * dkd_bassEnvelope * (.035 + dkd_variant * .004);

      const dkd_arpMultiplier = dkd_track.dkd_pattern[dkd_sixteenthIndex % dkd_track.dkd_pattern.length];
      const dkd_arpFrequency = dkd_root * dkd_arpMultiplier;
      const dkd_arpEnvelope = Math.exp(-dkd_sixteenthPhase * (6.2 + dkd_variant * .22));
      const dkd_arpWave = dkd_variant % 3 === 0
        ? Math.tanh(Math.sin(dkd_tau * dkd_arpFrequency * dkd_time) * 2.4)
        : dkd_variant % 3 === 1
          ? Math.sin(dkd_tau * dkd_arpFrequency * dkd_time)
          : Math.sin(dkd_tau * dkd_arpFrequency * dkd_time) * Math.sin(dkd_tau * dkd_arpFrequency * .5 * dkd_time);
      dkd_sample += dkd_arpWave * dkd_arpEnvelope * (.054 + (dkd_variant % 4) * .006);

      const dkd_snareStep = (dkd_beatIndex + dkd_variant) % 4;
      if (dkd_snareStep === 1 || dkd_snareStep === 3) dkd_sample += dkd_v05Noise(dkd_index, 9001 + dkd_variant * 313) * Math.exp(-dkd_beatPhase * 16) * .085;
      const dkd_hatPhase = (dkd_beat * (dkd_variant === 5 ? 8 : 4)) % 1;
      dkd_sample += dkd_v05Noise(dkd_index, 5701 + dkd_variant * 197) * Math.exp(-dkd_hatPhase * 28) * (.018 + (dkd_variant % 3) * .004);

      if (dkd_variant === 4 || dkd_variant === 7) {
        dkd_sample += Math.sin(dkd_tau * dkd_root * .5 * dkd_time) * (.035 + .015 * Math.sin(dkd_time * .6));
      }
      if (dkd_variant === 5 && dkd_sixteenthIndex % 4 === 3) {
        dkd_sample += dkd_v05Noise(dkd_index, 11003) * Math.exp(-dkd_sixteenthPhase * 18) * .045;
      }
    } else {
      const dkd_padMotion = .68 + .32 * Math.sin(dkd_tau * dkd_time / dkd_seconds + dkd_variant * .5);
      dkd_sample += Math.sin(dkd_tau * dkd_root * dkd_time) * dkd_padMotion * .11;
      dkd_sample += Math.sin(dkd_tau * dkd_root * 1.5 * dkd_time) * dkd_padMotion * (.052 + (dkd_variant % 3) * .008);
      dkd_sample += Math.sin(dkd_tau * dkd_root * 2 * dkd_time) * dkd_padMotion * .031;

      const dkd_pluckMultiplier = dkd_track.dkd_pattern[dkd_eighthIndex % dkd_track.dkd_pattern.length];
      const dkd_pluckFrequency = dkd_root * dkd_pluckMultiplier;
      const dkd_pluckEnvelope = Math.exp(-dkd_eighthPhase * (5.1 + dkd_variant * .18));
      dkd_sample += Math.sin(dkd_tau * dkd_pluckFrequency * dkd_time) * dkd_pluckEnvelope * (.078 + (dkd_variant % 4) * .007);
      if (dkd_variant % 2 === 0) dkd_sample += Math.sin(dkd_tau * dkd_pluckFrequency * 2 * dkd_time) * dkd_pluckEnvelope * .017;

      const dkd_softKick = Math.exp(-dkd_beatPhase * 14);
      if ((dkd_beatIndex + dkd_variant) % 2 === 0) dkd_sample += Math.sin(dkd_tau * (46 + dkd_variant) * dkd_time) * dkd_softKick * .09;
      if (dkd_variant === 2 || dkd_variant === 7) dkd_sample += dkd_v05Noise(dkd_index, 4109 + dkd_variant) * .006;
    }

    dkd_data[dkd_index] = dkd_v05Clip(dkd_sample);
  }
  return dkd_buffer;
}

function dkd_v05StopSource(dkd_source) {
  if (!dkd_source) return;
  try { dkd_source.stop(); } catch {}
  try { dkd_source.disconnect(); } catch {}
}

function dkd_v05PrepareAudio(dkd_audio) {
  if (!dkd_audio?.dkd_context || !dkd_audio.dkd_v04MenuMusic || !dkd_audio.dkd_v04DriveMusic) return false;
  if (!dkd_audio.dkd_v05AudioReady) {
    dkd_v05StopSource(dkd_audio.dkd_v04MenuLoopSource);
    dkd_v05StopSource(dkd_audio.dkd_v04DriveLoopSource);
    dkd_audio.dkd_v04MenuLoopSource = null;
    dkd_audio.dkd_v04DriveLoopSource = null;
    dkd_audio.dkd_v04LoopMusicReady = true;
    if (typeof dkd_v04StopMusicVoices === 'function') dkd_v04StopMusicVoices(dkd_audio);
    dkd_audio.dkd_tracks = dkd_v05Tracks.map(dkd_track => dkd_track.dkd_name);
    dkd_audio.dkd_track = Math.max(0, Math.min(dkd_v05Tracks.length - 1, Number(dkd_audio.dkd_track) || 0));
    dkd_audio.dkd_v05MenuTrack = dkd_audio.dkd_track;
    dkd_audio.dkd_v05DriveTrack = dkd_audio.dkd_track;
    dkd_audio.dkd_v05BufferCache = new Map();
    dkd_audio.dkd_v05AudioReady = true;
  }
  return true;
}

function dkd_v05GetBuffer(dkd_audio, dkd_trackIndex, dkd_mode) {
  const dkd_index = ((Number(dkd_trackIndex) || 0) % dkd_v05Tracks.length + dkd_v05Tracks.length) % dkd_v05Tracks.length;
  const dkd_key = `${dkd_mode}:${dkd_index}`;
  if (!dkd_audio.dkd_v05BufferCache.has(dkd_key)) dkd_audio.dkd_v05BufferCache.set(dkd_key, dkd_v05CreateTrackBuffer(dkd_audio.dkd_context, dkd_index, dkd_mode));
  return dkd_audio.dkd_v05BufferCache.get(dkd_key);
}

function dkd_v05SwitchTrack(dkd_audio, dkd_trackIndex, dkd_mode) {
  if (!dkd_v05PrepareAudio(dkd_audio)) return;
  const dkd_index = ((Number(dkd_trackIndex) || 0) % dkd_v05Tracks.length + dkd_v05Tracks.length) % dkd_v05Tracks.length;
  const dkd_sourceKey = dkd_mode === 'drive' ? 'dkd_v05DriveSource' : 'dkd_v05MenuSource';
  const dkd_trackKey = dkd_mode === 'drive' ? 'dkd_v05DriveTrack' : 'dkd_v05MenuTrack';
  if (dkd_audio[dkd_sourceKey] && dkd_audio[dkd_trackKey] === dkd_index) return;
  dkd_v05StopSource(dkd_audio[dkd_sourceKey]);
  const dkd_source = dkd_audio.dkd_context.createBufferSource();
  dkd_source.buffer = dkd_v05GetBuffer(dkd_audio, dkd_index, dkd_mode);
  dkd_source.loop = true;
  dkd_source.connect(dkd_mode === 'drive' ? dkd_audio.dkd_v04DriveMusic : dkd_audio.dkd_v04MenuMusic);
  dkd_source.start(dkd_audio.dkd_context.currentTime + .01);
  dkd_audio[dkd_sourceKey] = dkd_source;
  dkd_audio[dkd_trackKey] = dkd_index;
  if (dkd_mode === 'menu') dkd_audio.dkd_track = dkd_index;
}

function dkd_v05ApplyMusicMode(dkd_audio, dkd_drive) {
  if (!dkd_v05PrepareAudio(dkd_audio)) return;
  if (!dkd_audio.dkd_v05MenuSource) dkd_v05SwitchTrack(dkd_audio, dkd_audio.dkd_v05MenuTrack ?? dkd_audio.dkd_track, 'menu');
  if (!dkd_audio.dkd_v05DriveSource) dkd_v05SwitchTrack(dkd_audio, dkd_audio.dkd_v05DriveTrack ?? dkd_audio.dkd_track, 'drive');
  const dkd_now = dkd_audio.dkd_context.currentTime;
  const dkd_setting = dkd_clamp(Number(dkd_audio.dkd_state?.dkd_settings?.dkd_music) || 0, 0, 1);
  const dkd_menuVolume = Math.min(1.24, dkd_setting * 1.52);
  const dkd_driveVolume = Math.min(1.40, dkd_setting * 1.72);
  dkd_audio.dkd_v04Mode = dkd_drive ? 'v05-drive' : 'v05-menu';
  dkd_audio.dkd_v04MenuMusic.gain.setTargetAtTime(dkd_drive ? 0 : dkd_menuVolume, dkd_now, .10);
  dkd_audio.dkd_v04DriveMusic.gain.setTargetAtTime(dkd_drive ? dkd_driveVolume : 0, dkd_now, .10);
}

// dkd_v04Render invokes this global function on every page render. Keep v0.5 sources continuous.
dkd_v04ApplyMusicMode = function dkd_v05MusicModeBridge(dkd_audio, dkd_drive) {
  dkd_v05ApplyMusicMode(dkd_audio, dkd_drive);
};

dkd_Audio.prototype.dkd_start = function dkd_v05AudioStart() {
  dkd_v05Previous.dkd_audioStart.call(this);
  if (!dkd_v05PrepareAudio(this)) return;
  if (!this.dkd_v05MenuSource) dkd_v05SwitchTrack(this, this.dkd_v05MenuTrack ?? this.dkd_track, 'menu');
  if (!this.dkd_v05DriveSource) dkd_v05SwitchTrack(this, this.dkd_v05DriveTrack ?? this.dkd_track, 'drive');
};

dkd_Audio.prototype.dkd_update = function dkd_v05AudioUpdate(dkd_run) {
  if (!this.dkd_context || this.dkd_context.state !== 'running') return;
  dkd_v05PrepareAudio(this);
  const dkd_active = Boolean(dkd_run && !dkd_run.dkd_paused && !dkd_run.dkd_finished && !dkd_run.dkd_failed);
  const dkd_now = this.dkd_context.currentTime;
  this.dkd_master.gain.setTargetAtTime(.84, dkd_now, .12);
  this.dkd_effects.gain.setTargetAtTime(dkd_clamp(Number(this.dkd_state.dkd_settings.dkd_effects) || 0, 0, 1), dkd_now, .06);
  this.dkd_motorGain.gain.setTargetAtTime(dkd_active ? .014 + dkd_run.dkd_speed * .0036 : 0, dkd_now, .06);
  this.dkd_motor.frequency.setTargetAtTime(dkd_active ? 44 + dkd_run.dkd_speed * 5.2 : 44, dkd_now, .06);
  this.dkd_rainGain.gain.setTargetAtTime(dkd_active ? dkd_run.dkd_weather.dkd_rain * .39 + Math.abs(dkd_run.dkd_weather.dkd_wind || 0) * .010 : 0, dkd_now, .18);
  dkd_v05ApplyMusicMode(this, dkd_active);
};

function dkd_v05SelectMusic(dkd_game, dkd_trackIndex) {
  dkd_game.dkd_audio.dkd_start();
  const dkd_index = ((Number(dkd_trackIndex) || 0) % dkd_v05Tracks.length + dkd_v05Tracks.length) % dkd_v05Tracks.length;
  dkd_v05SwitchTrack(dkd_game.dkd_audio, dkd_index, 'menu');
  dkd_game.dkd_audio.dkd_track = dkd_index;
  dkd_game.dkd_audio.dkd_v05MenuTrack = dkd_index;
  dkd_v05ApplyMusicMode(dkd_game.dkd_audio, false);
  dkd_game.dkd_audio.dkd_effect('ding');
  dkd_game.dkd_toast(`Müzik değişti · ${dkd_v05Tracks[dkd_index].dkd_name}`);
}

dkd_Game.prototype.dkd_action = function dkd_v05Action(dkd_action) {
  const dkd_text = String(dkd_action || '');
  if (dkd_text.startsWith('track:')) {
    dkd_v05SelectMusic(this, Number(dkd_text.slice(6)));
    return this.dkd_render('music');
  }
  return dkd_v05Previous.dkd_action.call(this, dkd_action);
};

dkd_Game.prototype.dkd_startRun = function dkd_v05StartRun() {
  const dkd_result = dkd_v05Previous.dkd_startRun.call(this);
  if (!this.dkd_run) return dkd_result;
  this.dkd_audio.dkd_start();
  const dkd_seed = Math.abs(Number(this.dkd_run.dkd_order?.dkd_seed) || Date.now());
  const dkd_previousTrack = Number.isFinite(this.dkd_v05LastShiftTrack) ? this.dkd_v05LastShiftTrack : Number(this.dkd_audio.dkd_v05DriveTrack ?? this.dkd_audio.dkd_track) || 0;
  let dkd_nextTrack = (dkd_seed + (Number(this.dkd_state.dkd_deliveries) || 0) * 3) % dkd_v05Tracks.length;
  if (dkd_nextTrack === dkd_previousTrack) dkd_nextTrack = (dkd_nextTrack + 1 + (dkd_seed % (dkd_v05Tracks.length - 1))) % dkd_v05Tracks.length;
  this.dkd_v05LastShiftTrack = dkd_nextTrack;
  dkd_v05SwitchTrack(this.dkd_audio, dkd_nextTrack, 'drive');
  dkd_v05ApplyMusicMode(this.dkd_audio, true);
  return dkd_result;
};

dkd_Game.prototype.dkd_view_music = function dkd_v05MusicView() {
  const dkd_audio = this.dkd_audio;
  const dkd_selected = Number(dkd_audio.dkd_v05MenuTrack ?? dkd_audio.dkd_track) || 0;
  const dkd_selectedTrack = dkd_v05Tracks[dkd_selected] || dkd_v05Tracks[0];
  const dkd_cards = dkd_v05Tracks.map((dkd_track, dkd_index) => `
    <button class="dkd-v05-track ${dkd_selected===dkd_index?'dkd-selected':''}" style="--dkd-track:${dkd_track.dkd_accent}" data-dkd-action="track:${dkd_index}">
      <span class="dkd-v05-track-icon">${dkd_icon(dkd_selected===dkd_index?'volume':'play')}</span>
      <span><b>${dkd_track.dkd_name}</b><small>${dkd_track.dkd_sub} · vardiya sürüşü</small></span>
      <span class="dkd-v05-track-meta"><span>${dkd_track.dkd_driveBpm} BPM</span><span>${String(dkd_index+1).padStart(2,'0')}</span></span>
    </button>`).join('');
  return this.dkd_page('Müzik', `
    <div class="dkd-v05-music-intro">
      <span class="dkd-kicker">SON KİLOMETRE / V0.5 MÜZİK RADYOSU</span>
      <h2 style="margin:10px 0 7px">Her vardiyanın ayrı ritmi.</h2>
      <p class="dkd-muted dkd-text-sm">Parçaya dokunduğunda müzik gerçekten değişir. Sürüş başladığında bir önceki vardiyadan farklı bir parça otomatik seçilir.</p>
      <div class="dkd-v05-music-now"><span>${dkd_icon('music')}</span><div><small>ŞU AN SEÇİLİ</small><b style="display:block;margin-top:3px">${dkd_selectedTrack.dkd_name}</b><small>${dkd_selectedTrack.dkd_sub} · ${dkd_selectedTrack.dkd_driveBpm} BPM sürüş</small></div></div>
    </div>
    <div class="dkd-v05-music-list">${dkd_cards}</div>
    <div class="dkd-field"><label>Müzik seviyesi</label><input type="range" min="0" max="100" value="${Math.round(this.dkd_state.dkd_settings.dkd_music*100)}" data-dkd-setting="dkd_music" aria-label="Müzik seviyesi"/></div>`);
};

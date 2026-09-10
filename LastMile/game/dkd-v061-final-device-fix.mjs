// DraBornGo / Last Mile v0.6.1 final Android device correction.
// Keeps the public release at v0.6.1 while fixing starter heading, Courier Center audio,
// drive/menu isolation, stale visible version labels and the public support address.

const dkd_v061FinalPrevious = {
  dkd_buildBike: dkd_Scene.prototype.dkd_buildBike,
  dkd_render: dkd_Game.prototype.dkd_render,
  dkd_audioUpdate: dkd_Audio.prototype.dkd_update,
};

const dkd_v061FinalSupportEmail = 'support@draborneagle.com';
let dkd_v061FinalGame = null;

// ---------------------------------------------------------------------------
// Starter Yamaha + rider: the device screenshots proved the complete authored
// rider/bike assembly was still pointing 180 degrees opposite the route.
// The rider and motorcycle are one authored DK61 assembly, so rotate the whole
// assembly together. This preserves the supplied seated pose exactly.
// ---------------------------------------------------------------------------
function dkd_v061FinalAlignStarter(dkd_bike) {
  if (!dkd_bike || dkd_bike.name !== 'dkd_city50_v061_device_yamaha_soulgt125_rider') return dkd_bike;
  const dkd_model = dkd_bike.children.find(dkd_child => dkd_child?.isGroup) || dkd_bike.children[0];
  if (!dkd_model || dkd_model.userData?.dkd_v061FinalHeading === true) return dkd_bike;
  // runtime-repair already applied +PI/2; the real device showed the nose and rider
  // facing backwards, therefore turn the complete riding assembly another PI.
  dkd_model.rotation.y += Math.PI;
  dkd_model.userData.dkd_v061FinalHeading = true;
  dkd_model.userData.dkd_v061RiderSeatPreserved = true;
  return dkd_bike;
}

dkd_Scene.prototype.dkd_buildBike = function dkd_v061FinalBuildBike(dkd_kind = 'scooter') {
  const dkd_bike = dkd_v061FinalPrevious.dkd_buildBike.call(this, dkd_kind);
  return dkd_v061FinalAlignStarter(dkd_bike);
};

// ---------------------------------------------------------------------------
// Courier Center soundtrack: completely new 48 BPM soft night-ambient bed.
// No HTML <audio> menu track is allowed to play while this source is active.
// ---------------------------------------------------------------------------
function dkd_v061FinalCreateHomeBuffer(dkd_context) {
  const dkd_bpm = 48;
  const dkd_beats = 24;
  const dkd_rate = dkd_context.sampleRate;
  const dkd_seconds = dkd_beats * 60 / dkd_bpm;
  const dkd_length = Math.max(1, Math.floor(dkd_seconds * dkd_rate));
  const dkd_buffer = dkd_context.createBuffer(1, dkd_length, dkd_rate);
  const dkd_data = dkd_buffer.getChannelData(0);
  const dkd_tau = Math.PI * 2;
  const dkd_roots = [36.71, 41.20, 43.65, 32.70];
  const dkd_intervals = [1, 1.5, 2, 2.5];

  for (let dkd_index = 0; dkd_index < dkd_length; dkd_index += 1) {
    const dkd_time = dkd_index / dkd_rate;
    const dkd_beat = dkd_time * dkd_bpm / 60;
    const dkd_bar = Math.floor(dkd_beat / 6);
    const dkd_phase = dkd_beat - Math.floor(dkd_beat);
    const dkd_root = dkd_roots[dkd_bar % dkd_roots.length];
    const dkd_swell = 0.56 + 0.44 * Math.sin(dkd_tau * dkd_time / dkd_seconds - Math.PI / 2) ** 2;
    let dkd_sample = Math.sin(dkd_tau * dkd_root * dkd_time) * 0.030 * dkd_swell;
    dkd_sample += Math.sin(dkd_tau * dkd_root * 0.5 * dkd_time) * 0.020;
    dkd_sample += Math.sin(dkd_tau * dkd_root * 1.5 * dkd_time + 0.35) * 0.012 * dkd_swell;
    if (Math.floor(dkd_beat) % 6 === 0) {
      const dkd_note = dkd_root * dkd_intervals[dkd_bar % dkd_intervals.length];
      const dkd_envelope = Math.exp(-dkd_phase * 3.2);
      dkd_sample += Math.sin(dkd_tau * dkd_note * dkd_time) * dkd_envelope * 0.010;
    }
    dkd_data[dkd_index] = dkd_sample / (1 + Math.abs(dkd_sample) * 0.8);
  }
  return dkd_buffer;
}

function dkd_v061FinalStopSource(dkd_source) {
  if (!dkd_source) return;
  try { dkd_source.stop(); } catch {}
  try { dkd_source.disconnect(); } catch {}
}

function dkd_v061FinalPauseAllMedia(dkd_audio) {
  if (!dkd_audio) return;
  for (const dkd_player of dkd_audio.dkd_v05MediaPlayers || []) {
    try { dkd_player.pause(); } catch {}
    try { dkd_player.volume = 0; } catch {}
    dkd_player.onended = null;
  }
  dkd_audio.dkd_v05MediaCurrent = null;
  dkd_audio.dkd_v05MediaCurrentIndex = -1;
}

function dkd_v061FinalStopMenuOnly(dkd_audio) {
  if (!dkd_audio) return;
  if (typeof dkd_v061StopHomeMusic === 'function') dkd_v061StopHomeMusic(dkd_audio);
  dkd_v061FinalStopSource(dkd_audio.dkd_v061FinalHomeSource);
  dkd_audio.dkd_v061FinalHomeSource = null;
  dkd_v061FinalStopSource(dkd_audio.dkd_v05MenuSource);
  dkd_v061FinalStopSource(dkd_audio.dkd_v04MenuLoopSource);
  dkd_audio.dkd_v05MenuSource = null;
  dkd_audio.dkd_v04MenuLoopSource = null;

  // The first HTML media player is the old menu MP3. It must never survive a shift.
  if (typeof dkd_v05RoadAudioMenuIndex === 'function') {
    const dkd_menuIndex = dkd_v05RoadAudioMenuIndex();
    const dkd_menuPlayer = dkd_audio.dkd_v05MediaPlayers?.[dkd_menuIndex];
    if (dkd_menuPlayer) {
      try { dkd_menuPlayer.pause(); } catch {}
      try { dkd_menuPlayer.currentTime = 0; } catch {}
      try { dkd_menuPlayer.volume = 0; } catch {}
      dkd_menuPlayer.onended = null;
    }
  }
  if (typeof dkd_v04StopMusicVoices === 'function') dkd_v04StopMusicVoices(dkd_audio);
  if (dkd_audio.dkd_context && dkd_audio.dkd_v04MenuMusic?.gain) {
    const dkd_now = dkd_audio.dkd_context.currentTime;
    dkd_audio.dkd_v04MenuMusic.gain.cancelScheduledValues(dkd_now);
    dkd_audio.dkd_v04MenuMusic.gain.setValueAtTime(0, dkd_now);
  }
}

function dkd_v061FinalStartHome(dkd_game) {
  const dkd_audio = dkd_game?.dkd_audio;
  if (!dkd_audio) return;
  dkd_audio.dkd_start();
  if (!dkd_v05PrepareAudio(dkd_audio) || !dkd_audio.dkd_context) return;

  const dkd_start = () => {
    if ((document.documentElement?.dataset?.dkdPage || '') !== 'home') return;
    dkd_v061FinalPauseAllMedia(dkd_audio);
    dkd_v061FinalStopSource(dkd_audio.dkd_v05MenuSource);
    dkd_v061FinalStopSource(dkd_audio.dkd_v05DriveSource);
    dkd_audio.dkd_v05MenuSource = null;
    dkd_audio.dkd_v05DriveSource = null;
    if (typeof dkd_v061StopHomeMusic === 'function') dkd_v061StopHomeMusic(dkd_audio);
    if (typeof dkd_v04StopMusicVoices === 'function') dkd_v04StopMusicVoices(dkd_audio);

    if (!dkd_audio.dkd_v061FinalHomeBuffer) dkd_audio.dkd_v061FinalHomeBuffer = dkd_v061FinalCreateHomeBuffer(dkd_audio.dkd_context);
    if (!dkd_audio.dkd_v061FinalHomeSource) {
      const dkd_source = dkd_audio.dkd_context.createBufferSource();
      dkd_source.buffer = dkd_audio.dkd_v061FinalHomeBuffer;
      dkd_source.loop = true;
      dkd_source.connect(dkd_audio.dkd_v04MenuMusic);
      dkd_source.start(dkd_audio.dkd_context.currentTime + 0.01);
      dkd_audio.dkd_v061FinalHomeSource = dkd_source;
    }
    const dkd_setting = dkd_clamp(Number(dkd_audio.dkd_state?.dkd_settings?.dkd_music) || 0, 0, 1);
    const dkd_now = dkd_audio.dkd_context.currentTime;
    dkd_audio.dkd_v04MenuMusic.gain.cancelScheduledValues(dkd_now);
    dkd_audio.dkd_v04MenuMusic.gain.setTargetAtTime(dkd_setting * 0.34, dkd_now, 0.55);
    dkd_audio.dkd_v04DriveMusic.gain.cancelScheduledValues(dkd_now);
    dkd_audio.dkd_v04DriveMusic.gain.setTargetAtTime(0, dkd_now, 0.08);
    dkd_audio.dkd_v04Mode = 'v061-courier-center-calm-48';
  };

  if (dkd_audio.dkd_context.state === 'suspended') {
    dkd_audio.dkd_context.resume().then(dkd_start).catch(() => {});
  } else {
    dkd_start();
  }
}

function dkd_v061FinalEnforceDriveAudio(dkd_audio) {
  if (!dkd_audio) return;
  dkd_v061FinalStopMenuOnly(dkd_audio);
  if (!dkd_audio.dkd_context) return;
  const dkd_now = dkd_audio.dkd_context.currentTime;
  const dkd_setting = dkd_clamp(Number(dkd_audio.dkd_state?.dkd_settings?.dkd_music) || 0, 0, 1);
  if (dkd_audio.dkd_v04MenuMusic?.gain) {
    dkd_audio.dkd_v04MenuMusic.gain.cancelScheduledValues(dkd_now);
    dkd_audio.dkd_v04MenuMusic.gain.setValueAtTime(0, dkd_now);
  }
  if (dkd_audio.dkd_v04DriveMusic?.gain) {
    dkd_audio.dkd_v04DriveMusic.gain.cancelScheduledValues(dkd_now);
    dkd_audio.dkd_v04DriveMusic.gain.setTargetAtTime(dkd_setting * 0.92, dkd_now, 0.06);
  }
  dkd_audio.dkd_v04Mode = 'v061-drive-exclusive';
}

dkd_Audio.prototype.dkd_update = function dkd_v061FinalAudioUpdate(dkd_run) {
  const dkd_result = dkd_v061FinalPrevious.dkd_audioUpdate.call(this, dkd_run);
  const dkd_active = Boolean(dkd_run && !dkd_run.dkd_paused && !dkd_run.dkd_finished && !dkd_run.dkd_failed);
  if (dkd_active || (document.documentElement?.dataset?.dkdPage || '') === 'drive') {
    dkd_v061FinalEnforceDriveAudio(this);
  }
  return dkd_result;
};

// ---------------------------------------------------------------------------
// Visible metadata cleanup: every player-facing legacy v0.4/v0.5/v0.6 label becomes
// v0.6.1, and the old Gmail support address is replaced in text and mailto links.
// ---------------------------------------------------------------------------
function dkd_v061FinalNormalizeVisibleUi(dkd_root) {
  if (!dkd_root) return;
  for (const dkd_chip of dkd_root.querySelectorAll?.('.dkd-version') || []) dkd_chip.textContent = 'v0.6.1';
  const dkd_walker = document.createTreeWalker(dkd_root, NodeFilter.SHOW_TEXT);
  const dkd_nodes = [];
  while (dkd_walker.nextNode()) dkd_nodes.push(dkd_walker.currentNode);
  for (const dkd_node of dkd_nodes) {
    const dkd_value = String(dkd_node.nodeValue || '');
    const dkd_next = dkd_value
      .replace(/\bv0\.(?:4|5|6)(?!\.\d)/g, 'v0.6.1')
      .replace(/draborneagle@gmail\.com/gi, dkd_v061FinalSupportEmail);
    if (dkd_next !== dkd_value) dkd_node.nodeValue = dkd_next;
  }
  for (const dkd_link of dkd_root.querySelectorAll?.('a[href]') || []) {
    const dkd_href = dkd_link.getAttribute('href') || '';
    if (/draborneagle@gmail\.com/i.test(dkd_href)) {
      dkd_link.setAttribute('href', dkd_href.replace(/draborneagle@gmail\.com/gi, dkd_v061FinalSupportEmail));
    }
  }
}

dkd_Game.prototype.dkd_render = function dkd_v061FinalRender(dkd_page, dkd_arg = null) {
  dkd_v061FinalGame = this;
  if (dkd_page === 'drive') dkd_v061FinalStopMenuOnly(this.dkd_audio);
  const dkd_result = dkd_v061FinalPrevious.dkd_render.call(this, dkd_page, dkd_arg);
  dkd_v061FinalNormalizeVisibleUi(this.dkd_root);
  if (dkd_page === 'home') dkd_v061FinalStartHome(this);
  else if (dkd_page === 'drive' || this.dkd_run?.dkd_active || this.dkd_scene?.dkd_mode === 'drive') dkd_v061FinalEnforceDriveAudio(this.dkd_audio);
  return dkd_result;
};

// Android WebView may initially suspend WebAudio until the first real user gesture.
// Retry the new Courier Center track on that gesture instead of silently staying muted.
function dkd_v061FinalResumeHomeFromGesture() {
  if (!dkd_v061FinalGame || (document.documentElement?.dataset?.dkdPage || '') !== 'home') return;
  dkd_v061FinalStartHome(dkd_v061FinalGame);
}
document.addEventListener('pointerdown', dkd_v061FinalResumeHomeFromGesture, { passive: true });
document.addEventListener('touchstart', dkd_v061FinalResumeHomeFromGesture, { passive: true });

window.dkd_lastMileRuntimeFinal = {
  dkd_version: 'v0.6.1-device-final-3',
  dkd_supportEmail: dkd_v061FinalSupportEmail,
  dkd_homeBpm: 48,
  dkd_driveExclusive: true,
  dkd_starterAdditionalHeadingRadians: Math.PI,
  dkd_riderSeatTransform: 'preserved-from-uploaded-DK61',
};

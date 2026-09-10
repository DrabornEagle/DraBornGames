// DraBornGo / Last Mile v0.6.1 runtime repair.
// Device-reported fixes: parameter-safe pages, privacy entry, cloud package capacity,
// calm Courier Center music, non-repeating drive playlist, portrait quarantine and starter orientation.

const dkd_v061RepairPrevious = {
  dkd_render: dkd_Game.prototype.dkd_render,
  dkd_viewSettings: dkd_Game.prototype.dkd_view_settings,
  dkd_viewPrivacy: dkd_Game.prototype.dkd_view_privacy,
  dkd_viewVip: dkd_Game.prototype.dkd_view_vip,
  dkd_buildBike: dkd_Scene.prototype.dkd_buildBike,
};

// ---------------------------------------------------------------------------
// Page argument preservation
// ---------------------------------------------------------------------------
// v0.6/v0.6.1 render wrappers historically forwarded only the page name. Pages such as
// vip/chat/call need the second argument. Preserve the complete wrapper chain by temporarily
// binding the target view to the requested argument instead of bypassing auth/audio guards.
dkd_Game.prototype.dkd_render = function dkd_v061RepairRender(dkd_page, dkd_arg = null) {
  if (dkd_arg === null || typeof dkd_arg === 'undefined') {
    return dkd_v061RepairPrevious.dkd_render.call(this, dkd_page);
  }

  const dkd_methodName = `dkd_view_${dkd_page}`;
  const dkd_method = this[dkd_methodName];
  if (typeof dkd_method !== 'function') return dkd_v061RepairPrevious.dkd_render.call(this, dkd_page);

  const dkd_hadOwn = Object.prototype.hasOwnProperty.call(this, dkd_methodName);
  const dkd_ownMethod = this[dkd_methodName];
  this[dkd_methodName] = function dkd_v061RepairBoundView() {
    return dkd_method.call(this, dkd_arg);
  };
  try {
    const dkd_result = dkd_v061RepairPrevious.dkd_render.call(this, dkd_page);
    this.dkd_pageArg = dkd_arg;
    return dkd_result;
  } finally {
    if (dkd_hadOwn) this[dkd_methodName] = dkd_ownMethod;
    else delete this[dkd_methodName];
  }
};

// Never let a malformed/deleted VIP reference surface as a raw JS error.
dkd_Game.prototype.dkd_view_vip = function dkd_v061RepairVip(dkd_id) {
  const dkd_customer = dkd_customers.find(dkd_person => dkd_person.dkd_id === dkd_id);
  const dkd_vip = dkd_vips.find(dkd_item => dkd_item.dkd_customer === dkd_id);
  if (!dkd_customer || !dkd_vip) {
    return this.dkd_page(
      'Özel Müşteri Ağı',
      `<div class="dkd-notice">Müşteri profili bulunamadı. Görevler ekranına dönüp başka bir profili seç.</div>`,
      dkd_button('GÖREVLERE DÖN', 'contracts', 'back', 'dkd-secondary')
    );
  }
  return dkd_v061RepairPrevious.dkd_viewVip.call(this, dkd_id);
};

// ---------------------------------------------------------------------------
// Privacy + account deletion entry in Settings
// ---------------------------------------------------------------------------
dkd_Game.prototype.dkd_view_settings = function dkd_v061RepairSettings() {
  let dkd_html = String(dkd_v061RepairPrevious.dkd_viewSettings.call(this)).replace(/v0\.6\.1/g, 'v0.6.1');
  if (dkd_html.includes('data-dkd-action="privacy"')) return dkd_html;

  const dkd_privacyButton = `<div class="dkd-space"></div>${dkd_button('GİZLİLİK POLİTİKASI VE HESAP SİLME', 'privacy', 'shield', 'dkd-secondary')}`;
  const dkd_guideMarker = 'data-dkd-action="guide"';
  const dkd_guideIndex = dkd_html.indexOf(dkd_guideMarker);
  if (dkd_guideIndex >= 0) {
    const dkd_buttonEnd = dkd_html.indexOf('</button>', dkd_guideIndex);
    if (dkd_buttonEnd >= 0) {
      const dkd_insertAt = dkd_buttonEnd + '</button>'.length;
      return `${dkd_html.slice(0, dkd_insertAt)}${dkd_privacyButton}${dkd_html.slice(dkd_insertAt)}`;
    }
  }
  return dkd_html.replace('</div></div>', `${dkd_privacyButton}</div></div>`);
};

dkd_Game.prototype.dkd_view_privacy = function dkd_v061RepairPrivacy() {
  return String(dkd_v061RepairPrevious.dkd_viewPrivacy.call(this));
};

// ---------------------------------------------------------------------------
// Capacity: one source of truth for real cloud jobs
// ---------------------------------------------------------------------------
// The dispatch UI correctly used dkd_requiredLoad (e.g. 7 kg) while the core run validator
// still read the mapped local package class (e.g. oversized = 65 kg). Temporarily use the
// server-reported load for validation so the UI, preflight and actual run agree.
const dkd_v061RepairCreateRun = dkd_createRun;
dkd_createRun = function dkd_v061RepairCreateRunWithCloudLoad(dkd_state, dkd_graph, dkd_order, dkd_mode = 'safe', dkd_now = Date.now()) {
  const dkd_package = dkd_packages.find(dkd_item => dkd_item.dkd_id === dkd_order?.dkd_package);
  const dkd_requiredLoad = Number(dkd_order?.dkd_requiredLoad);
  if (!dkd_package || !Number.isFinite(dkd_requiredLoad) || dkd_requiredLoad < 0) {
    return dkd_v061RepairCreateRun(dkd_state, dkd_graph, dkd_order, dkd_mode, dkd_now);
  }

  const dkd_originalWeight = dkd_package.dkd_weight;
  dkd_package.dkd_weight = dkd_requiredLoad;
  try {
    return dkd_v061RepairCreateRun(dkd_state, dkd_graph, dkd_order, dkd_mode, dkd_now);
  } finally {
    dkd_package.dkd_weight = dkd_originalWeight;
  }
};

// ---------------------------------------------------------------------------
// Portrait quarantine
// ---------------------------------------------------------------------------
// The Mira JPEG is structurally decodable but exhibits visible scanline corruption on Android.
// Remove that exact payload from dynamic order pools and use the safe legacy portrait for Mira.
function dkd_v061RepairQuarantinePortrait(dkd_pool, dkd_badSource) {
  if (!Array.isArray(dkd_pool) || typeof dkd_badSource !== 'string') return;
  for (let dkd_index = dkd_pool.length - 1; dkd_index >= 0; dkd_index -= 1) {
    if (dkd_pool[dkd_index] === dkd_badSource) dkd_pool.splice(dkd_index, 1);
  }
}

dkd_v061RepairQuarantinePortrait(dkd_v06CustomerPortraitPool, dkd_v06AvatarMira);
dkd_v061RepairQuarantinePortrait(dkd_v061SafePortraitPool, dkd_v06AvatarMira);

const dkd_v061RepairPhotoAvatar = dkd_avatar;
dkd_avatar = function dkd_v061RepairAvatar(dkd_id, dkd_large = false) {
  if (dkd_id === 'dkd_mira') return dkd_v06LegacyAvatar(dkd_id, dkd_large);
  return dkd_v061RepairPhotoAvatar(dkd_id, dkd_large);
};
window.dkd_lastMileCustomerPortraitCount = dkd_v061SafePortraitPool.length;

// ---------------------------------------------------------------------------
// Starter Yamaha + rider axis correction
// ---------------------------------------------------------------------------
// DK61 was authored with the riding configuration facing local -X, while the game drives +Z.
// Rotate the imported child +90 degrees without changing the game heading/camera convention.
function dkd_v061RepairAlignStarter(dkd_scene, dkd_bike) {
  if (!dkd_scene || !dkd_bike || dkd_bike.name !== 'dkd_city50_v061_device_yamaha_soulgt125_rider') return dkd_bike;
  const dkd_model = dkd_bike.children.find(dkd_child => dkd_child?.isGroup) || dkd_bike.children[0];
  if (!dkd_model || dkd_model.userData?.dkd_v061RepairAxis === true) return dkd_bike;
  dkd_model.rotation.y += Math.PI / 2;
  dkd_model.userData.dkd_v061RepairAxis = true;
  return dkd_bike;
}

dkd_Scene.prototype.dkd_buildBike = function dkd_v061RepairBuildBike(dkd_kind = 'scooter') {
  const dkd_bike = dkd_v061RepairPrevious.dkd_buildBike.call(this, dkd_kind);
  return dkd_v061RepairAlignStarter(this, dkd_bike);
};

// ---------------------------------------------------------------------------
// Calmer Courier Center soundtrack
// ---------------------------------------------------------------------------
dkd_v061CreateHomeMusicBuffer = function dkd_v061RepairCreateHomeMusicBuffer(dkd_context) {
  const dkd_bpm = 54;
  const dkd_beats = 16;
  const dkd_sampleRate = dkd_context.sampleRate;
  const dkd_seconds = dkd_beats * 60 / dkd_bpm;
  const dkd_length = Math.max(1, Math.floor(dkd_seconds * dkd_sampleRate));
  const dkd_buffer = dkd_context.createBuffer(1, dkd_length, dkd_sampleRate);
  const dkd_data = dkd_buffer.getChannelData(0);
  const dkd_tau = Math.PI * 2;
  const dkd_roots = [43.65, 49, 55, 41.20];

  for (let dkd_index = 0; dkd_index < dkd_length; dkd_index += 1) {
    const dkd_time = dkd_index / dkd_sampleRate;
    const dkd_beat = dkd_time * dkd_bpm / 60;
    const dkd_beatIndex = Math.floor(dkd_beat);
    const dkd_phase = dkd_beat - dkd_beatIndex;
    const dkd_root = dkd_roots[Math.floor(dkd_beatIndex / 4) % dkd_roots.length];
    const dkd_breathe = .70 + .30 * Math.sin(dkd_tau * dkd_time / dkd_seconds - Math.PI / 2);
    let dkd_sample = Math.sin(dkd_tau * dkd_root * dkd_time) * .050 * dkd_breathe;
    dkd_sample += Math.sin(dkd_tau * dkd_root * .5 * dkd_time) * .025;
    dkd_sample += Math.sin(dkd_tau * dkd_root * 1.5 * dkd_time) * .018 * dkd_breathe;
    if (dkd_beatIndex % 4 === 2) {
      const dkd_bellEnvelope = Math.exp(-dkd_phase * 5.8);
      dkd_sample += Math.sin(dkd_tau * dkd_root * 3 * dkd_time) * dkd_bellEnvelope * .012;
    }
    dkd_data[dkd_index] = dkd_sample / (1 + Math.abs(dkd_sample) * .7);
  }
  return dkd_buffer;
};

function dkd_v061RepairSilenceMedia(dkd_audio) {
  if (!dkd_audio) return;
  dkd_audio.dkd_v061RepairPlaylistToken = (Number(dkd_audio.dkd_v061RepairPlaylistToken) || 0) + 1;
  for (const dkd_player of dkd_audio.dkd_v05MediaPlayers || []) {
    try { dkd_player.pause(); } catch {}
    try { dkd_player.volume = 0; } catch {}
  }
  dkd_audio.dkd_v05MediaCurrent = null;
  dkd_audio.dkd_v05MediaCurrentIndex = -1;
}

dkd_v061ApplyHomeMusic = function dkd_v061RepairApplyHomeMusic(dkd_game, dkd_page) {
  const dkd_audio = dkd_game?.dkd_audio;
  if (!dkd_audio) return;
  dkd_audio.dkd_v061RepairHomeActive = dkd_page === 'home';

  if (dkd_page !== 'home') {
    dkd_v061StopHomeMusic(dkd_audio);
    return;
  }

  dkd_audio.dkd_start();
  if (!dkd_v05PrepareAudio(dkd_audio) || !dkd_audio.dkd_context) return;
  dkd_v05RoadAudioEnsure(dkd_audio);
  dkd_v061RepairSilenceMedia(dkd_audio);
  dkd_v05StopSource(dkd_audio.dkd_v05MenuSource);
  dkd_v05StopSource(dkd_audio.dkd_v05DriveSource);
  dkd_audio.dkd_v05MenuSource = null;
  dkd_audio.dkd_v05DriveSource = null;
  if (typeof dkd_v04StopMusicVoices === 'function') dkd_v04StopMusicVoices(dkd_audio);

  if (!dkd_audio.dkd_v061RepairHomeBuffer) dkd_audio.dkd_v061RepairHomeBuffer = dkd_v061CreateHomeMusicBuffer(dkd_audio.dkd_context);
  if (!dkd_audio.dkd_v061HomeSource) {
    const dkd_source = dkd_audio.dkd_context.createBufferSource();
    dkd_source.buffer = dkd_audio.dkd_v061RepairHomeBuffer;
    dkd_source.loop = true;
    dkd_source.connect(dkd_audio.dkd_v04MenuMusic);
    dkd_source.start(dkd_audio.dkd_context.currentTime + .01);
    dkd_audio.dkd_v061HomeSource = dkd_source;
  }

  const dkd_setting = dkd_clamp(Number(dkd_audio.dkd_state?.dkd_settings?.dkd_music) || 0, 0, 1);
  dkd_audio.dkd_v04MenuMusic.gain.cancelScheduledValues(dkd_audio.dkd_context.currentTime);
  dkd_audio.dkd_v04MenuMusic.gain.setTargetAtTime(dkd_setting * .48, dkd_audio.dkd_context.currentTime, .35);
  dkd_audio.dkd_v04DriveMusic.gain.setTargetAtTime(0, dkd_audio.dkd_context.currentTime, .12);
  dkd_audio.dkd_v04Mode = 'v061-calm-home-54';
};

// ---------------------------------------------------------------------------
// Driving playlist: finish one track, then move to a different one
// ---------------------------------------------------------------------------
function dkd_v061RepairRunId(dkd_run) {
  return String(dkd_run?.dkd_id || dkd_run?.dkd_order?.dkd_id || dkd_run?.dkd_order?.dkd_seed || 'drive');
}

function dkd_v061RepairDriveCount() {
  return Math.max(0, dkd_v05RoadAudioDriveAssets.length);
}

function dkd_v061RepairPauseOtherMedia(dkd_audio, dkd_target) {
  for (const dkd_player of dkd_audio.dkd_v05MediaPlayers || []) {
    if (dkd_player === dkd_target) continue;
    try { dkd_player.pause(); } catch {}
    try { dkd_player.volume = 0; } catch {}
    dkd_player.onended = null;
  }
}

function dkd_v061RepairPlayDriveIndex(dkd_audio, dkd_driveIndex, dkd_restart = false) {
  if (!dkd_v05RoadAudioEnsure(dkd_audio)) return;
  const dkd_count = dkd_v061RepairDriveCount();
  if (!dkd_count) return;
  const dkd_index = ((Number(dkd_driveIndex) || 0) % dkd_count + dkd_count) % dkd_count;
  const dkd_globalIndex = dkd_v05RoadAudioDriveGlobalIndex(dkd_index);
  const dkd_target = dkd_audio.dkd_v05MediaPlayers[dkd_globalIndex];
  if (!dkd_target) return;

  dkd_v061RepairPauseOtherMedia(dkd_audio, dkd_target);
  const dkd_changed = dkd_audio.dkd_v05MediaCurrent !== dkd_target;
  if (dkd_changed || dkd_restart) {
    try { dkd_target.currentTime = 0; } catch {}
  }
  dkd_target.loop = false;
  dkd_target.volume = dkd_v05RoadAudioTargetVolume(dkd_audio);
  dkd_audio.dkd_v05MediaCurrent = dkd_target;
  dkd_audio.dkd_v05MediaCurrentIndex = dkd_globalIndex;
  dkd_audio.dkd_v061RepairDriveIndex = dkd_index;

  const dkd_token = (Number(dkd_audio.dkd_v061RepairPlaylistToken) || 0) + 1;
  dkd_audio.dkd_v061RepairPlaylistToken = dkd_token;
  dkd_target.onended = () => {
    if (!dkd_audio.dkd_v061RepairRunActive || dkd_audio.dkd_v061RepairPlaylistToken !== dkd_token) return;
    const dkd_next = (dkd_index + 1) % dkd_count;
    dkd_v061RepairPlayDriveIndex(dkd_audio, dkd_next, true);
  };

  if (!dkd_audio.dkd_muted && dkd_target.paused && !dkd_target.ended) dkd_target.play().catch(() => {});
}

function dkd_v061RepairPlayMenu(dkd_audio) {
  if (!dkd_v05RoadAudioEnsure(dkd_audio)) return;
  const dkd_globalIndex = dkd_v05RoadAudioMenuIndex();
  const dkd_target = dkd_audio.dkd_v05MediaPlayers[dkd_globalIndex];
  if (!dkd_target) return;
  dkd_audio.dkd_v061RepairPlaylistToken = (Number(dkd_audio.dkd_v061RepairPlaylistToken) || 0) + 1;
  dkd_v061RepairPauseOtherMedia(dkd_audio, dkd_target);
  dkd_target.onended = null;
  dkd_target.loop = true;
  dkd_target.volume = dkd_v05RoadAudioTargetVolume(dkd_audio) * .72;
  dkd_audio.dkd_v05MediaCurrent = dkd_target;
  dkd_audio.dkd_v05MediaCurrentIndex = dkd_globalIndex;
  if (!dkd_audio.dkd_muted && dkd_target.paused) dkd_target.play().catch(() => {});
}

dkd_Audio.prototype.dkd_update = function dkd_v061RepairAudioUpdate(dkd_run) {
  // This is intentionally the same pre-media chain used by the v0.5 city audio layer.
  const dkd_result = dkd_v05RoadAudioPrevious.dkd_audioUpdate.call(this, dkd_run);
  dkd_v05RoadAudioEnsure(this);
  const dkd_page = document.documentElement?.dataset?.dkdPage || '';
  const dkd_active = Boolean(dkd_run && !dkd_run.dkd_paused && !dkd_run.dkd_finished && !dkd_run.dkd_failed);

  if (dkd_active) {
    this.dkd_v061RepairHomeActive = false;
    dkd_v061StopHomeMusic(this);
    dkd_v05RoadAudioMuteProcedural(this);
    this.dkd_v061RepairRunActive = true;
    const dkd_runId = dkd_v061RepairRunId(dkd_run);
    if (this.dkd_v061RepairRunId !== dkd_runId || !Number.isFinite(this.dkd_v061RepairDriveIndex)) {
      this.dkd_v061RepairRunId = dkd_runId;
      this.dkd_v061RepairDriveIndex = dkd_v05RoadAudioHash(dkd_runId) % Math.max(1, dkd_v061RepairDriveCount());
    }
    const dkd_targetGlobal = dkd_v05RoadAudioDriveGlobalIndex(this.dkd_v061RepairDriveIndex);
    const dkd_target = this.dkd_v05MediaPlayers?.[dkd_targetGlobal];
    if (dkd_target?.ended) {
      this.dkd_v061RepairDriveIndex = (this.dkd_v061RepairDriveIndex + 1) % Math.max(1, dkd_v061RepairDriveCount());
      dkd_v061RepairPlayDriveIndex(this, this.dkd_v061RepairDriveIndex, true);
    } else {
      dkd_v061RepairPlayDriveIndex(this, this.dkd_v061RepairDriveIndex, false);
    }
    return dkd_result;
  }

  this.dkd_v061RepairRunActive = false;
  if (dkd_page === 'drive' && dkd_run?.dkd_paused) {
    try { this.dkd_v05MediaCurrent?.pause(); } catch {}
    return dkd_result;
  }

  if (dkd_page === 'home' || this.dkd_v061RepairHomeActive) {
    dkd_v061RepairSilenceMedia(this);
    dkd_v05StopSource(this.dkd_v05MenuSource);
    dkd_v05StopSource(this.dkd_v05DriveSource);
    this.dkd_v05MenuSource = null;
    this.dkd_v05DriveSource = null;
    if (this.dkd_context && this.dkd_v04MenuMusic?.gain) {
      const dkd_setting = dkd_clamp(Number(this.dkd_state?.dkd_settings?.dkd_music) || 0, 0, 1);
      this.dkd_v04MenuMusic.gain.setTargetAtTime(dkd_setting * .48, this.dkd_context.currentTime, .35);
      this.dkd_v04DriveMusic.gain.setTargetAtTime(0, this.dkd_context.currentTime, .12);
    }
    return dkd_result;
  }

  dkd_v05RoadAudioMuteProcedural(this);
  if (Number.isFinite(this.dkd_v05MediaPreviewTrack)) {
    dkd_v061RepairPlayDriveIndex(this, this.dkd_v05MediaPreviewTrack, false);
  } else {
    dkd_v061RepairPlayMenu(this);
  }
  return dkd_result;
};

window.dkd_lastMileRuntimeRepair = {
  dkd_version: 'v0.6.1-device-repair-2',
  dkd_homeBpm: 54,
  dkd_drivePlaylist: true,
  dkd_capacityUsesServerLoad: true,
  dkd_pageArgsPreserved: true,
  dkd_starterAxisRadians: Math.PI / 2,
};

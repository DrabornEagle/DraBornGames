// DraBornGo / Last Mile v0.7
// Expo Go SDK 57 test release: camera settings restored, rider heading corrected
// independently from the already-correct motorcycle, and soundtrack ownership made exclusive.

const dkd_v07Previous = {
  dkd_buildBike: dkd_Scene.prototype.dkd_buildBike,
  dkd_render: dkd_Game.prototype.dkd_render,
  dkd_viewSettings: dkd_Game.prototype.dkd_view_settings,
  dkd_startRun: dkd_Game.prototype.dkd_startRun,
  dkd_audioUpdate: dkd_Audio.prototype.dkd_update,
};

const dkd_v07Version = 'v0.7';
const dkd_v07RiderMeshIndexes = new Set([20, 21, 22, 23, 24, 25, 26, 27]);
let dkd_v07Game = null;

function dkd_v07InstallStyles() {
  if (document.getElementById('dkd-v07-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v07-style';
  dkd_style.textContent = `
    .dkd-v07-settings-block{margin-top:24px}
    .dkd-v07-settings-block h3{margin:0 0 13px}
    .dkd-v07-toggle-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
    .dkd-v07-camera-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}
    .dkd-v07-setting-button{min-height:64px;border:1px solid #405675;border-radius:18px;background:#1d2d49;color:#edf3ff;font:inherit;font-weight:850;padding:10px 8px}
    .dkd-v07-setting-button.dkd-selected{border-color:#8eaaf5;background:#8eaaf5;color:#10203a}
    .dkd-v07-setting-button small{display:block;font-size:9px;opacity:.78;margin-top:4px;font-weight:700}
    .dkd-v07-audio-note{border:1px solid #405675;border-radius:16px;background:#17243a;padding:12px 14px;margin-top:14px;font-size:11px;line-height:1.5;color:#b8c5d8}
    @media(max-width:370px){.dkd-v07-toggle-row{grid-template-columns:1fr}.dkd-v07-camera-grid{gap:7px}.dkd-v07-setting-button{font-size:12px;padding:8px 5px}}
  `;
  document.head.appendChild(dkd_style);
}

dkd_v07InstallStyles();

function dkd_v07StopSource(dkd_source) {
  if (!dkd_source) return;
  try { dkd_source.stop(); } catch {}
  try { dkd_source.disconnect(); } catch {}
}

function dkd_v07CancelMediaFade(dkd_audio) {
  if (!dkd_audio) return;
  dkd_audio.dkd_v05MediaFadeToken = (Number(dkd_audio.dkd_v05MediaFadeToken) || 0) + 1;
}

function dkd_v07MuteProceduralMusic(dkd_audio) {
  if (!dkd_audio?.dkd_context) return;
  const dkd_now = dkd_audio.dkd_context.currentTime;
  for (const dkd_gain of [dkd_audio.dkd_music, dkd_audio.dkd_v04MenuMusic, dkd_audio.dkd_v04DriveMusic]) {
    try {
      if (!dkd_gain?.gain) continue;
      dkd_gain.gain.cancelScheduledValues(dkd_now);
      dkd_gain.gain.setValueAtTime(0, dkd_now);
    } catch {}
  }
}

function dkd_v07StopLegacyHome(dkd_audio) {
  if (!dkd_audio) return;
  if (typeof dkd_v061StopHomeMusic === 'function') {
    try { dkd_v061StopHomeMusic(dkd_audio); } catch {}
  }
  for (const dkd_key of ['dkd_v061FinalHomeSource', 'dkd_v05MenuSource', 'dkd_v04MenuLoopSource', 'dkd_v04DriveLoopSource']) {
    dkd_v07StopSource(dkd_audio[dkd_key]);
    dkd_audio[dkd_key] = null;
  }
  if (typeof dkd_v04StopMusicVoices === 'function') {
    try { dkd_v04StopMusicVoices(dkd_audio); } catch {}
  }
  dkd_v07MuteProceduralMusic(dkd_audio);
}

function dkd_v07EnsureMedia(dkd_audio) {
  if (!dkd_audio) return false;
  if (typeof dkd_v05RoadAudioEnsure === 'function') {
    try { dkd_v05RoadAudioEnsure(dkd_audio); } catch {}
  }
  return Array.isArray(dkd_audio.dkd_v05MediaPlayers) && dkd_audio.dkd_v05MediaPlayers.length > 0;
}

function dkd_v07PauseEveryMediaExcept(dkd_audio, dkd_keepIndex = -1) {
  if (!dkd_v07EnsureMedia(dkd_audio)) return;
  dkd_v07CancelMediaFade(dkd_audio);
  dkd_audio.dkd_v05MediaPlayers.forEach((dkd_player, dkd_index) => {
    if (dkd_index === dkd_keepIndex) return;
    try { dkd_player.pause(); } catch {}
    try { dkd_player.currentTime = 0; } catch {}
    try { dkd_player.volume = 0; } catch {}
    dkd_player.onended = null;
  });
}

function dkd_v07MediaVolume(dkd_audio, dkd_mode) {
  const dkd_setting = dkd_clamp(Number(dkd_audio?.dkd_state?.dkd_settings?.dkd_music) || 0, 0, 1);
  return dkd_clamp(dkd_setting * (dkd_mode === 'home' ? 0.72 : 0.94), 0, 1);
}

function dkd_v07PlayExactIndex(dkd_audio, dkd_index, dkd_mode, dkd_restart = false) {
  if (!dkd_v07EnsureMedia(dkd_audio)) return false;
  const dkd_safeIndex = Math.max(0, Math.min(dkd_audio.dkd_v05MediaPlayers.length - 1, Number(dkd_index) || 0));
  const dkd_player = dkd_audio.dkd_v05MediaPlayers[dkd_safeIndex];
  dkd_v07PauseEveryMediaExcept(dkd_audio, dkd_safeIndex);
  dkd_v07StopLegacyHome(dkd_audio);
  if (dkd_restart) {
    try { dkd_player.currentTime = 0; } catch {}
  }
  dkd_player.loop = true;
  dkd_player.volume = dkd_v07MediaVolume(dkd_audio, dkd_mode);
  dkd_audio.dkd_v05MediaCurrent = dkd_player;
  dkd_audio.dkd_v05MediaCurrentIndex = dkd_safeIndex;
  if (!dkd_audio.dkd_muted && dkd_player.paused) dkd_player.play().catch(() => {});
  dkd_audio.dkd_v07AudioOwner = dkd_mode;
  return true;
}

function dkd_v07HomeIndex() {
  if (typeof dkd_v05RoadAudioMenuIndex === 'function') {
    try { return dkd_v05RoadAudioMenuIndex(); } catch {}
  }
  return 0;
}

function dkd_v07DriveIndex(dkd_audio, dkd_run) {
  if (typeof dkd_v05RoadAudioChooseDrive === 'function' && typeof dkd_v05RoadAudioDriveGlobalIndex === 'function') {
    try { return dkd_v05RoadAudioDriveGlobalIndex(dkd_v05RoadAudioChooseDrive(dkd_audio, dkd_run)); } catch {}
  }
  return Math.min(1, Math.max(0, (dkd_audio?.dkd_v05MediaPlayers?.length || 1) - 1));
}

function dkd_v07StartHome(dkd_game) {
  const dkd_audio = dkd_game?.dkd_audio;
  const dkd_page = document.documentElement?.dataset?.dkdPage || dkd_game?.dkd_pageName || '';
  const dkd_active = Boolean(dkd_game?.dkd_run && !dkd_game.dkd_run.dkd_finished && !dkd_game.dkd_run.dkd_failed);
  if (!dkd_audio || dkd_page !== 'home' || dkd_active) return;
  dkd_audio.dkd_start();
  const dkd_start = () => {
    const dkd_currentPage = document.documentElement?.dataset?.dkdPage || dkd_game?.dkd_pageName || '';
    if (dkd_currentPage !== 'home' || dkd_game?.dkd_run) return;
    dkd_v07PlayExactIndex(dkd_audio, dkd_v07HomeIndex(), 'home', dkd_audio.dkd_v07AudioOwner !== 'home');
  };
  if (dkd_audio.dkd_context?.state === 'suspended') dkd_audio.dkd_context.resume().then(dkd_start).catch(() => {});
  else dkd_start();
}

function dkd_v07EnforceDrive(dkd_game, dkd_restart = false) {
  const dkd_audio = dkd_game?.dkd_audio;
  const dkd_run = dkd_game?.dkd_run;
  if (!dkd_audio || !dkd_run || dkd_run.dkd_finished || dkd_run.dkd_failed) return;
  dkd_audio.dkd_start();
  dkd_v07StopLegacyHome(dkd_audio);
  const dkd_index = dkd_v07DriveIndex(dkd_audio, dkd_run);
  const dkd_shouldRestart = dkd_restart || dkd_audio.dkd_v07AudioOwner !== 'drive' || dkd_audio.dkd_v05MediaCurrentIndex !== dkd_index;
  dkd_v07PlayExactIndex(dkd_audio, dkd_index, 'drive', dkd_shouldRestart);
}

// v0.6.1 registered pointer/touch listeners that call this global identifier.
// Reassigning it guarantees those old listeners now start the v0.7 MP3 score instead
// of recreating the legacy 48 BPM procedural Courier Center loop.
try { dkd_v061FinalStartHome = dkd_v07StartHome; } catch {}

function dkd_v07NormalizeVersion(dkd_root) {
  if (!dkd_root) return;
  for (const dkd_chip of dkd_root.querySelectorAll?.('.dkd-version') || []) dkd_chip.textContent = dkd_v07Version;
  const dkd_walker = document.createTreeWalker(dkd_root, NodeFilter.SHOW_TEXT);
  const dkd_nodes = [];
  while (dkd_walker.nextNode()) dkd_nodes.push(dkd_walker.currentNode);
  for (const dkd_node of dkd_nodes) {
    const dkd_text = String(dkd_node.nodeValue || '');
    const dkd_next = dkd_text.replace(/\bv0\.6\.1\b/g, dkd_v07Version).replace(/\bv0\.6\b/g, dkd_v07Version);
    if (dkd_next !== dkd_text) dkd_node.nodeValue = dkd_next;
  }
}

function dkd_v07RiderCandidate(dkd_mesh, dkd_index, dkd_modelBounds) {
  if (dkd_v07RiderMeshIndexes.has(dkd_index)) return true;
  if (!dkd_mesh?.isMesh || !dkd_mesh.geometry) return false;
  dkd_mesh.geometry.computeBoundingBox?.();
  const dkd_box = dkd_mesh.geometry.boundingBox;
  if (!dkd_box || !dkd_modelBounds) return false;
  const dkd_height = Math.max(0.001, dkd_modelBounds.max.y - dkd_modelBounds.min.y);
  const dkd_centerY = (dkd_box.min.y + dkd_box.max.y) * 0.5;
  const dkd_relativeY = (dkd_centerY - dkd_modelBounds.min.y) / dkd_height;
  const dkd_color = Array.isArray(dkd_mesh.material) ? dkd_mesh.material[0]?.color : dkd_mesh.material?.color;
  const dkd_red = Number(dkd_color?.r) || 0;
  const dkd_green = Number(dkd_color?.g) || 0;
  const dkd_blue = Number(dkd_color?.b) || 0;
  const dkd_yellowOrSkin = (dkd_red > 0.42 && dkd_green > 0.20 && dkd_blue < 0.30) || (dkd_red > 0.52 && dkd_green > 0.45 && dkd_blue < 0.22);
  return dkd_relativeY > 0.53 && dkd_yellowOrSkin;
}

function dkd_v07CorrectRiderOnly(dkd_bike) {
  if (!dkd_bike || dkd_bike.userData?.dkd_v07RiderCorrected) return dkd_bike;
  if (!String(dkd_bike.name || '').includes('dkd_city50_v061')) return dkd_bike;
  const dkd_model = dkd_bike.children.find(dkd_child => dkd_child?.name === 'dkd_v061_yamaha_soulgt125_quaternius_rider') || dkd_bike.children.find(dkd_child => dkd_child?.isGroup);
  if (!dkd_model) return dkd_bike;

  const dkd_modelBounds = new dkd_three.Box3().setFromObject(dkd_model);
  let dkd_riderMeshes = 0;
  dkd_model.children.forEach((dkd_mesh, dkd_index) => {
    if (!dkd_v07RiderCandidate(dkd_mesh, dkd_index, dkd_modelBounds)) return;
    if (dkd_mesh.userData?.dkd_v07RiderHeading) return;
    // Mesh positions in DK61 are authored in common model coordinates with local position 0,
    // therefore this rotates the selected rider geometry around the same model origin without
    // moving or reorienting any motorcycle mesh.
    dkd_mesh.rotation.y += Math.PI;
    dkd_mesh.userData.dkd_v07RiderHeading = true;
    dkd_riderMeshes += 1;
  });
  dkd_bike.userData.dkd_v07RiderCorrected = true;
  dkd_bike.userData.dkd_v07RiderMeshes = dkd_riderMeshes;
  return dkd_bike;
}

dkd_Scene.prototype.dkd_buildBike = function dkd_v07BuildBike(dkd_kind = 'scooter') {
  const dkd_bike = dkd_v07Previous.dkd_buildBike.call(this, dkd_kind);
  // The v0.6.1 starter swaps its optimized model asynchronously on some devices.
  // Correct immediately and once more on the next frames so the rider-only transform
  // also catches the asynchronously replaced Yamaha/Worker assembly.
  dkd_v07CorrectRiderOnly(dkd_bike);
  const dkd_scene = this;
  let dkd_attempts = 0;
  const dkd_recheck = () => {
    dkd_attempts += 1;
    dkd_v07CorrectRiderOnly(dkd_scene.dkd_bike);
    if (dkd_attempts < 24 && dkd_scene.dkd_bike?.userData?.dkd_v07RiderMeshes == null) requestAnimationFrame(dkd_recheck);
  };
  requestAnimationFrame(dkd_recheck);
  return dkd_bike;
};

function dkd_v07SettingsBlock(dkd_game) {
  const dkd_settings = dkd_game?.dkd_state?.dkd_settings || {};
  const dkd_camera = String(dkd_settings.dkd_camera || 'chase');
  const dkd_assist = dkd_settings.dkd_assist !== false;
  const dkd_haptics = dkd_settings.dkd_haptics !== false;
  const dkd_motion = dkd_settings.dkd_motion !== false;
  return `
    <div class="dkd-v07-settings-block" id="dkd-v07-camera-settings">
      <div class="dkd-divider"></div>
      <h3>Sürüş ve kamera</h3>
      <p class="dkd-muted dkd-text-sm">Kamera açısını ve sürüş yardımcılarını cihazına göre ayarla.</p>
      <div class="dkd-v07-toggle-row">
        <button class="dkd-v07-setting-button ${dkd_assist?'dkd-selected':''}" data-dkd-action="toggle-assist">Direksiyon yardımı<small>${dkd_assist?'AÇIK':'KAPALI'}</small></button>
        <button class="dkd-v07-setting-button ${dkd_haptics?'dkd-selected':''}" data-dkd-action="toggle-haptics">Titreşim<small>${dkd_haptics?'AÇIK':'KAPALI'}</small></button>
      </div>
      <div class="dkd-v07-toggle-row">
        <button class="dkd-v07-setting-button ${dkd_motion?'dkd-selected':''}" data-dkd-action="toggle-motion">Arayüz animasyonu<small>${dkd_motion?'AÇIK':'KAPALI'}</small></button>
      </div>
      <h3 style="margin-top:22px">Kamera mesafesi</h3>
      <div class="dkd-v07-camera-grid">
        <button class="dkd-v07-setting-button ${dkd_camera==='near'?'dkd-selected':''}" data-dkd-action="camera-mode:near">Yakın<small>SÜRÜCÜ</small></button>
        <button class="dkd-v07-setting-button ${dkd_camera==='chase'?'dkd-selected':''}" data-dkd-action="camera-mode:chase">Takip<small>STANDART</small></button>
        <button class="dkd-v07-setting-button ${dkd_camera==='high'?'dkd-selected':''}" data-dkd-action="camera-mode:high">Yüksek<small>GENİŞ</small></button>
      </div>
      <div class="dkd-v07-audio-note">v0.7 ses motoru: Kurye Merkezi ve vardiya sürüşü aynı anda çalmaz. Her ekranın tek bir oyun müziği sahibi vardır.</div>
    </div>`;
}

dkd_Game.prototype.dkd_view_settings = function dkd_v07Settings() {
  let dkd_html = String(dkd_v07Previous.dkd_viewSettings.call(this));
  dkd_html = dkd_html.replace(/v0\.6\.1/g, dkd_v07Version).replace(/v0\.6(?!\.\d)/g, dkd_v07Version);
  if (dkd_html.includes('dkd-v07-camera-settings')) return dkd_html;
  const dkd_block = dkd_v07SettingsBlock(this);
  const dkd_marker = /(<div class="dkd-divider"><\/div>\s*<h3>Kayıt ve bilgi<\/h3>)/i;
  if (dkd_marker.test(dkd_html)) return dkd_html.replace(dkd_marker, `${dkd_block}$1`);
  const dkd_adminMarker = /(<div class="dkd-divider"><\/div>\s*<h3>(?:Yönetici araçları|Hesabım)<\/h3>)/i;
  if (dkd_adminMarker.test(dkd_html)) return dkd_html.replace(dkd_adminMarker, `${dkd_block}$1`);
  return dkd_html.replace(/(<\/main>)/i, `${dkd_block}$1`);
};

dkd_Game.prototype.dkd_startRun = function dkd_v07StartRun() {
  const dkd_audio = this.dkd_audio;
  if (dkd_audio) {
    dkd_v07PauseEveryMediaExcept(dkd_audio, -1);
    dkd_v07StopLegacyHome(dkd_audio);
    dkd_audio.dkd_v07AudioOwner = 'transition';
  }
  const dkd_result = dkd_v07Previous.dkd_startRun.call(this);
  if (this.dkd_run) dkd_v07EnforceDrive(this, true);
  return dkd_result;
};

dkd_Audio.prototype.dkd_update = function dkd_v07AudioUpdate(dkd_run) {
  const dkd_result = dkd_v07Previous.dkd_audioUpdate.call(this, dkd_run);
  const dkd_game = dkd_v07Game;
  const dkd_page = document.documentElement?.dataset?.dkdPage || dkd_game?.dkd_pageName || '';
  const dkd_active = Boolean(dkd_run && !dkd_run.dkd_finished && !dkd_run.dkd_failed);
  if (dkd_active || dkd_page === 'drive') {
    if (dkd_game) dkd_v07EnforceDrive(dkd_game, false);
  } else if (dkd_page === 'home' && dkd_game) {
    dkd_v07StartHome(dkd_game);
  }
  return dkd_result;
};

dkd_Game.prototype.dkd_render = function dkd_v07Render(dkd_page, dkd_arg = null) {
  dkd_v07Game = this;
  if (dkd_page === 'drive') {
    dkd_v07PauseEveryMediaExcept(this.dkd_audio, -1);
    dkd_v07StopLegacyHome(this.dkd_audio);
  }
  const dkd_result = dkd_v07Previous.dkd_render.call(this, dkd_page, dkd_arg);
  dkd_v07NormalizeVersion(this.dkd_root);
  if (dkd_page === 'home') dkd_v07StartHome(this);
  else if (dkd_page === 'drive' || this.dkd_run) dkd_v07EnforceDrive(this, false);
  return dkd_result;
};

function dkd_v07ResumeFromGesture() {
  if (!dkd_v07Game) return;
  const dkd_page = document.documentElement?.dataset?.dkdPage || dkd_v07Game.dkd_pageName || '';
  if (dkd_page === 'home') dkd_v07StartHome(dkd_v07Game);
  else if (dkd_page === 'drive' || dkd_v07Game.dkd_run) dkd_v07EnforceDrive(dkd_v07Game, false);
}
document.addEventListener('pointerdown', dkd_v07ResumeFromGesture, { passive: true });
document.addEventListener('touchstart', dkd_v07ResumeFromGesture, { passive: true });

window.dkd_lastMileRelease = dkd_v07Version;
window.dkd_lastMileRuntimeV07 = {
  dkd_version: dkd_v07Version,
  dkd_androidVersionCode: 1,
  dkd_expoSdk: 57,
  dkd_cameraSettingsRestored: true,
  dkd_audioSingleOwner: true,
  dkd_homeTrack: 'Kurye Merkezi: Gece Ufku',
  dkd_driveTrackCount: 5,
  dkd_riderAdditionalHeadingRadians: Math.PI,
  dkd_motorcycleAdditionalHeadingRadians: 0,
};

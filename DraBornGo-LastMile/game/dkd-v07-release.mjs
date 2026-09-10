// DraBornGo / Last Mile v0.7 runtime release layer.
// v0.7 goals: standard chase camera by default, rebuilt Settings UI, real MP3-only
// soundtrack playback, strict menu/drive separation, and visible release normalization.

const dkd_v07Previous = {
  dkd_render: dkd_Game.prototype.dkd_render,
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_audioStart: dkd_Audio.prototype.dkd_start,
  dkd_audioPause: dkd_Audio.prototype.dkd_pause,
};

const dkd_v07Version = 'v0.7.0';
const dkd_v07CameraDefault = 'chase';
let dkd_v07Game = null;

function dkd_v07InstallStyles() {
  if (document.getElementById('dkd-v07-settings-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v07-settings-style';
  dkd_style.textContent = `
    .dkd-v07-settings{display:grid;gap:14px;padding-bottom:12px;--dkd-v07-blue:#76a8ff;--dkd-v07-green:#7be0be;--dkd-v07-yellow:#f0ce73;--dkd-v07-pink:#e98bb9;--dkd-v07-orange:#ef9b6d}
    .dkd-v07-settings *{box-shadow:none!important;filter:none!important;background-image:none!important}
    .dkd-v07-status{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;border:1px solid #3a526d;border-left:7px solid var(--dkd-v07-blue);border-radius:22px;background:#142238;padding:16px}
    .dkd-v07-status h2{font-size:20px;margin:4px 0}.dkd-v07-status small{display:block;color:#9fb0c7;line-height:1.45}.dkd-v07-status-badge{border:1px solid #5479a8;border-radius:14px;background:#1e3553;padding:10px 12px;text-align:center}.dkd-v07-status-badge b{display:block;font-size:15px}.dkd-v07-status-badge small{font-size:8px;margin-top:3px}
    .dkd-v07-section{--dkd-v07-accent:var(--dkd-v07-blue);border:1px solid #38506b;border-top:6px solid var(--dkd-v07-accent);border-radius:22px;background:#111d30;padding:16px}
    .dkd-v07-section[data-dkd-tone='green']{--dkd-v07-accent:var(--dkd-v07-green)}.dkd-v07-section[data-dkd-tone='yellow']{--dkd-v07-accent:var(--dkd-v07-yellow)}.dkd-v07-section[data-dkd-tone='pink']{--dkd-v07-accent:var(--dkd-v07-pink)}.dkd-v07-section[data-dkd-tone='orange']{--dkd-v07-accent:var(--dkd-v07-orange)}
    .dkd-v07-section-head{display:flex;align-items:center;gap:11px;margin-bottom:13px}.dkd-v07-section-icon{width:43px;height:43px;border-radius:14px;background:var(--dkd-v07-accent);color:#101a28;display:grid;place-items:center}.dkd-v07-section-head h3{margin:0;font-size:17px}.dkd-v07-section-head small{display:block;margin-top:3px;color:#9aacc2;font-size:9px}
    .dkd-v07-option-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.dkd-v07-option{min-height:73px;border:1px solid #3d536d;border-radius:16px;background:#17253a;color:#eef4ff;padding:10px 8px;text-align:center}.dkd-v07-option b{display:block;font-size:12px}.dkd-v07-option small{display:block;margin-top:5px;color:#95a7bd;font-size:8px;line-height:1.25}.dkd-v07-option.dkd-selected{border-color:var(--dkd-v07-accent);background:#20334d;color:#fff}.dkd-v07-option.dkd-selected small{color:#d5dfeb}
    .dkd-v07-row{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;border-top:1px solid #2c4058;padding:13px 0}.dkd-v07-row:first-of-type{border-top:0;padding-top:2px}.dkd-v07-row b{display:block;font-size:13px}.dkd-v07-row small{display:block;color:#94a8c0;font-size:9px;line-height:1.4;margin-top:3px}.dkd-v07-switch{min-width:68px;border:1px solid #48607b;border-radius:14px;background:#1a2a40;color:#aab8c8;padding:9px 11px;font-weight:900;font-size:9px}.dkd-v07-switch.dkd-selected{background:var(--dkd-v07-accent);border-color:var(--dkd-v07-accent);color:#101a28}
    .dkd-v07-slider{margin-top:13px}.dkd-v07-slider label{display:flex;justify-content:space-between;gap:10px;font-size:11px;font-weight:900}.dkd-v07-slider label span{color:var(--dkd-v07-accent)}.dkd-v07-slider input{width:100%;margin-top:9px}
    .dkd-v07-camera-note{margin-top:10px;border:1px solid #45647f;border-radius:15px;background:#17293d;padding:10px 12px;color:#aebed0;font-size:9px;line-height:1.45}.dkd-v07-camera-note b{color:var(--dkd-v07-green)}
    .dkd-v07-actions{display:grid;gap:9px}.dkd-v07-actions .dkd-button{border:1px solid #415a75;background:#17283d;color:#eef4ff}.dkd-v07-actions .dkd-warning{border-color:#8c5d55;background:#3a2528;color:#ffd9d2}
    .dkd-v07-music-card{border:1px solid #3b536f;border-left:6px solid var(--dkd-v07-track,#76a8ff);border-radius:19px;background:#15253a;color:#eef4ff;padding:13px;width:100%;display:grid;grid-template-columns:46px 1fr auto;gap:11px;align-items:center;text-align:left;margin-bottom:10px}.dkd-v07-music-card.dkd-selected{border-color:var(--dkd-v07-track,#76a8ff);background:#20344c}.dkd-v07-music-icon{width:44px;height:44px;border-radius:14px;background:var(--dkd-v07-track,#76a8ff);color:#101a28;display:grid;place-items:center}.dkd-v07-music-card b{display:block;font-size:14px}.dkd-v07-music-card small{display:block;color:#9fb1c8;font-size:9px;margin-top:4px}.dkd-v07-music-card strong{font-size:9px;color:var(--dkd-v07-track,#76a8ff)}
    @media(max-width:370px){.dkd-v07-status{grid-template-columns:1fr}.dkd-v07-option-grid{grid-template-columns:1fr}.dkd-v07-music-card{grid-template-columns:42px 1fr}.dkd-v07-music-card strong{grid-column:2}}
  `;
  document.head.appendChild(dkd_style);
}

dkd_v07InstallStyles();

function dkd_v07NormalizeCamera(dkd_state) {
  if (!dkd_state?.dkd_settings) return;
  if (!['near', 'chase', 'high'].includes(dkd_state.dkd_settings.dkd_camera)) dkd_state.dkd_settings.dkd_camera = dkd_v07CameraDefault;
}

function dkd_v07StopSource(dkd_source) {
  if (!dkd_source) return;
  try { dkd_source.stop(); } catch {}
  try { dkd_source.disconnect(); } catch {}
}

function dkd_v07MuteProcedural(dkd_audio) {
  if (!dkd_audio) return;
  dkd_v07StopSource(dkd_audio.dkd_v061FinalHomeSource);
  dkd_v07StopSource(dkd_audio.dkd_v061HomeSource);
  dkd_v07StopSource(dkd_audio.dkd_v05MenuSource);
  dkd_v07StopSource(dkd_audio.dkd_v05DriveSource);
  dkd_v07StopSource(dkd_audio.dkd_v04MenuLoopSource);
  dkd_v07StopSource(dkd_audio.dkd_v04DriveLoopSource);
  dkd_audio.dkd_v061FinalHomeSource = null;
  dkd_audio.dkd_v061HomeSource = null;
  dkd_audio.dkd_v05MenuSource = null;
  dkd_audio.dkd_v05DriveSource = null;
  dkd_audio.dkd_v04MenuLoopSource = null;
  dkd_audio.dkd_v04DriveLoopSource = null;
  if (typeof dkd_v04StopMusicVoices === 'function') dkd_v04StopMusicVoices(dkd_audio);
  if (!dkd_audio.dkd_context) return;
  const dkd_now = dkd_audio.dkd_context.currentTime;
  for (const dkd_gain of [dkd_audio.dkd_music, dkd_audio.dkd_v04MenuMusic, dkd_audio.dkd_v04DriveMusic]) {
    try {
      if (dkd_gain?.gain) {
        dkd_gain.gain.cancelScheduledValues(dkd_now);
        dkd_gain.gain.setValueAtTime(0, dkd_now);
      }
    } catch {}
  }
}

function dkd_v07EnsureMedia(dkd_audio) {
  if (!dkd_audio || typeof dkd_v05RoadAudioEnsure !== 'function') return false;
  const dkd_ready = dkd_v05RoadAudioEnsure(dkd_audio);
  if (!dkd_ready || !Array.isArray(dkd_audio.dkd_v05MediaPlayers)) return false;
  for (const dkd_player of dkd_audio.dkd_v05MediaPlayers) {
    dkd_player.loop = true;
    dkd_player.preload = 'auto';
    dkd_player.setAttribute('playsinline', '');
  }
  return true;
}

function dkd_v07MenuIndex() {
  if (!Array.isArray(dkd_v05MediaAssets)) return 0;
  const dkd_index = dkd_v05MediaAssets.findIndex(dkd_asset => dkd_asset.dkd_mode === 'menu');
  return Math.max(0, dkd_index);
}

function dkd_v07DriveIndices() {
  if (!Array.isArray(dkd_v05MediaAssets)) return [];
  return dkd_v05MediaAssets.map((dkd_asset, dkd_index) => dkd_asset.dkd_mode === 'drive' ? dkd_index : -1).filter(dkd_index => dkd_index >= 0);
}

function dkd_v07TargetVolume(dkd_audio, dkd_drive) {
  const dkd_setting = dkd_clamp(Number(dkd_audio?.dkd_state?.dkd_settings?.dkd_music) || 0, 0, 1);
  return Math.min(1, dkd_setting * (dkd_drive ? 1.0 : 0.72));
}

function dkd_v07PlayMedia(dkd_audio, dkd_index, dkd_drive, dkd_restart = false) {
  if (!dkd_v07EnsureMedia(dkd_audio)) return;
  const dkd_safeIndex = Math.max(0, Math.min(dkd_audio.dkd_v05MediaPlayers.length - 1, Number(dkd_index) || 0));
  const dkd_next = dkd_audio.dkd_v05MediaPlayers[dkd_safeIndex];
  const dkd_target = dkd_v07TargetVolume(dkd_audio, dkd_drive);
  for (let dkd_playerIndex = 0; dkd_playerIndex < dkd_audio.dkd_v05MediaPlayers.length; dkd_playerIndex += 1) {
    const dkd_player = dkd_audio.dkd_v05MediaPlayers[dkd_playerIndex];
    if (dkd_playerIndex === dkd_safeIndex) continue;
    try { dkd_player.pause(); } catch {}
    try { dkd_player.volume = 0; } catch {}
  }
  if (dkd_restart) {
    try { dkd_next.currentTime = 0; } catch {}
  }
  dkd_next.volume = dkd_target;
  if (!dkd_audio.dkd_muted && dkd_next.paused) dkd_next.play().catch(() => {});
  dkd_audio.dkd_v05MediaCurrent = dkd_next;
  dkd_audio.dkd_v05MediaCurrentIndex = dkd_safeIndex;
  dkd_audio.dkd_v07Mode = dkd_drive ? 'drive-mp3' : 'menu-mp3';
}

function dkd_v07ChooseDrive(dkd_audio, dkd_run) {
  const dkd_indices = dkd_v07DriveIndices();
  if (!dkd_indices.length) return dkd_v07MenuIndex();
  if (Number.isInteger(dkd_audio.dkd_v07PreviewGlobalIndex) && dkd_indices.includes(dkd_audio.dkd_v07PreviewGlobalIndex)) return dkd_audio.dkd_v07PreviewGlobalIndex;
  const dkd_runKey = String(dkd_run?.dkd_id || dkd_run?.dkd_order?.dkd_id || dkd_run?.dkd_order?.dkd_seed || 'dkd_v07_run');
  if (dkd_audio.dkd_v07RunKey === dkd_runKey && Number.isInteger(dkd_audio.dkd_v07RunIndex)) return dkd_audio.dkd_v07RunIndex;
  let dkd_hash = 2166136261;
  for (let dkd_index = 0; dkd_index < dkd_runKey.length; dkd_index += 1) {
    dkd_hash ^= dkd_runKey.charCodeAt(dkd_index);
    dkd_hash = Math.imul(dkd_hash, 16777619);
  }
  let dkd_position = (dkd_hash >>> 0) % dkd_indices.length;
  if (dkd_indices.length > 1 && dkd_indices[dkd_position] === dkd_audio.dkd_v07LastDriveIndex) dkd_position = (dkd_position + 1) % dkd_indices.length;
  dkd_audio.dkd_v07RunKey = dkd_runKey;
  dkd_audio.dkd_v07RunIndex = dkd_indices[dkd_position];
  dkd_audio.dkd_v07LastDriveIndex = dkd_audio.dkd_v07RunIndex;
  return dkd_audio.dkd_v07RunIndex;
}

dkd_Audio.prototype.dkd_start = function dkd_v07AudioStart() {
  const dkd_result = dkd_v07Previous.dkd_audioStart.call(this);
  dkd_v07EnsureMedia(this);
  dkd_v07MuteProcedural(this);
  return dkd_result;
};

dkd_Audio.prototype.dkd_update = function dkd_v07AudioUpdate(dkd_run) {
  if (!this.dkd_context) this.dkd_start();
  dkd_v07MuteProcedural(this);
  const dkd_active = Boolean(dkd_run && !dkd_run.dkd_paused && !dkd_run.dkd_finished && !dkd_run.dkd_failed);
  if (this.dkd_context && this.dkd_context.state === 'running') {
    const dkd_now = this.dkd_context.currentTime;
    if (this.dkd_master?.gain) this.dkd_master.gain.setTargetAtTime(0.84, dkd_now, 0.12);
    if (this.dkd_effects?.gain) this.dkd_effects.gain.setTargetAtTime(dkd_clamp(Number(this.dkd_state.dkd_settings.dkd_effects) || 0, 0, 1), dkd_now, 0.06);
    if (this.dkd_motorGain?.gain) this.dkd_motorGain.gain.setTargetAtTime(dkd_active ? 0.014 + dkd_run.dkd_speed * 0.0036 : 0, dkd_now, 0.06);
    if (this.dkd_motor?.frequency) this.dkd_motor.frequency.setTargetAtTime(dkd_active ? 44 + dkd_run.dkd_speed * 5.2 : 44, dkd_now, 0.06);
    if (this.dkd_rainGain?.gain) this.dkd_rainGain.gain.setTargetAtTime(dkd_active ? dkd_run.dkd_weather.dkd_rain * 0.39 + Math.abs(dkd_run.dkd_weather.dkd_wind || 0) * 0.010 : 0, dkd_now, 0.18);
  }
  const dkd_page = document.documentElement?.dataset?.dkdPage || '';
  if (dkd_active || dkd_page === 'drive') {
    this.dkd_v07PreviewGlobalIndex = null;
    dkd_v07PlayMedia(this, dkd_v07ChooseDrive(this, dkd_run), true, false);
  } else if (dkd_page === 'music' && Number.isInteger(this.dkd_v07PreviewGlobalIndex)) {
    dkd_v07PlayMedia(this, this.dkd_v07PreviewGlobalIndex, true, false);
  } else {
    dkd_v07PlayMedia(this, dkd_v07MenuIndex(), false, false);
  }
};

dkd_Audio.prototype.dkd_pause = function dkd_v07AudioPause(dkd_paused) {
  const dkd_result = dkd_v07Previous.dkd_audioPause.call(this, dkd_paused);
  if (!dkd_v07EnsureMedia(this)) return dkd_result;
  for (const dkd_player of this.dkd_v05MediaPlayers) {
    if (dkd_paused) {
      try { dkd_player.pause(); } catch {}
    }
  }
  if (!dkd_paused && this.dkd_v05MediaCurrent) this.dkd_v05MediaCurrent.play().catch(() => {});
  return dkd_result;
};

function dkd_v07NormalizeVisibleUi(dkd_root) {
  if (!dkd_root) return;
  for (const dkd_chip of dkd_root.querySelectorAll?.('.dkd-version') || []) dkd_chip.textContent = dkd_v07Version;
  const dkd_walker = document.createTreeWalker(dkd_root, NodeFilter.SHOW_TEXT);
  const dkd_nodes = [];
  while (dkd_walker.nextNode()) dkd_nodes.push(dkd_walker.currentNode);
  for (const dkd_node of dkd_nodes) {
    const dkd_value = String(dkd_node.nodeValue || '');
    const dkd_next = dkd_value.replace(/\bv0\.6\.1\b/g, dkd_v07Version).replace(/\bV0\.5\b/g, 'V0.7');
    if (dkd_next !== dkd_value) dkd_node.nodeValue = dkd_next;
  }
}

dkd_Game.prototype.dkd_view_settings = function dkd_v07SettingsView() {
  const dkd_state = this.dkd_state;
  dkd_v07NormalizeCamera(dkd_state);
  const dkd_camera = dkd_state.dkd_settings.dkd_camera;
  const dkd_quality = dkd_state.dkd_settings.dkd_quality;
  return this.dkd_page('Ayarlar', `<div class="dkd-v07-settings">
    <div class="dkd-v07-status"><div><span class="dkd-kicker">DRA SİSTEM / ANDROID</span><h2>Oyun deneyimini kendine göre ayarla.</h2><small>${dkd_v07Version} · Expo SDK 57 · Android versionCode 1 · Türkçe</small></div><div class="dkd-v07-status-badge"><b>EXPO GO</b><small>SDK 57 TEST</small></div></div>

    <section class="dkd-v07-section" data-dkd-tone="green"><div class="dkd-v07-section-head"><span class="dkd-v07-section-icon">${dkd_icon('camera')}</span><div><h3>Kamera</h3><small>SÜRÜŞ GÖRÜŞ AÇISI</small></div></div><div class="dkd-v07-option-grid">
      ${[['near','Yakın','Motor odaklı'],['chase','Takip','Standart · varsayılan'],['high','Yüksek','Daha geniş görüş']].map(dkd_item => `<button class="dkd-v07-option ${dkd_camera===dkd_item[0]?'dkd-selected':''}" data-dkd-action="dkd-v07-camera:${dkd_item[0]}"><b>${dkd_item[1]}</b><small>${dkd_item[2]}</small></button>`).join('')}
    </div><div class="dkd-v07-camera-note"><b>Başlangıç kamera açısı: TAKİP / STANDART.</b> Yeni kayıtlarda sürücüyü arkadan dengeli mesafede takip eder. Eski kayıttaki geçerli kamera tercihi korunur.</div></section>

    <section class="dkd-v07-section"><div class="dkd-v07-section-head"><span class="dkd-v07-section-icon">${dkd_icon('eye')}</span><div><h3>Görüntü ve performans</h3><small>AKICILIK / DETAY</small></div></div><div class="dkd-v07-option-grid">
      ${[['low','Ekonomik','30 FPS hedef'],['balanced','Dengeli','30 FPS · varsayılan'],['high','Yüksek','60 FPS hedef']].map(dkd_item => `<button class="dkd-v07-option ${dkd_quality===dkd_item[0]?'dkd-selected':''}" data-dkd-action="dkd-v07-quality:${dkd_item[0]}"><b>${dkd_item[1]}</b><small>${dkd_item[2]}</small></button>`).join('')}
    </div><div class="dkd-v07-row"><div><b>Arayüz animasyonları</b><small>Menü geçişleri ve hareketli arayüz öğeleri.</small></div><button class="dkd-v07-switch ${dkd_state.dkd_settings.dkd_motion!==false?'dkd-selected':''}" data-dkd-action="dkd-v07-toggle:motion">${dkd_state.dkd_settings.dkd_motion!==false?'AÇIK':'KAPALI'}</button></div></section>

    <section class="dkd-v07-section" data-dkd-tone="pink"><div class="dkd-v07-section-head"><span class="dkd-v07-section-icon">${dkd_icon('music')}</span><div><h3>Ses ve müzik</h3><small>GERÇEK MP3 OYNATIMI</small></div></div><div class="dkd-v07-slider"><label>Müzik seviyesi <span>${Math.round(dkd_state.dkd_settings.dkd_music*100)}%</span></label><input type="range" min="0" max="100" value="${Math.round(dkd_state.dkd_settings.dkd_music*100)}" data-dkd-setting="dkd_music" aria-label="Müzik seviyesi"/></div><div class="dkd-v07-slider"><label>Motor ve efektler <span>${Math.round(dkd_state.dkd_settings.dkd_effects*100)}%</span></label><input type="range" min="0" max="100" value="${Math.round(dkd_state.dkd_settings.dkd_effects*100)}" data-dkd-setting="dkd_effects" aria-label="Efekt seviyesi"/></div><div class="dkd-v07-camera-note"><b>v0.7 ses motoru:</b> Menü ve vardiya müzikleri fiziksel MP3 dosyalarından oynatılır. WebAudio nota/melodi üretimi müzik kaynağı olarak kullanılmaz ve menü ile sürüş aynı anda çalmaz.</div></section>

    <section class="dkd-v07-section" data-dkd-tone="yellow"><div class="dkd-v07-section-head"><span class="dkd-v07-section-icon">${dkd_icon('wheel')}</span><div><h3>Sürüş yardımları</h3><small>KONTROL / GERİ BİLDİRİM</small></div></div><div class="dkd-v07-row"><div><b>Yardımcı direksiyon</b><small>Gaz ve fren sende; rota desteği direksiyon hatalarını yumuşatır.</small></div><button class="dkd-v07-switch ${dkd_state.dkd_settings.dkd_assist?'dkd-selected':''}" data-dkd-action="dkd-v07-toggle:assist">${dkd_state.dkd_settings.dkd_assist?'AÇIK':'KAPALI'}</button></div><div class="dkd-v07-row"><div><b>Titreşim</b><small>Çarpışma, teslimat ve önemli etkileşim geri bildirimi.</small></div><button class="dkd-v07-switch ${dkd_state.dkd_settings.dkd_haptics?'dkd-selected':''}" data-dkd-action="dkd-v07-toggle:haptics">${dkd_state.dkd_settings.dkd_haptics?'AÇIK':'KAPALI'}</button></div></section>

    <section class="dkd-v07-section" data-dkd-tone="orange"><div class="dkd-v07-section-head"><span class="dkd-v07-section-icon">${dkd_icon('fingerprint')}</span><div><h3>Test laboratuvarı</h3><small>ANA KARİYERDEN AYRI</small></div></div><p class="dkd-muted dkd-text-sm">Özel Müşteri ve Final sistemlerini ana kariyer kaydına dokunmadan hızlı test et.</p><div class="dkd-v07-actions">${dkd_button(dkd_state.dkd_training?'ANA KARİYERE DÖN':'TEST KARİYERİNİ AÇ',dkd_state.dkd_training?'test-exit':'test-enter','fingerprint','dkd-secondary')}${dkd_state.dkd_training?dkd_button('FİNAL TEST VERİSİNİ HAZIRLA','test-final','flag','dkd-secondary')+dkd_button('TEST KAYDINI BAŞA AL','test-reset','refresh','dkd-secondary'):''}</div></section>

    <section class="dkd-v07-section"><div class="dkd-v07-section-head"><span class="dkd-v07-section-icon">${dkd_icon('shield')}</span><div><h3>Kayıt ve sistem</h3><small>YEDEK / REHBER / VERİ</small></div></div><div class="dkd-v07-actions">${dkd_button('KAYDI DIŞA AKTAR','export-save','share','dkd-secondary')}${dkd_button('YEDEKTEN GERİ YÜKLE','import-save','refresh','dkd-secondary')}${dkd_button('NASIL OYNANIR','guide','info','dkd-secondary')}${dkd_button('VERİ VE DENEME KAPSAMI','privacy','shield','dkd-secondary')}${dkd_button('KARİYER KAYDINI SİL','reset','close','dkd-warning')}</div></section>
  </div>`);
};

dkd_Game.prototype.dkd_view_music = function dkd_v07MusicView() {
  const dkd_assets = Array.isArray(dkd_v05MediaAssets) ? dkd_v05MediaAssets : [];
  const dkd_driveAssets = dkd_assets.map((dkd_asset, dkd_index) => ({ dkd_asset, dkd_index })).filter(dkd_item => dkd_item.dkd_asset.dkd_mode === 'drive');
  const dkd_selected = Number.isInteger(this.dkd_audio.dkd_v07PreviewGlobalIndex) ? this.dkd_audio.dkd_v07PreviewGlobalIndex : this.dkd_audio.dkd_v05MediaCurrentIndex;
  const dkd_colors = ['#76a8ff','#7be0be','#f0ce73','#e98bb9','#ef9b6d'];
  return this.dkd_page('Müzik', `<div class="dkd-v07-settings"><div class="dkd-v07-status"><div><span class="dkd-kicker">V0.7 / OYUN MÜZİĞİ</span><h2>Melodi döngüsü değil, gerçek MP3.</h2><small>Yeni soundtrack build sırasında stereo WAV olarak oluşturulur ve 192 kbps MP3 dosyalarına dönüştürülür. Oyun çalışırken nota sentezlenmez.</small></div><div class="dkd-v07-status-badge"><b>MP3</b><small>STEREO 44.1K</small></div></div><div>${dkd_driveAssets.map((dkd_item, dkd_position) => `<button class="dkd-v07-music-card ${dkd_selected===dkd_item.dkd_index?'dkd-selected':''}" style="--dkd-v07-track:${dkd_colors[dkd_position%dkd_colors.length]}" data-dkd-action="dkd-v07-track:${dkd_item.dkd_index}"><span class="dkd-v07-music-icon">${dkd_icon(dkd_selected===dkd_item.dkd_index?'volume':'play')}</span><span><b>${dkd_escape(dkd_item.dkd_asset.dkd_name)}</b><small>${dkd_escape(dkd_item.dkd_asset.dkd_sub)} · vardiya soundtrack</small></span><strong>${dkd_item.dkd_asset.dkd_bpm} BPM</strong></button>`).join('')}</div><div class="dkd-v07-slider"><label>Müzik seviyesi <span>${Math.round(this.dkd_state.dkd_settings.dkd_music*100)}%</span></label><input type="range" min="0" max="100" value="${Math.round(this.dkd_state.dkd_settings.dkd_music*100)}" data-dkd-setting="dkd_music" aria-label="Müzik seviyesi"/></div></div>`);
};

dkd_Game.prototype.dkd_action = function dkd_v07Action(dkd_action) {
  const dkd_text = String(dkd_action || '');
  if (dkd_text.startsWith('dkd-v07-camera:')) {
    const dkd_camera = dkd_text.slice('dkd-v07-camera:'.length);
    if (['near','chase','high'].includes(dkd_camera)) {
      this.dkd_state.dkd_settings.dkd_camera = dkd_camera;
      this.dkd_save();
      this.dkd_toast(`Kamera: ${{near:'Yakın',chase:'Takip / Standart',high:'Yüksek'}[dkd_camera]}`);
    }
    return this.dkd_render('settings');
  }
  if (dkd_text.startsWith('dkd-v07-quality:')) {
    const dkd_quality = dkd_text.slice('dkd-v07-quality:'.length);
    if (['low','balanced','high'].includes(dkd_quality)) this.dkd_state.dkd_settings.dkd_quality = dkd_quality;
    this.dkd_save();
    return this.dkd_render('settings');
  }
  if (dkd_text.startsWith('dkd-v07-toggle:')) {
    const dkd_key = dkd_text.slice('dkd-v07-toggle:'.length);
    if (dkd_key === 'motion') this.dkd_state.dkd_settings.dkd_motion = this.dkd_state.dkd_settings.dkd_motion === false;
    if (dkd_key === 'assist') this.dkd_state.dkd_settings.dkd_assist = !this.dkd_state.dkd_settings.dkd_assist;
    if (dkd_key === 'haptics') this.dkd_state.dkd_settings.dkd_haptics = !this.dkd_state.dkd_settings.dkd_haptics;
    this.dkd_save();
    return this.dkd_render('settings');
  }
  if (dkd_text.startsWith('dkd-v07-track:')) {
    const dkd_index = Number(dkd_text.slice('dkd-v07-track:'.length));
    const dkd_indices = dkd_v07DriveIndices();
    if (Number.isInteger(dkd_index) && dkd_indices.includes(dkd_index)) {
      this.dkd_audio.dkd_v07PreviewGlobalIndex = dkd_index;
      dkd_v07PlayMedia(this.dkd_audio, dkd_index, true, true);
      const dkd_asset = dkd_v05MediaAssets[dkd_index];
      this.dkd_toast(`Müzik: ${dkd_asset?.dkd_name || 'Vardiya soundtrack'}`);
    }
    return this.dkd_render('music');
  }
  return dkd_v07Previous.dkd_action.call(this, dkd_action);
};

dkd_Game.prototype.dkd_render = function dkd_v07Render(dkd_page, dkd_arg = null) {
  dkd_v07Game = this;
  dkd_v07NormalizeCamera(this.dkd_state);
  const dkd_result = dkd_v07Previous.dkd_render.call(this, dkd_page, dkd_arg);
  dkd_v07NormalizeVisibleUi(this.dkd_root);
  dkd_v07MuteProcedural(this.dkd_audio);
  const dkd_drive = dkd_page === 'drive' || Boolean(this.dkd_run && !this.dkd_run.dkd_paused && !this.dkd_run.dkd_finished && !this.dkd_run.dkd_failed);
  if (dkd_drive) dkd_v07PlayMedia(this.dkd_audio, dkd_v07ChooseDrive(this.dkd_audio, this.dkd_run), true, false);
  else if (dkd_page !== 'music' || !Number.isInteger(this.dkd_audio.dkd_v07PreviewGlobalIndex)) dkd_v07PlayMedia(this.dkd_audio, dkd_v07MenuIndex(), false, false);
  return dkd_result;
};

function dkd_v07ResumeFromGesture() {
  if (!dkd_v07Game) return;
  dkd_v07Game.dkd_audio.dkd_start();
  dkd_v07Game.dkd_audio.dkd_update(dkd_v07Game.dkd_run);
}
document.addEventListener('pointerdown', dkd_v07ResumeFromGesture, { passive: true });
document.addEventListener('touchstart', dkd_v07ResumeFromGesture, { passive: true });

window.dkd_lastMileV07 = {
  dkd_version: dkd_v07Version,
  dkd_androidVersionCode: 1,
  dkd_cameraDefault: dkd_v07CameraDefault,
  dkd_audioRuntime: 'physical-mp3-only',
  dkd_menuDriveIsolation: true,
  dkd_settingsStyle: 'flat-color-no-shadow-no-glow-no-gradient',
};

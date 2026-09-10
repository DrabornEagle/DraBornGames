// DraBornGo / Last Mile v0.5 roadwork + media soundtrack + service assistance hotfix.
// Loaded last. Replaces procedural menu/drive loops with rendered MP3 tracks,
// adds visible roadwork props, fixes the hub sign screen position, updates stale v0.4 UI text,
// and offers a free fuel/maintenance rescue when the player's wallet cannot cover service.

const dkd_v05RoadAudioPrevious = {
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_render: dkd_Game.prototype.dkd_render,
  dkd_page: dkd_Game.prototype.dkd_page,
  dkd_audioStart: dkd_Audio.prototype.dkd_start,
  dkd_audioUpdate: dkd_Audio.prototype.dkd_update,
  dkd_audioPause: dkd_Audio.prototype.dkd_pause,
  dkd_sceneBuildHub: dkd_Scene.prototype.dkd_buildHub,
  dkd_sceneRefreshBrand: dkd_Scene.prototype.dkd_refreshBrand,
  dkd_sceneUpdate: dkd_Scene.prototype.dkd_update,
  dkd_viewMusic: dkd_Game.prototype.dkd_view_music,
  dkd_viewGarage: dkd_Game.prototype.dkd_view_garage,
};

const dkd_v05RoadAudioDriveAssets = dkd_v05MediaAssets.filter(dkd_asset => dkd_asset.dkd_mode === 'drive');
const dkd_v05RoadAudioMenuAsset = dkd_v05MediaAssets.find(dkd_asset => dkd_asset.dkd_mode === 'menu') || dkd_v05MediaAssets[0];

function dkd_v05RoadAudioInstallStyles() {
  if (document.getElementById('dkd-v05-road-audio-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v05-road-audio-style';
  dkd_style.textContent = `
    .dkd-v05-media-intro{border:1px solid #4b5f7c;border-left:7px solid #e982b7;border-radius:24px;background:#17253d;padding:18px;margin-bottom:16px;animation:dkd-v05-media-in .32s ease-out both}
    .dkd-v05-media-now{display:flex;align-items:center;gap:12px;margin-top:14px;border:1px solid #415675;border-radius:18px;background:#132239;padding:13px}.dkd-v05-media-now>span{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;background:#e982b7;color:#142239}.dkd-v05-media-now b{display:block;font-size:16px}.dkd-v05-media-now small{display:block;margin-top:3px;color:#9fb0c8;font-size:9px}
    .dkd-v05-media-list{display:grid;gap:10px}.dkd-v05-media-track{--dkd-media:#8aa7ee;width:100%;display:grid;grid-template-columns:50px 1fr auto;align-items:center;gap:12px;border:1px solid #405675;border-left:7px solid var(--dkd-media);border-radius:20px;background:#182741;color:#eef4ff;padding:13px;text-align:left;transition:transform .15s ease,border-color .15s ease,background-color .15s ease}.dkd-v05-media-track:active{transform:scale(.985)}.dkd-v05-media-track.dkd-selected{border-color:var(--dkd-media);background:#20314c}.dkd-v05-media-track-icon{width:48px;height:48px;border-radius:15px;display:grid;place-items:center;background:var(--dkd-media);color:#142239}.dkd-v05-media-track-icon svg{width:24px;height:24px}.dkd-v05-media-track b{display:block;font-size:15px}.dkd-v05-media-track small{display:block;margin-top:3px;color:#a7b7cc}.dkd-v05-media-track-meta{text-align:right}.dkd-v05-media-track-meta span{display:block;font-size:8px;color:#9aacbf}.dkd-v05-media-track-meta strong{display:block;margin-top:4px;font-size:10px;color:var(--dkd-media)}
    #dkd-modal .dkd-v05-free-service{--dkd-free:#65cfc7;border:1px solid #4c637a;border-top:8px solid var(--dkd-free);background:#17243b;animation:dkd-v05-free-pop .3s cubic-bezier(.2,.86,.32,1.16) both}.dkd-v05-free-head{display:flex;align-items:center;gap:13px}.dkd-v05-free-icon{width:60px;height:60px;border-radius:19px;background:var(--dkd-free);color:#142239;display:grid;place-items:center;animation:dkd-v05-free-breathe 1.45s ease-in-out infinite}.dkd-v05-free-icon svg{width:30px;height:30px}.dkd-v05-free-service h2{margin:2px 0 0;font-size:23px}.dkd-v05-free-service p{line-height:1.55;color:#b9c7db}.dkd-v05-free-badge{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--dkd-free);border-radius:999px;padding:7px 10px;color:var(--dkd-free);font-size:9px;font-weight:950;letter-spacing:.5px;margin:12px 0}.dkd-v05-free-stats{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:12px 0 15px}.dkd-v05-free-stats>div{border:1px solid #405675;border-radius:15px;background:#132139;padding:11px}.dkd-v05-free-stats small{display:block;color:#92a5bf;font-size:8px}.dkd-v05-free-stats b{display:block;margin-top:4px;font-size:20px}.dkd-v05-free-service .dkd-button:first-child{background:var(--dkd-free);border-color:var(--dkd-free);color:#142239}.dkd-v05-free-inline{color:#65cfc7;font-weight:950;letter-spacing:.25px}
    @keyframes dkd-v05-media-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
    @keyframes dkd-v05-free-pop{from{opacity:0;transform:translateY(15px) scale(.95)}to{opacity:1;transform:none}}
    @keyframes dkd-v05-free-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
    html[data-dkd-motion='off'] .dkd-v05-media-intro,html[data-dkd-motion='off'] .dkd-v05-free-service,html[data-dkd-motion='off'] .dkd-v05-free-icon{animation:none!important}
    @media(max-width:370px){.dkd-v05-media-track{grid-template-columns:44px 1fr}.dkd-v05-media-track-meta{grid-column:2;text-align:left}.dkd-v05-media-track-meta span,.dkd-v05-media-track-meta strong{display:inline;margin-right:8px}}
  `;
  document.head.appendChild(dkd_style);
}

dkd_v05RoadAudioInstallStyles();

function dkd_v05RoadAudioHash(dkd_value) {
  let dkd_hash = 2166136261;
  const dkd_text = String(dkd_value || 'last-mile');
  for (let dkd_index = 0; dkd_index < dkd_text.length; dkd_index++) {
    dkd_hash ^= dkd_text.charCodeAt(dkd_index);
    dkd_hash = Math.imul(dkd_hash, 16777619);
  }
  return Math.abs(dkd_hash >>> 0);
}

function dkd_v05RoadAudioEnsure(dkd_audio) {
  if (!dkd_audio || !Array.isArray(dkd_v05MediaAssets) || !dkd_v05MediaAssets.length || typeof Audio === 'undefined') return false;
  if (dkd_audio.dkd_v05MediaPlayers) return true;
  dkd_audio.dkd_v05MediaPlayers = dkd_v05MediaAssets.map(dkd_asset => {
    const dkd_player = new Audio(dkd_asset.dkd_data);
    dkd_player.loop = true;
    dkd_player.preload = 'auto';
    dkd_player.volume = 0;
    dkd_player.setAttribute('playsinline', '');
    return dkd_player;
  });
  dkd_audio.dkd_v05MediaCurrentIndex = -1;
  dkd_audio.dkd_v05MediaCurrent = null;
  dkd_audio.dkd_v05MediaPreviewTrack = null;
  dkd_audio.dkd_v05MediaLastDriveIndex = -1;
  dkd_audio.dkd_v05MediaRunId = '';
  dkd_audio.dkd_v05MediaFadeToken = 0;
  return true;
}

function dkd_v05RoadAudioTargetVolume(dkd_audio) {
  return Math.max(0, Math.min(1, (Number(dkd_audio?.dkd_state?.dkd_settings?.dkd_music) || 0) * 1.12));
}

function dkd_v05RoadAudioMuteProcedural(dkd_audio) {
  if (!dkd_audio?.dkd_context) return;
  const dkd_now = dkd_audio.dkd_context.currentTime;
  for (const dkd_gain of [dkd_audio.dkd_music, dkd_audio.dkd_v04MenuMusic, dkd_audio.dkd_v04DriveMusic]) {
    try {
      if (dkd_gain?.gain) {
        dkd_gain.gain.cancelScheduledValues(dkd_now);
        dkd_gain.gain.setTargetAtTime(0, dkd_now, .02);
      }
    } catch {}
  }
}

function dkd_v05RoadAudioPlayIndex(dkd_audio, dkd_index, dkd_restart = false) {
  if (!dkd_v05RoadAudioEnsure(dkd_audio)) return;
  const dkd_safeIndex = Math.max(0, Math.min(dkd_audio.dkd_v05MediaPlayers.length - 1, Number(dkd_index) || 0));
  const dkd_next = dkd_audio.dkd_v05MediaPlayers[dkd_safeIndex];
  const dkd_old = dkd_audio.dkd_v05MediaCurrent;
  const dkd_target = dkd_v05RoadAudioTargetVolume(dkd_audio);

  if (dkd_old === dkd_next) {
    if (dkd_restart) {
      try { dkd_next.currentTime = 0; } catch {}
    }
    dkd_next.volume = dkd_target;
    if (dkd_next.paused && !dkd_audio.dkd_muted) dkd_next.play().catch(() => {});
    dkd_audio.dkd_v05MediaCurrentIndex = dkd_safeIndex;
    return;
  }

  const dkd_token = ++dkd_audio.dkd_v05MediaFadeToken;
  if (dkd_restart) {
    try { dkd_next.currentTime = 0; } catch {}
  }
  dkd_next.volume = 0;
  if (!dkd_audio.dkd_muted) dkd_next.play().catch(() => {});
  dkd_audio.dkd_v05MediaCurrent = dkd_next;
  dkd_audio.dkd_v05MediaCurrentIndex = dkd_safeIndex;
  const dkd_started = performance.now();
  const dkd_oldStart = dkd_old ? dkd_old.volume : 0;
  const dkd_fade = dkd_now => {
    if (dkd_audio.dkd_v05MediaFadeToken !== dkd_token) return;
    const dkd_progress = Math.max(0, Math.min(1, (dkd_now - dkd_started) / 650));
    dkd_next.volume = dkd_target * dkd_progress;
    if (dkd_old && dkd_old !== dkd_next) dkd_old.volume = dkd_oldStart * (1 - dkd_progress);
    if (dkd_progress < 1) requestAnimationFrame(dkd_fade);
    else if (dkd_old && dkd_old !== dkd_next) {
      try { dkd_old.pause(); } catch {}
    }
  };
  requestAnimationFrame(dkd_fade);
}

function dkd_v05RoadAudioMenuIndex() {
  const dkd_index = dkd_v05MediaAssets.indexOf(dkd_v05RoadAudioMenuAsset);
  return Math.max(0, dkd_index);
}

function dkd_v05RoadAudioDriveGlobalIndex(dkd_driveIndex) {
  const dkd_asset = dkd_v05RoadAudioDriveAssets[Math.max(0, Math.min(dkd_v05RoadAudioDriveAssets.length - 1, Number(dkd_driveIndex) || 0))];
  const dkd_index = dkd_v05MediaAssets.indexOf(dkd_asset);
  return Math.max(0, dkd_index);
}

function dkd_v05RoadAudioChooseDrive(dkd_audio, dkd_run) {
  if (!dkd_v05RoadAudioDriveAssets.length) return 0;
  const dkd_runId = String(dkd_run?.dkd_id || dkd_run?.dkd_order?.dkd_id || dkd_run?.dkd_order?.dkd_seed || Date.now());
  if (dkd_audio.dkd_v05MediaRunId === dkd_runId && dkd_audio.dkd_v05MediaLastDriveIndex >= 0) return dkd_audio.dkd_v05MediaLastDriveIndex;
  let dkd_next = dkd_v05RoadAudioHash(dkd_runId) % dkd_v05RoadAudioDriveAssets.length;
  if (dkd_v05RoadAudioDriveAssets.length > 1 && dkd_next === dkd_audio.dkd_v05MediaLastDriveIndex) dkd_next = (dkd_next + 1) % dkd_v05RoadAudioDriveAssets.length;
  dkd_audio.dkd_v05MediaRunId = dkd_runId;
  dkd_audio.dkd_v05MediaLastDriveIndex = dkd_next;
  return dkd_next;
}

dkd_Audio.prototype.dkd_start = function dkd_v05RoadAudioStart() {
  const dkd_result = dkd_v05RoadAudioPrevious.dkd_audioStart.call(this);
  dkd_v05RoadAudioEnsure(this);
  dkd_v05RoadAudioMuteProcedural(this);
  if (this.dkd_v05MediaCurrent && this.dkd_v05MediaCurrent.paused && !this.dkd_muted) this.dkd_v05MediaCurrent.play().catch(() => {});
  return dkd_result;
};

dkd_Audio.prototype.dkd_update = function dkd_v05RoadAudioUpdate(dkd_run) {
  const dkd_result = dkd_v05RoadAudioPrevious.dkd_audioUpdate.call(this, dkd_run);
  dkd_v05RoadAudioEnsure(this);
  dkd_v05RoadAudioMuteProcedural(this);
  const dkd_active = Boolean(dkd_run && !dkd_run.dkd_paused && !dkd_run.dkd_finished && !dkd_run.dkd_failed);
  if (dkd_active) {
    const dkd_driveIndex = dkd_v05RoadAudioChooseDrive(this, dkd_run);
    dkd_v05RoadAudioPlayIndex(this, dkd_v05RoadAudioDriveGlobalIndex(dkd_driveIndex), this.dkd_v05MediaCurrentIndex !== dkd_v05RoadAudioDriveGlobalIndex(dkd_driveIndex));
  } else if (Number.isFinite(this.dkd_v05MediaPreviewTrack)) {
    dkd_v05RoadAudioPlayIndex(this, dkd_v05RoadAudioDriveGlobalIndex(this.dkd_v05MediaPreviewTrack), false);
  } else {
    dkd_v05RoadAudioPlayIndex(this, dkd_v05RoadAudioMenuIndex(), false);
  }
  if (this.dkd_v05MediaCurrent) this.dkd_v05MediaCurrent.volume = dkd_v05RoadAudioTargetVolume(this);
  return dkd_result;
};

dkd_Audio.prototype.dkd_pause = function dkd_v05RoadAudioPause(dkd_paused) {
  const dkd_result = dkd_v05RoadAudioPrevious.dkd_audioPause.call(this, dkd_paused);
  if (this.dkd_v05MediaCurrent) {
    if (dkd_paused) {
      try { this.dkd_v05MediaCurrent.pause(); } catch {}
    } else this.dkd_v05MediaCurrent.play().catch(() => {});
  }
  return dkd_result;
};

function dkd_v05RoadAudioServiceInfo(dkd_game, dkd_kind) {
  const dkd_state = dkd_game?.dkd_state;
  const dkd_fleet = dkd_state?.dkd_fleet?.[dkd_state?.dkd_equipped];
  if (!dkd_state || !dkd_fleet) return null;
  const dkd_key = dkd_kind === 'refuel' ? 'dkd_fuel' : 'dkd_condition';
  const dkd_value = Math.max(0, Math.min(100, Number(dkd_fleet[dkd_key]) || 0));
  const dkd_cost = Math.ceil((100 - dkd_value) * (dkd_kind === 'refuel' ? 3 : 5));
  return {
    dkd_key,
    dkd_value,
    dkd_cost,
    dkd_wallet: Math.max(0, Number(dkd_state.dkd_wallet) || 0),
    dkd_name: dkd_kind === 'refuel' ? 'Yakıt / Şarj' : 'Araç Bakımı',
    dkd_icon: dkd_kind === 'refuel' ? 'fuel' : 'settings',
  };
}

function dkd_v05RoadAudioFreeServicePopup(dkd_game, dkd_kind) {
  const dkd_info = dkd_v05RoadAudioServiceInfo(dkd_game, dkd_kind);
  if (!dkd_info) return;
  const dkd_modal = document.getElementById('dkd-modal');
  if (!dkd_modal) return;
  dkd_modal.innerHTML = `<div class="dkd-modal-card dkd-v05-free-service" role="dialog" aria-modal="true" aria-label="Bugüne özel ücretsiz servis">
    <div class="dkd-v05-free-head"><span class="dkd-v05-free-icon">${dkd_icon(dkd_info.dkd_icon)}</span><div><span class="dkd-kicker">GARAJ DESTEĞİ</span><h2>Bugüne Özel Ücretsiz</h2></div></div>
    <div class="dkd-v05-free-badge">${dkd_icon('star',14)} BAKİYE YETERSİZ · ÜCRET ALINMAYACAK</div>
    <p>${dkd_info.dkd_name} için oyun bakiyen normal servis ücretini karşılamıyor. Vardiyada kalabilmen için bu işlem bugün ücretsiz tamamlanabilir.</p>
    <div class="dkd-v05-free-stats"><div><small>NORMAL SERVİS ÜCRETİ</small><b>${dkd_currency(dkd_info.dkd_cost)}</b></div><div><small>MEVCUT BAKİYE</small><b>${dkd_currency(dkd_info.dkd_wallet)}</b></div></div>
    <div class="dkd-stack">${dkd_button('ÜCRETSİZ TAMAMLA',`v05-free-service:${dkd_kind}`,'check')}${dkd_button('VAZGEÇ','modal-close','close','dkd-secondary')}</div>
  </div>`;
  try { dkd_game.dkd_audio?.dkd_effect('ding'); } catch {}
}

function dkd_v05RoadAudioCompleteFreeService(dkd_game, dkd_kind) {
  const dkd_info = dkd_v05RoadAudioServiceInfo(dkd_game, dkd_kind);
  if (!dkd_info) return;
  const dkd_fleet = dkd_game.dkd_state.dkd_fleet[dkd_game.dkd_state.dkd_equipped];
  dkd_fleet[dkd_info.dkd_key] = 100;
  dkd_game.dkd_closeModal();
  dkd_game.dkd_save();
  try { dkd_game.dkd_audio?.dkd_effect('success'); } catch {}
  dkd_game.dkd_toast(`${dkd_info.dkd_name} bugün ücretsiz tamamlandı.`);
  return dkd_game.dkd_render('garage');
}

function dkd_v05RoadworkDisposeGroup(dkd_scene) {
  const dkd_group = dkd_scene?.dkd_v05RoadworkGroup;
  if (!dkd_group) return;
  dkd_group.traverse(dkd_object => {
    if (!dkd_object.isMesh) return;
    try { dkd_object.geometry?.dispose(); } catch {}
    try { dkd_object.material?.map?.dispose?.(); } catch {}
    try {
      if (Array.isArray(dkd_object.material)) dkd_object.material.forEach(dkd_material => dkd_material?.dispose?.());
      else dkd_object.material?.dispose?.();
    } catch {}
  });
  try { dkd_scene.dkd_world.remove(dkd_group); } catch {}
  dkd_scene.dkd_v05RoadworkGroup = null;
  dkd_scene.dkd_v05RoadworkLights = [];
}

function dkd_v05RoadworkBuild(dkd_scene, dkd_run) {
  dkd_v05RoadworkDisposeGroup(dkd_scene);
  const dkd_group = new dkd_three.Group();
  const dkd_orange = dkd_scene.dkd_material('#ef8b45', .52, .08);
  const dkd_white = dkd_scene.dkd_material('#f4eadc', .55, .05);
  const dkd_dark = dkd_scene.dkd_material('#202a32', .72, .08);
  const dkd_yellow = dkd_scene.dkd_material('#f2c84f', .48, .12);
  const dkd_black = dkd_scene.dkd_material('#20242b', .82, .08);
  const dkd_amber = new dkd_three.MeshBasicMaterial({ color: '#ffc247' });

  dkd_scene.dkd_box(dkd_group, [7.2, .18, .28], [0, 1.15, 0], dkd_orange);
  for (let dkd_index = 0; dkd_index < 6; dkd_index++) {
    const dkd_x = -2.75 + dkd_index * 1.1;
    const dkd_bar = dkd_scene.dkd_box(dkd_group, [.58, .22, .30], [dkd_x, 1.16, -.02], dkd_white);
    dkd_bar.rotation.z = dkd_index % 2 === 0 ? .55 : -.55;
  }
  for (const dkd_x of [-3.2, 3.2]) {
    dkd_scene.dkd_box(dkd_group, [.18, 1.6, .18], [dkd_x, .78, 0], dkd_dark);
    const dkd_light = new dkd_three.Mesh(new dkd_three.SphereGeometry(.16, 10, 7), dkd_amber.clone());
    dkd_light.position.set(dkd_x, 1.72, 0);
    dkd_group.add(dkd_light);
    dkd_scene.dkd_v05RoadworkLights = dkd_scene.dkd_v05RoadworkLights || [];
    dkd_scene.dkd_v05RoadworkLights.push(dkd_light);
  }

  for (let dkd_index = 0; dkd_index < 9; dkd_index++) {
    const dkd_cone = new dkd_three.Mesh(new dkd_three.ConeGeometry(.32, .95, 12), dkd_orange.clone());
    const dkd_side = dkd_index % 2 === 0 ? -1 : 1;
    dkd_cone.position.set(dkd_side * (2.8 - dkd_index * .17), .48, 3 + dkd_index * 1.7);
    dkd_group.add(dkd_cone);
    const dkd_ring = new dkd_three.Mesh(new dkd_three.CylinderGeometry(.23, .27, .14, 12), dkd_white.clone());
    dkd_ring.position.set(dkd_cone.position.x, .50, dkd_cone.position.z);
    dkd_group.add(dkd_ring);
  }

  dkd_scene.dkd_box(dkd_group, [3.6, .08, 3.1], [-2.1, .05, -3.1], dkd_black);
  dkd_scene.dkd_box(dkd_group, [2.5, .45, 1.45], [2.55, .48, -3.2], dkd_dark);
  dkd_scene.dkd_box(dkd_group, [1.55, 1.15, 1.35], [2.55, 1.25, -3.15], dkd_yellow);
  dkd_scene.dkd_box(dkd_group, [.95, .72, 1.38], [2.55, 1.65, -3.13], dkd_scene.dkd_material('#42576a', .28, .24));
  const dkd_arm = dkd_scene.dkd_box(dkd_group, [.38, .38, 3.6], [1.0, 1.82, -4.15], dkd_yellow);
  dkd_arm.rotation.y = -.48;
  dkd_scene.dkd_box(dkd_group, [1.1, .38, .95], [-.55, .72, -5.15], dkd_yellow);

  const dkd_sign = dkd_scene.dkd_sign('YOL ÇALIŞMASI', 5.7, '#ffb24a', .95);
  dkd_sign.position.set(0, 3.05, 1.2);
  dkd_group.add(dkd_sign);
  const dkd_distanceSign = dkd_scene.dkd_sign('YAVAŞLA', 2.4, '#f4eadc', .55);
  dkd_distanceSign.position.set(0, 2.25, 1.22);
  dkd_group.add(dkd_distanceSign);

  const dkd_forward = 27;
  dkd_group.position.set(
    dkd_run.dkd_position[0] + Math.sin(dkd_run.dkd_heading) * dkd_forward,
    .02,
    dkd_run.dkd_position[1] + Math.cos(dkd_run.dkd_heading) * dkd_forward,
  );
  dkd_group.rotation.y = dkd_run.dkd_heading;
  dkd_scene.dkd_world.add(dkd_group);
  dkd_scene.dkd_v05RoadworkGroup = dkd_group;
  dkd_scene.dkd_v05RoadworkRunId = String(dkd_run.dkd_id || '');
}

dkd_Scene.prototype.dkd_buildHub = function dkd_v05RoadAudioBuildHub() {
  const dkd_result = dkd_v05RoadAudioPrevious.dkd_sceneBuildHub.call(this);
  if (this.dkd_companySign) this.dkd_companySign.position.x = 2.65;
  return dkd_result;
};

dkd_Scene.prototype.dkd_refreshBrand = function dkd_v05RoadAudioRefreshBrand(dkd_kind = this.dkd_bikeKind) {
  const dkd_result = dkd_v05RoadAudioPrevious.dkd_sceneRefreshBrand.call(this, dkd_kind);
  if (this.dkd_companySign) this.dkd_companySign.position.x = 2.65;
  return dkd_result;
};

dkd_Scene.prototype.dkd_update = function dkd_v05RoadAudioSceneUpdate(dkd_dt, dkd_run = null) {
  if (dkd_run?.dkd_event?.dkd_id === 'dkd_works') {
    const dkd_runId = String(dkd_run.dkd_id || '');
    if (!this.dkd_v05RoadworkGroup || this.dkd_v05RoadworkRunId !== dkd_runId) dkd_v05RoadworkBuild(this, dkd_run);
    if (this.dkd_v05RoadworkGroup) this.dkd_v05RoadworkGroup.visible = true;
    if (Array.isArray(this.dkd_v05RoadworkLights)) this.dkd_v05RoadworkLights.forEach((dkd_light, dkd_index) => {
      dkd_light.visible = Math.sin((this.dkd_time + dkd_index * .22) * 8.5) > -.15;
      const dkd_scale = dkd_light.visible ? 1.18 : .82;
      dkd_light.scale.setScalar(dkd_scale);
    });
  } else if (this.dkd_v05RoadworkGroup) this.dkd_v05RoadworkGroup.visible = false;
  return dkd_v05RoadAudioPrevious.dkd_sceneUpdate.call(this, dkd_dt, dkd_run);
};

dkd_Game.prototype.dkd_page = function dkd_v05RoadAudioPage(...dkd_args) {
  return dkd_v05RoadAudioPrevious.dkd_page.call(this, ...dkd_args)
    .replace(/v0\.4/g, 'v0.5')
    .replace(/V0\.4/g, 'V0.5');
};

dkd_Game.prototype.dkd_render = function dkd_v05RoadAudioRender(dkd_pageName, dkd_arg = null) {
  if (this.dkd_audio) this.dkd_audio.dkd_v05MediaPreviewTrack = dkd_pageName === 'music' ? this.dkd_audio.dkd_v05MediaPreviewTrack : null;
  const dkd_result = dkd_v05RoadAudioPrevious.dkd_render.call(this, dkd_pageName, dkd_arg);
  if (this.dkd_audio && dkd_pageName !== 'drive' && dkd_pageName !== 'music') {
    dkd_v05RoadAudioPlayIndex(this.dkd_audio, dkd_v05RoadAudioMenuIndex(), false);
  }
  return dkd_result;
};

dkd_Game.prototype.dkd_view_garage = function dkd_v05RoadAudioGarageView() {
  let dkd_html = dkd_v05RoadAudioPrevious.dkd_viewGarage.call(this);
  for (const dkd_kind of ['refuel', 'repair']) {
    const dkd_info = dkd_v05RoadAudioServiceInfo(this, dkd_kind);
    if (!dkd_info || dkd_info.dkd_cost <= 0 || dkd_info.dkd_wallet >= dkd_info.dkd_cost) continue;
    const dkd_suffix = dkd_kind === 'refuel' ? ' · DOLDUR' : ' · BAKIM';
    const dkd_original = `${dkd_currency(dkd_info.dkd_cost)}${dkd_suffix}`;
    dkd_html = dkd_html.replace(dkd_original, '<b class="dkd-v05-free-inline">BUGÜNE ÖZEL ÜCRETSİZ</b>');
  }
  return dkd_html;
};

dkd_Game.prototype.dkd_action = function dkd_v05RoadAudioAction(dkd_action) {
  const dkd_text = String(dkd_action || '');
  const [dkd_command, dkd_value] = dkd_text.split(':');

  if (dkd_command === 'track') {
    const dkd_index = Math.max(0, Math.min(dkd_v05RoadAudioDriveAssets.length - 1, Number(dkd_value) || 0));
    this.dkd_audio.dkd_v05MediaPreviewTrack = dkd_index;
    this.dkd_audio.dkd_track = dkd_index;
    dkd_v05RoadAudioPlayIndex(this.dkd_audio, dkd_v05RoadAudioDriveGlobalIndex(dkd_index), true);
    try { this.dkd_audio.dkd_effect('ding'); } catch {}
    return this.dkd_render('music');
  }

  if (dkd_command === 'refuel' || dkd_command === 'repair') {
    const dkd_info = dkd_v05RoadAudioServiceInfo(this, dkd_command);
    if (dkd_info && dkd_info.dkd_cost > 0 && dkd_info.dkd_wallet < dkd_info.dkd_cost) return dkd_v05RoadAudioFreeServicePopup(this, dkd_command);
  }

  if (dkd_command === 'v05-free-service' && (dkd_value === 'refuel' || dkd_value === 'repair')) return dkd_v05RoadAudioCompleteFreeService(this, dkd_value);

  return dkd_v05RoadAudioPrevious.dkd_action.call(this, dkd_action);
};

dkd_Game.prototype.dkd_view_music = function dkd_v05RoadAudioMusicView() {
  const dkd_preview = Number.isFinite(this.dkd_audio?.dkd_v05MediaPreviewTrack) ? this.dkd_audio.dkd_v05MediaPreviewTrack : 0;
  const dkd_selected = dkd_v05RoadAudioDriveAssets[dkd_preview] || dkd_v05RoadAudioDriveAssets[0];
  const dkd_colors = ['#e982b7','#8aa7ee','#65cfc7','#f0c66f','#c09bea'];
  const dkd_cards = dkd_v05RoadAudioDriveAssets.map((dkd_asset, dkd_index) => `
    <button class="dkd-v05-media-track ${dkd_preview===dkd_index?'dkd-selected':''}" style="--dkd-media:${dkd_colors[dkd_index % dkd_colors.length]}" data-dkd-action="track:${dkd_index}">
      <span class="dkd-v05-media-track-icon">${dkd_icon(dkd_preview===dkd_index?'volume':'play')}</span>
      <span><b>${dkd_escape(dkd_asset.dkd_name)}</b><small>${dkd_escape(dkd_asset.dkd_sub)} · gerçek MP3 ses dosyası</small></span>
      <span class="dkd-v05-media-track-meta"><span>${dkd_asset.dkd_bpm} BPM</span><strong>VARDİYA ${String(dkd_index + 1).padStart(2,'0')}</strong></span>
    </button>`).join('');
  return this.dkd_page('Müzik', `
    <div class="dkd-v05-media-intro"><span class="dkd-kicker">SON KİLOMETRE / V0.5 ÖZGÜN MÜZİK</span><h2 style="margin:10px 0 7px">Artık gerçek ses dosyaları çalıyor.</h2><p class="dkd-muted dkd-text-sm">Basit sentez döngüleri kapatıldı. Ana ekran ayrı bir özgün parça kullanır; her yeni vardiyada önceki vardiyadan farklı MP3 parçası otomatik seçilir.</p>
      <div class="dkd-v05-media-now"><span>${dkd_icon('music')}</span><div><small>ÖNİZLEME</small><b>${dkd_escape(dkd_selected?.dkd_name || 'Kızılay Hattı')}</b><small>${dkd_escape(dkd_selected?.dkd_sub || 'Urban Electro')} · ${dkd_selected?.dkd_bpm || 128} BPM</small></div></div></div>
    <div class="dkd-v05-media-list">${dkd_cards}</div>
    <div class="dkd-field"><label>Müzik seviyesi</label><input type="range" min="0" max="100" value="${Math.round(this.dkd_state.dkd_settings.dkd_music*100)}" data-dkd-setting="dkd_music" aria-label="Müzik seviyesi"/></div>`);
};
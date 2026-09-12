// DraBornGo / Last Mile v0.7.5 — driving audio, visible-obstacle safety and Courier Center home polish.
// Shared final runtime layer for Android/Expo and Web. No gradients, shadows or glow.

const dkd_v075DriveHomePrevious = {
  dkd_audioUpdate: dkd_Audio.prototype.dkd_update,
  dkd_viewDrive: dkd_Game.prototype.dkd_view_drive,
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_viewHome: dkd_Game.prototype.dkd_view_home,
  dkd_sceneSetRoute: dkd_Scene.prototype.dkd_setRoute,
};

const dkd_v075DriveHomeObstacleHalfExtents = {
  barrier: [1.60, .30],
  cones: [1.20, .45],
  crate: [.72, .72],
  pallet: [1.05, .78],
  tire: [1.10, .55],
  roadwork: [1.45, .38],
  pothole: [.72, .72],
  drum: [.58, .58],
};
const dkd_v075DriveHomeBikeHalfWidth = .27;
const dkd_v075DriveHomeBikeHalfLength = .54;
const dkd_v075DriveHomeRouteClearance = .62;

function dkd_v075DriveHomeInstallStyles() {
  if (document.getElementById('dkd-v075-drive-home-hotfix-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v075-drive-home-hotfix-style';
  dkd_style.textContent = `
    .dkd-home-header{display:flex!important;flex-direction:column!important;align-items:flex-start!important}
    .dkd-home-header .dkd-season-pill{margin:4px 0 0!important;align-self:flex-start!important;animation:dkd-v075-season-pill-in .38s ease-out both}
    .dkd-home-header .dkd-player-name{margin:7px 0 8px!important}
    .dkd-contract-mini{position:relative!important;overflow:hidden!important;padding:15px 16px 14px!important;border:1px solid #527491!important;border-left:7px solid #69d9ce!important;border-top:4px solid #91a4ff!important;border-radius:22px!important;background:#172c46!important;color:#f5f8ff!important;animation:dkd-v075-goal-card-in .38s ease-out both!important}
    .dkd-contract-mini .dkd-goal-icon{width:45px!important;height:45px!important;border:1px solid #796da7!important;border-radius:15px!important;background:#433765!important;color:#e7ddff!important}
    .dkd-contract-mini .dkd-goal-heading .dkd-kicker{font-size:10px!important;color:#a8c8dc!important;letter-spacing:1.5px!important}
    .dkd-contract-mini .dkd-goal-heading h3{margin-top:4px!important;font-size:19px!important;line-height:1.15!important;color:#fff!important}
    .dkd-contract-mini .dkd-goal-percent{font-size:30px!important;color:#79e2c8!important}
    .dkd-contract-mini .dkd-progress{height:9px!important;margin-top:12px!important;border:1px solid #3d6172!important;background:#203b4c!important}
    .dkd-contract-mini .dkd-progress span{background:#6fe0c8!important;transform-origin:left center!important;animation:dkd-v075-home-goal-fill .95s cubic-bezier(.2,.8,.2,1) both!important}
    .dkd-contract-mini .dkd-goal-milestones{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:7px!important;margin-top:12px!important;font-size:11px!important;font-weight:850!important;color:#edf6ff!important}
    .dkd-contract-mini .dkd-goal-milestones>span{min-width:0!important;justify-content:center!important;gap:5px!important;padding:8px 5px!important;border:1px solid #477787!important;border-radius:11px!important;background:#1d3c4b!important;line-height:1.25!important;text-align:center!important;white-space:nowrap!important}
    .dkd-contract-mini .dkd-goal-milestones>span:nth-child(2){border-color:#655d91!important;background:#302f54!important}.dkd-contract-mini .dkd-goal-milestones>span:nth-child(3){border-color:#886070!important;background:#422f46!important}
    .dkd-contract-mini .dkd-goal-milestones>span:nth-child(1) svg{color:#75dfcf!important}.dkd-contract-mini .dkd-goal-milestones>span:nth-child(2) svg{color:#b5adff!important}.dkd-contract-mini .dkd-goal-milestones>span:nth-child(3) svg{color:#ffb6d5!important}
    .dkd-drive-tools [data-dkd-action='dkd-v075-effects-toggle']{border-color:#f1c36c!important;background:#3a3427!important;color:#ffe2a3!important}
    .dkd-drive-tools [data-dkd-action='dkd-v075-effects-toggle']:after{background:#f1c36c!important}
    .dkd-drive-tools [data-dkd-action='dkd-v075-effects-toggle'].dkd-v075-effects-muted{border-color:#ff8b72!important;background:#442831!important;color:#ffd4c9!important}
    .dkd-drive-tools [data-dkd-action='dkd-v075-effects-toggle'].dkd-v075-effects-muted:after{background:#ff8b72!important}
    @keyframes dkd-v075-season-pill-in{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
    @keyframes dkd-v075-goal-card-in{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}
    @keyframes dkd-v075-home-goal-fill{from{transform:scaleX(0);background:#83a7ff}70%{background:#6fe0c8}to{transform:scaleX(1);background:#6fe0c8}}
    html[data-dkd-motion='off'] .dkd-home-header .dkd-season-pill,html[data-dkd-motion='off'] .dkd-contract-mini,html[data-dkd-motion='off'] .dkd-contract-mini .dkd-progress span{animation:none!important;transform:none!important}
    @media(prefers-reduced-motion:reduce){.dkd-home-header .dkd-season-pill,.dkd-contract-mini,.dkd-contract-mini .dkd-progress span{animation:none!important;transform:none!important}}
    @media(max-width:370px){.dkd-contract-mini .dkd-goal-milestones{font-size:10px!important;gap:5px!important}.dkd-contract-mini .dkd-goal-milestones>span{padding:7px 3px!important;gap:3px!important}.dkd-contract-mini .dkd-goal-heading h3{font-size:18px!important}}
  `;
  document.head.appendChild(dkd_style);
}
dkd_v075DriveHomeInstallStyles();

// The old v0.5 generator intentionally allowed potholes and tyres as close as roughly
// 0.42 m from the route center. Their collision footprints therefore overlapped the
// navigation arrows even when the prop itself looked offset or was difficult to see in
// rain/night conditions. Keep a protected route-center corridor and move the SAME visible
// prop and collision object together, so the player can never hit an invisible proxy.
function dkd_v075DriveHomeNearestRoutePoint(dkd_run, dkd_graph, dkd_position) {
  const dkd_nodes = Array.isArray(dkd_run?.dkd_route?.dkd_nodes) ? dkd_run.dkd_route.dkd_nodes : [];
  if (dkd_nodes.length < 2 || !Array.isArray(dkd_position)) return null;
  let dkd_best = null;
  for (let dkd_index = 1; dkd_index < dkd_nodes.length; dkd_index += 1) {
    const dkd_start = dkd_graph?.dkd_points?.[dkd_nodes[dkd_index - 1]];
    const dkd_end = dkd_graph?.dkd_points?.[dkd_nodes[dkd_index]];
    if (!Array.isArray(dkd_start) || !Array.isArray(dkd_end)) continue;
    const dkd_segmentX = Number(dkd_end[0]) - Number(dkd_start[0]);
    const dkd_segmentZ = Number(dkd_end[1]) - Number(dkd_start[1]);
    const dkd_lengthSquared = dkd_segmentX * dkd_segmentX + dkd_segmentZ * dkd_segmentZ;
    if (!Number.isFinite(dkd_lengthSquared) || dkd_lengthSquared < .0001) continue;
    const dkd_toPointX = Number(dkd_position[0]) - Number(dkd_start[0]);
    const dkd_toPointZ = Number(dkd_position[1]) - Number(dkd_start[1]);
    const dkd_fraction = dkd_clamp((dkd_toPointX * dkd_segmentX + dkd_toPointZ * dkd_segmentZ) / dkd_lengthSquared, 0, 1);
    const dkd_pointX = Number(dkd_start[0]) + dkd_segmentX * dkd_fraction;
    const dkd_pointZ = Number(dkd_start[1]) + dkd_segmentZ * dkd_fraction;
    const dkd_deltaX = Number(dkd_position[0]) - dkd_pointX;
    const dkd_deltaZ = Number(dkd_position[1]) - dkd_pointZ;
    const dkd_distanceSquared = dkd_deltaX * dkd_deltaX + dkd_deltaZ * dkd_deltaZ;
    if (!dkd_best || dkd_distanceSquared < dkd_best.dkd_distanceSquared) {
      dkd_best = {
        dkd_point:[dkd_pointX,dkd_pointZ],
        dkd_distanceSquared,
        dkd_segment:[dkd_segmentX,dkd_segmentZ],
      };
    }
  }
  if (!dkd_best) return null;
  dkd_best.dkd_distance = Math.sqrt(Math.max(0, dkd_best.dkd_distanceSquared));
  return dkd_best;
}

function dkd_v075DriveHomeObstacleHalfWidth(dkd_obstacle) {
  const dkd_extents = dkd_v075DriveHomeObstacleHalfExtents[dkd_obstacle?.dkd_type] || [.70,.70];
  return Math.max(.18, (Number(dkd_extents[0]) || .70) * .92);
}

function dkd_v075DriveHomeProtectRoute(dkd_scene, dkd_run) {
  const dkd_obstacles = Array.isArray(dkd_run?.dkd_obstacles) ? dkd_run.dkd_obstacles : [];
  const dkd_visuals = Array.isArray(dkd_scene?.dkd_obstacleGroup?.children) ? dkd_scene.dkd_obstacleGroup.children : [];
  dkd_obstacles.forEach((dkd_obstacle, dkd_index) => {
    const dkd_visual = dkd_visuals[dkd_index];
    dkd_obstacle.dkd_v075VisualReady = Boolean(dkd_visual && dkd_visual.visible !== false && dkd_visual.children?.length);
    const dkd_nearest = dkd_v075DriveHomeNearestRoutePoint(dkd_run, dkd_scene?.dkd_graph, dkd_obstacle.dkd_position);
    if (!dkd_nearest) return;
    const dkd_safeOffset = dkd_v075DriveHomeObstacleHalfWidth(dkd_obstacle) + dkd_v075DriveHomeBikeHalfWidth + dkd_v075DriveHomeRouteClearance;
    dkd_obstacle.dkd_v075RouteSafeOffset = dkd_safeOffset;
    if (dkd_nearest.dkd_distance >= dkd_safeOffset) return;

    let dkd_directionX = Number(dkd_obstacle.dkd_position[0]) - dkd_nearest.dkd_point[0];
    let dkd_directionZ = Number(dkd_obstacle.dkd_position[1]) - dkd_nearest.dkd_point[1];
    let dkd_directionLength = Math.hypot(dkd_directionX, dkd_directionZ);
    if (dkd_directionLength < .001) {
      const dkd_segmentLength = Math.hypot(dkd_nearest.dkd_segment[0], dkd_nearest.dkd_segment[1]) || 1;
      dkd_directionX = dkd_nearest.dkd_segment[1] / dkd_segmentLength;
      dkd_directionZ = -dkd_nearest.dkd_segment[0] / dkd_segmentLength;
      dkd_directionLength = 1;
    }
    dkd_directionX /= dkd_directionLength;
    dkd_directionZ /= dkd_directionLength;
    dkd_obstacle.dkd_position[0] = dkd_nearest.dkd_point[0] + dkd_directionX * dkd_safeOffset;
    dkd_obstacle.dkd_position[1] = dkd_nearest.dkd_point[1] + dkd_directionZ * dkd_safeOffset;
    if (dkd_visual) {
      dkd_visual.position.set(dkd_obstacle.dkd_position[0], .02, dkd_obstacle.dkd_position[1]);
      dkd_visual.rotation.y = Number(dkd_obstacle.dkd_heading) || 0;
    }
  });
  dkd_run.dkd_v075RouteCenterProtected = true;
}

dkd_Scene.prototype.dkd_setRoute = function dkd_v075DriveHomeSetRoute(dkd_run) {
  const dkd_result = dkd_v075DriveHomePrevious.dkd_sceneSetRoute.call(this, dkd_run);
  dkd_v075DriveHomeProtectRoute(this, dkd_run);
  return dkd_result;
};

if (typeof dkd_v05DriveFixObstacleContact === 'function') {
  dkd_v05DriveFixObstacleContact = function dkd_v075DriveHomeVisibleObstacleContact(dkd_run, dkd_obstacle) {
    if (dkd_obstacle?.dkd_v075VisualReady !== true) return false;
    if (!Array.isArray(dkd_run?.dkd_position) || !Array.isArray(dkd_obstacle?.dkd_position)) return false;
    const dkd_extents = dkd_v075DriveHomeObstacleHalfExtents[dkd_obstacle.dkd_type] || [.70,.70];
    const dkd_obstacleHalfWidth = Math.max(.18, (Number(dkd_extents[0]) || .70) * .92);
    const dkd_obstacleHalfLength = Math.max(.18, (Number(dkd_extents[1]) || .70) * .82);
    const dkd_deltaX = Number(dkd_run.dkd_position[0]) - Number(dkd_obstacle.dkd_position[0]);
    const dkd_deltaZ = Number(dkd_run.dkd_position[1]) - Number(dkd_obstacle.dkd_position[1]);
    if (!Number.isFinite(dkd_deltaX) || !Number.isFinite(dkd_deltaZ)) return false;
    const dkd_heading = Number(dkd_obstacle.dkd_heading) || 0;
    const dkd_cos = Math.cos(dkd_heading);
    const dkd_sin = Math.sin(dkd_heading);
    const dkd_localX = dkd_deltaX * dkd_cos - dkd_deltaZ * dkd_sin;
    const dkd_localZ = dkd_deltaX * dkd_sin + dkd_deltaZ * dkd_cos;
    return Math.abs(dkd_localX) <= dkd_obstacleHalfWidth + dkd_v075DriveHomeBikeHalfWidth
      && Math.abs(dkd_localZ) <= dkd_obstacleHalfLength + dkd_v075DriveHomeBikeHalfLength;
  };
}

// Keep weather atmosphere but reduce the rain bed by 25% from the previous 0.40 mix.
dkd_Audio.prototype.dkd_update = function dkd_v075DriveHomeAudioUpdate(dkd_run) {
  const dkd_result = dkd_v075DriveHomePrevious.dkd_audioUpdate.call(this, dkd_run);
  if (!this.dkd_context || this.dkd_context.state !== 'running' || !this.dkd_rainGain?.gain) return dkd_result;
  const dkd_active = Boolean(dkd_run && !dkd_run.dkd_paused && !dkd_run.dkd_finished && !dkd_run.dkd_failed);
  const dkd_now = this.dkd_context.currentTime;
  const dkd_rain = Math.max(0, Number(dkd_run?.dkd_weather?.dkd_rain) || 0);
  const dkd_wind = Math.abs(Number(dkd_run?.dkd_weather?.dkd_wind) || 0);
  this.dkd_rainGain.gain.cancelScheduledValues(dkd_now);
  this.dkd_rainGain.gain.setTargetAtTime(dkd_active ? dkd_rain * .30 + dkd_wind * .007 : 0, dkd_now, .18);
  return dkd_result;
};

function dkd_v075DriveHomeEffectsLevel(dkd_game) {
  return dkd_clamp(Number(dkd_game?.dkd_state?.dkd_settings?.dkd_effects) || 0, 0, 1);
}

function dkd_v075DriveHomeEffectsButton(dkd_game) {
  const dkd_muted = dkd_v075DriveHomeEffectsLevel(dkd_game) <= .001;
  return `<button class="dkd-icon-btn dkd-v073-tool${dkd_muted ? ' dkd-v075-effects-muted' : ''}" data-dkd-action="dkd-v075-effects-toggle" aria-label="${dkd_muted ? 'Ses efektlerini aç' : 'Ses efektlerini kapat'}" title="${dkd_muted ? 'Ses efektlerini aç' : 'Ses efektlerini kapat'}">${dkd_icon('volume',27)}</button>`;
}

function dkd_v075DriveHomeRefreshEffectsButton(dkd_game) {
  const dkd_buttonNode = dkd_game?.dkd_root?.querySelector?.('[data-dkd-action="dkd-v075-effects-toggle"]');
  if (!dkd_buttonNode) return;
  const dkd_muted = dkd_v075DriveHomeEffectsLevel(dkd_game) <= .001;
  dkd_buttonNode.classList.toggle('dkd-v075-effects-muted', dkd_muted);
  dkd_buttonNode.setAttribute('aria-label', dkd_muted ? 'Ses efektlerini aç' : 'Ses efektlerini kapat');
  dkd_buttonNode.setAttribute('title', dkd_muted ? 'Ses efektlerini aç' : 'Ses efektlerini kapat');
}

dkd_Game.prototype.dkd_view_drive = function dkd_v075DriveHomeDriveView() {
  let dkd_html = String(dkd_v075DriveHomePrevious.dkd_viewDrive.call(this) || '');
  dkd_html = dkd_html.replace(/<button\b[^>]*data-dkd-action="horn"[^>]*>[\s\S]*?<\/button>/i, dkd_v075DriveHomeEffectsButton(this));
  return dkd_html;
};

dkd_Game.prototype.dkd_action = function dkd_v075DriveHomeAction(dkd_action) {
  if (String(dkd_action || '') === 'dkd-v075-effects-toggle') {
    const dkd_current = dkd_v075DriveHomeEffectsLevel(this);
    if (dkd_current > .001) {
      this.dkd_audio.dkd_v075EffectsLevel = dkd_current;
      this.dkd_state.dkd_settings.dkd_effects = 0;
    } else {
      this.dkd_state.dkd_settings.dkd_effects = dkd_clamp(Number(this.dkd_audio?.dkd_v075EffectsLevel) || .80, .05, 1);
    }
    if (this.dkd_audio?.dkd_context && this.dkd_audio.dkd_effects?.gain) {
      const dkd_now = this.dkd_audio.dkd_context.currentTime;
      this.dkd_audio.dkd_effects.gain.cancelScheduledValues(dkd_now);
      this.dkd_audio.dkd_effects.gain.setTargetAtTime(dkd_v075DriveHomeEffectsLevel(this), dkd_now, .035);
    }
    this.dkd_save();
    dkd_v075DriveHomeRefreshEffectsButton(this);
    this.dkd_toast(dkd_v075DriveHomeEffectsLevel(this) <= .001 ? 'Ses efektleri kapatıldı.' : 'Ses efektleri açıldı.');
    return;
  }
  return dkd_v075DriveHomePrevious.dkd_action.call(this, dkd_action);
};

dkd_Game.prototype.dkd_view_home = function dkd_v075DriveHomeHomeView() {
  return String(dkd_v075DriveHomePrevious.dkd_viewHome.call(this) || '');
};

window.dkd_lastMileV075DriveHomeHotfix = {
  dkd_rainGain: .30,
  dkd_effectsToggle: true,
  dkd_visibleObstacleCollisionOnly: true,
  dkd_routeCenterClearance: dkd_v075DriveHomeRouteClearance,
  dkd_seasonBadgeAbovePlayer: true,
  dkd_animatedSeasonGoal: true,
  dkd_webAndroidShared: true,
};

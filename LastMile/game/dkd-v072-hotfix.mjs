// DraBornGo / LastMile v0.7.2 device hotfix.
// Fixes stale cloud orders, ghost road collisions, live audio feedback and device UI cleanup.

const dkd_v072HotfixPreviousBind = dkd_Game.prototype.dkd_bind;
const dkd_v072HotfixPreviousAction = dkd_Game.prototype.dkd_action;
const dkd_v072HotfixPreviousReceive = dkd_Game.prototype.dkd_receive;
const dkd_v072HotfixPreviousStepRun = dkd_stepRun;
const dkd_v072HotfixPreviousSettings = dkd_Game.prototype.dkd_view_settings;
const dkd_v072HotfixPreviousRender = dkd_Game.prototype.dkd_render;

function dkd_v072HotfixClearOrders(dkd_game) {
  if (!dkd_game) return;
  dkd_game.dkd_selectedOrder = null;
  dkd_game.dkd_orders = [];
  dkd_game.dkd_v04JobsLoading = false;
}

function dkd_v072HotfixObstacleSnapshot(dkd_run) {
  return new Map((dkd_run?.dkd_obstacles || []).map(dkd_obstacle => [
    String(dkd_obstacle?.dkd_id || ''),
    Number(dkd_obstacle?.dkd_hitAt) || -999,
  ]));
}

function dkd_v072HotfixVisibleObstacleHit(dkd_run, dkd_beforeObstacles) {
  return (dkd_run?.dkd_obstacles || []).some(dkd_obstacle => {
    const dkd_id = String(dkd_obstacle?.dkd_id || '');
    const dkd_beforeHit = dkd_beforeObstacles.get(dkd_id) ?? -999;
    return (Number(dkd_obstacle?.dkd_hitAt) || -999) > dkd_beforeHit;
  });
}

// Core road recovery used dkd_hit() for off-road clamping and dynamically closed roads.
// Those geometry corrections do not always have a rendered obstacle, which created the
// reported ghost wall. During rider physics, only authored/rendered obstacle hits may
// create damage. Traffic collisions remain handled separately by dkd_stepTraffic.
dkd_stepRun = function dkd_v072HotfixStepRun(dkd_run, dkd_graph, dkd_input, dkd_delta) {
  if (!dkd_run) return dkd_v072HotfixPreviousStepRun(dkd_run, dkd_graph, dkd_input, dkd_delta);
  const dkd_before = {
    dkd_collisions: Number(dkd_run.dkd_collisions) || 0,
    dkd_damage: Number(dkd_run.dkd_damage) || 0,
    dkd_condition: Number(dkd_run.dkd_condition) || 0,
    dkd_speed: Number(dkd_run.dkd_speed) || 0,
    dkd_cooldown: Number(dkd_run.dkd_collisionCooldown) || 0,
  };
  const dkd_beforeObstacles = dkd_v072HotfixObstacleSnapshot(dkd_run);
  const dkd_closed = dkd_run.dkd_closed;
  if (dkd_closed instanceof Set && dkd_closed.size) dkd_run.dkd_closed = new Set();
  let dkd_result;
  try {
    dkd_result = dkd_v072HotfixPreviousStepRun(dkd_run, dkd_graph, dkd_input, dkd_delta);
  } finally {
    if (dkd_closed instanceof Set) dkd_run.dkd_closed = dkd_closed;
  }
  const dkd_newCollision = (Number(dkd_run.dkd_collisions) || 0) > dkd_before.dkd_collisions;
  const dkd_visibleObstacleHit = dkd_v072HotfixVisibleObstacleHit(dkd_run, dkd_beforeObstacles);
  if (dkd_newCollision && !dkd_visibleObstacleHit) {
    dkd_run.dkd_collisions = dkd_before.dkd_collisions;
    dkd_run.dkd_damage = dkd_before.dkd_damage;
    dkd_run.dkd_condition = dkd_before.dkd_condition;
    dkd_run.dkd_speed = Math.max(Number(dkd_run.dkd_speed) || 0, dkd_before.dkd_speed * .94);
    dkd_run.dkd_collisionCooldown = dkd_before.dkd_cooldown;
  }
  return dkd_result;
};

function dkd_v072HotfixSettingsHtml(dkd_html) {
  return String(dkd_html || '')
    .replace(/<button[^>]*data-dkd-action="(?:export-save|import-save)"[^>]*>[\s\S]*?<\/button>/g, '')
    .replaceAll('DRA SİSTEM / ANDROID', 'DrabornEagle system / Android')
    .replaceAll('EXPO GO', 'DBG APK')
    .replaceAll('<small>SDK 57 TEST</small>', '')
    .replace(/\s*·\s*Expo SDK 57/g, '')
    .replaceAll('v0.7 güncellemesinde ilk açılışta bu açı uygulanır; daha sonra yaptığın kamera seçimi kaydedilir.', '');
}

dkd_Game.prototype.dkd_view_settings = function dkd_v072HotfixSettings() {
  return dkd_v072HotfixSettingsHtml(dkd_v072HotfixPreviousSettings.call(this));
};

function dkd_v072HotfixText(dkd_value) {
  return String(dkd_value || '').replaceAll('iPhone 18 Pro Max', 'iPhone 18 Pro');
}

function dkd_v072HotfixNormalizeVisible(dkd_root, dkd_page) {
  if (!dkd_root) return;
  const dkd_walker = document.createTreeWalker(dkd_root, NodeFilter.SHOW_TEXT);
  const dkd_nodes = [];
  while (dkd_walker.nextNode()) dkd_nodes.push(dkd_walker.currentNode);
  for (const dkd_node of dkd_nodes) {
    const dkd_value = String(dkd_node.nodeValue || '');
    const dkd_next = dkd_v072HotfixText(dkd_value);
    if (dkd_next !== dkd_value) dkd_node.nodeValue = dkd_next;
  }

  if (dkd_page === 'home') {
    const dkd_target = 'ANKARA KURYE MERKEZİ';
    const dkd_normalize = dkd_value => String(dkd_value || '').replace(/\s+/g, ' ').trim().toLocaleUpperCase('tr-TR');
    const dkd_matches = [...dkd_root.querySelectorAll('div,section,article,button')]
      .filter(dkd_element => dkd_normalize(dkd_element.textContent) === dkd_target);
    const dkd_card = dkd_matches.find(dkd_element => dkd_normalize(dkd_element.parentElement?.textContent) !== dkd_target) || dkd_matches.at(-1);
    if (dkd_card) dkd_card.remove();
  }
}

dkd_Game.prototype.dkd_render = function dkd_v072HotfixRender(dkd_page, dkd_arg = null) {
  const dkd_result = dkd_v072HotfixPreviousRender.call(this, dkd_page, dkd_arg);
  dkd_v072HotfixNormalizeVisible(this.dkd_root, dkd_page);
  return dkd_result;
};

dkd_Game.prototype.dkd_bind = function dkd_v072HotfixBind() {
  const dkd_result = dkd_v072HotfixPreviousBind.call(this);
  document.addEventListener('input', dkd_event => {
    const dkd_input = dkd_event.target;
    const dkd_setting = dkd_input?.dataset?.dkdSetting;
    if (!['dkd_music', 'dkd_effects'].includes(dkd_setting)) return;
    const dkd_slider = dkd_input.closest?.('.dkd-v07-slider');
    const dkd_value = Math.round(dkd_clamp(Number(dkd_input.value) || 0, 0, 100));
    const dkd_labelValue = dkd_slider?.querySelector?.('label span');
    if (dkd_labelValue) dkd_labelValue.textContent = `${dkd_value}%`;
    if (dkd_setting === 'dkd_music' && this.dkd_audio?.dkd_v05MediaCurrent) {
      const dkd_drive = (document.documentElement?.dataset?.dkdPage || '') === 'drive';
      try { this.dkd_audio.dkd_v05MediaCurrent.volume = Math.min(1, dkd_value / 100 * (dkd_drive ? 1 : .72)); } catch {}
    }
  }, { passive: true });
  return dkd_result;
};

dkd_Game.prototype.dkd_action = function dkd_v072HotfixAction(dkd_action) {
  const dkd_command = String(dkd_action || '').split(':')[0];
  const dkd_isCloudRun = Boolean(this.dkd_run?.dkd_order?.dkd_cloudJobId);
  const dkd_result = dkd_v072HotfixPreviousAction.call(this, dkd_action);
  if (dkd_command === 'abandon') {
    dkd_v072HotfixClearOrders(this);
    if (dkd_isCloudRun && this.dkd_v04CloudReady) {
      setTimeout(() => {
        if (!this.dkd_run && this.dkd_v04CloudReady) this.dkd_refreshOrders();
      }, 350);
    }
  }
  if (dkd_command === 'deliver' && this.dkd_run?.dkd_finished) {
    dkd_v072HotfixClearOrders(this);
  }
  return dkd_result;
};

dkd_Game.prototype.dkd_receive = function dkd_v072HotfixReceive(dkd_payload) {
  const dkd_message = String(dkd_payload?.dkd_data || '');
  if (dkd_payload?.dkd_type === 'cloud-error' && /job_not_found|job.*not.*found/i.test(dkd_message)) {
    dkd_v072HotfixClearOrders(this);
    if (!this.dkd_run && this.dkd_v04CloudReady) {
      setTimeout(() => this.dkd_refreshOrders(), 250);
    }
  }
  return dkd_v072HotfixPreviousReceive.call(this, dkd_payload);
};

window.dkd_lastMileV072Hotfix = {
  dkd_version: 'v0.7.2-hotfix-2',
  dkd_staleCloudOrderReset: true,
  dkd_ghostRoadCollisionPenalty: false,
  dkd_visibleObstacleCollisionOnly: true,
  dkd_liveAudioPercentages: true,
  dkd_compactSettings: true,
};

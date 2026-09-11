// DraBornGo / LastMile v0.7.2 device hotfix.
// Fixes stale cloud orders after a shift, invisible road-edge collision penalties,
// and live percentage feedback for Settings audio sliders.

const dkd_v072HotfixPreviousBind = dkd_Game.prototype.dkd_bind;
const dkd_v072HotfixPreviousAction = dkd_Game.prototype.dkd_action;
const dkd_v072HotfixPreviousReceive = dkd_Game.prototype.dkd_receive;
const dkd_v072HotfixPreviousStepRun = dkd_stepRun;

function dkd_v072HotfixClearOrders(dkd_game) {
  if (!dkd_game) return;
  dkd_game.dkd_selectedOrder = null;
  dkd_game.dkd_orders = [];
  dkd_game.dkd_v04JobsLoading = false;
}

function dkd_v072HotfixVisibleRoadCollision(dkd_run, dkd_graph) {
  if (!dkd_run || !dkd_graph) return false;
  for (const dkd_obstacle of dkd_run.dkd_obstacles || []) {
    const dkd_radius = Math.max(.8, Number(dkd_obstacle?.dkd_radius) || 0) + .82;
    if (dkd_distance(dkd_run.dkd_position, dkd_obstacle.dkd_position) <= dkd_radius) return true;
  }
  const dkd_road = dkd_nearestRoad(dkd_graph, dkd_run.dkd_position);
  if (
    dkd_run.dkd_closed?.has?.(dkd_road?.dkd_edge?.dkd_id) &&
    dkd_road.dkd_distance < dkd_road.dkd_edge.dkd_width / 2 &&
    dkd_road.dkd_fraction > .3 &&
    dkd_road.dkd_fraction < .7
  ) return true;
  return false;
}

dkd_stepRun = function dkd_v072HotfixStepRun(dkd_run, dkd_graph, dkd_input, dkd_delta) {
  if (!dkd_run) return dkd_v072HotfixPreviousStepRun(dkd_run, dkd_graph, dkd_input, dkd_delta);
  const dkd_before = {
    dkd_collisions: Number(dkd_run.dkd_collisions) || 0,
    dkd_damage: Number(dkd_run.dkd_damage) || 0,
    dkd_condition: Number(dkd_run.dkd_condition) || 0,
    dkd_speed: Number(dkd_run.dkd_speed) || 0,
    dkd_cooldown: Number(dkd_run.dkd_collisionCooldown) || 0,
  };
  const dkd_result = dkd_v072HotfixPreviousStepRun(dkd_run, dkd_graph, dkd_input, dkd_delta);
  const dkd_newCollision = (Number(dkd_run.dkd_collisions) || 0) > dkd_before.dkd_collisions;
  if (dkd_newCollision && !dkd_v072HotfixVisibleRoadCollision(dkd_run, dkd_graph)) {
    // The core road-edge recovery can call dkd_hit() even though no visible object exists.
    // Keep the road-position correction, but never punish the player for an invisible wall.
    dkd_run.dkd_collisions = dkd_before.dkd_collisions;
    dkd_run.dkd_damage = dkd_before.dkd_damage;
    dkd_run.dkd_condition = dkd_before.dkd_condition;
    dkd_run.dkd_speed = Math.max(Number(dkd_run.dkd_speed) || 0, dkd_before.dkd_speed * .82);
    dkd_run.dkd_collisionCooldown = Math.min(Number(dkd_run.dkd_collisionCooldown) || 0, dkd_before.dkd_cooldown);
  }
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
  dkd_version: 'v0.7.2-hotfix-1',
  dkd_staleCloudOrderReset: true,
  dkd_invisibleRoadHitPenalty: false,
  dkd_liveAudioPercentages: true,
};

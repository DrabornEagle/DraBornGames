// DraBornGo / Last Mile v0.5 driving + reject-flow + courier-center-sign hotfix.
// Loaded last. Uses the visible obstacle footprint for collision checks, clears stale
// shift-start state before rejecting an offer, and nudges the courier-center sign right.

const dkd_v05DriveFixPrevious = {
  dkd_stepRun,
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_buildHub: dkd_Scene.prototype.dkd_buildHub,
};

const dkd_v05DriveFixObstacleHalfExtents = {
  barrier: [1.60, .30],
  cones: [1.20, .45],
  crate: [.72, .72],
  pallet: [1.05, .78],
  tire: [1.10, .55],
  roadwork: [1.45, .38],
  pothole: [.72, .72],
  drum: [.58, .58],
};

function dkd_v05DriveFixObstacleContact(dkd_run, dkd_obstacle) {
  if (!Array.isArray(dkd_run?.dkd_position) || !Array.isArray(dkd_obstacle?.dkd_position)) return false;

  const dkd_extents = dkd_v05DriveFixObstacleHalfExtents[dkd_obstacle.dkd_type] || [.70, .70];
  const dkd_obstacleHalfWidth = Number(dkd_extents[0]) || .70;
  const dkd_obstacleHalfLength = Number(dkd_extents[1]) || .70;
  const dkd_bikeHalfWidth = .40;
  const dkd_bikeHalfLength = .82;
  const dkd_dx = Number(dkd_run.dkd_position[0]) - Number(dkd_obstacle.dkd_position[0]);
  const dkd_dz = Number(dkd_run.dkd_position[1]) - Number(dkd_obstacle.dkd_position[1]);
  const dkd_heading = Number(dkd_obstacle.dkd_heading) || 0;
  const dkd_cos = Math.cos(dkd_heading);
  const dkd_sin = Math.sin(dkd_heading);
  const dkd_localX = dkd_dx * dkd_cos - dkd_dz * dkd_sin;
  const dkd_localZ = dkd_dx * dkd_sin + dkd_dz * dkd_cos;

  return Math.abs(dkd_localX) <= dkd_obstacleHalfWidth + dkd_bikeHalfWidth
    && Math.abs(dkd_localZ) <= dkd_obstacleHalfLength + dkd_bikeHalfLength;
}

function dkd_v05DriveFixObstacleProxy(dkd_run, dkd_obstacle) {
  return new Proxy(dkd_obstacle, {
    get(dkd_target, dkd_property, dkd_receiver) {
      if (dkd_property === 'dkd_radius') {
        // The legacy v0.4 collision layer still performs a radial broad-phase test.
        // Returning a negative radius outside the visible oriented footprint makes that
        // broad phase reject near-misses while preserving its existing damage/cooldown code.
        return dkd_v05DriveFixObstacleContact(dkd_run, dkd_target)
          ? Number(dkd_target.dkd_radius) || 1
          : -1000;
      }
      return Reflect.get(dkd_target, dkd_property, dkd_receiver);
    },
  });
}

dkd_stepRun = function dkd_v05DriveFixStepRun(dkd_run, dkd_graph, dkd_input, dkd_delta) {
  if (!dkd_run || !Array.isArray(dkd_run.dkd_obstacles) || !dkd_run.dkd_obstacles.length) {
    return dkd_v05DriveFixPrevious.dkd_stepRun(dkd_run, dkd_graph, dkd_input, dkd_delta);
  }

  const dkd_originalObstacles = dkd_run.dkd_obstacles;
  dkd_run.dkd_obstacles = dkd_originalObstacles.map(dkd_obstacle => dkd_v05DriveFixObstacleProxy(dkd_run, dkd_obstacle));
  try {
    return dkd_v05DriveFixPrevious.dkd_stepRun(dkd_run, dkd_graph, dkd_input, dkd_delta);
  } finally {
    // Rendering and route state always keep the real obstacle objects.
    dkd_run.dkd_obstacles = dkd_originalObstacles;
  }
};

dkd_Game.prototype.dkd_action = function dkd_v05DriveFixAction(dkd_action) {
  const dkd_parts = String(dkd_action || '').split(':');
  const dkd_command = dkd_parts[0];
  const dkd_value = dkd_parts[1];

  if (dkd_command === 'reject') {
    const dkd_index = Number(dkd_value);
    const dkd_rejectedOrder = Array.isArray(this.dkd_orders) ? this.dkd_orders[dkd_index] : null;

    // A cancel/reject response must never be interpreted as a failed start request.
    this.dkd_v05PendingStart = null;
    if (
      dkd_rejectedOrder
      && (
        this.dkd_selectedOrder === dkd_rejectedOrder
        || String(this.dkd_selectedOrder?.dkd_id || '') === String(dkd_rejectedOrder.dkd_id || '')
      )
    ) {
      this.dkd_selectedOrder = null;
    }
    try { this.dkd_closeModal?.(); } catch {}
  }

  return dkd_v05DriveFixPrevious.dkd_action.call(this, dkd_action);
};

function dkd_v05DriveFixShiftCourierCenterSign(dkd_scene) {
  const dkd_sign = dkd_scene?.dkd_hub?.getObjectByName?.('dkd_v05_live_courier_center_sign');
  if (!dkd_sign) return;
  dkd_sign.position.x = -3.60;
}

dkd_Scene.prototype.dkd_buildHub = function dkd_v05DriveFixBuildHub() {
  const dkd_result = dkd_v05DriveFixPrevious.dkd_buildHub.call(this);
  dkd_v05DriveFixShiftCourierCenterSign(this);
  return dkd_result;
};

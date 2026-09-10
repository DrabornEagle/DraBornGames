// DraBornGo / Last Mile v0.7 physical-device correction.
// Device screenshots on 2026-09-10 showed three remaining issues after the first polish:
// the rider centroid stayed too far toward the scooter nose, the symmetric wheel overlay
// strobed at road-speed values, and existing saves had already consumed the first chase-camera migration.

const dkd_v07DeviceFixPrevious = {
  dkd_buildBike: dkd_Scene.prototype.dkd_buildBike,
  dkd_sceneUpdate: dkd_Scene.prototype.dkd_update,
  dkd_render: dkd_Game.prototype.dkd_render,
  dkd_viewSettings: dkd_Game.prototype.dkd_view_settings,
};

const dkd_v07DeviceSeatTargetX = -0.12;
const dkd_v07DeviceCameraMigrationKey = 'dkd_v07_camera_default_chase_v2';

function dkd_v07DeviceFindModel(dkd_bike) {
  if (!dkd_bike || !String(dkd_bike.name || '').includes('dkd_city50_v061')) return null;
  return dkd_bike.children.find(dkd_child => dkd_child?.name === 'dkd_v061_yamaha_soulgt125_quaternius_rider')
    || dkd_bike.children.find(dkd_child => dkd_child?.isGroup && String(dkd_child.name || '').includes('yamaha'))
    || null;
}

function dkd_v07DeviceFindRiderGroup(dkd_bike) {
  const dkd_model = dkd_v07DeviceFindModel(dkd_bike);
  if (!dkd_model) return null;
  return dkd_model.getObjectByName?.('dkd_v07_rider_seat_group')
    || dkd_model.children.find(dkd_child => dkd_child?.name === 'dkd_v07_rider_seat_group')
    || null;
}

function dkd_v07DeviceAlignRiderToSeat(dkd_bike) {
  const dkd_rider = dkd_v07DeviceFindRiderGroup(dkd_bike);
  if (!dkd_rider) return false;
  const dkd_pivot = Array.isArray(dkd_bike?.userData?.dkd_v07PolishRiderPivot)
    ? dkd_bike.userData.dkd_v07PolishRiderPivot
    : null;

  // The whole rider stays centred laterally and keeps the proven vertical offset.
  // Only the longitudinal centre moves from ~+0.65 (near the scooter nose) to -0.12,
  // which places the hips over the authored seat instead of ahead of it.
  dkd_rider.position.x = dkd_v07DeviceSeatTargetX;
  if (dkd_pivot && Number.isFinite(Number(dkd_pivot[1]))) dkd_rider.position.y = Number(dkd_pivot[1]) + 0.08;
  if (dkd_pivot && Number.isFinite(Number(dkd_pivot[2]))) dkd_rider.position.z = Number(dkd_pivot[2]);
  dkd_rider.rotation.y = Math.PI;
  dkd_rider.userData.dkd_v07DeviceSeatLocked = true;
  if (dkd_bike?.userData) {
    dkd_bike.userData.dkd_v07DeviceSeatTargetX = dkd_v07DeviceSeatTargetX;
    dkd_bike.userData.dkd_v07DeviceSeatAligned = true;
  }
  return true;
}

function dkd_v07DeviceInstallRearWheelMarker(dkd_scene) {
  const dkd_rigs = Array.isArray(dkd_scene?.dkd_v07PolishWheelRigs) ? dkd_scene.dkd_v07PolishWheelRigs : [];
  const dkd_rear = dkd_rigs.find(dkd_item => dkd_item?.dkd_name === 'arka');
  const dkd_rig = dkd_rear?.dkd_group;
  if (!dkd_rig || dkd_rig.userData?.dkd_v07DeviceVisibleMotion) return Boolean(dkd_rig);

  const dkd_radius = Math.max(0.12, Number(dkd_rear.dkd_radius) || 0.215);
  const dkd_treadMaterial = new dkd_three.MeshBasicMaterial({ color: '#111923' });
  const dkd_markerMaterial = new dkd_three.MeshBasicMaterial({ color: '#dfff55' });

  // Real tyre rotation is easiest to read from an asymmetric tread marker. Eight dark tread
  // blocks add tyre depth, while one lime marker breaks rotational symmetry so motion remains
  // visible from the rear camera and does not look frozen at common phone frame rates.
  for (let dkd_treadIndex = 0; dkd_treadIndex < 8; dkd_treadIndex += 1) {
    const dkd_angle = dkd_treadIndex * Math.PI / 4;
    const dkd_tread = new dkd_three.Mesh(
      new dkd_three.BoxGeometry(dkd_radius * 0.30, dkd_radius * 0.075, 0.30),
      dkd_treadMaterial.clone()
    );
    dkd_tread.position.set(Math.cos(dkd_angle) * dkd_radius * 0.96, Math.sin(dkd_angle) * dkd_radius * 0.96, 0);
    dkd_tread.rotation.z = dkd_angle;
    dkd_tread.name = `dkd_v07_rear_tread_${dkd_treadIndex}`;
    dkd_rig.add(dkd_tread);
  }

  const dkd_marker = new dkd_three.Mesh(
    new dkd_three.BoxGeometry(dkd_radius * 0.42, dkd_radius * 0.11, 0.315),
    dkd_markerMaterial
  );
  dkd_marker.position.set(0, dkd_radius * 0.94, 0);
  dkd_marker.name = 'dkd_v07_rear_wheel_motion_marker';
  dkd_rig.add(dkd_marker);
  dkd_rig.userData.dkd_v07DeviceVisibleMotion = true;
  return true;
}

function dkd_v07DeviceApplyVisualFixes(dkd_scene) {
  if (!dkd_scene?.dkd_bike) return false;
  const dkd_seatReady = dkd_v07DeviceAlignRiderToSeat(dkd_scene.dkd_bike);
  const dkd_wheelReady = dkd_v07DeviceInstallRearWheelMarker(dkd_scene);
  return dkd_seatReady && dkd_wheelReady;
}

function dkd_v07DeviceEnsureChaseDefault(dkd_game) {
  if (!dkd_game?.dkd_state?.dkd_settings || dkd_game.dkd_v07DeviceCameraCheckedV2) return;
  dkd_game.dkd_v07DeviceCameraCheckedV2 = true;
  let dkd_alreadyMigrated = false;
  try { dkd_alreadyMigrated = window.localStorage?.getItem(dkd_v07DeviceCameraMigrationKey) === '1'; } catch {}
  if (dkd_alreadyMigrated) return;

  // v2 intentionally runs once even on devices that already consumed the old v1 migration.
  dkd_game.dkd_state.dkd_settings.dkd_camera = 'chase';
  if (dkd_game.dkd_scene) dkd_game.dkd_scene.dkd_cameraSnap = true;
  try { window.localStorage?.setItem(dkd_v07DeviceCameraMigrationKey, '1'); } catch {}
  try { dkd_game.dkd_save?.(); } catch {}
}

dkd_Scene.prototype.dkd_buildBike = function dkd_v07DeviceFixBuildBike(dkd_kind = 'scooter') {
  const dkd_bike = dkd_v07DeviceFixPrevious.dkd_buildBike.call(this, dkd_kind);
  dkd_v07DeviceApplyVisualFixes(this);
  const dkd_scene = this;
  let dkd_attempt = 0;
  const dkd_retry = () => {
    dkd_attempt += 1;
    if (!dkd_v07DeviceApplyVisualFixes(dkd_scene) && dkd_attempt < 24) requestAnimationFrame(dkd_retry);
  };
  requestAnimationFrame(dkd_retry);
  return dkd_bike;
};

dkd_Scene.prototype.dkd_update = function dkd_v07DeviceFixSceneUpdate(dkd_dt, dkd_run = null) {
  const dkd_result = dkd_v07DeviceFixPrevious.dkd_sceneUpdate.call(this, dkd_dt, dkd_run);
  dkd_v07DeviceApplyVisualFixes(this);

  if (dkd_run && Array.isArray(this.dkd_v07PolishWheelRigs)) {
    const dkd_speedKmh = Math.max(0, Number(dkd_run.dkd_speed) || 0);
    const dkd_dtSafe = Math.max(0, Number(dkd_dt) || 0);
    for (const dkd_wheel of this.dkd_v07PolishWheelRigs) {
      const dkd_radius = Math.max(0.12, Number(dkd_wheel?.dkd_radius) || 0.215);
      // The previous polish treated km/h as m/s. Undo that frame rotation, then apply
      // physically scaled km/h -> m/s angular motion. This removes high-speed strobing.
      const dkd_previousDelta = dkd_speedKmh * dkd_dtSafe / dkd_radius;
      const dkd_correctDelta = (dkd_speedKmh / 3.6) * dkd_dtSafe / dkd_radius;
      dkd_wheel.dkd_group.rotation.z += dkd_previousDelta - dkd_correctDelta;
    }
  }
  return dkd_result;
};

dkd_Game.prototype.dkd_view_settings = function dkd_v07DeviceFixSettings() {
  dkd_v07DeviceEnsureChaseDefault(this);
  return dkd_v07DeviceFixPrevious.dkd_viewSettings.call(this);
};

dkd_Game.prototype.dkd_render = function dkd_v07DeviceFixRender(...dkd_args) {
  dkd_v07DeviceEnsureChaseDefault(this);
  return dkd_v07DeviceFixPrevious.dkd_render.call(this, ...dkd_args);
};

if (typeof window !== 'undefined') {
  window.dkd_lastMileRuntimeV07DeviceFix = {
    dkd_version: 'v0.7-device-seat-wheel-camera-2',
    dkd_riderSeatTargetX: dkd_v07DeviceSeatTargetX,
    dkd_rearWheelVisibleMotion: true,
    dkd_wheelSpeedUnit: 'kmh-to-ms',
    dkd_defaultCamera: 'chase',
    dkd_cameraMigration: 'v2',
  };
}

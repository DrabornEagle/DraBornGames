import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_fix = await readFile(new URL('../game/dkd-v07-device-seat-wheel-camera-fix.mjs', import.meta.url), 'utf8');
const dkd_build = await readFile(new URL('../scripts/dkd-build-game.mjs', import.meta.url), 'utf8');

test('physical device correction is the final v0.7 runtime layer', () => {
  assert.match(dkd_build, /'dkd-v07-device-polish\.mjs',\s*\n\s*'dkd-v07-device-seat-wheel-camera-fix\.mjs'/);
  assert.match(dkd_fix, /v0\.7-device-seat-wheel-camera-2/);
});

test('rider longitudinal centre is moved from the scooter nose onto the authored seat', () => {
  assert.match(dkd_fix, /dkd_v07DeviceSeatTargetX = -0\.12/);
  assert.match(dkd_fix, /dkd_rider\.position\.x = dkd_v07DeviceSeatTargetX/);
  assert.match(dkd_fix, /dkd_rider\.rotation\.y = Math\.PI/);
  assert.match(dkd_fix, /dkd_v07DeviceSeatAligned = true/);
});

test('rear wheel motion uses kmh to ms angular speed and a visible asymmetric marker', () => {
  assert.match(dkd_fix, /dkd_item\?\.dkd_name === 'arka'/);
  assert.match(dkd_fix, /dkd_v07_rear_wheel_motion_marker/);
  assert.match(dkd_fix, /dkd_speedKmh \/ 3\.6/);
  assert.match(dkd_fix, /dkd_previousDelta - dkd_correctDelta/);
  assert.match(dkd_fix, /dkd_v07DeviceVisibleMotion = true/);
});

test('existing v0.7 saves receive a second one-time Takip Standard camera migration', () => {
  assert.match(dkd_fix, /dkd_v07_camera_default_chase_v2/);
  assert.match(dkd_fix, /dkd_settings\.dkd_camera = 'chase'/);
  assert.match(dkd_fix, /dkd_cameraSnap = true/);
  assert.match(dkd_fix, /dkd_defaultCamera: 'chase'/);
});

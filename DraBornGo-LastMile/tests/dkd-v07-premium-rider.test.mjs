import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile as dkd_readFile } from 'node:fs/promises';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';
import path from 'node:path';

const dkd_testsDir = path.dirname(dkd_fileURLToPath(import.meta.url));
const dkd_root = path.resolve(dkd_testsDir, '..');

async function dkd_text(dkd_relative) {
  return dkd_readFile(path.join(dkd_root, dkd_relative), 'utf8');
}

test('v0.7 starter bypasses legacy combined rider and creates an independent seated premium courier', async () => {
  const dkd_rider = await dkd_text('game/dkd-v07-premium-rider.mjs');
  assert.match(dkd_rider, /dkd_v07_premium_courier_rider/);
  assert.match(dkd_rider, /dkd_city50_v07_clean_scooter_premium_rider/);
  assert.match(dkd_rider, /dkd_kind === 'scooter'.*dkd_city50/s);
  assert.match(dkd_rider, /return dkd_v07PremiumStarter\(this\)/);
  assert.match(dkd_rider, /dkd_rider_pelvis/);
  assert.match(dkd_rider, /dkd_rider_left_thigh/);
  assert.match(dkd_rider, /dkd_rider_right_boot/);
  assert.match(dkd_rider, /dkd_rider_fullface_helmet/);
  assert.match(dkd_rider, /dkd_v07_saddle/);
  assert.match(dkd_rider, /legacy combined scooter\+rider loader/i);
});

test('v0.7 premium rider is bundled after the main v0.7 release layer', async () => {
  const dkd_wrapper = await dkd_text('scripts/dkd-build-game-v07.mjs');
  const dkd_releasePosition = dkd_wrapper.indexOf("'dkd-v07-release.mjs'");
  const dkd_riderPosition = dkd_wrapper.indexOf("'dkd-v07-premium-rider.mjs'");
  assert.ok(dkd_releasePosition >= 0);
  assert.ok(dkd_riderPosition > dkd_releasePosition);
});

test('v0.7 first launch migrates driving camera to Takip Standart once and then preserves choice', async () => {
  const dkd_rider = await dkd_text('game/dkd-v07-premium-rider.mjs');
  assert.match(dkd_rider, /dkd_v07ChaseDefaultApplied/);
  assert.match(dkd_rider, /dkd_settings\.dkd_camera = 'chase'/);
  assert.match(dkd_rider, /dkd_settings\[dkd_v07CameraMigration\] = true/);
  assert.match(dkd_rider, /daha sonra yaptığın kamera seçimi kaydedilir/);
});

test('v0.7 settings readability raises former tiny labels without gradients or glow', async () => {
  const dkd_rider = await dkd_text('game/dkd-v07-premium-rider.mjs');
  assert.match(dkd_rider, /dkd-v07-option small\{font-size:10px/);
  assert.match(dkd_rider, /dkd-v07-row small\{font-size:11px/);
  assert.match(dkd_rider, /dkd-v07-camera-note\{font-size:11px/);
  assert.match(dkd_rider, /dkd-v07-music-card small\{font-size:11px/);
  assert.doesNotMatch(dkd_rider, /linear-gradient\s*\(/i);
  assert.doesNotMatch(dkd_rider, /radial-gradient\s*\(/i);
  assert.doesNotMatch(dkd_rider, /box-shadow\s*:/i);
  assert.doesNotMatch(dkd_rider, /text-shadow\s*:/i);
});

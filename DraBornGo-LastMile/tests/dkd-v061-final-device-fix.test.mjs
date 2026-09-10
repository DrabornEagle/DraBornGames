import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const dkd_read = dkd_path => fs.readFileSync(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_fix = dkd_read('game/dkd-v061-final-device-fix.mjs');
const dkd_v07 = dkd_read('game/dkd-v07-release.mjs');
const dkd_build = dkd_read('scripts/dkd-build-game.mjs');
const dkd_generated = dkd_read('assets/dkd-lastmile.html');

test('v0.6.1 compatibility layer still contains its historical complete-assembly orientation fix', () => {
  assert.match(dkd_fix, /dkd_model\.rotation\.y \+= Math\.PI/);
  assert.match(dkd_fix, /dkd_v061RiderSeatPreserved/);
  assert.match(dkd_fix, /dkd_city50_v061_device_yamaha_soulgt125_rider/);
});

test('v0.6.1 calm procedural source remains only as a compatibility layer beneath v0.7', () => {
  assert.match(dkd_fix, /const dkd_bpm = 48/);
  assert.match(dkd_fix, /dkd_v061FinalCreateHomeBuffer/);
  assert.match(dkd_fix, /dkd_context\.resume\(\)/);
  assert.match(dkd_fix, /pointerdown/);
  assert.match(dkd_fix, /touchstart/);
  assert.match(dkd_v07, /dkd_v061FinalStartHome = dkd_v07StartHome/);
});

test('v0.7 drive mode forcibly kills every legacy Courier Center and menu source', () => {
  assert.match(dkd_v07, /dkd_v07StopLegacyHome/);
  assert.match(dkd_v07, /dkd_v061FinalHomeSource/);
  assert.match(dkd_v07, /dkd_v05MenuSource/);
  assert.match(dkd_v07, /dkd_v04MenuLoopSource/);
  assert.match(dkd_v07, /dkd_v07AudioOwner = 'transition'/);
});

test('visible stale release labels and public support contact are normalized without rewriting admin identity globally', () => {
  assert.ok(dkd_fix.includes(".replace(/\\bv0\\.(?:4|5|6)(?!\\.\\d)/g, 'v0.6.1')"));
  assert.match(dkd_fix, /support@draborneagle\.com/);
  assert.match(dkd_fix, /draborneagle@gmail\\\.com/);
  assert.match(dkd_build, /dkd_file === 'dkd-v061-release\.mjs'/);
  assert.match(dkd_build, /Gizlilik iletişimi:/);
  assert.match(dkd_build, /support@draborneagle\.com/);
  assert.doesNotMatch(dkd_build, /dkd_source = dkd_source\.replace\(\/draborneagle@gmail/);
});

test('generated Expo Go artifact contains v0.7 runtime and public support contact', () => {
  assert.match(dkd_generated, /dkd_lastMileRuntimeV07/);
  assert.match(dkd_generated, /support@draborneagle\.com/);
  assert.doesNotMatch(dkd_generated, /Gizlilik iletişimi:\s*draborneagle@gmail\.com/i);
  assert.match(dkd_generated, /v0\.7/);
});

test('v0.7 release layer is bundled after the final v0.6.1 device layer', () => {
  const dkd_repair = dkd_build.indexOf("'dkd-v061-runtime-repair.mjs'");
  const dkd_final = dkd_build.indexOf("'dkd-v061-final-device-fix.mjs'");
  const dkd_v07Index = dkd_build.indexOf("'dkd-v07-release.mjs'");
  assert.ok(dkd_repair >= 0);
  assert.ok(dkd_final > dkd_repair);
  assert.ok(dkd_v07Index > dkd_final);
  assert.match(dkd_build, /dkd-v07-home-kurye-merkezi\.mp3/);
  assert.match(dkd_build, /dkd-v07-drive-final-kontrat\.mp3/);
});

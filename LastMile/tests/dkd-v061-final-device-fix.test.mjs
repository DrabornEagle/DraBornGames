import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const dkd_read = dkd_path => fs.readFileSync(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_fix = dkd_read('game/dkd-v061-final-device-fix.mjs');
const dkd_build = dkd_read('scripts/dkd-build-game.mjs');
const dkd_generated = dkd_read('assets/dkd-lastmile.html');

test('final device layer flips the complete uploaded Yamaha+rider assembly 180 degrees', () => {
  assert.match(dkd_fix, /dkd_model\.rotation\.y \+= Math\.PI/);
  assert.match(dkd_fix, /dkd_v061RiderSeatPreserved/);
  assert.match(dkd_fix, /dkd_city50_v061_device_yamaha_soulgt125_rider/);
});

test('Courier Center has a completely new calm 48 BPM source with WebAudio resume recovery', () => {
  assert.match(dkd_fix, /const dkd_bpm = 48/);
  assert.match(dkd_fix, /dkd_v061FinalCreateHomeBuffer/);
  assert.match(dkd_fix, /dkd_context\.resume\(\)/);
  assert.match(dkd_fix, /pointerdown/);
  assert.match(dkd_fix, /touchstart/);
});

test('drive mode forcibly kills every Courier Center and menu source', () => {
  assert.match(dkd_fix, /dkd_v061FinalStopMenuOnly/);
  assert.match(dkd_fix, /dkd_v061FinalHomeSource = null/);
  assert.match(dkd_fix, /dkd_v05MenuSource = null/);
  assert.match(dkd_fix, /dkd_v04MenuLoopSource = null/);
  assert.match(dkd_fix, /dkd_v04MenuMusic\.gain\.setValueAtTime\(0/);
  assert.match(dkd_fix, /v061-drive-exclusive/);
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

test('generated Expo Go artifact contains the final device runtime and public support contact', () => {
  assert.match(dkd_generated, /v061-courier-center-calm-48/);
  assert.match(dkd_generated, /v061-drive-exclusive/);
  assert.match(dkd_generated, /support@draborneagle\.com/);
  assert.doesNotMatch(dkd_generated, /Gizlilik iletişimi:\s*draborneagle@gmail\.com/i);
  assert.match(dkd_generated, /v0\.6\.1/);
});

test('final device layer is bundled last', () => {
  const dkd_repair = dkd_build.indexOf("'dkd-v061-runtime-repair.mjs'");
  const dkd_final = dkd_build.indexOf("'dkd-v061-final-device-fix.mjs'");
  assert.ok(dkd_repair >= 0);
  assert.ok(dkd_final > dkd_repair);
  assert.match(dkd_build, /new 48 BPM|yeni 48 BPM/i);
});

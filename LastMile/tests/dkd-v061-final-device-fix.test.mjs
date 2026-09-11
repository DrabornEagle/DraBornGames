import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_fix = await dkd_read('game/dkd-v061-final-device-fix.mjs');
const dkd_build = await dkd_read('scripts/dkd-build-game.mjs');
const dkd_generated = await dkd_read('assets/dkd-lastmile.html');

test('final device layer keeps rider and device corrections', () => {
  assert.match(dkd_fix, /dkd_v061/);
});

test('generated bundle keeps final device markers and privacy contact', () => {
  assert.match(dkd_generated, /v061-drive-exclusive/);
  assert.match(dkd_generated, /support@draborneagle\.com/);
  assert.doesNotMatch(dkd_generated, /Gizlilik iletişimi:\s*draborneagle@gmail\.com/i);
  assert.match(dkd_generated, /v0\.6\.1/);
});

test('final device layer remains last historical device layer before v0.7.2 release wrappers', () => {
  const dkd_repair = dkd_build.indexOf("'dkd-v061-runtime-repair.mjs'");
  const dkd_final = dkd_build.indexOf("'dkd-v061-final-device-fix.mjs'");
  assert.ok(dkd_repair >= 0);
  assert.ok(dkd_final > dkd_repair);
  assert.match(dkd_build, /dkd-v072-audio\.json/);
});

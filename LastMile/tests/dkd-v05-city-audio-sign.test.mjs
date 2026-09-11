import test from 'node:test';
import assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs/promises';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';
const dkd_root = dkd_path.resolve(dkd_path.dirname(dkd_fileURLToPath(import.meta.url)), '..');
const dkd_patch = await dkd_fs.readFile(dkd_path.join(dkd_root, 'game/dkd-v05-city-audio-sign-hotfix.mjs'), 'utf8');
const dkd_build = await dkd_fs.readFile(dkd_path.join(dkd_root, 'scripts/dkd-build-game.mjs'), 'utf8');

test('city layer keeps denser urban detail tokens', () => {
  assert.match(dkd_patch, /dkd_trunks\.length >= 1100/);
  assert.match(dkd_patch, /18 \+ dkd_random\(\) \* 10/);
  for (const dkd_token of ['dkd_benchSeats','dkd_bins','dkd_bollards','dkd_shelterRoofs','dkd_adBoards','dkd_extraLampPoles']) assert.match(dkd_patch, new RegExp(dkd_token));
  assert.match(dkd_patch, /dkd_v05CityDetailCounts/);
});

test('city audio sign layer stays before road-edge safety and final device runtime', () => {
  const dkd_city = dkd_build.indexOf("'dkd-v05-city-audio-sign-hotfix.mjs'");
  const dkd_previous = dkd_build.indexOf("'dkd-v05-roadwork-audio-hotfix.mjs'");
  const dkd_final = dkd_build.indexOf("'dkd-v05-palm-roadedge-hotfix.mjs'");
  const dkd_v06 = dkd_build.indexOf("'dkd-v06-release.mjs'");
  const dkd_v061 = dkd_build.indexOf("'dkd-v061-release.mjs'");
  const dkd_device = dkd_build.indexOf("'dkd-v061-device-hotfix.mjs'");
  const dkd_repair = dkd_build.indexOf("'dkd-v061-runtime-repair.mjs'");
  const dkd_finalDevice = dkd_build.indexOf("'dkd-v061-final-device-fix.mjs'");
  assert.ok(dkd_city > dkd_previous);
  assert.ok(dkd_final > dkd_city);
  assert.ok(dkd_v06 > dkd_final);
  assert.ok(dkd_v061 > dkd_v06);
  assert.ok(dkd_device > dkd_v061);
  assert.ok(dkd_repair > dkd_device);
  assert.ok(dkd_finalDevice > dkd_repair);
  assert.match(dkd_build, /dkd-v072-audio\.json/);
  assert.match(dkd_build, /Supabase native köprü/);
});

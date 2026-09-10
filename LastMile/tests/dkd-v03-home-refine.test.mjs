import test from 'node:test';
import assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';

const dkd_root = dkd_path.resolve(dkd_path.dirname(dkd_fileURLToPath(import.meta.url)), '..');
const dkd_read = dkd_pathname => dkd_fs.readFileSync(dkd_path.join(dkd_root, dkd_pathname), 'utf8');

test('v0.3 home refinement is bundled after the visual hotfix', () => {
  const dkd_build = dkd_read('scripts/dkd-build-game.mjs');
  const dkd_visualIndex = dkd_build.indexOf("'dkd-v03-visual-hotfix.mjs'");
  const dkd_homeIndex = dkd_build.indexOf("'dkd-v03-home-refine.mjs'");
  assert.ok(dkd_visualIndex >= 0 && dkd_homeIndex > dkd_visualIndex);
});

test('home heading uses player full name and Ankara centre is a top-right premium badge', () => {
  const dkd_refine = dkd_read('game/dkd-v03-home-refine.mjs');
  assert.match(dkd_refine, /dkd_profile\.dkd_name \|\| dkd_profile\.dkd_username/);
  assert.match(dkd_refine, /dkd-player-name/);
  assert.match(dkd_refine, /dkd-location-premium/);
  assert.match(dkd_refine, /<b>ANKARA<\/b><small>KURYE MERKEZİ<\/small>/);
  assert.match(dkd_refine, /left:auto;/);
  assert.match(dkd_refine, /right:18px;/);
});

test('company wall sign is larger and garage starts slightly closer', () => {
  const dkd_refine = dkd_read('game/dkd-v03-home-refine.mjs');
  assert.match(dkd_refine, /dkd_companySign\.scale\.set\(1\.16, 1\.16, 1\)/);
  assert.match(dkd_refine, /dkd_v03GarageZoom = 1\.03/);
});

test('manual delivery flow overrides v0.3 automatic completion', () => {
  const dkd_refine = dkd_read('game/dkd-v03-home-refine.mjs');
  assert.match(dkd_refine, /dkd_Game\.prototype\.dkd_updateHud = dkd_v03_baseUpdateHud/);
  assert.match(dkd_refine, /press TESLİM ET/);
});

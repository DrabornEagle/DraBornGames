import test from 'node:test';
import assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';

const dkd_root = dkd_path.resolve(dkd_path.dirname(dkd_fileURLToPath(import.meta.url)), '..');
const dkd_hotfix = dkd_fs.readFileSync(dkd_path.join(dkd_root, 'game/dkd-v03-visual-hotfix.mjs'), 'utf8');
const dkd_build = dkd_fs.readFileSync(dkd_path.join(dkd_root, 'scripts/dkd-build-game.mjs'), 'utf8');

test('v0.3 visual hotfix is bundled last', () => {
  assert.match(dkd_build, /'dkd-v03-runtime-fix\.mjs',\s*'dkd-v03-visual-hotfix\.mjs'/);
});

test('route arrows face start to end instead of backwards', () => {
  assert.match(dkd_hotfix, /dkd_arrowGeometry\.rotateX\(Math\.PI \/ 2\)/);
  assert.match(dkd_hotfix, /Math\.atan2\(dkd_dx, dkd_dz\)/);
  assert.match(dkd_hotfix, /dkd_rotation: \[0, dkd_heading, 0\]/);
  assert.doesNotMatch(dkd_hotfix, /dkd_arrowGeometry\.rotateX\(-Math\.PI \/ 2\)/);
});

test('company sign is shifted left and two-finger zoom works above the HUD', () => {
  assert.match(dkd_hotfix, /dkd_companySign\.position\.x = -3\.15/);
  assert.match(dkd_hotfix, /document\.addEventListener\('touchstart'/);
  assert.match(dkd_hotfix, /document\.addEventListener\('touchmove'/);
  assert.match(dkd_hotfix, /capture: true/);
  assert.match(dkd_hotfix, /dkd_v03GarageZoom = dkd_clamp/);
});

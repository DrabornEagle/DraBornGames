import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_root = new URL('../', import.meta.url);
const dkd_hotfix = await readFile(new URL('game/dkd-v05-drive-collision-shift-sign-hotfix.mjs', dkd_root), 'utf8');
const dkd_builder = await readFile(new URL('scripts/dkd-build-game.mjs', dkd_root), 'utf8');

test('v0.5 drive hotfix is the last runtime layer', () => {
  const dkd_verificationIndex = dkd_builder.indexOf("'dkd-v05-live-season-verification.mjs'");
  const dkd_hotfixIndex = dkd_builder.indexOf("'dkd-v05-drive-collision-shift-sign-hotfix.mjs'");
  assert.ok(dkd_verificationIndex >= 0);
  assert.ok(dkd_hotfixIndex > dkd_verificationIndex);
});

test('ghost obstacle hits use oriented visible footprint instead of radius-only proximity', () => {
  assert.match(dkd_hotfix, /dkd_v05DriveFixObstacleContact/);
  assert.match(dkd_hotfix, /dkd_localX/);
  assert.match(dkd_hotfix, /dkd_localZ/);
  assert.match(dkd_hotfix, /dkd_property === 'dkd_radius'/);
  assert.match(dkd_hotfix, /: -1000/);
  assert.match(dkd_hotfix, /finally\s*\{[\s\S]*dkd_run\.dkd_obstacles = dkd_originalObstacles/);
});

test('reject clears stale shift-start state before cloud cancellation can answer', () => {
  assert.match(dkd_hotfix, /dkd_command === 'reject'/);
  assert.match(dkd_hotfix, /this\.dkd_v05PendingStart = null/);
  assert.match(dkd_hotfix, /this\.dkd_selectedOrder = null/);
  assert.match(dkd_hotfix, /this\.dkd_closeModal\?\.\(\)/);
});

test('courier center sign is shifted right without moving the company sign', () => {
  assert.match(dkd_hotfix, /dkd_v05_live_courier_center_sign/);
  assert.match(dkd_hotfix, /dkd_sign\.position\.x = -3\.60/);
  assert.doesNotMatch(dkd_hotfix, /dkd_companySign\.position\.x/);
});

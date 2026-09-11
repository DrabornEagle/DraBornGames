import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_hotfix = await dkd_read('game/dkd-v072-hotfix.mjs');
const dkd_wrapper = await dkd_read('scripts/dkd-build-game-v07.mjs');

test('v0.7.2 hotfix clears stale cloud offers after shift end', () => {
  assert.match(dkd_hotfix, /dkd_selectedOrder = null/);
  assert.match(dkd_hotfix, /dkd_orders = \[\]/);
  assert.match(dkd_hotfix, /dkd_v04JobsLoading = false/);
  assert.match(dkd_hotfix, /dkd_command === 'abandon'/);
  assert.match(dkd_hotfix, /dkd_refreshOrders\(\)/);
});

test('v0.7.2 hotfix removes penalties from collisions without visible world objects', () => {
  assert.match(dkd_hotfix, /dkd_v072HotfixVisibleRoadCollision/);
  assert.match(dkd_hotfix, /dkd_run\.dkd_obstacles/);
  assert.match(dkd_hotfix, /dkd_run\.dkd_closed/);
  assert.match(dkd_hotfix, /dkd_run\.dkd_collisions = dkd_before\.dkd_collisions/);
  assert.match(dkd_hotfix, /dkd_run\.dkd_damage = dkd_before\.dkd_damage/);
});

test('v0.7.2 hotfix updates audio percentages while range input moves', () => {
  assert.match(dkd_hotfix, /document\.addEventListener\('input'/);
  assert.match(dkd_hotfix, /label span/);
  assert.match(dkd_hotfix, /dkd_labelValue\.textContent = `\$\{dkd_value\}%`/);
  assert.match(dkd_hotfix, /dkd_v05MediaCurrent\.volume/);
});

test('hotfix is the last shared Android and web runtime layer', () => {
  assert.match(dkd_wrapper, /dkd-v072-release\.mjs','dkd-v072-hotfix\.mjs/);
});

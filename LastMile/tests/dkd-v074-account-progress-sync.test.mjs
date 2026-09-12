import dkd_test from 'node:test';
import dkd_assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs/promises';
import { dkd_defaultState, dkd_progress } from '../game/dkd-core.mjs';

const dkd_patch = await dkd_fs.readFile(new URL('../game/dkd-v074-account-progress-sync.mjs', import.meta.url), 'utf8');
const dkd_routeTraffic = await dkd_fs.readFile(new URL('../game/dkd-v04-route-traffic-density.mjs', import.meta.url), 'utf8');
const dkd_builder = await dkd_fs.readFile(new URL('../scripts/dkd-build-game-v07.mjs', import.meta.url), 'utf8');

dkd_test('all Final progress surfaces use the canonical progress formula', () => {
  const dkd_state = dkd_defaultState();
  dkd_state.dkd_deliveries = 1;
  dkd_state.dkd_ratingTotal = 5;
  dkd_state.dkd_master = 1;
  dkd_assert.equal(dkd_progress(dkd_state), 25);
  dkd_assert.match(dkd_patch, /dkd_v074GameplayFinalProgress = function/);
  dkd_assert.match(dkd_patch, /return dkd_progress\(dkd_state\)/);
  dkd_assert.match(dkd_patch, /dkd_canonicalFinalProgress: true/);
});

dkd_test('authenticated progress is pushed immediately and a more advanced local account can repair missing or blank cloud progress', () => {
  dkd_assert.match(dkd_patch, /dkd_v074AccountSyncIsAhead/);
  dkd_assert.match(dkd_patch, /dkd_v074GameplayReadBackup/);
  dkd_assert.match(dkd_patch, /clearTimeout\(this\.dkd_v04SaveTimer\)/);
  dkd_assert.match(dkd_patch, /this\.dkd_send\('cloud-save', \{ dkd_game_state: this\.dkd_career \}\)/);
  dkd_assert.match(dkd_patch, /dkd_recoveredLocalProgress/);
  dkd_assert.match(dkd_patch, /dkd_crossDeviceProgressSync: true/);
});

dkd_test('account sync patch is last in the shared Android and Web game bundle', () => {
  dkd_assert.match(dkd_builder, /dkd-v074-progress-vault-fix\.mjs','dkd-v074-account-progress-sync\.mjs/);
});

dkd_test('tutorial keeps light traffic but suppresses static obstacle collisions on the navigation line', () => {
  dkd_assert.match(dkd_routeTraffic, /dkd_order\?\.dkd_type === 'tutorial'/);
  dkd_assert.match(dkd_routeTraffic, /dkd_run\.dkd_obstacles = \[\]/);
  dkd_assert.match(dkd_routeTraffic, /dkd_run\.dkd_obstacleRouteKey = dkd_v04TrafficRouteKey\(dkd_run\)/);
  dkd_assert.match(dkd_routeTraffic, /Math\.min\(14, Math\.max\(10, dkd_requestedCount \|\| 12\)\)/);
});

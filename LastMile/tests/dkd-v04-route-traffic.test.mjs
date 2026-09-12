import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const dkd_read = dkd_path => fs.readFileSync(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_routeTraffic = dkd_read('game/dkd-v04-route-traffic-density.mjs');
const dkd_build = dkd_read('scripts/dkd-build-game.mjs');

test('dense traffic is concentrated on normal active routes instead of only city-wide', () => {
  assert.match(dkd_routeTraffic, /dkd_routeEdgesAll/);
  assert.match(dkd_routeTraffic, /const dkd_focusCount = Math\.min\(dkd_isTutorial \? 4 : 22/);
  assert.match(dkd_routeTraffic, /dkd_car\.dkd_routeFocused = true/);
  assert.match(dkd_routeTraffic, /dkd_car\.dkd_position = dkd_position/);
  assert.match(dkd_routeTraffic, /dkd_car\.dkd_speed = 4\.4/);
  assert.match(dkd_routeTraffic, /Math\.max\(dkd_requestedCount, 54\)/);
});

test('tutorial first delivery starts with light traffic and a clear spawn area', () => {
  assert.match(dkd_routeTraffic, /dkd_order\?\.dkd_type === 'tutorial'/);
  assert.match(dkd_routeTraffic, /Math\.min\(14, Math\.max\(10, dkd_requestedCount \|\| 12\)\)/);
  assert.match(dkd_routeTraffic, /\) >= 32;/);
  assert.match(dkd_routeTraffic, /\) < 36\) continue;/);
});

test('route-focused traffic patch loads after obstacle traffic patch', () => {
  const dkd_obstacleIndex = dkd_build.indexOf("'dkd-v04-traffic-obstacles.mjs'");
  const dkd_routeIndex = dkd_build.indexOf("'dkd-v04-route-traffic-density.mjs'");
  assert.ok(dkd_obstacleIndex >= 0 && dkd_routeIndex > dkd_obstacleIndex);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const dkd_read = dkd_path => fs.readFileSync(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_routeTraffic = dkd_read('game/dkd-v04-route-traffic-density.mjs');
const dkd_build = dkd_read('scripts/dkd-build-game.mjs');

test('dense traffic is concentrated on the active route instead of only city-wide', () => {
  assert.match(dkd_routeTraffic, /dkd_routeEdgesAll/);
  assert.match(dkd_routeTraffic, /const dkd_focusCount = Math\.min\(22/);
  assert.match(dkd_routeTraffic, /dkd_car\.dkd_routeFocused = true/);
  assert.match(dkd_routeTraffic, /dkd_car\.dkd_position =/);
  assert.match(dkd_routeTraffic, /dkd_car\.dkd_speed = 4\.4/);
});

test('route-focused traffic patch loads after obstacle traffic patch', () => {
  const dkd_obstacleIndex = dkd_build.indexOf("'dkd-v04-traffic-obstacles.mjs'");
  const dkd_routeIndex = dkd_build.indexOf("'dkd-v04-route-traffic-density.mjs'");
  assert.ok(dkd_obstacleIndex >= 0 && dkd_routeIndex > dkd_obstacleIndex);
});

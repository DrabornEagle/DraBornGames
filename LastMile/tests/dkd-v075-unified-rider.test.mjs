import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_source = await readFile(new URL('../game/dkd-v075-unified-rider.mjs', import.meta.url), 'utf8');
const dkd_build = await readFile(new URL('../scripts/dkd-build-game-v07.mjs', import.meta.url), 'utf8');

test('v0.7.5 unified rider removes the legacy rider tail', () => {
  assert.match(dkd_source, /dkd_v075RemoveLegacyRiderTail/);
  assert.match(dkd_source, /dkd_logoIndex/);
  assert.match(dkd_source, /dkd_v075UnifiedDispose/);
});

test('all garage vehicle families receive the City 50 premium courier', () => {
  assert.match(dkd_source, /dkd_v07PremiumRider/);
  assert.match(dkd_source, /dkd_kind === 'car' \|\| dkd_kind === 'van'/);
  assert.match(dkd_source, /dkd_v075_unified_courier_/);
  assert.match(dkd_source, /dkd_city50_v07_clean_scooter_premium_rider/);
});

test('vehicle accessories are restored without duplicating base motorcycle geometry', () => {
  assert.match(dkd_source, /dkd_v075_phone_mount/);
  assert.match(dkd_source, /dkd_v075_vehicle_plate/);
  assert.match(dkd_source, /including tank, fork, cargo and wheels/);
  assert.doesNotMatch(dkd_source, /dkd_v075_motorcycle_tank/);
  assert.match(dkd_source, /dkd_preserveVehicleGeometry: true/);
});

test('unified rider ships in the common Android and Web bundle', () => {
  assert.match(dkd_build, /dkd-v075-unified-rider\.mjs/);
  assert.match(dkd_source, /dkd_androidWebShared: true/);
});

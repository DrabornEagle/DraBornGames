import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_runtime = await readFile(new URL('../game/dkd-v05-palm-roadedge-hotfix.mjs', import.meta.url), 'utf8');
const dkd_build = await readFile(new URL('../scripts/dkd-build-game.mjs', import.meta.url), 'utf8');

test('company sign keeps emblem visible on the left wall', () => {
  assert.match(dkd_runtime, /position\.x = -4\.40/);
  assert.doesNotMatch(dkd_runtime, /position\.x = -6\.25/);
});

test('roadside candidates are checked against the nearest road', () => {
  assert.match(dkd_runtime, /dkd_nearestRoad\(dkd_scene\.dkd_graph, \[dkd_x, dkd_z\]\)/);
  assert.match(dkd_runtime, /dkd_clearance = dkd_near\.dkd_edge\.dkd_width \/ 2 \+ 3\.25/);
  assert.match(dkd_runtime, /if \(dkd_near\.dkd_distance >= dkd_clearance\)/);
});

test('multiple tree families including palms are built', () => {
  assert.match(dkd_runtime, /dkd_palmTrunks/);
  assert.match(dkd_runtime, /dkd_palmFronds/);
  assert.match(dkd_runtime, /dkd_pineCrowns/);
  assert.match(dkd_runtime, /dkd_deciduousCrowns/);
  assert.match(dkd_runtime, /dkd_slimCrowns/);
});

test('previous unsafe dense city layer is removed before rebuilding', () => {
  assert.match(dkd_runtime, /dkd_v05PalmFixDisposeGroup\(this\.dkd_v05CityDetail\)/);
  assert.match(dkd_runtime, /dkd_v05_city_detail_safe/);
});

test('build loads palm road-edge hotfix last', () => {
  const dkd_cityIndex = dkd_build.indexOf("'dkd-v05-city-audio-sign-hotfix.mjs'");
  const dkd_palmIndex = dkd_build.indexOf("'dkd-v05-palm-roadedge-hotfix.mjs'");
  assert.ok(dkd_cityIndex >= 0);
  assert.ok(dkd_palmIndex > dkd_cityIndex);
});

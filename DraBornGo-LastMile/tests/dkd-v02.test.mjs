import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const dkd_patch = fs.readFileSync(new URL('../game/dkd-v02-patch.mjs', import.meta.url), 'utf8');
const dkd_build = fs.readFileSync(new URL('../scripts/dkd-build-game.mjs', import.meta.url), 'utf8');
const dkd_app = JSON.parse(fs.readFileSync(new URL('../app.json', import.meta.url), 'utf8'));
const dkd_package = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('v0.2 compatibility layer remains bundled in the current v0.4 Expo Go build', () => {
  assert.equal(dkd_package.version, '0.4.0');
  assert.equal(dkd_app.expo.version, '0.4.0');
  assert.equal(dkd_app.expo.android.versionCode, 400);
  assert.equal(dkd_app.expo.extra.dkd_versionLabel, 'v0.4');
  assert.match(dkd_build, /v0\.4/);
});

test('v0.2 bundle includes starter scooter data and patch after base modules', () => {
  const dkd_patchIndex = dkd_build.indexOf("'dkd-v02-patch.mjs'");
  assert.ok(dkd_build.indexOf("'dkd-v02-scooter-0.mjs'") > 0);
  assert.ok(dkd_build.indexOf("'dkd-v02-scooter-1.mjs'") > 0);
  assert.ok(dkd_build.indexOf("'dkd-v02-scooter-2.mjs'") > 0);
  assert.ok(dkd_patchIndex > dkd_build.indexOf("'dkd-controller.mjs'"));
});

test('route choices are rejected when geometry or displayed distance is identical', () => {
  assert.match(dkd_patch, /dkd_v02_sameRoute/);
  assert.match(dkd_patch, /dkd_v02_routeChoiceIsDistinct/);
  assert.match(dkd_patch, />= 10/);
  assert.match(dkd_patch, /24/);
});

test('v0.2 steering and visible OSM compatibility fixes remain bundled', () => {
  assert.match(dkd_patch, /this\.dkd_input\.dkd_steer = -dkd_visual/);
  assert.match(dkd_patch, /\.dkd-osm\{display:none!important\}/);
});

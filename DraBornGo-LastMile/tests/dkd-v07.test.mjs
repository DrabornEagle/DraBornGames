import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_release = await readFile(new URL('../game/dkd-v07-release.mjs', import.meta.url), 'utf8');
const dkd_build = await readFile(new URL('../scripts/dkd-build-game.mjs', import.meta.url), 'utf8');
const dkd_app = JSON.parse(await readFile(new URL('../app.json', import.meta.url), 'utf8'));
const dkd_package = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

// These are source-level release invariants. Device rendering is still verified in Expo Go.
test('v0.7 release metadata is aligned', () => {
  assert.equal(dkd_app.expo.version, '0.7.0');
  assert.equal(dkd_app.expo.android.versionCode, 1);
  assert.equal(dkd_app.expo.extra.dkd_versionLabel, 'v0.7');
  assert.equal(dkd_package.version, '0.7.0');
  assert.match(dkd_build, /dkd-v07-release\.mjs/);
});

test('camera controls are restored without requesting physical camera permission', () => {
  assert.match(dkd_release, /Kamera mesafesi/);
  assert.match(dkd_release, /camera-mode:near/);
  assert.match(dkd_release, /camera-mode:chase/);
  assert.match(dkd_release, /camera-mode:high/);
  assert.doesNotMatch(JSON.stringify(dkd_app.expo.android.permissions || []), /CAMERA/);
});

test('rider rotates independently while every Yamaha mesh keeps its current heading', () => {
  assert.match(dkd_release, /new Set\(\[22, 23, 24, 25, 26, 27\]\)/);
  assert.doesNotMatch(dkd_release, /new Set\(\[20, 21, 22/);
  assert.match(dkd_release, /dkd_mesh\.rotation\.y \+= Math\.PI/);
  assert.match(dkd_release, /dkd_riderMeshIndexes: \[22, 23, 24, 25, 26, 27\]/);
  assert.match(dkd_release, /dkd_motorcycleAdditionalHeadingRadians: 0/);
  assert.match(dkd_release, /dkd_riderAdditionalHeadingRadians: Math\.PI/);
});

test('Courier Center and drive music use one exclusive media owner', () => {
  assert.match(dkd_release, /dkd_v07PauseEveryMediaExcept/);
  assert.match(dkd_release, /dkd_v07StopLegacyHome/);
  assert.match(dkd_release, /dkd_v07AudioOwner/);
  assert.match(dkd_release, /dkd_audioSingleOwner: true/);
  assert.match(dkd_build, /dkd-v07-home-kurye-merkezi\.mp3/);
  assert.match(dkd_build, /dkd-v07-drive-final-kontrat\.mp3/);
});

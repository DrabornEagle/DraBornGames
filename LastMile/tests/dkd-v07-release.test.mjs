import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile as dkd_readFile } from 'node:fs/promises';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';
import path from 'node:path';

const dkd_testsDir = path.dirname(dkd_fileURLToPath(import.meta.url));
const dkd_root = path.resolve(dkd_testsDir, '..');
const dkd_repoRoot = path.resolve(dkd_root, '..');

async function dkd_text(dkd_relative) {
  return dkd_readFile(path.join(dkd_root, dkd_relative), 'utf8');
}

test('v0.7.2 Android metadata keeps versionCode 1 and Expo Go test channel', async () => {
  const dkd_app = JSON.parse(await dkd_text('app.json'));
  assert.equal(dkd_app.expo.version, '0.7.2');
  assert.equal(dkd_app.expo.android.package, 'com.draborneagle.lastmile');
  assert.equal(dkd_app.expo.android.versionCode, 1);
  assert.equal(dkd_app.expo.extra.dkd_cameraDefault, 'chase');
  assert.equal(dkd_app.expo.extra.dkd_audioRuntime, 'physical-mp3-two-track');
  assert.equal(dkd_app.expo.extra.dkd_releaseChannel, 'expo-go-test');
  assert.equal(dkd_app.expo.extra.dkd_webUrl, 'https://www.draborneagle.com/DraBornGames/LastMile/');
});

test('v0.7.2 Expo SDK 57 and shared bundle wrapper are enabled', async () => {
  const dkd_package = JSON.parse(await dkd_text('package.json'));
  const dkd_wrapper = await dkd_text('scripts/dkd-build-game-v07.mjs');
  assert.equal(dkd_package.version, '0.7.2');
  assert.equal(dkd_package.dependencies.expo, '~57.0.20');
  assert.equal(dkd_package.dependencies['expo-dev-client'], '~57.0.18');
  assert.equal(dkd_package.scripts['build:game'], 'node scripts/dkd-build-game-v07.mjs');
  assert.match(dkd_wrapper, /dkd-v072-release\.mjs/);
  assert.match(dkd_wrapper, /v0\.7\.2/);
});

test('v0.7 settings exposes standard chase camera and flat visual rules', async () => {
  const dkd_release = await dkd_text('game/dkd-v07-release.mjs');
  assert.match(dkd_release, /dkd_v07CameraDefault = 'chase'/);
  assert.match(dkd_release, /Takip \/ Standart/);
  assert.match(dkd_release, /data-dkd-action="dkd-v07-camera:/);
  assert.doesNotMatch(dkd_release, /linear-gradient\s*\(/i);
  assert.doesNotMatch(dkd_release, /radial-gradient\s*\(/i);
  assert.doesNotMatch(dkd_release, /text-shadow\s*:/i);
});

test('v0.7.2 audio manifest contains only InnerLight menu and SeMeNota drive tracks', async () => {
  const dkd_manifest = JSON.parse(await dkd_text('game/audio/dkd-v072-audio.json'));
  const dkd_builder = await dkd_text('scripts/dkd-build-game.mjs');
  const dkd_patch = await dkd_text('game/dkd-v072-release.mjs');
  assert.equal(dkd_manifest.dkd_version, '0.7.2');
  assert.equal(dkd_manifest.dkd_tracks.length, 2);
  assert.deepEqual(dkd_manifest.dkd_tracks.map(dkd_track => [dkd_track.dkd_name, dkd_track.dkd_mode]), [['InnerLight', 'menu'], ['SeMeNota', 'drive']]);
  assert.match(dkd_builder, /dkd-v072-audio\.json/);
  assert.match(dkd_builder, /createHash\('sha256'\)/);
  assert.match(dkd_patch, /physical-mp3-two-track/);
  assert.match(dkd_patch, /InnerLight\.mp3/);
  assert.match(dkd_patch, /SeMeNota\.mp3/);
});

test('v0.7.2 Android workflow stays manual and preserves permanent signing secrets', async () => {
  const dkd_workflow = await dkd_readFile(path.join(dkd_repoRoot, '.github/workflows/dkd-lastmile-android-v07.yml'), 'utf8');
  assert.match(dkd_workflow, /workflow_dispatch:/);
  assert.match(dkd_workflow, /DKD_LASTMILE_KEYSTORE_B64/);
  assert.match(dkd_workflow, /DKD_LASTMILE_KEY_ALIAS/);
  assert.match(dkd_workflow, /LastMile/);
  assert.match(dkd_workflow, /v0\.7\.2/);
});

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

test('v0.7 Android metadata is versionName 0.7.1 and versionCode 1', async () => {
  const dkd_app = JSON.parse(await dkd_text('app.json'));
  assert.equal(dkd_app.expo.version, '0.7.1');
  assert.equal(dkd_app.expo.android.package, 'com.draborneagle.lastmile');
  assert.equal(dkd_app.expo.android.versionCode, 1);
  assert.equal(dkd_app.expo.extra.dkd_cameraDefault, 'chase');
  assert.equal(dkd_app.expo.extra.dkd_audioRuntime, 'physical-mp3-only');
});

test('v0.7 Expo development client and bundle wrapper are enabled', async () => {
  const dkd_package = JSON.parse(await dkd_text('package.json'));
  const dkd_wrapper = await dkd_text('scripts/dkd-build-game-v07.mjs');
  assert.equal(dkd_package.version, '0.7.1');
  assert.equal(dkd_package.dependencies['expo-dev-client'], '~57.0.18');
  assert.equal(dkd_package.scripts['build:game'], 'node scripts/dkd-build-game-v07.mjs');
  assert.match(dkd_wrapper, /dkd-v07-release\.mjs/);
  assert.match(dkd_wrapper, /v0\.7\.1/);
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

test('v0.7 music runtime uses physical MP3 media and isolates menu from drive', async () => {
  const dkd_release = await dkd_text('game/dkd-v07-release.mjs');
  const dkd_renderer = await dkd_text('scripts/dkd-render-music-v07.py');
  assert.match(dkd_release, /physical-mp3-only/);
  assert.match(dkd_release, /dkd_v07MuteProcedural/);
  assert.match(dkd_release, /dkd_v05MediaPlayers/);
  assert.match(dkd_renderer, /libmp3lame/);
  assert.match(dkd_renderer, /192k/);
  assert.match(dkd_renderer, /wave\.open/);
});

test('v0.7 Android workflow requires the permanent signing key and builds debug dev client APK', async () => {
  const dkd_workflow = await dkd_readFile(path.join(dkd_repoRoot, '.github/workflows/dkd-lastmile-android-v07.yml'), 'utf8');
  assert.match(dkd_workflow, /DKD_LASTMILE_KEYSTORE_B64/);
  assert.match(dkd_workflow, /DKD_LASTMILE_KEY_ALIAS/);
  assert.match(dkd_workflow, /expo prebuild --platform android --clean/);
  assert.match(dkd_workflow, /assembleDebug/);
  assert.match(dkd_workflow, /DraBornGo-LastMile-v0\.7\.1-development-vc1\.apk/);
});

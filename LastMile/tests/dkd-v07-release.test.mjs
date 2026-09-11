import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile as dkd_readFile, readdir as dkd_readdir } from 'node:fs/promises';
import { createHash as dkd_createHash } from 'node:crypto';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';
import path from 'node:path';

const dkd_testsDir = path.dirname(dkd_fileURLToPath(import.meta.url));
const dkd_root = path.resolve(dkd_testsDir, '..');
const dkd_repoRoot = path.resolve(dkd_root, '..');

async function dkd_text(dkd_relative) {
  return dkd_readFile(path.join(dkd_root, dkd_relative), 'utf8');
}

async function dkd_sha256(dkd_relative) {
  const dkd_bytes = await dkd_readFile(path.join(dkd_root, dkd_relative));
  return {
    dkd_bytes,
    dkd_sha: dkd_createHash('sha256').update(dkd_bytes).digest('hex'),
  };
}

test('v0.7.3 Android metadata keeps versionCode 1 and Expo Go test channel', async () => {
  const dkd_app = JSON.parse(await dkd_text('app.json'));
  assert.equal(dkd_app.expo.version, '0.7.3');
  assert.equal(dkd_app.expo.android.package, 'com.draborneagle.lastmile');
  assert.equal(dkd_app.expo.android.versionCode, 1);
  assert.equal(dkd_app.expo.extra.dkd_releaseChannel, 'expo-go-test');
  assert.equal(dkd_app.expo.extra.dkd_cameraDefault, 'chase');
  assert.equal(dkd_app.expo.extra.dkd_audioRuntime, 'physical-mp3-two-track');
  assert.equal(dkd_app.expo.extra.dkd_webPublishedVersion, '0.7.2');
  assert.equal(dkd_app.expo.extra.dkd_expoCandidateOnly, true);
});

test('v0.7.3 package and Expo bundle wrapper are aligned', async () => {
  const dkd_package = JSON.parse(await dkd_text('package.json'));
  const dkd_wrapper = await dkd_text('scripts/dkd-build-game-v07.mjs');
  assert.equal(dkd_package.version, '0.7.3');
  assert.equal(dkd_package.dependencies.expo, '~57.0.20');
  assert.equal(dkd_package.scripts['build:game'], 'node scripts/dkd-build-game-v07.mjs');
  assert.match(dkd_wrapper, /dkd-v072-release\.mjs/);
  assert.match(dkd_wrapper, /dkd-v073-expo\.mjs/);
  assert.match(dkd_wrapper, /v0\.7\.3/);
});

test('v0.7.3 retains standard chase camera and physical two-track audio', async () => {
  const dkd_release = await dkd_text('game/dkd-v07-release.mjs');
  const dkd_v072 = await dkd_text('game/dkd-v072-release.mjs');
  assert.match(dkd_release, /dkd_v07CameraDefault = 'chase'/);
  assert.match(dkd_release, /Takip \/ Standart/);
  assert.match(dkd_v072, /physical-mp3-two-track/);
  assert.match(dkd_v072, /InnerLight\.mp3/);
  assert.match(dkd_v072, /SeMeNota\.mp3/);
  assert.doesNotMatch(dkd_release, /linear-gradient\s*\(/i);
  assert.doesNotMatch(dkd_release, /radial-gradient\s*\(/i);
  assert.doesNotMatch(dkd_release, /text-shadow\s*:/i);
});

test('v0.7.3 continues using only verified InnerLight and SeMeNota music files', async () => {
  const dkd_manifest = JSON.parse(await dkd_text('game/audio/dkd-v072-audio.json'));
  assert.equal(dkd_manifest.dkd_tracks.length, 2);
  assert.deepEqual(
    dkd_manifest.dkd_tracks.map(dkd_track => [dkd_track.dkd_file, dkd_track.dkd_mode]),
    [['audio/InnerLight.mp3', 'menu'], ['audio/SeMeNota.mp3', 'drive']],
  );

  for (const dkd_track of dkd_manifest.dkd_tracks) {
    const dkd_result = await dkd_sha256(`game/${dkd_track.dkd_file}`);
    assert.equal(dkd_result.dkd_bytes.length, dkd_track.dkd_bytes);
    assert.equal(dkd_result.dkd_sha, dkd_track.dkd_sha256);
    assert.equal(dkd_result.dkd_bytes.subarray(0, 3).toString('ascii'), 'ID3');
  }

  const dkd_audioFiles = (await dkd_readdir(path.join(dkd_root, 'game/audio')))
    .filter(dkd_name => dkd_name.toLowerCase().endsWith('.mp3'))
    .sort();
  assert.deepEqual(dkd_audioFiles, ['InnerLight.mp3', 'SeMeNota.mp3']);
});

test('Android output workflows remain manual-only during Expo testing', async () => {
  const dkd_android = await dkd_readFile(path.join(dkd_repoRoot, '.github/workflows/dkd-lastmile-android-v07.yml'), 'utf8');
  const dkd_release = await dkd_readFile(path.join(dkd_repoRoot, '.github/workflows/dkd-lastmile-android-signed-release.yml'), 'utf8');
  for (const dkd_workflow of [dkd_android, dkd_release]) {
    assert.match(dkd_workflow, /workflow_dispatch:/);
    assert.doesNotMatch(dkd_workflow, /^\s*push:/m);
    assert.match(dkd_workflow, /working-directory: LastMile/);
    assert.match(dkd_workflow, /DKD_LASTMILE_KEYSTORE_B64/);
  }
  assert.match(dkd_android, /versionName=0\.7\.3/);
  assert.match(dkd_release, /dkd_publish_github_release/);
});

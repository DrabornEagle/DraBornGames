import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';

const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_hotfix = await dkd_read('game/dkd-v061-device-hotfix.mjs');
const dkd_build = await dkd_read('scripts/dkd-build-game.mjs');

const dkd_chunkFiles = Array.from({ length: 6 }, (_, dkd_index) => `game/models/v061/dkd-v061-model-${dkd_index}.mjs`);
const dkd_parts = [];
for (const dkd_file of dkd_chunkFiles) {
  const dkd_source = await dkd_read(dkd_file);
  const dkd_match = dkd_source.match(/=\s*['"]([A-Za-z0-9+/=]+)['"]\s*;/);
  assert.ok(dkd_match, `${dkd_file} base64 parçası okunmalı`);
  dkd_parts.push(dkd_match[1]);
}
const dkd_rawModel = gunzipSync(Buffer.from(dkd_parts.join(''), 'base64'));

test('starter Yamaha+rider DK61 package is intact before device injection', () => {
  assert.equal(dkd_rawModel.length, 29530);
  assert.equal(dkd_rawModel.subarray(0, 4).toString('ascii'), 'DK61');
  assert.equal(createHash('sha256').update(dkd_rawModel).digest('hex'), '8dc66ee133b1651571ebfcd8c74238b091c45a4a9405ea25a2bf57c62f51e2a1');
});

test('build injects already-inflated model bytes for Expo Go WebView', () => {
  assert.match(dkd_build, /gunzipSync as dkd_gunzipSync/);
  assert.match(dkd_build, /dkd_prepareV061RawModel/);
  assert.match(dkd_build, /dkd_v061ModelRawBase64/);
  assert.match(dkd_build, /dkd-v061-device-hotfix\.mjs/);
  assert.ok(dkd_build.indexOf("'dkd-v061-device-hotfix.mjs'") > dkd_build.indexOf("'dkd-v061-release.mjs'"));
});

test('device hotfix synchronously replaces the starter fallback without DecompressionStream', () => {
  assert.match(dkd_hotfix, /dkd_v061Previous\.dkd_buildBike\.call/);
  assert.match(dkd_hotfix, /dkd_v061DeviceReadRawBytes/);
  assert.match(dkd_hotfix, /dkd_v061BuildStarterModel\(dkd_v061DeviceReadRawBytes\(\)\)/);
  assert.match(dkd_hotfix, /dkd_city50_v061_device_yamaha_soulgt125_rider/);
  assert.doesNotMatch(dkd_hotfix, /DecompressionStream/);
});

test('starting a shift physically stops home and menu sources before drive music', () => {
  assert.match(dkd_hotfix, /dkd_v061DeviceStopMenuMusic\(this\.dkd_audio\);\s*const dkd_result = dkd_v061DevicePrevious\.dkd_startRun\.call\(this\)/s);
  assert.match(dkd_hotfix, /dkd_v05MenuSource = null/);
  assert.match(dkd_hotfix, /dkd_v04MenuLoopSource = null/);
  assert.match(dkd_hotfix, /dkd_v04MenuMusic\.gain\.setValueAtTime\(0/);
  assert.match(dkd_hotfix, /dkd_v061DeviceEnforceDriveOnly/);
  assert.match(dkd_hotfix, /dkd_v04Mode = 'v061-drive-only'/);
});

test('drive render cannot restart Courier Center music', () => {
  assert.match(dkd_hotfix, /this\.dkd_run\?\.dkd_active \|\| this\.dkd_scene\?\.dkd_mode === 'drive'/);
  assert.match(dkd_hotfix, /dkd_v061DeviceEnforceDriveOnly\(this\)/);
});

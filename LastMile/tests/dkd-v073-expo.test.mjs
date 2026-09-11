import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_v073 = await dkd_read('game/dkd-v073-expo.mjs');
const dkd_wrapper = await dkd_read('scripts/dkd-build-game-v07.mjs');

test('v0.7.3 replaces destructive career delete with session logout', () => {
  assert.match(dkd_v073, /KARİYER KAYDINI SİL/);
  assert.match(dkd_v073, /OTURUMU KAPAT/);
  assert.match(dkd_v073, /v04-logout/);
});

test('v0.7.3 hides Test Laboratory unless cloud/admin role is active', () => {
  assert.match(dkd_v073, /dkd_v073IsAdmin/);
  assert.match(dkd_v073, /dkd_v04IsAdmin === true/);
  assert.match(dkd_v073, /dkd_role === 'admin'/);
  assert.match(dkd_v073, /Test laboratuvarı/);
});

test('v0.7.3 registration identifies each invalid field and plate format', () => {
  for (const dkd_name of ['dkd_full_name','dkd_username','dkd_phone','dkd_company_name','dkd_plate_no','dkd_email','dkd_password']) {
    assert.match(dkd_v073, new RegExp(dkd_name));
  }
  assert.match(dkd_v073, /Plaka formatı geçersiz/);
  assert.match(dkd_v073, /06 ABC 123/);
  assert.match(dkd_v073, /aria-invalid/);
  assert.match(dkd_v073, /scrollIntoView/);
  assert.match(dkd_v073, /stopImmediatePropagation/);
});

test('v0.7.3 drive camera button cycles near chase high without leaving shift', () => {
  assert.match(dkd_v073, /\['near', 'chase', 'high'\]/);
  assert.match(dkd_v073, /dkd-v073-camera-cycle/);
  assert.match(dkd_v073, /dkd_cameraSnap = true/);
  assert.doesNotMatch(dkd_v073, /dkd_render\('drive'\)/);
});

test('v0.7.3 drive music button toggles complete game audio', () => {
  assert.match(dkd_v073, /dkd-v073-audio-toggle/);
  assert.match(dkd_v073, /dkd_v073UserMuted/);
  assert.match(dkd_v073, /dkd_master\.gain/);
  assert.match(dkd_v073, /dkd_v05MediaPlayers/);
  assert.match(dkd_v073, /Oyun sesleri kapatıldı/);
  assert.match(dkd_v073, /Oyun sesleri açıldı/);
});

test('v0.7.3 Expo layer is the final runtime layer and web is held at v0.7.2', () => {
  assert.match(dkd_wrapper, /dkd-v072-hotfix\.mjs','dkd-v073-expo\.mjs/);
  assert.match(dkd_wrapper, /v0\.7\.3/);
  assert.match(dkd_v073, /dkd_webPublished: false/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const dkd_read = dkd_path => fs.readFileSync(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_patch = dkd_read('game/dkd-v061-runtime-repair.mjs');
const dkd_build = dkd_read('scripts/dkd-build-game.mjs');

test('runtime repair is the final bundled layer', () => {
  const dkd_device = dkd_build.indexOf("'dkd-v061-device-hotfix.mjs'");
  const dkd_repair = dkd_build.indexOf("'dkd-v061-runtime-repair.mjs'");
  assert.ok(dkd_device >= 0);
  assert.ok(dkd_repair > dkd_device);
});

test('settings exposes privacy policy and account deletion page', () => {
  assert.match(dkd_patch, /GİZLİLİK POLİTİKASI VE HESAP SİLME/);
  assert.match(dkd_patch, /'privacy', 'shield'/);
  assert.match(dkd_patch, /dkd_view_privacy/);
});

test('argument pages preserve vip chat and call identifiers', () => {
  assert.match(dkd_patch, /dkd_v061RepairBoundView/);
  assert.match(dkd_patch, /dkd_method\.call\(this, dkd_arg\)/);
  assert.match(dkd_patch, /this\.dkd_pageArg = dkd_arg/);
  assert.match(dkd_patch, /Müşteri profili bulunamadı/);
});

test('cloud capacity validation uses the same server load shown in UI', () => {
  assert.match(dkd_patch, /dkd_requiredLoad/);
  assert.match(dkd_patch, /dkd_package\.dkd_weight = dkd_requiredLoad/);
  assert.match(dkd_patch, /finally \{\s*dkd_package\.dkd_weight = dkd_originalWeight/);
});

test('visually corrupted Mira portrait is quarantined from customer pools', () => {
  assert.match(dkd_patch, /dkd_v061RepairQuarantinePortrait\(dkd_v06CustomerPortraitPool, dkd_v06AvatarMira\)/);
  assert.match(dkd_patch, /dkd_v061RepairQuarantinePortrait\(dkd_v061SafePortraitPool, dkd_v06AvatarMira\)/);
  assert.match(dkd_patch, /dkd_id === 'dkd_mira'/);
});

test('starter Yamaha riding configuration is aligned to the game forward axis', () => {
  assert.match(dkd_patch, /dkd_city50_v061_device_yamaha_soulgt125_rider/);
  assert.match(dkd_patch, /dkd_model\.rotation\.y \+= Math\.PI \/ 2/);
  assert.match(dkd_patch, /dkd_v061RepairAxis/);
});

test('Courier Center music is calmer and isolated from media players', () => {
  assert.match(dkd_patch, /const dkd_bpm = 54/);
  assert.match(dkd_patch, /dkd_setting \* \.48/);
  assert.match(dkd_patch, /dkd_v061RepairSilenceMedia/);
  assert.match(dkd_patch, /v061-calm-home-54/);
});

test('driving tracks do not loop and advance to a different track when ended', () => {
  assert.match(dkd_patch, /dkd_target\.loop = false/);
  assert.match(dkd_patch, /dkd_target\.onended = \(\) =>/);
  assert.match(dkd_patch, /const dkd_next = \(dkd_index \+ 1\) % dkd_count/);
  assert.match(dkd_patch, /dkd_v061RepairPlayDriveIndex\(dkd_audio, dkd_next, true\)/);
});

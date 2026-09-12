import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_patch = await dkd_read('game/dkd-v075-ui-model-polish.mjs');
const dkd_wrapper = await dkd_read('scripts/dkd-build-game-v07.mjs');

test('v0.7.5 UI/model polish is the final shared Android and Web runtime layer', () => {
  assert.match(dkd_wrapper, /dkd-v075-payment-season-hotfix\.mjs','dkd-v075-ui-model-polish\.mjs'/);
  assert.match(dkd_patch, /dkd_goalDetails:true/);
});

test('Reward Vault final goals open detailed animated how-to popups', () => {
  assert.match(dkd_patch, /v075-goal-detail:/);
  assert.match(dkd_patch, /NASIL TAMAMLANIR\?/);
  assert.match(dkd_patch, /Usta Teslimat/);
  assert.match(dkd_patch, /Özel Müşteri hikâyesi/);
  assert.match(dkd_patch, /Fırtına teslimatı/);
  assert.match(dkd_patch, /Şirket itibarı/);
  assert.match(dkd_patch, /kaliteyi en az %85/);
  assert.match(dkd_patch, /4,5\/5/);
  assert.match(dkd_patch, /@keyframes dkd-v075-goal-in/);
  assert.doesNotMatch(dkd_patch, /linear-gradient|radial-gradient|box-shadow|text-shadow/i);
});

test('Season Center removes the Supabase implementation copy from player UI', () => {
  assert.match(dkd_patch, /\.dkd-v075-season-hero > p/);
  assert.match(dkd_patch, /startsWith\('Sayaçlar Supabase'\)/);
  assert.match(dkd_patch, /dkd_paragraph\.remove\(\)/);
});

test('Premium Tablet is normalized to Apple iPad PRO in fallback and visible copy', () => {
  assert.match(dkd_patch, /dkd_s01_tablet/);
  assert.match(dkd_patch, /Apple iPad PRO/);
  assert.match(dkd_patch, /replaceAll\('Premium Tablet','Apple iPad PRO'\)/);
});

test('Mira uses an existing safe real portrait instead of the quarantined corrupted payload', () => {
  assert.match(dkd_patch, /dkd_v061SafePortraitPool/);
  assert.match(dkd_patch, /dkd_source !== dkd_v06AvatarMira/);
  assert.match(dkd_patch, /dkd_id === 'dkd_mira'/);
  assert.match(dkd_patch, /alt=\"Mira Kaya\"/);
});

test('all player fleet builds receive the same premium courier model as İlk Motorum without duplicates', () => {
  assert.match(dkd_patch, /dkd_Scene\.prototype\.dkd_buildBike/);
  assert.match(dkd_patch, /dkd_v07PremiumRider\(dkd_scene\)/);
  assert.match(dkd_patch, /getObjectByName\?\.\('dkd_v07_premium_courier_rider'\)/);
  assert.match(dkd_patch, /dkd_allFleetCourier = true/);
});

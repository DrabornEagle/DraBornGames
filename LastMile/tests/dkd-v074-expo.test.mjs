import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_v074 = await dkd_read('game/dkd-v074-expo.mjs');
const dkd_bridge = await dkd_read('game/dkd-v074-bridge-fix.mjs');
const dkd_app = JSON.parse(await dkd_read('app.json'));
const dkd_migration = await dkd_read('supabase/migrations/20260911221000_dkd_lastmile_v074_season_payments.sql');

test('v0.7.4 stays on Android versionCode 1 and Expo Go 57.0.9 candidate', () => {
  assert.equal(dkd_app.expo.version, '0.7.4');
  assert.equal(dkd_app.expo.android.versionCode, 1);
  assert.equal(dkd_app.expo.extra.dkd_expoGoTestVersion, '57.0.9');
  assert.equal(dkd_app.expo.extra.dkd_expoCandidateOnly, true);
  assert.equal(dkd_app.expo.extra.dkd_webPublishedVersion, '0.7.2');
});

test('v0.7.4 registration continuation becomes mandatory seasonal payment flow', () => {
  assert.match(dkd_v074, /SEZONLUK ÖDEMEYİ YAP/);
  assert.match(dkd_v074, /ÖDEMEYİ YAPTIM/);
  assert.match(dkd_v074, /ÖDEMENİZ İNCELENİYOR/);
  assert.match(dkd_v074, /İLK VARDİYANA BAŞLA/);
  assert.match(dkd_v074, /dkd_v074RestrictedPages/);
});

test('v0.7.4 payment UI includes IBAN receipt note and future-season details', () => {
  assert.match(dkd_v074, /IBAN \/ Havale/);
  assert.match(dkd_v074, /dkd-v074-receipt/);
  assert.match(dkd_v074, /Açıklama \/ Not/);
  assert.match(dkd_v074, /Sonraki sezonlar/);
  assert.match(dkd_v074, /KALAN SÜRE/);
});

test('v0.7.4 admin can review payments and edit IBAN and season prices', () => {
  assert.match(dkd_v074, /ÖDEMeler/i);
  assert.match(dkd_v074, /v074-admin-approve/);
  assert.match(dkd_v074, /v074-admin-reject/);
  assert.match(dkd_v074, /IBAN BİLGİSİNİ KAYDET/);
  assert.match(dkd_v074, /v074-admin-option-save/);
  assert.match(dkd_bridge, /dkd_receipt_data/);
});

test('v0.7.4 fixes the 0..1 music level without dividing by 100 again', () => {
  assert.match(dkd_v074, /dkd_clamp\(Number\(dkd_audio\.dkd_state\?\.dkd_settings\?\.dkd_music\) \|\| 0,0,1\)/);
  assert.match(dkd_v074, /dkd_target = dkd_muted \? 0 : Math\.min\(1,dkd_level\*\(dkd_drive\?1:\.82\)\)/);
  assert.doesNotMatch(dkd_v074, /dkd_music\).*\/\s*100/);
});

test('v0.7.4 removes the Taşıma Kontrolü window while keeping capacity validation', () => {
  assert.match(dkd_v074, /\.dkd-v05-capacity-card\{display:none!important\}/);
  assert.match(dkd_v074, /dkd_v05CapacityPopup = function/);
  assert.doesNotMatch(dkd_v074, /TAŞIMA KONTROLÜ/);
});

test('v0.7.4 SQL defines example account four season prices and service-role RPC access', () => {
  assert.match(dkd_migration, /TR00 0000 0000 0000 0000 0000 00/);
  for (const dkd_price of ['499','549','599','649']) assert.match(dkd_migration, new RegExp(dkd_price));
  assert.match(dkd_migration, /dkd_lastmile_season_payments/);
  assert.match(dkd_migration, /dkd_lastmile_admin_payment_review/);
  assert.match(dkd_migration, /grant execute .*service_role/is);
});

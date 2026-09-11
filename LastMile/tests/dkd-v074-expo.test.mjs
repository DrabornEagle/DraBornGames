import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_v074 = await dkd_read('game/dkd-v074-expo.mjs');
const dkd_bridge = await dkd_read('game/dkd-v074-bridge-fix.mjs');
const dkd_polish = await dkd_read('game/dkd-v074-release-polish.mjs');
const dkd_app = JSON.parse(await dkd_read('app.json'));
const dkd_migration = await dkd_read('supabase/migrations/20260911221000_dkd_lastmile_v074_season_payments.sql');
const dkd_publicNoteMigration = await dkd_read('supabase/migrations/20260911224000_dkd_lastmile_v074_public_payment_note.sql');

test('v0.7.4 stays on Android versionCode 1 and Web/Android synchronized release', () => {
  assert.equal(dkd_app.expo.version, '0.7.4');
  assert.equal(dkd_app.expo.android.versionCode, 1);
  assert.equal(dkd_app.expo.extra.dkd_expoGoTestVersion, '57.0.9');
  assert.equal(dkd_app.expo.extra.dkd_expoCandidateOnly, false);
  assert.equal(dkd_app.expo.extra.dkd_webPublishedVersion, '0.7.4');
  assert.equal(dkd_app.expo.extra.dkd_releaseChannel, 'web-and-github-release');
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
  assert.match(dkd_polish, /dkd-v074-receipt-card/);
  assert.match(dkd_polish, /dkd-v074-future-card/);
  assert.match(dkd_polish, /dkd-v074-public-note/);
  assert.doesNotMatch(dkd_polish, /linear-gradient\s*\(/i);
});

test('v0.7.4 admin can review payments and edit IBAN season prices and public note', () => {
  assert.match(dkd_v074, /ÖDEMeler/i);
  assert.match(dkd_v074, /v074-admin-approve/);
  assert.match(dkd_v074, /v074-admin-reject/);
  assert.match(dkd_v074, /IBAN BİLGİSİNİ KAYDET/);
  assert.match(dkd_v074, /v074-admin-option-save/);
  assert.match(dkd_bridge, /dkd_receipt_data/);
  assert.match(dkd_polish, /dkd-v074-account-note/);
  assert.match(dkd_polish, /dkd_public_note/);
  assert.match(dkd_publicNoteMigration, /dkd_public_note/);
});

test('v0.7.4 stabilizes 0..1 music output without frame-by-frame volume oscillation', () => {
  assert.match(dkd_v074, /dkd_clamp\(Number\(dkd_audio\.dkd_state\?\.dkd_settings\?\.dkd_music\) \|\| 0,0,1\)/);
  assert.match(dkd_polish, /dkd_raw > 1 \? dkd_raw \/ 100 : dkd_raw/);
  assert.match(dkd_polish, /dkd_v073ApplyMute = dkd_v074ReleaseAudio/);
  assert.match(dkd_polish, /dkd_v074FixAudio = dkd_v074ReleaseAudio/);
  assert.match(dkd_polish, /> \.015/);
  assert.doesNotMatch(dkd_polish, /dkd_music\).*\/\s*100/);
});

test('v0.7.4 courier uniform selection remains visible with the lighter palette', () => {
  for (const dkd_color of ['#5e8f98','#747bb3','#b67666','#879f69','#aaa09a']) assert.match(dkd_polish, new RegExp(dkd_color));
  assert.match(dkd_polish, /dkd-selected/);
  assert.match(dkd_polish, /uniform:/);
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
  assert.match(dkd_publicNoteMigration, /grant execute .*service_role/is);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_runtime = await readFile(new URL('../game/dkd-v05-live-season-admin.mjs', import.meta.url), 'utf8');
const dkd_build = await readFile(new URL('../scripts/dkd-build-game.mjs', import.meta.url), 'utf8');

test('real Season 01 is active and future seasons each define three gifts', () => {
  assert.match(dkd_runtime, /BÜYÜK FIRTINA/);
  assert.match(dkd_runtime, /iPhone 18 Pro Max/);
  assert.match(dkd_runtime, /MSI Gaming Laptop/);
  assert.match(dkd_runtime, /Premium Tablet/);
  assert.match(dkd_runtime, /PlayStation 5 Pro/);
  assert.match(dkd_runtime, /MacBook Air/);
  assert.match(dkd_runtime, /Steam Deck OLED/);
  assert.match(dkd_runtime, /FİZİKSEL ÖDÜLLER AKTİF/);
  assert.doesNotMatch(dkd_runtime, /Fiziksel ödül hakkı bu geliştirme sürümünde aktif değildir/);
});

test('admin runtime keeps money and special-customer access unlimited', () => {
  assert.match(dkd_runtime, /dkd_wallet !== 99999999/);
  assert.match(dkd_runtime, /dkd_tokens !== 99999999/);
  assert.match(dkd_runtime, /dkd_vipTrust !== 100/);
  assert.match(dkd_runtime, /dkd_adminAllCities/);
  assert.match(dkd_runtime, /replace\(\/99\\\.999\\\.999 TL\/g, '∞ TL'\)/);
  assert.match(dkd_runtime, /∞ TL/);
});

test('home bottom navigation replaces Garage with Messages while hub Garage remains available', () => {
  assert.match(dkd_runtime, /data-dkd-action=\"messages\"/);
  assert.match(dkd_runtime, /<span>Mesajlar<\/span>/);
  assert.match(dkd_runtime, /dkd-home-actions/);
});

test('courier center board is larger and higher', () => {
  assert.match(dkd_runtime, /SON KİLOMETRE \/ KURYE MERKEZİ', 6\.8/);
  assert.match(dkd_runtime, /position\.set\(-4\.25, 5\.18, -6\.67\)/);
  assert.match(dkd_runtime, /dkd_v05_live_courier_center_sign/);
});

test('live season runtime loads after sign layout and before final verification', () => {
  const dkd_signIndex = dkd_build.indexOf("'dkd-v05-sign-layout-hotfix.mjs'");
  const dkd_liveIndex = dkd_build.indexOf("'dkd-v05-live-season-admin.mjs'");
  const dkd_verifyIndex = dkd_build.indexOf("'dkd-v05-live-season-verification.mjs'");
  assert.ok(dkd_signIndex >= 0);
  assert.ok(dkd_liveIndex > dkd_signIndex);
  assert.ok(dkd_verifyIndex > dkd_liveIndex);
});

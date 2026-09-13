import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_patch = await readFile(new URL('../game/dkd-v075-login-test-trigger.mjs', import.meta.url), 'utf8');
const dkd_build = await readFile(new URL('../scripts/dkd-build-game-v07.mjs', import.meta.url), 'utf8');

test('test account offer is moved from intro render to the first login tap', () => {
  assert.match(dkd_patch, /dkd_popupOnFirstLoginTapOnly: true/);
  assert.match(dkd_patch, /dkd_popupOnIntroRender: false/);
  assert.match(dkd_patch, /clearTimeout\(this\.dkd_v075TestEntryTimer\)/);
  assert.match(dkd_patch, /dkd_command === 'v04-login'/);
  assert.match(dkd_patch, /dkd_v075LoginTestSeen\(\)/);
  assert.match(dkd_patch, /dkd_lastmile_v075_test_login_click_seen_1/);
});

test('login trigger keeps the existing icon while receiving colorful animated flat styling', () => {
  assert.match(dkd_patch, /classList\.add\('dkd-v075-login-entry'\)/);
  assert.match(dkd_patch, /\.dkd-v075-login-entry svg/);
  assert.match(dkd_patch, /dkd_loginIconPreserved: true/);
  assert.match(dkd_patch, /@keyframes dkd-v075-login-entry-live/);
  assert.doesNotMatch(dkd_patch, /gradient\(/i);
  assert.doesNotMatch(dkd_patch, /box-shadow|text-shadow/i);
});

test('test sheet uses the requested wording and own-account button continues to the normal login', () => {
  assert.match(dkd_patch, /TEST ET SİPARİŞLER SENİ BEKLİYOR/);
  assert.match(dkd_patch, /Siparişler Seni Bekliyor/);
  assert.match(dkd_patch, /KENDİ HESABIMLA DEVAM ET','v075-test-own-login'/);
  assert.match(dkd_patch, /dkd_command === 'v075-test-own-login'/);
  assert.match(dkd_patch, /call\(this, 'v04-login'\)/);
  assert.match(dkd_patch, /data-dkd-action='v075-test-own-login'/);
});

test('login trigger patch is the final shared Android and Web runtime layer', () => {
  assert.match(dkd_build, /dkd-v075-admin-home-polish\.mjs','dkd-v075-login-test-trigger\.mjs'/);
});

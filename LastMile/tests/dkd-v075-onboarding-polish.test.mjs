import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_patch = await dkd_read('game/dkd-v075-onboarding-polish.mjs');
const dkd_builder = await dkd_read('scripts/dkd-build-game-v07.mjs');
const dkd_app = JSON.parse(await dkd_read('app.json')).expo;

test('v0.7.5 onboarding polish is final in the shared Android and Web game source', () => {
  assert.match(dkd_builder, /dkd-v075-home-identity-polish\.mjs','dkd-v075-onboarding-polish\.mjs'/);
  assert.match(dkd_patch, /dkd_androidWebShared: true/);
});

test('first entry offers the requested one-time test account and automatic login action', () => {
  assert.match(dkd_patch, /TEST ET · ŞEHİR SENİ BEKLİYOR/);
  assert.match(dkd_patch, /lastmile01@gmail\.com/);
  assert.match(dkd_patch, /dkd_password: '111111'/);
  assert.match(dkd_patch, /dkd_lastmile_v075_test_entry_seen_1/);
  assert.match(dkd_patch, /data-dkd-action='v075-test-auto-login'|v075-test-auto-login/);
  assert.match(dkd_patch, /this\.dkd_send\('auth-login'/);
  assert.match(dkd_patch, /dkd_testPopupOnce: true/);
});

test('new company registration page is colorful animated and keeps separate field error treatment', () => {
  assert.match(dkd_patch, /dkd-v075-register-page/);
  assert.match(dkd_patch, /KENDİ ŞİRKETİNİ KUR/);
  assert.match(dkd_patch, /dkd-v075-register-hero/);
  assert.match(dkd_patch, /:has\(\.dkd-v073-invalid\)/);
  assert.match(dkd_patch, /dkd-v073-field-error/);
  assert.match(dkd_patch, /dkd_registerFieldErrorsSeparate: true/);
});

test('player name is anchored immediately above the centered season badge row', () => {
  assert.match(dkd_patch, /\.dkd-home-header \.dkd-player-name,\.dkd-home-header>h1\{position:absolute!important/);
  assert.match(dkd_patch, /top:136px!important/);
  assert.match(dkd_patch, /\.dkd-v075-badge-row\{top:188px!important\}/);
  assert.match(dkd_patch, /dkd_playerNameAboveSeasonBadge: true/);
});

test('navigation transparency remains requested on Android and visual patch uses no forbidden effects', () => {
  assert.equal(dkd_app.androidNavigationBar.backgroundColor, '#00000000');
  assert.equal(dkd_app.androidNavigationBar.enforceContrast, false);
  assert.equal(dkd_app.android.edgeToEdgeEnabled, true);
  assert.equal(dkd_app.extra.dkd_androidNavigationTransparent, true);
  assert.doesNotMatch(dkd_patch, /linear-gradient|radial-gradient|box-shadow|text-shadow/i);
});

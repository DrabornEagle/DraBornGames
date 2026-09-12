import dkd_test from 'node:test';
import dkd_assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs/promises';

const dkd_patch = await dkd_fs.readFile(new URL('../game/dkd-v074-season-payment-ui.mjs', import.meta.url), 'utf8');
const dkd_hotfix = await dkd_fs.readFile(new URL('../game/dkd-v074-season-modal-hotfix.mjs', import.meta.url), 'utf8');
const dkd_refresh = await dkd_fs.readFile(new URL('../game/dkd-v074-payment-refresh-fix.mjs', import.meta.url), 'utf8');
const dkd_builder = await dkd_fs.readFile(new URL('../scripts/dkd-build-game-v07.mjs', import.meta.url), 'utf8');

dkd_test('shared v0.7.4 bundle includes seasonal payment UI, modal and refresh stability fixes', () => {
  dkd_assert.match(dkd_builder, /dkd-v074-reward-copy\.mjs','dkd-v074-season-payment-ui\.mjs','dkd-v074-season-modal-hotfix\.mjs','dkd-v074-payment-refresh-fix\.mjs/);
  dkd_assert.match(dkd_patch, /dkd_rewardNoticePerLogin: true/);
  dkd_assert.match(dkd_patch, /dkd_futureSeasonDetails: true/);
  dkd_assert.match(dkd_patch, /dkd_paymentSelectedPrizeVisible: true/);
  dkd_assert.match(dkd_hotfix, /dkd_seasonRewardsFromVault: true/);
  dkd_assert.match(dkd_hotfix, /dkd_seasonModalRepeatOpen: true/);
  dkd_assert.match(dkd_refresh, /dkd_paymentRefreshStable: true/);
});

dkd_test('reward notice is scoped to login session and reset on logout', () => {
  dkd_assert.match(dkd_patch, /sessionStorage\.getItem/);
  dkd_assert.match(dkd_patch, /sessionStorage\.removeItem/);
  dkd_assert.match(dkd_patch, /v04-logout/);
  dkd_assert.match(dkd_patch, /dkd_pageName === 'v074payment'/);
  dkd_assert.match(dkd_patch, /ACELE ET/);
});

dkd_test('future season details read the same catalog as Reward Vault', () => {
  dkd_assert.match(dkd_hotfix, /dkd_v05LiveSeasonRewards/);
  dkd_assert.match(dkd_hotfix, /PlayStation 5 Pro/);
  dkd_assert.match(dkd_hotfix, /ROG Ally X/);
  dkd_assert.match(dkd_hotfix, /Meta Quest 3S/);
  dkd_assert.match(dkd_hotfix, /MacBook Air/);
  dkd_assert.match(dkd_hotfix, /iPad Pro/);
  dkd_assert.match(dkd_hotfix, /Apple Watch Ultra/);
  dkd_assert.match(dkd_hotfix, /Galaxy S Ultra/);
  dkd_assert.match(dkd_hotfix, /Lenovo Legion Gaming Laptop/);
  dkd_assert.match(dkd_hotfix, /Steam Deck OLED/);
  dkd_assert.match(dkd_hotfix, /Ödül Kasası/);
});

dkd_test('season modal owns its scroll and restores the payment viewport after close', () => {
  dkd_assert.match(dkd_hotfix, /max-height:calc\(100dvh/);
  dkd_assert.match(dkd_hotfix, /dkd_v074SeasonCaptureViewport/);
  dkd_assert.match(dkd_hotfix, /dkd_v074SeasonRestoreViewport/);
  dkd_assert.match(dkd_hotfix, /scrollTop = dkd_saved\.dkd_scrollTop/);
  dkd_assert.match(dkd_hotfix, /window\.dispatchEvent\(new Event\('resize'\)\)/);
  dkd_assert.match(dkd_hotfix, /dkd_game\?\.dkd_root \|\| document\.getElementById\('dkd-ui'\)/);
});

dkd_test('payment enhancements follow the rendered payment DOM after reload redirects', () => {
  dkd_assert.match(dkd_refresh, /querySelector\?\.\('\.dkd-v074-pay'\)/);
  dkd_assert.match(dkd_refresh, /dkd_v074SeasonDecoratePayment\(dkd_game\)/);
  dkd_assert.match(dkd_refresh, /queueMicrotask/);
  dkd_assert.match(dkd_refresh, /requestAnimationFrame/);
  dkd_assert.match(dkd_refresh, /MutationObserver/);
  dkd_assert.match(dkd_refresh, /dkd_paymentDecorationByRenderedDom: true/);
  dkd_assert.match(dkd_refresh, /dkd_futureSeasonRebindAfterRefresh: true/);
});

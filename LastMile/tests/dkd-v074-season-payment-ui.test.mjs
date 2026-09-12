import dkd_test from 'node:test';
import dkd_assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs/promises';

const dkd_patch = await dkd_fs.readFile(new URL('../game/dkd-v074-season-payment-ui.mjs', import.meta.url), 'utf8');
const dkd_builder = await dkd_fs.readFile(new URL('../scripts/dkd-build-game-v07.mjs', import.meta.url), 'utf8');

dkd_test('shared v0.7.4 bundle includes seasonal payment UI after reward copy', () => {
  dkd_assert.match(dkd_builder, /dkd-v074-reward-copy\.mjs','dkd-v074-season-payment-ui\.mjs/);
  dkd_assert.match(dkd_patch, /dkd_rewardNoticePerLogin: true/);
  dkd_assert.match(dkd_patch, /dkd_futureSeasonDetails: true/);
  dkd_assert.match(dkd_patch, /dkd_paymentSelectedPrizeVisible: true/);
});

dkd_test('reward notice is scoped to login session and reset on logout', () => {
  dkd_assert.match(dkd_patch, /sessionStorage\.getItem/);
  dkd_assert.match(dkd_patch, /sessionStorage\.removeItem/);
  dkd_assert.match(dkd_patch, /v04-logout/);
  dkd_assert.match(dkd_patch, /dkd_pageName === 'v074payment'/);
  dkd_assert.match(dkd_patch, /ACELE ET/);
});

dkd_test('payment screen exposes selected prize and clickable future season details', () => {
  dkd_assert.match(dkd_patch, /SEÇTİĞİN BÜYÜK ÖDÜL/);
  dkd_assert.match(dkd_patch, /DETAYLAR \+ BÜYÜK ÖDÜLLER/);
  dkd_assert.match(dkd_patch, /Büyük ödül havuzu/);
  dkd_assert.match(dkd_patch, /dkd_prizes\.map/);
  dkd_assert.match(dkd_patch, /dkd-v074-current-season-card/);
  dkd_assert.match(dkd_patch, /Sonraki sezonların kesin ürün\/model ve stok bilgileri/);
});

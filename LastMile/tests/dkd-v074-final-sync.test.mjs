import dkd_test from 'node:test';
import dkd_assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs/promises';

const dkd_hotfix = await dkd_fs.readFile(new URL('../game/dkd-v074-final-sync.mjs', import.meta.url), 'utf8');
const dkd_builder = await dkd_fs.readFile(new URL('../scripts/dkd-build-game-v07.mjs', import.meta.url), 'utf8');
const dkd_edge = await dkd_fs.readFile(new URL('../supabase/functions/dkd-last-mile-api/index.ts', import.meta.url), 'utf8');
const dkd_termux = await dkd_fs.readFile(new URL('../TERMUX.md', import.meta.url), 'utf8');
const dkd_migration = await dkd_fs.readFile(new URL('../supabase/migrations/20260911231500_dkd_lastmile_v074_payment_submit_repair.sql', import.meta.url), 'utf8');

dkd_test('v0.7.4 final hotfix is part of the shared Android/Web bundle', () => {
  dkd_assert.match(dkd_builder, /dkd-v074-release-polish\.mjs','dkd-v074-final-sync\.mjs/);
  dkd_assert.match(dkd_hotfix, /dkd_adminPaymentsSeparate: true/);
  dkd_assert.match(dkd_hotfix, /dkd_paymentSubmitIsolated: true/);
  dkd_assert.match(dkd_hotfix, /dkd_publicNoteAnimated: true/);
});

dkd_test('visible release normalization targets v0.7.4 and payment errors stay outside shift flow', () => {
  dkd_assert.match(dkd_hotfix, /dkd_v074FinalVersion = 'v0\.7\.4'/);
  dkd_assert.match(dkd_hotfix, /dkd_v05PendingStart = false/);
  dkd_assert.match(dkd_hotfix, /Dekont gönderilemedi/);
  dkd_assert.match(dkd_hotfix, /ödemeniz inceleniyor/);
});

dkd_test('receipt persistence has an explicit path and production API reports v0.7.4', () => {
  dkd_assert.match(dkd_migration, /alter column dkd_receipt_path set default 'database:\/\/receipt'/);
  dkd_assert.match(dkd_migration, /'database:\/\/receipt',left\(\$3,4200000\)/);
  dkd_assert.match(dkd_edge, /const dkd_version = '0\.7\.4'/);
});

dkd_test('Termux guide is current and does not build an APK', () => {
  dkd_assert.match(dkd_termux, /LastMile v0\.7\.4/);
  dkd_assert.match(dkd_termux, /APK\/AAB üretmez/);
  dkd_assert.doesNotMatch(dkd_termux, /LastMile: `v0\.7\.2`/);
});

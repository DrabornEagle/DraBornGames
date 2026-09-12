import dkd_test from 'node:test';
import dkd_assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs/promises';

const dkd_hotfix = await dkd_fs.readFile(new URL('../game/dkd-v074-final-sync.mjs', import.meta.url), 'utf8');
const dkd_builder = await dkd_fs.readFile(new URL('../scripts/dkd-build-game-v07.mjs', import.meta.url), 'utf8');
const dkd_edge = await dkd_fs.readFile(new URL('../supabase/functions/dkd-last-mile-api/index.ts', import.meta.url), 'utf8');
const dkd_termux = await dkd_fs.readFile(new URL('../TERMUX.md', import.meta.url), 'utf8');
const dkd_readme = await dkd_fs.readFile(new URL('../README.md', import.meta.url), 'utf8');
const dkd_migration = await dkd_fs.readFile(new URL('../supabase/migrations/20260911231500_dkd_lastmile_v074_payment_submit_repair.sql', import.meta.url), 'utf8');

dkd_test('v0.7.4 final hotfix is part of the shared Android/Web bundle', () => {
  dkd_assert.match(dkd_builder, /dkd-v074-release-polish\.mjs','dkd-v074-final-sync\.mjs/);
  dkd_assert.match(dkd_hotfix, /dkd_adminPaymentsSeparate: true/);
  dkd_assert.match(dkd_hotfix, /dkd_paymentSubmitIsolated: true/);
  dkd_assert.match(dkd_hotfix, /dkd_publicNoteAnimated: true/);
  dkd_assert.match(dkd_hotfix, /dkd_receiptFullscreen: true/);
  dkd_assert.match(dkd_hotfix, /dkd_rewardNotice: true/);
});

dkd_test('visible release normalization is idempotent at v0.7.4', () => {
  dkd_assert.match(dkd_hotfix, /dkd_v074FinalVersion = 'v0\.7\.4'/);
  dkd_assert.match(dkd_hotfix, /replace\(\/v0\\\.7\(\?:\\\.\\d\+\)\*\/gi, dkd_v074FinalVersion\)/);
  const dkd_normalize = dkd_value => dkd_value.replace(/v0\.7(?:\.\d+)*/gi, 'v0.7.4');
  dkd_assert.equal(dkd_normalize('v0.7.3'), 'v0.7.4');
  dkd_assert.equal(dkd_normalize('v0.7.4'), 'v0.7.4');
  dkd_assert.equal(dkd_normalize('v0.7.4.4'), 'v0.7.4');
});

dkd_test('payment errors stay outside shift flow', () => {
  dkd_assert.match(dkd_hotfix, /dkd_v05PendingStart = false/);
  dkd_assert.match(dkd_hotfix, /Dekont gönderilemedi/);
  dkd_assert.match(dkd_hotfix, /ödemeniz inceleniyor/);
  dkd_assert.match(dkd_hotfix, /'KAPAT','modal-close'/);
  dkd_assert.doesNotMatch(dkd_hotfix, /'KAPAT','close-modal'/);
});

dkd_test('admin receipts open in a dedicated fullscreen viewer', () => {
  dkd_assert.match(dkd_hotfix, /dkd-v074-receipt-open/);
  dkd_assert.match(dkd_hotfix, /v074-receipt-open:/);
  dkd_assert.match(dkd_hotfix, /dkd-v074-receipt-overlay/);
  dkd_assert.match(dkd_hotfix, /Ödeme dekontu tam ekran/);
  dkd_assert.match(dkd_hotfix, /DEKONTU TAM EKRAN AÇ/);
});

dkd_test('new reward selection visit includes the requested seasonal reward notice', () => {
  dkd_assert.match(dkd_hotfix, /SEZON BÜYÜK ÖDÜLÜ/);
  dkd_assert.match(dkd_hotfix, /Oyundaki Görevleri tamamladığında Seçmiş olduğun ödüle/);
  dkd_assert.match(dkd_hotfix, /Ankara içi Elden veya Kargo yoluyla/);
  dkd_assert.match(dkd_hotfix, /Her Sezon Büyük Ödüller Değişiyor/);
  dkd_assert.match(dkd_hotfix, /ACELE ET/);
  dkd_assert.match(dkd_hotfix, /Sezon bitmeden sen oyunu bitir/);
  dkd_assert.match(dkd_hotfix, /dkd_lastmile_reward_notice_v074_/);
  dkd_assert.match(dkd_hotfix, /String\(dkd_page \|\| ''\) === 'choose'/);
});

dkd_test('receipt persistence has an explicit path and current API reports v0.7.5', () => {
  dkd_assert.match(dkd_migration, /alter column dkd_receipt_path set default 'database:\/\/receipt'/);
  dkd_assert.match(dkd_migration, /'database:\/\/receipt',left\(\$3,4200000\)/);
  dkd_assert.match(dkd_edge, /const dkd_version = '0\.7\.5'/);
});

dkd_test('README and Termux guide are current at v0.7.5 and do not build an APK', () => {
  dkd_assert.match(dkd_readme, /Last Mile — v0\.7\.5/);
  dkd_assert.match(dkd_readme, /Android `versionCode 1`/);
  dkd_assert.match(dkd_readme, /APK\/AAB üretmez/);
  dkd_assert.match(dkd_readme, /tam ekran dekont görüntüleyici/);
  dkd_assert.match(dkd_readme, /dkd_lastmile_game_events/);
  dkd_assert.match(dkd_readme, /dkd_lastmile_season_order_stats/);
  dkd_assert.match(dkd_termux, /LastMile v0\.7\.5/);
  dkd_assert.match(dkd_termux, /APK\/AAB üretmez/);
  dkd_assert.match(dkd_termux, /5 saniyede bir sürüş checkpoint/);
  dkd_assert.doesNotMatch(dkd_readme, /Last Mile — v0\.7\.1/);
  dkd_assert.doesNotMatch(dkd_termux, /LastMile: `v0\.7\.2`/);
});

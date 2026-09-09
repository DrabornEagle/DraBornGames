import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_runtime = await readFile(new URL('../game/dkd-v05-live-season-verification.mjs', import.meta.url), 'utf8');
const dkd_build = await readFile(new URL('../scripts/dkd-build-game.mjs', import.meta.url), 'utf8');

test('valid real final is persisted for server verification through cloud save', () => {
  assert.match(dkd_runtime, /dkd_action === 'deliver'/);
  assert.match(dkd_runtime, /dkd_result\?\.dkd_type === 'final'/);
  assert.match(dkd_runtime, /LOCAL_CHECK_PASSED/);
  assert.match(dkd_runtime, /pending_verification/);
  assert.match(dkd_runtime, /this\.dkd_save\(\)/);
});

test('verification page no longer claims server verification or physical rewards are disconnected', () => {
  assert.match(dkd_runtime, /sunucu doğrulama kuyruğuna gönderildi/);
  assert.match(dkd_runtime, /FİNAL SKORU/);
  assert.match(dkd_runtime, /SEÇTİĞİN SEZON ÖDÜLÜ/);
  assert.doesNotMatch(dkd_runtime, /Sunucu doğrulaması bağlı değil/);
  assert.doesNotMatch(dkd_runtime, /Gerçek ödül hakkı oluşmadı/);
  assert.doesNotMatch(dkd_runtime, /Gerçek ödül yarışması etkin değildir/);
});

test('training final never enters the real season verification queue', () => {
  assert.match(dkd_runtime, /dkd_training = this\.dkd_state\?\.dkd_training === true/);
  assert.match(dkd_runtime, /dkd_auditPassed && !dkd_training/);
  assert.match(dkd_runtime, /Yönetici test koşusu gerçek sezon sıralamasına/);
});

test('verification layer is bundled after live season admin runtime', () => {
  const dkd_liveIndex = dkd_build.indexOf("'dkd-v05-live-season-admin.mjs'");
  const dkd_verifyIndex = dkd_build.indexOf("'dkd-v05-live-season-verification.mjs'");
  assert.ok(dkd_liveIndex >= 0);
  assert.ok(dkd_verifyIndex > dkd_liveIndex);
});

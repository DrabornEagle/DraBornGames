import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_patch = await dkd_read('game/dkd-v075-payment-season-hotfix.mjs');
const dkd_wrapper = await dkd_read('scripts/dkd-build-game-v07.mjs');
const dkd_edge = await dkd_read('supabase/functions/dkd-last-mile-api/index.ts');

test('v0.7.5 hotfix is loaded after durable save for Android and Web', () => {
  assert.match(dkd_wrapper, /dkd-v075-durable-save\.mjs','dkd-v075-payment-season-hotfix\.mjs'/);
  assert.match(dkd_patch, /dkd_homeSeasonTotalsMoved:true/);
});

test('home daily shortcut becomes Season while daily tasks remain available elsewhere', () => {
  assert.match(dkd_patch, /\.dkd-home-actions \[data-dkd-action="daily"\]/);
  assert.match(dkd_patch, /dkd_daily\.dataset\.dkdAction = 'v075-season-center'/);
  assert.match(dkd_patch, /<span>Sezon<\/span>/);
  assert.match(dkd_patch, /\.dkd-v075-season-orders/);
  assert.match(dkd_patch, /Günlük görevler Dra Telefon içinden kullanılmaya devam eder/);
});

test('Season Center shows cloud-backed per-season order totals, dates, status and refresh', () => {
  assert.match(dkd_patch, /dkd_v075HotfixSeasonPage/);
  assert.match(dkd_patch, /TOPLAM SİPARİŞ/);
  assert.match(dkd_patch, /dkd_total_orders/);
  assert.match(dkd_patch, /dkd_starts_at/);
  assert.match(dkd_patch, /dkd_ends_at/);
  assert.match(dkd_patch, /v075-season-refresh/);
  assert.match(dkd_patch, /cloud-bootstrap/);
});

test('receipt upload is resized and recompressed before bridge submission', () => {
  assert.match(dkd_patch, /dkd_v075HotfixReceiptData/);
  assert.match(dkd_patch, /1800 \/ Math\.max/);
  assert.match(dkd_patch, /toDataURL\('image\/jpeg'/);
  assert.match(dkd_patch, /dkd_v075HotfixTargetDataChars = 1650000/);
  assert.match(dkd_patch, /dkd_v074_action: 'payment_submit'/);
  assert.match(dkd_patch, /dkd_receipt_data: dkd_receiptData/);
});

test('new Season Center keeps the project visual constraints', () => {
  assert.match(dkd_patch, /@keyframes dkd-v075-center-in/);
  assert.doesNotMatch(dkd_patch, /linear-gradient|radial-gradient|box-shadow|text-shadow/i);
});

test('edge source exposes detailed Last Mile errors rather than an opaque server error', () => {
  assert.doesNotMatch(dkd_edge, /dkd_error instanceof Error \? dkd_error\.message : 'server_error'/);
});

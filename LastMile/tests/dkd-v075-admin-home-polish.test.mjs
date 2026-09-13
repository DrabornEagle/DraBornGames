import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_patch = await dkd_read('game/dkd-v075-admin-home-polish.mjs');
const dkd_builder = await dkd_read('scripts/dkd-build-game-v07.mjs');
const dkd_migration = await dkd_read('supabase/migrations/20260913011622_dkd_lastmile_v075_admin_payment_delete.sql');

test('final shared v0.7.5 layer contains the requested test-entry wording', () => {
  assert.match(dkd_builder, /dkd-v075-onboarding-polish\.mjs','dkd-v075-admin-home-polish\.mjs'/);
  assert.match(dkd_patch, /TEST ET SİPARİŞLER SENİ BEKLİYOR/);
  assert.match(dkd_patch, /Siparişler Seni Bekliyor/);
  assert.match(dkd_patch, /font-size:29px!important/);
});

test('registration is compact colorful and removes inherited spacer gaps', () => {
  assert.match(dkd_patch, /dkd-v075-register-page \.dkd-space\{display:none!important/);
  assert.match(dkd_patch, /counter-reset:dkd-register-field/);
  assert.match(dkd_patch, /dkd-v073-invalid/);
  assert.match(dkd_patch, /dkd-v073-field-error/);
});

test('home badges are enlarged and wallet has modern motion with reduced-motion fallback', () => {
  assert.match(dkd_patch, /dkd-season-pill\{min-height:39px!important/);
  assert.match(dkd_patch, /dkd-profile-pills>span\{min-height:39px!important/);
  assert.match(dkd_patch, /dkd-wallet-pill/);
  assert.match(dkd_patch, /dkd-v075-wallet-live/);
  assert.match(dkd_patch, /prefers-reduced-motion:reduce/);
});

test('payment admin uses collapsible categories and admin-only delete confirmation', () => {
  assert.match(dkd_patch, /<details class=\"dkd-v075-admin-group\"/);
  assert.match(dkd_patch, /Sezon Fiyatları/);
  assert.match(dkd_patch, /Gelen Ödemeler/);
  assert.match(dkd_patch, /v075-admin-payment-delete-confirm/);
  assert.match(dkd_patch, /admin_payment_delete/);
  assert.match(dkd_patch, /Oyuncu hesabı ve oyun kaydı silinmez/);
});

test('Supabase migration limits payment deletion to active Last Mile admins', () => {
  assert.match(dkd_migration, /dkd_lastmile_admin_payment_delete/);
  assert.match(dkd_migration, /from \"Last-Mile\"\.dkd_lastmile_profiles/);
  assert.match(dkd_migration, /dkd_role = 'admin'/);
  assert.match(dkd_migration, /delete from \"Last-Mile\"\.dkd_lastmile_season_payments/);
  assert.match(dkd_migration, /revoke all on function public\.dkd_lastmile_admin_payment_delete/);
  assert.match(dkd_migration, /admin_payment_delete/);
});

test('new visual layer keeps project ban on gradients shadows and glow', () => {
  assert.doesNotMatch(dkd_patch, /linear-gradient|radial-gradient|box-shadow|text-shadow|drop-shadow/i);
});

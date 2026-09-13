import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_patch = await dkd_read('game/dkd-v075-admin-home-polish.mjs');
const dkd_onboarding = await dkd_read('game/dkd-v075-onboarding-polish.mjs');
const dkd_builder = await dkd_read('scripts/dkd-build-game-v07.mjs');
const dkd_migration = await dkd_read('supabase/migrations/20260913011622_dkd_lastmile_v075_admin_payment_delete.sql');

test('final shared v0.7.5 layer contains the requested test-entry wording', () => {
  assert.match(dkd_builder, /dkd-v075-onboarding-polish\.mjs','dkd-v075-admin-home-polish\.mjs'/);
  assert.match(dkd_patch, /TEST ET SİPARİŞLER SENİ BEKLİYOR/);
  assert.match(dkd_patch, /Siparişler Seni Bekliyor/);
  assert.match(dkd_patch, /font-size:29px!important/);
});

test('registration returns to the previous onboarding design and only collapses spacer blocks', () => {
  assert.match(dkd_onboarding, /Registration: modern, colorful, readable flat cards/);
  assert.match(dkd_onboarding, /dkd-v075-register-page \.dkd-field/);
  assert.match(dkd_patch, /form>\.dkd-space\{height:0!important;min-height:0!important;margin:0!important;padding:0!important\}/);
  assert.doesNotMatch(dkd_patch, /counter-reset:dkd-register-field/);
  assert.doesNotMatch(dkd_patch, /dkd-register-field,decimal-leading-zero/);
  assert.match(dkd_patch, /dkd_registrationUsesPreviousDesign: true/);
});

test('home badges stay enlarged while the wallet has no visual override in the final patch', () => {
  assert.match(dkd_patch, /dkd-season-pill\{min-height:39px!important/);
  assert.match(dkd_patch, /dkd-profile-pills>span\{min-height:39px!important/);
  assert.match(dkd_patch, /Wallet intentionally has no v0\.7\.5 override here/);
  assert.doesNotMatch(dkd_patch, /dkd-v075-wallet-live|dkd-v075-wallet-meter|CÜZDAN';position:absolute/);
  assert.match(dkd_patch, /dkd_walletUsesPreviousDesign: true/);
});

test('payment admin uses collapsible categories and admin-only delete confirmation', () => {
  assert.match(dkd_patch, /<details class="dkd-v075-admin-group"/);
  assert.match(dkd_patch, /Sezon Fiyatları/);
  assert.match(dkd_patch, /Gelen Ödemeler/);
  assert.match(dkd_patch, /v075-admin-payment-delete-confirm/);
  assert.match(dkd_patch, /admin_payment_delete/);
  assert.match(dkd_patch, /Oyuncu hesabı ve oyun kaydı silinmez/);
});

test('payment receipt preview supports database data URLs and restores fullscreen viewer', () => {
  assert.match(dkd_patch, /dkd_receipt_url \|\| dkd_payment\?\.dkd_receipt_data/);
  assert.match(dkd_patch, /dkd-v074-receipt-open/);
  assert.match(dkd_patch, /DEKONTU TAM EKRAN AÇ/);
  assert.match(dkd_patch, /v075-receipt-open/);
  assert.match(dkd_patch, /dkd_v074FinalOpenReceipt/);
});

test('Supabase migration limits payment deletion to active Last Mile admins', () => {
  assert.match(dkd_migration, /dkd_lastmile_admin_payment_delete/);
  assert.match(dkd_migration, /from "Last-Mile"\.dkd_lastmile_profiles/);
  assert.match(dkd_migration, /dkd_role = 'admin'/);
  assert.match(dkd_migration, /delete from "Last-Mile"\.dkd_lastmile_season_payments/);
  assert.match(dkd_migration, /revoke all on function public\.dkd_lastmile_admin_payment_delete/);
});

test('new follow-up visual layer keeps project ban on gradients shadows and glow', () => {
  assert.doesNotMatch(dkd_patch, /linear-gradient|radial-gradient|box-shadow|text-shadow|drop-shadow/i);
});

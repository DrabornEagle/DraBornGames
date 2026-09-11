import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_v073 = await dkd_read('game/dkd-v073-expo.mjs');
const dkd_wrapper = await dkd_read('scripts/dkd-build-game-v07.mjs');
const dkd_edge = await dkd_read('supabase/functions/dkd-last-mile-api/index.ts');
const dkd_plateMigration = await dkd_read('supabase/migrations/20260911174200_dkd_lastmile_v073_plate_bootstrap_fix.sql');

test('v0.7.3 replaces destructive career delete with session logout', () => {
  assert.match(dkd_v073, /KARİYER KAYDINI SİL/);
  assert.match(dkd_v073, /OTURUMU KAPAT/);
  assert.match(dkd_v073, /v04-logout/);
});

test('v0.7.3 hides Test Laboratory unless cloud/admin role is active', () => {
  assert.match(dkd_v073, /dkd_v073IsAdmin/);
  assert.match(dkd_v073, /dkd_v04IsAdmin === true/);
  assert.match(dkd_v073, /dkd_role === 'admin'/);
  assert.match(dkd_v073, /Test laboratuvarı/);
});

test('v0.7.3 registration identifies each invalid field with prominent inline guidance', () => {
  for (const dkd_name of ['dkd_full_name','dkd_username','dkd_phone','dkd_company_name','dkd_plate_no','dkd_email','dkd_password']) {
    assert.match(dkd_v073, new RegExp(dkd_name));
  }
  assert.match(dkd_v073, /Kayıt tamamlanmadı/);
  assert.match(dkd_v073, /Hatalı alanlar:/);
  assert.match(dkd_v073, /06 ABC 123/);
  assert.match(dkd_v073, /dkd-v073-form-alert/);
  assert.match(dkd_v073, /aria-invalid/);
  assert.match(dkd_v073, /stopImmediatePropagation/);
  assert.match(dkd_v073, /already registered/);
});

test('v0.7.3 isolates bootstrap errors from shift-start garage modal and offers reconnect', () => {
  assert.match(dkd_v073, /dkd_isBootstrapFailure/);
  assert.match(dkd_v073, /dkd_v04CloudReady !== true/);
  assert.match(dkd_v073, /dkd-v073-cloud-retry/);
  assert.match(dkd_v073, /bu hata vardiyayla ilgili değil/);
});

test('v0.7.3 drive camera button cycles near chase high without leaving shift', () => {
  assert.match(dkd_v073, /\['near', 'chase', 'high'\]/);
  assert.match(dkd_v073, /dkd-v073-camera-cycle/);
  assert.match(dkd_v073, /dkd_cameraSnap = true/);
  assert.doesNotMatch(dkd_v073, /dkd_render\('drive'\)/);
});

test('v0.7.3 drive tools share one modern flat control system', () => {
  assert.match(dkd_v073, /dkd-icon-btn dkd-v073-tool/);
  assert.match(dkd_v073, /data-dkd-action='horn'/);
  assert.match(dkd_v073, /data-dkd-action='drive-phone'/);
  assert.match(dkd_v073, /border-radius:18px/);
  assert.doesNotMatch(dkd_v073, /linear-gradient|radial-gradient|box-shadow|text-shadow/i);
});

test('v0.7.3 drive music button toggles complete game audio', () => {
  assert.match(dkd_v073, /dkd-v073-audio-toggle/);
  assert.match(dkd_v073, /dkd_v073UserMuted/);
  assert.match(dkd_v073, /dkd_master\.gain/);
  assert.match(dkd_v073, /dkd_v05MediaPlayers/);
  assert.match(dkd_v073, /Oyun sesleri kapatıldı/);
  assert.match(dkd_v073, /Oyun sesleri açıldı/);
});

test('v0.7.3 plate bootstrap uses public RPC instead of direct non-exposed schema REST', () => {
  assert.match(dkd_edge, /const dkd_version = '0\.7\.3'/);
  assert.match(dkd_edge, /rpc\('dkd_lastmile_set_plate'/);
  assert.doesNotMatch(dkd_edge, /schema\('Last-Mile'\)\.from\('dkd_lastmile_profiles'\)/);
  assert.match(dkd_plateMigration, /function public\.dkd_lastmile_set_plate/);
  assert.match(dkd_plateMigration, /grant execute .* service_role/i);
});

test('v0.7.3 runtime remains intact beneath the v0.7.4 Expo test layer', () => {
  assert.match(dkd_wrapper, /dkd-v072-hotfix\.mjs','dkd-v073-expo\.mjs','dkd-v074-expo\.mjs','dkd-v074-bridge-fix\.mjs/);
  assert.match(dkd_wrapper, /v0\.7\.4/);
  assert.match(dkd_v073, /dkd_webPublished: false/);
});

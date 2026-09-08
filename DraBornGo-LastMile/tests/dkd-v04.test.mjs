import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const dkd_read = dkd_path => fs.readFileSync(new URL(`../${dkd_path}`, import.meta.url), 'utf8');

const dkd_app = dkd_read('App.tsx');
const dkd_runtime = dkd_read('game/dkd-v04-runtime.mjs');
const dkd_build = dkd_read('scripts/dkd-build-game.mjs');
const dkd_edge = dkd_read('supabase/functions/dkd-last-mile-api/index.ts');

test('v0.4 mobile client only contains a publishable Supabase key', () => {
  assert.match(dkd_app, /sb_publishable_/);
  assert.doesNotMatch(dkd_app, /service_role|sb_secret_/i);
  assert.match(dkd_app, /dkd-last-mile-api/);
});

test('normal email login and signup are available without an admin gate', () => {
  assert.match(dkd_app, /\/auth\/v1\/signup/);
  assert.match(dkd_app, /dkd_full_name/);
  assert.match(dkd_app, /dkd_company_name/);
  assert.match(dkd_runtime, /GİRİŞ YAP/);
  assert.match(dkd_runtime, /ŞİRKETİNİ KUR \/ KAYIT OL/);
  assert.match(dkd_runtime, /name="dkd_email"/);
  assert.match(dkd_runtime, /name="dkd_password"/);
  assert.doesNotMatch(dkd_runtime, /Yönetici girişi|YÖNETİCİ ÖNİZLEMESİ/);
});

test('admin role is automatic and demo toggle stays admin-only and personal', () => {
  assert.match(dkd_edge, /last_mile_role/);
  assert.match(dkd_edge, /dkd_role !== 'admin'/);
  assert.match(dkd_edge, /dkd_lastmile_toggle_demo/);
  assert.match(dkd_runtime, /Yönetici yetkisi otomatik aktif/);
  assert.match(dkd_runtime, /yalnızca bu yönetici hesabına/);
});

test('v0.4 real clock replaces fixed phone time', () => {
  assert.doesNotMatch(dkd_runtime, /23:42/);
  assert.match(dkd_runtime, /toLocaleTimeString\('tr-TR'/);
  assert.match(dkd_runtime, /dkd-v04-clock/);
});

test('v0.4 server jobs are available to authenticated player sessions', () => {
  assert.match(dkd_runtime, /cloud-claim-jobs/);
  assert.match(dkd_runtime, /cloud-accept-job/);
  assert.match(dkd_runtime, /cloud-cancel-job/);
  assert.match(dkd_runtime, /cloud-complete-job/);
  assert.match(dkd_app, /accept_job/);
  assert.match(dkd_app, /cancel_job/);
  assert.match(dkd_edge, /dkd_lastmile_ensure_profile/);
  assert.doesNotMatch(dkd_edge, /if \(String\(dkd_user\.app_metadata\?\./);
});

test('settings rely on Supabase and keep only the how-to action from backup controls', () => {
  const dkd_settingsStart = dkd_runtime.indexOf('dkd_Game.prototype.dkd_view_settings');
  const dkd_privacyStart = dkd_runtime.indexOf('dkd_Game.prototype.dkd_view_privacy');
  const dkd_settings = dkd_runtime.slice(dkd_settingsStart, dkd_privacyStart);
  assert.match(dkd_settings, /NASIL OYNANIR/);
  assert.doesNotMatch(dkd_settings, /KAYDI DIŞA AKTAR|YEDEKTEN GERİ YÜKLE/);
});

test('menu and drive music have isolated buses and old voices are stopped on mode switch', () => {
  assert.match(dkd_runtime, /dkd_v04MenuMusic/);
  assert.match(dkd_runtime, /dkd_v04DriveMusic/);
  assert.match(dkd_runtime, /dkd_v04StopMusicVoices/);
  assert.match(dkd_runtime, /dkd_v04Mode/);
  assert.match(dkd_runtime, /\.125/);
  assert.match(dkd_runtime, /\.32/);
});

test('delivery button has a vivid animated v0.4 treatment without gradients or glow', () => {
  assert.match(dkd_runtime, /dkd-v04-deliver-pulse/);
  assert.match(dkd_runtime, /#dkd-deliver \.dkd-button/);
  assert.doesNotMatch(dkd_runtime, /linear-gradient|radial-gradient|box-shadow/);
});

test('build loads v0.4 runtime last and scrubs legacy demo rankings', () => {
  const dkd_runtimeIndex = dkd_build.indexOf("'dkd-v04-runtime.mjs'");
  const dkd_modelIndex = dkd_build.indexOf("'dkd-v03-reuploaded-model.mjs'");
  assert.ok(dkd_runtimeIndex > dkd_modelIndex);
  assert.match(dkd_build, /dkd_demoRankings = \[\]/);
  assert.match(dkd_build, /v0\.4/);
});

test('edge function only calls the dkd_lastmile RPC namespace', () => {
  assert.match(dkd_edge, /dkd_lastmile_bootstrap/);
  assert.match(dkd_edge, /dkd_lastmile_ensure_profile/);
  assert.match(dkd_edge, /dkd_lastmile_claim_job/);
  assert.match(dkd_edge, /dkd_lastmile_accept_job/);
  assert.match(dkd_edge, /dkd_lastmile_cancel_job/);
  assert.match(dkd_edge, /dkd_lastmile_complete_job/);
  assert.match(dkd_edge, /dkd_lastmile_toggle_demo/);
  assert.doesNotMatch(dkd_edge, /dkd_last_mile_/);
});

test('generated game bundle contains no legacy fake leaderboard names', () => {
  const dkd_generated = dkd_read('assets/dkd-lastmile.html');
  for (const dkd_name of ['GECEYOLCUSU','KARTAL07','HIZLIKURT','YILDIZ06','YAĞMURCU']) {
    assert.doesNotMatch(dkd_generated, new RegExp(dkd_name));
  }
});

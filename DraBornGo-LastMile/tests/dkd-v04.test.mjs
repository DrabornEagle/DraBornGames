import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const dkd_read = dkd_path => fs.readFileSync(new URL(`../${dkd_path}`, import.meta.url), 'utf8');

const dkd_app = dkd_read('App.tsx');
const dkd_runtime = dkd_read('game/dkd-v04-runtime.mjs');
const dkd_realCareer = dkd_read('game/dkd-v04-real-career.mjs');
const dkd_polish = dkd_read('game/dkd-v04-ui-audio-polish.mjs');
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

test('settings rely on cloud save and keep only the how-to action from backup controls', () => {
  const dkd_settingsStart = dkd_runtime.indexOf('dkd_Game.prototype.dkd_view_settings = function');
  const dkd_privacyStart = dkd_runtime.indexOf('dkd_Game.prototype.dkd_view_privacy = function');
  assert.ok(dkd_settingsStart >= 0 && dkd_privacyStart > dkd_settingsStart);
  const dkd_settings = dkd_runtime.slice(dkd_settingsStart, dkd_privacyStart);
  assert.match(dkd_settings, /NASIL OYNANIR/);
  assert.doesNotMatch(dkd_settings, /KAYDI DIŞA AKTAR|YEDEKTEN GERİ YÜKLE/);
});

test('normal account card hides Supabase and mission-template implementation details', () => {
  const dkd_settingsStart = dkd_realCareer.indexOf('dkd_Game.prototype.dkd_view_settings = function');
  assert.ok(dkd_settingsStart >= 0);
  const dkd_settings = dkd_realCareer.slice(dkd_settingsStart);
  assert.match(dkd_settings, /Hesabın aktif/);
  assert.match(dkd_settings, /Kariyerin otomatik kaydedilir/);
  assert.doesNotMatch(dkd_settings, /22 gerçek görev|görev şablonu|Supabase/);
});

test('signup photo selection stays on registration and preserves form state', () => {
  assert.match(dkd_realCareer, /dkd_payload\?\.dkd_type === 'photo' && dkd_registerForm/);
  assert.match(dkd_realCareer, /this\.dkd_pendingPhoto = dkd_payload\.dkd_data/);
  assert.match(dkd_realCareer, /Kayıt bilgilerin korunuyor/);
  assert.match(dkd_realCareer, /dkd_logged_out !== true/);
  assert.match(dkd_realCareer, /\(dkd_registerForm \|\| dkd_loginForm\)/);
});

test('normal players skip legacy tutorial and paid trial-career gates', () => {
  assert.match(dkd_realCareer, /dkd_fullCareer = true/);
  assert.match(dkd_realCareer, /dkd_career\.dkd_tutorial = true/);
  assert.match(dkd_realCareer, /v04-real-career-start/);
  assert.match(dkd_realCareer, /Gerçek sipariş havuzundan iş seç/);
  assert.match(dkd_realCareer, /BİR SİPARİŞ DAHA/);
});

test('real order detail and result use server delivery-point fields instead of synthetic review avatars', () => {
  const dkd_orderStart = dkd_realCareer.indexOf('dkd_Game.prototype.dkd_view_order = function');
  const dkd_messagesStart = dkd_realCareer.indexOf('dkd_Game.prototype.dkd_view_messages = function');
  const dkd_orderView = dkd_realCareer.slice(dkd_orderStart, dkd_messagesStart);
  assert.match(dkd_orderView, /dkd_cloudCustomerName/);
  assert.match(dkd_orderView, /dkd_cloudCustomerRole/);
  assert.match(dkd_orderView, /dkd_cloudCustomerNote/);
  const dkd_resultStart = dkd_realCareer.indexOf('dkd_Game.prototype.dkd_view_result = function');
  const dkd_verificationStart = dkd_realCareer.indexOf('dkd_Game.prototype.dkd_view_verification = function');
  const dkd_resultView = dkd_realCareer.slice(dkd_resultStart, dkd_verificationStart);
  assert.match(dkd_resultView, /dkd_cloudCustomerName/);
  assert.doesNotMatch(dkd_resultView, /dkd_avatar|dkd_result\.dkd_review/);
});

test('company identity has animated colorful flat-design components', () => {
  assert.match(dkd_realCareer, /dkd-v04-brand-hero/);
  assert.match(dkd_realCareer, /dkd-v04-brand-emblems/);
  assert.match(dkd_realCareer, /dkd-v04-brand-preview/);
  assert.match(dkd_realCareer, /dkd-v04-brand-float/);
  assert.doesNotMatch(dkd_realCareer, /linear-gradient|radial-gradient|box-shadow/);
});

test('delivery button is moved higher above mobile controls', () => {
  assert.match(dkd_polish, /#dkd-deliver\{bottom:280px!important/);
  assert.match(dkd_polish, /max-height:760px\)\{#dkd-deliver\{bottom:250px!important/);
});

test('order cards and real-order details show customer profile avatars', () => {
  assert.match(dkd_polish, /dkd-v04-order-customer/);
  assert.match(dkd_polish, /dkd_v04PolishCustomerAvatar\(dkd_order\)/);
  assert.match(dkd_polish, /dkd_avatar\(dkd_customerId/);
  assert.match(dkd_polish, /dkd_cloudCustomerName/);
});

test('messages are populated from current real order notes and refresh with cloud jobs', () => {
  assert.match(dkd_polish, /dkd_v04PolishVisibleOrders/);
  assert.match(dkd_polish, /dkd_cloudCustomerNote/);
  assert.match(dkd_polish, /Sipariş mesajları yükleniyor/);
  assert.match(dkd_polish, /dkd_payload\?\.dkd_type === 'cloud-jobs' && this\.dkd_pageName === 'messages'/);
  assert.doesNotMatch(dkd_polish, /sahte konuşma|hazır karakter/i);
});

test('home level and rating badges are spaced lower under the player name', () => {
  assert.match(dkd_polish, /\.dkd-home-header \.dkd-profile-pills\{margin-top:24px!important\}/);
});

test('drive music uses a louder new 124 bpm-style pulse while keeping separate buses', () => {
  assert.match(dkd_polish, /dkd_driveVolume = Math\.min\(1\.35, dkd_setting \* 1\.55\)/);
  assert.match(dkd_polish, /drive-polish/);
  assert.match(dkd_polish, /dkd_v04StopMusicVoices/);
  assert.match(dkd_polish, /\.121/);
  assert.match(dkd_polish, /\[0,4,8,12\]/);
  assert.doesNotMatch(dkd_polish, /linear-gradient|radial-gradient|box-shadow/);
});

test('normal-facing real-career pages remove legacy trial language', () => {
  assert.match(dkd_realCareer, /KARİYER AKTİF/);
  assert.match(dkd_realCareer, /Gerçek siparişler · Çevrimiçi kariyer/);
  assert.match(dkd_realCareer, /Hazır yazılmış sahte konuşmalar gösterilmez/);
  assert.match(dkd_realCareer, /Final puanlaması/);
  assert.doesNotMatch(dkd_realCareer, /DENEME KARİYERİNİ AÇ|Deneme kariyeri|ÜCRETSİZ/);
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

test('build loads UI audio polish after real-career cleanup and scrubs legacy demo rankings', () => {
  const dkd_runtimeIndex = dkd_build.indexOf("'dkd-v04-runtime.mjs'");
  const dkd_realCareerIndex = dkd_build.indexOf("'dkd-v04-real-career.mjs'");
  const dkd_polishIndex = dkd_build.indexOf("'dkd-v04-ui-audio-polish.mjs'");
  const dkd_modelIndex = dkd_build.indexOf("'dkd-v03-reuploaded-model.mjs'");
  assert.ok(dkd_runtimeIndex > dkd_modelIndex);
  assert.ok(dkd_realCareerIndex > dkd_runtimeIndex);
  assert.ok(dkd_polishIndex > dkd_realCareerIndex);
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

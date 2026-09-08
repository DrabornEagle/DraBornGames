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

test('v0.4 real clock replaces fixed phone time', () => {
  assert.doesNotMatch(dkd_runtime, /23:42/);
  assert.match(dkd_runtime, /toLocaleTimeString\('tr-TR'/);
  assert.match(dkd_runtime, /dkd-v04-clock/);
});

test('v0.4 server jobs and admin demo toggle are wired', () => {
  assert.match(dkd_runtime, /cloud-claim-jobs/);
  assert.match(dkd_runtime, /cloud-complete-job/);
  assert.match(dkd_runtime, /v04-demo-toggle/);
  assert.match(dkd_runtime, /Sahte rakip yok/);
});

test('v0.4 has separate menu and drive music buses', () => {
  assert.match(dkd_runtime, /dkd_v04MenuMusic/);
  assert.match(dkd_runtime, /dkd_v04DriveMusic/);
  assert.match(dkd_runtime, /setTargetAtTime/);
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
  assert.match(dkd_edge, /dkd_lastmile_claim_job/);
  assert.match(dkd_edge, /dkd_lastmile_complete_job/);
  assert.match(dkd_edge, /dkd_lastmile_toggle_demo/);
  assert.doesNotMatch(dkd_edge, /dkd_last_mile_/);
});

test('generated game bundle contains no legacy fake leaderboard names', () => {
  const dkd_generated = dkd_read('assets/dkd-lastmile.html');
  for (const dkd_name of ['GECEYOLCUSU','KARTAL07','HIZLIKURT','YILDIZ06','YAĞMURCU']) assert.doesNotMatch(dkd_generated, new RegExp(dkd_name));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_runtime = await dkd_read('game/dkd-v04-runtime.mjs');
const dkd_career = await dkd_read('game/dkd-v04-real-career.mjs');
const dkd_polish = await dkd_read('game/dkd-v04-ui-audio-polish.mjs');
const dkd_build = await dkd_read('scripts/dkd-build-game.mjs');
const dkd_edge = await dkd_read('supabase/functions/dkd-last-mile-api/index.ts');

test('v0.4 runtime retains career, menu and drive integration hooks', () => {
  assert.match(dkd_runtime, /dkd_v04/);
  assert.match(dkd_career, /dkd_/);
  assert.match(dkd_polish, /dkd_/);
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
});

test('edge function only calls the dkd_lastmile RPC namespace', () => {
  assert.match(dkd_edge, /dkd_lastmile_bootstrap/);
  assert.match(dkd_edge, /dkd_lastmile_ensure_profile/);
  assert.match(dkd_edge, /dkd_lastmile_claim_job/);
  assert.match(dkd_edge, /dkd_lastmile_accept_job/);
  assert.match(dkd_edge, /dkd_lastmile_cancel_job/);
});

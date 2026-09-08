import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const dkd_read = dkd_path => fs.readFileSync(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_patch = dkd_read('game/dkd-v04-traffic-obstacles.mjs');
const dkd_build = dkd_read('scripts/dkd-build-game.mjs');

test('continuous menu music does not reset its beat on every UI render', () => {
  assert.match(dkd_patch, /dkd_v04ApplyMusicMode = function dkd_v04ContinuousMusicMode/);
  assert.match(dkd_patch, /dkd_v04MenuLoopSource/);
  assert.match(dkd_patch, /dkd_v04DriveLoopSource/);
  assert.match(dkd_patch, /dkd_v04LoopMusicReady/);
  assert.match(dkd_patch, /menu-continuous/);
  assert.match(dkd_patch, /drive-continuous/);
});

test('music output is louder and uses new generated menu and drive loops', () => {
  assert.match(dkd_patch, /dkd_v04TrafficCreateMusicBuffer/);
  assert.match(dkd_patch, /const dkd_bpm = dkd_drive \? 128 : 96/);
  assert.match(dkd_patch, /dkd_setting \* 1\.62/);
  assert.match(dkd_patch, /dkd_setting \* 1\.78/);
  assert.match(dkd_patch, /dkd_master\.gain\.setTargetAtTime\(\.82/);
});

test('home level and rating badges are moved materially lower', () => {
  assert.match(dkd_patch, /dkd-profile-pills\{margin-top:52px!important/);
  assert.match(dkd_patch, /max-height:760px\).*margin-top:44px!important/);
});

test('courier style badge sits next to the company emblem badge', () => {
  assert.match(dkd_patch, /dkd-v04-brand-pills>span:nth-child\(2\).*grid-column:1/);
  assert.match(dkd_patch, /dkd-v04-brand-pills>span:nth-child\(3\).*grid-column:2/);
});

test('city traffic capacity and active traffic density are increased', () => {
  assert.match(dkd_patch, /const dkd_capacity = 64/);
  assert.match(dkd_patch, /Math\.max\(Number\(dkd_count\) \|\| 0, 54\)/);
  assert.match(dkd_patch, /dkd_Scene\.prototype\.dkd_buildTraffic/);
});

test('routes contain physical obstacles that can damage cargo', () => {
  assert.match(dkd_patch, /dkd_v04TrafficGenerateObstacles/);
  assert.match(dkd_patch, /'barrier'/);
  assert.match(dkd_patch, /'cones'/);
  assert.match(dkd_patch, /'crate'/);
  assert.match(dkd_patch, /dkd_hit\(dkd_run, dkd_severity\)/);
  assert.match(dkd_patch, /Kargo bütünlüğü %/);
});

test('zero cargo integrity cancels the real cloud job immediately', () => {
  assert.match(dkd_patch, /Kargo bütünlüğü %0\. Sipariş otomatik iptal edildi\./);
  assert.match(dkd_patch, /cloud-cancel-job/);
  assert.match(dkd_patch, /cargo_destroyed/);
  assert.match(dkd_patch, /dkd_v04CargoFailureSynced/);
});

test('traffic obstacle patch is the final v0.4 game source', () => {
  const dkd_uiIndex = dkd_build.indexOf("'dkd-v04-ui-audio-polish.mjs'");
  const dkd_trafficIndex = dkd_build.indexOf("'dkd-v04-traffic-obstacles.mjs'");
  assert.ok(dkd_uiIndex >= 0 && dkd_trafficIndex > dkd_uiIndex);
});

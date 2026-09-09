import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const dkd_read = dkd_path => fs.readFileSync(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_patch = dkd_read('game/dkd-v05-city-audio-sign-hotfix.mjs');
const dkd_build = dkd_read('scripts/dkd-build-game.mjs');

test('company sign is pinned to the far screen-left side after every hub rebuild', () => {
  assert.match(dkd_patch, /dkd_companySign\.position\.x = -6\.25/);
  assert.match(dkd_patch, /dkd_Scene\.prototype\.dkd_buildHub/);
  assert.match(dkd_patch, /dkd_Scene\.prototype\.dkd_refreshBrand/);
});

test('menu and driving MP3 players are mutually exclusive', () => {
  assert.match(dkd_patch, /Menu and driving music must never overlap/);
  assert.match(dkd_patch, /dkd_player\.pause\(\)/);
  assert.match(dkd_patch, /dkd_player\.volume = 0/);
  assert.match(dkd_patch, /dkd_v05MediaFadeToken/);
  assert.match(dkd_patch, /dkd_v05RoadAudioChooseDrive/);
  assert.match(dkd_patch, /dkd_v05RoadAudioMenuIndex/);
});

test('roadside city layer adds dense trees and urban furniture', () => {
  assert.match(dkd_patch, /dkd_trunks\.length >= 1100/);
  assert.match(dkd_patch, /18 \+ dkd_random\(\) \* 10/);
  for (const dkd_token of ['dkd_benchSeats','dkd_bins','dkd_bollards','dkd_shelterRoofs','dkd_adBoards','dkd_extraLampPoles']) {
    assert.match(dkd_patch, new RegExp(dkd_token));
  }
  assert.match(dkd_patch, /dkd_v05CityDetailCounts/);
});

test('city audio sign layer stays before road-edge safety and v0.6 final runtime', () => {
  const dkd_city = dkd_build.indexOf("'dkd-v05-city-audio-sign-hotfix.mjs'");
  const dkd_previous = dkd_build.indexOf("'dkd-v05-roadwork-audio-hotfix.mjs'");
  const dkd_final = dkd_build.indexOf("'dkd-v05-palm-roadedge-hotfix.mjs'");
  const dkd_v06 = dkd_build.indexOf("'dkd-v06-release.mjs'");
  assert.ok(dkd_city > dkd_previous);
  assert.ok(dkd_final > dkd_city);
  assert.ok(dkd_v06 > dkd_final);
  assert.match(dkd_build, /MP3 ses ayrımı/);
  assert.match(dkd_build, /Supabase native köprü/);
});

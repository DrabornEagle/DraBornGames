import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const dkd_read = dkd_path => fs.readFileSync(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_style = dkd_read('game/dkd-v05-style.mjs');
const dkd_audio = dkd_read('game/dkd-v05-audio.mjs');
const dkd_traffic = dkd_read('game/dkd-v05-traffic.mjs');
const dkd_vault = dkd_read('game/dkd-v05-vault.mjs');
const dkd_patch = [dkd_style, dkd_audio, dkd_traffic, dkd_vault].join('\n');
const dkd_build = dkd_read('scripts/dkd-build-game.mjs');
const dkd_package = JSON.parse(dkd_read('package.json'));
const dkd_app = JSON.parse(dkd_read('app.json'));

test('v0.6.1 is active while the v0.5 runtime layer remains bundled', () => {
  assert.equal(dkd_package.version, '0.6.1');
  assert.equal(dkd_app.expo.version, '0.6.1');
  assert.equal(dkd_app.expo.android.versionCode, 601);
  assert.equal(dkd_app.expo.extra.dkd_versionLabel, 'v0.6.1');
  assert.match(dkd_build, /dkd_version = 'v0\.6\.1'/);
  assert.match(dkd_build, /SON KİLOMETRE · v0\.6\.1/);
  assert.match(dkd_build, /dkd-v05-style\.mjs/);
  assert.match(dkd_build, /dkd-v06-release\.mjs/);
  assert.match(dkd_build, /dkd-v061-release\.mjs/);
});

test('brand identity pills are forced into one compact row', () => {
  assert.match(dkd_patch, /\.dkd-v04-brand-pills\{display:flex!important;flex-wrap:nowrap!important/);
  assert.match(dkd_patch, /\.dkd-v04-brand-pills>span\{grid-column:auto!important/);
});

test('player full name moves down directly above level and rating badges', () => {
  assert.match(dkd_patch, /\.dkd-player-name\{margin:72px 0 8px!important\}/);
  assert.match(dkd_patch, /\.dkd-home-header \.dkd-profile-pills\{margin-top:10px!important/);
});

test('music page has eight distinct selectable tracks and track clicks switch buffers', () => {
  assert.match(dkd_patch, /const dkd_v05Tracks = \[/);
  assert.equal((dkd_patch.match(/dkd_name:/g) || []).length >= 8, true);
  assert.match(dkd_patch, /dkd_v05SwitchTrack/);
  assert.match(dkd_patch, /dkd_text\.startsWith\('track:'\)/);
  assert.match(dkd_patch, /Müzik değişti/);
  assert.match(dkd_patch, /Kızılay Rush/);
  assert.match(dkd_patch, /Sabaha Karşı/);
});

test('every shift selects a different driving track', () => {
  assert.match(dkd_patch, /dkd_Game\.prototype\.dkd_startRun = function dkd_v05StartRun/);
  assert.match(dkd_patch, /if \(dkd_nextTrack === dkd_previousTrack\)/);
  assert.match(dkd_patch, /dkd_v05LastShiftTrack = dkd_nextTrack/);
  assert.match(dkd_patch, /dkd_v05SwitchTrack\(this\.dkd_audio, dkd_nextTrack, 'drive'\)/);
});

test('traffic vehicles use a ten-color instance palette', () => {
  assert.match(dkd_traffic, /const dkd_v05VehiclePalette = \[/);
  assert.match(dkd_traffic, /dkd_v05TrafficBodyColors/);
  assert.match(dkd_traffic, /dkd_v05TrafficCabinColors/);
  assert.match(dkd_traffic, /setColorAt\(dkd_index, dkd_color\)/);
  const dkd_paletteMatch = dkd_traffic.match(/const dkd_v05VehiclePalette = \[([^\]]+)\]/);
  assert.ok(dkd_paletteMatch, 'traffic palette must be declared');
  assert.equal((dkd_paletteMatch[1].match(/#[0-9a-fA-F]{6}/g) || []).length, 10);
});

test('route obstacles are denser and include eight visual types', () => {
  assert.match(dkd_traffic, /const dkd_targetCount = Math\.min\(24, Math\.max\(10, Math\.round\(dkd_routeDistance \/ 52\)\)\)/);
  assert.match(dkd_traffic, /const dkd_types = \['barrier', 'cones', 'crate', 'pallet', 'tire', 'roadwork', 'pothole', 'drum'\]/);
  assert.match(dkd_traffic, /dkd_run\.dkd_v05ObstacleCount = dkd_obstacles\.length/);
});

test('prize vault is a full-screen animated colorful v0.5 surface without gradients or glow', () => {
  assert.match(dkd_vault, /dkd-v05-vault/);
  assert.doesNotMatch(dkd_vault, /linear-gradient|radial-gradient|box-shadow|text-shadow/i);
});

test('v0.5 runtime is loaded after all v0.4 traffic layers and before v0.6', () => {
  const dkd_v04 = dkd_build.indexOf("'dkd-v04-route-traffic-density.mjs'");
  const dkd_v05 = dkd_build.indexOf("'dkd-v05-style.mjs'");
  const dkd_v06 = dkd_build.indexOf("'dkd-v06-release.mjs'");
  assert.ok(dkd_v05 > dkd_v04);
  assert.ok(dkd_v06 > dkd_v05);
});

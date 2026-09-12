import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_patch = await dkd_read('game/dkd-v075-drive-home-hotfix.mjs');
const dkd_builder = await dkd_read('scripts/dkd-build-game-v07.mjs');
const dkd_traffic = await dkd_read('game/dkd-v05-traffic.mjs');

 test('v0.7.5 drive/home hotfix is final in the shared Android and Web bundle', () => {
  assert.match(dkd_builder, /dkd-v075-ui-model-polish\.mjs','dkd-v075-drive-home-hotfix\.mjs'/);
  assert.match(dkd_patch, /dkd_webAndroidShared: true/);
});

test('rain ambience is reduced while preserving the weather effects bus', () => {
  assert.match(dkd_patch, /dkd_rain \* \.30 \+ dkd_wind \* \.007/);
  assert.match(dkd_patch, /dkd_rainGain\.gain\.setTargetAtTime/);
});

test('speaker tool immediately above the phone becomes a persistent sound-effects toggle', () => {
  assert.match(dkd_patch, /data-dkd-action=\"dkd-v075-effects-toggle\"/);
  assert.match(dkd_patch, /replace\(\/<button\\b\[\^>\]\*data-dkd-action=\"horn\"/);
  assert.match(dkd_patch, /dkd_state\.dkd_settings\.dkd_effects = 0/);
  assert.match(dkd_patch, /dkd_audio\.dkd_effects\.gain\.setTargetAtTime/);
  assert.match(dkd_patch, /this\.dkd_save\(\)/);
});

test('root cause of route-arrow ghost collisions is blocked by a protected center corridor', () => {
  assert.match(dkd_traffic, /dkd_centerBias = dkd_type === 'pothole' \|\| dkd_type === 'tire' \? \.65 : 1/);
  assert.match(dkd_traffic, /Math\.max\(\.65, dkd_width/);
  assert.match(dkd_patch, /dkd_v075DriveHomeRouteClearance = \.62/);
  assert.match(dkd_patch, /dkd_safeOffset = dkd_v075DriveHomeObstacleHalfWidth\(dkd_obstacle\) \+ dkd_v075DriveHomeBikeHalfWidth \+ dkd_v075DriveHomeRouteClearance/);
  assert.match(dkd_patch, /dkd_obstacle\.dkd_position\[0\] = dkd_nearest\.dkd_point\[0\]/);
  assert.match(dkd_patch, /dkd_visual\.position\.set\(dkd_obstacle\.dkd_position\[0\], \.02, dkd_obstacle\.dkd_position\[1\]\)/);
});

test('cargo damage requires a real rendered obstacle rather than an invisible collision proxy', () => {
  assert.match(dkd_patch, /dkd_obstacle\?\.dkd_v075VisualReady !== true/);
  assert.match(dkd_patch, /dkd_visual\.children\?\.length/);
  assert.match(dkd_patch, /dkd_v05DriveFixObstacleContact = function dkd_v075DriveHomeVisibleObstacleContact/);
  assert.match(dkd_patch, /dkd_v075DriveHomeBikeHalfWidth/);
  assert.match(dkd_patch, /dkd_v075DriveHomeBikeHalfLength/);
});

test('Courier Center season badge sits directly above player name and goal card is animated/colorful', () => {
  assert.match(dkd_patch, /\.dkd-home-header\{display:flex!important;flex-direction:column!important/);
  assert.match(dkd_patch, /\.dkd-home-header \.dkd-player-name\{margin:7px 0 8px!important\}/);
  assert.match(dkd_patch, /\.dkd-contract-mini/);
  assert.match(dkd_patch, /dkd-v075-home-goal-fill/);
  assert.match(dkd_patch, /\.dkd-goal-milestones\{display:grid!important/);
  assert.match(dkd_patch, /font-size:11px!important/);
  assert.doesNotMatch(dkd_patch, /linear-gradient|radial-gradient|box-shadow|text-shadow/i);
});

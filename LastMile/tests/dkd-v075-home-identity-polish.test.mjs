import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_patch = await dkd_read('game/dkd-v075-home-identity-polish.mjs');
const dkd_builder = await dkd_read('scripts/dkd-build-game-v07.mjs');

test('v0.7.5 Courier Center identity polish is the final shared Android/Web UI layer', () => {
  assert.match(dkd_builder, /dkd-v075-drive-home-hotfix\.mjs','dkd-v075-home-identity-polish\.mjs'/);
  assert.match(dkd_patch, /dkd_playerNameBelowBadgeRow: true/);
});

test('season, level and rating form one compact row above player name', () => {
  assert.match(dkd_patch, /\.dkd-home-header \.dkd-player-name\{margin:68px 0 5px!important\}/);
  assert.match(dkd_patch, /\.dkd-home-header \.dkd-season-pill\{position:absolute!important;left:20px!important;top:28px!important/);
  assert.match(dkd_patch, /\.dkd-home-header \.dkd-profile-pills\{position:absolute!important;left:218px!important;right:18px!important;top:27px!important/);
  assert.match(dkd_patch, /dkd_profileBadgesRightOfSeason: true/);
  assert.match(dkd_patch, /dkd_playerNameBelowBadgeRow: true/);
});

test('level and rating badges keep modern colorful flat motion', () => {
  assert.match(dkd_patch, /\.dkd-home-header \.dkd-profile-pills>span/);
  assert.match(dkd_patch, /border-top:3px solid #83a7ff/);
  assert.match(dkd_patch, /dkd-v075-rating-icon/);
  assert.match(dkd_patch, /dkd-v075-badge-meter/);
});

test('short phone viewport compacts home bottom enough for quick menu without moving over signs', () => {
  assert.match(dkd_patch, /@media\(max-height:900px\)/);
  assert.match(dkd_patch, /\.dkd-home-hero\{min-height:118px!important\}/);
  assert.match(dkd_patch, /\.dkd-contract-mini\{padding:11px 13px!important;margin-bottom:8px!important\}/);
  assert.match(dkd_patch, /dkd_bottomQuickMenuViewportFit: true/);
  assert.match(dkd_patch, /dkd_managementSignsProtected: true/);
});

test('season goal progress uses a modern single rail and end marker without forbidden visual effects', () => {
  assert.match(dkd_patch, /height:12px!important/);
  assert.match(dkd_patch, /background:#67ded0/);
  assert.match(dkd_patch, /background:#e4ff5e/);
  assert.match(dkd_patch, /right:2px;top:50%;width:7px;height:7px/);
  assert.match(dkd_patch, /dkd-v075-goal-progress-color/);
  assert.doesNotMatch(dkd_patch, /linear-gradient|radial-gradient|box-shadow|text-shadow/i);
});

test('shift CTA stays large but has no animation', () => {
  assert.match(dkd_patch, /font-size:17px!important/);
  assert.match(dkd_patch, /dkd_shiftButtonStatic: true/);
  assert.match(dkd_patch, /\.dkd-shift-action \.dkd-button\{[^}]*animation:none!important/);
  assert.match(dkd_patch, /\.dkd-shift-action \.dkd-button svg\{[^}]*animation:none!important/);
  assert.match(dkd_patch, /\.dkd-shift-action \.dkd-button:after\{display:none!important/);
});

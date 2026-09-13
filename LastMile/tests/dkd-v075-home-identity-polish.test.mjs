import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_patch = await dkd_read('game/dkd-v075-home-identity-polish.mjs');
const dkd_builder = await dkd_read('scripts/dkd-build-game-v07.mjs');

test('v0.7.5 Courier Center identity polish remains the final shared Android/Web UI layer', () => {
  assert.match(dkd_builder, /dkd-v075-drive-home-hotfix\.mjs','dkd-v075-home-identity-polish\.mjs'/);
  assert.match(dkd_patch, /dkd_seasonLevelRatingSingleRow: true/);
  assert.match(dkd_patch, /dkd_badgeRowCenteredBelowCourierSign: true/);
});

test('season, level and rating are moved into one centered lower badge row', () => {
  assert.match(dkd_patch, /\.dkd-v075-badge-row\{position:absolute!important;left:50%!important;top:188px!important/);
  assert.match(dkd_patch, /transform:translateX\(-50%\)!important/);
  assert.match(dkd_patch, /dkd_row\.appendChild\(dkd_season\)/);
  assert.match(dkd_patch, /dkd_row\.appendChild\(dkd_pills\)/);
  assert.match(dkd_patch, /dkd_badgeRowTop: 188/);
});

test('level and rating badges remain colorful flat controls with the requested actions', () => {
  assert.match(dkd_patch, /dkd_levelBadge\.dataset\.dkdAction = 'v075-level-detail'/);
  assert.match(dkd_patch, /dkd_ratingBadge\.dataset\.dkdAction = 'reputation'/);
  assert.match(dkd_patch, /dkd_levelBadgeOpensDetail: true/);
  assert.match(dkd_patch, /dkd_ratingBadgeOpensReputation: true/);
  assert.match(dkd_patch, /border-top:3px solid #83a7ff/);
  assert.match(dkd_patch, /dkd-v075-rating-icon/);
  assert.match(dkd_patch, /dkd-v075-badge-meter/);
});

test('level badge opens a detailed modern information sheet', () => {
  assert.match(dkd_patch, /function dkd_v075HomeIdentityOpenLevel/);
  assert.match(dkd_patch, /BİR SONRAKİ SEVİYE/);
  assert.match(dkd_patch, /KALAN XP/);
  assert.match(dkd_patch, /ZAMANINDA/);
  assert.match(dkd_patch, /HASARSIZ/);
  assert.match(dkd_patch, /SEVİYE NASIL YÜKSELİR\?/);
  assert.match(dkd_patch, /dkd_v075HomeIdentityOpenLevel\(this\)/);
});

test('vehicle badge sits immediately above the reward vault control', () => {
  assert.match(dkd_patch, /\.dkd-home-hero \.dkd-vehicle-label\{top:auto!important;right:18px!important;bottom:68px!important/);
  assert.match(dkd_patch, /dkd_vehicleBadgeAboveVault: true/);
});

test('short phone viewport keeps lower row and complete quick menu visible', () => {
  assert.match(dkd_patch, /@media\(max-height:900px\)/);
  assert.match(dkd_patch, /\.dkd-v075-badge-row\{top:170px!important\}/);
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

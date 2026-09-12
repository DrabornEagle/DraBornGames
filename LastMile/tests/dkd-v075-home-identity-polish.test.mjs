import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_patch = await dkd_read('game/dkd-v075-home-identity-polish.mjs');
const dkd_builder = await dkd_read('scripts/dkd-build-game-v07.mjs');

test('v0.7.5 Courier Center identity polish is the final shared Android/Web UI layer', () => {
  assert.match(dkd_builder, /dkd-v075-drive-home-hotfix\.mjs','dkd-v075-home-identity-polish\.mjs'/);
  assert.match(dkd_patch, /dkd_seasonBadgeAboveName: true/);
});

test('player name returns to historical position while season badge is independently placed above it', () => {
  assert.match(dkd_patch, /\.dkd-home-header \.dkd-player-name\{margin:72px 0 8px!important\}/);
  assert.match(dkd_patch, /\.dkd-home-header \.dkd-season-pill\{position:absolute!important/);
  assert.match(dkd_patch, /dkd_compactNameMargin: 56/);
});

test('level and rating badges use modern colorful flat motion', () => {
  assert.match(dkd_patch, /\.dkd-home-header \.dkd-profile-pills>span/);
  assert.match(dkd_patch, /border-top:4px solid #83a7ff/);
  assert.match(dkd_patch, /dkd-v075-rating-icon/);
  assert.match(dkd_patch, /dkd-v075-badge-meter/);
});

test('season goal progress is a colorful segmented animated track without forbidden visual effects', () => {
  assert.match(dkd_patch, /\.dkd-contract-mini \.dkd-progress span:before/);
  assert.match(dkd_patch, /background:#85a4ff/);
  assert.match(dkd_patch, /background:#ed8fbd/);
  assert.match(dkd_patch, /dkd-v075-goal-progress-color/);
  assert.doesNotMatch(dkd_patch, /linear-gradient|radial-gradient|box-shadow|text-shadow/i);
});

test('shift CTA is larger and animated with reduced-motion support', () => {
  assert.match(dkd_patch, /font-size:17px!important/);
  assert.match(dkd_patch, /dkd-v075-shift-breathe/);
  assert.match(dkd_patch, /dkd-v075-shift-runner/);
  assert.match(dkd_patch, /data-dkd-motion='off'/);
  assert.match(dkd_patch, /prefers-reduced-motion:reduce/);
});

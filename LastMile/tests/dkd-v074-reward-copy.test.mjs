import dkd_test from 'node:test';
import dkd_assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs/promises';

const dkd_copy = await dkd_fs.readFile(new URL('../game/dkd-v074-reward-copy.mjs', import.meta.url), 'utf8');
const dkd_builder = await dkd_fs.readFile(new URL('../scripts/dkd-build-game-v07.mjs', import.meta.url), 'utf8');

dkd_test('v0.7.4 shared bundle loads seasonal reward copy after final sync', () => {
  dkd_assert.match(dkd_builder, /dkd-v074-final-sync\.mjs','dkd-v074-reward-copy\.mjs/);
  dkd_assert.match(dkd_copy, /dkd_rewardCopyCurrent: true/);
});

dkd_test('reward selection no longer describes live seasonal prizes as demo rewards', () => {
  dkd_assert.match(dkd_copy, /Sezon ödülünü seç/);
  dkd_assert.match(dkd_copy, /Sezon büyük ödülü/);
  dkd_assert.match(dkd_copy, /ödül teslim sürecine geçersin/);
});

// Post-regeneration checkpoint: generated Android/Expo and Web inputs must remain deterministic.

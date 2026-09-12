import dkd_test from 'node:test';
import dkd_assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs/promises';

const dkd_patch = await dkd_fs.readFile(new URL('../game/dkd-v074-progress-vault-fix.mjs', import.meta.url), 'utf8');
const dkd_builder = await dkd_fs.readFile(new URL('../scripts/dkd-build-game-v07.mjs', import.meta.url), 'utf8');

dkd_test('Reward Vault uses the same stable Final progress as home/result', () => {
  dkd_assert.match(dkd_builder, /dkd-v074-gameplay-account-hotfix\.mjs','dkd-v074-progress-vault-fix\.mjs/);
  dkd_assert.match(dkd_patch, /dkd_v074GameplayFinalProgress/);
  dkd_assert.match(dkd_patch, /dkd_vaultFinalProgressStable: true/);
});

dkd_test('drive utility controls return to the original shared CSS sizing', () => {
  dkd_assert.match(dkd_patch, /getElementById\('dkd-v074-gameplay-account-style'\)\?\.remove\(\)/);
  dkd_assert.match(dkd_patch, /dkd_driveToolsOriginalSize: true/);
});

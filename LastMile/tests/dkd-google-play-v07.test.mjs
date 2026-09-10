import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile as dkd_readFile } from 'node:fs/promises';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';
import path from 'node:path';

const dkd_testsDir = path.dirname(dkd_fileURLToPath(import.meta.url));
const dkd_root = path.resolve(dkd_testsDir, '..');

async function dkd_text(dkd_relative) {
  return dkd_readFile(path.join(dkd_root, dkd_relative), 'utf8');
}

test('Google Play policy layer is gated and cannot change non-Play builds', async () => {
  const dkd_source = await dkd_text('game/dkd-v07-google-play.mjs');
  assert.match(dkd_source, /window\.dkd_googlePlayBuild === true/);
  assert.match(dkd_source, /dkd_status: 'play_virtual_only'/);
  assert.match(dkd_source, /dkd_reward_id: ''/);
  assert.match(dkd_source, /dkd_reward_name: ''/);
  assert.match(dkd_source, /Fiziksel ürün, nakit veya gerçek dünya değeri kazanılamaz/);
});

test('Google Play preparation only activates virtual-only mode in the store build workspace', async () => {
  const dkd_source = await dkd_text('scripts/dkd-prepare-google-play.mjs');
  assert.match(dkd_source, /window\.dkd_googlePlayBuild=true/);
  assert.match(dkd_source, /dkd_realRewardsEnabled: false/);
  assert.match(dkd_source, /dkd_googlePlayRewardsMode: 'virtual-only'/);
  assert.match(dkd_source, /dkd_targetApi: 36/);
  assert.match(dkd_source, /android\.permission\.CAMERA/);
  assert.match(dkd_source, /draborneagle\.com\/draborngo\/lastmile\/gizlilik/);
  assert.match(dkd_source, /draborneagle\.com\/draborngo\/lastmile\/hesap-silme/);
});

test('v0.7 bundle loads the gated Google Play policy layer after the premium rider', async () => {
  const dkd_wrapper = await dkd_text('scripts/dkd-build-game-v07.mjs');
  const dkd_rider = dkd_wrapper.indexOf("'dkd-v07-premium-rider.mjs'");
  const dkd_play = dkd_wrapper.indexOf("'dkd-v07-google-play.mjs'");
  assert.ok(dkd_rider >= 0);
  assert.ok(dkd_play > dkd_rider);
});

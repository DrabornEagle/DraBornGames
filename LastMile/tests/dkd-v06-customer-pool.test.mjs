import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_poolFiles = Array.from({ length: 9 }, (_, dkd_index) => `game/avatars/pool/dkd_customer_pool_0${dkd_index}.mjs`);
const dkd_fallbackFiles = ['game/avatars/dkd_selin.mjs', 'game/avatars/dkd_ece.mjs'];

test('v0.6 müşteri havuzu 47 farklı portreyi içerir', async () => {
  const dkd_portraits = [];
  for (const dkd_file of [...dkd_poolFiles, ...dkd_fallbackFiles]) {
    const dkd_source = await readFile(new URL(`../${dkd_file}`, import.meta.url), 'utf8');
    dkd_portraits.push(...(dkd_source.match(/data:image\/jpeg;base64,[A-Za-z0-9+/=]+/g) || []));
  }
  const dkd_uniquePortraits = [...new Set(dkd_portraits)];
  assert.ok(dkd_portraits.length >= 47, 'Portre kaynağı eksik');
  assert.equal(dkd_uniquePortraits.length, 47);
  for (const dkd_portrait of dkd_uniquePortraits) assert.ok(dkd_portrait.length > 800, 'Portre verisi beklenenden kısa');

  const dkd_runtime = await readFile(new URL('../game/dkd-v06-customer-pool.mjs', import.meta.url), 'utf8');
  assert.match(dkd_runtime, /Array\.from\(new Set\(/);
  assert.match(dkd_runtime, /dkd_v06CustomerPortraitPoolPart08/);

  const dkd_finalize = await readFile(new URL('../game/avatars/pool/dkd_customer_pool_finalize.mjs', import.meta.url), 'utf8');
  assert.match(dkd_finalize, /dkd_v06AvatarSelin/);
  assert.match(dkd_finalize, /dkd_v06AvatarEce/);
});

test('sipariş ve mesaj ekranları sipariş bazlı portre eşlemesini kullanır', async () => {
  const dkd_runtime = await readFile(new URL('../game/dkd-v06-customer-pool.mjs', import.meta.url), 'utf8');
  assert.match(dkd_runtime, /dkd_customerPortraitIndex/);
  assert.match(dkd_runtime, /dkd_v06CustomerOrderAvatar\(dkd_order\)/);
  assert.match(dkd_runtime, /dkd_view_dispatch/);
  assert.match(dkd_runtime, /dkd_view_messages/);
  assert.match(dkd_runtime, /cloud-jobs/);
});

test('build sırası tüm portre parçalarını release katmanından sonra yükler', async () => {
  const dkd_build = await readFile(new URL('../scripts/dkd-build-game.mjs', import.meta.url), 'utf8');
  const dkd_releaseIndex = dkd_build.indexOf("'dkd-v06-release.mjs'");
  const dkd_poolIndex = dkd_build.indexOf("'avatars/pool/dkd_customer_pool_00.mjs'");
  const dkd_finalizeIndex = dkd_build.indexOf("'avatars/pool/dkd_customer_pool_finalize.mjs'");
  const dkd_patchIndex = dkd_build.indexOf("'dkd-v06-customer-pool.mjs'");
  assert.ok(dkd_releaseIndex >= 0);
  assert.ok(dkd_poolIndex > dkd_releaseIndex);
  assert.ok(dkd_finalizeIndex > dkd_poolIndex);
  assert.ok(dkd_patchIndex > dkd_finalizeIndex);
  for (let dkd_index = 0; dkd_index < 9; dkd_index += 1) {
    assert.match(dkd_build, new RegExp(`avatars/pool/dkd_customer_pool_0${dkd_index}\\.mjs`));
  }
});

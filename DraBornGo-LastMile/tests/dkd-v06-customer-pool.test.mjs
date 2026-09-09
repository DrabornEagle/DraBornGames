import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_poolFiles = Array.from({ length: 8 }, (_, dkd_index) => `game/avatars/pool/dkd_customer_pool_0${dkd_index}.mjs`);

test('v0.6 müşteri havuzu ZIP içindeki 47 farklı portreyi içerir', async () => {
  const dkd_portraits = [];
  for (const dkd_file of dkd_poolFiles) {
    const dkd_source = await readFile(new URL(`../${dkd_file}`, import.meta.url), 'utf8');
    dkd_portraits.push(...(dkd_source.match(/data:image\/jpeg;base64,[A-Za-z0-9+/=]+/g) || []));
  }
  assert.equal(dkd_portraits.length, 47);
  assert.equal(new Set(dkd_portraits).size, 47);
  for (const dkd_portrait of dkd_portraits) assert.ok(dkd_portrait.length > 800, 'Portre verisi beklenenden kısa');
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
  const dkd_patchIndex = dkd_build.indexOf("'dkd-v06-customer-pool.mjs'");
  assert.ok(dkd_releaseIndex >= 0);
  assert.ok(dkd_poolIndex > dkd_releaseIndex);
  assert.ok(dkd_patchIndex > dkd_poolIndex);
  for (let dkd_index = 0; dkd_index < 8; dkd_index += 1) {
    assert.match(dkd_build, new RegExp(`avatars/pool/dkd_customer_pool_0${dkd_index}\\.mjs`));
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const dkd_read = dkd_path => fs.readFileSync(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_patch = dkd_read('game/dkd-v05-capacity-flow.mjs');
const dkd_build = dkd_read('scripts/dkd-build-game.mjs');

test('starter vehicle is presented as İlk Motorum everywhere in the final runtime layer', () => {
  assert.match(dkd_patch, /dkd_name = 'İlk Motorum'/);
  assert.match(dkd_patch, /Başlangıç Scooterı'\)\.join\('İlk Motorum'/);
  assert.match(dkd_patch, /Şehir 50'\)\.join\('İlk Motorum'/);
});

test('real spare-parts jobs no longer fall back to the 65 kg oversized package', () => {
  assert.match(dkd_patch, /dkd_id: 'dkd_parts'/);
  assert.match(dkd_patch, /dkd_weight: 8/);
});

test('orders show package load and active vehicle maximum carrying capacity', () => {
  assert.match(dkd_patch, /Paket yükü/);
  assert.match(dkd_patch, /SİPARİŞİN PAKET YÜKÜ/);
  assert.match(dkd_patch, /ARACIN MAKSİMUM TAŞIMASI/);
  assert.match(dkd_patch, /KAPASİTE YETERSİZ/);
  assert.match(dkd_patch, /KG TAŞIMA/);
});

test('capacity is preflighted before any cloud job acceptance request', () => {
  const dkd_preflight = dkd_patch.indexOf('dkd_v05RunPreflight(this)');
  const dkd_accept = dkd_patch.indexOf("this.dkd_send('cloud-accept-job'");
  assert.ok(dkd_preflight >= 0 && dkd_accept > dkd_preflight);
  assert.match(dkd_patch, /dkd_createRun\(dkd_game\.dkd_state, dkd_game\.dkd_graph, dkd_order, dkd_game\.dkd_routeMode\)/);
});

test('cloud accepted acknowledgement starts the local run only after server approval', () => {
  assert.match(dkd_patch, /dkd_type === 'cloud-job-accepted'/);
  assert.match(dkd_patch, /return dkd_v05BeginLocalRun\(this\)/);
  assert.match(dkd_patch, /VARDİYA HAZIRLANIYOR/);
});

test('company sign is shifted left on initial build and brand refresh', () => {
  assert.match(dkd_patch, /dkd_Scene\.prototype\.dkd_buildHub/);
  assert.match(dkd_patch, /dkd_Scene\.prototype\.dkd_refreshBrand/);
  assert.equal((dkd_patch.match(/dkd_companySign\.position\.x = -1\.55/g) || []).length, 2);
});

test('capacity flow patch is the last v0.5 runtime source', () => {
  const dkd_garage = dkd_build.indexOf("'dkd-v05-garage-hotfix.mjs'");
  const dkd_capacity = dkd_build.indexOf("'dkd-v05-capacity-flow.mjs'");
  assert.ok(dkd_garage >= 0 && dkd_capacity > dkd_garage);
});

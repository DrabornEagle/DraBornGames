import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_runtime = await readFile(new URL('../game/dkd-v05-sign-layout-hotfix.mjs', import.meta.url), 'utf8');
const dkd_build = await readFile(new URL('../scripts/dkd-build-game.mjs', import.meta.url), 'utf8');

test('final company board is moved farther right so the emblem is fully framed', () => {
  assert.match(dkd_runtime, /dkd_companySign\.position\.x = -3\.30/);
  assert.match(dkd_runtime, /another 1\.10 world units right/);
});

test('company name is left anchored directly after the emblem', () => {
  assert.match(dkd_runtime, /dkd_context\.textAlign = 'left'/);
  assert.match(dkd_runtime, /fillText\(dkd_text\.slice\(0, 32\), 228, 93, 760\)/);
});

test('company sign special layout preserves all three logo shapes', () => {
  assert.match(dkd_runtime, /dkd_logo === 'eagle'/);
  assert.match(dkd_runtime, /dkd_logo === 'bolt'/);
  assert.match(dkd_runtime, /dkd_context\.moveTo\(110, 27\)/);
});

test('sign layout hotfix is loaded after palm road-edge safety', () => {
  const dkd_palmIndex = dkd_build.indexOf("'dkd-v05-palm-roadedge-hotfix.mjs'");
  const dkd_signIndex = dkd_build.indexOf("'dkd-v05-sign-layout-hotfix.mjs'");
  assert.ok(dkd_palmIndex >= 0);
  assert.ok(dkd_signIndex > dkd_palmIndex);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs/promises';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';

const dkd_root = dkd_path.resolve(dkd_path.dirname(dkd_fileURLToPath(import.meta.url)), '..');

const dkd_hotfix = await dkd_fs.readFile(dkd_path.join(dkd_root, 'game/dkd-v05-roadwork-audio-hotfix.mjs'), 'utf8');
const dkd_build = await dkd_fs.readFile(dkd_path.join(dkd_root, 'scripts/dkd-build-game.mjs'), 'utf8');

const dkd_audioFiles = [
  'dkd-v07-home-kurye-merkezi.mp3',
  'dkd-v07-drive-ankara-gece.mp3',
  'dkd-v07-drive-son-kilometre.mp3',
  'dkd-v07-drive-firtina-hatti.mp3',
  'dkd-v07-drive-asfalt-yildizlari.mp3',
  'dkd-v07-drive-final-kontrat.mp3',
];

test('v0.7 rendered game soundtrack assets are bundled', async () => {
  assert.match(dkd_build, /dkd_v05MediaAssets/);
  assert.match(dkd_build, /dkd-v05-roadwork-audio-hotfix\.mjs/);
  assert.match(dkd_build, /dkd-v07-release\.mjs/);
  for (const dkd_file of dkd_audioFiles) {
    assert.match(dkd_build, new RegExp(dkd_file.replace('.', '\\.')));
    const dkd_bytes = await dkd_fs.readFile(dkd_path.join(dkd_root, 'game/audio', dkd_file));
    assert.ok(dkd_bytes.length > 100_000, `${dkd_file} should contain a full rendered music loop`);
    const dkd_header = dkd_bytes.subarray(0, 3).toString('latin1');
    assert.ok(dkd_header === 'ID3' || dkd_bytes[0] === 0xff, `${dkd_file} should be an MP3 asset`);
  }
});

test('roadwork event creates visible work-zone geometry', () => {
  assert.match(dkd_hotfix, /dkd_event\?\.dkd_id === 'dkd_works'/);
  assert.match(dkd_hotfix, /YOL ÇALIŞMASI/);
  assert.match(dkd_hotfix, /ConeGeometry/);
  assert.match(dkd_hotfix, /dkd_v05RoadworkLights/);
});

test('hub company sign is corrected toward screen-left', () => {
  assert.match(dkd_hotfix, /dkd_companySign\.position\.x = 2\.65/);
});

test('stale v0.4 player-facing labels are upgraded to v0.5 by the historical compatibility layer', () => {
  assert.match(dkd_hotfix, /replace\(\/v0\\\.4\/g, 'v0\.5'\)/);
  assert.match(dkd_hotfix, /replace\(\/V0\\\.4\/g, 'V0\.5'\)/);
});

test('insufficient wallet unlocks free fuel or maintenance rescue', () => {
  assert.match(dkd_hotfix, /Bugüne Özel Ücretsiz/);
  assert.match(dkd_hotfix, /BUGÜNE ÖZEL ÜCRETSİZ/);
  assert.match(dkd_hotfix, /v05-free-service/);
  assert.match(dkd_hotfix, /dkd_info\.dkd_wallet < dkd_info\.dkd_cost/);
});

test('legacy menu music does not restart on ordinary clicks and shifts avoid immediate repeats', () => {
  assert.match(dkd_hotfix, /dkd_old === dkd_next/);
  assert.match(dkd_hotfix, /dkd_next === dkd_audio\.dkd_v05MediaLastDriveIndex/);
  assert.match(dkd_hotfix, /dkd_v05MediaRunId === dkd_runId/);
});

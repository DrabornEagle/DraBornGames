import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_patch = await dkd_read('game/dkd-v075-durable-save.mjs');
const dkd_wrapper = await dkd_read('scripts/dkd-build-game-v07.mjs');
const dkd_app = JSON.parse(await dkd_read('app.json'));

test('v0.7.5 durable save layer is final in the shared Android and Web bundle', () => {
  assert.equal(dkd_app.expo.version, '0.7.5');
  assert.equal(dkd_app.expo.android.versionCode, 1);
  assert.equal(dkd_app.expo.extra.dkd_durableCloudSave, true);
  assert.match(dkd_wrapper, /dkd-v074-account-progress-sync\.mjs','dkd-v075-durable-save\.mjs'/);
  assert.match(dkd_wrapper, /replaceAll\('v0\.6\.1', 'v0\.7\.5'\)/);
});

test('all meaningful actions and driving checkpoints are marked for cloud persistence', () => {
  assert.match(dkd_patch, /dkd_client_event_id|dkd_cloudEvent/);
  assert.match(dkd_patch, /player_action/);
  assert.match(dkd_patch, /order_completed/);
  assert.match(dkd_patch, /drive_checkpoint/);
  assert.match(dkd_patch, />= 5000/);
  assert.match(dkd_patch, /dkd_session_id/);
  assert.match(dkd_patch, /dkd_device_id/);
});

test('courier center renders separate season date ranges and total order counts', () => {
  assert.match(dkd_patch, /KURYE MERKEZİ · TOPLAM SİPARİŞ/);
  assert.match(dkd_patch, /dkd_season_order_stats/);
  assert.match(dkd_patch, /dkd_total_orders/);
  assert.match(dkd_patch, /dkd_starts_at/);
  assert.match(dkd_patch, /dkd_ends_at/);
  assert.match(dkd_patch, /SİPARİŞ/);
});

test('drive utility icons are moved lower without adding forbidden visual effects', () => {
  assert.match(dkd_patch, /\.dkd-drive-tools\{transform:translateY\(58px\)!important\}/);
  assert.doesNotMatch(dkd_patch, /linear-gradient|radial-gradient|box-shadow|text-shadow/i);
});

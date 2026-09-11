import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_runtime = await dkd_read('game/dkd-v061-release.mjs');
const dkd_repair = await dkd_read('game/dkd-v061-runtime-repair.mjs');
const dkd_build = await dkd_read('scripts/dkd-build-game.mjs');
const dkd_appSource = await dkd_read('App.tsx');
const dkd_edge = await dkd_read('supabase/functions/dkd-last-mile-api/index.ts');
const dkd_migration = await dkd_read('supabase/migrations/20260910012000_dkd_lastmile_v061_release_google_play.sql');
const dkd_manifest = await dkd_read('game/models/v061/dkd-v061-model-manifest.mjs');
const dkd_app = JSON.parse(await dkd_read('app.json'));
const dkd_package = JSON.parse(await dkd_read('package.json'));

test('v0.7.3 release metadata is authoritative while v0.6.1 runtime stays intact', () => {
  assert.equal(dkd_package.version, '0.7.3');
  assert.equal(dkd_app.expo.version, '0.7.3');
  assert.equal(dkd_app.expo.android.versionCode, 1);
  assert.equal(dkd_app.expo.extra.dkd_versionLabel, 'v0.7.3');
  assert.equal(dkd_package.dependencies.expo, '~57.0.20');
  assert.match(dkd_build, /dkd-v061-release\.mjs/);
  assert.match(dkd_build, /dkd-v061-runtime-repair\.mjs/);
  assert.match(dkd_build, /SON KİLOMETRE · v0\.6\.1/);
});

test('uploaded Yamaha plus Quaternius rider replaces only the starter vehicle', () => {
  assert.match(dkd_runtime, /dkd_city50/);
  assert.match(dkd_runtime, /Yamaha SoulGT 125/);
  assert.match(dkd_runtime, /Quaternius Worker Male/);
  assert.match(dkd_runtime, /DK61/);
  assert.match(dkd_manifest, /dkd_v061ModelMeshCount = 28/);
  assert.match(dkd_manifest, /dkd_v061ModelVertexCount = 3397/);
  assert.match(dkd_manifest, /dkd_v061ModelFaceCount = 5909/);
});

test('v0.6.1 home music repair remains bundled but v0.7.3 overrides it with physical MP3 playback', () => {
  assert.match(dkd_runtime, /dkd_v061ApplyHomeMusic/);
  assert.match(dkd_repair, /const dkd_bpm = 54/);
  assert.match(dkd_repair, /v061-calm-home-54/);
  assert.match(dkd_runtime, /dkd_v061PortraitInfo/);
  assert.match(dkd_runtime, /dkd_v061SafePortraitPool/);
  assert.match(dkd_runtime, /window\.dkd_v061AvatarError/);
  assert.match(dkd_repair, /dkd_v061RepairQuarantinePortrait/);
});

test('privacy and account deletion are available inside app and on public web', () => {
  assert.match(dkd_runtime, /https:\/\/www\.draborneagle\.com\/draborngo\/lastmile\/gizlilik\//);
  assert.match(dkd_runtime, /https:\/\/www\.draborneagle\.com\/draborngo\/lastmile\/hesap-silme\//);
  assert.match(dkd_runtime, /auth-delete-account/);
  assert.match(dkd_repair, /GİZLİLİK POLİTİKASI VE HESAP SİLME/);
  assert.match(dkd_appSource, /dkd_Linking\.openURL/);
  assert.match(dkd_appSource, /auth-delete-account/);
  assert.match(dkd_edge, /dkd_action === 'delete_account'/);
  assert.match(dkd_edge, /auth\.admin\.deleteUser/);
  assert.match(dkd_migration, /dkd_lastmile_delete_account_data/);
  assert.match(dkd_migration, /grant execute .* service_role/i);
});

test('signup plate metadata is persisted through the v0.7.3 safe RPC', () => {
  assert.match(dkd_appSource, /dkd_plate_no: dkd_plateNo/);
  assert.match(dkd_edge, /dkd_plate_no/);
  assert.match(dkd_edge, /rpc\('dkd_lastmile_set_plate'/);
  assert.doesNotMatch(dkd_edge, /schema\('Last-Mile'\)/);
});

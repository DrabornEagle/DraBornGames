import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_runtime = await dkd_read('game/dkd-v061-release.mjs');
const dkd_repair = await dkd_read('game/dkd-v061-runtime-repair.mjs');
const dkd_v07 = await dkd_read('game/dkd-v07-release.mjs');
const dkd_build = await dkd_read('scripts/dkd-build-game.mjs');
const dkd_appSource = await dkd_read('App.tsx');
const dkd_edge = await dkd_read('supabase/functions/dkd-last-mile-api/index.ts');
const dkd_migration = await dkd_read('supabase/migrations/20260910012000_dkd_lastmile_v061_release_google_play.sql');
const dkd_manifest = await dkd_read('game/models/v061/dkd-v061-model-manifest.mjs');
const dkd_app = JSON.parse(await dkd_read('app.json'));
const dkd_package = JSON.parse(await dkd_read('package.json'));

test('v0.7 release metadata is authoritative and Expo SDK 57 stays intact', () => {
  assert.equal(dkd_package.version, '0.7.0');
  assert.equal(dkd_app.expo.version, '0.7.0');
  assert.equal(dkd_app.expo.android.versionCode, 1);
  assert.equal(dkd_app.expo.extra.dkd_versionLabel, 'v0.7');
  assert.equal(dkd_package.dependencies.expo, '~57.0.20');
  assert.match(dkd_build, /dkd-v061-release\.mjs/);
  assert.match(dkd_build, /dkd-v061-runtime-repair\.mjs/);
  assert.match(dkd_build, /dkd-v07-release\.mjs/);
  assert.match(dkd_build, /SON KİLOMETRE · v0\.7/);
});

test('uploaded Yamaha plus Quaternius rider remains the starter vehicle source', () => {
  assert.match(dkd_runtime, /dkd_city50/);
  assert.match(dkd_runtime, /Yamaha SoulGT 125/);
  assert.match(dkd_runtime, /Quaternius Worker Male/);
  assert.match(dkd_runtime, /DK61/);
  assert.match(dkd_manifest, /dkd_v061ModelMeshCount = 28/);
  assert.match(dkd_manifest, /dkd_v061ModelVertexCount = 3397/);
  assert.match(dkd_manifest, /dkd_v061ModelFaceCount = 5909/);
  assert.match(dkd_v07, /dkd_riderAdditionalHeadingRadians: Math\.PI/);
  assert.match(dkd_v07, /dkd_motorcycleAdditionalHeadingRadians: 0/);
});

test('old calm procedural home source is overridden by v0.7 MP3 ownership and customer fallback remains hardened', () => {
  assert.match(dkd_runtime, /dkd_v061ApplyHomeMusic/);
  assert.match(dkd_repair, /const dkd_bpm = 54/);
  assert.match(dkd_repair, /v061-calm-home-54/);
  assert.match(dkd_v07, /dkd_v07StopLegacyHome/);
  assert.match(dkd_v07, /dkd_v07PlayExactIndex/);
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

test('v0.6.1 signup path keeps plate metadata for the current Last-Mile server profile', () => {
  assert.match(dkd_appSource, /dkd_plate_no: dkd_plateNo/);
  assert.match(dkd_edge, /dkd_plate_no/);
  assert.match(dkd_edge, /schema\('Last-Mile'\)/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_release = await readFile(new URL('../game/dkd-v06-release.mjs', import.meta.url), 'utf8');
const dkd_build = await readFile(new URL('../scripts/dkd-build-game.mjs', import.meta.url), 'utf8');
const dkd_package = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const dkd_app = JSON.parse(await readFile(new URL('../app.json', import.meta.url), 'utf8'));
const dkd_migration = await readFile(new URL('../supabase/migrations/20260909193000_dkd_lastmile_v06_plate_admin_level.sql', import.meta.url), 'utf8');
const dkd_edge = await readFile(new URL('../supabase/functions/dkd-last-mile-api/index.ts', import.meta.url), 'utf8');

const dkd_avatarFiles = [
  'dkd_selin','dkd_ece','dkd_mira','dkd_deniz','dkd_lara',
  'dkd_ada','dkd_asya','dkd_irem','dkd_duru','dkd_emre',
];

test('v0.6 customer portraits are bundled and mapped', async () => {
  for (const dkd_name of dkd_avatarFiles) {
    const dkd_avatar = await readFile(new URL(`../game/avatars/${dkd_name}.mjs`, import.meta.url), 'utf8');
    assert.match(dkd_avatar, /data:image\//);
    assert.match(dkd_build, new RegExp(`avatars/${dkd_name}\\.mjs`));
  }
  assert.match(dkd_release, /dkd_v06CustomerAvatars/);
  assert.match(dkd_release, /dkd_emre: dkd_v06AvatarElif/);
});

test('admin is guarded at level 50 and 384160 xp', () => {
  assert.match(dkd_release, /dkd_v06AdminLevel = 50/);
  assert.match(dkd_release, /dkd_v06AdminXp = 384160/);
  assert.match(dkd_release, /dkd_state\.dkd_xp = dkd_v06AdminXp/);
  assert.match(dkd_migration, /dkd_saved_level := 50/);
  assert.match(dkd_migration, /dkd_saved_xp := 384160/);
});

test('company registration requires and normalizes a plate', () => {
  assert.match(dkd_release, /name=\"dkd_plate_no\"/);
  assert.match(dkd_release, /placeholder=\"06 ABC 123\"/);
  assert.match(dkd_release, /dkd_v06NormalizePlate/);
  assert.match(dkd_release, /dkd_plate_no: dkd_plateNo/);
  assert.match(dkd_migration, /add column if not exists dkd_plate_no text/);
  assert.match(dkd_migration, /dkd_state #>> '\{dkd_profile,dkd_plate\}'/);
});

test('reward vault uses generic active-rewards wording', () => {
  assert.match(dkd_release, /● ÖDÜLLER AKTİF/);
  assert.match(dkd_release, /replace\('● FİZİKSEL ÖDÜLLER AKTİF', '● ÖDÜLLER AKTİF'\)/);
});

test('v0.6 keeps Expo SDK 57 dependency family and release metadata', () => {
  assert.equal(dkd_package.version, '0.6.0');
  assert.equal(dkd_package.dependencies.expo, '~57.0.20');
  assert.equal(dkd_package.dependencies['expo-file-system'], '~57.0.6');
  assert.equal(dkd_package.dependencies['react-native'], '0.86.3');
  assert.equal(dkd_app.expo.version, '0.6.0');
  assert.equal(dkd_app.expo.android.versionCode, 600);
  assert.equal(dkd_app.expo.extra.dkd_versionLabel, 'v0.6');
  assert.match(dkd_build, /dkd-v06-release\.mjs/);
  assert.match(dkd_build, /SON KİLOMETRE · v0\.6/);
  assert.match(dkd_edge, /dkd_version: '0\.6'/);
  assert.match(dkd_migration, /'dkd_version','0\.6'/);
});

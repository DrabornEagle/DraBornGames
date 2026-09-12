import test from 'node:test';
import assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';

const dkd_root = dkd_path.resolve(dkd_path.dirname(dkd_fileURLToPath(import.meta.url)), '..');
const dkd_read = dkd_pathname => dkd_fs.readFileSync(dkd_path.join(dkd_root, dkd_pathname), 'utf8');

test('v0.3 başlangıç scooterı bozuk harici model yerine güvenli yerel geometri kullanır', () => {
  const dkd_build = dkd_read('scripts/dkd-build-game.mjs');
  const dkd_fix = dkd_read('game/dkd-v03-runtime-fix.mjs');
  const dkd_html = dkd_read('assets/dkd-lastmile.html');
  const dkd_patchIndex = dkd_build.indexOf("'dkd-v03-patch.mjs'");
  const dkd_fixIndex = dkd_build.indexOf("'dkd-v03-runtime-fix.mjs'");
  assert.ok(dkd_patchIndex >= 0 && dkd_fixIndex > dkd_patchIndex, 'v0.3 güvenli çalışma zamanı düzeltmesi en son yüklenmeli.');
  assert.match(dkd_fix, /dkd_v03_addStarterScooterDetails/);
  assert.match(dkd_fix, /const dkd_v03_baseBuildBikeFinal = dkd_v03_baseBuildBike/);
  assert.match(dkd_fix, /dkd_v03_baseBuildBikeFinal\.call\(this, dkd_kind\)/);
  assert.match(dkd_fix, /this\.dkd_state\?\.dkd_equipped === 'dkd_city50'/);
  assert.match(dkd_fix, /dkd_v03_safe_model/);
  assert.doesNotMatch(dkd_fix, /\batob\s*\(/, 'yayın çalışma zamanında bozuk base64 model çözülmemeli.');
  assert.doesNotMatch(dkd_fix, /dkd_v03_modelBytes/, 'yayın çalışma zamanında eski model byte akışı kullanılmamalı.');
  assert.match(dkd_html, /dkd_v03_safe_model/, 'üretilen Expo oyun paketinde güvenli v0.3 scooter bulunmalı.');
});

test('v0.3 özellikleri güncel v0.7.5 build içinde korunur', () => {
  const dkd_build = dkd_read('scripts/dkd-build-game.mjs');
  const dkd_patch = dkd_read('game/dkd-v03-patch.mjs');
  const dkd_fix = dkd_read('game/dkd-v03-runtime-fix.mjs');
  const dkd_package = JSON.parse(dkd_read('package.json'));
  const dkd_app = JSON.parse(dkd_read('app.json'));
  assert.equal(dkd_package.version, '0.7.5');
  assert.equal(dkd_app.expo.version, '0.7.5');
  assert.equal(dkd_app.expo.android.versionCode, 1);
  assert.equal(dkd_app.expo.extra.dkd_versionLabel, 'v0.7.5');
  assert.match(dkd_build, /dkd-v03-patch\.mjs/);
  assert.match(dkd_build, /dkd-v03-runtime-fix\.mjs/);
  assert.match(dkd_build, /v0\.6\.1/);
  assert.match(dkd_patch, /dkd_assist = false/);
  assert.match(dkd_patch, /dkd_camera = 'high'/);
  assert.match(dkd_fix, /dkd_arrowGeometry\.rotateX\(-Math\.PI \/ 2\)/);
  assert.match(dkd_fix, /dkd_rotation: \[0, dkd_heading, 0\]/);
  assert.match(dkd_patch, /DraBornGo \//);
  assert.match(dkd_patch, /dkd_arrivalDistance > 10/);
  assert.match(dkd_patch, /dkd_v03GarageZoom/);
  assert.match(dkd_patch, /Neon Vardiya/);
});

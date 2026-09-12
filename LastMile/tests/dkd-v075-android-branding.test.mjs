import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_app = JSON.parse(await dkd_read('app.json')).expo;
const dkd_releaseWorkflow = await readFile(new URL('../../.github/workflows/dkd-lastmile-android-signed-release.yml', import.meta.url), 'utf8');

test('Android display name and launcher/splash use Last Mine branding', () => {
  assert.equal(dkd_app.name, 'Last Mine');
  assert.equal(dkd_app.icon, './assets/dkd-last-mine-icon.png');
  assert.equal(dkd_app.android.adaptiveIcon.foregroundImage, './assets/dkd-last-mine-icon.png');
  assert.equal(dkd_app.android.adaptiveIcon.backgroundColor, '#080e15');
  assert.equal(dkd_app.splash.image, './assets/dkd-last-mine-icon.png');
  assert.equal(dkd_app.splash.backgroundColor, '#080e15');
  assert.equal(dkd_app.extra.dkd_androidDisplayName, 'Last Mine');
  assert.equal(dkd_app.extra.dkd_androidBrandedSplash, true);
});

test('signed release produces Last-Mine APK and verifies Android label/icon', () => {
  assert.match(dkd_releaseWorkflow, /Last-Mine-v\$\{DKD_VERSION\}-release-vc1\.apk/);
  assert.match(dkd_releaseWorkflow, /application-label:'Last Mine'/);
  assert.match(dkd_releaseWorkflow, /application-icon-/);
  assert.match(dkd_releaseWorkflow, /--title "Last Mine v\$\{dkd_version\} · Android Release"/);
});

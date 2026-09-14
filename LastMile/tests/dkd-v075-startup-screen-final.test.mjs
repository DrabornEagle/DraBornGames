import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_read = dkd_path => readFile(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_nativePatch = await dkd_read('scripts/dkd-fix-generated-android-splash.py');
const dkd_loadingPatch = await dkd_read('scripts/dkd-native-startup-polish.py');
const dkd_webBuild = await dkd_read('scripts/dkd-build-web.mjs');
const dkd_releaseWorkflow = await dkd_read('../.github/workflows/dkd-lastmile-android-signed-release.yml');

test('Android 12 system splash is forced to a transparent framework icon', () => {
  assert.match(dkd_nativePatch, /android:windowSplashScreenAnimatedIcon/);
  assert.match(dkd_nativePatch, /android:windowSplashScreenBackground/);
  assert.match(dkd_nativePatch, /android:windowSplashScreenIconBackgroundColor/);
  assert.match(dkd_nativePatch, /@drawable\/dkd_transparent_splash/);
  assert.match(dkd_nativePatch, /@color\/dkd_startup_background/);
  assert.match(dkd_nativePatch, /#081426/);
  assert.match(dkd_nativePatch, /Unqualified splash attribute remains/);
  assert.match(dkd_releaseWorkflow, /Remove Android system splash grid icon/);
  assert.match(dkd_releaseWorkflow, /dkd-fix-generated-android-splash\.py/);
});

test('native React bootstrap is replaced every run with modern animated UI', () => {
  assert.match(dkd_loadingPatch, /dkd_Animated\.loop/);
  assert.match(dkd_loadingPatch, /SON KİLOMETRE/);
  assert.match(dkd_loadingPatch, /Şehrin hazırlanıyor/);
  assert.match(dkd_loadingPatch, /#67dfd1/);
  assert.match(dkd_loadingPatch, /#78a6ff/);
  assert.match(dkd_loadingPatch, /#dc8ebe/);
  assert.match(dkd_loadingPatch, /dkd_source\[:dkd_start\]/);
});

test('web output replaces the legacy loader with the modern animated bootstrap screen', () => {
  assert.match(dkd_webBuild, /#dkd-loading\{display:none!important\}/);
  assert.match(dkd_webBuild, /dkd-web-bootstrap/);
  assert.match(dkd_webBuild, /dkd-web-loader-spin/);
  assert.match(dkd_webBuild, /dkd-web-loader-route/);
  assert.match(dkd_webBuild, /DRABORNGO · LAST MILE/);
  assert.match(dkd_webBuild, /SON KİLOMETRE/);
  assert.match(dkd_webBuild, /prefers-reduced-motion/);
});

test('startup screen keeps the project flat-color rule', () => {
  assert.doesNotMatch(dkd_loadingPatch, /linear-gradient|radial-gradient|box-shadow|text-shadow|drop-shadow/i);
  assert.doesNotMatch(dkd_webBuild, /linear-gradient|radial-gradient|box-shadow|text-shadow|drop-shadow/i);
});

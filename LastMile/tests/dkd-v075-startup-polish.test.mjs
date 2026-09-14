import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_app = JSON.parse(await readFile(new URL('../app.json', import.meta.url), 'utf8'));
const dkd_generator = await readFile(new URL('../scripts/dkd-generate-android-icon.py', import.meta.url), 'utf8');
const dkd_polish = await readFile(new URL('../scripts/dkd-native-startup-polish.py', import.meta.url), 'utf8');

test('Android startup splash uses the transparent generated asset instead of icon artwork', () => {
  assert.equal(dkd_app.expo.splash.image, './assets/dkd-last-mine-splash-blank.png');
  assert.equal(dkd_app.expo.extra.dkd_androidBlankSystemSplash, true);
  assert.match(dkd_generator, /dkd-last-mine-splash-blank\.png/);
  assert.match(dkd_generator, /0, 0, 0, 0/);
});

test('native bootstrap loader becomes a modern colorful Last Mile card', () => {
  assert.match(dkd_polish, /function dkd_LoadingScreen/);
  assert.match(dkd_polish, /SON KİLOMETRE/);
  assert.match(dkd_polish, /Şehrin hazırlanıyor/);
  assert.match(dkd_polish, /#70e0d2/);
  assert.match(dkd_polish, /#7fa9ff/);
  assert.match(dkd_polish, /#b89cff/);
  assert.match(dkd_polish, /dkd_ActivityIndicator/);
});

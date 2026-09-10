import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const dkd_read = dkd_path => fs.readFileSync(new URL(`../${dkd_path}`, import.meta.url), 'utf8');
const dkd_hotfix = dkd_read('game/dkd-v05-garage-hotfix.mjs');
const dkd_build = dkd_read('scripts/dkd-build-game.mjs');

test('broken or empty vehicle is blocked before the cloud accept call can run', () => {
  const dkd_startGuard = dkd_hotfix.indexOf("dkd_command === 'start-run'");
  const dkd_previousAction = dkd_hotfix.indexOf('dkd_v05GaragePrevious.dkd_action.call');
  assert.ok(dkd_startGuard >= 0 && dkd_previousAction > dkd_startGuard);
  assert.match(dkd_hotfix, /dkd_fleet\.dkd_fuel\) \|\| 0\) < 5/);
  assert.match(dkd_hotfix, /dkd_fleet\.dkd_condition\) \|\| 0\) < 10/);
  assert.match(dkd_hotfix, /dkd_v05GarageServicePopup\(this, false\)/);
});

test('raw server_error is converted to the modern service modal', () => {
  assert.match(dkd_hotfix, /dkd_payload\?\.dkd_type === 'cloud-error'/);
  assert.match(dkd_hotfix, /server_error\|yakıt\|bakım\|fuel\|condition/);
  assert.match(dkd_hotfix, /dkd-v05-service-modal/);
  assert.match(dkd_hotfix, /GARAJA GİT/);
  assert.match(dkd_hotfix, /ŞİMDİ DEĞİL/);
});

test('starter scooter display name replaces Şehir 50 in current and restored labels', () => {
  assert.match(dkd_hotfix, /dkd_v05StarterVehicle\.dkd_name = 'Başlangıç Scooterı'/);
  assert.match(dkd_hotfix, /split\('Şehir 50'\)\.join\('Başlangıç Scooterı'\)/);
});

test('garage has animated colorful service cards and a modern fleet surface', () => {
  assert.match(dkd_hotfix, /dkd-v05-garage-hero/);
  assert.match(dkd_hotfix, /dkd-v05-service-card/);
  assert.match(dkd_hotfix, /dkd-v05-service-meter/);
  assert.match(dkd_hotfix, /dkd-v05-garage-fleet-card/);
  assert.match(dkd_hotfix, /@keyframes dkd-v05-garage-rise/);
  assert.match(dkd_hotfix, /@keyframes dkd-v05-garage-alert/);
  assert.doesNotMatch(dkd_hotfix, /linear-gradient|radial-gradient|conic-gradient|box-shadow|text-shadow/i);
});

test('home identity block is moved further down and home uses a dedicated menu track', () => {
  assert.match(dkd_hotfix, /\.dkd-player-name\{margin:112px 0 7px!important\}/);
  assert.match(dkd_hotfix, /\.dkd-home-header \.dkd-profile-pills\{margin-top:12px!important/);
  assert.match(dkd_hotfix, /dkd_v05SwitchTrack\(dkd_audio, 5, 'menu'\)/);
  assert.match(dkd_hotfix, /dkd_v05HomeThemeActive/);
});

test('garage hotfix is the final v0.5 runtime layer', () => {
  const dkd_vaultIndex = dkd_build.indexOf("'dkd-v05-vault.mjs'");
  const dkd_hotfixIndex = dkd_build.indexOf("'dkd-v05-garage-hotfix.mjs'");
  assert.ok(dkd_vaultIndex >= 0 && dkd_hotfixIndex > dkd_vaultIndex);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dkd_release = await readFile(new URL('../game/dkd-v07-release.mjs', import.meta.url), 'utf8');
const dkd_polish = await readFile(new URL('../game/dkd-v07-device-polish.mjs', import.meta.url), 'utf8');
const dkd_build = await readFile(new URL('../scripts/dkd-build-game.mjs', import.meta.url), 'utf8');
const dkd_musicRenderer = await readFile(new URL('../scripts/dkd-render-music-v07.py', import.meta.url), 'utf8');
const dkd_app = JSON.parse(await readFile(new URL('../app.json', import.meta.url), 'utf8'));
const dkd_package = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

// These are source-level release invariants. Final geometry/sound acceptance remains a physical Expo Go test.
test('v0.7 release metadata and final device layer are aligned', () => {
  assert.equal(dkd_app.expo.version, '0.7.0');
  assert.equal(dkd_app.expo.android.versionCode, 1);
  assert.equal(dkd_app.expo.extra.dkd_versionLabel, 'v0.7');
  assert.equal(dkd_package.version, '0.7.0');
  assert.match(dkd_build, /'dkd-v07-release\.mjs',\s*\n\s*'dkd-v07-device-polish\.mjs'/);
});

test('camera controls remain available and Takip is the migrated standard start view', () => {
  assert.match(dkd_release, /Kamera mesafesi/);
  assert.match(dkd_polish, /\['near','Yakın','5 m takip'\]/);
  assert.match(dkd_polish, /\['chase','Takip','Standart'\]/);
  assert.match(dkd_polish, /\['high','Yüksek','Geniş görüş'\]/);
  assert.match(dkd_polish, /data-dkd-action="camera-mode:\$\{dkd_item\[0\]\}"/);
  assert.match(dkd_polish, /dkd_game\.dkd_state\.dkd_settings\.dkd_camera = 'chase'/);
  assert.match(dkd_polish, /Takip[^\n]*Standart/);
  assert.doesNotMatch(JSON.stringify(dkd_app.expo.android.permissions || []), /CAMERA/);
});

test('rider is regrouped around rider centroid and offset left/up without Yamaha meshes', () => {
  assert.match(dkd_release, /new Set\(\[22, 23, 24, 25, 26, 27\]\)/);
  assert.match(dkd_polish, /new Set\(\[22, 23, 24, 25, 26, 27\]\)/);
  assert.doesNotMatch(dkd_polish, /new Set\(\[20, 21, 22/);
  assert.match(dkd_polish, /dkd_v07_rider_seat_group/);
  assert.match(dkd_polish, /getCenter\(new dkd_three\.Vector3\(\)\)/);
  assert.match(dkd_polish, /new dkd_three\.Vector3\(0\.08, 0\.08, 0\.0\)/);
  assert.match(dkd_polish, /dkd_riderGroup\.rotation\.y = Math\.PI/);
  assert.match(dkd_polish, /dkd_mesh\.rotation\.y -= Math\.PI/);
});

test('imported Yamaha wheels have two speed-driven visible rotation rigs', () => {
  assert.match(dkd_polish, /dkd_name: 'arka'/);
  assert.match(dkd_polish, /dkd_name: 'on'/);
  assert.match(dkd_polish, /-0\.7816, 0\.3772/);
  assert.match(dkd_polish, /0\.7879, 0\.2850/);
  assert.match(dkd_polish, /dkd_v07PolishWheelRigs/);
  assert.match(dkd_polish, /rotation\.z -= dkd_speed \* dkd_dt/);
});

test('settings final surface is detailed colorful and does not add gradient glow or shadow styling', () => {
  assert.match(dkd_polish, /Ayar Merkezi/);
  assert.match(dkd_polish, /Görüntü ve performans/);
  assert.match(dkd_polish, /Sürüş ve kamera/);
  assert.match(dkd_polish, /Ses ve müzik/);
  assert.match(dkd_polish, /Direksiyon hassasiyeti/);
  assert.match(dkd_polish, /MÜZİK KÜTÜPHANESİNİ AÇ/);
  assert.doesNotMatch(dkd_polish, /linear-gradient|radial-gradient|box-shadow|text-shadow/i);
});

test('full-mix audio is WAV-mastered then encoded to actual stereo MP3 without melody/arp sequencers', () => {
  assert.match(dkd_musicRenderer, /wave\.open/);
  assert.match(dkd_musicRenderer, /libmp3lame/);
  assert.match(dkd_musicRenderer, /192k/);
  assert.match(dkd_musicRenderer, /setnchannels\(2\)/);
  assert.doesNotMatch(dkd_musicRenderer, /dkd_motif|dkd_arp/i);
  assert.match(dkd_build, /Kurye Merkezi: Gece Mesaisi/);
  assert.match(dkd_build, /Ankara: Gece Trafiği/);
  assert.match(dkd_build, /Final Kontrat: 03:17/);
  assert.match(dkd_build, /PCM\/WAV Master · Full Mix MP3/);
});

test('Courier Center and drive music keep one exclusive media owner', () => {
  assert.match(dkd_release, /dkd_v07PauseEveryMediaExcept/);
  assert.match(dkd_release, /dkd_v07StopLegacyHome/);
  assert.match(dkd_release, /dkd_v07AudioOwner/);
  assert.match(dkd_release, /dkd_audioSingleOwner: true/);
  assert.match(dkd_build, /dkd-v07-home-kurye-merkezi\.mp3/);
  assert.match(dkd_build, /dkd-v07-drive-final-kontrat\.mp3/);
});

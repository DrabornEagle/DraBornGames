import test from 'node:test';
import assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';

const dkd_root = dkd_path.resolve(dkd_path.dirname(dkd_fileURLToPath(import.meta.url)), '..');

function dkd_readModelChunk(dkd_index) {
  const dkd_text = dkd_fs.readFileSync(dkd_path.join(dkd_root, `game/dkd-v03-model-${dkd_index}.mjs`), 'utf8');
  const dkd_match = dkd_text.match(/=\s*"([A-Za-z0-9+/=]+)"\s*;/);
  assert.ok(dkd_match, `v0.3 model parçası ${dkd_index} okunamadı.`);
  return dkd_match[1];
}

test('v0.3 scooter + sürücü paketi eksiksiz ve güvenli okunur', () => {
  const dkd_parts = Array.from({ length: 9 }, (dkd_value, dkd_index) => Buffer.from(dkd_readModelChunk(dkd_index), 'base64'));
  const dkd_bytes = Buffer.concat(dkd_parts);
  assert.equal(dkd_bytes.subarray(0, 4).toString('ascii'), 'DK31');
  const dkd_view = new DataView(dkd_bytes.buffer, dkd_bytes.byteOffset, dkd_bytes.byteLength);
  const dkd_meshCount = dkd_view.getUint16(4, true);
  assert.equal(dkd_meshCount, 26);
  let dkd_offset = 6;
  let dkd_vertices = 0;
  let dkd_faces = 0;
  for (let dkd_meshIndex = 0; dkd_meshIndex < dkd_meshCount; dkd_meshIndex++) {
    assert.ok(dkd_offset + 35 <= dkd_bytes.length);
    const dkd_vertexCount = dkd_view.getUint16(dkd_offset, true);
    const dkd_faceCount = dkd_view.getUint16(dkd_offset + 2, true);
    assert.ok(dkd_vertexCount >= 3 && dkd_vertexCount <= 12000);
    assert.ok(dkd_faceCount >= 1 && dkd_faceCount <= 24000);
    dkd_vertices += dkd_vertexCount;
    dkd_faces += dkd_faceCount;
    dkd_offset += 35;
    assert.ok(dkd_offset + dkd_vertexCount * 3 <= dkd_bytes.length);
    dkd_offset += dkd_vertexCount * 3;
    let dkd_previousIndex = 0;
    for (let dkd_index = 0; dkd_index < dkd_faceCount * 3; dkd_index++) {
      let dkd_unsigned = 0;
      let dkd_shift = 0;
      let dkd_byte = 0;
      do {
        assert.ok(dkd_offset < dkd_bytes.length);
        dkd_byte = dkd_bytes[dkd_offset++];
        dkd_unsigned |= (dkd_byte & 0x7f) << dkd_shift;
        dkd_shift += 7;
        assert.ok(dkd_shift <= 28);
      } while (dkd_byte & 0x80);
      const dkd_delta = (dkd_unsigned >>> 1) ^ -(dkd_unsigned & 1);
      dkd_previousIndex += dkd_delta;
      assert.ok(dkd_previousIndex >= 0 && dkd_previousIndex < dkd_vertexCount);
    }
  }
  assert.equal(dkd_offset, dkd_bytes.length);
  assert.equal(dkd_vertices, 5942);
  assert.equal(dkd_faces, 11244);
});

test('v0.3 is wired into build, settings, arrows, phone and automatic delivery', () => {
  const dkd_build = dkd_fs.readFileSync(dkd_path.join(dkd_root, 'scripts/dkd-build-game.mjs'), 'utf8');
  const dkd_patch = dkd_fs.readFileSync(dkd_path.join(dkd_root, 'game/dkd-v03-patch.mjs'), 'utf8');
  const dkd_fix = dkd_fs.readFileSync(dkd_path.join(dkd_root, 'game/dkd-v03-runtime-fix.mjs'), 'utf8');
  const dkd_package = JSON.parse(dkd_fs.readFileSync(dkd_path.join(dkd_root, 'package.json'), 'utf8'));
  const dkd_app = JSON.parse(dkd_fs.readFileSync(dkd_path.join(dkd_root, 'app.json'), 'utf8'));
  assert.equal(dkd_package.version, '0.3.0');
  assert.equal(dkd_app.expo.version, '0.3.0');
  assert.equal(dkd_app.expo.android.versionCode, 300);
  assert.equal(dkd_app.expo.extra.dkd_versionLabel, 'v0.3');
  assert.match(dkd_build, /dkd-v03-model-0\.mjs/);
  assert.match(dkd_build, /dkd-v03-patch\.mjs/);
  assert.match(dkd_build, /dkd-v03-runtime-fix\.mjs/);
  assert.match(dkd_build, /v0\.3/);
  assert.match(dkd_patch, /dkd_assist = false/);
  assert.match(dkd_patch, /dkd_camera = 'high'/);
  assert.match(dkd_fix, /dkd_arrowGeometry\.rotateX\(-Math\.PI \/ 2\)/);
  assert.match(dkd_fix, /dkd_rotation: \[0, dkd_heading, 0\]/);
  assert.match(dkd_patch, /DraBornGo \//);
  assert.match(dkd_patch, /dkd_arrivalDistance > 10/);
  assert.match(dkd_patch, /dkd_v03GarageZoom/);
  assert.match(dkd_patch, /Neon Vardiya/);
  assert.match(dkd_fix, /Buffer|atob/);
});

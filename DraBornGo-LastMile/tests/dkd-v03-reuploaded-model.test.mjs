import test from 'node:test';
import assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs';
import * as dkd_path from 'node:path';
import * as dkd_vm from 'node:vm';
import { gunzipSync as dkd_gunzipSync } from 'node:zlib';
import { createHash as dkd_createHash } from 'node:crypto';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';

const dkd_root = dkd_path.resolve(dkd_path.dirname(dkd_fileURLToPath(import.meta.url)), '..');
const dkd_read = dkd_pathname => dkd_fs.readFileSync(dkd_path.join(dkd_root, dkd_pathname), 'utf8');

function dkd_readChunk(dkd_index) {
  const dkd_source = dkd_read(`game/dkd-v03-reuploaded-gzip-${dkd_index}.mjs`);
  const dkd_context = {};
  dkd_vm.createContext(dkd_context);
  dkd_vm.runInContext(`${dkd_source}\nglobalThis.dkd_chunk = dkd_v03_reuploadedGzipChunk${dkd_index};`, dkd_context, { timeout: 1000 });
  assert.equal(typeof dkd_context.dkd_chunk, 'string');
  assert.match(dkd_context.dkd_chunk, /^[A-Za-z0-9+/=]+$/);
  return dkd_context.dkd_chunk;
}

function dkd_modelBytes() {
  const dkd_base64 = [0, 1, 2, 3, 4].map(dkd_readChunk).join('');
  assert.equal(dkd_base64.length % 4, 0, 'Sıkıştırılmış model base64 uzunluğu geçersiz.');
  const dkd_compressed = Buffer.from(dkd_base64, 'base64');
  assert.ok(dkd_compressed.length > 10000 && dkd_compressed.length < 30000, 'Sıkıştırılmış model boyutu beklenmiyor.');
  return dkd_gunzipSync(dkd_compressed);
}

function dkd_parsePack(dkd_bytes) {
  assert.equal(dkd_bytes.subarray(0, 4).toString('ascii'), 'DK32');
  const dkd_meshCount = dkd_bytes.readUInt16LE(4);
  let dkd_offset = 6;
  let dkd_vertices = 0;
  let dkd_faces = 0;
  for (let dkd_mesh = 0; dkd_mesh < dkd_meshCount; dkd_mesh++) {
    assert.ok(dkd_offset + 34 <= dkd_bytes.length, `mesh ${dkd_mesh} başlığı eksik`);
    const dkd_vertexCount = dkd_bytes.readUInt16LE(dkd_offset);
    const dkd_faceCount = dkd_bytes.readUInt16LE(dkd_offset + 2);
    assert.ok(dkd_vertexCount >= 3 && dkd_vertexCount <= 12000, `mesh ${dkd_mesh} vertex sayısı geçersiz`);
    assert.ok(dkd_faceCount >= 1 && dkd_faceCount <= 24000, `mesh ${dkd_mesh} yüz sayısı geçersiz`);
    dkd_vertices += dkd_vertexCount;
    dkd_faces += dkd_faceCount;
    dkd_offset += 34 + dkd_vertexCount * 3;
    assert.ok(dkd_offset <= dkd_bytes.length, `mesh ${dkd_mesh} konum verisi eksik`);
    let dkd_previousIndex = 0;
    for (let dkd_index = 0; dkd_index < dkd_faceCount * 3; dkd_index++) {
      let dkd_unsigned = 0;
      let dkd_shift = 0;
      let dkd_byte = 0;
      do {
        assert.ok(dkd_offset < dkd_bytes.length, `mesh ${dkd_mesh} indeks verisi eksik`);
        dkd_byte = dkd_bytes[dkd_offset++];
        dkd_unsigned |= (dkd_byte & 0x7f) << dkd_shift;
        dkd_shift += 7;
        assert.ok(dkd_shift <= 28, `mesh ${dkd_mesh} varint geçersiz`);
      } while (dkd_byte & 0x80);
      const dkd_delta = (dkd_unsigned >>> 1) ^ -(dkd_unsigned & 1);
      dkd_previousIndex += dkd_delta;
      assert.ok(dkd_previousIndex >= 0 && dkd_previousIndex < dkd_vertexCount, `mesh ${dkd_mesh} indeks sınır dışı`);
    }
  }
  assert.equal(dkd_offset, dkd_bytes.length);
  return { dkd_meshCount, dkd_vertices, dkd_faces };
}

test('re-uploaded scooter + rider mobile pack is intact', () => {
  const dkd_bytes = dkd_modelBytes();
  assert.equal(dkd_bytes.length, 55706);
  assert.equal(dkd_createHash('sha256').update(dkd_bytes).digest('hex'), 'e22ea91089e098fd8876a0f33eadf8f1f479e7cfa6063f28a6b15d1c46b99260');
  const dkd_stats = dkd_parsePack(dkd_bytes);
  assert.equal(dkd_stats.dkd_meshCount, 68);
  assert.equal(dkd_stats.dkd_vertices, 5942);
  assert.equal(dkd_stats.dkd_faces, 11244);
});

test('re-uploaded model runtime is bundled last and replaces City 50', () => {
  const dkd_build = dkd_read('scripts/dkd-build-game.mjs');
  const dkd_home = dkd_build.indexOf("'dkd-v03-home-refine.mjs'");
  const dkd_gzip0 = dkd_build.indexOf("'dkd-v03-reuploaded-gzip-0.mjs'");
  const dkd_gzip4 = dkd_build.indexOf("'dkd-v03-reuploaded-gzip-4.mjs'");
  const dkd_runtime = dkd_build.indexOf("'dkd-v03-reuploaded-model.mjs'");
  assert.ok(dkd_home >= 0 && dkd_gzip0 > dkd_home && dkd_gzip4 > dkd_gzip0 && dkd_runtime > dkd_gzip4);

  const dkd_patch = dkd_read('game/dkd-v03-reuploaded-model.mjs');
  assert.match(dkd_patch, /dkd_city50_reuploaded_scooter_rider/);
  assert.match(dkd_patch, /dkd_uploaded_scooter_rider_model/);
  assert.match(dkd_patch, /DecompressionStream\('gzip'\)/);
  assert.match(dkd_patch, /dkd_v03ModelLoadToken/);
  assert.match(dkd_patch, /this\.dkd_state\?\.dkd_equipped !== 'dkd_city50'/);
  assert.match(dkd_patch, /dkd_totalVertices !== 5942/);
  assert.match(dkd_patch, /dkd_totalFaces !== 11244/);
});

test('new and migrated careers start High and İlk garajın is removed', () => {
  const dkd_patch = dkd_read('game/dkd-v03-reuploaded-model.mjs');
  assert.match(dkd_patch, /dkd_settings\.dkd_quality = 'high'/);
  assert.match(dkd_patch, /dkd_reuploadedHighQualityApplied/);
  assert.match(dkd_patch, /İlk garajın/);
  assert.match(dkd_patch, /replace\(\/<small/);
});

test('generated Expo Go HTML contains the re-uploaded model runtime', () => {
  const dkd_html = dkd_read('assets/dkd-lastmile.html');
  assert.match(dkd_html, /dkd_city50_reuploaded_scooter_rider/);
  assert.match(dkd_html, /dkd_reuploadedHighQualityApplied/);
  assert.match(dkd_html, /DecompressionStream/);
});

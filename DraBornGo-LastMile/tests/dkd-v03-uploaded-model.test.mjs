import test from 'node:test';
import assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';

const dkd_root = dkd_path.resolve(dkd_path.dirname(dkd_fileURLToPath(import.meta.url)), '..');
const dkd_read = dkd_name => dkd_fs.readFileSync(dkd_path.join(dkd_root, dkd_name), 'utf8');

function dkd_uploadedPack() {
  let dkd_base64 = '';
  for (let dkd_index = 0; dkd_index < 9; dkd_index++) {
    const dkd_source = dkd_read(`game/dkd-v03-model-${dkd_index}.mjs`);
    const dkd_match = dkd_source.match(new RegExp(`const\\s+dkd_v03_modelChunk${dkd_index}\\s*=\\s*\"([^\"]*)\"`));
    assert.ok(dkd_match, `v0.3 model parçası ${dkd_index} okunamadı.`);
    dkd_base64 += dkd_match[1];
  }
  return Buffer.from(dkd_base64, 'base64');
}

test('yeniden yüklenen scooter + sürücü paketi yapısal olarak doğrulanır', () => {
  const dkd_pack = dkd_uploadedPack();
  // Git parça sınırları değişse bile gerçek doğrulama DK31 yapısının tamamının
  // hatasız okunmasıdır. Boyut için yalnızca kırpılmış/boş paketi yakalayan
  // güvenli bir aralık kullanılır; aşağıdaki offset kontrolü paketin tamamını
  // birebir tüketmek zorundadır.
  assert.ok(dkd_pack.length > 50000 && dkd_pack.length < 100000, `beklenmeyen paket boyutu: ${dkd_pack.length}`);
  assert.equal(dkd_pack.subarray(0, 4).toString('ascii'), 'DK31');
  assert.equal(dkd_pack.readUInt16LE(4), 26);

  let dkd_offset = 6;
  let dkd_vertices = 0;
  let dkd_triangles = 0;
  const dkd_meshCount = dkd_pack.readUInt16LE(4);
  for (let dkd_mesh = 0; dkd_mesh < dkd_meshCount; dkd_mesh++) {
    assert.ok(dkd_offset + 35 <= dkd_pack.length, `mesh ${dkd_mesh + 1} başlığı eksik`);
    const dkd_vertexCount = dkd_pack.readUInt16LE(dkd_offset);
    const dkd_faceCount = dkd_pack.readUInt16LE(dkd_offset + 2);
    assert.ok(dkd_vertexCount >= 3 && dkd_vertexCount < 12000);
    assert.ok(dkd_faceCount >= 1 && dkd_faceCount < 24000);
    dkd_vertices += dkd_vertexCount;
    dkd_triangles += dkd_faceCount;
    dkd_offset += 35;
    dkd_offset += dkd_vertexCount * 3;
    assert.ok(dkd_offset <= dkd_pack.length, `mesh ${dkd_mesh + 1} vertex verisi eksik`);

    let dkd_previous = 0;
    for (let dkd_index = 0; dkd_index < dkd_faceCount * 3; dkd_index++) {
      let dkd_unsigned = 0;
      let dkd_shift = 0;
      let dkd_byte = 0;
      do {
        assert.ok(dkd_offset < dkd_pack.length, `mesh ${dkd_mesh + 1} indeks verisi eksik`);
        dkd_byte = dkd_pack[dkd_offset++];
        dkd_unsigned |= (dkd_byte & 0x7f) << dkd_shift;
        dkd_shift += 7;
        assert.ok(dkd_shift <= 28, `mesh ${dkd_mesh + 1} varint geçersiz`);
      } while (dkd_byte & 0x80);
      const dkd_delta = (dkd_unsigned >>> 1) ^ -(dkd_unsigned & 1);
      dkd_previous += dkd_delta;
      assert.ok(dkd_previous >= 0 && dkd_previous < dkd_vertexCount, `mesh ${dkd_mesh + 1} indeks sınırı geçersiz`);
    }
  }
  assert.equal(dkd_offset, dkd_pack.length);
  assert.equal(dkd_vertices, 5942);
  assert.equal(dkd_triangles, 11244);
});

test('gerçek yüklenen model final runtime olarak çalışır ve başlangıç kalitesi Yüksek olur', () => {
  const dkd_build = dkd_read('scripts/dkd-build-game.mjs');
  const dkd_runtime = dkd_read('game/dkd-v03-uploaded-model-runtime.mjs');
  const dkd_home = dkd_read('game/dkd-v03-home-refine.mjs');
  const dkd_runtimeIndex = dkd_build.indexOf("'dkd-v03-uploaded-model-runtime.mjs'");
  const dkd_safeIndex = dkd_build.indexOf("'dkd-v03-runtime-fix.mjs'");
  const dkd_homeIndex = dkd_build.indexOf("'dkd-v03-home-refine.mjs'");
  assert.ok(dkd_runtimeIndex > dkd_safeIndex && dkd_runtimeIndex > dkd_homeIndex);
  assert.match(dkd_runtime, /dkd_v03_readScooterRider\(\)/);
  assert.match(dkd_runtime, /dkd_uploaded_scooter_rider_v0_1/);
  assert.match(dkd_runtime, /dkd_quality = 'high'/);
  assert.match(dkd_runtime, /dkd_uploadedHighQualityApplied/);
  assert.match(dkd_runtime, /İlk garajın/);
  assert.match(dkd_home, /dkd_Game\.prototype\.dkd_updateHud = dkd_v03_baseUpdateHud/);
});

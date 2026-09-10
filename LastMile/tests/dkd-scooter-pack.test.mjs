import test from 'node:test';
import assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';

const dkd_root = dkd_path.resolve(dkd_path.dirname(dkd_fileURLToPath(import.meta.url)), '..');

function dkd_readChunk(dkd_index) {
  const dkd_text = dkd_fs.readFileSync(dkd_path.join(dkd_root, `game/dkd-v02-scooter-${dkd_index}.mjs`), 'utf8');
  const dkd_match = dkd_text.match(/=\s*"([A-Za-z0-9+/=]+)"\s*;/);
  assert.ok(dkd_match, `Scooter parçası ${dkd_index} okunamadı.`);
  return dkd_match[1];
}

function dkd_headerAt(dkd_bytes, dkd_view, dkd_offset) {
  if (dkd_offset < 0 || dkd_offset + 35 > dkd_bytes.length) return null;
  const dkd_vertexCount = dkd_view.getUint16(dkd_offset, true);
  const dkd_faceCount = dkd_view.getUint16(dkd_offset + 2, true);
  if (dkd_vertexCount < 3 || dkd_vertexCount > 5000 || dkd_faceCount < 1 || dkd_faceCount > 10000) return null;
  const dkd_alpha = dkd_bytes[dkd_offset + 7];
  if (dkd_alpha < 120) return null;
  const dkd_min = [0, 1, 2].map(dkd_axis => dkd_view.getFloat32(dkd_offset + 11 + dkd_axis * 4, true));
  const dkd_max = [0, 1, 2].map(dkd_axis => dkd_view.getFloat32(dkd_offset + 23 + dkd_axis * 4, true));
  if (![...dkd_min, ...dkd_max].every(dkd_value => Number.isFinite(dkd_value) && Math.abs(dkd_value) < 100)) return null;
  if (!dkd_min.every((dkd_value, dkd_axis) => dkd_value <= dkd_max[dkd_axis])) return null;
  const dkd_end = dkd_offset + 35 + dkd_vertexCount * 6 + dkd_faceCount * 6;
  if (dkd_end > dkd_bytes.length) return null;
  return { dkd_offset, dkd_vertexCount, dkd_faceCount, dkd_end, dkd_min, dkd_max };
}

function dkd_findNextHeader(dkd_bytes, dkd_view, dkd_from) {
  const dkd_limit = Math.min(dkd_bytes.length - 35, dkd_from + 512);
  for (let dkd_offset = dkd_from; dkd_offset <= dkd_limit; dkd_offset++) {
    const dkd_header = dkd_headerAt(dkd_bytes, dkd_view, dkd_offset);
    if (dkd_header) return dkd_header;
  }
  return null;
}

test('v0.2 başlangıç scooter paketi telefon parserında taşmadan okunur', () => {
  const dkd_base64 = dkd_readChunk(0) + dkd_readChunk(1) + dkd_readChunk(2);
  const dkd_bytes = Buffer.from(dkd_base64, 'base64');
  assert.equal(dkd_bytes.subarray(0, 4).toString('ascii'), 'DK20');
  const dkd_view = new DataView(dkd_bytes.buffer, dkd_bytes.byteOffset, dkd_bytes.byteLength);
  const dkd_meshCount = dkd_view.getUint16(4, true);
  assert.equal(dkd_meshCount, 16);

  let dkd_offset = 6;
  let dkd_resyncBytes = 0;
  const dkd_headers = [];
  for (let dkd_meshIndex = 0; dkd_meshIndex < dkd_meshCount; dkd_meshIndex++) {
    let dkd_header = dkd_headerAt(dkd_bytes, dkd_view, dkd_offset);
    if (!dkd_header) {
      const dkd_recovered = dkd_findNextHeader(dkd_bytes, dkd_view, dkd_offset + 1);
      assert.ok(dkd_recovered, `mesh ${dkd_meshIndex} için sonraki geçerli başlık bulunamadı; offset=${dkd_offset}`);
      dkd_resyncBytes += dkd_recovered.dkd_offset - dkd_offset;
      dkd_header = dkd_recovered;
    }

    let dkd_cursor = dkd_header.dkd_offset + 35 + dkd_header.dkd_vertexCount * 6;
    for (let dkd_index = 0; dkd_index < dkd_header.dkd_faceCount * 3; dkd_index++) {
      const dkd_value = dkd_view.getUint16(dkd_cursor, true);
      assert.ok(dkd_value < dkd_header.dkd_vertexCount, `mesh ${dkd_meshIndex} geçersiz indeks ${dkd_value}/${dkd_header.dkd_vertexCount}`);
      dkd_cursor += 2;
    }
    assert.equal(dkd_cursor, dkd_header.dkd_end);
    dkd_headers.push(dkd_header);
    dkd_offset = dkd_header.dkd_end;
  }

  assert.equal(dkd_headers.length, 16);
  assert.equal(dkd_resyncBytes, 6, 'İlk mesh sonundaki bilinen altı baytlık ayraç dışında kayma olmamalı.');
  assert.equal(dkd_offset, dkd_bytes.length, `Scooter paketinde ${dkd_bytes.length - dkd_offset} okunmamış bayt kaldı.`);
});

test('telefon güvenli scooter parserı üretilen oyun paketine dahil edilir', () => {
  const dkd_build = dkd_fs.readFileSync(dkd_path.join(dkd_root, 'scripts/dkd-build-game.mjs'), 'utf8');
  const dkd_runtime = dkd_fs.readFileSync(dkd_path.join(dkd_root, 'game/dkd-v02-runtime-fix.mjs'), 'utf8');
  assert.match(dkd_build, /dkd-v02-runtime-fix\.mjs/);
  assert.match(dkd_runtime, /dkd_v02_scooterHeader/);
  assert.match(dkd_runtime, /dkd_v02_findScooterHeader/);
  assert.match(dkd_runtime, /dkd_v02_baseBuildBike/);
});

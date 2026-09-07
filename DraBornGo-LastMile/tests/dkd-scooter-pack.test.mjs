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

function dkd_need(dkd_offset, dkd_length, dkd_total, dkd_meshIndex, dkd_label) {
  assert.ok(
    dkd_offset + dkd_length <= dkd_total,
    `Scooter verisi taşması: mesh=${dkd_meshIndex}, alan=${dkd_label}, offset=${dkd_offset}, gereken=${dkd_length}, toplam=${dkd_total}`
  );
}

test('v0.2 başlangıç scooter paketi tamamen okunabilir', () => {
  const dkd_base64 = dkd_readChunk(0) + dkd_readChunk(1) + dkd_readChunk(2);
  const dkd_bytes = Buffer.from(dkd_base64, 'base64');
  assert.equal(dkd_bytes.subarray(0, 4).toString('ascii'), 'DK20');
  const dkd_view = new DataView(dkd_bytes.buffer, dkd_bytes.byteOffset, dkd_bytes.byteLength);
  let dkd_offset = 4;
  dkd_need(dkd_offset, 2, dkd_bytes.length, -1, 'meshCount');
  const dkd_meshCount = dkd_view.getUint16(dkd_offset, true); dkd_offset += 2;
  assert.equal(dkd_meshCount, 16);

  for (let dkd_meshIndex = 0; dkd_meshIndex < dkd_meshCount; dkd_meshIndex++) {
    dkd_need(dkd_offset, 4, dkd_bytes.length, dkd_meshIndex, 'counts');
    const dkd_vertexCount = dkd_view.getUint16(dkd_offset, true); dkd_offset += 2;
    const dkd_faceCount = dkd_view.getUint16(dkd_offset, true); dkd_offset += 2;
    dkd_need(dkd_offset, 7, dkd_bytes.length, dkd_meshIndex, 'material'); dkd_offset += 7;
    dkd_need(dkd_offset, 24, dkd_bytes.length, dkd_meshIndex, 'bounds'); dkd_offset += 24;
    dkd_need(dkd_offset, dkd_vertexCount * 3 * 2, dkd_bytes.length, dkd_meshIndex, 'positions');
    dkd_offset += dkd_vertexCount * 3 * 2;
    dkd_need(dkd_offset, dkd_faceCount * 3 * 2, dkd_bytes.length, dkd_meshIndex, 'indices');
    dkd_offset += dkd_faceCount * 3 * 2;
  }

  assert.equal(dkd_offset, dkd_bytes.length, `Scooter paketinde ${dkd_bytes.length - dkd_offset} okunmamış bayt kaldı.`);
});

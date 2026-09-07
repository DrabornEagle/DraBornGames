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

function dkd_scanHeaders(dkd_bytes, dkd_view, dkd_from, dkd_to) {
  const dkd_candidates = [];
  for (let dkd_offset = dkd_from; dkd_offset <= Math.min(dkd_to, dkd_bytes.length - 35); dkd_offset++) {
    const dkd_vertexCount = dkd_view.getUint16(dkd_offset, true);
    const dkd_faceCount = dkd_view.getUint16(dkd_offset + 2, true);
    if (dkd_vertexCount < 3 || dkd_vertexCount > 5000 || dkd_faceCount < 1 || dkd_faceCount > 10000) continue;
    const dkd_alpha = dkd_bytes[dkd_offset + 7];
    if (dkd_alpha < 120) continue;
    const dkd_min = [0, 1, 2].map(dkd_axis => dkd_view.getFloat32(dkd_offset + 11 + dkd_axis * 4, true));
    const dkd_max = [0, 1, 2].map(dkd_axis => dkd_view.getFloat32(dkd_offset + 23 + dkd_axis * 4, true));
    if (![...dkd_min, ...dkd_max].every(dkd_value => Number.isFinite(dkd_value) && Math.abs(dkd_value) < 100)) continue;
    if (!dkd_min.every((dkd_value, dkd_axis) => dkd_value <= dkd_max[dkd_axis])) continue;
    const dkd_end = dkd_offset + 35 + dkd_vertexCount * 6 + dkd_faceCount * 6;
    if (dkd_end > dkd_bytes.length) continue;
    dkd_candidates.push({ dkd_offset, dkd_vertexCount, dkd_faceCount, dkd_end, dkd_alpha, dkd_min, dkd_max });
    if (dkd_candidates.length >= 20) break;
  }
  console.log('DKD olası headerlar:', JSON.stringify(dkd_candidates));
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
  console.log(`DKD scooter toplam=${dkd_bytes.length} mesh=${dkd_meshCount}`);

  for (let dkd_meshIndex = 0; dkd_meshIndex < dkd_meshCount; dkd_meshIndex++) {
    const dkd_meshStart = dkd_offset;
    dkd_need(dkd_offset, 4, dkd_bytes.length, dkd_meshIndex, 'counts');
    const dkd_vertexCount = dkd_view.getUint16(dkd_offset, true); dkd_offset += 2;
    const dkd_faceCount = dkd_view.getUint16(dkd_offset, true); dkd_offset += 2;
    console.log(`DKD mesh=${dkd_meshIndex} start=${dkd_meshStart} vertices=${dkd_vertexCount} faces=${dkd_faceCount}`);
    if (dkd_meshIndex === 2 || dkd_vertexCount > 10000 || dkd_faceCount > 20000) {
      const dkd_from = Math.max(0, dkd_meshStart - 24);
      const dkd_to = Math.min(dkd_bytes.length, dkd_meshStart + 96);
      console.log(`DKD çevre ${dkd_from}-${dkd_to}: ${dkd_bytes.subarray(dkd_from, dkd_to).toString('hex')}`);
      dkd_scanHeaders(dkd_bytes, dkd_view, dkd_meshStart, dkd_meshStart + 4000);
    }
    dkd_need(dkd_offset, 7, dkd_bytes.length, dkd_meshIndex, 'material'); dkd_offset += 7;
    dkd_need(dkd_offset, 24, dkd_bytes.length, dkd_meshIndex, 'bounds'); dkd_offset += 24;
    dkd_need(dkd_offset, dkd_vertexCount * 3 * 2, dkd_bytes.length, dkd_meshIndex, 'positions');
    dkd_offset += dkd_vertexCount * 3 * 2;
    dkd_need(dkd_offset, dkd_faceCount * 3 * 2, dkd_bytes.length, dkd_meshIndex, 'indices');
    dkd_offset += dkd_faceCount * 3 * 2;
    console.log(`DKD mesh=${dkd_meshIndex} end=${dkd_offset}`);
  }

  assert.equal(dkd_offset, dkd_bytes.length, `Scooter paketinde ${dkd_bytes.length - dkd_offset} okunmamış bayt kaldı.`);
});

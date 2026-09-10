import * as dkd_fs from 'node:fs/promises';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';
import { gunzipSync as dkd_gunzipSync } from 'node:zlib';

const dkd_root = dkd_path.resolve(dkd_path.dirname(dkd_fileURLToPath(import.meta.url)), '..');
const dkd_chunkFiles = Array.from({ length: 6 }, (_, dkd_index) => `game/models/v061/dkd-v061-model-${dkd_index}.mjs`);
const dkd_parts = [];
for (const dkd_file of dkd_chunkFiles) {
  const dkd_source = await dkd_fs.readFile(dkd_path.join(dkd_root, dkd_file), 'utf8');
  const dkd_match = dkd_source.match(/=\s*['"]([A-Za-z0-9+/=]+)['"]\s*;/);
  if (!dkd_match) throw new Error(`Model parçası okunamadı: ${dkd_file}`);
  dkd_parts.push(Buffer.from(dkd_match[1], 'base64'));
}

const dkd_raw = dkd_gunzipSync(Buffer.concat(dkd_parts));
if (dkd_raw.subarray(0, 4).toString('ascii') !== 'DK61') throw new Error('DK61 başlığı bulunamadı.');
const dkd_view = new DataView(dkd_raw.buffer, dkd_raw.byteOffset, dkd_raw.byteLength);
const dkd_meshCount = dkd_view.getUint16(4, true);
let dkd_offset = 6;
const dkd_meshes = [];

for (let dkd_meshIndex = 0; dkd_meshIndex < dkd_meshCount; dkd_meshIndex += 1) {
  const dkd_vertexCount = dkd_view.getUint16(dkd_offset, true);
  const dkd_faceCount = dkd_view.getUint16(dkd_offset + 2, true);
  const dkd_color = [dkd_raw[dkd_offset + 4], dkd_raw[dkd_offset + 5], dkd_raw[dkd_offset + 6], dkd_raw[dkd_offset + 7]];
  const dkd_metalness = dkd_raw[dkd_offset + 8] / 255;
  const dkd_roughness = dkd_raw[dkd_offset + 9] / 255;
  const dkd_min = [
    dkd_view.getFloat32(dkd_offset + 10, true),
    dkd_view.getFloat32(dkd_offset + 14, true),
    dkd_view.getFloat32(dkd_offset + 18, true),
  ];
  const dkd_max = [
    dkd_view.getFloat32(dkd_offset + 22, true),
    dkd_view.getFloat32(dkd_offset + 26, true),
    dkd_view.getFloat32(dkd_offset + 30, true),
  ];
  dkd_offset += 34 + dkd_vertexCount * 3;

  const dkd_indexCount = dkd_faceCount * 3;
  for (let dkd_index = 0; dkd_index < dkd_indexCount; dkd_index += 1) {
    let dkd_shift = 0;
    let dkd_byte = 0;
    do {
      if (dkd_offset >= dkd_raw.length) throw new Error(`Mesh ${dkd_meshIndex} indeks verisi yarım kaldı.`);
      dkd_byte = dkd_raw[dkd_offset++];
      dkd_shift += 7;
      if (dkd_shift > 28) throw new Error(`Mesh ${dkd_meshIndex} indeks kodu geçersiz.`);
    } while (dkd_byte & 0x80);
  }

  dkd_meshes.push({
    dkd_index: dkd_meshIndex,
    dkd_vertices: dkd_vertexCount,
    dkd_faces: dkd_faceCount,
    dkd_color_rgba: dkd_color,
    dkd_metalness: Number(dkd_metalness.toFixed(3)),
    dkd_roughness: Number(dkd_roughness.toFixed(3)),
    dkd_min: dkd_min.map(dkd_value => Number(dkd_value.toFixed(4))),
    dkd_max: dkd_max.map(dkd_value => Number(dkd_value.toFixed(4))),
    dkd_center: dkd_min.map((dkd_value, dkd_axis) => Number(((dkd_value + dkd_max[dkd_axis]) / 2).toFixed(4))),
    dkd_size: dkd_min.map((dkd_value, dkd_axis) => Number((dkd_max[dkd_axis] - dkd_value).toFixed(4))),
  });
}

if (dkd_offset !== dkd_raw.length) throw new Error(`DK61 sonu eşleşmedi: ${dkd_offset}/${dkd_raw.length}`);

const dkd_report = {
  dkd_format: 'DK61',
  dkd_bytes: dkd_raw.length,
  dkd_mesh_count: dkd_meshCount,
  dkd_meshes,
};
const dkd_output = dkd_path.join(dkd_root, 'game/models/v061/dkd-v061-mesh-report.json');
await dkd_fs.writeFile(dkd_output, `${JSON.stringify(dkd_report, null, 2)}\n`);
console.log(`DKD starter mesh report ready: ${dkd_meshCount} meshes.`);

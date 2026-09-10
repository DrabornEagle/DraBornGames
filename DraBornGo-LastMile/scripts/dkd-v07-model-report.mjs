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
const dkd_components = [];

function dkd_find(dkd_parent, dkd_value) {
  let dkd_rootValue = dkd_value;
  while (dkd_parent[dkd_rootValue] !== dkd_rootValue) dkd_rootValue = dkd_parent[dkd_rootValue];
  while (dkd_parent[dkd_value] !== dkd_value) {
    const dkd_next = dkd_parent[dkd_value];
    dkd_parent[dkd_value] = dkd_rootValue;
    dkd_value = dkd_next;
  }
  return dkd_rootValue;
}

function dkd_union(dkd_parent, dkd_first, dkd_second) {
  const dkd_a = dkd_find(dkd_parent, dkd_first);
  const dkd_b = dkd_find(dkd_parent, dkd_second);
  if (dkd_a !== dkd_b) dkd_parent[dkd_b] = dkd_a;
}

function dkd_componentStats(dkd_meshIndex, dkd_positions, dkd_indices) {
  const dkd_vertexCount = dkd_positions.length / 3;
  const dkd_parent = Array.from({ length: dkd_vertexCount }, (_, dkd_index) => dkd_index);
  for (let dkd_index = 0; dkd_index < dkd_indices.length; dkd_index += 3) {
    const dkd_a = dkd_indices[dkd_index];
    const dkd_b = dkd_indices[dkd_index + 1];
    const dkd_c = dkd_indices[dkd_index + 2];
    dkd_union(dkd_parent, dkd_a, dkd_b);
    dkd_union(dkd_parent, dkd_b, dkd_c);
  }
  const dkd_groups = new Map();
  for (let dkd_vertex = 0; dkd_vertex < dkd_vertexCount; dkd_vertex += 1) {
    const dkd_group = dkd_find(dkd_parent, dkd_vertex);
    if (!dkd_groups.has(dkd_group)) dkd_groups.set(dkd_group, []);
    dkd_groups.get(dkd_group).push(dkd_vertex);
  }
  let dkd_componentIndex = 0;
  for (const dkd_vertices of dkd_groups.values()) {
    const dkd_min = [Infinity, Infinity, Infinity];
    const dkd_max = [-Infinity, -Infinity, -Infinity];
    for (const dkd_vertex of dkd_vertices) {
      for (let dkd_axis = 0; dkd_axis < 3; dkd_axis += 1) {
        const dkd_value = dkd_positions[dkd_vertex * 3 + dkd_axis];
        dkd_min[dkd_axis] = Math.min(dkd_min[dkd_axis], dkd_value);
        dkd_max[dkd_axis] = Math.max(dkd_max[dkd_axis], dkd_value);
      }
    }
    const dkd_center = dkd_min.map((dkd_value, dkd_axis) => (dkd_value + dkd_max[dkd_axis]) / 2);
    const dkd_size = dkd_min.map((dkd_value, dkd_axis) => dkd_max[dkd_axis] - dkd_value);
    const dkd_roundness = Math.min(dkd_size[0], dkd_size[1]) / Math.max(0.0001, Math.max(dkd_size[0], dkd_size[1]));
    const dkd_low = dkd_center[1] < 0.62;
    const dkd_end = Math.abs(dkd_center[0]) > 0.34;
    const dkd_wheelScale = dkd_size[0] > 0.24 && dkd_size[1] > 0.24 && dkd_size[0] < 0.9 && dkd_size[1] < 0.9;
    const dkd_thin = dkd_size[2] < 0.52;
    const dkd_score = (dkd_low ? 2 : 0) + (dkd_end ? 2 : 0) + (dkd_wheelScale ? 3 : 0) + (dkd_thin ? 1 : 0) + dkd_roundness * 2 + Math.min(1, dkd_vertices.length / 40);
    dkd_components.push({
      dkd_mesh_index: dkd_meshIndex,
      dkd_component_index: dkd_componentIndex,
      dkd_vertices: dkd_vertices.length,
      dkd_center: dkd_center.map(dkd_value => Number(dkd_value.toFixed(4))),
      dkd_size: dkd_size.map(dkd_value => Number(dkd_value.toFixed(4))),
      dkd_roundness: Number(dkd_roundness.toFixed(4)),
      dkd_wheel_score: Number(dkd_score.toFixed(4)),
    });
    dkd_componentIndex += 1;
  }
}

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
  dkd_offset += 34;

  const dkd_positions = new Float32Array(dkd_vertexCount * 3);
  for (let dkd_vertex = 0; dkd_vertex < dkd_vertexCount; dkd_vertex += 1) {
    for (let dkd_axis = 0; dkd_axis < 3; dkd_axis += 1) {
      const dkd_quantized = dkd_raw[dkd_offset++];
      dkd_positions[dkd_vertex * 3 + dkd_axis] = dkd_min[dkd_axis] + (dkd_max[dkd_axis] - dkd_min[dkd_axis]) * dkd_quantized / 255;
    }
  }

  const dkd_indexCount = dkd_faceCount * 3;
  const dkd_indices = new Uint16Array(dkd_indexCount);
  let dkd_previousIndex = 0;
  for (let dkd_index = 0; dkd_index < dkd_indexCount; dkd_index += 1) {
    let dkd_unsigned = 0;
    let dkd_shift = 0;
    let dkd_byte = 0;
    do {
      if (dkd_offset >= dkd_raw.length) throw new Error(`Mesh ${dkd_meshIndex} indeks verisi yarım kaldı.`);
      dkd_byte = dkd_raw[dkd_offset++];
      dkd_unsigned |= (dkd_byte & 0x7f) << dkd_shift;
      dkd_shift += 7;
      if (dkd_shift > 28) throw new Error(`Mesh ${dkd_meshIndex} indeks kodu geçersiz.`);
    } while (dkd_byte & 0x80);
    const dkd_delta = (dkd_unsigned >>> 1) ^ -(dkd_unsigned & 1);
    dkd_previousIndex += dkd_delta;
    if (dkd_previousIndex < 0 || dkd_previousIndex >= dkd_vertexCount) throw new Error(`Mesh ${dkd_meshIndex} indeks değeri geçersiz.`);
    dkd_indices[dkd_index] = dkd_previousIndex;
  }

  if (dkd_meshIndex <= 21) dkd_componentStats(dkd_meshIndex, dkd_positions, dkd_indices);

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

const dkd_wheelCandidates = dkd_components
  .filter(dkd_item => dkd_item.dkd_vertices >= 8)
  .sort((dkd_first, dkd_second) => dkd_second.dkd_wheel_score - dkd_first.dkd_wheel_score)
  .slice(0, 24);

const dkd_report = {
  dkd_format: 'DK61',
  dkd_bytes: dkd_raw.length,
  dkd_mesh_count: dkd_meshCount,
  dkd_meshes,
  dkd_yamaha_components: dkd_components.length,
  dkd_wheel_candidates: dkd_wheelCandidates,
};
const dkd_output = dkd_path.join(dkd_root, 'game/models/v061/dkd-v061-mesh-report.json');
await dkd_fs.writeFile(dkd_output, `${JSON.stringify(dkd_report, null, 2)}\n`);
console.log(`DKD starter mesh report ready: ${dkd_meshCount} meshes, ${dkd_components.length} Yamaha components, ${dkd_wheelCandidates.length} wheel candidates.`);

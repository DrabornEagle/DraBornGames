import * as dkd_fs from 'node:fs/promises';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';
import { gunzipSync as dkd_gunzipSync } from 'node:zlib';
import { createHash as dkd_createHash } from 'node:crypto';

const dkd_root = dkd_path.resolve(dkd_path.dirname(dkd_fileURLToPath(import.meta.url)), '..');
const dkd_targetPath = dkd_path.join(dkd_root, 'game/models/v061/dkd-v061-model-4.mjs');
const dkd_expectedSha = '8dc66ee133b1651571ebfcd8c74238b091c45a4a9405ea25a2bf57c62f51e2a1';

async function dkd_readChunk(dkd_index) {
  const dkd_file = dkd_path.join(dkd_root, `game/models/v061/dkd-v061-model-${dkd_index}.mjs`);
  const dkd_source = await dkd_fs.readFile(dkd_file, 'utf8');
  const dkd_match = dkd_source.match(/=\s*['"]([A-Za-z0-9+/=]+)['"]\s*;/);
  if (!dkd_match) throw new Error(`Model parçası okunamadı: ${dkd_index}`);
  return { dkd_file, dkd_source, dkd_text: dkd_match[1] };
}

const dkd_chunks = [];
for (let dkd_index = 0; dkd_index < 6; dkd_index += 1) dkd_chunks.push(await dkd_readChunk(dkd_index));
const dkd_target = dkd_chunks[4];

if (dkd_target.dkd_text.length === 5501) {
  const dkd_position = 2837;
  const dkd_context = dkd_target.dkd_text.slice(dkd_position - 10, dkd_position + 11);
  if (dkd_target.dkd_text[dkd_position] !== 'i' || dkd_context !== 'X9U/aU2M9Nimist8ekHv0') {
    throw new Error(`Beklenmeyen model bozulması; otomatik onarım durduruldu: ${dkd_context}`);
  }
  const dkd_repaired = dkd_target.dkd_text.slice(0, dkd_position) + dkd_target.dkd_text.slice(dkd_position + 1);
  dkd_target.dkd_source = dkd_target.dkd_source.replace(dkd_target.dkd_text, dkd_repaired);
  dkd_target.dkd_text = dkd_repaired;
  await dkd_fs.writeFile(dkd_targetPath, dkd_target.dkd_source);
  console.log('DK61 chunk 4: position 2837 üzerindeki fazladan i karakteri kaldırıldı.');
} else if (dkd_target.dkd_text.length !== 5500) {
  throw new Error(`DK61 chunk 4 uzunluğu beklenmiyor: ${dkd_target.dkd_text.length}`);
}

const dkd_base64 = dkd_chunks.map(dkd_chunk => dkd_chunk.dkd_text).join('');
const dkd_compressed = Buffer.from(dkd_base64, 'base64');
const dkd_raw = dkd_gunzipSync(dkd_compressed);
const dkd_sha = dkd_createHash('sha256').update(dkd_raw).digest('hex');
if (dkd_raw.length !== 29530 || dkd_raw.subarray(0, 4).toString('ascii') !== 'DK61' || dkd_sha !== dkd_expectedSha) {
  throw new Error(`DK61 onarımı doğrulanamadı: bytes=${dkd_raw.length} sha=${dkd_sha}`);
}
console.log(`DK61 model doğrulandı: ${dkd_raw.length} bayt · sha256=${dkd_sha}`);

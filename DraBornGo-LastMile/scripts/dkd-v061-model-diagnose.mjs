import * as dkd_fs from 'node:fs/promises';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';
import { gunzipSync as dkd_gunzipSync } from 'node:zlib';
import { createHash as dkd_createHash } from 'node:crypto';

const dkd_root = dkd_path.resolve(dkd_path.dirname(dkd_fileURLToPath(import.meta.url)), '..');
const dkd_files = Array.from({ length: 6 }, (_, dkd_index) => `game/models/v061/dkd-v061-model-${dkd_index}.mjs`);
const dkd_parts = [];
for (const dkd_file of dkd_files) {
  const dkd_source = await dkd_fs.readFile(dkd_path.join(dkd_root, dkd_file), 'utf8');
  const dkd_match = dkd_source.match(/=\s*['"]([A-Za-z0-9+/=]+)['"]\s*;/);
  if (!dkd_match) throw new Error(`Parça okunamadı: ${dkd_file}`);
  const dkd_text = dkd_match[1];
  console.log(JSON.stringify({ dkd_file, dkd_chars: dkd_text.length, dkd_mod4: dkd_text.length % 4, dkd_start: dkd_text.slice(0, 12), dkd_end: dkd_text.slice(-12) }));
  dkd_parts.push(dkd_text);
}

const dkd_compressed = Buffer.from(dkd_parts.join(''), 'base64');
const dkd_raw = dkd_gunzipSync(dkd_compressed);
const dkd_sha = dkd_createHash('sha256').update(dkd_raw).digest('hex');
const dkd_expectedSha = '8dc66ee133b1651571ebfcd8c74238b091c45a4a9405ea25a2bf57c62f51e2a1';
if (dkd_raw.length !== 29530 || dkd_raw.subarray(0, 4).toString('ascii') !== 'DK61' || dkd_sha !== dkd_expectedSha) {
  throw new Error(`DK61 doğrulaması başarısız: bytes=${dkd_raw.length} sha=${dkd_sha}`);
}
console.log(`DK61 VALID: ${dkd_raw.length} bayt · sha256=${dkd_sha}`);

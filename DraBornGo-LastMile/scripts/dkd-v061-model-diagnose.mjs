import * as dkd_fs from 'node:fs/promises';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';
import { gunzipSync as dkd_gunzipSync, unzipSync as dkd_unzipSync, inflateRawSync as dkd_inflateRawSync } from 'node:zlib';

const dkd_root = dkd_path.resolve(dkd_path.dirname(dkd_fileURLToPath(import.meta.url)), '..');
const dkd_files = Array.from({ length: 6 }, (_, dkd_index) => `game/models/v061/dkd-v061-model-${dkd_index}.mjs`);
const dkd_parts = [];
for (const dkd_file of dkd_files) {
  const dkd_source = await dkd_fs.readFile(dkd_path.join(dkd_root, dkd_file), 'utf8');
  const dkd_match = dkd_source.match(/=\s*['"]([A-Za-z0-9+/=]+)['"]\s*;/);
  if (!dkd_match) throw new Error(`Parça okunamadı: ${dkd_file}`);
  const dkd_text = dkd_match[1];
  const dkd_decoded = Buffer.from(dkd_text, 'base64');
  console.log(JSON.stringify({
    dkd_file,
    dkd_chars: dkd_text.length,
    dkd_mod4: dkd_text.length % 4,
    dkd_start: dkd_text.slice(0, 12),
    dkd_end: dkd_text.slice(-12),
    dkd_padding: (dkd_text.match(/=+$/) || [''])[0].length,
    dkd_decoded: dkd_decoded.length,
    dkd_hexStart: dkd_decoded.subarray(0, 8).toString('hex'),
    dkd_hexEnd: dkd_decoded.subarray(-8).toString('hex'),
  }));
  dkd_parts.push(dkd_text);
}

const dkd_candidates = new Map();
dkd_candidates.set('joined_text', Buffer.from(dkd_parts.join(''), 'base64'));
dkd_candidates.set('joined_text_strip_mid_padding', Buffer.from(dkd_parts.map((dkd_part, dkd_index) => dkd_index < dkd_parts.length - 1 ? dkd_part.replace(/=+$/, '') : dkd_part).join(''), 'base64'));
dkd_candidates.set('decoded_parts_concat', Buffer.concat(dkd_parts.map(dkd_part => Buffer.from(dkd_part, 'base64'))));

for (const [dkd_name, dkd_bytes] of dkd_candidates) {
  console.log(`CANDIDATE ${dkd_name} bytes=${dkd_bytes.length} start=${dkd_bytes.subarray(0, 12).toString('hex')} end=${dkd_bytes.subarray(-12).toString('hex')}`);
  for (const [dkd_decoderName, dkd_decoder] of [['gunzip', dkd_gunzipSync], ['unzip', dkd_unzipSync], ['inflateRaw', dkd_inflateRawSync]]) {
    try {
      const dkd_raw = dkd_decoder(dkd_bytes);
      console.log(`SUCCESS ${dkd_name}/${dkd_decoderName} raw=${dkd_raw.length} magic=${dkd_raw.subarray(0, 8).toString('hex')}`);
    } catch (dkd_error) {
      console.log(`FAIL ${dkd_name}/${dkd_decoderName}: ${dkd_error.code || ''} ${dkd_error.message}`);
    }
  }
}

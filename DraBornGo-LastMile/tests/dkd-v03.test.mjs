import test from 'node:test';
import assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';

const dkd_root = dkd_path.resolve(dkd_path.dirname(dkd_fileURLToPath(import.meta.url)), '..');
function dkd_readModelChunk(dkd_index) {
  const dkd_text = dkd_fs.readFileSync(dkd_path.join(dkd_root, `game/dkd-v03-model-${dkd_index}.mjs`), 'utf8');
  const dkd_match = dkd_text.match(/=\s*"([A-Za-z0-9+/=]+)"\s*;/);
  assert.ok(dkd_match, `v0.3 model parçası ${dkd_index} okunamadı.`);
  return dkd_match[1];
}
function dkd_probe(dkd_bytes) {
  try {
    if (dkd_bytes.subarray(0, 4).toString('ascii') !== 'DK31') return { ok:false, stage:'signature', len:dkd_bytes.length };
    const dkd_view = new DataView(dkd_bytes.buffer, dkd_bytes.byteOffset, dkd_bytes.byteLength);
    const dkd_meshCount = dkd_view.getUint16(4, true);
    let dkd_offset = 6, dkd_vertices = 0, dkd_faces = 0, dkd_invalid = 0;
    for (let dkd_meshIndex=0; dkd_meshIndex<dkd_meshCount; dkd_meshIndex++) {
      if (dkd_offset + 35 > dkd_bytes.length) return {ok:false,stage:'header',dkd_meshIndex,dkd_offset,len:dkd_bytes.length};
      const dkd_vertexCount=dkd_view.getUint16(dkd_offset,true), dkd_faceCount=dkd_view.getUint16(dkd_offset+2,true);
      if (dkd_vertexCount<3||dkd_vertexCount>12000||dkd_faceCount<1||dkd_faceCount>24000) return {ok:false,stage:'counts',dkd_meshIndex,dkd_offset,dkd_vertexCount,dkd_faceCount};
      dkd_vertices += dkd_vertexCount; dkd_faces += dkd_faceCount; dkd_offset += 35 + dkd_vertexCount*3;
      if (dkd_offset > dkd_bytes.length) return {ok:false,stage:'positions',dkd_meshIndex,dkd_offset,len:dkd_bytes.length};
      let dkd_previousIndex=0;
      for (let dkd_index=0; dkd_index<dkd_faceCount*3; dkd_index++) {
        let dkd_unsigned=0, dkd_shift=0, dkd_byte=0;
        do {
          if (dkd_offset>=dkd_bytes.length) return {ok:false,stage:'index-eof',dkd_meshIndex,dkd_index,dkd_offset};
          dkd_byte=dkd_bytes[dkd_offset++]; dkd_unsigned|=(dkd_byte&0x7f)<<dkd_shift; dkd_shift+=7;
          if (dkd_shift>28) return {ok:false,stage:'varint',dkd_meshIndex,dkd_index,dkd_offset};
        } while(dkd_byte&0x80);
        const dkd_delta=(dkd_unsigned>>>1)^-(dkd_unsigned&1); dkd_previousIndex += dkd_delta;
        if (dkd_previousIndex<0||dkd_previousIndex>=dkd_vertexCount) dkd_invalid++;
      }
    }
    return {ok:dkd_offset===dkd_bytes.length && dkd_vertices===5942 && dkd_faces===11244 && dkd_invalid===0,dkd_offset,len:dkd_bytes.length,dkd_meshCount,dkd_vertices,dkd_faces,dkd_invalid};
  } catch (dkd_error) { return {ok:false,stage:'exception',message:String(dkd_error)}; }
}

test('v0.3 scooter + sürücü paketleme stratejisi doğrulanır', () => {
  const dkd_chunks=Array.from({length:9},(dkd_value,dkd_index)=>dkd_readModelChunk(dkd_index));
  const dkd_separate=Buffer.concat(dkd_chunks.map(dkd_chunk=>Buffer.from(dkd_chunk,'base64')));
  const dkd_join=Buffer.from(dkd_chunks.join(''),'base64');
  const dkd_unpadded=Buffer.from(dkd_chunks.map((dkd_chunk,dkd_index)=>dkd_index<dkd_chunks.length-1?dkd_chunk.replace(/=+$/,''):dkd_chunk).join(''),'base64');
  const dkd_result={
    chunkMeta:dkd_chunks.map(dkd_chunk=>({len:dkd_chunk.length,mod4:dkd_chunk.length%4,end:dkd_chunk.slice(-8),padding:(dkd_chunk.match(/=+$/)||[''])[0].length})),
    separate:dkd_probe(dkd_separate), join:dkd_probe(dkd_join), unpadded:dkd_probe(dkd_unpadded)
  };
  assert.ok(dkd_result.separate.ok || dkd_result.join.ok || dkd_result.unpadded.ok, JSON.stringify(dkd_result));
});

test('v0.3 is wired into build, settings, arrows, phone and automatic delivery', () => {
  const dkd_build = dkd_fs.readFileSync(dkd_path.join(dkd_root, 'scripts/dkd-build-game.mjs'), 'utf8');
  const dkd_patch = dkd_fs.readFileSync(dkd_path.join(dkd_root, 'game/dkd-v03-patch.mjs'), 'utf8');
  const dkd_fix = dkd_fs.readFileSync(dkd_path.join(dkd_root, 'game/dkd-v03-runtime-fix.mjs'), 'utf8');
  const dkd_package = JSON.parse(dkd_fs.readFileSync(dkd_path.join(dkd_root, 'package.json'), 'utf8'));
  const dkd_app = JSON.parse(dkd_fs.readFileSync(dkd_path.join(dkd_root, 'app.json'), 'utf8'));
  assert.equal(dkd_package.version, '0.3.0'); assert.equal(dkd_app.expo.version, '0.3.0'); assert.equal(dkd_app.expo.android.versionCode, 300); assert.equal(dkd_app.expo.extra.dkd_versionLabel, 'v0.3');
  assert.match(dkd_build,/dkd-v03-model-0\.mjs/); assert.match(dkd_build,/dkd-v03-patch\.mjs/); assert.match(dkd_build,/dkd-v03-runtime-fix\.mjs/); assert.match(dkd_build,/v0\.3/);
  assert.match(dkd_patch,/dkd_assist = false/); assert.match(dkd_patch,/dkd_camera = 'high'/); assert.match(dkd_fix,/dkd_arrowGeometry\.rotateX\(-Math\.PI \/ 2\)/); assert.match(dkd_fix,/dkd_rotation: \[0, dkd_heading, 0\]/); assert.match(dkd_patch,/DraBornGo \//); assert.match(dkd_patch,/dkd_arrivalDistance > 10/); assert.match(dkd_patch,/dkd_v03GarageZoom/); assert.match(dkd_patch,/Neon Vardiya/);
});

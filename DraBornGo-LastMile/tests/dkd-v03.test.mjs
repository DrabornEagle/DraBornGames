import test from 'node:test';
import assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs';
import * as dkd_path from 'node:path';
import { execFileSync as dkd_execFileSync } from 'node:child_process';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';

const dkd_root = dkd_path.resolve(dkd_path.dirname(dkd_fileURLToPath(import.meta.url)), '..');
function dkd_extract(dkd_text, dkd_label) {
  const dkd_match = dkd_text.match(/=\s*"([A-Za-z0-9+/=]+)"\s*;/);
  assert.ok(dkd_match, `${dkd_label} okunamadı.`);
  return dkd_match[1];
}
function dkd_readModelChunk(dkd_index) {
  return dkd_extract(dkd_fs.readFileSync(dkd_path.join(dkd_root, `game/dkd-v03-model-${dkd_index}.mjs`), 'utf8'), `v0.3 model parçası ${dkd_index}`);
}
function dkd_gitShow(dkd_pathName) {
  return dkd_execFileSync('git', ['show', `origin/archive/DraBornGo-LastMile-v0.3-model-recovery:${dkd_pathName}`], { encoding:'utf8', cwd:dkd_path.resolve(dkd_root,'..') });
}
function dkd_probe(dkd_bytes) {
  try {
    if (dkd_bytes.subarray(0,4).toString('ascii')!=='DK31') return {ok:false,stage:'signature',len:dkd_bytes.length};
    const dkd_view=new DataView(dkd_bytes.buffer,dkd_bytes.byteOffset,dkd_bytes.byteLength); const dkd_meshCount=dkd_view.getUint16(4,true);
    let dkd_offset=6,dkd_vertices=0,dkd_faces=0,dkd_invalid=0;
    for(let dkd_meshIndex=0;dkd_meshIndex<dkd_meshCount;dkd_meshIndex++){
      if(dkd_offset+35>dkd_bytes.length)return{ok:false,stage:'header',dkd_meshIndex,dkd_offset,len:dkd_bytes.length};
      const dkd_vertexCount=dkd_view.getUint16(dkd_offset,true),dkd_faceCount=dkd_view.getUint16(dkd_offset+2,true);
      if(dkd_vertexCount<3||dkd_vertexCount>12000||dkd_faceCount<1||dkd_faceCount>24000)return{ok:false,stage:'counts',dkd_meshIndex,dkd_offset,dkd_vertexCount,dkd_faceCount};
      dkd_vertices+=dkd_vertexCount;dkd_faces+=dkd_faceCount;dkd_offset+=35+dkd_vertexCount*3;
      if(dkd_offset>dkd_bytes.length)return{ok:false,stage:'positions',dkd_meshIndex,dkd_offset,len:dkd_bytes.length};
      let dkd_previousIndex=0;
      for(let dkd_index=0;dkd_index<dkd_faceCount*3;dkd_index++){
        let dkd_unsigned=0,dkd_shift=0,dkd_byte=0;
        do{if(dkd_offset>=dkd_bytes.length)return{ok:false,stage:'index-eof',dkd_meshIndex,dkd_index,dkd_offset};dkd_byte=dkd_bytes[dkd_offset++];dkd_unsigned|=(dkd_byte&0x7f)<<dkd_shift;dkd_shift+=7;if(dkd_shift>28)return{ok:false,stage:'varint',dkd_meshIndex,dkd_index,dkd_offset};}while(dkd_byte&0x80);
        const dkd_delta=(dkd_unsigned>>>1)^-(dkd_unsigned&1);dkd_previousIndex+=dkd_delta;if(dkd_previousIndex<0||dkd_previousIndex>=dkd_vertexCount)dkd_invalid++;
      }
    }
    return{ok:dkd_offset===dkd_bytes.length&&dkd_vertices===5942&&dkd_faces===11244&&dkd_invalid===0,dkd_offset,len:dkd_bytes.length,dkd_meshCount,dkd_vertices,dkd_faces,dkd_invalid};
  }catch(dkd_error){return{ok:false,stage:'exception',message:String(dkd_error)}}
}

test('v0.3 model kurtarma kaynağı doğrulanır',()=>{
  const dkd_originalChunks=Array.from({length:9},(dkd_value,dkd_index)=>dkd_readModelChunk(dkd_index));
  const dkd_original=Buffer.from(dkd_originalChunks.join(''),'base64');
  const dkd_archiveChunks=Array.from({length:9},(dkd_value,dkd_index)=>dkd_extract(dkd_gitShow(`DraBornGo-LastMile/game/dkd-v03-model-${dkd_index}.mjs`),`archive model ${dkd_index}`));
  const dkd_archive=Buffer.concat(dkd_archiveChunks.map(dkd_chunk=>Buffer.from(dkd_chunk,'base64')));
  const dkd_verifiedBase64=Array.from({length:9},(dkd_value,dkd_index)=>dkd_extract(dkd_gitShow(`DraBornGo-LastMile/game/dkd-v03-data-${String(dkd_index).padStart(2,'0')}.mjs`),`verified ${dkd_index}`)).join('');
  const dkd_verified=Buffer.from(dkd_verifiedBase64,'base64');
  const dkd_repairedOriginal=Buffer.concat([dkd_verified,dkd_original.subarray(dkd_verified.length)]);
  const dkd_repairedArchive=Buffer.concat([dkd_verified,dkd_archive.subarray(dkd_verified.length)]);
  const dkd_result={verifiedLength:dkd_verified.length,originalLength:dkd_original.length,archiveLength:dkd_archive.length,original:dkd_probe(dkd_original),archive:dkd_probe(dkd_archive),repairedOriginal:dkd_probe(dkd_repairedOriginal),repairedArchive:dkd_probe(dkd_repairedArchive)};
  assert.ok(dkd_result.repairedOriginal.ok||dkd_result.repairedArchive.ok,JSON.stringify(dkd_result));
});

test('v0.3 is wired into build, settings, arrows, phone and automatic delivery',()=>{
  const dkd_build=dkd_fs.readFileSync(dkd_path.join(dkd_root,'scripts/dkd-build-game.mjs'),'utf8');const dkd_patch=dkd_fs.readFileSync(dkd_path.join(dkd_root,'game/dkd-v03-patch.mjs'),'utf8');const dkd_fix=dkd_fs.readFileSync(dkd_path.join(dkd_root,'game/dkd-v03-runtime-fix.mjs'),'utf8');const dkd_package=JSON.parse(dkd_fs.readFileSync(dkd_path.join(dkd_root,'package.json'),'utf8'));const dkd_app=JSON.parse(dkd_fs.readFileSync(dkd_path.join(dkd_root,'app.json'),'utf8'));
  assert.equal(dkd_package.version,'0.3.0');assert.equal(dkd_app.expo.version,'0.3.0');assert.equal(dkd_app.expo.android.versionCode,300);assert.equal(dkd_app.expo.extra.dkd_versionLabel,'v0.3');assert.match(dkd_build,/dkd-v03-model-0\.mjs/);assert.match(dkd_build,/dkd-v03-patch\.mjs/);assert.match(dkd_build,/dkd-v03-runtime-fix\.mjs/);assert.match(dkd_build,/v0\.3/);assert.match(dkd_patch,/dkd_assist = false/);assert.match(dkd_patch,/dkd_camera = 'high'/);assert.match(dkd_fix,/dkd_arrowGeometry\.rotateX\(-Math\.PI \/ 2\)/);assert.match(dkd_fix,/dkd_rotation: \[0, dkd_heading, 0\]/);assert.match(dkd_patch,/DraBornGo \//);assert.match(dkd_patch,/dkd_arrivalDistance > 10/);assert.match(dkd_patch,/dkd_v03GarageZoom/);assert.match(dkd_patch,/Neon Vardiya/);
});

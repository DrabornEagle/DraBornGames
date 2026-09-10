import * as dkd_fs from 'node:fs/promises';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';
import { createHash as dkd_createHash } from 'node:crypto';
import dkd_ts from 'typescript';

const dkd_root = dkd_path.resolve(dkd_path.dirname(dkd_fileURLToPath(import.meta.url)), '..');
const dkd_output = dkd_path.resolve(process.env.DKD_WEB_OUTPUT || dkd_path.join(dkd_root, 'dist-web'));
const dkd_app = await dkd_fs.readFile(dkd_path.join(dkd_root, 'App.tsx'), 'utf8');
// Compile the actual Android message handler for the browser. Account, job and
// save behavior has one source; only device APIs have browser implementations.
function dkd_slice(dkd_start, dkd_end) {
  const dkd_offset = dkd_app.indexOf(dkd_start);
  const dkd_limit = dkd_app.indexOf(dkd_end, dkd_offset);
  if (dkd_offset < 0 || dkd_limit < 0) throw new Error(`Web köprü üretim noktası eksik: ${dkd_start}`);
  return dkd_app.slice(dkd_offset, dkd_limit);
}
const dkd_constants = dkd_slice('const dkd_saveKey', 'type dkd_Payload');
const dkd_helpers = dkd_slice('  const dkd_storeSession', '  dkd_useEffect');
const dkd_handler = dkd_slice('  const dkd_onMessage', '\n  return dkd_createElement');
const dkd_adapter = await dkd_fs.readFile(dkd_path.join(dkd_root, 'web/dkd-browser-adapter.js'), 'utf8');
const dkd_bridge = dkd_ts.transpileModule(`(()=>{${dkd_constants}\n${dkd_adapter}\n${dkd_helpers}\n${dkd_handler}\nwindow.ReactNativeWebView={postMessage:dkd_raw=>void dkd_onMessage({nativeEvent:{data:dkd_raw}})};})();`, {
  compilerOptions: { target: dkd_ts.ScriptTarget.ES2020, module: dkd_ts.ModuleKind.None },
}).outputText;
const dkd_nativeHtml = await dkd_fs.readFile(dkd_path.join(dkd_root, 'assets/dkd-lastmile.html'), 'utf8');
const dkd_html = dkd_nativeHtml
  .replace("connect-src 'none'", "connect-src 'self' https://guuwomvszlwhkmstewfl.supabase.co")
  .replace('/*DKD_BOOTSTRAP*/', dkd_bridge.replace(/<\/script/gi, '<\\/script'));
const dkd_meta = JSON.parse(await dkd_fs.readFile(dkd_path.join(dkd_root, 'app.json'), 'utf8')).expo;
await dkd_fs.mkdir(dkd_output, { recursive: true });
await dkd_fs.writeFile(dkd_path.join(dkd_output, 'index.html'), dkd_html);
await dkd_fs.writeFile(dkd_path.join(dkd_output, 'version.json'), JSON.stringify({
  dkd_version: dkd_meta.version,
  dkd_versionCode: dkd_meta.android.versionCode,
  dkd_sourceCommit: process.env.DKD_SOURCE_COMMIT || 'local',
  dkd_nativeSha256: dkd_createHash('sha256').update(dkd_nativeHtml).digest('hex'),
  dkd_webSha256: dkd_createHash('sha256').update(dkd_html).digest('hex'),
  dkd_platforms: ['android', 'web'],
}, null, 2) + '\n');
console.log(`Web hazır: ${dkd_output} · ${dkd_meta.version} · Android ile ortak oyun ve hesap kaynağı`);

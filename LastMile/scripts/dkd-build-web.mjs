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

// Browser bootstrap uses the same visual language as the native React loader. It is
// intentionally self-contained because the game bundle is a single offline-capable HTML.
const dkd_webLoaderCss = `<style id="dkd-web-bootstrap-style">
#dkd-loading{display:none!important}
#dkd-web-bootstrap{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:20px;background:#081426;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;animation:dkd-web-loader-exit .25s ease 1.55s forwards}
#dkd-web-bootstrap *{box-sizing:border-box}.dkd-web-loader-card{width:min(400px,100%);padding:18px;border:1px solid #31597a;border-top:7px solid #67dfd1;border-radius:28px;background:#122741;color:#fff}.dkd-web-loader-top{display:flex;align-items:center;justify-content:space-between;gap:10px}.dkd-web-loader-brand{display:flex;align-items:center;gap:8px;color:#80e4d7;font-size:10px;font-weight:900;letter-spacing:1.5px}.dkd-web-loader-dot{width:11px;height:11px;border-radius:50%;background:#e4ff5e;animation:dkd-web-loader-dot 1s ease-in-out infinite alternate}.dkd-web-loader-version{color:#b8c8dc;font-size:10px;font-weight:900}.dkd-web-loader-main{display:flex;align-items:center;gap:15px;margin-top:24px}.dkd-web-loader-mark{width:76px;height:76px;flex:0 0 76px;display:grid;place-items:center;border:1px solid #5479a4;border-radius:24px;background:#1d3a5c}.dkd-web-loader-spinner{width:36px;height:36px;border:4px solid #416385;border-top-color:#e4ff5e;border-right-color:#67dfd1;border-radius:50%;animation:dkd-web-loader-spin .8s linear infinite}.dkd-web-loader-copy h1{margin:0;color:#fff;font-size:26px;line-height:30px;font-weight:900;letter-spacing:1.2px}.dkd-web-loader-copy p{margin:5px 0 0;color:#aabed4;font-size:14px;font-weight:700}.dkd-web-loader-route{position:relative;overflow:hidden;height:15px;margin-top:25px;border:1px solid #3d607e;border-radius:999px;background:#0a1a2e}.dkd-web-loader-route:before{content:"";position:absolute;left:10px;right:10px;top:5px;height:3px;border-radius:3px;background:#35506d}.dkd-web-loader-runner{position:absolute;left:50%;top:3px;width:58px;height:7px;margin-left:-29px;border-radius:7px;background:#67dfd1;animation:dkd-web-loader-route 1.15s ease-in-out infinite alternate}.dkd-web-loader-colors{display:flex;gap:7px;margin-top:13px}.dkd-web-loader-colors i{display:block;height:6px;border-radius:6px}.dkd-web-loader-colors i:nth-child(1){flex:1.5;background:#67dfd1}.dkd-web-loader-colors i:nth-child(2){flex:1;background:#78a6ff}.dkd-web-loader-colors i:nth-child(3){flex:.8;background:#dc8ebe}.dkd-web-loader-colors i:nth-child(4){flex:.55;background:#e4ff5e}.dkd-web-loader-footer{display:flex;justify-content:space-between;margin-top:14px;color:#83a0bb;font-size:9px;font-weight:900;letter-spacing:1px}
@keyframes dkd-web-loader-spin{to{transform:rotate(360deg)}}@keyframes dkd-web-loader-route{from{transform:translateX(-92px)}to{transform:translateX(92px)}}@keyframes dkd-web-loader-dot{from{transform:scale(.82)}to{transform:scale(1.08)}}@keyframes dkd-web-loader-exit{to{opacity:0;visibility:hidden;pointer-events:none}}
@media(prefers-reduced-motion:reduce){#dkd-web-bootstrap,.dkd-web-loader-dot,.dkd-web-loader-spinner,.dkd-web-loader-runner{animation-duration:.01ms!important;animation-iteration-count:1!important}}
</style>`;
const dkd_webLoaderHtml = `<div id="dkd-web-bootstrap" aria-label="Son Kilometre yükleniyor"><div class="dkd-web-loader-card"><div class="dkd-web-loader-top"><div class="dkd-web-loader-brand"><span class="dkd-web-loader-dot"></span>DRABORNGO · LAST MILE</div><span class="dkd-web-loader-version">v0.7.5</span></div><div class="dkd-web-loader-main"><div class="dkd-web-loader-mark"><span class="dkd-web-loader-spinner"></span></div><div class="dkd-web-loader-copy"><h1>SON KİLOMETRE</h1><p>Şehrin hazırlanıyor…</p></div></div><div class="dkd-web-loader-route"><span class="dkd-web-loader-runner"></span></div><div class="dkd-web-loader-colors"><i></i><i></i><i></i><i></i></div><div class="dkd-web-loader-footer"><span>ROTA</span><span>KURYE</span><span>SİPARİŞLER</span><span>ŞEHİR</span></div></div></div>`;

let dkd_html = dkd_nativeHtml
  .replace("connect-src 'none'", "connect-src 'self' https://guuwomvszlwhkmstewfl.supabase.co")
  .replace('/*DKD_BOOTSTRAP*/', dkd_bridge.replace(/<\/script/gi, '<\\/script'));
if (!dkd_html.includes('<body')) throw new Error('Web yükleme ekranı için body bulunamadı.');
dkd_html = dkd_html
  .replace('</head>', `${dkd_webLoaderCss}</head>`)
  .replace(/<body([^>]*)>/i, `<body$1>${dkd_webLoaderHtml}`);

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
console.log(`Web hazır: ${dkd_output} · ${dkd_meta.version} · modern bootstrap loader · Android ile ortak oyun ve hesap kaynağı`);

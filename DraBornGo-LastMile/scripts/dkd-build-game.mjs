import * as dkd_fs from 'node:fs/promises';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';
import { gunzipSync as dkd_gunzipSync } from 'node:zlib';
import { createHash as dkd_createHash } from 'node:crypto';
import { minify as dkd_minify } from 'terser';

const dkd_root = dkd_path.resolve(dkd_path.dirname(dkd_fileURLToPath(import.meta.url)), '..');
// Historical v0.4/v0.5/v0.6 compatibility layers remain bundled beneath the authoritative v0.6.1 runtime.
const dkd_sources = [
  'data/dkd-roads.mjs',
  'dkd-data.mjs',
  'dkd-core.mjs',
  'dkd-renderer.mjs',
  'dkd-audio.mjs',
  'dkd-ui.mjs',
  'dkd-controller.mjs',
  'dkd-v02-scooter-0.mjs',
  'dkd-v02-scooter-1.mjs',
  'dkd-v02-scooter-2.mjs',
  'dkd-v02-patch.mjs',
  'dkd-v02-runtime-fix.mjs',
  'dkd-v03-model-0.mjs',
  'dkd-v03-model-1.mjs',
  'dkd-v03-model-2.mjs',
  'dkd-v03-model-3.mjs',
  'dkd-v03-model-4.mjs',
  'dkd-v03-model-5.mjs',
  'dkd-v03-model-6.mjs',
  'dkd-v03-model-7.mjs',
  'dkd-v03-model-8.mjs',
  'dkd-v03-patch.mjs',
  'dkd-v03-runtime-fix.mjs',
  'dkd-v03-visual-hotfix.mjs',
  'dkd-v03-home-refine.mjs',
  'dkd-v03-reuploaded-gzip-0.mjs',
  'dkd-v03-reuploaded-gzip-1.mjs',
  'dkd-v03-reuploaded-gzip-2.mjs',
  'dkd-v03-reuploaded-gzip-3.mjs',
  'dkd-v03-reuploaded-gzip-4.mjs',
  'dkd-v03-reuploaded-gzip-5.mjs',
  'dkd-v03-reuploaded-gzip-6.mjs',
  'dkd-v03-reuploaded-gzip-7.mjs',
  'dkd-v03-reuploaded-gzip-manifest.mjs',
  'dkd-v03-reuploaded-model.mjs',
  'dkd-v04-runtime.mjs',
  'dkd-v04-real-career.mjs',
  'dkd-v04-ui-audio-polish.mjs',
  'dkd-v04-traffic-obstacles.mjs',
  'dkd-v04-route-traffic-density.mjs',
  'dkd-v05-style.mjs',
  'dkd-v05-audio.mjs',
  'dkd-v05-traffic.mjs',
  'dkd-v05-vault.mjs',
  'dkd-v05-garage-hotfix.mjs',
  'dkd-v05-capacity-flow.mjs',
  'dkd-v05-roadwork-audio-hotfix.mjs',
  'dkd-v05-city-audio-sign-hotfix.mjs',
  'dkd-v05-palm-roadedge-hotfix.mjs',
  'dkd-v05-sign-layout-hotfix.mjs',
  'dkd-v05-live-season-admin.mjs',
  'dkd-v05-live-season-verification.mjs',
  'dkd-v05-drive-collision-shift-sign-hotfix.mjs',
  'avatars/dkd_selin.mjs',
  'avatars/dkd_ece.mjs',
  'avatars/dkd_mira.mjs',
  'avatars/dkd_deniz.mjs',
  'avatars/dkd_lara.mjs',
  'avatars/dkd_ada.mjs',
  'avatars/dkd_asya.mjs',
  'avatars/dkd_irem.mjs',
  'avatars/dkd_duru.mjs',
  'avatars/dkd_emre.mjs',
  'dkd-v06-release.mjs',
  'avatars/pool/dkd_customer_pool_00.mjs',
  'avatars/pool/dkd_customer_pool_01.mjs',
  'avatars/pool/dkd_customer_pool_02.mjs',
  'avatars/pool/dkd_customer_pool_03.mjs',
  'avatars/pool/dkd_customer_pool_04.mjs',
  'avatars/pool/dkd_customer_pool_05.mjs',
  'avatars/pool/dkd_customer_pool_06.mjs',
  'avatars/pool/dkd_customer_pool_07.mjs',
  'avatars/pool/dkd_customer_pool_08.mjs',
  'avatars/pool/dkd_customer_pool_finalize.mjs',
  'dkd-v06-customer-pool.mjs',
  'models/v061/dkd-v061-model-0.mjs',
  'models/v061/dkd-v061-model-1.mjs',
  'models/v061/dkd-v061-model-2.mjs',
  'models/v061/dkd-v061-model-3.mjs',
  'models/v061/dkd-v061-model-4.mjs',
  'models/v061/dkd-v061-model-5.mjs',
  'models/v061/dkd-v061-model-manifest.mjs',
  'dkd-v061-release.mjs',
  'dkd-v061-device-hotfix.mjs',
  'dkd-v061-runtime-repair.mjs'
];

const dkd_v061ChunkFiles = [
  'models/v061/dkd-v061-model-0.mjs',
  'models/v061/dkd-v061-model-1.mjs',
  'models/v061/dkd-v061-model-2.mjs',
  'models/v061/dkd-v061-model-3.mjs',
  'models/v061/dkd-v061-model-4.mjs',
  'models/v061/dkd-v061-model-5.mjs',
];

async function dkd_prepareV061RawModel() {
  const dkd_parts = await Promise.all(dkd_v061ChunkFiles.map(async dkd_file => {
    const dkd_source = await dkd_fs.readFile(dkd_path.join(dkd_root, 'game', dkd_file), 'utf8');
    const dkd_match = dkd_source.match(/=\s*['"]([A-Za-z0-9+/=]+)['"]\s*;/);
    if (!dkd_match) throw new Error(`v0.6.1 model parçası okunamadı: ${dkd_file}`);
    return dkd_match[1];
  }));
  // Each checked-in part is base64-encoded independently. Decode each part first;
  // concatenating padded base64 strings corrupts the gzip stream on Android/WebView.
  const dkd_compressed = Buffer.concat(dkd_parts.map(dkd_part => Buffer.from(dkd_part, 'base64')));
  const dkd_raw = dkd_gunzipSync(dkd_compressed);
  if (dkd_raw.length !== 29530 || dkd_raw.subarray(0, 4).toString('ascii') !== 'DK61') {
    throw new Error(`v0.6.1 model paketi geçersiz: ${dkd_raw.length} bayt`);
  }
  const dkd_sha = dkd_createHash('sha256').update(dkd_raw).digest('hex');
  if (dkd_sha !== '8dc66ee133b1651571ebfcd8c74238b091c45a4a9405ea25a2bf57c62f51e2a1') {
    throw new Error(`v0.6.1 model SHA-256 doğrulaması başarısız: ${dkd_sha}`);
  }
  return dkd_raw.toString('base64');
}

const dkd_v061ModelRawBase64 = await dkd_prepareV061RawModel();

const dkd_mediaFiles = [
  { dkd_file: 'audio/dkd-menu-ankara-gece.mp3', dkd_name: 'Ankara Gece Merkezi', dkd_sub: 'Nightwave', dkd_bpm: 96, dkd_mode: 'menu' },
  { dkd_file: 'audio/dkd-drive-kizilay-hatti.mp3', dkd_name: 'Kızılay Hattı', dkd_sub: 'Urban Electro', dkd_bpm: 128, dkd_mode: 'drive' },
  { dkd_file: 'audio/dkd-drive-gece-vardiyasi.mp3', dkd_name: 'Gece Vardiyası', dkd_sub: 'Deep Drive', dkd_bpm: 122, dkd_mode: 'drive' },
  { dkd_file: 'audio/dkd-drive-yagmur-asfalti.mp3', dkd_name: 'Yağmur Asfaltı', dkd_sub: 'Liquid Night', dkd_bpm: 116, dkd_mode: 'drive' },
  { dkd_file: 'audio/dkd-drive-cankaya-pulse.mp3', dkd_name: 'Çankaya Pulse', dkd_sub: 'Breakbeat', dkd_bpm: 132, dkd_mode: 'drive' },
  { dkd_file: 'audio/dkd-drive-son-paket.mp3', dkd_name: 'Son Paket', dkd_sub: 'Cinematic Drive', dkd_bpm: 118, dkd_mode: 'drive' },
];

const dkd_mediaAssets = await Promise.all(dkd_mediaFiles.map(async dkd_media => {
  const dkd_bytes = await dkd_fs.readFile(dkd_path.join(dkd_root, 'game', dkd_media.dkd_file));
  return { ...dkd_media, dkd_data: `data:audio/mpeg;base64,${dkd_bytes.toString('base64')}` };
}));

const dkd_threeCode = await dkd_fs.readFile(dkd_path.join(dkd_root, 'node_modules/three/build/three.cjs'), 'utf8');
const dkd_modules = await Promise.all(dkd_sources.map(async dkd_file => {
  let dkd_source = await dkd_fs.readFile(dkd_path.join(dkd_root, 'game', dkd_file), 'utf8');
  if (dkd_file === 'dkd-data.mjs') {
    dkd_source = dkd_source.replace("export const dkd_version = 'v0.101';", "export const dkd_version = 'v0.6.1';");
    dkd_source = dkd_source.replace(/export const dkd_demoRankings = \[[\s\S]*?\];/, 'export const dkd_demoRankings = [];');
  }
  return dkd_source
    .replace(/^import .*?;\s*$/gm, '')
    .replace(/^export (?=(const|class|function)\s)/gm, '');
}));

const dkd_mediaCode = `const dkd_v05MediaAssets=${JSON.stringify(dkd_mediaAssets)};`;
const dkd_modelCode = `const dkd_v061ModelRawBase64=${JSON.stringify(dkd_v061ModelRawBase64)};`;
const dkd_code = `(()=>{const dkd_three=(()=>{const exports={};${dkd_threeCode};return exports;})();${dkd_mediaCode}${dkd_modelCode}${dkd_modules.join('\n')}new dkd_Game();})();`;
const dkd_bundle = await dkd_minify(dkd_code, {
  ecma: 2020,
  compress: { passes: 1 },
  mangle: false,
  format: { comments: /@license|SPDX/ }
});
if (!dkd_bundle.code) throw new Error('Oyun paketi üretilemedi.');

const dkd_css = await dkd_fs.readFile(dkd_path.join(dkd_root, 'game/dkd-style.css'), 'utf8');
const dkd_html = `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover"/><meta name="theme-color" content="#0c1224"/><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src 'self'; media-src data: blob:; connect-src 'none'; base-uri 'none'; form-action 'none'"/><title>DraBornGo / SON KİLOMETRE · v0.6.1</title><style>${dkd_css}</style></head><body><div id="dkd-shell"><canvas id="dkd-canvas" aria-label="3D kurye oyun sahnesi"></canvas><main id="dkd-ui"></main><div id="dkd-modal"></div><div id="dkd-toast" role="status" aria-live="polite"></div><div class="dkd-loading" id="dkd-loading"><div class="dkd-spinner"></div><b>SON KİLOMETRE</b><small>Şehrin hazırlanıyor…</small></div></div><script>/*DKD_BOOTSTRAP*/</script><script>${dkd_bundle.code.replace(/<\/script/gi, '<\\/script')}</script></body></html>`;

await dkd_fs.mkdir(dkd_path.join(dkd_root, 'src/generated'), { recursive: true });
await dkd_fs.writeFile(
  dkd_path.join(dkd_root, 'src/generated/dkd-game-html.ts'),
  `// Generated by scripts/dkd-build-game.mjs. Do not hand-edit.\nexport const dkd_gameHtml = ${JSON.stringify(dkd_html)};\n`
);
await dkd_fs.writeFile(dkd_path.join(dkd_root, 'assets/dkd-lastmile.html'), dkd_html);
console.log(`DKD oyun paketi hazır: ${(Buffer.byteLength(dkd_html) / 1024 / 1024).toFixed(2)} MB. v0.6.1 · cihaz-uyumlu Yamaha+sürücü yön düzeltmesi · 54 BPM Kurye Merkezi · ardışık sürüş müzikleri · görev/kapasite/gizlilik/profil onarımları · Supabase native köprü.`);

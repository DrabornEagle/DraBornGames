import * as dkd_fs from 'node:fs/promises';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath, pathToFileURL as dkd_pathToFileURL } from 'node:url';

const dkd_scriptsDir = dkd_path.dirname(dkd_fileURLToPath(import.meta.url));
const dkd_baseFile = dkd_path.join(dkd_scriptsDir, 'dkd-build-game.mjs');
const dkd_generatedFile = dkd_path.join(dkd_scriptsDir, '.dkd-build-game-v07.generated.mjs');

let dkd_source = await dkd_fs.readFile(dkd_baseFile, 'utf8');
const dkd_sourceNeedle = "  'dkd-v061-final-device-fix.mjs'\n];";
const dkd_sourceReplacement = "  'dkd-v061-final-device-fix.mjs',\n  'dkd-v07-release.mjs'\n];";
if (!dkd_source.includes(dkd_sourceNeedle)) throw new Error('v0.7 kaynak ekleme noktası bulunamadı.');
dkd_source = dkd_source.replace(dkd_sourceNeedle, dkd_sourceReplacement);

// Keep the stable v0.6.1 builder untouched in Git history while generating a v0.7 bundle.
dkd_source = dkd_source.replaceAll('v0.6.1', 'v0.7.0');
dkd_source = dkd_source
  .replace("dkd_name: 'Ankara Gece Merkezi', dkd_sub: 'Nightwave', dkd_bpm: 96", "dkd_name: 'Kurye Merkezi / Gece', dkd_sub: 'Night Ops', dkd_bpm: 82")
  .replace("dkd_name: 'Kızılay Hattı', dkd_sub: 'Urban Electro', dkd_bpm: 128", "dkd_name: 'Gece Ekspres', dkd_sub: 'Urban Drive', dkd_bpm: 128")
  .replace("dkd_name: 'Gece Vardiyası', dkd_sub: 'Deep Drive', dkd_bpm: 122", "dkd_name: 'Asfalt Vardiyası', dkd_sub: 'Road Bass', dkd_bpm: 124")
  .replace("dkd_name: 'Yağmur Asfaltı', dkd_sub: 'Liquid Night', dkd_bpm: 116", "dkd_name: 'Yağmur Rotası', dkd_sub: 'Wet Asphalt', dkd_bpm: 118")
  .replace("dkd_name: 'Çankaya Pulse', dkd_sub: 'Breakbeat', dkd_bpm: 132", "dkd_name: 'Şehir Baskısı', dkd_sub: 'Break Drive', dkd_bpm: 136")
  .replace("dkd_name: 'Son Paket', dkd_sub: 'Cinematic Drive', dkd_bpm: 118", "dkd_name: '03:17 / Son Teslimat', dkd_sub: 'Final Contract', dkd_bpm: 112");

await dkd_fs.writeFile(dkd_generatedFile, dkd_source);
try {
  await import(`${dkd_pathToFileURL(dkd_generatedFile).href}?dkd_v07=${Date.now()}`);
} finally {
  await dkd_fs.rm(dkd_generatedFile, { force: true });
}

import * as dkd_fs from 'node:fs/promises';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath, pathToFileURL as dkd_pathToFileURL } from 'node:url';

const dkd_scriptsDir = dkd_path.dirname(dkd_fileURLToPath(import.meta.url));
const dkd_baseFile = dkd_path.join(dkd_scriptsDir, 'dkd-build-game.mjs');
const dkd_generatedFile = dkd_path.join(dkd_scriptsDir, '.dkd-build-game-v07.generated.mjs');

let dkd_source = await dkd_fs.readFile(dkd_baseFile, 'utf8');
const dkd_sourceNeedle = "'dkd-v061-final-device-fix.mjs'";
const dkd_sourceReplacement = "'dkd-v061-final-device-fix.mjs','dkd-v07-release.mjs','dkd-v07-premium-rider.mjs','dkd-v07-google-play.mjs','dkd-v072-release.mjs','dkd-v072-hotfix.mjs','dkd-v073-expo.mjs'";
if (!dkd_source.includes(dkd_sourceNeedle)) throw new Error('v0.7 kaynak ekleme noktası bulunamadı.');
dkd_source = dkd_source.replace(dkd_sourceNeedle, dkd_sourceReplacement);

// v0.7.3 şu an Android/Expo test adayıdır. Web deposu bu dalı değil main'i izler.
dkd_source = dkd_source.replaceAll('v0.6.1', 'v0.7.3');
dkd_source = dkd_source
  .replace('Yamaha+sürücü 180° cihaz yön düzeltmesi', 'premium bağımsız kurye · takip/standart kamera')
  .replace('yeni 48 BPM Kurye Merkezi · sürüş/menü kesin ses izolasyonu · ardışık sürüş müzikleri', 'InnerLight ana menü · SeMeNota vardiya sürüşü · iki fiziksel MP3 dışında müzik yok');

await dkd_fs.writeFile(dkd_generatedFile, dkd_source);
try {
  await import(`${dkd_pathToFileURL(dkd_generatedFile).href}?dkd_v073=${Date.now()}`);
} finally {
  await dkd_fs.rm(dkd_generatedFile, { force: true });
}

import * as dkd_fs from 'node:fs/promises';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';

const dkd_scriptsDir = dkd_path.dirname(dkd_fileURLToPath(import.meta.url));
const dkd_root = dkd_path.resolve(dkd_scriptsDir, '..');
const dkd_bootstrapMarker = '/*DKD_BOOTSTRAP*/';
const dkd_playBootstrap = `${dkd_bootstrapMarker}window.dkd_googlePlayBuild=true;`;

for (const dkd_relativePath of ['assets/dkd-lastmile.html', 'src/generated/dkd-game-html.ts']) {
  const dkd_pathname = dkd_path.join(dkd_root, dkd_relativePath);
  let dkd_source = await dkd_fs.readFile(dkd_pathname, 'utf8');
  if (!dkd_source.includes(dkd_bootstrapMarker)) throw new Error(`Google Play bootstrap işareti bulunamadı: ${dkd_relativePath}`);
  if (!dkd_source.includes(dkd_playBootstrap)) {
    dkd_source = dkd_source.replace(dkd_bootstrapMarker, dkd_playBootstrap);
    await dkd_fs.writeFile(dkd_pathname, dkd_source);
  }
}

const dkd_appPath = dkd_path.join(dkd_root, 'app.json');
const dkd_app = JSON.parse(await dkd_fs.readFile(dkd_appPath, 'utf8'));
dkd_app.expo.extra = {
  ...(dkd_app.expo.extra || {}),
  dkd_realRewardsEnabled: false,
  dkd_googlePlayBuild: true,
  dkd_googlePlayRewardsMode: 'virtual-only',
  dkd_targetApi: 36,
  dkd_privacyUrl: 'https://www.draborneagle.com/draborngo/lastmile/gizlilik/',
  dkd_accountDeletionUrl: 'https://www.draborneagle.com/draborngo/lastmile/hesap-silme/',
};
const dkd_blocked = new Set(dkd_app.expo.android?.blockedPermissions || []);
for (const dkd_permission of [
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.ACCESS_COARSE_LOCATION',
  'android.permission.CAMERA',
  'android.permission.RECORD_AUDIO',
  'android.permission.READ_CONTACTS',
  'android.permission.READ_MEDIA_IMAGES',
  'android.permission.READ_MEDIA_VIDEO',
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
  'android.permission.MANAGE_EXTERNAL_STORAGE',
  'android.permission.SYSTEM_ALERT_WINDOW',
  'android.permission.DUMP',
  'android.permission.REQUEST_INSTALL_PACKAGES',
  'android.permission.QUERY_ALL_PACKAGES',
  'android.permission.PACKAGE_USAGE_STATS',
]) dkd_blocked.add(dkd_permission);
dkd_app.expo.android = { ...(dkd_app.expo.android || {}), blockedPermissions: [...dkd_blocked] };
await dkd_fs.writeFile(dkd_appPath, `${JSON.stringify(dkd_app, null, 2)}\n`);

console.log('Google Play hazırlığı tamam: API 36 · gerçek dünya ödülü kapalı · Dev Client Play çalışma alanından ayrık · gereksiz hassas/kısıtlı izinler engelli.');

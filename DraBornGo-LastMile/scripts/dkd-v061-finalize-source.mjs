import * as dkd_fs from 'node:fs/promises';
import * as dkd_path from 'node:path';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';

const dkd_root = dkd_path.resolve(dkd_path.dirname(dkd_fileURLToPath(import.meta.url)), '..');

async function dkd_patchFile(dkd_relative, dkd_patch) {
  const dkd_file = dkd_path.join(dkd_root, dkd_relative);
  const dkd_before = await dkd_fs.readFile(dkd_file, 'utf8');
  const dkd_after = dkd_patch(dkd_before);
  if (dkd_after !== dkd_before) await dkd_fs.writeFile(dkd_file, dkd_after);
  console.log(`DKD v0.6.1 ${dkd_after === dkd_before ? 'zaten güncel' : 'güncellendi'}: ${dkd_relative}`);
}

await dkd_patchFile('App.tsx', dkd_source => {
  let dkd_next = dkd_source.replace(
    "import { ActivityIndicator as dkd_ActivityIndicator, AppState as dkd_AppState, BackHandler as dkd_BackHandler, Pressable as dkd_Pressable, Text as dkd_Text, View as dkd_View } from 'react-native';",
    "import { ActivityIndicator as dkd_ActivityIndicator, AppState as dkd_AppState, BackHandler as dkd_BackHandler, Linking as dkd_Linking, Pressable as dkd_Pressable, Text as dkd_Text, View as dkd_View } from 'react-native';",
  );
  if (!dkd_next.includes('const dkd_publicWebBase')) dkd_next = dkd_next.replace(
    "const dkd_edgeUrl = `${dkd_supabaseUrl}/functions/v1/dkd-last-mile-api`;",
    "const dkd_edgeUrl = `${dkd_supabaseUrl}/functions/v1/dkd-last-mile-api`;\nconst dkd_publicWebBase = 'https://www.draborneagle.com/draborngo/lastmile';",
  );
  if (!dkd_next.includes('const dkd_plateNo = String(dkd_data?.dkd_plate_no')) {
    dkd_next = dkd_next.replace(
      "        const dkd_phone = String(dkd_data?.dkd_phone || '').replace(/[^+0-9]/g, '').slice(0, 30);\n        if (!dkd_email || dkd_password.length < 6 || dkd_fullName.length < 3 || !/^[A-Za-z0-9_]{3,22}$/.test(dkd_username) || dkd_companyName.length < 2 || !/^\\+?\\d{10,15}$/.test(dkd_phone)) {",
      "        const dkd_phone = String(dkd_data?.dkd_phone || '').replace(/[^+0-9]/g, '').slice(0, 30);\n        const dkd_plateNo = String(dkd_data?.dkd_plate_no || '').trim().toLocaleUpperCase('tr-TR').replace(/\\s+/g, ' ').slice(0, 15);\n        if (!dkd_email || dkd_password.length < 6 || dkd_fullName.length < 3 || !/^[A-Za-z0-9_]{3,22}$/.test(dkd_username) || dkd_companyName.length < 2 || !/^\\+?\\d{10,15}$/.test(dkd_phone) || !/^[0-9]{2} [A-ZÇĞİÖŞÜ]{1,3} [0-9]{2,4}$/u.test(dkd_plateNo)) {",
    );
    dkd_next = dkd_next.replace(
      "            dkd_company_name: dkd_companyName,\n            dkd_phone,",
      "            dkd_company_name: dkd_companyName,\n            dkd_phone,\n            dkd_plate_no: dkd_plateNo,",
    );
  }
  if (!dkd_next.includes("dkd_message.dkd_type === 'open-url'")) dkd_next = dkd_next.replace(
    "      } else if (dkd_message.dkd_type === 'pick-photo') {",
    "      } else if (dkd_message.dkd_type === 'open-url') {\n        const dkd_url = String(dkd_data?.dkd_url || '').trim();\n        if (!dkd_url.startsWith(`${dkd_publicWebBase}/`) && dkd_url !== `${dkd_publicWebBase}/`) throw new Error('Bu bağlantının açılmasına izin verilmiyor.');\n        await dkd_Linking.openURL(dkd_url);\n      } else if (dkd_message.dkd_type === 'auth-delete-account') {\n        const dkd_result = await dkd_edge('delete_account');\n        if (dkd_result?.dkd_deleted !== true) throw new Error('Hesap silme işlemi doğrulanamadı.');\n        await dkd_storeSession(null);\n        dkd_cloudReady.current = false;\n        dkd_cloudSavePending.current = null;\n        await dkd_AsyncStorage.removeItem(dkd_saveKey);\n        dkd_latestSave.current = 'null';\n        dkd_setBootstrap('null');\n        dkd_receive({ dkd_type: 'auth-account-deleted', dkd_data: { dkd_deleted: true } });\n      } else if (dkd_message.dkd_type === 'pick-photo') {",
  );
  if (!dkd_next.includes('dkd_publicWebBase') || !dkd_next.includes("auth-delete-account") || !dkd_next.includes('dkd_plate_no: dkd_plateNo')) throw new Error('App.tsx v0.6.1 patch doğrulanamadı.');
  return dkd_next;
});

await dkd_patchFile('scripts/dkd-build-game.mjs', dkd_source => {
  let dkd_next = dkd_source.replace("'dkd-v061-runtime.mjs'", "'dkd-v061-release.mjs'");
  if (!dkd_next.includes("models/v061/dkd-v061-model-0.mjs")) dkd_next = dkd_next.replace(
    "  'dkd-v06-customer-pool.mjs',\n];",
    "  'dkd-v06-customer-pool.mjs',\n  'models/v061/dkd-v061-model-0.mjs',\n  'models/v061/dkd-v061-model-1.mjs',\n  'models/v061/dkd-v061-model-2.mjs',\n  'models/v061/dkd-v061-model-3.mjs',\n  'models/v061/dkd-v061-model-4.mjs',\n  'models/v061/dkd-v061-model-5.mjs',\n  'models/v061/dkd-v061-model-manifest.mjs',\n  'dkd-v061-release.mjs'\n];",
  );
  dkd_next = dkd_next.replace("\"export const dkd_version = 'v0.6';\"", "\"export const dkd_version = 'v0.6.1';\"")
    .replace(/SON KİLOMETRE · v0\.6(?!\.1)/g, 'SON KİLOMETRE · v0.6.1')
    .replace(/MB\. v0\.6(?!\.1)/g, 'MB. v0.6.1');
  if (!dkd_next.includes("dkd-v061-release.mjs") || !dkd_next.includes("v0.6.1")) throw new Error('Build script v0.6.1 patch doğrulanamadı.');
  return dkd_next;
});

console.log('DKD v0.6.1 kaynak finalizasyonu tamamlandı.');

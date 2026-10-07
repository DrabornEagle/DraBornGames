# Expo Go 58.0.2 ve çevrimdışı Android kabuğu

Hedef istemci **Android Expo Go 58.0.2**, proje paketi **expo 58.0.2**. APK veya development client üretilmez. Web ve Android aynı `game/main.ts` kodundan üretilen Three.js oyunu çalıştırır; Android üzerinde donanım hızlandırmalı sistem WebView kullanılır. Oyunun kaynakları HTML içine gömülür; ilk Metro yüklemesinden sonra oyun kaynakları için CDN veya sunucu isteği gerekmez. Expo Go geliştirme oturumu için Metro erişimi gerekir.

6 Ekim 2026 tarihinde npm resmi paket metadatası ve `expo@58.0.2/bundledNativeModules.json` kontrol edildi. SDK 58 bu tarihte npm `next` kanalındadır; `latest` kanalı SDK 57'dir. Belirsiz `latest` kurulumu yerine tam sürümler sabitlenmiştir.

| Paket | SDK 58.0.2'nin resmi sürümü | Projedeki sürüm |
| --- | --- | --- |
| expo | 58.0.2 | 58.0.2 |
| react | 19.3.0 | 19.3.0 |
| react-native | 0.88.0-rc.3 | 0.88.0-rc.3 |
| react-native-webview | 14.0.1 | 14.0.1 |
| @react-native-async-storage/async-storage | 2.2.0 | 2.2.0 |
| expo-status-bar | ~58.0.3 | 58.0.3 |

Paket kaynağı: <https://registry.npmjs.org/expo/58.0.2>. Yerelde `node -e "console.log(require('expo/bundledNativeModules.json'))"` ile tekrar denetlenebilir.

`expo@58.0.2` Node.js sürüm koşulu: `^22.13.0 || ^24.3.0 || ^26.0.0 || >=27.0.0`. Termux kurulum betiği `nodejs-lts` kurar. Android Expo Go ile aynı cihazdaki Metro adresi için `--localhost` kullanılır.

SDK'nin resmi React Native sürümü bir `rc` sürümüdür. AsyncStorage'ın npm peer aralığı `>=0.65 <1.0`, npm'in ön sürüm kuralları nedeniyle bu sürümü reddeder. `.npmrc` içindeki `legacy-peer-deps=true`, Expo'nun kendi açıkça eşlediği sürümleri değiştirmeden `npm ci` kurulmasını sağlar. Kilit dosyası depo içinde tutulur.

## Yerel kayıt

Web kayıt anahtarı `drabornland-save-v1`, Android AsyncStorage anahtarı da `drabornland-save-v1` olur. İki cihazın yerel belleği birbirinden bağımsızdır. Supabase veya hesap sunucusu yoktur; cihazlar arası ilerleme oyun menüsündeki kayıt dışa/içe aktarma ile taşınır. Otomatik bulut senkronizasyonu bulunmaz.

Kayıt HTML'nin en başına `window.__NATIVE_SAVE__` olarak eklenir; Android WebView'in her cihazda aynı sırada çalışmayan `injectedJavaScriptBeforeContentLoaded` davranışına bağlı değildir. Oyunun `{type:'save',data:...}` mesajları sıralı yazılır. Android geri tuşu ve uygulamanın arka plana geçişi `draborn:native` olayı üzerinden oyun menüsüne iletilir.

## Doğrulama komutları

```sh
npm ci
npx expo install --check
npm run typecheck
npm run test
npm run build
npm run export:android
npm run preview
```

`export:android` Metro JavaScript/Hermes paketini kontrol eder, APK üretmez. Gerçek Android cihazının WebGL sürücüsü, Expo Go'ya QR/adres ile giriş ve dokunmatik ergonomisi yalnızca fiziksel cihazda doğrulanabilir; masaüstü web testi bu kontrollerin yerine geçmez.

6 Ekim 2026 geliştirme ortamındaki kontrol: Node 24.19.0 ile paket kurulumu, resmi yerel paket sürümleri, Expo public config ve Android Metro/Hermes export başarılı oldu. Export 630 modül ve yaklaşık 3 MB Hermes paketi oluşturdu; APK üretilmedi. `npx expo install --check` çevrimiçi Expo API erişimi bu ortamın ağ proxy'sinde engellendi; `EXPO_OFFLINE=1 npx expo install --check`, kurulu resmi `bundledNativeModules.json` üzerinden “Dependencies are up to date” sonucunu verdi. Ayrıca paket sürümleri npm resmi tarball metadatasıyla ayrı ayrı karşılaştırıldı.

Son kaynak sürümüyle tekrar yapılan kontrolde TypeScript hatası kalmadı. Ortak çevrimdışı HTML yaklaşık 707 KB; Android export 630 modülü 14,3 saniyede paketledi ve `index-c8bdbf64d661a88e8774e3749b960980.hbc` oluşturdu. Yerel test kanıtı `evidence/platform-validation.json` dosyasına yazıldı. Android kayıt onayları artık istek kimliğiyle eşleştirilir; manuel kaydın onayı eski bir otomatik kayıt mesajıyla karışmaz. Kayıt aktarımı, arka plan/geri tuşu davranışı ve başlangıçta kapalı ses ayarı kaynakta denetlendi. Termux kilit dosyasında esbuild'in resmi Android ARM64 0.28.2 paketi bulunur; betik sözdizimi kontrolü geçti. **Fiziksel Android Expo Go ve Termux cihaz testi bu Linux ortamında yapılmadı.**

Son dikey ekran CSS düzeltmesiyle Android export tekrar geçti: 630 modül, 5,9 saniye, `index-bbf6d584077ff9163478eb28aa7b7e70.hbc` (3,047,584 bayt). Yayınlanacak HTML SHA256: `fdd698e7c98542c63814dd44688d699490b4c058a16a3d26247f62a2e5add444`.

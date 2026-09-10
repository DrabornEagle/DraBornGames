# DraBornGo / Last Mile — v0.7 Android Checkpoint

## Aktif sürüm
- versionName: `0.7.0`
- Android versionCode: `1`
- package: `com.draborneagle.lastmile`
- Expo SDK: `57`
- Development client: aktif
- Expo Go hızlı test hattı: korunuyor

## Tamamlananlar
- Kamera ayarları Ayarlar sayfasına geri eklendi.
- İlk v0.7 çalıştırmada sürüş görüş açısı `chase` / `Takip · Standart` olarak uygulanıyor; daha sonraki kullanıcı seçimi korunuyor.
- Ayarlar arayüzü düz renkli, modern ve detaylı v0.7 görünümüne taşındı.
- Ayarlar içindeki eski küçük yardımcı metinler okunabilirlik için büyütüldü.
- Yeni Ayarlar katmanında gradient, glow ve shadow kullanılmıyor.
- Eski başlangıç Yamaha+sürücü birleşik model yükleyicisi City 50 çalışma zamanında devreden çıkarıldı.
- Başlangıç scooterı temiz yerel Three.js geometrisiyle yeniden oluşturuluyor.
- Sürücü motosikletten bağımsız sıfırdan prosedürel 3D grup olarak oluşturuldu: full-face kask/visor, korumalı mont, omuz/göğüs/diz korumaları, eldiven, bot ve reflektif/marka detayları.
- Yeni sürücü pelvis-sele, diz, ayak ve gidon temas noktalarına göre oturur sürüş pozuna hizalandı.
- Çalışma anında sentezlenen eski melodi sistemi v0.7'de kapatıldı.
- Menü ve sürüş için fiziksel MP3 soundtrack katmanı aktif edildi.
- Menü ve sürüş müzik kaynakları birbirinden izole edildi.
- v0.7 MP3 soundtrack GitHub Actions üzerinde deterministik üretiliyor.
- `package-lock.json`, Expo oyun paketi ve üretilmiş kaynaklar autogen ile güncel tutuluyor.
- Premium sürücü değişikliklerinden sonra 177/177 test, TypeScript, Expo dependency ve Android JavaScript export kontrolleri başarılı tamamlandı.
- Son genel check run `34516359038` başarıyla tamamlandı.
- Autogen run `34516056633` başarıyla tamamlandı ve güncel Expo bundle üretildi.
- Supabase runtime metadata v0.7 / versionCode 1 / chase / physical-mp3-only olarak güncellendi.
- Permanent signing keystore public repoya eklenmiyor; `.jks` ve credentials dosyaları ignore altında.
- Aynı permanent key'i kullanan Development APK ve release APK/AAB workflow'ları hazır.
- Android workflow'lar `actions/setup-java@v5` + Java 17 kullanıyor; prebuild öncesi Gradle-cache hatası kaldırıldı.
- Signing secret'ları job geneline verilmek yerine yalnızca doğrulama, keystore ve Gradle imzalama adımlarına sınırlandı.
- GitHub native Android smoke workflow'u eklendi ve başarıyla tamamlandı.
- Native smoke run `34501461560`: Java 17, npm/build/test/typecheck, Expo dependency kontrolü, `expo prebuild --platform android --clean`, Gradle `:app:assembleDebug` ve Android metadata doğrulaması geçti.
- Development workflow secret yokken güvenli unsigned handoff üretip private JKS ile dışarıda imzalanabilecek şekilde güçlendirildi.
- Permanent GitHub signing secret'ları aktif; premium sürücülü Development workflow run `34516359067` doğrudan permanent keystore ile başarıyla tamamlandı.
- Signed artifact `10168217973` (`dkd-lastmile-v0.7.0-development-vc1`) üretildi; unsigned fallback kullanılmadı.
- Güncel signed Development APK `versionName=0.7.0`, `versionCode=1`, `package=com.draborneagle.lastmile`, `build=Expo SDK 57 development client` metadata doğrulamasından geçti.
- Güncel signed Development APK, APK Signature Scheme v2 ile 4096-bit RSA kalıcı sertifika tarafından doğrulanıyor.
- Güncel signed Development APK SHA-256: `26ab0cd4bd07d1e2224558ba98e74c15971cf780efa5adddfb7219ccfe46115b`.
- Termux bootstrap güncellendi: Signing ZIP Downloads klasöründe bulunursa private dizine açılır, `github-secrets-termux.sh` otomatik çalıştırılır, dört GitHub Actions signing secret güvenli `gh secret set` komutlarıyla tanımlanır ve ardından normal sync/Metro akışı başlar.
- Termux güvenli sync mevcut: yerel commit/değişiklikler korunarak GitHub `main` kaynak kabul ediliyor.
- Termux başlatıcısı GitHub `main` dalını yaklaşık 30 saniyede bir kontrol eder; yeni sürümde Metro'yu günceller.
- `scripts/dkd-android-output.sh` ile `development`, `apk` ve `aab` workflow başlatma + artifact indirme akışı eklendi.
- `npm run start:dev-client`, `npm run android:development`, `npm run android:apk`, `npm run android:aab` komutları eklendi.
- README v0.7 Android, Expo Go/Development Client, signing ve Termux akışına göre güncellendi.

## GitHub Actions private signing bağlantısı
GitHub Actions repository secrets altında aşağıdaki dört isim kalıcı olarak kullanılır:
- `DKD_LASTMILE_KEYSTORE_B64`
- `DKD_LASTMILE_KEYSTORE_PASSWORD`
- `DKD_LASTMILE_KEY_ALIAS`
- `DKD_LASTMILE_KEY_PASSWORD`

Özel anahtar veya parolalar bu dosyaya, Supabase'e veya Git geçmişine yazılmaz.

## Kalıcı signing kimliği
- Sertifika SHA-256: `B3:04:2B:12:0C:61:C1:DE:EC:8C:C2:61:9C:55:13:C4:F7:B3:37:8D:81:C6:23:5E:92:85:CC:F6:06:96:09:BC`
- Yeni sürümlerde yeni signing key üretilmeyecek.

## Build hedefleri
- Development APK: `DraBornGo-LastMile-v0.7.0-development-vc1.apk`
- GitHub Development artifact: `dkd-lastmile-v0.7.0-development-vc1`
- Release APK: `dkd-lastmile-v0.7.0-signed-apk-vc1`
- Release AAB: `dkd-lastmile-v0.7.0-signed-aab-vc1`

## Devam kuralı
Bundan sonraki DraBornGo / Last Mile Android APK ve AAB çıktıları yeni bir key üretmeden aynı `DKD_LASTMILE_*` permanent signing identity ile imzalanmalıdır.

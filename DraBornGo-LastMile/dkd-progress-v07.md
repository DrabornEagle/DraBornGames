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
- Varsayılan kamera `chase` / `Takip · Standart` olarak kilitlendi.
- Ayarlar arayüzü düz renkli, modern ve detaylı v0.7 görünümüne taşındı.
- Yeni Ayarlar katmanında gradient, glow ve shadow kullanılmıyor.
- Çalışma anında sentezlenen eski melodi sistemi v0.7'de kapatıldı.
- Menü ve sürüş için fiziksel MP3 soundtrack katmanı aktif edildi.
- Menü ve sürüş müzik kaynakları birbirinden izole edildi.
- v0.7 MP3 soundtrack GitHub Actions üzerinde deterministik üretiliyor.
- `package-lock.json`, Expo oyun paketi ve üretilmiş kaynaklar autogen ile güncel tutuluyor.
- 173 test, TypeScript ve Expo dependency kontrolü başarılı tamamlandı.
- Autogen paralel commit yarışında bot push öncesi rebase yapacak şekilde düzeltildi.
- Supabase runtime metadata v0.7 / versionCode 1 / chase / physical-mp3-only olarak güncellendi.
- Permanent signing keystore public repoya eklenmiyor; `.jks` ve credentials dosyaları ignore altında.
- Aynı permanent key'i kullanan Development APK ve release APK/AAB workflow'ları hazır.
- Android workflow'lar `actions/setup-java@v5` + Java 17 kullanıyor; prebuild öncesi Gradle-cache hatası kaldırıldı.
- Signing secret'ları job geneline verilmek yerine yalnızca doğrulama, keystore ve Gradle imzalama adımlarına sınırlandı.
- GitHub native Android smoke workflow'u eklendi ve başarıyla tamamlandı.
- Native smoke run `34501461560`: Java 17, npm/build/test/typecheck, Expo dependency kontrolü, `expo prebuild --platform android --clean`, Gradle `:app:assembleDebug` ve Android metadata doğrulaması geçti.
- Böylece Expo SDK 57 Development Client native Android derlenebilirliği gerçek GitHub runner üzerinde doğrulandı.
- İlk signed-development denemesinde prebuild öncesi Gradle cache kaynaklı setup-java hatası tespit edildi ve kalıcı olarak giderildi.
- GitHub signing repository secret'larının henüz tanımlı olmadığı doğrulandı; private key public repoya taşınmadı.
- Termux güvenli sync mevcut: yerel commit/değişiklikler korunarak GitHub `main` kaynak kabul ediliyor.
- Termux başlatıcısı GitHub `main` dalını yaklaşık 30 saniyede bir kontrol eder; yeni sürümde Metro'yu günceller.
- Termux v0.7 tek-komut bootstrap betiği eklendi.
- `scripts/dkd-android-output.sh` ile `development`, `apk` ve `aab` workflow başlatma + artifact indirme akışı eklendi.
- `npm run start:dev-client`, `npm run android:development`, `npm run android:apk`, `npm run android:aab` komutları eklendi.
- README v0.7 Android, Expo Go/Development Client, signing ve Termux akışına göre güncellendi.

## Güvenli signing için kalan tek hesap bağlantısı
GitHub Actions repository secrets altında aşağıdaki dört isim bir kez tanımlanmalıdır:
- `DKD_LASTMILE_KEYSTORE_B64`
- `DKD_LASTMILE_KEYSTORE_PASSWORD`
- `DKD_LASTMILE_KEY_ALIAS`
- `DKD_LASTMILE_KEY_PASSWORD`

Bu değerler private signing ZIP içindeki `github-secrets-termux.sh` tarafından `gh secret set` ile yüklenir. Betik GitHub CLI oturumu yoksa güvenli web yetkilendirmesini başlatır, secret'ları tanımlar, Development APK workflow'unu çalıştırır, sonucu izler ve artifact'ı indirir. Özel anahtar veya parolalar bu dosyaya ya da Git geçmişine yazılmaz.

## Kalıcı signing kimliği
- Sertifika SHA-256: `B3:04:2B:12:0C:61:C1:DE:EC:8C:C2:61:9C:55:13:C4:F7:B3:37:8D:81:C6:23:5E:92:85:CC:F6:06:96:09:BC`
- Yeni sürümlerde yeni signing key üretilmeyecek.

## Build hedefleri
- Development APK: `dkd-lastmile-v0.7.0-development-vc1`
- Release APK: `dkd-lastmile-v0.7.0-signed-apk-vc1`
- Release AAB: `dkd-lastmile-v0.7.0-signed-aab-vc1`

## Devam kuralı
Bundan sonraki DraBornGo / Last Mile Android APK ve AAB çıktıları yeni bir key üretmeden aynı `DKD_LASTMILE_*` permanent signing identity ile imzalanmalıdır.

İmzalı v0.7 Development APK'nın üretilebilmesi için kod/native tarafta açık hata kalmadı; kalan tek adım GitHub hesabına dört private signing secret'ın bir kez güvenli olarak bağlanmasıdır.

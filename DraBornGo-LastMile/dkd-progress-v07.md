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
- GitHub native Android smoke workflow'u eklendi.
- Termux güvenli sync mevcut: yerel commit/değişiklikler korunarak GitHub `main` kaynak kabul ediliyor.
- Termux v0.7 tek-komut bootstrap betiği eklendi.

## Güvenli signing için tek kalan hesap bağlantısı
GitHub Actions repository secrets altında aşağıdaki dört isim bir kez tanımlanmalıdır:
- `DKD_LASTMILE_KEYSTORE_B64`
- `DKD_LASTMILE_KEYSTORE_PASSWORD`
- `DKD_LASTMILE_KEY_ALIAS`
- `DKD_LASTMILE_KEY_PASSWORD`

Bu değerler private signing ZIP içindeki betik tarafından `gh secret set` ile yüklenir. Özel anahtar veya parolalar bu dosyaya ya da Git geçmişine yazılmaz.

## Build hedefleri
- Development APK: `dkd-lastmile-v0.7.0-development-vc1`
- Release APK: `dkd-lastmile-v0.7.0-signed-apk-vc1`
- Release AAB: `dkd-lastmile-v0.7.0-signed-aab-vc1`

## Devam kuralı
Bundan sonraki DraBornGo / Last Mile Android APK ve AAB çıktıları yeni bir key üretmeden aynı `DKD_LASTMILE_*` permanent signing identity ile imzalanmalıdır.

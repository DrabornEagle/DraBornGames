# DraBornGo / Last Mile v0.7

## Durum

- Android uygulama sürümü: `0.7.0`
- Android `versionCode`: `1`
- Test hedefi: Expo Go / Expo SDK 57
- Bu aşamada APK veya AAB üretilmez.
- Paket kimliği: `com.draborneagle.lastmile`
- GitHub ana kaynak: `DrabornEagle/DraBornGames` / `main`
- Lokal hedef: `~/projects/DraBornGames/DraBornGo-LastMile`

## v0.7 değişiklikleri

1. Ayarlar ekranına sürüş yardımcıları ve kamera mesafesi geri getirildi.
   - Yakın
   - Takip
   - Yüksek
   - Direksiyon yardımı
   - Titreşim
   - Arayüz animasyonu
2. Başlangıç motosikletinin mevcut doğru yönü korunur. Sürücü/kurye meshleri motosikletten bağımsız olarak `PI` radyan (180°) çevrilir.
3. Kurye Merkezi ve vardiya sürüşü için tek ses sahibi modeli kullanılır. Ana ekran parçası vardiya başlatılırken sıfırlanır ve durdurulur; sürüş parçası tek başına çalar.
4. Eski ritim/prosedürel müzik katmanı v0.7'de gerçek, katmanlı ve özgün MP3 oyun müzikleri ile değiştirilir.
5. Kurye Merkezi parçası: `Kurye Merkezi: Gece Ufku`.
6. Beş ayrı vardiya müziği otomatik seçilebilir: `Ankara Gece Hattı`, `Son Kilometre`, `Fırtına Hattı`, `Asfalt Yıldızları`, `Final Kontrat`.
7. Supabase `dkd-last-mile-api` sürümü `0.7` olarak yayımlandı ve çalışma/ses yapılandırması v0.7 ile eşitlendi.

## İmzalama politikası

APK/AAB üretimine geçildiğinde tek bir kalıcı DraBornGo Last Mile Android release keystore oluşturulacak ve sonraki bütün Android çıktıları aynı anahtar ile imzalanacaktır. Gerçek keystore, parola veya private key hiçbir zaman public GitHub deposuna commit edilmeyecektir. `.gitignore` bu dosya türlerini engeller. Anahtar üretimi ve ilk imzalı çıktı, APK/AAB aşamasına geçildiği turda yapılacaktır.

## Termux — tek komut kurulum / güncelleme / Expo Go

```bash
pkg update -y && pkg install -y git nodejs-lts util-linux curl && mkdir -p "$HOME/projects" && curl -fsSL https://raw.githubusercontent.com/DrabornEagle/DraBornGames/main/DraBornGo-LastMile/scripts/dkd-install.sh | bash
```

Başlatıcı açıldığında GitHub `main` dalını kontrol eder, lokal repoyu güvenli şekilde `origin/main` ile eşitler, kilitli NPM paketlerini kurar, Expo Go geliştirme sunucusunu açar ve GitHub'ı 30 saniyede bir kontrol eder. GitHub'a yeni sürüm gelirse Metro otomatik yeniden başlatılır.

Elle tek sefer eşitlemek için:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile" && npm run sync
```

Mevcut başlatıcı yerine ayrı sürekli eşitleme oturumu istenirse:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile" && npm run sync:watch
```

## Doğrulama

GitHub Actions v0.7 için şu kontrolleri çalıştırır:

- v0.7 özgün müzik üretimi
- DK61 model mesh raporu
- oyun HTML bundle üretimi
- Node testleri
- TypeScript typecheck
- Expo SDK bağımlılık kontrolü
- Android JavaScript export (APK üretmeden)
- generated HTML/source tutarlılık kontrolü

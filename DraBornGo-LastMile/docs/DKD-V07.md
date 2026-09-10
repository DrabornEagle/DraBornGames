# DraBornGo / Last Mile v0.7

## Durum

- Android uygulama sürümü: `0.7.0`
- Android `versionCode`: `1`
- Paket kimliği: `com.draborneagle.lastmile`
- Test hedefi: Expo Go / Expo SDK 57
- Kullanıcı cihazı test hedefi: Expo Go 57.0.9
- Bu aşamada APK, AAB veya release keystore üretilmez.
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
   - Bunlar oyun içi 3D kamera ayarlarıdır; fiziksel Android `CAMERA` izni istenmez.
2. Başlangıç Yamaha motosikletinin mevcut doğru yönü korunur. DK61 mesh raporunda Yamaha `0–21`, Quaternius sürücü `22–27` indeksleridir. Yalnızca sürücünün `22–27` meshleri `PI` radyan (180°) çevrilir; Yamaha meshlerine ilave yön dönüşü uygulanmaz.
3. Kurye Merkezi ve vardiya sürüşü için tek ses sahibi modeli kullanılır. Ana ekran parçası vardiya başlatılırken durdurulur ve sıfırlanır; sürüş parçası tek başına çalar. Eski WebAudio/prosedürel merkez kaynakları da sürüş geçişinde kapatılır.
4. Eski ritim/prosedürel etkin müzik yolu v0.7'de tam render edilmiş özgün MP3 oyun müzikleri ile değiştirilmiştir.
5. Kurye Merkezi parçası: `Kurye Merkezi: Gece Ufku`.
6. Beş ayrı vardiya müziği otomatik seçilebilir: `Ankara Gece Hattı`, `Son Kilometre`, `Fırtına Hattı`, `Asfalt Yıldızları`, `Final Kontrat`.
7. Supabase `dkd-last-mile-api` sürümü `0.7` olarak yayımlanmıştır. `Last-Mile.dkd_lastmile_system_config` içindeki runtime/audio ayarları `Expo SDK 57`, Android `versionCode 1` ve `single_owner=true` ile eşitlenmiştir.
8. Last-Mile doğrudan istemci yüzeyi kilitlidir. `anon` ve `authenticated` rollerinin `Last-Mile` şema kullanım izni yoktur; Last-Mile tablolarında doğrudan istemci grant'i bulunmaz. Trigger yardımcı fonksiyonlarının varsayılan PUBLIC execute yetkisi de v0.7 final güvenlik migration'ı ile kaldırılmış, yalnızca `service_role` bırakılmıştır.
9. GitHub CI generated-file yarışı giderilmiştir. `DKD Last Mile checks` deterministic üretimi doğrular, `DKD Last Mile autogen` generated dosyaları üretip güncel `main` üzerine rebase ederek push eder.

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
- deterministic ikinci bundle üretimi ve SHA-256 eşleşmesi
- Node regression testleri
- TypeScript typecheck
- Expo SDK bağımlılık kontrolü
- Android JavaScript export (APK üretmeden)

Fiziksel cihazdaki son görsel/ses kabul testi Expo Go 57.0.9 üzerinde yapılır; GitHub CI gerçek telefon ekranını göremez.

# DraBornGo / Son Kilometre

**v0.7.0 · Android versionCode 1 · Expo SDK 57 · Expo Go + Development Client**

DraBornGo / Last Mile; oyuncunun başlangıç scooter'ı ve küçük kurye şirketiyle başlayıp teslimatlar, hava koşulları, trafik, araç geliştirmeleri, şirket büyütme ve sezon hedefleri üzerinden ilerlediği dikey ekran 3D kurye oyunudur.

## v0.7

- Android `versionName=0.7.0`, `versionCode=1` ve package `com.draborneagle.lastmile`.
- Expo SDK 57 ailesi korunur.
- Expo Go hızlı geliştirme/test hattı korunur.
- `expo-dev-client` ile GitHub üzerinden gerçek Android Development APK hattı hazırdır.
- Ayarlar ekranındaki Kamera bölümü geri getirildi ve genişletildi.
- Yeni kariyer ve geçersiz/eski kamera ayarlarında varsayılan açı `Takip · Standart` (`chase`).
- Kamera seçenekleri Yakın, Takip / Standart ve Yüksek görünüm olarak sunulur.
- Ayarlar ekranı daha detaylı, renkli ve modern düz tasarıma taşındı.
- Yeni v0.7 Ayarlar katmanında gradient, glow ve shadow kullanılmaz.
- Eski çalışma-zamanı nota/melodi üretimi v0.7'de susturulur.
- Menü ve sürüş müzikleri fiziksel MP3 dosyalarından oynatılır.
- Menü ve sürüş müzik kaynakları birbirinden izole edilir.
- v0.7 MP3 soundtrack GitHub Actions üzerinde deterministik olarak yeniden üretilebilir.
- Menü parçası: `Kurye Merkezi / Gece`.
- Sürüş parçaları: `Gece Ekspres`, `Asfalt Vardiyası`, `Yağmur Rotası`, `Şehir Baskısı`, `03:17 / Son Teslimat`.
- v0.6.1 ve önceki oynanış katmanları geriye uyumluluk testleriyle korunur.

## Android imzalama

Kalıcı Android signing identity public Git deposuna eklenmez. `.jks`, credentials ve signing property dosyaları `.gitignore` ile engellenir.

GitHub Actions repository secrets isimleri:

```text
DKD_LASTMILE_KEYSTORE_B64
DKD_LASTMILE_KEYSTORE_PASSWORD
DKD_LASTMILE_KEY_ALIAS
DKD_LASTMILE_KEY_PASSWORD
```

Bu dört secret bir kez tanımlandıktan sonra yeni key üretilmez. Bundan sonraki Development APK, release APK ve AAB çıktıları aynı kalıcı imza zincirini kullanır.

Development APK workflow:

```text
.github/workflows/dkd-lastmile-android-v07.yml
```

Release APK/AAB workflow:

```text
.github/workflows/dkd-lastmile-android-signed-release.yml
```

Android çıktısını Termux'tan başlatıp indirmek:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile"
bash scripts/dkd-android-output.sh development
# veya
bash scripts/dkd-android-output.sh apk
bash scripts/dkd-android-output.sh aab
```

## Expo Go 57.x test hattı

Expo Go için:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile"
bash scripts/dkd-termux.sh
```

Başlatıcı GitHub `main` dalını güvenli biçimde kontrol eder, bağımlılıkları gerekirse `npm ci` ile yeniler ve Expo Go Metro'yu başlatır. Açık oturum sırasında GitHub yaklaşık 30 saniyede bir kontrol edilir; yeni sürüm gelirse Metro güncel kaynakla yeniden başlatılır.

Development APK, Expo Go uygulamasının içinde açılan bir paket değildir; kendi Expo Development Client uygulamasıdır. Development APK kurulduktan sonra Metro için gerekirse:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile"
npx expo start --dev-client --lan
```

## Termux kurulumu ve GitHub eşitleme

Hedef klasör:

```text
$HOME/projects/DraBornGames/DraBornGo-LastMile
```

Gerekli paketler:

```bash
pkg update -y && pkg install -y git nodejs-lts util-linux gh unzip coreutils
```

Repo ilk kez kurulacaksa:

```bash
mkdir -p "$HOME/projects"
git clone https://github.com/DrabornEagle/DraBornGames.git "$HOME/projects/DraBornGames"
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile"
bash scripts/dkd-sync.sh once
bash scripts/dkd-termux.sh
```

Repo zaten varsa tek seferlik güvenli eşitleme:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile" && bash scripts/dkd-sync.sh once
```

Sürekli eşitleme ve Expo Go başlatma zaten `dkd-termux.sh` / `dkd-termux-run.mjs` içinde birlikte yürütülür.

`dkd-sync.sh`:

- GitHub `main` dalını kaynak kabul eder.
- Yerel farklı commitleri `dkd-preserved/*` dalında korur.
- Değişmiş ve untracked dosyaları stash ile korur.
- Devam eden merge/rebase varsa dosyalara dokunmadan durur.
- `git clean` veya force-push kullanmaz.

## Supabase Last-Mile

Uygulama diğer alanlara dokunmadan özel `Last-Mile` şemasını kullanır. Runtime metadata v0.7 için `versionName=0.7.0`, `versionCode=1`, `camera=chase`, `audio=physical-mp3-only`, `expoSdk=57` değerleriyle eşitlenmiştir.

Temel tablolar:

```text
Last-Mile.dkd_lastmile_profiles
Last-Mile.dkd_lastmile_system_config
Last-Mile.dkd_lastmile_city_zones
Last-Mile.dkd_lastmile_content_packages
Last-Mile.dkd_lastmile_content_customers
Last-Mile.dkd_lastmile_mission_templates
Last-Mile.dkd_lastmile_player_progress
Last-Mile.dkd_lastmile_delivery_jobs
Last-Mile.dkd_lastmile_admin_audit
```

Supabase service-role veya özel signing key mobil pakete gömülmez.

## Doğrulama

GitHub autogen ve check hatları aşağıdakileri doğrular:

```bash
npm ci --no-audit --no-fund
npm run build:game
npm test
npm run typecheck
EXPO_OFFLINE=1 npx expo install --check
git diff --check
```

v0.7 geçişinde 173 test başarılı tamamlanmıştır. Native Android smoke workflow ayrıca `expo prebuild --platform android --clean` ve Gradle Development Client derlemesini kontrol eder.

## Checkpoint

Güncel v0.7 Android ilerleme/kalan işler kaydı:

```text
dkd-progress-v07.md
```

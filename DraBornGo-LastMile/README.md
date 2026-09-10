# DraBornGo / Son Kilometre

**v0.7.0 · Android versionCode 1 · Expo Go / Expo SDK 57 geliştirme sürümü.**

DraBornGo / Last Mile; oyuncunun başlangıç motosikleti ve küçük kurye şirketiyle başlayıp teslimatlar, hava koşulları, trafik, araç geliştirmeleri, sezon hedefleri, özel müşteriler ve Final Contract üzerinden ilerlediği dikey ekran 3D kurye oyunudur.

Bu aşamada Android fiziksel test hedefi **Expo Go 57.x**. APK/AAB ve release keystore bilerek üretilmez; imzalı dağıtım aşamasına geçildiğinde tek kalıcı release anahtarı kullanılacaktır.

## v0.7

- Uygulama sürümü `0.7.0`, Android `versionCode 1`, paket kimliği `com.draborneagle.lastmile`.
- Ayarlar ekranına sürüş/kamera bölümü geri getirildi: `Yakın`, `Takip`, `Yüksek`, Direksiyon yardımı, Titreşim ve Arayüz animasyonu.
- Bunlar **oyun içi 3D kamera ayarlarıdır**; fiziksel Android kamera izni istenmez.
- Başlangıç Yamaha motosikletinin doğru yönü korunur. DK61 mesh raporuna göre yalnızca Quaternius sürücü meshleri `22–27` ayrıca 180° çevrilir; motosiklet meshleri değiştirilmez.
- Kurye Merkezi ile vardiya/sürüş müzikleri tek ses sahibi sistemiyle birbirinden tamamen ayrılır. Vardiya başladığında merkez/menu kaynakları durdurulur ve yalnızca sürüş müziği çalışır.
- Eski prosedürel ritim katmanı etkin müzik yolundan çıkarıldı; v0.7 tam MP3 oyun müziği kullanır.
- Kurye Merkezi parçası: `Kurye Merkezi: Gece Ufku`.
- Sürüş parçaları: `Ankara Gece Hattı`, `Son Kilometre`, `Fırtına Hattı`, `Asfalt Yıldızları`, `Final Kontrat`.
- Ankara gerçek yol paketi, gerçek Supabase görev akışı, bulut kayıt, müşteri portre havuzu, Garaj, sezonlar, özel müşteri hikâyeleri, ödül/final doğrulama ve admin araçları önceki sürümlerden korunur.
- `dkd-last-mile-api` ve `Last-Mile.dkd_lastmile_system_config` v0.7 runtime/audio yapılandırmasıyla eşitlenmiştir.

## Supabase Last-Mile alanı

Last Mile, DraBornGo Supabase projesinde ayrı `Last-Mile` şemasında tutulur. Mobil istemciye service-role veya secret anahtarı gömülmez.

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

## GitHub → Termux eşitlemesi

GitHub `main` ana kaynaktır. Telefon üzerindeki hedef klasör:

```text
$HOME/projects/DraBornGames/DraBornGo-LastMile
```

Tek komutla kurulum/güncelleme ve Expo Go başlatma:

```bash
pkg update -y && pkg install -y git nodejs-lts util-linux curl && mkdir -p "$HOME/projects" && curl -fsSL https://raw.githubusercontent.com/DrabornEagle/DraBornGames/main/DraBornGo-LastMile/scripts/dkd-install.sh | bash
```

Mevcut lokali tek sefer GitHub `main` ile güvenli şekilde eşitlemek için:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile" && npm run sync
```

Sürekli eşitleme için:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile" && npm run sync:watch
```

Eşitleme betiği yerel değişiklik veya ayrışmış commit görürse veriyi silmez; çalışma dalı/stash oluşturarak korur ve ardından `main` dalını `origin/main` ile eşitler.

## Yerel doğrulama

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile"
npm ci --no-audit --no-fund
npm run build:game
npm test
npm run typecheck
EXPO_OFFLINE=1 npx expo install --check
```

GitHub Actions ayrıca v0.7 müzik üretimini, DK61 mesh raporunu, deterministic WebView bundle üretimini ve **APK üretmeden** Android JavaScript exportunu doğrular.

## Dağıtım anahtarı politikası

Gerçek release keystore, parola ve private key public GitHub reposuna commit edilmez. `.jks`, `.keystore` ve credential/private-key dosyaları ignore edilir. APK/AAB aşamasına geçildiğinde tek bir kalıcı DraBornGo release anahtarı oluşturulacak; sonraki bütün Android çıktıları aynı anahtarla imzalanacaktır.

Ayrıntılı v0.7 notları: `docs/DKD-V07.md`  
İlerleme/checkpoint kaydı: `docs/DKD-PROGRESS.md`

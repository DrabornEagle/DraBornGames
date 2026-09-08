# DraBornGo / Son Kilometre

**v0.4.0 — Expo Go SDK 57 + gerçek Last-Mile Supabase görev altyapısı.**

DraBornGo / Last Mile; oyuncunun başlangıç scooter'ı ve küçük kurye şirketiyle başlayıp teslimatlar, hava koşulları, trafik, araç geliştirmeleri ve kariyer hedefleri üzerinden ilerlediği dikey ekran 3D kurye oyunudur.

v0.4 geliştirme aşamasında APK/AAB üretilmez; Android testleri **Expo Go 57.x** üzerinden yapılır.

## v0.4

- DraBornGo Supabase projesinde diğer alanlara dokunmadan özel `Last-Mile` şeması kuruldu.
- Last-Mile tablolarının tamamı `dkd_lastmile_*` standardına geçirildi.
- Normal vardiyalar gerçek `dkd_lastmile_delivery_jobs` kayıtları oluşturur.
- Görev yaşam döngüsü: teklif, kabul, iptal ve tamamlama.
- İlerleme cihaz yedeğinin yanında Supabase'e senkronize edilir.
- v0.4 içerikleri geliştirme sürecinde Last-Mile admin rolüne kilitlidir.
- Demo görevleri varsayılan kapalıdır; yalnızca admin ayarından açılır.
- Eski sentetik sıralama rakipleri üretilen v0.4 paketinden temizlenir.
- Sentetik topluluk sayaçları gösterilmez.
- Yerel test kariyeri kullanıcı akışından kaldırıldı.
- Telefon ekranındaki sabit `23:42` kaldırıldı; cihazın gerçek yerel saati kullanılır.
- Menü ve sürüş müziği ayrı ses kanallarına ayrıldı; geçişte crossfade uygulanır ve menü müziği sürüş sırasında devam etmez.
- Yeni görevler ve içerikler eklendi.
- Supabase service-role/secret anahtarı mobil uygulamaya gömülmez.

## Supabase Last-Mile tabloları

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

Ayrıntılar: `docs/SUPABASE-V04.md`

## Geri dönüş noktası

v0.4 öncesindeki v0.3 ana sürümü GitHub'da ayrı dalda korunur:

```text
backup/DraBornGo-LastMile-v0.3-pre-v0.4
7935054a6bd649d3b7d5e6c9e4f4899faaadade1
```

Daha eski v0.101 yedeği de korunmaya devam eder.

## Güncel Termux kurulumu

Hedef klasör:

```text
$HOME/projects/DraBornGames/DraBornGo-LastMile
```

Tek komutla kurulum/güncelleme ve başlatma:

```bash
pkg update -y && pkg upgrade -y && pkg install -y git nodejs-lts util-linux curl && \
bash -o pipefail -c 'curl -fsSL https://raw.githubusercontent.com/DrabornEagle/DraBornGames/main/DraBornGo-LastMile/scripts/dkd-install.sh | bash'
```

Mevcut kurulumda GitHub `main` ile güvenli tek seferlik eşitleme:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile" && bash scripts/dkd-sync.sh once
```

GitHub ile sürekli eşitleme:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile" && npm run sync:watch
```

Expo Go'yu LAN üzerinden başlatmak için:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile" && npm ci --no-audit --no-fund && npm run build:game && npm run start:lan
```

Metro önbelleğini temizleyerek başlatmak gerekirse:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile" && npx expo start --go --lan --clear
```

## Doğrulama

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile"
npm ci --no-audit --no-fund
npm run build:game
npm test
npm run typecheck
npx expo install --check
```

APK/AAB çıktısı v0.4 için bilerek alınmaz.

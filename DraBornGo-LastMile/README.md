# DraBornGo / Son Kilometre

**v0.5.0 — Expo Go SDK 57 + gerçek Last-Mile Supabase görev altyapısı.**

DraBornGo / Last Mile; oyuncunun başlangıç scooter'ı ve küçük kurye şirketiyle başlayıp teslimatlar, hava koşulları, trafik, araç geliştirmeleri ve kariyer hedefleri üzerinden ilerlediği dikey ekran 3D kurye oyunudur.

v0.5 geliştirme aşamasında APK/AAB üretilmez; Android testleri **Expo Go 57.x** üzerinden yapılır.

## v0.5

- Şirket Kimliği ekranındaki `ANA RENK`, seçili amblem ve `KURYE STİLİ` rozetleri tek satırda gösterilir.
- Ana ekranda oyuncunun Ad Soyad başlığı daha aşağı taşındı; Seviye ve Yıldız/Puan rozetleri doğrudan altında konumlandırıldı.
- Son Garaj düzenlemesinde Ad Soyad + Seviye/Puan grubu ekran üzerinde bir kademe daha aşağı alındı.
- Ana sayfa artık ayrı, daha enerjik `Kızılay Rush` prosedürel menü temasını kullanır; diğer menü ekranlarında oyuncunun seçtiği müzik geri yüklenir.
- Müzik sistemi sekiz farklı prosedürel parçaya çıkarıldı: Neon Vardiya, Gece Rotası, Yağmur Hattı, Şehir Nabzı, Son Paket, Kızılay Rush, Asfalt 06 ve Sabaha Karşı.
- Müzik ekranında bir parçaya dokunmak artık gerçek ses buffer'ını değiştirir; yalnızca kart seçimi değişmez.
- Her yeni vardiyada önceki vardiyadan farklı bir sürüş parçası otomatik seçilir.
- Başlangıç aracının kullanıcıya görünen adı `Şehir 50` yerine `Başlangıç Scooterı` olarak değiştirildi.
- Garaj ekranı modern, renkli ve animasyonlu bir atölye/filo merkezine dönüştürüldü.
- `YAKIT / ŞARJ` ve `ARAÇ DURUMU` kartları durum rengine göre değişen vurgu, hareketli doluluk çubuğu ve düşük seviyede uyarı animasyonu kullanır.
- Yakıt %5'in veya araç durumu %10'un altındaysa vardiya, cloud sipariş kabul isteği gönderilmeden önce yerelde durdurulur.
- Bu durumda ham `server_error` yerine yakıt ve bakım değerlerini gösteren renkli, animasyonlu servis penceresi açılır; kullanıcı doğrudan Garaj'a geçebilir.
- Sunucudan yine `server_error` / bakım-yakıt ilişkili bir hata dönerse aynı servis penceresine dönüştürülür ve ham hata metni oyuncuya gösterilmez.
- Trafik çizim kapasitesi 72 araca yükseltildi ve aktif trafik en az 56 araçla çalışır.
- Trafik araçları on farklı gövde/kabin renk ailesi kullanır.
- Rota trafiğinin bir bölümü aktif güzergâha odaklanmaya devam eder; yol boş görünmez.
- Rota engellerinin yoğunluğu yaklaşık 10–24 aralığına yükseltildi.
- Engel çeşitleri bariyer, koni, kasa, palet, lastik, yol çalışması, çukur ve yol variline çıkarıldı.
- Engel ve trafik çarpışmaları kargo bütünlüğüne zarar verir; bütünlük %0 olduğunda gerçek cloud siparişi iptal edilir.
- Ödül Kasası yarım panel yerine tam ekran, renkli ve animasyonlu sezon hedef merkezine dönüştürüldü.
- v0.4 gerçek veri, hesap, cihaz saati, cloud-save ve admin/demo altyapısı korunur.

## v0.4 altyapısı

- DraBornGo Supabase projesinde diğer alanlara dokunmadan özel `Last-Mile` şeması kullanılır.
- Last-Mile tabloları `dkd_lastmile_*` standardındadır.
- Normal vardiyalar gerçek `dkd_lastmile_delivery_jobs` kayıtları oluşturur.
- Görev yaşam döngüsü: teklif, kabul, iptal ve tamamlama.
- İlerleme cihaz yedeğinin yanında Supabase'e senkronize edilir.
- Demo görevleri varsayılan kapalıdır; yalnızca admin ayarından açılır.
- Eski sentetik sıralama rakipleri üretilen pakete eklenmez.
- Telefon ekranında cihazın gerçek yerel saati kullanılır.
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

## Geri dönüş noktaları

v0.5 Garaj/servis hotfix öncesindeki doğrulanmış ana sürüm:

```text
backup/DraBornGo-LastMile-v0.5-pre-garage-hotfix
aa6ad274dc981dcc70bf0d059c0a94422bf06243
```

v0.5 öncesindeki doğrulanmış v0.4 ana sürümü:

```text
backup/DraBornGo-LastMile-v0.4-pre-v0.5
75f0b4571f00275747b0cd08d1d3b4483288ebd4
```

v0.4 öncesindeki v0.3 ana sürümü:

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

APK/AAB çıktısı v0.5 için bilerek alınmaz.

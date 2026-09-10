# DraBornGo / Son Kilometre — İlerleme Kaydı

## v0.7 final checkpoint — 10 Eylül 2026

Durum: **v0.7 kodu, Last-Mile production backend'i, server-authority güvenliği, regression testleri ve Developer APK build'i tamamlandı. Kalıcı production release keystore oluşturuldu ve public repoya konulmadan offline teslim edilir. Gerçek cihazdaki son görsel/ses kabul gözlemi kullanıcı tarafından yapılır.**

### Sürüm ve build

- Uygulama: `0.7.0`
- Android `versionCode`: `1`
- Paket: `com.draborneagle.lastmile`
- Expo SDK: `57`
- GitHub: `DrabornEagle/DraBornGames` / `main`
- Developer APK workflow: `DKD Last Mile Developer APK` run `#2 / 34453332952` — **SUCCESS**.
- Developer APK SHA-256: `a149d02fbaf55e604d8729332312439e878658f0f72eded7e1092c9c0772815f`.
- Developer APK Android debug imzası kullanır; production release keystore ayrıdır.

### v0.7 ürün tarafı

- Kamera mesafeleri `Yakın / Takip / Yüksek`, direksiyon yardımı, titreşim ve arayüz animasyonu geri getirildi.
- Yamaha başlangıç motosikletinin doğru yönü korunuyor; yalnız Quaternius sürücü meshleri `22–27` 180° çevriliyor.
- Kurye Merkezi ve vardiya sürüşünde tek ses sahibi var; müzikler üst üste binmiyor.
- Özgün MP3 oyun müzikleri: `Kurye Merkezi: Gece Ufku`, `Ankara Gece Hattı`, `Son Kilometre`, `Fırtına Hattı`, `Asfalt Yıldızları`, `Final Kontrat`.
- Ankara gerçek yol paketi, gerçek görev akışı, 47 müşteri portresi, bulut kayıt, Garaj, sezonlar, özel müşteri hikâyeleri, admin araçları ve fiziksel ödül/final sistemi korunuyor.

### Server Authority v1

- İstemci XP, seviye, cüzdan ve teslimat değerleri fiziksel ödül otoritesi değil.
- Güvenilir sayaçlar sunucuda: `dkd_server_xp`, `dkd_server_level`, `dkd_server_wallet`, `dkd_server_deliveries`, `dkd_server_storm_deliveries`.
- `claim_job` istemci seviyesini yetki kaynağı olarak kullanmıyor.
- `complete_job` için sunucuda `accepted` durum ve server timestamp zorunlu.
- Sunucu elapsed süresini hesaplıyor; şüpheli tamamlamalar `dkd_server_verified=false` oluyor ve güvenilir ilerleme kazandırmıyor.
- Fiziksel ödül için aktif sezonda en az `100` server-verified teslimat ve en az `10` server-verified fırtına teslimatı gerekiyor.
- Final puanı sunucuda son 100 doğrulanmış görevden hesaplanıyor; client score yalnız denetim verisi.
- Başvurular `pending_verification` ile admin kuyruğuna giriyor; `approved / rejected / fulfilled` akışı manuel admin incelemesi ve notuyla ilerliyor.
- Ödül stok koruması server verification şartını zorunlu tutuyor.
- Güvenlik olayları `dkd_lastmile_security_events` tablosunda kayıt altına alınabiliyor.
- Hardening öncesi tamamlanmış görevler güvenilir server progress'e geriye dönük eklenmedi.

### Supabase production

- Proje: `guuwomvszlwhkmstewfl`.
- Migration: `20260910073427_dkd_lastmile_v07_server_authority` — production'da uygulandı.
- Edge Function: `dkd-last-mile-api` — semantik `0.7`, deployment generation `10`, authority version `1`, JWT doğrulaması açık.
- `anon` ve `authenticated` rollerinin Last-Mile doğrudan tablo/şema erişimi yok.
- Hassas Last-Mile RPC yüzeyi yalnız `service_role` üzerinden Edge Function köprüsüyle kullanılıyor.
- Production transaction + rollback testlerinde sahte XP/cüzdan/teslimat, client level bypass, accept edilmemiş completion, aşırı hızlı completion, reward şartlarını bypass ve sahte final score senaryoları doğrulandı; test verisi bırakılmadı.

### GitHub / CI

- Server-authority hardening PR #10 tam CI kontrolünden sonra `main`e alındı.
- Developer APK final pipeline PR #11 ile düzeltildi ve `main`e alındı.
- Son Developer APK pipeline'ında oyun bundle üretimi, **177/177 test**, TypeScript typecheck, Expo config kontrolü, clean Android prebuild, Gradle `assembleDebug`, SHA-256 üretimi ve artifact upload başarılı.
- Developer APK build süresi 26 dakikalık job sınırı içinde tamamlandı.
- APK workflow artık dokümantasyon-only değişikliklerde gereksiz Android build'i başlatmıyor.
- Backup branch'leri korunuyor; silinmedi.

### Release signing

Kalıcı DraBornGo Last Mile Android release keystore oluşturuldu. JKS/parola/private key public GitHub'a commit edilmedi ve edilmeyecek. Gelecekte production APK/AAB imzalamalarında aynı release keystore kullanılmalı. Developer APK ise test/geliştirme amacıyla debug-signed çıktıdır.

### Termux

Kurulum / güncelleme / Expo Go tek komutu:

```bash
pkg update -y && pkg install -y git nodejs-lts util-linux curl && mkdir -p "$HOME/projects" && curl -fsSL https://raw.githubusercontent.com/DrabornEagle/DraBornGames/main/DraBornGo-LastMile/scripts/dkd-install.sh | bash
```

Tek sefer sync:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile" && npm run sync
```

Sürekli sync:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile" && npm run sync:watch
```

### Kalan iş

v0.7 kapsamında açık production kod, Supabase migration veya Android build işi bırakılmadı. GitHub CI gerçek telefon ekranını ve hoparlörünü göremediği için yalnız kullanıcı cihazındaki fiziksel kabul gözlemi kalır: müzik geçişi, Yamaha+sürücü yönü, kamera ayarları, görev akışı ve reward verification ekran davranışı.

---

## Önceki checkpoint özeti

- v0.6: 47 müşteri portresi, gerçek görev içerikleri, admin seviye/plaka akışı ve Expo SDK 57 korunumu.
- v0.5: gerçek sezon, ödül doğrulama kuyruğu, özel müşteri akışı ve sürüş/çarpışma hotfixleri.
- v0.4: gerçek hesap/bulut kayıt ve Last-Mile Edge/RPC temeli.

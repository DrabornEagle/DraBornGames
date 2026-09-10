# DraBornGo / Last Mile v0.7

## Final durum — 10 Eylül 2026

- Uygulama sürümü: `0.7.0`
- Android `versionCode`: `1`
- Paket kimliği: `com.draborneagle.lastmile`
- Expo SDK: `57`
- GitHub ana kaynak: `DrabornEagle/DraBornGames` / `main`
- Developer APK: üretildi ve GitHub Actions artifact doğrulaması geçti.
- Developer APK SHA-256: `a149d02fbaf55e604d8729332312439e878658f0f72eded7e1092c9c0772815f`
- Developer APK workflow: `DKD Last Mile Developer APK` run `#2 / 34453332952` — `SUCCESS`.
- Production Android release keystore oluşturuldu ve yalnızca güvenli/offline teslim edilir; public GitHub deposuna hiçbir private key veya parola yazılmaz.
- Supabase Last-Mile production migration: `20260910073427_dkd_lastmile_v07_server_authority`.
- Edge Function: `dkd-last-mile-api` semantik `0.7`, authority version `1`, deployment generation `10`, JWT doğrulaması açık.

## v0.7 tamamlananlar

1. Ayarlar ekranına `Yakın`, `Takip`, `Yüksek` kamera mesafeleri, direksiyon yardımı, titreşim ve arayüz animasyonu geri getirildi. Bunlar oyun içi 3D kamera ayarlarıdır; fiziksel Android `CAMERA` izni istenmez.
2. Başlangıç Yamaha motosikletinin doğru yönü korunur. DK61 paketinde Yamaha meshleri `0–21`, Quaternius sürücü meshleri `22–27`; yalnızca sürücü `Math.PI` / 180° çevrilir.
3. Kurye Merkezi ile aktif vardiya/sürüş arasında tek ses sahibi modeli uygulanır; merkez ve sürüş müziklerinin üst üste binmesi engellenir.
4. v0.7 tam render edilmiş özgün MP3 müzikleri kullanır. Kurye Merkezi: `Gece Ufku`; vardiya parçaları: `Ankara Gece Hattı`, `Son Kilometre`, `Fırtına Hattı`, `Asfalt Yıldızları`, `Final Kontrat`.
5. Ankara gerçek yol paketi, görev sunucusu, 47 müşteri portresi, bulut kayıt, Garaj, sezonlar, özel müşteri hikâyeleri, final/ödül akışı ve admin araçları korunur.
6. Last-Mile doğrudan istemci erişimi kapalıdır. `anon` ve `authenticated` rollerinin Last-Mile tablo/şema erişimi yoktur; hassas RPC köprüleri yalnız `service_role` üzerinden Edge Function tarafından çağrılır.
7. Server Authority v1 eklendi. İstemci XP, seviye, cüzdan veya teslimat sayısını değiştirerek fiziksel ödül uygunluğu oluşturamaz.
8. Görev havuzu istemcinin gönderdiği seviyeyi yetki kaynağı olarak kullanmaz; `dkd_server_level` kullanılır.
9. Görev tamamlamak için sunucuda `accepted` durumu ve sunucu başlangıç zamanı zorunludur. Sunucu elapsed süresini kendi hesaplar; şüpheli hızdaki tamamlamalar server-verified ilerleme üretmez.
10. Server-authoritative sayaçlar: `dkd_server_xp`, `dkd_server_level`, `dkd_server_wallet`, `dkd_server_deliveries`, `dkd_server_storm_deliveries`.
11. Fiziksel ödül başvurusu aktif sezonda en az `100` server-verified teslimat ve en az `10` server-verified fırtına teslimatı ister.
12. İstemcinin final skoru ödül sonucunu belirlemez. Sunucu son 100 doğrulanmış görev üzerinden `dkd_server_score` hesaplar.
13. Uygun başvuru `pending_verification` durumuna girer. Admin incelemesi `approved / rejected / fulfilled` akışıyla ve denetim kaydıyla yapılır; otomatik teslim yoktur.
14. Ödül stok koruması `dkd_server_verified=true` olmadan onay/teslime izin vermez.
15. Pre-hardening dönemde tamamlanmış görevler güvenilir server progress'e geriye dönük yazılmaz; güven zinciri v0.7 authority katmanından başlar.
16. Security-event tablosu ve server-authority regression testleri eklendi.
17. Developer APK pipeline'ı temiz Android prebuild + Gradle `assembleDebug` ile APK üretir, SHA-256 dosyası oluşturur ve artifact olarak saklar. Dokümantasyon-only değişiklikler pahalı APK build'ini tetiklemez.

## Doğrulama

Server-authority hardening PR #10 tam CI kapısından geçtikten sonra `main`e squash-merge edildi. Son server-authority kontrolünde soundtrack render, mesh raporu, deterministic oyun bundle, regression testleri, TypeScript typecheck, Expo SDK kontrolü ve Android JS export başarıyla tamamlandı. Developer APK final pipeline'ında oyun bundle üretimi, **177/177 Node testi**, TypeScript typecheck, Expo config kontrolü, clean Android prebuild, Gradle debug APK build, SHA-256 üretimi ve artifact upload başarıyla tamamlandı.

Production Supabase üzerinde transaction + rollback entegrasyon testlerinde sahte local XP/cüzdan/teslimat yükseltme, istemci level 999 bypass, accept edilmemiş job completion, aşırı hızlı completion, fiziksel ödül şartlarını atlama ve sahte client final score senaryoları doğrulandı. Test verileri rollback edildi; production'a sahte claim/job bırakılmadı.

## Android imzalama politikası

Kalıcı production release keystore v0.7 finalizasyonunda oluşturuldu. Bu anahtar public GitHub'a commit edilmez ve GitHub Actions artifact'ına eklenmez. Gelecekte production/release APK veya AAB üretildiğinde aynı kalıcı release anahtarı kullanılmalıdır. Developer APK ise Android debug imzası kullanan geliştirme/test çıktısıdır; production dağıtım anahtarıyla karıştırılmaz.

## Termux — tek komut kurulum / güncelleme / Expo Go

```bash
pkg update -y && pkg install -y git nodejs-lts util-linux curl && mkdir -p "$HOME/projects" && curl -fsSL https://raw.githubusercontent.com/DrabornEagle/DraBornGames/main/DraBornGo-LastMile/scripts/dkd-install.sh | bash
```

Elle tek sefer eşitleme:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile" && npm run sync
```

Sürekli eşitleme:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile" && npm run sync:watch
```

## Kalan insan kabul testi

Kod, backend, CI ve Developer APK build'i tamamlanmıştır. Gerçek telefon ekranı/sesi CI tarafından görülemediği için yalnız fiziksel kabul gözlemi kullanıcı cihazında yapılır: Kurye Merkezi/sürüş müzik geçişi, Yamaha+sürücü yönü, kamera ayarları, gerçek hesap görev akışı ve fiziksel ödül ekranının server verification'ı atlamaması.

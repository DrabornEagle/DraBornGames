# DraBornGo / Son Kilometre — İlerleme Kaydı

## v0.7 · Expo Go Android Finalizasyonu — 10 Eylül 2026

Durum: **Kod, GitHub CI, generated oyun paketi ve Supabase Last-Mile üretim tarafı tamamlandı. APK/AAB bilerek üretilmedi; fiziksel son kabul testi Expo Go 57.0.9 üzerinde yapılacak.**

### Sürüm

- Uygulama: `0.7.0`
- Android `versionCode`: `1`
- Paket: `com.draborneagle.lastmile`
- Expo SDK: `57`
- Test hedefi: Expo Go 57.x; kullanıcı cihazındaki hedef sürüm `57.0.9`
- Dağıtım: bu checkpoint'te APK/AAB yok, release keystore yok.

### v0.7 tamamlananlar

- Ayarlar ekranına oyun içi kamera ayarları geri getirildi: `Yakın`, `Takip`, `Yüksek`.
- Direksiyon yardımı, titreşim ve arayüz animasyonu aynı ayar bölümünde çalışır; controller action'ları kayıt durumuna yazıp ayarı saklar.
- Fiziksel cihaz kamerası kullanılmaz ve Android `CAMERA` izni istenmez.
- Başlangıç Yamaha modelinin yönü değiştirilmez. DK61 sınırı kesinleştirildi: Yamaha meshleri `0–21`, Quaternius sürücü meshleri `22–27`. Yalnızca `22–27` sürücü meshleri ayrıca `Math.PI` / 180° döndürülür.
- Rider-only sınırı regression testine kilitlendi; `20` ve `21` numaralı Yamaha parçalarının yanlışlıkla döndürülmesi engellendi.
- Kurye Merkezi ve aktif vardiya/sürüş için tek müzik sahibi sistemi etkin. Vardiya başlarken merkez, eski menu ve prosedürel kaynaklar durdurulur; yalnızca sürüş parçası çalışır.
- Etkin v0.7 müzik yolu tam render edilmiş özgün MP3 oyun müziklerini kullanır. Soundtrack harmoni, bas, melodi, arpej, atmosfer ve kontrollü perküsyon katmanlarından üretilir; üçüncü taraf şarkı/sample kullanılmaz.
- Ana merkez müziği: `Kurye Merkezi: Gece Ufku`.
- Sürüş müzikleri: `Ankara Gece Hattı`, `Son Kilometre`, `Fırtına Hattı`, `Asfalt Yıldızları`, `Final Kontrat`.
- Ankara gerçek yol paketi, gerçek görev sunucusu, müşteri portre havuzu, bulut kayıt, Garaj, sezonlar, özel müşteri hikâyeleri, ödül/final doğrulama ve admin araçları korunuyor.

### GitHub / CI

- `DKD Last Mile autogen` v0.7 müziklerini, DK61 mesh raporunu ve deterministic WebView oyun paketini üretir.
- Autogen generated commit push yarışına karşı `fetch + rebase + push` kullanır.
- `DKD Last Mile checks` generated dosyanın ikinci üretimde aynı SHA-256 sonucunu verdiğini doğrular; generated dosyanın commit sahipliği autogen workflow'undadır.
- Dokümantasyon-only commit'ler artık pahalı kaynak testini gereksiz yere tetiklemez; kaynak, oyun, Supabase, test ve workflow değişiklikleri tam kontrolü tetikler.
- Final kaynak kontrolü: GitHub Actions `DKD Last Mile checks` run **#153 / 34447097506** — **SUCCESS**.
- Bu final kontrolde v0.7 soundtrack render, mesh raporu, `npm ci`, oyun build'i, deterministic bundle kontrolü, tüm Node testleri, TypeScript typecheck, Expo SDK dependency kontrolü ve Android JavaScript export başarıyla geçti.
- Final kontrol kaynak commit'i: `9310f4882c6fb4d91e93550e42f8b002c98781ea`.
- Son deterministic generated bundle commit'i: `2441be7d2f5b2c16fbf718b595d2186087cb1a9b`.

### Supabase Last-Mile üretim durumu

- Proje: DraBornGo / `guuwomvszlwhkmstewfl`.
- `dkd-last-mile-api` Edge Function `0.7` runtime'ıyla ACTIVE; JWT doğrulaması açık.
- `Last-Mile.dkd_lastmile_system_config` runtime/audio değerleri v0.7 ile eşit: Expo SDK 57, Android versionCode 1, `single_owner=true`.
- v0.7 runtime/audio migration production'da uygulanmış durumda: `20260910015452_dkd_lastmile_v07_expo_go_audio`.
- v0.7 defense-in-depth function lockdown production'da uygulanmış durumda: `20260910064829_dkd_lastmile_v07_function_lockdown`.
- `anon` ve `authenticated` rollerinin `Last-Mile` şema kullanım izni yok.
- Last-Mile tablolarında doğrudan `anon/authenticated` tablo grant'i yok; tablo erişimi service-role/Edge katmanında tutuluyor.
- Last-Mile içindeki dört yardımcı fonksiyonun tamamında `anon_execute=false`, `authenticated_execute=false`, `service_role_execute=true` doğrulandı.
- Security advisor'ın `RLS enabled, no policy` INFO kayıtları Last-Mile için doğrudan client erişiminin bilinçli olarak kapalı olmasından kaynaklanır; bu tabloları public policy ile açmak güvenliği düşüreceği için policy eklenmedi.
- Performance advisor Last-Mile için eksik foreign-key index uyarısı vermiyor. Yeni/az kullanılan Last-Mile indeksleri `unused_index` INFO olarak görülebiliyor; henüz gerçek üretim trafik istatistiği oluşmadan bu indeksler kaldırılmadı.
- Diğer `public` ve `draborngate` şemalarındaki advisor uyarıları bu Last-Mile finalizasyonunda değiştirilmedi.

### Termux / GitHub eşitleme

Ana kaynak `main`, lokal hedef:

```text
$HOME/projects/DraBornGames/DraBornGo-LastMile
```

Kurulum/güncelleme/Expo Go tek komutu:

```bash
pkg update -y && pkg install -y git nodejs-lts util-linux curl && mkdir -p "$HOME/projects" && curl -fsSL https://raw.githubusercontent.com/DrabornEagle/DraBornGames/main/DraBornGo-LastMile/scripts/dkd-install.sh | bash
```

Tek sefer güvenli sync:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile" && npm run sync
```

Sürekli sync:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile" && npm run sync:watch
```

Sync katmanı yerel değişiklik/ayrışma görürse kullanıcı çalışmasını silmeden branch/stash ile korur; temiz durumda `main` ile `origin/main` eşitlenir. Termux cihazına bu sohbetten doğrudan komut çalıştırılamadığı için fiziksel telefonun son eşitlemesi yukarıdaki komutla yapılır.

### Dağıtım anahtarı kararı

Bu v0.7 checkpoint'inde APK/AAB/keystore **oluşturulmadı**. APK/AAB aşamasına geçildiğinde tek kalıcı production release keystore oluşturulacak; bütün sonraki Android çıktıları aynı anahtarla imzalanacak. `.jks`, `.keystore`, private key ve credential dosyaları public GitHub deposuna alınmayacak.

### Fiziksel kabul kontrolü

CI ve kaynak doğrulaması tamamlandı. Expo Go 57.0.9 cihaz testinde yalnızca fiziksel kabul gözlemi kalır:

1. Ana sayfada Kurye Merkezi müziği tek başına çalmalı.
2. Vardiya başlayınca merkez müziği tamamen susmalı ve tek sürüş müziği duyulmalı.
3. Yamaha doğru yönde kalmalı; sürücü motosikletle aynı sürüş yönüne bakacak şekilde düzelmiş görünmeli.
4. Ayarlar > Sürüş ve kamera bölümünde Yakın/Takip/Yüksek ile direksiyon yardımı, titreşim ve animasyon ayarları çalışmalı.
5. Uygulama içinde `v0.7`, Android metadata'da versionCode `1` korunmalı.

Fiziksel cihaz ekranı GitHub CI tarafından görülemediği için bu beş madde kullanıcı cihazında gözle doğrulanır; kod tarafında karşılıkları regression ve build kontrolleriyle kilitlidir.

---

## Önceki checkpoint özeti

- v0.6: 47 müşterilik gerçek portre havuzu, gerçek görev içerikleri, admin seviye/plaka akışı ve Expo SDK 57 korunumu.
- v0.5: Gerçek sezon, ödül doğrulama kuyruğu, özel müşteri akışı, sürüş/çarpışma hotfixleri ve Last-Mile özel Supabase güvenlik modeli.
- v0.4: Gerçek hesap/bulut kayıt ve Last-Mile Edge/RPC temeli.

Sonraki ürün geliştirme havuzu v0.8 ve sonrası için ayrıca ele alınır; v0.7 finalizasyon kapsamında açık kaynak/CI/Supabase işi bırakılmamıştır.

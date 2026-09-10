# DraBornGo / Son Kilometre — İlerleme Kaydı

## v0.7 · Expo Go Android Finalizasyonu — 10 Eylül 2026

Durum: **Kod, generated oyun paketi ve Supabase Last-Mile production tarafı tamamlandı. Server-authority hardening production'a uygulandı ve rollback entegrasyon testleri geçti. APK/AAB bilerek üretilmedi; fiziksel son kabul testi Expo Go 57.0.9 üzerinde yapılacak.**

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

### Server Authority v1 — tamamlandı

- İstemci XP, seviye, cüzdan ve teslimat değerleri fiziksel ödül uygunluğunun güvenilir kaynağı olmaktan çıkarıldı.
- Ayrı server-authoritative alanlar eklendi: `dkd_server_xp`, `dkd_server_level`, `dkd_server_wallet`, `dkd_server_deliveries`, `dkd_server_storm_deliveries`.
- Görev açma, istemcinin gönderdiği seviyeyi görmezden gelir ve `dkd_server_level` kullanır.
- Görev tamamlamak için job'ın önce sunucuda `accepted` olması gerekir. Sunucu kendi başlangıç/bitiş zamanından elapsed hesaplar.
- 30 saniyeden hızlı veya makul üst sınırı aşan completion `dkd_server_verified=false` olur; server XP/cüzdan/teslimat ilerlemesi vermez ve `dkd_lastmile_security_events` kaydı üretir.
- Server-verified completion; ödül, XP, toplam teslimat ve fırtına sayacını sunucuda günceller.
- Fiziksel ödül başvurusu aktif sezonda en az `100` server-verified teslimat ve en az `10` server-verified fırtına teslimatı gerektirir.
- İstemcinin final skoru ödül otoritesi değildir. Yarışma puanı en son 100 server-verified görevden sunucuda hesaplanır; istemci puanı yalnızca denetim verisidir.
- Uygun başvuru doğrudan kazandırmaz: durum `pending_verification` olur. Admin kuyruğu ve not zorunlu `approved / rejected / fulfilled` inceleme RPC'leri eklendi.
- Reward stock trigger artık `approved/fulfilled` için `dkd_server_verified=true` zorunluluğu da uygular.
- Pre-hardening tamamlanmış görevler güvenilir server ilerlemesine geriye dönük eklenmedi; yeni güven zinciri sıfırdan başlar.
- Production migration: `20260910073427_dkd_lastmile_v07_server_authority`.
- Production Edge Function: `dkd-last-mile-api`, semantik `0.7`, deployment generation `10`, JWT doğrulaması açık, authority version `1`.
- GitHub regression testi: `tests/dkd-v07-server-authority.test.mjs`.

### Server Authority production testleri

Aşağıdaki senaryolar production Supabase üzerinde transaction içinde çalıştırıldı ve sonunda `ROLLBACK` edildi:

- Sahte local `XP / seviye / cüzdan / teslimat` ile cloud-save yapılması server sayaçlarını değiştirmiyor.
- `claim_job` çağrısında seviye `999` gönderilmesi server level sınırını aşamıyor.
- `accepted` olmayan job tamamlanamıyor.
- Accept'ten hemen sonra aşırı hızlı completion server-verified sayılmıyor ve ilerleme vermiyor.
- Makul sürede tamamlanan job server-verified oluyor ve server XP/cüzdan/teslimat ilerlemesini artırıyor.
- 100/10 server koşulu olmadan fiziksel ödül claim'i kabul edilmiyor.
- Rollback testinde 100 verified job + 10 storm senaryosu kurularak server-score üretimi, admin kuyruğu, approve ve fulfill akışı doğrulandı.
- Client tarafından gönderilen sahte final skoru server-score yerine kullanılamıyor.
- Test sonrasında production'da sahte reward claim veya security event bırakılmadığı ayrıca kontrol edildi.

### GitHub / CI

- `DKD Last Mile autogen` v0.7 müziklerini, DK61 mesh raporunu ve deterministic WebView oyun paketini üretir.
- Autogen generated commit push yarışına karşı `fetch + rebase + push` kullanır.
- `DKD Last Mile checks` generated dosyanın ikinci üretimde aynı SHA-256 sonucunu verdiğini doğrular; generated dosyanın commit sahipliği autogen workflow'undadır.
- Dokümantasyon-only commit'ler pahalı kaynak testini gereksiz yere tetiklemez; kaynak, oyun, Supabase, test ve workflow değişiklikleri tam kontrolü tetikler.
- v0.7 görsel/ses finalizasyon kontrolü: GitHub Actions `DKD Last Mile checks` run **#153 / 34447097506** — **SUCCESS**.
- Bu kontrolde soundtrack render, mesh raporu, `npm ci`, oyun build'i, deterministic bundle kontrolü, Node testleri, TypeScript typecheck, Expo SDK dependency kontrolü ve Android JavaScript export başarıyla geçti.
- Server-authority değişikliği PR #10 üzerinde aynı tam CI kapısından geçirilir; merge yalnızca başarılı sonuçtan sonra yapılır.
- Son deterministic generated bundle commit'i: `2441be7d2f5b2c16fbf718b595d2186087cb1a9b`.

### Supabase Last-Mile üretim durumu

- Proje: DraBornGo / `guuwomvszlwhkmstewfl`.
- `dkd-last-mile-api` ACTIVE; JWT doğrulaması açık.
- `Last-Mile.dkd_lastmile_system_config` runtime/audio değerleri v0.7 ile eşit: Expo SDK 57, Android versionCode 1, `single_owner=true`.
- v0.7 runtime/audio migration production'da: `20260910015452_dkd_lastmile_v07_expo_go_audio`.
- v0.7 function lockdown production'da: `20260910064829_dkd_lastmile_v07_function_lockdown`.
- v0.7 server authority production'da: `20260910073427_dkd_lastmile_v07_server_authority`.
- `anon` ve `authenticated` rollerinin `Last-Mile` şema kullanım izni yok.
- Last-Mile tablolarında doğrudan `anon/authenticated` tablo grant'i yok; tablo erişimi service-role/Edge katmanında tutuluyor.
- Last-Mile RPC ve yardımcı fonksiyonların istemci execute yetkileri kapalı; Edge Function yalnızca doğrulanmış kullanıcı JWT'sinden sonra service-role RPC köprüsünü kullanır.
- Security advisor'ın Last-Mile `RLS enabled, no policy` INFO kayıtları doğrudan client erişiminin bilinçli olarak kapalı olmasından kaynaklanır; public policy eklenmez.
- Diğer `public` ve `draborngate` şemalarındaki advisor uyarıları bu Last-Mile çalışmasında değiştirilmez.

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

Kaynak/Supabase doğrulamasından sonra Expo Go 57.0.9 cihaz testinde yalnızca fiziksel kabul gözlemi kalır:

1. Ana sayfada Kurye Merkezi müziği tek başına çalmalı.
2. Vardiya başlayınca merkez müziği tamamen susmalı ve tek sürüş müziği duyulmalı.
3. Yamaha doğru yönde kalmalı; sürücü motosikletle aynı sürüş yönüne bakacak şekilde düzelmiş görünmeli.
4. Ayarlar > Sürüş ve kamera bölümünde Yakın/Takip/Yüksek ile direksiyon yardımı, titreşim ve animasyon ayarları çalışmalı.
5. Uygulama içinde `v0.7`, Android metadata'da versionCode `1` korunmalı.
6. Gerçek hesapla görev alınırken istemcideki local seviye değiştirilse bile sunucu yalnız kendi trusted level'ına uygun görev vermeli.
7. Fiziksel ödül ekranı server verification sürecini atlayarak doğrudan onay/teslim durumuna geçmemeli.

Fiziksel cihaz ekranı GitHub CI tarafından görülemediği için bu maddeler kullanıcı cihazında gözle doğrulanır; kod ve backend tarafındaki karşılıkları regression, migration ve rollback testleriyle kilitlidir.

---

## Önceki checkpoint özeti

- v0.6: 47 müşterilik gerçek portre havuzu, gerçek görev içerikleri, admin seviye/plaka akışı ve Expo SDK 57 korunumu.
- v0.5: Gerçek sezon, ödül doğrulama kuyruğu, özel müşteri akışı, sürüş/çarpışma hotfixleri ve Last-Mile özel Supabase güvenlik modeli.
- v0.4: Gerçek hesap/bulut kayıt ve Last-Mile Edge/RPC temeli.

Sonraki ürün geliştirme havuzu v0.8 ve sonrası için ayrıca ele alınır; v0.7 kapsamında fiziksel cihaz gözlemi dışında açık production kod/Supabase işi bırakılmayacaktır.

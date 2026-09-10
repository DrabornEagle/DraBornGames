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
7. Supabase `dkd-last-mile-api` semantik sürümü `0.7` olarak yayımlanmıştır. `Last-Mile.dkd_lastmile_system_config` içindeki runtime/audio ayarları `Expo SDK 57`, Android `versionCode 1` ve `single_owner=true` ile eşitlenmiştir.
8. Last-Mile doğrudan istemci yüzeyi kilitlidir. `anon` ve `authenticated` rollerinin `Last-Mile` şema kullanım izni yoktur; Last-Mile tablolarında doğrudan istemci grant'i bulunmaz. Trigger yardımcı fonksiyonlarının varsayılan PUBLIC execute yetkisi de kaldırılmış, yalnızca `service_role` bırakılmıştır.
9. GitHub CI generated-file yarışı giderilmiştir. `DKD Last Mile checks` deterministic üretimi doğrular, `DKD Last Mile autogen` generated dosyaları üretip güncel `main` üzerine rebase ederek push eder.
10. Fiziksel ödül ve ilerleme tarafı `server authority v1` ile güçlendirilmiştir. İstemci artık kendi XP, seviye, cüzdan veya teslimat sayısını yükselterek ödül uygunluğu oluşturamaz.
11. Sunucu görev havuzu istemcinin gönderdiği seviyeyi yetki kaynağı olarak kullanmaz; görevler `dkd_server_level` üzerinden açılır. Normal oyuncu ilerlemesi yalnızca sunucu tarafından doğrulanmış tamamlamalarla artar; admin hesabının seviye 50 / sınırsız test avantajları ayrı tutulur.
12. Görev tamamlama için sunucuda `accepted` durum ve sunucu zaman damgası zorunludur. Çok hızlı veya aşırı geç tamamlama fiziksel ödül ilerlemesine sayılmaz, güvenlik olayına kaydedilir ve sunucu XP/cüzdan/teslimat sayaçlarını değiştirmez.
13. Aktif sezon fiziksel ödül başvurusu için en az `100` server-verified teslimat ve bunların içinde en az `10` server-verified fırtına teslimatı gerekir. İstemcinin yolladığı final puanı yalnızca denetim verisi olarak saklanır; yarışma puanı son 100 doğrulanmış görevden sunucuda hesaplanır.
14. Fiziksel ödül hiçbir zaman otomatik olarak teslim edilmiş sayılmaz. Sunucu uygunluğu geçen başvuru `pending_verification` olur; admin `dkd_lastmile_reward_queue` üzerinden görür ve not zorunlu `approved / rejected / fulfilled` inceleme akışı kullanır. Onay/teslim durumunda stok koruması ayrıca `dkd_server_verified=true` şartı uygular.
15. Server authority üretim migration'ı `20260910073427_dkd_lastmile_v07_server_authority` olarak uygulanmıştır. `dkd-last-mile-api` bu katmanla birlikte production deployment generation `10`, `verify_jwt=true` olarak yayımlanmıştır.
16. Server-authority davranışı hem production veritabanında rollback'li entegrasyon testleriyle hem de `tests/dkd-v07-server-authority.test.mjs` regression testiyle kilitlenmiştir. Eski, hardening öncesi tamamlanmış görevler bilinçli olarak güvenilir server-progress sayacına geri doldurulmamıştır.

## Server Authority v1 güvenlik sınırı

Oyuncunun cihazındaki kariyer kaydı; arayüz, yerel ilerleme ve senkronizasyon için saklanmaya devam eder. Fiziksel ödül uygunluğu açısından güvenilir kaynak ise yalnızca sunucu alanlarıdır:

- `dkd_server_xp`
- `dkd_server_level`
- `dkd_server_wallet`
- `dkd_server_deliveries`
- `dkd_server_storm_deliveries`
- `dkd_server_verified`
- `dkd_server_elapsed_sec`
- `dkd_server_score`

Client metrics denetim amacıyla saklanabilir ancak bu değerler server-authoritative sayaçları veya fiziksel ödül sonucunu doğrudan belirlemez.

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
- Node regression testleri, server-authority statik invariants dahil
- TypeScript typecheck
- Expo SDK bağımlılık kontrolü
- Android JavaScript export (APK üretmeden)

Production Supabase üzerinde transaction + rollback testleri şu kötüye kullanım yollarını ayrıca doğrular: sahte local XP/cüzdan/teslimat yükseltme, istemci seviye bypass'ı, accept edilmemiş job complete, aşırı hızlı complete, doğrulanmamış fiziksel ödül başvurusu ve server-score yerine sahte client-score kullanma. Test kayıtları rollback edildiği için production'da sahte claim/job bırakılmaz.

Fiziksel cihazdaki son görsel/ses kabul testi Expo Go 57.0.9 üzerinde yapılır; GitHub CI gerçek telefon ekranını göremez.

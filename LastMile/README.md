# DraBornGo / Last Mile — v0.7.5

Android `versionCode 1` · Expo SDK `57` · Web + Android ortak oyun kaynağı · Supabase kalıcı kariyer sistemi.

- Oyun platformu: https://www.draborneagle.com/DraBornGames/
- Web oyunu: https://www.draborneagle.com/DraBornGames/LastMile/
- Kaynak depo: https://github.com/DrabornEagle/DraBornGames
- Google Play dağıtımı: **yok**
- Android dağıtımı: **DrabornEagle Web + doğrulanmış GitHub Release APK**
- Güncel Android Release: **LastMile v0.7.5 · versionCode 1**

## v0.7.5 güncel durum

Last Mile v0.7.5 Web ve Android tarafında aynı `game/` kaynağından ilerler. Ortak oyun paketi `scripts/dkd-build-game-v07.mjs` ile deterministik olarak oluşturulur; platforma özel farklar yalnız gerekli tarayıcı/Expo köprülerinde tutulur.

Bu sürümde:

- Android sürümü `v0.7.5`, `versionCode 1` olarak sabittir,
- Web ve Android aynı oyun mantığını, hesabı, kariyer kaydını, ödeme durumunu ve sezon verilerini kullanır,
- Last Mile kayıt sistemi Supabase üzerinde dayanıklı ve cihazlar arası devam edebilir yapıdadır,
- oyuncunun anlamlı işlemleri append-only event journal'a yazılır; aynı event yeniden gönderildiğinde ikinci kez sayılmaz,
- oyun state'i revision numarasıyla buluta kaydedilir ve yeni cihaz/oturumda bootstrap üzerinden geri yüklenir,
- cihaz ve oturum bilgileri ayrı kayıt altında tutulur,
- vardiya sürüşünde yaklaşık her 5 saniyede konum, yön, geçen süre, mesafe, bütünlük/kalite ve aktif iş bilgisi checkpoint olarak kaydedilir,
- gerçek teslimat tamamlandığında `order_completed` eventi ilgili sezonun toplam sipariş sayısını artırır,
- **Sezon Merkezi** her sezonun toplam siparişini, başlangıç/bitiş tarihlerini, durumunu, ilerlemesini ve aktif sezonda kalan günü gösterir,
- günlük görevler **Dra Telefon** içinde korunur,
- **Ödül Kasası** hedef kartlarına dokunulduğunda hedefin ne olduğu, mevcut ilerleme, kalan miktar ve nasıl tamamlanacağı modern detay penceresinde gösterilir,
- sezon ödül kataloğundaki tablet ödülü **Apple iPad PRO** olarak standardize edilmiştir,
- özel müşteri/görev profil görsellerindeki hatalı eşleşmeler düzeltilmiştir,
- Garaj araçlarında oyuncunun ilk motorundaki kurye/sürücü modeli filo genelinde tutarlı kullanılır,
- ana sayfadaki sezon rozeti, Ad Soyad, Seviye ve Yıldız kimlik grubu okunabilir mobil yerleşime göre düzenlenmiştir,
- Seviye ve Yıldız rozetleri modern renkli görünüme geçirilmiştir,
- **Sezonun Hedefi** kartı ve ilerleme çubuğu yenilenmiş; Ustalık, Hikâye ve Fırtına göstergeleri daha okunaklı hale getirilmiştir,
- **Vardiyaya Başla** butonunda büyük okunaklı metin korunur; sürekli buton animasyonu kullanılmaz,
- yağmur atmosfer ses seviyesi sürüş müziği ve diğer efektlerin önüne geçmeyecek şekilde azaltılmıştır,
- vardiyada telefon ikonunun üstündeki ses düğmesi müzikten bağımsız olarak oyun ses efektlerini açıp kapatır ve tercih kaydedilir,
- rota merkezindeki görünmeyen/hayalet engel çarpışmaları için korumalı sürüş koridoru uygulanmıştır,
- görünür olarak oluşturulmamış bir yol engeli artık kargoya çarpışma hasarı veremez,
- vardiya sağ yardımcı ikonları harita ve üst HUD alanına binmeyecek şekilde konumlandırılmıştır,
- dekont yüklemede büyük JPG/PNG/WEBP görseller güvenli gönderim boyutuna otomatik küçültülüp JPEG olarak optimize edilir,
- ödeme API katmanı tanılama için gerçek RPC/Postgres hata bilgisini korur,
- yönetici **Ödemeler** alanında dekont görüntüleme, tam ekran inceleme, onay ve ret akışı bulunur,
- ödeme gönderiminden sonra `Ödemeniz inceleniyor` durumu kullanılır,
- kayıt sonrası sezonluk ödeme ve büyük ödül seçim akışı korunur,
- gelecekteki sezon satırları tarih, süre, erişim fiyatı, koşul ve Ödül Kasası kataloğuyla detaylandırılır.

## Güncel imzalı Android Release

v0.7.5 için güncel Release APK kalıcı Last Mile imza anahtarıyla üretilmiş ve GitHub Release + Web indirme alanına yayınlanmıştır.

- Dosya: `LastMile-v0.7.5-release-vc1.apk`
- Version name: `0.7.5`
- Version code: `1`
- Paket: `com.draborneagle.lastmile`
- Mimari: `arm64-v8a`
- Minimum Android: `7.0+`
- Dosya boyutu: `36,356,790` bayt (yaklaşık 35 MB)
- SHA-256: `4f754ae6844a97ac7f36f1ffb29144f392297f5ecf5527864cdfa32a47bffb01`
- Release etiketi: `lastmile-v0.7.5-f1faf3d52540`
- APK kaynak checkpoint'i: `f1faf3d525400b38dd259721752b27306cded408`

Release CI; JavaScript durumunu, testleri, TypeScript'i ve Expo bağımlılıklarını doğruladıktan sonra Android projesini üretir, kalıcı anahtarla Release APK'yı imzalar, `apksigner` ile sertifikayı doğrular, `aapt` ile `versionName`, `versionCode`, paket adı ve debuggable durumunu kontrol eder ve SHA-256 kaydını oluşturur.

## Vardiyan Cebinde / Web APK yayını

DraBornGames ana sayfasındaki **Vardiyan Cebinde** penceresi artık Web'deki `downloads/release.json` verisini okuyarak gerçek Release bilgisini gösterir.

v0.7.5 ile:

- Web'deki eski v0.7.4 APK, güncel v0.7.5 APK ile değiştirilmiştir,
- Web indirme alanında sürüm, Android minimum sürümü, dosya boyutu, mimari ve SHA-256 gösterilir,
- **GÜNCEL APK HEMEN İNDİR** yerel Web kopyasına yönlenir,
- **GITHUB'DAN RELEASE APK İNDİR** doğrulanmış GitHub Release varlığına yönlenir,
- `BUILD-INFO.txt`, `SHA256SUMS.txt`, `SIGNING-IDENTITY.txt` ve `release.json` aynı Release ile senkron tutulur,
- Web senkronizasyonu yeni doğrulanmış v0.7.5 Release APK'yı otomatik olarak Web indirme alanına alabilecek şekilde güncellenmiştir,
- GitHub Pages yayını DraBornGames Web içeriğini son senkron durumla yayınlar.

## Tek kaynak, iki platform

Ana oyun kaynağı `game/` altındadır. Web çıktısı ve Expo/Android paketi aynı modül sırasından üretilir. `web/dkd-browser-adapter.js` yalnız tarayıcıya özgü cihaz davranışlarını uyarlar. Üretilmiş oyun dosyaları elle düzenlenmemelidir.

Web senkronizasyonu DraBornGames kaynağını `DrabornEagle_Web/DraBornGames/LastMile/` hedefine taşır. Android Release ise aynı ortak kaynak üzerinden kalıcı imza anahtarıyla üretilir. Oyun güncelleme ve APK yayınlama birbirinden ayrıdır: normal geliştirme checkpoint'leri APK üretmez; Release istendiğinde imzalı Android Release workflow'u ayrıca çalıştırılır.

## Supabase kalıcı kayıt modeli

Last Mile verileri diğer DraBorn projelerinden ayrı `Last-Mile` şemasında tutulur. v0.7.5 temel tabloları:

- `dkd_lastmile_game_saves`: son doğrulanmış kariyer state'i ve revision,
- `dkd_lastmile_game_events`: kullanıcı işlem/event günlüğü,
- `dkd_lastmile_device_sessions`: cihaz ve oturum takibi,
- `dkd_lastmile_season_order_stats`: sezon başlangıcı ile bitişi arasındaki toplam sipariş sayısı.

Doğrudan istemci tablo erişimi kapalıdır; oyun kimlik doğrulamalı Last Mile API/RPC katmanı üzerinden çalışır. Event kimlikleri kullanıcı bazında benzersiz olduğu için ağ tekrarlarında aynı teslimat veya işlem ikinci kez sayılmaz.

## Bulut ve ödeme

Kariyer ve ödeme merkezi Supabase üzerinden ortak hesaba bağlıdır. Dekont gönderimi ödeme iş akışıdır; vardiya başlatma hatası olarak işlenmez. Yönetici ödeme panelinden bekleyen dekontlar görüntülenebilir, tam ekran incelenebilir, onaylanabilir veya reddedilebilir. IBAN, hesap sahibi, kullanıcı notu ve sezon fiyatları yönetici panelinden güncellenir.

Dekont seçildiğinde istemci desteklenen görüntüyü doğrular. Büyük görseller, okunabilirlik korunarak azami 1800 piksel kenar uzunluğuna küçültülür ve HTTP/RPC yükünü güvenli seviyede tutacak şekilde sıkıştırılır. Bu işlem yalnız gönderim kopyasına uygulanır; kullanıcının cihazındaki orijinal dosya değiştirilmez.

Sezonluk Ödeme ekranında aktif sezon, seçilen ödül ve sonraki sezon ayrıntıları aynı ortak kaynaktan gösterilir. Gelecek sezon detay penceresi buluttaki tarih/fiyat bilgilerini oyun içindeki sezon temasıyla ve Ödül Kasasının sezon kataloğuyla birleştirir.

## Termux / Expo Go 57.x

### Tek komutla güncel kurulum

```bash
pkg update -y && \
pkg install -y git nodejs-lts util-linux openssh && \
mkdir -p "$HOME/projects" && \
cd "$HOME/projects" && \
if [ -d DraBornGames/.git ]; then \
  cd DraBornGames && \
  git remote set-url origin https://github.com/DrabornEagle/DraBornGames.git && \
  git status --porcelain | grep -q . && git stash push -u -m "dkd-auto-backup-$(date +%Y%m%d-%H%M%S)" || true && \
  git fetch origin --prune && \
  git switch main && \
  git reset --hard origin/main; \
else \
  git clone https://github.com/DrabornEagle/DraBornGames.git && \
  cd DraBornGames; \
fi && \
cd LastMile && \
chmod +x scripts/dkd-sync.sh scripts/dkd-termux.sh && \
npm ci && \
npm run build:game && \
bash scripts/dkd-termux.sh
```

Sonraki açılışlar:

```bash
cd "$HOME/projects/DraBornGames/LastMile" && bash scripts/dkd-termux.sh
```

Ayrıntılı Termux rehberi: `TERMUX.md`.

## Doğrulama

Normal geliştirme doğrulaması:

```bash
cd "$HOME/projects/DraBornGames/LastMile"
npm run verify
```

CI ortak oyun paketini yeniden üretir; üretilen dosyaların kaynakla eşleşmesini, Node testlerini, TypeScript doğrulamasını, Expo SDK 57 bağımlılıklarını, Android JavaScript export smoke testini, Web ortak-kaynak smoke testini ve repository whitespace kontrolünü çalıştırır.

İmzalı APK Release workflow'u ayrıca kalıcı signing identity, Release APK yapısı, sürüm/paket bilgisi, mimari ve SHA-256 doğrulaması yapar.

## Sürüm özeti

- Last Mile: **v0.7.5**
- Android versionCode: **1**
- Expo SDK: **57** (`expo ~57.0.20`)
- Hedef geliştirme istemcisi: Expo Go **57.x**
- Android dağıtım: **İmzalı Release APK / Web + GitHub Release**
- Google Play: **kullanılmıyor**
- Menü müziği: `InnerLight.mp3`
- Vardiya müziği: `SeMeNota.mp3`
- Web + Android: **senkron ortak kaynak**
- Bulut kayıt: **Supabase durable save + event journal + device sessions + season stats**
- Güncel Release SHA-256: `4f754ae6844a97ac7f36f1ffb29144f392297f5ecf5527864cdfa32a47bffb01`

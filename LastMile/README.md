# DraBornGo / Last Mile — v0.7.5

Android `versionCode 1` · Expo SDK `57` · Web + Android/Expo ortak kaynak.

- Oyun platformu: https://www.draborneagle.com/DraBornGames/
- Web oyunu: https://www.draborneagle.com/DraBornGames/LastMile/
- Kaynak depo: https://github.com/DrabornEagle/DraBornGames
- Google Play dağıtımı: **yok**
- Güncel geliştirme akışı: **APK/AAB üretmez**

## v0.7.5 güncel durum

v0.7.5, Web ve Android/Expo tarafında aynı `game/` kaynağından ilerler. Ortak oyun paketi `scripts/dkd-build-game-v07.mjs` ile deterministik olarak oluşturulur; platforma özel farklar yalnız gerekli tarayıcı/Expo köprülerinde tutulur.

Bu checkpoint ile:

- Android sürümü `v0.7.5`, `versionCode 1` olarak sabittir,
- Last Mile kayıt sistemi Supabase üzerinde sıfırdan dayanıklı ve cihazlar arası devam edebilir yapıya taşınmıştır,
- oyuncunun anlamlı işlemleri append-only event journal'a yazılır; yeniden gönderilen aynı event ikinci kez sayılmaz,
- oyun state'i revision numarasıyla buluta kaydedilir ve yeni cihaz/oturumda bootstrap üzerinden geri yüklenir,
- cihaz ve oturum bilgileri ayrı kayıt altında tutulur,
- vardiya sürüşünde her 5 saniyede bir konum, yön, geçen süre, mesafe, hasar/kalite ve aktif iş bilgisi `drive_checkpoint` olarak işaretlenir,
- gerçek teslimat tamamlandığında `order_completed` eventi sezon tarih aralığına göre ilgili sezonun toplam sipariş sayısını artırır,
- **KURYE MERKEZİ** aktif ve geçmiş sezonları başlangıç/bitiş tarihleriyle birlikte ayrı ayrı gösterir ve sezon toplam sipariş bilgisini buluttan okur,
- vardiya sırasında sağdaki yardımcı ikonlar harita/üst HUD alanının üzerine binmemesi için aşağı taşınmıştır,
- görünen sürüm etiketleri `v0.7.5` olarak normalize edilir,
- yönetici **Ödemeler** bölümü Test Laboratuvarı'ndan bağımsızdır,
- ödeme/dekont gönderimi vardiya başlatma akışından ayrıdır,
- ödeme gönderiminden sonra `Ödemeniz inceleniyor` durumu kullanılır,
- IBAN/Havale kullanıcı notu renkli ve hareketli vurguya sahiptir,
- yönetici ödeme ekranında dekonta dokunulduğunda tam ekran dekont görüntüleyici açılır,
- kayıt sonrası büyük ödül bilgilendirmesi ve sezonluk ödeme akışı korunur,
- **Sonraki sezonlar** satırları sezon adı, başlangıç/bitiş, süre, erişim fiyatı, sezon koşulu ve Ödül Kasası kataloğunu gösterir,
- Web ve Android/Expo aynı davranışı ve aynı Supabase kariyer kaydını paylaşır.

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

## Tek kaynak, iki platform

Ana oyun kaynağı `game/` altındadır. Web çıktısı ve Expo/Android paketi aynı modül sırasından üretilir. `web/dkd-browser-adapter.js` yalnız tarayıcıya özgü aygıt davranışlarını uyarlar. Üretilmiş dosyalar elle düzenlenmemelidir.

Web senkronizasyonu DraBornGames kaynağını `DrabornEagle_Web/DraBornGames/LastMile/` hedefine taşır. Android/Expo geliştirme paketi de aynı source revision'dan oluşturulur. v0.7.5 Web senkronu APK üretmez, kopyalamaz veya mevcut APK dosyasını değiştirmez.

## Supabase kalıcı kayıt modeli

Last Mile verileri diğer DraBorn projelerinden ayrı `Last-Mile` şemasında tutulur. v0.7.5 temel tabloları:

- `dkd_lastmile_game_saves`: son doğrulanmış kariyer state'i ve revision,
- `dkd_lastmile_game_events`: kullanıcı işlem/event günlüğü,
- `dkd_lastmile_device_sessions`: cihaz ve oturum takibi,
- `dkd_lastmile_season_order_stats`: sezon başlangıcı ile bitişi arasındaki toplam sipariş sayısı.

Doğrudan istemci tablo erişimi kapalıdır; oyun mevcut kimlik doğrulamalı Last Mile API/RPC katmanı üzerinden çalışır. Event kimlikleri kullanıcı bazında benzersiz olduğu için ağ tekrarlarında aynı teslimat veya işlem ikinci kez sayılmaz.

## Bulut ve ödeme

Kariyer ve ödeme merkezi Supabase üzerinden ortak hesaba bağlıdır. Dekont gönderimi ödeme iş akışıdır; vardiya başlatma hatası olarak işlenmez. Yönetici ödeme panelinden bekleyen dekontlar görüntülenebilir, tam ekran incelenebilir, onaylanabilir veya reddedilebilir. IBAN, hesap sahibi, kullanıcı notu ve sezon fiyatları yönetici panelinden güncellenir.

Sezonluk Ödeme ekranında aktif sezon, seçilen ödül ve sonraki sezon ayrıntıları aynı ortak kaynaktan gösterilir. Gelecek sezon detay penceresi buluttaki tarih/fiyat bilgilerini oyun içindeki sezon temasıyla ve Ödül Kasasının sezon kataloğuyla birleştirir.

## Doğrulama

```bash
cd "$HOME/projects/DraBornGames/LastMile"
npm run verify
```

CI kontrolü ortak oyun paketini yeniden üretir; üretilen dosyaların kaynakla eşleşmesini, Node testlerini, TypeScript doğrulamasını, Expo SDK 57 bağımlılıklarını, Android JavaScript export smoke testini, Web ortak-kaynak smoke testini ve repository whitespace kontrolünü çalıştırır. Bu geliştirme akışında APK/AAB derlenmez.

## Sürüm

- Last Mile: **v0.7.5**
- Android versionCode: **1**
- Expo SDK: **57** (`expo ~57.0.20`)
- Hedef: Expo Go **57.x**
- Menü müziği: `InnerLight.mp3`
- Vardiya müziği: `SeMeNota.mp3`
- Web + Android/Expo: **senkron ortak kaynak**
- Bulut kayıt: **Supabase durable save + event journal + season stats**

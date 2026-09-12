# DraBornGo / Last Mile — v0.7.4

Android `versionCode 1` · Expo SDK `57` · Web + Android/Expo ortak kaynak.

- Oyun platformu: https://www.draborneagle.com/DraBornGames/
- Web oyunu: https://www.draborneagle.com/DraBornGames/Last-Mile/
- Kaynak depo: https://github.com/DrabornEagle/DraBornGames
- Google Play dağıtımı: **yok**
- Güncel geliştirme akışı: **APK/AAB üretmez**

## v0.7.4 güncel durum

v0.7.4, Web ve Android/Expo tarafında aynı `game/` kaynağından ilerler. Ortak oyun paketi `scripts/dkd-build-game-v07.mjs` ile deterministik olarak oluşturulur; platforma özel farklar yalnız gerekli tarayıcı/Expo köprülerinde tutulur.

Bu checkpoint ile:

- görünen sürüm etiketleri yalnızca `v0.7.4` gösterir ve tekrar normalizasyonunda `.4` eklenmez,
- yönetici **Ödemeler** bölümü Test Laboratuvarı'ndan bağımsızdır,
- ödeme/dekont gönderimi vardiya başlatma akışından ayrıdır,
- ödeme gönderiminden sonra `Ödemeniz inceleniyor` durumu kullanılır,
- IBAN/Havale kullanıcı notu renkli ve hareketli vurguya sahiptir,
- yönetici ödeme ekranında dekonta dokunulduğunda tam ekran dekont görüntüleyici açılır,
- kayıt sonrası büyük ödül bilgilendirmesi gösterilir; sonraki girişlerde kullanıcı Sezonluk Ödeme ekranına düşüyorsa **giriş oturumu başına bir kez** `ACELE ET` bilgilendirmesi yeniden açılır,
- çıkış yapıldığında oturumluk ödül bilgilendirme işareti temizlenir; yeni giriş yeni bir oturum sayılır,
- Sezonluk Ödeme ekranındaki aktif sezon kartı renkli/premium düzene sahiptir ve kullanıcının seçtiği büyük ödülü gösterir,
- **Sonraki sezonlar** satırları dokunulabilirdir; sezon adı, başlangıç/bitiş, süre, erişim fiyatı ve sezon koşulunu modern ayrıntı penceresinde gösterir,
- sonraki sezon ayrıntılarındaki büyük ödüller doğrudan **Ödül Kasası ile aynı sezon kataloğundan** okunur: Sezon 02 PlayStation 5 Pro / ROG Ally X / Meta Quest 3S; Sezon 03 MacBook Air / iPad Pro / Apple Watch Ultra; Sezon 04 Galaxy S Ultra / Lenovo Legion Gaming Laptop / Steam Deck OLED,
- sezon ayrıntı popup'ı kendi kaydırma alanında çalışır; kapandığında ödeme sayfasının kaydırma/viewport konumu geri yüklenir ve sezonlar art arda yeniden açılabilir,
- Web ve Android/Expo aynı davranışı paylaşır.

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

Web senkronizasyonu DraBornGames kaynağını `DrabornEagle_Web/DraBornGames/Last-Mile/` hedefine taşır. Android/Expo geliştirme paketi de aynı kaynak revision'ından oluşturulur. Böylece oyun mantığı ve arayüz değişiklikleri iki tarafta birlikte ilerler.

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

- Last Mile: **v0.7.4**
- Android versionCode: **1**
- Expo SDK: **57** (`expo ~57.0.20`)
- Hedef: Expo Go **57.x**
- Menü müziği: `InnerLight.mp3`
- Vardiya müziği: `SeMeNota.mp3`
- Web + Android/Expo: **senkron ortak kaynak**

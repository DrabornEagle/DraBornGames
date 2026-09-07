# DraBornGo / Son Kilometre

**v0.2.0 — Expo Go SDK 57 için oynanabilir geliştirme sürümü.**

DraBornGo / Last Mile; oyuncunun eski bir başlangıç scooter'ı ve küçük kurye şirketiyle başlayıp teslimatlar, hava koşulları, trafik, araç geliştirmeleri, özel müşteriler ve Final Görevi üzerinden ilerlediği dikey ekran 3D kurye oyunudur.

Bu sürüm geliştirme/test sürümüdür. Supabase, gerçek ödeme, canlı çevrimiçi sıralama, sunucu anti-cheat ve gerçek fiziksel ödül doğrulaması bağlı değildir. APK/AAB üretilmez; test Expo Go üzerinden yapılır.

## v0.2 değişiklikleri

- Başlangıç aracı **Şehir 50**, gönderilen modern scooter 3D geometrisiyle değiştirildi.
- **Güvenli** ve **Ara Sokak** seçeneklerinin aynı rota ve ekranda aynı km ile görünmesi engellenmek için sipariş oluşturma iyileştirildi. Güvenli rota geniş yolları tercih eder, Ara Sokak gerçek kısa rotayı kullanır; iki seçenek aynı çıkarsa kullanıcıya gösterilmeden farklı hedef aranır.
- Yoldaki limon renkli rota oklarının 3D yönü düzeltildi; ok ucu gerçek ilerleme yönünü gösterir.
- Mobil direksiyon kontrolündeki ters yön problemi düzeltildi.
- Rota seçim ve sürüş ekranındaki görünür **OpenStreetMap katılımcıları** yazısı kaldırıldı. Kaynak/lisans bilgisi Veri ve deneme kapsamı ekranında korunur.
- Uygulama sürümü `0.2.0`, ekran etiketi `v0.2`, Android `versionCode` değeri `200` oldu.
- Expo SDK **57** korunur. Expo Go 57.x hattında test edilir.
- Kaynak değişikliklerinden sonra oyun HTML paketi GitHub Actions ile otomatik üretilir; test, TypeScript kontrolü ve Expo bağımlılık kontrolü çalıştırılır.

## v0.101 geri dönüş yedeği

v0.101 sürümü GitHub'da ayrı ve değiştirilmeyen bir yedek dalında tutulur:

```text
backup/DraBornGo-LastMile-v0.101
801c3cd55b894293a70f991f78f3564269d6897c
```

Gerekirse bu sürüme birebir geri dönülebilir.

## Termux kurulumu

Hedef klasör:

```text
$HOME/projects/DraBornGames/DraBornGo-LastMile
```

İlk kurulum veya temiz eşitleme için:

```bash
pkg update -y && pkg upgrade -y
pkg install -y git nodejs-lts util-linux curl

mkdir -p "$HOME/projects"

if [ ! -d "$HOME/projects/DraBornGames/.git" ]; then
  git clone https://github.com/DrabornEagle/DraBornGames.git "$HOME/projects/DraBornGames"
fi

cd "$HOME/projects/DraBornGames"
git fetch origin --prune
git switch main 2>/dev/null || git switch -c main --track origin/main
git reset --hard origin/main

cd "$HOME/projects/DraBornGames/DraBornGo-LastMile"
npm ci --no-audit --no-fund
npm run build:game
npm test
npm run typecheck
npx expo install --check

bash scripts/dkd-termux.sh
```

Daha kısa kurulum yöntemi:

```bash
pkg update -y && pkg upgrade -y
pkg install -y git nodejs-lts util-linux curl
bash -o pipefail -c 'curl -fsSL https://raw.githubusercontent.com/DrabornEagle/DraBornGames/main/DraBornGo-LastMile/scripts/dkd-install.sh | bash'
```

Başlatıcı GitHub `main` dalını 30 saniyede bir kontrol eder. Yeni commit geldiğinde lokal repo güvenli biçimde `origin/main` ile eşitlenir ve Metro gerektiğinde yeniden başlatılır. Lokal değişiklik varsa eşitleme betiği bunları doğrudan silmek yerine stash / preserved branch ile korur.

## Expo Go testi

Projede:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile"
bash scripts/dkd-termux.sh
```

Aynı Android telefonda Expo Go kullanılıyorsa başlatıcı varsayılan olarak:

```text
exp://127.0.0.1:8081
```

adresini kullanır. Gerekirse LAN yöntemi:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile"
npm run start:lan
```

Metro önbelleğini temizlemek gerekirse:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile"
npx expo start --go --localhost --clear
```

## Doğrulama

Kaynak değişikliği sonrası standart kontrol:

```bash
npm ci --no-audit --no-fund
npm run build:game
npm test
npm run typecheck
EXPO_OFFLINE=1 npx expo install --check
EXPO_OFFLINE=1 npx expo export --platform android --output-dir dist-android
```

Son komut APK üretmez; yalnızca Android JavaScript/Hermes export kontrolüdür.

Üretilen dosyalar:

```text
assets/dkd-lastmile.html
src/generated/dkd-game-html.ts
```

Bu dosyalar `scripts/dkd-build-game.mjs` tarafından oluşturulur ve GitHub otomatik üretim iş akışıyla güncel tutulur.

## Temel oyun içeriği

- Ankara merkezinden paketlenmiş yol ağı ve tek yön bilgileri.
- Three.js/WebGL tabanlı 3D şehir ve sürüş.
- Hava, trafik, yakıt, bakım, paket hasarı ve sıcaklık sistemleri.
- Scooter, motosiklet, otomobil ve kargo araçları.
- Güvenli rota / Ara Sokak rota seçimi.
- Şirket, garaj, cüzdan, mesajlar, özel müşteriler ve Final Görevi.
- Yerel kariyer kaydı, test kariyeri ve JSON yedekleme.
- Düşük / Dengeli / Yüksek grafik ayarları.
- Expo Go üzerinden Android geliştirme testi.

## Geliştirme notu

GitHub `main` bu projenin kaynak doğrusu olarak kullanılır. Telefon tarafında lokal repo düzenli olarak `origin/main` ile eşit tutulur. v0.101 yedeği ayrı dalda korunur; v0.2 ve sonraki çalışmalar `main` üzerinden devam eder.

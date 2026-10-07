# DraBornLand · Küllerin Kıyısı

Üçüncü şahıs ada survival oyunu. Aynı Three.js oyun motoru Android Expo Go 58.0.2 içinde çevrimdışı ve tarayıcıda çalışır. Supabase veya hesap sistemi yoktur; APK üretilmez.

## Oynanış

Kazazede Koyu'ndan başla. Odun, taş, lif, meyve ve kristal topla; balta ve kazmanı geliştir, kılıç üret. Açlık ve dayanıklılığını yönet. Zemin, duvar, açılır kapı, çatı ve kamp ateşiyle bir barınak kur. Kamp ateşi yakınında dinlen; gece çoğalan yaratıklardan korun.

Haritada Orman, Dağ ve Gelgit mühürlerini bul. Üçünü topladığında Kül Tapınağı'nın kapısı açılır. Ejderhanın yere işaretlediği saldırılardan kaç ve saldırılar arasındaki boşlukları kullan. Adanın ortasındaki deniz fenerini **24 odun ve 18 taş** ile onararak Fırtına Kılıcı'nı kazan. Fener onarıldığında ve ejderha yenildiğinde oyun tamamlanır. Görevleri istediğin sırayla yapabilirsin.

Ölümde sahile dönersin; kaynak cezası uygulanır, görevler ve yapılar korunur. Oyun zamanını duraklatma ve menüler durdurur. Gün/gece döngüsü 8 dakikadır.

## Kontroller

| Eylem | Web / klavye | Android / dokunmatik |
|---|---|---|
| Hareket | WASD / oklar | Sol analog |
| Kamera | Oyun alanında sürükle | Sağ taraftaki oyun alanında sürükle |
| Koş | Shift | Koş düğmesi |
| Zıpla | Boşluk | Zıpla düğmesi |
| Saldır / ağaç kes / kaya kır | F | Saldırı düğmesi |
| Topla / etkileş / fener / kapı | E | El düğmesi |
| Hotbar | 1–5 | Yuvaya dokun |
| Ye / yapı döndür | R | İlgili düğme |
| Yapı yerleştir | Enter | Yerleştir |
| Envanter / üretim / inşa | I / C / B | Menü simgeleri |
| Harita / görevler | M / J | Menü simgeleri |
| Duraklat | Esc | Menü / Android geri |

## Termux kurulumu

Güncel Termux içinde:

```sh
pkg update -y && pkg install -y nodejs-lts git
git clone https://github.com/DrabornEagle/DraBornGames.git
cd DraBornGames/DraBornLand
npm ci
npm start -- --localhost
```

Expo Go **58.0.2** uygulamasında Metro'nun yazdığı `exp://127.0.0.1:8081` adresini aç. Aynı telefonda `--localhost` kullanılır. Bilgisayardan telefona bağlanırken aynı Wi-Fi üzerinde `npm start -- --lan` kullan. Node 22.13+, 24.3+ veya 26 LTS gerekir. Kurulumu ve başlatmayı tek betikle yapmak için `bash scripts/termux-setup.sh` kullanılabilir.

Önceden klonladıysan `git pull --ff-only` çalıştır, sonra `cd DraBornLand && npm ci && npm start -- --localhost` kullan. Telefonun ekran yönü yatay olarak yapılandırılmıştır.

## Web

Yayın hedefi: **https://www.draborneagle.com/DraBornGames/DraBornLand/**

Yerel web önizlemesi:

```sh
npm ci
npm run web
```

`http://localhost:4173/DraBornGames/DraBornLand/` adresini aç. Web çıktısı `web/index.html`; tüm motor, materyal ve UI kodu içine gömülüdür. Oyun CDN veya uzak asset indirmez. İlk web ziyareti ağ gerektirir; Android HTML oyun motorunu kendi içinde taşır.

## Lokal kayıt ve cihazlar arasında aktarım

Oyun her 10 saniyede ve önemli eylemlerde kaydeder. Web kayıtları tarayıcının localStorage alanında; Android kayıtları AsyncStorage'da bulunur. Tarayıcı verilerini silmek web kaydını siler.

Duraklatma/ayarlar ekranından **Dışa aktar** ile JSON indir veya Android paylaşım ekranına gönder. Diğer cihazda **İçe aktar** alanına dosyanın içeriğini yapıştır. Görevler, yapılar, toplanmış kaynaklar, ekipman ve oyuncu durumu aktarılır. Cihazlar arasında sunucusuz otomatik eşitleme veya çok oyunculu oyun yoktur.

## Proje ve doğrulama

```sh
npm run check
EXPO_OFFLINE=1 npx expo install --check
EXPO_OFFLINE=1 npm run export:android
```

Android export yalnız Metro/Hermes JavaScript paketidir; APK değildir. Expo ve SDK uyumluluk kanıtı [docs/EXPO-COMPATIBILITY.md](docs/EXPO-COMPATIBILITY.md), yayın altyapısı [DEPLOYMENT.md](DEPLOYMENT.md), test sonuçları [docs/TEST-REPORT.md](docs/TEST-REPORT.md) içindedir. Fiziksel Android cihaz testi, yapılmadıysa doğrulanmış olarak sunulmaz.

- `game/simulation.ts`: platformdan bağımsız kurallar, AI, görevler ve kayıt doğrulama.
- `game/world.ts`: özgün prosedürel 3D modeller, PBR dokular, ada ve atmosfer.
- `game/main.ts`: renderer, üçüncü şahıs kamera, input ve görsel/ses bağlantıları.
- `game/ui.ts`, `game/style.css`: dokunmatik HUD, envanter, crafting, harita ve menüler.
- `game/audio.ts`: özgün Web Audio sesleri ve kıyı ambiyansı.
- `App.tsx`: Expo WebView ve kalıcı Android kayıt köprüsü.
- `scripts/build.mjs`: aynı kaynaktan web ve Android için çevrimdışı HTML üretir.

3D varlıklar ve dokular bu proje için kodla oluşturulmuştur. Harici asset lisansı veya eksik prefab referansı yoktur. Mobil performans için grafik kalitesi ayarlanabilir.

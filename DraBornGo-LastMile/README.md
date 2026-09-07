# DraBornGo / LAST MILE

**v0.100.0 — Expo Go SDK 57 için oynanabilir, yerel verili geliştirme demosu.**

Eski scooter ve küçük şirketle başla; Ankara yollarında paket taşı, hava ve trafikle mücadele et, araçlarını geliştir, VIP hikâyelerini tamamla ve Final Contract’a ulaş. Dikey 3D sürüş ile işletim sistemi biçimindeki kurye telefonu aynı uygulamada çalışır.

Bu teslim **tam üretim sürümü değildir**. Supabase, hesap sunucusu, gerçek ödeme, canlı AI, çevrimiçi sıralama, sunucu anti-cheat ve fiziksel ödül dağıtımı bağlı değildir. APK/AAB üretilmez. Bunların yerine açıkça etiketlenmiş demo akışları bulunur. [50 maddelik kapsam](docs/DKD-KAPSAM.md) mevcut davranışı ve üretim için kalan işleri tek tek gösterir.

## Termux kurulumu

Expo Go **57.0.9** hedeflenmiştir. Proje Expo SDK 57, React Native 0.86.3 ve React 19.2.3 kullanır. Telefonun Android System WebView bileşeninde WebGL2 desteği gerekir. Fiziksel cihaz testi henüz yapılmamıştır.

Termux içinde aşağıdaki bloğu çalıştır:

```bash
pkg update -y &&
pkg install -y git nodejs-lts util-linux curl &&
bash -o pipefail -c 'curl -fsSL https://raw.githubusercontent.com/DrabornEagle/DraBornGames/main/DraBornGo-LastMile/scripts/dkd-install.sh | bash'
```

Kurulum `$HOME/projects/DraBornGames/DraBornGo-LastMile` klasörünü kullanır. Mevcut depo varsa günceller; yoksa klonlar. Kilitli npm paketleri kurulur, ardından Metro başlar. Java/JDK, Python, Android SDK, Supabase anahtarı ve EAS hesabı gerekmez.

**Aynı telefonda Expo Go’ya `exp://127.0.0.1:8081` adresini gir.** İstersen ikinci Termux oturumunda `termux-open-url 'exp://127.0.0.1:8081'` çalıştır. İlk paketleme bitene kadar bekle.

Sonraki açılışlar:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile"
bash scripts/dkd-termux.sh
```

Başlatıcı GitHub `main` dalını **30 saniyede bir** kontrol eder. Kaynak değişirse Metro’yu yeniden başlatır; bağımlılıklar değişirse önce `npm ci` çalıştırır. O sıradaki teslimat yeniden denenmelidir; tamamlanan kariyer ilerlemesi cihazda kalır. Termux’u açık tut ve gerekiyorsa Android pil kısıtlamasını kaldır. Android uygulamayı kapatırsa eşitleme durur; başlatıcı tekrar açılınca devam eder. Fiziksel telefonuna bu çalışma ortamından doğrudan dosya yazılamaz; yukarıdaki komut ilk kurulumu başlatır.

Yerel değişiklikler otomatik olarak uzak depoya gönderilmez: güncelleme öncesinde `git stash` ve gerektiğinde `dkd-preserved/...` dallarıyla korunur. GitHub `main` bu test kurulumunun kaynağıdır. [Eşitleme ve kurtarma](docs/DKD-TERMUX.md).

## İlk oyun ve hızlı test

1. Şirketini oluştur; demo ad ve telefon kullanabilirsin. Fotoğraf isteğe bağlıdır. Renk, logo ve kıyafet seç.
2. Ankara’yı ve Phone / MSI / Tablet Contract hedefini seç.
3. Eğitim teslimatında sağdaki **GAZ**’a basılı tut. Varsayılan direksiyon yardımcısı rotayı izler; soldaki yön pedi müdahale eder. Teslimat alanında **FREN** ile dur ve paketi teslim et.
4. Eğitimden sonra **ücretsiz demo kariyerini aç**. Dispatch’ten işleri kabul et/reddet; güvenli veya kısa rota seç.
5. **Telefon → Ayarlar → Test kariyeri** ana kariyerden ayrı bir kayıt açar. Test bütçesi ve VIP token hazırdır. İstersen **Final test verisini hazırla** ile Final kilitlerini test kaydında aç.
6. Contracts içinden VIP seçimi, altı bölüm, Black Contract veya Final’i dene. Ana kariyere dönünce test bakiyesi ve skorları ana kayda geçmez.

Telefon/menü açılınca simülasyon duraklar. Arka plana geçiş ve Android geri tuşu da sürüşü duraklatır. Uygulama tamamen kapanırsa aktif teslimat sürdürülmez; son kaydedilmiş kariyer açılır.

## Bu sürümde

- OSM’den alınan **1.476 nokta / 1.562 yol parçası** ile Ankara merkezinde yaklaşık 1,5 × 1,7 km alan; tek yönler ve kapanışlara uyan rotalama. Binalar, müşteriler ve teslimat girişleri kurgusaldır.
- Three.js/WebGL2 ile gerçek zamanlı 3D şehir, kurye, scooter/motosiklet/araç varyantları, garaj, Vault; trafik, paket hasarı, yakıt, bakım, sıcaklık ve hava etkileri.
- 14 paket sınıfı, 10 araç, oyun parasıyla geliştirme/kozmetik, şirket markası, fotoğraf ve paylaşılabilir şirket/teslimat kartları.
- 16 uygulamalı kurye telefonu, Dispatch, navigasyon, cüzdan, yorumlar, itibar, günlük görevler ve kozmetik streak ödülleri.
- 10 yetişkin kurgusal müşteri, dört VIP’nin altışar bölümü, üç Black Contract görevi; yazılmış diyaloglar ve cihazın Türkçe metin okuma desteğiyle görüşme demosu.
- Dört sezon teması, standart araçla üç zorunlu durağı olan Final, yerel telemetri kontrolü, skor geçmişi ve önceki yerel Final kaydından Ghost.
- Ayrı test kariyeri, JSON yedekleme/geri yükleme, düşük/dengeli/yüksek grafik ayarları, beş prosedürel müzik parçası ve motor/yağmur/korna efektleri.

## Geliştirme ve doğrulama

```bash
npm ci
npm run build:game
npm test
npm run typecheck
EXPO_OFFLINE=1 npx expo install --check
EXPO_OFFLINE=1 npx expo export --platform android --output-dir dist-android
```

Son komut yalnızca Android JavaScript/Hermes paketi çıkarır; **APK üretmez**. `npm run preview` masaüstü için aynı HTML’yi `http://localhost:4173` üzerinde sunar. Bu sürümün görsel tarayıcı/cihaz kabul testi henüz tamamlanmadı; test kanıtı ve sınırları [doğrulama belgesinde](docs/DKD-TEST.md).

Oyun kaynaklarını değiştirdikten sonra `npm run build:game` zorunludur. `assets/dkd-lastmile.html` ve `src/generated/dkd-game-html.ts` üretilmiş dosyalardır ve repoya alınır. Böylece telefonda ayrıca oyun derlemesi gerekmez. Metro native kabuğu paketler. `npm start` yalnızca geliştirme sunucusunu açar; otomatik eşitleme için Termux başlatıcısını kullan.

- [Mimari ve yerel veri](docs/DKD-MIMARI.md)
- [50 maddelik kapsam](docs/DKD-KAPSAM.md)
- [Termux / eşitleme / sorun giderme](docs/DKD-TERMUX.md)
- [Test ve cihaz kabul adımları](docs/DKD-TEST.md)
- [Sürüm notları](docs/DKD-SURUM-NOTLARI.md)
- [Üçüncü taraf kaynaklar ve lisanslar](docs/DKD-KAYNAKLAR.md)

© OpenStreetMap contributors. Yol verisi ODbL 1.0 kapsamında paylaşılır; oyun kodundan ayrı lisanslanır. Gerçek navigasyon veya fiziksel araç kullanımı için tasarlanmamıştır.

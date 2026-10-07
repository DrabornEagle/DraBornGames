# DraBornLand yayın yapısı

Kaynak: https://github.com/DrabornEagle/DraBornGames/tree/main/DraBornLand

Web hedefi: https://www.draborneagle.com/DraBornGames/DraBornLand/

## Doğrulanan mevcut altyapı

6 Ekim 2026 incelemesinde `www.draborneagle.com` alan adının `CNAME` kaydı `DrabornEagle/DrabornEagle_Web` deposunda bulundu. Bu deponun `.github/workflows/dkd_company_pages.yml` iş akışı `main` değişikliklerinde tüm web kökünü GitHub Pages'e yayınlıyor. `DraBornGames` kaynak deposu kendi başına bu özel alan adını yayınlamıyor.

Dolayısıyla DraBornLand web paketi şu konuma eklenir:

```text
DrabornEagle_Web/
  DraBornGames/
    DraBornLand/
      index.html
      … web/ içindeki diğer yayın dosyaları
```

`DraBornGames/LastMile/`, `DraBornGames/shifterror/`, ana oyun platformu ve mevcut alan adı ayarları ayrı kalır. Mevcut LastMile senkronizasyonu yalnız kendi oyun klasörünü güncelliyor.

## Paket oluşturma ve yayınlama

```bash
cd DraBornLand
npm ci
npm run check
npm run export:android
```

`web/` bağımsız statik web çıktısıdır. `generated/game-html.ts`, Expo Go içindeki WebView'in aynı oyunu çevrimdışı yüklemesi için aynı derlemeden üretilir. Android export yalnız JavaScript paketini doğrular; APK oluşturmaz.

Web yayınında yalnız `web/` içeriğini web deposundaki `DraBornGames/DraBornLand/` hedefine kopyala ve bu klasörü commit et. `node_modules/`, Expo kaynakları veya Android JavaScript export'u web sunucusuna kopyalanmaz. Web depodaki mevcut Pages iş akışı yayınlar; yeni `CNAME` veya ayrı bir Pages kurulumu gerekmez.

Kaynak deponun `.github/workflows/drabornland.yml` iş akışı TypeScript, oyun testleri, Expo bağımlılıkları, Android JavaScript export'u ve ortak web çıktısını doğrular; `DraBornLand-web` isimli yayın dosyası arşivini oluşturur. Bu iş akışı web deposunu veya diğer oyunları değiştirmez.

## Otomatik web senkronizasyonu

Web deposunda ayrıca `.github/workflows/drabornland-web-sync.yml` kurulur. Bu iş akışı yaklaşık 15 dakikada bir kaynak deponun `main` dalını kontrol eder. GitHub zamanlanmış işleri yoğunluğa göre gecikebilir. Yalnız `DraBornLand/` klasörüne son dokunan commit değiştiğinde, Node 24 üzerinde kilitli bağımlılıkları `npm ci` ile yükler; TypeScript, oyun testleri, Expo bağımlılık kontrolü ve APK üretmeden Android JavaScript export'unu çalıştırır.

Kontroller başarılıysa web çıktısı yalnız `DrabornEagle_Web/DraBornGames/DraBornLand/` altına kopyalanır. `source.json` hangi kaynak commit'inin yayınlandığını kaydeder. Değişmeyen sürüm yeniden derlenmez ve mevcut diğer oyunlar bu iş akışında değiştirilmez.

Senkronizasyonun bot commit'i GitHub tarafından ikinci bir `push` iş akışını otomatik tetiklemediği için, işin sonunda mevcut `dkd_company_pages.yml` açıkça `workflow_dispatch` ile başlatılır. Bu mevcut Pages iş akışında manuel tetikleme desteği doğrulandı. Kimlik doğrulama yalnız GitHub'ın ilgili web deposuna verdiği geçici `GITHUB_TOKEN` ile yapılır; kişisel erişim anahtarı veya kaynak depoya yazma yetkisi gerekmez.

Otomatik iş akışı yalnız güvenilen `main` kaynaklarını çalıştırır; fork/pull-request tetiklemesi içermez. Varsayılan workflow izni salt okunurdur. Web'e commit atan job'a yalnız `contents: write` ve mevcut Pages işini başlatmak için `actions: write` verilir. Alan adı, Pages ayarları ve diğer uygulama iş akışları değiştirilmez.

## Yayın sonrası doğrulama

- Pages iş akışının başarıyla bitmesini kontrol et. Mevcut iş akışının başka uygulamaları da derlediğini ve bu uygulamalardaki bir hatanın yayını durdurabileceğini unutma.
- Hedef URL'nin doğrudan DraBornLand başlığı ve oynat düğmesiyle açıldığını doğrula. HTTP 200 tek başına yeterli değildir: mevcut site bulunamayan yolları ana sayfaya yönlendirebilir.
- WebGL sahnesini, hareketi, kaynak toplamayı ve kayıt sonrası yeniden yüklemeyi web sürümünde kontrol et.
- Expo Go 58.0.2 Android istemcisinde aynı görev döngüsünü fiziksel cihazda kontrol et. Tarayıcı testleri Expo Go'nun gerçek cihaz grafik sürücüsünü doğrulamaz.

## Yerel kayıt ve cihazlar arası devam

Supabase veya başka bir sunucu kullanılmaz. Web kaydı tarayıcı depolamasında, Android kaydı uygulamanın yerel depolamasında tutulur. Web ve Android aynı oyun kodunu ve kayıt formatını kullanır; ayrı cihazların yerel kayıtları kendiliğinden eşitlenmez. Cihaz değiştirmek için oyunun kayıt dışa/içe aktarımını kullan. Her iki tarafta otomatik bulut eşitlemesi için daha sonra bir sunucu eklenmesi gerekir.

## İlk inceleme durumu

6 Ekim 2026, geliştirme başlamadan yapılan canlı kontrolünde `https://www.draborneagle.com/DraBornGames/` mevcut oyun platformunu açtı; `DraBornGames/DraBornLand/` henüz bulunmadığı için ana sayfaya yönlendi. Bu kayıt bir yayın başarı iddiası değildir; tamamlanan yayının durumu `docs/TEST-REPORT.md` veya sürüm notlarına ayrıca kaydedilmelidir.

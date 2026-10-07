# DraBornLand doğrulama kaydı

Tarih: 6 Ekim 2026. Ortam: Linux, Node 24.19.0, Chromium ve yazılımsal WebGL/SwiftShader.

## Gerçekten çalıştırılan kontroller

| Kontrol | Sonuç |
|---|---|
| TypeScript | Hatasız |
| Saf oyun simülasyonu | 12/12 test geçti |
| Expo SDK 58 bağımlılıkları | Resmi bundledNativeModules sürümleriyle birebir eşleşti |
| Expo config | SDK 58, yatay ekran, doğru Android paket adı |
| Android Metro/Hermes export | 630 modül; 3.047.584; APK üretilmedi |
| Masaüstü tarayıcı oynanışı | 13/13 senaryo geçti; iki görev ve zafer ekranı tamamlandı |
| Mobil tarayıcı | 3/3 kontrol grubu geçti; gerçek dokunma olayları, yatay/dikey ekran ve hatasız başlangıç |
| Native WebView sözleşmesi, Chromium emülasyonu | 4/4 kontrol geçti; JavaScript hatası yok |

Üretim adası seed 73 ve ikinci seed 42891 için gerçek kaynak toplama, araç üretimi, fener onarımı, üç eserin alınması, ejderha savaşı, kazanma ve kayıt/yükleme döngüsü simülasyon testlerinde tamamlandı. Testler envanter veya boss canı vermeden normal kuralları kullanır.

Diğer testler hareket, koşu, zıplama, açlık, stamina, kaynak tüketimi, yanlış araç, maliyetlerin atomik uygulanması, beş yapı parçası, barınak/ateş iyileşmesi, yönlü duvar ve kapı çarpışması, açık kapı yan panelleri, kapalı duvarların iki yönde saldırı engellemesi, dekor collider'ları, gece doğan düşmanlar, saldırı uyarısından kaçma, ölüm cezası ve bozuk kayıt reddini doğrular.

## Görsel ve asset doğrulaması

Tüm 3D fabrikalar çalıştırıldı; vertex/mesh referansları ve dünya dispose işlemi kontrol edildi. Üretim adasında 59 dekor collider'ı ile kaynak-dekor çakışması bulunmadı. Zemin/duvarlar 3 m modüldür; açılan kapının 1,34 m orta açıklığı fiziksel modelle eşleşir. Kapı menteşesi, üç silah modeli, ejderha kanat pivotları ve kamp ateşi alevi referansları doğrulandı. PBR dokular, su shader'ı, gece ışıkları, tamir edilmiş fener, tapınak kapısı ve boss HUD ekran görüntülerinde incelendi.

Tekrarlanan ağaç, kaya, meyve ve kaynak objeleri tek mesh/çizim olarak birleştirildi. Uzak kaynakların görünürlüğü ve gölgeleri sınırlandı; düşük/dengeli/yüksek kalite ayarı sağlandı. Yazılımsal GPU ölçümleri gerçek Android kare hızını kanıtlamaz.

## Tarayıcı oynanış kanıtı

Gerçek klavye ve DOM etkileşimleriyle kaynak toplama, araç geliştirme, yeme, tüm paneller, beş yapı parçası, kayıt sonrası reload, gece düşmanları, ölüm/yeniden doğma, normal yaratık dövüşü, 24 odun + 18 taş ile fener onarımı, üç bölgesel mühür ve normal ejderha savaşı tamamlandı. Envanter veya düşman canı verilmedi. Boss saldırı uyarısı gözlemlendi ve `quests.completed=true` ile zafer ekranı alındı.

Mobil kontrolde Chromium CDP ile analog + koşma için çoklu dokunma, zıplama düğmesi, kamera sürükleme, kaynak toplama ve envanter çalıştırıldı. 915×412 yatay ve 412×915 dikey görünümlerde yatay taşma bulunmadı. Normal URL'de QA yardımcıları kapalıydı. JavaScript, WebGL veya eksik dosya hatası bulunmadı.

İlk birleşik testin mobil başlangıcı, aynı anda iki aktif yazılımsal WebGL bağlamı kullanılırken 30 saniyelik test zaman aşımına girdi. Mobil kontroller ayrı Chromium bağlamında doğrulandı; tekrarlanabilir test betiği masaüstü bağlamını mobil başlangıcından önce kapatacak şekilde düzeltildi. Masaüstü ve mobil başarı kayıtları ayrı raporlanır.

Odaklı sahne testinde normal kaynak toplamayla elde edilmiş kayıt yüklenerek bitişik zemin, üç duvar, kapı, çatı ve kamp ateşiyle kapalı bir barınak kuruldu. Gerçek E girdisiyle açılan kapının `doorPanel` menteşesinin döndüğü, gece ateşin sahneyi aydınlattığı ve Web Audio context/oscillator üretimi doğrulandı. Dikey dokunmatik kontrolde hotbar ile analog/zıplama düğmesi örtüşmesi görülüp responsive CSS düzeltildi.

## Android köprüsü

Chromium'da `ReactNativeWebView.postMessage` sözleşmesi taklit edilerek native kayıt nesnesinin ilk inline script'ten önce yüklenmesi, `ready`, sürümlü tam kayıt mesajı, kimlikli kayıt onayı, taşınabilir export ve Android geri/arka plan/devam olayları çalıştırıldı. Gerçek AsyncStorage yazımı tarayıcı tarafından yürütülmedi.

Bu testte Android geri olayının `Document.matches` çağrısını bozduğu tespit edilip giderildi. Denetimde başlangıçta kapalı sesin uygulanması, import/respawn sonrası sesin devamı, arka plan sonrası takılı analog/koş girdileri ve eski kayıt onayının manuel kayıtla karışması da düzeltildi.

## Tekrarlama

```sh
npm run check
EXPO_OFFLINE=1 npx expo install --check
EXPO_OFFLINE=1 npm run export:android
```

Tarayıcı otomasyonu için ayrı Playwright kurulumu ve Chromium gerekir:

```sh
npm install --prefix /tmp/drabornland-qa playwright
npm run preview
# İkinci terminal:
node tests/browser.mjs
node tests/native-bridge.mjs
```

Tarayıcı testinde uzun mesafeler QA teleport'u ile kısaltılır; saldırı cooldown'ları ve uzun beklemeler normal `.05` saniyelik simülasyon adımlarıyla hızlandırılır. WASD, koşma, zıplama, etkileşim ve saldırı girdileri gerçek DOM/klavye olaylarıyla uygulanır. Normal URL test yardımcılarını açmaz; yalnız `?qa=1` açar. Yerel ekran görüntüleri ve makine raporları `evidence/` dizinindedir, bu geçici dizin Git'e dahil edilmez.

## Doğrulamanın sınırları

**Fiziksel Android cihazında Expo Go 58.0.2, Android System WebView, AsyncStorage ve Termux kurulum testi bu ortamda yapılmadı.** Android export, native modül referanslarının ve Hermes paketinin derlendiğini gösterir. Mobil tarayıcı emülasyonu gerçek cihaz GPU performansını göstermez.

Expo'nun çevrimiçi API kontrolü ortam proxy'sinde engellendi; offline dependency kontrolü ve npm'den alınan resmi Expo SDK sürüm metadata'sı ile eşleşme ayrı ayrı doğrulandı. Sunucu veya otomatik cihaz kaydı eşitlemesi bulunmaz; Android/web geçişi JSON dışa/içe aktarımı ile yapılır.

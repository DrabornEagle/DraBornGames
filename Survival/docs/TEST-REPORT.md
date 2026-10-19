# v0.1.0 doğrulama raporu — 19 Ekim 2026

Godot 4.5.2.stable.official.6ce3de25a kullanıldı. Üç son koşuda **55/55 kontrol geçti**. Headless mantık/fizik testi ve Linux llvmpipe yazılım GPU'sunda Vulkan **Mobile** ile OpenGL **Compatibility** görüntülü koşuları birbirinden ayrıdır. Son loglarda GDScript parse/çalışma hatası veya kaynak sızıntısı raporu yoktur.

| Koşu | Geçen kontrol | Süre | En uzun ölçülen chunk kurulum çağrısı |
|---|---:|---:|---:|
| headless | 55/55 | 14.62 s | 10.095 ms |
| mobile | 55/55 | 29.53 s | 4.449 ms |
| compatibility | 55/55 | 18.17 s | 2.220 ms |

Bu ölçümler Linux konteynerine aittir. Telefon FPS, GPU belleği veya ısınma ölçümü değildir; eşzamanlı araç süreçleri süreleri etkileyebilir. Chunk metrikleri yalnızca ana iş parçacığındaki kurulum bölümünü ölçer; uçtan uca frame gecikmesi garantisi vermez. Giriş/orta/üst Android cihazlarında 30/45/60 FPS hedefleri henüz doğrulanmamıştır.

## Gerçekten işletilen senaryolar

- JSON içerik kayıtları, seed tekrarlanabilirliği/farklılığı, kamp/gölet ve negatif koordinatlar.
- İlk 25 chunk, sınırlı önbellek, canlı zemine fizik teması; yürüyüş, zıplama, iniş ve başlangıç üçüncü şahıs kamera açıklığı.
- Gerçek ScreenTouch/ScreenDrag olaylarıyla eşzamanlı joystick/kamera ve üçüncü parmakla zıplama; parmak bırakma temizliği.
- Duvara karşı SpringArm çarpışması; görünür arayüz ekranlarının görüntü denetimi.
- Kora diyalog ekranından görev kabulü, ağaç/kaya hasarı ve kaynak kazanımı.
- Dört tarif, istif taşması, eksik kaynak ve dolu envanterde geri alma.
- Gerçek nişangâh ray'iyle blok yerleştirme/kırma; oyuncunun içine ve dolu yere yerleştirme engeli.
- Kalıcı özel 3D kamp ateşi yerleştirme ve aynı konumda ikinci ateşin reddi.
- Sınır chunk düzenlemesinde yalnızca ilgili komşuların kirletilmesi; negatif koordinatta değişiklik.
- Kora'nın teslim butonundan görev bitirme, kaynak düşümü, tek ödül/XP ve fenerin yanması.
- Yemekle sağlık/açlık yenileme, eşya bırakma ve geri toplama.
- Diskte kayıt turu, şema/bozuk veri/truncated veri reddi; ana kaydı kasıtlı bozup sağlam yedeği yükleme.
- Üç uzak bölgeye gidip gelme, chunk sayısı/önbellek sınırı, hasat ve voxel delta kalıcılığı.
- Yeni oyun sahnesinde envanter, görev, özel yapı ve arazi değişikliklerini gerçek kayıt dosyasından yükleme.
- Düşük profilde 9, yüksekte 49 chunk; çözünürlük ve gölge değişimi.
- Android için renderer tercihinin sonraki başlangıç override dosyasına yazılması. Ek ayrı süreç testi, override okununca `gl_compatibility` ile başlatıldığını doğruladı.

Makinece okunabilir 55 kontrol: `test-results-headless.json`, `test-results-mobile.json`, `test-results-compatibility.json`.

## APK denetimi

- Godot resmî 4.5.2 Android şablonu, Gradle kullanmadan export edildi.
- Paket `com.draborngames.survival`, versionName 0.1.0, versionCode 1; Android minimum API 24, hedef API 35.
- Yalnızca arm64-v8a; boyut **26.87 MiB**.
- `apksigner verify`: APK v2 ve v3 imzaları doğrulandı. Geliştirme imzasıdır; Play üretim imzası değildir.
- `zipalign -c -P 16 4`: başarılı. Native kitaplık için 16 KiB hizalama kontrol edildi.
- ZIP bütünlüğü, gerekli JSON içerikleri, motor kitaplığı ve lisans dosyalarının pakette bulunduğu doğrulandı.
- Manifest yatay ekran yönü 0 (landscape) olarak kontrol edildi. İnternet izni gerektiren oyun servisi yoktur.
- SHA-256: `cdee999d215f641673ddf7cf77c756fe69cd4ef27faa0920e984eaa212fad66e`

SDK `aapt2` aracı Godot şablonundan kalan kullanılmayan `themed_icon.xml` kaynak girdisi için uyarı verir. Launcher'ın kullandığı `icon.xml` ve background/foreground/monochrome girdileri pakette kontrol edildi. Bu uyarı bir Android kurulum/oynanış testi yerine geçmez.

## Test edilemeyenler ve bilinen sınırlar

**Fiziksel Android telefona APK kurup oynama bu ortamda yapılmadı.** Dokunma olayı testleri simülasyondur. Dokunmatik donanım, ekran kesikleri, Android arka plan/işletim sistemiyle öldürülme davranışı, renderer seçimiyle telefonda yeniden açılış, ses çıkışı, sürücü uyumu, batarya/ısı ve uzun oturum belleği gerçek cihazda doğrulanmalıdır. Android Editor'ün bu cihazdaki import/export deneyimi de kullanıcı cihazında kontrol edilmelidir.

Henüz 15–30 dakikalık veya saatler süren soak testi yapılmadı. Test streaming senaryosu üç bölgeyi kapsar. Worker veri hazırlığı asenkrondur; mesh/collider kurulumları ana iş parçacığındadır. Çok büyük düzenleme sözlükleri için snapshot/serileştirme maliyeti henüz uzun dünya ölçeğinde ölçülmedi.

Geçici özgün sanat kullanılır. Greedy meshing, arazi LOD, çoklu biyom, mağara, düşman/savaş, ticaret, tam navigation, tarım, yüzme, susuzluk, gelişmiş inşa parçaları ve müzik bu sürümde tamamlanmış özellikler değildir. NPC rutini basit hedef hareketidir; karmaşık veya kazılmış arazide takılabilir. Mobil pinch zoom yoktur. Karakter yürüyüşü/alet kullanımında nihai iskelet animasyonu ve tutulan alet modeli henüz yoktur.

## Depo kapsamı

Yalnızca `Survival/` eklendi. Başlangıç deposundaki `LastMile/`, kök README ve mevcut altı `.github/workflows` dosyası değişmeden korunur. Ek repo, yedek dal, yedek klasör veya yeni Actions işi oluşturulmaz. `.godot`, APK derleme klasörü ve keystore git'e eklenmez.

# DraBornGames: Survival — v0.1.0

Android için çevrimdışı Godot 4.5.2 / GDScript Survival RPG çekirdeği. Minecraft benzeri düzenlenebilir voxel araziyi, ayrı 3D insan modelleri, ağaçlar, kayalar, su ve görevlerle birleştirir.

## Hemen oyna

1. Teslim edilen `DraBornGames-Survival-v0.1.0-android.apk` dosyasını Android telefona kur. Bu, geliştirme anahtarıyla imzalı arm64-v8a test APK'sıdır.
2. Yatay ekranda **Ormana Gir** seç. Gerekirse Ayarlar'dan Düşük profilini kullan.
3. Yerleşimde Kora'ya yaklaş, **ETKİLEŞ** ile konuş, **Sönen Fener** görevini kabul et.
4. Ağaç/kayayı ortadaki nişangâha getir. Yaklaş ve **KIR** ile 12 odun + 8 taş topla. Kora'ya teslim et; fener yanar ve ödül verilir.
5. **ÜRET** ekranından taş balta, taş kazma, yapı bloğu veya kamp ateşi yap. Çantadan bunları ilk altı yuvaya taşı; hızlı çubuktan seç ve **YERLEŞTİR**.
6. İlerleme 45 saniyede bir, görev tesliminde ve arka plana geçişte kaydedilir. Menüden elle kayıt da yapılır.

## Kaynaktan aç

Godot Android Editor **4.5.2** ile `Survival/project.godot` dosyasını İçe Aktar. Ana sahne `scenes/main/main.tscn`. Başlangıç renderer'ı **Mobile**; Vulkan sorunu olan cihazda editörün renderer menüsünden **Compatibility** seç. Oyunun ayar ekranı paketlenmiş uygulamanın sonraki açılışında Compatibility kullanmasını da sağlayabilir.

Telefon geliştirme, Git/Termux ve APK adımları: [docs/ANDROID-TERMUX.md](docs/ANDROID-TERMUX.md).

## Bu sürümde bulunanlar

- Seed tabanlı 16×64×16 chunk'lar, gizli yüz eleme, birleştirilmiş arazi mesh'i ve chunk collider'ı.
- Tek arka plan iş parçacığında veri/mesh dizisi hazırlama, mesafeye göre yükleme/kaldırma, en fazla 12 kayıtlık mesh önbelleği.
- Çimen, toprak, taş, kum, odun ve yapı bloğu; doğru sınır chunk'larının yenilenmesi; dünya değişikliklerinin saklanması.
- Üçüncü şahıs karakter, yürüme, koşma, zıplama, düşme hasarı, duvarla çarpışan SpringArm kamera.
- Bağımsız joystick/kamera parmakları ve üçüncü parmakla eylem; klavye/fare desteği.
- İki özgün geçici GLB insan modeli, AnimationPlayer animasyonları, MultiMesh ağaç/kaya/çimen, hareketli yaprak/su shader'ları.
- Orman biyomu, gölet, iki kulübe, başlangıç kampı, işaret feneri; 20 dakikalık tam gündüz/gece çevrimi.
- 12 envanter yuvası, 6 hızlı yuva, istifleme, taşıma, kullanma, bırakma ve geri toplama.
- Dört JSON tarifi; kaynak/yer kontrolü ile tutarlı üretim. Blok önizlemesi, karakter içine ve dolu yere yerleştirme engeli, yerleştirilebilir kalıcı kamp ateşi.
- Sağlık, dayanıklılık, temel açlık, meyveyle iyileşme, kampta yeniden doğma. Bu kolay prototipte ölümde eşya kaybı yoktur.
- Kora'nın yakın mesafeli temel günlük rutini, görev durumuna göre dallanan konuşmalar; Sönen Fener kabul/teslim/tek ödül ve kalıcı dünya sonucu.
- Modern dokunmatik HUD, eşya ikonları, yerel harita, görev günlüğü, üretim, grafik/ses/hassasiyet ayarları ve FPS göstergesi.
- Sürümlenmiş SHA-256 kayıt zarfı, geçici dosyadan atomik geçiş, önceki sağlam kayıt ve bozuk kayıttan kurtarma.

## Kapsam sınırı

Bu sürüm ilk oynanabilir çekirdektir. Nihai gerçekçi sanat paketi değildir: insan modelleri ve doğa geometrileri açıkça geçici özgün modellerdir. Henüz düşman/savaş, ticaret, tam Navigation yeniden üretimi, mağaralar, çoklu biyom, tarım, köy yönetimi, susuzluk, yüzme, eğilme, gelişmiş beceri ağacı, yağmur/fırtına ve müzik içeriği yoktur. Sonraki aşamalar [docs/ROADMAP.md](docs/ROADMAP.md).

Mobil FPS/ısı/batarya ve gerçek Android dokunmatik donanımı bu ortamda ölçülemedi. APK derlemesi ve imza denetimi, fizik/oynanış testleri ve Linux'ta görüntülü Mobile/Compatibility çalıştırmaları ayrı doğrulamalardır. Güncel sonuçlar [docs/TEST-REPORT.md](docs/TEST-REPORT.md).

## Proje ve doğrulama

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): iş parçacıkları, sinyaller, kayıt biçimi ve genişletme noktaları.
- [docs/FILES.md](docs/FILES.md): eklenen dosyalar; bu teslimatta önceki depo dosyaları değiştirilmez.
- [assets/LICENSES.md](assets/LICENSES.md): varlık kökenleri ve teknik bütçeler.
- `tests/run_all.tscn`: gerçek oyun sahnesini başlatan regresyon senaryosu.
- `tools/check.sh`: kurulu Godot ile Linux/CI kontrolleri; temiz test veri dizini kullanır.
- `tools/build-android.sh`: eşleşen şablon ve SDK ile Gradle kullanmadan debug APK export'u.

Test sahnesini Android Editor'de açıp F6 ile de çalıştırabilirsin. Test kayıtları normal `user://` kayıtlarını sıfırlar; Android'de ana oyun kaydını korumak için testleri ayrı proje kopyası/uygulama kimliğiyle çalıştır. `tools/check.sh` Linux'ta bunu yalıtılmış bir veri diziniyle yapar.

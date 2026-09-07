# Doğrulama ve cihaz kabulü

v0.100 doğrulaması Node tabanlı simülasyon/DOM/Git testleri, TypeScript kontrolü ve Android için Expo JavaScript paketlemesini kapsar. APK, emulator veya fiziksel telefon çalıştırması değildir.

## Otomatik kontroller

`npm test` aşağıdaki davranışları gerçek oyun fonksiyonlarıyla kontrol eder:

- OSM metadata/referansları, legal yönlü rotalar, kapanış ve seed tekrar üretimi.
- Gaz/fren girdisiyle eğitim, paket teslimi, zorunlu checkpoint ve durma koşulu; mükerrer kazanç engeli.
- Duraklatma, ıslak zeminde fren, yol dışından geri dönebilme, paket/sıcaklık etkileri.
- Bakiye/kapasite/seviye kapıları, araç satın alma, standart Final istatistikleri.
- 100. gerçek Master token’ı, sezon içinde tek VIP seçimi, altı VIP bölümü ve sonraki tekrar işleri.
- Dört sezonda trafik açıkken Final’in üç zorunlu durağından geçip tamamlanabilmesi; Signal Lost ve olay akışı.
- Teleport/aşırı hız/kurtarma için yerel audit; hiçbir sonuçta serverVerified veya prizeEligible olmaması.
- Günlük/streak rollover, bozuk/zararlı kayıt alanlarının normalleştirilmesi, 30/60 Hz karşılaştırması.
- jsdom ile ekranların üretilmesi, gerçek form/click olayları, kullanıcı metninin escape edilmesi, ayrı test kariyeri, telefon/duraklatma/sonuç akışı, mesaj ve alışveriş geribildirimi.
- Geçici yerel Git depolarıyla eşitleme; temiz güncelleme, ayrışmış commit yedeği, değişmiş/izlenmeyen dosyaların stash içinde korunması, başka repo ve devam eden merge durumunda durma.

**jsdom testleri 3D renderer ve sesi stub eder.** WebGL, çoklu dokunma, TTS, native fotoğraf ve dosya paylaşımını fiziksel cihazda doğrulamaz. Yardımcı direksiyonla tamamlanan simülasyon, insanla oyun dengesi testinin yerine geçmez.

`npm run typecheck` native köprü ve TypeScript yapılandırmasını kontrol eder. `npm run build:game` gerçek Three.js ve oyun kodunu Terser ile paketler. `EXPO_OFFLINE=1 npx expo export --platform android --output-dir dist-android` Hermes/Metro Android paketini çıkarır; APK oluşturmaz. Offline `expo install --check` yerel SDK bağımlılık eşleşmesini kontrol eder; çevrimiçi React Native Directory/Expo Doctor kontrolünün tamamı sayılmaz.

GitHub Actions aynı kontrolleri ilgili kaynak değişikliklerinde çalıştırır; derlenmiş HTML/TS dosyalarının kaynaktan tekrar üretilebildiğini kontrol eder. Workflow sonucu için GitHub Actions sayfası esas alınır.

## Henüz tamamlanmamış görsel/cihaz kontrolü

Bu çalışma ortamında yerel tarayıcı önizleme adresi erişim kuralı nedeniyle açılmadı. Ekran görüntüsü, WebGL görüntü kalitesi veya fiziksel Expo Go 57.0.9 çalışması doğrulanmış gibi sunulmaz.

Hedef telefonda sırayla:

1. Expo Go 57.0.9 ile localhost projesini aç; yükleme ekranından şirket oluşturma ekranına geçişi gözle.
2. 360×800 ve kendi cihaz oranında metinlerin taşmadığını, alt kontrollerin sistem çubuğuna girmediğini kontrol et.
3. İsteğe bağlı fotoğraf, marka rengi/logo, Ankara ve Contract seç; uygulamayı kapat/aç, şirketin korunmasını kontrol et.
4. Eğitimde gaz+yön ve gaz+freni iki parmakla kullan; parmağı ekran dışına kaldırınca gazın takılı kalmadığını dene.
5. Bildirim paneli, uygulama değiştirme ve Android geri tuşuyla sürüşün durmasını kontrol et.
6. Teslimatı bitir; para/XP/yorum bir kez eklenmeli. Uygulamayı aç/kapat; ilerleme kalmalı.
7. Test kariyerinde araç/kozmetik al, VIP bölümü ve hazırlanmış Final’i dene. Ana kariyere dön; test kaynakları aktarılmamalı.
8. Final’de yol kapanması, rota yenileme, far kapatma ve Signal Lost bölümünü gör; sonuç gerçek ödül/doğrulama iddia etmemeli.
9. Karakter çağrısında Türkçe TTS, müzik/efekt ayarı, ekran fotoğrafı ve JSON yedek paylaşımı/geri yüklemeyi dene.
10. Düşük/dengeli/yüksek grafik ayarında 10 dakika ölçüm yap: FPS, pil yüzdesi, sıcaklık, WebView kapanması, dokunma gecikmesi. Sonuçları cihaz modeli/Android/WebView sürümüyle kaydet.

Kabul sonuçları henüz boş: cihaz adı, Android, WebView, Expo Go, ortalama/min FPS, sıcaklık, kapanma sayısı ve gözlenen sorunlar gerçek ölçümden sonra doldurulmalıdır.

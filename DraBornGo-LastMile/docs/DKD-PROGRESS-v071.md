# Last Mile v0.7.1 — ortak Android / web

- versionName: 0.7.1; Android versionCode: 1; paket com.draborneagle.lastmile.
- Oyun kaynağı: DraBornGames/DraBornGo-LastMile/game.
- Web build: npm run build:web. Hesap/görev/kayıt işleyicisi Android App.tsx içinden tarayıcı aygıt adaptörüyle derlenir; ayrı iş mantığı kopyası yok.
- Web adresi: https://www.draborneagle.com/DraBornGames/Last-Mile/
- Platform: https://www.draborneagle.com/DraBornGames/
- Release APK run 34534800846 başarılı. ARM64, 43.639.666 bayt.
- Release: lastmile-v0.7.1-7d8840ff7f48.
- İmza SHA256: B3042B120C61C1DEEC8CC2619C5513C4F7B3378D81C6235E9285CCF6069609BC. Kullanıcının LastMile-Signing.zip sertifikası ile eşleşti.
- 180 mevcut test + 3 yeni tarayıcı köprü davranış testi başarılı. TypeScript ve Expo SDK 57 paket eşleşmeleri başarılı.
- Google Play yayını yok; Release APK direkt GitHub / web dağıtımı. Metro gerektirmeyen release çıktısından expo-dev-client kaldırılır; geliştirme deposunda Expo Go/Development Client korunur.
- Web deposunda kaynak ve APK senkron workflow'u 5 dakikalık zamanlamaya sahip; GitHub zamanlaması gecikebilir.
- Eski Games bağlantıları DraBornGames'e yönlenir; Shift Error içeriği değiştirilmeden tek HTML dosyasına açıldı.
- Supabase Last-Mile.dkd_lastmile_system_config / dkd_runtime 0.7.1 + web-apk dağıtımı olarak güncellendi. Tarayıcı CORS preflight 200 ve gerekli izin başlıkları doğrulandı.
- Termux: scripts/dkd-termux-v071-bootstrap.sh -> mevcut güvenli sync -> Metro. Lokal klasör ~/projects/DraBornGames/DraBornGo-LastMile. Başlatıcı açıkken 30 saniyede kontrol.
- Fiziksel Expo Go 57.0.9 cihaz testi kullanıcı telefonunda yapılmalıdır.
- Aynı hesap bulut kariyerini iki cihazda yükler; eşzamanlı iki aktif oturum için çatışma birleştirme yok.
- Güncel APK aynı anahtarla mevcut kurulumun üzerine yüklenir; cihaz APK'yı kendiliğinden kurmaz.

## Son yayın kontrolü
Web kaynak+APK kopyalama ve Pages yayını workflow'ları son çalışmada kontrol edilmelidir.

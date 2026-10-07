# Yayın doğrulaması

İlk oynanabilir sürüm 7 Ekim 2026 tarihinde kaynak depoya ve mevcut şirket sitesine yayımlandı.

## Kaynak ve web paketi

- Kaynak commit: [`c37110aa23e6cd89b96d089c39c958186b3c6eb6`](https://github.com/DrabornEagle/DraBornGames/commit/c37110aa23e6cd89b96d089c39c958186b3c6eb6).
- Site commit: [`c76d007172720d260251f0722e98fb8759952a73`](https://github.com/DrabornEagle/DrabornEagle_Web/commit/c76d007172720d260251f0722e98fb8759952a73).
- Kaynak depoya aktarılan 35 dosyanın Git blob içerikleri yerel dosyalarla birebir doğrulandı.
- Site deposundaki diğer 719 dosya ilk yayında değişmeden korundu.
- Test edilen ve yayımlanan `web/index.html` SHA-256 değeri: `fdd698e7c98542c63814dd44688d699490b4c058a16a3d26247f62a2e5add444`.

## Gerçek GitHub Actions sonuçları

| Kontrol | Kanıt |
|---|---|
| Kaynak CI: TypeScript, simülasyon, üretim paketi ve Android JavaScript export | [37553626883 — başarılı](https://github.com/DrabornEagle/DraBornGames/actions/runs/37553626883) |
| Mevcut şirket Pages iş akışıyla yayın | [37553700407 — başarılı](https://github.com/DrabornEagle/DrabornEagle_Web/actions/runs/37553700407) |
| Otomatik senkronizasyonun aynı sürümü tekrar yayımlamaması | [37553700342 — başarılı](https://github.com/DrabornEagle/DrabornEagle_Web/actions/runs/37553700342) |

İlk otomatik senkronizasyon çalışması kaynak sürümü zaten yayımlandığı için doğru şekilde yeniden derleme ve commit adımlarını atladı. Bu kayıt, farklı bir kaynak sürümünün aktarılmasıyla aynı kontrol değildir.

## Canlı adres

[`https://www.draborneagle.com/DraBornGames/DraBornLand/`](https://www.draborneagle.com/DraBornGames/DraBornLand/) HTTP 200 ile açıldı; DraBornLand başlığı ve oyun menüsü işlendi. Son URL istenen oyun yolu olarak kaldı. Canlı [`source.json`](https://www.draborneagle.com/DraBornGames/DraBornLand/source.json) HTTP 200 döndürdü; kaynak commit ve HTML SHA-256 değerleri test edilen sürümle eşleşti.

## Devam eden güncellemeler

Site deposundaki [DraBornLand senkronizasyon iş akışı](https://github.com/DrabornEagle/DrabornEagle_Web/actions/workflows/drabornland-web-sync.yml), kaynak depodaki `DraBornLand/` değişikliklerini 15 dakikalık zamanlamayla kontrol eder. Yeni kaynak sürümü için bağımlılıklar kurulur, oyun kontrolleri ve Android JavaScript export çalıştırılır; yalnız `DraBornGames/DraBornLand/` yayın dizini yenilenir ve mevcut şirket Pages iş akışı başlatılır. `source.json` kaynak commit ve HTML checksum bilgisini taşır.

En yeni kaynak CI sonuçları [burada](https://github.com/DrabornEagle/DraBornGames/actions/workflows/drabornland.yml), şirket Pages sonuçları [burada](https://github.com/DrabornEagle/DrabornEagle_Web/actions/workflows/dkd_company_pages.yml) izlenebilir.

Fiziksel Android, Expo Go ve Termux doğrulamasının sınırları [TEST-REPORT.md](TEST-REPORT.md) belgesinde açıklanır. APK üretilmedi; kayıtlar yereldir, Android/web kayıt aktarımı JSON dışa/içe aktarımıyla yapılır.

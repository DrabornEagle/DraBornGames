# DraBornGo / Son Kilometre — İlerleme Kaydı

## v0.6 · Müşteri Havuzu ve Gerçek İçerik — 10 Eylül 2026

Durum: **Kod, oyun paketi ve CI doğrulaması tamamlandı; üretim Supabase migration dosyası hazır.**

### Tamamlananlar

- v0.6.0 / Android versionCode 600 / Expo SDK 57 ailesi korunuyor; APK üretilmiyor, Expo Go geliştirme akışı devam ediyor.
- Sipariş ağına 47 farklı müşteri profil görseli bağlandı. Kaynak ZIP içindeki tekrarlar ayıklandı; eksik benzersiz iki slot yeni görsel üretilmeden mevcut yerel Selin ve Ece portreleriyle tamamlandı.
- Profil seçimi sipariş kimliğine göre kararlı hash ile yapılıyor; aynı sipariş Siparişler ve Mesajlar ekranında aynı müşteriyi gösteriyor.
- Aynı anda listelenen siparişlerde havuz elverdiği sürece profil tekrarını önleyen eşleme eklendi.
- Müşteri notları, rol, teslim noktası ve rota bilgileri gerçek sipariş verisinden gösteriliyor.
- `Last-Mile` alanına 47 aktif gerçek müşteri kaydı ve genişletilmiş gerçek görev şablonu havuzu ekleyen idempotent migration hazırlandı: `20260909212000_dkd_lastmile_v06_customer_content.sql`.
- Migration yalnızca `Last-Mile.dkd_lastmile_content_customers` ve `Last-Mile.dkd_lastmile_mission_templates` üzerinde çalışıyor; diğer DraBornGo verilerine dokunmuyor.
- Admin seviye 50, plaka kaydı, gerçek saat, MP3 menü/sürüş ayrımı, gerçek sezon ve final doğrulama akışı korunuyor.
- Deterministic game bundle, Node test paketi, TypeScript typecheck ve Expo SDK dependency kontrolü GitHub Actions üzerinde başarıyla geçti.
- Üretilen HTML ve `src/generated/dkd-game-html.ts` deterministic autogen tarafından güncellendi.
- Geçici v0.6 finalize workflow temizlendi; kalıcı iki Last Mile workflow korunuyor.

### Supabase üretim durumu

- Migration dosyası sürüm kontrolünde hazır ve tekrar çalıştırılabilir (`ON CONFLICT ... DO UPDATE`).
- Bağlı Supabase sohbet aracının bu proje için üretim SQL yetkisi bulunmadığından production veritabanına buradan yazma/doğrulama yapılamıyor.
- Production senkronu yetkili Supabase CLI oturumunda `npx supabase link --project-ref dpcwciapowxqocvswxce` ve `npx supabase db push` ile uygulanacak.

### Checkpointler

- Üretim hedefi: `main`
- v0.6 müşteri havuzu çalışma dalı: `work/DraBornGo-LastMile-v0.6-customer-pool`
- v0.6 müşteri havuzu öncesi geri dönüş: `backup/DraBornGo-LastMile-v0.6-before-customer-pool`
- v0.6 öncesi geri dönüş: `backup/DraBornGo-LastMile-v0.6-pre`

### Sonraki geliştirme havuzu

- İstanbul gerçek yol/veri paketi
- İzmir gerçek yol/veri paketi
- Bursa gerçek yol/veri paketi
- Antalya gerçek yol/veri paketi
- Gerçek sezon sonuç yönetimi / admin doğrulama paneli
- Canlı doğrulanmış sıralama
- Final anti-cheat telemetri doğrulamasının daha ileri server-authoritative katmanı

---

## v0.5 · Gerçek Sezon — 9 Eylül 2026

Durum: **Üretim dalında aktif ve doğrulanmış.**

### Tamamlananlar

- Gerçek sezon sistemi açıldı; geliştirme/ödül-kapalı metadata bayrakları kaldırıldı.
- Sezon 01 — **Büyük Fırtına** aktif.
- Dört sezonluk takvim hazırlandı; her sezonda üç fiziksel ödül tanımlandı.
- Ödül sistemi rastgele değildir: Final Görevi beceri skoru + doğrulama kuyruğu kullanır.
- Geçerli Final sonucu authenticated cloud-save üzerinden `pending_verification` kaydına dönüşür.
- Doğrudan istemci tarafından keyfî ödül başvurusu gönderilemez; Edge API bu yolu kabul etmez.
- Ödül claim RPC ve cloud-save reward upsert belirsizlik hataları düzeltildi ve transaction dry-run ile doğrulandı.
- Test dry-run kayıtları rollback edildi; sahte ödül claim kaydı bırakılmadı.
- Admin için sınırsız oyun parası, sınırsız Özel Müşteri hakkı ve tüm şehir paketleri açık.
- Ankara gerçek yol veri paketi hazır. İstanbul, İzmir, Bursa ve Antalya admin için açık ancak gerçek yol paketleri henüz üretilmediği için Ankara verisi bu şehirler adına taklit edilmez.
- Alt menüde Garaj yerine Mesajlar bulunuyor; ana merkezdeki Garaj kartı korunuyor.
- `SON KİLOMETRE / KURYE MERKEZİ` tabelası büyütüldü ve yukarı taşındı.
- Eski “fiziksel ödül aktif değil” oyuncu mesajı kaldırıldı.
- `app.json`: v0.5.0 / Android versionCode 500 / `dkd_adminPreviewOnly=false` / `dkd_realRewardsEnabled=true`.
- Supabase `Last-Mile` alanı diğer DraBornGo verilerinden izole tutuluyor.
- Last-Mile public RPC köprüsü `anon` ve `authenticated` rollerine kapalı; yalnızca `service_role` çalıştırabiliyor.
- `dkd-last-mile-api` Edge Function v6 ACTIVE ve JWT doğrulaması açık.
- Last-Mile ödül foreign-key indeksleri eklendi.
- GitHub test, typecheck, Expo SDK kontrolü, deterministic game build ve Android JavaScript export başarıyla geçti. APK üretilmedi.

### v0.5 · Sürüş / Görev Akışı Hotfix — 9 Eylül 2026

- Yoldaki engellerin eski geniş dairesel çarpışma alanı yerine görünür nesnenin yönlendirilmiş fiziksel ayak izi kullanılıyor; engelin yanından geçerken oluşan hayalet kargo hasarı engellendi.
- Görev reddedilirken kalan `dkd_v05PendingStart` vardiya başlangıç durumu temizleniyor; iptal cevabı artık yanlışlıkla “Vardiya başlatılamadı” modalına dönüşmüyor.
- Reddedilen görev seçili görevse seçim temizleniyor ve açık başlangıç modalı kapatılıyor.
- `SON KİLOMETRE / KURYE MERKEZİ` tabelası biraz sağa kaydırıldı (`x: -4.25 → -3.60`).
- Yeni hotfix v0.5 katmanlarının en sonunda yükleniyor ve dört regression testi eklendi.
- Hotfix dalı üzerinde build, generated-file eşleşmesi, test, typecheck, Expo SDK kontrolü ve Android JavaScript export başarılı geçti; ardından değişiklikler `main` dalına alındı.

### Checkpointler

- Üretim: `main`
- Güncel sürüş hotfix çalışma aynası: `work/DraBornGo-LastMile-v0.5-drive-fix`
- Sürüş hotfix öncesi geri dönüş: `backup/DraBornGo-LastMile-v0.5-before-drive-fix`
- Gerçek sezon öncesi geri dönüş: `backup/DraBornGo-LastMile-v0.5-pre-live-season`

> Not: Supabase projesindeki Last-Mile dışı advisor uyarıları bu çalışma kapsamında değiştirilmedi; diğer DraBornGo modüllerine dokunmama kuralı korundu.

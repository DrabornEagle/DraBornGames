# DraBornGo / Son Kilometre — İlerleme Kaydı

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

### Sonraki geliştirme havuzu

- İstanbul gerçek yol/veri paketi
- İzmir gerçek yol/veri paketi
- Bursa gerçek yol/veri paketi
- Antalya gerçek yol/veri paketi
- Gerçek sezon sonuç yönetimi / admin doğrulama paneli
- Canlı doğrulanmış sıralama
- Final anti-cheat telemetri doğrulamasının daha ileri server-authoritative katmanı

> Not: Supabase projesindeki Last-Mile dışı advisor uyarıları bu çalışma kapsamında değiştirilmedi; diğer DraBornGo modüllerine dokunmama kuralı korundu.

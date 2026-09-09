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

### Checkpointler

- Üretim: `main`
- Çalışma aynası: `work/DraBornGo-LastMile-v0.5-live-season`
- Geri dönüş: `backup/DraBornGo-LastMile-v0.5-pre-live-season`

### Sonraki geliştirme havuzu

- İstanbul gerçek yol/veri paketi
- İzmir gerçek yol/veri paketi
- Bursa gerçek yol/veri paketi
- Antalya gerçek yol/veri paketi
- Gerçek sezon sonuç yönetimi / admin doğrulama paneli
- Canlı doğrulanmış sıralama
- Final anti-cheat telemetri doğrulamasının daha ileri server-authoritative katmanı

> Not: Supabase projesindeki Last-Mile dışı advisor uyarıları bu çalışma kapsamında değiştirilmedi; diğer DraBornGo modüllerine dokunmama kuralı korundu.

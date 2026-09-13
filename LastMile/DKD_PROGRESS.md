# DraBornGo / Last Mile — İlerleme

## v0.7.5 · Android versionCode 1

Son checkpoint: 13 Eylül 2026.

Tamamlanan son tur:
- İlk giriş test penceresi **TEST ET SİPARİŞLER SENİ BEKLİYOR** olarak korunuyor; başlık biraz küçültülmüş durumda.
- `KENDİ ŞİRKETİNİ KUR / Yeni bir başlangıç` ekranının önceki v0.7.5 tasarımı geri getirildi; yalnız formdaki büyük gereksiz boş spacer blokları kaldırıldı.
- Kayıt formunda alan bazlı hata vurguları ve önceki renkli kart tasarımı korunuyor.
- Kurye Merkezi `SEZON 01 · BÜYÜK FIRTINA + SEVİYE + Yıldız` rozet satırı büyütülmüş tek sıra düzeninde korunuyor.
- Sağ üst Cüzdan kartının son eklenen animasyonlu tasarımı kaldırıldı; önceki Cüzdan görünümü geri getirildi.
- Yönetici `Ödemeler` sayfasında **Sezon Fiyatları** ve **Gelen Ödemeler** açılır/kapanır kategoriler olarak korunuyor.
- Gelen ödemelerde veritabanında saklanan `dkd_receipt_data` data URL'leri yeniden görsel önizleme olarak gösteriliyor; **DEKONTU TAM EKRAN AÇ** ile eski tam ekran inceleme akışı geri getirildi.
- Gelen ödeme kayıtlarının yönetici onaylı silme akışı korunuyor. Silme yalnız ödeme/dekont kaydını kaldırır; oyuncu hesabını veya oyun kaydını silmez.
- Supabase canlı migration: `20260913011622_dkd_lastmile_v075_admin_payment_delete.sql`.
- Ortak UI katmanı: `game/dkd-v075-admin-home-polish.mjs`.
- Gradient, shadow ve glow kullanılmıyor.
- Android ve Web aynı oyun kaynağından üretiliyor.
- Bu checkpoint için güncel imzalı Release APK yeniden üretilecek ve Web **Vardiyan Cebinde** dağıtımı aynı Release ile güncellenecek.

Doğrulama hedefi: test paketi, TypeScript, Expo SDK 57, Android JavaScript export smoke testi, Web ortak-kaynak build'i, kalıcı imzalı APK doğrulaması ve Web Pages yayını temiz geçmeden checkpoint tamamlanmış sayılmaz.

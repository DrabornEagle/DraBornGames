# DraBornGo / Last Mile — İlerleme

## v0.7.5 · Android versionCode 1

Son checkpoint: 13 Eylül 2026.

Tamamlanan son tur:
- İlk giriş test penceresi **TEST ET SİPARİŞLER SENİ BEKLİYOR** olarak güncellendi; başlık biraz küçültüldü.
- `KENDİ ŞİRKETİNİ KUR / Yeni bir başlangıç` ekranı kompakt, modern ve renkli flat tasarımla yenilendi; gereksiz ara boşluklar kaldırıldı.
- Kayıt formunda alan bazlı hata vurguları korunuyor; hatalı alan kendi açıklamasıyla görünür durumda.
- Kurye Merkezi `SEZON 01 · BÜYÜK FIRTINA + SEVİYE + Yıldız` rozet satırı biraz büyütüldü ve tek sıra merkezli düzen korunuyor.
- Ana sayfanın sağ üst Cüzdan kartı daha modern, renkli ve hareketli hale getirildi; azaltılmış hareket tercihi destekleniyor.
- Yönetici `Ödemeler` sayfasında **Sezon Fiyatları** ve **Gelen Ödemeler** açılır/kapanır kategorilere dönüştürüldü.
- Gelen ödeme kayıtlarına onaylı yönetici silme akışı eklendi. Silme işlemi yalnız ilgili ödeme/dekont kaydını kaldırır; oyuncu hesabını veya oyun kaydını silmez.
- Supabase canlı migration: `20260913011622_dkd_lastmile_v075_admin_payment_delete.sql`.
- Yeni ortak UI katmanı: `game/dkd-v075-admin-home-polish.mjs`.
- Gradient, shadow ve glow kullanılmıyor.
- Android ve Web aynı oyun kaynağından üretiliyor.
- Bu UI turunda yeni APK/AAB oluşturulmuyor.

Doğrulama hedefi: test paketi, TypeScript, Expo SDK 57, Android JavaScript export smoke testi ve Web ortak-kaynak build'i temiz geçmeden checkpoint tamamlanmış sayılmaz.

# DraBornGo / Last Mile — İlerleme

## v0.7.5 · Android versionCode 1

Son checkpoint: 13 Eylül 2026.

Tamamlanan son tur:
- Vardiya yağmur ambiyansı önceki miks seviyesinden %25 azaltıldı; yağmur/hava hissi korunuyor.
- Vardiyada telefon ikonunun hemen üstündeki ses düğmesi artık oyun ses efektlerini açıp kapatıyor ve tercih bulut kaydına gidiyor.
- Hayalet `YOL ENGELİ` çarpışmasının kök nedeni v0.5 engel üretiminde bulundu: özellikle çukur/lastik engeller rota merkezine yaklaşık 0,42 m kadar yaklaşabiliyor ve görünür modelden daha geniş eski çarpışma alanı navigasyon oklarının üstüne taşıyordu.
- Tüm rota engellerine tipine göre güvenli merkez koridoru uygulanıyor; görünür 3D engel ile fiziksel çarpışma konumu birlikte taşınıyor.
- Ekranda gerçekten oluşturulmamış/görünmeyen engel artık kargoya çarpışma hasarı veremiyor; çarpışma kutusu görünür model boyutlarına bağlı.
- Kurye Merkezi `SEZON 01 · BÜYÜK FIRTINA` rozeti doğrudan oyuncu adının üstüne alındı.
- Ana sayfa `SEZONUN HEDEFİ` kartı daha renkli ve modern hale getirildi; ilerleme çubuğu hareketli, Ustalık/Hikâye/Fırtına metinleri büyütüldü.
- Önceki Ödül Kasası hedef detayları, Apple iPad PRO adı, Mira profil düzeltmesi ve tüm araçlarda premium kurye modeli korunuyor.
- Android ve Web aynı oyun kaynağından üretiliyor.
- APK/AAB bu turda oluşturulmuyor veya yayınlanmıyor.

Doğrulama hedefi: test paketi, TypeScript, Expo SDK 57, Android JavaScript export smoke testi ve Web ortak-kaynak build'i temiz geçmeden checkpoint tamamlanmış sayılmaz.

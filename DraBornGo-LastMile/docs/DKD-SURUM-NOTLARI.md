# v0.101.0 · Türkçe ve renkli arayüz

- Oyun içi uygulama ve sayfa başlıkları, paketler, araçlar, özel müşteriler, hikâyeler, sezonlar, müzikler, 3D tabelalar ve paylaşım metinleri Türkçe.
- Bakiye, sipariş kazancı, araç/aksesuar fiyatı, bakım, günlük ödül ve hareket dökümü ortak `1.250 TL` gösterimini kullanır. Skor ve teslimat sayısı para etiketi almaz.
- Oyun içi ad: DraBornGo / Son Kilometre. Repo yolu ve kayıt kimlikleri korunur; mevcut kayıt sıfırlanmaz.
- Renkli ana menü, yeni sezon hedef kartı, cüzdan kısayolu, araç etiketi, renkli 16 telefon uygulaması ve hava/bakiye araçları.
- Sayfaya göre mavi/turkuaz/mor/pembe/turuncu renkler; yenilenen sipariş, garaj, kasa, itibar, sonuç, sürüş ve iletişim pencereleri.
- Uygulama simgelerine sıralı giriş, ilerleme çubuklarına açılış, ana menü etiketlerine hafif hareket ve alt pencerelere geçiş animasyonu.
- Animasyonlar ayarlardan kapanabilir; sistemin azaltılmış hareket tercihi ve arka planda duraklatma uygulanır.
- Eski kayıtlardaki sistem araç/teslimat etiketleri Türkçeleştirilir. Oyuncunun kendi şirket adı ve yazdığı mesajlar değiştirilmez.
- Android için JavaScript paketi yeniden üretildi. Fiziksel Expo Go cihazında görsel kabul testi henüz yapılmadı.

# v0.100.0 · 7 Eylül 2026

İlk entegre Expo Go geliştirme demosu.

- Yeni Expo SDK 57 projesi; native WebView köprüsü ve tamamen gömülü Three.js oyun paketi.
- OSM Ankara merkez yol verisi, prosedürel 3D şehir/kurye/garaj/Vault, yönlü rota ve dinamik kapanış.
- Dikey sürüş, gaz/fren/yön, yardımcılı direksiyon, hava/trafik/paket/yakıt/bakım fiziği.
- Şirket oluşturma, telefon uygulamaları, Dispatch, cüzdan, araç/kozmetik ilerlemesi.
- VIP token, altı bölümlü dört hikâye, üç Black Contract işi, dört sezon Final varyasyonu.
- Günlük hedefler, kozmetik streak, yerel yorum/itibar/skor/Ghost ve paylaşım kartları.
- Ana kayıttan ayrı hızlı test kariyeri, Final hazırlığı, JSON yedekleme.
- Koruyucu GitHub → Termux eşitlemesi, kilitli bağımlılık kurulumu, Metro yeniden başlatıcısı ve GitHub Actions kontrolleri.

Düzeltilen geliştirme sorunları: yol dışından dönüşte aracın takılması, viraj ve rüzgâr düzeltmesi, Final reroute sırasında zorunlu durak kaybı, yeniden başlayan teslimatta eski minimap zamanı, garajdan sürüşe kameranın uçması, bozuk kayıt listeleri, boş Ghost replay’i ve Android paylaşım dosyasının erken silinmesi.

Bu sürümde gerçek sunucu hesabı, Supabase, AI servisi, ödeme, ödül hakkı, sunucu anti-cheat, tam şehirler, premium sanat paketi ve APK bulunmaz. Tam liste için DKD-KAPSAM belgesini incele.

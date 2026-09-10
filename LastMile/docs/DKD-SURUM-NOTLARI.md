# v0.3.0 · 8 Eylül 2026

Expo Go / Android geliştirme sürümü.

- Başlangıç scooterı ve sürücüsü güvenli yerel Three.js geometrisiyle yenilendi. Ön gövde katmanları, cam, LED/DRL detayları, yan şeritler, arka kutu reflektörleri, görünürlük yeleği, kask bandı, telefon tutucu ve aynalar eklendi.
- Daha önce yüklenen scooter+sürücü ikili verisinin GitHub'a parçalı aktarımda bozulduğu doğrulandı. Bozuk byte akışı yayın çalışma yolundan tamamen çıkarıldı; oyun artık bu veriyi çözmeye çalışmıyor. Kurtarma kopyası ayrı arşiv dalında korunuyor.
- Başlangıç aracı mevcut marka rengi, üniforma rengi, aksesuarlar, teker animasyonu ve eski kayıtlarla uyumlu çalışıyor.
- Yardımcı direksiyon yeni ve taşınan kayıtlarda varsayılan kapalı; sürüş kamerası varsayılan `Yüksek`.
- Rota okları XZ zemininde gerçek yol başlangıcı → hedef doğrultusuna dönüyor; virajlarda ters/yan gösterim düzeltildi.
- Kurye merkezi kamerası genişletildi ve iki parmakla yakınlaştırma/uzaklaştırma eklendi.
- Telefon başlığı `DraBornGo` olarak güncellendi.
- Teslimat noktasına varıldığında zorunlu duraklar tamamlanmışsa teslimat otomatik sonuçlanıyor.
- Müzik ve efekt varsayılan seviyeleri yükseltildi; modern ses katmanı ve geri bildirimler korunuyor.
- Paket sürümü `0.3.0`, Android `versionCode 300`, Expo SDK 57.
- Oyun paketi çalışma anında harici CDN veya ağ isteği yapmıyor.
- GitHub Actions doğrulaması; oyun paketi üretimi, tüm Node testleri, TypeScript kontrolü, Expo bağımlılık kontrolü ve JavaScript boşluk kontrolünü kapsıyor.
- APK/AAB bu geliştirme akışında üretilmiyor; fiziksel test hedefi Expo Go.

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

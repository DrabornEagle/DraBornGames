# 50 maddelik tasarımın durumu

v0.101 arayüz güncellemesi: tüm oyun metinleri Türkçeleştirildi, tutarlar TL cinsinden oyun bakiyesi olarak gösteriliyor, renkli ve animasyonlu arayüz eklendi. Aşağıdaki tablo ilk v0.100 kapsamını ve üretim sınırlarını korur.

Kapsam, 7 Eylül 2026 tarihindeki kaynak kodunu açıklar. **Oynanabilir** yerel uygulamada çalışan sistemi; **demo** sınırlı, kurgusal veya benzetilmiş karşılığı; **sonraki aşama** henüz uygulanmayan üretim işini ifade eder. Bu belge 50 maddenin üretim seviyesinde tamamlandığı iddiası değildir. Supabase ve APK bilerek kapsam dışında tutulur.

| No | Tasarım | v0.100 karşılığı / sınır |
|---|---|---|
| 1 | Sıfırdan prestijli şirkete | Oynanabilir: City 50, para, XP, itibar, araç ve garaj ilerlemesi; çalışan sistemi yok. |
| 2 | İlk giriş, şirket kimliği | Oynanabilir kayıt, isteğe bağlı fotoğraf, marka rengi/logo/üniforma. Antalya 23:42 metin prologu ve 3D garaj; yönetilmiş yağmurlu sinematik sonraki aşama. Telefon doğrulaması yok. |
| 3 | Gerçek şehir seçimi | Ankara merkezi gerçek yol örneği açık; İstanbul, İzmir, Bursa kilitli. Şehirlerin tamamı modellenmedi. |
| 4 | Gerçek yol + yapay şehir | OSM yol geometrisi, prosedürel binalar, oyun müşteri/giriş adları. Gerçek bina kimliği/özel konut bağlantısı yok. Çok bölümlü harita streaming’i sonraki aşama. |
| 5 | Dikey sürüş | Oynanabilir gaz/fren/yön pedi; yardımcılı veya serbest direksiyon, üç kamera, korna/far/telefon. Araç sınıflarında fizik parametreleri farklı. |
| 6 | Kurye telefonu | 16 çalışan uygulama ekranı; sürüşte navigasyon HUD’u ve 3D telefona benzer nesne. Fiziksel telefon ekranında ayrı işletim sistemi render’ı yok. |
| 7 | DraDispatch | Teklifler, hava/gece/VIP/mesafe ödemeleri, kabul/red, rota seçimi. Teklifler yerel seed ile üretilir. |
| 8 | Sipariş ekonomisi | Paket tabanı + mesafe, hava, gece, VIP ve rota risk primi; hasar/gecikme ödeme azaltır. Trafik ücreti için ayrı çarpan henüz yok; trafik süreyi etkiler. |
| 9 | Paket sınıfları | 14 sınıf; ağırlık, hasar duyarlılığı, kalite kaybı, tıbbi/acil süre, yağmur/soğuk etkileri; Black Contract zinciri. |
| 10 | Hava | Sekiz hava profili; yol tutuşu, fren, rüzgâr itmesi, görüş, paket, sıcaklık, yağış ve kapanış. Sipariş boyunca hava profili sabit. Fiziksel sel suyu/ağaç devrilme simülasyonu sonraki aşama. |
| 11 | Şehir olayları | Zaman tetiklemeli olay bildirimleri, trafik yavaşlaması, yol kapanması ve yeni rota. Gerçek olay servisi/kalabalık simülasyonu yok. |
| 12 | Riskli rota | Yönlü graf üzerinde geniş yolları tercih eden güvenli rota ve kısa yol; kimi teslimatlarda aynı güzergâh. Risk sürüşten doğar, rastgele kaza üretmez. |
| 13 | Araç ilerlemesi | 10 araç, sekiz stat, kapasite/seviye/bakiye kontrolleri; scooter/motosiklet/otomobil/van model aileleri. Her araç için ayrı sanatçı üretimi model sonraki aşama. |
| 14 | Garaj | Dört ilerleme seviyesi, prosedürel ekipmanlar ve üst kat; merkezde seçili araç 3D. Filonun tamamını aynı anda gösteren çok katlı gezilebilir merkez yok. |
| 15 | Özelleştirme | Şirket rengi/logo/üniforma, kıyafet/aksesuar/kaplama; oyun parasıyla alınır. Gerçek para işlemi yok. Bazı ayrıntılar araç model ailesine bağlıdır. |
| 16 | Şirket yönetimi | Kullanıcı kararı gereği uygulanmadı. Çalışan işe alma/yönetme yok. |
| 17 | Kurgusal müşteriler | 10 müşteri, 9 kadın; tamamı 21+ yetişkin. Procedural çizim portreleri kullanılır; AI fotoğraf, gerçek sosyal profil ve müşteri telefonu yok. |
| 18 | Kişilik | İsim/meslek/karakter ve görev notları; VIP’ye göre bölüm metni ve tercih edilen paket. Her NPC için bağımsız karmaşık puanlama modeli yok. |
| 19 | VIP Contact Token | Her 100 Master’da bir token; dört VIP seçeneği; sezon içinde seçim değiştirilemez. Ayrı test kaydında hızlandırılmış veri var. |
| 20 | VIP hikâyesi | Dört VIP × altı yazılmış bölüm ve teslimat. Bölüm ilerlemesi zaman/hasar koşuluna bağlı. Sonrasında günlük görevler için tekrar VIP işleri açık kalır. |
| 21 | Mesajlar | Başlangıç, teslimat performansı ve VIP durumuna göre yazılmış mesajlar; yerelde kayıt. Uygulama dışı push bildirim yok. |
| 22 | AI konuşma | Açık etiketli senaryo demosu; anahtar kelime/görev durumuna uygun hazır cevap. LLM veya AI servis entegrasyonu yok. |
| 23 | Canlı görüşme | Cihaz TTS’siyle karakter konuşması demosu. Gerçek zamanlı ses/video AI veya gerçek insan görüşmesi yok. |
| 24 | Reward Vault | Üç boyutlu vitrin ve üç örnek cihaz; hedef ilerlemesi. MSI adı hedef etiketi; sponsor anlaşması, gerçek stok/ürün garantisi yok. |
| 25 | Ödül seçimi | Phone/MSI/Tablet seçimi; merkezde kalıcı ilerleme kartı. Seçim demo hedefidir. |
| 26 | Sunucu ödül kararı | Yerel kontrol ekranı var; “sunucu bağlı değil / ödül hakkı yok” açık. Yükleme, gerçek doğrulama ve ödül kodu yok. |
| 27 | Beceri yarışması | Açık beş bileşenli yerel 100.000 puan formülü ve sabit Final koşulları. Gerçek yarışma/sezon ödül sistemi açılmadı. |
| 28 | Boş madde | Kaynak tasarımda içerik yok. Yeni gereksinim uydurulmadı. |
| 29 | Full Career satın alma | Eğitim sonrası “ücretsiz demo kariyerini aç” çalışır. Ödeme/mağaza/gerçek lisans kontrolü yok. |
| 30 | Pay-to-win olmaması | Gerçek para yok; Final standart araç, yakıt, bakım ve sabit koşullarla açılır. Kariyer geliştirmeleri Final fiziğini değiştirmez. |
| 31 | Final Contract | Üç zorunlu durak, 11 dakika, gece, sezon havası, kapanış olayı, 19% telefon, Signal Lost bölümü ve yerel sonuç. Tam yönetilmiş sinematik sonraki aşama. |
| 32 | Final sonrası | Yerel kayıt/audit, ayrıntılı puan ve geçmiş. “Uploading/Server Verified” gibi gerçekleşmeyen durumlar gösterilmez. |
| 33 | Anti-cheat | Hız/hareket tutarlılığı ve yola dönüş sinyali için yerel audit; skor kodda hesaplanır. Değiştirilmiş istemciyi engellemez. Sunucu otoritesi, hesap/cihaz bütünlüğü ve replay doğrulama henüz yok. |
| 34 | GPS | Hiç GPS kullanılmaz. Oyun metrik sanal koordinatlarla çalışır. Sunucu koordinat otoritesi henüz yok. |
| 35 | Günlük | Beş günlük hedef, tek seferlik 750 oyun parası + rozet; gerçek ödül ihtimali ve rastgele çekiliş yok. Gün UTC’ye göre değişir. |
| 36 | Streak | 7/14/30 gün kozmetik; token giriş gününden kazanılmaz. Sistem saati yereldir ve yarışma kanıtı değildir. |
| 37 | Reputation | Zamanında/hasarsız/puan/mesafe/ustalık/gece/fırtına/VIP güveni, şirket yorum geçmişi ve paylaşım kartı. |
| 38 | Ligler | Ankara/Türkiye/Contract filtreli örnek rakipler; kendi yerel Final geçmişin. Canlı oyuncu sıralaması ve lig ödül servisi yok. |
| 39 | Ghost Courier | Aynı sezondaki en hızlı yerel Final’den transparan replay; geçilirse +350 oyun parası, skor çarpanı yok. Rakibin sunucuda doğrulanmış sürüşü yok. |
| 40 | Sezonlar | Dört temanın hava/seed/metin/Final varyasyonu. Sezon değişiminde kariyer varlıkları kalır, sezon hedefleri sıfırlanır. Her sezon ayrı harita/araç/sanat paketi yok. |
| 41 | Topluluk | Açık etiketli sentetik sayaç + yerel teslimat katkısı, kozmetik hedef akışı. Gerçek oyuncu toplamı yok. |
| 42 | Gizli görev | Kusursuz gece elektronik teslimatı Black zincirini açar; üç bölüm notu ve özel işler. Saatler süren dallanmış campaign veya telefon arama sinematiği yok. |
| 43 | Yorumlar | Zaman/hasar/Master sonucuna göre yorumlar; müşteri ve puanla şirket sayfasında saklanır. |
| 44 | Sosyal paylaşım | 1080×1350 şirket/teslimat kartı ve oyun fotoğrafı; sistem paylaşım penceresini oyuncu açar. Gerçek sıralama yüzdeleri uydurulmaz. |
| 45 | Kişisel veri | Ayrı yerel kayıt ve demo koşulu kutuları, opsiyonel fotoğraf, JSON yedek/silme. SMS/kimlik/ödül teslimat doğrulaması yok; demo veri kullanılabilir. |
| 46 | APK sitesi | İstek gereği APK çıkarılmadı; site indirmesi, APK SHA-256 ve imza bilgileri henüz yok. Kaynak kod ve Termux kurulumu mevcut. |
| 47 | Boş madde | Kaynak tasarımda içerik yok. |
| 48 | Grafik hedefi | Prosedürel 3D şehir/araç, PBR malzemeler, asfalt dokusu, sis, yağış, farlar ve kalite ayarları. Premium gerçekçi sanat üretimi/cihaz performans hedefi henüz kabul edilmedi. |
| 49 | Fiziksel ana menü | 3D garaj arka planı, ortada seçili araç, şirket tabelası, telefon ve Vault girişleri. Serbest yürüyüş ve nesnelere 3D raycast etkileşimi yok. |
| 50 | İki ilerleme hattı | Kariyer XP/para/araç/itibar ile Master/VIP/fırtına/Final hedefleri birlikte ilerler. |

## Üretim aşamasına geçiş sırası

1. Expo Go 57.0.9 üzerinde gerçek cihaz kontrolü; düşük/orta/yüksek cihazlarda FPS, sıcaklık, pil ve sürüş hissi ölçümü.
2. Harita bölümlerinin genişletilmesi, tile/LOD sistemi, araç ve bina sanat üretimi, fizik ve çarpışma iyileştirmesi; dikey HUD cihaz kabulü.
3. Demo adaptörleri yerine kimlik, kayıt eşitleme, çevrimiçi sezon ve otoriter sürüş hizmetleri. Bu sürümün kayıtları gerçek yarışmaya taşınamaz.
4. Tasarım onaylı hikâyeler, isteğe bağlı AI hizmeti, ödeme/lisans ve ödül operasyonlarının ayrı entegrasyonları.
5. Sabit yarışma kuralları, ayrılmış final altyapısı, cihaz bütünlüğü, sunucu replay doğrulaması ve sonuç itiraz iş akışı tamamlanmadan gerçek ödül etkinleştirilmez.
6. Kullanıcı APK aşamasını istediğinde Android dağıtım, imzalama, sürüm hash’i, indirme sayfası ve cihaz matrisi.

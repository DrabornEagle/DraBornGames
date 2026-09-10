# Uygulama mimarisi

## Katmanlar

| Katman | Kaynak | Sorumluluk |
|---|---|---|
| Expo kabuğu | `App.tsx` | Safe area, WebView, seri AsyncStorage yazımı, uygulama yaşam döngüsü, Android geri tuşu, fotoğraf seçimi, haptic, dosya paylaşımı ve TTS |
| Yerel oyun verisi | `game/dkd-data.mjs` | Paket/araç/hava/karakter/VIP/kozmetik/sezon katalogları ve demo rakipler |
| Simülasyon | `game/dkd-core.mjs` | Yönlü yol grafı, rota, seed, fizik, trafik, paket, ekonomi, kariyer, yerel audit |
| Görüntü | `game/dkd-renderer.mjs` | Three.js WebGL2 sahnesi, instancing, prosedürel şehir/garaj/araç, far, hava, ghost |
| Arayüz / akış | `game/dkd-ui.mjs`, `game/dkd-controller.mjs` | Telefon uygulamaları, gerçek DOM/pointer olayları, duraklatma, native bridge |
| Ses | `game/dkd-audio.mjs` | Web Audio sentezi; müzik, motor, korna, yağmur |
| Offline paket | `scripts/dkd-build-game.mjs` | Three CJS ve oyun kaynaklarını Terser ile tek HTML’ye paketler; ayrıca TypeScript string’i üretir |

Three.js, React Native WebView içindeki WebGL2 bağlamında çalışır. React Native tarafında özel C++/Kotlin oyun modülü, WebGPU veya custom development build yoktur. Native özellikler Expo Go’da bulunan paketlerden seçilmiştir. Gerçek cihaz uyumluluğu ayrıca ölçülmelidir.

Oyun HTML’si harici CDN veya API kullanmaz. CSP `connect-src 'none'` ağ isteklerini kapatır; native köprü izin verilen mesaj türleriyle çalışır. Metro/Expo geliştirme araçlarının ağ trafiği bu sınırın dışında kalır. Projede Supabase istemcisi, ödeme anahtarı veya AI anahtarı yoktur.

## Fizik ve yollar

OSM yol verisi yerel metre koordinatlarına çevrilir. Koordinat sistemi X doğu, Z güneydir. Orijin 39.9195 N / 32.854 E. Grafik tek yönleri taşır; güvenli rota geniş yollara ağırlık verir, riskli rota daha kısa mesafeyi seçer. Dinamik kapanışlar graf üzerinden yeni rota üretir. Finalde henüz geçilmemiş zorunlu duraklar korunur.

Simülasyon sabit 1/60 saniye adımla ilerler; render düşük/dengeli modda 30, yüksek modda 60 FPS hedefler. Bunlar hedef ayarlardır, ölçülmüş cihaz FPS garantisi değildir. Frame gecikmesi en fazla 0,1 saniye işlenir; duvar saati ile simülasyon süresi arasında doğrulanmış otorite yoktur.

Direksiyon yardımcısı rotadaki yakın bir hedefe düzeltme uygular. Gaz oyuncuya aittir; yardım açıkken viraj öncesi hız sınırlandırılır. Fren her zaman oyuncuda. Araç yol dışındayken yavaş ilerleyerek geri dönebilir; kurtarma düğmesi 15 saniye ceza verir ve koşuyu Master/geçerli yerel Final koşullarından çıkarır. Trafik basit legal yol takibi kullanır; gerçek şehrin trafik ışığı ve kavşak yapay zekâsının tamamı modellenmez.

## Kayıt ve ekonomi

Kayıt zarfı `{ dkd_career, dkd_test, dkd_active }` biçimindedir. Her kariyer `dkd_schema: 1` taşır. Native kayıt anahtarı `dkd_lastmile_native_v1`; tarayıcı önizlemesi kendi localStorage alanını kullanır. Ana ve test kariyeri birbirinden ayrıdır. Kayıtlar şifrelenmiş kimlik depoları değildir; demoda gerçek kişisel veri gerekmez.

Başlangıçta bozuk kayıt okunursa dosya üzerine yazılmaz. Yeniden deneme kaydı yeniden okur. İçe aktarma boyutu ve şema kontrol edilir; profil metni, kimlikler, sayılar, liste kayıtları ve ghost çerçeveleri normalize edilir. Kullanıcı metni HTML’ye escape edilerek eklenir. JSON yedek içindeki profil, fotoğraf ve telefon da dışa aktarılır; kullanıcı dosyasını kendi seçtiği hedefe paylaşır.

Aktif sürüş RAM’dedir. Menü ve arka plan geçişlerinde durur; uygulama öldürüldükten sonra kaldığı kareden devam etmez. Tamamlanan teslimat, alışveriş, marka ve ayarlar yerel kayda yazılır. Kazanç aynı aktif koşu için iki kez verilemez. Kayıt dosyası kullanıcı tarafından düzenlenebilir; bu durum gerçek ödül kanıtı sayılmaz.

## Final ve doğrulama sınırı

Yerel skor 100.000 üzerinden hesaplanır:

| Bileşen | Ağırlık |
|---|---:|
| Paket kalitesi/doğruluğu | %25 |
| Süre | %25 |
| Hasarsızlık | %20 |
| Sürüş güvenliği | %20 |
| Rota verimliliği | %10 |

Final Urban 125’in temel statlarını, tam yakıt/bakımı, sabit sezon seed’ini, aynı zorunlu durakları ve aynı yardım ayarını kullanır. Kariyer motor/lastik/çanta yükseltmeleri bu istatistiklere uygulanmaz. Kozmetik veya ghost bonusu Final skorunu çarpmaz.

Telemetri `[simülasyonSaniyesi, x, z, yönRadyanı, hızMetreSaniye]` örnekleriyle yaklaşık 2 Hz tutulur. Yerel kontrol tutarsız konum/hız ve kurtarmayı işaretler. Dışa aktarılan koşuda görev/araç/fizik/checkpoint/paket özeti de bulunur. Bu veri seti, üretim anti-cheat için gereken ham input geçmişi ve güvenilir sunucu saatinin tamamını içermez.

**Her yerel audit sonucu daima `dkd_serverVerified: false` ve `dkd_prizeEligible: false` döndürür.** `LOCAL_CHECK_PASSED` yalnızca yerel tutarlılık kontrolüdür. Sunucuya yükleme, cihaz attestation, imzalı ödül kodu veya gerçek yarışma uygunluğu yoktur.

Gelecekte ayrı bir otoriter servis oturum başlatma/seed verme, sıra numaralı input akışı, checkpoint doğrulama, fizik replay’i, skor hesaplama, idempotent teslim ve ödül uygunluğunu yönetmelidir. İstemciden gelen hesaplanmış skora güvenilmemelidir. Mevcut demo zarfı bu servise bir güven sınırı sağlamaz ve doğrudan üretime taşınmamalıdır.

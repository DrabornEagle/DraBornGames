# DraBornGo / Last Mile — Google Play v0.7

## Build kimliği
- Uygulama: DraBornGo / Last Mile (Son Kilometre)
- Paket: `com.draborneagle.lastmile`
- versionName: `0.7.0`
- versionCode: `1`
- Expo SDK: `57`
- Android targetSdkVersion: `36`
- Dağıtım: Android App Bundle (`.aab`)
- İmza: kalıcı `DKD_LASTMILE` keystore; yeni anahtar üretilmez.

## Google Play varyantı
Normal geliştirme/APK sürümlerinin oynanışı değiştirilmez. AAB build hattı yalnızca Google Play varyantında `window.dkd_googlePlayBuild=true` olarak açılır. Bu varyantta gerçek dünya ödül claim verisi sunucuya gönderilmez ve sezon/kasa/final ödül yüzeyleri oyun içi hedef olarak sunulur. Fiziksel ürün, nakit veya gerçek dünya değeri verilmez.

## Gizlilik ve hesap silme
- Gizlilik: `https://www.draborneagle.com/draborngo/lastmile/gizlilik/`
- Hesap silme: `https://www.draborneagle.com/draborngo/lastmile/hesap-silme/`
- Uygulama içi hesap silme: Ayarlar → Gizlilik ve hesap → HESABIMI VE VERİLERİMİ SİL
- Hassas GPS, mikrofon, kamera ve rehber izinleri Google Play AAB manifestinden engellenir.

## Data Safety için kaynak envanter
Play Console beyanı uygulamanın gerçek sunucu davranışıyla eşleşmelidir. v0.7 koduna göre beyan hazırlanırken en az şu veri akışlarını kontrol et:
- Hesap/profil: ad-soyad, kullanıcı adı, e-posta, telefon, şirket adı, plaka.
- İsteğe bağlı profil fotoğrafı.
- Kimlik doğrulama ve oturum verisi (Supabase).
- Oyun ilerlemesi ve bulut kayıtları.
- Oyun içi sanal rota/hız/süre/bütünlük telemetrisi ve hile önleme verileri.
- Destek ve hesap silme taleplerinde kullanıcının verdiği bilgiler.
- Cihazın hassas GPS konumu Last Mile rota sistemi tarafından kullanılmaz; oyun koordinatları sanaldır.
- v0.7 Google Play paketinde üçüncü taraf reklam SDK'sı yoktur.

## Play Console'da elle tamamlanacak mağaza alanları
AAB dışında Play Console hesabına özgü beyanlar otomatik yapılamaz: uygulama adı/açıklama/görseller, kategori, iletişim bilgileri, içerik derecelendirme anketi, hedef kitle, Data Safety formu, hesap silme URL'si, gizlilik URL'si, uygulama erişimi bilgisi ve ücret/fiyatlandırma. Hesap girişi incelemeyi kısıtlıyorsa Google inceleme ekibine geçerli test erişimi sağlanmalıdır.

## Teknik build kontrolleri
AAB workflow'u yayın artefaktını vermeden önce:
1. normal oyun bundle/test/typecheck kontrollerini çalıştırır,
2. Google Play virtual-only korumasını yalnız AAB çalışma alanında etkinleştirir,
3. Expo prebuild sonrasında API 36 hedefini doğrular,
4. gereksiz hassas izinlerin manifestte bulunmadığını doğrular,
5. kalıcı JKS ile `bundleRelease` üretir,
6. AAB JAR imzasını doğrular,
7. 64-bit `arm64-v8a` native kitaplıklarını doğrular,
8. 64-bit ELF LOAD segmentlerinde minimum `0x4000` hizalama kontrolüyle 16 KB page-size uyumluluğunu doğrular,
9. SHA-256, signing identity ve build raporlarını artifact'e ekler.

## Sürüm kuralı
Bu ilk Play yüklemesi `versionCode=1` kullanır. Bundan sonraki her Google Play güncellemesinde versionCode artırılmalıdır. Paket adı ve kalıcı signing kimliği değiştirilmemelidir.

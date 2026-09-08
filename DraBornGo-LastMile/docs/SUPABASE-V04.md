# DraBornGo / Last Mile — Supabase v0.4

Bu belge yalnızca DraBornGo / Last Mile v0.4 alanını açıklar. DraBornGo projesindeki diğer uygulama verileri bu alanın dışında kalır.

## İzolasyon

Last Mile verileri PostgreSQL içinde özel **`Last-Mile`** şemasındadır. Mobil istemci bu tablolara doğrudan erişmez. Uygulama Supabase Auth JWT ile `dkd-last-mile-api` Edge Function'ına bağlanır; Edge Function yalnızca service-role yetkili `dkd_lastmile_*` RPC'lerini çağırır.

Service-role/secret key mobil uygulamaya veya WebView oyun paketine gömülmez. Mobil tarafta yalnızca publishable key kullanılır.

## Hesap ve yetki modeli

v0.4 artık normal oyuncu hesabını destekler:

- **Giriş Yap:** E-posta + şifre ile Supabase Auth oturumu açılır.
- **Kendi Şirketini Kur / Kayıt Ol:** Ad soyad, kullanıcı adı, telefon, şirket adı, e-posta ve şifre ile Supabase hesabı oluşturulur.
- Kullanıcının kurye profili `dkd_lastmile_profiles` içinde tutulur.
- Oyun ilerlemesi `dkd_lastmile_player_progress` içinde kullanıcı kimliğine bağlıdır.
- Aktif normal oyuncular gerçek organik görevleri alabilir, kabul edebilir, iptal edebilir ve tamamlayabilir.
- `draborneagle@gmail.com` hesabı mevcut Auth rol metadata'sı sayesinde girişte otomatik **admin** olarak tanınır; ayrı bir yönetici giriş ekranı yoktur.

## Demo modu

Gerçek görev verileri her zaman aktiftir. Demo verileri:

- varsayılan **kapalıdır**,
- normal oyunculara gösterilmez,
- yalnızca admin kendi hesabı için açıp kapatabilir,
- global sistem ayarını değiştirmez,
- profil bazlı `dkd_demo_enabled` alanında tutulur.

Bu nedenle bir admin demo görevlerini açsa bile diğer oyuncuların görev havuzu etkilenmez.

## Tablolar

- `dkd_lastmile_profiles`
- `dkd_lastmile_system_config`
- `dkd_lastmile_city_zones`
- `dkd_lastmile_content_packages`
- `dkd_lastmile_content_customers`
- `dkd_lastmile_mission_templates`
- `dkd_lastmile_player_progress`
- `dkd_lastmile_delivery_jobs`
- `dkd_lastmile_admin_audit`

## Sunucu RPC'leri

Doğrudan `anon` veya `authenticated` rolüne açık değildir; Edge backend service-role ile çağırır:

- `dkd_lastmile_ensure_profile`
- `dkd_lastmile_bootstrap`
- `dkd_lastmile_claim_job`
- `dkd_lastmile_accept_job`
- `dkd_lastmile_cancel_job`
- `dkd_lastmile_complete_job`
- `dkd_lastmile_save_progress`
- `dkd_lastmile_toggle_demo`

`toggle_demo` admin-only kalır. Diğer oyuncu yaşam döngüsü RPC'leri aktif Last-Mile oyuncularına açıktır ancak yalnızca Edge Function üzerinden çalıştırılır.

## Organik görev sistemi

Sunucu aktif görev şablonlarından gerçek bir `dkd_lastmile_delivery_jobs` kaydı oluşturur. Yaşam döngüsü:

`offered -> accepted -> completed`

veya

`offered/accepted -> cancelled`

Tamamlama kaydına süre, mesafe, hasar, paket kalitesi, çarpışma, puan, kazanç ve zamanında teslim gibi metrikler yazılır.

Görev yenilemede eski teklif kayıtları iptal edilir. Oyuncu bir görevi kabul ettiğinde diğer açık teklifler de kapatılır; böylece sahipsiz sentetik iş yığını oluşmaz.

## Gerçek Ankara içerikleri

Bölgeler; Kızılay, Sıhhiye, Kolej, Kavaklıdere, Küçükesat, Tunalı, Ayrancı, Kurtuluş yanında Bahçelievler, Emek, Balgat, Gaziosmanpaşa, Dikmen, Cebeci, Ulus ve Çankaya'yı içerir.

Paket/içerik türleri arasında sıcak yemek, tıbbi kargo, kırılabilir paket, elektronik, soğuk zincir, evrak, mağaza siparişi, yedek parça ile birlikte Market Sepeti, Fırın Siparişi, Çiçek Teslimatı, Kuru Temizleme, Evcil Hayvan Ürünü, İmzalı Hukuk Evrakı, Laboratuvar Numunesi ve Toplu Catering Çantası bulunur.

Yeni gerçek görev örnekleri:

- Market Akşam Yoğunluğu
- Sabah Fırın Turu
- Çiçek Zamanı
- Kuru Temizleme Ekspres
- Evcil Hayvan Acil Siparişi
- Yağmur Sonrası Market
- İmzalı Dosya
- Hassas Laboratuvar Numunesi
- Etkinlik Catering Teslimatı
- Gece Çiçek Teslimatı
- Fırtına Öncesi Market Toplama
- Sıcak Hava Numunesi

Bunlar önceki gerçek görevlerle birlikte organik havuzda çalışır.

## v0.4 istemci kuralları

- Zorunlu yönetici giriş ekranı kaldırılmıştır.
- Normal giriş ve kayıt ol akışı vardır.
- Sentetik sıralama kullanıcıları ve sentetik topluluk sayacı gösterilmez.
- Gerçek cihaz saati telefon ekranında canlı kullanılır.
- Ayarlarda manuel JSON dışa aktar / yedekten geri yükle kullanıcı akışı kaldırılmıştır; ilerleme Supabase'e senkronize edilir.
- Menü ve sürüş müzikleri ayrı ses bus'ları ve ayrı nota zamanlayıcılarıyla çalışır; mod değişiminde önceki müzik sesleri kapatılır.
- Sürüş teslim butonu v0.4 için renkli ve hareketli hale getirilmiştir.
- AsyncStorage yalnızca cihaz içi çalışma kopyasıdır; gerçek hesap ilerlemesinin kaynağı Supabase'dir.

## Expo

Hedef Expo SDK 57 / Expo Go 57.x'tir. v0.4 aşamasında APK/AAB üretilmez.

# DraBornGo / Last Mile — Supabase v0.4

Bu belge yalnızca DraBornGo / Last Mile v0.4 alanını açıklar. Mevcut DraBornGo ve DraBornGate tablolarına dokunulmaz.

## İzolasyon

Veriler PostgreSQL içinde özel **`Last-Mile`** şemasındadır. Mobil istemci bu şemadaki tablolara doğrudan erişmez. Uygulama Supabase Auth JWT ile `dkd-last-mile-api` Edge Function'ına bağlanır; Edge Function yalnızca service-role yetkili `dkd_lastmile_*` RPC'lerini çağırır.

Service-role/secret key mobil uygulamaya veya WebView oyun paketine gömülmez.

## Tablo isim standardı

Tüm Last-Mile tabloları aynı prefix'i taşır:

- `dkd_lastmile_profiles`
- `dkd_lastmile_system_config`
- `dkd_lastmile_city_zones`
- `dkd_lastmile_content_packages`
- `dkd_lastmile_content_customers`
- `dkd_lastmile_mission_templates`
- `dkd_lastmile_player_progress`
- `dkd_lastmile_delivery_jobs`
- `dkd_lastmile_admin_audit`

Constraint, index, sequence, trigger ve policy adları da mümkün olan yerlerde `dkd_lastmile_*` standardına taşınmıştır.

## Sunucu RPC'leri

Doğrudan `anon` veya `authenticated` rolüne açık değildir; yalnızca backend service-role çağırır:

- `dkd_lastmile_bootstrap`
- `dkd_lastmile_claim_job`
- `dkd_lastmile_accept_job`
- `dkd_lastmile_cancel_job`
- `dkd_lastmile_complete_job`
- `dkd_lastmile_save_progress`
- `dkd_lastmile_toggle_demo`

## Yetki modeli

v0.4 geliştirme aşamasında bütün oyun içerikleri Last-Mile `admin` rolüne kilitlidir. `draborneagle@gmail.com` kullanıcısının Last-Mile rolü `admin` olarak işaretlenmiştir.

Demo modu sunucu tarafında varsayılan **kapalıdır**. Demo görev şablonları veritabanında ayrı `dkd_is_demo=true` olarak tutulur ve yalnızca admin ayarından geçici olarak açılabilir.

## Organik görev sistemi

Normal vardiya artık sentetik istemci listesi üretmez. Uygulama sunucudan aktif görev şablonuna göre gerçek `dkd_lastmile_delivery_jobs` satırı oluşturur. İş kaydı `offered -> accepted -> completed/cancelled` yaşam döngüsünü destekler. Tamamlama kaydına süre, mesafe, puan, hasarsızlık ve sunucu ödülü gibi metrikler yazılır.

## İçerikler

v0.4 başlangıç verisi Ankara için Kızılay, Sıhhiye, Kolej, Kavaklıdere, Küçükesat, Tunalı, Ayrancı ve Kurtuluş bölgelerini içerir. Paket türlerinde sıcak yemek, tıbbi, kırılabilir, elektronik, soğuk zincir, evrak, mağaza siparişi ve yedek parça bulunur.

Organik görev örnekleri: Sıcak Sipariş Koşusu, Kırılabilir Geçiş, Gece Eczane, Yağmurda Elektronik, Yoğun Saat Evrakı, Soğuk Zincir Numune, Akşam Mağaza Siparişi, Acil Yedek Parça, Fırtınada Sıcak Teslimat ve Çifte Baskı.

## v0.4 istemci kuralları

- Eski sentetik sıralama kullanıcıları üretilen oyun paketinden temizlenir.
- Sentetik topluluk sayacı gösterilmez.
- Yerel test kariyeri görünür kullanıcı akışından kaldırılmıştır.
- Gerçek cihaz saati telefon ekranında canlı kullanılır.
- Menü ve sürüş müziği ayrı ses bus'larında crossfade ile çalışır.
- Yerel AsyncStorage yalnızca güvenli cihaz yedeğidir; admin oturumu açıkken ilerleme Supabase'e senkronize edilir.

## Expo

Hedef Expo SDK 57 / Expo Go 57.x'tir. v0.4 aşamasında APK/AAB üretilmez.

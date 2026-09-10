# Kaynak ve lisans bildirimleri

## OpenStreetMap yol verisi

© OpenStreetMap contributors. OpenStreetMap verileri **Open Database License 1.0 (ODbL)** kapsamındadır.

- Telif/lisans açıklaması: https://www.openstreetmap.org/copyright
- ODbL tam metni: https://opendatacommons.org/licenses/odbl/1-0/
- İndirme kaynağı: https://api.openstreetmap.org/api/0.6/map?bbox=32.845,39.912,32.863,39.927
- Alınma tarihi: 2026-09-07
- BBox: batı 32.845 / güney 39.912 / doğu 32.863 / kuzey 39.927
- Ham XML SHA-256: `b6edb1a7a1de117aba367898290c7341661ee8d147f29bcbadf13c811bb6326b`
- Türetilmiş, makine okunur yol verisi: `game/data/dkd-ankara.json` ve eşdeğer `dkd-roads.mjs`.
- Dönüştürücü: `scripts/dkd-import-osm.mjs`; proje kökünden `node scripts/dkd-import-osm.mjs <indirilen-osm-dosyası>`.

Türetilmiş yol verisi ODbL 1.0 kapsamında sağlanır. Üretimde genişletilirken veri lisansı ve atıf korunmalıdır. Bu veri lisansı oyun kodunun tamamına bir lisans vermez. Oyun içi navigasyon ve bilgi ekranlarında atıf bulunur.

Ham dosya repoya eklenmedi. Yalnızca araçla erişilebilir kamu yollarının geometrisi, yol adı, yönü ve genişlik yaklaşımı tutulur; konut adresleri, OSM kullanıcı/editleyen bilgileri, kişi ve özel müşteri POI’leri oyuna aktarılmaz. Yol genişliklerinin bir kısmı yol sınıfından tahmindir; gerçek trafik navigasyonu için uygun değildir. Oyundaki bina ve müşteri bağlantıları kurgudur.

## Three.js ve diğer paketler

Three.js 0.172.0, MIT lisanslıdır. Lisans metni bu klasörde `THREE-LICENSE.txt` olarak korunur; gömülü oyun paketinin lisans başlığı da derlemede tutulur. Expo, React, React Native, WebView ve diğer npm paketlerinin kendi lisansları dağıtımlarında korunur. Kilitli sürüm ve kaynaklar `package-lock.json` içinde bulunur.

Bu sürüm harici ücretli 3D model, stok fotoğraf veya müzik dosyası kullanmaz. Meshler, çizim portreleri, asfalt dokusu, paylaşım kartı ve sesler kodla üretilir. Kullanıcının seçtiği opsiyonel fotoğraf kendi cihaz kaydında kalır. MSI/telefon/tablet etiketleri demoda örnek hedef adlarıdır; sponsor anlaşması veya gerçek ürün stok beyanı değildir.

## Resmî teknik referanslar

- Expo SDK 57: https://expo.dev/changelog/sdk-57
- Expo WebView SDK 57: https://docs.expo.dev/versions/v57.0.0/sdk/webview/
- Three.js: https://threejs.org/docs/

Uygulama sürümü 0.100.0, Expo SDK sürümü 57 ve Expo Go uygulama sürümü 57.0.9 farklı sürüm numaralarıdır.

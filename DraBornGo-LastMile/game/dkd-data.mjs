export const dkd_version = 'v0.100';
export const dkd_colors = ['#e4ff5e', '#51d8cf', '#ec8157', '#92a9ff', '#e886b8', '#f2eee4'];
export const dkd_vehicles = [
  { dkd_id: 'dkd_city50', dkd_name: 'City 50', dkd_label: 'Başlangıç scooter', dkd_price: 0, dkd_speed: 58, dkd_accel: 4.0, dkd_grip: .77, dkd_weather: .50, dkd_storage: 12, dkd_durability: .70, dkd_fuel: .90, dkd_handling: .94, dkd_kind: 'scooter', dkd_level: 1 },
  { dkd_id: 'dkd_electric', dkd_name: 'E / Courier', dkd_label: 'Elektrikli kurye', dkd_price: 3600, dkd_speed: 68, dkd_accel: 5.2, dkd_grip: .80, dkd_weather: .65, dkd_storage: 16, dkd_durability: .76, dkd_fuel: .50, dkd_handling: .95, dkd_kind: 'scooter', dkd_level: 2 },
  { dkd_id: 'dkd_125', dkd_name: 'Urban 125', dkd_label: 'Şehrin ritmi', dkd_price: 5800, dkd_speed: 86, dkd_accel: 5.8, dkd_grip: .82, dkd_weather: .67, dkd_storage: 22, dkd_durability: .78, dkd_fuel: 1, dkd_handling: .92, dkd_kind: 'scooter', dkd_level: 3 },
  { dkd_id: 'dkd_maxi', dkd_name: 'Maxi / GT', dkd_label: 'Uzun mesafe', dkd_price: 10500, dkd_speed: 108, dkd_accel: 6.2, dkd_grip: .86, dkd_weather: .82, dkd_storage: 32, dkd_durability: .88, dkd_fuel: 1.1, dkd_handling: .82, dkd_kind: 'scooter', dkd_level: 5 },
  { dkd_id: 'dkd_naked', dkd_name: 'Street / 400', dkd_label: 'Çevik ve güçlü', dkd_price: 16200, dkd_speed: 120, dkd_accel: 7.5, dkd_grip: .90, dkd_weather: .65, dkd_storage: 18, dkd_durability: .80, dkd_fuel: 1.2, dkd_handling: .91, dkd_kind: 'motorcycle', dkd_level: 7 },
  { dkd_id: 'dkd_adventure', dkd_name: 'Terra / ADV', dkd_label: 'Her hava, her yol', dkd_price: 22500, dkd_speed: 126, dkd_accel: 6.8, dkd_grip: .96, dkd_weather: .98, dkd_storage: 38, dkd_durability: .96, dkd_fuel: 1.3, dkd_handling: .80, dkd_kind: 'motorcycle', dkd_level: 9 },
  { dkd_id: 'dkd_sport', dkd_name: 'Apex / RR', dkd_label: 'Hassas sürüş', dkd_price: 29800, dkd_speed: 135, dkd_accel: 8.5, dkd_grip: .94, dkd_weather: .60, dkd_storage: 14, dkd_durability: .75, dkd_fuel: 1.5, dkd_handling: .76, dkd_kind: 'motorcycle', dkd_level: 11 },
  { dkd_id: 'dkd_car', dkd_name: 'Metro / EV', dkd_label: 'Teslimat otomobili', dkd_price: 36000, dkd_speed: 110, dkd_accel: 5.5, dkd_grip: .95, dkd_weather: 1, dkd_storage: 85, dkd_durability: .95, dkd_fuel: .85, dkd_handling: .64, dkd_kind: 'car', dkd_level: 12 },
  { dkd_id: 'dkd_van', dkd_name: 'Cargo / XL', dkd_label: 'Kargo filosu', dkd_price: 44500, dkd_speed: 100, dkd_accel: 4.0, dkd_grip: .88, dkd_weather: .97, dkd_storage: 160, dkd_durability: 1, dkd_fuel: 1.7, dkd_handling: .52, dkd_kind: 'van', dkd_level: 14 },
  { dkd_id: 'dkd_special', dkd_name: 'Storm / Unit', dkd_label: 'Özel operasyon', dkd_price: 58000, dkd_speed: 125, dkd_accel: 7.2, dkd_grip: 1, dkd_weather: 1, dkd_storage: 48, dkd_durability: 1, dkd_fuel: 1.1, dkd_handling: .88, dkd_kind: 'motorcycle', dkd_level: 16 }
];
export const dkd_packages = [
  { dkd_id: 'dkd_hot', dkd_name: 'Hot Delivery', dkd_tr: 'Sıcak yemek', dkd_icon: 'flame', dkd_base: 210, dkd_weight: 2, dkd_decay: .07, dkd_sensitivity: 1, dkd_level: 1, dkd_note: 'Isıyı koru. Süre ilerledikçe sıcaklık düşer.' },
  { dkd_id: 'dkd_medical', dkd_name: 'Medical', dkd_tr: 'Tıbbi kargo', dkd_icon: 'medical', dkd_base: 360, dkd_weight: 3, dkd_decay: .045, dkd_sensitivity: 1, dkd_level: 2, dkd_note: 'Dar teslimat penceresi. Dakik olmalısın.' },
  { dkd_id: 'dkd_fragile', dkd_name: 'Fragile', dkd_tr: 'Kırılabilir', dkd_icon: 'box', dkd_base: 320, dkd_weight: 5, dkd_decay: 0, dkd_sensitivity: 2.3, dkd_level: 1, dkd_note: 'Çarpışmalar pakete iki kat fazla zarar verir.' },
  { dkd_id: 'dkd_electronics', dkd_name: 'Electronics', dkd_tr: 'Elektronik', dkd_icon: 'chip', dkd_base: 390, dkd_weight: 4, dkd_decay: 0, dkd_sensitivity: 1.4, dkd_level: 2, dkd_note: 'Yağmurda yalıtımlı çanta büyük fark yaratır.' },
  { dkd_id: 'dkd_frozen', dkd_name: 'Frozen', dkd_tr: 'Soğuk zincir', dkd_icon: 'snow', dkd_base: 310, dkd_weight: 6, dkd_decay: .08, dkd_sensitivity: 1, dkd_level: 3, dkd_note: 'Aşırı sıcak soğuk zinciri daha hızlı bozar.' },
  { dkd_id: 'dkd_animal', dkd_name: 'Animal Care', dkd_tr: 'Mama ve bakım', dkd_icon: 'heart', dkd_base: 240, dkd_weight: 8, dkd_decay: 0, dkd_sensitivity: 1, dkd_level: 1, dkd_note: 'Barınağın teslimat girişinde dur.' },
  { dkd_id: 'dkd_luxury', dkd_name: 'Luxury', dkd_tr: 'Lüks ürün', dkd_icon: 'diamond', dkd_base: 520, dkd_weight: 5, dkd_decay: 0, dkd_sensitivity: 2, dkd_level: 5, dkd_note: 'Kusursuz paket, yüksek müşteri beklentisi.' },
  { dkd_id: 'dkd_confidential', dkd_name: 'Confidential', dkd_tr: 'Gizli evrak', dkd_icon: 'lock', dkd_base: 450, dkd_weight: 1, dkd_decay: 0, dkd_sensitivity: 1.1, dkd_level: 4, dkd_note: 'Kontrol noktalarını sırasıyla takip et.' },
  { dkd_id: 'dkd_night', dkd_name: 'Night Express', dkd_tr: 'Gece ekspresi', dkd_icon: 'moon', dkd_base: 370, dkd_weight: 5, dkd_decay: .02, dkd_sensitivity: 1, dkd_level: 3, dkd_note: 'Düşük görüşte virajlardan önce yavaşla.' },
  { dkd_id: 'dkd_vip', dkd_name: 'VIP', dkd_tr: 'Özel teslimat', dkd_icon: 'star', dkd_base: 580, dkd_weight: 6, dkd_decay: .02, dkd_sensitivity: 1.5, dkd_level: 5, dkd_note: 'Dakiklik ve hasarsız teslim bir arada.' },
  { dkd_id: 'dkd_oversized', dkd_name: 'Oversized', dkd_tr: 'Büyük hacimli', dkd_icon: 'truck', dkd_base: 650, dkd_weight: 65, dkd_decay: 0, dkd_sensitivity: 1.5, dkd_level: 8, dkd_note: 'En az 65 litre kapasiteli araç gerekiyor.' },
  { dkd_id: 'dkd_emergency', dkd_name: 'Emergency', dkd_tr: 'Acil görev', dkd_icon: 'bolt', dkd_base: 620, dkd_weight: 4, dkd_decay: .06, dkd_sensitivity: 1, dkd_level: 6, dkd_note: 'Kısa süre; rotayı kabul etmeden incele.' },
  { dkd_id: 'dkd_mystery', dkd_name: 'Mystery Package', dkd_tr: 'Bilinmeyen paket', dkd_icon: 'eye', dkd_base: 490, dkd_weight: 7, dkd_decay: 0, dkd_sensitivity: 1.4, dkd_level: 4, dkd_note: 'Bazen sıradan bir iş, başka bir hikâye açar.' },
  { dkd_id: 'dkd_black', dkd_name: 'BLACK CONTRACT', dkd_tr: 'Gönderici bilinmiyor', dkd_icon: 'fingerprint', dkd_base: 900, dkd_weight: 5, dkd_decay: .02, dkd_sensitivity: 1.7, dkd_level: 6, dkd_note: 'Sinyalin peşinden git. Hikâye görevi.' }
];
export const dkd_weathers = [
  { dkd_id: 'dkd_clear', dkd_name: 'Açık', dkd_icon: 'sun', dkd_grip: 1, dkd_bonus: 1, dkd_fog: 740, dkd_wind: 0, dkd_rain: 0, dkd_temperature: 22 },
  { dkd_id: 'dkd_rain', dkd_name: 'Yağmur', dkd_icon: 'rain', dkd_grip: .75, dkd_bonus: 1.4, dkd_fog: 530, dkd_wind: .25, dkd_rain: 1, dkd_temperature: 14 },
  { dkd_id: 'dkd_storm', dkd_name: 'Fırtına', dkd_icon: 'storm', dkd_grip: .62, dkd_bonus: 1.75, dkd_fog: 360, dkd_wind: 1, dkd_rain: 1.8, dkd_temperature: 9 },
  { dkd_id: 'dkd_snow', dkd_name: 'Kar', dkd_icon: 'snow', dkd_grip: .50, dkd_bonus: 1.6, dkd_fog: 400, dkd_wind: .35, dkd_rain: .7, dkd_temperature: -3 },
  { dkd_id: 'dkd_fog', dkd_name: 'Sis', dkd_icon: 'fog', dkd_grip: .85, dkd_bonus: 1.3, dkd_fog: 115, dkd_wind: 0, dkd_rain: 0, dkd_temperature: 8 },
  { dkd_id: 'dkd_wind', dkd_name: 'Sert rüzgâr', dkd_icon: 'wind', dkd_grip: .92, dkd_bonus: 1.25, dkd_fog: 640, dkd_wind: 1.2, dkd_rain: 0, dkd_temperature: 19 },
  { dkd_id: 'dkd_heat', dkd_name: 'Aşırı sıcak', dkd_icon: 'sun', dkd_grip: .96, dkd_bonus: 1.35, dkd_fog: 680, dkd_wind: 0, dkd_rain: 0, dkd_temperature: 39 },
  { dkd_id: 'dkd_flood', dkd_name: 'Sel uyarısı', dkd_icon: 'rain', dkd_grip: .60, dkd_bonus: 1.85, dkd_fog: 340, dkd_wind: .6, dkd_rain: 2, dkd_temperature: 12 }
];
export const dkd_customers = [
  { dkd_id: 'dkd_selin', dkd_name: 'Selin A.', dkd_age: 28, dkd_role: 'Mimar', dkd_trait: 'Titiz', dkd_color: '#e1ac95', dkd_hair: '#322b2a', dkd_note: 'Paketi güvenliğe bırakma. Arka girişten geleceğim.', dkd_kind: 'dkd_fragile' },
  { dkd_id: 'dkd_ece', dkd_name: 'Ece Y.', dkd_age: 26, dkd_role: 'Şef', dkd_trait: 'Samimi', dkd_color: '#d7b294', dkd_hair: '#7b563d', dkd_note: 'Restoranın teslimat kapısındayım.', dkd_kind: 'dkd_hot' },
  { dkd_id: 'dkd_mira', dkd_name: 'Mira Kaya', dkd_age: 32, dkd_role: 'Teknoloji girişimcisi', dkd_trait: 'Analitik', dkd_color: '#c79386', dkd_hair: '#202532', dkd_note: 'Elektroniği sudan koru. Seni girişte karşılayacağım.', dkd_kind: 'dkd_electronics' },
  { dkd_id: 'dkd_deniz', dkd_name: 'Deniz E.', dkd_age: 29, dkd_role: 'Fotoğrafçı', dkd_trait: 'Keşifçi', dkd_color: '#e4baa3', dkd_hair: '#b68248', dkd_note: 'Fotoğraf stüdyosunun yan girişini kullan.', dkd_kind: 'dkd_fragile' },
  { dkd_id: 'dkd_lara', dkd_name: 'Lara D.', dkd_age: 30, dkd_role: 'Etkinlik organizatörü', dkd_trait: 'Gece insanı', dkd_color: '#ce9982', dkd_hair: '#673b35', dkd_note: 'Etkinlik çıkışı kalabalık. Servis yolunda bekliyorum.', dkd_kind: 'dkd_night' },
  { dkd_id: 'dkd_ada', dkd_name: 'Ada S.', dkd_age: 34, dkd_role: 'Veteriner', dkd_trait: 'Duyarlı', dkd_color: '#bf8d72', dkd_hair: '#29272a', dkd_note: 'Bakım merkezinin kargo girişine gel.', dkd_kind: 'dkd_animal' },
  { dkd_id: 'dkd_asya', dkd_name: 'Asya T.', dkd_age: 27, dkd_role: 'Tasarımcı', dkd_trait: 'Detaycı', dkd_color: '#ebc5ad', dkd_hair: '#5b3c2c', dkd_note: 'Paketin köşelerinin sağlam olması önemli.', dkd_kind: 'dkd_luxury' },
  { dkd_id: 'dkd_irem', dkd_name: 'İrem K.', dkd_age: 31, dkd_role: 'Lojistik uzmanı', dkd_trait: 'Planlı', dkd_color: '#c59b83', dkd_hair: '#1d232e', dkd_note: 'Kabul noktası tabelanın hemen yanında.', dkd_kind: 'dkd_confidential' },
  { dkd_id: 'dkd_duru', dkd_name: 'Duru M.', dkd_age: 25, dkd_role: 'Araştırmacı', dkd_trait: 'Meraklı', dkd_color: '#d6a28e', dkd_hair: '#956345', dkd_note: 'Zili çalmana gerek yok; teslimat alanındayım.', dkd_kind: 'dkd_frozen' },
  { dkd_id: 'dkd_emre', dkd_name: 'Emre B.', dkd_age: 35, dkd_role: 'Atölye sahibi', dkd_trait: 'Pratik', dkd_color: '#b38a70', dkd_hair: '#302c28', dkd_note: 'Atölyenin yükleme cebinde dur.', dkd_kind: 'dkd_oversized' }
];
export const dkd_vips = [
  { dkd_customer: 'dkd_mira', dkd_title: 'NO SIGNAL', dkd_sub: 'Elektronik · yüksek risk', dkd_chapters: ['İlk Temas', '02:13 AM', 'Kayıp Paket', 'Sinyal Yok', 'Fırtınanın İçinden', 'Son Teslimat'], dkd_lines: ['Bu şehirde hızdan önce güven gelir.', 'Bu saatte mesaj beklemiyordun, biliyorum.', 'Paket kayıp değil. Yanlış kişiyi arıyoruz.', 'Navigasyon kesilirse yol işaretlerine bak.', 'Yağmurda bile paketi korumanı istiyorum.', 'Son kapı. Son teslimat. Hazır mısın?'] },
  { dkd_customer: 'dkd_lara', dkd_title: 'AFTER HOURS', dkd_sub: 'Gece · şehir olayları', dkd_chapters: ['Sahne Arkası', 'Son Konuk', 'Yan Sokak', 'Sessiz Şehir', 'Elektrik Kesintisi', 'Şafaktan Önce'], dkd_lines: ['Gece vardiyasına hoş geldin.', 'Etkinlik bitiyor. Acele et ama dikkatli ol.', 'Ana giriş kalabalık; servis kapısına gel.', 'Bütün şehir uyuyor, bizim işimiz bitmedi.', 'Işıklar yok. Farlarına güven.', 'Şafaktan önce son bir teslimat.'] },
  { dkd_customer: 'dkd_deniz', dkd_title: 'HIDDEN FRAME', dkd_sub: 'Keşif · kırılabilir paket', dkd_chapters: ['İlk Kare', 'Diğer Sokak', 'Kırılgan', 'Uzun Pozlama', 'Kayıp Işık', 'Son Kare'], dkd_lines: ['Şehri başka bir gözle görmeni istiyorum.', 'En kısa yol her zaman en güzel yol değil.', 'Bu lensin bir çizik bile almaması gerekiyor.', 'Gece çekimi için son ekipmanı bekliyorum.', 'Sis bütün planımı değiştirdi.', 'İşte son kare. Bu hikâyenin bir parçasısın.'] },
  { dkd_customer: 'dkd_ada', dkd_title: 'SAFE ARRIVAL', dkd_sub: 'Bakım · soğuk zincir', dkd_chapters: ['İlk Yardım', 'Soğuk Zincir', 'Dostlar', 'Gece Nöbeti', 'Kritik Dakikalar', 'Güvenli Varış'], dkd_lines: ['Zamanında gelen her paket bir fark yaratır.', 'Taşıma sıcaklığı çok önemli.', 'Merkezin mama stoğu azaldı.', 'Nöbet değişiyor ama teslimatı bekliyorum.', 'Yoluna dikkat et, sana da ihtiyacımız var.', 'Herkes güvende. Son paketi bekliyoruz.'] }
];
export const dkd_prizes = [
  { dkd_id: 'dkd_phone', dkd_name: 'PHONE', dkd_sub: 'Sezon telefonu', dkd_icon: 'phone', dkd_stock: 1 },
  { dkd_id: 'dkd_laptop', dkd_name: 'MSI', dkd_sub: 'Oyun dizüstü bilgisayarı', dkd_icon: 'laptop', dkd_stock: 1 },
  { dkd_id: 'dkd_tablet', dkd_name: 'TABLET', dkd_sub: 'Sezon tableti', dkd_icon: 'tablet', dkd_stock: 1 }
];
export const dkd_seasons = [
  { dkd_id: 'dkd_season01', dkd_name: 'THE GREAT STORM', dkd_theme: 'Fırtınayı aş.', dkd_weather: 'dkd_storm', dkd_number: '01' },
  { dkd_id: 'dkd_season02', dkd_name: 'CITY AFTER DARK', dkd_theme: 'Gece sana ait.', dkd_weather: 'dkd_fog', dkd_number: '02' },
  { dkd_id: 'dkd_season03', dkd_name: 'HEATWAVE', dkd_theme: 'Sıcaklığın sınırında.', dkd_weather: 'dkd_heat', dkd_number: '03' },
  { dkd_id: 'dkd_season04', dkd_name: 'BLACKOUT', dkd_theme: 'Işıklar sönünce.', dkd_weather: 'dkd_rain', dkd_number: '04' }
];
export const dkd_events = [
  { dkd_id: 'dkd_match', dkd_name: 'Maç çıkışı', dkd_text: 'Trafik yoğunlaşıyor. Araçlar yavaşladı.', dkd_traffic: .55, dkd_closure: false },
  { dkd_id: 'dkd_concert', dkd_name: 'Konser çıkışı', dkd_text: 'Etkinlik alanının servis yolu kapanıyor.', dkd_traffic: .65, dkd_closure: true },
  { dkd_id: 'dkd_works', dkd_name: 'Yol çalışması', dkd_text: 'İleri bağlantı kapalı. Yeni rota hesaplandı.', dkd_traffic: .8, dkd_closure: true },
  { dkd_id: 'dkd_accident', dkd_name: 'Trafik kazası', dkd_text: 'Bir yol bağlantısı kullanıma kapandı.', dkd_traffic: .6, dkd_closure: true },
  { dkd_id: 'dkd_check', dkd_name: 'Trafik kontrolü', dkd_text: 'Çevrede kontrollü geçiş var; trafik yavaşlıyor.', dkd_traffic: .5, dkd_closure: false },
  { dkd_id: 'dkd_marathon', dkd_name: 'Şehir maratonu', dkd_text: 'Koşu güzergâhında yol kapanışı.', dkd_traffic: .75, dkd_closure: true },
  { dkd_id: 'dkd_festival', dkd_name: 'Festival', dkd_text: 'Merkez bağlantısında yoğunluk oluştu.', dkd_traffic: .6, dkd_closure: true },
  { dkd_id: 'dkd_gathering', dkd_name: 'Meydan etkinliği', dkd_text: 'Kalabalık nedeniyle alternatif rota açıldı.', dkd_traffic: .7, dkd_closure: true },
  { dkd_id: 'dkd_power', dkd_name: 'Elektrik kesintisi', dkd_text: 'Sokak aydınlatmaları kapandı. Farını aç.', dkd_traffic: .7, dkd_closure: false },
  { dkd_id: 'dkd_transit', dkd_name: 'Toplu taşıma arızası', dkd_text: 'Otobüs hattı çevresinde yoğun trafik.', dkd_traffic: .45, dkd_closure: false }
];
export const dkd_cosmetics = [
  { dkd_id: 'dkd_helmet', dkd_name: 'Carbon kask', dkd_slot: 'dkd_helmet', dkd_price: 700, dkd_icon: 'helmet' },
  { dkd_id: 'dkd_jacket', dkd_name: 'Nightline mont', dkd_slot: 'dkd_jacket', dkd_price: 900, dkd_icon: 'shirt' },
  { dkd_id: 'dkd_pants', dkd_name: 'Rider pantolon', dkd_slot: 'dkd_pants', dkd_price: 500, dkd_icon: 'shirt' },
  { dkd_id: 'dkd_gloves', dkd_name: 'Pro eldiven', dkd_slot: 'dkd_gloves', dkd_price: 350, dkd_icon: 'shield' },
  { dkd_id: 'dkd_boots', dkd_name: 'Tour bot', dkd_slot: 'dkd_boots', dkd_price: 500, dkd_icon: 'shield' },
  { dkd_id: 'dkd_bag', dkd_name: 'Şirket çantası', dkd_slot: 'dkd_bag', dkd_price: 600, dkd_icon: 'box' },
  { dkd_id: 'dkd_raincoat', dkd_name: 'Storm yağmurluk', dkd_slot: 'dkd_raincoat', dkd_price: 700, dkd_icon: 'rain' },
  { dkd_id: 'dkd_mount', dkd_name: 'Telefon tutucu', dkd_slot: 'dkd_mount', dkd_price: 300, dkd_icon: 'phone' },
  { dkd_id: 'dkd_rims', dkd_name: 'Alloy jant', dkd_slot: 'dkd_rims', dkd_price: 950, dkd_icon: 'wheel' },
  { dkd_id: 'dkd_exhaust', dkd_name: 'Titan egzoz', dkd_slot: 'dkd_exhaust', dkd_price: 850, dkd_icon: 'bolt' },
  { dkd_id: 'dkd_livery', dkd_name: 'Velocity kaplama', dkd_slot: 'dkd_livery', dkd_price: 1200, dkd_icon: 'palette' },
  { dkd_id: 'dkd_plate', dkd_name: 'Özel plaka', dkd_slot: 'dkd_plate', dkd_price: 450, dkd_icon: 'badge' }
];
export const dkd_demoRankings = [
  { dkd_name: 'DARKRIDER', dkd_company: 'Midnight Logistics', dkd_city: 'Ankara', dkd_prize: 'dkd_laptop', dkd_score: 97824 },
  { dkd_name: 'EAGLE07', dkd_company: 'Eagle Express', dkd_city: 'Antalya', dkd_prize: 'dkd_phone', dkd_score: 96320 },
  { dkd_name: 'FASTWOLF', dkd_company: 'Wolf Courier', dkd_city: 'İstanbul', dkd_prize: 'dkd_tablet', dkd_score: 95140 },
  { dkd_name: 'NOVA06', dkd_company: 'Nova Delivery', dkd_city: 'Ankara', dkd_prize: 'dkd_phone', dkd_score: 93780 },
  { dkd_name: 'RAINRUNNER', dkd_company: 'Rain Express', dkd_city: 'Ankara', dkd_prize: 'dkd_laptop', dkd_score: 92100 }
];

export const dkd_blackStory = [
  { dkd_title: '01 / Yanlış Paket', dkd_line: 'Bu paketi ben sipariş etmedim. Kutudaki işaret eski bir veri merkezine ait. Etiketteki servis girişini takip et.' },
  { dkd_title: '02 / Yankı', dkd_line: 'Kutuda bir telefon var. Yıllar önce kapanan bir ağa bağlandı. Son sinyal Atlas Plaza çevresinden geliyor. Yağmura dikkat et.' },
  { dkd_title: '03 / Son Sinyal', dkd_line: 'Bulduğun cihaz şehir arşivinin kayıp yedeğini taşıyor. Gönderenin adı hâlâ bilinmiyor. Arşiv girişine ulaştır; bu hikâyeyi birlikte kapatalım.' }
];

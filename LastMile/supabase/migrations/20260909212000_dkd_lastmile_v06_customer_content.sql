-- DraBornGo / Last Mile v0.6
-- Expands the real customer/order pool. Existing Last-Mile data is preserved.

insert into "Last-Mile".dkd_lastmile_content_customers
  (dkd_id, dkd_name, dkd_role, dkd_trait, dkd_note, dkd_color, dkd_hair, dkd_package_id, dkd_is_demo, dkd_is_active)
values
  ('dkd_customer_01','Aylin K.','Restoran yöneticisi','Dakik','Siparişi sıcak tut; arka servis kapısındayım.','#d8a78f','#35261f','dkd_hot',false,true),
  ('dkd_customer_02','Buse T.','Mutfak şefi','Hız odaklı','Kurye girişini kullan, ana salon çok yoğun.','#e0b399','#5c3729','dkd_hot',false,true),
  ('dkd_customer_03','Ceren Y.','Kafe işletmecisi','Samimi','İçecekleri dik taşı; girişte seni karşılayacağım.','#cf9f87','#2d221f','dkd_hot',false,true),
  ('dkd_customer_04','Derya A.','Eczacı','Titiz','Paketin teslim süresi dar; doğrudan nöbetçi girişe gel.','#ddb29b','#3b2a27','dkd_medical',false,true),
  ('dkd_customer_05','Elif S.','Sağlık teknisyeni','Dikkatli','Tıbbi paketi sarsmadan danışmaya teslim et.','#d2a189','#211c1b','dkd_medical',false,true),
  ('dkd_customer_06','Funda M.','Klinik sorumlusu','Planlı','Teslim kodunu görevliye söyle; bekleme alanına bırakma.','#c99880','#604230','dkd_medical',false,true),
  ('dkd_customer_07','Gizem E.','Mimar','Detaycı','Kırılabilir numuneyi resepsiyona değil bana teslim et.','#e0b69f','#463028','dkd_fragile',false,true),
  ('dkd_customer_08','Hazal D.','İç mimar','Titiz','Kutunun köşelerini koru, servis asansörünü kullan.','#d6a78f','#6a4330','dkd_fragile',false,true),
  ('dkd_customer_09','İlayda B.','Seramik tasarımcısı','Hassas','Ani fren yapma; paketin içinde kırılabilir ürün var.','#e5bba4','#2a211e','dkd_fragile',false,true),
  ('dkd_customer_10','Jale N.','Teknoloji mağazası müdürü','Analitik','Elektroniği yağmurdan koru ve barkodu teslimde okut.','#cfa08b','#1e2026','dkd_electronics',false,true),
  ('dkd_customer_11','Kübra R.','Yazılım uzmanı','Pratik','Cihazı güvenliğe bırakma; ofis girişinde bekliyorum.','#d5a78e','#302821','dkd_electronics',false,true),
  ('dkd_customer_12','Leyla C.','Ürün yöneticisi','Düzenli','Paket hassas; bina B girişinden gel.','#d9aa91','#4b3028','dkd_electronics',false,true),
  ('dkd_customer_13','Melis P.','Laboratuvar uzmanı','Dakik','Soğuk zincir değerini koru; numune kabul noktasına gel.','#d3a48c','#362820','dkd_frozen',false,true),
  ('dkd_customer_14','Nehir V.','Gıda mühendisi','Kontrollü','Soğuk paketi güneşte bekletme; arka depodayım.','#dcae94','#5a3b2b','dkd_frozen',false,true),
  ('dkd_customer_15','Oya L.','Diyetisyen','Planlı','Teslimattan önce beni ara; ürünler soğuk kalmalı.','#cfa18a','#2c211e','dkd_frozen',false,true),
  ('dkd_customer_16','Pelin G.','Veteriner hekim','Şefkatli','Bakım ürünlerini acil girişe getir; hastalar bekliyor.','#ddb39c','#51372e','dkd_petcare',false,true),
  ('dkd_customer_17','Rana H.','Veteriner teknisyeni','Hızlı','Mama paketini kuru tut; klinik kapısındayım.','#d7a990','#332720','dkd_petcare',false,true),
  ('dkd_customer_18','Seda İ.','Hayvan bakım uzmanı','Sakin','Kırmızı tabelalı yan kapıyı kullan.','#e0b29b','#684634','dkd_petcare',false,true),
  ('dkd_customer_19','Tuğçe O.','Butik yöneticisi','Seçici','Lüks ürünü çizmeden ve kutuyu ezmeden getir.','#d2a189','#1f1b1c','dkd_retail',false,true),
  ('dkd_customer_20','Yasemin U.','Mağaza sorumlusu','Düzenli','Teslimatı personel girişinden yap; müşteri alanı yoğun.','#d9ab93','#4a3228','dkd_retail',false,true),
  ('dkd_customer_21','Zeynep Ç.','Moda danışmanı','Titiz','Paketi kuru tut; teslim fişini yanımda onayla.','#e2b79f','#36261f','dkd_retail',false,true),
  ('dkd_customer_22','Aslı F.','Avukat','Planlı','İmzalı dosyayı doğrudan sekreterliğe teslim et.','#d2a18a','#2a2421','dkd_legal',false,true),
  ('dkd_customer_23','Berrin Ş.','Hukuk danışmanı','Dakik','Dosya mahkemeye çıkacak; teslim saatini kaçırma.','#d7a98f','#503629','dkd_legal',false,true),
  ('dkd_customer_24','Damla K.','Stajyer avukat','Pratik','Girişte dosya kodunu söyle; ben aşağı ineceğim.','#e1b49c','#30241f','dkd_legal',false,true),
  ('dkd_customer_25','Eylül Y.','Lojistik uzmanı','Planlı','Kurumsal evrakı danışmaya değil 8. kata getir.','#d7aa92','#423028','dkd_document',false,true),
  ('dkd_customer_26','Feride T.','Ofis yöneticisi','Düzenli','Teslim kodunu girişte doğrula; evrak hassas.','#d0a087','#221d1c','dkd_document',false,true),
  ('dkd_customer_27','Gamze A.','Finans uzmanı','Dakik','Dosyayı toplantı başlamadan önce ulaştır.','#deb39b','#5d3e30','dkd_document',false,true),
  ('dkd_customer_28','Hande S.','Market yöneticisi','Pratik','Poşetleri dengeli taşı; cam ürünler ayrı torbada.','#d5a58d','#3f2c25','dkd_grocery',false,true),
  ('dkd_customer_29','İpek M.','Mağaza çalışanı','Hızlı','Soğuk ürünleri ayrı tut, bina girişinde bekliyorum.','#e0b59d','#2b2320','dkd_grocery',false,true),
  ('dkd_customer_30','Lale D.','Ev müşterisi','Samimi','Ağır poşetleri asansörün yanına bırakma; kapıda teslim alacağım.','#d8a991','#6a4633','dkd_grocery',false,true),
  ('dkd_customer_31','Merve E.','Fırın işletmecisi','Erken','Sıcak ürünleri ezmeden sabah teslimat noktasına getir.','#d4a48c','#35271f','dkd_bakery',false,true),
  ('dkd_customer_32','Nazlı B.','Pastacı','Titiz','Kutuyu düz tut; pastane arka kapısındayım.','#e2b79f','#57382d','dkd_bakery',false,true),
  ('dkd_customer_33','Özge R.','Kafe sahibi','Samimi','Fırın paketini sıcak tut ve tezgahta bekletme.','#d7a88f','#2b211e','dkd_bakery',false,true),
  ('dkd_customer_34','Pınar C.','Çiçek tasarımcısı','Hassas','Çiçekleri rüzgârdan koru; sapları sıkıştırma.','#dcae96','#4b3229','dkd_flowers',false,true),
  ('dkd_customer_35','Selma N.','Organizasyon uzmanı','Detaycı','Aranjmanı dik taşı; etkinlik girişinde bekliyorum.','#d3a38b','#271f1d','dkd_flowers',false,true),
  ('dkd_customer_36','Şirin V.','Çiçekçi','Sakin','Paketi güneşte bekletme; teslimat masasına getir.','#e0b39b','#694635','dkd_flowers',false,true),
  ('dkd_customer_37','Aysu G.','Kuru temizleme yöneticisi','Düzenli','Tekstil paketini yağmurdan koru ve askıları bükme.','#d6a78f','#3a2b24','dkd_laundry',false,true),
  ('dkd_customer_38','Bahar H.','Stilist','Titiz','Kıyafetleri kuru tut; prova başlamadan önce gel.','#e1b59d','#2c2320','dkd_laundry',false,true),
  ('dkd_customer_39','Cansu İ.','Mağaza sorumlusu','Planlı','Paket askıda taşınmalı; servis girişini kullan.','#d0a087','#53382d','dkd_laundry',false,true),
  ('dkd_customer_40','Defne O.','Laboratuvar araştırmacısı','Analitik','Numuneyi sarsmadan doğrudan kabul ünitesine getir.','#d9aa91','#211d1d','dkd_lab',false,true),
  ('dkd_customer_41','Esra U.','Biyolog','Dakik','Sıcaklık kaybını minimumda tut; teslim penceresi kısa.','#d5a68e','#463128','dkd_lab',false,true),
  ('dkd_customer_42','Gül Ç.','Kimya teknisyeni','Kontrollü','Numuneyi güneşte bekletme; B blok girişini kullan.','#dfb29a','#674333','dkd_lab',false,true),
  ('dkd_customer_43','Hilal F.','Servis danışmanı','Acil','Yedek parçayı servis kapanmadan atölyeye ulaştır.','#d4a48b','#31251f','dkd_parts',false,true),
  ('dkd_customer_44','Irmak Ş.','Motosiklet ustası','Pratik','Parçayı darbelerden koru; yükleme cebinde bekliyorum.','#dbae95','#4d342a','dkd_parts',false,true),
  ('dkd_customer_45','Nisa K.','Otomotiv teknisyeni','Hızlı','Kutu ağır; arka servis kapısından teslim et.','#d1a188','#24201e','dkd_parts',false,true),
  ('dkd_customer_46','Sinem Y.','Catering koordinatörü','Planlı','Toplu siparişi sıcak ve dengeli taşı; servis kapısına gel.','#deb199','#593a2e','dkd_catering',false,true),
  ('dkd_customer_47','Yelda T.','Etkinlik yöneticisi','Dakik','Salon açılmadan catering çantalarını mutfağa ulaştır.','#d8a890','#362821','dkd_catering',false,true)
on conflict (dkd_id) do update set
  dkd_name = excluded.dkd_name,
  dkd_role = excluded.dkd_role,
  dkd_trait = excluded.dkd_trait,
  dkd_note = excluded.dkd_note,
  dkd_color = excluded.dkd_color,
  dkd_hair = excluded.dkd_hair,
  dkd_package_id = excluded.dkd_package_id,
  dkd_is_demo = excluded.dkd_is_demo,
  dkd_is_active = excluded.dkd_is_active,
  dkd_updated_at = now();

insert into "Last-Mile".dkd_lastmile_mission_templates
  (dkd_id, dkd_name, dkd_description, dkd_package_id, dkd_min_level, dkd_reward_min, dkd_reward_max, dkd_time_limit_sec, dkd_weather_pool, dkd_tags, dkd_is_demo, dkd_is_active)
values
  ('dkd_mission_breakfast_rush','Kahvaltı Servisi','Sabah yoğunluğu başlamadan sıcak kahvaltı paketini ulaştır.','dkd_hot',1,290,430,390,array['dkd_clear','dkd_fog'],array['sabah','sıcak','trafik'],false,true),
  ('dkd_mission_lunch_tower','Plaza Öğle Teslimatı','Öğle arasında sıcak siparişi plazanın servis girişine yetiştir.','dkd_hot',2,410,610,420,array['dkd_clear','dkd_rain'],array['plaza','öğle','hız'],false,true),
  ('dkd_mission_clinic_priority','Klinik Önceliği','Klinikte beklenen tıbbi paketi dar teslimat penceresinde ulaştır.','dkd_medical',2,480,710,330,array['dkd_clear','dkd_rain'],array['klinik','acil','dakik'],false,true),
  ('dkd_mission_pharmacy_storm','Fırtınada Eczane','Nöbetçi eczane paketini fırtınada güvenli şekilde teslim et.','dkd_medical',4,760,1080,420,array['dkd_storm','dkd_rain'],array['eczane','fırtına','gece'],false,true),
  ('dkd_mission_gallery_fragile','Galeri Paketi','Kırılabilir tasarım ürününü ani fren yapmadan galeriye ulaştır.','dkd_fragile',2,450,670,510,array['dkd_clear','dkd_wind'],array['kırılabilir','denge','galeri'],false,true),
  ('dkd_mission_studio_glass','Stüdyo Cam Ekipmanı','Hassas cam ekipmanı stüdyoya hasarsız teslim et.','dkd_fragile',4,680,990,480,array['dkd_clear','dkd_rain'],array['stüdyo','hasarsız','hassas'],false,true),
  ('dkd_mission_phone_rain','Yağmurda Telefon','Elektronik cihazı yağıştan koruyarak müşteriye ulaştır.','dkd_electronics',2,500,730,480,array['dkd_rain','dkd_clear'],array['elektronik','yağmur','hasarsız'],false,true),
  ('dkd_mission_server_part','Sunucu Parçası','Kritik elektronik parçayı iş merkezine gecikmeden teslim et.','dkd_electronics',5,900,1280,390,array['dkd_clear','dkd_storm'],array['teknoloji','kritik','iş-merkezi'],false,true),
  ('dkd_mission_cold_market','Soğuk Market Paketi','Soğuk ürünleri sıcaklık kaybı olmadan teslim et.','dkd_frozen',3,540,790,450,array['dkd_clear','dkd_heat'],array['soğuk-zincir','market'],false,true),
  ('dkd_mission_heat_ice','Sıcak Dalgada Soğuk Zincir','Aşırı sıcakta soğuk zinciri koruyarak teslimatı bitir.','dkd_frozen',6,1050,1480,390,array['dkd_heat'],array['sıcak','soğuk-zincir','ustalık'],false,true),
  ('dkd_mission_vet_food','Veteriner Mama Paketi','Klinikte beklenen bakım ve mama ürünlerini öncelikli teslim et.','dkd_petcare',2,470,680,450,array['dkd_clear','dkd_rain'],array['veteriner','mama','öncelikli'],false,true),
  ('dkd_mission_shelter_rain','Yağmurda Barınak','Bakım ürünlerini yağış altında kuru tutarak barınağa ulaştır.','dkd_petcare',4,700,980,480,array['dkd_rain','dkd_storm'],array['barınak','yağmur','bakım'],false,true),
  ('dkd_mission_boutique_evening','Butik Akşam Teslimatı','Mağaza kapanmadan hassas ürünü personel girişine getir.','dkd_retail',3,550,800,510,array['dkd_clear','dkd_rain'],array['butik','akşam','mağaza'],false,true),
  ('dkd_mission_retail_fog','Siste Mağaza Siparişi','Sis altında mağaza paketini kontrollü sürüşle teslim et.','dkd_retail',5,820,1180,540,array['dkd_fog'],array['mağaza','sis','kontrollü'],false,true),
  ('dkd_mission_court_file','Duruşma Dosyası','İmzalı dosyayı duruşma saatinden önce hukuk ofisine ulaştır.','dkd_legal',3,650,930,390,array['dkd_clear','dkd_fog'],array['hukuk','dosya','zamanlı'],false,true),
  ('dkd_mission_contract_night','Gece Sözleşmesi','Gizli sözleşme dosyasını gece vardiyasında doğrudan teslim et.','dkd_legal',5,910,1260,450,array['dkd_clear','dkd_fog','dkd_rain'],array['gizli','gece','evrak'],false,true),
  ('dkd_mission_board_docs','Yönetim Kurulu Evrakı','Toplantı başlamadan kurumsal evrakı plazaya teslim et.','dkd_document',2,420,620,360,array['dkd_clear','dkd_wind'],array['plaza','evrak','toplantı'],false,true),
  ('dkd_mission_finance_close','Finans Kapanış Dosyası','Gün sonu kapanmadan evrakı finans ofisine ulaştır.','dkd_document',4,690,980,420,array['dkd_clear','dkd_rain'],array['finans','evrak','zamanlı'],false,true),
  ('dkd_mission_weekend_grocery','Hafta Sonu Marketi','Yoğun hafta sonu trafiğinde çok parçalı market siparişini teslim et.','dkd_grocery',2,390,590,510,array['dkd_clear','dkd_rain'],array['market','hafta-sonu','çok-parça'],false,true),
  ('dkd_mission_heavy_grocery','Ağır Market Sepeti','Ağır ve çok parçalı market sepetini dengeli biçimde ulaştır.','dkd_grocery',4,670,940,540,array['dkd_clear','dkd_wind'],array['market','ağır','denge'],false,true),
  ('dkd_mission_bakery_dawn','Şafak Fırın Teslimatı','Fırın açılışından hemen sonra sıcak ürünleri ilk müşteriye ulaştır.','dkd_bakery',1,300,440,360,array['dkd_clear','dkd_fog'],array['fırın','şafak','sıcak'],false,true),
  ('dkd_mission_cake_fragile','Pasta Kutusu','Pasta kutusunu eğmeden ve ezmeden etkinlik noktasına getir.','dkd_bakery',3,560,810,450,array['dkd_clear','dkd_rain'],array['pasta','hassas','etkinlik'],false,true),
  ('dkd_mission_wedding_flowers','Düğün Çiçekleri','Düğün başlamadan hassas çiçek aranjmanını salona ulaştır.','dkd_flowers',3,610,880,420,array['dkd_clear','dkd_wind'],array['düğün','çiçek','hassas'],false,true),
  ('dkd_mission_florist_storm','Fırtınada Aranjman','Çiçek paketini sert rüzgâr ve yağmurdan koruyarak teslim et.','dkd_flowers',5,890,1240,480,array['dkd_storm','dkd_wind'],array['çiçek','fırtına','ustalık'],false,true),
  ('dkd_mission_fashion_prova','Prova Öncesi Tekstil','Prova başlamadan kuru temizleme paketini stüdyoya yetiştir.','dkd_laundry',2,480,690,480,array['dkd_clear','dkd_rain'],array['tekstil','prova','zamanlı'],false,true),
  ('dkd_mission_laundry_storm','Yağmurda Tekstil','Tekstil paketini yoğun yağışta tamamen kuru tutarak teslim et.','dkd_laundry',4,720,1010,510,array['dkd_rain','dkd_storm'],array['tekstil','yağmur','kuru'],false,true),
  ('dkd_mission_lab_midnight','Gece Laboratuvar Numunesi','Gece vardiyasında hassas numuneyi kalite kaybetmeden laboratuvara ulaştır.','dkd_lab',4,820,1160,390,array['dkd_clear','dkd_fog'],array['laboratuvar','gece','hassas'],false,true),
  ('dkd_mission_lab_storm','Fırtına Numunesi','Fırtınada laboratuvar numunesini sarsmadan ve zamanında teslim et.','dkd_lab',7,1180,1650,420,array['dkd_storm'],array['laboratuvar','fırtına','usta'],false,true),
  ('dkd_mission_workshop_closing','Atölye Kapanışı','Servis kapanmadan kritik yedek parçayı atölyeye ulaştır.','dkd_parts',4,640,920,390,array['dkd_clear','dkd_rain'],array['servis','yedek-parça','acil'],false,true),
  ('dkd_mission_parts_wind','Rüzgârda Yedek Parça','Ağır yedek parçayı sert rüzgâr altında kontrollü taşı.','dkd_parts',6,990,1390,480,array['dkd_wind','dkd_storm'],array['yedek-parça','rüzgâr','ağır'],false,true),
  ('dkd_mission_catering_wedding','Düğün Catering','Toplu sıcak catering çantalarını salon açılmadan mutfağa teslim et.','dkd_catering',4,880,1230,540,array['dkd_clear','dkd_rain'],array['catering','düğün','yüksek-hacim'],false,true),
  ('dkd_mission_catering_storm','Fırtına Catering','Fırtına altında sıcak catering teslimatını hasarsız tamamla.','dkd_catering',7,1260,1780,600,array['dkd_storm'],array['catering','fırtına','usta'],false,true)
on conflict (dkd_id) do update set
  dkd_name = excluded.dkd_name,
  dkd_description = excluded.dkd_description,
  dkd_package_id = excluded.dkd_package_id,
  dkd_min_level = excluded.dkd_min_level,
  dkd_reward_min = excluded.dkd_reward_min,
  dkd_reward_max = excluded.dkd_reward_max,
  dkd_time_limit_sec = excluded.dkd_time_limit_sec,
  dkd_weather_pool = excluded.dkd_weather_pool,
  dkd_tags = excluded.dkd_tags,
  dkd_is_demo = excluded.dkd_is_demo,
  dkd_is_active = excluded.dkd_is_active,
  dkd_updated_at = now();

update "Last-Mile".dkd_lastmile_content_customers
set dkd_is_active = true, dkd_updated_at = now()
where dkd_is_demo = false;

update "Last-Mile".dkd_lastmile_mission_templates
set dkd_is_active = true, dkd_updated_at = now()
where dkd_is_demo = false;

# Teknik mimari — v0.1.0

## Çalıştırma ve modüller

Godot 4.5.2 (GDScript, GodotPhysics3D), Android Mobile renderer; Compatibility alternatifidir. GDExtension, ücretli API, sunucu veya ağ bağlantısı gerekmiyor. `project.godot` ana sahneyi ve altı autoload'u bağlar. `scripts/core/game.gd` oturumu kurar, eylemleri yönlendirir ve kayıt anlık görüntüsünü toplar; arazi, karakter, envanter, görev, UI ve kayıt işlerini kendi modüllerine devreder.

| Modül | Sorumluluk |
|---|---|
| DB | Eşya, blok, NPC, tarif ve görev JSON dosyaları |
| Settings | Profil, hassasiyet, ses seviyesi, sonraki başlangıç renderer tercihi |
| Controls | Klavye/fare + dokunmatik hareket, bakış, eylem kuyruğu |
| Inventory | 12 yuva, istifleme, taşıma, maliyet/çıktı işlemleri |
| Quests | Tekrarlanamaz kabul/teslim durum geçişi, ödül ve XP |
| Saves | SHA-256 zarfı, asenkron yazma, atomik geçiş ve yedek |
| SurvivalWorld | Chunk yaşam döngüsü, revizyonlar, sıra, 12 girişlik önbellek, delta |
| VoxelGenerator / ChunkBuilder | Deterministik yükseklik ve görünür yüz dizileri |
| VoxelChunk | Bir arazi mesh'i ve bir konkav statik çarpışma biçimi |
| Chunk decoration / Harvestable | MultiMesh görselleri, toplanabilir kaynakların yerel fizik gövdeleri |
| SurvivalPlayer / CharacterVisual | CharacterBody3D, ihtiyaçlar, SpringArm, AnimationPlayer |
| WorldInteraction | Nişangâh ray'i, vuruş sayısı, yerleştirme önizlemesi ve doğrulama |
| KoraNPC / Settlement | Temel rutin, durum diyaloğu, fener sonucu ve yerleşim |
| SurvivalUI / TouchOverlay | Paneller, güvenli alan, UI eylemleri, ayrı parmak kimlikleri |

İletişim: envanter `changed`, görev `changed/completed`, dünya `edited/chunk_ready`, kayıt `saved` sinyalleri kullanır. Oturum oluşturulurken bağımlılıklar açıkça atanır. Aynı içerik kimlikleri JSON, envanter ve kayıtlar arasında kullanılır.

## Voxel akışı

Bir blok 1 metredir. Chunk 16×64×16, toprak tabanı y=0 korunur. Dünya X/Z yönlerinde seed üzerinden üretilir. 64 blok yükseklik bu sürümün bilinçli sınırıdır. Kamp düzlüğü ve gölet, prosedürel yükseklik alanına sabit oynanış bölgeleri olarak karıştırılır.

Varsayılan 5×5 aktif alan, düşükte 3×3 ve yüksekte 7×7 kullanılır. Merkeze en yakın işler önce hazırlanır. Oyuncu komşu chunk collider'ı hazır değilse sınırı geçmez. Yalnızca hazırlanmış chunk üzerinde fizik çalışır; ilk yüklemede oyuncu sabit tutulur.

**İş parçacığı sınırı:** Worker yalnızca kendi noise kaynakları, 1 hücrelik halo voxel tamponu ve snapshot edilmiş düzenleme sözlüğüyle çalışır. Node, fizik kaynağı veya sahne ağacı oluşturmaz. Sonuç PackedArray'lerdir. Ana iş parçacığı tamamlanmış tek sonucu alır, ArrayMesh ve ConcavePolygonShape3D kurar. Geçersiz revizyon veya görüş alanından çıkmış sonuç atılır. World kapanırken çalışan Thread birleştirilir.

Gizli yüzler komşu blok doluysa üretilmez; chunk sınırında halo aynı üretici/delta verisini kullanır. Her blok ayrı Node veya MeshInstance değildir. Greedy meshing ve arazi LOD'u bu ölçekte henüz uygulanmaz. Görünürlük/çizim maliyeti profil, chunk kaldırma, motor frustum culling'i ve MultiMesh ile sınırlandırılır.

Düzenleme, ilgili chunk revizyonunu artırır; X/Z kenarındaysa yalnızca yüz paylaşan komşularını da kirletir. Uzak veya tekrar merkeze giren kirli chunk işini kaybetmez. Mesh kurulumunun kendisi ana iş parçacığındadır; Android donanımına göre kısa kurulum darbeleri hâlâ ölçülmelidir.

Chunk verisi tüm dünya için RAM'de tutulmaz. Temel blok anlık olarak seed'den sorgulanır; canlı chunk'lar ve sınırlı mesh önbelleği tutulur. Düzenleme/hasat deltaları bu prototipte küçük tek sözlüklerdir; çok uzun oyunlar için bölgesel delta dosyaları sonraki optimizasyon adımıdır.

## Grafik ve modeller

Arazi PBR atlası + normal haritası ve yüksek roughness kullanır. Ağaç gövdesi/taçları, taşlar ve çimenler chunk başına ortak mesh'leri MultiMesh ile çizer. Kaynakların ayrı statik collider'ları yalnızca aktif chunk'larda yaşar. Profilde aday numaraları sabit kaldığından kaynak kimlikleri yoğunluk değişiminde tutarlıdır. Ekranı kapatan yakın ağaç taçları shader'da kameranın hacmiyle kesiştiğinde çizilmez; bu şeffaf sıralama gerektirmez. SpringArm duvar/gövde çarpışmasını izler; çok yakın kamerada oyuncu görseli gizlenir.

Yumuşak dönüşümlerle hareket eden, insan formunda iki özgün geçici GLB kullanılır. Küp karakter yoktur. AnimationPlayer kolları/bacakları, idle/walk/run/jump/mine/interact animasyonlarıyla oynatır. İskelet deformasyonu, ekipman tutuşu ve saldırı animasyonu zamanlaması sonraki aşamalardır.

Sis hacimsel değildir. Bir güneş gölge kaynağı, gölgesiz ay, basit kamp/fener ışıkları kullanılır. SSAO, SDFGI, SSR ve Forward+ gerektiren özellik yoktur. Gölge, görüş mesafesi, ot/ağaç yoğunluğu, iç çözünürlük ve FPS sınırı profil ile değişir. Bunlar donanımda FPS garantisi vermez.

## Etkileşim ve ekonomi

Ray kamera merkezinden atılır, sonuç oyuncuya 5,5 metre içinde olmalıdır. Sadece `terrain` grubundaki collider'lar kırılabilir. Statik yerleşim yapıları korunur. Kaynaklar uygun araçla daha az vuruşta toplanır; başlangıçta el ile de kaynak toplanabilir. Meyve çalıları ve bırakılmış eşyalar ayrı etkileşimlerdir.

Yerleştirme: boş voxel, y sınırı, aktif chunk, oyuncu AABB'si, fizik şekli ve mevcut özel yapı konumları denetlenir. Kamp ateşi yalnızca düz üst yüzeye konur. İşlem başarısızsa kaynak iade edilir. Önizleme geçerli/geçersiz konumu renklerle gösterir.

Üretim ve görev teslimi, envanterde maliyet/ödül işlemini geri alınabilir bir anlık görüntü üzerinde tamamlar. Eksik kaynak veya dolu çanta eşya kaybettirmez. Quest durum geçişi yalnızca active → completed olduğunda ödül ve 50 XP verir; tekrar teslim kabul edilmez. Ekipman yuvaları, beceri ağacı ve seviye dengesi bu çekirdekte etkin değildir.

## Kora ve içerik verileri

Kora'nın kimliği, adı, mesleği, başlangıç verileri ve dört konuşma dalı JSON'dadır. Offer/active/ready/complete konuşma seçimi quest ve mevcut envantere bağlıdır. Günlük rutin deterministik saat koşullarıyla çalışma/kamp/dinlenme hedefleri seçer. Yakında CharacterBody3D hareketi vardır; uzak veya yüklü olmayan bölgede pahalı fizik çalışmaz. Tam NavigationAgent3D rota arama ve değiştirilebilir arazi üzerinde navigation yeniden kurma henüz etkin değildir. Meslek/görev/ticaret verilerinin genişletilmesi için modüller ayrıdır.

## Kayıt sözleşmesi

`user://survival_v1.json` Android uygulamasının kendi veri alanındadır. `schema=1`, SHA-256 ve JSON metni payload içerir. Payload: oyun sürümü, seed, voxel delta, hasat kimlikleri, kamp ateşleri, bırakılan eşyalar, karakter konumu/sağlık/ihtiyaç/kamera, envanter/seçim, quest/XP, saat, Kora konumu/ilişkisi.

Worker önce `.tmp` dosyasını yazar ve flush eder; eski checksum'ı sağlam ana kaydı `.bak` dosyasına kopyalar; sonra geçici dosyayı ana kayıt adına atomik olarak taşır. Mevcut ana dosya bozuksa sağlam yedeğin üzerine kopyalanmaz. Yükleme ana kayıt, ardından yedeği dener. Şema, hash, koordinatlar, eşya miktarları ve yapı verileri doğrulanır. `.tmp` yarım kalmışsa yükleme onu kullanmaz. Bu, dosya sistemi/donanım arızasına karşı mutlak garanti değildir.

Snapshot ana iş parçacığında alınır; yazma arka plandadır. Çok büyük delta kayıtlarında snapshot/JSON serileştirme maliyeti artabilir; bölgesel kayıt ve streaming serileştirme ileride gerekecektir. Android arka plana alınırken küçük mevcut snapshot senkron flush edilir; uygulama işletim sistemi tarafından bildirimsiz öldürülürse son 45 saniyeye kadar ilerleme kaybı olabilir.

## Test ve kaynak kullanımı

Test sahnesi tam oyun sahnesini oluşturur, fizik ve gerçek dokunma olaylarını işletir, tarifleri/görev UI butonlarını çağırır, dünyayı düzenler, chunk alanını değiştirir ve diskteki kaydı bozarak kurtarmayı dener. Görüntülü testlerde viewport görüntüleri ayrıca incelenir. Masaüstü yazılım renderer sayıları telefon performansı diye raporlanmaz.

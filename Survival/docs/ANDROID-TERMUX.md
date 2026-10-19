# Android telefonla geliştirme ve APK

## 1. Projeyi telefona getir

Godot Android Editor ve Termux kurulu olmalı. Bu proje Godot **4.5.2** ile doğrulanır. Resmî sürüm arşivi: https://godotengine.org/download/archive/4.5.2-stable/ . Daha yeni bir editör kullanırsan export şablonunu da aynı sürümde seç; bu teslimattaki testler 4.5.2'ye aittir.

İlk kurulum (Python kullanılmaz):

```bash
pkg install -y git unzip
termux-setup-storage
mkdir -p "$HOME/storage/shared/Dev"
git -c core.filemode=false clone --branch main --single-branch https://github.com/DrabornEagle/DraBornGames.git "$HOME/storage/shared/Dev/DraBornGames"
cd "$HOME/storage/shared/Dev/DraBornGames"
git config core.filemode false
```

Zaten aynı depoyu kullanıyorsan tekrar clone yapma. Mevcut depo kökünde `git status` ile yerel değişikliklerini kontrol et, gerekiyorsa commit et, ardından `git pull --ff-only origin main` çalıştır. Projeye ait `Survival/tools/termux-setup.sh` betiği de mevcut hedefi doğrular, temiz çalışma ağacını hızlı ileri günceller ve dosyaları ezmez. Betiğe mevcut depo yolunu ilk argüman olarak verebilirsin.

ZIP kullanıyorsan arşivi erişilebilir bir dizine çıkar; `Survival/project.godot` dosyasının yanında scenes, scripts, assets ve data dizinleri bulunmalı. Godot'un diğer uygulamanın özel `Android/data` dizinindeki dosyaları okumasına güvenme; ortak `Dev` veya `Download` dizini kullan.

## 2. Godot Android Editor'de aç

1. Godot'a gereken dosya erişimini ver.
2. Proje yöneticisinde **İçe Aktar / Import** seç.
3. `/storage/emulated/0/Dev/DraBornGames/Survival/project.godot` dosyasını seç. Telefonun depolama yolu farklıysa betiğin yazdırdığı gerçek yolu kullan.
4. Renderer **Mobile** olsun. Vulkan sorunu olan cihazda **Compatibility** seç.
5. İlk asset import'unun bitmesini bekle. `scenes/main/main.tscn` ana sahnedir.
6. **Projeyi Çalıştır / F5** seç. Telefonu yatay çevir; küçük PiP penceresi yerine oyunu etkin tam pencerede kullan.
7. Ana menüden **Ormana Gir** seç. 5×5 alan hazırlanırken ilk birkaç saniye hareket bekleyebilir.

Kayıt oyun uygulamasının kendi `user://` dizinindedir. Editörde çalıştırılan oyun ile ayrı kurulan APK'nın kayıtları farklı uygulama veri dizinlerindedir; bu sürüm bunları bulutla eşitlemez.

## 3. Kontroller

- Sol alt joystick: yürü. Boş sağ/orta alanı ikinci parmakla sürükle: kamerayı döndür.
- KOŞ: aç/kapat; ZIPLA: zıpla; KIR: nişangâhtaki yakın ağacı/kayayı/bloku işle.
- ETKİLEŞ: Kora yakınındayken konuş; bırakılan eşya yakınındayken geri al.
- KULLAN: seçili meyveyi ye. YERLEŞTİR: seçili yapı bloğu/kamp ateşini önizlemedeki yere koy.
- ÇANTA: ilk altı yuva hızlı çubuktur. Alet/blok/ateş daha sonraki yuvadaysa **Hızlı yuvaya taşı** kullan.
- ÜRET ve GÖREV: tarifler ve ilerleme. ☰: duraklatma, kayıt, harita, ayarlar.
- Kamera zoom'u masaüstünde tekerlekle yapılır; mobilde varsayılan takip mesafesi kullanılır. Dokunmatik pinch zoom bu sürümde yoktur.

## 4. Telefonda APK export

Godot 4.5 Android Editor Gradle build desteklemez. Proje **Gradle kullanmadan**, resmî hazır Android APK şablonuyla export edilmek üzere ayarlanmıştır.

1. Editörün **Export Template Manager / Dışa Aktarma Şablonları** bölümünden editörün **tam sürümüyle eşleşen** şablonları yükle. Bu proje için 4.5.2.stable gerekir. Çevrimdışı kurulumda aynı sürümün `.tpz` dosyasını seç.
2. **Project → Export / Proje → Dışa Aktar** aç. **Android** profili zaten `export_presets.cfg` içindedir.
3. `Use Gradle Build` kapalı kalmalı. Tek mimari `arm64-v8a`, paket kimliği `com.draborngames.survival`, versionName `0.1.0`, versionCode `1`.
4. **Export Project**, ardından erişilebilir bir hedefte `.apk` seç. **Export With Debug** açık kalsın. Gerekirse Godot'un debug keystore oluşturmasına izin ver.
5. Android'in bu kaynaktan kurulum iznini ver ve APK'yı kur. Bu geliştirme APK'sıdır; Google Play üretim yayını/AAB veya kalıcı release imzası içermez.

Android Editor sürümünün export arayüzü/izinleri cihazında kısıtlıysa teslim edilen APK ile oyna; proje editörde yine çalıştırılabilir. Android üzerinde Linux için derlenmiş Godot, Android SDK araçları veya bu projenin masaüstü build betiğini Termux'ta çalıştırmaya çalışma. Godot Android Editor, telefon için uygun yoldur.

## 5. Masaüstü veya ileride CI

Android SDK/JDK17 yolları **makineye ait Editor Settings** içinde ayarlanır; kişisel mutlak yollar repoya yazılmaz. Gerekli Godot 4.5 Android export bileşenleri için resmî belge: https://docs.godotengine.org/en/4.5/tutorials/export/exporting_for_android.html . Hazır şablonla bu projede NDK/Gradle derlemesi yapılmaz.

```bash
GODOT_BIN=/path/to/godot bash Survival/tools/check.sh
GODOT_BIN=/path/to/godot bash Survival/tools/build-android.sh
```

Mevcut `.github/workflows` dosyaları korunur; bu teslimat otomatik Actions işi eklemez. İleride Survival'a özel workflow eklemek ayrı bir depo değişikliği olacaktır.

## 6. Git ile devam et

Godot dosyaları doğrudan paylaşılan repo klasöründedir. Düzenleme sonrası:

```bash
cd "$HOME/storage/shared/Dev/DraBornGames"
git status --short
git add Survival
git commit -m "Survival: oyun değişiklikleri"
git push origin main
```

Push için kendi GitHub oturumunu/SSH veya GitHub token yetkini kullan. Şifre/token/keystore'u proje içine koyma. `.godot`, builds ve imza dosyaları Survival `.gitignore` ile dışarıda tutulur. Diğer projelere ait dosyaları `git add .` ile yanlışlıkla ekleme.

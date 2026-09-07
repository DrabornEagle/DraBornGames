# Termux ve eşitleme

Kurulum komutu README’deki `dkd-install.sh` başlatıcısını çalıştırır. Varsayılan kök `$HOME/projects`tir. Script isteğe bağlı ilk parametreyle başka bir projeler kökü kabul eder. `HOME` değiştirilmez.

## Betikler

| Komut | Davranış |
|---|---|
| `bash scripts/dkd-termux.sh` | Önce eşitleme, gerekirse npm ci, sonra Expo Go localhost sunucusu ve 30 saniyelik güncelleme kontrolü |
| `npm run sync` | Bir kez `origin/main` ile eşitleme |
| `npm run sync:watch` | Yalnızca periyodik kaynak eşitleme; Metro başlatmaz |
| `npm start` | Eşitleme olmadan etkileşimli Expo Go geliştirme sunucusu |
| `npm run start:lan` | Bilgisayar/ikinci telefon aynı ağdayken LAN sunucusu |
| `npm run start:clear` | Metro cache temizlenerek normal geliştirme sunucusu |

Eşitleme origin URL’sini, açık Git merge/rebase durumunu ve eşitleme kilidini kontrol eder. Uzak HEAD değişirse veya kaynakta yerel fark varsa dosyalar korunarak main’e geçilir. Yerel commit’ler uzak tarihin önünde/ayrışmışsa `dkd-preserved/<UTC>-<pid>-head` ve gerektiğinde `-main` dalları açılır. Değişmiş ve izlenmeyen dosyalar `git stash push --include-untracked` ile saklanır. Ignore edilen dosyaların üstüne yazılmaz; `git clean` ve force push kullanılmaz.

Eşitlik, Git’in izlediği kaynak dosyaları ve `main` commit’i içindir. `node_modules`, Metro cache, kişisel Expo Go kaydı ve yerel yedek dallarının uzak depoyla aynı olması amaçlanmaz. Kod güncellemesi oyun kaydını silmez. Sunucu bağlantısı kesilirse kaynaklar korunur; ağ geldiğinde kontrol yeniden denenir.

Başlatıcı bağımlılık kilidi + Node sürümü + platform/mimari hash’ini Git metadata alanında saklar. Değişiklikte `npm ci` yeniden çalışır. Kaynak güncellemesinde Metro yeniden başlar; Expo Go ekranı otomatik bağlanmazsa Reload veya adresi tekrar açma gerekir. Telefon üzerindeki çalışan Expo Go’yu uzaktan zorla yeniden başlatan bir servis yoktur.

## Yedekleri görme

Önce otomatik başlatıcıyı **Ctrl+C** ile kapat. Sonra:

```bash
cd "$HOME/projects/DraBornGames"
git stash list
git branch --list 'dkd-preserved/*'
```

İstenen stash’in içeriğine `git stash show -p 'stash@{0}'` ile bakılabilir. `git stash apply 'stash@{0}'` yedeği silmeden uygulamayı dener; çakışma varsa manuel çözüm gerekir. Yeni `dkd-local-work` dalı açıp üzerinde çalışmak yedekleri incelemeyi kolaylaştırır. Otomatik eşitlemeyi tekrar açınca main esas alınır; bu yüzden yerel geliştirme sırasında `npm start` kullan.

## Sık karşılaşılan durumlar

- **Expo Go projeyi açmıyor:** Metro’nun “Waiting” durumuna gelmesini bekle; aynı telefonda `exp://127.0.0.1:8081` kullan. İkinci telefondan `127.0.0.1` bu Termux sunucusunu göstermez; LAN komutunu kullan.
- **Port 8081 dolu:** Diğer Metro oturumunu kendi terminalinde Ctrl+C ile kapat. Başlatıcı rastgele başka işlemleri öldürmez.
- **SDK uyumsuzluğu:** Bu repo SDK 57 içindir. Expo Go uygulama sürümü ve desteklenen SDK aynı kavram değildir; hedef cihazda 57 desteğini doğrula. Paketleri tek tek rastgele yükseltme; package-lock sürümünü kullan.
- **Expo servislerine erişim kesildi:** Paketler kuruluysa `EXPO_OFFLINE=1 npm start` yerel Expo API kontrollerini devre dışı bırakır. Bu komut otomatik eşitleme çalıştırmaz.
- **npm paket indirme hatası:** İnterneti ve Termux paket kaynağını kontrol et; başlatıcıyı yeniden çalıştır. Bozuk `node_modules` için `npm ci` tekrar kurulabilir.
- **Siyah 3D sahne / WebGL2 bulunamadı:** Android System WebView’ı güncelle; Expo Go’yu tekrar aç. Cihaz WebGL2 desteklemiyorsa bu 3D renderer çalışmaz. Düşük grafik ayarı ve ısı testi yap.
- **Android Termux’u kapatıyor:** Termux/Expo Go için pil kısıtlamalarını azalt; Termux’ta mevcutsa wakelock seçeneğini kullan. Sürekli arka plan çalışma garantisi yoktur.
- **Commitsiz yerel repoda dosyalar var:** Dosyaların yerel commit’ini oluştur; eşitleme bunları bir yedek dalında koruyabilir. Betik yedeğini oluşturamadığı dosyaların üstüne yazmaz.
- **Kayıt yüklenemedi:** Expo Go’yu yeniden açıp Tekrar dene. Kayıt bozuksa otomatik boş kariyerle üzerine yazılmaz. Çalışırken Ayarlar → JSON yedek oluştur seçeneğini kullan.

GitHub yazma erişimi telefon kurulumu için gerekmez; mevcut repo herkese açıktır. GitHub’a yeni kod yükleme, geliştirme oturumunda yetkili GitHub bağlantısıyla yapılır. Telefon eşitlemesi yerel dosyaları otomatik publish etmez.

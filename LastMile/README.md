# DraBornGo / Last Mile — v0.7.1

Android versionCode **1** · Expo SDK **57** · Web + imzalı Release APK.

- Oyun platformu: https://www.draborneagle.com/DraBornGames/
- Web oyunu: https://www.draborneagle.com/DraBornGames/Last-Mile/
- APK: https://github.com/DrabornEagle/DraBornGames/releases

## Termux / Expo Go 57.0.9

```bash
cd ~/projects/DraBornGames/DraBornGo-LastMile
bash scripts/dkd-termux.sh
```

İlk kurulum için GitHub'daki `scripts/dkd-termux-v071-bootstrap.sh` dosyasını
indirip bash ile çalıştır. Başlatıcı gerekli paketleri kurar; GitHub main'i
30 saniyede bir kontrol edip Metro'yu günceller. Açılış: `exp://127.0.0.1:8081`.
Yerel değişiklikler eşitleme öncesinde git stash / koruma dalında saklanır.
Telefon kapalıyken veya Termux durdurulduğunda izleme çalışmaz.

## Tek kaynak, iki platform

Oyun içeriğini `game/` altında, ortak hesap/görev/kayıt davranışını `App.tsx`
içinde değiştir. `npm run build:web` Android paketini ve web çıktısını aynı
kaynaktan oluşturur. `web/dkd-browser-adapter.js` yalnız tarayıcı aygıt
API'lerini uyarlar. Üretilmiş HTML/TS dosyalarını elle düzenleme.

Android kaynak değişikliğinde GitHub Release APK otomatik derlenir.
DrabornEagle_Web deposundaki web sync workflow'u 5 dakikada bir kaynak/Release
kontrolü yapar; planlanan çalışma GitHub yoğunluğunda gecikebilir. Her build'in
commit ve hash değerleri web `version.json` dosyasına yazılır.

Google Play dağıtımı yok. APK aynı permanent keystore ile imzalanır; yeni
anahtar üretilmez. İmza SHA256:
`B3042B120C61C1DEEC8CC2619C5513C4F7B3378D81C6235E9285CCF6069609BC`.
Anahtar/parolalar public depoya, web'e veya Supabase'e yüklenmez.

Aynı hesap buluttaki kariyeri Android/web'de yükler. Cihaz değiştirirken
kaydın gönderilmesini bekleyip diğer cihazda yeniden giriş yap. Eşzamanlı
aktif oturumların kayıt birleştirmesi yoktur. APK güncellemeleri kullanıcı
tarafından indirilip aynı uygulamanın üzerine kurulur.

## Doğrulama

`npm run verify` · `npm run build:web`

Son kontrol: 183 test, TypeScript, Expo SDK bağımlılık uyumu ve GitHub native
Release derlemesi. Fiziksel Expo Go testi kullanıcının cihazında yapılır.
Detaylı checkpoint: `docs/DKD-PROGRESS-v071.md`.

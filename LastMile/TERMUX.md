# LastMile v0.7.4 — Termux ve Expo Go

## Tek komutla güncel kurulum ve çalıştırma

Bu akış APK üretmez. GitHub `main` üzerindeki ortak v0.7.4 kaynağını alır, Android/Expo oyun paketini yerelde üretir ve Expo Go ile başlatır. Mevcut yerel değişiklik varsa önce güvenli bir stash yedeğine alınır.

```bash
pkg update -y && \
pkg install -y git nodejs-lts util-linux openssh && \
mkdir -p "$HOME/projects" && \
cd "$HOME/projects" && \
if [ -d DraBornGames/.git ]; then \
  cd DraBornGames && \
  git remote set-url origin https://github.com/DrabornEagle/DraBornGames.git && \
  git status --porcelain | grep -q . && git stash push -u -m "dkd-auto-backup-$(date +%Y%m%d-%H%M%S)" || true && \
  git fetch origin --prune && \
  git switch main && \
  git reset --hard origin/main; \
else \
  git clone https://github.com/DrabornEagle/DraBornGames.git && \
  cd DraBornGames; \
fi && \
cd LastMile && \
chmod +x scripts/dkd-sync.sh scripts/dkd-termux.sh && \
npm ci && \
npm run build:game && \
bash scripts/dkd-termux.sh
```

Başlatıcı şunları otomatik yapar:

- GitHub `main` dalını kontrol eder ve LastMile kaynağını eşitler.
- Yerel değişiklik varsa kurulum komutu önce tarih damgalı stash yedeği oluşturur.
- Kilitli Expo SDK 57 paketlerini kurar.
- `InnerLight.mp3` ve `SeMeNota.mp3` dosyalarının doğrulamasını yapar.
- Web ve Android/Expo tarafından paylaşılan aynı v0.7.4 oyun paketini üretir.
- Expo Go 57.x üzerinde yerel geliştirme sunucusunu başlatır.
- APK/AAB üretmez ve Release workflow'unu tetiklemez.

## Sonraki çalıştırmalar

```bash
cd "$HOME/projects/DraBornGames/LastMile" && bash scripts/dkd-termux.sh
```

## Sadece bir kez eşitleme

```bash
cd "$HOME/projects/DraBornGames/LastMile" && bash scripts/dkd-sync.sh once
```

## Kontrol

```bash
cd "$HOME/projects/DraBornGames/LastMile" && npm run verify
```

## Durdurma

Termux oturumunda `Ctrl+C` kullanılır.

## Güncel sürüm

- LastMile: `v0.7.4`
- Android versionCode: `1`
- Expo SDK: `57` (`expo ~57.0.20`)
- Hedef: Expo Go `57.x`
- Menü müziği: `InnerLight.mp3`
- Vardiya müziği: `SeMeNota.mp3`
- Web + Android/Expo: aynı ortak oyun kaynağı
- APK: bu geliştirme akışında üretilmez

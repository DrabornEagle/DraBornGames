# LastMile v0.7.2 — Termux ve Expo Go

## Tek komutla kurulum ve çalıştırma

```bash
pkg update -y && \
pkg install -y git nodejs-lts util-linux openssh && \
mkdir -p "$HOME/projects" && \
cd "$HOME/projects" && \
if [ -d DraBornGames/.git ]; then \
  cd DraBornGames && \
  git remote set-url origin https://github.com/DrabornEagle/DraBornGames.git && \
  git fetch origin --prune && \
  git switch main && \
  git reset --hard origin/main; \
else \
  git clone https://github.com/DrabornEagle/DraBornGames.git && \
  cd DraBornGames; \
fi && \
cd LastMile && \
chmod +x scripts/dkd-sync.sh scripts/dkd-termux.sh && \
bash scripts/dkd-termux.sh
```

Başlatıcı şunları otomatik yapar:

- GitHub `main` dalını kontrol eder ve yerel repoyu güvenli biçimde eşitler.
- Yerel commit veya dosya varsa silmek yerine yedek dalı ve stash oluşturur.
- `npm ci` ile kilitli Expo SDK 57 paketlerini kurar.
- `InnerLight.mp3` ve `SeMeNota.mp3` dosyalarının boyut ve SHA-256 doğrulamasını yapar.
- Android ve web tarafından kullanılan ortak HTML oyun paketini üretir.
- Expo Go 57.0.9 için `exp://127.0.0.1:8081` adresini açar.
- GitHub `main` dalını her 30 saniyede kontrol eder; güncelleme gelirse Metro'yu yeniden başlatır.

## Sonraki çalıştırmalar

```bash
cd "$HOME/projects/DraBornGames/LastMile" && bash scripts/dkd-termux.sh
```

## Sadece bir kez eşitleme

```bash
cd "$HOME/projects/DraBornGames/LastMile" && bash scripts/dkd-sync.sh once
```

## Durdurma

Termux oturumunda `Ctrl+C` kullanılır.

## Sürüm

- LastMile: `v0.7.2`
- Android versionCode: `1`
- Expo SDK: `57`
- Test uygulaması: Expo Go `57.0.9`
- Menü müziği: `InnerLight.mp3`
- Vardiya müziği: `SeMeNota.mp3`
- APK/AAB: yalnızca GitHub Actions içinden elle başlatılır.

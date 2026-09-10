#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

dkd_projects="$HOME/projects"
dkd_repo="$dkd_projects/DraBornGames"
dkd_app="$dkd_repo/DraBornGo-LastMile"
dkd_signing_name="DraBornGo-LastMile-v0.7-Signing.zip"
dkd_private_dir="$HOME/.dkd-lastmile-signing-v07"

pkg update -y
pkg install -y git nodejs-lts util-linux gh unzip coreutils
mkdir -p "$dkd_projects"

if [[ ! -d "$dkd_repo/.git" ]]; then
  git clone https://github.com/DrabornEagle/DraBornGames.git "$dkd_repo"
fi

git -C "$dkd_repo" fetch origin main
git -C "$dkd_repo" show origin/main:DraBornGo-LastMile/scripts/dkd-sync.sh | DKD_REPO_DIR="$dkd_repo" bash -s -- once

dkd_signing_archive=""
for dkd_candidate in \
  "$HOME/storage/downloads/$dkd_signing_name" \
  "/sdcard/Download/$dkd_signing_name" \
  "$HOME/$dkd_signing_name" \
  "$PWD/$dkd_signing_name"
do
  if [[ -f "$dkd_candidate" ]]; then
    dkd_signing_archive="$dkd_candidate"
    break
  fi
done

if [[ -n "$dkd_signing_archive" ]]; then
  mkdir -p "$dkd_private_dir"
  chmod 700 "$dkd_private_dir"
  unzip -q -o "$dkd_signing_archive" -d "$dkd_private_dir"
  dkd_secret_script="$dkd_private_dir/DraBornGo-LastMile-v0.7-Signing/github-secrets-termux.sh"
  if [[ ! -f "$dkd_secret_script" ]]; then
    echo 'Signing ZIP bulundu ancak github-secrets-termux.sh bulunamadı.' >&2
    exit 31
  fi
  chmod 700 "$dkd_secret_script"
  bash "$dkd_secret_script"
else
  echo "Kalıcı GitHub signing secret kurulumu atlandı: $dkd_signing_name Downloads klasöründe bulunamadı."
  echo 'Expo Go/Metro kurulumu normal şekilde devam edecek.'
fi

cd "$dkd_app"
exec bash scripts/dkd-termux.sh

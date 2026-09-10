#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
pkg update -y
pkg install -y git nodejs-lts util-linux coreutils
dkd_repo="$HOME/projects/DraBornGames"
mkdir -p "$HOME/projects"
if [[ ! -d "$dkd_repo/.git" ]]; then
  git clone https://github.com/DrabornEagle/DraBornGames.git "$dkd_repo"
fi
git -C "$dkd_repo" fetch origin main
git -C "$dkd_repo" show origin/main:DraBornGo-LastMile/scripts/dkd-sync.sh | DKD_REPO_DIR="$dkd_repo" bash -s -- once
cd "$dkd_repo/DraBornGo-LastMile"
exec bash scripts/dkd-termux.sh

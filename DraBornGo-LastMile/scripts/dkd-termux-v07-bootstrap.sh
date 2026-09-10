#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

DKD_PROJECTS="$HOME/projects"
DKD_REPO="$DKD_PROJECTS/DraBornGames"
DKD_APP="$DKD_REPO/DraBornGo-LastMile"

pkg update -y
pkg install -y git nodejs-lts util-linux gh unzip coreutils
mkdir -p "$DKD_PROJECTS"

if [[ ! -d "$DKD_REPO/.git" ]]; then
  git clone https://github.com/DrabornEagle/DraBornGames.git "$DKD_REPO"
fi

bash "$DKD_APP/scripts/dkd-install.sh" "$DKD_PROJECTS"

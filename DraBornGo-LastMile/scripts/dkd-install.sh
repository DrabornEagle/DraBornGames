#!/usr/bin/env bash
set -euo pipefail
dkd_projects="${1:-$HOME/projects}"
dkd_repo="$dkd_projects/DraBornGames"
mkdir -p "$dkd_projects"
if [[ ! -d "$dkd_repo" ]]; then
  git clone https://github.com/DrabornEagle/DraBornGames.git "$dkd_repo"
fi
git -C "$dkd_repo" rev-parse --is-inside-work-tree >/dev/null
dkd_origin="$(git -C "$dkd_repo" config --get remote.origin.url)"
case "$dkd_origin" in
  https://github.com/DrabornEagle/DraBornGames|https://github.com/DrabornEagle/DraBornGames.git|git@github.com:DrabornEagle/DraBornGames.git) ;;
  *) echo 'Klasörde farklı bir repo var; dosyalar korunuyor.' >&2; exit 1 ;;
esac
git -C "$dkd_repo" fetch origin main
# Run the checked-in updater without replacing uncommitted local scripts first.
git -C "$dkd_repo" show origin/main:DraBornGo-LastMile/scripts/dkd-sync.sh | DKD_REPO_DIR="$dkd_repo" bash -s -- once
cd "$dkd_repo/DraBornGo-LastMile"
exec bash scripts/dkd-termux.sh

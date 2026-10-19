#!/data/data/com.termux/files/usr/bin/bash
# Run in Termux. No Python, remote executable installer or destructive reset.
set -euo pipefail
if ! command -v termux-setup-storage >/dev/null 2>&1; then
  printf '%s\n' 'Bu kurulum betiğini Android Termux içinde çalıştır.' >&2
  exit 1
fi
termux-setup-storage
pkg install -y git unzip
survival_repo_path="${1:-$HOME/storage/shared/Dev/DraBornGames}"
mkdir -p "$(dirname "$survival_repo_path")"
if [ -d "$survival_repo_path/.git" ]; then
  survival_origin="$(git -C "$survival_repo_path" remote get-url origin)"
  case "$survival_origin" in
    https://github.com/DrabornEagle/DraBornGames|https://github.com/DrabornEagle/DraBornGames.git|git@github.com:DrabornEagle/DraBornGames.git) ;;
    *) printf '%s\n' 'Hedef klasör farklı bir depoya ait. Birleştirme yapılmadı.' >&2; exit 1 ;;
  esac
  if [ -n "$(git -C "$survival_repo_path" status --porcelain)" ]; then
    printf '%s\n' 'Yerel değişiklikler var. Önce bunları commit et; dosyalarına dokunulmadı.' >&2
    exit 1
  fi
  git -C "$survival_repo_path" pull --ff-only origin main
elif [ -e "$survival_repo_path" ] && [ -n "$(ls -A "$survival_repo_path")" ]; then
  printf '%s\n' 'Hedef klasör boş değil. Farklı bir hedef yol seç.' >&2
  exit 1
else
  git -c core.filemode=false clone --branch main --single-branch https://github.com/DrabornEagle/DraBornGames.git "$survival_repo_path"
fi
git -C "$survival_repo_path" config core.filemode false
printf '\nGodot Android Editor içinde bu dosyayı İçe Aktar:\n%s\n' "$(realpath "$survival_repo_path/Survival/project.godot")"
printf '%s\n' 'Godot 4.5.2 + Mobile renderer önerilir. Eski cihazda Compatibility seç.'

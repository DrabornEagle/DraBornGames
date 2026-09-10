#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

dkd_home="${HOME}"
dkd_repo_parent="${dkd_home}/projects/DraBornGames"
dkd_repo_root="${dkd_repo_parent}"
dkd_game_dir="${dkd_repo_root}/DraBornGo-LastMile"
dkd_remote="https://github.com/DrabornEagle/DraBornGames.git"

pkg update -y
pkg install -y git gh nodejs-lts util-linux coreutils

mkdir -p "${dkd_home}/projects"
if [[ ! -d "${dkd_repo_root}/.git" ]]; then
  if [[ -e "${dkd_repo_root}" && -n "$(find "${dkd_repo_root}" -mindepth 1 -maxdepth 1 -print -quit 2>/dev/null)" ]]; then
    echo "${dkd_repo_root} var ama Git deposu değil; güvenlik için üzerine yazılmadı." >&2
    exit 2
  fi
  rm -rf "${dkd_repo_root}"
  git clone "${dkd_remote}" "${dkd_repo_root}"
fi

cd "${dkd_game_dir}"
bash scripts/dkd-sync.sh once
npm ci --no-audit --no-fund
npm run build:game
npm test
npm run typecheck
EXPO_OFFLINE=1 npx expo install --check

printf '\nDraBornGo / Last Mile v0.7 lokal kaynak hazır ve origin/main ile eşit.\n'
printf 'Expo Go 57 testi: npm run start:lan\n'
printf 'Sürekli GitHub kontrolü: npm run sync:watch\n'

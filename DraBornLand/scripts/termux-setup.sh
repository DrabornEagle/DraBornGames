#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

if ! command -v pkg >/dev/null 2>&1; then
  printf '%s\n' 'Bu betik Android Termux içindir. Masaüstünde npm ci && npm start kullan.'
  exit 1
fi
pkg update -y
pkg install -y nodejs-lts git
node -e "const [major,minor]=process.versions.node.split('.').map(Number);if(major<22||(major===22&&minor<13)||(major===24&&minor<3)||major===23||major===25){console.error('Expo SDK 58 için Node 22.13+, 24.3+ veya 26+ LTS kullan. pkg upgrade nodejs-lts çalıştır.');process.exit(1)}"
task_repo_dir="${DRABORN_REPO_DIR:-$HOME/DraBornGames}"
if [ ! -d "$task_repo_dir/.git" ]; then
  git clone https://github.com/DrabornEagle/DraBornGames.git "$task_repo_dir"
else
  git -C "$task_repo_dir" pull --ff-only
fi
cd "$task_repo_dir/DraBornLand"
npm ci
npm run build
printf '\n%s\n' 'Expo Go 58.0.2 aç. Aşağıdaki Metro adresini aynı Android cihazında Expo Go ile aç.'
exec npx expo start --go --localhost --clear

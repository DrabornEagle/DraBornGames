#!/usr/bin/env bash
set -euo pipefail

dkd_script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$dkd_script_dir/.."

for dkd_command in node npm git flock; do
  command -v "$dkd_command" >/dev/null || {
    echo "Eksik Termux aracı: $dkd_command" >&2
    echo 'Kurulum: pkg update -y && pkg install -y git nodejs-lts util-linux' >&2
    exit 1
  }
done

exec node scripts/dkd-termux-run.mjs

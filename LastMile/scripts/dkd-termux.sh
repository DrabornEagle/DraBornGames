#!/usr/bin/env bash
set -euo pipefail
dkd_script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$dkd_script_dir/.."
command -v node >/dev/null || { echo 'Önce pkg install nodejs-lts git util-linux çalıştır.' >&2; exit 1; }
exec node scripts/dkd-termux-run.mjs

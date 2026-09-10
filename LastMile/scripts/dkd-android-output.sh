#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

dkd_mode="${1:-apk}"
dkd_repo="DrabornEagle/DraBornGames"
dkd_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
dkd_version="$(node -p "require(process.argv[1]).expo.version" "$dkd_root/app.json")"
dkd_output_root="$dkd_root/dist-android-downloads"

command -v gh >/dev/null 2>&1 || { echo 'GitHub CLI eksik. Önce pkg install gh çalıştır.' >&2; exit 2; }
gh auth status >/dev/null 2>&1 || { echo 'GitHub CLI oturumu gerekli: gh auth login' >&2; exit 3; }

case "$dkd_mode" in
  development)
    dkd_workflow="dkd-lastmile-android-v07.yml"
    dkd_artifact="dkd-lastmile-v${dkd_version}-development-vc1"
    ;;
  apk|aab)
    dkd_workflow="dkd-lastmile-android-signed-release.yml"
    dkd_artifact="dkd-lastmile-v${dkd_version}-signed-${dkd_mode}-vc1"
    ;;
  *)
    echo 'Kullanım: bash scripts/dkd-android-output.sh [development|apk|aab]' >&2
    exit 4
    ;;
esac

dkd_previous="$(gh run list -R "$dkd_repo" --workflow "$dkd_workflow" --event workflow_dispatch --limit 1 --json databaseId --jq '.[0].databaseId // 0' 2>/dev/null || printf '0')"
if [[ "$dkd_mode" == development ]]; then
  gh workflow run "$dkd_workflow" -R "$dkd_repo" --ref main
else
  gh workflow run "$dkd_workflow" -R "$dkd_repo" --ref main -f "dkd_format=$dkd_mode"
fi

dkd_run_id=""
for dkd_try in $(seq 1 45); do
  dkd_run_id="$(gh run list -R "$dkd_repo" --workflow "$dkd_workflow" --event workflow_dispatch --limit 1 --json databaseId --jq '.[0].databaseId // 0')"
  if [[ "$dkd_run_id" != "0" && "$dkd_run_id" != "$dkd_previous" ]]; then break; fi
  sleep 2
done

[[ -n "$dkd_run_id" && "$dkd_run_id" != "0" && "$dkd_run_id" != "$dkd_previous" ]] || { echo 'Yeni Android build run kimliği bulunamadı.' >&2; exit 5; }
echo "GitHub Android build run: $dkd_run_id"
gh run watch "$dkd_run_id" -R "$dkd_repo" --exit-status

dkd_target="$dkd_output_root/$dkd_artifact"
rm -rf "$dkd_target"
mkdir -p "$dkd_target"
gh run download "$dkd_run_id" -R "$dkd_repo" -n "$dkd_artifact" -D "$dkd_target"
echo "Android çıktı indirildi: $dkd_target"

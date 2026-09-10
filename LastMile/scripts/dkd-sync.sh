#!/usr/bin/env bash
# GitHub is the source of truth. Local work is preserved before switching main.
set -euo pipefail

if [[ -n "${DKD_REPO_DIR:-}" ]]; then
  dkd_repo="$(git -C "$DKD_REPO_DIR" rev-parse --show-toplevel)"
else
  dkd_script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
  dkd_repo="$(git -C "$dkd_script_dir" rev-parse --show-toplevel)"
fi
dkd_git_dir="$(git -C "$dkd_repo" rev-parse --absolute-git-dir)"
dkd_mode="${1:-once}"
if [[ "$dkd_mode" != once && "$dkd_mode" != watch ]]; then
  echo 'Kullanım: bash scripts/dkd-sync.sh [once|watch]' >&2
  exit 2
fi

dkd_origin="$(git -C "$dkd_repo" config --get remote.origin.url)"
case "$dkd_origin" in
  https://github.com/DrabornEagle/DraBornGames|https://github.com/DrabornEagle/DraBornGames.git|git@github.com:DrabornEagle/DraBornGames.git) ;;
  *) echo 'Bu betik yalnızca DrabornEagle/DraBornGames deposunu eşitler. Origin farklı; dosyalara dokunulmadı.' >&2; exit 2 ;;
esac

# flock is provided by util-linux in Termux and released automatically on exit.
command -v flock >/dev/null || { echo 'Önce pkg install util-linux çalıştır.' >&2; exit 2; }
exec 9>"$dkd_git_dir/dkd-lastmile-sync.lock"
flock -n 9 || { echo 'Başka bir eşitleme çalışıyor.' >&2; exit 3; }
export GIT_TERMINAL_PROMPT=0

dkd_sync_once() {
  for dkd_operation in MERGE_HEAD rebase-merge rebase-apply CHERRY_PICK_HEAD REVERT_HEAD BISECT_LOG; do
    if [[ -e "$dkd_git_dir/$dkd_operation" ]]; then
      echo 'Devam eden Git işlemi var. Eşitleme dosyalara dokunmadan durdu.' >&2
      return 4
    fi
  done
  if ! git -C "$dkd_repo" -c http.connectTimeout=15 -c http.lowSpeedLimit=1024 -c http.lowSpeedTime=20 fetch --quiet origin main; then
    echo 'GitHub okunamadı. Mevcut yerel sürüm korunuyor.' >&2
    return 5
  fi
  local dkd_remote dkd_head dkd_branch dkd_stamp dkd_main dkd_dirty
  dkd_remote="$(git -C "$dkd_repo" rev-parse refs/remotes/origin/main)"
  dkd_head="$(git -C "$dkd_repo" rev-parse --verify HEAD 2>/dev/null || true)"
  dkd_branch="$(git -C "$dkd_repo" branch --show-current)"
  dkd_dirty="$(git -C "$dkd_repo" status --porcelain)"
  if [[ "$dkd_head" == "$dkd_remote" && "$dkd_branch" == main && -z "$dkd_dirty" ]]; then return 0; fi
  dkd_stamp="$(date -u +%Y%m%dT%H%M%SZ)-$$"
  # Preserve every branch tip that switch -C could replace, including detached HEAD.
  if [[ -n "$dkd_head" ]] && ! git -C "$dkd_repo" merge-base --is-ancestor "$dkd_head" "$dkd_remote"; then
    git -C "$dkd_repo" branch "dkd-preserved/$dkd_stamp-head" "$dkd_head" || return 6
    echo "Yerel commit yedeği: dkd-preserved/$dkd_stamp-head"
  fi
  if dkd_main="$(git -C "$dkd_repo" rev-parse --verify refs/heads/main 2>/dev/null)" && [[ "$dkd_main" != "$dkd_head" ]]; then
    if ! git -C "$dkd_repo" merge-base --is-ancestor "$dkd_main" "$dkd_remote"; then
      git -C "$dkd_repo" branch "dkd-preserved/$dkd_stamp-main" "$dkd_main" || return 6
      echo "Main yedeği: dkd-preserved/$dkd_stamp-main"
    fi
  fi
  if [[ -n "$dkd_dirty" ]]; then
    [[ -n "$dkd_head" ]] || { echo "Commitsiz yerel depoda dosyalar var. Önce yerel bir commit oluştur; dosyalar korunuyor." >&2; return 6; }
    git -C "$dkd_repo" -c user.name='DKD Local Backup' -c user.email='local-backup@invalid.example' stash push --include-untracked --message "dkd-before-sync-$dkd_stamp" || return 6
    [[ -z "$(git -C "$dkd_repo" status --porcelain)" ]] || { echo 'Yerel değişiklikler tamamen yedeklenemedi; güncelleme durdu.' >&2; return 6; }
    echo 'Dosya yedeği git stash list içinde saklandı.'
  fi
  # Refuse to overwrite ignored files. Never use git clean or force-push.
  git -C "$dkd_repo" switch --quiet --no-overwrite-ignore -C main origin/main || return 6
  git -C "$dkd_repo" branch --set-upstream-to=origin/main main >/dev/null || return 6
  [[ "$(git -C "$dkd_repo" rev-parse HEAD)" == "$dkd_remote" ]] || return 6
  echo "GitHub / lokal eşitlendi: ${dkd_remote:0:12}"
}

if [[ "$dkd_mode" == once ]]; then dkd_sync_once; exit $?; fi
trap 'exit 0' INT TERM
while true; do
  dkd_sync_once || true
  sleep 30 &
  wait "$!" || true
done

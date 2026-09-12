// DraBornGo / Last Mile v0.7.4 — keep every Final progress surface on the same count-based value.
const dkd_v074ProgressVaultPrevious = dkd_Game.prototype.dkd_view_vault;

// The gameplay/account hotfix temporarily reduced the right-side drive utility controls.
// Player feedback restores the original shared CSS sizing (41px controls / 19px icons).
document.getElementById('dkd-v074-gameplay-account-style')?.remove();

dkd_Game.prototype.dkd_view_vault = function dkd_v074ProgressVaultView() {
  let dkd_html = String(dkd_v074ProgressVaultPrevious.call(this) || '');
  const dkd_progressValue = typeof dkd_v074GameplayFinalProgress === 'function'
    ? dkd_v074GameplayFinalProgress(this.dkd_state)
    : 0;
  dkd_html = dkd_html.replace(/(<h3>[^<]* HEDEFİ<\/h3><b class="dkd-accent">)\d+(%<\/b>)/, `$1${dkd_progressValue}$2`);
  return dkd_html;
};

window.dkd_lastMileV074 = {
  ...(window.dkd_lastMileV074 || {}),
  dkd_vaultFinalProgressStable: true,
  dkd_driveToolsOriginalSize: true,
};

// DraBornGo / Last Mile v0.7.4 — gameplay/account stability hotfix.
// Shared source for Android/Expo + Web. Loaded last.

const dkd_v074GameplayPrevious = {
  dkd_render: dkd_Game.prototype.dkd_render,
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_receive: dkd_Game.prototype.dkd_receive,
  dkd_save: dkd_Game.prototype.dkd_save,
  dkd_view_home: dkd_Game.prototype.dkd_view_home,
  dkd_view_result: dkd_Game.prototype.dkd_view_result,
};
const dkd_v074GameplayLegacyPaymentNoticeKey = 'dkd_lastmile_payment_login_notice_v074';
const dkd_v074GameplayLegacySeasonNoticeKey = 'dkd_lastmile_reward_notice_session_v074';

function dkd_v074GameplayInstallStyles() {
  if (document.getElementById('dkd-v074-gameplay-account-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v074-gameplay-account-style';
  dkd_style.textContent = `
    .dkd-drive-tools{right:12px!important;gap:7px!important}
    .dkd-drive-tools .dkd-icon-btn{width:38px!important;height:38px!important;border-radius:12px!important}
    .dkd-drive-tools .dkd-icon-btn svg{width:17px!important;height:17px!important}
    @media(max-height:760px){.dkd-drive-tools .dkd-icon-btn{width:36px!important;height:36px!important}.dkd-drive-tools .dkd-icon-btn svg{width:16px!important;height:16px!important}}
  `;
  document.head.appendChild(dkd_style);
}
dkd_v074GameplayInstallStyles();

function dkd_v074GameplayFinalProgress(dkd_state) {
  const dkd_master = dkd_clamp(Number(dkd_state?.dkd_master || 0) / 100, 0, 1);
  const dkd_chapter = dkd_clamp(Number(dkd_state?.dkd_chapter || 0) / 6, 0, 1);
  const dkd_storm = dkd_clamp(Number(dkd_state?.dkd_storm || 0) / 10, 0, 1);
  // Company reputation remains a mandatory Final gate, but it is deliberately not part
  // of the percentage: an average rating can move down after a delivery and made the
  // visible career progress regress (25% -> 23%). Count-based career progress is monotonic.
  return Math.round((dkd_master + dkd_chapter + dkd_storm) / 3 * 100);
}

function dkd_v074GameplayReputation(dkd_state) {
  if (!Number(dkd_state?.dkd_deliveries || 0)) return 0;
  return Math.round(dkd_clamp(Number(dkd_state.dkd_ratingTotal || 0) / Number(dkd_state.dkd_deliveries) * 20, 0, 100));
}

dkd_Game.prototype.dkd_view_home = function dkd_v074GameplayHome() {
  const dkd_html = String(dkd_v074GameplayPrevious.dkd_view_home.call(this) || '');
  const dkd_progressValue = dkd_v074GameplayFinalProgress(this.dkd_state);
  return dkd_html.replace(/(<b class="dkd-goal-percent">)%\d+(<\/b>)/, `$1%${dkd_progressValue}$2`);
};

dkd_Game.prototype.dkd_view_result = function dkd_v074GameplayResult() {
  let dkd_html = String(dkd_v074GameplayPrevious.dkd_view_result.call(this) || '');
  const dkd_progressValue = dkd_v074GameplayFinalProgress(this.dkd_state);
  const dkd_reputationValue = dkd_v074GameplayReputation(this.dkd_state);
  dkd_html = dkd_html.replace(/(<b>Final Görevi ilerlemesi<\/b><b>)\d+(%<\/b>)/, `$1${dkd_progressValue}$2`);
  dkd_html = dkd_html.replace(
    /<small style="display:block;margin-top:10px">[^<]*Usta Teslimat · [^<]*özel müşteri bölümü<\/small>/,
    `<small style="display:block;margin-top:10px">${Math.floor(Number(this.dkd_state?.dkd_master || 0))}/100 Usta Teslimat · ${Math.floor(Number(this.dkd_state?.dkd_chapter || 0))}/6 özel müşteri bölümü · ${Math.floor(Number(this.dkd_state?.dkd_storm || 0))}/10 fırtına · İtibar ${dkd_reputationValue}/90</small>`,
  );
  return dkd_html;
};

// Tighten the existing visible-obstacle collision footprint. The generated obstacle
// geometry remains the authority; route arrows, road decoration and empty asphalt can
// never create cargo damage through this contact test.
if (typeof dkd_v05DriveFixObstacleContact === 'function') {
  dkd_v05DriveFixObstacleContact = function dkd_v074GameplayObstacleContact(dkd_run, dkd_obstacle) {
    if (!Array.isArray(dkd_run?.dkd_position) || !Array.isArray(dkd_obstacle?.dkd_position)) return false;
    const dkd_extents = dkd_v05DriveFixObstacleHalfExtents?.[dkd_obstacle.dkd_type] || [.70, .70];
    const dkd_obstacleHalfWidth = Math.max(.18, (Number(dkd_extents[0]) || .70) * .92);
    const dkd_obstacleHalfLength = Math.max(.18, (Number(dkd_extents[1]) || .70) * .82);
    const dkd_bikeHalfWidth = .27;
    const dkd_bikeHalfLength = .54;
    const dkd_deltaX = Number(dkd_run.dkd_position[0]) - Number(dkd_obstacle.dkd_position[0]);
    const dkd_deltaZ = Number(dkd_run.dkd_position[1]) - Number(dkd_obstacle.dkd_position[1]);
    if (!Number.isFinite(dkd_deltaX) || !Number.isFinite(dkd_deltaZ)) return false;
    const dkd_heading = Number(dkd_obstacle.dkd_heading) || 0;
    const dkd_cos = Math.cos(dkd_heading);
    const dkd_sin = Math.sin(dkd_heading);
    // Inverse of THREE.js Y rotation used by the visible obstacle group.
    const dkd_localX = dkd_deltaX * dkd_cos - dkd_deltaZ * dkd_sin;
    const dkd_localZ = dkd_deltaX * dkd_sin + dkd_deltaZ * dkd_cos;
    return Math.abs(dkd_localX) <= dkd_obstacleHalfWidth + dkd_bikeHalfWidth
      && Math.abs(dkd_localZ) <= dkd_obstacleHalfLength + dkd_bikeHalfLength;
  };
}

function dkd_v074GameplayNormalizeEmail(dkd_value) {
  return String(dkd_value || '').trim().toLocaleLowerCase('tr-TR').replace(/[^a-z0-9@._+-]+/g, '').slice(0,120);
}
function dkd_v074GameplayAccountToken(dkd_value) {
  return dkd_v074GameplayNormalizeEmail(dkd_value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0,90);
}
function dkd_v074GameplayEmail(dkd_game, dkd_fallback = '') {
  return dkd_v074GameplayNormalizeEmail(dkd_game?.dkd_v04AuthEmail || dkd_fallback);
}
function dkd_v074GameplayBackupKey(dkd_email) {
  const dkd_token = dkd_v074GameplayAccountToken(dkd_email);
  return dkd_token ? `dkd_lastmile_account_backup_v074_${dkd_token}` : '';
}
function dkd_v074GameplayNoticePendingKey(dkd_email) {
  const dkd_token = dkd_v074GameplayAccountToken(dkd_email);
  return dkd_token ? `dkd_lastmile_new_registration_notice_pending_v074_${dkd_token}` : '';
}
function dkd_v074GameplayNoticeSeenKey(dkd_email) {
  const dkd_token = dkd_v074GameplayAccountToken(dkd_email);
  return dkd_token ? `dkd_lastmile_new_registration_notice_seen_v074_${dkd_token}` : '';
}

function dkd_v074GameplayStoreBackup(dkd_game) {
  const dkd_email = dkd_v074GameplayEmail(dkd_game);
  const dkd_key = dkd_v074GameplayBackupKey(dkd_email);
  const dkd_state = dkd_game?.dkd_career;
  if (!dkd_key || !dkd_state || dkd_state.dkd_schema !== 1) return;
  try { localStorage.setItem(dkd_key, JSON.stringify(dkd_state)); } catch {}
}
function dkd_v074GameplayReadBackup(dkd_email) {
  const dkd_key = dkd_v074GameplayBackupKey(dkd_email);
  if (!dkd_key) return null;
  try {
    const dkd_value = JSON.parse(localStorage.getItem(dkd_key) || 'null');
    return dkd_value?.dkd_schema === 1 ? dkd_value : null;
  } catch { return null; }
}

// Preserve an account-local safety copy in addition to Supabase. Server progress stays
// authoritative when it exists; the local copy is used only if bootstrap has no save.
dkd_Game.prototype.dkd_save = function dkd_v074GameplaySave() {
  const dkd_result = dkd_v074GameplayPrevious.dkd_save.call(this);
  if (this.dkd_v04Authenticated) dkd_v074GameplayStoreBackup(this);
  return dkd_result;
};

function dkd_v074GameplayCloudObject(dkd_payload) {
  const dkd_response = dkd_payload?.dkd_data || {};
  return dkd_response?.dkd_data || dkd_response;
}

dkd_Game.prototype.dkd_receive = function dkd_v074GameplayReceive(dkd_payload) {
  if (dkd_payload?.dkd_type === 'auth-signup-result' && dkd_payload?.dkd_data?.dkd_authenticated === true) {
    const dkd_email = dkd_v074GameplayNormalizeEmail(dkd_payload.dkd_data.dkd_email);
    const dkd_pendingKey = dkd_v074GameplayNoticePendingKey(dkd_email);
    const dkd_seenKey = dkd_v074GameplayNoticeSeenKey(dkd_email);
    try {
      if (dkd_pendingKey) localStorage.setItem(dkd_pendingKey, '1');
      if (dkd_seenKey) localStorage.removeItem(dkd_seenKey);
    } catch {}
  }

  if (dkd_payload?.dkd_type === 'cloud-bootstrap') {
    const dkd_cloud = dkd_v074GameplayCloudObject(dkd_payload);
    const dkd_email = dkd_v074GameplayEmail(this, dkd_cloud?.dkd_profile?.dkd_email);
    if (!dkd_cloud?.dkd_progress || typeof dkd_cloud.dkd_progress !== 'object' || dkd_cloud.dkd_progress.dkd_schema !== 1) {
      const dkd_backup = dkd_v074GameplayReadBackup(dkd_email);
      if (dkd_backup) dkd_cloud.dkd_progress = dkd_backup;
    }
  }

  const dkd_result = dkd_v074GameplayPrevious.dkd_receive.call(this, dkd_payload);
  if (dkd_payload?.dkd_type === 'cloud-bootstrap' && this.dkd_v04Authenticated) dkd_v074GameplayStoreBackup(this);
  return dkd_result;
};

function dkd_v074GameplaySuppressLegacyNotice(dkd_game) {
  dkd_game.dkd_v074RewardNoticeShown = true;
  try {
    sessionStorage.setItem(dkd_v074GameplayLegacyPaymentNoticeKey, '1');
    sessionStorage.setItem(dkd_v074GameplayLegacySeasonNoticeKey, '1');
  } catch {}
}
function dkd_v074GameplayNoticeEligible(dkd_game) {
  if (!dkd_game || dkd_v074IsAdmin?.(dkd_game) === true || dkd_game.dkd_v04IsAdmin === true) return false;
  if (!dkd_game?.dkd_root?.querySelector?.('.dkd-v074-pay')) return false;
  const dkd_center = typeof dkd_v074Center === 'function' ? dkd_v074Center(dkd_game) : null;
  if (dkd_center?.dkd_payment?.dkd_status === 'pending' || dkd_center?.dkd_payment?.dkd_status === 'approved') return false;
  const dkd_email = dkd_v074GameplayEmail(dkd_game, dkd_center?.dkd_profile?.dkd_email);
  const dkd_pendingKey = dkd_v074GameplayNoticePendingKey(dkd_email);
  const dkd_seenKey = dkd_v074GameplayNoticeSeenKey(dkd_email);
  if (!dkd_pendingKey || !dkd_seenKey) return false;
  try { return localStorage.getItem(dkd_pendingKey) === '1' && localStorage.getItem(dkd_seenKey) !== '1'; } catch { return false; }
}
function dkd_v074GameplayShowNewRegistrationNotice(dkd_game) {
  if (!dkd_v074GameplayNoticeEligible(dkd_game) || document.getElementById('dkd-v074-reward-overlay')) return;
  const dkd_email = dkd_v074GameplayEmail(dkd_game);
  const dkd_pendingKey = dkd_v074GameplayNoticePendingKey(dkd_email);
  const dkd_seenKey = dkd_v074GameplayNoticeSeenKey(dkd_email);
  try {
    localStorage.setItem(dkd_seenKey, '1');
    localStorage.removeItem(dkd_pendingKey);
  } catch {}
  const dkd_overlay = document.createElement('div');
  dkd_overlay.id = 'dkd-v074-reward-overlay';
  dkd_overlay.className = 'dkd-v074-reward-overlay';
  dkd_overlay.setAttribute('role', 'dialog');
  dkd_overlay.setAttribute('aria-modal', 'true');
  dkd_overlay.setAttribute('aria-labelledby', 'dkd-v074-reward-title');
  dkd_overlay.innerHTML = `<div class="dkd-v074-reward-card"><span class="dkd-v074-reward-kicker">${dkd_icon('trophy',16)} SEZON BÜYÜK ÖDÜLÜ</span><h2 id="dkd-v074-reward-title">Ödülünü seçmeden önce bunu bil.</h2><p class="dkd-v074-reward-copy">Oyundaki Görevleri tamamladığında seçmiş olduğun ödüle hemen stoktan teslim şekilde, Ankara içi elden veya kargo yoluyla sahip olacaksın. Her Sezon Büyük Ödüller Değişiyor.</p><p class="dkd-v074-reward-hurry">⚡ <b>ACELE ET</b> · Sezon bitmeden sen oyunu bitir.</p><p class="dkd-v074-reward-foot">Sezon ödüllerini oyun içinde <b>Ödüller</b> kısmında görebilirsin.</p><button type="button" class="dkd-v074-reward-confirm">ANLADIM · DEVAM ET</button></div>`;
  dkd_overlay.querySelector('.dkd-v074-reward-confirm')?.addEventListener('click', () => dkd_overlay.remove(), { once: true });
  document.body.appendChild(dkd_overlay);
}
function dkd_v074GameplayNoticeSchedule(dkd_game) {
  queueMicrotask(() => dkd_v074GameplayShowNewRegistrationNotice(dkd_game));
  requestAnimationFrame(() => dkd_v074GameplayShowNewRegistrationNotice(dkd_game));
}

dkd_Game.prototype.dkd_render = function dkd_v074GameplayRender(dkd_page, dkd_arg = null) {
  dkd_v074GameplaySuppressLegacyNotice(this);
  if (this.dkd_v04IsAdmin === true || (typeof dkd_v074IsAdmin === 'function' && dkd_v074IsAdmin(this))) {
    document.getElementById('dkd-v074-reward-overlay')?.remove();
  }
  const dkd_result = dkd_v074GameplayPrevious.dkd_render.call(this, dkd_page, dkd_arg);
  dkd_v074GameplaySuppressLegacyNotice(this);
  if (dkd_v074GameplayNoticeEligible(this)) dkd_v074GameplayNoticeSchedule(this);
  return dkd_result;
};

// Save immediately before logout, keep the authenticated session alive briefly so the
// cloud-save request can reach Supabase, then perform the normal logout/reset flow.
dkd_Game.prototype.dkd_action = function dkd_v074GameplayAction(dkd_action) {
  const dkd_command = String(dkd_action || '').split(':')[0];
  if (dkd_command === 'v04-logout' && this.dkd_v074GameplayLogoutPending !== true) {
    this.dkd_v074GameplayLogoutPending = true;
    dkd_v074GameplayStoreBackup(this);
    try { this.dkd_save(); } catch {}
    if (this.dkd_v04Authenticated && this.dkd_v04CloudReady && this.dkd_career?.dkd_schema === 1) {
      try { this.dkd_send('cloud-save', { dkd_game_state: this.dkd_career }); } catch {}
    }
    this.dkd_toast?.('İlerleme kaydediliyor…');
    setTimeout(() => {
      this.dkd_v074GameplayLogoutPending = false;
      dkd_v074GameplayPrevious.dkd_action.call(this, dkd_action);
    }, 1250);
    return;
  }
  if (dkd_command === 'v04-logout') return;
  return dkd_v074GameplayPrevious.dkd_action.call(this, dkd_action);
};

window.dkd_lastMileV074 = {
  ...(window.dkd_lastMileV074 || {}),
  dkd_monotonicFinalProgress: true,
  dkd_reputationSeparateFinalGate: true,
  dkd_driveUtilityIconsReduced: true,
  dkd_obstacleCollisionTightened: true,
  dkd_accountProgressBackup: true,
  dkd_cloudSaveBeforeLogout: true,
  dkd_rewardNoticeNewRegistrationOnly: true,
  dkd_rewardNoticeNeverForAdmin: true,
  dkd_rewardNoticeOncePerAccount: true,
};

// DraBornGo / Last Mile v0.7.4 — per-login seasonal payment notice fix.
// One source for Web + Android/Expo. The ACELE ET message belongs to the
// authenticated seasonal-payment gate, not the prize-selection page.

const dkd_v074LoginNoticePreviousRender = dkd_Game.prototype.dkd_render;
const dkd_v074LoginNoticePreviousAction = dkd_Game.prototype.dkd_action;
const dkd_v074LoginNoticeSessionKey = 'dkd_lastmile_payment_login_notice_v074';

function dkd_v074LoginNoticeSeen() {
  try { return sessionStorage.getItem(dkd_v074LoginNoticeSessionKey) === '1'; } catch { return false; }
}

function dkd_v074LoginNoticeMarkSeen() {
  try { sessionStorage.setItem(dkd_v074LoginNoticeSessionKey, '1'); } catch {}
}

function dkd_v074LoginNoticeReset() {
  try { sessionStorage.removeItem(dkd_v074LoginNoticeSessionKey); } catch {}
  document.getElementById('dkd-v074-reward-overlay')?.remove();
}

function dkd_v074LoginNoticePaymentVisible(dkd_game) {
  return Boolean(dkd_game?.dkd_root?.querySelector?.('.dkd-v074-pay'));
}

function dkd_v074LoginNoticeShow(dkd_game) {
  if (!dkd_game || !dkd_v074LoginNoticePaymentVisible(dkd_game) || dkd_v074LoginNoticeSeen()) return;
  if (document.getElementById('dkd-v074-reward-overlay')) return;
  dkd_v074LoginNoticeMarkSeen();

  const dkd_overlay = document.createElement('div');
  dkd_overlay.id = 'dkd-v074-reward-overlay';
  dkd_overlay.className = 'dkd-v074-reward-overlay';
  dkd_overlay.setAttribute('role', 'dialog');
  dkd_overlay.setAttribute('aria-modal', 'true');
  dkd_overlay.setAttribute('aria-labelledby', 'dkd-v074-reward-title');
  dkd_overlay.innerHTML = `<div class="dkd-v074-reward-card"><span class="dkd-v074-reward-kicker">${dkd_icon('trophy',16)} SEZON BÜYÜK ÖDÜLÜ</span><h2 id="dkd-v074-reward-title">Sezon devam ediyor.</h2><p class="dkd-v074-reward-copy">Oyundaki Görevleri tamamladığında seçmiş olduğun ödüle hemen stoktan teslim şekilde, Ankara içi elden veya kargo yoluyla sahip olacaksın. Her Sezon Büyük Ödüller Değişiyor.</p><p class="dkd-v074-reward-hurry">⚡ <b>ACELE ET</b> · Sezon bitmeden sen oyunu bitir.</p><p class="dkd-v074-reward-foot">Sezon ödüllerini oyun içinde <b>Ödüller</b> kısmında görebilirsin.</p><button type="button" class="dkd-v074-reward-confirm">ANLADIM · DEVAM ET</button></div>`;
  dkd_overlay.querySelector('.dkd-v074-reward-confirm')?.addEventListener('click', () => dkd_overlay.remove(), { once: true });
  document.body.appendChild(dkd_overlay);
}

function dkd_v074LoginNoticeSchedule(dkd_game) {
  queueMicrotask(() => dkd_v074LoginNoticeShow(dkd_game));
  requestAnimationFrame(() => dkd_v074LoginNoticeShow(dkd_game));
}

dkd_Game.prototype.dkd_render = function dkd_v074LoginNoticeRender(dkd_page, dkd_arg = null) {
  const dkd_requestedPage = String(dkd_page || '');

  // Disable the obsolete prize-page/localStorage popup. The current rule is:
  // show once per authenticated login only when the seasonal-payment gate is visible.
  if (dkd_requestedPage === 'choose') this.dkd_v074RewardNoticeShown = true;

  // The older seasonal layer also has a session flag. Marking it here prevents two
  // overlays on a direct v074payment render; this file owns the final login policy.
  if (dkd_requestedPage === 'v074payment') {
    try { sessionStorage.setItem('dkd_lastmile_reward_notice_session_v074', '1'); } catch {}
  }

  const dkd_result = dkd_v074LoginNoticePreviousRender.call(this, dkd_page, dkd_arg);
  if (dkd_v074LoginNoticePaymentVisible(this)) dkd_v074LoginNoticeSchedule(this);
  return dkd_result;
};

dkd_Game.prototype.dkd_action = function dkd_v074LoginNoticeAction(dkd_action) {
  const dkd_command = String(dkd_action || '').split(':')[0];
  if (dkd_command === 'v04-logout') dkd_v074LoginNoticeReset();
  return dkd_v074LoginNoticePreviousAction.call(this, dkd_action);
};

// Restored Web/Expo sessions can receive payment-center data after first paint.
// Reuse the existing root observer by wrapping its payment-sync callback when present.
if (typeof dkd_v074RefreshSyncPayment === 'function') {
  const dkd_v074LoginNoticePreviousPaymentSync = dkd_v074RefreshSyncPayment;
  dkd_v074RefreshSyncPayment = function dkd_v074LoginNoticePaymentSync(dkd_game) {
    const dkd_result = dkd_v074LoginNoticePreviousPaymentSync(dkd_game);
    if (dkd_v074LoginNoticePaymentVisible(dkd_game)) dkd_v074LoginNoticeSchedule(dkd_game);
    return dkd_result;
  };
}

window.dkd_lastMileV074 = {
  ...(window.dkd_lastMileV074 || {}),
  dkd_rewardNoticeOnPaymentPerLogin: true,
  dkd_rewardNoticeResetOnLogout: true,
  dkd_rewardNoticeNotOnChoose: true,
  dkd_rewardNoticeRefreshSafe: true,
};

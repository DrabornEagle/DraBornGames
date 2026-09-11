// DraBornGo / LastMile v0.7.4 final shared hotfix — Android/Expo + Web.
// Keeps payment handling isolated from the shift-start flow and normalizes visible release labels.
const dkd_v074FinalPreviousSettings = dkd_Game.prototype.dkd_view_settings;
const dkd_v074FinalPreviousRender = dkd_Game.prototype.dkd_render;
const dkd_v074FinalPreviousReceive = dkd_Game.prototype.dkd_receive;
const dkd_v074FinalPreviousAction = dkd_Game.prototype.dkd_action;
const dkd_v074FinalPreviousChoose = dkd_Game.prototype.dkd_view_choose;
const dkd_v074FinalPreviousAdminHtml = typeof dkd_v074AdminHtml === 'function' ? dkd_v074AdminHtml : null;
const dkd_v074FinalVersion = 'v0.7.4';

function dkd_v074FinalInstallStyles() {
  if (document.getElementById('dkd-v074-final-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v074-final-style';
  dkd_style.textContent = `
    .dkd-v074-public-note{position:relative!important;overflow:hidden!important;margin:14px 0 0!important;padding:18px 16px 18px 64px!important;border:2px solid #63ded3!important;border-left:8px solid #ffcf70!important;border-radius:17px!important;background:#193a50!important;color:#f1ffff!important;font-size:15px!important;font-weight:780!important;line-height:1.6!important;animation:dkd-v074-final-note 2.7s ease-in-out infinite!important}
    .dkd-v074-public-note:before{content:'NOT';position:absolute;left:13px;top:50%;transform:translateY(-50%);display:grid;place-items:center;width:38px;height:38px;border-radius:12px;background:#e98bb9;color:#172238;font-size:10px;font-weight:950;letter-spacing:.7px;animation:dkd-v074-final-note-badge 2.7s ease-in-out infinite}
    .dkd-v074-public-note:after{content:'';position:absolute;left:0;bottom:0;width:100%;height:4px;background:#76a8ff;transform-origin:left center;animation:dkd-v074-final-note-line 2.7s ease-in-out infinite}
    [data-dkd-action='v074-payment-submit'][aria-busy='true']{opacity:.72!important;transform:none!important;animation:none!important;pointer-events:none!important}
    .dkd-v074-receipt-open{display:block;width:100%;margin:12px 0;padding:0;border:2px solid #65ded4;border-radius:18px;background:#0d1c2c;color:#e9fbff;overflow:hidden;cursor:pointer;text-align:left;animation:dkd-v074-receipt-pulse 2.4s ease-in-out infinite}
    .dkd-v074-receipt-open img{display:block!important;width:100%!important;max-height:300px!important;margin:0!important;border:0!important;border-radius:0!important;object-fit:contain!important;background:#081524!important}
    .dkd-v074-receipt-open span{display:flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:8px 12px;font-size:13px;font-weight:950;letter-spacing:.35px;color:#cafff8;background:#15374a}
    .dkd-v074-receipt-overlay{position:fixed;inset:0;z-index:999999;display:flex;flex-direction:column;background:#050c17;color:#fff;animation:dkd-v074-overlay-in .2s ease-out both}
    .dkd-v074-receipt-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:64px;padding:calc(10px + env(safe-area-inset-top)) 16px 10px;border-bottom:1px solid #38556f;background:#10243a}
    .dkd-v074-receipt-bar strong{font-size:17px}.dkd-v074-receipt-close{display:grid;place-items:center;width:44px;height:44px;border:1px solid #7891af;border-radius:14px;background:#203754;color:#fff;font-size:29px;line-height:1;cursor:pointer}
    .dkd-v074-receipt-stage{flex:1;min-height:0;display:grid;place-items:center;padding:14px 10px calc(14px + env(safe-area-inset-bottom));overflow:auto;background:#050c17}
    .dkd-v074-receipt-stage img{display:block;max-width:100%;max-height:calc(100dvh - 100px);width:auto;height:auto;object-fit:contain;border:0;border-radius:0;background:#050c17}
    .dkd-v074-reward-overlay{position:fixed;inset:0;z-index:999998;display:grid;place-items:center;padding:calc(22px + env(safe-area-inset-top)) 18px calc(22px + env(safe-area-inset-bottom));overflow:auto;background:rgba(5,12,23,.94);animation:dkd-v074-overlay-in .24s ease-out both}
    .dkd-v074-reward-card{position:relative;width:min(100%,560px);overflow:hidden;border:2px solid #6ee4d6;border-top:8px solid #ffcf70;border-radius:26px;background:#132941;color:#f7fbff;padding:22px 19px 19px;animation:dkd-v074-reward-card-in .38s cubic-bezier(.2,.8,.2,1) both}
    .dkd-v074-reward-kicker{display:inline-flex;align-items:center;gap:8px;padding:8px 11px;border-radius:999px;background:#244864;color:#bffff5;font-size:11px;font-weight:950;letter-spacing:1.15px}
    .dkd-v074-reward-card h2{margin:14px 0 12px;font-size:29px!important;line-height:1.08;color:#fff}
    .dkd-v074-reward-copy{margin:0;padding:17px;border:1px solid #547294;border-left:7px solid #72e6d0;border-radius:18px;background:#10253a;color:#f4f8ff;font-size:18px!important;font-weight:780;line-height:1.55}
    .dkd-v074-reward-hurry{margin:14px 0;padding:15px 16px;border:2px solid #ffcf70;border-left:9px solid #ef88ba;border-radius:18px;background:#3a2c2f;color:#fff3c2;font-size:19px!important;font-weight:950;line-height:1.4;animation:dkd-v074-reward-hurry 1.55s ease-in-out infinite}
    .dkd-v074-reward-foot{margin:0 0 16px;padding:13px 14px;border-radius:15px;background:#23395c;color:#dce9ff;font-size:15px!important;font-weight:760;line-height:1.5}
    .dkd-v074-reward-confirm{width:100%;min-height:58px;border:0;border-radius:17px;background:#dfff4f;color:#142238;font-size:16px;font-weight:950;letter-spacing:.25px;cursor:pointer}
    @keyframes dkd-v074-final-note{0%,100%{border-color:#63ded3;transform:translateY(0)}50%{border-color:#9d8cff;transform:translateY(-2px)}}
    @keyframes dkd-v074-final-note-badge{0%,100%{background:#e98bb9}50%{background:#ffcf70}}
    @keyframes dkd-v074-final-note-line{0%{transform:scaleX(.18)}50%{transform:scaleX(1)}100%{transform:scaleX(.18)}}
    @keyframes dkd-v074-receipt-pulse{0%,100%{border-color:#65ded4;transform:translateY(0)}50%{border-color:#90a7ff;transform:translateY(-2px)}}
    @keyframes dkd-v074-overlay-in{from{opacity:0}to{opacity:1}}
    @keyframes dkd-v074-reward-card-in{from{opacity:0;transform:translateY(20px) scale(.98)}to{opacity:1;transform:none}}
    @keyframes dkd-v074-reward-hurry{0%,100%{border-color:#ffcf70;transform:scale(1)}50%{border-color:#ef88ba;transform:scale(1.012)}}
    html[data-dkd-motion='off'] .dkd-v074-public-note,html[data-dkd-motion='off'] .dkd-v074-public-note:before,html[data-dkd-motion='off'] .dkd-v074-public-note:after,html[data-dkd-motion='off'] .dkd-v074-receipt-open,html[data-dkd-motion='off'] .dkd-v074-receipt-overlay,html[data-dkd-motion='off'] .dkd-v074-reward-overlay,html[data-dkd-motion='off'] .dkd-v074-reward-card,html[data-dkd-motion='off'] .dkd-v074-reward-hurry{animation:none!important;transform:none!important}
    @media(prefers-reduced-motion:reduce){.dkd-v074-public-note,.dkd-v074-public-note:before,.dkd-v074-public-note:after,.dkd-v074-receipt-open,.dkd-v074-receipt-overlay,.dkd-v074-reward-overlay,.dkd-v074-reward-card,.dkd-v074-reward-hurry{animation:none!important;transform:none!important}}
    @media(max-width:370px){.dkd-v074-reward-card{padding:18px 15px 15px}.dkd-v074-reward-card h2{font-size:25px!important}.dkd-v074-reward-copy{font-size:16px!important}.dkd-v074-reward-hurry{font-size:17px!important}}
  `;
  document.head.appendChild(dkd_style);
}
dkd_v074FinalInstallStyles();

function dkd_v074FinalNormalizeVersions(dkd_root) {
  if (!dkd_root) return;
  for (const dkd_chip of dkd_root.querySelectorAll?.('.dkd-version') || []) dkd_chip.textContent = dkd_v074FinalVersion;
  const dkd_walker = document.createTreeWalker(dkd_root, NodeFilter.SHOW_TEXT);
  const dkd_nodes = [];
  while (dkd_walker.nextNode()) dkd_nodes.push(dkd_walker.currentNode);
  for (const dkd_node of dkd_nodes) {
    const dkd_value = String(dkd_node.nodeValue || '');
    const dkd_next = dkd_value.replace(/v0\.7(?:\.\d+)*/gi, dkd_v074FinalVersion);
    if (dkd_next !== dkd_value) dkd_node.nodeValue = dkd_next;
  }
}

function dkd_v074FinalPaymentBusy(dkd_game, dkd_busy) {
  const dkd_submit = dkd_game?.dkd_root?.querySelector?.('[data-dkd-action="v074-payment-submit"]');
  if (!dkd_submit) return;
  dkd_submit.toggleAttribute('disabled', Boolean(dkd_busy));
  if (dkd_busy) dkd_submit.setAttribute('aria-busy', 'true');
  else dkd_submit.removeAttribute('aria-busy');
}

function dkd_v074FinalPendingLocal(dkd_game) {
  const dkd_center = dkd_v074Center(dkd_game);
  const dkd_option = (dkd_center?.dkd_options || []).find(dkd_item => dkd_item.dkd_season_id === dkd_center?.dkd_current_season_id);
  if (!dkd_center || !dkd_option) return;
  dkd_center.dkd_payment = {
    dkd_status: 'pending',
    dkd_season_id: dkd_center.dkd_current_season_id,
    dkd_option_id: dkd_option.dkd_id,
    dkd_amount: Number(dkd_option.dkd_amount || 0),
    dkd_currency: dkd_option.dkd_currency || 'TRY',
    dkd_submitted_at: new Date().toISOString(),
  };
}

function dkd_v074FinalCloseReceipt() {
  document.getElementById('dkd-v074-receipt-overlay')?.remove();
}

function dkd_v074FinalOpenReceipt(dkd_url) {
  const dkd_src = String(dkd_url || '').trim();
  if (!dkd_src) return;
  dkd_v074FinalCloseReceipt();
  const dkd_overlay = document.createElement('div');
  dkd_overlay.id = 'dkd-v074-receipt-overlay';
  dkd_overlay.className = 'dkd-v074-receipt-overlay';
  dkd_overlay.setAttribute('role', 'dialog');
  dkd_overlay.setAttribute('aria-modal', 'true');
  dkd_overlay.setAttribute('aria-label', 'Ödeme dekontu tam ekran');
  const dkd_bar = document.createElement('div');
  dkd_bar.className = 'dkd-v074-receipt-bar';
  const dkd_title = document.createElement('strong');
  dkd_title.textContent = 'Ödeme dekontu';
  const dkd_close = document.createElement('button');
  dkd_close.type = 'button';
  dkd_close.className = 'dkd-v074-receipt-close';
  dkd_close.setAttribute('aria-label', 'Tam ekran dekontu kapat');
  dkd_close.textContent = '×';
  const dkd_stage = document.createElement('div');
  dkd_stage.className = 'dkd-v074-receipt-stage';
  const dkd_image = document.createElement('img');
  dkd_image.alt = 'Ödeme dekontu tam ekran';
  dkd_image.src = dkd_src;
  dkd_stage.appendChild(dkd_image);
  dkd_bar.append(dkd_title, dkd_close);
  dkd_overlay.append(dkd_bar, dkd_stage);
  dkd_close.addEventListener('click', dkd_v074FinalCloseReceipt, { once: true });
  dkd_overlay.addEventListener('click', dkd_event => { if (dkd_event.target === dkd_overlay) dkd_v074FinalCloseReceipt(); });
  document.body.appendChild(dkd_overlay);
}

function dkd_v074FinalRewardKey(dkd_game) {
  const dkd_profile = dkd_game?.dkd_state?.dkd_profile || {};
  const dkd_identity = String(dkd_profile.dkd_username || dkd_profile.dkd_email || 'local').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9_-]+/gi, '-').slice(0,80);
  return `dkd_lastmile_reward_notice_v074_${dkd_identity || 'local'}`;
}

function dkd_v074FinalCloseReward(dkd_game) {
  document.getElementById('dkd-v074-reward-overlay')?.remove();
  dkd_game.dkd_v074RewardNoticeShown = true;
  try { localStorage.setItem(dkd_v074FinalRewardKey(dkd_game), '1'); } catch {}
}

function dkd_v074FinalShowReward(dkd_game) {
  if (!dkd_game || dkd_game.dkd_v074RewardNoticeShown === true || document.getElementById('dkd-v074-reward-overlay')) return;
  try { if (localStorage.getItem(dkd_v074FinalRewardKey(dkd_game)) === '1') { dkd_game.dkd_v074RewardNoticeShown = true; return; } } catch {}
  dkd_game.dkd_v074RewardNoticeShown = true;
  const dkd_overlay = document.createElement('div');
  dkd_overlay.id = 'dkd-v074-reward-overlay';
  dkd_overlay.className = 'dkd-v074-reward-overlay';
  dkd_overlay.setAttribute('role', 'dialog');
  dkd_overlay.setAttribute('aria-modal', 'true');
  dkd_overlay.setAttribute('aria-labelledby', 'dkd-v074-reward-title');
  dkd_overlay.innerHTML = `<div class="dkd-v074-reward-card"><span class="dkd-v074-reward-kicker">${dkd_icon('trophy',16)} SEZON BÜYÜK ÖDÜLÜ</span><h2 id="dkd-v074-reward-title">Ödülünü seçmeden önce bunu bil.</h2><p class="dkd-v074-reward-copy">Oyundaki Görevleri tamamladığında Seçmiş olduğun ödüle hemen stoktan teslim şekilde, Ankara içi Elden veya Kargo yoluyla sahip olacaksın. Her Sezon Büyük Ödüller Değişiyor.</p><p class="dkd-v074-reward-hurry">⚡ <b>ACELE ET</b> · Sezon bitmeden sen oyunu bitir.</p><p class="dkd-v074-reward-foot">Sezon ödüllerini oyun içinde <b>Ödüller</b> kısmında görebilirsin.</p><button type="button" class="dkd-v074-reward-confirm">ANLADIM · ÖDÜLÜMÜ SEÇ</button></div>`;
  dkd_overlay.querySelector('.dkd-v074-reward-confirm')?.addEventListener('click', () => dkd_v074FinalCloseReward(dkd_game), { once: true });
  document.body.appendChild(dkd_overlay);
}

if (dkd_v074FinalPreviousAdminHtml) {
  dkd_v074AdminHtml = function dkd_v074FinalAdminHtml(dkd_game) {
    let dkd_receiptIndex = 0;
    return String(dkd_v074FinalPreviousAdminHtml(dkd_game) || '').replace(/<img src="([^"]+)" alt="Ödeme dekontu"\/>/g, (dkd_match, dkd_src) => {
      const dkd_index = dkd_receiptIndex++;
      return `<button type="button" class="dkd-v074-receipt-open" data-dkd-action="v074-receipt-open:${dkd_index}" aria-label="Dekontu tam ekran aç"><img src="${dkd_src}" alt="Ödeme dekontu"/><span>${dkd_icon('eye',17)} DEKONTU TAM EKRAN AÇ</span></button>`;
    });
  };
}

dkd_Game.prototype.dkd_view_settings = function dkd_v074FinalSettingsView() {
  let dkd_html = String(dkd_v074FinalPreviousSettings.call(this) || '');
  if (typeof dkd_v074AdminSection === 'function') {
    const dkd_adminSection = dkd_v074AdminSection();
    dkd_html = dkd_html.replace(dkd_adminSection, '');
    if (dkd_v074IsAdmin(this)) {
      const dkd_testMarker = '<section class="dkd-v07-section" data-dkd-tone="orange">';
      if (dkd_html.includes(dkd_testMarker)) dkd_html = dkd_html.replace(dkd_testMarker, `${dkd_adminSection}${dkd_testMarker}`);
      else dkd_html += dkd_adminSection;
    }
  }
  return dkd_html;
};

dkd_Game.prototype.dkd_view_choose = function dkd_v074FinalChooseView() {
  return dkd_v074FinalPreviousChoose.call(this);
};

dkd_Game.prototype.dkd_render = function dkd_v074FinalRender(dkd_page, dkd_arg = null) {
  const dkd_result = dkd_v074FinalPreviousRender.call(this, dkd_page, dkd_arg);
  dkd_v074FinalNormalizeVersions(this.dkd_root);
  if (String(dkd_page || '') === 'choose') queueMicrotask(() => dkd_v074FinalShowReward(this));
  return dkd_result;
};

dkd_Game.prototype.dkd_receive = function dkd_v074FinalReceive(dkd_payload) {
  const dkd_type = String(dkd_payload?.dkd_type || '');
  const dkd_jobId = String(dkd_payload?.dkd_data?.dkd_job_id || '');
  if (dkd_type === 'cloud-job-complete' && dkd_jobId === dkd_v074BridgeId && this.dkd_v074PaymentSubmitting === true) {
    this.dkd_v074PaymentSubmitting = false;
    this.dkd_v05PendingStart = false;
    dkd_v074FinalPaymentBusy(this, false);
    dkd_v074FinalPendingLocal(this);
    this.dkd_render('v074payment');
    this.dkd_toast('Dekont gönderildi · ödemeniz inceleniyor.');
    this.dkd_send('cloud-bootstrap', {});
    return;
  }
  if (dkd_type === 'cloud-error' && this.dkd_v074PaymentSubmitting === true) {
    this.dkd_v074PaymentSubmitting = false;
    this.dkd_v05PendingStart = false;
    dkd_v074FinalPaymentBusy(this, false);
    const dkd_message = String(dkd_payload?.dkd_data || 'Dekont sunucuya gönderilemedi.');
    if (/payment_already_submitted/i.test(dkd_message)) {
      this.dkd_toast('Ödeme kaydın bulundu · durumu yeniliyorum.');
      this.dkd_send('cloud-bootstrap', {});
      this.dkd_render('v074payment');
      return;
    }
    this.dkd_modal('Dekont gönderilemedi', `Ödeme kaydı oluşturulamadı. ${dkd_message}`, `${dkd_button('TEKRAR DENE','v074-payment','refresh')}${dkd_button('KAPAT','modal-close','close','dkd-secondary')}`);
    return;
  }
  return dkd_v074FinalPreviousReceive.call(this, dkd_payload);
};

dkd_Game.prototype.dkd_action = function dkd_v074FinalAction(dkd_action) {
  const dkd_parts = String(dkd_action || '').split(':');
  const dkd_command = dkd_parts[0];
  if (dkd_command === 'v074-receipt-open') {
    const dkd_index = Math.max(0, Number.parseInt(dkd_parts[1] || '0', 10) || 0);
    const dkd_payment = this.dkd_v074AdminPanel?.dkd_payments?.[dkd_index];
    const dkd_url = String(dkd_payment?.dkd_receipt_url || '');
    if (!dkd_url) return this.dkd_toast('Dekont görseli bulunamadı.');
    dkd_v074FinalOpenReceipt(dkd_url);
    return;
  }
  if (dkd_command === 'v074-payment') {
    this.dkd_v05PendingStart = false;
    return dkd_v074FinalPreviousAction.call(this, dkd_action);
  }
  if (dkd_command === 'v074-payment-submit') {
    if (this.dkd_v074PaymentSubmitting === true) return;
    this.dkd_v05PendingStart = false;
    const dkd_file = document.getElementById('dkd-v074-receipt')?.files?.[0];
    const dkd_note = String(document.getElementById('dkd-v074-note')?.value || '').slice(0,1000);
    const dkd_center = dkd_v074Center(this);
    const dkd_option = (dkd_center?.dkd_options || []).find(dkd_item => dkd_item.dkd_season_id === dkd_center?.dkd_current_season_id);
    if (!dkd_option) return this.dkd_toast('Aktif sezon ödeme seçeneği bulunamadı.');
    if (!dkd_file) return this.dkd_toast('Önce dekont görselini seç.');
    if (!['image/jpeg','image/png','image/webp'].includes(dkd_file.type) || dkd_file.size > 3100000) return this.dkd_toast('Dekont JPG/PNG/WEBP ve en fazla 3 MB olmalı.');
    const dkd_reader = new FileReader();
    dkd_reader.onerror = () => {
      this.dkd_v074PaymentSubmitting = false;
      dkd_v074FinalPaymentBusy(this, false);
      this.dkd_toast('Dekont okunamadı.');
    };
    dkd_reader.onload = () => {
      this.dkd_v074PaymentSubmitting = true;
      dkd_v074FinalPaymentBusy(this, true);
      this.dkd_toast('Dekont güvenli şekilde gönderiliyor…');
      this.dkd_send('cloud-complete-job', { dkd_job_id: dkd_v074BridgeId, dkd_metrics: {
        dkd_v074_action: 'payment_submit',
        dkd_option_id: dkd_option.dkd_id,
        dkd_note,
        dkd_receipt_data: String(dkd_reader.result || ''),
      }});
    };
    dkd_reader.readAsDataURL(dkd_file);
    return;
  }
  return dkd_v074FinalPreviousAction.call(this, dkd_action);
};

window.dkd_lastMileV074 = {
  ...(window.dkd_lastMileV074 || {}),
  dkd_version: dkd_v074FinalVersion,
  dkd_androidVersionCode: 1,
  dkd_finalSharedSync: true,
  dkd_adminPaymentsSeparate: true,
  dkd_paymentSubmitIsolated: true,
  dkd_publicNoteAnimated: true,
  dkd_versionNormalizationIdempotent: true,
  dkd_receiptFullscreen: true,
  dkd_rewardNotice: true,
};

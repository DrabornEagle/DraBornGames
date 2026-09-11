// DraBornGo / LastMile v0.7.4 final shared hotfix — Android/Expo + Web.
// Keeps payment handling isolated from the shift-start flow and normalizes visible release labels.
const dkd_v074FinalPreviousSettings = dkd_Game.prototype.dkd_view_settings;
const dkd_v074FinalPreviousRender = dkd_Game.prototype.dkd_render;
const dkd_v074FinalPreviousReceive = dkd_Game.prototype.dkd_receive;
const dkd_v074FinalPreviousAction = dkd_Game.prototype.dkd_action;
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
    @keyframes dkd-v074-final-note{0%,100%{border-color:#63ded3;transform:translateY(0)}50%{border-color:#9d8cff;transform:translateY(-2px)}}
    @keyframes dkd-v074-final-note-badge{0%,100%{background:#e98bb9}50%{background:#ffcf70}}
    @keyframes dkd-v074-final-note-line{0%{transform:scaleX(.18)}50%{transform:scaleX(1)}100%{transform:scaleX(.18)}}
    html[data-dkd-motion='off'] .dkd-v074-public-note,html[data-dkd-motion='off'] .dkd-v074-public-note:before,html[data-dkd-motion='off'] .dkd-v074-public-note:after{animation:none!important;transform:none!important}
    @media(prefers-reduced-motion:reduce){.dkd-v074-public-note,.dkd-v074-public-note:before,.dkd-v074-public-note:after{animation:none!important;transform:none!important}}
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
    const dkd_next = dkd_value.replace(/v0\.7(?:\.[123])?/gi, dkd_v074FinalVersion);
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

dkd_Game.prototype.dkd_render = function dkd_v074FinalRender(dkd_page, dkd_arg = null) {
  const dkd_result = dkd_v074FinalPreviousRender.call(this, dkd_page, dkd_arg);
  dkd_v074FinalNormalizeVersions(this.dkd_root);
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
    this.dkd_modal('Dekont gönderilemedi', `Ödeme kaydı oluşturulamadı. ${dkd_message}`, `${dkd_button('TEKRAR DENE','v074-payment','refresh')}${dkd_button('KAPAT','close-modal','close','dkd-secondary')}`);
    return;
  }
  return dkd_v074FinalPreviousReceive.call(this, dkd_payload);
};

dkd_Game.prototype.dkd_action = function dkd_v074FinalAction(dkd_action) {
  const dkd_command = String(dkd_action || '').split(':')[0];
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
};

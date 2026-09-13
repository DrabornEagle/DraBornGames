// DraBornGo / Last Mile v0.7.5 — requested admin/home follow-up.
// Shared Android/Expo + Web runtime. Keeps the previous registration + wallet visuals.
const dkd_v075AdminHomePrevious = {
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_modal: dkd_Game.prototype.dkd_modal,
};
const dkd_v075AdminPaymentBridgeId = '00000000-0000-0000-0000-000000000974';

function dkd_v075AdminHomeInstallStyles() {
  if (document.getElementById('dkd-v075-admin-home-polish-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v075-admin-home-polish-style';
  dkd_style.textContent = `
    /* Keep the requested test wording, only slightly smaller. */
    #dkd-modal:has(.dkd-v075-test-sheet) .dkd-modal-card>h2{font-size:29px!important;line-height:1.08!important;letter-spacing:-.45px!important;margin-bottom:12px!important}

    /* Registration visual design is inherited from dkd-v075-onboarding-polish.
       Only the inherited empty spacer blocks are collapsed. */
    .dkd-v075-register-page form>.dkd-space{height:0!important;min-height:0!important;margin:0!important;padding:0!important}

    /* Slightly larger single-row Season / Level / Reputation badges remain requested. */
    .dkd-v075-badge-row{gap:6px!important;width:calc(100% - 18px)!important}
    .dkd-v075-badge-row .dkd-season-pill{min-height:39px!important;padding:7px 11px!important;max-width:50%!important;font-size:9.6px!important;letter-spacing:.75px!important;border-width:1px!important}
    .dkd-v075-badge-row .dkd-profile-pills{gap:5px!important}
    .dkd-v075-badge-row .dkd-profile-pills>span{min-height:39px!important;padding:7px 9px!important;font-size:9.4px!important;border-radius:12px!important}
    .dkd-v075-badge-row .dkd-profile-pills>span svg{width:15px!important;height:15px!important}

    /* Wallet intentionally has no v0.7.5 override here: old Courier Center wallet is restored. */

    /* Admin payment center categories. */
    .dkd-v075-admin-groups{display:grid;gap:11px}
    .dkd-v075-admin-group{overflow:hidden;border:1px solid #486782;border-radius:18px;background:#13283e}
    .dkd-v075-admin-group[open]{border-color:#6590ac;background:#162e47}
    .dkd-v075-admin-summary{list-style:none;display:flex;align-items:center;gap:10px;min-height:58px;padding:12px 14px;cursor:pointer;user-select:none}.dkd-v075-admin-summary::-webkit-details-marker{display:none}
    .dkd-v075-admin-summary>span:first-child{width:34px;height:34px;display:grid;place-items:center;flex:0 0 auto;border:1px solid #6e8dac;border-radius:10px;background:#203d5a;color:#8ee6dc}.dkd-v075-admin-summary svg{width:19px;height:19px}
    .dkd-v075-admin-summary>div{min-width:0;flex:1}.dkd-v075-admin-summary b{display:block;color:#fff;font-size:16px}.dkd-v075-admin-summary small{display:block;margin-top:2px;color:#9fb6ca;font-size:9px;font-weight:800}
    .dkd-v075-admin-count{padding:5px 8px;border:1px solid #607e9b;border-radius:999px;background:#213c55;color:#e9f5ff;font-size:9px;font-weight:950}
    .dkd-v075-admin-chevron{display:inline-block;color:#bad0e2;font-size:15px;transition:transform .18s ease}.dkd-v075-admin-group[open] .dkd-v075-admin-chevron{transform:rotate(180deg)}
    .dkd-v075-admin-content{display:grid;gap:10px;padding:0 12px 12px;border-top:1px solid #3e5a74;animation:dkd-v075-admin-open .22s ease-out both}
    .dkd-v075-admin-content>.dkd-list-line:first-child,.dkd-v075-admin-content>.dkd-v074-admin-row:first-child{margin-top:12px}
    .dkd-v075-admin-content .dkd-v074-admin-row{margin-bottom:0}
    .dkd-v075-admin-delete{margin-top:10px!important;min-height:44px!important;border:1px solid #ad665f!important;background:#4a2930!important;color:#ffd8d2!important;font-size:11px!important}
    .dkd-v075-admin-empty{margin:12px 0 0;padding:12px;border:1px solid #48647d;border-radius:13px;background:#102238;color:#b9cbda;font-size:11px}
    @keyframes dkd-v075-admin-open{from{opacity:.4;transform:translateY(-5px)}to{opacity:1;transform:none}}
    html[data-dkd-motion='off'] .dkd-v075-admin-content{animation:none!important;transform:none!important}
    @media(prefers-reduced-motion:reduce){.dkd-v075-admin-content{animation:none!important;transform:none!important}}
    @media(max-width:390px){.dkd-v075-badge-row{gap:4px!important}.dkd-v075-badge-row .dkd-season-pill{max-width:49%!important;padding:7px 8px!important;font-size:8.9px!important}.dkd-v075-badge-row .dkd-profile-pills{gap:3px!important}.dkd-v075-badge-row .dkd-profile-pills>span{padding:7px 6px!important;font-size:8.8px!important}}
  `;
  document.head.appendChild(dkd_style);
}
dkd_v075AdminHomeInstallStyles();

dkd_Game.prototype.dkd_modal = function dkd_v075AdminHomeModal(dkd_title, dkd_text, dkd_buttons) {
  let dkd_nextTitle = dkd_title;
  let dkd_nextText = dkd_text;
  if (String(dkd_title || '') === 'TEST ET · ŞEHİR SENİ BEKLİYOR') {
    dkd_nextTitle = 'TEST ET SİPARİŞLER SENİ BEKLİYOR';
    dkd_nextText = String(dkd_text || '').replace('Şehir Seni Bekliyor', 'Siparişler Seni Bekliyor');
  }
  return dkd_v075AdminHomePrevious.dkd_modal.call(this, dkd_nextTitle, dkd_nextText, dkd_buttons);
};

function dkd_v075AdminPriceRows(dkd_settings) {
  const dkd_options = Array.isArray(dkd_settings?.dkd_options) ? dkd_settings.dkd_options : [];
  return dkd_options.length ? dkd_options.map(dkd_option => `<div class="dkd-list-line"><div class="dkd-expand"><b>${dkd_escape(dkd_option.dkd_name)}</b><input id="dkd-v074-amount-${dkd_option.dkd_id}" class="dkd-v074-input" type="number" min="0" step="1" value="${Number(dkd_option.dkd_amount || 0)}"/><input id="dkd-v074-desc-${dkd_option.dkd_id}" class="dkd-v074-input" value="${dkd_escape(dkd_option.dkd_description || '')}" maxlength="300"/></div><button class="dkd-icon-btn dkd-selected" data-dkd-action="v074-admin-option-save:${dkd_option.dkd_id}" aria-label="Sezon fiyatını kaydet">${dkd_icon('check')}</button></div>`).join('') : '<p class="dkd-v075-admin-empty">Tanımlı sezon fiyatı bulunamadı.</p>';
}

function dkd_v075ReceiptSource(dkd_payment) {
  return String(dkd_payment?.dkd_receipt_url || dkd_payment?.dkd_receipt_data || '').trim();
}

function dkd_v075AdminPaymentRows(dkd_payments) {
  if (!dkd_payments.length) return '<p class="dkd-v075-admin-empty">Henüz gönderilmiş sezon ödemesi yok.</p>';
  return dkd_payments.map((dkd_payment, dkd_index) => {
    const dkd_pending = dkd_payment.dkd_status === 'pending';
    const dkd_review = dkd_pending ? `<input id="dkd-v074-review-${dkd_payment.dkd_id}" class="dkd-v074-input" maxlength="500" placeholder="Red nedeni / yönetici notu"/><div class="dkd-v074-admin-actions">${dkd_button('ONAYLA',`v074-admin-approve:${dkd_payment.dkd_id}`,'check')}${dkd_button('REDDET',`v074-admin-reject:${dkd_payment.dkd_id}`,'close','dkd-warning')}</div>` : `<small>İnceleme notu: ${dkd_escape(dkd_payment.dkd_review_note || '—')}</small>`;
    const dkd_receiptSource = dkd_v075ReceiptSource(dkd_payment);
    const dkd_receipt = dkd_receiptSource ? `<button type="button" class="dkd-v074-receipt-open" data-dkd-action="v075-receipt-open:${dkd_index}" aria-label="Dekontu tam ekran aç"><img src="${dkd_escape(dkd_receiptSource)}" alt="Ödeme dekontu"/><span>${dkd_icon('eye',17)} DEKONTU TAM EKRAN AÇ</span></button>` : '<p class="dkd-v075-admin-empty">Bu ödeme için dekont görseli bulunamadı.</p>';
    return `<div class="dkd-v074-admin-row" data-status="${dkd_escape(dkd_payment.dkd_status)}"><h3>${dkd_escape(dkd_payment.dkd_full_name || 'Oyuncu')}</h3><p><b>${dkd_escape(dkd_payment.dkd_company_name || '')}</b><br/>${dkd_escape(dkd_payment.dkd_email || '')}<br/>${dkd_escape(dkd_payment.dkd_season_id)} · <b>${dkd_v074Money(dkd_payment.dkd_amount)}</b><br/>Durum: ${dkd_escape(dkd_payment.dkd_status)}</p>${dkd_receipt}<p>Not: ${dkd_escape(dkd_payment.dkd_note || '—')}</p>${dkd_review}${dkd_button('ÖDEME KAYDINI SİL',`v075-admin-payment-delete:${dkd_payment.dkd_id}`,'close','dkd-v075-admin-delete')}</div>`;
  }).join('');
}

function dkd_v075AdminPaymentsHtml(dkd_game) {
  const dkd_panel = dkd_game.dkd_v074AdminPanel;
  if (!dkd_panel) return `<div class="dkd-v074-pay"><div class="dkd-v074-hero"><span class="dkd-v074-status dkd-v074-pulse">ÖDEMELER YÜKLENİYOR</span><h1>Yönetici ödeme merkezi</h1><p>Gelen dekontlar ve sezon ayarları hazırlanıyor.</p></div></div>`;
  const dkd_settings = dkd_panel.dkd_settings || {};
  const dkd_account = dkd_settings.dkd_accounts?.[0] || {};
  const dkd_payments = Array.isArray(dkd_panel.dkd_payments) ? dkd_panel.dkd_payments : [];
  const dkd_pending = dkd_payments.filter(dkd_item => dkd_item.dkd_status === 'pending').length;
  const dkd_priceCount = Array.isArray(dkd_settings.dkd_options) ? dkd_settings.dkd_options.length : 0;
  return `<div class="dkd-v074-pay"><div class="dkd-v074-hero"><span class="dkd-v074-status">YÖNETİCİ · ÖDEMELER</span><h1>${dkd_pending} ödeme bekliyor.</h1><p>Ödemeleri kategori halinde yönet; dekontları incele, kayıt sil, sezon fiyatlarını veya IBAN bilgisini güncelle.</p>${dkd_button('YENİLE','v074-admin-refresh','refresh','dkd-secondary')}</div><div class="dkd-v074-card"><h2>IBAN ayarları</h2><input id="dkd-v074-bank" class="dkd-v074-input" value="${dkd_escape(dkd_account.dkd_bank_name || '')}" placeholder="Banka adı"/><input id="dkd-v074-holder" class="dkd-v074-input" value="${dkd_escape(dkd_account.dkd_account_holder || '')}" placeholder="Hesap sahibi"/><input id="dkd-v074-iban" class="dkd-v074-input" value="${dkd_escape(dkd_account.dkd_iban || '')}" placeholder="TR.."/>${dkd_button('IBAN BİLGİSİNİ KAYDET','v074-admin-account-save','check')}</div><div class="dkd-v075-admin-groups"><details class="dkd-v075-admin-group"><summary class="dkd-v075-admin-summary"><span>${dkd_icon('wallet')}</span><div><b>Sezon Fiyatları</b><small>Sezonluk ücret ve açıklama ayarları</small></div><span class="dkd-v075-admin-count">${dkd_priceCount}</span><span class="dkd-v075-admin-chevron">⌄</span></summary><div class="dkd-v075-admin-content">${dkd_v075AdminPriceRows(dkd_settings)}</div></details><details class="dkd-v075-admin-group" open><summary class="dkd-v075-admin-summary"><span>${dkd_icon('check')}</span><div><b>Gelen Ödemeler</b><small>${dkd_pending} bekleyen · ${dkd_payments.length} toplam kayıt</small></div><span class="dkd-v075-admin-count">${dkd_payments.length}</span><span class="dkd-v075-admin-chevron">⌄</span></summary><div class="dkd-v075-admin-content">${dkd_v075AdminPaymentRows(dkd_payments)}</div></details></div></div>`;
}

dkd_Game.prototype.dkd_view_v074adminpayments = function dkd_v075AdminPaymentsView() {
  return this.dkd_page('Ödemeler', dkd_v075AdminPaymentsHtml(this));
};

dkd_Game.prototype.dkd_action = function dkd_v075AdminHomeAction(dkd_action) {
  const [dkd_command, ...dkd_parts] = String(dkd_action || '').split(':');
  const dkd_value = dkd_parts.join(':');
  if (dkd_command === 'v075-receipt-open') {
    const dkd_index = Math.max(0, Number.parseInt(dkd_value || '0', 10) || 0);
    const dkd_payment = this.dkd_v074AdminPanel?.dkd_payments?.[dkd_index];
    const dkd_src = dkd_v075ReceiptSource(dkd_payment);
    if (!dkd_src) return this.dkd_toast('Dekont görseli bulunamadı.');
    if (typeof dkd_v074FinalOpenReceipt === 'function') dkd_v074FinalOpenReceipt(dkd_src);
    else window.open?.(dkd_src, '_blank');
    return;
  }
  if (dkd_command === 'v075-admin-payment-delete') {
    if (!dkd_v074IsAdmin(this)) return this.dkd_toast('Yönetici hesabı gerekiyor.');
    const dkd_payment = this.dkd_v074AdminPanel?.dkd_payments?.find?.(dkd_item => String(dkd_item.dkd_id) === dkd_value);
    if (!dkd_payment) return this.dkd_toast('Ödeme kaydı bulunamadı.');
    const dkd_body = `<b>${dkd_escape(dkd_payment.dkd_full_name || 'Oyuncu')}</b> için ${dkd_v074Money(dkd_payment.dkd_amount)} tutarındaki ödeme kaydı ve yüklenen dekont verisi kalıcı olarak silinecek. Oyuncu hesabı ve oyun kaydı silinmez.`;
    const dkd_buttons = `${dkd_button('EVET, ÖDEME KAYDINI SİL',`v075-admin-payment-delete-confirm:${dkd_value}`,'close','dkd-warning')}${dkd_button('VAZGEÇ','v075-admin-payment-delete-cancel','back','dkd-secondary')}`;
    this.dkd_modal('Ödeme kaydını sil?', dkd_body, dkd_buttons);
    return;
  }
  if (dkd_command === 'v075-admin-payment-delete-cancel') {
    this.dkd_closeModal();
    return;
  }
  if (dkd_command === 'v075-admin-payment-delete-confirm') {
    if (!dkd_v074IsAdmin(this)) return this.dkd_toast('Yönetici hesabı gerekiyor.');
    this.dkd_closeModal();
    this.dkd_send('cloud-complete-job', { dkd_job_id: dkd_v075AdminPaymentBridgeId, dkd_metrics: { dkd_v074_action: 'admin_payment_delete', dkd_payment_id: dkd_value } });
    this.dkd_toast('Ödeme kaydı siliniyor…');
    return;
  }
  return dkd_v075AdminHomePrevious.dkd_action.call(this, dkd_action);
};

window.dkd_lastMileV075AdminHomePolish = {
  dkd_androidWebShared: true,
  dkd_testTitle: 'TEST ET SİPARİŞLER SENİ BEKLİYOR',
  dkd_registrationUsesPreviousDesign: true,
  dkd_registrationSpacerCollapseOnly: true,
  dkd_walletUsesPreviousDesign: true,
  dkd_largerHomeBadges: true,
  dkd_collapsiblePayments: true,
  dkd_collapsibleSeasonPrices: true,
  dkd_receiptPreviewRestored: true,
  dkd_receiptFullscreenRestored: true,
  dkd_adminPaymentDelete: true,
  dkd_flatColorsOnly: true,
};

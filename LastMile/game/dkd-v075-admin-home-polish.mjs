// DraBornGo / Last Mile v0.7.5 — registration, wallet, badges and payment-admin polish.
// Shared Android/Expo + Web runtime. Flat colors only: no gradient, shadow or glow.
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
    /* Test sheet title: shorter copy and slightly smaller headline. */
    #dkd-modal:has(.dkd-v075-test-sheet) .dkd-modal-card>h2{font-size:29px!important;line-height:1.08!important;letter-spacing:-.45px!important;margin-bottom:12px!important}

    /* Registration rebuilt as a compact colorful onboarding surface. */
    .dkd-v075-register-page{background:#0b1425!important}
    .dkd-v075-register-page .dkd-page-header{border-bottom:1px solid #385276!important;background:#13223a!important}
    .dkd-v075-register-page .dkd-page-body{padding:14px 16px 14px!important;background:#0e192b!important}
    .dkd-v075-register-page .dkd-v075-register-hero{margin:0 0 10px!important;padding:12px!important;border:1px solid #5679a1!important;border-left:7px solid #6fe0d3!important;border-radius:18px!important;background:#18334a!important}
    .dkd-v075-register-page .dkd-v075-register-hero>span{background:#264b65!important;border-color:#6d9abb!important;color:#e4ff5e!important}
    .dkd-v075-register-page>.dkd-page-body>.dkd-kicker{display:inline-flex!important;padding:6px 9px!important;border:1px solid #5e759c!important;border-radius:999px!important;background:#1c2d4a!important;color:#adc6ee!important}
    .dkd-v075-register-page h1{margin:9px 0 6px!important;font-size:27px!important;line-height:1.02!important}
    .dkd-v075-register-page .dkd-page-body>p{margin:0!important;padding:10px 12px!important;border:1px solid #405b77!important;border-radius:13px!important;background:#13263b!important;color:#c2d0df!important;font-size:11px!important;line-height:1.45!important}
    .dkd-v075-register-page form{counter-reset:dkd-register-field;display:grid!important;gap:8px!important;margin:10px 0 0!important}
    .dkd-v075-register-page .dkd-space{display:none!important;height:0!important;margin:0!important;padding:0!important}
    .dkd-v075-register-page .dkd-field{counter-increment:dkd-register-field;display:grid!important;grid-template-columns:34px 1fr!important;column-gap:9px!important;row-gap:4px!important;align-items:center!important;margin:0!important;padding:9px 10px!important;border:1px solid #476181!important;border-left:6px solid #79a3f3!important;border-radius:15px!important;background:#172a43!important;animation:dkd-v075-register-card-in .32s ease-out both!important}
    .dkd-v075-register-page .dkd-field:nth-of-type(2n){border-left-color:#6edfd2!important;background:#15313a!important}.dkd-v075-register-page .dkd-field:nth-of-type(3n){border-left-color:#f1c96f!important;background:#332d24!important}.dkd-v075-register-page .dkd-field:nth-of-type(4n){border-left-color:#e38db7!important;background:#332638!important}
    .dkd-v075-register-page .dkd-field:before{content:counter(dkd-register-field,decimal-leading-zero);grid-row:1 / span 2;display:grid;place-items:center;width:30px;height:30px;border:1px solid #647fa6;border-radius:10px;background:#233d60;color:#cfe0fb;font-size:9px;font-weight:950}
    .dkd-v075-register-page .dkd-field label{grid-column:2!important;margin:0!important;color:#f0f5ff!important;font-size:11px!important;font-weight:950!important}
    .dkd-v075-register-page .dkd-field input{grid-column:2!important;min-height:44px!important;margin:0!important;padding:9px 11px!important;border:1px solid #527093!important;border-radius:11px!important;background:#09172a!important;color:#fff!important;font-size:14px!important}
    .dkd-v075-register-page .dkd-field:has(.dkd-v073-invalid){border-color:#ff8b72!important;border-left-color:#ff8b72!important;background:#3a222c!important}
    .dkd-v075-register-page .dkd-v073-field-error{grid-column:1 / -1!important;margin:4px 0 0!important}
    .dkd-v075-register-page form>[data-dkd-action='pick-photo']{min-height:50px!important;margin:0!important;border:1px solid #5a77a0!important;background:#213857!important;color:#f2f6ff!important;font-size:12px!important}
    .dkd-v075-register-page .dkd-check{display:grid!important;grid-template-columns:29px 1fr!important;gap:9px!important;align-items:start!important;margin:0!important;padding:10px 11px!important;border:1px solid #46647d!important;border-left:5px solid #6ddfce!important;border-radius:14px!important;background:#142b3a!important;color:#dbe7ed!important;font-size:11px!important;line-height:1.45!important}
    .dkd-v075-register-page .dkd-check:nth-of-type(2){border-left-color:#f0ca70!important;background:#302c25!important}
    .dkd-v075-register-page .dkd-check input{width:23px!important;height:23px!important;margin:1px 0 0!important;accent-color:#e4ff5e!important}
    .dkd-v075-register-page form>button[type='submit']{min-height:55px!important;margin:2px 0 0!important;border:1px solid #f0ff9c!important;background:#e4ff5e!important;color:#152437!important;font-size:14px!important}
    .dkd-v075-register-page .dkd-page-body>[data-dkd-action='v04-login']{min-height:52px!important;margin-top:9px!important;border-color:#58749b!important;background:#1c3150!important;font-size:12px!important}

    /* Slightly larger single-row Season / Level / Reputation badges. */
    .dkd-v075-badge-row{gap:6px!important;width:calc(100% - 18px)!important}
    .dkd-v075-badge-row .dkd-season-pill{min-height:39px!important;padding:7px 11px!important;max-width:50%!important;font-size:9.6px!important;letter-spacing:.75px!important;border-width:1px!important}
    .dkd-v075-badge-row .dkd-profile-pills{gap:5px!important}
    .dkd-v075-badge-row .dkd-profile-pills>span{min-height:39px!important;padding:7px 9px!important;font-size:9.4px!important;border-radius:12px!important}
    .dkd-v075-badge-row .dkd-profile-pills>span svg{width:15px!important;height:15px!important}

    /* Modern colorful top-right wallet card. */
    .dkd-home .dkd-wallet-pill{position:relative!important;overflow:hidden!important;min-width:118px!important;min-height:55px!important;padding:8px 12px!important;gap:8px!important;border:1px solid #6485bd!important;border-top:4px solid #79a4ff!important;border-radius:17px!important;background:#203c69!important;color:#edf5ff!important;animation:dkd-v075-wallet-live 3.2s ease-in-out infinite!important;isolation:isolate!important}
    .dkd-home .dkd-wallet-pill:before{content:'CÜZDAN';position:absolute;left:45px;top:6px;color:#a9c4eb;font-size:7px;font-weight:950;letter-spacing:1px;pointer-events:none}
    .dkd-home .dkd-wallet-pill:after{content:'';position:absolute;left:10px;right:10px;bottom:4px;height:3px;border-radius:999px;background:#6fe0d3;transform-origin:left center;animation:dkd-v075-wallet-meter 2.7s ease-in-out infinite!important;pointer-events:none}
    .dkd-home .dkd-wallet-pill svg{width:25px!important;height:25px!important;padding:6px!important;box-sizing:content-box!important;border:1px solid #6fcfc9!important;border-radius:11px!important;background:#174d58!important;color:#bffff5!important}
    .dkd-home .dkd-wallet-pill b{padding-top:8px!important;font-size:14px!important;font-variant-numeric:tabular-nums!important;white-space:nowrap!important}
    .dkd-home .dkd-wallet-pill:active{transform:scale(.97)!important}

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

    @keyframes dkd-v075-register-card-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
    @keyframes dkd-v075-wallet-live{0%,100%{background:#203c69;border-top-color:#79a4ff}50%{background:#1c4d5b;border-top-color:#72e1d4}}
    @keyframes dkd-v075-wallet-meter{0%,100%{transform:scaleX(.28);opacity:.72}50%{transform:scaleX(1);opacity:1}}
    @keyframes dkd-v075-admin-open{from{opacity:.4;transform:translateY(-5px)}to{opacity:1;transform:none}}
    html[data-dkd-motion='off'] .dkd-v075-register-page .dkd-field,html[data-dkd-motion='off'] .dkd-home .dkd-wallet-pill,html[data-dkd-motion='off'] .dkd-home .dkd-wallet-pill:after,html[data-dkd-motion='off'] .dkd-v075-admin-content{animation:none!important;transform:none!important}
    @media(prefers-reduced-motion:reduce){.dkd-v075-register-page .dkd-field,.dkd-home .dkd-wallet-pill,.dkd-home .dkd-wallet-pill:after,.dkd-v075-admin-content{animation:none!important;transform:none!important}}
    @media(max-width:390px){.dkd-v075-badge-row{gap:4px!important}.dkd-v075-badge-row .dkd-season-pill{max-width:49%!important;padding:7px 8px!important;font-size:8.9px!important}.dkd-v075-badge-row .dkd-profile-pills{gap:3px!important}.dkd-v075-badge-row .dkd-profile-pills>span{padding:7px 6px!important;font-size:8.8px!important}.dkd-home .dkd-wallet-pill{min-width:112px!important;padding:7px 9px!important}.dkd-home .dkd-wallet-pill b{font-size:13px!important}}
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

function dkd_v075AdminPaymentRows(dkd_payments) {
  if (!dkd_payments.length) return '<p class="dkd-v075-admin-empty">Henüz gönderilmiş sezon ödemesi yok.</p>';
  return dkd_payments.map(dkd_payment => {
    const dkd_pending = dkd_payment.dkd_status === 'pending';
    const dkd_review = dkd_pending ? `<input id="dkd-v074-review-${dkd_payment.dkd_id}" class="dkd-v074-input" maxlength="500" placeholder="Red nedeni / yönetici notu"/><div class="dkd-v074-admin-actions">${dkd_button('ONAYLA',`v074-admin-approve:${dkd_payment.dkd_id}`,'check')}${dkd_button('REDDET',`v074-admin-reject:${dkd_payment.dkd_id}`,'close','dkd-warning')}</div>` : `<small>İnceleme notu: ${dkd_escape(dkd_payment.dkd_review_note || '—')}</small>`;
    const dkd_receipt = dkd_payment.dkd_receipt_url ? `<img src="${dkd_escape(dkd_payment.dkd_receipt_url)}" alt="Ödeme dekontu"/>` : '';
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
  dkd_registrationCompactRedesign: true,
  dkd_largerHomeBadges: true,
  dkd_animatedWallet: true,
  dkd_collapsiblePayments: true,
  dkd_collapsibleSeasonPrices: true,
  dkd_adminPaymentDelete: true,
  dkd_flatColorsOnly: true,
};

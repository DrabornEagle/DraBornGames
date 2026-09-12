// DraBornGo / Last Mile v0.7.5 hotfix — reliable receipt submission + dedicated Season Center.
// Shared by Android/Expo and Web. Keeps Daily tasks available from the in-game phone.
const dkd_v075HotfixPreviousAction = dkd_Game.prototype.dkd_action;
const dkd_v075HotfixPreviousRender = dkd_Game.prototype.dkd_render;
const dkd_v075HotfixPreviousReceive = dkd_Game.prototype.dkd_receive;
const dkd_v075HotfixMaxReceiptBytes = 8 * 1024 * 1024;
const dkd_v075HotfixTargetDataChars = 1650000;

function dkd_v075HotfixInstallStyles() {
  if (document.getElementById('dkd-v075-payment-season-hotfix-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v075-payment-season-hotfix-style';
  dkd_style.textContent = `
    .dkd-v075-season-center{display:grid;gap:14px;padding-bottom:8px}
    .dkd-v075-season-hero{position:relative;overflow:hidden;padding:19px;border:2px solid #6ae1d4;border-top:8px solid #90a1ff;border-radius:24px;background:#132b43;color:#f5fbff;animation:dkd-v075-center-in .34s cubic-bezier(.2,.8,.2,1) both}
    .dkd-v075-season-hero:after{content:'';position:absolute;left:0;bottom:0;width:100%;height:5px;background:#ffce72;transform-origin:left center;animation:dkd-v075-center-line 2.8s ease-in-out infinite}
    .dkd-v075-season-kicker{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border-radius:999px;background:#214a5d;color:#c7fff7;font-size:10px;font-weight:950;letter-spacing:1px}
    .dkd-v075-season-hero h1{margin:12px 0 7px;font-size:31px;line-height:1.05}.dkd-v075-season-hero p{margin:0;color:#c5d8e9;font-size:13px;line-height:1.5}
    .dkd-v075-season-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:15px}
    .dkd-v075-season-summary div{min-width:0;padding:11px 8px;border:1px solid #587492;border-radius:15px;background:#0f2438;text-align:center}
    .dkd-v075-season-summary div:nth-child(1){border-bottom:5px solid #6ee2d4}.dkd-v075-season-summary div:nth-child(2){border-bottom:5px solid #ffcf70}.dkd-v075-season-summary div:nth-child(3){border-bottom:5px solid #e78ab9}
    .dkd-v075-season-summary small{display:block;color:#9eb5ca;font-size:8px;font-weight:900;letter-spacing:.65px}.dkd-v075-season-summary b{display:block;margin-top:5px;color:#fff;font-size:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .dkd-v075-season-card{position:relative;overflow:hidden;padding:16px;border:1px solid #526f8c;border-left:8px solid #70dfd1;border-radius:19px;background:#11283e;color:#f5f9ff;animation:dkd-v075-card-in .38s ease-out both}
    .dkd-v075-season-card:nth-child(3n+2){border-left-color:#ffcf70}.dkd-v075-season-card:nth-child(3n+3){border-left-color:#e88cba}.dkd-v075-season-card:nth-child(3n+4){border-left-color:#8f9dff}
    .dkd-v075-season-card[data-dkd-active='true']{border-top:3px solid #dfff4f;background:#173448}
    .dkd-v075-season-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.dkd-v075-season-card-head h2{margin:4px 0 0;font-size:18px;line-height:1.25}.dkd-v075-season-card-head small{color:#aabfd2;font-size:9px;font-weight:900;letter-spacing:.8px}
    .dkd-v075-season-status{flex:0 0 auto;padding:6px 8px;border:1px solid #607d9d;border-radius:999px;background:#1b3953;color:#d9e8f7;font-size:9px;font-weight:950;letter-spacing:.7px}.dkd-v075-season-status[data-dkd-active='true']{border-color:#a7ce5a;background:#344c2b;color:#efffb9;animation:dkd-v075-active-pulse 1.8s ease-in-out infinite}
    .dkd-v075-season-order{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin:15px 0 11px;padding:13px;border:1px solid #456681;border-radius:15px;background:#0c2135}.dkd-v075-season-order span{color:#acc0d3;font-size:10px;font-weight:900;letter-spacing:.75px}.dkd-v075-season-order b{color:#fff1b7;font-size:29px;line-height:1}.dkd-v075-season-order small{font-size:10px;color:#d8e3ed;font-weight:900}
    .dkd-v075-season-dates{display:flex;justify-content:space-between;gap:10px;color:#adbed0;font-size:10px;line-height:1.4}.dkd-v075-season-dates b{color:#e7f0f8;font-size:10px}
    .dkd-v075-season-track{height:7px;margin-top:11px;overflow:hidden;border-radius:999px;background:#0a1c2d}.dkd-v075-season-track span{display:block;height:100%;width:var(--dkd-season-progress);border-radius:inherit;background:#72e3d5;transform-origin:left center;animation:dkd-v075-progress-in .7s ease-out both}
    .dkd-v075-season-refresh{display:flex;align-items:center;justify-content:center;gap:9px;min-height:55px;border:1px solid #728eac;border-radius:16px;background:#1c3b56;color:#fff;font-size:14px;font-weight:950;cursor:pointer}
    @keyframes dkd-v075-center-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes dkd-v075-center-line{0%,100%{transform:scaleX(.2)}50%{transform:scaleX(1)}}@keyframes dkd-v075-card-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}@keyframes dkd-v075-active-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}@keyframes dkd-v075-progress-in{from{transform:scaleX(0)}to{transform:scaleX(1)}}
    html[data-dkd-motion='off'] .dkd-v075-season-hero,html[data-dkd-motion='off'] .dkd-v075-season-hero:after,html[data-dkd-motion='off'] .dkd-v075-season-card,html[data-dkd-motion='off'] .dkd-v075-season-status,html[data-dkd-motion='off'] .dkd-v075-season-track span{animation:none!important;transform:none!important}
    @media(prefers-reduced-motion:reduce){.dkd-v075-season-hero,.dkd-v075-season-hero:after,.dkd-v075-season-card,.dkd-v075-season-status,.dkd-v075-season-track span{animation:none!important;transform:none!important}}
    @media(max-width:370px){.dkd-v075-season-summary{grid-template-columns:1fr}.dkd-v075-season-hero h1{font-size:27px}}
  `;
  document.head.appendChild(dkd_style);
}
dkd_v075HotfixInstallStyles();

function dkd_v075HotfixReadFile(dkd_file) {
  return new Promise((dkd_resolve, dkd_reject) => {
    const dkd_reader = new FileReader();
    dkd_reader.onerror = () => dkd_reject(new Error('Dekont dosyası okunamadı.'));
    dkd_reader.onload = () => dkd_resolve(String(dkd_reader.result || ''));
    dkd_reader.readAsDataURL(dkd_file);
  });
}

function dkd_v075HotfixLoadImage(dkd_file) {
  return new Promise((dkd_resolve, dkd_reject) => {
    const dkd_url = URL.createObjectURL(dkd_file);
    const dkd_image = new Image();
    dkd_image.onload = () => { URL.revokeObjectURL(dkd_url); dkd_resolve(dkd_image); };
    dkd_image.onerror = () => { URL.revokeObjectURL(dkd_url); dkd_reject(new Error('Dekont görseli açılamadı.')); };
    dkd_image.src = dkd_url;
  });
}

async function dkd_v075HotfixReceiptData(dkd_file) {
  const dkd_type = String(dkd_file?.type || '').toLowerCase();
  if (!['image/jpeg','image/jpg','image/png','image/webp'].includes(dkd_type)) throw new Error('Dekont JPG, PNG veya WEBP olmalı.');
  if (!Number.isFinite(Number(dkd_file?.size)) || dkd_file.size <= 0 || dkd_file.size > dkd_v075HotfixMaxReceiptBytes) throw new Error('Dekont en fazla 8 MB olabilir.');

  if (dkd_file.size <= 900000) {
    const dkd_original = await dkd_v075HotfixReadFile(dkd_file);
    if (dkd_original.length <= dkd_v075HotfixTargetDataChars) return dkd_original.replace(/^data:image\/jpg;/i,'data:image/jpeg;');
  }

  try {
    const dkd_image = await dkd_v075HotfixLoadImage(dkd_file);
    const dkd_width = Math.max(1, Number(dkd_image.naturalWidth || dkd_image.width || 1));
    const dkd_height = Math.max(1, Number(dkd_image.naturalHeight || dkd_image.height || 1));
    const dkd_scale = Math.min(1, 1800 / Math.max(dkd_width, dkd_height));
    const dkd_canvas = document.createElement('canvas');
    dkd_canvas.width = Math.max(1, Math.round(dkd_width * dkd_scale));
    dkd_canvas.height = Math.max(1, Math.round(dkd_height * dkd_scale));
    const dkd_context = dkd_canvas.getContext('2d', { alpha: false });
    if (!dkd_context) throw new Error('Görsel işleme alanı açılamadı.');
    dkd_context.fillStyle = '#ffffff';
    dkd_context.fillRect(0, 0, dkd_canvas.width, dkd_canvas.height);
    dkd_context.drawImage(dkd_image, 0, 0, dkd_canvas.width, dkd_canvas.height);
    for (const dkd_quality of [.86,.76,.66,.56,.48]) {
      const dkd_data = dkd_canvas.toDataURL('image/jpeg', dkd_quality);
      if (dkd_data.length <= dkd_v075HotfixTargetDataChars) return dkd_data;
    }
    throw new Error('Dekont güvenli gönderim boyutuna indirilemedi. Lütfen görseli kırpıp tekrar dene.');
  } catch (dkd_issue) {
    const dkd_fallback = await dkd_v075HotfixReadFile(dkd_file);
    if (dkd_fallback.length <= dkd_v075HotfixTargetDataChars) return dkd_fallback.replace(/^data:image\/jpg;/i,'data:image/jpeg;');
    throw dkd_issue;
  }
}

function dkd_v075HotfixSeasonRows(dkd_game) {
  if (typeof dkd_v075SeasonStats === 'function') return dkd_v075SeasonStats(dkd_game);
  return Array.isArray(dkd_game?.dkd_v04Cloud?.dkd_season_order_stats) ? dkd_game.dkd_v04Cloud.dkd_season_order_stats : [];
}

function dkd_v075HotfixSeasonPage(dkd_game) {
  const dkd_rows = dkd_v075HotfixSeasonRows(dkd_game);
  const dkd_now = Date.now();
  const dkd_active = dkd_rows.find(dkd_row => dkd_now >= new Date(dkd_row.dkd_starts_at).getTime() && dkd_now <= new Date(dkd_row.dkd_ends_at).getTime()) || null;
  const dkd_total = dkd_rows.reduce((dkd_sum, dkd_row) => dkd_sum + Math.max(0, Number(dkd_row.dkd_total_orders || 0)), 0);
  const dkd_activeEnd = dkd_active ? new Date(dkd_active.dkd_ends_at).getTime() : 0;
  const dkd_days = dkd_activeEnd > dkd_now ? Math.max(1, Math.ceil((dkd_activeEnd - dkd_now) / 86400000)) : 0;
  const dkd_cards = dkd_rows.length ? dkd_rows.map((dkd_row, dkd_index) => {
    const dkd_start = new Date(dkd_row.dkd_starts_at).getTime();
    const dkd_end = new Date(dkd_row.dkd_ends_at).getTime();
    const dkd_isActive = dkd_now >= dkd_start && dkd_now <= dkd_end;
    const dkd_isPast = dkd_now > dkd_end;
    const dkd_progress = dkd_isPast ? 100 : dkd_isActive && dkd_end > dkd_start ? Math.max(0, Math.min(100, Math.round((dkd_now - dkd_start) / (dkd_end - dkd_start) * 100))) : 0;
    const dkd_status = dkd_isActive ? 'AKTİF' : dkd_isPast ? 'TAMAMLANDI' : 'YAKINDA';
    return `<article class="dkd-v075-season-card" data-dkd-active="${dkd_isActive}" style="animation-delay:${Math.min(320, dkd_index * 65)}ms"><div class="dkd-v075-season-card-head"><div><small>SEZON ${Number(dkd_row.dkd_season_number || dkd_index + 1)}</small><h2>${dkd_escape(dkd_row.dkd_season_name || 'Sezon')}</h2></div><span class="dkd-v075-season-status" data-dkd-active="${dkd_isActive}">${dkd_status}</span></div><div class="dkd-v075-season-order"><span>TOPLAM SİPARİŞ</span><div><b>${Math.max(0, Number(dkd_row.dkd_total_orders || 0)).toLocaleString('tr-TR')}</b> <small>SİPARİŞ</small></div></div><div class="dkd-v075-season-dates"><span><b>BAŞLANGIÇ</b><br/>${dkd_v075Date(dkd_row.dkd_starts_at)}</span><span style="text-align:right"><b>BİTİŞ</b><br/>${dkd_v075Date(dkd_row.dkd_ends_at)}</span></div><div class="dkd-v075-season-track" aria-label="Sezon ilerlemesi yüzde ${dkd_progress}"><span style="--dkd-season-progress:${dkd_progress}%"></span></div></article>`;
  }).join('') : '<div class="dkd-card"><h3>Sezon verisi hazırlanıyor</h3><p class="dkd-muted dkd-text-sm">Sunucu bağlantısı yenilendiğinde sezon siparişlerin burada görünecek.</p></div>';
  return dkd_game.dkd_page('Sezon Merkezi', `<div class="dkd-v075-season-center"><section class="dkd-v075-season-hero"><span class="dkd-v075-season-kicker">${dkd_icon('trophy',15)} KURYE MERKEZİ · SEZONLAR</span><h1>Her sezonun<br/>sipariş geçmişi.</h1><p>Sayaçlar Supabase hesabına kaydedilir; Web ve Android'de aynı kullanıcıyla kaldığın yerden devam eder.</p><div class="dkd-v075-season-summary"><div><small>AKTİF SEZON</small><b>${dkd_active ? Number(dkd_active.dkd_season_number || 0) : '—'}</b></div><div><small>AKTİF SİPARİŞ</small><b>${Math.max(0, Number(dkd_active?.dkd_total_orders || 0)).toLocaleString('tr-TR')}</b></div><div><small>KALAN GÜN</small><b>${dkd_days || '—'}</b></div></div></section>${dkd_cards}<button type="button" class="dkd-v075-season-refresh" data-dkd-action="v075-season-refresh">${dkd_icon('refresh',18)} SUNUCUDAN YENİLE</button><div class="dkd-notice">Tüm sezonlarda kayıtlı toplam sipariş: <b>${dkd_total.toLocaleString('tr-TR')}</b>. Günlük görevler Dra Telefon içinden kullanılmaya devam eder.</div></div>`);
}

dkd_Game.prototype.dkd_view_v075season = function dkd_v075HotfixSeasonView() {
  return dkd_v075HotfixSeasonPage(this);
};

function dkd_v075HotfixHomeNav(dkd_game) {
  dkd_game?.dkd_root?.querySelector?.('.dkd-v075-season-orders')?.remove();
  if (dkd_game?.dkd_pageName !== 'home') return;
  const dkd_daily = dkd_game.dkd_root.querySelector('.dkd-home-actions [data-dkd-action="daily"]');
  if (!dkd_daily) return;
  dkd_daily.dataset.dkdAction = 'v075-season-center';
  dkd_daily.innerHTML = `<span class="dkd-quick-icon">${dkd_icon('chart')}</span><span>Sezon</span>`;
}

function dkd_v075HotfixPaymentCopy(dkd_game) {
  if (dkd_game?.dkd_pageName !== 'v074payment') return;
  const dkd_file = dkd_game.dkd_root?.querySelector?.('#dkd-v074-receipt');
  if (dkd_file) dkd_file.setAttribute('accept','image/jpeg,image/png,image/webp');
  const dkd_card = dkd_game.dkd_root?.querySelector?.('.dkd-v074-receipt-card');
  const dkd_copy = dkd_card?.querySelector?.('p');
  if (dkd_copy) dkd_copy.textContent = 'JPG, PNG veya WEBP seç. Büyük dekontlar okunabilirliği korunarak otomatik optimize edilir.';
}

dkd_Game.prototype.dkd_render = function dkd_v075HotfixRender(dkd_pageName, dkd_arg = null) {
  const dkd_result = dkd_v075HotfixPreviousRender.call(this, dkd_pageName, dkd_arg);
  dkd_v075HotfixHomeNav(this);
  dkd_v075HotfixPaymentCopy(this);
  return dkd_result;
};

dkd_Game.prototype.dkd_receive = function dkd_v075HotfixReceive(dkd_payload) {
  const dkd_result = dkd_v075HotfixPreviousReceive.call(this, dkd_payload);
  if (String(dkd_payload?.dkd_type || '') === 'cloud-bootstrap' && this.dkd_pageName === 'v075season') this.dkd_render('v075season');
  return dkd_result;
};

dkd_Game.prototype.dkd_action = function dkd_v075HotfixAction(dkd_action) {
  const dkd_command = String(dkd_action || '');
  if (dkd_command === 'v075-season-center') {
    this.dkd_render('v075season');
    return;
  }
  if (dkd_command === 'v075-season-refresh') {
    this.dkd_toast('Sezon siparişleri yenileniyor…');
    this.dkd_send('cloud-bootstrap', {});
    return;
  }
  if (dkd_command === 'v074-payment-submit') {
    if (this.dkd_v074PaymentSubmitting === true || this.dkd_v075ReceiptPreparing === true) return;
    this.dkd_v05PendingStart = false;
    const dkd_file = document.getElementById('dkd-v074-receipt')?.files?.[0];
    const dkd_note = String(document.getElementById('dkd-v074-note')?.value || '').slice(0,1000);
    const dkd_center = dkd_v074Center(this);
    const dkd_option = (dkd_center?.dkd_options || []).find(dkd_item => dkd_item.dkd_season_id === dkd_center?.dkd_current_season_id);
    if (!dkd_option) return this.dkd_toast('Aktif sezon ödeme seçeneği bulunamadı.');
    if (!dkd_file) return this.dkd_toast('Önce dekont görselini seç.');
    this.dkd_v075ReceiptPreparing = true;
    dkd_v074FinalPaymentBusy(this, true);
    this.dkd_toast('Dekont hazırlanıyor ve güvenli gönderim için optimize ediliyor…');
    void dkd_v075HotfixReceiptData(dkd_file).then(dkd_receiptData => {
      this.dkd_v075ReceiptPreparing = false;
      this.dkd_v074PaymentSubmitting = true;
      dkd_v074FinalPaymentBusy(this, true);
      if (typeof dkd_v075Mark === 'function') dkd_v075Mark(this,'payment_submit_started',{dkd_option_id:dkd_option.dkd_id,dkd_receipt_chars:dkd_receiptData.length});
      this.dkd_send('cloud-complete-job', { dkd_job_id: dkd_v074BridgeId, dkd_metrics: {
        dkd_v074_action: 'payment_submit',
        dkd_option_id: dkd_option.dkd_id,
        dkd_note,
        dkd_receipt_data: dkd_receiptData,
      }});
      this.dkd_toast('Dekont gönderiliyor…');
    }).catch(dkd_issue => {
      this.dkd_v075ReceiptPreparing = false;
      this.dkd_v074PaymentSubmitting = false;
      dkd_v074FinalPaymentBusy(this, false);
      this.dkd_modal('Dekont hazırlanamadı', dkd_escape(dkd_issue instanceof Error ? dkd_issue.message : 'Dekont işlenemedi.'), `${dkd_button('TEKRAR DENE','v074-payment','refresh')}${dkd_button('KAPAT','modal-close','close','dkd-secondary')}`);
    });
    return;
  }
  return dkd_v075HotfixPreviousAction.call(this, dkd_action);
};

window.dkd_lastMileV075 = {...(window.dkd_lastMileV075 || {}), dkd_receiptUploadHotfix:true, dkd_seasonCenter:true, dkd_homeSeasonTotalsMoved:true};

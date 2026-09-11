// DraBornGo / LastMile v0.7.4 Expo Go test layer.
// Android versionCode remains 1. Web/APK publishing stays disabled until device approval.
const dkd_v074Previous = {
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_receive: dkd_Game.prototype.dkd_receive,
  dkd_render: dkd_Game.prototype.dkd_render,
  dkd_view_choose: dkd_Game.prototype.dkd_view_choose,
  dkd_view_brand: dkd_Game.prototype.dkd_view_brand,
  dkd_view_settings: dkd_Game.prototype.dkd_view_settings,
  dkd_audioUpdate: dkd_Audio.prototype.dkd_update,
};
const dkd_v074BridgeId = '00000000-0000-0000-0000-000000000974';

function dkd_v074InstallStyles() {
  if (document.getElementById('dkd-v074-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v074-style';
  dkd_style.textContent = `
    .dkd-v074-pay{display:grid;gap:16px;padding-bottom:24px;--dkd-pay:#72e6d0;--dkd-pay2:#ffcf70;--dkd-pay3:#9d8cff}
    .dkd-v074-pay *{box-shadow:none!important;filter:none!important;background-image:none!important}
    .dkd-v074-hero{border:1px solid #496682;border-top:8px solid var(--dkd-pay);border-radius:24px;background:#13263b;padding:19px;animation:dkd-v074-in .35s ease-out both}
    .dkd-v074-hero h1{font-size:30px;line-height:1.08;margin:8px 0 10px}.dkd-v074-hero p{font-size:15px;line-height:1.6;color:#c7d6e8}
    .dkd-v074-status{display:inline-flex;align-items:center;gap:8px;border-radius:999px;padding:9px 12px;background:#234457;color:#bffbf3;font-size:12px;font-weight:950}
    .dkd-v074-card{border:1px solid #425d79;border-radius:22px;background:#172b42;padding:17px}.dkd-v074-card h2{font-size:21px;margin:0 0 12px}.dkd-v074-card p,.dkd-v074-card small{font-size:13px;line-height:1.55;color:#b8c9dc}
    .dkd-v074-money{font-size:35px;font-weight:950;color:#fff2bd;margin:7px 0}.dkd-v074-iban{display:block;margin:10px 0;padding:14px;border:2px dashed #6c8ba8;border-radius:15px;background:#102238;color:#fff;font-size:16px;font-weight:900;line-height:1.5;word-break:break-word}
    .dkd-v074-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.dkd-v074-stat{border:1px solid #405976;border-radius:16px;background:#102238;padding:13px}.dkd-v074-stat small{display:block;font-size:10px}.dkd-v074-stat b{display:block;margin-top:5px;font-size:17px}
    .dkd-v074-season{border-left:6px solid var(--dkd-pay3)}.dkd-v074-season b{font-size:16px}.dkd-v074-season strong{color:#ffe09b}
    .dkd-v074-file{display:block;width:100%;box-sizing:border-box;border:2px dashed #65bcb5;border-radius:17px;background:#10273b;color:#e9f8ff;padding:16px;font-size:13px}
    .dkd-v074-note{width:100%;min-height:100px;box-sizing:border-box;border:1px solid #49647f;border-radius:16px;background:#102238;color:#fff;padding:14px;font-size:15px;line-height:1.5;resize:vertical}
    .dkd-v074-admin-row{border:1px solid #45617d;border-left:6px solid #72e6d0;border-radius:20px;background:#14283f;padding:15px;margin-bottom:12px}.dkd-v074-admin-row[data-status='approved']{border-left-color:#79e6a8}.dkd-v074-admin-row[data-status='rejected']{border-left-color:#ff8b72}
    .dkd-v074-admin-row h3{font-size:18px;margin:0 0 6px}.dkd-v074-admin-row p{font-size:13px;line-height:1.5}.dkd-v074-admin-row img{width:100%;max-height:240px;object-fit:contain;border-radius:15px;background:#0d1c2c;margin:12px 0}
    .dkd-v074-admin-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}.dkd-v074-admin-actions .dkd-button{font-size:12px;padding:12px}
    .dkd-v074-input{width:100%;box-sizing:border-box;border:1px solid #49647f;border-radius:14px;background:#102238;color:#fff;padding:13px;font-size:14px;margin:6px 0 10px}
    .dkd-v074-example{border:1px solid #8b7447;border-radius:14px;background:#332c1d;color:#ffe7ae;padding:11px;font-size:12px;line-height:1.5}
    .dkd-v074-pulse{animation:dkd-v074-pulse 1.45s ease-in-out infinite}.dkd-v05-capacity-card{display:none!important}
    @keyframes dkd-v074-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}@keyframes dkd-v074-pulse{0%,100%{opacity:1}50%{opacity:.55}}
    html[data-dkd-motion='off'] .dkd-v074-hero,html[data-dkd-motion='off'] .dkd-v074-pulse{animation:none!important}
    @media(max-width:370px){.dkd-v074-grid,.dkd-v074-admin-actions{grid-template-columns:1fr}.dkd-v074-hero h1{font-size:26px}}
  `;
  document.head.appendChild(dkd_style);
}
dkd_v074InstallStyles();

if (typeof dkd_v05CapacityPopup === 'function') {
  dkd_v05CapacityPopup = function dkd_v074CapacityNotice(dkd_game) {
    dkd_game?.dkd_toast?.('Bu paket aktif aracının kapasitesini aşıyor. Garajdan daha uygun bir araç seç.');
  };
}

function dkd_v074Center(dkd_game) { return dkd_game?.dkd_v04Cloud?.dkd_payment_center || null; }
function dkd_v074Payment(dkd_game) { return dkd_v074Center(dkd_game)?.dkd_payment || null; }
function dkd_v074Approved(dkd_game) {
  const dkd_center = dkd_v074Center(dkd_game);
  return !dkd_center?.dkd_enforced || dkd_center?.dkd_is_admin || dkd_center?.dkd_payment?.dkd_status === 'approved';
}
function dkd_v074Season(dkd_game, dkd_id = '') {
  const dkd_center = dkd_v074Center(dkd_game);
  const dkd_target = dkd_id || dkd_center?.dkd_current_season_id;
  return (dkd_center?.dkd_seasons || []).find(dkd_item => dkd_item.dkd_id === dkd_target) || null;
}
function dkd_v074Days(dkd_date) { return Math.max(0, Math.ceil((new Date(dkd_date).getTime() - Date.now()) / 86400000)); }
function dkd_v074Date(dkd_date) { try { return new Date(dkd_date).toLocaleDateString('tr-TR',{day:'2-digit',month:'long',year:'numeric'}); } catch { return '—'; } }
function dkd_v074Money(dkd_value) { return `${Number(dkd_value || 0).toLocaleString('tr-TR',{minimumFractionDigits:0,maximumFractionDigits:2})} TL`; }
function dkd_v074IsAdmin(dkd_game) { return dkd_game?.dkd_v04IsAdmin === true || dkd_v074Center(dkd_game)?.dkd_is_admin === true; }

function dkd_v074PaymentBody(dkd_game) {
  const dkd_center = dkd_v074Center(dkd_game);
  if (!dkd_center) return `<div class="dkd-v074-pay"><div class="dkd-v074-hero"><span class="dkd-v074-status dkd-v074-pulse">BAĞLANTI KURULUYOR</span><h1>Sezon bilgileri hazırlanıyor.</h1><p>Güncel ödeme hesabı ve sezon erişimin sunucudan doğrulanıyor.</p>${dkd_button('DURUMU YENİLE','v074-payment-refresh','refresh')}</div></div>`;
  const dkd_payment = dkd_center.dkd_payment;
  const dkd_season = dkd_v074Season(dkd_game);
  const dkd_option = (dkd_center.dkd_options || []).find(dkd_item => dkd_item.dkd_season_id === dkd_center.dkd_current_season_id);
  const dkd_account = (dkd_center.dkd_accounts || []).find(dkd_item => dkd_item.dkd_id === dkd_option?.dkd_account_id) || dkd_center.dkd_accounts?.[0];
  if (dkd_payment?.dkd_status === 'approved') return `<div class="dkd-v074-pay"><div class="dkd-v074-hero" style="--dkd-pay:#79e6a8"><span class="dkd-v074-status">✓ ÖDEME ONAYLANDI</span><h1>İlk vardiyan hazır.</h1><p>${dkd_escape(dkd_season?.dkd_name || 'Aktif sezon')} erişimin açıldı. Artık kurye merkezine girip vardiyana başlayabilirsin.</p>${dkd_button('İLK VARDİYANA BAŞLA','home','play')}</div></div>`;
  if (dkd_payment?.dkd_status === 'pending') return `<div class="dkd-v074-pay"><div class="dkd-v074-hero" style="--dkd-pay:#ffcf70"><span class="dkd-v074-status dkd-v074-pulse">ÖDEMENİZ İNCELENİYOR</span><h1>Onay bekleniyor.</h1><p>Dekontun yönetici ödeme paneline ulaştı. Onaylandıktan sonra <b>İlk Vardiyanıza başlayabilirsiniz.</b></p><div class="dkd-v074-grid"><div class="dkd-v074-stat"><small>SEZON</small><b>${dkd_escape(dkd_season?.dkd_name || 'Aktif sezon')}</b></div><div class="dkd-v074-stat"><small>TUTAR</small><b>${dkd_v074Money(dkd_payment.dkd_amount)}</b></div></div>${dkd_button('DURUMU YENİLE','v074-payment-refresh','refresh')}<div class="dkd-space"></div>${dkd_button('OTURUMU KAPAT','v04-logout','close','dkd-secondary')}</div></div>`;
  const dkd_rejected = dkd_payment?.dkd_status === 'rejected';
  const dkd_future = (dkd_center.dkd_seasons || []).filter(dkd_item => dkd_item.dkd_id !== dkd_center.dkd_current_season_id).sort((a,b)=>a.dkd_number-b.dkd_number);
  return `<div class="dkd-v074-pay"><div class="dkd-v074-hero"><span class="dkd-v074-status">SEZONLUK ERİŞİM</span><h1>Sezonluk ödemeyi yap.</h1><p>Kayıt tamamlandı. Aktif sezonda vardiyaya başlayabilmek için dekontunu gönder; yönetici onayından sonra erişimin açılır.</p></div>${dkd_rejected?`<div class="dkd-v074-example" style="border-color:#a45f55;background:#382226;color:#ffd8cf"><b>Ödeme reddedildi.</b><br/>${dkd_escape(dkd_payment.dkd_review_note || 'Dekontu ve ödeme bilgilerini kontrol edip yeniden gönder.')}</div>`:''}<div class="dkd-v074-card"><h2>${dkd_escape(dkd_season?.dkd_name || 'Aktif sezon')}</h2><div class="dkd-v074-money">${dkd_v074Money(dkd_option?.dkd_amount)}</div><div class="dkd-v074-grid"><div class="dkd-v074-stat"><small>BİTİŞ TARİHİ</small><b>${dkd_v074Date(dkd_season?.dkd_ends_at)}</b></div><div class="dkd-v074-stat"><small>KALAN SÜRE</small><b>${dkd_v074Days(dkd_season?.dkd_ends_at)} gün</b></div></div><p>${dkd_escape(dkd_option?.dkd_description || '')}</p></div><div class="dkd-v074-card"><h2>IBAN / Havale</h2><p><b>${dkd_escape(dkd_account?.dkd_bank_name || 'Banka bilgisi bekleniyor')}</b><br/>${dkd_escape(dkd_account?.dkd_account_holder || '')}</p><span class="dkd-v074-iban">${dkd_escape(dkd_account?.dkd_iban || 'IBAN henüz tanımlanmadı')}</span>${String(dkd_account?.dkd_iban||'').startsWith('TR00')?'<div class="dkd-v074-example">Bu IBAN şu anda örnek test bilgisidir. Yönetici hesabındaki Ödemeler bölümünden gerçek IBAN girilmeden ödeme yapılmamalıdır.</div>':''}</div><div class="dkd-v074-card"><h2>Dekont gönder</h2><p>JPG, PNG veya WEBP ekran görüntüsü seç. En fazla 3 MB.</p><input id="dkd-v074-receipt" class="dkd-v074-file" type="file" accept="image/jpeg,image/png,image/webp"/><div class="dkd-space"></div><label for="dkd-v074-note"><b>Açıklama / Not</b></label><textarea id="dkd-v074-note" class="dkd-v074-note" maxlength="1000" placeholder="Örn. ödeme gönderen kişi, banka veya ek açıklama"></textarea><div class="dkd-space"></div>${dkd_button('ÖDEMEYİ YAPTIM','v074-payment-submit','check')}</div><div class="dkd-v074-card"><h2>Sonraki sezonlar</h2>${dkd_future.map(dkd_next=>{const dkd_nextOption=(dkd_center.dkd_options||[]).find(dkd_item=>dkd_item.dkd_season_id===dkd_next.dkd_id);return `<div class="dkd-list-line dkd-v074-season"><div class="dkd-expand"><b>SEZON ${dkd_next.dkd_number} · ${dkd_escape(dkd_next.dkd_name)}</b><small style="display:block">${dkd_v074Date(dkd_next.dkd_starts_at)} — ${dkd_v074Date(dkd_next.dkd_ends_at)}</small></div><strong>${dkd_v074Money(dkd_nextOption?.dkd_amount)}</strong></div>`;}).join('')}</div>${dkd_button('OTURUMU KAPAT','v04-logout','close','dkd-secondary')}</div>`;
}

dkd_Game.prototype.dkd_view_v074payment = function dkd_v074PaymentView() { return this.dkd_page('Sezonluk Ödeme', dkd_v074PaymentBody(this)); };

dkd_Game.prototype.dkd_view_choose = function dkd_v074ChooseView() {
  return String(dkd_v074Previous.dkd_view_choose.call(this)).replace('ŞİRKET MERKEZİNE GİR','SEZONLUK ÖDEMEYİ YAP').replace('data-dkd-action="home"','data-dkd-action="v074-payment"');
};

dkd_Game.prototype.dkd_view_brand = function dkd_v074BrandView() {
  return String(dkd_v074Previous.dkd_view_brand.call(this))
    .replaceAll('#233d44','#5e8f98').replaceAll('#333652','#747bb3').replaceAll('#653d32','#b67666').replaceAll('#3e4831','#879f69').replaceAll('#68605a','#aaa09a');
};

function dkd_v074AdminSection() {
  return `<section class="dkd-v07-section" data-dkd-tone="green"><div class="dkd-v07-section-head"><span class="dkd-v07-section-icon">${dkd_icon('wallet')}</span><div><h3>Ödemeler</h3><small>Sezon dekontları · onay / red · IBAN ve fiyat ayarları</small></div></div>${dkd_button('ÖDEMELERİ YÖNET','v074-admin-payments','wallet','dkd-secondary')}</section>`;
}
dkd_Game.prototype.dkd_view_settings = function dkd_v074SettingsView() {
  let dkd_html = String(dkd_v074Previous.dkd_view_settings.call(this));
  if (dkd_v074IsAdmin(this) && !dkd_html.includes('v074-admin-payments')) dkd_html = dkd_html.replace('<div class="dkd-v07-actions">', `${dkd_v074AdminSection()}<div class="dkd-v07-actions">`);
  return dkd_html;
};

function dkd_v074AdminHtml(dkd_game) {
  const dkd_panel = dkd_game.dkd_v074AdminPanel;
  if (!dkd_panel) return `<div class="dkd-v074-pay"><div class="dkd-v074-hero"><span class="dkd-v074-status dkd-v074-pulse">ÖDEMELER YÜKLENİYOR</span><h1>Yönetici ödeme merkezi</h1><p>Gelen dekontlar ve sezon ayarları Supabase'den getiriliyor.</p></div></div>`;
  const dkd_settings = dkd_panel.dkd_settings || {};
  const dkd_account = dkd_settings.dkd_accounts?.[0] || {};
  const dkd_payments = Array.isArray(dkd_panel.dkd_payments) ? dkd_panel.dkd_payments : [];
  return `<div class="dkd-v074-pay"><div class="dkd-v074-hero"><span class="dkd-v074-status">YÖNETİCİ · ÖDEMELER</span><h1>${dkd_payments.filter(dkd_item=>dkd_item.dkd_status==='pending').length} ödeme bekliyor.</h1><p>Dekontları incele, onayla veya reddet. IBAN ve sezon fiyatları buradan güncellenir.</p>${dkd_button('YENİLE','v074-admin-refresh','refresh','dkd-secondary')}</div><div class="dkd-v074-card"><h2>IBAN ayarları</h2><input id="dkd-v074-bank" class="dkd-v074-input" value="${dkd_escape(dkd_account.dkd_bank_name||'')}" placeholder="Banka adı"/><input id="dkd-v074-holder" class="dkd-v074-input" value="${dkd_escape(dkd_account.dkd_account_holder||'')}" placeholder="Hesap sahibi"/><input id="dkd-v074-iban" class="dkd-v074-input" value="${dkd_escape(dkd_account.dkd_iban||'')}" placeholder="TR.."/>${dkd_button('IBAN BİLGİSİNİ KAYDET','v074-admin-account-save','check')}</div><div class="dkd-v074-card"><h2>Sezon fiyatları</h2>${(dkd_settings.dkd_options||[]).map(dkd_option=>`<div class="dkd-list-line"><div class="dkd-expand"><b>${dkd_escape(dkd_option.dkd_name)}</b><input id="dkd-v074-amount-${dkd_option.dkd_id}" class="dkd-v074-input" type="number" min="0" step="1" value="${Number(dkd_option.dkd_amount||0)}"/><input id="dkd-v074-desc-${dkd_option.dkd_id}" class="dkd-v074-input" value="${dkd_escape(dkd_option.dkd_description||'')}" maxlength="300"/></div><button class="dkd-icon-btn dkd-selected" data-dkd-action="v074-admin-option-save:${dkd_option.dkd_id}" aria-label="Sezon fiyatını kaydet">${dkd_icon('check')}</button></div>`).join('')}</div><div class="dkd-v074-card"><h2>Gelen ödemeler</h2>${dkd_payments.length?dkd_payments.map(dkd_payment=>`<div class="dkd-v074-admin-row" data-status="${dkd_escape(dkd_payment.dkd_status)}"><h3>${dkd_escape(dkd_payment.dkd_full_name||'Oyuncu')}</h3><p><b>${dkd_escape(dkd_payment.dkd_company_name||'')}</b><br/>${dkd_escape(dkd_payment.dkd_email||'')}<br/>${dkd_escape(dkd_payment.dkd_season_id)} · <b>${dkd_v074Money(dkd_payment.dkd_amount)}</b><br/>Durum: ${dkd_escape(dkd_payment.dkd_status)}</p>${dkd_payment.dkd_receipt_url?`<img src="${dkd_escape(dkd_payment.dkd_receipt_url)}" alt="Ödeme dekontu"/>`:''}<p>Not: ${dkd_escape(dkd_payment.dkd_note||'—')}</p>${dkd_payment.dkd_status==='pending'?`<input id="dkd-v074-review-${dkd_payment.dkd_id}" class="dkd-v074-input" maxlength="500" placeholder="Red nedeni / yönetici notu"/><div class="dkd-v074-admin-actions">${dkd_button('ONAYLA',`v074-admin-approve:${dkd_payment.dkd_id}`,'check')}${dkd_button('REDDET',`v074-admin-reject:${dkd_payment.dkd_id}`,'close','dkd-warning')}</div>`:`<small>İnceleme notu: ${dkd_escape(dkd_payment.dkd_review_note||'—')}</small>`}</div>`).join(''):'<p>Henüz gönderilmiş sezon ödemesi yok.</p>'}</div></div>`;
}
dkd_Game.prototype.dkd_view_v074adminpayments = function dkd_v074AdminPaymentsView() { return this.dkd_page('Ödemeler', dkd_v074AdminHtml(this)); };
function dkd_v074AdminLoad(dkd_game) { dkd_game.dkd_v074AdminPanel = null; dkd_game.dkd_render('v074adminpayments'); dkd_game.dkd_send('cloud-claim-jobs',{dkd_count:1,dkd_level:974}); }

function dkd_v074FixAudio(dkd_audio, dkd_run) {
  if (!dkd_audio) return;
  const dkd_muted = dkd_audio.dkd_v073UserMuted === true || dkd_audio.dkd_muted === true;
  const dkd_level = dkd_clamp(Number(dkd_audio.dkd_state?.dkd_settings?.dkd_music) || 0,0,1);
  const dkd_drive = Boolean((dkd_run && !dkd_run.dkd_paused && !dkd_run.dkd_finished && !dkd_run.dkd_failed) || document.documentElement?.dataset?.dkdPage === 'drive' || document.documentElement?.dataset?.dkdPage === 'music');
  const dkd_target = dkd_muted ? 0 : Math.min(1,dkd_level*(dkd_drive?1:.82));
  for (const dkd_player of dkd_audio.dkd_v05MediaPlayers || []) {
    try { dkd_player.loop=true; dkd_player.preload='auto'; dkd_player.volume = dkd_player===dkd_audio.dkd_v05MediaCurrent ? dkd_target : 0; } catch {}
  }
  const dkd_current = dkd_audio.dkd_v05MediaCurrent;
  if (dkd_current && !dkd_muted && dkd_target>0 && dkd_current.paused && dkd_current.readyState>=2) dkd_current.play().catch(()=>{});
  if (dkd_audio.dkd_context?.state === 'suspended') dkd_audio.dkd_context.resume?.().catch?.(()=>{});
}
dkd_Audio.prototype.dkd_update = function dkd_v074AudioUpdate(dkd_run) { const dkd_result=dkd_v074Previous.dkd_audioUpdate.call(this,dkd_run); dkd_v074FixAudio(this,dkd_run); return dkd_result; };

const dkd_v074RestrictedPages = new Set(['home','dispatch','order','drive','phone','garage','vault','daily','rankings','contracts','company','wallet','weather','navigation','reputation','messages','music','camera','seasons']);
dkd_Game.prototype.dkd_render = function dkd_v074Render(dkd_page, dkd_arg=null) {
  let dkd_target = dkd_page;
  if (!dkd_v074IsAdmin(this) && dkd_v074RestrictedPages.has(String(dkd_page)) && dkd_v074Center(this)?.dkd_enforced && !dkd_v074Approved(this)) dkd_target='v074payment';
  const dkd_result=dkd_v074Previous.dkd_render.call(this,dkd_target,dkd_arg);
  for (const dkd_chip of this.dkd_root?.querySelectorAll?.('.dkd-version')||[]) dkd_chip.textContent='v0.7.4';
  dkd_v074FixAudio(this.dkd_audio,this.dkd_run);
  return dkd_result;
};

dkd_Game.prototype.dkd_receive = function dkd_v074Receive(dkd_payload) {
  if (dkd_payload?.dkd_type === 'cloud-jobs') {
    const dkd_rows=Array.isArray(dkd_payload.dkd_data)?dkd_payload.dkd_data:[];
    if (dkd_rows[0]?.dkd_v074_admin_payments === true) { this.dkd_v04JobsLoading=false; this.dkd_v074AdminPanel=dkd_rows[0]; return this.dkd_render('v074adminpayments'); }
  }
  if (dkd_payload?.dkd_type === 'cloud-job-complete' && String(dkd_payload.dkd_data?.dkd_job_id||'')===dkd_v074BridgeId) {
    this.dkd_toast('İşlem Supabase üzerinde kaydedildi.');
    if (this.dkd_pageName==='v074adminpayments') dkd_v074AdminLoad(this); else this.dkd_send('cloud-bootstrap',{});
    return;
  }
  if (['cloud-job-accepted','cloud-job-cancelled'].includes(dkd_payload?.dkd_type) && String(dkd_payload.dkd_data?.dkd_job_id||'').startsWith('payment:')) { this.dkd_toast(dkd_payload.dkd_type==='cloud-job-accepted'?'Ödeme onaylandı.':'Ödeme reddedildi.'); dkd_v074AdminLoad(this); return; }
  return dkd_v074Previous.dkd_receive.call(this,dkd_payload);
};

dkd_Game.prototype.dkd_action = function dkd_v074Action(dkd_action) {
  const [dkd_command,...dkd_parts]=String(dkd_action||'').split(':'); const dkd_value=dkd_parts.join(':');
  if (dkd_command==='v074-payment') return this.dkd_render('v074payment');
  if (dkd_command==='v074-payment-refresh') { this.dkd_send('cloud-bootstrap',{}); this.dkd_toast('Ödeme durumu yenileniyor…'); return; }
  if (dkd_command==='v074-payment-submit') {
    const dkd_file=document.getElementById('dkd-v074-receipt')?.files?.[0]; const dkd_note=String(document.getElementById('dkd-v074-note')?.value||'').slice(0,1000);
    const dkd_center=dkd_v074Center(this); const dkd_option=(dkd_center?.dkd_options||[]).find(dkd_item=>dkd_item.dkd_season_id===dkd_center?.dkd_current_season_id);
    if (!dkd_option) return this.dkd_toast('Aktif sezon ödeme seçeneği bulunamadı.');
    if (!dkd_file) return this.dkd_toast('Önce dekont görselini seç.');
    if (!['image/jpeg','image/png','image/webp'].includes(dkd_file.type)||dkd_file.size>3100000) return this.dkd_toast('Dekont JPG/PNG/WEBP ve en fazla 3 MB olmalı.');
    const dkd_reader=new FileReader(); dkd_reader.onerror=()=>this.dkd_toast('Dekont okunamadı.'); dkd_reader.onload=()=>{ this.dkd_send('cloud-complete-job',{dkd_job_id:dkd_v074BridgeId,dkd_metrics:{dkd_v074_action:'payment_submit',dkd_option_id:dkd_option.dkd_id,dkd_note,dkd_receipt_data:String(dkd_reader.result||'')}}); this.dkd_toast('Dekont yükleniyor…'); }; dkd_reader.readAsDataURL(dkd_file); return;
  }
  if (dkd_command==='v074-admin-payments'||dkd_command==='v074-admin-refresh') { if(!dkd_v074IsAdmin(this)) return this.dkd_toast('Yönetici hesabı gerekiyor.'); return dkd_v074AdminLoad(this); }
  if (dkd_command==='v074-admin-approve') { this.dkd_send('cloud-accept-job',{dkd_job_id:`payment:${dkd_value}`}); return; }
  if (dkd_command==='v074-admin-reject') { const dkd_reason=String(document.getElementById(`dkd-v074-review-${dkd_value}`)?.value||'Dekont doğrulanamadı.').slice(0,500); this.dkd_send('cloud-cancel-job',{dkd_job_id:`payment:${dkd_value}`,dkd_reason:dkd_reason}); return; }
  if (dkd_command==='v074-admin-account-save') { const dkd_account=this.dkd_v074AdminPanel?.dkd_settings?.dkd_accounts?.[0]; if(!dkd_account) return this.dkd_toast('IBAN hesabı bulunamadı.'); this.dkd_send('cloud-complete-job',{dkd_job_id:dkd_v074BridgeId,dkd_metrics:{dkd_v074_action:'admin_account_save',dkd_account_id:dkd_account.dkd_id,dkd_bank_name:String(document.getElementById('dkd-v074-bank')?.value||''),dkd_account_holder:String(document.getElementById('dkd-v074-holder')?.value||''),dkd_iban:String(document.getElementById('dkd-v074-iban')?.value||'')}}); return; }
  if (dkd_command==='v074-admin-option-save') { this.dkd_send('cloud-complete-job',{dkd_job_id:dkd_v074BridgeId,dkd_metrics:{dkd_v074_action:'admin_option_save',dkd_option_id:dkd_value,dkd_amount:Number(document.getElementById(`dkd-v074-amount-${dkd_value}`)?.value||0),dkd_description:String(document.getElementById(`dkd-v074-desc-${dkd_value}`)?.value||'')}}); return; }
  return dkd_v074Previous.dkd_action.call(this,dkd_action);
};

window.dkd_lastMileV074={dkd_version:'v0.7.4',dkd_androidVersionCode:1,dkd_expoGo:'57.0.9',dkd_webPublished:false,dkd_apkBuilt:false,dkd_seasonPayments:true,dkd_audioScaleFixed:true,dkd_capacityWindow:false};

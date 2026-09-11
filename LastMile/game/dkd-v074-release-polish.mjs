// DraBornGo / LastMile v0.7.4 release polish — shared by Android and Web.
const dkd_v074ReleasePreviousBrand = dkd_Game.prototype.dkd_view_brand;
const dkd_v074ReleasePreviousAction = dkd_Game.prototype.dkd_action;
const dkd_v074ReleasePreviousPaymentBody = dkd_v074PaymentBody;
const dkd_v074ReleasePreviousAdminHtml = dkd_v074AdminHtml;

function dkd_v074ReleaseInstallStyles() {
  if (document.getElementById('dkd-v074-release-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v074-release-style';
  dkd_style.textContent = `
    .dkd-v074-receipt-card{position:relative!important;overflow:hidden!important;border-color:#46c9c0!important;background:#142f42!important}
    .dkd-v074-receipt-card:before{content:'';display:block;height:5px;margin:-17px -17px 17px;background:#62e4d5;border-right:120px solid #8a9cff;border-left:70px solid #ffcf70}
    .dkd-v074-receipt-card h2{font-size:24px!important}.dkd-v074-receipt-card>p{font-size:15px!important;color:#d0deed!important}
    .dkd-v074-file{min-height:72px!important;border-color:#66d9d0!important;background:#0f293c!important;font-size:15px!important;padding:20px!important}
    .dkd-v074-note{font-size:16px!important;border-color:#607b9e!important;background:#10263a!important}
    [data-dkd-action='v074-payment-submit']{position:relative;overflow:hidden;font-size:17px!important;min-height:62px;animation:dkd-v074-release-button 1.9s ease-in-out infinite!important}
    [data-dkd-action='v074-payment-submit']:after{content:'';position:absolute;inset:-40% auto -40% -35%;width:26%;transform:skewX(-18deg);background:rgba(255,255,255,.34);animation:dkd-v074-release-shine 2.2s ease-in-out infinite}
    .dkd-v074-future-card{border-color:#665fa2!important;background:#192945!important}.dkd-v074-future-card h2{font-size:25px!important}
    .dkd-v074-future-card .dkd-v074-season{margin:10px 0;padding:15px 12px;border:1px solid #425b7d;border-left:6px solid #9d8cff;border-radius:15px;background:#11263c}
    .dkd-v074-future-card .dkd-v074-season:nth-of-type(2){border-left-color:#60d8cf}.dkd-v074-future-card .dkd-v074-season:nth-of-type(3){border-left-color:#ffcf70}.dkd-v074-future-card .dkd-v074-season:nth-of-type(4){border-left-color:#f08ab8}
    .dkd-v074-future-card .dkd-v074-season b{font-size:17px!important;line-height:1.35}.dkd-v074-future-card .dkd-v074-season small{font-size:13px!important}.dkd-v074-future-card .dkd-v074-season strong{font-size:18px!important;white-space:nowrap}
    .dkd-v074-bank-profile{display:grid;gap:7px;margin:6px 0 13px;padding:14px;border:1px solid #4c6b88;border-radius:16px;background:#10283e}
    .dkd-v074-bank-profile strong{font-size:19px;color:#d9f9ff}.dkd-v074-bank-profile span{font-size:17px;font-weight:850;color:#fff}.dkd-v074-bank-profile small{font-size:14px!important;color:#b8cbe0!important}
    .dkd-v074-public-note{margin:12px 0 0;padding:13px 14px;border-left:5px solid #65d9d0;border-radius:12px;background:#17364a;color:#d9f7f4;font-size:14px;line-height:1.55}
    .dkd-swatches [data-dkd-action^='uniform:'].dkd-selected{outline:3px solid #f6fbff!important;outline-offset:4px!important;border-color:#d7fbff!important;transform:scale(1.06)}
    .dkd-swatches [data-dkd-action^='uniform:'].dkd-selected:after{content:'✓';display:grid;place-items:center;position:absolute;right:-5px;top:-7px;width:25px;height:25px;border-radius:50%;background:#dfff4f;color:#122033;font-size:15px;font-weight:950;border:3px solid #122033}
    .dkd-swatches [data-dkd-action^='uniform:']{position:relative}
    @keyframes dkd-v074-release-button{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
    @keyframes dkd-v074-release-shine{0%,58%{left:-35%;opacity:0}66%{opacity:1}88%,100%{left:120%;opacity:0}}
    html[data-dkd-motion='off'] [data-dkd-action='v074-payment-submit'],html[data-dkd-motion='off'] [data-dkd-action='v074-payment-submit']:after{animation:none!important}
    @media(prefers-reduced-motion:reduce){[data-dkd-action='v074-payment-submit'],[data-dkd-action='v074-payment-submit']:after{animation:none!important}}
  `;
  document.head.appendChild(dkd_style);
}
dkd_v074ReleaseInstallStyles();

const dkd_v074ReleaseUniformLightToDark = {'#5e8f98':'#233d44','#747bb3':'#333652','#b67666':'#653d32','#879f69':'#3e4831','#aaa09a':'#68605a'};
const dkd_v074ReleaseUniformDarkToLight = Object.fromEntries(Object.entries(dkd_v074ReleaseUniformLightToDark).map(([dkd_light,dkd_dark])=>[dkd_dark,dkd_light]));
dkd_Game.prototype.dkd_view_brand = function dkd_v074ReleaseBrandView() {
  const dkd_brand = this.dkd_state?.dkd_brand;
  const dkd_selected = String(dkd_brand?.dkd_uniform || '');
  const dkd_dark = dkd_v074ReleaseUniformLightToDark[dkd_selected] || dkd_selected;
  if (dkd_brand) dkd_brand.dkd_uniform = dkd_dark;
  const dkd_html = dkd_v074ReleasePreviousBrand.call(this);
  if (dkd_brand) dkd_brand.dkd_uniform = dkd_v074ReleaseUniformDarkToLight[dkd_dark] || dkd_selected;
  return dkd_html;
};

function dkd_v074ReleaseAudio(dkd_audio, dkd_run = null) {
  if (!dkd_audio) return;
  const dkd_muted = dkd_audio.dkd_v073UserMuted === true || dkd_audio.dkd_muted === true;
  const dkd_raw = Number(dkd_audio.dkd_state?.dkd_settings?.dkd_music);
  const dkd_level = dkd_clamp(Number.isFinite(dkd_raw) ? (dkd_raw > 1 ? dkd_raw / 100 : dkd_raw) : .70, 0, 1);
  const dkd_drive = Boolean((dkd_run && !dkd_run.dkd_paused && !dkd_run.dkd_finished && !dkd_run.dkd_failed) || document.documentElement?.dataset?.dkdPage === 'drive' || document.documentElement?.dataset?.dkdPage === 'music');
  const dkd_target = dkd_muted ? 0 : dkd_level * (dkd_drive ? 1 : .82);
  const dkd_current = dkd_audio.dkd_v05MediaCurrent;
  for (const dkd_player of dkd_audio.dkd_v05MediaPlayers || []) {
    const dkd_playerTarget = dkd_player === dkd_current ? dkd_target : 0;
    try { if (Math.abs(Number(dkd_player.volume || 0) - dkd_playerTarget) > .015) dkd_player.volume = dkd_playerTarget; } catch {}
  }
  if (dkd_audio.dkd_context && dkd_audio.dkd_master?.gain) {
    const dkd_masterTarget = dkd_muted ? 0 : .84;
    if (Math.abs(Number(dkd_audio.dkd_v074ReleaseMasterTarget ?? -1) - dkd_masterTarget) > .01) {
      dkd_audio.dkd_v074ReleaseMasterTarget = dkd_masterTarget;
      try { dkd_audio.dkd_master.gain.setTargetAtTime(dkd_masterTarget, dkd_audio.dkd_context.currentTime, .04); } catch {}
    }
  }
  const dkd_now = Date.now();
  if (dkd_audio.dkd_context?.state === 'suspended' && dkd_now - Number(dkd_audio.dkd_v074ReleaseResumeAt || 0) > 1500) {
    dkd_audio.dkd_v074ReleaseResumeAt = dkd_now;
    dkd_audio.dkd_context.resume?.().catch?.(()=>{});
  }
  if (dkd_current && !dkd_muted && dkd_target > 0) {
    try { dkd_current.loop = true; dkd_current.preload = 'auto'; } catch {}
    if (dkd_current.paused && dkd_current.readyState >= 2 && dkd_now - Number(dkd_audio.dkd_v074ReleasePlayAt || 0) > 1500) {
      dkd_audio.dkd_v074ReleasePlayAt = dkd_now;
      dkd_current.play().catch(()=>{});
    }
  }
}
dkd_v073ApplyMute = dkd_v074ReleaseAudio;
dkd_v074FixAudio = dkd_v074ReleaseAudio;

dkd_v074PaymentBody = function dkd_v074ReleasePaymentBody(dkd_game) {
  let dkd_html = String(dkd_v074ReleasePreviousPaymentBody(dkd_game) || '');
  dkd_html = dkd_html.replace(/<div class="dkd-v074-example">Bu IBAN şu anda örnek test bilgisidir\.[\s\S]*?<\/div>/, '');
  dkd_html = dkd_html.replace('<div class="dkd-v074-card"><h2>Dekont gönder</h2>', '<div class="dkd-v074-card dkd-v074-receipt-card"><h2>Dekont gönder</h2>');
  dkd_html = dkd_html.replace('<div class="dkd-v074-card"><h2>Sonraki sezonlar</h2>', '<div class="dkd-v074-card dkd-v074-future-card"><h2>Sonraki sezonlar</h2>');
  const dkd_center = dkd_v074Center(dkd_game);
  const dkd_option = (dkd_center?.dkd_options || []).find(dkd_item => dkd_item.dkd_season_id === dkd_center?.dkd_current_season_id);
  const dkd_account = (dkd_center?.dkd_accounts || []).find(dkd_item => dkd_item.dkd_id === dkd_option?.dkd_account_id) || dkd_center?.dkd_accounts?.[0];
  if (dkd_account) {
    const dkd_bank = dkd_escape(dkd_account.dkd_bank_name || 'Banka bilgisi bekleniyor');
    const dkd_holder = dkd_escape(dkd_account.dkd_account_holder || '');
    const dkd_iban = dkd_escape(dkd_account.dkd_iban || 'IBAN henüz tanımlanmadı');
    const dkd_old = `<p><b>${dkd_bank}</b><br/>${dkd_holder}</p><span class="dkd-v074-iban">${dkd_iban}</span>`;
    const dkd_publicNote = String(dkd_account.dkd_public_note || '').trim();
    const dkd_new = `<div class="dkd-v074-bank-profile"><small>BANKA</small><strong>${dkd_bank}</strong><small>HESAP SAHİBİ</small><span>${dkd_holder}</span></div><span class="dkd-v074-iban">${dkd_iban}</span>${dkd_publicNote ? `<div class="dkd-v074-public-note">${dkd_escape(dkd_publicNote)}</div>` : ''}`;
    dkd_html = dkd_html.replace(dkd_old, dkd_new);
  }
  return dkd_html;
};

dkd_v074AdminHtml = function dkd_v074ReleaseAdminHtml(dkd_game) {
  let dkd_html = String(dkd_v074ReleasePreviousAdminHtml(dkd_game) || '');
  const dkd_account = dkd_game?.dkd_v074AdminPanel?.dkd_settings?.dkd_accounts?.[0] || {};
  const dkd_note = dkd_escape(dkd_account.dkd_public_note || '');
  dkd_html = dkd_html.replace(/(<input id="dkd-v074-iban"[^>]*\/?>)/, `$1<label for="dkd-v074-account-note"><b>Kullanıcının göreceği not</b></label><textarea id="dkd-v074-account-note" class="dkd-v074-note" maxlength="600" placeholder="Örn. Havale açıklamasına kullanıcı adınızı yazın.">${dkd_note}</textarea>`);
  return dkd_html;
};

dkd_Game.prototype.dkd_action = function dkd_v074ReleaseAction(dkd_action) {
  if (String(dkd_action || '') === 'v074-admin-account-save') {
    const dkd_account = this.dkd_v074AdminPanel?.dkd_settings?.dkd_accounts?.[0];
    if (!dkd_account) return this.dkd_toast('IBAN hesabı bulunamadı.');
    this.dkd_send('cloud-complete-job', { dkd_job_id: dkd_v074BridgeId, dkd_metrics: {
      dkd_v074_action: 'admin_account_save', dkd_account_id: dkd_account.dkd_id,
      dkd_bank_name: String(document.getElementById('dkd-v074-bank')?.value || ''),
      dkd_account_holder: String(document.getElementById('dkd-v074-holder')?.value || ''),
      dkd_iban: String(document.getElementById('dkd-v074-iban')?.value || ''),
      dkd_public_note: String(document.getElementById('dkd-v074-account-note')?.value || '').slice(0,600),
    }});
    this.dkd_toast('IBAN ve kullanıcı notu kaydediliyor…');
    return;
  }
  return dkd_v074ReleasePreviousAction.call(this, dkd_action);
};

window.dkd_lastMileV074 = {...(window.dkd_lastMileV074 || {}), dkd_webPublished:true, dkd_apkBuilt:true, dkd_releasePolish:true, dkd_audioStable:true, dkd_uniformSelectionFixed:true, dkd_publicIbanNote:true};

// DraBornGo / Last Mile v0.7.5 — first-entry test access + registration/home placement polish.
// Shared Android/Expo + Web runtime layer. Flat colors only: no gradient, shadow or glow.
const dkd_v075OnboardingPrevious = {
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_render: dkd_Game.prototype.dkd_render,
  dkd_view_register: dkd_Game.prototype.dkd_view_register,
};

const dkd_v075TestAccount = Object.freeze({
  dkd_email: 'lastmile01@gmail.com',
  dkd_password: '111111',
});
const dkd_v075TestEntryKey = 'dkd_lastmile_v075_test_entry_seen_1';

function dkd_v075OnboardingInstallStyles() {
  if (document.getElementById('dkd-v075-onboarding-polish-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v075-onboarding-polish-style';
  dkd_style.textContent = `
    /* Home identity: Ad Soyad sits immediately above the centered Season / Level / Reputation row. */
    .dkd-home-header .dkd-player-name,.dkd-home-header>h1{position:absolute!important;left:50%!important;top:136px!important;width:calc(100% - 24px)!important;max-width:620px!important;margin:0!important;transform:translateX(-50%)!important;z-index:6!important;text-align:left!important;font-size:31px!important;line-height:1.05!important;pointer-events:none!important}
    .dkd-v075-badge-row{top:188px!important}

    /* First-entry TEST ET information sheet. */
    .dkd-v075-test-sheet{display:grid;gap:12px;text-align:left}
    .dkd-v075-test-hero{display:flex;align-items:center;gap:12px;padding:14px;border:1px solid #5f79a5;border-left:6px solid #e4ff5e;border-radius:17px;background:#203153;animation:dkd-v075-test-rise .34s cubic-bezier(.2,.8,.2,1) both}
    .dkd-v075-test-icon{width:50px;height:50px;display:grid;place-items:center;flex:0 0 auto;border:1px solid #8da6d4;border-radius:15px;background:#304d79;color:#e4ff5e}.dkd-v075-test-icon svg{width:27px;height:27px}
    .dkd-v075-test-hero small{display:block;color:#bed0ec;font-size:9px;font-weight:950;letter-spacing:1px}.dkd-v075-test-hero b{display:block;margin-top:4px;color:#fff;font-size:18px;line-height:1.2}
    .dkd-v075-test-copy{padding:12px 13px;border:1px solid #3f6177;border-radius:14px;background:#123342;color:#cfe5ed;font-size:11px;line-height:1.55}
    .dkd-v075-test-account{display:grid;gap:8px;padding:12px;border:1px solid #6c5f86;border-radius:15px;background:#2b2844}
    .dkd-v075-test-credential{display:grid;grid-template-columns:64px 1fr;gap:9px;align-items:center;padding:9px 10px;border:1px solid #4e5275;border-radius:11px;background:#191f38}
    .dkd-v075-test-credential span{font-size:9px;font-weight:950;letter-spacing:.7px;color:#9cb3d8}.dkd-v075-test-credential b{font-size:12px;color:#fff;overflow-wrap:anywhere;font-variant-numeric:tabular-nums}
    #dkd-modal:has(.dkd-v075-test-sheet) .dkd-modal-card{border-color:#7188b5;background:#1b2944}
    #dkd-modal:has(.dkd-v075-test-sheet) .dkd-stack{gap:8px}
    #dkd-modal:has(.dkd-v075-test-sheet) [data-dkd-action='v075-test-auto-login']{background:#e4ff5e!important;color:#172435!important;border:1px solid #f2ffae!important;font-weight:950!important;animation:dkd-v075-test-button .8s ease-out both}

    /* Registration: modern, colorful, readable flat cards. */
    .dkd-v075-register-page .dkd-page-body{background:#10192d}
    .dkd-v075-register-hero{display:flex;gap:12px;align-items:center;padding:14px;margin-bottom:14px;border:1px solid #55719a;border-left:6px solid #72ded0;border-radius:17px;background:#1a3150;animation:dkd-v075-register-in .35s cubic-bezier(.2,.8,.2,1) both}
    .dkd-v075-register-hero>span{width:48px;height:48px;display:grid;place-items:center;flex:0 0 auto;border:1px solid #7394bb;border-radius:14px;background:#294a68;color:#e4ff5e}.dkd-v075-register-hero>span svg{width:25px;height:25px}
    .dkd-v075-register-hero small{display:block;color:#a9c5e0;font-size:9px;font-weight:950;letter-spacing:1px}.dkd-v075-register-hero b{display:block;margin-top:4px;color:#fff;font-size:17px;line-height:1.25}
    .dkd-v075-register-page h1{color:#f5f8ff!important;font-size:31px!important;line-height:1.05!important}.dkd-v075-register-page h1 span{color:#84e3d5}
    .dkd-v075-register-page form{display:grid;gap:10px;margin-top:16px}
    .dkd-v075-register-page .dkd-field{position:relative;margin:0;padding:12px;border:1px solid #3c5273;border-left:5px solid #6d8cc5;border-radius:15px;background:#182642;transition:transform .16s ease,border-color .16s ease,background-color .16s ease}
    .dkd-v075-register-page .dkd-field:nth-of-type(2n){border-left-color:#72d9cc;background:#17323d}.dkd-v075-register-page .dkd-field:nth-of-type(3n){border-left-color:#e9be6c;background:#342f29}.dkd-v075-register-page .dkd-field:nth-of-type(4n){border-left-color:#df8ab7;background:#35283a}
    .dkd-v075-register-page .dkd-field label{margin-bottom:8px;font-size:12px;font-weight:900;letter-spacing:.2px;color:#dce7f8}
    .dkd-v075-register-page .dkd-field input{min-height:52px;border:1px solid #50688c;border-radius:12px;background:#0d182c;color:#fff;font-size:15px}
    .dkd-v075-register-page .dkd-field input:focus{border-color:#9ab7ef;outline:2px solid #7895cc;outline-offset:2px}
    .dkd-v075-register-page .dkd-field:has(.dkd-v073-invalid){border:2px solid #ff8b72!important;border-left-width:7px!important;background:#3b222d!important;animation:dkd-v075-register-error .28s ease-out both}
    .dkd-v075-register-page .dkd-field:has(.dkd-v073-invalid) label{color:#ffd0c5!important}
    .dkd-v075-register-page .dkd-v073-field-error{margin:9px 0 0;padding:8px 9px;border:1px solid #a95e55;border-radius:9px;background:#4a2830;color:#ffe1d8}
    .dkd-v075-register-page .dkd-v073-form-alert{border-color:#ff8b72;background:#462831;color:#ffe5dd}
    .dkd-v075-register-page .dkd-check{padding:11px;border:1px solid #415b77;border-radius:13px;background:#17263b}
    .dkd-v075-register-page button[type='submit']{min-height:60px;margin-top:3px;font-size:15px;font-weight:950}

    @media(max-height:900px){
      .dkd-home-header .dkd-player-name,.dkd-home-header>h1{top:122px!important;font-size:29px!important}
      .dkd-v075-badge-row{top:170px!important}
      .dkd-v075-register-page .dkd-page-body{padding-top:16px!important}
      .dkd-v075-register-page .dkd-v075-register-hero{padding:11px;margin-bottom:10px}
      .dkd-v075-register-page form{gap:8px;margin-top:12px}
      .dkd-v075-register-page .dkd-field{padding:9px}
    }
    @media(max-width:390px){
      .dkd-home-header .dkd-player-name,.dkd-home-header>h1{width:calc(100% - 18px)!important;font-size:27px!important}
      .dkd-v075-test-credential{grid-template-columns:55px 1fr}
    }

    @keyframes dkd-v075-test-rise{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}
    @keyframes dkd-v075-test-button{from{opacity:.45;transform:translateY(6px)}to{opacity:1;transform:none}}
    @keyframes dkd-v075-register-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    @keyframes dkd-v075-register-error{0%{transform:translateX(0)}35%{transform:translateX(5px)}70%{transform:translateX(-4px)}100%{transform:none}}
    html[data-dkd-motion='off'] .dkd-v075-test-hero,html[data-dkd-motion='off'] #dkd-modal:has(.dkd-v075-test-sheet) [data-dkd-action='v075-test-auto-login'],html[data-dkd-motion='off'] .dkd-v075-register-hero,html[data-dkd-motion='off'] .dkd-v075-register-page .dkd-field:has(.dkd-v073-invalid){animation:none!important;transform:none!important}
    @media(prefers-reduced-motion:reduce){.dkd-v075-test-hero,#dkd-modal:has(.dkd-v075-test-sheet) [data-dkd-action='v075-test-auto-login'],.dkd-v075-register-hero,.dkd-v075-register-page .dkd-field:has(.dkd-v073-invalid){animation:none!important;transform:none!important}}
  `;
  document.head.appendChild(dkd_style);
}

dkd_v075OnboardingInstallStyles();

function dkd_v075TestEntrySeen() {
  try { return localStorage.getItem(dkd_v075TestEntryKey) === '1'; } catch { return window.dkd_v075TestEntrySeen === true; }
}

function dkd_v075MarkTestEntrySeen() {
  window.dkd_v075TestEntrySeen = true;
  try { localStorage.setItem(dkd_v075TestEntryKey, '1'); } catch {}
}

function dkd_v075OpenTestEntry(dkd_game) {
  if (!dkd_game || dkd_game.dkd_pageName !== 'intro' || dkd_game.dkd_v04Authenticated === true || dkd_v075TestEntrySeen()) return;
  dkd_v075MarkTestEntrySeen();
  const dkd_body = `<div class="dkd-v075-test-sheet"><div class="dkd-v075-test-hero"><span class="dkd-v075-test-icon">${dkd_icon('play',27)}</span><div><small>TEK SEFERLİK TEST BİLGİSİ</small><b>Şehir Seni Bekliyor</b></div></div><div class="dkd-v075-test-copy">Oyunu önce hazır test hesabıyla deneyebilirsin. Otomatik giriş, aşağıdaki test hesabını kullanır.</div><div class="dkd-v075-test-account"><div class="dkd-v075-test-credential"><span>MAIL</span><b>${dkd_escape(dkd_v075TestAccount.dkd_email)}</b></div><div class="dkd-v075-test-credential"><span>ŞİFRE</span><b>${dkd_escape(dkd_v075TestAccount.dkd_password)}</b></div></div></div>`;
  const dkd_buttons = `${dkd_button('OTOMATİK GİRİŞ YAP','v075-test-auto-login','fingerprint')}${dkd_button('KENDİ HESABIMLA DEVAM ET','modal-close','arrow','dkd-secondary')}`;
  dkd_game.dkd_modal('TEST ET · ŞEHİR SENİ BEKLİYOR', dkd_body, dkd_buttons);
}

function dkd_v075ScheduleTestEntry(dkd_game) {
  if (!dkd_game || dkd_game.dkd_pageName !== 'intro' || dkd_v075TestEntrySeen()) return;
  clearTimeout(dkd_game.dkd_v075TestEntryTimer);
  dkd_game.dkd_v075TestEntryTimer = setTimeout(() => {
    if (dkd_game.dkd_pageName !== 'intro' || dkd_game.dkd_v04Authenticated === true) return;
    dkd_v075OpenTestEntry(dkd_game);
  }, 360);
}

function dkd_v075PolishRegisterHtml(dkd_html) {
  let dkd_output = String(dkd_html || '');
  dkd_output = dkd_output.replace('<div class="dkd-page dkd-enter">','<div class="dkd-page dkd-enter dkd-v075-register-page">');
  dkd_output = dkd_output.replace('<div class="dkd-page-body">','<div class="dkd-page-body"><div class="dkd-v075-register-hero"><span>' + dkd_icon('company',25) + '</span><div><small>KENDİ ŞİRKETİNİ KUR</small><b>Profilini oluştur, şirketini kur, ilk vardiyana hazırlan.</b></div></div>');
  dkd_output = dkd_output.replace('Kendi adınla.<br/>Kendi şirketinle.','KENDİ ŞİRKETİNİ KUR<br/><span>Yeni bir başlangıç.</span>');
  return dkd_output;
}

dkd_Game.prototype.dkd_view_register = function dkd_v075OnboardingRegisterView() {
  return dkd_v075PolishRegisterHtml(dkd_v075OnboardingPrevious.dkd_view_register.call(this));
};

dkd_Game.prototype.dkd_render = function dkd_v075OnboardingRender(dkd_pageName, dkd_arg = null) {
  const dkd_result = dkd_v075OnboardingPrevious.dkd_render.call(this, dkd_pageName, dkd_arg);
  if (dkd_pageName === 'home') {
    const dkd_playerName = this.dkd_root?.querySelector?.('.dkd-home-header .dkd-player-name,.dkd-home-header>h1');
    if (dkd_playerName) dkd_playerName.classList.add('dkd-player-name');
  }
  if (dkd_pageName === 'intro') dkd_v075ScheduleTestEntry(this);
  return dkd_result;
};

dkd_Game.prototype.dkd_action = function dkd_v075OnboardingAction(dkd_action) {
  if (String(dkd_action || '') === 'v075-test-auto-login') {
    this.dkd_closeModal?.();
    this.dkd_send('auth-login', {
      dkd_email: dkd_v075TestAccount.dkd_email,
      dkd_password: dkd_v075TestAccount.dkd_password,
    });
    this.dkd_toast('Test hesabına giriş yapılıyor…');
    return;
  }
  return dkd_v075OnboardingPrevious.dkd_action.call(this, dkd_action);
};

window.dkd_lastMileV075OnboardingPolish = {
  dkd_testPopupOnce: true,
  dkd_testAutoLogin: true,
  dkd_testEmail: dkd_v075TestAccount.dkd_email,
  dkd_registerFieldErrorsSeparate: true,
  dkd_playerNameAboveSeasonBadge: true,
  dkd_androidWebShared: true,
  dkd_flatColorsOnly: true,
};

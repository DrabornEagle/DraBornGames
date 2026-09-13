// DraBornGo / Last Mile v0.7.5 — login-triggered one-time test access polish.
// Final shared Android/Web layer. Flat colors only: no gradient, shadow or glow.
const dkd_v075LoginTriggerPrevious = {
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_render: dkd_Game.prototype.dkd_render,
};

const dkd_v075LoginTestAccount = Object.freeze({
  dkd_email: 'lastmile01@gmail.com',
  dkd_password: '111111',
});
const dkd_v075LoginTestKey = 'dkd_lastmile_v075_test_login_click_seen_1';

function dkd_v075LoginTriggerInstallStyles() {
  if (document.getElementById('dkd-v075-login-test-trigger-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v075-login-test-trigger-style';
  dkd_style.textContent = `
    .dkd-v075-login-entry{position:relative!important;overflow:hidden!important;min-height:60px!important;border:2px solid #71e1d4!important;border-left:8px solid #e4ff5e!important;border-radius:18px!important;background:#173f55!important;color:#f7ffff!important;font-weight:950!important;letter-spacing:.25px!important;animation:dkd-v075-login-entry-live 2.4s ease-in-out infinite!important}
    .dkd-v075-login-entry:after{content:'';position:absolute;left:14px;right:14px;bottom:5px;height:3px;border-radius:999px;background:#e4ff5e;transform-origin:left center;animation:dkd-v075-login-entry-meter 2.4s ease-in-out infinite!important;pointer-events:none}
    .dkd-v075-login-entry svg{color:#e4ff5e!important;animation:dkd-v075-login-entry-icon 1.45s ease-in-out infinite!important}
    .dkd-v075-login-entry:active{transform:scale(.985)!important}

    #dkd-modal:has(.dkd-v075-test-sheet) [data-dkd-action='v075-test-own-login']{position:relative!important;overflow:hidden!important;min-height:58px!important;border:2px solid #8ea8e8!important;border-left:8px solid #ef91c0!important;border-radius:17px!important;background:#273b67!important;color:#fff!important;font-weight:950!important;letter-spacing:.2px!important;animation:dkd-v075-own-login-live 2.7s ease-in-out infinite!important}
    #dkd-modal:has(.dkd-v075-test-sheet) [data-dkd-action='v075-test-own-login']:after{content:'';position:absolute;left:16px;right:16px;bottom:5px;height:3px;border-radius:999px;background:#76dfd3;transform-origin:right center;animation:dkd-v075-own-login-meter 2.7s ease-in-out infinite!important;pointer-events:none}
    #dkd-modal:has(.dkd-v075-test-sheet) [data-dkd-action='v075-test-own-login'] svg{color:#7fe4d8!important;animation:dkd-v075-own-login-icon 1.8s ease-in-out infinite!important}
    #dkd-modal:has(.dkd-v075-test-sheet) [data-dkd-action='v075-test-auto-login']{min-height:60px!important;border:2px solid #f0ff9f!important;border-left:8px solid #6fe0d3!important;border-radius:17px!important;background:#e4ff5e!important;color:#172435!important}

    @keyframes dkd-v075-login-entry-live{0%,100%{background:#173f55;border-color:#71e1d4}50%{background:#233d69;border-color:#8da9ef}}
    @keyframes dkd-v075-login-entry-meter{0%,100%{transform:scaleX(.28);opacity:.72}50%{transform:scaleX(1);opacity:1}}
    @keyframes dkd-v075-login-entry-icon{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
    @keyframes dkd-v075-own-login-live{0%,100%{background:#273b67;border-color:#8ea8e8}50%{background:#3b315b;border-color:#ef91c0}}
    @keyframes dkd-v075-own-login-meter{0%,100%{transform:scaleX(.32);opacity:.72}50%{transform:scaleX(1);opacity:1}}
    @keyframes dkd-v075-own-login-icon{0%,100%{transform:translateX(0)}50%{transform:translateX(3px)}}
    html[data-dkd-motion='off'] .dkd-v075-login-entry,html[data-dkd-motion='off'] .dkd-v075-login-entry:after,html[data-dkd-motion='off'] .dkd-v075-login-entry svg,html[data-dkd-motion='off'] #dkd-modal:has(.dkd-v075-test-sheet) [data-dkd-action='v075-test-own-login'],html[data-dkd-motion='off'] #dkd-modal:has(.dkd-v075-test-sheet) [data-dkd-action='v075-test-own-login']:after,html[data-dkd-motion='off'] #dkd-modal:has(.dkd-v075-test-sheet) [data-dkd-action='v075-test-own-login'] svg{animation:none!important;transform:none!important}
    @media(prefers-reduced-motion:reduce){.dkd-v075-login-entry,.dkd-v075-login-entry:after,.dkd-v075-login-entry svg,#dkd-modal:has(.dkd-v075-test-sheet) [data-dkd-action='v075-test-own-login'],#dkd-modal:has(.dkd-v075-test-sheet) [data-dkd-action='v075-test-own-login']:after,#dkd-modal:has(.dkd-v075-test-sheet) [data-dkd-action='v075-test-own-login'] svg{animation:none!important;transform:none!important}}
  `;
  document.head.appendChild(dkd_style);
}
dkd_v075LoginTriggerInstallStyles();

function dkd_v075LoginTestSeen() {
  try { return localStorage.getItem(dkd_v075LoginTestKey) === '1'; } catch { return window.dkd_v075LoginTestSeen === true; }
}

function dkd_v075MarkLoginTestSeen() {
  window.dkd_v075LoginTestSeen = true;
  try { localStorage.setItem(dkd_v075LoginTestKey, '1'); } catch {}
}

function dkd_v075OpenLoginTest(dkd_game) {
  if (!dkd_game || dkd_game.dkd_pageName !== 'intro' || dkd_game.dkd_v04Authenticated === true || dkd_v075LoginTestSeen()) return false;
  dkd_v075MarkLoginTestSeen();
  const dkd_body = `<div class="dkd-v075-test-sheet"><div class="dkd-v075-test-hero"><span class="dkd-v075-test-icon">${dkd_icon('play',27)}</span><div><small>TEK SEFERLİK TEST BİLGİSİ</small><b>Siparişler Seni Bekliyor</b></div></div><div class="dkd-v075-test-copy">Oyunu önce hazır test hesabıyla deneyebilirsin. Otomatik giriş, aşağıdaki test hesabını kullanır.</div><div class="dkd-v075-test-account"><div class="dkd-v075-test-credential"><span>MAIL</span><b>${dkd_escape(dkd_v075LoginTestAccount.dkd_email)}</b></div><div class="dkd-v075-test-credential"><span>ŞİFRE</span><b>${dkd_escape(dkd_v075LoginTestAccount.dkd_password)}</b></div></div></div>`;
  const dkd_buttons = `${dkd_button('OTOMATİK GİRİŞ YAP','v075-test-auto-login','fingerprint')}${dkd_button('KENDİ HESABIMLA DEVAM ET','v075-test-own-login','arrow','dkd-secondary')}`;
  dkd_game.dkd_modal('TEST ET SİPARİŞLER SENİ BEKLİYOR', dkd_body, dkd_buttons);
  return true;
}

dkd_Game.prototype.dkd_render = function dkd_v075LoginTriggerRender(dkd_pageName, dkd_arg = null) {
  const dkd_result = dkd_v075LoginTriggerPrevious.dkd_render.call(this, dkd_pageName, dkd_arg);
  if (dkd_pageName === 'intro') {
    // The previous onboarding layer used a first-render timer. Cancel it: the test offer now belongs to the login tap only.
    clearTimeout(this.dkd_v075TestEntryTimer);
    this.dkd_v075TestEntryTimer = null;
    const dkd_login = this.dkd_root?.querySelector?.('[data-dkd-action="v04-login"]');
    if (dkd_login) dkd_login.classList.add('dkd-v075-login-entry');
  }
  return dkd_result;
};

dkd_Game.prototype.dkd_action = function dkd_v075LoginTriggerAction(dkd_action) {
  const dkd_command = String(dkd_action || '');
  if (dkd_command === 'v04-login' && this.dkd_pageName === 'intro' && this.dkd_v04Authenticated !== true && !dkd_v075LoginTestSeen()) {
    dkd_v075OpenLoginTest(this);
    return;
  }
  if (dkd_command === 'v075-test-own-login') {
    this.dkd_closeModal?.();
    return dkd_v075LoginTriggerPrevious.dkd_action.call(this, 'v04-login');
  }
  return dkd_v075LoginTriggerPrevious.dkd_action.call(this, dkd_action);
};

window.dkd_lastMileV075LoginTestTrigger = {
  dkd_popupOnFirstLoginTapOnly: true,
  dkd_popupOnIntroRender: false,
  dkd_loginIconPreserved: true,
  dkd_ownAccountContinuesToLogin: true,
  dkd_androidWebShared: true,
  dkd_flatColorsOnly: true,
};

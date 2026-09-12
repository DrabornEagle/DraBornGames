// DraBornGo / Last Mile v0.7.5 — Courier Center identity + goal + static shift CTA polish.
// Shared Android/Expo + Web presentation layer. Flat colors only: no gradient, shadow or glow.
function dkd_v075HomeIdentityInstallStyles() {
  if (document.getElementById('dkd-v075-home-identity-polish-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v075-home-identity-polish-style';
  dkd_style.textContent = `
    /* Move Ad Soyad + level + rating + season as one cluster materially lower. */
    .dkd-home-header{display:block!important;position:relative!important;align-items:initial!important}
    .dkd-home-header .dkd-player-name{margin:150px 0 8px!important}
    .dkd-home-header .dkd-season-pill{position:absolute!important;left:20px!important;top:122px!important;margin:0!important;z-index:2!important;align-self:auto!important;animation:dkd-v075-season-badge-arrive .42s cubic-bezier(.2,.8,.2,1) both!important}

    /* Level + rating stay immediately below Ad Soyad. */
    .dkd-home-header .dkd-profile-pills{gap:9px!important;margin-top:8px!important;margin-bottom:8px!important}
    .dkd-home-header .dkd-profile-pills>span{position:relative!important;overflow:hidden!important;min-height:35px!important;padding:8px 11px!important;border:1px solid #6688bf!important;border-top:4px solid #83a7ff!important;border-radius:13px!important;background:#243b67!important;color:#dce8ff!important;font-size:11px!important;font-weight:900!important;letter-spacing:.15px!important;animation:dkd-v075-profile-badge-in .46s cubic-bezier(.2,.8,.2,1) both!important}
    .dkd-home-header .dkd-profile-pills>span:nth-child(2){border-color:#8a7441!important;border-top-color:#f2ca6c!important;background:#493c29!important;color:#fff0b1!important;animation-delay:.08s!important}
    .dkd-home-header .dkd-profile-pills>span svg{width:19px!important;height:19px!important}
    .dkd-home-header .dkd-profile-pills>span:first-child svg{color:#a9c2ff!important;animation:dkd-v075-level-icon 2.4s ease-in-out infinite!important}
    .dkd-home-header .dkd-profile-pills>span:nth-child(2) svg{color:#ffe17f!important;animation:dkd-v075-rating-icon 2.1s ease-in-out infinite!important}
    .dkd-home-header .dkd-profile-pills>span:after{content:'';position:absolute;left:10px;right:10px;bottom:3px;height:2px;border-radius:999px;background:#69d9ce;transform-origin:left center;animation:dkd-v075-badge-meter 2.6s ease-in-out infinite!important}
    .dkd-home-header .dkd-profile-pills>span:nth-child(2):after{background:#f2ca6c;animation-delay:.2s!important}

    /* Modern single-rail goal progress with a clear live end marker. */
    .dkd-contract-mini .dkd-progress{position:relative!important;height:12px!important;margin-top:13px!important;padding:2px!important;border:1px solid #56778b!important;border-radius:999px!important;background:#0d2433!important;overflow:visible!important}
    .dkd-contract-mini .dkd-progress span{position:relative!important;display:block!important;height:100%!important;min-width:10px!important;border-radius:999px!important;background:#67ded0!important;transform-origin:left center!important;animation:dkd-v075-goal-progress-color .75s cubic-bezier(.2,.8,.2,1) both!important}
    .dkd-contract-mini .dkd-progress span:before{content:'';position:absolute;right:2px;top:50%;width:7px;height:7px;border:2px solid #24475a;border-radius:50%;background:#e4ff5e;transform:translateY(-50%);pointer-events:none}
    .dkd-contract-mini .dkd-progress span:after{content:'';position:absolute;right:14px;top:50%;width:18px;height:2px;border-radius:999px;background:#eaf7f4;transform:translateY(-50%);opacity:.8;pointer-events:none}

    /* Keep the larger shift CTA completely static. */
    .dkd-shift-action .dkd-button{position:relative!important;min-height:64px!important;font-size:17px!important;font-weight:950!important;letter-spacing:.7px!important;border:1px solid #f1ff9b!important;background:#e4ff5e!important;animation:none!important;transform:none!important}
    .dkd-shift-action .dkd-button svg{width:26px!important;height:26px!important;animation:none!important;transform:none!important}
    .dkd-shift-action .dkd-button:after{display:none!important;content:none!important;animation:none!important}

    @keyframes dkd-v075-season-badge-arrive{from{opacity:0;transform:translateY(7px) scale(.97)}to{opacity:1;transform:none}}
    @keyframes dkd-v075-profile-badge-in{from{opacity:0;transform:translateY(8px) scale(.96)}to{opacity:1;transform:none}}
    @keyframes dkd-v075-level-icon{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
    @keyframes dkd-v075-rating-icon{0%,100%{transform:rotate(0) scale(1)}50%{transform:rotate(8deg) scale(1.08)}}
    @keyframes dkd-v075-badge-meter{0%,100%{transform:scaleX(.35);opacity:.65}50%{transform:scaleX(1);opacity:1}}
    @keyframes dkd-v075-goal-progress-color{from{transform:scaleX(0)}to{transform:scaleX(1)}}

    /* Short mobile viewports still move the whole cluster down, not back to the old position. */
    @media(max-height:760px){
      .dkd-home-header .dkd-player-name{margin-top:128px!important}
      .dkd-home-header .dkd-season-pill{top:100px!important}
      .dkd-shift-action .dkd-button{min-height:58px!important;font-size:16px!important}
    }
    @media(max-width:370px){
      .dkd-home-header .dkd-season-pill{left:17px!important}
      .dkd-home-header .dkd-profile-pills{gap:6px!important}
      .dkd-home-header .dkd-profile-pills>span{padding:7px 8px!important;font-size:10px!important}
      .dkd-shift-action .dkd-button{font-size:16px!important}
    }
    html[data-dkd-motion='off'] .dkd-home-header .dkd-season-pill,
    html[data-dkd-motion='off'] .dkd-home-header .dkd-profile-pills>span,
    html[data-dkd-motion='off'] .dkd-home-header .dkd-profile-pills>span svg,
    html[data-dkd-motion='off'] .dkd-home-header .dkd-profile-pills>span:after,
    html[data-dkd-motion='off'] .dkd-contract-mini .dkd-progress span{animation:none!important;transform:none!important}
    @media(prefers-reduced-motion:reduce){
      .dkd-home-header .dkd-season-pill,.dkd-home-header .dkd-profile-pills>span,.dkd-home-header .dkd-profile-pills>span svg,.dkd-home-header .dkd-home-header .dkd-profile-pills>span:after,.dkd-contract-mini .dkd-progress span{animation:none!important;transform:none!important}
    }
  `;
  document.head.appendChild(dkd_style);
}

dkd_v075HomeIdentityInstallStyles();
window.dkd_lastMileV075HomeIdentityPolish = {
  dkd_nameHistoricalMargin: 150,
  dkd_compactNameMargin: 128,
  dkd_seasonBadgeTop: 122,
  dkd_compactSeasonBadgeTop: 100,
  dkd_seasonBadgeAboveName: true,
  dkd_identityClusterLoweredFurther: true,
  dkd_shiftButtonStatic: true,
  dkd_flatColorsOnly: true,
};

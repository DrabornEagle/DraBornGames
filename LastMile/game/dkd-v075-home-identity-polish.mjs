// DraBornGo / Last Mile v0.7.5 — Courier Center identity + goal + static shift CTA polish.
// Shared Android/Expo + Web presentation layer. Flat colors only: no gradient, shadow or glow.
function dkd_v075HomeIdentityInstallStyles() {
  if (document.getElementById('dkd-v075-home-identity-polish-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v075-home-identity-polish-style';
  dkd_style.textContent = `
    /* Compact identity: season stays left; level and rating sit directly to its right. */
    .dkd-home-header{display:block!important;position:relative!important;align-items:initial!important;padding-top:0!important;min-height:124px!important}
    .dkd-home-header .dkd-player-name{margin:68px 0 5px!important}
    .dkd-home-header .dkd-season-pill{position:absolute!important;left:20px!important;top:28px!important;margin:0!important;z-index:3!important;align-self:auto!important;animation:dkd-v075-season-badge-arrive .42s cubic-bezier(.2,.8,.2,1) both!important}
    .dkd-home-header .dkd-profile-pills{position:absolute!important;left:218px!important;right:18px!important;top:27px!important;z-index:3!important;display:flex!important;align-items:center!important;gap:6px!important;margin:0!important;min-width:0!important}
    .dkd-home-header .dkd-profile-pills>span{position:relative!important;overflow:hidden!important;min-height:31px!important;padding:6px 8px!important;border:1px solid #6688bf!important;border-top:3px solid #83a7ff!important;border-radius:11px!important;background:#243b67!important;color:#dce8ff!important;font-size:9.5px!important;font-weight:900!important;letter-spacing:0!important;white-space:nowrap!important;animation:dkd-v075-profile-badge-in .46s cubic-bezier(.2,.8,.2,1) both!important}
    .dkd-home-header .dkd-profile-pills>span:nth-child(2){border-color:#8a7441!important;border-top-color:#f2ca6c!important;background:#493c29!important;color:#fff0b1!important;animation-delay:.08s!important}
    .dkd-home-header .dkd-profile-pills>small{display:none!important}
    .dkd-home-header .dkd-profile-pills>span svg{width:15px!important;height:15px!important}
    .dkd-home-header .dkd-profile-pills>span:first-child svg{color:#a9c2ff!important;animation:dkd-v075-level-icon 2.4s ease-in-out infinite!important}
    .dkd-home-header .dkd-profile-pills>span:nth-child(2) svg{color:#ffe17f!important;animation:dkd-v075-rating-icon 2.1s ease-in-out infinite!important}
    .dkd-home-header .dkd-profile-pills>span:after{content:'';position:absolute;left:8px;right:8px;bottom:2px;height:2px;border-radius:999px;background:#69d9ce;transform-origin:left center;animation:dkd-v075-badge-meter 2.6s ease-in-out infinite!important}
    .dkd-home-header .dkd-profile-pills>span:nth-child(2):after{background:#f2ca6c;animation-delay:.2s!important}

    /* Modern single-rail goal progress with a clear live end marker. */
    .dkd-contract-mini .dkd-progress{position:relative!important;height:12px!important;margin-top:13px!important;padding:2px!important;border:1px solid #56778b!important;border-radius:999px!important;background:#0d2433!important;overflow:visible!important}
    .dkd-contract-mini .dkd-progress span{position:relative!important;display:block!important;height:100%!important;min-width:10px!important;border-radius:999px!important;background:#67ded0!important;transform-origin:left center!important;animation:dkd-v075-goal-progress-color .75s cubic-bezier(.2,.8,.2,1) both!important}
    .dkd-contract-mini .dkd-progress span:before{content:'';position:absolute;right:2px;top:50%;width:7px;height:7px;border:2px solid #24475a;border-radius:50%;background:#e4ff5e;transform:translateY(-50%);pointer-events:none}
    .dkd-contract-mini .dkd-progress span:after{content:'';position:absolute;right:14px;top:50%;width:18px;height:2px;border-radius:999px;background:#eaf7f4;transform:translateY(-50%);opacity:.8;pointer-events:none}

    /* Keep the larger shift CTA completely static. */
    .dkd-shift-action .dkd-button{position:relative!important;min-height:60px!important;font-size:17px!important;font-weight:950!important;letter-spacing:.7px!important;border:1px solid #f1ff9b!important;background:#e4ff5e!important;animation:none!important;transform:none!important}
    .dkd-shift-action .dkd-button svg{width:25px!important;height:25px!important;animation:none!important;transform:none!important}
    .dkd-shift-action .dkd-button:after{display:none!important;content:none!important;animation:none!important}

    /* Fit the complete bottom quick menu without lifting it over the management signs. */
    @media(max-height:900px){
      .dkd-home-header{min-height:110px!important}
      .dkd-home-header .dkd-player-name{margin-top:61px!important;margin-bottom:3px!important;font-size:31px!important}
      .dkd-home-header .dkd-season-pill{top:23px!important}
      .dkd-home-header .dkd-profile-pills{top:22px!important}
      .dkd-home-hero{min-height:118px!important}
      .dkd-hub-tag{bottom:14px!important}
      .dkd-home-bottom{padding-top:0!important;padding-bottom:calc(8px + var(--dkd-bottom))!important}
      .dkd-contract-mini{padding:11px 13px!important;margin-bottom:8px!important}
      .dkd-contract-mini .dkd-progress{margin-top:9px!important}
      .dkd-goal-milestones{margin-top:8px!important}
      .dkd-shift-action .dkd-button{min-height:54px!important;font-size:16px!important}
      .dkd-home-actions{margin-top:8px!important;gap:6px!important}
      .dkd-home-actions button{padding:7px 3px!important;gap:4px!important}
    }
    @media(max-width:390px){
      .dkd-home-header .dkd-season-pill{left:17px!important;font-size:8.5px!important;padding-left:8px!important;padding-right:8px!important}
      .dkd-home-header .dkd-profile-pills{left:199px!important;right:14px!important;gap:4px!important}
      .dkd-home-header .dkd-profile-pills>span{padding:6px 6px!important;font-size:8.5px!important}
      .dkd-home-header .dkd-profile-pills>span svg{width:13px!important;height:13px!important}
    }

    @keyframes dkd-v075-season-badge-arrive{from{opacity:0;transform:translateY(7px) scale(.97)}to{opacity:1;transform:none}}
    @keyframes dkd-v075-profile-badge-in{from{opacity:0;transform:translateY(8px) scale(.96)}to{opacity:1;transform:none}}
    @keyframes dkd-v075-level-icon{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
    @keyframes dkd-v075-rating-icon{0%,100%{transform:rotate(0) scale(1)}50%{transform:rotate(8deg) scale(1.08)}}
    @keyframes dkd-v075-badge-meter{0%,100%{transform:scaleX(.35);opacity:.65}50%{transform:scaleX(1);opacity:1}}
    @keyframes dkd-v075-goal-progress-color{from{transform:scaleX(0)}to{transform:scaleX(1)}}

    html[data-dkd-motion='off'] .dkd-home-header .dkd-season-pill,
    html[data-dkd-motion='off'] .dkd-home-header .dkd-profile-pills>span,
    html[data-dkd-motion='off'] .dkd-home-header .dkd-profile-pills>span svg,
    html[data-dkd-motion='off'] .dkd-home-header .dkd-profile-pills>span:after,
    html[data-dkd-motion='off'] .dkd-contract-mini .dkd-progress span{animation:none!important;transform:none!important}
    @media(prefers-reduced-motion:reduce){
      .dkd-home-header .dkd-season-pill,.dkd-home-header .dkd-profile-pills>span,.dkd-home-header .dkd-profile-pills>span svg,.dkd-home-header .dkd-profile-pills>span:after,.dkd-contract-mini .dkd-progress span{animation:none!important;transform:none!important}
    }
  `;
  document.head.appendChild(dkd_style);
}

dkd_v075HomeIdentityInstallStyles();
window.dkd_lastMileV075HomeIdentityPolish = {
  dkd_seasonBadgeTop: 28,
  dkd_profileBadgesTop: 27,
  dkd_profileBadgesRightOfSeason: true,
  dkd_playerNameBelowBadgeRow: true,
  dkd_bottomQuickMenuViewportFit: true,
  dkd_managementSignsProtected: true,
  dkd_shiftButtonStatic: true,
  dkd_flatColorsOnly: true,
};

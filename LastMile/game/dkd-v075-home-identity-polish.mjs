// DraBornGo / Last Mile v0.7.5 — Courier Center identity, level details and goal polish.
// Shared Android/Expo + Web presentation layer. Flat colors only: no gradient, shadow or glow.
const dkd_v075HomeIdentityPrevious = {
  dkd_render: dkd_Game.prototype.dkd_render,
  dkd_action: dkd_Game.prototype.dkd_action,
};

function dkd_v075HomeIdentityInstallStyles() {
  if (document.getElementById('dkd-v075-home-identity-polish-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v075-home-identity-polish-style';
  dkd_style.textContent = `
    /* Player name keeps its established position. The three badges move down as one centered row,
       directly below the SON KİLOMETRE / KURYE MERKEZİ wall sign. */
    .dkd-home-header{display:block!important;position:relative!important;align-items:initial!important;padding-top:0!important;min-height:124px!important;overflow:visible!important}
    .dkd-home-header .dkd-player-name{margin:68px 0 5px!important}
    .dkd-v075-badge-row{position:absolute!important;left:50%!important;top:188px!important;z-index:6!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;width:calc(100% - 24px)!important;max-width:620px!important;transform:translateX(-50%)!important;pointer-events:auto!important}
    .dkd-v075-badge-row .dkd-season-pill{position:static!important;left:auto!important;top:auto!important;right:auto!important;margin:0!important;align-self:auto!important;flex:0 1 auto!important;max-width:48%!important;min-height:34px!important;padding:6px 9px!important;font-size:8.8px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;animation:dkd-v075-season-badge-arrive .42s cubic-bezier(.2,.8,.2,1) both!important}
    .dkd-v075-badge-row .dkd-profile-pills{position:static!important;left:auto!important;right:auto!important;top:auto!important;z-index:auto!important;display:flex!important;align-items:center!important;flex-wrap:nowrap!important;gap:4px!important;margin:0!important;min-width:0!important}
    .dkd-v075-badge-row .dkd-profile-pills>span{position:relative!important;overflow:hidden!important;min-height:34px!important;padding:6px 7px!important;border:1px solid #6688bf!important;border-top:3px solid #83a7ff!important;border-radius:11px!important;background:#243b67!important;color:#dce8ff!important;font-size:8.8px!important;font-weight:900!important;letter-spacing:0!important;white-space:nowrap!important;animation:dkd-v075-profile-badge-in .46s cubic-bezier(.2,.8,.2,1) both!important;cursor:pointer!important;touch-action:manipulation!important}
    .dkd-v075-badge-row .dkd-profile-pills>span:nth-child(2){border-color:#8a7441!important;border-top-color:#f2ca6c!important;background:#493c29!important;color:#fff0b1!important;animation-delay:.08s!important}
    .dkd-v075-badge-row .dkd-profile-pills>span:focus-visible{outline:2px solid #e4ff5e!important;outline-offset:2px!important}
    .dkd-v075-badge-row .dkd-profile-pills>small{display:none!important}
    .dkd-v075-badge-row .dkd-profile-pills>span svg{width:14px!important;height:14px!important}
    .dkd-v075-badge-row .dkd-profile-pills>span:first-child svg{color:#a9c2ff!important;animation:dkd-v075-level-icon 2.4s ease-in-out infinite!important}
    .dkd-v075-badge-row .dkd-profile-pills>span:nth-child(2) svg{color:#ffe17f!important;animation:dkd-v075-rating-icon 2.1s ease-in-out infinite!important}
    .dkd-v075-badge-row .dkd-profile-pills>span:after{content:'';position:absolute;left:7px;right:7px;bottom:2px;height:2px;border-radius:999px;background:#69d9ce;transform-origin:left center;animation:dkd-v075-badge-meter 2.6s ease-in-out infinite!important}
    .dkd-v075-badge-row .dkd-profile-pills>span:nth-child(2):after{background:#f2ca6c;animation-delay:.2s!important}

    /* Vehicle badge is attached immediately above the reward-vault button. */
    .dkd-home-hero .dkd-vehicle-label{top:auto!important;right:18px!important;bottom:68px!important;z-index:4!important;margin:0!important}

    /* Level detail sheet. */
    .dkd-v075-level-sheet{display:grid;gap:12px;text-align:left}
    .dkd-v075-level-hero{display:flex;align-items:center;gap:12px;padding:14px;border:1px solid #5d78a0;border-left:6px solid #83a7ff;border-radius:16px;background:#1b3152}
    .dkd-v075-level-icon{width:48px;height:48px;display:grid;place-items:center;flex:0 0 auto;border:1px solid #7894bd;border-radius:14px;background:#29476f;color:#bed0ff}.dkd-v075-level-icon svg{width:25px;height:25px}
    .dkd-v075-level-hero small{display:block;color:#aebfda;font-size:9px;font-weight:900;letter-spacing:1px}.dkd-v075-level-hero b{display:block;margin-top:3px;color:#fff;font-size:21px}
    .dkd-v075-level-xp{padding:13px;border:1px solid #48627e;border-radius:15px;background:#10243a}.dkd-v075-level-between{display:flex;justify-content:space-between;align-items:end;gap:10px}.dkd-v075-level-between span{font-size:10px;font-weight:900;color:#aabdd3}.dkd-v075-level-between b{font-size:18px;color:#eaf1ff;font-variant-numeric:tabular-nums}
    .dkd-v075-level-track{height:8px;margin-top:10px;border-radius:999px;background:#071726;overflow:hidden}.dkd-v075-level-track span{display:block;height:100%;width:var(--dkd-level-progress);border-radius:999px;background:#6bdacf;transform-origin:left center;animation:dkd-v075-level-progress .55s ease-out both}
    .dkd-v075-level-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.dkd-v075-level-stat{padding:12px;border:1px solid #405b78;border-radius:13px;background:#182b43}.dkd-v075-level-stat small{display:block;font-size:9px;font-weight:900;letter-spacing:.7px;color:#9fb4cc}.dkd-v075-level-stat b{display:block;margin-top:4px;font-size:17px;color:#f3f7ff;font-variant-numeric:tabular-nums}
    .dkd-v075-level-how{padding:13px;border-left:5px solid #69d9ce;border-radius:13px;background:#16333d;color:#cee4e7;font-size:11px;line-height:1.6}.dkd-v075-level-how b{display:block;margin-bottom:5px;color:#fff;font-size:12px}

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
      .dkd-v075-badge-row{top:170px!important}
      .dkd-home-hero{min-height:118px!important}
      .dkd-home-hero .dkd-vehicle-label{bottom:64px!important}
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
      .dkd-v075-badge-row{width:calc(100% - 16px)!important;gap:3px!important}
      .dkd-v075-badge-row .dkd-season-pill{max-width:47%!important;font-size:8px!important;padding:6px 7px!important}
      .dkd-v075-badge-row .dkd-profile-pills{gap:3px!important}
      .dkd-v075-badge-row .dkd-profile-pills>span{padding:6px 5px!important;font-size:8px!important}
      .dkd-v075-badge-row .dkd-profile-pills>span svg{width:12px!important;height:12px!important}
    }

    @keyframes dkd-v075-season-badge-arrive{from{opacity:0;transform:translateY(7px) scale(.97)}to{opacity:1;transform:none}}
    @keyframes dkd-v075-profile-badge-in{from{opacity:0;transform:translateY(8px) scale(.96)}to{opacity:1;transform:none}}
    @keyframes dkd-v075-level-icon{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
    @keyframes dkd-v075-rating-icon{0%,100%{transform:rotate(0) scale(1)}50%{transform:rotate(8deg) scale(1.08)}}
    @keyframes dkd-v075-badge-meter{0%,100%{transform:scaleX(.35);opacity:.65}50%{transform:scaleX(1);opacity:1}}
    @keyframes dkd-v075-goal-progress-color{from{transform:scaleX(0)}to{transform:scaleX(1)}}
    @keyframes dkd-v075-level-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}

    html[data-dkd-motion='off'] .dkd-v075-badge-row .dkd-season-pill,
    html[data-dkd-motion='off'] .dkd-v075-badge-row .dkd-profile-pills>span,
    html[data-dkd-motion='off'] .dkd-v075-badge-row .dkd-profile-pills>span svg,
    html[data-dkd-motion='off'] .dkd-v075-badge-row .dkd-profile-pills>span:after,
    html[data-dkd-motion='off'] .dkd-contract-mini .dkd-progress span,
    html[data-dkd-motion='off'] .dkd-v075-level-track span{animation:none!important;transform:none!important}
    @media(prefers-reduced-motion:reduce){
      .dkd-v075-badge-row .dkd-season-pill,.dkd-v075-badge-row .dkd-profile-pills>span,.dkd-v075-badge-row .dkd-profile-pills>span svg,.dkd-v075-badge-row .dkd-profile-pills>span:after,.dkd-contract-mini .dkd-progress span,.dkd-v075-level-track span{animation:none!important;transform:none!important}
    }
  `;
  document.head.appendChild(dkd_style);
}

dkd_v075HomeIdentityInstallStyles();

function dkd_v075HomeIdentityArrange(dkd_game) {
  if (dkd_game?.dkd_pageName !== 'home' || !dkd_game?.dkd_root) return;
  const dkd_header = dkd_game.dkd_root.querySelector('.dkd-home-header');
  const dkd_season = dkd_header?.querySelector('.dkd-season-pill');
  const dkd_pills = dkd_header?.querySelector('.dkd-profile-pills');
  if (!dkd_header || !dkd_season || !dkd_pills) return;
  let dkd_row = dkd_header.querySelector('.dkd-v075-badge-row');
  if (!dkd_row) {
    dkd_row = document.createElement('div');
    dkd_row.className = 'dkd-v075-badge-row';
    dkd_row.setAttribute('aria-label','Sezon, seviye ve itibar');
    dkd_header.appendChild(dkd_row);
  }
  if (dkd_season.parentElement !== dkd_row) dkd_row.appendChild(dkd_season);
  if (dkd_pills.parentElement !== dkd_row) dkd_row.appendChild(dkd_pills);
  const dkd_levelBadge = dkd_pills.children[0];
  const dkd_ratingBadge = dkd_pills.children[1];
  if (dkd_levelBadge) {
    dkd_levelBadge.dataset.dkdAction = 'v075-level-detail';
    dkd_levelBadge.setAttribute('role','button');
    dkd_levelBadge.setAttribute('tabindex','0');
    dkd_levelBadge.setAttribute('aria-label','Seviye detaylarını aç');
  }
  if (dkd_ratingBadge) {
    dkd_ratingBadge.dataset.dkdAction = 'reputation';
    dkd_ratingBadge.setAttribute('role','button');
    dkd_ratingBadge.setAttribute('tabindex','0');
    dkd_ratingBadge.setAttribute('aria-label','İtibar sayfasını aç');
  }
}

function dkd_v075HomeIdentityOpenLevel(dkd_game) {
  const dkd_state = dkd_game.dkd_state;
  const dkd_currentLevel = dkd_level(dkd_state);
  const dkd_currentXp = Math.max(0, Math.floor(Number(dkd_state.dkd_xp || 0)));
  const dkd_levelFloor = Math.max(0, Math.pow(Math.max(0, dkd_currentLevel - 1), 2) * 160);
  const dkd_nextLevelXp = Math.pow(dkd_currentLevel, 2) * 160;
  const dkd_levelSpan = Math.max(1, dkd_nextLevelXp - dkd_levelFloor);
  const dkd_levelProgress = Math.max(0, Math.min(100, Math.round((dkd_currentXp - dkd_levelFloor) / dkd_levelSpan * 100)));
  const dkd_remainingXp = Math.max(0, dkd_nextLevelXp - dkd_currentXp);
  const dkd_onTimeRate = dkd_state.dkd_deliveries ? Math.round(Number(dkd_state.dkd_onTime || 0) / dkd_state.dkd_deliveries * 100) : 0;
  const dkd_damageFreeRate = dkd_state.dkd_deliveries ? Math.round(Number(dkd_state.dkd_damageFree || 0) / dkd_state.dkd_deliveries * 100) : 0;
  const dkd_body = `<div class="dkd-v075-level-sheet"><div class="dkd-v075-level-hero"><span class="dkd-v075-level-icon">${dkd_icon('bolt',25)}</span><div><small>KURYE KARİYERİ</small><b>SEVİYE ${dkd_currentLevel}</b></div></div><div class="dkd-v075-level-xp"><div class="dkd-v075-level-between"><span>BİR SONRAKİ SEVİYE</span><b>${dkd_currentXp.toLocaleString('tr-TR')} / ${dkd_nextLevelXp.toLocaleString('tr-TR')} XP</b></div><div class="dkd-v075-level-track"><span style="--dkd-level-progress:${dkd_levelProgress}%"></span></div></div><div class="dkd-v075-level-grid"><div class="dkd-v075-level-stat"><small>KALAN XP</small><b>${dkd_remainingXp.toLocaleString('tr-TR')}</b></div><div class="dkd-v075-level-stat"><small>TESLİMAT</small><b>${Math.floor(Number(dkd_state.dkd_deliveries || 0)).toLocaleString('tr-TR')}</b></div><div class="dkd-v075-level-stat"><small>ZAMANINDA</small><b>%${dkd_onTimeRate}</b></div><div class="dkd-v075-level-stat"><small>HASARSIZ</small><b>%${dkd_damageFreeRate}</b></div></div><div class="dkd-v075-level-how"><b>SEVİYE NASIL YÜKSELİR?</b>Teslimatları tamamlayarak XP kazanırsın. Zorlu siparişler, iyi sürüş, zamanında ve yüksek kaliteli teslimatlar kariyer ilerlemeni hızlandırır. Seviyen yükseldikçe daha güçlü araçlara ve daha yüksek sınıf işlere yaklaşırsın.</div></div>`;
  dkd_game.dkd_modal(`Seviye ${dkd_currentLevel}`, dkd_body, dkd_button('KAPAT','modal-close','close'));
}

dkd_Game.prototype.dkd_render = function dkd_v075HomeIdentityRender(dkd_pageName, dkd_arg = null) {
  const dkd_result = dkd_v075HomeIdentityPrevious.dkd_render.call(this, dkd_pageName, dkd_arg);
  dkd_v075HomeIdentityArrange(this);
  return dkd_result;
};

dkd_Game.prototype.dkd_action = function dkd_v075HomeIdentityAction(dkd_action) {
  if (String(dkd_action || '') === 'v075-level-detail') {
    dkd_v075HomeIdentityOpenLevel(this);
    return;
  }
  return dkd_v075HomeIdentityPrevious.dkd_action.call(this, dkd_action);
};

document.addEventListener('keydown', dkd_event => {
  if (!['Enter',' '].includes(dkd_event.key)) return;
  const dkd_target = dkd_event.target?.closest?.('.dkd-v075-badge-row [data-dkd-action]');
  if (!dkd_target) return;
  dkd_event.preventDefault();
  dkd_target.click();
});

window.dkd_lastMileV075HomeIdentityPolish = {
  dkd_badgeRowTop: 188,
  dkd_seasonLevelRatingSingleRow: true,
  dkd_badgeRowCenteredBelowCourierSign: true,
  dkd_levelBadgeOpensDetail: true,
  dkd_ratingBadgeOpensReputation: true,
  dkd_vehicleBadgeAboveVault: true,
  dkd_bottomQuickMenuViewportFit: true,
  dkd_managementSignsProtected: true,
  dkd_shiftButtonStatic: true,
  dkd_flatColorsOnly: true,
};

// DraBornGo / Last Mile v0.5 visual style layer.
function dkd_v05InstallStyles() {
  if (document.getElementById('dkd-v05-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v05-style';
  dkd_style.textContent = `
    .dkd-player-name{margin:72px 0 8px!important}
    .dkd-home-header .dkd-profile-pills{margin-top:10px!important;margin-bottom:8px!important}
    .dkd-v04-brand-pills{display:flex!important;flex-wrap:nowrap!important;align-items:center!important;gap:5px!important;width:100%!important;overflow:visible!important}
    .dkd-v04-brand-pills>span{grid-column:auto!important;justify-self:auto!important;white-space:nowrap!important;padding:6px 8px!important;font-size:9px!important;letter-spacing:.15px!important;gap:4px!important;min-width:0!important}
    .dkd-v04-brand-pills>span svg{width:13px!important;height:13px!important;flex:0 0 auto}

    .dkd-v05-music-intro{border:1px solid #405273;border-radius:25px;background:#17243c;padding:19px;position:relative;overflow:hidden}
    .dkd-v05-music-intro:before{content:'';position:absolute;left:0;top:0;bottom:0;width:7px;background:#e982b7}
    .dkd-v05-music-now{display:flex;align-items:center;gap:13px;margin-top:15px;padding:13px;border:1px solid #4c5f82;border-radius:18px;background:#1d2c49}
    .dkd-v05-music-now>span{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;background:#e982b7;color:#17243a;animation:dkd-v05-music-pulse 1.8s ease-in-out infinite}
    .dkd-v05-music-list{display:grid;gap:11px;margin-top:16px}
    .dkd-v05-track{--dkd-track:#8aa7ee;display:grid;grid-template-columns:52px 1fr auto;align-items:center;gap:12px;min-height:82px;width:100%;padding:13px;border:1px solid #405273;border-left:6px solid var(--dkd-track);border-radius:20px;background:#192640;color:#edf3ff;text-align:left;transition:transform .16s ease,border-color .16s ease,background-color .16s ease}
    .dkd-v05-track:active{transform:scale(.98)}
    .dkd-v05-track.dkd-selected{border-color:var(--dkd-track);background:#21314f}
    .dkd-v05-track-icon{width:50px;height:50px;border-radius:16px;display:grid;place-items:center;background:var(--dkd-track);color:#12223a}
    .dkd-v05-track b{font-size:16px;display:block}.dkd-v05-track small{display:block;margin-top:4px;color:#aebdd2;font-size:10px}.dkd-v05-track-meta{display:flex;flex-direction:column;align-items:flex-end;gap:5px}.dkd-v05-track-meta span{font-size:9px;border:1px solid #4a5d7a;border-radius:9px;padding:4px 6px;color:#cdd8e9}

    .dkd-v05-vault{position:relative;z-index:2;height:100%;min-height:0;background:#0c1428;display:flex;flex-direction:column;overflow:hidden;color:#eef3ff}
    .dkd-v05-vault .dkd-page-header{flex:0 0 auto;background:#121e37}
    .dkd-v05-vault-body{flex:1;min-height:0;overflow-y:auto;padding:18px 18px calc(28px + var(--dkd-bottom));overscroll-behavior:contain}
    .dkd-v05-vault-hero{position:relative;overflow:hidden;border:1px solid #52698e;border-radius:28px;background:#172641;padding:20px;animation:dkd-v05-vault-rise .38s ease-out both}
    .dkd-v05-vault-hero:before{content:'';position:absolute;left:0;top:0;bottom:0;width:8px;background:var(--dkd-vault-accent,#e982b7)}
    .dkd-v05-vault-hero-top{display:flex;justify-content:space-between;align-items:flex-start;gap:14px}
    .dkd-v05-vault-icon{width:62px;height:62px;border-radius:20px;display:grid;place-items:center;background:var(--dkd-vault-accent,#e982b7);color:#12223a;animation:dkd-v05-vault-float 2.6s ease-in-out infinite}
    .dkd-v05-vault-icon svg{width:31px;height:31px}
    .dkd-v05-vault-percent{font-size:46px;font-weight:950;letter-spacing:-2px;color:var(--dkd-vault-accent,#e982b7);font-variant-numeric:tabular-nums}
    .dkd-v05-vault-hero h1{font-size:31px;margin:12px 0 5px;line-height:1.05}.dkd-v05-vault-hero p{font-size:12px;color:#b7c5dc;line-height:1.55}
    .dkd-v05-vault-progress{height:9px;background:#293956;border-radius:999px;overflow:hidden;margin-top:16px}.dkd-v05-vault-progress>span{display:block;height:100%;background:var(--dkd-vault-accent,#e982b7);border-radius:999px;transform-origin:left center;animation:dkd-v05-vault-progress .7s ease-out both}
    .dkd-v05-vault-mini{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:13px}.dkd-v05-vault-mini>div{border:1px solid #425574;border-radius:15px;background:#122038;padding:10px 8px}.dkd-v05-vault-mini b{display:block;font-size:15px}.dkd-v05-vault-mini small{display:block;font-size:8px;margin-top:3px;color:#9eb0c9}
    .dkd-v05-vault-section{margin-top:22px}.dkd-v05-vault-section-head{display:flex;align-items:end;justify-content:space-between;gap:12px;margin-bottom:12px}.dkd-v05-vault-section-head h2{font-size:21px}.dkd-v05-vault-section-head small{font-size:9px;color:#9eacc2;text-align:right}
    .dkd-v05-prize-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.dkd-v05-prize{--dkd-prize:#8aa7ee;position:relative;min-height:134px;padding:15px 8px;border:1px solid #415373;border-top:6px solid var(--dkd-prize);border-radius:21px;background:#19253e;color:#e8efff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;animation:dkd-v05-card-in .38s ease-out both}.dkd-v05-prize:nth-child(2){animation-delay:.05s}.dkd-v05-prize:nth-child(3){animation-delay:.10s}.dkd-v05-prize.dkd-selected{border-color:var(--dkd-prize);background:#243250;transform:translateY(-3px)}.dkd-v05-prize svg{width:31px;height:31px;color:var(--dkd-prize)}.dkd-v05-prize b{font-size:14px}.dkd-v05-prize small{font-size:9px;color:#aebbd0;line-height:1.35}
    .dkd-v05-requirements{display:grid;grid-template-columns:1fr 1fr;gap:10px}.dkd-v05-req{--dkd-req:#65c9c2;border:1px solid #415373;border-radius:20px;background:#15243b;padding:14px;min-height:124px;animation:dkd-v05-card-in .38s ease-out both}.dkd-v05-req:nth-child(2){animation-delay:.04s}.dkd-v05-req:nth-child(3){animation-delay:.08s}.dkd-v05-req:nth-child(4){animation-delay:.12s}.dkd-v05-req-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.dkd-v05-req-icon{width:38px;height:38px;border-radius:12px;background:var(--dkd-req);color:#13233a;display:grid;place-items:center}.dkd-v05-req h3{font-size:12px;margin:12px 0 7px;line-height:1.3}.dkd-v05-req b{font-size:14px}.dkd-v05-req .dkd-progress{height:6px;margin-top:8px}.dkd-v05-req .dkd-progress span{background:var(--dkd-req)}
    .dkd-v05-final-card{margin-top:18px;border:1px solid #5f557f;border-radius:24px;background:#201e3b;padding:16px}.dkd-v05-final-card .dkd-button{margin-top:12px;background:#e982b7;color:#1d1730;border-color:#f3b8d7}.dkd-v05-vault-note{margin-top:15px;padding:13px 14px;border-left:4px solid #8aa7ee;border-radius:0 15px 15px 0;background:#15223a;color:#aebcd1;font-size:10px;line-height:1.55}

    @keyframes dkd-v05-music-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
    @keyframes dkd-v05-vault-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
    @keyframes dkd-v05-vault-float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-6px) rotate(2deg)}}
    @keyframes dkd-v05-vault-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}
    @keyframes dkd-v05-card-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    html[data-dkd-motion="off"] .dkd-v05-music-now>span,html[data-dkd-motion="off"] .dkd-v05-vault-hero,html[data-dkd-motion="off"] .dkd-v05-vault-icon,html[data-dkd-motion="off"] .dkd-v05-vault-progress>span,html[data-dkd-motion="off"] .dkd-v05-prize,html[data-dkd-motion="off"] .dkd-v05-req{animation:none!important}
    @media(max-height:760px){.dkd-player-name{margin-top:56px!important}.dkd-home-header .dkd-profile-pills{margin-top:8px!important}.dkd-v05-vault-body{padding-top:14px}.dkd-v05-vault-hero{padding:17px}.dkd-v05-vault-percent{font-size:39px}.dkd-v05-prize{min-height:118px}}
    @media(max-width:370px){.dkd-v04-brand-pills{gap:3px!important}.dkd-v04-brand-pills>span{padding:5px 6px!important;font-size:8px!important}.dkd-v05-prize-grid{gap:6px}.dkd-v05-prize{padding-left:5px;padding-right:5px}.dkd-v05-requirements{gap:7px}.dkd-v05-track{grid-template-columns:46px 1fr auto;padding:11px;gap:9px}.dkd-v05-track-icon{width:44px;height:44px}}
  `;
  document.head.appendChild(dkd_style);
}

dkd_v05InstallStyles();

// DraBornGo / LastMile v0.7.4 — season reward + mobile modal hotfix.
// Keeps payment season details synchronized with the exact Reward Vault catalog and
// isolates modal scrolling from the main game viewport on Android/Web mobile browsers.

const dkd_v074SeasonVaultFallback = {
  dkd_season01: [
    { dkd_name:'iPhone 18 Pro Max', dkd_subtitle:'Sezon 01 telefon ödülü', dkd_icon:'phone' },
    { dkd_name:'MSI Gaming Laptop', dkd_subtitle:'Sezon 01 oyun bilgisayarı', dkd_icon:'laptop' },
    { dkd_name:'Premium Tablet', dkd_subtitle:'Sezon 01 tablet ödülü', dkd_icon:'tablet' },
  ],
  dkd_season02: [
    { dkd_name:'PlayStation 5 Pro', dkd_subtitle:'Sezon 02 konsol ödülü', dkd_icon:'trophy' },
    { dkd_name:'ROG Ally X', dkd_subtitle:'Sezon 02 el konsolu', dkd_icon:'trophy' },
    { dkd_name:'Meta Quest 3S', dkd_subtitle:'Sezon 02 VR ödülü', dkd_icon:'eye' },
  ],
  dkd_season03: [
    { dkd_name:'MacBook Air', dkd_subtitle:'Sezon 03 bilgisayar ödülü', dkd_icon:'laptop' },
    { dkd_name:'iPad Pro', dkd_subtitle:'Sezon 03 tablet ödülü', dkd_icon:'tablet' },
    { dkd_name:'Apple Watch Ultra', dkd_subtitle:'Sezon 03 akıllı saat ödülü', dkd_icon:'badge' },
  ],
  dkd_season04: [
    { dkd_name:'Galaxy S Ultra', dkd_subtitle:'Sezon 04 telefon ödülü', dkd_icon:'phone' },
    { dkd_name:'Lenovo Legion Gaming Laptop', dkd_subtitle:'Sezon 04 oyun bilgisayarı', dkd_icon:'laptop' },
    { dkd_name:'Steam Deck OLED', dkd_subtitle:'Sezon 04 el konsolu', dkd_icon:'trophy' },
  ],
};

let dkd_v074SeasonViewportState = null;

function dkd_v074SeasonHotfixStyles() {
  if (document.getElementById('dkd-v074-season-modal-hotfix-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v074-season-modal-hotfix-style';
  dkd_style.textContent = `
    .dkd-v074-season-overlay{display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;height:100dvh!important;max-height:100dvh!important;overscroll-behavior:none!important;touch-action:pan-y!important}
    .dkd-v074-season-modal{display:flex!important;flex-direction:column!important;width:min(calc(100% - 12px),570px)!important;max-height:calc(100dvh - 24px - env(safe-area-inset-top) - env(safe-area-inset-bottom))!important;overflow:hidden!important}
    .dkd-v074-season-modal-head{flex:0 0 auto!important}.dkd-v074-season-modal-body{flex:1 1 auto!important;min-height:0!important;overflow-y:auto!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important;padding-bottom:calc(18px + env(safe-area-inset-bottom))!important}
    .dkd-v074-season-prize{min-height:108px!important}.dkd-v074-season-prize b{font-size:12px!important}.dkd-v074-season-prize small{font-size:9px!important}
    .dkd-v074-season-catalog-sync{padding:11px 13px;border:1px solid #4c7d78;border-left:5px solid #72e6d0;border-radius:13px;background:#173949;color:#d9fff9;font-size:11px;font-weight:760;line-height:1.5}
    @supports not (height:100dvh){.dkd-v074-season-overlay{height:100%!important;max-height:100%!important}.dkd-v074-season-modal{max-height:calc(100% - 24px)!important}}
  `;
  document.head.appendChild(dkd_style);
}
dkd_v074SeasonHotfixStyles();

function dkd_v074SeasonVaultRewards(dkd_game, dkd_seasonId) {
  let dkd_rewards = [];
  try {
    if (typeof dkd_v05LiveSeasonRewards === 'function') dkd_rewards = dkd_v05LiveSeasonRewards(dkd_game, dkd_seasonId) || [];
  } catch {}
  if (!Array.isArray(dkd_rewards) || !dkd_rewards.length) dkd_rewards = dkd_v074SeasonVaultFallback[dkd_seasonId] || [];
  return dkd_rewards.map((dkd_reward, dkd_index) => ({
    dkd_name: String(dkd_reward?.dkd_name || `Sezon ödülü ${dkd_index + 1}`),
    dkd_subtitle: String(dkd_reward?.dkd_subtitle || dkd_reward?.dkd_sub || 'Sezon büyük ödülü'),
    dkd_icon: String(dkd_reward?.dkd_icon || 'trophy'),
  }));
}

function dkd_v074SeasonCaptureViewport(dkd_game) {
  const dkd_pageBody = dkd_game?.dkd_root?.querySelector?.('.dkd-page-body') || document.querySelector('.dkd-page-body');
  dkd_v074SeasonViewportState = {
    dkd_pageBody,
    dkd_scrollTop: Number(dkd_pageBody?.scrollTop || 0),
  };
}

function dkd_v074SeasonRestoreViewport() {
  const dkd_saved = dkd_v074SeasonViewportState;
  dkd_v074SeasonViewportState = null;
  try { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); } catch {}
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (dkd_saved?.dkd_pageBody?.isConnected) dkd_saved.dkd_pageBody.scrollTop = dkd_saved.dkd_scrollTop;
    try { window.dispatchEvent(new Event('resize')); } catch {}
  }));
}

dkd_v074SeasonCloseDetail = function dkd_v074SeasonCloseDetailHotfix() {
  const dkd_overlay = document.getElementById('dkd-v074-season-overlay');
  if (dkd_overlay) {
    dkd_overlay.replaceChildren();
    dkd_overlay.remove();
  }
  dkd_v074SeasonRestoreViewport();
};

dkd_v074SeasonOpenDetail = function dkd_v074SeasonOpenDetailHotfix(dkd_game, dkd_cloudSeason) {
  dkd_v074SeasonCloseDetail();
  dkd_v074SeasonCaptureViewport(dkd_game);
  const dkd_center = dkd_v074Center(dkd_game);
  const dkd_meta = dkd_v074SeasonMeta(dkd_cloudSeason);
  const dkd_option = (dkd_center?.dkd_options || []).find(dkd_item => dkd_item.dkd_season_id === dkd_cloudSeason?.dkd_id);
  const dkd_weather = dkd_weathers.find(dkd_item => dkd_item.dkd_id === dkd_meta?.dkd_weather);
  const dkd_name = dkd_cloudSeason?.dkd_name || dkd_meta?.dkd_name || 'Sezon';
  const dkd_number = Number(dkd_cloudSeason?.dkd_number || dkd_meta?.dkd_number || 0);
  const dkd_seasonId = String(dkd_cloudSeason?.dkd_id || dkd_meta?.dkd_id || '');
  const dkd_rewards = dkd_v074SeasonVaultRewards(dkd_game, dkd_seasonId);
  const dkd_prizeHtml = dkd_rewards.map(dkd_reward => `<div class="dkd-v074-season-prize"><span>${dkd_icon(dkd_reward.dkd_icon,20)}</span><b>${dkd_escape(dkd_reward.dkd_name)}</b><small>${dkd_escape(dkd_reward.dkd_subtitle)}</small></div>`).join('');

  const dkd_overlay = document.createElement('div');
  dkd_overlay.id = 'dkd-v074-season-overlay';
  dkd_overlay.className = 'dkd-v074-season-overlay';
  dkd_overlay.setAttribute('role','dialog');
  dkd_overlay.setAttribute('aria-modal','true');
  dkd_overlay.setAttribute('aria-label', `${dkd_name} sezon detayları`);
  dkd_overlay.innerHTML = `<div class="dkd-v074-season-modal"><div class="dkd-v074-season-modal-head"><span>${dkd_icon('trophy',14)} SEZON ${dkd_number || '—'} DETAYLARI</span><h2>${dkd_escape(dkd_name)}</h2><p>${dkd_escape(dkd_meta?.dkd_theme || 'Yeni sezon, yeni şehir koşulları ve yeni hedefler.')}</p><button type="button" class="dkd-v074-season-modal-close" aria-label="Sezon detaylarını kapat">×</button></div><div class="dkd-v074-season-modal-body"><div class="dkd-v074-season-facts"><div class="dkd-v074-season-fact"><small>BAŞLANGIÇ</small><b>${dkd_v074SeasonDate(dkd_cloudSeason?.dkd_starts_at)}</b></div><div class="dkd-v074-season-fact"><small>BİTİŞ</small><b>${dkd_v074SeasonDate(dkd_cloudSeason?.dkd_ends_at)}</b></div><div class="dkd-v074-season-fact"><small>SÜRE</small><b>${dkd_v074SeasonDuration(dkd_cloudSeason?.dkd_starts_at, dkd_cloudSeason?.dkd_ends_at)}</b></div><div class="dkd-v074-season-fact"><small>SEZON ERİŞİMİ</small><b>${dkd_v074Money(dkd_option?.dkd_amount)}</b></div></div><div class="dkd-v074-season-theme">${dkd_icon(dkd_weather?.dkd_icon || 'star',18)} <b>Sezon koşulu:</b> ${dkd_escape(dkd_weather?.dkd_name || 'Özel şehir koşulları')} · ${dkd_escape(dkd_meta?.dkd_theme || 'Sezon görevlerini tamamla.')}</div><div class="dkd-v074-season-rewards"><h3>Sezon ${dkd_number || ''} büyük ödülleri</h3><p>Ödül Kasası ile aynı sezon kataloğu:</p><div class="dkd-v074-season-prize-grid">${dkd_prizeHtml}</div></div><div class="dkd-v074-season-catalog-sync">${dkd_icon('badge',15)} Bu liste oyun içindeki <b>Ödül Kasası</b> ile senkron tutulur.</div><button type="button" class="dkd-v074-season-ok">TAMAM · SEZONLARA DÖN</button></div></div>`;

  const dkd_host = dkd_game?.dkd_root || document.getElementById('dkd-ui') || document.body;
  dkd_host.appendChild(dkd_overlay);
  const dkd_close = dkd_event => { dkd_event?.preventDefault?.(); dkd_event?.stopPropagation?.(); dkd_v074SeasonCloseDetail(); };
  dkd_overlay.querySelector('.dkd-v074-season-modal-close')?.addEventListener('click', dkd_close);
  dkd_overlay.querySelector('.dkd-v074-season-ok')?.addEventListener('click', dkd_close);
  dkd_overlay.addEventListener('click', dkd_event => { if (dkd_event.target === dkd_overlay) dkd_close(dkd_event); });
  dkd_overlay.querySelector('.dkd-v074-season-modal-body')?.scrollTo?.({ top:0, behavior:'auto' });
};

window.dkd_lastMileV074 = {
  ...(window.dkd_lastMileV074 || {}),
  dkd_seasonRewardsFromVault: true,
  dkd_seasonModalViewportStable: true,
  dkd_seasonModalRepeatOpen: true,
};

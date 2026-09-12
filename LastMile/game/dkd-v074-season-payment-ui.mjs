// DraBornGo / LastMile v0.7.4 — shared seasonal payment UI for Android/Expo + Web.
const dkd_v074SeasonPreviousRender = dkd_Game.prototype.dkd_render;
const dkd_v074SeasonPreviousAction = dkd_Game.prototype.dkd_action;
const dkd_v074SeasonSessionKey = 'dkd_lastmile_reward_notice_session_v074';

function dkd_v074SeasonInstallStyles() {
  if (document.getElementById('dkd-v074-season-ui-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v074-season-ui-style';
  dkd_style.textContent = `
    .dkd-v074-current-season-card{position:relative!important;overflow:hidden!important;border:2px solid #5e84b2!important;border-top:8px solid #72e6d0!important;background:#172d47!important}
    .dkd-v074-current-season-card:before{content:'AKTİF SEZON';display:inline-flex;margin:0 0 12px;padding:7px 10px;border-radius:999px;background:#214d5d;color:#bffff5;font-size:10px;font-weight:950;letter-spacing:1.2px}
    .dkd-v074-current-season-card h2{font-size:28px!important;line-height:1.12;color:#fff!important}
    .dkd-v074-current-season-card .dkd-v074-money{color:#ffe59a!important;font-size:38px!important}
    .dkd-v074-current-season-card .dkd-v074-stat:first-of-type{border-color:#5c83b4!important;background:#122b46!important}
    .dkd-v074-current-season-card .dkd-v074-stat:last-of-type{border-color:#62cfc6!important;background:#153743!important}
    .dkd-v074-selected-prize{display:flex;align-items:center;gap:13px;margin-top:15px;padding:15px;border:2px solid #9c8dff;border-left:8px solid #ffcf70;border-radius:18px;background:#202f52;color:#fff}
    .dkd-v074-selected-prize>span{display:grid;place-items:center;flex:0 0 46px;width:46px;height:46px;border-radius:14px;background:#dfff4f;color:#172238}
    .dkd-v074-selected-prize small{display:block;color:#b9cbea;font-size:10px;font-weight:900;letter-spacing:1px}.dkd-v074-selected-prize b{display:block;margin-top:4px;font-size:18px}.dkd-v074-selected-prize em{display:block;margin-top:3px;color:#d8e7ff;font-size:12px;font-style:normal}
    .dkd-v074-season{position:relative!important;cursor:pointer!important;padding-right:46px!important;transition:transform .16s ease,border-color .16s ease!important}
    .dkd-v074-season:active{transform:scale(.985)}.dkd-v074-season:focus-visible{outline:3px solid #b7c8ff;outline-offset:3px}
    .dkd-v074-season:after{content:'›';position:absolute;right:16px;top:50%;transform:translateY(-50%);display:grid;place-items:center;width:30px;height:30px;border:1px solid #647fa5;border-radius:10px;background:#203a59;color:#fff;font-size:27px;font-weight:700;line-height:1}
    .dkd-v074-season-detail-hint{display:block!important;margin-top:7px!important;color:#aef5eb!important;font-size:10px!important;font-weight:950!important;letter-spacing:.8px!important}
    .dkd-v074-season-overlay{position:fixed;inset:0;z-index:999999;display:grid;place-items:center;padding:calc(20px + env(safe-area-inset-top)) 16px calc(20px + env(safe-area-inset-bottom));overflow:auto;background:rgba(5,12,23,.95);animation:dkd-v074-season-fade .2s ease-out both}
    .dkd-v074-season-modal{width:min(100%,570px);overflow:hidden;border:2px solid #79ded3;border-top:8px solid #8f9cff;border-radius:26px;background:#132a43;color:#fff;animation:dkd-v074-season-rise .34s cubic-bezier(.2,.8,.2,1) both}
    .dkd-v074-season-modal-head{position:relative;padding:21px 58px 19px 20px;border-bottom:1px solid #46627f;background:#183650}
    .dkd-v074-season-modal-head span{display:inline-flex;padding:7px 10px;border-radius:999px;background:#274c66;color:#c8fff7;font-size:10px;font-weight:950;letter-spacing:1.1px}.dkd-v074-season-modal-head h2{margin:11px 0 7px;font-size:27px!important;line-height:1.1}.dkd-v074-season-modal-head p{margin:0;color:#c7d7ea;font-size:14px;line-height:1.5}
    .dkd-v074-season-modal-close{position:absolute;right:14px;top:14px;display:grid;place-items:center;width:42px;height:42px;border:1px solid #7690af;border-radius:13px;background:#203d5c;color:#fff;font-size:27px;cursor:pointer}
    .dkd-v074-season-modal-body{display:grid;gap:13px;padding:17px}
    .dkd-v074-season-facts{display:grid;grid-template-columns:1fr 1fr;gap:9px}.dkd-v074-season-fact{padding:13px;border:1px solid #4c6989;border-radius:15px;background:#10263d}.dkd-v074-season-fact small{display:block;color:#9db2ca;font-size:9px;font-weight:900;letter-spacing:.8px}.dkd-v074-season-fact b{display:block;margin-top:5px;font-size:14px;line-height:1.35}
    .dkd-v074-season-theme{padding:15px;border:2px solid #ffcf70;border-left:8px solid #ef8abc;border-radius:17px;background:#372d39;color:#fff3c8;font-size:14px;font-weight:800;line-height:1.55}
    .dkd-v074-season-rewards{padding:15px;border:1px solid #526f91;border-radius:18px;background:#10263d}.dkd-v074-season-rewards h3{margin:0 0 5px;font-size:18px}.dkd-v074-season-rewards>p{margin:0 0 12px;color:#adc1d7;font-size:12px;line-height:1.5}
    .dkd-v074-season-prize-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.dkd-v074-season-prize{display:grid;place-items:center;gap:7px;min-height:92px;padding:11px 7px;border:1px solid #627ca0;border-radius:15px;background:#193550;text-align:center}.dkd-v074-season-prize span{display:grid;place-items:center;width:35px;height:35px;border-radius:11px;background:#dfff4f;color:#172238}.dkd-v074-season-prize b{font-size:12px;line-height:1.25}.dkd-v074-season-prize small{color:#b5c6da;font-size:9px;line-height:1.3}
    .dkd-v074-season-caution{padding:12px 13px;border-left:5px solid #72e6d0;border-radius:12px;background:#183a4b;color:#d9f8f3;font-size:11px;line-height:1.5}
    .dkd-v074-season-ok{width:100%;min-height:55px;border:0;border-radius:16px;background:#dfff4f;color:#142238;font-size:15px;font-weight:950;cursor:pointer}
    @keyframes dkd-v074-season-fade{from{opacity:0}to{opacity:1}}@keyframes dkd-v074-season-rise{from{opacity:0;transform:translateY(18px) scale(.985)}to{opacity:1;transform:none}}
    html[data-dkd-motion='off'] .dkd-v074-season-overlay,html[data-dkd-motion='off'] .dkd-v074-season-modal{animation:none!important;transform:none!important}
    @media(prefers-reduced-motion:reduce){.dkd-v074-season-overlay,.dkd-v074-season-modal{animation:none!important;transform:none!important}}
    @media(max-width:370px){.dkd-v074-season-prize-grid{grid-template-columns:1fr}.dkd-v074-season-facts{grid-template-columns:1fr}.dkd-v074-season-modal-head h2{font-size:24px!important}}
  `;
  document.head.appendChild(dkd_style);
}
dkd_v074SeasonInstallStyles();

function dkd_v074SeasonSessionSeen() {
  try { return sessionStorage.getItem(dkd_v074SeasonSessionKey) === '1'; } catch { return false; }
}
function dkd_v074SeasonMarkSessionSeen() {
  try { sessionStorage.setItem(dkd_v074SeasonSessionKey, '1'); } catch {}
}
function dkd_v074SeasonResetSessionNotice() {
  try { sessionStorage.removeItem(dkd_v074SeasonSessionKey); } catch {}
}

function dkd_v074SeasonShowLoginNotice(dkd_game) {
  if (!dkd_game || dkd_v074SeasonSessionSeen() || document.getElementById('dkd-v074-reward-overlay')) return;
  dkd_v074SeasonMarkSessionSeen();
  const dkd_overlay = document.createElement('div');
  dkd_overlay.id = 'dkd-v074-reward-overlay';
  dkd_overlay.className = 'dkd-v074-reward-overlay';
  dkd_overlay.setAttribute('role', 'dialog');
  dkd_overlay.setAttribute('aria-modal', 'true');
  dkd_overlay.setAttribute('aria-labelledby', 'dkd-v074-reward-title');
  dkd_overlay.innerHTML = `<div class="dkd-v074-reward-card"><span class="dkd-v074-reward-kicker">${dkd_icon('trophy',16)} SEZON BÜYÜK ÖDÜLÜ</span><h2 id="dkd-v074-reward-title">Sezon devam ediyor.</h2><p class="dkd-v074-reward-copy">Oyundaki Görevleri tamamladığında seçmiş olduğun ödüle hemen stoktan teslim şekilde, Ankara içi elden veya kargo yoluyla sahip olacaksın. Her Sezon Büyük Ödüller Değişiyor.</p><p class="dkd-v074-reward-hurry">⚡ <b>ACELE ET</b> · Sezon bitmeden sen oyunu bitir.</p><p class="dkd-v074-reward-foot">Sezon ödüllerini oyun içinde <b>Ödüller</b> kısmında görebilirsin.</p><button type="button" class="dkd-v074-reward-confirm">ANLADIM · DEVAM ET</button></div>`;
  const dkd_close = () => dkd_overlay.remove();
  dkd_overlay.querySelector('.dkd-v074-reward-confirm')?.addEventListener('click', dkd_close, { once: true });
  document.body.appendChild(dkd_overlay);
}

function dkd_v074SeasonSelectedPrize(dkd_game) {
  const dkd_prizeId = String(dkd_game?.dkd_state?.dkd_prize || '');
  return dkd_prizes.find(dkd_prize => dkd_prize.dkd_id === dkd_prizeId) || null;
}

function dkd_v074SeasonDate(dkd_value) {
  if (!dkd_value) return 'Duyurulacak';
  try { return new Date(dkd_value).toLocaleDateString('tr-TR',{day:'2-digit',month:'long',year:'numeric'}); } catch { return 'Duyurulacak'; }
}
function dkd_v074SeasonDuration(dkd_start, dkd_end) {
  const dkd_startMs = new Date(dkd_start || 0).getTime();
  const dkd_endMs = new Date(dkd_end || 0).getTime();
  if (!Number.isFinite(dkd_startMs) || !Number.isFinite(dkd_endMs) || dkd_endMs <= dkd_startMs) return 'Duyurulacak';
  return `${Math.ceil((dkd_endMs - dkd_startMs) / 86400000)} gün`;
}
function dkd_v074SeasonMeta(dkd_cloudSeason) {
  const dkd_id = String(dkd_cloudSeason?.dkd_id || '');
  const dkd_number = Number(dkd_cloudSeason?.dkd_number || dkd_id.match(/(\d+)$/)?.[1] || 0);
  return dkd_seasons.find(dkd_item => Number(dkd_item.dkd_number) === dkd_number) || dkd_seasons.find(dkd_item => dkd_item.dkd_id === dkd_id) || null;
}

function dkd_v074SeasonCloseDetail() {
  document.getElementById('dkd-v074-season-overlay')?.remove();
}
function dkd_v074SeasonOpenDetail(dkd_game, dkd_cloudSeason) {
  dkd_v074SeasonCloseDetail();
  const dkd_center = dkd_v074Center(dkd_game);
  const dkd_meta = dkd_v074SeasonMeta(dkd_cloudSeason);
  const dkd_option = (dkd_center?.dkd_options || []).find(dkd_item => dkd_item.dkd_season_id === dkd_cloudSeason?.dkd_id);
  const dkd_weather = dkd_weathers.find(dkd_item => dkd_item.dkd_id === dkd_meta?.dkd_weather);
  const dkd_name = dkd_cloudSeason?.dkd_name || dkd_meta?.dkd_name || 'Sezon';
  const dkd_number = Number(dkd_cloudSeason?.dkd_number || dkd_meta?.dkd_number || 0);
  const dkd_overlay = document.createElement('div');
  dkd_overlay.id = 'dkd-v074-season-overlay';
  dkd_overlay.className = 'dkd-v074-season-overlay';
  dkd_overlay.setAttribute('role','dialog');
  dkd_overlay.setAttribute('aria-modal','true');
  dkd_overlay.innerHTML = `<div class="dkd-v074-season-modal"><div class="dkd-v074-season-modal-head"><span>${dkd_icon('trophy',14)} SEZON ${dkd_number || '—'} DETAYLARI</span><h2>${dkd_escape(dkd_name)}</h2><p>${dkd_escape(dkd_meta?.dkd_theme || 'Yeni sezon, yeni şehir koşulları ve yeni hedefler.')}</p><button type="button" class="dkd-v074-season-modal-close" aria-label="Sezon detaylarını kapat">×</button></div><div class="dkd-v074-season-modal-body"><div class="dkd-v074-season-facts"><div class="dkd-v074-season-fact"><small>BAŞLANGIÇ</small><b>${dkd_v074SeasonDate(dkd_cloudSeason?.dkd_starts_at)}</b></div><div class="dkd-v074-season-fact"><small>BİTİŞ</small><b>${dkd_v074SeasonDate(dkd_cloudSeason?.dkd_ends_at)}</b></div><div class="dkd-v074-season-fact"><small>SÜRE</small><b>${dkd_v074SeasonDuration(dkd_cloudSeason?.dkd_starts_at, dkd_cloudSeason?.dkd_ends_at)}</b></div><div class="dkd-v074-season-fact"><small>SEZON ERİŞİMİ</small><b>${dkd_v074Money(dkd_option?.dkd_amount)}</b></div></div><div class="dkd-v074-season-theme">${dkd_icon(dkd_weather?.dkd_icon || 'star',18)} <b>Sezon koşulu:</b> ${dkd_escape(dkd_weather?.dkd_name || 'Özel şehir koşulları')} · ${dkd_escape(dkd_meta?.dkd_theme || 'Sezon görevlerini tamamla.')}</div><div class="dkd-v074-season-rewards"><h3>Büyük ödül havuzu</h3><p>Bu sezonda oyuncunun hedef olarak seçebileceği güncel ödül türleri:</p><div class="dkd-v074-season-prize-grid">${dkd_prizes.map(dkd_prize => `<div class="dkd-v074-season-prize"><span>${dkd_icon(dkd_prize.dkd_icon,20)}</span><b>${dkd_escape(dkd_prize.dkd_name)}</b><small>${dkd_escape(dkd_prize.dkd_sub)}</small></div>`).join('')}</div></div><div class="dkd-v074-season-caution">Sonraki sezonların kesin ürün/model ve stok bilgileri sezon başlamadan önce güncellenebilir. Uygulamada yayınlanan güncel sezon ödül listesi esas alınır.</div><button type="button" class="dkd-v074-season-ok">TAMAM · SEZONA DÖN</button></div></div>`;
  dkd_overlay.querySelector('.dkd-v074-season-modal-close')?.addEventListener('click', dkd_v074SeasonCloseDetail, { once:true });
  dkd_overlay.querySelector('.dkd-v074-season-ok')?.addEventListener('click', dkd_v074SeasonCloseDetail, { once:true });
  dkd_overlay.addEventListener('click', dkd_event => { if (dkd_event.target === dkd_overlay) dkd_v074SeasonCloseDetail(); });
  document.body.appendChild(dkd_overlay);
}

function dkd_v074SeasonDecoratePayment(dkd_game) {
  const dkd_root = dkd_game?.dkd_root;
  const dkd_center = dkd_v074Center(dkd_game);
  if (!dkd_root || !dkd_center) return;
  const dkd_current = (dkd_center.dkd_seasons || []).find(dkd_item => dkd_item.dkd_id === dkd_center.dkd_current_season_id);
  const dkd_cards = [...dkd_root.querySelectorAll('.dkd-v074-card')];
  const dkd_currentCard = dkd_cards.find(dkd_card => dkd_current && dkd_card.querySelector('h2')?.textContent?.trim() === String(dkd_current.dkd_name || '').trim());
  if (dkd_currentCard) {
    dkd_currentCard.classList.add('dkd-v074-current-season-card');
    if (!dkd_currentCard.querySelector('.dkd-v074-selected-prize')) {
      const dkd_prize = dkd_v074SeasonSelectedPrize(dkd_game);
      const dkd_prizeBox = document.createElement('div');
      dkd_prizeBox.className = 'dkd-v074-selected-prize';
      dkd_prizeBox.innerHTML = `<span>${dkd_icon(dkd_prize?.dkd_icon || 'trophy',23)}</span><div><small>SEÇTİĞİN BÜYÜK ÖDÜL</small><b>${dkd_escape(dkd_prize?.dkd_name || 'Henüz ödül seçilmedi')}</b><em>${dkd_escape(dkd_prize?.dkd_sub || 'Ödül ekranından hedefini seçebilirsin.')}</em></div>`;
      dkd_currentCard.appendChild(dkd_prizeBox);
    }
  }
  const dkd_future = (dkd_center.dkd_seasons || []).filter(dkd_item => dkd_item.dkd_id !== dkd_center.dkd_current_season_id).sort((dkd_first,dkd_second)=>Number(dkd_first.dkd_number)-Number(dkd_second.dkd_number));
  const dkd_rows = [...dkd_root.querySelectorAll('.dkd-v074-season')];
  dkd_rows.forEach((dkd_row, dkd_index) => {
    const dkd_season = dkd_future[dkd_index];
    if (!dkd_season || dkd_row.dataset.dkdSeasonBound === 'true') return;
    dkd_row.dataset.dkdSeasonBound = 'true';
    dkd_row.setAttribute('role','button');
    dkd_row.setAttribute('tabindex','0');
    dkd_row.setAttribute('aria-label', `${dkd_season.dkd_name || 'Sezon'} detaylarını aç`);
    const dkd_label = dkd_row.querySelector('small');
    if (dkd_label && !dkd_row.querySelector('.dkd-v074-season-detail-hint')) dkd_label.insertAdjacentHTML('afterend','<small class="dkd-v074-season-detail-hint">DETAYLAR + BÜYÜK ÖDÜLLER</small>');
    const dkd_open = () => dkd_v074SeasonOpenDetail(dkd_game, dkd_season);
    dkd_row.addEventListener('click', dkd_open);
    dkd_row.addEventListener('keydown', dkd_event => { if (dkd_event.key === 'Enter' || dkd_event.key === ' ') { dkd_event.preventDefault(); dkd_open(); } });
  });
}

dkd_Game.prototype.dkd_render = function dkd_v074SeasonRender(dkd_page, dkd_arg = null) {
  const dkd_result = dkd_v074SeasonPreviousRender.call(this, dkd_page, dkd_arg);
  const dkd_pageName = String(dkd_page || '');
  if (dkd_pageName === 'choose') dkd_v074SeasonMarkSessionSeen();
  if (dkd_pageName === 'v074payment') queueMicrotask(() => {
    dkd_v074SeasonDecoratePayment(this);
    dkd_v074SeasonShowLoginNotice(this);
  });
  return dkd_result;
};

dkd_Game.prototype.dkd_action = function dkd_v074SeasonAction(dkd_action) {
  if (String(dkd_action || '').split(':')[0] === 'v04-logout') dkd_v074SeasonResetSessionNotice();
  return dkd_v074SeasonPreviousAction.call(this, dkd_action);
};

window.dkd_lastMileV074 = {
  ...(window.dkd_lastMileV074 || {}),
  dkd_rewardNoticePerLogin: true,
  dkd_paymentCurrentSeasonPremium: true,
  dkd_paymentSelectedPrizeVisible: true,
  dkd_futureSeasonDetails: true,
};

// DraBornGo / Last Mile v0.5 live season + super-admin runtime.
// Loaded last. Makes Season 01 a real physical-reward season, keeps future season
// reward catalogs server-driven, grants admin test entitlements, replaces the bottom
// Garage shortcut with Messages, and refines the Kurye Merkezi sign.

const dkd_v05LivePrevious = {
  dkd_receive: dkd_Game.prototype.dkd_receive,
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_save: dkd_Game.prototype.dkd_save,
  dkd_view_home: dkd_Game.prototype.dkd_view_home,
  dkd_view_vault: dkd_Game.prototype.dkd_view_vault,
  dkd_view_choose: dkd_Game.prototype.dkd_view_choose,
  dkd_view_city: dkd_Game.prototype.dkd_view_city,
  dkd_view_wallet: dkd_Game.prototype.dkd_view_wallet,
  dkd_view_garage: dkd_Game.prototype.dkd_view_garage,
  dkd_sceneBuildHub: dkd_Scene.prototype.dkd_buildHub,
};

const dkd_v05LiveFallbackSeasons = [
  { dkd_id: 'dkd_season01', dkd_number: 1, dkd_name: 'BÜYÜK FIRTINA', dkd_theme: 'Fırtınayı aş.', dkd_status: 'active', dkd_starts_at: '2026-09-09T00:00:00+03:00', dkd_ends_at: '2026-10-31T23:59:59+03:00' },
  { dkd_id: 'dkd_season02', dkd_number: 2, dkd_name: 'GECEYE UYANAN ŞEHİR', dkd_theme: 'Gece sana ait.', dkd_status: 'upcoming', dkd_starts_at: '2026-11-01T00:00:00+03:00', dkd_ends_at: '2026-12-31T23:59:59+03:00' },
  { dkd_id: 'dkd_season03', dkd_number: 3, dkd_name: 'SICAK DALGASI', dkd_theme: 'Sıcaklığın sınırında.', dkd_status: 'upcoming', dkd_starts_at: '2027-01-01T00:00:00+03:00', dkd_ends_at: '2027-02-28T23:59:59+03:00' },
  { dkd_id: 'dkd_season04', dkd_number: 4, dkd_name: 'KARANLIK ŞEHİR', dkd_theme: 'Işıklar sönünce.', dkd_status: 'upcoming', dkd_starts_at: '2027-03-01T00:00:00+03:00', dkd_ends_at: '2027-04-30T23:59:59+03:00' },
];

const dkd_v05LiveFallbackRewards = [
  { dkd_id: 'dkd_s01_phone', dkd_season_id: 'dkd_season01', dkd_slot_id: 'dkd_phone', dkd_name: 'iPhone 18 Pro Max', dkd_subtitle: 'Sezon 01 telefon ödülü', dkd_icon: 'phone', dkd_quantity: 1, dkd_sort: 1 },
  { dkd_id: 'dkd_s01_laptop', dkd_season_id: 'dkd_season01', dkd_slot_id: 'dkd_laptop', dkd_name: 'MSI Gaming Laptop', dkd_subtitle: 'Sezon 01 oyun bilgisayarı', dkd_icon: 'laptop', dkd_quantity: 1, dkd_sort: 2 },
  { dkd_id: 'dkd_s01_tablet', dkd_season_id: 'dkd_season01', dkd_slot_id: 'dkd_tablet', dkd_name: 'Premium Tablet', dkd_subtitle: 'Sezon 01 tablet ödülü', dkd_icon: 'tablet', dkd_quantity: 1, dkd_sort: 3 },
  { dkd_id: 'dkd_s02_phone', dkd_season_id: 'dkd_season02', dkd_slot_id: 'dkd_phone', dkd_name: 'PlayStation 5 Pro', dkd_subtitle: 'Sezon 02 konsol ödülü', dkd_icon: 'trophy', dkd_quantity: 1, dkd_sort: 1 },
  { dkd_id: 'dkd_s02_laptop', dkd_season_id: 'dkd_season02', dkd_slot_id: 'dkd_laptop', dkd_name: 'ROG Ally X', dkd_subtitle: 'Sezon 02 el konsolu', dkd_icon: 'trophy', dkd_quantity: 1, dkd_sort: 2 },
  { dkd_id: 'dkd_s02_tablet', dkd_season_id: 'dkd_season02', dkd_slot_id: 'dkd_tablet', dkd_name: 'Meta Quest 3S', dkd_subtitle: 'Sezon 02 VR ödülü', dkd_icon: 'eye', dkd_quantity: 1, dkd_sort: 3 },
  { dkd_id: 'dkd_s03_phone', dkd_season_id: 'dkd_season03', dkd_slot_id: 'dkd_phone', dkd_name: 'MacBook Air', dkd_subtitle: 'Sezon 03 bilgisayar ödülü', dkd_icon: 'laptop', dkd_quantity: 1, dkd_sort: 1 },
  { dkd_id: 'dkd_s03_laptop', dkd_season_id: 'dkd_season03', dkd_slot_id: 'dkd_laptop', dkd_name: 'iPad Pro', dkd_subtitle: 'Sezon 03 tablet ödülü', dkd_icon: 'tablet', dkd_quantity: 1, dkd_sort: 2 },
  { dkd_id: 'dkd_s03_tablet', dkd_season_id: 'dkd_season03', dkd_slot_id: 'dkd_tablet', dkd_name: 'Apple Watch Ultra', dkd_subtitle: 'Sezon 03 akıllı saat ödülü', dkd_icon: 'badge', dkd_quantity: 1, dkd_sort: 3 },
  { dkd_id: 'dkd_s04_phone', dkd_season_id: 'dkd_season04', dkd_slot_id: 'dkd_phone', dkd_name: 'Galaxy S Ultra', dkd_subtitle: 'Sezon 04 telefon ödülü', dkd_icon: 'phone', dkd_quantity: 1, dkd_sort: 1 },
  { dkd_id: 'dkd_s04_laptop', dkd_season_id: 'dkd_season04', dkd_slot_id: 'dkd_laptop', dkd_name: 'Lenovo Legion Gaming Laptop', dkd_subtitle: 'Sezon 04 oyun bilgisayarı', dkd_icon: 'laptop', dkd_quantity: 1, dkd_sort: 2 },
  { dkd_id: 'dkd_s04_tablet', dkd_season_id: 'dkd_season04', dkd_slot_id: 'dkd_tablet', dkd_name: 'Steam Deck OLED', dkd_subtitle: 'Sezon 04 el konsolu', dkd_icon: 'trophy', dkd_quantity: 1, dkd_sort: 3 },
];

function dkd_v05LiveIsAdmin(dkd_game) {
  return dkd_game?.dkd_v04IsAdmin === true || dkd_game?.dkd_v04Cloud?.dkd_role === 'admin' || dkd_game?.dkd_v04Cloud?.dkd_is_admin === true;
}

function dkd_v05LiveCloudSeasons(dkd_game) {
  const dkd_rows = dkd_game?.dkd_v04Cloud?.dkd_seasons;
  return Array.isArray(dkd_rows) && dkd_rows.length ? dkd_rows : dkd_v05LiveFallbackSeasons;
}

function dkd_v05LiveCloudRewards(dkd_game) {
  const dkd_rows = dkd_game?.dkd_v04Cloud?.dkd_rewards;
  return Array.isArray(dkd_rows) && dkd_rows.length ? dkd_rows : dkd_v05LiveFallbackRewards;
}

function dkd_v05LiveCurrentSeason(dkd_game) {
  return dkd_game?.dkd_v04Cloud?.dkd_current_season
    || dkd_v05LiveCloudSeasons(dkd_game).find(dkd_item => dkd_item.dkd_status === 'active')
    || dkd_v05LiveCloudSeasons(dkd_game)[0];
}

function dkd_v05LiveSeasonRewards(dkd_game, dkd_seasonId) {
  return dkd_v05LiveCloudRewards(dkd_game)
    .filter(dkd_item => dkd_item.dkd_season_id === dkd_seasonId && dkd_item.dkd_is_active !== false)
    .sort((dkd_first, dkd_second) => Number(dkd_first.dkd_sort || 0) - Number(dkd_second.dkd_sort || 0));
}

function dkd_v05LiveFormatDate(dkd_value) {
  const dkd_date = new Date(dkd_value || 0);
  if (Number.isNaN(dkd_date.getTime())) return '';
  return dkd_date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function dkd_v05LivePrizeAccent(dkd_slotId) {
  if (dkd_slotId === 'dkd_phone') return '#e982b7';
  if (dkd_slotId === 'dkd_tablet') return '#65c9c2';
  return '#a99bea';
}

function dkd_v05LiveRewardIcon(dkd_reward) {
  const dkd_supported = ['phone','laptop','tablet','trophy','eye','badge'];
  return dkd_supported.includes(String(dkd_reward?.dkd_icon || '')) ? String(dkd_reward.dkd_icon) : 'trophy';
}

function dkd_v05LiveSyncPrizeSlots(dkd_game) {
  const dkd_season = dkd_v05LiveCurrentSeason(dkd_game);
  if (!dkd_season) return;
  const dkd_rewards = dkd_v05LiveSeasonRewards(dkd_game, dkd_season.dkd_id);
  for (const dkd_reward of dkd_rewards) {
    const dkd_slot = dkd_prizes.find(dkd_item => dkd_item.dkd_id === dkd_reward.dkd_slot_id);
    if (!dkd_slot) continue;
    dkd_slot.dkd_name = String(dkd_reward.dkd_name || dkd_slot.dkd_name);
    dkd_slot.dkd_sub = String(dkd_reward.dkd_subtitle || dkd_slot.dkd_sub);
    dkd_slot.dkd_icon = dkd_v05LiveRewardIcon(dkd_reward);
    dkd_slot.dkd_stock = Math.max(1, Number(dkd_reward.dkd_quantity || 1));
  }
}

function dkd_v05LiveApplyAdmin(dkd_game) {
  if (!dkd_v05LiveIsAdmin(dkd_game) || !dkd_game?.dkd_state) return false;
  let dkd_changed = false;
  const dkd_state = dkd_game.dkd_state;
  if (dkd_state.dkd_wallet !== 99999999) { dkd_state.dkd_wallet = 99999999; dkd_changed = true; }
  if (dkd_state.dkd_tokens !== 99999999) { dkd_state.dkd_tokens = 99999999; dkd_changed = true; }
  if (dkd_state.dkd_vipTrust !== 100) { dkd_state.dkd_vipTrust = 100; dkd_changed = true; }
  if (dkd_state.dkd_adminAllCities !== true) { dkd_state.dkd_adminAllCities = true; dkd_changed = true; }
  dkd_state.dkd_adminCityPackages = ['Ankara','İstanbul','İzmir','Bursa','Antalya'];
  if (dkd_game.dkd_career && dkd_game.dkd_career !== dkd_state) {
    dkd_game.dkd_career.dkd_wallet = dkd_state.dkd_wallet;
    dkd_game.dkd_career.dkd_tokens = dkd_state.dkd_tokens;
    dkd_game.dkd_career.dkd_vipTrust = dkd_state.dkd_vipTrust;
    dkd_game.dkd_career.dkd_adminAllCities = true;
    dkd_game.dkd_career.dkd_adminCityPackages = [...dkd_state.dkd_adminCityPackages];
  }
  return dkd_changed;
}

function dkd_v05LiveInfiniteMoneyText(dkd_html, dkd_game) {
  if (!dkd_v05LiveIsAdmin(dkd_game)) return dkd_html;
  return String(dkd_html).replace(/99\.999\.999 TL/g, '∞ TL');
}

function dkd_v05LiveInstallStyles() {
  if (document.getElementById('dkd-v05-live-season-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v05-live-season-style';
  dkd_style.textContent = `
    .dkd-v05-live-strip{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border:1px solid #59cfc5;border-radius:18px;background:#173638;margin-bottom:18px}
    .dkd-v05-live-strip strong{font-size:13px;letter-spacing:.9px;color:#8ef0df}.dkd-v05-live-strip small{color:#d5e5e6;text-align:right;line-height:1.35}
    .dkd-v05-stock{display:inline-flex;align-items:center;justify-content:center;min-height:26px;padding:4px 9px;border:1px solid currentColor;border-radius:999px;font-size:10px;font-weight:900;letter-spacing:.7px;margin-top:9px}
    .dkd-v05-season-roadmap{display:grid;gap:12px;margin-top:14px}.dkd-v05-season-card{padding:15px 16px;border:1px solid #3f5477;border-radius:18px;background:#16243d}
    .dkd-v05-season-card.dkd-current{border-color:#65c9c2;background:#183638}.dkd-v05-season-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.dkd-v05-season-card h3{font-size:17px;margin:3px 0 5px}.dkd-v05-season-card p{font-size:12px;color:#aebbd0;margin:0}
    .dkd-v05-season-gifts{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.dkd-v05-season-gifts span{padding:7px 9px;border-radius:11px;background:#233556;color:#eaf1ff;font-size:11px;font-weight:800}
    .dkd-v05-admin-city{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:13px 0;border-bottom:1px solid #31415d}.dkd-v05-admin-city:last-child{border-bottom:0}.dkd-v05-admin-city b{display:block}.dkd-v05-admin-city small{display:block;color:#aebbd0;margin-top:3px}.dkd-v05-admin-city .dkd-chip{white-space:nowrap}
  `;
  document.head.appendChild(dkd_style);
}

dkd_Game.prototype.dkd_receive = function dkd_v05LiveReceive(dkd_payload) {
  const dkd_result = dkd_v05LivePrevious.dkd_receive.call(this, dkd_payload);
  if (dkd_payload?.dkd_type === 'cloud-bootstrap') {
    dkd_v05LiveSyncPrizeSlots(this);
    const dkd_changed = dkd_v05LiveApplyAdmin(this);
    if (dkd_changed) dkd_v05LivePrevious.dkd_save.call(this);
    if (['home','vault','settings','garage','wallet','city','choose'].includes(this.dkd_pageName)) this.dkd_render(this.dkd_pageName);
  }
  return dkd_result;
};

dkd_Game.prototype.dkd_save = function dkd_v05LiveSave() {
  dkd_v05LiveApplyAdmin(this);
  return dkd_v05LivePrevious.dkd_save.call(this);
};

dkd_Game.prototype.dkd_action = function dkd_v05LiveAction(dkd_action) {
  const dkd_admin = dkd_v05LiveIsAdmin(this);
  if (dkd_admin) dkd_v05LiveApplyAdmin(this);
  const dkd_result = dkd_v05LivePrevious.dkd_action.call(this, dkd_action);
  if (dkd_admin && dkd_v05LiveApplyAdmin(this)) dkd_v05LivePrevious.dkd_save.call(this);
  return dkd_result;
};

dkd_Game.prototype.dkd_view_home = function dkd_v05LiveHome() {
  dkd_v05LiveSyncPrizeSlots(this);
  let dkd_html = dkd_v05LivePrevious.dkd_view_home.call(this);
  const dkd_actionsIndex = dkd_html.indexOf('<div class="dkd-home-actions">');
  if (dkd_actionsIndex >= 0) {
    const dkd_before = dkd_html.slice(0, dkd_actionsIndex);
    let dkd_after = dkd_html.slice(dkd_actionsIndex);
    dkd_after = dkd_after.replace(/<button data-dkd-action="garage"><span class="dkd-quick-icon">[\s\S]*?<\/span><span>Garaj<\/span><\/button>/, `<button data-dkd-action="messages"><span class="dkd-quick-icon">${dkd_icon('message')}</span><span>Mesajlar</span></button>`);
    dkd_html = dkd_before + dkd_after;
  }
  return dkd_v05LiveInfiniteMoneyText(dkd_html, this);
};

if (typeof dkd_v05LivePrevious.dkd_view_wallet === 'function') {
  dkd_Game.prototype.dkd_view_wallet = function dkd_v05LiveWallet() {
    return dkd_v05LiveInfiniteMoneyText(dkd_v05LivePrevious.dkd_view_wallet.call(this), this);
  };
}

if (typeof dkd_v05LivePrevious.dkd_view_garage === 'function') {
  dkd_Game.prototype.dkd_view_garage = function dkd_v05LiveGarage() {
    return dkd_v05LiveInfiniteMoneyText(dkd_v05LivePrevious.dkd_view_garage.call(this), this);
  };
}

dkd_Game.prototype.dkd_view_choose = function dkd_v05LiveChoose() {
  const dkd_season = dkd_v05LiveCurrentSeason(this);
  const dkd_rewards = dkd_v05LiveSeasonRewards(this, dkd_season?.dkd_id || 'dkd_season01');
  const dkd_number = String(dkd_season?.dkd_number || 1).padStart(2, '0');
  const dkd_body = `<span class="dkd-kicker">GERÇEK SEZON ${dkd_number} · ${dkd_escape(dkd_season?.dkd_name || 'BÜYÜK FIRTINA')}</span><h2 style="margin:13px 0">Hangi fiziksel ödül<br/>senin hedefin?</h2><p class="dkd-muted dkd-text-sm">Seçimini şimdi yap. Final Görevi ve beceri skoru tamamlandığında sunucu doğrulama süreci bu ödül için çalışır.</p><div class="dkd-space"></div>${dkd_rewards.map(dkd_reward => `<button class="dkd-card dkd-card-button ${this.dkd_state.dkd_prize===dkd_reward.dkd_slot_id?'dkd-active':''}" style="margin-bottom:15px" data-dkd-action="prize:${dkd_reward.dkd_slot_id}"><div class="dkd-row"><span class="dkd-icon-tile">${dkd_icon(dkd_v05LiveRewardIcon(dkd_reward))}</span><div><h3>${dkd_escape(dkd_reward.dkd_name)}</h3><small>${dkd_escape(dkd_reward.dkd_subtitle)} · ${Math.max(1,Number(dkd_reward.dkd_quantity||1))} adet</small></div></div></button>`).join('')}`;
  return this.dkd_page('Sezon ödülünü seç', dkd_body, dkd_button('ŞİRKET MERKEZİNE GİR','home','company'));
};

dkd_Game.prototype.dkd_view_vault = function dkd_v05LiveVault() {
  dkd_v05LiveSyncPrizeSlots(this);
  const dkd_state = this.dkd_state;
  const dkd_season = dkd_v05LiveCurrentSeason(this);
  const dkd_seasons = dkd_v05LiveCloudSeasons(this);
  const dkd_allRewards = dkd_v05LiveCloudRewards(this);
  const dkd_rewards = dkd_v05LiveSeasonRewards(this, dkd_season?.dkd_id || 'dkd_season01');
  const dkd_selectedReward = dkd_rewards.find(dkd_item => dkd_item.dkd_slot_id === dkd_state.dkd_prize) || dkd_rewards[0];
  const dkd_percent = dkd_progress(dkd_state);
  const dkd_requirements = dkd_finalRequirements(dkd_state);
  const dkd_requirementColors = ['#65c9c2','#8aa7ee','#edc56e','#e982b7'];
  const dkd_number = String(dkd_season?.dkd_number || 1).padStart(2, '0');
  const dkd_requirementCards = dkd_requirements.map((dkd_item, dkd_index) => {
    const dkd_have = Math.min(Number(dkd_item.dkd_need) || 0, Math.floor(Number(dkd_item.dkd_have) || 0));
    const dkd_need = Math.max(1, Number(dkd_item.dkd_need) || 1);
    const dkd_iconName = String(dkd_item.dkd_name || '').toLocaleLowerCase('tr-TR').includes('usta') ? 'star' : String(dkd_item.dkd_name || '').toLocaleLowerCase('tr-TR').includes('hik') ? 'message' : String(dkd_item.dkd_name || '').toLocaleLowerCase('tr-TR').includes('fırt') ? 'rain' : 'badge';
    return `<div class="dkd-v05-req" style="--dkd-req:${dkd_requirementColors[dkd_index % dkd_requirementColors.length]}"><div class="dkd-v05-req-head"><span class="dkd-v05-req-icon">${dkd_icon(dkd_iconName,18)}</span><b>${dkd_have}/${dkd_need}</b></div><h3>${dkd_escape(dkd_item.dkd_name)}</h3>${dkd_progressBar(dkd_have,dkd_need)}</div>`;
  }).join('');
  const dkd_schedule = dkd_seasons.map(dkd_item => {
    const dkd_itemRewards = dkd_allRewards.filter(dkd_reward => dkd_reward.dkd_season_id === dkd_item.dkd_id && dkd_reward.dkd_is_active !== false).sort((dkd_first,dkd_second)=>Number(dkd_first.dkd_sort||0)-Number(dkd_second.dkd_sort||0));
    const dkd_current = dkd_item.dkd_id === dkd_season?.dkd_id;
    return `<article class="dkd-v05-season-card ${dkd_current?'dkd-current':''}"><div class="dkd-v05-season-card-head"><div><span class="dkd-kicker">SEZON ${String(dkd_item.dkd_number||0).padStart(2,'0')}</span><h3>${dkd_escape(dkd_item.dkd_name)}</h3><p>${dkd_escape(dkd_item.dkd_theme||'')} · ${dkd_v05LiveFormatDate(dkd_item.dkd_starts_at)} – ${dkd_v05LiveFormatDate(dkd_item.dkd_ends_at)}</p></div><span class="dkd-chip ${dkd_current?'dkd-accent':''}">${dkd_current?'AKTİF':'SIRADAKİ'}</span></div><div class="dkd-v05-season-gifts">${dkd_itemRewards.map(dkd_reward=>`<span>${dkd_escape(dkd_reward.dkd_name)}</span>`).join('')}</div></article>`;
  }).join('');

  return `<div class="dkd-screen dkd-v05-vault">${this.dkd_header('ÖDÜL KASASI',`Gerçek Sezon ${dkd_number} · Aktif`)}<div class="dkd-v05-vault-body">
    <div class="dkd-v05-live-strip"><strong>● FİZİKSEL ÖDÜLLER AKTİF</strong><small>Beceri yarışması · Final Görevi<br/>Sunucu doğrulaması</small></div>
    <section class="dkd-v05-vault-hero" style="--dkd-vault-accent:${dkd_v05LivePrizeAccent(dkd_selectedReward?.dkd_slot_id)}"><div class="dkd-v05-vault-hero-top"><div><span class="dkd-kicker">SEZON ${dkd_number} · ${dkd_escape(dkd_season?.dkd_name || 'BÜYÜK FIRTINA')}</span><h1>${dkd_escape(dkd_selectedReward?.dkd_name || 'Sezon ödülü')} hedefi</h1><p>${dkd_escape(dkd_selectedReward?.dkd_subtitle || '')} · Final Görevi yolunda tüm ilerlemen tek ekranda.</p><span class="dkd-v05-stock">${Math.max(1,Number(dkd_selectedReward?.dkd_quantity||1))} ADET</span></div><span class="dkd-v05-vault-icon">${dkd_icon(dkd_v05LiveRewardIcon(dkd_selectedReward))}</span></div><div class="dkd-v05-vault-percent">%${dkd_percent}</div><div class="dkd-v05-vault-progress"><span style="width:${dkd_clamp(dkd_percent,0,100)}%"></span></div><div class="dkd-v05-vault-mini"><div><b>${dkd_state.dkd_master}</b><small>USTA TESLİMAT</small></div><div><b>${dkd_state.dkd_chapter}/6</b><small>HİKÂYE</small></div><div><b>${Math.min(10,dkd_state.dkd_storm)}/10</b><small>FIRTINA</small></div></div></section>
    <section class="dkd-v05-vault-section"><div class="dkd-v05-vault-section-head"><div><span class="dkd-kicker">HEDEFİNİ SEÇ</span><h2>Sezon 01 ödülleri</h2></div><small>Her sezon<br/>3 yeni hediye.</small></div><div class="dkd-v05-prize-grid">${dkd_rewards.map(dkd_reward=>`<button class="dkd-v05-prize ${dkd_reward.dkd_slot_id===dkd_state.dkd_prize?'dkd-selected':''}" style="--dkd-prize:${dkd_v05LivePrizeAccent(dkd_reward.dkd_slot_id)}" data-dkd-action="prize:${dkd_reward.dkd_slot_id}">${dkd_icon(dkd_v05LiveRewardIcon(dkd_reward))}<b>${dkd_escape(dkd_reward.dkd_name)}</b><small>${dkd_escape(dkd_reward.dkd_subtitle)}</small><span class="dkd-v05-stock">${Math.max(1,Number(dkd_reward.dkd_quantity||1))} ADET</span></button>`).join('')}</div></section>
    <section class="dkd-v05-vault-section"><div class="dkd-v05-vault-section-head"><div><span class="dkd-kicker">FİNAL ROTASI</span><h2>Kilidi açan hedefler</h2></div><small>${dkd_requirements.filter(dkd_item=>Number(dkd_item.dkd_have)>=Number(dkd_item.dkd_need)).length}/${dkd_requirements.length} tamamlandı</small></div><div class="dkd-v05-requirements">${dkd_requirementCards}</div></section>
    <section class="dkd-v05-final-card"><div class="dkd-between"><div><span class="dkd-kicker">SON TESLİMAT</span><h3 style="margin-top:5px">${dkd_finalUnlocked(dkd_state)?'Final Görevi hazır.':'Final Görevi henüz kilitli.'}</h3></div>${dkd_icon(dkd_finalUnlocked(dkd_state)?'trophy':'lock',26)}</div>${dkd_button(dkd_finalUnlocked(dkd_state)?'FİNAL GÖREVİNE GİR':'HEDEFLERİ TAMAMLA','final',dkd_finalUnlocked(dkd_state)?'trophy':'lock',dkd_finalUnlocked(dkd_state)?'':'dkd-secondary')}</section>
    <section class="dkd-v05-vault-section"><div class="dkd-v05-vault-section-head"><div><span class="dkd-kicker">SEZON TAKVİMİ</span><h2>Sıradaki hediyeler</h2></div><small>Her sezonda<br/>yeni 3 ödül.</small></div><div class="dkd-v05-season-roadmap">${dkd_schedule}</div></section>
  </div></div>`;
};

if (typeof dkd_v05LivePrevious.dkd_view_city === 'function') {
  dkd_Game.prototype.dkd_view_city = function dkd_v05LiveCity() {
    if (!dkd_v05LiveIsAdmin(this)) return dkd_v05LivePrevious.dkd_view_city.call(this);
    const dkd_cities = Array.isArray(this.dkd_v04Cloud?.dkd_city_packages) && this.dkd_v04Cloud.dkd_city_packages.length
      ? this.dkd_v04Cloud.dkd_city_packages
      : [
          { dkd_name:'Ankara',dkd_road_data_ready:true },{ dkd_name:'İstanbul',dkd_road_data_ready:false },{ dkd_name:'İzmir',dkd_road_data_ready:false },{ dkd_name:'Bursa',dkd_road_data_ready:false },{ dkd_name:'Antalya',dkd_road_data_ready:false },
        ];
    const dkd_rows = dkd_cities.map(dkd_city=>`<div class="dkd-v05-admin-city"><div><b>${dkd_escape(dkd_city.dkd_name)}</b><small>${dkd_city.dkd_road_data_ready?'Gerçek yol verisi hazır':'Yönetici kilidi açık · yol paketi hazırlanıyor'}</small></div><span class="dkd-chip dkd-accent">AÇIK</span></div>`).join('');
    return this.dkd_page('Şehir paketleri', `<span class="dkd-kicker">YÖNETİCİ ERİŞİMİ</span><h2 style="margin:12px 0">Tüm şehir kilitleri açık.</h2><p class="dkd-muted dkd-text-sm">Yönetici hesabında seviye kilidi uygulanmaz. Gerçek yol verisi hazır olmayan şehirlerde Ankara verisi taklit edilmez.</p><div class="dkd-space"></div><div class="dkd-card">${dkd_rows}</div>`, dkd_button('ANKARA’DA DEVAM ET','home','pin'));
  };
}

function dkd_v05LiveDisposeSign(dkd_sign) {
  try { dkd_sign.geometry?.dispose?.(); } catch {}
  try { dkd_sign.material?.map?.dispose?.(); } catch {}
  try { dkd_sign.material?.dispose?.(); } catch {}
}

function dkd_v05LiveUpgradeCourierCenterSign(dkd_scene) {
  if (!dkd_scene?.dkd_hub) return;
  for (const dkd_child of [...dkd_scene.dkd_hub.children]) {
    if (!dkd_child?.isMesh) continue;
    const dkd_match = Math.abs(Number(dkd_child.position?.x) + 4.5) < .35
      && Math.abs(Number(dkd_child.position?.y) - 4.7) < .35
      && Math.abs(Number(dkd_child.position?.z) + 6.69) < .18;
    if (!dkd_match) continue;
    dkd_scene.dkd_hub.remove(dkd_child);
    dkd_v05LiveDisposeSign(dkd_child);
  }
  const dkd_sign = dkd_scene.dkd_sign('SON KİLOMETRE / KURYE MERKEZİ', 6.8, '#d4d8dd', .96);
  dkd_sign.name = 'dkd_v05_live_courier_center_sign';
  dkd_sign.position.set(-4.25, 5.18, -6.67);
  dkd_scene.dkd_hub.add(dkd_sign);
}

dkd_Scene.prototype.dkd_buildHub = function dkd_v05LiveBuildHub() {
  const dkd_result = dkd_v05LivePrevious.dkd_sceneBuildHub.call(this);
  dkd_v05LiveUpgradeCourierCenterSign(this);
  return dkd_result;
};

dkd_v05LiveInstallStyles();

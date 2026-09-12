// DraBornGo / Last Mile v0.7.5 — vault goal details, clean season copy, reward/avatar/fleet polish.
// Shared final runtime layer for Android/Expo and Web. No gradients, shadows or glow.
const dkd_v075PolishPrevious = {
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_render: dkd_Game.prototype.dkd_render,
  dkd_buildBike: dkd_Scene.prototype.dkd_buildBike,
  dkd_avatar,
};

function dkd_v075PolishInstallStyles() {
  if (document.getElementById('dkd-v075-ui-model-polish-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v075-ui-model-polish-style';
  dkd_style.textContent = `
    .dkd-v075-goal-open{position:relative;cursor:pointer;transition:transform .16s ease,border-color .16s ease;background:#172b43!important}
    .dkd-v075-goal-open:nth-child(4n+1){border-top:4px solid #68d8ce}.dkd-v075-goal-open:nth-child(4n+2){border-top:4px solid #87a4ff}.dkd-v075-goal-open:nth-child(4n+3){border-top:4px solid #f2ca6c}.dkd-v075-goal-open:nth-child(4n+4){border-top:4px solid #e77db5}
    .dkd-v075-goal-open:active{transform:scale(.985)}.dkd-v075-goal-open:focus-visible{outline:2px solid #e4ff5e;outline-offset:3px}
    .dkd-v075-goal-hint{display:flex;align-items:center;gap:6px;margin-top:11px;color:#b9cbda;font-size:9px;font-weight:950;letter-spacing:.7px}.dkd-v075-goal-hint svg{width:13px;height:13px;color:#e4ff5e}
    .dkd-v075-goal-modal{display:grid;gap:13px;text-align:left;animation:dkd-v075-goal-in .3s cubic-bezier(.2,.8,.2,1) both}
    .dkd-v075-goal-top{display:flex;align-items:center;gap:12px;padding:13px;border:1px solid #526f8c;border-radius:16px;background:#132a40}.dkd-v075-goal-icon{width:49px;height:49px;display:grid;place-items:center;flex:0 0 auto;border:1px solid #6b89a7;border-radius:14px;background:#24445c;color:#e4ff5e}.dkd-v075-goal-icon svg{width:25px;height:25px}.dkd-v075-goal-top small{display:block;color:#a9bdd0;font-size:9px;font-weight:900;letter-spacing:.7px}.dkd-v075-goal-top b{display:block;margin-top:4px;font-size:18px;color:#fff}
    .dkd-v075-goal-meter{padding:13px;border:1px solid #455f79;border-radius:15px;background:#0e2134}.dkd-v075-goal-numbers{display:flex;justify-content:space-between;gap:10px;align-items:end}.dkd-v075-goal-numbers span{font-size:10px;color:#aebfd0;font-weight:900}.dkd-v075-goal-numbers b{font-size:22px;color:#fff1b6}.dkd-v075-goal-track{height:7px;margin-top:10px;overflow:hidden;border-radius:999px;background:#071725}.dkd-v075-goal-track span{display:block;height:100%;width:var(--dkd-goal-progress);background:#6eddd1;transform-origin:left center;animation:dkd-v075-goal-progress .6s ease-out both}
    .dkd-v075-goal-how{padding:14px;border-left:6px solid #8da4ff;border-radius:14px;background:#192943}.dkd-v075-goal-how h4{margin:0 0 9px;font-size:13px;color:#fff}.dkd-v075-goal-step{display:flex;gap:9px;align-items:flex-start;padding:8px 0;border-top:1px solid #344b66;color:#c8d6e3;font-size:12px;line-height:1.45}.dkd-v075-goal-step:first-of-type{border-top:0}.dkd-v075-goal-step i{width:22px;height:22px;display:grid;place-items:center;flex:0 0 auto;border-radius:50%;background:#304b62;color:#e4ff5e;font-style:normal;font-size:10px;font-weight:950}
    .dkd-v075-goal-status{padding:10px 12px;border:1px solid #536f88;border-radius:12px;background:#203248;color:#d9e5ef;font-size:11px;line-height:1.45}.dkd-v075-goal-status[data-dkd-complete='true']{border-color:#7fa64a;background:#293d27;color:#efffb9}
    @keyframes dkd-v075-goal-in{from{opacity:0;transform:translateY(10px) scale(.985)}to{opacity:1;transform:none}}@keyframes dkd-v075-goal-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}
    html[data-dkd-motion='off'] .dkd-v075-goal-modal,html[data-dkd-motion='off'] .dkd-v075-goal-track span{animation:none!important;transform:none!important}@media(prefers-reduced-motion:reduce){.dkd-v075-goal-modal,.dkd-v075-goal-track span{animation:none!important;transform:none!important}}
  `;
  document.head.appendChild(dkd_style);
}
dkd_v075PolishInstallStyles();

function dkd_v075PolishNormalizeRewards() {
  try {
    if (Array.isArray(dkd_v05LiveFallbackRewards)) for (const dkd_reward of dkd_v05LiveFallbackRewards) {
      if (dkd_reward?.dkd_id === 'dkd_s01_tablet') {
        dkd_reward.dkd_name = 'Apple iPad PRO';
        dkd_reward.dkd_subtitle = 'Sezon 01 Apple iPad PRO ödülü';
      }
    }
  } catch {}
}
dkd_v075PolishNormalizeRewards();

function dkd_v075PolishVisibleCopy(dkd_root) {
  if (!dkd_root) return;
  for (const dkd_paragraph of dkd_root.querySelectorAll?.('.dkd-v075-season-hero > p') || []) {
    if (String(dkd_paragraph.textContent || '').trim().startsWith('Sayaçlar Supabase')) dkd_paragraph.remove();
  }
  try {
    const dkd_walker = document.createTreeWalker(dkd_root, NodeFilter.SHOW_TEXT);
    const dkd_nodes = [];
    while (dkd_walker.nextNode()) dkd_nodes.push(dkd_walker.currentNode);
    for (const dkd_node of dkd_nodes) if (String(dkd_node.nodeValue || '').includes('Premium Tablet')) dkd_node.nodeValue = String(dkd_node.nodeValue).replaceAll('Premium Tablet','Apple iPad PRO');
  } catch {}
}

const dkd_v075GoalCopy = [
  {
    dkd_name:'Usta Teslimat', dkd_icon:'star',
    dkd_intro:'100 kusursuz Usta Teslimat tamamla. Her teslimat yalnız tüm kalite koşulları aynı anda sağlanırsa sayılır.',
    dkd_steps:['Siparişi süre dolmadan teslim et.','Paket hasarını sıfıra yakın tut ve kaliteyi en az %85 koru.','Ters yönü 2 olayın altında, yol dışını 8 saniyenin altında tut; kurtarma kullanma.']
  },
  {
    dkd_name:'Özel Müşteri hikâyesi', dkd_icon:'message',
    dkd_intro:'Seçtiğin Özel Müşterinin altı hikâye bölümünü sırayla tamamla. Sezon boyunca karakter seçimin kilitli kalır.',
    dkd_steps:['100 Usta Teslimat ile Özel Müşteri erişim jetonunu kazan.','Görevler bölümünden çalışacağın Özel Müşteriyi seç.','Özel Müşteri görevini zamanında ve %20 hasarın altında bitir; her geçerli bölüm bir sonraki bölümü açar.']
  },
  {
    dkd_name:'Fırtına teslimatı', dkd_icon:'storm',
    dkd_intro:'Fırtına veya sel koşullarında 10 teslimatı zamanında tamamla. Normal yağmur bu hedefe tek başına sayılmaz.',
    dkd_steps:['Dağıtım ekranında fırtına ya da sel hava koşullu siparişi seç.','Yol tutuşuna göre hızını azalt; hasar ve rota hatasını kontrol et.','Siparişi süre dolmadan teslim et. Yalnız zamanında biten fırtına/sel teslimatları sayılır.']
  },
  {
    dkd_name:'Şirket itibarı', dkd_icon:'badge',
    dkd_intro:'Şirket itibarını 90/100 seviyesine çıkar. Bu değer teslimatlarının ortalama müşteri puanından hesaplanır.',
    dkd_steps:['Ortalama puanı en az 4,5/5 seviyesinde tut.','Zamanında teslimat ve yüksek paket kalitesi puanı korur.','Hasar, geç teslimat ve düşük kalite puanı düşürür; temiz seri teslimatlar yap.']
  },
];

function dkd_v075PolishPrepareVaultGoals(dkd_game) {
  if (dkd_game?.dkd_pageName !== 'vault' || !dkd_game?.dkd_root) return;
  const dkd_cards = [...dkd_game.dkd_root.querySelectorAll('.dkd-v05-req')];
  dkd_cards.slice(0, dkd_v075GoalCopy.length).forEach((dkd_card, dkd_index) => {
    dkd_card.classList.add('dkd-v075-goal-open');
    dkd_card.dataset.dkdAction = `v075-goal-detail:${dkd_index}`;
    dkd_card.setAttribute('role','button');
    dkd_card.setAttribute('tabindex','0');
    dkd_card.setAttribute('aria-label',`${dkd_v075GoalCopy[dkd_index].dkd_name} nasıl tamamlanır?`);
    if (!dkd_card.querySelector('.dkd-v075-goal-hint')) dkd_card.insertAdjacentHTML('beforeend',`<span class="dkd-v075-goal-hint">${dkd_icon('info',13)} DETAY · NASIL TAMAMLANIR</span>`);
  });
}

function dkd_v075PolishGoalProgress(dkd_game, dkd_index) {
  const dkd_requirements = dkd_finalRequirements(dkd_game.dkd_state);
  const dkd_requirement = dkd_requirements[dkd_index] || {dkd_have:0,dkd_need:1};
  const dkd_have = Math.max(0, Number(dkd_requirement.dkd_have || 0));
  const dkd_need = Math.max(1, Number(dkd_requirement.dkd_need || 1));
  const dkd_percent = Math.max(0,Math.min(100,Math.round(dkd_have / dkd_need * 100)));
  return { dkd_have, dkd_need, dkd_percent, dkd_complete:dkd_have >= dkd_need };
}

function dkd_v075PolishOpenGoal(dkd_game, dkd_index) {
  const dkd_copy = dkd_v075GoalCopy[dkd_index];
  if (!dkd_copy) return;
  const dkd_progress = dkd_v075PolishGoalProgress(dkd_game, dkd_index);
  const dkd_haveLabel = dkd_index === 3 ? Math.round(dkd_progress.dkd_have) : Math.floor(dkd_progress.dkd_have);
  const dkd_needLabel = dkd_index === 3 ? Math.round(dkd_progress.dkd_need) : Math.floor(dkd_progress.dkd_need);
  const dkd_remaining = Math.max(0, dkd_needLabel - dkd_haveLabel);
  const dkd_steps = dkd_copy.dkd_steps.map((dkd_step, dkd_stepIndex) => `<div class="dkd-v075-goal-step"><i>${dkd_stepIndex + 1}</i><span>${dkd_escape(dkd_step)}</span></div>`).join('');
  const dkd_body = `<div class="dkd-v075-goal-modal"><div class="dkd-v075-goal-top"><span class="dkd-v075-goal-icon">${dkd_icon(dkd_copy.dkd_icon,25)}</span><div><small>FİNAL ROTASI · HEDEF DETAYI</small><b>${dkd_escape(dkd_copy.dkd_name)}</b></div></div><div class="dkd-v075-goal-meter"><div class="dkd-v075-goal-numbers"><span>İLERLEME</span><b>${dkd_haveLabel}/${dkd_needLabel}</b></div><div class="dkd-v075-goal-track"><span style="--dkd-goal-progress:${dkd_progress.dkd_percent}%"></span></div></div><div class="dkd-v075-goal-status" data-dkd-complete="${dkd_progress.dkd_complete}">${dkd_progress.dkd_complete ? 'HEDEF TAMAMLANDI · Final rotasının bu kilidi açık.' : `Kalan: ${dkd_remaining}. ${dkd_escape(dkd_copy.dkd_intro)}`}</div><div class="dkd-v075-goal-how"><h4>NASIL TAMAMLANIR?</h4>${dkd_steps}</div></div>`;
  dkd_game.dkd_modal(dkd_copy.dkd_name, dkd_body, dkd_button('ANLADIM','modal-close','check'));
}

dkd_Game.prototype.dkd_render = function dkd_v075PolishRender(dkd_pageName, dkd_arg = null) {
  const dkd_result = dkd_v075PolishPrevious.dkd_render.call(this, dkd_pageName, dkd_arg);
  dkd_v075PolishVisibleCopy(this.dkd_root);
  dkd_v075PolishPrepareVaultGoals(this);
  return dkd_result;
};

dkd_Game.prototype.dkd_action = function dkd_v075PolishAction(dkd_action) {
  const dkd_command = String(dkd_action || '');
  if (dkd_command.startsWith('v075-goal-detail:')) {
    const dkd_index = Number(dkd_command.split(':')[1]);
    if (Number.isInteger(dkd_index)) dkd_v075PolishOpenGoal(this, dkd_index);
    return;
  }
  return dkd_v075PolishPrevious.dkd_action.call(this, dkd_action);
};

document.addEventListener('keydown', dkd_event => {
  if (!['Enter',' '].includes(dkd_event.key)) return;
  const dkd_target = dkd_event.target?.closest?.('.dkd-v075-goal-open[data-dkd-action]');
  if (!dkd_target) return;
  dkd_event.preventDefault();
  dkd_target.click();
});

function dkd_v075PolishMiraPortrait() {
  try {
    const dkd_named = new Set(typeof dkd_v06CustomerAvatars === 'object' && dkd_v06CustomerAvatars ? Object.values(dkd_v06CustomerAvatars) : []);
    const dkd_pool = Array.isArray(dkd_v061SafePortraitPool) ? dkd_v061SafePortraitPool : [];
    return dkd_pool.find(dkd_source => dkd_source && dkd_source !== dkd_v06AvatarMira && !dkd_named.has(dkd_source)) || dkd_pool.find(dkd_source => dkd_source && dkd_source !== dkd_v06AvatarMira) || '';
  } catch { return ''; }
}
const dkd_v075MiraPortrait = dkd_v075PolishMiraPortrait();
dkd_avatar = function dkd_v075PolishAvatar(dkd_id, dkd_large = false) {
  if (dkd_id === 'dkd_mira' && dkd_v075MiraPortrait) return `<img class="dkd-avatar${dkd_large ? ' dkd-large' : ''}" src="${dkd_v075MiraPortrait}" alt="Mira Kaya">`;
  return dkd_v075PolishPrevious.dkd_avatar(dkd_id, dkd_large);
};

function dkd_v075PolishFleetCourier(dkd_scene, dkd_bike, dkd_kind) {
  if (!dkd_bike || typeof dkd_v07PremiumRider !== 'function') return dkd_bike;
  if (dkd_bike.getObjectByName?.('dkd_v07_premium_courier_rider')) return dkd_bike;
  const dkd_rider = dkd_v07PremiumRider(dkd_scene);
  if (!dkd_rider) return dkd_bike;
  const dkd_fourWheel = ['car','van'].includes(String(dkd_kind || '').toLowerCase());
  if (dkd_fourWheel) {
    dkd_rider.scale.multiplyScalar(.9);
    dkd_rider.position.set(0,.72,-.04);
  } else {
    dkd_rider.position.y += .02;
  }
  dkd_rider.userData.dkd_allFleetCourier = true;
  dkd_bike.add(dkd_rider);
  return dkd_bike;
}

dkd_Scene.prototype.dkd_buildBike = function dkd_v075PolishBuildBike(dkd_kind = 'scooter') {
  const dkd_bike = dkd_v075PolishPrevious.dkd_buildBike.call(this, dkd_kind);
  return dkd_v075PolishFleetCourier(this, dkd_bike, dkd_kind);
};

window.dkd_lastMileV075 = {...(window.dkd_lastMileV075 || {}), dkd_goalDetails:true, dkd_cleanSeasonCopy:true, dkd_iPadProCopy:true, dkd_miraPortraitFixed:true, dkd_allFleetCourier:true};

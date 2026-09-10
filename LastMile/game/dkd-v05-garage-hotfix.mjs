// DraBornGo / Last Mile v0.5 garage + service UX hotfix.
// Loaded last. Prevents raw service errors, refreshes the garage UI, renames the starter scooter,
// moves the home identity block lower and gives the home screen a dedicated menu theme.

const dkd_v05GaragePrevious = {
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_receive: dkd_Game.prototype.dkd_receive,
  dkd_render: dkd_Game.prototype.dkd_render,
  dkd_view_garage: dkd_Game.prototype.dkd_view_garage,
};

const dkd_v05StarterVehicle = dkd_vehicles.find(dkd_vehicle => dkd_vehicle.dkd_id === 'dkd_city50');
if (dkd_v05StarterVehicle) {
  dkd_v05StarterVehicle.dkd_name = 'Başlangıç Scooterı';
  dkd_v05StarterVehicle.dkd_label = 'İlk kurye scooterı';
}

const dkd_v05GaragePreviousHistoryLabel = dkd_historyLabel;
dkd_historyLabel = function dkd_v05GarageHistoryLabel(dkd_label) {
  return dkd_v05GaragePreviousHistoryLabel(dkd_label).split('Şehir 50').join('Başlangıç Scooterı');
};

function dkd_v05GarageInstallStyles() {
  if (document.getElementById('dkd-v05-garage-hotfix-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v05-garage-hotfix-style';
  dkd_style.textContent = `
    .dkd-player-name{margin:112px 0 7px!important}
    .dkd-home-header .dkd-profile-pills{margin-top:12px!important;margin-bottom:8px!important}

    .dkd-v05-garage-hero{--dkd-garage:#ffbe88;position:relative;overflow:hidden;border:1px solid #526786;border-radius:28px;background:#17243b;padding:19px;animation:dkd-v05-garage-rise .38s ease-out both}
    .dkd-v05-garage-hero:before{content:'';position:absolute;left:0;top:0;bottom:0;width:8px;background:var(--dkd-garage)}
    .dkd-v05-garage-head{display:flex;align-items:center;justify-content:space-between;gap:14px}
    .dkd-v05-garage-vehicle{display:flex;align-items:center;gap:13px;min-width:0}
    .dkd-v05-garage-vehicle-icon{width:58px;height:58px;border-radius:19px;display:grid;place-items:center;background:var(--dkd-garage);color:#17243a;animation:dkd-v05-garage-float 2.6s ease-in-out infinite;flex:0 0 auto}
    .dkd-v05-garage-vehicle-icon svg{width:30px;height:30px}.dkd-v05-garage-hero h2{font-size:27px;line-height:1.05;margin:5px 0 3px}.dkd-v05-garage-hero small{color:#abb9cf}.dkd-v05-garage-wallet{display:flex;flex-direction:column;align-items:flex-end;gap:3px}.dkd-v05-garage-wallet b{font-size:18px;color:#e982b7}.dkd-v05-garage-wallet span{font-size:8px;color:#96a8c1;letter-spacing:.8px;font-weight:850}
    .dkd-v05-garage-health{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-top:16px}
    .dkd-v05-service-card{--dkd-service:#65cfc7;position:relative;overflow:hidden;min-height:150px;border:1px solid #445b78;border-top:7px solid var(--dkd-service);border-radius:24px;background:#182940;color:#edf4ff;padding:15px;text-align:left;animation:dkd-v05-garage-card-in .38s ease-out both;transition:transform .15s ease,border-color .15s ease,background-color .15s ease}
    .dkd-v05-service-card:nth-child(2){animation-delay:.05s}.dkd-v05-service-card:active{transform:scale(.98)}.dkd-v05-service-card.dkd-low{border-color:var(--dkd-service);animation:dkd-v05-garage-alert 1.15s ease-in-out infinite}
    .dkd-v05-service-card-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.dkd-v05-service-icon{width:43px;height:43px;border-radius:14px;background:var(--dkd-service);color:#14233a;display:grid;place-items:center}.dkd-v05-service-icon svg{width:23px;height:23px}.dkd-v05-service-card label{font-size:9px;letter-spacing:.9px;font-weight:900;color:#9eb0c9}.dkd-v05-service-value{font-size:34px;font-weight:950;letter-spacing:-1px;color:var(--dkd-service);margin:9px 0 7px}.dkd-v05-service-price{font-size:10px;color:#c2cedf}.dkd-v05-service-meter{height:7px;background:#2a3a54;border-radius:999px;overflow:hidden;margin-top:10px}.dkd-v05-service-meter span{display:block;height:100%;background:var(--dkd-service);border-radius:999px;transform-origin:left center;animation:dkd-v05-service-fill .65s ease-out both}
    .dkd-v05-garage-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:18px 0}.dkd-v05-garage-tabs button{min-height:58px;border:1px solid #435775;border-radius:18px;background:#192741;color:#dce7f8;font-weight:850}.dkd-v05-garage-tabs button.dkd-selected{background:#ffbe88;color:#17243a;border-color:#ffbe88;transform:translateY(-2px)}
    .dkd-v05-garage-note{border-left:6px solid #72cbe9;border-radius:0 18px 18px 0;background:#15263d;padding:14px 15px;color:#b9c8dc;font-size:11px;line-height:1.55;margin-bottom:15px}
    .dkd-v05-garage-fleet-card{--dkd-fleet:#8aa7ee;border:1px solid #435774;border-left:7px solid var(--dkd-fleet);border-radius:22px;background:#18263e;padding:16px;margin-bottom:12px;animation:dkd-v05-garage-card-in .38s ease-out both}.dkd-v05-garage-fleet-card.dkd-active{border-color:var(--dkd-fleet);background:#20304b}.dkd-v05-garage-fleet-title{display:flex;align-items:center;gap:11px}.dkd-v05-garage-fleet-title>span{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;background:var(--dkd-fleet);color:#17243a}.dkd-v05-garage-fleet-title h3{margin:0 0 3px;font-size:17px}.dkd-v05-garage-fleet-title small{font-size:9px;color:#aab9cf}.dkd-v05-fleet-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:13px 0}.dkd-v05-fleet-stats>div{border:1px solid #3e5270;border-radius:14px;background:#14223a;padding:9px;text-align:center}.dkd-v05-fleet-stats b{display:block;font-size:14px}.dkd-v05-fleet-stats small{font-size:8px;color:#96a9c2}
    .dkd-v05-style-item{display:grid;grid-template-columns:50px 1fr 48px;gap:11px;align-items:center;padding:13px 0;border-bottom:1px solid #263954}.dkd-v05-style-item:last-child{border-bottom:0}.dkd-v05-style-item-icon{width:48px;height:48px;border-radius:15px;background:#213a52;color:#ffb77f;display:grid;place-items:center}.dkd-v05-style-item b{display:block;font-size:15px}.dkd-v05-style-item small{display:block;margin-top:3px;color:#aab8cd}.dkd-v05-style-item .dkd-icon-btn{width:46px;height:46px}

    #dkd-modal .dkd-v05-service-modal{--dkd-service-alert:#ff966f;border:1px solid #685a6d;border-top:8px solid var(--dkd-service-alert);background:#17243b;overflow:hidden;animation:dkd-v05-service-pop .32s cubic-bezier(.2,.86,.32,1.22) both}
    .dkd-v05-service-modal-head{display:flex;align-items:center;gap:13px;margin-bottom:12px}.dkd-v05-service-modal-icon{width:60px;height:60px;border-radius:19px;background:var(--dkd-service-alert);color:#17243a;display:grid;place-items:center;animation:dkd-v05-service-wobble 1.5s ease-in-out infinite}.dkd-v05-service-modal-icon svg{width:31px;height:31px}.dkd-v05-service-modal h2{margin:0;font-size:23px}.dkd-v05-service-modal p{line-height:1.55;color:#b9c7db;margin:8px 0 14px}.dkd-v05-service-modal-stats{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:14px}.dkd-v05-service-modal-stats>div{border:1px solid #425675;border-radius:16px;background:#132139;padding:11px}.dkd-v05-service-modal-stats small{display:block;color:#91a5bf;font-size:8px}.dkd-v05-service-modal-stats b{display:block;font-size:20px;margin-top:3px}.dkd-v05-service-modal .dkd-button{min-height:58px}.dkd-v05-service-modal .dkd-button:first-child{background:#ffbe88;color:#17243a;border-color:#ffbe88}

    @keyframes dkd-v05-garage-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
    @keyframes dkd-v05-garage-card-in{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}
    @keyframes dkd-v05-garage-float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-5px) rotate(2deg)}}
    @keyframes dkd-v05-garage-alert{0%,100%{transform:scale(1)}50%{transform:scale(1.025)}}
    @keyframes dkd-v05-service-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
    @keyframes dkd-v05-service-pop{from{opacity:0;transform:translateY(18px) scale(.94)}to{opacity:1;transform:none}}
    @keyframes dkd-v05-service-wobble{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
    html[data-dkd-motion='off'] .dkd-v05-garage-hero,html[data-dkd-motion='off'] .dkd-v05-garage-vehicle-icon,html[data-dkd-motion='off'] .dkd-v05-service-card,html[data-dkd-motion='off'] .dkd-v05-garage-fleet-card,html[data-dkd-motion='off'] .dkd-v05-service-modal,html[data-dkd-motion='off'] .dkd-v05-service-modal-icon,html[data-dkd-motion='off'] .dkd-v05-service-meter span{animation:none!important}
    @media(max-height:760px){.dkd-player-name{margin-top:88px!important}.dkd-home-header .dkd-profile-pills{margin-top:10px!important}.dkd-v05-service-card{min-height:137px}.dkd-v05-garage-hero{padding:16px}}
    @media(max-width:370px){.dkd-v05-garage-health{gap:7px}.dkd-v05-service-card{padding:12px}.dkd-v05-service-value{font-size:30px}.dkd-v05-garage-tabs{gap:6px}.dkd-v05-garage-tabs button{font-size:11px}.dkd-v05-garage-hero h2{font-size:23px}}
  `;
  document.head.appendChild(dkd_style);
}

dkd_v05GarageInstallStyles();

function dkd_v05GarageFleetState(dkd_game) {
  const dkd_state = dkd_game?.dkd_state;
  if (!dkd_state) return { dkd_fuel: 100, dkd_condition: 100 };
  return dkd_state.dkd_fleet?.[dkd_state.dkd_equipped] || { dkd_fuel: 100, dkd_condition: 100 };
}

function dkd_v05GarageServicePopup(dkd_game, dkd_forceGeneric = false) {
  const dkd_fleet = dkd_v05GarageFleetState(dkd_game);
  const dkd_fuel = Math.max(0, Math.floor(Number(dkd_fleet.dkd_fuel) || 0));
  const dkd_condition = Math.max(0, Math.floor(Number(dkd_fleet.dkd_condition) || 0));
  const dkd_needsFuel = dkd_fuel < 5;
  const dkd_needsService = dkd_condition < 10;
  const dkd_title = dkd_forceGeneric && !dkd_needsFuel && !dkd_needsService ? 'Vardiya başlatılamadı' : 'Önce aracı hazırla';
  const dkd_text = dkd_forceGeneric && !dkd_needsFuel && !dkd_needsService
    ? 'Sunucu vardiyayı başlatamadı. Bağlantını kontrol edip tekrar deneyebilir veya Garaj’a dönüp araç durumunu gözden geçirebilirsin.'
    : `${dkd_needsService ? 'Araç bakım seviyesi vardiya için çok düşük. ' : ''}${dkd_needsFuel ? 'Yakıt seviyesi vardiya için yetersiz. ' : ''}Bakım en az %10, yakıt en az %5 olmalı.`;
  const dkd_alert = dkd_needsService ? '#ff8b72' : dkd_needsFuel ? '#f2c56d' : '#8aa7ee';
  const dkd_modal = document.getElementById('dkd-modal');
  if (!dkd_modal) return;
  dkd_modal.innerHTML = `<div class="dkd-modal-card dkd-v05-service-modal" style="--dkd-service-alert:${dkd_alert}" role="dialog" aria-modal="true" aria-label="${dkd_escape(dkd_title)}">
    <div class="dkd-v05-service-modal-head"><span class="dkd-v05-service-modal-icon">${dkd_icon(dkd_needsService?'settings':dkd_needsFuel?'fuel':'info')}</span><div><span class="dkd-kicker">VARDİYA KONTROLÜ</span><h2>${dkd_title}</h2></div></div>
    <p>${dkd_text}</p>
    <div class="dkd-v05-service-modal-stats"><div><small>YAKIT / ŞARJ</small><b>${dkd_fuel}%</b></div><div><small>ARAÇ DURUMU</small><b>${dkd_condition}%</b></div></div>
    <div class="dkd-stack">${dkd_button('GARAJA GİT','v05-service-garage','garage')}${dkd_button('ŞİMDİ DEĞİL','v05-service-close','close','dkd-secondary')}</div>
  </div>`;
  try { dkd_game.dkd_audio?.dkd_effect('hit'); } catch {}
}

function dkd_v05GarageStatusColor(dkd_value, dkd_kind) {
  if (dkd_value < (dkd_kind === 'fuel' ? 20 : 25)) return '#ff8b72';
  if (dkd_value < 55) return '#f0c66f';
  return dkd_kind === 'fuel' ? '#58d0c5' : '#91a8ff';
}

function dkd_v05GarageFleetCards(dkd_game) {
  const dkd_state = dkd_game.dkd_state;
  const dkd_palette = ['#ffb77f','#8aa7ee','#65cfc7','#e982b7','#f0c66f','#9ed47d','#72cbe9','#c09bea','#ef8767','#93b6d9'];
  return dkd_vehicles.map((dkd_vehicle, dkd_index) => {
    const dkd_owned = dkd_state.dkd_owned.includes(dkd_vehicle.dkd_id);
    const dkd_active = dkd_state.dkd_equipped === dkd_vehicle.dkd_id;
    const dkd_iconName = dkd_vehicle.dkd_kind === 'van' || dkd_vehicle.dkd_kind === 'car' ? 'truck' : 'helmet';
    return `<div class="dkd-v05-garage-fleet-card ${dkd_active?'dkd-active':''}" style="--dkd-fleet:${dkd_palette[dkd_index % dkd_palette.length]}">
      <div class="dkd-between"><div class="dkd-v05-garage-fleet-title"><span>${dkd_icon(dkd_iconName)}</span><div><h3>${dkd_escape(dkd_vehicle.dkd_name)}</h3><small>${dkd_escape(dkd_vehicle.dkd_label)}</small></div></div><span class="dkd-chip">SEV. ${dkd_vehicle.dkd_level}</span></div>
      <div class="dkd-v05-fleet-stats"><div><b>${Math.round(dkd_vehicle.dkd_speed)}</b><small>KM/SA</small></div><div><b>${dkd_vehicle.dkd_storage}</b><small>L HACİM</small></div><div><b>${Math.round(dkd_vehicle.dkd_handling*100)}</b><small>KONTROL</small></div></div>
      ${[['Hızlanma',dkd_vehicle.dkd_accel/9],['Yol tutuşu',dkd_vehicle.dkd_grip],['Dayanıklılık',dkd_vehicle.dkd_durability]].map(dkd_stat=>`<div class="dkd-stat-row"><span>${dkd_stat[0]}</span>${dkd_progressBar(dkd_stat[1],1)}<span>${Math.round(dkd_stat[1]*100)}</span></div>`).join('')}
      <div class="dkd-space"></div>${dkd_owned?dkd_button(dkd_active?'KULLANILIYOR':'BU ARACI SEÇ',`equip:${dkd_vehicle.dkd_id}`,'check','dkd-secondary'):dkd_button(`${dkd_currency(dkd_vehicle.dkd_price)} / SATIN AL`,`buy-vehicle:${dkd_vehicle.dkd_id}`,'wallet',dkd_level(dkd_state)<dkd_vehicle.dkd_level?'dkd-outline':'')}
    </div>`;
  }).join('');
}

function dkd_v05GarageUpgradeCards(dkd_game) {
  const dkd_state = dkd_game.dkd_state;
  const dkd_upgrades = [
    ['dkd_engine','Motor ayarı','Hız ve hızlanma','bolt','#ffb77f'],
    ['dkd_grip','Yol lastikleri','Yağmurda daha iyi tutuş','wheel','#65cfc7'],
    ['dkd_bag','Yalıtımlı çanta','Sıcaklık ve yağmur koruması','box','#91a8ff'],
  ];
  return `<div class="dkd-v05-garage-note">Geliştirmeler oyun bakiyesiyle alınır. Final Görevi standart araç kullanır; garaj yükseltmeleri finale taşınmaz.</div>${dkd_upgrades.map(dkd_upgrade=>`<div class="dkd-v05-garage-fleet-card" style="--dkd-fleet:${dkd_upgrade[4]}"><div class="dkd-v05-garage-fleet-title"><span>${dkd_icon(dkd_upgrade[3])}</span><div><h3>${dkd_upgrade[1]}</h3><small>${dkd_upgrade[2]}</small></div></div>${dkd_progressBar(dkd_state.dkd_upgrades[dkd_upgrade[0]],5)}<div class="dkd-between" style="margin:12px 0"><small>Seviye ${dkd_state.dkd_upgrades[dkd_upgrade[0]]} / 5</small><b>${dkd_currency(500+dkd_state.dkd_upgrades[dkd_upgrade[0]]*550)}</b></div>${dkd_button(dkd_state.dkd_upgrades[dkd_upgrade[0]]>=5?'EN YÜKSEK SEVİYE':'GELİŞTİR',`upgrade:${dkd_upgrade[0]}`,'plus','dkd-secondary')}</div>`).join('')}<div class="dkd-v05-garage-fleet-card" style="--dkd-fleet:#c09bea"><div class="dkd-v05-garage-fleet-title"><span>${dkd_icon('company')}</span><div><h3>Garajı büyüt</h3><small>Depo → atölye → şirket merkezi</small></div></div><p class="dkd-text-sm dkd-muted" style="margin:12px 0">Merkez geliştikçe atölye ekipmanları ve yeni şirket alanları açılır.</p>${dkd_button(dkd_state.dkd_garage>=3?'MERKEZ TAMAMLANDI':`${dkd_currency((dkd_state.dkd_garage+1)*4500)} / GARAJI BÜYÜT`,'garage-expand','company','dkd-secondary')}</div>`;
}

function dkd_v05GarageStyleCards(dkd_game) {
  const dkd_state = dkd_game.dkd_state;
  return `${dkd_button('ŞİRKET KİMLİĞİNİ DÜZENLE','brand','palette','dkd-secondary')}<div class="dkd-space"></div><div class="dkd-v05-garage-note">Kozmetikler oyun bakiyesiyle alınır. Görünümü değiştirir; Final skoruna etkisi yoktur.</div><div class="dkd-card" style="padding:0 15px">${dkd_cosmetics.map(dkd_item=>`<div class="dkd-v05-style-item"><span class="dkd-v05-style-item-icon">${dkd_icon(dkd_item.dkd_icon)}</span><div><b>${dkd_escape(dkd_item.dkd_name)}</b><small>${dkd_state.dkd_cosmetics.includes(dkd_item.dkd_id)?'Koleksiyonunda':dkd_currency(dkd_item.dkd_price)}</small></div>${dkd_iconButton(dkd_state.dkd_wearing.includes(dkd_item.dkd_id)?'check':'plus',`cosmetic:${dkd_item.dkd_id}`,'Kozmetiği al veya kullan',dkd_state.dkd_wearing.includes(dkd_item.dkd_id)?'dkd-selected':'')}</div>`).join('')}</div><div class="dkd-field"><label for="dkd-plate">Şirket plakası</label><input id="dkd-plate" maxlength="12" value="${dkd_escape(dkd_state.dkd_brand.dkd_plate)}"/><div class="dkd-space"></div>${dkd_button('PLAKAYI KAYDET','plate','check','dkd-secondary')}</div>`;
}

dkd_Game.prototype.dkd_view_garage = function dkd_v05GarageView() {
  const dkd_state = this.dkd_state;
  const dkd_stats = dkd_vehicleStats(dkd_state);
  const dkd_fleet = dkd_v05GarageFleetState(this);
  const dkd_fuel = Math.max(0, Math.floor(Number(dkd_fleet.dkd_fuel) || 0));
  const dkd_condition = Math.max(0, Math.floor(Number(dkd_fleet.dkd_condition) || 0));
  const dkd_fuelPrice = Math.ceil((100-dkd_fuel)*3);
  const dkd_repairPrice = Math.ceil((100-dkd_condition)*5);
  const dkd_tab = this.dkd_garageTab || 'fleet';
  const dkd_fuelColor = dkd_v05GarageStatusColor(dkd_fuel,'fuel');
  const dkd_conditionColor = dkd_v05GarageStatusColor(dkd_condition,'condition');
  const dkd_content = dkd_tab === 'upgrades' ? dkd_v05GarageUpgradeCards(this) : dkd_tab === 'style' ? dkd_v05GarageStyleCards(this) : dkd_v05GarageFleetCards(this);
  const dkd_vehicleIcon = dkd_stats.dkd_kind === 'van' || dkd_stats.dkd_kind === 'car' ? 'truck' : 'helmet';

  return this.dkd_page('Garaj', `<div class="dkd-v05-garage-hero">
    <div class="dkd-v05-garage-head"><div class="dkd-v05-garage-vehicle"><span class="dkd-v05-garage-vehicle-icon">${dkd_icon(dkd_vehicleIcon)}</span><div><span class="dkd-kicker">AKTİF KURYE ARACI</span><h2>${dkd_escape(dkd_stats.dkd_name)}</h2><small>${dkd_escape(dkd_stats.dkd_label || 'Vardiya aracı')}</small></div></div><div class="dkd-v05-garage-wallet"><span>BAKİYE</span><b>${dkd_currency(dkd_state.dkd_wallet)}</b></div></div>
    <div class="dkd-v05-garage-health">
      <button class="dkd-v05-service-card ${dkd_fuel<20?'dkd-low':''}" style="--dkd-service:${dkd_fuelColor}" data-dkd-action="refuel"><div class="dkd-v05-service-card-head"><span class="dkd-v05-service-icon">${dkd_icon('fuel')}</span><label>YAKIT / ŞARJ</label></div><div class="dkd-v05-service-value">${dkd_fuel}%</div><div class="dkd-v05-service-price">${dkd_fuelPrice?`${dkd_currency(dkd_fuelPrice)} · DOLDUR`:'TAM DOLU'}</div><div class="dkd-v05-service-meter"><span style="width:${dkd_fuel}%"></span></div></button>
      <button class="dkd-v05-service-card ${dkd_condition<25?'dkd-low':''}" style="--dkd-service:${dkd_conditionColor}" data-dkd-action="repair"><div class="dkd-v05-service-card-head"><span class="dkd-v05-service-icon">${dkd_icon('shield')}</span><label>ARAÇ DURUMU</label></div><div class="dkd-v05-service-value">${dkd_condition}%</div><div class="dkd-v05-service-price">${dkd_repairPrice?`${dkd_currency(dkd_repairPrice)} · BAKIM`:'SERVİSE HAZIR'}</div><div class="dkd-v05-service-meter"><span style="width:${dkd_condition}%"></span></div></button>
    </div>
  </div><div class="dkd-v05-garage-tabs">${[['fleet','Araçlar'],['upgrades','Geliştirme'],['style','Stil']].map(dkd_item=>`<button class="${dkd_tab===dkd_item[0]?'dkd-selected':''}" data-dkd-action="garage-tab:${dkd_item[0]}">${dkd_item[1]}</button>`).join('')}</div>${dkd_content}`,'','Atölye · bakım · filo');
};

dkd_Game.prototype.dkd_action = function dkd_v05GarageAction(dkd_action) {
  const dkd_text = String(dkd_action || '');
  const [dkd_command] = dkd_text.split(':');

  if (dkd_command === 'v05-service-close') {
    this.dkd_closeModal();
    return;
  }
  if (dkd_command === 'v05-service-garage') {
    this.dkd_closeModal();
    this.dkd_garageTab = 'fleet';
    return this.dkd_render('garage');
  }
  if (dkd_command === 'track') this.dkd_v05PreferredMenuTrack = Math.max(0, Number(dkd_text.split(':')[1]) || 0);

  if (dkd_command === 'start-run' && this.dkd_selectedOrder?.dkd_type !== 'final') {
    const dkd_fleet = dkd_v05GarageFleetState(this);
    if ((Number(dkd_fleet.dkd_fuel) || 0) < 5 || (Number(dkd_fleet.dkd_condition) || 0) < 10) {
      dkd_v05GarageServicePopup(this, false);
      return;
    }
  }
  return dkd_v05GaragePrevious.dkd_action.call(this, dkd_action);
};

dkd_Game.prototype.dkd_receive = function dkd_v05GarageReceive(dkd_payload) {
  if (dkd_payload?.dkd_type === 'cloud-error') {
    const dkd_errorText = String(dkd_payload.dkd_data || '');
    if (/server_error|yakıt|bakım|fuel|condition/i.test(dkd_errorText)) {
      this.dkd_v04JobsLoading = false;
      dkd_v05GarageServicePopup(this, true);
      return;
    }
  }
  return dkd_v05GaragePrevious.dkd_receive.call(this, dkd_payload);
};

// Home gets a dedicated energetic theme. Other menu pages return to the player's music choice.
dkd_Game.prototype.dkd_render = function dkd_v05GarageRender(dkd_pageName, dkd_arg = null) {
  const dkd_audio = this.dkd_audio;
  if (dkd_audio && dkd_pageName !== 'home' && this.dkd_v05HomeThemeActive) {
    const dkd_preferred = Number.isFinite(this.dkd_v05PreferredMenuTrack) ? this.dkd_v05PreferredMenuTrack : 0;
    try { dkd_v05SwitchTrack(dkd_audio, dkd_preferred, 'menu'); } catch {}
    this.dkd_v05HomeThemeActive = false;
  }
  const dkd_result = dkd_v05GaragePrevious.dkd_render.call(this, dkd_pageName, dkd_arg);
  if (dkd_audio && dkd_pageName === 'home') {
    if (!this.dkd_v05HomeThemeActive) {
      const dkd_current = Number(dkd_audio.dkd_v05MenuTrack ?? dkd_audio.dkd_track);
      if (!Number.isFinite(this.dkd_v05PreferredMenuTrack)) this.dkd_v05PreferredMenuTrack = Number.isFinite(dkd_current) ? dkd_current : 0;
    }
    try {
      dkd_audio.dkd_start();
      dkd_v05SwitchTrack(dkd_audio, 5, 'menu');
      dkd_v05ApplyMusicMode(dkd_audio, false);
      this.dkd_v05HomeThemeActive = true;
    } catch {}
  }
  return dkd_result;
};

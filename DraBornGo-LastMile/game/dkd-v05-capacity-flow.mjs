// DraBornGo / Last Mile v0.5 capacity + shift acceptance flow.
// Loaded after the garage hotfix. Adds visible package/vehicle load data,
// prevents cloud acceptance before local preflight, and fixes starter naming/brand sign placement.

const dkd_v05CapacityPrevious = {
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_receive: dkd_Game.prototype.dkd_receive,
  dkd_view_dispatch: dkd_Game.prototype.dkd_view_dispatch,
  dkd_view_order: dkd_Game.prototype.dkd_view_order,
  dkd_view_garage: dkd_Game.prototype.dkd_view_garage,
  dkd_sceneBuildHub: dkd_Scene.prototype.dkd_buildHub,
  dkd_sceneRefreshBrand: dkd_Scene.prototype.dkd_refreshBrand,
};

// The starter vehicle is now presented consistently with the player-facing name.
const dkd_v05CapacityStarter = dkd_vehicles.find(dkd_vehicle => dkd_vehicle.dkd_id === 'dkd_city50');
if (dkd_v05CapacityStarter) {
  dkd_v05CapacityStarter.dkd_name = 'İlk Motorum';
  dkd_v05CapacityStarter.dkd_label = 'İlk kurye motorun';
}

// Spare-parts jobs previously fell back to the oversized 65 kg package class.
// Give the real Last-Mile spare-parts category its own sensible local gameplay load.
if (!dkd_packages.some(dkd_package => dkd_package.dkd_id === 'dkd_parts')) {
  dkd_packages.push({
    dkd_id: 'dkd_parts',
    dkd_name: 'Acil Yedek Parça',
    dkd_tr: 'Acil yedek parça',
    dkd_icon: 'bolt',
    dkd_base: 420,
    dkd_weight: 8,
    dkd_decay: 0,
    dkd_sensitivity: 1.35,
    dkd_level: 1,
    dkd_note: 'Parçayı darbelerden koru ve servis noktasına zamanında ulaştır.',
  });
}

const dkd_v05CapacityPreviousHistoryLabel = dkd_historyLabel;
dkd_historyLabel = function dkd_v05CapacityHistoryLabel(dkd_label) {
  return dkd_v05CapacityPreviousHistoryLabel(dkd_label)
    .split('Başlangıç Scooterı').join('İlk Motorum')
    .split('Şehir 50').join('İlk Motorum');
};

function dkd_v05CapacityInstallStyles() {
  if (document.getElementById('dkd-v05-capacity-flow-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v05-capacity-flow-style';
  dkd_style.textContent = `
    .dkd-v05-capacity-strip{--dkd-capacity:#65cfc7;display:grid;grid-template-columns:1fr 1fr auto;gap:8px;align-items:center;margin-top:12px;padding:10px;border:1px solid #405675;border-left:6px solid var(--dkd-capacity);border-radius:16px;background:#15253d}
    .dkd-v05-capacity-strip>span{display:flex;align-items:center;gap:6px;min-width:0;color:#b8c7db;font-size:10px}.dkd-v05-capacity-strip>span svg{width:15px;height:15px;color:var(--dkd-capacity);flex:0 0 auto}.dkd-v05-capacity-strip b{font-size:10px;color:var(--dkd-capacity);white-space:nowrap}
    .dkd-v05-capacity-card{--dkd-capacity:#65cfc7;margin-top:16px;border:1px solid #425877;border-top:7px solid var(--dkd-capacity);border-radius:22px;background:#172740;padding:16px;animation:dkd-v05-capacity-in .34s ease-out both}
    .dkd-v05-capacity-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.dkd-v05-capacity-title{display:flex;align-items:center;gap:11px}.dkd-v05-capacity-icon{width:46px;height:46px;border-radius:15px;background:var(--dkd-capacity);color:#142239;display:grid;place-items:center}.dkd-v05-capacity-icon svg{width:24px;height:24px}.dkd-v05-capacity-title b{display:block;font-size:16px}.dkd-v05-capacity-title small{display:block;margin-top:3px;color:#9eb0c9;font-size:9px}.dkd-v05-capacity-state{border:1px solid var(--dkd-capacity);border-radius:999px;padding:6px 9px;color:var(--dkd-capacity);font-size:9px;font-weight:900;white-space:nowrap}
    .dkd-v05-capacity-values{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:13px}.dkd-v05-capacity-values>div{border:1px solid #3e5270;border-radius:15px;background:#122139;padding:11px}.dkd-v05-capacity-values small{display:block;color:#91a4be;font-size:8px;letter-spacing:.45px}.dkd-v05-capacity-values b{display:block;margin-top:4px;font-size:21px}.dkd-v05-capacity-note{margin-top:11px;color:#b6c5d9;font-size:10px;line-height:1.5}
    #dkd-modal .dkd-v05-capacity-modal{--dkd-capacity:#ff8b72;border:1px solid #5c5870;border-top:8px solid var(--dkd-capacity);background:#17243b;animation:dkd-v05-capacity-pop .3s cubic-bezier(.2,.86,.32,1.2) both}
    .dkd-v05-capacity-modal-head{display:flex;align-items:center;gap:13px}.dkd-v05-capacity-modal-icon{width:58px;height:58px;border-radius:18px;display:grid;place-items:center;background:var(--dkd-capacity);color:#142239;animation:dkd-v05-capacity-pulse 1.45s ease-in-out infinite}.dkd-v05-capacity-modal-icon svg{width:30px;height:30px}.dkd-v05-capacity-modal h2{margin:2px 0 0;font-size:23px}.dkd-v05-capacity-modal p{margin:12px 0 14px;line-height:1.55;color:#b9c7db}.dkd-v05-capacity-modal .dkd-v05-capacity-values{margin-bottom:14px}.dkd-v05-capacity-modal .dkd-button{min-height:58px}.dkd-v05-capacity-modal .dkd-button:first-child{background:var(--dkd-capacity);border-color:var(--dkd-capacity);color:#142239}
    .dkd-v05-start-wait{--dkd-capacity:#8aa7ee}.dkd-v05-start-wait .dkd-v05-capacity-modal-icon{animation:dkd-v05-capacity-spin 1.2s linear infinite}
    @keyframes dkd-v05-capacity-in{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}
    @keyframes dkd-v05-capacity-pop{from{opacity:0;transform:translateY(16px) scale(.95)}to{opacity:1;transform:none}}
    @keyframes dkd-v05-capacity-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
    @keyframes dkd-v05-capacity-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    html[data-dkd-motion='off'] .dkd-v05-capacity-card,html[data-dkd-motion='off'] .dkd-v05-capacity-modal,html[data-dkd-motion='off'] .dkd-v05-capacity-modal-icon{animation:none!important}
    @media(max-width:370px){.dkd-v05-capacity-strip{grid-template-columns:1fr 1fr;gap:6px}.dkd-v05-capacity-strip>b{grid-column:1/-1;justify-self:start}.dkd-v05-capacity-values{gap:7px}.dkd-v05-capacity-values b{font-size:18px}}
  `;
  document.head.appendChild(dkd_style);
}

dkd_v05CapacityInstallStyles();

function dkd_v05CapacityInfo(dkd_game, dkd_order = dkd_game?.dkd_selectedOrder) {
  const dkd_package = dkd_packages.find(dkd_item => dkd_item.dkd_id === dkd_order?.dkd_package) || dkd_packages[0];
  const dkd_vehicle = dkd_vehicleStats(dkd_game.dkd_state, dkd_order?.dkd_type === 'final');
  const dkd_required = Math.max(0, Number(dkd_order?.dkd_requiredLoad ?? dkd_package?.dkd_weight ?? 0) || 0);
  const dkd_capacity = Math.max(0, Number(dkd_vehicle?.dkd_storage ?? 0) || 0);
  return {
    dkd_package,
    dkd_vehicle,
    dkd_required,
    dkd_capacity,
    dkd_ok: dkd_required <= dkd_capacity,
  };
}

function dkd_v05CapacityColor(dkd_ok) {
  return dkd_ok ? '#65cfc7' : '#ff8b72';
}

function dkd_v05CapacityStrip(dkd_game, dkd_order) {
  const dkd_info = dkd_v05CapacityInfo(dkd_game, dkd_order);
  const dkd_color = dkd_v05CapacityColor(dkd_info.dkd_ok);
  return `<div class="dkd-v05-capacity-strip" style="--dkd-capacity:${dkd_color}">
    <span>${dkd_icon('box',15)} Paket yükü <strong>${dkd_info.dkd_required} kg</strong></span>
    <span>${dkd_icon(dkd_info.dkd_vehicle.dkd_kind==='car'||dkd_info.dkd_vehicle.dkd_kind==='van'?'truck':'helmet',15)} Maks. <strong>${dkd_info.dkd_capacity} kg</strong></span>
    <b>${dkd_info.dkd_ok?'ARAÇ UYGUN':'KAPASİTE YETERSİZ'}</b>
  </div>`;
}

function dkd_v05CapacityCard(dkd_game, dkd_order) {
  const dkd_info = dkd_v05CapacityInfo(dkd_game, dkd_order);
  const dkd_color = dkd_v05CapacityColor(dkd_info.dkd_ok);
  const dkd_difference = Math.max(0, dkd_info.dkd_required - dkd_info.dkd_capacity);
  return `<div class="dkd-v05-capacity-card" style="--dkd-capacity:${dkd_color}">
    <div class="dkd-v05-capacity-head"><div class="dkd-v05-capacity-title"><span class="dkd-v05-capacity-icon">${dkd_icon('box')}</span><div><b>Taşıma kontrolü</b><small>${dkd_escape(dkd_info.dkd_vehicle.dkd_name)}</small></div></div><span class="dkd-v05-capacity-state">${dkd_info.dkd_ok?'UYGUN':'YETERSİZ'}</span></div>
    <div class="dkd-v05-capacity-values"><div><small>SİPARİŞİN PAKET YÜKÜ</small><b>${dkd_info.dkd_required} kg</b></div><div><small>ARACIN MAKSİMUM TAŞIMASI</small><b>${dkd_info.dkd_capacity} kg</b></div></div>
    <div class="dkd-v05-capacity-note">${dkd_info.dkd_ok ? 'Aktif aracın bu siparişi taşıyabilir.' : `Bu sipariş için ${dkd_difference} kg daha fazla taşıma kapasitesi gerekiyor. Garajdan daha yüksek kapasiteli bir araç seç.`}</div>
  </div>`;
}

function dkd_v05CapacityPopup(dkd_game, dkd_order) {
  const dkd_info = dkd_v05CapacityInfo(dkd_game, dkd_order);
  const dkd_difference = Math.max(0, dkd_info.dkd_required - dkd_info.dkd_capacity);
  const dkd_modal = document.getElementById('dkd-modal');
  if (!dkd_modal) return;
  dkd_modal.innerHTML = `<div class="dkd-modal-card dkd-v05-capacity-modal" role="dialog" aria-modal="true" aria-label="Araç kapasitesi yetersiz">
    <div class="dkd-v05-capacity-modal-head"><span class="dkd-v05-capacity-modal-icon">${dkd_icon('box')}</span><div><span class="dkd-kicker">TAŞIMA KONTROLÜ</span><h2>Araç kapasitesi yetersiz</h2></div></div>
    <p>Bu sipariş aktif aracına göre ağır. Sipariş sunucuda kabul edilmedi; ilerlemen ve sipariş durumun değişmedi.</p>
    <div class="dkd-v05-capacity-values"><div><small>PAKET YÜKÜ</small><b>${dkd_info.dkd_required} kg</b></div><div><small>${dkd_escape(dkd_info.dkd_vehicle.dkd_name).toLocaleUpperCase('tr-TR')}</small><b>${dkd_info.dkd_capacity} kg</b></div></div>
    <p style="margin-top:0">En az <b>${dkd_difference} kg</b> daha fazla taşıma kapasitesi olan bir araç seçmelisin.</p>
    <div class="dkd-stack">${dkd_button('GARAJA GİT','v05-capacity-garage','garage')}${dkd_button('SİPARİŞLERE DÖN','v05-capacity-orders','back','dkd-secondary')}</div>
  </div>`;
  try { dkd_game.dkd_audio?.dkd_effect('hit'); } catch {}
}

function dkd_v05StartWaitingPopup(dkd_game) {
  const dkd_modal = document.getElementById('dkd-modal');
  if (!dkd_modal) return;
  dkd_modal.innerHTML = `<div class="dkd-modal-card dkd-v05-capacity-modal dkd-v05-start-wait" role="dialog" aria-modal="true" aria-label="Sipariş onaylanıyor">
    <div class="dkd-v05-capacity-modal-head"><span class="dkd-v05-capacity-modal-icon">${dkd_icon('refresh')}</span><div><span class="dkd-kicker">VARDİYA HAZIRLANIYOR</span><h2>Sipariş onaylanıyor</h2></div></div>
    <p>Araç ve paket kontrolleri tamamlandı. Sipariş sunucuda onaylanınca sürüş otomatik başlayacak.</p>
    <div class="dkd-stack">${dkd_button('İPTAL ET','v05-start-cancel','close','dkd-secondary')}</div>
  </div>`;
}

function dkd_v05StartErrorPopup(dkd_game, dkd_message) {
  const dkd_modal = document.getElementById('dkd-modal');
  if (!dkd_modal) return;
  const dkd_safeMessage = /server_error/i.test(String(dkd_message || ''))
    ? 'Sipariş sunucuda onaylanamadı. Bağlantını kontrol edip tekrar deneyebilirsin.'
    : String(dkd_message || 'Sipariş sunucuda onaylanamadı. Lütfen tekrar dene.');
  dkd_modal.innerHTML = `<div class="dkd-modal-card dkd-v05-capacity-modal" style="--dkd-capacity:#8aa7ee" role="dialog" aria-modal="true" aria-label="Vardiya başlatılamadı">
    <div class="dkd-v05-capacity-modal-head"><span class="dkd-v05-capacity-modal-icon">${dkd_icon('info')}</span><div><span class="dkd-kicker">BAĞLANTI KONTROLÜ</span><h2>Vardiya başlatılamadı</h2></div></div>
    <p>${dkd_escape(dkd_safeMessage)}</p>
    <div class="dkd-stack">${dkd_button('TEKRAR DENE','v05-start-retry','refresh')}${dkd_button('SİPARİŞLERE DÖN','v05-capacity-orders','back','dkd-secondary')}</div>
  </div>`;
}

function dkd_v05RunPreflight(dkd_game) {
  const dkd_order = dkd_game.dkd_selectedOrder;
  if (!dkd_order) throw new Error('Sipariş seçilmedi.');
  const dkd_info = dkd_v05CapacityInfo(dkd_game, dkd_order);
  if (!dkd_info.dkd_ok) {
    const dkd_error = new Error('capacity');
    dkd_error.dkd_capacity = true;
    throw dkd_error;
  }
  // Use the same core validation as the actual run without mutating the active run.
  dkd_createRun(dkd_game.dkd_state, dkd_game.dkd_graph, dkd_order, dkd_game.dkd_routeMode);
  return dkd_info;
}

function dkd_v05BeginLocalRun(dkd_game) {
  dkd_game.dkd_closeModal();
  try {
    return dkd_game.dkd_startRun();
  } catch (dkd_error) {
    const dkd_message = String(dkd_error?.message || 'Vardiya başlatılamadı.');
    if (/kapasite/i.test(dkd_message)) return dkd_v05CapacityPopup(dkd_game, dkd_game.dkd_selectedOrder);
    if (/yakıt|bakım/i.test(dkd_message) && typeof dkd_v05GarageServicePopup === 'function') return dkd_v05GarageServicePopup(dkd_game, false);
    return dkd_v05StartErrorPopup(dkd_game, dkd_message);
  }
}

// Move the in-world company sign left in both initial hub construction and subsequent brand refreshes.
dkd_Scene.prototype.dkd_buildHub = function dkd_v05CapacityBuildHub() {
  const dkd_result = dkd_v05CapacityPrevious.dkd_sceneBuildHub.call(this);
  if (this.dkd_companySign) this.dkd_companySign.position.x = -1.55;
  return dkd_result;
};

dkd_Scene.prototype.dkd_refreshBrand = function dkd_v05CapacityRefreshBrand(dkd_kind = this.dkd_bikeKind) {
  const dkd_result = dkd_v05CapacityPrevious.dkd_sceneRefreshBrand.call(this, dkd_kind);
  if (this.dkd_companySign) this.dkd_companySign.position.x = -1.55;
  return dkd_result;
};

dkd_Game.prototype.dkd_view_dispatch = function dkd_v05CapacityDispatch() {
  if (!this.dkd_orders.length && !this.dkd_v04JobsLoading) this.dkd_refreshOrders();
  const dkd_status = this.dkd_v04JobsLoading
    ? '<div class="dkd-notice">Gerçek sipariş havuzu yenileniyor…</div>'
    : !this.dkd_orders.length
      ? '<div class="dkd-notice">Şu anda uygun sipariş bulunamadı. Yenile düğmesiyle tekrar kontrol edebilirsin.</div>'
      : '';
  const dkd_demoLabel = this.dkd_v04IsAdmin && this.dkd_v04Cloud?.dkd_demo_enabled === true
    ? '<span class="dkd-chip">ADMIN DEMO AÇIK</span>'
    : '<span class="dkd-chip dkd-accent">GERÇEK VERİ</span>';

  const dkd_body = `<div class="dkd-between"><div><span class="dkd-kicker">LAST-MILE / ANKARA</span><h2 style="margin-top:8px">Sıradaki siparişler.</h2></div>${dkd_iconButton('refresh','orders-refresh','Siparişleri yenile')}</div>
    <div class="dkd-space"></div><div class="dkd-between">${dkd_demoLabel}<small>Canlı sipariş ağı</small></div>
    <div class="dkd-space"></div>${dkd_status}<div class="dkd-space"></div>
    ${this.dkd_orders.map((dkd_order, dkd_index) => {
      const dkd_weather = dkd_weathers.find(dkd_item => dkd_item.dkd_id === dkd_order.dkd_weather) || dkd_weathers[0];
      return `<div class="dkd-order">
        <div class="dkd-between"><span class="dkd-chip dkd-accent">${dkd_icon(dkd_order.dkd_cloudPackageIcon || 'box')}${dkd_escape(dkd_order.dkd_cloudPackageName || 'PAKET').toLocaleUpperCase('tr-TR')}</span><span class="dkd-mini-stats">${dkd_icon(dkd_weather.dkd_icon,16)}${dkd_weather.dkd_name}</span></div>
        <h3>${dkd_escape(dkd_order.dkd_cloudDestination || dkd_order.dkd_destination)}</h3>
        <small>${dkd_escape(dkd_order.dkd_cloudMissionName || 'Last-Mile siparişi')}</small>
        ${dkd_order.dkd_cloudMissionDescription ? `<p class="dkd-muted dkd-text-sm" style="margin-top:8px">${dkd_escape(dkd_order.dkd_cloudMissionDescription)}</p>` : ''}
        <div class="dkd-order-stats">
          <div><b>${(dkd_order.dkd_safe.dkd_distance / 1000).toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2})} km</b><small>ROTA</small></div>
          <div><b>${dkd_time(dkd_order.dkd_deadline)}</b><small>SÜRE</small></div>
          <div><b class="dkd-accent">${dkd_currency(dkd_order.dkd_offer.dkd_total)}</b><small>ÖDÜL</small></div>
        </div>
        ${dkd_v05CapacityStrip(this, dkd_order)}
        <div class="dkd-v04-order-customer">${dkd_avatar(dkd_order.dkd_customer)}<div><b>${dkd_escape(dkd_order.dkd_cloudCustomerName || 'Teslimat Noktası')}</b><small>${dkd_escape(dkd_order.dkd_cloudCustomerRole || 'Teslimat noktası')}</small><small style="margin-top:6px">${dkd_escape(dkd_order.dkd_cloudOrigin || 'Kurye Merkezi')} → ${dkd_escape(dkd_order.dkd_cloudDestination || 'Teslimat')}</small></div></div>
        <div class="dkd-order-footer">${dkd_button('ROTAYI İNCELE', `order:${dkd_index}`, 'nav')}${dkd_iconButton('close',`reject:${dkd_index}`,'Siparişi reddet')}</div>
      </div>`;
    }).join('')}`;
  return this.dkd_page('Siparişler', dkd_body, '', 'Gerçek sipariş ağı');
};

dkd_Game.prototype.dkd_view_order = function dkd_v05CapacityOrder() {
  const dkd_order = this.dkd_selectedOrder;
  let dkd_html = dkd_v05CapacityPrevious.dkd_view_order.call(this);
  if (!dkd_order) return dkd_html;
  const dkd_card = dkd_v05CapacityCard(this, dkd_order);
  const dkd_footerMarker = '<div class="dkd-page-footer">';
  const dkd_footerIndex = dkd_html.lastIndexOf(dkd_footerMarker);
  if (dkd_footerIndex >= 0) dkd_html = `${dkd_html.slice(0, dkd_footerIndex)}${dkd_card}${dkd_html.slice(dkd_footerIndex)}`;
  return dkd_html;
};

dkd_Game.prototype.dkd_view_garage = function dkd_v05CapacityGarage() {
  return dkd_v05CapacityPrevious.dkd_view_garage.call(this).split('L HACİM').join('KG TAŞIMA');
};

dkd_Game.prototype.dkd_action = function dkd_v05CapacityAction(dkd_action) {
  const dkd_text = String(dkd_action || '');
  const [dkd_command] = dkd_text.split(':');

  if (dkd_command === 'v05-capacity-garage') {
    this.dkd_v05PendingStart = null;
    this.dkd_closeModal();
    this.dkd_garageTab = 'fleet';
    return this.dkd_render('garage');
  }
  if (dkd_command === 'v05-capacity-orders') {
    this.dkd_v05PendingStart = null;
    this.dkd_closeModal();
    return this.dkd_render('dispatch');
  }
  if (dkd_command === 'v05-start-cancel') {
    const dkd_pending = this.dkd_v05PendingStart;
    this.dkd_v05PendingStart = null;
    this.dkd_closeModal();
    if (dkd_pending?.dkd_jobId) this.dkd_send('cloud-cancel-job', { dkd_job_id: dkd_pending.dkd_jobId, dkd_reason: 'start_cancelled' });
    return this.dkd_render('dispatch');
  }
  if (dkd_command === 'v05-start-retry') {
    this.dkd_closeModal();
    return this.dkd_action('start-run');
  }

  if (dkd_command !== 'start-run') return dkd_v05CapacityPrevious.dkd_action.call(this, dkd_action);
  if (this.dkd_v05PendingStart) return;

  try {
    dkd_v05RunPreflight(this);
  } catch (dkd_error) {
    const dkd_message = String(dkd_error?.message || '');
    if (dkd_error?.dkd_capacity === true || /kapasite/i.test(dkd_message)) return dkd_v05CapacityPopup(this, this.dkd_selectedOrder);
    if (/yakıt|bakım/i.test(dkd_message) && typeof dkd_v05GarageServicePopup === 'function') return dkd_v05GarageServicePopup(this, false);
    return dkd_v05StartErrorPopup(this, dkd_message || 'Vardiya başlatılamadı.');
  }

  const dkd_order = this.dkd_selectedOrder;
  if (!dkd_order?.dkd_cloudJobId) return dkd_v05BeginLocalRun(this);

  this.dkd_v05PendingStart = {
    dkd_jobId: String(dkd_order.dkd_cloudJobId),
    dkd_orderId: String(dkd_order.dkd_id || ''),
  };
  dkd_v05StartWaitingPopup(this);
  this.dkd_send('cloud-accept-job', { dkd_job_id: dkd_order.dkd_cloudJobId });
};

dkd_Game.prototype.dkd_receive = function dkd_v05CapacityReceive(dkd_payload) {
  if (dkd_payload?.dkd_type === 'cloud-job-accepted' && this.dkd_v05PendingStart) {
    const dkd_pending = this.dkd_v05PendingStart;
    const dkd_jobId = String(dkd_payload.dkd_data?.dkd_job_id || '');
    if (!dkd_jobId || dkd_jobId === dkd_pending.dkd_jobId) {
      this.dkd_v05PendingStart = null;
      for (const dkd_order of this.dkd_orders) {
        if (dkd_order?.dkd_cloudJobId && String(dkd_order.dkd_cloudJobId) !== dkd_pending.dkd_jobId) {
          this.dkd_send('cloud-cancel-job', { dkd_job_id: dkd_order.dkd_cloudJobId, dkd_reason: 'another_offer_accepted' });
        }
      }
      return dkd_v05BeginLocalRun(this);
    }
  }

  if (dkd_payload?.dkd_type === 'cloud-error' && this.dkd_v05PendingStart) {
    this.dkd_v05PendingStart = null;
    return dkd_v05StartErrorPopup(this, dkd_payload.dkd_data);
  }

  const dkd_result = dkd_v05CapacityPrevious.dkd_receive.call(this, dkd_payload);
  if (dkd_payload?.dkd_type === 'cloud-jobs' && Array.isArray(dkd_payload.dkd_data) && Array.isArray(this.dkd_orders)) {
    this.dkd_orders.forEach((dkd_order, dkd_index) => {
      const dkd_serverPackage = dkd_payload.dkd_data[dkd_index]?.dkd_package || {};
      const dkd_serverLoad = Number(
        dkd_serverPackage.dkd_weight_kg ??
        dkd_serverPackage.dkd_weight ??
        dkd_serverPackage.dkd_load_kg ??
        0,
      );
      if (Number.isFinite(dkd_serverLoad) && dkd_serverLoad > 0) dkd_order.dkd_requiredLoad = dkd_serverLoad;
    });
    if (this.dkd_pageName === 'dispatch') this.dkd_render('dispatch');
  }
  return dkd_result;
};

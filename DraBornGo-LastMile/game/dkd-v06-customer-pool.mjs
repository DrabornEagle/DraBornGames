// DraBornGo / Last Mile v0.6 customer portrait diversity patch.
// Uses only portraits supplied by the user in Musteriler.zip. No generated artwork.

const dkd_v06CustomerPortraitPool = Array.from(new Set([
  ...dkd_v06CustomerPortraitPoolPart00,
  ...dkd_v06CustomerPortraitPoolPart01,
  ...dkd_v06CustomerPortraitPoolPart02,
  ...dkd_v06CustomerPortraitPoolPart03,
  ...dkd_v06CustomerPortraitPoolPart04,
  ...dkd_v06CustomerPortraitPoolPart05,
  ...dkd_v06CustomerPortraitPoolPart06,
  ...dkd_v06CustomerPortraitPoolPart07,
  ...dkd_v06CustomerPortraitPoolPart08,
].filter(Boolean)));

const dkd_v06CustomerPoolPrevious = {
  dkd_receive: dkd_Game.prototype.dkd_receive,
  dkd_view_dispatch: dkd_Game.prototype.dkd_view_dispatch,
  dkd_view_messages: dkd_Game.prototype.dkd_view_messages,
};

function dkd_v06CustomerPoolHash(dkd_value) {
  let dkd_hash = 2166136261;
  const dkd_text = String(dkd_value || 'last-mile-customer');
  for (let dkd_index = 0; dkd_index < dkd_text.length; dkd_index += 1) {
    dkd_hash ^= dkd_text.charCodeAt(dkd_index);
    dkd_hash = Math.imul(dkd_hash, 16777619);
  }
  return dkd_hash >>> 0;
}

function dkd_v06CustomerOrderKey(dkd_order, dkd_index = 0) {
  return String(
    dkd_order?.dkd_cloudJobId
    || dkd_order?.dkd_id
    || `${dkd_order?.dkd_cloudMissionId || 'mission'}:${dkd_order?.dkd_cloudOrigin || 'origin'}:${dkd_order?.dkd_cloudDestination || 'destination'}:${dkd_index}`
  );
}

function dkd_v06AssignCustomerPortraits(dkd_game) {
  const dkd_orders = Array.isArray(dkd_game?.dkd_orders) ? dkd_game.dkd_orders : [];
  const dkd_poolSize = dkd_v06CustomerPortraitPool.length;
  if (!dkd_poolSize || !dkd_orders.length) return;

  const dkd_used = new Set();
  const dkd_stableOrders = dkd_orders
    .map((dkd_order, dkd_index) => ({ dkd_order, dkd_index, dkd_key: dkd_v06CustomerOrderKey(dkd_order, dkd_index) }))
    .sort((dkd_first, dkd_second) => dkd_first.dkd_key.localeCompare(dkd_second.dkd_key));

  for (const dkd_entry of dkd_stableOrders) {
    let dkd_portraitIndex = dkd_v06CustomerPoolHash(dkd_entry.dkd_key) % dkd_poolSize;
    if (dkd_used.size < dkd_poolSize) {
      let dkd_guard = 0;
      while (dkd_used.has(dkd_portraitIndex) && dkd_guard < dkd_poolSize) {
        dkd_portraitIndex = (dkd_portraitIndex + 1) % dkd_poolSize;
        dkd_guard += 1;
      }
    }
    dkd_used.add(dkd_portraitIndex);
    dkd_entry.dkd_order.dkd_customerPortraitIndex = dkd_portraitIndex;
  }
}

function dkd_v06CustomerOrderAvatar(dkd_order, dkd_large = false) {
  const dkd_index = Number(dkd_order?.dkd_customerPortraitIndex);
  const dkd_source = Number.isInteger(dkd_index) ? dkd_v06CustomerPortraitPool[dkd_index] : '';
  if (!dkd_source) return dkd_avatar(dkd_order?.dkd_customer, dkd_large);
  const dkd_name = dkd_escape(dkd_order?.dkd_cloudCustomerName || 'Müşteri');
  return `<img class="dkd-avatar${dkd_large ? ' dkd-large' : ''}" src="${dkd_source}" alt="${dkd_name} — müşteri profil fotoğrafı"/>`;
}

function dkd_v06CustomerPoolInstallStyles() {
  if (document.getElementById('dkd-v06-customer-pool-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v06-customer-pool-style';
  dkd_style.textContent = `
    .dkd-v06-message-list{display:grid;gap:14px;margin-top:18px}
    .dkd-v06-message-card{border:1px solid #405675;border-radius:22px;background:#172740;padding:16px}
    .dkd-v06-message-head{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center}
    .dkd-v06-message-head .dkd-avatar{width:62px;height:62px;border-radius:17px}
    .dkd-v06-message-title b{display:block;font-size:17px;line-height:1.12}.dkd-v06-message-title small{display:block;margin-top:5px;color:#a9bad0}
    .dkd-v06-message-new{border:1px solid #4b607f;border-radius:12px;padding:8px 10px;color:#e4ff5e;font-size:10px;font-weight:950;letter-spacing:.55px;text-align:center;line-height:1.2}
    .dkd-v06-message-note{margin-top:13px;border-left:5px solid #e886b8;border-radius:0 15px 15px 0;background:#203550;padding:13px 14px;line-height:1.45}
    .dkd-v06-message-meta{display:flex;justify-content:space-between;gap:10px;margin-top:12px;color:#a9bad0;font-size:10px}.dkd-v06-message-meta span:last-child{text-align:right}
    @media(max-width:370px){.dkd-v06-message-head{grid-template-columns:auto 1fr}.dkd-v06-message-new{grid-column:1/-1;justify-self:start}.dkd-v06-message-meta{display:grid}}
  `;
  document.head.appendChild(dkd_style);
}

dkd_v06CustomerPoolInstallStyles();

dkd_Game.prototype.dkd_receive = function dkd_v06CustomerPoolReceive(dkd_payload) {
  const dkd_result = dkd_v06CustomerPoolPrevious.dkd_receive.call(this, dkd_payload);
  if (dkd_payload?.dkd_type === 'cloud-jobs') {
    dkd_v06AssignCustomerPortraits(this);
    if (this.dkd_pageName === 'dispatch' || this.dkd_pageName === 'messages') this.dkd_render(this.dkd_pageName);
  }
  return dkd_result;
};

dkd_Game.prototype.dkd_view_dispatch = function dkd_v06CustomerPoolDispatch() {
  if (!this.dkd_orders.length && !this.dkd_v04JobsLoading) this.dkd_refreshOrders();
  dkd_v06AssignCustomerPortraits(this);

  const dkd_status = this.dkd_v04JobsLoading
    ? '<div class="dkd-notice">Gerçek sipariş havuzu yenileniyor…</div>'
    : !this.dkd_orders.length
      ? '<div class="dkd-notice">Şu anda uygun sipariş bulunamadı. Yenile düğmesiyle tekrar kontrol edebilirsin.</div>'
      : '';
  const dkd_demoLabel = this.dkd_v04IsAdmin && this.dkd_v04Cloud?.dkd_demo_enabled === true
    ? '<span class="dkd-chip">ADMIN DEMO AÇIK</span>'
    : '<span class="dkd-chip dkd-accent">GERÇEK VERİ</span>';

  const dkd_body = `<div class="dkd-between"><div><span class="dkd-kicker">LAST-MILE / ANKARA</span><h2 style="margin-top:8px">Sıradaki siparişler.</h2></div>${dkd_iconButton('refresh','orders-refresh','Siparişleri yenile')}</div>
    <div class="dkd-space"></div><div class="dkd-between">${dkd_demoLabel}<small>Canlı sipariş ağı · ${dkd_v06CustomerPortraitPool.length} farklı profil</small></div>
    <div class="dkd-space"></div>${dkd_status}
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
        <div class="dkd-v04-order-customer">${dkd_v06CustomerOrderAvatar(dkd_order)}<div><b>${dkd_escape(dkd_order.dkd_cloudCustomerName || 'Teslimat Noktası')}</b><small>${dkd_escape(dkd_order.dkd_cloudCustomerRole || 'Teslimat noktası')}</small><small style="margin-top:6px">${dkd_escape(dkd_order.dkd_cloudOrigin || 'Kurye Merkezi')} → ${dkd_escape(dkd_order.dkd_cloudDestination || 'Teslimat')}</small></div></div>
        <div class="dkd-order-footer">${dkd_button('ROTAYI İNCELE', `order:${dkd_index}`, 'nav')}${dkd_iconButton('close',`reject:${dkd_index}`,'Siparişi reddet')}</div>
      </div>`;
    }).join('')}`;
  return this.dkd_page('Siparişler', dkd_body, '', 'Gerçek sipariş ağı');
};

dkd_Game.prototype.dkd_view_messages = function dkd_v06CustomerPoolMessages() {
  if (!this.dkd_orders.length && !this.dkd_v04JobsLoading) this.dkd_refreshOrders();
  dkd_v06AssignCustomerPortraits(this);

  const dkd_status = this.dkd_v04JobsLoading
    ? '<div class="dkd-notice">Müşteri notları yenileniyor…</div>'
    : !this.dkd_orders.length
      ? '<div class="dkd-notice">Şu anda aktif müşteri notu yok. Yeni sipariş geldiğinde burada görünecek.</div>'
      : '';
  const dkd_cards = this.dkd_orders.map(dkd_order => `<div class="dkd-v06-message-card">
      <div class="dkd-v06-message-head">
        ${dkd_v06CustomerOrderAvatar(dkd_order)}
        <div class="dkd-v06-message-title"><b>${dkd_escape(dkd_order.dkd_cloudCustomerName || 'Teslimat Noktası')}</b><small>${dkd_escape(dkd_order.dkd_cloudCustomerRole || 'Teslimat noktası')}</small></div>
        <span class="dkd-v06-message-new">YENİ<br/>SİPARİŞ</span>
      </div>
      <div class="dkd-v06-message-note">${dkd_escape(dkd_order.dkd_cloudCustomerNote || 'Teslimat notu bulunmuyor.')}</div>
      <div class="dkd-v06-message-meta"><span>${dkd_escape(dkd_order.dkd_cloudDestination || 'Teslimat')}</span><span>${dkd_escape(dkd_order.dkd_cloudMissionName || 'Last-Mile siparişi')}</span></div>
    </div>`).join('');

  const dkd_body = `<span class="dkd-kicker">SİPARİŞ İLETİŞİMİ</span><h2 style="margin:12px 0">Müşteri notların.</h2><p class="dkd-muted dkd-text-sm">Aktif siparişlerin teslimat notları ve teslim noktası bilgileri burada görünür.</p>${dkd_status}<div class="dkd-v06-message-list">${dkd_cards}</div>`;
  return this.dkd_page('Mesajlar', dkd_body, '', 'Sipariş iletişimi');
};

window.dkd_lastMileCustomerPortraitCount = dkd_v06CustomerPortraitPool.length;

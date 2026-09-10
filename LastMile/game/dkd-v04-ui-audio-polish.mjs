// DraBornGo / Last Mile v0.4 UI + audio polish.
// Loaded last. Improves delivery ergonomics, real-order communication, avatars and drive music.

const dkd_v04PolishPrevious = {
  dkd_receive: dkd_Game.prototype.dkd_receive,
  dkd_view_dispatch: dkd_Game.prototype.dkd_view_dispatch,
  dkd_view_order: dkd_Game.prototype.dkd_view_order,
  dkd_view_messages: dkd_Game.prototype.dkd_view_messages,
  dkd_view_result: dkd_Game.prototype.dkd_view_result,
};

function dkd_v04PolishInstallStyles() {
  if (document.getElementById('dkd-v04-ui-audio-polish-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v04-ui-audio-polish-style';
  dkd_style.textContent = `
    #dkd-deliver{bottom:280px!important;left:22px!important;right:22px!important}
    #dkd-deliver .dkd-button{min-height:78px!important;border-radius:24px!important;font-size:18px!important}
    .dkd-home-header .dkd-profile-pills{margin-top:24px!important}
    .dkd-v04-order-customer{display:flex;align-items:center;gap:14px;margin-top:14px;padding:14px;border:1px solid #415475;border-radius:22px;background:#16233a}
    .dkd-v04-order-customer .dkd-avatar{width:58px;height:68px;border-radius:18px;border:1px solid #54708b}
    .dkd-v04-order-customer b{font-size:16px;display:block;margin-bottom:4px}
    .dkd-v04-order-customer small{display:block;line-height:1.45}
    .dkd-v04-message-list{display:flex;flex-direction:column;gap:14px;margin-top:18px}
    .dkd-v04-message-card{border:1px solid #405574;border-radius:22px;background:#16243b;padding:16px}
    .dkd-v04-message-head{display:flex;gap:13px;align-items:center}
    .dkd-v04-message-head .dkd-avatar{width:54px;height:64px;border-radius:17px;border:1px solid #55718e}
    .dkd-v04-message-head b{display:block;font-size:16px;margin-bottom:3px}
    .dkd-v04-message-bubble{margin-top:13px;padding:13px 14px;border-left:4px solid #e780b8;border-radius:0 15px 15px 0;background:#1d3048;line-height:1.55;font-size:13px}
    .dkd-v04-message-meta{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-top:11px}
    .dkd-v04-message-meta small{font-size:10px}
    @media (max-height:760px){#dkd-deliver{bottom:250px!important}.dkd-home-header .dkd-profile-pills{margin-top:18px!important}}
  `;
  document.head.appendChild(dkd_style);
}

dkd_v04PolishInstallStyles();

function dkd_v04PolishVisibleOrders(dkd_game) {
  const dkd_candidates = [];
  if (dkd_game?.dkd_run?.dkd_order) dkd_candidates.push(dkd_game.dkd_run.dkd_order);
  if (dkd_game?.dkd_selectedOrder) dkd_candidates.push(dkd_game.dkd_selectedOrder);
  if (Array.isArray(dkd_game?.dkd_orders)) dkd_candidates.push(...dkd_game.dkd_orders);

  const dkd_seen = new Set();
  return dkd_candidates.filter(dkd_order => {
    if (!dkd_order?.dkd_cloudJobId) return false;
    const dkd_key = String(dkd_order.dkd_cloudJobId || dkd_order.dkd_id || '');
    if (!dkd_key || dkd_seen.has(dkd_key)) return false;
    dkd_seen.add(dkd_key);
    return true;
  });
}

function dkd_v04PolishCustomerAvatar(dkd_order, dkd_large = false) {
  const dkd_customerId = String(dkd_order?.dkd_customer || '');
  return dkd_avatar(dkd_customerId, dkd_large);
}

function dkd_v04PolishOrderMessage(dkd_order) {
  const dkd_note = String(dkd_order?.dkd_cloudCustomerNote || '').trim();
  if (dkd_note) return dkd_note;
  const dkd_description = String(dkd_order?.dkd_cloudMissionDescription || '').trim();
  if (dkd_description) return dkd_description;
  const dkd_destination = String(dkd_order?.dkd_cloudDestination || dkd_order?.dkd_destination || 'teslimat noktası').trim();
  return `Sipariş hazır. Teslimat noktası: ${dkd_destination}. Girişte dur ve paketi teslim et.`;
}

function dkd_v04PolishOrderStatus(dkd_game, dkd_order) {
  if (dkd_game?.dkd_run?.dkd_order?.dkd_cloudJobId === dkd_order?.dkd_cloudJobId) return 'YOLDA';
  if (dkd_game?.dkd_selectedOrder?.dkd_cloudJobId === dkd_order?.dkd_cloudJobId) return 'SEÇİLİ';
  return 'YENİ SİPARİŞ';
}

dkd_Game.prototype.dkd_receive = function dkd_v04PolishReceive(dkd_payload) {
  const dkd_result = dkd_v04PolishPrevious.dkd_receive.call(this, dkd_payload);
  if (dkd_payload?.dkd_type === 'cloud-jobs' && this.dkd_pageName === 'messages') {
    this.dkd_render('messages');
  }
  return dkd_result;
};

dkd_Game.prototype.dkd_view_dispatch = function dkd_v04PolishDispatch() {
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
        <div class="dkd-v04-order-customer">${dkd_v04PolishCustomerAvatar(dkd_order)}<div><b>${dkd_escape(dkd_order.dkd_cloudCustomerName || 'Teslimat Noktası')}</b><small>${dkd_escape(dkd_order.dkd_cloudCustomerRole || 'Teslimat noktası')}</small><small style="margin-top:6px">${dkd_escape(dkd_order.dkd_cloudOrigin || 'Kurye Merkezi')} → ${dkd_escape(dkd_order.dkd_cloudDestination || 'Teslimat')}</small></div></div>
        <div class="dkd-order-footer">${dkd_button('ROTAYI İNCELE', `order:${dkd_index}`, 'nav')}${dkd_iconButton('close',`reject:${dkd_index}`,'Siparişi reddet')}</div>
      </div>`;
    }).join('')}`;
  return this.dkd_page('Siparişler', dkd_body, '', 'Gerçek sipariş ağı');
};

dkd_Game.prototype.dkd_view_order = function dkd_v04PolishOrder() {
  const dkd_order = this.dkd_selectedOrder;
  let dkd_html = dkd_v04PolishPrevious.dkd_view_order.call(this);
  if (!dkd_order?.dkd_cloudJobId) return dkd_html;
  const dkd_old = `<span class="dkd-icon-tile">${dkd_icon('pin')}</span>`;
  dkd_html = dkd_html.replace(dkd_old, dkd_v04PolishCustomerAvatar(dkd_order));
  return dkd_html;
};

dkd_Game.prototype.dkd_view_messages = function dkd_v04PolishMessages() {
  const dkd_orders = dkd_v04PolishVisibleOrders(this);
  if (!dkd_orders.length && this.dkd_v04CloudReady && !this.dkd_v04JobsLoading) this.dkd_refreshOrders();

  const dkd_loading = !dkd_orders.length && this.dkd_v04JobsLoading
    ? '<div class="dkd-notice">Sipariş mesajları yükleniyor…</div>'
    : '';
  const dkd_empty = !dkd_orders.length && !this.dkd_v04JobsLoading
    ? '<div class="dkd-notice">Şu anda aktif sipariş mesajı yok. Yeni sipariş geldiğinde müşteri notu burada görünecek.</div>'
    : '';

  const dkd_cards = dkd_orders.map(dkd_order => {
    const dkd_name = dkd_escape(dkd_order.dkd_cloudCustomerName || 'Teslimat Noktası');
    const dkd_role = dkd_escape(dkd_order.dkd_cloudCustomerRole || 'Teslimat noktası');
    const dkd_message = dkd_escape(dkd_v04PolishOrderMessage(dkd_order));
    const dkd_destination = dkd_escape(dkd_order.dkd_cloudDestination || 'Teslimat');
    const dkd_status = dkd_v04PolishOrderStatus(this, dkd_order);
    return `<div class="dkd-v04-message-card"><div class="dkd-v04-message-head">${dkd_v04PolishCustomerAvatar(dkd_order)}<div><b>${dkd_name}</b><small>${dkd_role}</small></div><span class="dkd-chip dkd-accent" style="margin-left:auto">${dkd_status}</span></div><div class="dkd-v04-message-bubble">${dkd_message}</div><div class="dkd-v04-message-meta"><small>${dkd_destination}</small><small>${dkd_escape(dkd_order.dkd_cloudMissionName || 'Sipariş')}</small></div></div>`;
  }).join('');

  return this.dkd_page('Mesajlar', `<span class="dkd-kicker">SİPARİŞ İLETİŞİMİ</span><h2 style="margin:12px 0">Müşteri notların.</h2><p class="dkd-muted dkd-text-sm">Buradaki içerikler açık gerçek siparişlerin teslimat notlarından oluşur.</p>${dkd_loading}${dkd_empty}<div class="dkd-v04-message-list">${dkd_cards}</div><div class="dkd-space"></div>${dkd_button('SİPARİŞLERE GİT','dispatch','box','dkd-secondary')}`);
};

dkd_Game.prototype.dkd_view_result = function dkd_v04PolishResult() {
  const dkd_order = this.dkd_run?.dkd_order;
  let dkd_html = dkd_v04PolishPrevious.dkd_view_result.call(this);
  if (!dkd_order?.dkd_cloudJobId) return dkd_html;
  const dkd_old = `<span class="dkd-icon-tile">${dkd_icon('pin')}</span>`;
  return dkd_html.replace(dkd_old, dkd_v04PolishCustomerAvatar(dkd_order));
};

function dkd_v04PolishMusicMode(dkd_audio, dkd_drive) {
  if (!dkd_audio?.dkd_context || !dkd_audio.dkd_v04MenuMusic || !dkd_audio.dkd_v04DriveMusic) return;
  const dkd_now = dkd_audio.dkd_context.currentTime;
  const dkd_setting = Math.max(0, Math.min(1, Number(dkd_audio.dkd_state?.dkd_settings?.dkd_music) || 0));
  const dkd_menuVolume = Math.min(1.05, dkd_setting * 1.15);
  const dkd_driveVolume = Math.min(1.35, dkd_setting * 1.55);
  const dkd_mode = dkd_drive ? 'drive-polish' : 'menu-polish';

  if (dkd_audio.dkd_v04Mode !== dkd_mode) {
    dkd_v04StopMusicVoices(dkd_audio);
    dkd_audio.dkd_v04Mode = dkd_mode;
    dkd_audio.dkd_v04Beat = 0;
    dkd_audio.dkd_v04NextBeat = dkd_now + .04;
  }

  dkd_audio.dkd_v04MenuMusic.gain.setTargetAtTime(dkd_drive ? 0 : dkd_menuVolume, dkd_now, .055);
  dkd_audio.dkd_v04DriveMusic.gain.setTargetAtTime(dkd_drive ? dkd_driveVolume : 0, dkd_now, .055);
}

dkd_Audio.prototype.dkd_update = function dkd_v04PolishAudioUpdate(dkd_run) {
  if (!this.dkd_context || this.dkd_context.state !== 'running') return;
  this.dkd_effects.gain.value = this.dkd_state.dkd_settings.dkd_effects;
  const dkd_active = Boolean(dkd_run && !dkd_run.dkd_paused && !dkd_run.dkd_finished && !dkd_run.dkd_failed);
  const dkd_now = this.dkd_context.currentTime;

  this.dkd_motorGain.gain.setTargetAtTime(dkd_active ? .014 + dkd_run.dkd_speed * .0035 : 0, dkd_now, .06);
  this.dkd_motor.frequency.setTargetAtTime(dkd_active ? 44 + dkd_run.dkd_speed * 5.2 : 44, dkd_now, .06);
  this.dkd_rainGain.gain.setTargetAtTime(
    dkd_active ? dkd_run.dkd_weather.dkd_rain * .42 + Math.abs(dkd_run.dkd_weather.dkd_wind || 0) * .011 : 0,
    dkd_now,
    .18,
  );

  dkd_v04PolishMusicMode(this, dkd_active);
  if (this.dkd_v04NextBeat < dkd_now - .5) this.dkd_v04NextBeat = dkd_now + .03;

  const dkd_driveRoots = [55, 61.74, 65.41, 49, 58.27, 73.42, 51.91, 65.41];
  const dkd_menuRoots = [110, 116.54, 123.47, 98, 130.81];

  while (this.dkd_v04NextBeat < dkd_now + .10) {
    const dkd_step = this.dkd_v04Beat;
    if (this.dkd_v04Mode === 'drive-polish') {
      const dkd_phase = dkd_step % 16;
      const dkd_root = dkd_driveRoots[Math.floor(dkd_step / 16) % dkd_driveRoots.length];

      if ([0,4,8,12].includes(dkd_phase)) {
        dkd_v04MusicNote(this, 48, .105, .24, 'sine', this.dkd_v04DriveMusic, this.dkd_v04NextBeat);
      }
      if (dkd_phase === 4 || dkd_phase === 12) {
        dkd_v04MusicNote(this, 196, .075, .052, 'triangle', this.dkd_v04DriveMusic, this.dkd_v04NextBeat);
      }
      if (dkd_phase % 2 === 0) {
        const dkd_bassSteps = [1, 1, 1.5, 1, 1.25, 1, 1.5, 2];
        dkd_v04MusicNote(this, dkd_root * dkd_bassSteps[(dkd_phase / 2) % dkd_bassSteps.length], .20, .085, 'triangle', this.dkd_v04DriveMusic, this.dkd_v04NextBeat);
      }
      if ([2,6,10,14].includes(dkd_phase)) {
        const dkd_arpSteps = [4, 5, 6, 7.5];
        dkd_v04MusicNote(this, dkd_root * dkd_arpSteps[Math.floor(dkd_phase / 4) % dkd_arpSteps.length], .105, .043, 'square', this.dkd_v04DriveMusic, this.dkd_v04NextBeat);
      }
      if (dkd_phase === 0) {
        dkd_v04MusicNote(this, dkd_root * 2, 1.6, .026, 'sine', this.dkd_v04DriveMusic, this.dkd_v04NextBeat);
        dkd_v04MusicNote(this, dkd_root * 2.5, 1.6, .021, 'sine', this.dkd_v04DriveMusic, this.dkd_v04NextBeat);
        dkd_v04MusicNote(this, dkd_root * 3, 1.6, .018, 'sine', this.dkd_v04DriveMusic, this.dkd_v04NextBeat);
      }
      this.dkd_v04NextBeat += .121;
    } else {
      const dkd_phase = dkd_step % 8;
      const dkd_root = dkd_menuRoots[Math.floor(dkd_step / 8) % dkd_menuRoots.length];
      if (dkd_phase % 2 === 0) dkd_v04MusicNote(this, dkd_root * 2, .42, .032, 'triangle', this.dkd_v04MenuMusic, this.dkd_v04NextBeat);
      if (dkd_phase === 0) {
        dkd_v04MusicNote(this, dkd_root, 1.55, .032, 'sine', this.dkd_v04MenuMusic, this.dkd_v04NextBeat);
        dkd_v04MusicNote(this, dkd_root * 1.5, 1.55, .018, 'sine', this.dkd_v04MenuMusic, this.dkd_v04NextBeat);
      }
      this.dkd_v04NextBeat += .32;
    }
    this.dkd_v04Beat++;
  }
};

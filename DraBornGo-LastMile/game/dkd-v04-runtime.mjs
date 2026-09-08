// DraBornGo / Last Mile v0.4 runtime bridge.
// Admin-preview + real Supabase job lifecycle. Loaded after the v0.3 visual/model patches.

const dkd_v04Original = {
  dkd_bind: dkd_Game.prototype.dkd_bind,
  dkd_receive: dkd_Game.prototype.dkd_receive,
  dkd_render: dkd_Game.prototype.dkd_render,
  dkd_save: dkd_Game.prototype.dkd_save,
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_view_intro: dkd_Game.prototype.dkd_view_intro,
  dkd_view_phone: dkd_Game.prototype.dkd_view_phone,
  dkd_view_settings: dkd_Game.prototype.dkd_view_settings,
};

const dkd_v04AudioOriginal = {
  dkd_start: dkd_Audio.prototype.dkd_start,
  dkd_update: dkd_Audio.prototype.dkd_update,
};

function dkd_v04ClockParts() {
  const dkd_timeText = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false });
  const dkd_parts = dkd_timeText.split(':');
  return {
    dkd_hour: dkd_parts[0] || '00',
    dkd_minute: dkd_parts[1] || '00',
    dkd_text: `${dkd_parts[0] || '00'}:${dkd_parts[1] || '00'}`,
  };
}

function dkd_v04Seed(dkd_value) {
  let dkd_hash = 2166136261;
  const dkd_text = String(dkd_value || 'lastmile');
  for (let dkd_index = 0; dkd_index < dkd_text.length; dkd_index++) {
    dkd_hash ^= dkd_text.charCodeAt(dkd_index);
    dkd_hash = Math.imul(dkd_hash, 16777619);
  }
  return Math.abs(dkd_hash >>> 0) || 571;
}

function dkd_v04Init(dkd_game) {
  if (dkd_game.dkd_v04Initialized) return;
  dkd_game.dkd_v04Initialized = true;
  dkd_game.dkd_v04AuthKnown = false;
  dkd_game.dkd_v04Authenticated = false;
  dkd_game.dkd_v04AdminReady = false;
  dkd_game.dkd_v04AuthEmail = '';
  dkd_game.dkd_v04Cloud = null;
  dkd_game.dkd_v04JobsLoading = false;
  dkd_game.dkd_v04SaveTimer = null;
  dkd_game.dkd_test = null;
  if (dkd_game.dkd_career) dkd_game.dkd_career.dkd_training = false;
  if (Array.isArray(dkd_demoRankings)) dkd_demoRankings.splice(0, dkd_demoRankings.length);
  if (dkd_game.dkd_audio) dkd_game.dkd_audio.dkd_tracks = ['Neon Vardiya', 'Islak Asfalt', 'Şehir Nabzı', 'Gece Hattı', 'Şafak Rotası'];
}

function dkd_v04PackageId(dkd_serverId) {
  const dkd_id = String(dkd_serverId || '');
  if (dkd_packages.some(dkd_item => dkd_item.dkd_id === dkd_id)) return dkd_id;
  const dkd_map = {
    dkd_document: 'dkd_confidential',
    dkd_store: 'dkd_hot',
    dkd_parts: 'dkd_oversized',
    dkd_medical_sample: 'dkd_medical',
    dkd_cold_chain: 'dkd_frozen',
  };
  return dkd_map[dkd_id] || 'dkd_hot';
}

function dkd_v04CreateCloudOrder(dkd_game, dkd_serverEntry, dkd_index) {
  const dkd_job = dkd_serverEntry?.dkd_job || dkd_serverEntry || {};
  const dkd_mission = dkd_serverEntry?.dkd_mission || {};
  const dkd_origin = dkd_serverEntry?.dkd_origin || {};
  const dkd_destination = dkd_serverEntry?.dkd_destination || {};
  const dkd_seed = dkd_v04Seed(dkd_job.dkd_id || `${Date.now()}-${dkd_index}`);
  const dkd_order = dkd_makeOrder(dkd_game.dkd_state, dkd_game.dkd_graph, dkd_seed, 'normal');
  const dkd_packageId = dkd_v04PackageId(dkd_job.dkd_package_id || dkd_mission.dkd_package_id);
  const dkd_package = dkd_packages.find(dkd_item => dkd_item.dkd_id === dkd_packageId) || dkd_packages[0];
  const dkd_customer = dkd_customers.find(dkd_item => dkd_item.dkd_kind === dkd_packageId) || dkd_customers[0];
  const dkd_weatherId = dkd_weathers.some(dkd_item => dkd_item.dkd_id === dkd_job.dkd_weather_id) ? dkd_job.dkd_weather_id : 'dkd_clear';
  const dkd_reward = Math.max(0, Math.floor(Number(dkd_job.dkd_reward) || Number(dkd_package.dkd_base) || 0));
  const dkd_deadline = Math.max(90, Math.floor(Number(dkd_job.dkd_time_limit_sec) || Number(dkd_order.dkd_deadline) || 300));

  dkd_order.dkd_id = `dkd_cloud_${dkd_job.dkd_id || dkd_seed}`;
  dkd_order.dkd_cloudJobId = String(dkd_job.dkd_id || '');
  dkd_order.dkd_cloudMissionId = String(dkd_job.dkd_template_id || dkd_mission.dkd_id || '');
  dkd_order.dkd_cloudMissionName = String(dkd_mission.dkd_name || 'Last-Mile Görevi');
  dkd_order.dkd_cloudOrigin = String(dkd_origin.dkd_name || 'Kurye Merkezi');
  dkd_order.dkd_cloudDestination = String(dkd_destination.dkd_name || 'Teslimat Bölgesi');
  dkd_order.dkd_customer = dkd_customer.dkd_id;
  dkd_order.dkd_package = dkd_packageId;
  dkd_order.dkd_weather = dkd_weatherId;
  dkd_order.dkd_deadline = dkd_deadline;
  dkd_order.dkd_destination = `${dkd_order.dkd_cloudDestination} · ${dkd_order.dkd_cloudMissionName}`;
  if (dkd_order.dkd_offer) dkd_order.dkd_offer.dkd_total = dkd_reward;
  return dkd_order;
}

function dkd_v04AdminGate(dkd_game) {
  if (!dkd_game.dkd_v04AuthKnown) {
    return `<div class="dkd-screen dkd-intro dkd-enter"><div class="dkd-intro-bottom"><span class="dkd-kicker">v0.4 / SUPABASE</span><h1>YÖNETİCİ<br/><span>ÖNİZLEMESİ.</span></h1><p>Oturum durumu kontrol ediliyor…</p></div></div>`;
  }
  if (!dkd_game.dkd_v04Authenticated) {
    return `<div class="dkd-page dkd-enter"><div class="dkd-page-body"><span class="dkd-kicker">DraBornGo / Last Mile v0.4</span><h1 style="font-size:34px;margin:12px 0">Yönetici girişi</h1><p class="dkd-muted dkd-text-sm">Bu geliştirme sürümünde oyun içeriği yalnızca Last-Mile admin hesabına açıktır.</p><form id="dkd-v04-login-form"><div class="dkd-field"><label>E-posta</label><input name="dkd_email" type="email" autocomplete="username" required/></div><div class="dkd-field"><label>Şifre</label><input name="dkd_password" type="password" autocomplete="current-password" minlength="6" required/></div><button class="dkd-button" type="submit">YÖNETİCİ OLARAK GİRİŞ YAP</button></form></div></div>`;
  }
  return `<div class="dkd-page dkd-enter"><div class="dkd-page-body"><span class="dkd-kicker">LAST-MILE / YETKİ</span><h2>Yönetici doğrulaması yapılıyor.</h2><p class="dkd-muted dkd-text-sm">Supabase rolü ve v0.4 içerik kapısı kontrol ediliyor.</p></div></div>`;
}

function dkd_v04UpdateClock() {
  const dkd_parts = dkd_v04ClockParts();
  const dkd_clock = document.getElementById('dkd-v04-clock');
  if (dkd_clock) dkd_clock.innerHTML = `${dkd_parts.dkd_hour}<span>:</span>${dkd_parts.dkd_minute}`;
  const dkd_introClock = document.getElementById('dkd-v04-intro-clock');
  if (dkd_introClock) dkd_introClock.textContent = dkd_parts.dkd_text;
}

function dkd_v04ApplyMusicMode(dkd_audio, dkd_drive) {
  if (!dkd_audio?.dkd_context || !dkd_audio.dkd_v04MenuMusic || !dkd_audio.dkd_v04DriveMusic) return;
  const dkd_now = dkd_audio.dkd_context.currentTime;
  const dkd_volume = Math.max(0, Math.min(1, Number(dkd_audio.dkd_state?.dkd_settings?.dkd_music) || 0));
  dkd_audio.dkd_v04MenuMusic.gain.setTargetAtTime(dkd_drive ? 0 : dkd_volume, dkd_now, .22);
  dkd_audio.dkd_v04DriveMusic.gain.setTargetAtTime(dkd_drive ? dkd_volume : 0, dkd_now, .22);
}

dkd_Audio.prototype.dkd_start = function dkd_v04AudioStart() {
  dkd_v04AudioOriginal.dkd_start.call(this);
  if (!this.dkd_context || this.dkd_v04MenuMusic) return;
  this.dkd_v04MenuMusic = this.dkd_context.createGain();
  this.dkd_v04DriveMusic = this.dkd_context.createGain();
  this.dkd_v04MenuMusic.gain.value = 0;
  this.dkd_v04DriveMusic.gain.value = 0;
  this.dkd_v04MenuMusic.connect(this.dkd_master);
  this.dkd_v04DriveMusic.connect(this.dkd_master);
  try { this.dkd_music.disconnect(); } catch {}
  this.dkd_music.connect(this.dkd_v04MenuMusic);
  this.dkd_music.connect(this.dkd_v04DriveMusic);
};

dkd_Audio.prototype.dkd_update = function dkd_v04AudioUpdate(dkd_run) {
  dkd_v04AudioOriginal.dkd_update.call(this, dkd_run);
  if (this.dkd_music?.gain) this.dkd_music.gain.value = 1;
  dkd_v04ApplyMusicMode(this, Boolean(dkd_run && !dkd_run.dkd_paused && !dkd_run.dkd_finished && !dkd_run.dkd_failed));
};

dkd_Game.prototype.dkd_bind = function dkd_v04Bind() {
  dkd_v04Original.dkd_bind.call(this);
  dkd_v04Init(this);
  document.addEventListener('submit', dkd_event => {
    if (dkd_event.target.id !== 'dkd-v04-login-form') return;
    dkd_event.preventDefault();
    const dkd_fields = new FormData(dkd_event.target);
    this.dkd_send('auth-login', {
      dkd_email: String(dkd_fields.get('dkd_email') || '').trim(),
      dkd_password: String(dkd_fields.get('dkd_password') || ''),
    });
    this.dkd_toast('Yönetici oturumu açılıyor…');
  });
  this.dkd_send('auth-state-request', {});
  this.dkd_v04ClockTimer = setInterval(dkd_v04UpdateClock, 10000);
};

dkd_Game.prototype.dkd_receive = function dkd_v04Receive(dkd_payload) {
  dkd_v04Init(this);
  dkd_v04Original.dkd_receive.call(this, dkd_payload);

  if (dkd_payload.dkd_type === 'auth-state') {
    this.dkd_v04AuthKnown = true;
    this.dkd_v04Authenticated = dkd_payload.dkd_data?.dkd_authenticated === true;
    this.dkd_v04AuthEmail = String(dkd_payload.dkd_data?.dkd_email || '');
    this.dkd_v04AdminReady = false;
    if (this.dkd_v04Authenticated) this.dkd_send('cloud-bootstrap', {});
    this.dkd_render(this.dkd_state?.dkd_profile ? 'home' : 'intro');
    return;
  }

  if (dkd_payload.dkd_type === 'cloud-bootstrap') {
    const dkd_response = dkd_payload.dkd_data || {};
    const dkd_cloud = dkd_response.dkd_data || dkd_response;
    this.dkd_v04Cloud = dkd_cloud;
    this.dkd_v04AdminReady = dkd_cloud?.dkd_role === 'admin' && dkd_cloud?.dkd_enabled !== false;
    if (this.dkd_v04AdminReady) {
      this.dkd_career.dkd_training = false;
      this.dkd_career.dkd_fullCareer = true;
      this.dkd_state = this.dkd_career;
      this.dkd_audio.dkd_state = this.dkd_state;
      this.dkd_scene.dkd_state = this.dkd_state;
      this.dkd_toast('Last-Mile v0.4 gerçek veri bağlantısı hazır.');
      this.dkd_render(this.dkd_state.dkd_profile ? 'home' : 'intro');
    } else {
      this.dkd_toast('Bu hesap Last-Mile admin yetkisine sahip değil.');
      this.dkd_render('intro');
    }
    return;
  }

  if (dkd_payload.dkd_type === 'cloud-jobs') {
    this.dkd_v04JobsLoading = false;
    const dkd_rows = Array.isArray(dkd_payload.dkd_data) ? dkd_payload.dkd_data : [];
    this.dkd_orders = dkd_rows.filter(Boolean).map((dkd_entry, dkd_index) => dkd_v04CreateCloudOrder(this, dkd_entry, dkd_index));
    if (this.dkd_pageName === 'dispatch') this.dkd_render('dispatch');
    return;
  }

  if (dkd_payload.dkd_type === 'cloud-error') {
    this.dkd_v04JobsLoading = false;
    this.dkd_toast(String(dkd_payload.dkd_data || 'Last-Mile sunucu işlemi tamamlanamadı.'));
  }
};

dkd_Game.prototype.dkd_refreshOrders = function dkd_v04RefreshOrders() {
  dkd_v04Init(this);
  this.dkd_orders = [];
  if (!this.dkd_v04AdminReady || this.dkd_v04JobsLoading) return;
  this.dkd_v04JobsLoading = true;
  this.dkd_send('cloud-claim-jobs', { dkd_count: 4, dkd_level: dkd_level(this.dkd_state) });
};

dkd_Game.prototype.dkd_save = function dkd_v04Save() {
  dkd_v04Original.dkd_save.call(this);
  dkd_v04Init(this);
  if (!this.dkd_v04AdminReady) return;
  clearTimeout(this.dkd_v04SaveTimer);
  this.dkd_v04SaveTimer = setTimeout(() => {
    this.dkd_send('cloud-save', { dkd_game_state: this.dkd_career });
  }, 650);
};

dkd_Game.prototype.dkd_action = function dkd_v04Action(dkd_action) {
  dkd_v04Init(this);
  const [dkd_command, ...dkd_parts] = String(dkd_action || '').split(':');
  const dkd_value = dkd_parts.join(':');

  if (dkd_command === 'v04-demo-toggle') {
    if (!this.dkd_v04AdminReady) return this.dkd_toast('Yönetici yetkisi gerekli.');
    this.dkd_send('admin-demo-toggle', { dkd_enabled: dkd_value === 'on' });
    return;
  }

  if (dkd_command === 'v04-logout') {
    this.dkd_send('auth-logout', {});
    return;
  }

  if (dkd_command === 'orders-refresh') {
    this.dkd_refreshOrders();
    return this.dkd_render('dispatch');
  }

  if (dkd_command === 'reject') {
    const dkd_index = Number(dkd_value);
    const dkd_order = this.dkd_orders[dkd_index];
    if (dkd_order?.dkd_cloudJobId) this.dkd_send('cloud-cancel-job', { dkd_job_id: dkd_order.dkd_cloudJobId, dkd_reason: 'offer_rejected' });
    this.dkd_orders.splice(dkd_index, 1);
    this.dkd_toast('Görev reddedildi.');
    return this.dkd_render('dispatch');
  }

  if (dkd_command === 'start-run' && this.dkd_selectedOrder?.dkd_cloudJobId) {
    this.dkd_send('cloud-accept-job', { dkd_job_id: this.dkd_selectedOrder.dkd_cloudJobId });
  }

  if (dkd_command === 'abandon' && this.dkd_run?.dkd_order?.dkd_cloudJobId) {
    this.dkd_send('cloud-cancel-job', { dkd_job_id: this.dkd_run.dkd_order.dkd_cloudJobId, dkd_reason: 'shift_abandoned' });
  }

  if (dkd_command === 'deliver' && this.dkd_run?.dkd_order?.dkd_cloudJobId) {
    const dkd_jobId = this.dkd_run.dkd_order.dkd_cloudJobId;
    const dkd_metrics = {
      dkd_elapsed_sec: Math.round(Number(this.dkd_run.dkd_elapsed) || 0),
      dkd_distance_m: Math.round(Number(this.dkd_run.dkd_distance) || 0),
      dkd_damage: Math.round(Number(this.dkd_run.dkd_damage) || 0),
      dkd_quality: Math.round(Number(this.dkd_run.dkd_quality) || 0),
      dkd_collisions: Math.round(Number(this.dkd_run.dkd_collisions) || 0),
    };
    const dkd_result = dkd_v04Original.dkd_action.call(this, dkd_action);
    if (this.dkd_result) {
      dkd_metrics.dkd_rating = Number(this.dkd_result.dkd_rating) || 0;
      dkd_metrics.dkd_pay = Number(this.dkd_result.dkd_pay) || 0;
      dkd_metrics.dkd_on_time = this.dkd_result.dkd_onTime === true;
      this.dkd_send('cloud-complete-job', { dkd_job_id: dkd_jobId, dkd_metrics });
    }
    return dkd_result;
  }

  return dkd_v04Original.dkd_action.call(this, dkd_action);
};

dkd_Game.prototype.dkd_render = function dkd_v04Render(dkd_pageName, dkd_arg = null) {
  dkd_v04Init(this);
  if (this.dkd_v04AuthKnown && !this.dkd_v04AdminReady && dkd_pageName !== 'intro') dkd_pageName = 'intro';
  const dkd_result = dkd_v04Original.dkd_render.call(this, dkd_pageName, dkd_arg);
  dkd_v04UpdateClock();
  dkd_v04ApplyMusicMode(this.dkd_audio, dkd_pageName === 'drive');
  return dkd_result;
};

dkd_Game.prototype.dkd_view_intro = function dkd_v04Intro() {
  dkd_v04Init(this);
  if (!this.dkd_v04AdminReady) return dkd_v04AdminGate(this);
  const dkd_parts = dkd_v04ClockParts();
  return dkd_v04Original.dkd_view_intro.call(this)
    .replace(/\d{2}:\d{2}\s*·\s*ANTALYA/, `<span id="dkd-v04-intro-clock">${dkd_parts.dkd_text}</span> · ANKARA`)
    .replace('Ücretsiz deneme sürümü · Gerçek ödeme ve ödül yok.', 'v0.4 yönetici önizlemesi · Supabase gerçek veri bağlantısı');
};

dkd_Game.prototype.dkd_view_phone = function dkd_v04Phone() {
  const dkd_parts = dkd_v04ClockParts();
  return dkd_v04Original.dkd_view_phone.call(this)
    .replace(/<h1>\d{2}<span>:\<\/span>\d{2}<\/h1>/, `<h1 id="dkd-v04-clock">${dkd_parts.dkd_hour}<span>:</span>${dkd_parts.dkd_minute}</h1>`);
};

dkd_Game.prototype.dkd_view_dispatch = function dkd_v04Dispatch() {
  if (!this.dkd_orders.length && !this.dkd_v04JobsLoading) this.dkd_refreshOrders();
  const dkd_status = this.dkd_v04JobsLoading
    ? '<div class="dkd-notice">Supabase görev havuzu yenileniyor…</div>'
    : !this.dkd_orders.length
      ? '<div class="dkd-notice">Şu anda uygun organik görev bulunamadı. Yenile düğmesiyle tekrar kontrol edebilirsin.</div>'
      : '';
  const dkd_body = `<div class="dkd-between"><div><span class="dkd-kicker">LAST-MILE / ANKARA</span><h2 style="margin-top:8px">Gerçek görev havuzu.</h2></div>${dkd_iconButton('refresh','orders-refresh','Görevleri yenile')}</div><div class="dkd-space"></div>${dkd_status}<div class="dkd-space"></div>${this.dkd_orders.map((dkd_order, dkd_index) => {
    const dkd_package = dkd_packages.find(dkd_item => dkd_item.dkd_id === dkd_order.dkd_package) || dkd_packages[0];
    const dkd_customer = dkd_customers.find(dkd_item => dkd_item.dkd_id === dkd_order.dkd_customer) || dkd_customers[0];
    const dkd_weather = dkd_weathers.find(dkd_item => dkd_item.dkd_id === dkd_order.dkd_weather) || dkd_weathers[0];
    return `<div class="dkd-order"><div class="dkd-between"><span class="dkd-chip dkd-accent">${dkd_icon(dkd_package.dkd_icon)}${dkd_package.dkd_name.toLocaleUpperCase('tr-TR')}</span><span class="dkd-mini-stats">${dkd_icon(dkd_weather.dkd_icon,16)}${dkd_weather.dkd_name}</span></div><h3>${dkd_escape(dkd_order.dkd_cloudDestination || dkd_order.dkd_destination)}</h3><small>${dkd_escape(dkd_order.dkd_cloudMissionName || 'Last-Mile görevi')}</small><div class="dkd-order-stats"><div><b>${(dkd_order.dkd_safe.dkd_distance / 1000).toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2})} km</b><small>ROTA</small></div><div><b>${dkd_time(dkd_order.dkd_deadline)}</b><small>SÜRE</small></div><div><b class="dkd-accent">${dkd_currency(dkd_order.dkd_offer.dkd_total)}</b><small>SUNUCU ÖDÜLÜ</small></div></div><div class="dkd-row">${dkd_avatar(dkd_customer.dkd_id)}<div><b>${dkd_customer.dkd_name}</b><small>${dkd_escape(dkd_order.dkd_cloudOrigin || 'Kurye Merkezi')} → ${dkd_escape(dkd_order.dkd_cloudDestination || 'Teslimat')}</small></div></div><div class="dkd-order-footer">${dkd_button('ROTAYI İNCELE', `order:${dkd_index}`, 'nav')}${dkd_iconButton('close',`reject:${dkd_index}`,'Görevi reddet')}</div></div>`;
  }).join('')}`;
  return this.dkd_page('Siparişler', dkd_body, '', 'Supabase organik görev sistemi');
};

dkd_Game.prototype.dkd_view_rankings = function dkd_v04Rankings() {
  return this.dkd_page('Sıralamalar', `<span class="dkd-kicker">GERÇEK OYUNCU VERİSİ</span><h2 style="margin:12px 0">Sıralama hazırlanıyor.</h2><div class="dkd-notice">Sahte rakip yok. Gerçek oyuncu skorları oluştuğunda bu ekran yalnızca sunucu tarafından doğrulanmış kayıtları gösterecek.</div><div class="dkd-space"></div><div class="dkd-leader dkd-me"><span class="dkd-place">—</span><div><b>${dkd_escape(this.dkd_state.dkd_profile?.dkd_username || 'YÖNETİCİ')}</b><small style="display:block">Yerel kariyer sonucu · genel sıralamaya dahil değil</small></div><span class="dkd-score">—</span></div>`);
};

dkd_Game.prototype.dkd_view_daily = function dkd_v04Daily() {
  dkd_tickDay(this.dkd_state);
  const dkd_state = this.dkd_state;
  const dkd_tasks = dkd_dailyRequirements(dkd_state);
  return this.dkd_page('Günlük Görevler', `<span class="dkd-kicker">BUGÜN / ${dkd_state.dkd_daily.dkd_date}</span><h2 style="margin:12px 0">Günlük hedeflerin.</h2>${dkd_tasks.map(dkd_task => `<div class="dkd-list-line"><span class="dkd-chapter-number ${dkd_task.dkd_have>=dkd_task.dkd_need?'dkd-done':''}">${dkd_task.dkd_have>=dkd_task.dkd_need?'✓':dkd_icon('flag',15)}</span><div class="dkd-expand"><b class="dkd-text-sm">${dkd_task.dkd_name}</b>${dkd_progressBar(dkd_task.dkd_have,dkd_task.dkd_need)}</div><small>${Math.min(dkd_task.dkd_need,Math.floor(dkd_task.dkd_have))}/${dkd_task.dkd_need}</small></div>`).join('')}<div class="dkd-space"></div>${dkd_button(dkd_state.dkd_daily.dkd_claimed?'BUGÜNKÜ KASA ALINDI':'GÜNLÜK KASA / 750 TL + ROZET','claim-daily','box','dkd-secondary')}<div class="dkd-divider"></div><span class="dkd-kicker">TOPLULUK</span><div class="dkd-notice">Sentetik topluluk sayacı kaldırıldı. Gerçek topluluk etkinliği sunucu verisi oluştuğunda açılacak.</div>`);
};

dkd_Game.prototype.dkd_view_settings = function dkd_v04Settings() {
  const dkd_state = this.dkd_state;
  const dkd_demoEnabled = this.dkd_v04Cloud?.dkd_demo_enabled === true || this.dkd_v04Cloud?.dkd_demo === true;
  const dkd_admin = `<div class="dkd-divider"></div><h3>Last-Mile yönetici</h3><div class="dkd-card"><span class="dkd-kicker">${dkd_escape(this.dkd_v04AuthEmail || 'OTURUM')}</span><h3 style="margin:8px 0">Supabase bağlantısı ${this.dkd_v04AdminReady?'hazır':'kontrol ediliyor'}</h3><p class="dkd-muted dkd-text-sm">Demo görevleri organik görevlerden ayrıdır ve varsayılan kapalıdır.</p><div class="dkd-space"></div>${dkd_button(dkd_demoEnabled?'DEMO GÖREVLERİNİ KAPAT':'DEMO GÖREVLERİNİ AÇ',`v04-demo-toggle:${dkd_demoEnabled?'off':'on'}`,'fingerprint','dkd-secondary')}<div class="dkd-space"></div>${dkd_button('YÖNETİCİ OTURUMUNU KAPAT','v04-logout','close','dkd-warning')}</div>`;
  return this.dkd_page('Ayarlar', `<div class="dkd-between"><div><span class="dkd-brand">SON KİLOMETRE</span><small style="display:block;margin-top:5px">v0.4 · Expo SDK 57 · Supabase</small></div><span class="dkd-chip">TÜRKÇE</span></div><div class="dkd-divider"></div><h3>Görüntü ve ses</h3><div class="dkd-segment">${[['low','Ekonomik'],['balanced','Dengeli'],['high','Yüksek']].map(dkd_item=>`<button data-dkd-action="quality:${dkd_item[0]}" class="${dkd_state.dkd_settings.dkd_quality===dkd_item[0]?'dkd-selected':''}">${dkd_item[1]}</button>`).join('')}</div><div class="dkd-field"><label>Efekt sesi</label><input type="range" min="0" max="100" value="${Math.round(dkd_state.dkd_settings.dkd_effects*100)}" data-dkd-setting="dkd_effects"/></div><div class="dkd-field"><label>Müzik</label><input type="range" min="0" max="100" value="${Math.round(dkd_state.dkd_settings.dkd_music*100)}" data-dkd-setting="dkd_music"/></div><div class="dkd-divider"></div><h3>Kayıt ve bilgi</h3><div class="dkd-stack">${dkd_button('KAYDI DIŞA AKTAR','export-save','share','dkd-secondary')}${dkd_button('YEDEKTEN GERİ YÜKLE','import-save','refresh','dkd-secondary')}${dkd_button('NASIL OYNANIR','guide','info','dkd-secondary')}</div>${dkd_admin}`);
};

dkd_Game.prototype.dkd_view_privacy = function dkd_v04Privacy() {
  return this.dkd_page('Veri ve v0.4 kapsamı', `<div class="dkd-privacy-list"><h3>Supabase gerçek veri</h3><p>v0.4 yönetici önizlemesinde görev yaşam döngüsü ve kariyer ilerlemesi Supabase Last-Mile alanına senkronize edilir. Mobil uygulamada yalnızca publishable key bulunur; service-role anahtarı istemciye gömülmez.</p><h3>Cihaz yedeği</h3><p>AsyncStorage kaydı çevrimdışı güvenli yedek olarak tutulur. Sunucu bağlantısı geri geldiğinde admin ilerlemesi tekrar senkronize edilir.</p><h3>Sıralama ve topluluk</h3><p>Sentetik rakip ve sentetik topluluk sayacı gösterilmez. Gerçek kullanıcı verisi oluşmadan genel sıralama üretilmez.</p><h3>Ödüller</h3><p>v0.4 geliştirme aşamasında gerçek fiziksel ödül kazanımı etkin değildir.</p></div>`);
};

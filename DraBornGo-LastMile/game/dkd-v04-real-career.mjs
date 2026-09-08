// DraBornGo / Last Mile v0.4 real-career cleanup.
// Loaded after dkd-v04-runtime.mjs. Keeps demo tooling admin-only while normal players use real career content.

const dkd_v04RealPrevious = {
  dkd_receive: dkd_Game.prototype.dkd_receive,
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_view_intro: dkd_Game.prototype.dkd_view_intro,
  dkd_view_login: dkd_Game.prototype.dkd_view_login,
  dkd_view_register: dkd_Game.prototype.dkd_view_register,
  dkd_view_dispatch: dkd_Game.prototype.dkd_view_dispatch,
  dkd_view_order: dkd_Game.prototype.dkd_view_order,
  dkd_view_messages: dkd_Game.prototype.dkd_view_messages,
  dkd_view_call: dkd_Game.prototype.dkd_view_call,
  dkd_view_seasons: dkd_Game.prototype.dkd_view_seasons,
  dkd_view_result: dkd_Game.prototype.dkd_view_result,
  dkd_view_verification: dkd_Game.prototype.dkd_view_verification,
};

function dkd_v04RealInstallStyles() {
  if (document.getElementById('dkd-v04-real-career-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v04-real-career-style';
  dkd_style.textContent = `
    #dkd-deliver{bottom:194px}
    .dkd-v04-photo-selected{border-color:#54dfd2!important;background:#173b45!important;color:#dffef8!important}
    .dkd-v04-brand-hero{position:relative;overflow:hidden;border:1px solid color-mix(in srgb,var(--dkd-brand-color) 68%,#ffffff 10%);border-radius:28px;padding:22px;background:#17243a;animation:dkd-v04-brand-rise .46s ease-out both}
    .dkd-v04-brand-hero:before{content:"";position:absolute;left:0;top:0;bottom:0;width:8px;background:var(--dkd-brand-color)}
    .dkd-v04-brand-lock{display:flex;align-items:center;gap:16px;margin-bottom:18px}
    .dkd-v04-brand-mark{width:72px;height:72px;display:grid;place-items:center;border-radius:22px;background:var(--dkd-brand-color);color:#071529;animation:dkd-v04-brand-float 2.8s ease-in-out infinite}
    .dkd-v04-brand-mark svg{width:36px;height:36px;stroke-width:2.1}
    .dkd-v04-brand-hero h1{font-size:34px;line-height:1.02;margin:6px 0 8px}
    .dkd-v04-brand-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
    .dkd-v04-brand-pills span{display:inline-flex;align-items:center;gap:6px;border:1px solid #415475;border-radius:999px;padding:8px 11px;font-size:11px;font-weight:850;letter-spacing:.35px;background:#1b2c48}
    .dkd-v04-brand-section{margin-top:22px}
    .dkd-v04-brand-section>label{display:block;margin-bottom:12px;font-weight:900}
    .dkd-v04-brand-swatches{display:flex;gap:11px;flex-wrap:wrap}
    .dkd-v04-brand-swatches .dkd-swatch{width:54px;height:54px;border-radius:18px;border:3px solid #253653;transition:transform .16s ease,border-color .16s ease}
    .dkd-v04-brand-swatches .dkd-swatch.dkd-selected{border-color:#ffffff;transform:translateY(-4px) scale(1.06)}
    .dkd-v04-brand-emblems{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
    .dkd-v04-brand-emblem{min-height:112px;border:1px solid #405274;border-radius:22px;background:#202c48;color:#e8ecff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;font-weight:900;transition:transform .16s ease,border-color .16s ease,background .16s ease}
    .dkd-v04-brand-emblem svg{width:32px;height:32px}
    .dkd-v04-brand-emblem.dkd-selected{border-color:var(--dkd-brand-color);background:#293653;transform:translateY(-4px)}
    .dkd-v04-brand-preview{margin-top:22px;border:1px solid #415475;border-radius:26px;background:#16233a;padding:18px;display:grid;grid-template-columns:74px 1fr;gap:15px;align-items:center}
    .dkd-v04-brand-preview-logo{width:74px;height:74px;border-radius:22px;background:var(--dkd-brand-color);color:#071529;display:grid;place-items:center;animation:dkd-v04-brand-pulse 2.2s ease-in-out infinite}
    .dkd-v04-brand-preview-logo svg{width:34px;height:34px}
    .dkd-v04-brand-preview strong{display:block;font-size:20px;margin-bottom:5px}
    .dkd-v04-brand-preview small{display:block;line-height:1.5}
    .dkd-v04-real-account{border-color:#4fd9cf}
    @keyframes dkd-v04-brand-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
    @keyframes dkd-v04-brand-float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-7px) rotate(2deg)}}
    @keyframes dkd-v04-brand-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.055)}}
    html[data-dkd-motion="off"] .dkd-v04-brand-hero,
    html[data-dkd-motion="off"] .dkd-v04-brand-mark,
    html[data-dkd-motion="off"] .dkd-v04-brand-preview-logo{animation:none}
    @media (max-height:740px){#dkd-deliver{bottom:178px}}
  `;
  document.head.appendChild(dkd_style);
}

dkd_v04RealInstallStyles();

function dkd_v04RealLogoIcon(dkd_logo) {
  return dkd_logo === 'eagle' ? 'shield' : dkd_logo === 'bolt' ? 'bolt' : 'diamond';
}

function dkd_v04RealFinalizeCareer(dkd_game) {
  if (!dkd_game?.dkd_career) return false;
  const dkd_changed = dkd_game.dkd_career.dkd_fullCareer !== true || dkd_game.dkd_career.dkd_training === true;
  dkd_game.dkd_career.dkd_fullCareer = true;
  dkd_game.dkd_career.dkd_training = false;
  if (dkd_game.dkd_state === dkd_game.dkd_career || !dkd_game.dkd_state) dkd_game.dkd_state = dkd_game.dkd_career;
  return dkd_changed;
}

dkd_Game.prototype.dkd_receive = function dkd_v04RealReceive(dkd_payload) {
  const dkd_registerForm = document.getElementById('dkd-v04-register-form');
  const dkd_loginForm = document.getElementById('dkd-v04-login-form');

  if (dkd_payload?.dkd_type === 'photo' && dkd_registerForm) {
    this.dkd_pendingPhoto = dkd_payload.dkd_data;
    const dkd_buttonElement = dkd_registerForm.querySelector('[data-dkd-action="pick-photo"]');
    if (dkd_buttonElement) {
      dkd_buttonElement.classList.add('dkd-v04-photo-selected');
      const dkd_label = dkd_buttonElement.querySelector('span');
      if (dkd_label) dkd_label.textContent = 'Profil fotoğrafı hazır · değiştirmek için dokun';
    }
    this.dkd_toast('Profil fotoğrafı seçildi. Kayıt bilgilerin korunuyor.');
    return;
  }

  if (
    dkd_payload?.dkd_type === 'auth-state' &&
    dkd_payload.dkd_data?.dkd_authenticated !== true &&
    dkd_payload.dkd_data?.dkd_logged_out !== true &&
    (dkd_registerForm || dkd_loginForm)
  ) {
    this.dkd_v04AuthKnown = true;
    this.dkd_v04Authenticated = false;
    this.dkd_v04AuthEmail = '';
    return;
  }

  const dkd_result = dkd_v04RealPrevious.dkd_receive.call(this, dkd_payload);

  if (dkd_payload?.dkd_type === 'cloud-bootstrap' && this.dkd_v04CloudReady) {
    const dkd_changed = dkd_v04RealFinalizeCareer(this);
    if (dkd_changed) {
      this.dkd_save();
      if (this.dkd_pageName === 'home' || this.dkd_pageName === 'career') this.dkd_render('home');
    }
  }

  if (dkd_payload?.dkd_type === 'cloud-job-complete') {
    this.dkd_toast('Teslimat ve kariyer ilerlemen kaydedildi.');
  }

  return dkd_result;
};

dkd_Game.prototype.dkd_action = function dkd_v04RealAction(dkd_action) {
  const [dkd_command] = String(dkd_action || '').split(':');

  if (dkd_command === 'v04-real-career-start' || dkd_command === 'career' || dkd_command === 'career-unlock') {
    dkd_v04RealFinalizeCareer(this);
    this.dkd_career.dkd_tutorial = true;
    this.dkd_state = this.dkd_career;
    this.dkd_save();
    return this.dkd_render('home');
  }

  if (!this.dkd_v04IsAdmin && ['test-enter', 'test-exit', 'test-final', 'test-reset'].includes(dkd_command)) {
    return this.dkd_toast('Bu araç yalnızca yönetici test hesabında kullanılabilir.');
  }

  return dkd_v04RealPrevious.dkd_action.call(this, dkd_action);
};

dkd_Game.prototype.dkd_view_intro = function dkd_v04RealIntro() {
  return dkd_v04RealPrevious.dkd_view_intro.call(this)
    .replace('Supabase hesap sistemi · Gerçek görev verileri · Expo Go geliştirme sürümü', 'Gerçek siparişler · Çevrimiçi kariyer · Ankara');
};

dkd_Game.prototype.dkd_view_login = function dkd_v04RealLogin() {
  return dkd_v04RealPrevious.dkd_view_login.call(this)
    .replace('Normal oyuncu hesabınla giriş yapabilirsin. Yönetici hesabı kullanıldığında yetki otomatik tanınır.', 'Hesabınla giriş yap ve kaldığın yerden devam et. Yönetici yetkisi varsa otomatik tanınır.');
};

dkd_Game.prototype.dkd_view_register = function dkd_v04RealRegister() {
  return dkd_v04RealPrevious.dkd_view_register.call(this)
    .replace('Bu bilgilerle gerçek Supabase hesabın oluşturulur. İlerlemen hesabına senkronize edilir.', 'Bu bilgilerle çevrimiçi oyuncu hesabın oluşturulur. Kariyer ilerlemen hesabına kaydedilir.')
    .replace('Hesabımın ve oyun ilerlememin Supabase üzerinde saklanmasını kabul ediyorum.', 'Hesabımın ve oyun ilerlememin çevrimiçi olarak saklanmasını kabul ediyorum.');
};

dkd_Game.prototype.dkd_view_brand = function dkd_v04RealBrand() {
  const dkd_state = this.dkd_state;
  const dkd_company = dkd_escape(dkd_state.dkd_profile?.dkd_company || 'Şirketin');
  const dkd_brandColor = dkd_state.dkd_brand?.dkd_color || dkd_colors[0];
  const dkd_uniformColor = dkd_state.dkd_brand?.dkd_uniform || '#233d44';
  const dkd_logo = dkd_state.dkd_brand?.dkd_logo || 'eagle';
  const dkd_logoNames = { eagle: 'Kartal', bolt: 'Şimşek', diamond: 'Elmas' };
  const dkd_uniforms = ['#233d44', '#333652', '#653d32', '#3e4831', '#68605a'];

  const dkd_body = `
    <div class="dkd-v04-brand-hero" style="--dkd-brand-color:${dkd_brandColor};--dkd-uniform:${dkd_uniformColor}">
      <div class="dkd-v04-brand-lock">
        <span class="dkd-v04-brand-mark">${dkd_icon(dkd_v04RealLogoIcon(dkd_logo))}</span>
        <div><span class="dkd-kicker">02 / MARKANI TASARLA</span><h1>${dkd_company}</h1><p class="dkd-muted dkd-text-sm">Rengini, amblemini ve kurye stilini seç. Kimliğin araçta, çantada ve şirket ekranlarında kullanılacak.</p></div>
      </div>
      <div class="dkd-v04-brand-pills"><span>${dkd_icon('palette',14)} ANA RENK</span><span>${dkd_icon(dkd_v04RealLogoIcon(dkd_logo),14)} ${dkd_logoNames[dkd_logo].toLocaleUpperCase('tr-TR')}</span><span>${dkd_icon('shirt',14)} KURYE STİLİ</span></div>
    </div>

    <div class="dkd-v04-brand-section"><label>Ana renk / araç kaplaması</label><div class="dkd-v04-brand-swatches">${dkd_colors.map(dkd_color => `<button class="dkd-swatch ${dkd_brandColor === dkd_color ? 'dkd-selected' : ''}" style="background:${dkd_color}" aria-label="${dkd_color} ana renk" data-dkd-action="color:${dkd_color}"></button>`).join('')}</div></div>

    <div class="dkd-v04-brand-section"><label>Şirket amblemi</label><div class="dkd-v04-brand-emblems">${['eagle','bolt','diamond'].map(dkd_item => `<button class="dkd-v04-brand-emblem ${dkd_logo===dkd_item?'dkd-selected':''}" data-dkd-action="logo:${dkd_item}" style="--dkd-brand-color:${dkd_brandColor}">${dkd_icon(dkd_v04RealLogoIcon(dkd_item))}<b>${dkd_logoNames[dkd_item]}</b></button>`).join('')}</div></div>

    <div class="dkd-v04-brand-section"><label>Kurye kıyafeti</label><div class="dkd-v04-brand-swatches">${dkd_uniforms.map(dkd_color => `<button class="dkd-swatch ${dkd_uniformColor===dkd_color?'dkd-selected':''}" style="background:${dkd_color}" aria-label="${dkd_color} kıyafet" data-dkd-action="uniform:${dkd_color}"></button>`).join('')}</div></div>

    <div class="dkd-v04-brand-preview" style="--dkd-brand-color:${dkd_brandColor}"><span class="dkd-v04-brand-preview-logo">${dkd_icon(dkd_v04RealLogoIcon(dkd_logo))}</span><div><strong>${dkd_company}</strong><small>${dkd_logoNames[dkd_logo]} amblemi · seçili şirket rengi</small><small>Kurye çantası ve araç kimliği otomatik uygulanır.</small></div></div>`;

  return this.dkd_page('Şirket kimliği', dkd_body, dkd_button('ŞEHRİNİ SEÇ', 'city', 'check'));
};

dkd_Game.prototype.dkd_view_choose = function dkd_v04RealChoose() {
  return this.dkd_page(
    'Hedefini seç',
    `<span class="dkd-kicker">04 / UZUN VADELİ HEDEFİN</span><h2 style="margin:13px 0">Şirketini nereye<br/>taşımak istiyorsun?</h2><p class="dkd-muted dkd-text-sm">Seçimin kariyer ekranında uzun vadeli hedef kartın olarak görünür. İlerleme yalnızca tamamladığın gerçek siparişlerle oluşur.</p><div class="dkd-space"></div>${dkd_prizes.map(dkd_item=>`<button class="dkd-card dkd-card-button ${this.dkd_state.dkd_prize===dkd_item.dkd_id?'dkd-active':''}" style="margin-bottom:15px" data-dkd-action="prize:${dkd_item.dkd_id}"><div class="dkd-row"><span class="dkd-icon-tile">${dkd_icon(dkd_item.dkd_icon)}</span><div><h3>${dkd_item.dkd_name} HEDEFİ</h3><small>${dkd_item.dkd_sub}</small></div></div></button>`).join('')}`,
    dkd_button('ŞİRKET MERKEZİNE GİR', 'v04-real-career-start', 'garage'),
  );
};

dkd_Game.prototype.dkd_view_career = function dkd_v04RealCareerPage() {
  return this.dkd_page(
    'Kariyerin',
    `<div class="dkd-trophy">${dkd_icon('company')}</div><div class="dkd-result-head"><span class="dkd-kicker">KARİYER AKTİF</span><h1>Şirketin kuruldu.<br/>Şehir seni bekliyor.</h1><p class="dkd-muted">Garajını büyüt, itibar kazan, yeni bölgeler ve özel görevler aç. İlerlemenin tamamı kendi teslimatlarından oluşur.</p></div><div class="dkd-card"><div class="dkd-between"><h2>Sıfırdan başla</h2><span class="dkd-chip dkd-accent">AKTİF</span></div><div class="dkd-divider"></div><p class="dkd-text-sm">Gerçek sipariş havuzundan iş seç, kazancını ve tecrübeni kendi performansınla oluştur.</p></div>`,
    dkd_button('SİPARİŞLERE GİT', 'dispatch', 'box'),
  );
};

dkd_Game.prototype.dkd_view_dispatch = function dkd_v04RealDispatch() {
  return dkd_v04RealPrevious.dkd_view_dispatch.call(this)
    .replace('Supabase gerçek görev havuzu yenileniyor…', 'Gerçek sipariş havuzu yenileniyor…')
    .replace(/<small>\d+ aktif gerçek görev şablonu<\/small>/, '<small>Canlı sipariş ağı</small>')
    .replace('Supabase organik görev sistemi', 'Gerçek sipariş ağı');
};

dkd_Game.prototype.dkd_view_order = function dkd_v04RealOrder() {
  const dkd_order = this.dkd_selectedOrder;
  if (!dkd_order?.dkd_cloudJobId) {
    return dkd_v04RealPrevious.dkd_view_order.call(this)
      .replace('Sonuç yalnızca yerel deneme testidir.', 'Final koşulları kariyer kurallarına göre uygulanır.');
  }

  const dkd_route = this.dkd_routeMode === 'safe' ? dkd_order.dkd_safe : dkd_order.dkd_risk;
  const dkd_weather = dkd_weathers.find(dkd_item => dkd_item.dkd_id === dkd_order.dkd_weather) || dkd_weathers[0];
  const dkd_packageName = dkd_escape(dkd_order.dkd_cloudPackageName || 'Paket');
  const dkd_customerName = dkd_escape(dkd_order.dkd_cloudCustomerName || 'Teslimat Noktası');
  const dkd_customerRole = dkd_escape(dkd_order.dkd_cloudCustomerRole || 'Teslimat noktası');
  const dkd_note = dkd_escape(dkd_order.dkd_cloudCustomerNote || 'Teslimat notu bulunmuyor.');
  const dkd_origin = dkd_escape(dkd_order.dkd_cloudOrigin || 'Kurye Merkezi');
  const dkd_destination = dkd_escape(dkd_order.dkd_cloudDestination || dkd_order.dkd_destination || 'Teslimat');
  const dkd_missionName = dkd_escape(dkd_order.dkd_cloudMissionName || 'Sipariş');

  return this.dkd_page(
    'Rotanı seç',
    `<div class="dkd-between"><span class="dkd-chip dkd-accent">${dkd_icon(dkd_order.dkd_cloudPackageIcon || 'box')}${dkd_packageName}</span><span class="dkd-mini-stats">${dkd_icon(dkd_weather.dkd_icon)} ${dkd_weather.dkd_name}</span></div><h2 style="margin:15px 0">${dkd_destination}</h2>${dkd_mapSvg(this.dkd_graph, dkd_route)}<div class="dkd-segment"><button data-dkd-action="route:safe" class="${this.dkd_routeMode === 'safe' ? 'dkd-selected' : ''}">Güvenli · ${(dkd_order.dkd_safe.dkd_distance/1000).toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2})} km</button><button data-dkd-action="route:risk" class="${this.dkd_routeMode === 'risk' ? 'dkd-selected' : ''}">Ara sokak · ${(dkd_order.dkd_risk.dkd_distance/1000).toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2})} km</button></div><p class="dkd-text-sm dkd-muted">${this.dkd_routeMode === 'safe' ? 'Geniş yolları tercih eder. Gaz ve fren sende; yardımcı direksiyon kavşaklarda destek olur.' : 'Daha kısa ulaşılabilir yolları tercih eder. Dar sokaklarda daha kontrollü sür.'}</p><div class="dkd-space"></div><div class="dkd-card"><div class="dkd-row"><span class="dkd-icon-tile">${dkd_icon('pin')}</span><div><b>${dkd_customerName}</b><small style="display:block">${dkd_customerRole}</small></div></div><p class="dkd-text-sm" style="margin-top:12px">${dkd_note}</p><small style="display:block;margin-top:10px">${dkd_origin} → ${dkd_destination}</small></div><div class="dkd-space"></div><div class="dkd-notice"><b>${dkd_missionName}</b>${dkd_order.dkd_cloudMissionDescription?`<br/>${dkd_escape(dkd_order.dkd_cloudMissionDescription)}`:''}</div><div class="dkd-space"></div><div class="dkd-between" style="padding:7px 0"><span class="dkd-muted">Sipariş kazancı</span><b class="dkd-accent">${dkd_currency(dkd_order.dkd_offer.dkd_total)}</b></div><div class="dkd-between" style="padding:7px 0"><span class="dkd-muted">Teslim süresi</span><b>${dkd_time(dkd_order.dkd_deadline)}</b></div>`,
    dkd_button('KABUL ET / YOLA ÇIK', 'start-run', 'play'),
  );
};

dkd_Game.prototype.dkd_view_messages = function dkd_v04RealMessages() {
  return this.dkd_page('Mesajlar', `<span class="dkd-kicker">SİPARİŞ İLETİŞİMİ</span><h2 style="margin:12px 0">Müşteri notları siparişle birlikte gelir.</h2><div class="dkd-notice">Hazır yazılmış sahte konuşmalar gösterilmez. Aktif siparişin teslimat notlarını Siparişler ekranında görebilirsin. Gerçek zamanlı mesajlaşma sunucu tarafı açıldığında burada etkinleşecek.</div><div class="dkd-space"></div>${dkd_button('SİPARİŞLERE GİT','dispatch','box','dkd-secondary')}`);
};

dkd_Game.prototype.dkd_view_call = function dkd_v04RealCall() {
  return this.dkd_page('Görüşme', `<span class="dkd-kicker">SİPARİŞ İLETİŞİMİ</span><h2 style="margin:12px 0">Canlı görüşme henüz aktif değil.</h2><p class="dkd-muted dkd-text-sm">Hazır karakter replikleri yerine yalnızca gerçek sipariş iletişimi kullanılacak.</p>`, dkd_button('SİPARİŞLERE DÖN','dispatch','box'));
};

dkd_Game.prototype.dkd_view_seasons = function dkd_v04RealSeasons() {
  return dkd_v04RealPrevious.dkd_view_seasons.call(this)
    .replace('Her deneme sezonu', 'Her sezon');
};

dkd_Game.prototype.dkd_view_guide = function dkd_v04RealGuide() {
  const dkd_steps = [
    ['01','Siparişini seç','Siparişlerde kazanç, süre, hava ve paket tipini karşılaştır.'],
    ['02','Rotana karar ver','Güvenli rota geniş yolları tercih eder. Ara sokak mesafeyi kısaltabilir.'],
    ['03','Gaz, fren, direksiyon','GAZ’a basılı tut. Sol daireyi sürükleyerek yön ver. Yardımcı direksiyon açıkken bıraktığında rotayı izler.'],
    ['04','Paketi koru','Virajdan önce yavaşla. Yağmur fren mesafesini artırır.'],
    ['05','Teslimat alanında dur','Teslimat işaretine ulaşınca frenle. Araç durduğunda Paket Teslim Et düğmesi açılır.'],
    ['06','Usta Teslimat','Zamanında, hasarsız ve yüksek paket kalitesiyle teslimat yaparak ustalık kazan.'],
    ['07','Şirketini büyüt','Kazancınla aracını geliştir, itibarını ve kariyer seviyeni yükselt.'],
    ['08','Özel görevler','Kariyer koşullarını tamamladıkça daha zor siparişler ve özel görevler açılır.'],
    ['09','Kayıt ve ilerleme','Kariyerin hesabına otomatik kaydedilir. Aynı hesapla tekrar giriş yaptığında kaldığın yerden devam edersin.'],
  ];
  return this.dkd_page('Nasıl oynanır?', `<span class="dkd-kicker">BİR TESLİMAT DAHA.</span><div class="dkd-space"></div>${dkd_steps.map(dkd_step=>`<div class="dkd-list-line"><span class="dkd-chapter-number">${dkd_step[0]}</span><div class="dkd-expand"><h3>${dkd_step[1]}</h3><p class="dkd-text-sm dkd-muted" style="margin-top:5px">${dkd_step[2]}</p></div></div>`).join('')}<div class="dkd-space"></div><div class="dkd-notice">Klavye kontrolleri: W / ↑ gaz · S / ↓ fren · A-D / ← → yön · P duraklat · H korna. Mobilde gaz ve direksiyon aynı anda kullanılabilir.</div><div class="dkd-space"></div><h3>Final puanlaması</h3><p class="dkd-text-sm dkd-muted" style="margin-top:10px">Paket doğruluğu %25 · süre %25 · hasarsızlık %20 · güvenli sürüş %20 · rota verimliliği %10.</p>`);
};

dkd_Game.prototype.dkd_view_result = function dkd_v04RealResult() {
  const dkd_result = this.dkd_result;
  const dkd_order = this.dkd_run?.dkd_order || {};
  const dkd_customerName = dkd_escape(dkd_order.dkd_cloudCustomerName || 'Teslimat Noktası');
  const dkd_destination = dkd_escape(dkd_order.dkd_cloudDestination || dkd_order.dkd_destination || 'Teslimat');
  const dkd_missionName = dkd_escape(dkd_order.dkd_cloudMissionName || 'Sipariş');
  return this.dkd_page(
    'Teslimat tamamlandı',
    `<div class="dkd-result-head"><div class="dkd-trophy">${dkd_icon(dkd_result.dkd_master?'trophy':'check')}</div><span class="dkd-kicker">${dkd_result.dkd_master?'USTA TESLİMAT':'TESLİMAT TAMAMLANDI'}</span><h1>${dkd_result.dkd_master?'Kusursuz bir iş.':'Paket ulaştı.'}</h1><span class="dkd-stars">${'★'.repeat(Math.round(dkd_result.dkd_rating))}</span><p class="dkd-muted dkd-text-sm" style="margin-top:10px">${dkd_time(dkd_result.dkd_time)} · ${(dkd_result.dkd_distance/1000).toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2})} km</p></div><div class="dkd-reward-grid"><div class="dkd-card"><b class="dkd-accent">+${dkd_currency(dkd_result.dkd_pay)}</b><small>KAZANÇ</small></div><div class="dkd-card"><b>+${dkd_result.dkd_xp}</b><small>TECRÜBE</small></div><div class="dkd-card"><b>${dkd_result.dkd_rating.toLocaleString('tr-TR',{minimumFractionDigits:1,maximumFractionDigits:1})}</b><small>MÜŞTERİ PUANI</small></div></div><div class="dkd-card"><div class="dkd-row"><span class="dkd-icon-tile">${dkd_icon('pin')}</span><div><b>${dkd_customerName}</b><small style="display:block">${dkd_destination}</small></div></div><p class="dkd-text-sm" style="margin-top:14px">${dkd_missionName} başarıyla tamamlandı. Sipariş sonucu kariyerine işlendi.</p></div><div class="dkd-space"></div><div class="dkd-card"><div class="dkd-between"><b>Final Görevi ilerlemesi</b><b>${dkd_progress(this.dkd_state)}%</b></div>${dkd_progressBar(dkd_progress(this.dkd_state),100)}<small style="display:block;margin-top:10px">${this.dkd_state.dkd_master} Usta Teslimat · ${this.dkd_state.dkd_chapter}/6 özel müşteri bölümü</small></div><div class="dkd-space"></div>${dkd_button('BAŞARINI PAYLAŞ','share-result','share','dkd-secondary')}`,
    dkd_button('BİR SİPARİŞ DAHA', 'dispatch', 'box'),
  );
};

dkd_Game.prototype.dkd_view_verification = function dkd_v04RealVerification() {
  const dkd_result = this.dkd_result;
  return this.dkd_page('GÖREV TAMAMLANDI', `<div class="dkd-result-head"><div class="dkd-trophy">${dkd_icon('fingerprint')}</div><span class="dkd-kicker">SON TESLİMAT</span><h1>Son kilometre.<br/>Tamamlandı.</h1></div><div class="dkd-card dkd-steps"><div class="dkd-list-line">${dkd_icon('check')} Final telemetrisi kariyer kaydına işlendi</div><div class="dkd-list-line">${dkd_icon(dkd_result.dkd_audit.dkd_status==='LOCAL_CHECK_PASSED'?'check':'close')} ${dkd_result.dkd_audit.dkd_status==='LOCAL_CHECK_PASSED'?'Hareket kontrolü geçti':'Hareket kontrolü başarısız'}</div></div><div class="dkd-space"></div><span class="dkd-kicker" style="display:block;text-align:center">FİNAL SKORU</span><div class="dkd-score-big">${dkd_money(dkd_result.dkd_score.dkd_total)}</div><p class="dkd-muted dkd-text-sm" style="text-align:center">100.000 üzerinden · ${dkd_time(dkd_result.dkd_time)}</p><div class="dkd-space"></div>${[['Paket doğruluğu',dkd_result.dkd_score.dkd_accuracy,25],['Süre',dkd_result.dkd_score.dkd_punctuality,25],['Hasarsızlık',dkd_result.dkd_score.dkd_damage,20],['Güvenli sürüş',dkd_result.dkd_score.dkd_safety,20],['Rota verimliliği',dkd_result.dkd_score.dkd_efficiency,10]].map(dkd_stat=>`<div class="dkd-between dkd-text-sm" style="padding:8px 0"><span class="dkd-muted">${dkd_stat[0]} · %${dkd_stat[2]}</span><b>${Math.round(dkd_stat[1]*100)}%</b></div>`).join('')}`, dkd_button('ŞİRKET MERKEZİNE DÖN','home','garage'));
};

dkd_Game.prototype.dkd_view_settings = function dkd_v04RealSettings() {
  const dkd_state = this.dkd_state;
  const dkd_demoEnabled = this.dkd_v04Cloud?.dkd_demo_enabled === true;
  const dkd_account = this.dkd_v04IsAdmin
    ? `<div class="dkd-divider"></div><h3>Yönetici araçları</h3><div class="dkd-card dkd-v04-real-account"><span class="dkd-kicker">${dkd_escape(this.dkd_v04AuthEmail || 'YÖNETİCİ')}</span><h3 style="margin:8px 0">Yönetici hesabı</h3><p class="dkd-muted dkd-text-sm" style="margin-top:10px">Gerçek siparişler her zaman aktiftir. Demo görevlerini yalnızca kendi hesabında test amacıyla açıp kapatabilirsin.</p><div class="dkd-space"></div>${dkd_button(dkd_demoEnabled?'DEMO VERİLERİNİ KAPAT':'DEMO VERİLERİNİ AÇ',`v04-demo-toggle:${dkd_demoEnabled?'off':'on'}`,'fingerprint','dkd-secondary')}<div class="dkd-space"></div>${dkd_button('OTURUMU KAPAT','v04-logout','close','dkd-warning')}</div>`
    : `<div class="dkd-divider"></div><h3>Hesabım</h3><div class="dkd-card dkd-v04-real-account"><span class="dkd-kicker">${dkd_escape(this.dkd_v04AuthEmail || 'OYUNCU')}</span><h3 style="margin:8px 0">Hesabın aktif</h3><p class="dkd-muted dkd-text-sm" style="margin-top:10px">Kariyerin otomatik kaydedilir ve bu hesapla kaldığın yerden devam edersin.</p><div class="dkd-space"></div>${dkd_button('OTURUMU KAPAT','v04-logout','close','dkd-warning')}</div>`;

  return this.dkd_page('Ayarlar', `<div class="dkd-between"><div><span class="dkd-brand">SON KİLOMETRE</span><small style="display:block;margin-top:5px">v0.4 · Çevrimiçi kariyer</small></div><span class="dkd-chip">TÜRKÇE</span></div><div class="dkd-divider"></div><h3>Görüntü ve ses</h3><div class="dkd-segment">${[['low','Ekonomik'],['balanced','Dengeli'],['high','Yüksek']].map(dkd_item=>`<button data-dkd-action="quality:${dkd_item[0]}" class="${dkd_state.dkd_settings.dkd_quality===dkd_item[0]?'dkd-selected':''}">${dkd_item[1]}</button>`).join('')}</div><div class="dkd-field"><label>Efekt sesi</label><input type="range" min="0" max="100" value="${Math.round(dkd_state.dkd_settings.dkd_effects*100)}" data-dkd-setting="dkd_effects"/></div><div class="dkd-field"><label>Müzik</label><input type="range" min="0" max="100" value="${Math.round(dkd_state.dkd_settings.dkd_music*100)}" data-dkd-setting="dkd_music"/></div><div class="dkd-divider"></div><h3>Kayıt ve bilgi</h3><div class="dkd-stack">${dkd_button('NASIL OYNANIR','guide','info','dkd-secondary')}</div>${dkd_account}`);
};

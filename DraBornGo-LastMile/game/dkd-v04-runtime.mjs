// DraBornGo / Last Mile v0.4 runtime bridge.
// Normal Supabase accounts + automatic admin role + organic server jobs.

const dkd_v04Original = {
  dkd_bind: dkd_Game.prototype.dkd_bind,
  dkd_receive: dkd_Game.prototype.dkd_receive,
  dkd_render: dkd_Game.prototype.dkd_render,
  dkd_save: dkd_Game.prototype.dkd_save,
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_view_intro: dkd_Game.prototype.dkd_view_intro,
  dkd_view_register: dkd_Game.prototype.dkd_view_register,
  dkd_view_phone: dkd_Game.prototype.dkd_view_phone,
  dkd_view_settings: dkd_Game.prototype.dkd_view_settings,
  dkd_view_privacy: dkd_Game.prototype.dkd_view_privacy,
};

const dkd_v04AudioOriginal = {
  dkd_start: dkd_Audio.prototype.dkd_start,
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

function dkd_v04InstallStyles() {
  if (document.getElementById('dkd-v04-runtime-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v04-runtime-style';
  dkd_style.textContent = `
    .dkd-v04-auth-actions{display:grid;gap:12px;margin-top:16px}
    .dkd-v04-account-card{border-color:#4fd9cf}
    .dkd-v04-sync-state{display:flex;align-items:center;gap:8px;margin:10px 0 0}
    .dkd-v04-sync-dot{width:9px;height:9px;border-radius:50%;background:#54dfd2;display:inline-block}
    #dkd-deliver{left:16px;right:16px;bottom:156px}
    #dkd-deliver .dkd-button{
      min-height:74px;
      border-radius:22px;
      border:3px solid #e4ff5e;
      background:#52ddd2;
      color:#08172a;
      font-size:17px;
      font-weight:950;
      letter-spacing:.35px;
      animation:dkd-v04-deliver-pulse 1.15s ease-in-out infinite;
    }
    #dkd-deliver .dkd-button svg{
      width:34px;
      height:34px;
      padding:6px;
      border-radius:50%;
      background:#e4ff5e;
      color:#0a1830;
      stroke-width:2.2;
    }
    #dkd-deliver .dkd-button:active{transform:scale(.97);background:#e4ff5e}
    @keyframes dkd-v04-deliver-pulse{
      0%,100%{transform:scale(1);background:#52ddd2;border-color:#e4ff5e}
      50%{transform:scale(1.035);background:#e4ff5e;border-color:#52ddd2}
    }
    html[data-dkd-motion="off"] #dkd-deliver .dkd-button{animation:none}
  `;
  document.head.appendChild(dkd_style);
}

function dkd_v04Init(dkd_game) {
  if (dkd_game.dkd_v04Initialized) return;
  dkd_game.dkd_v04Initialized = true;
  dkd_game.dkd_v04AuthKnown = false;
  dkd_game.dkd_v04Authenticated = false;
  dkd_game.dkd_v04CloudReady = false;
  dkd_game.dkd_v04IsAdmin = false;
  dkd_game.dkd_v04AuthEmail = '';
  dkd_game.dkd_v04Cloud = null;
  dkd_game.dkd_v04JobsLoading = false;
  dkd_game.dkd_v04SaveTimer = null;
  dkd_game.dkd_v04PendingRegistration = null;
  dkd_game.dkd_v04PostSignup = false;
  dkd_game.dkd_test = null;
  if (dkd_game.dkd_career) dkd_game.dkd_career.dkd_training = false;
  if (Array.isArray(dkd_demoRankings)) dkd_demoRankings.splice(0, dkd_demoRankings.length);
  if (dkd_game.dkd_audio) {
    dkd_game.dkd_audio.dkd_tracks = ['Gece Akışı', 'Neon Kavşak', 'Şehir Nabzı', 'Yağmur Hattı', 'Şafak Rotası'];
  }
  dkd_v04InstallStyles();
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
    dkd_grocery: 'dkd_oversized',
    dkd_bakery: 'dkd_hot',
    dkd_flowers: 'dkd_fragile',
    dkd_laundry: 'dkd_oversized',
    dkd_petcare: 'dkd_oversized',
    dkd_legal: 'dkd_confidential',
    dkd_lab: 'dkd_medical',
    dkd_catering: 'dkd_hot',
  };
  return dkd_map[dkd_id] || 'dkd_hot';
}

function dkd_v04CreateCloudOrder(dkd_game, dkd_serverEntry, dkd_index) {
  const dkd_job = dkd_serverEntry?.dkd_job || dkd_serverEntry || {};
  const dkd_mission = dkd_serverEntry?.dkd_mission || {};
  const dkd_serverPackage = dkd_serverEntry?.dkd_package || {};
  const dkd_serverCustomer = dkd_serverEntry?.dkd_customer || {};
  const dkd_origin = dkd_serverEntry?.dkd_origin || {};
  const dkd_destination = dkd_serverEntry?.dkd_destination || {};
  const dkd_seed = dkd_v04Seed(dkd_job.dkd_id || `${Date.now()}-${dkd_index}`);
  const dkd_order = dkd_makeOrder(dkd_game.dkd_state, dkd_game.dkd_graph, dkd_seed, 'normal');
  const dkd_packageId = dkd_v04PackageId(dkd_job.dkd_package_id || dkd_mission.dkd_package_id);
  const dkd_package = dkd_packages.find(dkd_item => dkd_item.dkd_id === dkd_packageId) || dkd_packages[0];
  const dkd_customer = dkd_customers.find(dkd_item => dkd_item.dkd_kind === dkd_packageId) || dkd_customers[0];
  const dkd_weatherId = dkd_weathers.some(dkd_item => dkd_item.dkd_id === dkd_job.dkd_weather_id) ? dkd_job.dkd_weather_id : 'dkd_clear';
  const dkd_reward = Math.max(0, Math.floor(Number(dkd_job.dkd_reward) || Number(dkd_serverPackage.dkd_base_reward) || Number(dkd_package.dkd_base) || 0));
  const dkd_deadline = Math.max(90, Math.floor(Number(dkd_job.dkd_time_limit_sec) || Number(dkd_order.dkd_deadline) || 300));

  dkd_order.dkd_id = `dkd_cloud_${dkd_job.dkd_id || dkd_seed}`;
  dkd_order.dkd_cloudJobId = String(dkd_job.dkd_id || '');
  dkd_order.dkd_cloudMissionId = String(dkd_job.dkd_template_id || dkd_mission.dkd_id || '');
  dkd_order.dkd_cloudMissionName = String(dkd_mission.dkd_name || 'Last-Mile Görevi');
  dkd_order.dkd_cloudMissionDescription = String(dkd_mission.dkd_description || '');
  dkd_order.dkd_cloudPackageName = String(dkd_serverPackage.dkd_name || dkd_package.dkd_name || 'Paket');
  dkd_order.dkd_cloudPackageIcon = String(dkd_serverPackage.dkd_icon || dkd_package.dkd_icon || 'box');
  dkd_order.dkd_cloudCustomerName = String(dkd_serverCustomer.dkd_name || 'Teslimat Noktası');
  dkd_order.dkd_cloudCustomerRole = String(dkd_serverCustomer.dkd_role || 'Teslimat noktası');
  dkd_order.dkd_cloudCustomerNote = String(dkd_serverCustomer.dkd_note || '');
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

function dkd_v04UpdateClock() {
  const dkd_parts = dkd_v04ClockParts();
  const dkd_clock = document.getElementById('dkd-v04-clock');
  if (dkd_clock) dkd_clock.innerHTML = `${dkd_parts.dkd_hour}<span>:</span>${dkd_parts.dkd_minute}`;
  const dkd_introClock = document.getElementById('dkd-v04-intro-clock');
  if (dkd_introClock) dkd_introClock.textContent = dkd_parts.dkd_text;
}

function dkd_v04ProfileFromServer(dkd_game, dkd_profile, dkd_fallback = null) {
  const dkd_previous = dkd_game.dkd_career?.dkd_profile || dkd_game.dkd_state?.dkd_profile || {};
  const dkd_source = dkd_profile || dkd_fallback || {};
  return {
    dkd_name: String(dkd_source.dkd_full_name || dkd_source.dkd_name || dkd_previous.dkd_name || '').slice(0, 80),
    dkd_username: String(dkd_source.dkd_username || dkd_previous.dkd_username || '').slice(0, 40),
    dkd_phone: String(dkd_source.dkd_phone || dkd_previous.dkd_phone || '').slice(0, 30),
    dkd_company: String(dkd_source.dkd_company_name || dkd_source.dkd_company || dkd_previous.dkd_company || '').slice(0, 80),
    dkd_photo: String(dkd_previous.dkd_photo || ''),
  };
}

function dkd_v04ResetLocalAfterLogout(dkd_game) {
  dkd_game.dkd_run = null;
  dkd_game.dkd_orders = [];
  dkd_game.dkd_career = dkd_defaultState();
  dkd_game.dkd_test = null;
  dkd_game.dkd_state = dkd_game.dkd_career;
  dkd_game.dkd_audio.dkd_state = dkd_game.dkd_state;
  dkd_game.dkd_scene.dkd_state = dkd_game.dkd_state;
  dkd_game.dkd_scene.dkd_refreshBrand(dkd_vehicleStats(dkd_game.dkd_state).dkd_kind);
  dkd_v04Original.dkd_save.call(dkd_game);
}

function dkd_v04StopMusicVoices(dkd_audio) {
  if (!dkd_audio?.dkd_context || !dkd_audio.dkd_v04MusicVoices) return;
  const dkd_now = dkd_audio.dkd_context.currentTime;
  for (const dkd_voice of dkd_audio.dkd_v04MusicVoices) {
    try {
      dkd_voice.dkd_gain.gain.cancelScheduledValues(dkd_now);
      dkd_voice.dkd_gain.gain.setValueAtTime(Math.max(.0001, Number(dkd_voice.dkd_gain.gain.value) || .0001), dkd_now);
      dkd_voice.dkd_gain.gain.exponentialRampToValueAtTime(.0001, dkd_now + .07);
      dkd_voice.dkd_osc.stop(dkd_now + .08);
    } catch {}
  }
  dkd_audio.dkd_v04MusicVoices.clear();
}

function dkd_v04MusicNote(dkd_audio, dkd_frequency, dkd_duration, dkd_volume, dkd_type, dkd_target, dkd_when) {
  if (!dkd_audio?.dkd_context || dkd_audio.dkd_muted || !dkd_target) return;
  const dkd_at = Math.max(dkd_audio.dkd_context.currentTime, Number(dkd_when) || dkd_audio.dkd_context.currentTime);
  const dkd_osc = dkd_audio.dkd_context.createOscillator();
  const dkd_gain = dkd_audio.dkd_context.createGain();
  dkd_osc.type = dkd_type;
  dkd_osc.frequency.setValueAtTime(Math.max(20, dkd_frequency), dkd_at);
  dkd_gain.gain.setValueAtTime(.0001, dkd_at);
  dkd_gain.gain.exponentialRampToValueAtTime(Math.max(.0001, dkd_volume), dkd_at + .012);
  dkd_gain.gain.exponentialRampToValueAtTime(.0001, dkd_at + dkd_duration);
  dkd_osc.connect(dkd_gain);
  dkd_gain.connect(dkd_target);
  const dkd_voice = { dkd_osc, dkd_gain };
  dkd_audio.dkd_v04MusicVoices.add(dkd_voice);
  dkd_osc.start(dkd_at);
  dkd_osc.stop(dkd_at + dkd_duration + .03);
  dkd_osc.onended = () => {
    dkd_audio.dkd_v04MusicVoices.delete(dkd_voice);
    try { dkd_osc.disconnect(); } catch {}
    try { dkd_gain.disconnect(); } catch {}
  };
}

function dkd_v04ApplyMusicMode(dkd_audio, dkd_drive) {
  if (!dkd_audio?.dkd_context || !dkd_audio.dkd_v04MenuMusic || !dkd_audio.dkd_v04DriveMusic) return;
  const dkd_now = dkd_audio.dkd_context.currentTime;
  const dkd_volume = Math.max(0, Math.min(1, Number(dkd_audio.dkd_state?.dkd_settings?.dkd_music) || 0));
  const dkd_mode = dkd_drive ? 'drive' : 'menu';
  if (dkd_audio.dkd_v04Mode !== dkd_mode) {
    dkd_v04StopMusicVoices(dkd_audio);
    dkd_audio.dkd_v04Mode = dkd_mode;
    dkd_audio.dkd_v04Beat = 0;
    dkd_audio.dkd_v04NextBeat = dkd_now + .04;
  }
  dkd_audio.dkd_v04MenuMusic.gain.setTargetAtTime(dkd_drive ? 0 : dkd_volume, dkd_now, .07);
  dkd_audio.dkd_v04DriveMusic.gain.setTargetAtTime(dkd_drive ? dkd_volume : 0, dkd_now, .07);
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
  this.dkd_v04MusicVoices = new Set();
  this.dkd_v04Mode = '';
  this.dkd_v04Beat = 0;
  this.dkd_v04NextBeat = this.dkd_context.currentTime + .04;
};

dkd_Audio.prototype.dkd_update = function dkd_v04AudioUpdate(dkd_run) {
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

  dkd_v04ApplyMusicMode(this, dkd_active);
  if (this.dkd_v04NextBeat < dkd_now - .5) this.dkd_v04NextBeat = dkd_now + .03;

  const dkd_driveRoots = [
    [55, 65.41, 73.42, 49],
    [58.27, 69.3, 77.78, 51.91],
    [61.74, 73.42, 82.41, 55],
    [49, 58.27, 65.41, 43.65],
    [65.41, 77.78, 87.31, 58.27],
  ][this.dkd_track % 5];
  const dkd_menuRoots = [
    [110, 130.81, 146.83, 98],
    [116.54, 138.59, 155.56, 103.83],
    [123.47, 146.83, 164.81, 110],
    [98, 116.54, 130.81, 87.31],
    [130.81, 155.56, 174.61, 116.54],
  ][this.dkd_track % 5];

  while (this.dkd_v04NextBeat < dkd_now + .10) {
    const dkd_step = this.dkd_v04Beat;
    if (this.dkd_v04Mode === 'drive') {
      const dkd_root = dkd_driveRoots[Math.floor(dkd_step / 16) % dkd_driveRoots.length];
      const dkd_phase = dkd_step % 16;
      if (dkd_phase % 4 === 0) {
        dkd_v04MusicNote(this, 46, .14, .20, 'sine', this.dkd_v04DriveMusic, this.dkd_v04NextBeat);
        dkd_v04MusicNote(this, dkd_root, .30, .075, 'sawtooth', this.dkd_v04DriveMusic, this.dkd_v04NextBeat);
      }
      if (dkd_phase === 4 || dkd_phase === 12) {
        dkd_v04MusicNote(this, 185, .08, .045, 'triangle', this.dkd_v04DriveMusic, this.dkd_v04NextBeat);
      }
      if (dkd_phase % 2 === 0) {
        const dkd_multiplier = [2, 2.5, 3, 4][Math.floor(dkd_phase / 2) % 4];
        dkd_v04MusicNote(this, dkd_root * dkd_multiplier, .12, .026, 'triangle', this.dkd_v04DriveMusic, this.dkd_v04NextBeat);
      }
      if (dkd_phase === 0) {
        dkd_v04MusicNote(this, dkd_root * 2, 1.45, .017, 'sine', this.dkd_v04DriveMusic, this.dkd_v04NextBeat);
        dkd_v04MusicNote(this, dkd_root * 3, 1.45, .013, 'sine', this.dkd_v04DriveMusic, this.dkd_v04NextBeat);
      }
      this.dkd_v04NextBeat += .125;
    } else {
      const dkd_root = dkd_menuRoots[Math.floor(dkd_step / 8) % dkd_menuRoots.length];
      const dkd_phase = dkd_step % 8;
      if (dkd_phase % 2 === 0) {
        dkd_v04MusicNote(this, dkd_root * 2, .42, .028, 'triangle', this.dkd_v04MenuMusic, this.dkd_v04NextBeat);
      }
      if (dkd_phase === 0) {
        dkd_v04MusicNote(this, dkd_root, 1.55, .026, 'sine', this.dkd_v04MenuMusic, this.dkd_v04NextBeat);
        dkd_v04MusicNote(this, dkd_root * 1.5, 1.55, .015, 'sine', this.dkd_v04MenuMusic, this.dkd_v04NextBeat);
      }
      this.dkd_v04NextBeat += .32;
    }
    this.dkd_v04Beat++;
  }
};

dkd_Game.prototype.dkd_bind = function dkd_v04Bind() {
  dkd_v04Original.dkd_bind.call(this);
  dkd_v04Init(this);

  document.addEventListener('submit', dkd_event => {
    if (dkd_event.target.id === 'dkd-v04-login-form') {
      dkd_event.preventDefault();
      const dkd_fields = new FormData(dkd_event.target);
      this.dkd_send('auth-login', {
        dkd_email: String(dkd_fields.get('dkd_email') || '').trim(),
        dkd_password: String(dkd_fields.get('dkd_password') || ''),
      });
      this.dkd_toast('Hesabına giriş yapılıyor…');
      return;
    }

    if (dkd_event.target.id === 'dkd-v04-register-form') {
      dkd_event.preventDefault();
      const dkd_fields = new FormData(dkd_event.target);
      const dkd_fullName = String(dkd_fields.get('dkd_full_name') || '').trim();
      const dkd_username = String(dkd_fields.get('dkd_username') || '').trim();
      const dkd_phone = String(dkd_fields.get('dkd_phone') || '').replace(/[^+0-9]/g, '');
      const dkd_companyName = String(dkd_fields.get('dkd_company_name') || '').trim();
      const dkd_email = String(dkd_fields.get('dkd_email') || '').trim().toLowerCase();
      const dkd_password = String(dkd_fields.get('dkd_password') || '');

      if (dkd_fullName.length < 3 || dkd_companyName.length < 2 || !/^[A-Za-z0-9_]{3,22}$/.test(dkd_username) || !/^\+?\d{10,15}$/.test(dkd_phone) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dkd_email) || dkd_password.length < 6) {
        return this.dkd_toast('Ad, kullanıcı adı, telefon, şirket, e-posta ve şifre bilgilerini kontrol et.');
      }
      if (!dkd_fields.get('dkd_cloud') || !dkd_fields.get('dkd_rules')) {
        return this.dkd_toast('Hesap ve oyun koşullarını onaylaman gerekiyor.');
      }

      this.dkd_v04PendingRegistration = {
        dkd_full_name: dkd_fullName,
        dkd_username,
        dkd_phone,
        dkd_company_name: dkd_companyName,
        dkd_email,
        dkd_photo: this.dkd_pendingPhoto || '',
      };
      this.dkd_send('auth-signup', {
        dkd_full_name: dkd_fullName,
        dkd_username,
        dkd_phone,
        dkd_company_name: dkd_companyName,
        dkd_email,
        dkd_password: dkd_password,
      });
      this.dkd_toast('Supabase hesabın oluşturuluyor…');
    }
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
    this.dkd_v04CloudReady = false;
    this.dkd_v04IsAdmin = false;
    this.dkd_v04Cloud = null;

    if (this.dkd_v04Authenticated) {
      this.dkd_send('cloud-bootstrap', {});
    } else {
      if (dkd_payload.dkd_data?.dkd_logged_out === true) dkd_v04ResetLocalAfterLogout(this);
      this.dkd_render('intro');
    }
    return;
  }

  if (dkd_payload.dkd_type === 'auth-signup-result') {
    if (dkd_payload.dkd_data?.dkd_authenticated === true) {
      this.dkd_v04AuthKnown = true;
      this.dkd_v04Authenticated = true;
      this.dkd_v04AuthEmail = String(dkd_payload.dkd_data?.dkd_email || '');
      this.dkd_v04PostSignup = true;
      if (this.dkd_v04PendingRegistration) {
        const dkd_pending = this.dkd_v04PendingRegistration;
        this.dkd_career.dkd_profile = {
          dkd_name: dkd_pending.dkd_full_name,
          dkd_username: dkd_pending.dkd_username,
          dkd_phone: dkd_pending.dkd_phone,
          dkd_company: dkd_pending.dkd_company_name,
          dkd_photo: dkd_pending.dkd_photo || '',
        };
        this.dkd_state = this.dkd_career;
        dkd_v04Original.dkd_save.call(this);
      }
      this.dkd_send('cloud-bootstrap', {});
    } else if (dkd_payload.dkd_data?.dkd_confirmation_required === true) {
      const dkd_email = dkd_escape(String(dkd_payload.dkd_data?.dkd_email || 'e-posta adresin'));
      this.dkd_modal(
        'E-posta doğrulaması gerekli',
        `${dkd_email} adresine gönderilen doğrulama bağlantısını aç. Ardından Giriş Yap ekranından hesabına girebilirsin.`,
        dkd_button('GİRİŞ YAP', 'v04-login', 'fingerprint'),
      );
    }
    return;
  }

  if (dkd_payload.dkd_type === 'cloud-bootstrap') {
    const dkd_response = dkd_payload.dkd_data || {};
    const dkd_cloud = dkd_response.dkd_data || dkd_response;
    this.dkd_v04Cloud = dkd_cloud;
    this.dkd_v04CloudReady = dkd_cloud?.dkd_enabled === true;
    this.dkd_v04IsAdmin = dkd_cloud?.dkd_role === 'admin' || dkd_cloud?.dkd_is_admin === true;

    if (!this.dkd_v04CloudReady) {
      this.dkd_toast('Last-Mile hesabı etkinleştirilemedi.');
      this.dkd_render('intro');
      return;
    }

    const dkd_hadLocalProfile = Boolean(this.dkd_career?.dkd_profile);
    if (dkd_cloud?.dkd_progress && typeof dkd_cloud.dkd_progress === 'object' && dkd_cloud.dkd_progress.dkd_schema === 1 && !this.dkd_v04PostSignup) {
      this.dkd_career = dkd_restoreState(dkd_cloud.dkd_progress);
    }

    const dkd_profile = dkd_v04ProfileFromServer(this, dkd_cloud?.dkd_profile, this.dkd_v04PendingRegistration);
    if (dkd_profile.dkd_name || dkd_profile.dkd_username || dkd_profile.dkd_company) {
      this.dkd_career.dkd_profile = dkd_profile;
    }
    this.dkd_career.dkd_training = false;
    this.dkd_state = this.dkd_career;
    this.dkd_audio.dkd_state = this.dkd_state;
    this.dkd_scene.dkd_state = this.dkd_state;
    this.dkd_scene.dkd_refreshBrand(dkd_vehicleStats(this.dkd_state).dkd_kind);

    const dkd_targetPage = this.dkd_v04PostSignup
      ? 'brand'
      : dkd_cloud?.dkd_progress || dkd_hadLocalProfile
        ? 'home'
        : this.dkd_state.dkd_profile
          ? 'brand'
          : 'register';

    this.dkd_v04PostSignup = false;
    this.dkd_v04PendingRegistration = null;
    this.dkd_toast(this.dkd_v04IsAdmin ? 'Yönetici hesabı otomatik tanındı. Gerçek görevler aktif.' : 'Hesabın ve gerçek görev bağlantın hazır.');
    this.dkd_render(dkd_targetPage);
    this.dkd_save();
    return;
  }

  if (dkd_payload.dkd_type === 'cloud-jobs') {
    this.dkd_v04JobsLoading = false;
    const dkd_rows = Array.isArray(dkd_payload.dkd_data) ? dkd_payload.dkd_data : [];
    this.dkd_orders = dkd_rows.filter(Boolean).map((dkd_entry, dkd_index) => dkd_v04CreateCloudOrder(this, dkd_entry, dkd_index));
    if (this.dkd_pageName === 'dispatch') this.dkd_render('dispatch');
    return;
  }

  if (dkd_payload.dkd_type === 'cloud-job-complete') {
    this.dkd_toast('Teslimat Supabase üzerinde tamamlandı.');
    return;
  }

  if (dkd_payload.dkd_type === 'cloud-error') {
    this.dkd_v04JobsLoading = false;
    this.dkd_toast(String(dkd_payload.dkd_data || 'Last-Mile sunucu işlemi tamamlanamadı.'));
  }
};

dkd_Game.prototype.dkd_refreshOrders = function dkd_v04RefreshOrders() {
  dkd_v04Init(this);
  if (!this.dkd_v04CloudReady || this.dkd_v04JobsLoading) return;
  for (const dkd_order of this.dkd_orders) {
    if (dkd_order?.dkd_cloudJobId) {
      this.dkd_send('cloud-cancel-job', { dkd_job_id: dkd_order.dkd_cloudJobId, dkd_reason: 'offer_refresh' });
    }
  }
  this.dkd_orders = [];
  this.dkd_v04JobsLoading = true;
  this.dkd_send('cloud-claim-jobs', { dkd_count: 5, dkd_level: dkd_level(this.dkd_state) });
};

dkd_Game.prototype.dkd_save = function dkd_v04Save() {
  dkd_v04Original.dkd_save.call(this);
  dkd_v04Init(this);
  if (!this.dkd_v04CloudReady || !this.dkd_v04Authenticated) return;
  clearTimeout(this.dkd_v04SaveTimer);
  this.dkd_v04SaveTimer = setTimeout(() => {
    this.dkd_send('cloud-save', { dkd_game_state: this.dkd_career });
  }, 650);
};

dkd_Game.prototype.dkd_action = function dkd_v04Action(dkd_action) {
  dkd_v04Init(this);
  const [dkd_command, ...dkd_parts] = String(dkd_action || '').split(':');
  const dkd_value = dkd_parts.join(':');

  if (dkd_command === 'v04-login') {
    this.dkd_closeModal();
    return this.dkd_render('login');
  }

  if (dkd_command === 'v04-demo-toggle') {
    if (!this.dkd_v04IsAdmin) return this.dkd_toast('Bu ayar yalnızca yönetici hesabına açıktır.');
    this.dkd_send('admin-demo-toggle', { dkd_enabled: dkd_value === 'on' });
    return;
  }

  if (dkd_command === 'v04-logout') {
    this.dkd_send('auth-logout', {});
    return;
  }

  if (!this.dkd_v04Authenticated && !['intro', 'register', 'back', 'modal-close', 'pick-photo', 'privacy-modal'].includes(dkd_command)) {
    return this.dkd_toast('Devam etmek için giriş yap veya yeni hesap oluştur.');
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
    for (const dkd_order of this.dkd_orders) {
      if (dkd_order?.dkd_cloudJobId && dkd_order.dkd_cloudJobId !== this.dkd_selectedOrder.dkd_cloudJobId) {
        this.dkd_send('cloud-cancel-job', { dkd_job_id: dkd_order.dkd_cloudJobId, dkd_reason: 'another_offer_accepted' });
      }
    }
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

  if (!this.dkd_v04AuthKnown && dkd_pageName !== 'intro') dkd_pageName = 'intro';
  if (this.dkd_v04AuthKnown && !this.dkd_v04Authenticated && !['intro', 'login', 'register'].includes(dkd_pageName)) {
    dkd_pageName = 'intro';
  }
  if (this.dkd_v04Authenticated && !this.dkd_v04CloudReady && !['intro', 'login', 'register'].includes(dkd_pageName)) {
    dkd_pageName = 'intro';
  }

  const dkd_result = dkd_v04Original.dkd_render.call(this, dkd_pageName, dkd_arg);
  dkd_v04UpdateClock();
  dkd_v04ApplyMusicMode(this.dkd_audio, dkd_pageName === 'drive');
  return dkd_result;
};

dkd_Game.prototype.dkd_view_intro = function dkd_v04Intro() {
  dkd_v04Init(this);
  const dkd_parts = dkd_v04ClockParts();
  const dkd_registerButton = dkd_button('KENDİ ŞİRKETİNİ KUR', 'register', 'arrow');
  const dkd_loginAndRegister = `<div class="dkd-v04-auth-actions">${dkd_button('GİRİŞ YAP', 'v04-login', 'fingerprint', 'dkd-secondary')}${dkd_registerButton}</div>`;
  return dkd_v04Original.dkd_view_intro.call(this)
    .replace(/\d{2}:\d{2}\s*·\s*ANTALYA/, `<span id="dkd-v04-intro-clock">${dkd_parts.dkd_text}</span> · ANKARA`)
    .replace(dkd_registerButton, dkd_loginAndRegister)
    .replace('Ücretsiz deneme sürümü · Gerçek ödeme ve ödül yok.', 'Supabase hesap sistemi · Gerçek görev verileri · Expo Go geliştirme sürümü');
};

dkd_Game.prototype.dkd_view_login = function dkd_v04Login() {
  return this.dkd_page(
    'Giriş Yap',
    `<span class="dkd-kicker">LAST-MILE / HESABIN</span>
     <h1 style="font-size:34px;margin:12px 0">Kaldığın yerden<br/>devam et.</h1>
     <p class="dkd-muted dkd-text-sm">Normal oyuncu hesabınla giriş yapabilirsin. Yönetici hesabı kullanıldığında yetki otomatik tanınır.</p>
     <form id="dkd-v04-login-form">
       <div class="dkd-field"><label>E-posta</label><input name="dkd_email" type="email" autocomplete="username" required/></div>
       <div class="dkd-field"><label>Şifre</label><input name="dkd_password" type="password" autocomplete="current-password" minlength="6" required/></div>
       <button class="dkd-button" type="submit">${dkd_icon('fingerprint')}<span>GİRİŞ YAP</span></button>
     </form>
     <div class="dkd-space"></div>
     ${dkd_button('YENİ ŞİRKET / KAYIT OL', 'register', 'company', 'dkd-secondary')}`,
  );
};

dkd_Game.prototype.dkd_view_register = function dkd_v04Register() {
  return this.dkd_page(
    'Yeni bir başlangıç',
    `<span class="dkd-kicker">01 / HESAP + KURYE PROFİLİ</span>
     <h1 style="font-size:32px;margin:12px 0">Kendi adınla.<br/>Kendi şirketinle.</h1>
     <p class="dkd-muted dkd-text-sm">Bu bilgilerle gerçek Supabase hesabın oluşturulur. İlerlemen hesabına senkronize edilir.</p>
     <form id="dkd-v04-register-form">
       <div class="dkd-field"><label>Ad Soyad</label><input name="dkd_full_name" autocomplete="name" maxlength="80" placeholder="Adın ve soyadın" required/></div>
       <div class="dkd-field"><label>Kullanıcı adı</label><input name="dkd_username" autocomplete="username" maxlength="22" pattern="[a-zA-Z0-9_]{3,22}" placeholder="Kartal07" required/></div>
       <div class="dkd-field"><label>Telefon numarası</label><input name="dkd_phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="18" placeholder="0555 000 00 00" required/></div>
       <div class="dkd-field"><label>Şirket adı</label><input name="dkd_company_name" maxlength="80" placeholder="Kartal Kurye" required/></div>
       <div class="dkd-field"><label>E-posta</label><input name="dkd_email" type="email" autocomplete="email" maxlength="320" placeholder="ornek@mail.com" required/></div>
       <div class="dkd-field"><label>Şifre</label><input name="dkd_password" type="password" autocomplete="new-password" minlength="6" maxlength="72" placeholder="En az 6 karakter" required/></div>
       <button type="button" class="dkd-button dkd-secondary" data-dkd-action="pick-photo">${dkd_icon('camera')}<span>Profil fotoğrafı seç · isteğe bağlı</span></button>
       <div class="dkd-space"></div>
       <label class="dkd-check"><input type="checkbox" name="dkd_cloud" required/><span>Hesabımın ve oyun ilerlememin Supabase üzerinde saklanmasını kabul ediyorum.</span></label>
       <div class="dkd-space"></div>
       <label class="dkd-check"><input type="checkbox" name="dkd_rules" required/><span>Oyun kurallarını ve veri kapsamını okudum.</span></label>
       <div class="dkd-space"></div>
       <button type="submit" class="dkd-button">${dkd_icon('company')}<span>ŞİRKETİNİ KUR / KAYIT OL</span></button>
     </form>
     <div class="dkd-space"></div>
     ${dkd_button('ZATEN HESABIM VAR / GİRİŞ YAP', 'v04-login', 'fingerprint', 'dkd-secondary')}`,
  );
};

dkd_Game.prototype.dkd_view_phone = function dkd_v04Phone() {
  const dkd_parts = dkd_v04ClockParts();
  return dkd_v04Original.dkd_view_phone.call(this)
    .replace(/<h1>\d{2}<span>:\<\/span>\d{2}<\/h1>/, `<h1 id="dkd-v04-clock">${dkd_parts.dkd_hour}<span>:</span>${dkd_parts.dkd_minute}</h1>`);
};

dkd_Game.prototype.dkd_view_dispatch = function dkd_v04Dispatch() {
  if (!this.dkd_orders.length && !this.dkd_v04JobsLoading) this.dkd_refreshOrders();
  const dkd_status = this.dkd_v04JobsLoading
    ? '<div class="dkd-notice">Supabase gerçek görev havuzu yenileniyor…</div>'
    : !this.dkd_orders.length
      ? '<div class="dkd-notice">Şu anda uygun görev bulunamadı. Yenile düğmesiyle tekrar kontrol edebilirsin.</div>'
      : '';
  const dkd_demoLabel = this.dkd_v04IsAdmin && this.dkd_v04Cloud?.dkd_demo_enabled === true
    ? '<span class="dkd-chip">ADMIN DEMO AÇIK</span>'
    : '<span class="dkd-chip dkd-accent">GERÇEK VERİ</span>';

  const dkd_body = `<div class="dkd-between"><div><span class="dkd-kicker">LAST-MILE / ANKARA</span><h2 style="margin-top:8px">Sıradaki gerçek işler.</h2></div>${dkd_iconButton('refresh','orders-refresh','Görevleri yenile')}</div>
    <div class="dkd-space"></div>
    <div class="dkd-between">${dkd_demoLabel}<small>${Array.isArray(this.dkd_v04Cloud?.dkd_missions) ? this.dkd_v04Cloud.dkd_missions.filter(dkd_item => !dkd_item.dkd_is_demo).length : 0} aktif gerçek görev şablonu</small></div>
    <div class="dkd-space"></div>${dkd_status}<div class="dkd-space"></div>
    ${this.dkd_orders.map((dkd_order, dkd_index) => {
      const dkd_weather = dkd_weathers.find(dkd_item => dkd_item.dkd_id === dkd_order.dkd_weather) || dkd_weathers[0];
      return `<div class="dkd-order">
        <div class="dkd-between"><span class="dkd-chip dkd-accent">${dkd_icon(dkd_order.dkd_cloudPackageIcon || 'box')}${dkd_escape(dkd_order.dkd_cloudPackageName || 'PAKET').toLocaleUpperCase('tr-TR')}</span><span class="dkd-mini-stats">${dkd_icon(dkd_weather.dkd_icon,16)}${dkd_weather.dkd_name}</span></div>
        <h3>${dkd_escape(dkd_order.dkd_cloudDestination || dkd_order.dkd_destination)}</h3>
        <small>${dkd_escape(dkd_order.dkd_cloudMissionName || 'Last-Mile görevi')}</small>
        ${dkd_order.dkd_cloudMissionDescription ? `<p class="dkd-muted dkd-text-sm" style="margin-top:8px">${dkd_escape(dkd_order.dkd_cloudMissionDescription)}</p>` : ''}
        <div class="dkd-order-stats">
          <div><b>${(dkd_order.dkd_safe.dkd_distance / 1000).toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2})} km</b><small>ROTA</small></div>
          <div><b>${dkd_time(dkd_order.dkd_deadline)}</b><small>SÜRE</small></div>
          <div><b class="dkd-accent">${dkd_currency(dkd_order.dkd_offer.dkd_total)}</b><small>ÖDÜL</small></div>
        </div>
        <div class="dkd-card" style="margin:12px 0 0">
          <div class="dkd-row"><span class="dkd-icon-tile">${dkd_icon('pin')}</span><div><b>${dkd_escape(dkd_order.dkd_cloudCustomerName || 'Teslimat Noktası')}</b><small style="display:block">${dkd_escape(dkd_order.dkd_cloudCustomerRole || '')}</small></div></div>
          <small style="display:block;margin-top:8px">${dkd_escape(dkd_order.dkd_cloudOrigin || 'Kurye Merkezi')} → ${dkd_escape(dkd_order.dkd_cloudDestination || 'Teslimat')}</small>
        </div>
        <div class="dkd-order-footer">${dkd_button('ROTAYI İNCELE', `order:${dkd_index}`, 'nav')}${dkd_iconButton('close',`reject:${dkd_index}`,'Görevi reddet')}</div>
      </div>`;
    }).join('')}`;
  return this.dkd_page('Siparişler', dkd_body, '', 'Supabase organik görev sistemi');
};

dkd_Game.prototype.dkd_view_rankings = function dkd_v04Rankings() {
  return this.dkd_page('Sıralamalar', `<span class="dkd-kicker">GERÇEK OYUNCU VERİSİ</span><h2 style="margin:12px 0">Sıralama hazırlanıyor.</h2><div class="dkd-notice">Sahte rakip yok. Gerçek oyuncu skorları oluştuğunda bu ekran yalnızca sunucu tarafından doğrulanmış kayıtları gösterecek.</div><div class="dkd-space"></div><div class="dkd-leader dkd-me"><span class="dkd-place">—</span><div><b>${dkd_escape(this.dkd_state.dkd_profile?.dkd_username || 'OYUNCU')}</b><small style="display:block">Kendi kariyerin</small></div><span class="dkd-score">—</span></div>`);
};

dkd_Game.prototype.dkd_view_daily = function dkd_v04Daily() {
  dkd_tickDay(this.dkd_state);
  const dkd_state = this.dkd_state;
  const dkd_tasks = dkd_dailyRequirements(dkd_state);
  return this.dkd_page('Günlük Görevler', `<span class="dkd-kicker">BUGÜN / ${dkd_state.dkd_daily.dkd_date}</span><h2 style="margin:12px 0">Günlük hedeflerin.</h2>${dkd_tasks.map(dkd_task => `<div class="dkd-list-line"><span class="dkd-chapter-number ${dkd_task.dkd_have>=dkd_task.dkd_need?'dkd-done':''}">${dkd_task.dkd_have>=dkd_task.dkd_need?'✓':dkd_icon('flag',15)}</span><div class="dkd-expand"><b class="dkd-text-sm">${dkd_task.dkd_name}</b>${dkd_progressBar(dkd_task.dkd_have,dkd_task.dkd_need)}</div><small>${Math.min(dkd_task.dkd_need,Math.floor(dkd_task.dkd_have))}/${dkd_task.dkd_need}</small></div>`).join('')}<div class="dkd-space"></div>${dkd_button(dkd_state.dkd_daily.dkd_claimed?'BUGÜNKÜ KASA ALINDI':'GÜNLÜK KASA / 750 TL + ROZET','claim-daily','box','dkd-secondary')}<div class="dkd-divider"></div><span class="dkd-kicker">TOPLULUK</span><div class="dkd-notice">Sentetik topluluk sayacı yok. Gerçek topluluk etkinliği sunucu verisi oluştuğunda açılacak.</div>`);
};

dkd_Game.prototype.dkd_view_settings = function dkd_v04Settings() {
  const dkd_state = this.dkd_state;
  const dkd_demoEnabled = this.dkd_v04Cloud?.dkd_demo_enabled === true;
  const dkd_realMissionCount = Array.isArray(this.dkd_v04Cloud?.dkd_missions)
    ? this.dkd_v04Cloud.dkd_missions.filter(dkd_item => dkd_item.dkd_is_demo !== true).length
    : 0;

  const dkd_account = this.dkd_v04IsAdmin
    ? `<div class="dkd-divider"></div><h3>Last-Mile yönetici</h3><div class="dkd-card dkd-v04-account-card"><span class="dkd-kicker">${dkd_escape(this.dkd_v04AuthEmail || 'YÖNETİCİ')}</span><h3 style="margin:8px 0">Yönetici yetkisi otomatik aktif</h3><div class="dkd-v04-sync-state"><span class="dkd-v04-sync-dot"></span><small>${dkd_realMissionCount} gerçek görev aktif · Demo ${dkd_demoEnabled?'açık':'kapalı'}</small></div><p class="dkd-muted dkd-text-sm" style="margin-top:12px">Demo verileri yalnızca bu yönetici hesabına eklenir. Normal oyuncular demo içeriklerini görmez.</p><div class="dkd-space"></div>${dkd_button(dkd_demoEnabled?'DEMO VERİLERİNİ KAPAT':'DEMO VERİLERİNİ AÇ',`v04-demo-toggle:${dkd_demoEnabled?'off':'on'}`,'fingerprint','dkd-secondary')}<div class="dkd-space"></div>${dkd_button('OTURUMU KAPAT','v04-logout','close','dkd-warning')}</div>`
    : `<div class="dkd-divider"></div><h3>Hesabım</h3><div class="dkd-card dkd-v04-account-card"><span class="dkd-kicker">${dkd_escape(this.dkd_v04AuthEmail || 'OYUNCU')}</span><h3 style="margin:8px 0">Supabase senkronizasyonu aktif</h3><div class="dkd-v04-sync-state"><span class="dkd-v04-sync-dot"></span><small>${dkd_realMissionCount} gerçek görev şablonu kullanılabilir</small></div><div class="dkd-space"></div>${dkd_button('OTURUMU KAPAT','v04-logout','close','dkd-warning')}</div>`;

  return this.dkd_page('Ayarlar', `<div class="dkd-between"><div><span class="dkd-brand">SON KİLOMETRE</span><small style="display:block;margin-top:5px">v0.4 · Expo SDK 57 · Supabase</small></div><span class="dkd-chip">TÜRKÇE</span></div><div class="dkd-divider"></div><h3>Görüntü ve ses</h3><div class="dkd-segment">${[['low','Ekonomik'],['balanced','Dengeli'],['high','Yüksek']].map(dkd_item=>`<button data-dkd-action="quality:${dkd_item[0]}" class="${dkd_state.dkd_settings.dkd_quality===dkd_item[0]?'dkd-selected':''}">${dkd_item[1]}</button>`).join('')}</div><div class="dkd-field"><label>Efekt sesi</label><input type="range" min="0" max="100" value="${Math.round(dkd_state.dkd_settings.dkd_effects*100)}" data-dkd-setting="dkd_effects"/></div><div class="dkd-field"><label>Müzik</label><input type="range" min="0" max="100" value="${Math.round(dkd_state.dkd_settings.dkd_music*100)}" data-dkd-setting="dkd_music"/></div><div class="dkd-divider"></div><h3>Kayıt ve bilgi</h3><div class="dkd-stack">${dkd_button('NASIL OYNANIR','guide','info','dkd-secondary')}</div>${dkd_account}`);
};

dkd_Game.prototype.dkd_view_privacy = function dkd_v04Privacy() {
  return this.dkd_page('Veri ve v0.4 kapsamı', `<div class="dkd-privacy-list"><h3>Supabase hesabı</h3><p>E-posta ve şifre Supabase Auth ile yönetilir. Kurye profilin ve oyun ilerlemen Last-Mile alanında hesabına bağlı saklanır.</p><h3>Cihaz kaydı</h3><p>AsyncStorage yalnızca cihaz içi çalışma kopyasıdır. Hesap değiştirildiğinde gerçek ilerleme Supabase hesabından geri yüklenir.</p><h3>Yönetici</h3><p>Yönetici rolü hesap yetkisinden otomatik belirlenir. Demo görevleri varsayılan kapalıdır ve yalnızca yönetici kendi hesabı için açabilir.</p><h3>Sıralama ve topluluk</h3><p>Sentetik rakip ve sentetik topluluk sayacı gösterilmez. Gerçek kullanıcı verisi oluşmadan genel sıralama üretilmez.</p><h3>Ödüller</h3><p>v0.4 geliştirme aşamasında gerçek fiziksel ödül kazanımı etkin değildir.</p></div>`);
};

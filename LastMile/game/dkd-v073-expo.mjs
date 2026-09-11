// DraBornGo / LastMile v0.7.3 Expo test layer.
// Android/Expo-only release candidate until device testing is approved for web sync.

const dkd_v073Previous = {
  dkd_bind: dkd_Game.prototype.dkd_bind,
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_render: dkd_Game.prototype.dkd_render,
  dkd_view_settings: dkd_Game.prototype.dkd_view_settings,
  dkd_view_drive: dkd_Game.prototype.dkd_view_drive,
  dkd_audioUpdate: dkd_Audio.prototype.dkd_update,
};

const dkd_v073Version = 'v0.7.3';
const dkd_v073Cameras = ['near', 'chase', 'high'];
const dkd_v073CameraLabels = { near: 'Yakın', chase: 'Takip / Standart', high: 'Yüksek' };

function dkd_v073InstallStyles() {
  if (document.getElementById('dkd-v073-expo-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v073-expo-style';
  dkd_style.textContent = `
    .dkd-v073-field-error{display:block;margin:7px 3px 0;color:#ffac9d;font-size:11px;font-weight:850;line-height:1.35}
    .dkd-field input.dkd-v073-invalid{border-color:#ff856f!important;background:#2b2027!important}
    .dkd-field input.dkd-v073-invalid:focus{outline:2px solid #ff856f;outline-offset:2px}
    .dkd-drive-tools button.dkd-v073-muted{border-color:#ff9b7d!important;background:#3a2730!important;color:#ffd5c9!important}
  `;
  document.head.appendChild(dkd_style);
}

dkd_v073InstallStyles();

function dkd_v073IsAdmin(dkd_game) {
  if (typeof dkd_v05LiveIsAdmin === 'function') {
    try { if (dkd_v05LiveIsAdmin(dkd_game)) return true; } catch {}
  }
  return dkd_game?.dkd_v04IsAdmin === true
    || dkd_game?.dkd_v04Cloud?.dkd_role === 'admin'
    || dkd_game?.dkd_v04Cloud?.dkd_is_admin === true;
}

function dkd_v073SettingsHtml(dkd_html, dkd_game) {
  let dkd_output = String(dkd_html || '')
    .replace('data-dkd-action="reset"', 'data-dkd-action="v04-logout"')
    .replaceAll('KARİYER KAYDINI SİL', 'OTURUMU KAPAT');
  if (!dkd_v073IsAdmin(dkd_game)) {
    dkd_output = dkd_output.replace(/<section class="dkd-v07-section" data-dkd-tone="orange">[\s\S]*?<h3>Test laboratuvarı<\/h3>[\s\S]*?<\/section>/i, '');
  }
  return dkd_output;
}

dkd_Game.prototype.dkd_view_settings = function dkd_v073SettingsView() {
  return dkd_v073SettingsHtml(dkd_v073Previous.dkd_view_settings.call(this), this);
};

function dkd_v073ClearFieldErrors(dkd_form) {
  for (const dkd_error of dkd_form.querySelectorAll('.dkd-v073-field-error')) dkd_error.remove();
  for (const dkd_input of dkd_form.querySelectorAll('.dkd-v073-invalid')) {
    dkd_input.classList.remove('dkd-v073-invalid');
    dkd_input.removeAttribute('aria-invalid');
    dkd_input.removeAttribute('aria-describedby');
  }
}

function dkd_v073FieldError(dkd_form, dkd_name, dkd_message) {
  const dkd_input = dkd_form.elements.namedItem(dkd_name);
  if (!dkd_input || typeof dkd_input !== 'object' || !('classList' in dkd_input)) return null;
  const dkd_field = dkd_input.closest?.('.dkd-field') || dkd_input.parentElement;
  const dkd_id = `dkd-v073-error-${dkd_name}`;
  dkd_input.classList.add('dkd-v073-invalid');
  dkd_input.setAttribute('aria-invalid', 'true');
  dkd_input.setAttribute('aria-describedby', dkd_id);
  const dkd_error = document.createElement('small');
  dkd_error.id = dkd_id;
  dkd_error.className = 'dkd-v073-field-error';
  dkd_error.textContent = dkd_message;
  dkd_field?.appendChild(dkd_error);
  return dkd_input;
}

function dkd_v073ValidateRegistration(dkd_form) {
  dkd_v073ClearFieldErrors(dkd_form);
  const dkd_fields = new FormData(dkd_form);
  const dkd_fullName = String(dkd_fields.get('dkd_full_name') || '').trim();
  const dkd_username = String(dkd_fields.get('dkd_username') || '').trim();
  const dkd_phone = String(dkd_fields.get('dkd_phone') || '').replace(/[^+0-9]/g, '');
  const dkd_company = String(dkd_fields.get('dkd_company_name') || '').trim();
  const dkd_plate = String(dkd_fields.get('dkd_plate_no') || '').trim().toLocaleUpperCase('tr-TR').replace(/\s+/g, ' ');
  const dkd_email = String(dkd_fields.get('dkd_email') || '').trim().toLowerCase();
  const dkd_password = String(dkd_fields.get('dkd_password') || '');
  const dkd_errors = [];

  const dkd_add = (dkd_name, dkd_label, dkd_message) => {
    dkd_errors.push({ dkd_name, dkd_label, dkd_message });
  };
  if (dkd_fullName.length < 3) dkd_add('dkd_full_name', 'Ad Soyad', 'Ad Soyad en az 3 karakter olmalı.');
  if (!/^[A-Za-z0-9_]{3,22}$/.test(dkd_username)) dkd_add('dkd_username', 'Kullanıcı adı', '3–22 karakter kullan; yalnızca harf, rakam ve _ kullanabilirsin.');
  if (!/^\+?\d{10,15}$/.test(dkd_phone)) dkd_add('dkd_phone', 'Telefon', 'Telefon numarası 10–15 rakamdan oluşmalı. Örnek: 05550000000.');
  if (dkd_company.length < 2) dkd_add('dkd_company_name', 'Şirket adı', 'Şirket adı en az 2 karakter olmalı.');
  if (dkd_form.elements.namedItem('dkd_plate_no') && !/^[0-9]{2} [A-ZÇĞİÖŞÜ]{1,3} [0-9]{2,4}$/u.test(dkd_plate)) dkd_add('dkd_plate_no', 'Plaka', 'Plaka formatı geçersiz. Örnek: 06 ABC 123. Harf bölümü 1–3 harf olmalı.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dkd_email)) dkd_add('dkd_email', 'E-posta', 'Geçerli bir e-posta adresi gir. Örnek: ad@mail.com.');
  if (dkd_password.length < 6) dkd_add('dkd_password', 'Şifre', 'Şifre en az 6 karakter olmalı.');

  if (dkd_errors.length) {
    let dkd_first = null;
    for (const dkd_error of dkd_errors) dkd_first ||= dkd_v073FieldError(dkd_form, dkd_error.dkd_name, dkd_error.dkd_message);
    dkd_first?.focus?.({ preventScroll: true });
    dkd_first?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    return { dkd_ok: false, dkd_message: `Düzeltmen gereken alan${dkd_errors.length > 1 ? 'lar' : ''}: ${dkd_errors.map(dkd_error => dkd_error.dkd_label).join(', ')}` };
  }
  if (!dkd_fields.get('dkd_cloud') || !dkd_fields.get('dkd_rules')) {
    return { dkd_ok: false, dkd_message: 'Devam etmek için çevrimiçi kayıt ve oyun kuralları onaylarını işaretle.' };
  }
  return { dkd_ok: true, dkd_message: '' };
}

function dkd_v073BindRegistrationValidation(dkd_game) {
  if (document.documentElement.dataset.dkdV073ValidationBound === 'true') return;
  document.documentElement.dataset.dkdV073ValidationBound = 'true';
  document.addEventListener('submit', dkd_event => {
    if (dkd_event.target?.id !== 'dkd-v04-register-form') return;
    const dkd_result = dkd_v073ValidateRegistration(dkd_event.target);
    if (dkd_result.dkd_ok) return;
    dkd_event.preventDefault();
    dkd_event.stopImmediatePropagation();
    dkd_game.dkd_toast(dkd_result.dkd_message);
  }, true);
}

dkd_Game.prototype.dkd_bind = function dkd_v073Bind() {
  const dkd_result = dkd_v073Previous.dkd_bind.call(this);
  dkd_v073BindRegistrationValidation(this);
  return dkd_result;
};

function dkd_v073DriveButton(dkd_action, dkd_iconName, dkd_label, dkd_muted = false) {
  return `<button class="dkd-icon-button${dkd_muted ? ' dkd-v073-muted' : ''}" data-dkd-action="${dkd_action}" aria-label="${dkd_label}" title="${dkd_label}">${dkd_icon(dkd_iconName)}</button>`;
}

dkd_Game.prototype.dkd_view_drive = function dkd_v073DriveView() {
  let dkd_html = String(dkd_v073Previous.dkd_view_drive.call(this) || '');
  dkd_html = dkd_html.replace(/<button\b[^>]*data-dkd-action="photo"[^>]*>[\s\S]*?<\/button>/i, dkd_v073DriveButton('dkd-v073-camera-cycle', 'camera', 'Sürüş kamerasını değiştir'));
  dkd_html = dkd_html.replace(/<button\b[^>]*data-dkd-action="headlight"[^>]*>[\s\S]*?<\/button>/i, dkd_v073DriveButton('dkd-v073-audio-toggle', 'music', this.dkd_audio?.dkd_v073UserMuted ? 'Oyunun seslerini aç' : 'Oyunun seslerini kapat', this.dkd_audio?.dkd_v073UserMuted === true));
  return dkd_html;
};

function dkd_v073ApplyMute(dkd_audio) {
  if (!dkd_audio) return;
  const dkd_muted = dkd_audio.dkd_v073UserMuted === true;
  if (dkd_audio.dkd_context && dkd_audio.dkd_master?.gain) {
    const dkd_now = dkd_audio.dkd_context.currentTime;
    try {
      dkd_audio.dkd_master.gain.cancelScheduledValues(dkd_now);
      dkd_audio.dkd_master.gain.setTargetAtTime(dkd_muted ? 0 : .84, dkd_now, .025);
    } catch {}
  }
  for (const dkd_player of dkd_audio.dkd_v05MediaPlayers || []) {
    if (dkd_muted) {
      try { dkd_player.volume = 0; } catch {}
    }
  }
}

dkd_Audio.prototype.dkd_update = function dkd_v073AudioUpdate(dkd_run) {
  const dkd_result = dkd_v073Previous.dkd_audioUpdate.call(this, dkd_run);
  dkd_v073ApplyMute(this);
  return dkd_result;
};

function dkd_v073RefreshAudioButton(dkd_game) {
  const dkd_button = dkd_game?.dkd_root?.querySelector?.('[data-dkd-action="dkd-v073-audio-toggle"]');
  if (!dkd_button) return;
  const dkd_muted = dkd_game.dkd_audio?.dkd_v073UserMuted === true;
  const dkd_label = dkd_muted ? 'Oyunun seslerini aç' : 'Oyunun seslerini kapat';
  dkd_button.classList.toggle('dkd-v073-muted', dkd_muted);
  dkd_button.setAttribute('aria-label', dkd_label);
  dkd_button.setAttribute('title', dkd_label);
}

dkd_Game.prototype.dkd_action = function dkd_v073Action(dkd_action) {
  const dkd_text = String(dkd_action || '');
  if (dkd_text === 'dkd-v073-camera-cycle') {
    const dkd_current = this.dkd_state?.dkd_settings?.dkd_camera || 'chase';
    const dkd_index = Math.max(0, dkd_v073Cameras.indexOf(dkd_current));
    const dkd_next = dkd_v073Cameras[(dkd_index + 1) % dkd_v073Cameras.length];
    this.dkd_state.dkd_settings.dkd_camera = dkd_next;
    if (this.dkd_scene) this.dkd_scene.dkd_cameraSnap = true;
    this.dkd_save();
    this.dkd_toast(`Sürüş kamerası: ${dkd_v073CameraLabels[dkd_next]}`);
    return;
  }
  if (dkd_text === 'dkd-v073-audio-toggle') {
    this.dkd_audio.dkd_v073UserMuted = this.dkd_audio.dkd_v073UserMuted !== true;
    if (!this.dkd_audio.dkd_v073UserMuted) this.dkd_audio.dkd_update(this.dkd_run);
    dkd_v073ApplyMute(this.dkd_audio);
    dkd_v073RefreshAudioButton(this);
    this.dkd_toast(this.dkd_audio.dkd_v073UserMuted ? 'Oyun sesleri kapatıldı.' : 'Oyun sesleri açıldı.');
    return;
  }
  return dkd_v073Previous.dkd_action.call(this, dkd_action);
};

function dkd_v073NormalizeVisible(dkd_root) {
  if (!dkd_root) return;
  for (const dkd_chip of dkd_root.querySelectorAll?.('.dkd-version') || []) dkd_chip.textContent = dkd_v073Version;
  const dkd_walker = document.createTreeWalker(dkd_root, NodeFilter.SHOW_TEXT);
  const dkd_nodes = [];
  while (dkd_walker.nextNode()) dkd_nodes.push(dkd_walker.currentNode);
  for (const dkd_node of dkd_nodes) {
    const dkd_value = String(dkd_node.nodeValue || '');
    const dkd_next = dkd_value.replaceAll('v0.7.2', dkd_v073Version).replaceAll('V0.7.2', 'V0.7.3');
    if (dkd_next !== dkd_value) dkd_node.nodeValue = dkd_next;
  }
}

dkd_Game.prototype.dkd_render = function dkd_v073Render(dkd_page, dkd_arg = null) {
  const dkd_result = dkd_v073Previous.dkd_render.call(this, dkd_page, dkd_arg);
  dkd_v073NormalizeVisible(this.dkd_root);
  if (dkd_page === 'drive') dkd_v073RefreshAudioButton(this);
  return dkd_result;
};

window.dkd_lastMileV073 = {
  dkd_version: dkd_v073Version,
  dkd_androidVersionCode: 1,
  dkd_expoOnlyCandidate: true,
  dkd_webPublished: false,
  dkd_adminTestLabOnly: true,
  dkd_registrationFieldErrors: true,
  dkd_driveCameraCycle: [...dkd_v073Cameras],
  dkd_driveAudioToggle: true,
  dkd_logoutReplacesCareerDelete: true,
};

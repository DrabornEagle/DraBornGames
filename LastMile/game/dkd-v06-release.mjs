// DraBornGo / Last Mile v0.6 release layer.
// Customer photo avatars, level-50 admin guard, plate registration and reward-vault wording.

const dkd_v06Previous = {
  dkd_bind: dkd_Game.prototype.dkd_bind,
  dkd_receive: dkd_Game.prototype.dkd_receive,
  dkd_render: dkd_Game.prototype.dkd_render,
  dkd_save: dkd_Game.prototype.dkd_save,
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_view_register: dkd_Game.prototype.dkd_view_register,
  dkd_view_vault: dkd_Game.prototype.dkd_view_vault,
};

const dkd_v06LegacyAvatar = dkd_avatar;
const dkd_v06AdminLevel = 50;
const dkd_v06AdminXp = 384160;
const dkd_v06CustomerAvatars = {
  dkd_selin: dkd_v06AvatarSelin,
  dkd_ece: dkd_v06AvatarEce,
  dkd_mira: dkd_v06AvatarMira,
  dkd_deniz: dkd_v06AvatarDeniz,
  dkd_lara: dkd_v06AvatarLara,
  dkd_ada: dkd_v06AvatarAda,
  dkd_asya: dkd_v06AvatarAsya,
  dkd_irem: dkd_v06AvatarIrem,
  dkd_duru: dkd_v06AvatarDuru,
  dkd_emre: dkd_v06AvatarElif,
};

function dkd_v06NormalizePlate(dkd_value) {
  const dkd_compact = String(dkd_value || '')
    .toLocaleUpperCase('tr-TR')
    .replace(/[^0-9A-ZÇĞİÖŞÜ]/gu, '');
  const dkd_match = dkd_compact.match(/^([0-9]{2})([A-ZÇĞİÖŞÜ]{1,3})([0-9]{2,4})$/u);
  return dkd_match ? `${dkd_match[1]} ${dkd_match[2]} ${dkd_match[3]}` : '';
}

function dkd_v06IsAdmin(dkd_game) {
  return dkd_game?.dkd_v04IsAdmin === true
    || dkd_game?.dkd_v04Cloud?.dkd_role === 'admin'
    || dkd_game?.dkd_v04Cloud?.dkd_is_admin === true;
}

function dkd_v06ApplyAdminLevel(dkd_game) {
  if (!dkd_v06IsAdmin(dkd_game)) return false;
  let dkd_changed = false;
  const dkd_states = [];
  if (dkd_game?.dkd_state) dkd_states.push(dkd_game.dkd_state);
  if (dkd_game?.dkd_career && dkd_game.dkd_career !== dkd_game.dkd_state) dkd_states.push(dkd_game.dkd_career);
  for (const dkd_state of dkd_states) {
    if (Number(dkd_state.dkd_xp) !== dkd_v06AdminXp) {
      dkd_state.dkd_xp = dkd_v06AdminXp;
      dkd_changed = true;
    }
  }
  return dkd_changed;
}

function dkd_v06ApplyPlate(dkd_game, dkd_plateValue) {
  const dkd_plate = dkd_v06NormalizePlate(dkd_plateValue);
  if (!dkd_plate) return false;
  let dkd_changed = false;
  const dkd_states = [];
  if (dkd_game?.dkd_state) dkd_states.push(dkd_game.dkd_state);
  if (dkd_game?.dkd_career && dkd_game.dkd_career !== dkd_game.dkd_state) dkd_states.push(dkd_game.dkd_career);
  for (const dkd_state of dkd_states) {
    if (!dkd_state.dkd_brand) dkd_state.dkd_brand = {};
    if (dkd_state.dkd_brand.dkd_plate !== dkd_plate) {
      dkd_state.dkd_brand.dkd_plate = dkd_plate;
      dkd_changed = true;
    }
    if (dkd_state.dkd_profile) {
      if (dkd_state.dkd_profile.dkd_plate !== dkd_plate) {
        dkd_state.dkd_profile.dkd_plate = dkd_plate;
        dkd_changed = true;
      }
    }
  }
  return dkd_changed;
}

function dkd_v06CloudPayload(dkd_payload) {
  const dkd_outer = dkd_payload?.dkd_data;
  if (!dkd_outer || typeof dkd_outer !== 'object') return {};
  return dkd_outer.dkd_data && typeof dkd_outer.dkd_data === 'object' ? dkd_outer.dkd_data : dkd_outer;
}

function dkd_v06InstallStyles() {
  if (document.getElementById('dkd-v06-release-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v06-release-style';
  dkd_style.textContent = `
    .dkd-avatar{object-fit:cover!important;object-position:center 34%!important;background:#18243a}
    .dkd-avatar.dkd-large{object-position:center 30%!important}
    .dkd-v06-plate-hint{display:block;margin-top:6px;color:#8fa4be;font-size:11px;line-height:1.45}
  `;
  document.head.appendChild(dkd_style);
}

dkd_v06InstallStyles();

const dkd_v06LegacyNamedCustomer = dkd_customers.find(dkd_item => dkd_item.dkd_id === 'dkd_emre');
if (dkd_v06LegacyNamedCustomer) {
  dkd_v06LegacyNamedCustomer.dkd_name = 'Elif B.';
  dkd_v06LegacyNamedCustomer.dkd_role = 'Atölye sahibi';
}

dkd_avatar = function dkd_v06Avatar(dkd_id, dkd_large = false) {
  const dkd_person = dkd_customers.find(dkd_item => dkd_item.dkd_id === dkd_id) || dkd_customers[0];
  const dkd_source = dkd_v06CustomerAvatars[dkd_person?.dkd_id];
  if (!dkd_source) return dkd_v06LegacyAvatar(dkd_id, dkd_large);
  return `<img class="dkd-avatar${dkd_large ? ' dkd-large' : ''}" src="${dkd_source}" alt="${dkd_escape(dkd_person.dkd_name)} — kurgusal karakter"/>`;
};

dkd_Game.prototype.dkd_bind = function dkd_v06Bind() {
  dkd_v06Previous.dkd_bind.call(this);
  if (this.dkd_v06Bound) return;
  this.dkd_v06Bound = true;

  document.addEventListener('submit', dkd_event => {
    const dkd_form = dkd_event.target;
    if (!(dkd_form instanceof HTMLFormElement) || dkd_form.id !== 'dkd-v04-register-form') return;

    dkd_event.preventDefault();
    dkd_event.stopImmediatePropagation();

    const dkd_fields = new FormData(dkd_form);
    const dkd_fullName = String(dkd_fields.get('dkd_full_name') || '').trim();
    const dkd_username = String(dkd_fields.get('dkd_username') || '').trim();
    const dkd_phone = String(dkd_fields.get('dkd_phone') || '').replace(/[^+0-9]/g, '');
    const dkd_companyName = String(dkd_fields.get('dkd_company_name') || '').trim();
    const dkd_plateNo = dkd_v06NormalizePlate(dkd_fields.get('dkd_plate_no'));
    const dkd_email = String(dkd_fields.get('dkd_email') || '').trim().toLowerCase();
    const dkd_password = String(dkd_fields.get('dkd_password') || '');

    if (dkd_fullName.length < 3 || dkd_companyName.length < 2 || !/^[A-Za-z0-9_]{3,22}$/.test(dkd_username) || !/^\+?\d{10,15}$/.test(dkd_phone) || !dkd_plateNo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dkd_email) || dkd_password.length < 6) {
      return this.dkd_toast('Ad, kullanıcı adı, telefon, şirket, plaka, e-posta ve şifre bilgilerini kontrol et. Plaka örneği: 06 ABC 123.');
    }
    if (!dkd_fields.get('dkd_cloud') || !dkd_fields.get('dkd_rules')) {
      return this.dkd_toast('Hesap ve oyun koşullarını onaylaman gerekiyor.');
    }

    this.dkd_v06PendingPlate = dkd_plateNo;
    dkd_v06ApplyPlate(this, dkd_plateNo);
    dkd_v06Previous.dkd_save.call(this);
    this.dkd_v04PendingRegistration = {
      dkd_full_name: dkd_fullName,
      dkd_username,
      dkd_phone,
      dkd_company_name: dkd_companyName,
      dkd_plate_no: dkd_plateNo,
      dkd_email,
      dkd_photo: this.dkd_pendingPhoto || '',
    };
    this.dkd_send('auth-signup', {
      dkd_full_name: dkd_fullName,
      dkd_username,
      dkd_phone,
      dkd_company_name: dkd_companyName,
      dkd_plate_no: dkd_plateNo,
      dkd_email,
      dkd_password,
    });
    this.dkd_toast('Supabase hesabın ve şirket plakan hazırlanıyor…');
  }, true);
};

dkd_Game.prototype.dkd_view_register = function dkd_v06Register() {
  const dkd_html = dkd_v06Previous.dkd_view_register.call(this);
  const dkd_plateField = `<div class="dkd-field"><label>Plaka</label><input name="dkd_plate_no" inputmode="text" autocomplete="off" autocapitalize="characters" maxlength="15" placeholder="06 ABC 123" required/><small class="dkd-v06-plate-hint">Şirketinin başlangıç aracında kullanılacak plaka.</small></div>`;
  const dkd_emailMarker = '<div class="dkd-field"><label>E-posta</label>';
  return dkd_html.includes('name="dkd_plate_no"') ? dkd_html : dkd_html.replace(dkd_emailMarker, `${dkd_plateField}${dkd_emailMarker}`);
};

dkd_Game.prototype.dkd_receive = function dkd_v06Receive(dkd_payload) {
  const dkd_pendingPlate = this.dkd_v06PendingPlate || this.dkd_v04PendingRegistration?.dkd_plate_no || '';
  const dkd_result = dkd_v06Previous.dkd_receive.call(this, dkd_payload);
  let dkd_changed = dkd_v06ApplyAdminLevel(this);

  if (dkd_payload?.dkd_type === 'auth-signup-result' && dkd_payload.dkd_data?.dkd_authenticated === true) {
    dkd_changed = dkd_v06ApplyPlate(this, dkd_pendingPlate) || dkd_changed;
  }

  if (dkd_payload?.dkd_type === 'cloud-bootstrap') {
    const dkd_cloud = dkd_v06CloudPayload(dkd_payload);
    const dkd_serverPlate = dkd_cloud?.dkd_profile?.dkd_plate_no || dkd_pendingPlate || this.dkd_state?.dkd_brand?.dkd_plate || this.dkd_career?.dkd_brand?.dkd_plate;
    dkd_changed = dkd_v06ApplyPlate(this, dkd_serverPlate) || dkd_changed;
    this.dkd_v06PendingPlate = '';
  }

  if (dkd_changed && this.dkd_state) dkd_v06Previous.dkd_save.call(this);
  return dkd_result;
};

dkd_Game.prototype.dkd_save = function dkd_v06Save() {
  dkd_v06ApplyAdminLevel(this);
  const dkd_profilePlate = this.dkd_state?.dkd_profile?.dkd_plate || this.dkd_career?.dkd_profile?.dkd_plate;
  if (dkd_profilePlate) dkd_v06ApplyPlate(this, dkd_profilePlate);
  return dkd_v06Previous.dkd_save.call(this);
};

dkd_Game.prototype.dkd_render = function dkd_v06Render(dkd_page) {
  dkd_v06ApplyAdminLevel(this);
  return dkd_v06Previous.dkd_render.call(this, dkd_page);
};

dkd_Game.prototype.dkd_action = function dkd_v06Action(dkd_action) {
  dkd_v06ApplyAdminLevel(this);
  const dkd_result = dkd_v06Previous.dkd_action.call(this, dkd_action);
  if (dkd_v06ApplyAdminLevel(this)) dkd_v06Previous.dkd_save.call(this);
  return dkd_result;
};

dkd_Game.prototype.dkd_view_vault = function dkd_v06Vault() {
  return String(dkd_v06Previous.dkd_view_vault.call(this))
    .replace('● FİZİKSEL ÖDÜLLER AKTİF', '● ÖDÜLLER AKTİF');
};

window.dkd_lastMileRelease = 'v0.6';

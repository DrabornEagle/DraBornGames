// DraBornGo / Last Mile v0.7 device polish.
// Final device layer: seat the imported rider around his own pivot, animate the
// imported Yamaha wheel hubs, migrate first camera view to Takip/Standart,
// and replace settings/music surfaces with the premium v0.7 UI.

const dkd_v07PolishPrevious = {
  dkd_buildBike: dkd_Scene.prototype.dkd_buildBike,
  dkd_sceneUpdate: dkd_Scene.prototype.dkd_update,
  dkd_render: dkd_Game.prototype.dkd_render,
};

const dkd_v07PolishRiderIndexes = new Set([22, 23, 24, 25, 26, 27]);
const dkd_v07PolishSeatOffset = new dkd_three.Vector3(0.08, 0.08, 0.0);
const dkd_v07PolishWheelDefinitions = [
  { dkd_name: 'arka', dkd_center: [-0.7816, 0.3772, -0.0026], dkd_radius: 0.215 },
  { dkd_name: 'on', dkd_center: [0.7879, 0.2850, -0.0058], dkd_radius: 0.211 },
];

function dkd_v07PolishInstallStyles() {
  if (document.getElementById('dkd-v07-device-polish-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v07-device-polish-style';
  dkd_style.textContent = `
    html[data-dkd-page="settings"] .dkd-page-body{padding-bottom:34px}
    .dkd-v07p-settings-hero{position:relative;overflow:hidden;border:1px solid #536886;border-radius:28px;background:#16243b;padding:20px;margin-bottom:16px}
    .dkd-v07p-settings-hero:before{content:"";position:absolute;left:0;top:0;bottom:0;width:7px;background:#dfff55}
    .dkd-v07p-settings-title{display:flex;align-items:center;gap:14px}.dkd-v07p-settings-title>span{width:58px;height:58px;border-radius:18px;background:#dfff55;color:#11203a;display:grid;place-items:center;flex:0 0 auto}.dkd-v07p-settings-title h2{margin:0;font-size:25px}.dkd-v07p-settings-title p{margin:5px 0 0;color:#aebbd0;font-size:11px;line-height:1.45}
    .dkd-v07p-chip-row{display:flex;flex-wrap:wrap;gap:7px;margin-top:15px}.dkd-v07p-chip{border:1px solid #4b607e;border-radius:999px;background:#20324f;padding:7px 10px;font-size:9px;font-weight:900;letter-spacing:.35px;color:#dce8f8}.dkd-v07p-chip.dkd-green{border-color:#58cbb9;color:#8ff0dd;background:#193a3a}.dkd-v07p-chip.dkd-blue{border-color:#6e99e2;color:#b9d1ff;background:#1d3153}.dkd-v07p-chip.dkd-purple{border-color:#9b80d6;color:#d8c7ff;background:#30294d}
    .dkd-v07p-setting-section{--dkd-section:#72a1ef;border:1px solid #455a79;border-left:6px solid var(--dkd-section);border-radius:25px;background:#17263f;padding:17px;margin:14px 0}.dkd-v07p-setting-section.dkd-audio{--dkd-section:#f0ab73;background:#2b263b}.dkd-v07p-setting-section.dkd-drive{--dkd-section:#67d1bd;background:#18343d}.dkd-v07p-setting-section.dkd-account{--dkd-section:#b08be5;background:#292743}.dkd-v07p-setting-section.dkd-info{--dkd-section:#83b6ec;background:#1b2e47}
    .dkd-v07p-section-head{display:flex;align-items:center;gap:11px;margin-bottom:14px}.dkd-v07p-section-icon{width:43px;height:43px;border-radius:14px;background:var(--dkd-section);color:#102037;display:grid;place-items:center;flex:0 0 auto}.dkd-v07p-section-head h3{margin:0;font-size:17px}.dkd-v07p-section-head small{display:block;margin-top:3px;color:#9fb0c7;font-size:9px;line-height:1.4}
    .dkd-v07p-quality,.dkd-v07p-camera{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.dkd-v07p-choice{min-height:72px;border:1px solid #4a607f;border-radius:18px;background:#20314e;color:#eaf2ff;padding:10px 7px;font:inherit;font-weight:900;text-align:center}.dkd-v07p-choice small{display:block;margin-top:5px;color:#a7b7cd;font-size:8px;font-weight:750;line-height:1.3}.dkd-v07p-choice.dkd-selected{border-color:var(--dkd-section);background:var(--dkd-section);color:#112039}.dkd-v07p-choice.dkd-selected small{color:#21324a}
    .dkd-v07p-toggle{display:grid;grid-template-columns:44px 1fr auto;gap:11px;align-items:center;border:1px solid #415775;border-radius:18px;background:#14233a;padding:11px;margin-top:9px}.dkd-v07p-toggle>span:first-child{width:42px;height:42px;border-radius:13px;background:#243b5e;display:grid;place-items:center;color:#bcd5fa}.dkd-v07p-toggle b{font-size:13px}.dkd-v07p-toggle small{display:block;margin-top:3px;color:#96a9c4;font-size:9px;line-height:1.35}
    .dkd-v07p-field{margin-top:14px}.dkd-v07p-field-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px}.dkd-v07p-field-head label{font-size:11px;font-weight:900}.dkd-v07p-value{min-width:46px;text-align:center;border-radius:10px;background:#263a59;border:1px solid #4f6687;padding:5px 8px;font:800 10px ui-monospace,monospace;color:#dce9fb}.dkd-v07p-field input[type="range"]{width:100%;accent-color:var(--dkd-section)}
    .dkd-v07p-audio-engine{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}.dkd-v07p-mini{border:1px solid #514e68;border-radius:16px;background:#211f34;padding:11px}.dkd-v07p-mini small{display:block;color:#a8a4bc;font-size:8px}.dkd-v07p-mini b{display:block;margin-top:5px;font-size:11px;color:#ffe0c2}
    .dkd-v07p-settings-actions{display:grid;gap:9px}.dkd-v07p-settings-actions .dkd-button{margin:0}
    .dkd-v07p-radio-hero{border:1px solid #5a5775;border-left:7px solid #efaa72;border-radius:26px;background:#242238;padding:18px;margin-bottom:15px}.dkd-v07p-radio-hero h2{margin:8px 0 7px}.dkd-v07p-radio-hero p{font-size:11px;line-height:1.55;color:#aca9c0}.dkd-v07p-home-track{display:flex;align-items:center;gap:12px;border:1px solid #4c607d;border-radius:18px;background:#172740;padding:12px;margin-top:13px}.dkd-v07p-home-track>span{width:44px;height:44px;border-radius:14px;background:#dfff55;color:#112039;display:grid;place-items:center}.dkd-v07p-home-track b{display:block;font-size:13px}.dkd-v07p-home-track small{display:block;color:#9eafc7;margin-top:3px;font-size:9px}
    .dkd-v07p-track-list{display:grid;gap:9px}.dkd-v07p-track{--dkd-track:#6f9ee8;width:100%;display:grid;grid-template-columns:46px 1fr auto;gap:11px;align-items:center;border:1px solid #445a79;border-left:6px solid var(--dkd-track);border-radius:19px;background:#192a45;color:#ecf3ff;padding:11px;text-align:left}.dkd-v07p-track.dkd-selected{border-color:var(--dkd-track);background:#223754}.dkd-v07p-track-icon{width:44px;height:44px;border-radius:14px;background:var(--dkd-track);color:#102039;display:grid;place-items:center}.dkd-v07p-track b{display:block;font-size:13px}.dkd-v07p-track small{display:block;margin-top:3px;color:#9fb0c7;font-size:9px}.dkd-v07p-track-meta{text-align:right}.dkd-v07p-track-meta strong{display:block;font-size:9px;color:var(--dkd-track)}.dkd-v07p-track-meta span{display:block;margin-top:3px;font-size:8px;color:#91a4be}
    @media(max-width:370px){.dkd-v07p-quality,.dkd-v07p-camera{grid-template-columns:1fr}.dkd-v07p-audio-engine{grid-template-columns:1fr}.dkd-v07p-track{grid-template-columns:42px 1fr}.dkd-v07p-track-meta{grid-column:2;text-align:left}}
  `;
  document.head.appendChild(dkd_style);
}

dkd_v07PolishInstallStyles();

function dkd_v07PolishFindModel(dkd_bike) {
  if (!dkd_bike || !String(dkd_bike.name || '').includes('dkd_city50_v061')) return null;
  return dkd_bike.children.find(dkd_child => dkd_child?.name === 'dkd_v061_yamaha_soulgt125_quaternius_rider')
    || dkd_bike.children.find(dkd_child => dkd_child?.isGroup && String(dkd_child.name || '').includes('yamaha'))
    || null;
}

function dkd_v07PolishRiderMeshes(dkd_model) {
  if (!dkd_model) return [];
  const dkd_result = [];
  dkd_model.traverse(dkd_child => {
    if (!dkd_child?.isMesh) return;
    const dkd_match = String(dkd_child.name || '').match(/dkd_v061_model_mesh_(\d+)/);
    if (!dkd_match) return;
    const dkd_index = Number(dkd_match[1]);
    if (dkd_v07PolishRiderIndexes.has(dkd_index)) dkd_result.push({ dkd_mesh: dkd_child, dkd_index });
  });
  return dkd_result.sort((dkd_first, dkd_second) => dkd_first.dkd_index - dkd_second.dkd_index);
}

function dkd_v07PolishSeatRider(dkd_bike) {
  if (!dkd_bike || dkd_bike.userData?.dkd_v07PolishRiderSeated) return false;
  const dkd_model = dkd_v07PolishFindModel(dkd_bike);
  if (!dkd_model) return false;
  const dkd_entries = dkd_v07PolishRiderMeshes(dkd_model);
  if (dkd_entries.length !== 6) return false;

  // Geometry vertices are authored in shared DK61 model space. v0.7 previously
  // rotated every rider mesh around model origin, which corrected heading but also
  // displaced the complete person. Undo that compatibility transform first.
  for (const { dkd_mesh } of dkd_entries) {
    if (dkd_mesh.userData?.dkd_v07RiderHeading) {
      dkd_mesh.rotation.y -= Math.PI;
      dkd_mesh.userData.dkd_v07RiderHeading = false;
    }
    dkd_mesh.updateMatrix();
  }

  const dkd_bounds = new dkd_three.Box3();
  dkd_bounds.makeEmpty();
  for (const { dkd_mesh } of dkd_entries) {
    dkd_mesh.geometry.computeBoundingBox();
    if (dkd_mesh.geometry.boundingBox) dkd_bounds.union(dkd_mesh.geometry.boundingBox);
  }
  const dkd_pivot = dkd_bounds.getCenter(new dkd_three.Vector3());
  const dkd_riderGroup = new dkd_three.Group();
  dkd_riderGroup.name = 'dkd_v07_rider_seat_group';
  dkd_riderGroup.position.copy(dkd_pivot).add(dkd_v07PolishSeatOffset);
  dkd_riderGroup.rotation.y = Math.PI;
  dkd_model.add(dkd_riderGroup);

  for (const { dkd_mesh, dkd_index } of dkd_entries) {
    dkd_model.remove(dkd_mesh);
    dkd_mesh.position.set(-dkd_pivot.x, -dkd_pivot.y, -dkd_pivot.z);
    dkd_mesh.rotation.set(0, 0, 0);
    dkd_mesh.userData.dkd_v07PolishRiderIndex = dkd_index;
    dkd_riderGroup.add(dkd_mesh);
  }

  dkd_bike.userData.dkd_v07PolishRiderSeated = true;
  dkd_bike.userData.dkd_v07PolishRiderPivot = dkd_pivot.toArray();
  dkd_bike.userData.dkd_v07PolishSeatOffset = dkd_v07PolishSeatOffset.toArray();
  return true;
}

function dkd_v07PolishWheelFace(dkd_radius, dkd_z, dkd_side) {
  const dkd_group = new dkd_three.Group();
  dkd_group.position.z = dkd_z * dkd_side;
  const dkd_silver = new dkd_three.MeshBasicMaterial({ color: '#d8e2ec', side: dkd_three.DoubleSide });
  const dkd_dark = new dkd_three.MeshBasicMaterial({ color: '#26313d', side: dkd_three.DoubleSide });
  const dkd_hub = new dkd_three.Mesh(new dkd_three.CircleGeometry(dkd_radius * .18, 18), dkd_dark);
  dkd_group.add(dkd_hub);
  const dkd_ring = new dkd_three.Mesh(new dkd_three.RingGeometry(dkd_radius * .31, dkd_radius * .39, 24), dkd_silver);
  dkd_ring.position.z = .002 * dkd_side;
  dkd_group.add(dkd_ring);
  for (let dkd_spoke = 0; dkd_spoke < 6; dkd_spoke += 1) {
    const dkd_bar = new dkd_three.Mesh(new dkd_three.BoxGeometry(dkd_radius * .72, dkd_radius * .055, .012), dkd_silver.clone());
    dkd_bar.rotation.z = dkd_spoke * Math.PI / 3;
    dkd_bar.position.z = .004 * dkd_side;
    dkd_group.add(dkd_bar);
  }
  return dkd_group;
}

function dkd_v07PolishInstallWheelRigs(dkd_scene, dkd_bike) {
  if (!dkd_scene || !dkd_bike || dkd_bike.userData?.dkd_v07PolishWheelRigs) return false;
  const dkd_model = dkd_v07PolishFindModel(dkd_bike);
  if (!dkd_model) return false;
  const dkd_rigs = [];
  for (const dkd_definition of dkd_v07PolishWheelDefinitions) {
    const dkd_rig = new dkd_three.Group();
    dkd_rig.name = `dkd_v07_${dkd_definition.dkd_name}_wheel_rotation_rig`;
    dkd_rig.position.set(...dkd_definition.dkd_center);
    dkd_rig.add(dkd_v07PolishWheelFace(dkd_definition.dkd_radius, .132, 1));
    dkd_rig.add(dkd_v07PolishWheelFace(dkd_definition.dkd_radius, .132, -1));
    dkd_model.add(dkd_rig);
    dkd_rigs.push({ dkd_group: dkd_rig, dkd_radius: dkd_definition.dkd_radius, dkd_name: dkd_definition.dkd_name });
  }
  dkd_scene.dkd_v07PolishWheelRigs = dkd_rigs;
  dkd_bike.userData.dkd_v07PolishWheelRigs = true;
  return true;
}

function dkd_v07PolishApplyBike(dkd_scene) {
  const dkd_bike = dkd_scene?.dkd_bike;
  if (!dkd_bike) return false;
  const dkd_seated = dkd_v07PolishSeatRider(dkd_bike) || Boolean(dkd_bike.userData?.dkd_v07PolishRiderSeated);
  const dkd_wheels = dkd_v07PolishInstallWheelRigs(dkd_scene, dkd_bike) || Boolean(dkd_bike.userData?.dkd_v07PolishWheelRigs);
  return dkd_seated && dkd_wheels;
}

dkd_Scene.prototype.dkd_buildBike = function dkd_v07PolishBuildBike(dkd_kind = 'scooter') {
  const dkd_bike = dkd_v07PolishPrevious.dkd_buildBike.call(this, dkd_kind);
  this.dkd_v07PolishWheelRigs = [];
  dkd_v07PolishApplyBike(this);
  const dkd_scene = this;
  let dkd_attempt = 0;
  const dkd_retry = () => {
    dkd_attempt += 1;
    if (!dkd_v07PolishApplyBike(dkd_scene) && dkd_attempt < 18) requestAnimationFrame(dkd_retry);
  };
  requestAnimationFrame(dkd_retry);
  return dkd_bike;
};

dkd_Scene.prototype.dkd_update = function dkd_v07PolishSceneUpdate(dkd_dt, dkd_run = null) {
  if (dkd_run && Array.isArray(this.dkd_v07PolishWheelRigs)) {
    const dkd_speed = Math.max(0, Number(dkd_run.dkd_speed) || 0);
    for (const dkd_wheel of this.dkd_v07PolishWheelRigs) {
      dkd_wheel.dkd_group.rotation.z -= dkd_speed * dkd_dt / Math.max(.12, dkd_wheel.dkd_radius);
    }
  }
  return dkd_v07PolishPrevious.dkd_sceneUpdate.call(this, dkd_dt, dkd_run);
};

function dkd_v07PolishMigrateDefaultCamera(dkd_game) {
  if (!dkd_game?.dkd_state?.dkd_settings || dkd_game.dkd_v07PolishCameraChecked) return;
  dkd_game.dkd_v07PolishCameraChecked = true;
  const dkd_key = 'dkd_v07_camera_default_chase_v1';
  let dkd_alreadyMigrated = false;
  try { dkd_alreadyMigrated = window.localStorage?.getItem(dkd_key) === '1'; } catch {}
  if (dkd_alreadyMigrated) return;
  dkd_game.dkd_state.dkd_settings.dkd_camera = 'chase';
  if (dkd_game.dkd_scene) dkd_game.dkd_scene.dkd_cameraSnap = true;
  try { window.localStorage?.setItem(dkd_key, '1'); } catch {}
  try { dkd_game.dkd_save?.(); } catch {}
}

dkd_Game.prototype.dkd_render = function dkd_v07PolishRender(...dkd_args) {
  dkd_v07PolishMigrateDefaultCamera(this);
  return dkd_v07PolishPrevious.dkd_render.call(this, ...dkd_args);
};

function dkd_v07PolishToggle(dkd_game, dkd_iconName, dkd_title, dkd_subtitle, dkd_action, dkd_on) {
  return `<div class="dkd-v07p-toggle"><span>${dkd_icon(dkd_iconName)}</span><div><b>${dkd_title}</b><small>${dkd_subtitle}</small></div>${dkd_iconButton(dkd_on?'check':'close',dkd_action,dkd_title,dkd_on?'dkd-selected':'')}</div>`;
}

dkd_Game.prototype.dkd_view_settings = function dkd_v07PolishSettings() {
  const dkd_state = this.dkd_state;
  const dkd_settings = dkd_state.dkd_settings;
  const dkd_demoEnabled = this.dkd_v04Cloud?.dkd_demo_enabled === true;
  const dkd_quality = [['low','Ekonomik','Pil ve ısı'],['balanced','Dengeli','Standart'],['high','Yüksek','Daha keskin']];
  const dkd_camera = [['near','Yakın','5 m takip'],['chase','Takip','Standart'],['high','Yüksek','Geniş görüş']];
  const dkd_account = this.dkd_v04IsAdmin
    ? `<div class="dkd-v07p-setting-section dkd-account"><div class="dkd-v07p-section-head"><span class="dkd-v07p-section-icon">${dkd_icon('fingerprint')}</span><div><h3>Yönetici ve test</h3><small>${dkd_escape(this.dkd_v04AuthEmail || 'Yönetici hesabı')}</small></div></div><div class="dkd-v07p-settings-actions">${dkd_button(dkd_demoEnabled?'DEMO VERİLERİNİ KAPAT':'DEMO VERİLERİNİ AÇ',`v04-demo-toggle:${dkd_demoEnabled?'off':'on'}`,'fingerprint','dkd-secondary')}${dkd_button(dkd_state.dkd_training?'ANA KARİYERE DÖN':'TEST KARİYERİNİ AÇ',dkd_state.dkd_training?'test-exit':'test-enter','shield','dkd-secondary')}${dkd_state.dkd_training?dkd_button('FİNAL TEST VERİSİNİ HAZIRLA','test-final','flag','dkd-secondary'):''}${dkd_state.dkd_training?dkd_button('TEST KAYDINI BAŞA AL','test-reset','refresh','dkd-secondary'):''}${dkd_button('OTURUMU KAPAT','v04-logout','close','dkd-warning')}</div></div>`
    : `<div class="dkd-v07p-setting-section dkd-account"><div class="dkd-v07p-section-head"><span class="dkd-v07p-section-icon">${dkd_icon('shield')}</span><div><h3>Hesabım</h3><small>${dkd_escape(this.dkd_v04AuthEmail || 'Oyuncu hesabı')} · bulut kayıt etkin</small></div></div>${dkd_button('OTURUMU KAPAT','v04-logout','close','dkd-warning')}</div>`;

  return this.dkd_page('Ayarlar', `
    <div class="dkd-v07p-settings-hero">
      <div class="dkd-v07p-settings-title"><span>${dkd_icon('settings',29)}</span><div><span class="dkd-kicker">DRA CONTROL / V0.7</span><h2>Ayar Merkezi</h2><p>Görüntü, sürüş, kamera ve sesi tek ekrandan yönet.</p></div></div>
      <div class="dkd-v07p-chip-row"><span class="dkd-v07p-chip dkd-green">EXPO SDK 57</span><span class="dkd-v07p-chip dkd-blue">TAKİP · STANDART</span><span class="dkd-v07p-chip dkd-purple">MP3 FULL MIX</span></div>
    </div>

    <div class="dkd-v07p-setting-section" style="--dkd-section:#79a7f0"><div class="dkd-v07p-section-head"><span class="dkd-v07p-section-icon">${dkd_icon('chip')}</span><div><h3>Görüntü ve performans</h3><small>Telefonuna göre kalite ve arayüz hareketini ayarla.</small></div></div>
      <div class="dkd-v07p-quality">${dkd_quality.map(dkd_item=>`<button class="dkd-v07p-choice ${dkd_settings.dkd_quality===dkd_item[0]?'dkd-selected':''}" data-dkd-action="quality:${dkd_item[0]}">${dkd_item[1]}<small>${dkd_item[2]}</small></button>`).join('')}</div>
      ${dkd_v07PolishToggle(this,'play','Arayüz animasyonları','Sayfa geçişleri ve hareketli kartlar.','toggle-motion',dkd_settings.dkd_motion!==false)}
    </div>

    <div class="dkd-v07p-setting-section dkd-drive"><div class="dkd-v07p-section-head"><span class="dkd-v07p-section-icon">${dkd_icon('wheel')}</span><div><h3>Sürüş ve kamera</h3><small>Varsayılan başlangıç kamerası Takip / Standart.</small></div></div>
      ${dkd_v07PolishToggle(this,'nav','Yardımcı direksiyon','Rotaya dönmeyi kolaylaştırır; gaz ve fren sende.','toggle-assist',dkd_settings.dkd_assist)}
      ${dkd_v07PolishToggle(this,'phone','Titreşim','Çarpışma ve önemli sürüş geri bildirimleri.','toggle-haptics',dkd_settings.dkd_haptics)}
      <div class="dkd-v07p-field"><div class="dkd-v07p-field-head"><label>Direksiyon hassasiyeti</label><span class="dkd-v07p-value">%${Math.round(dkd_settings.dkd_steering*100)}</span></div><input type="range" min="0" max="100" value="${Math.round(dkd_settings.dkd_steering*100)}" data-dkd-setting="dkd_steering" aria-label="Direksiyon hassasiyeti"/></div>
      <div class="dkd-v07p-field-head" style="margin-top:16px"><label>Kamera açısı</label><span class="dkd-v07p-value">${dkd_settings.dkd_camera==='chase'?'STD':dkd_settings.dkd_camera==='near'?'YKN':'YKS'}</span></div>
      <div class="dkd-v07p-camera">${dkd_camera.map(dkd_item=>`<button class="dkd-v07p-choice ${dkd_settings.dkd_camera===dkd_item[0]?'dkd-selected':''}" data-dkd-action="camera-mode:${dkd_item[0]}">${dkd_item[1]}<small>${dkd_item[2]}</small></button>`).join('')}</div>
    </div>

    <div class="dkd-v07p-setting-section dkd-audio"><div class="dkd-v07p-section-head"><span class="dkd-v07p-section-icon">${dkd_icon('music')}</span><div><h3>Ses ve müzik</h3><small>Melodi döngüleri yerine stereo full-mix oyun parçaları.</small></div></div>
      <div class="dkd-v07p-audio-engine"><div class="dkd-v07p-mini"><small>MÜZİK MOTORU</small><b>PCM / WAV MASTER</b></div><div class="dkd-v07p-mini"><small>OYUN DOSYASI</small><b>STEREO MP3 · 192K</b></div><div class="dkd-v07p-mini"><small>SES SAHİBİ</small><b>TEK KAYNAK · AKTİF</b></div><div class="dkd-v07p-mini"><small>VARDİYA</small><b>5 FARKLI MIX</b></div></div>
      <div class="dkd-v07p-field"><div class="dkd-v07p-field-head"><label>Motor, korna ve efektler</label><span class="dkd-v07p-value">%${Math.round(dkd_settings.dkd_effects*100)}</span></div><input type="range" min="0" max="100" value="${Math.round(dkd_settings.dkd_effects*100)}" data-dkd-setting="dkd_effects" aria-label="Efekt sesi"/></div>
      <div class="dkd-v07p-field"><div class="dkd-v07p-field-head"><label>Müzik</label><span class="dkd-v07p-value">%${Math.round(dkd_settings.dkd_music*100)}</span></div><input type="range" min="0" max="100" value="${Math.round(dkd_settings.dkd_music*100)}" data-dkd-setting="dkd_music" aria-label="Müzik"/></div>
      <div class="dkd-space"></div>${dkd_button('MÜZİK KÜTÜPHANESİNİ AÇ','music','music','dkd-secondary')}
    </div>

    ${dkd_account}

    <div class="dkd-v07p-setting-section dkd-info"><div class="dkd-v07p-section-head"><span class="dkd-v07p-section-icon">${dkd_icon('info')}</span><div><h3>Bilgi ve destek</h3><small>v0.7 · Android versionCode 1 · DraBornGo / Son Kilometre</small></div></div><div class="dkd-v07p-settings-actions">${dkd_button('NASIL OYNANIR','guide','info','dkd-secondary')}${dkd_button('GİZLİLİK VE VERİ','privacy','shield','dkd-secondary')}</div></div>
  `);
};

dkd_Game.prototype.dkd_view_music = function dkd_v07PolishMusic() {
  const dkd_driveAssets = Array.isArray(dkd_v05RoadAudioDriveAssets) ? dkd_v05RoadAudioDriveAssets : [];
  const dkd_homeAsset = dkd_v05RoadAudioMenuAsset || dkd_v05MediaAssets?.[0];
  const dkd_preview = Number.isFinite(this.dkd_audio?.dkd_v05MediaPreviewTrack) ? this.dkd_audio.dkd_v05MediaPreviewTrack : 0;
  const dkd_colors = ['#71a6ef','#65d1bd','#eea56d','#b28ce7','#e887a0'];
  const dkd_tracks = dkd_driveAssets.map((dkd_asset, dkd_index) => `
    <button class="dkd-v07p-track ${dkd_preview===dkd_index?'dkd-selected':''}" style="--dkd-track:${dkd_colors[dkd_index % dkd_colors.length]}" data-dkd-action="track:${dkd_index}">
      <span class="dkd-v07p-track-icon">${dkd_icon(dkd_preview===dkd_index?'volume':'play')}</span><span><b>${dkd_escape(dkd_asset.dkd_name)}</b><small>${dkd_escape(dkd_asset.dkd_sub)} · gerçek MP3 medya dosyası</small></span><span class="dkd-v07p-track-meta"><strong>${dkd_asset.dkd_bpm} BPM</strong><span>MIX ${String(dkd_index+1).padStart(2,'0')}</span></span>
    </button>`).join('');
  return this.dkd_page('Müzik', `
    <div class="dkd-v07p-radio-hero"><span class="dkd-kicker">DRA RADIO / FULL MIX</span><h2>Ritim değil.<br/>Sürüş atmosferi.</h2><p>Aktif soundtrack sıfırdan yeniden üretildi. Her parça stereo PCM/WAV master olarak render edilir ve uygulamada gerçek MP3 medya dosyası olarak çalar; açık lead-melodi ve arpej döngüsü kullanılmaz.</p>
      <div class="dkd-v07p-home-track"><span>${dkd_icon('garage')}</span><div><small>KURYE MERKEZİ</small><b>${dkd_escape(dkd_homeAsset?.dkd_name || 'Gece Mesaisi')}</b><small>${dkd_homeAsset?.dkd_bpm || 90} BPM · sakin merkez mix</small></div></div></div>
    <div class="dkd-v07p-track-list">${dkd_tracks}</div>
    <div class="dkd-v07p-setting-section dkd-audio"><div class="dkd-v07p-field"><div class="dkd-v07p-field-head"><label>Müzik seviyesi</label><span class="dkd-v07p-value">%${Math.round(this.dkd_state.dkd_settings.dkd_music*100)}</span></div><input type="range" min="0" max="100" value="${Math.round(this.dkd_state.dkd_settings.dkd_music*100)}" data-dkd-setting="dkd_music" aria-label="Müzik seviyesi"/></div></div>
  `);
};

if (typeof window !== 'undefined') {
  window.dkd_lastMileRuntimeV07 = {
    ...(window.dkd_lastMileRuntimeV07 || {}),
    dkd_devicePolish: true,
    dkd_riderSeatPivot: 'combined-rider-centroid',
    dkd_riderSeatOffset: dkd_v07PolishSeatOffset.toArray(),
    dkd_riderMeshIndexes: [22, 23, 24, 25, 26, 27],
    dkd_importedWheelAnimation: 'dual-rotating-hub-rigs',
    dkd_defaultCamera: 'chase',
    dkd_defaultCameraLabel: 'Takip / Standart',
    dkd_audioMaster: 'stereo PCM/WAV to 192k MP3 full mix',
    dkd_apkGeneratedForThisPolish: false,
  };
}

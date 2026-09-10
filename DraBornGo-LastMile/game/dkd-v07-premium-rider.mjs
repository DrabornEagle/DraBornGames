// DraBornGo / Last Mile v0.7 — clean premium courier model.
// City 50 intentionally bypasses every legacy combined scooter+rider loader.

const dkd_v07PremiumLegacyBike = dkd_Scene.prototype.dkd_buildBike;
const dkd_v07PremiumLegacyRender = dkd_Game.prototype.dkd_render;
const dkd_v07CameraMigration = 'dkd_v07ChaseDefaultApplied';

function dkd_v07Mat(dkd_color, dkd_roughness = .5, dkd_metalness = .12, dkd_extra = {}) {
  return new dkd_three.MeshStandardMaterial({ color: dkd_color, roughness: dkd_roughness, metalness: dkd_metalness, ...dkd_extra });
}

function dkd_v07Part(dkd_parent, dkd_geometry, dkd_material, dkd_position, dkd_rotation = [0, 0, 0], dkd_scale = [1, 1, 1], dkd_name = '') {
  const dkd_mesh = new dkd_three.Mesh(dkd_geometry, dkd_material);
  dkd_mesh.position.set(...dkd_position); dkd_mesh.rotation.set(...dkd_rotation); dkd_mesh.scale.set(...dkd_scale); dkd_mesh.name = dkd_name; dkd_parent.add(dkd_mesh);
  return dkd_mesh;
}

function dkd_v07Limb(dkd_parent, dkd_start, dkd_end, dkd_radius, dkd_material, dkd_name) {
  const dkd_from = new dkd_three.Vector3(...dkd_start); const dkd_to = new dkd_three.Vector3(...dkd_end);
  const dkd_vector = new dkd_three.Vector3().subVectors(dkd_to, dkd_from); const dkd_length = Math.max(.001, dkd_vector.length());
  const dkd_mesh = new dkd_three.Mesh(new dkd_three.CylinderGeometry(dkd_radius * .86, dkd_radius, dkd_length, 12), dkd_material);
  dkd_mesh.position.copy(dkd_from).add(dkd_to).multiplyScalar(.5); dkd_mesh.quaternion.setFromUnitVectors(new dkd_three.Vector3(0, 1, 0), dkd_vector.normalize()); dkd_mesh.name = dkd_name; dkd_parent.add(dkd_mesh);
  return dkd_mesh;
}

function dkd_v07Dispose(dkd_object) {
  if (!dkd_object) return; const dkd_geometries = new Set(); const dkd_materials = new Set();
  dkd_object.traverse(dkd_child => { if (!dkd_child.isMesh) return; if (dkd_child.geometry) dkd_geometries.add(dkd_child.geometry); for (const dkd_material of (Array.isArray(dkd_child.material) ? dkd_child.material : [dkd_child.material])) if (dkd_material) dkd_materials.add(dkd_material); });
  for (const dkd_geometry of dkd_geometries) dkd_geometry.dispose?.();
  for (const dkd_material of dkd_materials) { dkd_material.map?.dispose?.(); dkd_material.dispose?.(); }
}

function dkd_v07PremiumRider(dkd_scene) {
  const dkd_brand = dkd_scene.dkd_state.dkd_brand; const dkd_wearing = Array.isArray(dkd_scene.dkd_state.dkd_wearing) ? dkd_scene.dkd_state.dkd_wearing : [];
  const dkd_uniform = dkd_v07Mat(dkd_wearing.includes('dkd_raincoat') ? dkd_brand.dkd_color : dkd_brand.dkd_uniform, .46, .14);
  const dkd_textile = dkd_v07Mat('#17212b', .58, .12); const dkd_armor = dkd_v07Mat('#2c3946', .30, .48); const dkd_carbon = dkd_v07Mat('#101820', .24, .60);
  const dkd_glove = dkd_v07Mat('#111920', .48, .28); const dkd_boot = dkd_v07Mat('#0e151c', .62, .26); const dkd_accent = dkd_v07Mat(dkd_brand.dkd_color, .27, .44); const dkd_reflect = dkd_v07Mat('#dbe5dc', .25, .30);
  const dkd_visor = dkd_v07Mat('#24455a', .10, .65, { transparent: true, opacity: .84 });
  const dkd_rider = new dkd_three.Group(); dkd_rider.name = 'dkd_v07_premium_courier_rider';

  // Pelvis is centred on the saddle; knees, boots and hands are locked to real scooter contact points.
  dkd_v07Part(dkd_rider, new dkd_three.SphereGeometry(.23, 16, 10), dkd_textile, [0, 1.12, -.18], [0, 0, 0], [1.05, .72, .92], 'dkd_rider_pelvis');
  const dkd_torso = dkd_v07Part(dkd_rider, new dkd_three.BoxGeometry(.48, .58, .28), dkd_uniform, [0, 1.49, -.07], [.13, 0, 0], [1, 1, 1], 'dkd_rider_armored_jacket');
  dkd_v07Part(dkd_torso, new dkd_three.BoxGeometry(.34, .30, .035), dkd_armor, [0, .02, .158], [0, 0, 0], [1, 1, 1], 'dkd_rider_chest_armor');
  dkd_v07Part(dkd_torso, new dkd_three.BoxGeometry(.30, .035, .30), dkd_reflect, [0, -.14, -.01], [0, 0, 0], [1, 1, 1], 'dkd_rider_reflective_band');
  dkd_v07Part(dkd_rider, new dkd_three.SphereGeometry(.14, 14, 8), dkd_armor, [-.27, 1.68, -.01], [0, 0, 0], [1.15, .78, 1], 'dkd_rider_left_shoulder');
  dkd_v07Part(dkd_rider, new dkd_three.SphereGeometry(.14, 14, 8), dkd_armor, [.27, 1.68, -.01], [0, 0, 0], [1.15, .78, 1], 'dkd_rider_right_shoulder');

  for (const dkd_side of [-1, 1]) {
    const dkd_sideName = dkd_side < 0 ? 'left' : 'right'; const dkd_shoulder = [dkd_side * .25, 1.65, 0]; const dkd_elbow = [dkd_side * .38, 1.48, .31]; const dkd_hand = [dkd_side * .46, 1.39, .67];
    dkd_v07Limb(dkd_rider, dkd_shoulder, dkd_elbow, .082, dkd_uniform, `dkd_rider_${dkd_sideName}_upper_arm`); dkd_v07Limb(dkd_rider, dkd_elbow, dkd_hand, .068, dkd_textile, `dkd_rider_${dkd_sideName}_forearm`);
    dkd_v07Part(dkd_rider, new dkd_three.SphereGeometry(.09, 12, 8), dkd_glove, dkd_hand, [0, 0, 0], [1.05, .82, 1.18], `dkd_rider_${dkd_sideName}_glove`);
    const dkd_hip = [dkd_side * .17, 1.11, -.15]; const dkd_knee = [dkd_side * .27, .78, .25]; const dkd_ankle = [dkd_side * .25, .43, .43];
    dkd_v07Limb(dkd_rider, dkd_hip, dkd_knee, .105, dkd_textile, `dkd_rider_${dkd_sideName}_thigh`); dkd_v07Part(dkd_rider, new dkd_three.SphereGeometry(.12, 12, 8), dkd_armor, dkd_knee, [0, 0, 0], [1, .82, .72], `dkd_rider_${dkd_sideName}_knee_armor`); dkd_v07Limb(dkd_rider, dkd_knee, dkd_ankle, .078, dkd_textile, `dkd_rider_${dkd_sideName}_shin`);
    dkd_v07Part(dkd_rider, new dkd_three.BoxGeometry(.19, .15, .35), dkd_boot, [dkd_side * .25, .37, .50], [.04, 0, 0], [1, 1, 1], `dkd_rider_${dkd_sideName}_boot`);
    if (dkd_wearing.includes('dkd_pants')) dkd_v07Part(dkd_rider, new dkd_three.BoxGeometry(.035, .25, .06), dkd_accent, [dkd_side * .12, 1.00, -.31], [0, 0, 0], [1, 1, 1], `dkd_rider_${dkd_sideName}_pants_accent`);
    if (dkd_wearing.includes('dkd_gloves')) dkd_v07Part(dkd_rider, new dkd_three.BoxGeometry(.10, .035, .12), dkd_accent, dkd_hand, [0, 0, 0], [1, 1, 1], `dkd_rider_${dkd_sideName}_glove_accent`);
    if (dkd_wearing.includes('dkd_boots')) dkd_v07Part(dkd_rider, new dkd_three.BoxGeometry(.20, .035, .28), dkd_accent, [dkd_side * .25, .39, .52], [0, 0, 0], [1, 1, 1], `dkd_rider_${dkd_sideName}_boot_accent`);
  }

  dkd_v07Part(dkd_rider, new dkd_three.CylinderGeometry(.075, .085, .12, 12), dkd_textile, [0, 1.79, 0], [0, 0, 0], [1, 1, 1], 'dkd_rider_neck');
  const dkd_helmet = dkd_v07Part(dkd_rider, new dkd_three.SphereGeometry(.255, 24, 16), dkd_carbon, [0, 1.99, .04], [0, 0, 0], [1, 1.08, 1.08], 'dkd_rider_fullface_helmet');
  dkd_v07Part(dkd_helmet, new dkd_three.BoxGeometry(.40, .145, .055), dkd_visor, [0, .025, .245], [-.08, 0, 0], [1, 1, 1], 'dkd_rider_visor'); dkd_v07Part(dkd_helmet, new dkd_three.BoxGeometry(.30, .105, .13), dkd_carbon, [0, -.16, .19], [.12, 0, 0], [1, 1, 1], 'dkd_rider_chin_guard'); dkd_v07Part(dkd_helmet, new dkd_three.BoxGeometry(.055, .055, .39), dkd_accent, [0, .21, -.015], [0, 0, 0], [1, 1, 1], 'dkd_rider_helmet_accent');
  dkd_v07Part(dkd_rider, new dkd_three.BoxGeometry(.34, .43, .10), dkd_armor, [0, 1.48, -.29], [.13, 0, 0], [1, 1, 1], 'dkd_rider_back_protector'); dkd_v07Part(dkd_rider, new dkd_three.BoxGeometry(.24, .05, .025), dkd_reflect, [0, 1.53, -.348], [.13, 0, 0], [1, 1, 1], 'dkd_rider_back_reflector');
  if (dkd_wearing.includes('dkd_jacket')) dkd_v07Part(dkd_torso, new dkd_three.BoxGeometry(.40, .045, .035), dkd_reflect, [0, .12, .16], [0, 0, 0], [1, 1, 1], 'dkd_rider_jacket_reflector');
  return dkd_rider;
}

function dkd_v07PremiumStarter(dkd_scene) {
  dkd_scene.dkd_v03ModelLoadToken = (dkd_scene.dkd_v03ModelLoadToken || 0) + 1; dkd_scene.dkd_v061ModelLoadToken = (dkd_scene.dkd_v061ModelLoadToken || 0) + 1;
  if (dkd_scene.dkd_bike) { dkd_scene.dkd_scene.remove(dkd_scene.dkd_bike); dkd_v07Dispose(dkd_scene.dkd_bike); }
  const dkd_brand = dkd_scene.dkd_state.dkd_brand; const dkd_wearing = Array.isArray(dkd_scene.dkd_state.dkd_wearing) ? dkd_scene.dkd_state.dkd_wearing : [];
  const dkd_paint = dkd_v07Mat(dkd_brand.dkd_color, .26, .46); const dkd_dark = dkd_v07Mat('#18232d', .34, .44); const dkd_rubber = dkd_v07Mat('#10161c', .88, .04); const dkd_steel = dkd_v07Mat(dkd_wearing.includes('dkd_rims') ? '#c9ad58' : '#9aa8b4', .24, .82); const dkd_metal = dkd_v07Mat('#202b35', .36, .62);
  const dkd_bike = new dkd_three.Group(); dkd_bike.name = 'dkd_city50_v07_clean_scooter_premium_rider'; dkd_scene.dkd_bike = dkd_bike; dkd_scene.dkd_wheels = []; dkd_scene.dkd_bikeKind = 'scooter'; dkd_scene.dkd_scene.add(dkd_bike);
  for (const dkd_axle of [-1.02, 1.10]) { const dkd_wheel = new dkd_three.Group(); dkd_wheel.name = dkd_axle > 0 ? 'dkd_v07_front_wheel' : 'dkd_v07_rear_wheel'; dkd_wheel.position.set(0, .40, dkd_axle); dkd_bike.add(dkd_wheel); dkd_scene.dkd_wheels.push(dkd_wheel); dkd_v07Part(dkd_wheel, new dkd_three.TorusGeometry(.305, .102, 12, 30), dkd_rubber, [0, 0, 0], [0, Math.PI / 2, 0]); dkd_v07Part(dkd_wheel, new dkd_three.CylinderGeometry(.22, .22, .145, 18), dkd_steel, [0, 0, 0], [0, 0, Math.PI / 2]); dkd_v07Part(dkd_wheel, new dkd_three.CylinderGeometry(.08, .08, .17, 16), dkd_metal, [0, 0, 0], [0, 0, Math.PI / 2]); }
  dkd_v07Part(dkd_bike, new dkd_three.BoxGeometry(.46, .24, 1.42), dkd_metal, [0, .61, -.08]); dkd_v07Part(dkd_bike, new dkd_three.BoxGeometry(.54, .14, .90), dkd_dark, [0, .48, .18], [-.02, 0, 0]); dkd_v07Part(dkd_bike, new dkd_three.SphereGeometry(.42, 18, 12), dkd_paint, [0, .79, -.48], [0, 0, 0], [.86, .78, 1.18]);
  dkd_v07Part(dkd_bike, new dkd_three.BoxGeometry(.50, .12, .72), dkd_rubber, [0, 1.03, -.27], [-.03, 0, 0], [1, 1, 1], 'dkd_v07_saddle'); const dkd_front = dkd_v07Part(dkd_bike, new dkd_three.BoxGeometry(.58, .76, .28), dkd_paint, [0, .84, .77], [-.20, 0, 0]); dkd_v07Part(dkd_front, new dkd_three.BoxGeometry(.44, .20, .055), dkd_dark, [0, .25, .16]);
  dkd_v07Part(dkd_bike, new dkd_three.BoxGeometry(.62, .24, .40), dkd_paint, [0, 1.28, .78], [-.06, 0, 0]); dkd_v07Part(dkd_bike, new dkd_three.BoxGeometry(.40, .14, .035), dkd_v07Mat('#e8f2df', .16, .22), [0, 1.28, 1.005], [-.05, 0, 0]);
  for (const dkd_side of [-1, 1]) { const dkd_sideName = dkd_side < 0 ? 'left' : 'right'; dkd_v07Limb(dkd_bike, [dkd_side * .15, .66, .96], [dkd_side * .15, 1.25, .87], .035, dkd_steel, `dkd_v07_${dkd_sideName}_fork`); dkd_v07Part(dkd_bike, new dkd_three.CylinderGeometry(.035, .035, .42, 12), dkd_metal, [dkd_side * .31, 1.37, .71], [0, 0, Math.PI / 2]); dkd_v07Part(dkd_bike, new dkd_three.CylinderGeometry(.052, .052, .17, 12), dkd_rubber, [dkd_side * .49, 1.37, .71], [0, 0, Math.PI / 2]); dkd_v07Limb(dkd_bike, [dkd_side * .43, 1.43, .72], [dkd_side * .49, 1.60, .76], .017, dkd_steel, `dkd_v07_${dkd_sideName}_mirror_stem`); dkd_v07Part(dkd_bike, new dkd_three.SphereGeometry(.095, 12, 8), dkd_metal, [dkd_side * .50, 1.63, .77], [0, 0, 0], [1.28, .78, .34]); }
  dkd_v07Part(dkd_bike, new dkd_three.BoxGeometry(.44, .12, .045), new dkd_three.MeshBasicMaterial({ color: '#dc5d4d' }), [0, .83, -1.075]); dkd_v07Part(dkd_bike, new dkd_three.CylinderGeometry(dkd_wearing.includes('dkd_exhaust') ? .15 : .12, dkd_wearing.includes('dkd_exhaust') ? .15 : .12, dkd_wearing.includes('dkd_exhaust') ? .80 : .64, 14), dkd_steel, [.34, .54, -.76], [Math.PI / 2, 0, 0]);
  const dkd_cargo = dkd_v07Part(dkd_bike, new dkd_three.BoxGeometry(.70, .54, .62), dkd_paint, [0, 1.35, -.91], [0, 0, 0], [1, 1, 1], 'dkd_v07_cargo_case'); dkd_v07Part(dkd_cargo, new dkd_three.BoxGeometry(.58, .055, .56), dkd_metal, [0, .295, 0]); dkd_v07Part(dkd_cargo, new dkd_three.BoxGeometry(.48, .075, .025), dkd_v07Mat('#dce5d8', .28, .20), [0, .03, -.323]);
  const dkd_logo = dkd_scene.dkd_sign((dkd_scene.dkd_state.dkd_profile?.dkd_company || 'SON KİLOMETRE').toLocaleUpperCase('tr-TR'), .56, '#15262b', .20); dkd_logo.position.set(0, 1.34, -1.235); dkd_logo.rotation.y = Math.PI; dkd_bike.add(dkd_logo);
  if (dkd_wearing.includes('dkd_mount')) dkd_v07Part(dkd_bike, new dkd_three.BoxGeometry(.20, .035, .30), dkd_v07Mat('#78c8c2', .25, .34), [.22, 1.45, .61], [-.20, 0, 0]);
  if (dkd_wearing.includes('dkd_plate')) { const dkd_plate = dkd_scene.dkd_sign(dkd_brand.dkd_plate, .38, '#18232b', .11); dkd_plate.material.color.set('#f6f1d9'); dkd_plate.position.set(0, .67, -1.10); dkd_plate.rotation.y = Math.PI; dkd_bike.add(dkd_plate); }
  dkd_bike.add(dkd_v07PremiumRider(dkd_scene));
  if (dkd_scene.dkd_ghost) { dkd_scene.dkd_scene.remove(dkd_scene.dkd_ghost); dkd_v07Dispose(dkd_scene.dkd_ghost); const dkd_ghost = dkd_bike.clone(true); dkd_ghost.traverse(dkd_child => { if (!dkd_child.isMesh) return; dkd_child.geometry = dkd_child.geometry.clone(); dkd_child.material = new dkd_three.MeshBasicMaterial({ color: '#65d5d0', transparent: true, opacity: .23, depthWrite: false }); }); dkd_ghost.visible = false; dkd_scene.dkd_ghost = dkd_ghost; dkd_scene.dkd_scene.add(dkd_ghost); }
  return dkd_bike;
}

dkd_Scene.prototype.dkd_buildBike = function dkd_v07PremiumBuildBike(dkd_kind = 'scooter') {
  if (dkd_kind === 'scooter' && this.dkd_state?.dkd_equipped === 'dkd_city50') return dkd_v07PremiumStarter(this);
  return dkd_v07PremiumLegacyBike.call(this, dkd_kind);
};

function dkd_v07ReadableSettings() {
  if (document.getElementById('dkd-v07-readable-settings-style')) return; const dkd_style = document.createElement('style'); dkd_style.id = 'dkd-v07-readable-settings-style';
  dkd_style.textContent = `.dkd-v07-status small{font-size:11px!important}.dkd-v07-status-badge small{font-size:10px!important}.dkd-v07-section-head small{font-size:11px!important}.dkd-v07-option b{font-size:13px!important}.dkd-v07-option small{font-size:10px!important;line-height:1.35!important}.dkd-v07-row small{font-size:11px!important;line-height:1.45!important}.dkd-v07-switch{font-size:11px!important}.dkd-v07-slider label{font-size:12px!important}.dkd-v07-camera-note{font-size:11px!important;line-height:1.5!important}.dkd-v07-music-card small{font-size:11px!important}.dkd-v07-music-card strong{font-size:10px!important}`;
  document.head.appendChild(dkd_style);
}
dkd_v07ReadableSettings();

dkd_Game.prototype.dkd_render = function dkd_v07PremiumRender(dkd_page, dkd_arg = null) {
  const dkd_settings = this.dkd_state?.dkd_settings;
  if (dkd_settings && dkd_settings[dkd_v07CameraMigration] !== true) { dkd_settings.dkd_camera = 'chase'; dkd_settings[dkd_v07CameraMigration] = true; try { this.dkd_save(); } catch {} }
  const dkd_result = dkd_v07PremiumLegacyRender.call(this, dkd_page, dkd_arg); const dkd_note = this.dkd_root?.querySelector?.('.dkd-v07-camera-note');
  if (dkd_note) dkd_note.innerHTML = '<b>Başlangıç kamera açısı: TAKİP / STANDART.</b> v0.7 güncellemesinde ilk açılışta bu açı uygulanır; daha sonra yaptığın kamera seçimi kaydedilir.';
  return dkd_result;
};

window.dkd_lastMileV07PremiumRider = { dkd_model: 'procedural-independent-premium-rider', dkd_oldCombinedRider: 'bypassed', dkd_pose: 'city50-saddle-seated', dkd_cameraDefault: 'chase', dkd_settingsText: 'readability-plus' };

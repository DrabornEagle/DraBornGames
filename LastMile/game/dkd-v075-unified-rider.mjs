// DraBornGo / Last Mile v0.7.5 — one premium courier rider across every garage vehicle.
// The City 50 rider is the canonical rider. Legacy synthetic riders are removed before
// the same premium rider is attached to upgraded scooters, motorcycles, cars and vans.
const dkd_v075UnifiedRiderPreviousBuild = dkd_Scene.prototype.dkd_buildBike;

function dkd_v075UnifiedDispose(dkd_object) {
  if (!dkd_object) return;
  const dkd_geometries = new Set();
  const dkd_materials = new Set();
  dkd_object.traverse?.(dkd_child => {
    if (!dkd_child?.isMesh) return;
    if (dkd_child.geometry) dkd_geometries.add(dkd_child.geometry);
    const dkd_list = Array.isArray(dkd_child.material) ? dkd_child.material : [dkd_child.material];
    for (const dkd_material of dkd_list) if (dkd_material) dkd_materials.add(dkd_material);
  });
  for (const dkd_geometry of dkd_geometries) dkd_geometry.dispose?.();
  for (const dkd_material of dkd_materials) { dkd_material.map?.dispose?.(); dkd_material.dispose?.(); }
}

function dkd_v075RemoveLegacyRiderTail(dkd_scene, dkd_bike) {
  if (!dkd_bike?.children?.length) return false;
  const dkd_logoIndex = dkd_bike.children.findIndex(dkd_child => {
    const dkd_position = dkd_child?.position;
    return dkd_position && Math.abs(dkd_position.x) < .05 && Math.abs(dkd_position.y - 1.4) < .09 && Math.abs(dkd_position.z + 1.27) < .09;
  });
  if (dkd_logoIndex < 0) return false;
  const dkd_tail = dkd_bike.children.slice(dkd_logoIndex + 1);
  for (const dkd_child of dkd_tail) { dkd_bike.remove(dkd_child); dkd_v075UnifiedDispose(dkd_child); }
  return dkd_tail.length > 0;
}

function dkd_v075RestoreVehicleAccessories(dkd_scene, dkd_bike, dkd_kind) {
  const dkd_wearing = Array.isArray(dkd_scene.dkd_state?.dkd_wearing) ? dkd_scene.dkd_state.dkd_wearing : [];
  const dkd_brand = dkd_scene.dkd_state?.dkd_brand || {};
  if (dkd_wearing.includes('dkd_mount')) {
    const dkd_mount = new dkd_three.Mesh(new dkd_three.BoxGeometry(.20, .033, .31), dkd_v07Mat('#83d7cf', .25, .18));
    dkd_mount.position.set(.22, 1.49, .61); dkd_mount.name = 'dkd_v075_phone_mount'; dkd_bike.add(dkd_mount);
  }
  if (dkd_wearing.includes('dkd_plate') && dkd_brand.dkd_plate) {
    const dkd_plate = dkd_scene.dkd_sign(dkd_brand.dkd_plate, .38, '#18232b', .11);
    dkd_plate.material.color?.set?.('#f6f1d9'); dkd_plate.position.set(0, .70, -1.09); dkd_plate.rotation.y = Math.PI; dkd_plate.name = 'dkd_v075_vehicle_plate'; dkd_bike.add(dkd_plate);
  }
  if (dkd_kind === 'motorcycle') {
    const dkd_tank = new dkd_three.Mesh(new dkd_three.SphereGeometry(.30, 16, 10), dkd_v07Mat(dkd_brand.dkd_color || '#e4ff5e', .28, .45));
    dkd_tank.scale.set(1, .65, 1.6); dkd_tank.position.set(0, .96, .28); dkd_tank.name = 'dkd_v075_motorcycle_tank'; dkd_bike.add(dkd_tank);
  }
}

function dkd_v075AttachCanonicalRider(dkd_scene, dkd_bike, dkd_kind) {
  if (!dkd_bike || typeof dkd_v07PremiumRider !== 'function') return dkd_bike;
  for (const dkd_existing of [...dkd_bike.children]) {
    if (String(dkd_existing?.name || '').includes('dkd_v075_unified_courier')) { dkd_bike.remove(dkd_existing); dkd_v075UnifiedDispose(dkd_existing); }
  }
  const dkd_rider = dkd_v07PremiumRider(dkd_scene);
  dkd_rider.name = `dkd_v075_unified_courier_${dkd_kind}`;
  if (dkd_kind === 'car' || dkd_kind === 'van') {
    dkd_rider.scale.setScalar(dkd_kind === 'van' ? .76 : .72);
    dkd_rider.position.set(0, .25, .18);
  }
  dkd_bike.add(dkd_rider);
  return dkd_bike;
}

dkd_Scene.prototype.dkd_buildBike = function dkd_v075UnifiedRiderBuild(dkd_kind = 'scooter') {
  const dkd_bike = dkd_v075UnifiedRiderPreviousBuild.call(this, dkd_kind);
  if (!dkd_bike) return dkd_bike;

  // City 50 already contains the canonical v0.7 rider and never receives a second copy.
  if (String(dkd_bike.name || '').includes('dkd_city50_v07_clean_scooter_premium_rider')) return dkd_bike;

  if (dkd_kind !== 'car' && dkd_kind !== 'van') {
    dkd_v075RemoveLegacyRiderTail(this, dkd_bike);
    dkd_v075RestoreVehicleAccessories(this, dkd_bike, dkd_kind);
  }
  dkd_v075AttachCanonicalRider(this, dkd_bike, dkd_kind);
  return dkd_bike;
};

window.dkd_lastMileV075UnifiedRider = {
  dkd_city50CanonicalRider: true,
  dkd_removeLegacyRider: true,
  dkd_allGarageVehicles: true,
  dkd_androidWebShared: true,
};

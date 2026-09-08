// DraBornGo / Last Mile v0.3 — re-uploaded scooter + rider final runtime.
// This file is loaded last. The model data in dkd-v03-model-0..8 is generated
// from DraBorn_LastMile_Scooter_plus_Rider_v0_1.glb and the rider MTL colours.
// It intentionally uses the already bounds-checked DK31 decoder from v0.3.

// New installs start at High quality. Existing saves are migrated once, then
// later user changes remain untouched.
const dkd_v03_uploadedBaseDefaultState = dkd_defaultState;
dkd_defaultState = function() {
  const dkd_state = dkd_v03_uploadedBaseDefaultState();
  dkd_state.dkd_settings.dkd_quality = 'high';
  dkd_state.dkd_settings.dkd_uploadedHighQualityApplied = true;
  return dkd_state;
};

const dkd_v03_uploadedBaseRestoreState = dkd_restoreState;
dkd_restoreState = function(dkd_raw) {
  const dkd_state = dkd_v03_uploadedBaseRestoreState(dkd_raw);
  if (dkd_raw?.dkd_settings?.dkd_uploadedHighQualityApplied !== true) {
    dkd_state.dkd_settings.dkd_quality = 'high';
  }
  dkd_state.dkd_settings.dkd_uploadedHighQualityApplied = true;
  return dkd_state;
};

function dkd_v03_uploadedDisposeBike(dkd_bike) {
  if (!dkd_bike) return;
  const dkd_materials = new Set();
  dkd_bike.traverse(dkd_object => {
    if (!dkd_object.isMesh) return;
    dkd_object.geometry?.dispose?.();
    if (Array.isArray(dkd_object.material)) dkd_object.material.forEach(dkd_material => dkd_materials.add(dkd_material));
    else if (dkd_object.material) dkd_materials.add(dkd_object.material);
  });
  for (const dkd_material of dkd_materials) {
    dkd_material.map?.dispose?.();
    dkd_material.dispose?.();
  }
}

// Reactivate the real model after the previous safe procedural fallback. The
// uploaded GLB uses X forward, Y right, Z up; the packed DK31 data is already
// converted to Three.js/game coordinates (X right, Y up, Z forward).
const dkd_v03_uploadedFallbackBuildBike = dkd_Scene.prototype.dkd_buildBike;
dkd_Scene.prototype.dkd_buildBike = function(dkd_kind = 'scooter') {
  if (dkd_kind !== 'scooter' || this.dkd_state?.dkd_equipped !== 'dkd_city50') {
    return dkd_v03_uploadedFallbackBuildBike.call(this, dkd_kind);
  }
  try {
    const dkd_model = dkd_v03_readScooterRider();
    dkd_model.name = 'dkd_uploaded_scooter_rider_v0_1';
    dkd_model.userData.dkd_source = 'DraBorn_LastMile_Scooter_plus_Rider_v0_1.glb';
    dkd_model.userData.dkd_vertices = 5942;
    dkd_model.userData.dkd_triangles = 11244;
    dkd_model.scale.setScalar(1.16);

    if (this.dkd_bike) {
      this.dkd_scene.remove(this.dkd_bike);
      dkd_v03_uploadedDisposeBike(this.dkd_bike);
    }
    this.dkd_bike = new dkd_three.Group();
    this.dkd_bike.name = 'dkd_uploaded_starter_vehicle';
    this.dkd_bike.add(dkd_model);
    this.dkd_scene.add(this.dkd_bike);
    this.dkd_wheels = [];
    this.dkd_bikeKind = dkd_kind;
    return this.dkd_bike;
  } catch (dkd_error) {
    console.warn('Yüklenen scooter + sürücü modeli açılamadı; güvenli modele dönülüyor.', dkd_error);
    return dkd_v03_uploadedFallbackBuildBike.call(this, dkd_kind);
  }
};

// Remove the old "İlk garajın" helper text from the home identity area while
// retaining the level/company progress chips around it.
const dkd_v03_uploadedBaseHomeView = dkd_Game.prototype.dkd_view_home;
dkd_Game.prototype.dkd_view_home = function(...dkd_args) {
  return dkd_v03_uploadedBaseHomeView.apply(this, dkd_args)
    .replace(/<small[^>]*>\s*İlk garajın\s*<\/small>/g, '')
    .replace(/İlk garajın/g, '');
};

// Runtime marker used by CI to make sure the real uploaded model wins over the
// earlier procedural safety override in the final Expo Go bundle.
const dkd_v03_uploadedModelActive = true;

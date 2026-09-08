// DraBornGo / Last Mile v0.3 visual/input hotfix.
// Loaded last so the corrections below are authoritative on Expo Go/WebView.

// Route arrows: ShapeGeometry is authored with the tip on local +Y. Rotating
// +90 degrees around X maps +Y to world +Z; Y rotation can then follow the
// actual start -> end road heading. The previous -90 degree rotation mapped
// the tip to -Z and made every arrow point backwards.
dkd_Scene.prototype.dkd_setRoute = function(dkd_run) {
  for (const dkd_child of [...this.dkd_navigation.children]) {
    this.dkd_navigation.remove(dkd_child);
    dkd_child.geometry?.dispose?.();
    if (Array.isArray(dkd_child.material)) dkd_child.material.forEach(dkd_material => dkd_material.dispose?.());
    else dkd_child.material?.dispose?.();
  }

  const dkd_points = dkd_run.dkd_route.dkd_nodes.map(dkd_id => {
    const dkd_point = this.dkd_graph.dkd_points[dkd_id];
    return new dkd_three.Vector3(dkd_point[0], .19, dkd_point[1]);
  });
  if (dkd_points.length < 2) return;

  this.dkd_navigation.add(new dkd_three.Line(
    new dkd_three.BufferGeometry().setFromPoints(dkd_points),
    new dkd_three.LineBasicMaterial({ color: '#e4ff5e', transparent: true, opacity: .74 })
  ));

  const dkd_shape = new dkd_three.Shape();
  dkd_shape.moveTo(0, .95);
  dkd_shape.lineTo(-.58, -.42);
  dkd_shape.lineTo(0, -.14);
  dkd_shape.lineTo(.58, -.42);
  dkd_shape.closePath();
  const dkd_arrowGeometry = new dkd_three.ShapeGeometry(dkd_shape);
  dkd_arrowGeometry.rotateX(Math.PI / 2);

  const dkd_arrows = [];
  for (let dkd_index = 1; dkd_index < dkd_points.length; dkd_index++) {
    const dkd_start = dkd_points[dkd_index - 1];
    const dkd_end = dkd_points[dkd_index];
    const dkd_dx = dkd_end.x - dkd_start.x;
    const dkd_dz = dkd_end.z - dkd_start.z;
    const dkd_length = Math.hypot(dkd_dx, dkd_dz);
    if (dkd_length < .1) continue;
    const dkd_heading = Math.atan2(dkd_dx, dkd_dz);
    for (let dkd_step = 5; dkd_step < dkd_length; dkd_step += 12) {
      const dkd_ratio = dkd_step / dkd_length;
      dkd_arrows.push({
        dkd_position: [dkd_start.x + dkd_dx * dkd_ratio, .205, dkd_start.z + dkd_dz * dkd_ratio],
        dkd_rotation: [0, dkd_heading, 0],
        dkd_scale: [.92, 1, 1.22]
      });
    }
  }

  if (dkd_arrows.length) this.dkd_instances(
    this.dkd_navigation,
    dkd_arrowGeometry,
    new dkd_three.MeshBasicMaterial({ color: '#e4ff5e', side: dkd_three.DoubleSide, transparent: true, opacity: .94 }),
    dkd_arrows
  );
  else dkd_arrowGeometry.dispose();

  const dkd_target = this.dkd_graph.dkd_points[dkd_run.dkd_order.dkd_to];
  if (dkd_target && this.dkd_marker) this.dkd_marker.position.set(dkd_target[0], .2, dkd_target[1]);
};

// Keep the yellow company name fully inside the centre camera frame. This also
// applies after brand/company refreshes.
const dkd_v03_hotfixBuildHub = dkd_Scene.prototype.dkd_buildHub;
dkd_Scene.prototype.dkd_buildHub = function(...dkd_args) {
  const dkd_result = dkd_v03_hotfixBuildHub.apply(this, dkd_args);
  if (this.dkd_companySign) this.dkd_companySign.position.x = -3.15;
  return dkd_result;
};

const dkd_v03_hotfixRefreshBrand = dkd_Scene.prototype.dkd_refreshBrand;
dkd_Scene.prototype.dkd_refreshBrand = function(...dkd_args) {
  const dkd_result = dkd_v03_hotfixRefreshBrand.apply(this, dkd_args);
  if (this.dkd_companySign) this.dkd_companySign.position.x = -3.15;
  return dkd_result;
};

// WebView touch events can land on the HTML HUD instead of the canvas. Listen
// at document capture level so a two-finger gesture anywhere over the 3D centre
// reliably changes the garage camera distance without affecting one-finger UI.
const dkd_v03_hotfixBind = dkd_Game.prototype.dkd_bind;
dkd_Game.prototype.dkd_bind = function(...dkd_args) {
  const dkd_result = dkd_v03_hotfixBind.apply(this, dkd_args);
  let dkd_startDistance = 0;
  let dkd_startZoom = this.dkd_scene.dkd_v03GarageZoom ?? 1.16;

  const dkd_touchDistance = dkd_touches => {
    if (!dkd_touches || dkd_touches.length < 2) return 0;
    return Math.hypot(
      dkd_touches[0].clientX - dkd_touches[1].clientX,
      dkd_touches[0].clientY - dkd_touches[1].clientY
    );
  };

  document.addEventListener('touchstart', dkd_event => {
    if (this.dkd_scene.dkd_mode !== 'garage' || dkd_event.touches.length !== 2) return;
    dkd_startDistance = dkd_touchDistance(dkd_event.touches);
    dkd_startZoom = this.dkd_scene.dkd_v03GarageZoom ?? 1.16;
    if (dkd_startDistance > 8) dkd_event.preventDefault();
  }, { passive: false, capture: true });

  document.addEventListener('touchmove', dkd_event => {
    if (this.dkd_scene.dkd_mode !== 'garage' || dkd_event.touches.length !== 2 || dkd_startDistance <= 8) return;
    const dkd_nowDistance = dkd_touchDistance(dkd_event.touches);
    if (dkd_nowDistance <= 8) return;
    this.dkd_scene.dkd_v03GarageZoom = dkd_clamp(dkd_startZoom * dkd_startDistance / dkd_nowDistance, .62, 1.90);
    dkd_event.preventDefault();
  }, { passive: false, capture: true });

  const dkd_endPinch = dkd_event => {
    if (dkd_event.touches?.length < 2) dkd_startDistance = 0;
  };
  document.addEventListener('touchend', dkd_endPinch, { capture: true });
  document.addEventListener('touchcancel', dkd_endPinch, { capture: true });
  return dkd_result;
};

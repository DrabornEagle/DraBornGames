// DraBornGo / Last Mile v0.3 runtime hardening.
// The originally uploaded binary scooter+rider stream was damaged while being
// split for Git storage. v0.3 therefore uses the deterministic in-engine model
// as the release model and adds a richer starter-scooter visual pass on top.
// This removes the corrupted binary from the runtime path while keeping older
// saves, vehicle upgrades and wheel animation fully compatible.

function dkd_v03_addStarterScooterDetails(dkd_scene) {
  const dkd_bike = dkd_scene?.dkd_bike;
  if (!dkd_bike) return;

  dkd_bike.name = 'dkd_v03_safe_model';
  const dkd_brand = dkd_scene.dkd_state?.dkd_brand || {};
  const dkd_brandColor = dkd_brand.dkd_color || '#35c7bf';
  const dkd_uniformColor = dkd_brand.dkd_uniform || '#314557';
  const dkd_accent = dkd_scene.dkd_material(dkd_brandColor, .24, .52);
  const dkd_uniform = dkd_scene.dkd_material(dkd_uniformColor, .68, .08);
  const dkd_dark = dkd_scene.dkd_material('#17212b', .48, .42);
  const dkd_metal = dkd_scene.dkd_material('#9aa8b6', .24, .78);
  const dkd_teal = dkd_scene.dkd_material('#43d7c8', .30, .36);
  const dkd_warm = dkd_scene.dkd_material('#ffd166', .38, .26);
  const dkd_white = new dkd_three.MeshBasicMaterial({ color: '#eef7ef' });
  const dkd_red = new dkd_three.MeshBasicMaterial({ color: '#ef6a55' });

  // Modern layered bodywork and floorboard.
  dkd_scene.dkd_box(dkd_bike, [.68, .08, 1.06], [0, .56, -.05], dkd_dark);
  dkd_scene.dkd_box(dkd_bike, [.56, .14, .82], [0, .76, .16], dkd_accent);
  dkd_scene.dkd_box(dkd_bike, [.46, .06, .70], [0, .93, -.42], dkd_dark);
  dkd_scene.dkd_box(dkd_bike, [.62, .10, .44], [0, 1.18, .75], dkd_accent);

  // Windscreen, LED headlight and daytime-running-light strips.
  const dkd_windscreen = new dkd_three.Mesh(
    new dkd_three.BoxGeometry(.54, .40, .025),
    new dkd_three.MeshPhysicalMaterial({
      color: '#9ed8e4', transparent: true, opacity: .28,
      roughness: .10, metalness: .05, depthWrite: false
    })
  );
  dkd_windscreen.position.set(0, 1.58, .73);
  dkd_windscreen.rotation.x = -.30;
  dkd_bike.add(dkd_windscreen);
  dkd_scene.dkd_box(dkd_bike, [.44, .12, .035], [0, 1.36, 1.015], dkd_white);
  for (const dkd_side of [-1, 1]) {
    dkd_scene.dkd_box(dkd_bike, [.055, .28, .035], [dkd_side * .27, 1.24, .985], dkd_teal, dkd_side * -.08);
    dkd_scene.dkd_box(dkd_bike, [.035, .13, .62], [dkd_side * .315, .84, -.30], dkd_accent);
    dkd_scene.dkd_cylinder(dkd_bike, .023, .72, [dkd_side * .39, .70, .02], dkd_metal, [Math.PI / 2, 0, 0]);
  }

  // Premium rear box details and safety reflectors.
  dkd_scene.dkd_box(dkd_bike, [.72, .08, .72], [0, 1.73, -.92], dkd_dark);
  dkd_scene.dkd_box(dkd_bike, [.52, .06, .025], [0, 1.49, -1.275], dkd_white);
  dkd_scene.dkd_box(dkd_bike, [.38, .08, .028], [0, 1.35, -1.285], dkd_red);
  for (const dkd_side of [-1, 1]) dkd_scene.dkd_box(dkd_bike, [.10, .055, .03], [dkd_side * .27, 1.64, -1.286], dkd_warm);

  // Rider: clearer high-visibility vest, helmet band and shoulder accents.
  dkd_scene.dkd_box(dkd_bike, [.42, .34, .025], [0, 1.43, -.325], dkd_uniform);
  dkd_scene.dkd_box(dkd_bike, [.30, .055, .027], [0, 1.52, -.341], dkd_white);
  dkd_scene.dkd_box(dkd_bike, [.30, .045, .027], [0, 1.36, -.341], dkd_teal);
  for (const dkd_side of [-1, 1]) dkd_scene.dkd_box(dkd_bike, [.10, .18, .025], [dkd_side * .19, 1.44, -.339], dkd_accent, dkd_side * -.08);

  const dkd_helmetBand = new dkd_three.Mesh(
    new dkd_three.TorusGeometry(.255, .022, 8, 30),
    dkd_accent
  );
  dkd_helmetBand.position.set(0, 1.92, -.03);
  dkd_helmetBand.rotation.x = Math.PI / 2;
  dkd_bike.add(dkd_helmetBand);

  // Small phone/navigation mount, mirrors and front fender accents.
  dkd_scene.dkd_box(dkd_bike, [.18, .035, .26], [.20, 1.51, .60], dkd_dark);
  dkd_scene.dkd_box(dkd_bike, [.145, .025, .21], [.20, 1.535, .60], dkd_teal);
  for (const dkd_side of [-1, 1]) {
    dkd_scene.dkd_cylinder(dkd_bike, .015, .30, [dkd_side * .42, 1.54, .78], dkd_metal, [0, 0, -.30 * dkd_side]);
    const dkd_mirror = new dkd_three.Mesh(new dkd_three.SphereGeometry(.09, 12, 8), dkd_dark);
    dkd_mirror.scale.set(1.4, .75, .35);
    dkd_mirror.position.set(dkd_side * .50, 1.68, .80);
    dkd_bike.add(dkd_mirror);
  }

  // A tiny under-seat accent makes the starter scooter easier to read at the
  // high default camera without adding expensive textures or external assets.
  dkd_scene.dkd_box(dkd_bike, [.48, .035, .54], [0, .98, -.55], dkd_teal);
}

// Use the proven procedural vehicle builder for every vehicle. Only the starter
// scooter receives the v0.3 detail pass. This final override is loaded after the
// legacy uploaded-model compatibility patch, so the damaged binary parser is
// never executed in a normal game session.
const dkd_v03_baseBuildBikeFinal = dkd_v03_baseBuildBike;
dkd_Scene.prototype.dkd_buildBike = function(dkd_kind = 'scooter') {
  const dkd_result = dkd_v03_baseBuildBikeFinal.call(this, dkd_kind);
  if (dkd_kind === 'scooter' && this.dkd_state?.dkd_equipped === 'dkd_city50') dkd_v03_addStarterScooterDetails(this);
  return this.dkd_bike || dkd_result;
};

// Build the arrow geometry flat in XZ first, then rotate instances only around
// world Y. This avoids Euler-axis coupling that made some arrows point sideways
// or backwards on curved streets.
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
    new dkd_three.LineBasicMaterial({ color: '#e4ff5e', transparent: true, opacity: .72 })
  ));

  const dkd_shape = new dkd_three.Shape();
  dkd_shape.moveTo(0, .95);
  dkd_shape.lineTo(-.58, -.42);
  dkd_shape.lineTo(0, -.14);
  dkd_shape.lineTo(.58, -.42);
  dkd_shape.closePath();
  const dkd_arrowGeometry = new dkd_three.ShapeGeometry(dkd_shape);
  dkd_arrowGeometry.rotateX(-Math.PI / 2);

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
    new dkd_three.MeshBasicMaterial({ color: '#e4ff5e', side: dkd_three.DoubleSide, transparent: true, opacity: .92 }),
    dkd_arrows
  );
  else dkd_arrowGeometry.dispose();
};

// CI marker: starter vehicle and navigation runtime are deterministic and local.

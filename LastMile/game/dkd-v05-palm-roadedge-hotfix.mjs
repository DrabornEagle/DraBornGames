// DraBornGo / Last Mile v0.5 palm + road-edge safety hotfix.
// Loaded last. Re-centres the company sign, replaces the previous dense roadside detail
// with road-safe city furniture, and adds multiple tree silhouettes including palms.

const dkd_v05PalmFixPrevious = {
  dkd_sceneBuildCity: dkd_Scene.prototype.dkd_buildCity,
  dkd_sceneBuildHub: dkd_Scene.prototype.dkd_buildHub,
  dkd_sceneRefreshBrand: dkd_Scene.prototype.dkd_refreshBrand,
};

function dkd_v05PalmFixPinCompanySign(dkd_scene) {
  if (!dkd_scene?.dkd_companySign) return;
  // -6.25 clipped the left-side logo. -4.40 keeps the sign on the left wall while
  // leaving enough screen space for the emblem and full company name.
  dkd_scene.dkd_companySign.position.x = -4.40;
  dkd_scene.dkd_companySign.position.y = 6.72;
  dkd_scene.dkd_companySign.position.z = -6.72;
}

dkd_Scene.prototype.dkd_buildHub = function dkd_v05PalmFixBuildHub() {
  const dkd_result = dkd_v05PalmFixPrevious.dkd_sceneBuildHub.call(this);
  dkd_v05PalmFixPinCompanySign(this);
  return dkd_result;
};

dkd_Scene.prototype.dkd_refreshBrand = function dkd_v05PalmFixRefreshBrand(dkd_kind = this.dkd_bikeKind) {
  const dkd_result = dkd_v05PalmFixPrevious.dkd_sceneRefreshBrand.call(this, dkd_kind);
  dkd_v05PalmFixPinCompanySign(this);
  return dkd_result;
};

function dkd_v05PalmFixDisposeGroup(dkd_group) {
  if (!dkd_group) return;
  dkd_group.traverse(dkd_object => {
    try { dkd_object.geometry?.dispose?.(); } catch {}
    try {
      if (Array.isArray(dkd_object.material)) dkd_object.material.forEach(dkd_material => dkd_material?.dispose?.());
      else dkd_object.material?.dispose?.();
    } catch {}
  });
  try { dkd_group.parent?.remove(dkd_group); } catch {}
}

function dkd_v05PalmFixInstances(dkd_scene, dkd_parent, dkd_geometry, dkd_material, dkd_items) {
  if (!Array.isArray(dkd_items) || !dkd_items.length) return null;
  return dkd_scene.dkd_instances(dkd_parent, dkd_geometry, dkd_material, dkd_items);
}

function dkd_v05PalmFixPoint(dkd_start, dkd_heading, dkd_step, dkd_side, dkd_offset) {
  const dkd_centerX = dkd_start[0] + Math.sin(dkd_heading) * dkd_step;
  const dkd_centerZ = dkd_start[1] + Math.cos(dkd_heading) * dkd_step;
  return [
    dkd_centerX + Math.cos(dkd_heading) * dkd_offset * dkd_side,
    dkd_centerZ - Math.sin(dkd_heading) * dkd_offset * dkd_side,
  ];
}

function dkd_v05PalmFixSafeRoadside(dkd_scene, dkd_start, dkd_heading, dkd_step, dkd_side, dkd_edge, dkd_extra = 0) {
  // A candidate can be outside its own road but accidentally land on another crossing road.
  // Always validate against the nearest road after positioning and move farther out if needed.
  const dkd_distances = [5.4 + dkd_extra, 7.4 + dkd_extra, 9.8 + dkd_extra];
  for (const dkd_distanceOffset of dkd_distances) {
    const dkd_offset = dkd_edge.dkd_width / 2 + dkd_distanceOffset;
    const [dkd_x, dkd_z] = dkd_v05PalmFixPoint(dkd_start, dkd_heading, dkd_step, dkd_side, dkd_offset);
    const dkd_near = dkd_nearestRoad(dkd_scene.dkd_graph, [dkd_x, dkd_z]);
    if (!dkd_near?.dkd_edge) continue;
    const dkd_clearance = dkd_near.dkd_edge.dkd_width / 2 + 3.25;
    if (dkd_near.dkd_distance >= dkd_clearance) return [dkd_x, dkd_z];
  }
  return null;
}

function dkd_v05PalmFixPushTree(dkd_scene, dkd_collections, dkd_random, dkd_position, dkd_heading) {
  const [dkd_x, dkd_z] = dkd_position;
  const dkd_typeRoll = dkd_random();

  if (dkd_typeRoll < .36) {
    const dkd_height = 4.6 + dkd_random() * 1.8;
    const dkd_radius = 1.55 + dkd_random() * .65;
    dkd_collections.dkd_deciduousTrunks.push({ dkd_position: [dkd_x, dkd_height * .39, dkd_z], dkd_scale: [.34, dkd_height * .78, .34] });
    dkd_collections.dkd_deciduousCrowns.push({ dkd_position: [dkd_x, dkd_height + 1.15, dkd_z], dkd_scale: [dkd_radius, 2.15 + dkd_random() * .7, dkd_radius], dkd_color: ['#315b48','#3a6b50','#477553','#2f6348'][Math.floor(dkd_random() * 4)] });
    return;
  }

  if (dkd_typeRoll < .61) {
    const dkd_height = 5.2 + dkd_random() * 2.0;
    dkd_collections.dkd_slimTrunks.push({ dkd_position: [dkd_x, dkd_height * .42, dkd_z], dkd_scale: [.28, dkd_height * .84, .28] });
    dkd_collections.dkd_slimCrowns.push({ dkd_position: [dkd_x, dkd_height + 1.4, dkd_z], dkd_scale: [1.15 + dkd_random() * .35, 3.0 + dkd_random() * 1.1, 1.15 + dkd_random() * .35], dkd_color: ['#365f47','#446e4f','#507855'][Math.floor(dkd_random() * 3)] });
    return;
  }

  if (dkd_typeRoll < .82) {
    const dkd_height = 4.8 + dkd_random() * 2.2;
    dkd_collections.dkd_pineTrunks.push({ dkd_position: [dkd_x, dkd_height * .37, dkd_z], dkd_scale: [.30, dkd_height * .74, .30] });
    dkd_collections.dkd_pineCrowns.push({ dkd_position: [dkd_x, dkd_height + 1.3, dkd_z], dkd_scale: [1.65 + dkd_random() * .45, 4.4 + dkd_random() * 1.4, 1.65 + dkd_random() * .45], dkd_color: ['#274c3d','#315845','#3c644c'][Math.floor(dkd_random() * 3)] });
    return;
  }

  // Palm variety: narrow trunk and a compact four-frond crown. Kept well off the carriageway.
  const dkd_height = 6.0 + dkd_random() * 2.0;
  const dkd_topY = dkd_height + .72;
  dkd_collections.dkd_palmTrunks.push({ dkd_position: [dkd_x, dkd_height * .5, dkd_z], dkd_scale: [.28, dkd_height, .28], dkd_color: dkd_random() > .5 ? '#7b674c' : '#6e5a42' });
  dkd_collections.dkd_palmCores.push({ dkd_position: [dkd_x, dkd_topY, dkd_z], dkd_scale: [.78, .55, .78], dkd_color: '#3f7650' });
  for (let dkd_frondIndex = 0; dkd_frondIndex < 5; dkd_frondIndex++) {
    const dkd_angleValue = dkd_heading + (Math.PI * 2 * dkd_frondIndex / 5) + dkd_random() * .16;
    const dkd_length = 2.8 + dkd_random() * .85;
    const dkd_frondX = dkd_x + Math.sin(dkd_angleValue) * dkd_length * .42;
    const dkd_frondZ = dkd_z + Math.cos(dkd_angleValue) * dkd_length * .42;
    dkd_collections.dkd_palmFronds.push({
      dkd_position: [dkd_frondX, dkd_topY + .05 + dkd_random() * .16, dkd_frondZ],
      dkd_scale: [.34, .10, dkd_length],
      dkd_rotation: [0, dkd_angleValue, -.08 + dkd_random() * .16],
      dkd_color: ['#3f7650','#4d8559','#397049'][Math.floor(dkd_random() * 3)],
    });
  }
}

dkd_Scene.prototype.dkd_buildCity = function dkd_v05PalmFixBuildCity() {
  const dkd_result = dkd_v05PalmFixPrevious.dkd_sceneBuildCity.call(this);

  // Remove the previous dense v0.5 detail layer that could overlap crossing roads.
  if (this.dkd_v05CityDetail) dkd_v05PalmFixDisposeGroup(this.dkd_v05CityDetail);

  const dkd_group = new dkd_three.Group();
  dkd_group.name = 'dkd_v05_city_detail_safe';
  this.dkd_world.add(dkd_group);
  this.dkd_v05CityDetail = dkd_group;

  const dkd_random = dkd_rng(9092026);
  const dkd_collections = {
    dkd_deciduousTrunks: [],
    dkd_deciduousCrowns: [],
    dkd_slimTrunks: [],
    dkd_slimCrowns: [],
    dkd_pineTrunks: [],
    dkd_pineCrowns: [],
    dkd_palmTrunks: [],
    dkd_palmCores: [],
    dkd_palmFronds: [],
    dkd_benches: [],
    dkd_bins: [],
    dkd_bollards: [],
    dkd_planters: [],
    dkd_busRoofs: [],
    dkd_busBacks: [],
    dkd_adBoards: [],
    dkd_lampPoles: [],
    dkd_lampHeads: [],
  };

  let dkd_treeCount = 0;
  for (const dkd_edge of this.dkd_graph.dkd_edges) {
    if (dkd_edge.dkd_length < 22) continue;
    const dkd_start = this.dkd_graph.dkd_points[dkd_edge.dkd_from];
    const dkd_end = this.dkd_graph.dkd_points[dkd_edge.dkd_to];
    const dkd_heading = Math.atan2(dkd_end[0] - dkd_start[0], dkd_end[1] - dkd_start[1]);

    // Trees: varied, dense enough for city character, but every trunk is road-clearance checked.
    for (let dkd_step = 13 + dkd_random() * 8; dkd_step < dkd_edge.dkd_length - 10; dkd_step += 27 + dkd_random() * 15) {
      for (const dkd_side of [-1, 1]) {
        if (dkd_treeCount >= 760 || dkd_random() < .23) continue;
        const dkd_position = dkd_v05PalmFixSafeRoadside(this, dkd_start, dkd_heading, dkd_step, dkd_side, dkd_edge, .5 + dkd_random() * .8);
        if (!dkd_position) continue;
        dkd_v05PalmFixPushTree(this, dkd_collections, dkd_random, dkd_position, dkd_heading);
        dkd_treeCount += 1;
      }
    }

    // Street lamps and furniture. The same nearest-road validation prevents props from sitting in lanes.
    for (let dkd_step = 20; dkd_step < dkd_edge.dkd_length - 12; dkd_step += 46 + Math.floor(dkd_random() * 22)) {
      const dkd_side = dkd_random() > .5 ? 1 : -1;
      const dkd_position = dkd_v05PalmFixSafeRoadside(this, dkd_start, dkd_heading, dkd_step, dkd_side, dkd_edge, .15);
      if (!dkd_position) continue;
      const [dkd_x, dkd_z] = dkd_position;

      if (dkd_collections.dkd_lampPoles.length < 420) {
        dkd_collections.dkd_lampPoles.push({ dkd_position: [dkd_x, 3.6, dkd_z], dkd_scale: [.12, 7.2, .12] });
        dkd_collections.dkd_lampHeads.push({ dkd_position: [dkd_x, 7.24, dkd_z], dkd_scale: [.72, .12, .52], dkd_rotation: [0, dkd_heading, 0] });
      }

      if (dkd_random() > .38 && dkd_collections.dkd_benches.length < 220) {
        const dkd_benchPosition = dkd_v05PalmFixSafeRoadside(this, dkd_start, dkd_heading, Math.min(dkd_edge.dkd_length - 11, dkd_step + 5), dkd_side, dkd_edge, 1.25);
        if (dkd_benchPosition) dkd_collections.dkd_benches.push({ dkd_position: [dkd_benchPosition[0], .58, dkd_benchPosition[1]], dkd_scale: [.62, .22, 2.15], dkd_rotation: [0, dkd_heading, 0] });
      }

      if (dkd_random() > .48 && dkd_collections.dkd_bins.length < 240) {
        const dkd_binPosition = dkd_v05PalmFixSafeRoadside(this, dkd_start, dkd_heading, Math.min(dkd_edge.dkd_length - 11, dkd_step + 2.6), -dkd_side, dkd_edge, .5);
        if (dkd_binPosition) dkd_collections.dkd_bins.push({ dkd_position: [dkd_binPosition[0], .52, dkd_binPosition[1]], dkd_scale: [.42, 1.04, .42], dkd_color: dkd_random() > .5 ? '#315e59' : '#48596a' });
      }

      if (dkd_random() > .58 && dkd_collections.dkd_planters.length < 190) {
        const dkd_planterPosition = dkd_v05PalmFixSafeRoadside(this, dkd_start, dkd_heading, Math.min(dkd_edge.dkd_length - 11, dkd_step + 8.4), dkd_side, dkd_edge, .9);
        if (dkd_planterPosition) dkd_collections.dkd_planters.push({ dkd_position: [dkd_planterPosition[0], .27, dkd_planterPosition[1]], dkd_scale: [1.3, .54, 1.3], dkd_color: dkd_random() > .5 ? '#77756d' : '#806b5c' });
      }

      if (dkd_edge.dkd_width >= 9 && dkd_random() > .77 && dkd_collections.dkd_busRoofs.length < 70) {
        const dkd_busPosition = dkd_v05PalmFixSafeRoadside(this, dkd_start, dkd_heading, Math.min(dkd_edge.dkd_length - 12, dkd_step + 12), dkd_side, dkd_edge, 2.2);
        if (dkd_busPosition) {
          dkd_collections.dkd_busRoofs.push({ dkd_position: [dkd_busPosition[0], 2.8, dkd_busPosition[1]], dkd_scale: [2.25, .16, 4.2], dkd_rotation: [0, dkd_heading, 0] });
          dkd_collections.dkd_busBacks.push({ dkd_position: [dkd_busPosition[0], 1.48, dkd_busPosition[1]], dkd_scale: [.14, 2.4, 4.0], dkd_rotation: [0, dkd_heading, 0] });
        }
      }

      if (dkd_random() > .70 && dkd_collections.dkd_adBoards.length < 110) {
        const dkd_adPosition = dkd_v05PalmFixSafeRoadside(this, dkd_start, dkd_heading, Math.min(dkd_edge.dkd_length - 12, dkd_step + 15), -dkd_side, dkd_edge, 2.1);
        if (dkd_adPosition) dkd_collections.dkd_adBoards.push({ dkd_position: [dkd_adPosition[0], 1.65, dkd_adPosition[1]], dkd_scale: [.18, 2.25, 3.0], dkd_rotation: [0, dkd_heading, 0], dkd_color: ['#d77ea8','#669fc1','#d19a59','#5ca89d'][Math.floor(dkd_random() * 4)] });
      }

      for (const dkd_bollardShift of [-3.2, 3.2]) {
        if (dkd_collections.dkd_bollards.length >= 520) break;
        const dkd_bollardStep = Math.max(8, Math.min(dkd_edge.dkd_length - 8, dkd_step + dkd_bollardShift));
        const dkd_bollardPosition = dkd_v05PalmFixSafeRoadside(this, dkd_start, dkd_heading, dkd_bollardStep, dkd_side, dkd_edge, 0);
        if (dkd_bollardPosition) dkd_collections.dkd_bollards.push({ dkd_position: [dkd_bollardPosition[0], .43, dkd_bollardPosition[1]], dkd_scale: [.16, .86, .16] });
      }
    }
  }

  dkd_v05PalmFixInstances(this, dkd_group, new dkd_three.CylinderGeometry(1, 1.05, 1, 7), this.dkd_material('#51483d', .92), dkd_collections.dkd_deciduousTrunks);
  dkd_v05PalmFixInstances(this, dkd_group, new dkd_three.IcosahedronGeometry(1, 1), this.dkd_material('#3b6650', .86), dkd_collections.dkd_deciduousCrowns);
  dkd_v05PalmFixInstances(this, dkd_group, new dkd_three.CylinderGeometry(1, 1.02, 1, 7), this.dkd_material('#51483d', .92), dkd_collections.dkd_slimTrunks);
  dkd_v05PalmFixInstances(this, dkd_group, new dkd_three.IcosahedronGeometry(1, 1), this.dkd_material('#416b4e', .86), dkd_collections.dkd_slimCrowns);
  dkd_v05PalmFixInstances(this, dkd_group, new dkd_three.CylinderGeometry(1, 1.04, 1, 7), this.dkd_material('#4f473e', .93), dkd_collections.dkd_pineTrunks);
  dkd_v05PalmFixInstances(this, dkd_group, new dkd_three.ConeGeometry(1, 1, 8), this.dkd_material('#315744', .90), dkd_collections.dkd_pineCrowns);
  dkd_v05PalmFixInstances(this, dkd_group, new dkd_three.CylinderGeometry(1, .82, 1, 8), this.dkd_material('#746047', .90), dkd_collections.dkd_palmTrunks);
  dkd_v05PalmFixInstances(this, dkd_group, new dkd_three.IcosahedronGeometry(1, 1), this.dkd_material('#43794f', .86), dkd_collections.dkd_palmCores);
  dkd_v05PalmFixInstances(this, dkd_group, new dkd_three.BoxGeometry(1, 1, 1), this.dkd_material('#477e51', .86), dkd_collections.dkd_palmFronds);
  dkd_v05PalmFixInstances(this, dkd_group, new dkd_three.BoxGeometry(1, 1, 1), this.dkd_material('#75624d', .78), dkd_collections.dkd_benches);
  dkd_v05PalmFixInstances(this, dkd_group, new dkd_three.CylinderGeometry(1, .88, 1, 8), this.dkd_material('#3f5d61', .7, .08), dkd_collections.dkd_bins);
  dkd_v05PalmFixInstances(this, dkd_group, new dkd_three.BoxGeometry(1, 1, 1), this.dkd_material('#77756f', .86), dkd_collections.dkd_planters);
  dkd_v05PalmFixInstances(this, dkd_group, new dkd_three.CylinderGeometry(1, 1, 1, 8), this.dkd_material('#667584', .48, .32), dkd_collections.dkd_bollards);
  dkd_v05PalmFixInstances(this, dkd_group, new dkd_three.BoxGeometry(1, 1, 1), this.dkd_material('#657d91', .46, .18), dkd_collections.dkd_busRoofs);
  dkd_v05PalmFixInstances(this, dkd_group, new dkd_three.BoxGeometry(1, 1, 1), this.dkd_material('#89a1b2', .38, .12), dkd_collections.dkd_busBacks);
  dkd_v05PalmFixInstances(this, dkd_group, new dkd_three.BoxGeometry(1, 1, 1), this.dkd_material('#669fc1', .64, .05), dkd_collections.dkd_adBoards);
  dkd_v05PalmFixInstances(this, dkd_group, new dkd_three.BoxGeometry(1, 1, 1), this.dkd_material('#65727f', .36, .42), dkd_collections.dkd_lampPoles);
  dkd_v05PalmFixInstances(this, dkd_group, new dkd_three.BoxGeometry(1, 1, 1), new dkd_three.MeshBasicMaterial({ color: '#f1dfb6' }), dkd_collections.dkd_lampHeads);

  return dkd_result;
};

// DraBornGo / Last Mile v0.5 traffic and obstacle layer.
const dkd_v05VehiclePalette = ['#e86f63', '#65c9c2', '#e9b65f', '#7f9fe8', '#d27fb0', '#7fb26f', '#d48758', '#9a86d6', '#d9d3c7', '#5f87a8'];
const dkd_v05VehicleCabinPalette = ['#803f43', '#335f68', '#79613e', '#445887', '#70485f', '#486546', '#724d3f', '#554b78', '#6b6c70', '#3e556c'];

// Keep the traffic model compatible with the existing update loop but allow per-car instance colors.
dkd_Scene.prototype.dkd_buildTraffic = function dkd_v05BuildTraffic() {
  this.dkd_trafficGroup = new dkd_three.Group();
  this.dkd_scene.add(this.dkd_trafficGroup);
  this.dkd_trafficParts = [];
  this.dkd_v05TrafficBodyColors = dkd_v05VehiclePalette.map(dkd_color => new dkd_three.Color(dkd_color));
  this.dkd_v05TrafficCabinColors = dkd_v05VehicleCabinPalette.map(dkd_color => new dkd_three.Color(dkd_color));
  const dkd_capacity = 72;
  const dkd_parts = [
    { dkd_size: [1.65, .62, 3.8], dkd_at: [0, .70, 0], dkd_color: '#ffffff', dkd_role: 'body' },
    { dkd_size: [1.45, .65, 1.95], dkd_at: [0, 1.31, -.1], dkd_color: '#ffffff', dkd_role: 'cabin' },
    { dkd_size: [1.4, .15, .06], dkd_at: [0, .83, 1.92], dkd_color: '#f0e7cb', dkd_basic: true, dkd_role: 'light' },
    { dkd_size: [1.4, .15, .06], dkd_at: [0, .82, -1.92], dkd_color: '#df654d', dkd_basic: true, dkd_role: 'light' },
  ];
  for (const dkd_side of [-1, 1]) for (const dkd_axle of [-1.18, 1.18]) dkd_parts.push({ dkd_size: [.18, .49, .57], dkd_at: [dkd_side * .83, .36, dkd_axle], dkd_color: '#172027', dkd_role: 'wheel' });
  for (const dkd_part of dkd_parts) {
    const dkd_material = dkd_part.dkd_basic ? new dkd_three.MeshBasicMaterial({ color: dkd_part.dkd_color }) : this.dkd_material(dkd_part.dkd_color, .4, .35);
    const dkd_mesh = new dkd_three.InstancedMesh(new dkd_three.BoxGeometry(...dkd_part.dkd_size), dkd_material, dkd_capacity);
    dkd_mesh.frustumCulled = false;
    dkd_mesh.count = 0;
    this.dkd_trafficGroup.add(dkd_mesh);
    this.dkd_trafficParts.push({ dkd_mesh, dkd_at: dkd_part.dkd_at, dkd_role: dkd_part.dkd_role });
  }
};

dkd_initTraffic = function dkd_v05TrafficPalette(dkd_run, dkd_graph, dkd_count = 24) {
  dkd_v05Previous.dkd_initTraffic(dkd_run, dkd_graph, Math.max(Number(dkd_count) || 0, 56));
  if (!Array.isArray(dkd_run?.dkd_traffic)) return;
  const dkd_seed = Math.abs(Number(dkd_run.dkd_order?.dkd_seed) || 571);
  dkd_run.dkd_traffic.forEach((dkd_car, dkd_index) => {
    dkd_car.dkd_color = (dkd_index * 7 + dkd_seed + Math.floor(dkd_index / 3) * 3) % dkd_v05VehiclePalette.length;
  });
};

dkd_Scene.prototype.dkd_update = function dkd_v05SceneUpdate(dkd_dt, dkd_run = null) {
  const dkd_result = dkd_v05Previous.dkd_sceneUpdate.call(this, dkd_dt, dkd_run);
  if (this.dkd_mode === 'drive' && dkd_run && this.dkd_v05ColorRunId !== dkd_run.dkd_id) {
    for (const dkd_part of this.dkd_trafficParts || []) {
      if (dkd_part.dkd_role !== 'body' && dkd_part.dkd_role !== 'cabin') continue;
      dkd_run.dkd_traffic.forEach((dkd_car, dkd_index) => {
        const dkd_colorIndex = Math.abs(Number(dkd_car.dkd_color) || 0) % dkd_v05VehiclePalette.length;
        const dkd_color = dkd_part.dkd_role === 'body' ? this.dkd_v05TrafficBodyColors[dkd_colorIndex] : this.dkd_v05TrafficCabinColors[dkd_colorIndex];
        dkd_part.dkd_mesh.setColorAt(dkd_index, dkd_color);
      });
      if (dkd_part.dkd_mesh.instanceColor) dkd_part.dkd_mesh.instanceColor.needsUpdate = true;
    }
    this.dkd_v05ColorRunId = dkd_run.dkd_id;
  }
  return dkd_result;
};

function dkd_v05ObstacleRouteKey(dkd_run) {
  return Array.isArray(dkd_run?.dkd_route?.dkd_nodes) ? dkd_run.dkd_route.dkd_nodes.join('.') : '';
}

function dkd_v05ObstacleTypeConfig(dkd_type) {
  const dkd_config = {
    barrier: { dkd_radius: 1.70, dkd_severity: 1.02 },
    cones: { dkd_radius: 1.25, dkd_severity: .72 },
    crate: { dkd_radius: 1.10, dkd_severity: .95 },
    pallet: { dkd_radius: 1.30, dkd_severity: .86 },
    tire: { dkd_radius: 1.05, dkd_severity: .78 },
    roadwork: { dkd_radius: 1.55, dkd_severity: 1.08 },
    pothole: { dkd_radius: 1.25, dkd_severity: .68 },
    drum: { dkd_radius: 1.15, dkd_severity: .92 },
  };
  return dkd_config[dkd_type] || dkd_config.cones;
}

function dkd_v05GenerateObstacles(dkd_run, dkd_graph) {
  const dkd_routeKey = dkd_v05ObstacleRouteKey(dkd_run);
  if (!dkd_routeKey) return [];
  const dkd_nodes = dkd_run.dkd_route.dkd_nodes;
  const dkd_random = dkd_rng((Number(dkd_run.dkd_order?.dkd_seed) || 571) + 50509 + dkd_routeKey.length * 31);
  const dkd_candidates = [];
  let dkd_routeDistance = 0;

  for (let dkd_index = 2; dkd_index < dkd_nodes.length - 2; dkd_index++) {
    const dkd_start = dkd_graph.dkd_points[dkd_nodes[dkd_index - 1]];
    const dkd_end = dkd_graph.dkd_points[dkd_nodes[dkd_index]];
    if (!dkd_start || !dkd_end) continue;
    const dkd_length = dkd_distance(dkd_start, dkd_end);
    dkd_routeDistance += dkd_length;
    if (dkd_length < 13) continue;
    const dkd_slotCount = Math.max(1, Math.min(4, Math.floor(dkd_length / 38)));
    for (let dkd_slot = 0; dkd_slot < dkd_slotCount; dkd_slot++) {
      const dkd_baseFraction = (dkd_slot + 1) / (dkd_slotCount + 1);
      const dkd_fraction = dkd_clamp(dkd_baseFraction + (dkd_random() - .5) * .16, .18, .82);
      dkd_candidates.push({ dkd_index, dkd_slot, dkd_start, dkd_end, dkd_length, dkd_fraction });
    }
  }

  for (let dkd_index = dkd_candidates.length - 1; dkd_index > 0; dkd_index--) {
    const dkd_swap = Math.floor(dkd_random() * (dkd_index + 1));
    [dkd_candidates[dkd_index], dkd_candidates[dkd_swap]] = [dkd_candidates[dkd_swap], dkd_candidates[dkd_index]];
  }

  const dkd_targetCount = Math.min(24, Math.max(10, Math.round(dkd_routeDistance / 52)));
  const dkd_types = ['barrier', 'cones', 'crate', 'pallet', 'tire', 'roadwork', 'pothole', 'drum'];
  const dkd_obstacles = [];
  for (const dkd_candidate of dkd_candidates.slice(0, dkd_targetCount)) {
    const dkd_heading = Math.atan2(dkd_candidate.dkd_end[0] - dkd_candidate.dkd_start[0], dkd_candidate.dkd_end[1] - dkd_candidate.dkd_start[1]);
    const dkd_center = [
      dkd_candidate.dkd_start[0] + (dkd_candidate.dkd_end[0] - dkd_candidate.dkd_start[0]) * dkd_candidate.dkd_fraction,
      dkd_candidate.dkd_start[1] + (dkd_candidate.dkd_end[1] - dkd_candidate.dkd_start[1]) * dkd_candidate.dkd_fraction,
    ];
    const dkd_near = dkd_nearestRoad(dkd_graph, dkd_center);
    const dkd_width = Math.max(6, Number(dkd_near?.dkd_edge?.dkd_width) || 8);
    const dkd_type = dkd_types[(dkd_obstacles.length + Math.floor(dkd_random() * dkd_types.length)) % dkd_types.length];
    const dkd_typeConfig = dkd_v05ObstacleTypeConfig(dkd_type);
    const dkd_side = dkd_random() > .5 ? 1 : -1;
    const dkd_centerBias = dkd_type === 'pothole' || dkd_type === 'tire' ? .65 : 1;
    const dkd_lateral = dkd_side * Math.min(2.45, Math.max(.65, dkd_width * (.12 + dkd_random() * .10))) * dkd_centerBias;
    dkd_obstacles.push({
      dkd_id: `dkd_v05_obstacle_${dkd_candidate.dkd_index}_${dkd_candidate.dkd_slot}_${dkd_obstacles.length}`,
      dkd_type,
      dkd_position: [dkd_center[0] + Math.cos(dkd_heading) * dkd_lateral, dkd_center[1] - Math.sin(dkd_heading) * dkd_lateral],
      dkd_heading,
      dkd_radius: dkd_typeConfig.dkd_radius,
      dkd_severity: dkd_typeConfig.dkd_severity + dkd_random() * .32,
      dkd_hitAt: -999,
    });
  }
  dkd_run.dkd_obstacles = dkd_obstacles;
  dkd_run.dkd_obstacleRouteKey = dkd_routeKey;
  dkd_run.dkd_v05ObstacleCount = dkd_obstacles.length;
  return dkd_obstacles;
}

function dkd_v05ClearObstacleGroup(dkd_group) {
  if (!dkd_group) return;
  dkd_group.traverse(dkd_object => {
    if (!dkd_object.isMesh) return;
    try { dkd_object.geometry?.dispose(); } catch {}
    try { dkd_object.material?.dispose(); } catch {}
  });
  dkd_group.clear();
}

function dkd_v05DrawObstacles(dkd_scene, dkd_run) {
  if (!dkd_scene.dkd_obstacleGroup) {
    dkd_scene.dkd_obstacleGroup = new dkd_three.Group();
    dkd_scene.dkd_world.add(dkd_scene.dkd_obstacleGroup);
  }
  dkd_v05ClearObstacleGroup(dkd_scene.dkd_obstacleGroup);

  for (const dkd_obstacle of dkd_run.dkd_obstacles || []) {
    const dkd_group = new dkd_three.Group();
    dkd_group.position.set(dkd_obstacle.dkd_position[0], .02, dkd_obstacle.dkd_position[1]);
    dkd_group.rotation.y = dkd_obstacle.dkd_heading;
    dkd_scene.dkd_obstacleGroup.add(dkd_group);

    if (dkd_obstacle.dkd_type === 'barrier') {
      dkd_scene.dkd_box(dkd_group, [3.2, .64, .44], [0, .72, 0], dkd_scene.dkd_material('#e47d3f', .48, .08));
      dkd_scene.dkd_box(dkd_group, [2.55, .12, .47], [0, .72, .24], new dkd_three.MeshBasicMaterial({ color: '#f2e7c4' }));
      for (const dkd_side of [-1, 1]) dkd_scene.dkd_box(dkd_group, [.20, 1.10, .20], [dkd_side * 1.24, .47, 0], dkd_scene.dkd_material('#434a54'));
    } else if (dkd_obstacle.dkd_type === 'cones') {
      for (const dkd_side of [-.75, -.25, .25, .75]) {
        const dkd_cone = new dkd_three.Mesh(new dkd_three.ConeGeometry(.31, .80, 10), dkd_scene.dkd_material('#f07c3d', .62, .02));
        dkd_cone.position.set(dkd_side, .42, 0);
        dkd_group.add(dkd_cone);
        dkd_scene.dkd_box(dkd_group, [.56, .08, .56], [dkd_side, .05, 0], dkd_scene.dkd_material('#252c34'));
      }
    } else if (dkd_obstacle.dkd_type === 'crate') {
      dkd_scene.dkd_box(dkd_group, [1.35, 1.22, 1.35], [0, .63, 0], dkd_scene.dkd_material('#9b6939', .82, .01));
      dkd_scene.dkd_box(dkd_group, [1.41, .10, .17], [0, .64, .69], new dkd_three.MeshBasicMaterial({ color: '#e3c289' }));
      dkd_scene.dkd_box(dkd_group, [.17, 1.28, 1.41], [0, .64, 0], new dkd_three.MeshBasicMaterial({ color: '#77502e' }));
    } else if (dkd_obstacle.dkd_type === 'pallet') {
      for (const dkd_height of [.12, .32]) dkd_scene.dkd_box(dkd_group, [2.0, .16, 1.45], [0, dkd_height, 0], dkd_scene.dkd_material('#a57543', .86, .01));
      for (const dkd_side of [-.72, 0, .72]) dkd_scene.dkd_box(dkd_group, [.22, .42, 1.32], [dkd_side, .22, 0], dkd_scene.dkd_material('#785234', .9, .01));
    } else if (dkd_obstacle.dkd_type === 'tire') {
      for (const dkd_side of [-.45, .45]) {
        const dkd_tire = new dkd_three.Mesh(new dkd_three.TorusGeometry(.38, .15, 8, 18), dkd_scene.dkd_material('#252a2f', .75, .02));
        dkd_tire.rotation.x = Math.PI / 2;
        dkd_tire.position.set(dkd_side, .20, 0);
        dkd_group.add(dkd_tire);
      }
    } else if (dkd_obstacle.dkd_type === 'roadwork') {
      dkd_scene.dkd_box(dkd_group, [2.8, .52, .38], [0, .65, 0], dkd_scene.dkd_material('#f0ba54', .52, .04));
      dkd_scene.dkd_box(dkd_group, [2.25, .10, .42], [0, .65, .21], new dkd_three.MeshBasicMaterial({ color: '#27313b' }));
      const dkd_sign = new dkd_three.Mesh(new dkd_three.OctahedronGeometry(.48), dkd_scene.dkd_material('#f3cc61', .45, .04));
      dkd_sign.position.set(0, 1.55, 0);
      dkd_sign.rotation.z = Math.PI / 4;
      dkd_group.add(dkd_sign);
      dkd_scene.dkd_box(dkd_group, [.12, 1.35, .12], [0, .75, 0], dkd_scene.dkd_material('#444b54'));
    } else if (dkd_obstacle.dkd_type === 'pothole') {
      const dkd_hole = new dkd_three.Mesh(new dkd_three.CircleGeometry(.95, 18), new dkd_three.MeshBasicMaterial({ color: '#171b20', side: dkd_three.DoubleSide }));
      dkd_hole.rotation.x = -Math.PI / 2;
      dkd_hole.position.y = .035;
      dkd_hole.scale.set(1.35, .72, 1);
      dkd_group.add(dkd_hole);
      const dkd_ring = new dkd_three.Mesh(new dkd_three.RingGeometry(.82, 1.06, 18), new dkd_three.MeshBasicMaterial({ color: '#3e4549', side: dkd_three.DoubleSide }));
      dkd_ring.rotation.x = -Math.PI / 2;
      dkd_ring.position.y = .04;
      dkd_ring.scale.set(1.35, .72, 1);
      dkd_group.add(dkd_ring);
    } else {
      for (const dkd_side of [-.42, .42]) {
        const dkd_drum = new dkd_three.Mesh(new dkd_three.CylinderGeometry(.34, .34, .95, 12), dkd_scene.dkd_material(dkd_side < 0 ? '#e58044' : '#e0ad52', .48, .08));
        dkd_drum.position.set(dkd_side, .50, 0);
        dkd_group.add(dkd_drum);
        dkd_scene.dkd_box(dkd_group, [.70, .08, .10], [dkd_side, .52, .35], new dkd_three.MeshBasicMaterial({ color: '#f0e7c8' }));
      }
    }
  }
}

dkd_Scene.prototype.dkd_setRoute = function dkd_v05SetRoute(dkd_run) {
  const dkd_result = dkd_v05Previous.dkd_sceneSetRoute.call(this, dkd_run);
  dkd_v05GenerateObstacles(dkd_run, this.dkd_graph);
  dkd_v05DrawObstacles(this, dkd_run);
  return dkd_result;
};

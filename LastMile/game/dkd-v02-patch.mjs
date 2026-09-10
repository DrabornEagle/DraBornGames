// DraBornGo / Last Mile v0.2 gameplay and compatibility fixes.
// Loaded after the v0.101 source modules by scripts/dkd-build-game.mjs.

const dkd_v02_scooterPack = dkd_v02_scooterChunk0 + dkd_v02_scooterChunk1 + dkd_v02_scooterChunk2;

function dkd_v02_sameRoute(dkd_first, dkd_second) {
  if (!dkd_first || !dkd_second || dkd_first.dkd_edges.length !== dkd_second.dkd_edges.length) return false;
  return dkd_first.dkd_edges.every((dkd_edgeId, dkd_index) => dkd_edgeId === dkd_second.dkd_edges[dkd_index]);
}

function dkd_v02_routeChoiceIsDistinct(dkd_order) {
  if (!dkd_order?.dkd_safe || !dkd_order?.dkd_risk) return false;
  if (dkd_v02_sameRoute(dkd_order.dkd_safe, dkd_order.dkd_risk)) return false;
  // UI iki ondalık km gösteriyor. En az 10 m fark olsun ki iki seçenek
  // ekranda da farklı görünsün.
  return Math.abs(dkd_order.dkd_safe.dkd_distance - dkd_order.dkd_risk.dkd_distance) >= 10;
}

// Güvenli rota geniş yolları, Ara Sokak ise gerçek en kısa rotayı kullanmaya
// devam eder. Aynı hedefte iki seçenek aynı çıkarsa sipariş kullanıcıya
// gösterilmeden yeni, ulaşılabilir bir hedef seçilir.
const dkd_v02_baseMakeOrder = dkd_makeOrder;
dkd_makeOrder = function(dkd_state, dkd_graph, dkd_seed, dkd_type = 'normal', dkd_targetOverride = null) {
  const dkd_attempts = dkd_type === 'final' || dkd_targetOverride !== null ? 1 : 24;
  let dkd_order = null;
  for (let dkd_attempt = 0; dkd_attempt < dkd_attempts; dkd_attempt++) {
    const dkd_attemptSeed = dkd_seed + dkd_attempt * 104729;
    dkd_order = dkd_v02_baseMakeOrder(dkd_state, dkd_graph, dkd_attemptSeed, dkd_type, dkd_targetOverride);
    if (dkd_type === 'final' || dkd_v02_routeChoiceIsDistinct(dkd_order)) return dkd_order;
  }
  // Çok nadir tek-yol hedefinde oyunu kilitlemek yerine ulaşılabilir siparişi
  // döndür. Normal siparişlerde yukarıdaki 24 deneme pratikte farklı rota bulur.
  return dkd_order;
};

// Oyun ekranındaki görünür OSM yazısını kaldır. Lisans/kaynak bilgisi Veri ve
// deneme kapsamı ekranında tutulur.
const dkd_v02_baseMapSvg = dkd_mapSvg;
dkd_mapSvg = function(...dkd_args) {
  return dkd_v02_baseMapSvg(...dkd_args).replace(/<text[^>]*>© OpenStreetMap katılımcıları · ODbL<\/text>/g, '');
};
const dkd_v02_style = document.createElement('style');
dkd_v02_style.textContent = '.dkd-osm{display:none!important}';
document.head.appendChild(dkd_v02_style);

// ShapeGeometry oku XY düzleminden XZ yol düzlemine yatır ve rota yönünde
// Y ekseninde döndür. Böylece okların ucu gerçek ilerleme yönünü gösterir.
const dkd_v02_baseSetRoute = dkd_Scene.prototype.dkd_setRoute;
dkd_Scene.prototype.dkd_setRoute = function(dkd_run) {
  dkd_v02_baseSetRoute.call(this, dkd_run);
  if (!this.dkd_navigation) return;
  const dkd_oldMeshes = [];
  this.dkd_navigation.traverse(dkd_object => {
    if (dkd_object.isInstancedMesh && dkd_object.geometry?.type === 'ShapeGeometry') dkd_oldMeshes.push(dkd_object);
  });
  for (const dkd_mesh of dkd_oldMeshes) {
    this.dkd_navigation.remove(dkd_mesh);
    dkd_mesh.geometry.dispose();
    dkd_mesh.material.dispose();
  }
  const dkd_points = dkd_run.dkd_route.dkd_nodes.map(dkd_id => {
    const dkd_point = this.dkd_graph.dkd_points[dkd_id];
    return new dkd_three.Vector3(dkd_point[0], .19, dkd_point[1]);
  });
  const dkd_arrows = [];
  for (let dkd_index = 1; dkd_index < dkd_points.length; dkd_index++) {
    const dkd_start = dkd_points[dkd_index - 1];
    const dkd_end = dkd_points[dkd_index];
    const dkd_length = dkd_start.distanceTo(dkd_end);
    const dkd_heading = Math.atan2(dkd_end.x - dkd_start.x, dkd_end.z - dkd_start.z);
    for (let dkd_step = 4; dkd_step < dkd_length; dkd_step += 15) {
      dkd_arrows.push({
        dkd_position: [dkd_start.x + Math.sin(dkd_heading) * dkd_step, .19, dkd_start.z + Math.cos(dkd_heading) * dkd_step],
        dkd_rotation: [Math.PI / 2, dkd_heading, 0],
        dkd_scale: [1.15, 1.7, 1]
      });
    }
  }
  const dkd_shape = new dkd_three.Shape();
  dkd_shape.moveTo(-.65, -.65);
  dkd_shape.lineTo(0, .55);
  dkd_shape.lineTo(.65, -.65);
  dkd_shape.lineTo(0, -.25);
  dkd_shape.closePath();
  if (dkd_arrows.length) {
    this.dkd_instances(
      this.dkd_navigation,
      new dkd_three.ShapeGeometry(dkd_shape),
      new dkd_three.MeshBasicMaterial({ color: '#e4ff5e', side: dkd_three.DoubleSide }),
      dkd_arrows
    );
  }
};

function dkd_v02_readScooter() {
  const dkd_binary = atob(dkd_v02_scooterPack);
  const dkd_bytes = new Uint8Array(dkd_binary.length);
  for (let dkd_index = 0; dkd_index < dkd_binary.length; dkd_index++) dkd_bytes[dkd_index] = dkd_binary.charCodeAt(dkd_index);
  const dkd_view = new DataView(dkd_bytes.buffer);
  let dkd_offset = 0;
  const dkd_ascii = String.fromCharCode(...dkd_bytes.slice(0, 4));
  dkd_offset = 4;
  if (dkd_ascii !== 'DK20') throw new Error('Başlangıç motosikleti verisi geçersiz.');
  const dkd_meshCount = dkd_view.getUint16(dkd_offset, true);
  dkd_offset += 2;
  const dkd_group = new dkd_three.Group();
  for (let dkd_meshIndex = 0; dkd_meshIndex < dkd_meshCount; dkd_meshIndex++) {
    const dkd_vertexCount = dkd_view.getUint16(dkd_offset, true); dkd_offset += 2;
    const dkd_faceCount = dkd_view.getUint16(dkd_offset, true); dkd_offset += 2;
    const dkd_red = dkd_bytes[dkd_offset++];
    const dkd_green = dkd_bytes[dkd_offset++];
    const dkd_blue = dkd_bytes[dkd_offset++];
    const dkd_alpha = dkd_bytes[dkd_offset++];
    const dkd_metalness = dkd_bytes[dkd_offset++] / 255;
    const dkd_roughness = dkd_bytes[dkd_offset++] / 255;
    const dkd_opacity = dkd_bytes[dkd_offset++] / 255;
    const dkd_min = [
      dkd_view.getFloat32(dkd_offset, true),
      dkd_view.getFloat32(dkd_offset + 4, true),
      dkd_view.getFloat32(dkd_offset + 8, true)
    ];
    const dkd_max = [
      dkd_view.getFloat32(dkd_offset + 12, true),
      dkd_view.getFloat32(dkd_offset + 16, true),
      dkd_view.getFloat32(dkd_offset + 20, true)
    ];
    dkd_offset += 24;
    const dkd_positions = new Float32Array(dkd_vertexCount * 3);
    for (let dkd_vertex = 0; dkd_vertex < dkd_vertexCount; dkd_vertex++) {
      for (let dkd_axis = 0; dkd_axis < 3; dkd_axis++) {
        const dkd_quantized = dkd_view.getUint16(dkd_offset, true);
        dkd_offset += 2;
        dkd_positions[dkd_vertex * 3 + dkd_axis] = dkd_min[dkd_axis] + (dkd_max[dkd_axis] - dkd_min[dkd_axis]) * dkd_quantized / 65535;
      }
    }
    const dkd_indices = new Uint16Array(dkd_faceCount * 3);
    for (let dkd_index = 0; dkd_index < dkd_indices.length; dkd_index++) {
      dkd_indices[dkd_index] = dkd_view.getUint16(dkd_offset, true);
      dkd_offset += 2;
    }
    const dkd_geometry = new dkd_three.BufferGeometry();
    dkd_geometry.setAttribute('position', new dkd_three.BufferAttribute(dkd_positions, 3));
    dkd_geometry.setIndex(new dkd_three.BufferAttribute(dkd_indices, 1));
    dkd_geometry.computeVertexNormals();
    dkd_geometry.computeBoundingSphere();
    const dkd_material = new dkd_three.MeshStandardMaterial({
      color: new dkd_three.Color(dkd_red / 255, dkd_green / 255, dkd_blue / 255),
      metalness: dkd_metalness,
      roughness: dkd_roughness,
      transparent: dkd_opacity < .99 || dkd_alpha < 250,
      opacity: Math.min(dkd_opacity, dkd_alpha / 255),
      depthWrite: dkd_opacity > .72
    });
    dkd_group.add(new dkd_three.Mesh(dkd_geometry, dkd_material));
  }
  return dkd_group;
}

// Yalnızca başlangıç aracı Şehir 50 için kullanıcının gönderdiği modern scooter
// geometrisini kullan. Diğer araçlar mevcut prosedürel modellerini korur.
const dkd_v02_baseBuildBike = dkd_Scene.prototype.dkd_buildBike;
dkd_Scene.prototype.dkd_buildBike = function(dkd_kind = 'scooter') {
  if (dkd_kind !== 'scooter' || this.dkd_state.dkd_equipped !== 'dkd_city50') return dkd_v02_baseBuildBike.call(this, dkd_kind);
  dkd_v02_baseBuildBike.call(this, dkd_kind);
  if (this.dkd_bike) {
    this.dkd_scene.remove(this.dkd_bike);
    const dkd_materials = new Set();
    this.dkd_bike.traverse(dkd_object => {
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
  this.dkd_bike = new dkd_three.Group();
  this.dkd_scene.add(this.dkd_bike);
  this.dkd_wheels = [];
  this.dkd_bikeKind = dkd_kind;
  const dkd_model = dkd_v02_readScooter();
  this.dkd_bike.add(dkd_model);
  const dkd_brand = this.dkd_state.dkd_brand;
  const dkd_wearing = this.dkd_state.dkd_wearing;
  const dkd_dark = this.dkd_material('#111821', .55, .28);
  const dkd_skin = this.dkd_material('#b69a84', .82);
  const dkd_jacket = this.dkd_material(dkd_wearing.includes('dkd_raincoat') ? dkd_brand.dkd_color : dkd_brand.dkd_uniform, .74);
  this.dkd_box(this.dkd_bike, [.50, .50, .30], [0, 1.32, -.13], dkd_jacket);
  this.dkd_cylinder(this.dkd_bike, .07, .12, [0, 1.62, -.10], dkd_skin);
  const dkd_helmet = new dkd_three.Mesh(new dkd_three.SphereGeometry(.25, 20, 12), dkd_dark);
  dkd_helmet.scale.set(1, 1.08, 1.08);
  dkd_helmet.position.set(0, 1.83, -.08);
  this.dkd_bike.add(dkd_helmet);
  const dkd_visor = new dkd_three.Mesh(
    new dkd_three.SphereGeometry(.256, 16, 8, 0, Math.PI * 2, .35, 1.1),
    this.dkd_material('#4f7892', .12, .55)
  );
  dkd_visor.rotation.x = Math.PI / 2;
  dkd_visor.position.copy(dkd_helmet.position);
  this.dkd_bike.add(dkd_visor);
  for (const dkd_side of [-1, 1]) {
    this.dkd_cylinder(this.dkd_bike, .055, .52, [dkd_side * .25, 1.38, .28], dkd_jacket, [0, 0, dkd_side * .85]);
    this.dkd_cylinder(this.dkd_bike, .065, .48, [dkd_side * .18, 1.03, -.03], this.dkd_material('#26333c', .82), [dkd_side * .4, 0, 0]);
  }
};

// Mobil direksiyon: görsel düğme parmağı takip eder, fizik girdisi kullanıcının
// bildirdiği ters yön sorununu gidermek için karşı işaretle uygulanır.
const dkd_v02_baseBindControls = dkd_Game.prototype.dkd_bindControls;
dkd_Game.prototype.dkd_bindControls = function() {
  dkd_v02_baseBindControls.call(this);
  const dkd_pad = document.getElementById('dkd-steer');
  const dkd_knob = document.getElementById('dkd-steer-knob');
  if (!dkd_pad || !dkd_knob) return;
  let dkd_pointer = null;
  let dkd_origin = 0;
  const dkd_apply = dkd_event => {
    const dkd_visual = dkd_clamp((dkd_event.clientX - dkd_origin) / 48, -1, 1);
    this.dkd_input.dkd_steer = -dkd_visual;
    dkd_knob.style.transform = `translateX(${dkd_visual * 31}px)`;
    dkd_pad.setAttribute('aria-valuenow', String(Math.round(dkd_visual * 100)));
  };
  dkd_pad.addEventListener('pointerdown', dkd_event => {
    dkd_pointer = dkd_event.pointerId;
    dkd_origin = dkd_pad.getBoundingClientRect().left + dkd_pad.clientWidth / 2;
    dkd_apply(dkd_event);
  });
  dkd_pad.addEventListener('pointermove', dkd_event => {
    if (dkd_pointer === dkd_event.pointerId) dkd_apply(dkd_event);
  });
  const dkd_release = dkd_event => {
    if (dkd_pointer !== dkd_event.pointerId) return;
    dkd_pointer = null;
    this.dkd_input.dkd_steer = 0;
    dkd_knob.style.transform = '';
    dkd_pad.setAttribute('aria-valuenow', '0');
  };
  dkd_pad.addEventListener('pointerup', dkd_release);
  dkd_pad.addEventListener('pointercancel', dkd_release);
  dkd_pad.addEventListener('lostpointercapture', dkd_release);
};

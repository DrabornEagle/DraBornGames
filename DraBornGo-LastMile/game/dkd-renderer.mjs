import * as dkd_three from 'three';
import { dkd_clamp, dkd_rng, dkd_nearestRoad, dkd_distance, dkd_angle } from './dkd-core.mjs';

export class dkd_Scene {
  constructor(dkd_canvas, dkd_graph, dkd_state) {
    this.dkd_graph = dkd_graph; this.dkd_state = dkd_state; this.dkd_time = 0; this.dkd_mode = 'garage'; this.dkd_lastQuality = ''; this.dkd_disposable = [];
    this.dkd_renderer = new dkd_three.WebGLRenderer({ canvas: dkd_canvas, antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
    this.dkd_renderer.outputColorSpace = dkd_three.SRGBColorSpace; this.dkd_renderer.toneMapping = dkd_three.ACESFilmicToneMapping; this.dkd_renderer.toneMappingExposure = 1.2;
    this.dkd_scene = new dkd_three.Scene(); this.dkd_scene.background = new dkd_three.Color('#192a3b'); this.dkd_scene.fog = new dkd_three.Fog('#192a3b', 70, 520);
    this.dkd_camera = new dkd_three.PerspectiveCamera(57, 1, .15, 1450); this.dkd_camera.position.set(6, 4, 8);
    this.dkd_hemi = new dkd_three.HemisphereLight('#afc9e8', '#1c2830', 2.2); this.dkd_scene.add(this.dkd_hemi);
    this.dkd_sun = new dkd_three.DirectionalLight('#f0debf', 2.3); this.dkd_sun.position.set(-50, 140, 80); this.dkd_scene.add(this.dkd_sun);
    this.dkd_world = new dkd_three.Group(); this.dkd_scene.add(this.dkd_world);
    this.dkd_hub = new dkd_three.Group(); this.dkd_scene.add(this.dkd_hub);
    this.dkd_dummy = new dkd_three.Object3D(); this.dkd_cameraTarget = new dkd_three.Vector3(); this.dkd_lookTarget = new dkd_three.Vector3();
    this.dkd_buildCity(); this.dkd_buildHub(); this.dkd_buildBike(); this.dkd_buildWeather(); this.dkd_buildTraffic();
    this.dkd_navigation = new dkd_three.Group(); this.dkd_scene.add(this.dkd_navigation);
    this.dkd_marker = new dkd_three.Group();
    const dkd_ring = new dkd_three.Mesh(new dkd_three.TorusGeometry(5, .16, 6, 48), new dkd_three.MeshBasicMaterial({ color: '#e4ff5e' })); dkd_ring.rotation.x = Math.PI / 2; this.dkd_marker.add(dkd_ring);
    const dkd_pin = new dkd_three.Mesh(new dkd_three.OctahedronGeometry(1.2), new dkd_three.MeshStandardMaterial({ color: '#e4ff5e', emissive: '#718322', emissiveIntensity: .4, metalness: .45, roughness: .3 })); dkd_pin.position.y = 7; this.dkd_marker.add(dkd_pin); this.dkd_scene.add(this.dkd_marker);
    this.dkd_headlamp = new dkd_three.SpotLight('#eeedcf', 90, 65, .50, .65, 1.3); this.dkd_scene.add(this.dkd_headlamp); this.dkd_scene.add(this.dkd_headlamp.target);
    this.dkd_ghost = this.dkd_bike.clone(); this.dkd_ghost.traverse(dkd_object => { if (dkd_object.isMesh) { dkd_object.geometry = dkd_object.geometry.clone(); dkd_object.material = new dkd_three.MeshBasicMaterial({ color: '#65d5d0', transparent: true, opacity: .23, depthWrite: false }); } }); this.dkd_scene.add(this.dkd_ghost); this.dkd_ghost.visible = false;
    this.dkd_setMode('garage'); this.dkd_resize();
  }
  dkd_material(dkd_color, dkd_roughness = .72, dkd_metalness = .05) { return new dkd_three.MeshStandardMaterial({ color: dkd_color, roughness: dkd_roughness, metalness: dkd_metalness }); }
  dkd_box(dkd_parent, dkd_size, dkd_position, dkd_material, dkd_rotation = 0) { const dkd_mesh = new dkd_three.Mesh(new dkd_three.BoxGeometry(...dkd_size), dkd_material); dkd_mesh.position.set(...dkd_position); dkd_mesh.rotation.y = dkd_rotation; dkd_parent.add(dkd_mesh); return dkd_mesh; }
  dkd_cylinder(dkd_parent, dkd_radius, dkd_length, dkd_position, dkd_material, dkd_rotation = [0, 0, 0]) { const dkd_mesh = new dkd_three.Mesh(new dkd_three.CylinderGeometry(dkd_radius, dkd_radius, dkd_length, 14), dkd_material); dkd_mesh.position.set(...dkd_position); dkd_mesh.rotation.set(...dkd_rotation); dkd_parent.add(dkd_mesh); return dkd_mesh; }
  dkd_texture(dkd_kind) {
    const dkd_canvas = document.createElement('canvas'); dkd_canvas.width = dkd_kind === 'asphalt' ? 256 : 128; dkd_canvas.height = 256; const dkd_context = dkd_canvas.getContext('2d'); const dkd_random = dkd_rng(dkd_kind === 'asphalt' ? 941 : 571);
    if (dkd_kind === 'asphalt') { dkd_context.fillStyle = '#4b5257'; dkd_context.fillRect(0, 0, 256, 256); for (let dkd_index = 0; dkd_index < 19000; dkd_index++) { const dkd_value = Math.floor(50 + dkd_random() * 70); dkd_context.fillStyle = `rgba(${dkd_value},${dkd_value + 3},${dkd_value + 6},.3)`; dkd_context.fillRect(dkd_random() * 256, dkd_random() * 256, 1, 1); } }
    else { dkd_context.fillStyle = '#52616b'; dkd_context.fillRect(0, 0, 128, 256); for (let dkd_row = 0; dkd_row < 12; dkd_row++) for (let dkd_column = 0; dkd_column < 5; dkd_column++) { const dkd_lit = dkd_random() > .38; dkd_context.fillStyle = dkd_lit ? ['#c5b992', '#a8b5bd', '#8ba0b2'][Math.floor(dkd_random() * 3)] : '#27333e'; dkd_context.fillRect(dkd_column * 25 + 4, dkd_row * 21 + 4, 16, 12); dkd_context.fillStyle = '#34414b'; dkd_context.fillRect(dkd_column * 25 + 11, dkd_row * 21 + 4, 2, 12); } }
    const dkd_texture = new dkd_three.CanvasTexture(dkd_canvas); dkd_texture.colorSpace = dkd_three.SRGBColorSpace; dkd_texture.wrapS = dkd_texture.wrapT = dkd_three.RepeatWrapping; return dkd_texture;
  }
  dkd_instances(dkd_parent, dkd_geometry, dkd_material, dkd_items) {
    const dkd_mesh = new dkd_three.InstancedMesh(dkd_geometry, dkd_material, dkd_items.length); const dkd_dummy = new dkd_three.Object3D();
    dkd_items.forEach((dkd_item, dkd_index) => { dkd_dummy.position.set(...dkd_item.dkd_position); dkd_dummy.scale.set(...(dkd_item.dkd_scale || [1, 1, 1])); dkd_dummy.rotation.set(...(dkd_item.dkd_rotation || [0, 0, 0])); dkd_dummy.updateMatrix(); dkd_mesh.setMatrixAt(dkd_index, dkd_dummy.matrix); if (dkd_item.dkd_color) dkd_mesh.setColorAt(dkd_index, new dkd_three.Color(dkd_item.dkd_color)); });
    dkd_mesh.computeBoundingSphere(); dkd_parent.add(dkd_mesh); return dkd_mesh;
  }
  dkd_buildCity() {
    this.dkd_box(this.dkd_world, [2100, 1, 2250], [0, -1, 0], this.dkd_material('#454e49'));
    const dkd_roadItems = []; const dkd_sidewalkItems = []; const dkd_stripeItems = []; const dkd_poleItems = []; const dkd_lampItems = []; const dkd_random = dkd_rng(6411);
    for (const dkd_edge of this.dkd_graph.dkd_edges) {
      const dkd_start = this.dkd_graph.dkd_points[dkd_edge.dkd_from]; const dkd_end = this.dkd_graph.dkd_points[dkd_edge.dkd_to]; const dkd_mid = [(dkd_start[0] + dkd_end[0]) / 2, .01, (dkd_start[1] + dkd_end[1]) / 2]; const dkd_heading = Math.atan2(dkd_end[0] - dkd_start[0], dkd_end[1] - dkd_start[1]);
      dkd_roadItems.push({ dkd_position: dkd_mid, dkd_scale: [dkd_edge.dkd_width, .12, dkd_edge.dkd_length + .6], dkd_rotation: [0, dkd_heading, 0] });
      dkd_sidewalkItems.push({ dkd_position: [dkd_mid[0], -.02, dkd_mid[2]], dkd_scale: [dkd_edge.dkd_width + 5, .14, dkd_edge.dkd_length + 2], dkd_rotation: [0, dkd_heading, 0] });
      if (dkd_edge.dkd_width >= 8) for (let dkd_step = 4; dkd_step < dkd_edge.dkd_length - 3; dkd_step += 10) dkd_stripeItems.push({ dkd_position: [dkd_start[0] + Math.sin(dkd_heading) * dkd_step, .084, dkd_start[1] + Math.cos(dkd_heading) * dkd_step], dkd_scale: [.12, .012, 3.5], dkd_rotation: [0, dkd_heading, 0] });
      if (dkd_edge.dkd_length > 15 && dkd_random() > .48) { const dkd_side = dkd_edge.dkd_width / 2 + 1.8; const dkd_lampX = dkd_mid[0] + Math.cos(dkd_heading) * dkd_side; const dkd_lampZ = dkd_mid[2] - Math.sin(dkd_heading) * dkd_side; dkd_poleItems.push({ dkd_position: [dkd_lampX, 4.4, dkd_lampZ], dkd_scale: [.16, 9, .16] }); dkd_lampItems.push({ dkd_position: [dkd_lampX, 8.9, dkd_lampZ], dkd_scale: [.9, .12, .65] }); }
    }
    this.dkd_instances(this.dkd_world, new dkd_three.BoxGeometry(1, 1, 1), this.dkd_material('#85908c'), dkd_sidewalkItems);
    this.dkd_asphaltMaterial = this.dkd_material('#a8adb1', .38, .18); this.dkd_asphaltMaterial.map = this.dkd_texture('asphalt');
    this.dkd_instances(this.dkd_world, new dkd_three.BoxGeometry(1, 1, 1), this.dkd_asphaltMaterial, dkd_roadItems);
    this.dkd_instances(this.dkd_world, new dkd_three.BoxGeometry(1, 1, 1), this.dkd_material('#c7cabd', .5), dkd_stripeItems);
    this.dkd_instances(this.dkd_world, new dkd_three.BoxGeometry(1, 1, 1), this.dkd_material('#68737e', .35, .5), dkd_poleItems);
    this.dkd_lamps = this.dkd_instances(this.dkd_world, new dkd_three.BoxGeometry(1, 1, 1), new dkd_three.MeshBasicMaterial({ color: '#f3dcb3' }), dkd_lampItems);
    const dkd_buildings = []; const dkd_roofs = []; const dkd_trees = []; const dkd_trunks = []; const dkd_buildingTexture = this.dkd_texture('windows');
    for (let dkd_column = -780; dkd_column < 800; dkd_column += 34) for (let dkd_row = -850; dkd_row < 850; dkd_row += 38) {
      const dkd_position = [dkd_column + dkd_random() * 8, dkd_row + dkd_random() * 8]; const dkd_near = dkd_nearestRoad(this.dkd_graph, dkd_position);
      if (dkd_near.dkd_distance < dkd_near.dkd_edge.dkd_width / 2 + 18) continue;
      if (dkd_random() < .14) { dkd_trunks.push({ dkd_position: [dkd_position[0], 2, dkd_position[1]], dkd_scale: [.5, 4, .5] }); dkd_trees.push({ dkd_position: [dkd_position[0], 5.5, dkd_position[1]], dkd_scale: [4, 5, 4] }); continue; }
      const dkd_height = 12 + dkd_random() ** 1.7 * 66; const dkd_width = 15 + dkd_random() * 10; const dkd_depth = 16 + dkd_random() * 11;
      dkd_buildings.push({ dkd_position: [dkd_position[0], dkd_height / 2, dkd_position[1]], dkd_scale: [dkd_width, dkd_height, dkd_depth], dkd_color: ['#b3b6b3', '#8e9ba7', '#bbb2a2', '#97a7ae', '#96999c'][Math.floor(dkd_random() * 5)] });
      dkd_roofs.push({ dkd_position: [dkd_position[0], dkd_height + .3, dkd_position[1]], dkd_scale: [dkd_width + .5, .6, dkd_depth + .5] });
    }
    const dkd_buildingMaterial = this.dkd_material('#d4d7d9', .6, .17); dkd_buildingMaterial.map = dkd_buildingTexture; dkd_buildingMaterial.emissiveMap = dkd_buildingTexture; dkd_buildingMaterial.emissive.set('#768ba0'); dkd_buildingMaterial.emissiveIntensity = .15;
    this.dkd_buildingMaterial = dkd_buildingMaterial;
    this.dkd_instances(this.dkd_world, new dkd_three.BoxGeometry(1, 1, 1), dkd_buildingMaterial, dkd_buildings);
    this.dkd_instances(this.dkd_world, new dkd_three.BoxGeometry(1, 1, 1), this.dkd_material('#657077'), dkd_roofs);
    this.dkd_instances(this.dkd_world, new dkd_three.CylinderGeometry(1, 1, 1, 5), this.dkd_material('#51453d'), dkd_trunks);
    this.dkd_instances(this.dkd_world, new dkd_three.IcosahedronGeometry(1, 1), this.dkd_material('#3c6054'), dkd_trees);
  }
  dkd_sign(dkd_text, dkd_width = 6, dkd_color = '#e4ff5e', dkd_height = 1.1) {
    const dkd_canvas = document.createElement('canvas'); dkd_canvas.width = 1024; dkd_canvas.height = 180; const dkd_context = dkd_canvas.getContext('2d'); dkd_context.fillStyle = '#17252d'; dkd_context.fillRect(0, 0, 1024, 180); dkd_context.fillStyle = dkd_color; dkd_context.font = 'bold 75px sans-serif'; dkd_context.textAlign = 'center'; dkd_context.textBaseline = 'middle'; dkd_context.fillText(dkd_text.slice(0, 32), 512, 91, 970);
    if (this.dkd_state.dkd_profile && dkd_text === this.dkd_state.dkd_profile.dkd_company.toUpperCase()) {
      dkd_context.clearRect(0, 0, 1024, 180); dkd_context.fillStyle = '#17252d'; dkd_context.fillRect(0, 0, 1024, 180); dkd_context.fillStyle = dkd_color;
      dkd_context.beginPath();
      if (this.dkd_state.dkd_brand.dkd_logo === 'eagle') { dkd_context.moveTo(25, 55); dkd_context.lineTo(78, 76); dkd_context.lineTo(110, 43); dkd_context.lineTo(141, 76); dkd_context.lineTo(195, 55); dkd_context.lineTo(164, 115); dkd_context.lineTo(131, 105); dkd_context.lineTo(110, 143); dkd_context.lineTo(88, 105); dkd_context.lineTo(57, 115); }
      else if (this.dkd_state.dkd_brand.dkd_logo === 'bolt') { dkd_context.moveTo(125, 28); dkd_context.lineTo(65, 103); dkd_context.lineTo(112, 103); dkd_context.lineTo(90, 156); dkd_context.lineTo(154, 77); dkd_context.lineTo(111, 77); }
      else { dkd_context.moveTo(110, 27); dkd_context.lineTo(166, 88); dkd_context.lineTo(110, 152); dkd_context.lineTo(53, 88); }
      dkd_context.closePath(); dkd_context.fill(); dkd_context.font = 'bold 66px sans-serif'; dkd_context.fillText(dkd_text.slice(0,32), 616, 93, 744);
    }
    const dkd_texture = new dkd_three.CanvasTexture(dkd_canvas); dkd_texture.colorSpace = dkd_three.SRGBColorSpace;
    return new dkd_three.Mesh(new dkd_three.PlaneGeometry(dkd_width, dkd_height), new dkd_three.MeshBasicMaterial({ map: dkd_texture, side: dkd_three.DoubleSide }));
  }
  dkd_buildHub() {
    const dkd_wall = this.dkd_material('#26333c'); const dkd_concrete = this.dkd_material('#5d6870', .6); const dkd_metal = this.dkd_material('#1d2a33', .32, .6); const dkd_yellow = this.dkd_material('#e4ff5e', .55);
    this.dkd_box(this.dkd_hub, [26, .25, 25], [0, -.14, 0], this.dkd_material('#566069', .3, .25));
    this.dkd_box(this.dkd_hub, [26, 9, .4], [0, 4.5, -7], dkd_wall); this.dkd_box(this.dkd_hub, [.4, 9, 23], [-9, 4.5, 2], dkd_concrete);
    for (let dkd_index = 0; dkd_index < 7; dkd_index++) this.dkd_box(this.dkd_hub, [6, .06, .15], [5.5, .025, -4 + dkd_index * 1.6], dkd_yellow, -.45);
    for (let dkd_index = 0; dkd_index < 8; dkd_index++) this.dkd_box(this.dkd_hub, [5.5, .09, .1], [4.5, 1 + dkd_index * .55, -6.76], this.dkd_material('#58646c'));
    this.dkd_box(this.dkd_hub, [5.7, 5.5, .25], [4.5, 2.8, -6.82], dkd_metal);
    this.dkd_companySign = this.dkd_sign(this.dkd_state.dkd_profile?.dkd_company?.toUpperCase() || 'YOUR NEXT CHAPTER', 10, this.dkd_state.dkd_brand.dkd_color, 1.75); this.dkd_companySign.position.set(-.5, 6.8, -6.72); this.dkd_hub.add(this.dkd_companySign);
    const dkd_garageSign = this.dkd_sign('LAST MILE / DISPATCH HQ', 5.5, '#bac4cc', .75); dkd_garageSign.position.set(-4.5, 4.7, -6.69); this.dkd_hub.add(dkd_garageSign);
    this.dkd_box(this.dkd_hub, [4, .25, 1.6], [-5, 1.5, -4.5], dkd_concrete); this.dkd_box(this.dkd_hub, [.2, 1.5, 1.3], [-6.6, .75, -4.5], dkd_metal); this.dkd_box(this.dkd_hub, [.2, 1.5, 1.3], [-3.4, .75, -4.5], dkd_metal);
    this.dkd_box(this.dkd_hub, [.5, .07, .9], [-4.5, 1.67, -4.2], this.dkd_material('#63bebb', .2, .5));
    for (let dkd_index = 0; dkd_index < 5; dkd_index++) this.dkd_box(this.dkd_hub, [.8, .65, .7], [-7.8 + (dkd_index % 2) * 1, .35 + Math.floor(dkd_index / 2) * .7, -4.5], this.dkd_material('#ac9170'));
    this.dkd_box(this.dkd_hub, [13, .07, .3], [-1, 8.2, -5.5], new dkd_three.MeshBasicMaterial({ color: '#f0e5cf' }));
    this.dkd_hubLight = new dkd_three.PointLight('#bdd6e4', 55, 30, 1); this.dkd_hubLight.position.set(1, 6, 1); this.dkd_hub.add(this.dkd_hubLight);
    this.dkd_hubLevels = [new dkd_three.Group(), new dkd_three.Group(), new dkd_three.Group()];
    this.dkd_hubLevels.forEach(dkd_group => this.dkd_hub.add(dkd_group));
    this.dkd_box(this.dkd_hubLevels[0], [3, .16, 1.2], [-5, 1.5, -4.9], dkd_metal);
    for (const dkd_x of [-6, -4]) this.dkd_box(this.dkd_hubLevels[0], [.12, 1.5, 1], [dkd_x, .75, -4.9], dkd_metal);
    for (let dkd_i = 0; dkd_i < 4; dkd_i++) this.dkd_box(this.dkd_hubLevels[0], [.46, .3, .4], [-6 + dkd_i * .6, 1.75, -4.9], dkd_yellow);
    this.dkd_box(this.dkd_hubLevels[1], [2.5, 1.4, .2], [-4.6, 3.3, -6.6], dkd_metal);
    this.dkd_box(this.dkd_hubLevels[1], [2.2, 1.1, .22], [-4.6, 3.3, -6.57], new dkd_three.MeshBasicMaterial({ color: '#5e9b9e' }));
    this.dkd_box(this.dkd_hubLevels[2], [20, .2, 3], [.2, 5.2, -5], dkd_metal);
    for (let dkd_i = 0; dkd_i < 12; dkd_i++) this.dkd_box(this.dkd_hubLevels[2], [.04, 1.1, .04], [-8 + dkd_i * 1.5, 5.85, -3.6], dkd_concrete);
    this.dkd_box(this.dkd_hubLevels[2], [18, .06, .06], [.2, 6.4, -3.6], dkd_yellow);
    this.dkd_hubLevels.forEach((dkd_group, dkd_index) => { dkd_group.visible = this.dkd_state.dkd_garage > dkd_index; });
    this.dkd_vault = new dkd_three.Group(); this.dkd_scene.add(this.dkd_vault); this.dkd_box(this.dkd_vault, [28, .3, 28], [0, -.2, 0], this.dkd_material('#303d49', .25, .4)); this.dkd_box(this.dkd_vault, [25, 10, .5], [0, 4.8, -8], this.dkd_material('#101d2a'));
    const dkd_vaultSign = this.dkd_sign('THE VAULT', 9, '#e4ff5e', 1.6); dkd_vaultSign.position.set(0, 7, -7.6); this.dkd_vault.add(dkd_vaultSign);
    for (let dkd_index = 0; dkd_index < 3; dkd_index++) {
      const dkd_column = (dkd_index - 1) * 5.8; this.dkd_box(this.dkd_vault, [4.2, 1.5, 3.5], [dkd_column, .75, -2.5], this.dkd_material('#69777e', .35, .5)); this.dkd_box(this.dkd_vault, [4.3, .09, 3.6], [dkd_column, 1.53, -2.5], dkd_yellow);
      if (dkd_index === 1) { this.dkd_box(this.dkd_vault, [2.9, 1.9, .12], [dkd_column, 3.3, -2.8], this.dkd_material('#27363d', .25, .65)); this.dkd_box(this.dkd_vault, [2.55, 1.55, .13], [dkd_column, 3.3, -2.72], new dkd_three.MeshBasicMaterial({ color: '#6089a5' })); this.dkd_box(this.dkd_vault, [2.9, .12, 1.9], [dkd_column, 2.3, -2], dkd_metal); }
      else { this.dkd_box(this.dkd_vault, [dkd_index === 0 ? 1.1 : 1.8, 2.4, .16], [dkd_column, 3, -2.5], this.dkd_material('#667b88', .15, .7)); this.dkd_box(this.dkd_vault, [dkd_index === 0 ? .92 : 1.6, 2.14, .17], [dkd_column, 3, -2.4], new dkd_three.MeshBasicMaterial({ color: '#608b95' })); }
      this.dkd_box(this.dkd_vault, [4.4, 4.6, 3.6], [dkd_column, 3.9, -2.5], new dkd_three.MeshPhysicalMaterial({ color: '#aec8d4', transparent: true, opacity: .09, metalness: 0, roughness: .1, depthWrite: false }));
    }
  }
  dkd_buildBike(dkd_kind = 'scooter') {
    if (this.dkd_bike) { this.dkd_scene.remove(this.dkd_bike); const dkd_materials = new Set(); this.dkd_bike.traverse(dkd_object => { if (dkd_object.isMesh) { dkd_object.geometry.dispose(); dkd_materials.add(dkd_object.material); } }); for (const dkd_material of dkd_materials) { dkd_material.map?.dispose(); dkd_material.dispose(); } }
    this.dkd_bike = new dkd_three.Group(); this.dkd_scene.add(this.dkd_bike); this.dkd_wheels = [];
    const dkd_brand = this.dkd_state.dkd_brand; const dkd_wearing = this.dkd_state.dkd_wearing; const dkd_paint = this.dkd_material(dkd_brand.dkd_color, .28, .45); const dkd_rubber = this.dkd_material('#151b22', .88); const dkd_steel = this.dkd_material(dkd_wearing.includes('dkd_rims') ? '#cbb76e' : '#86929e', .28, .86); const dkd_dark = this.dkd_material('#27323b', .6, .3); const dkd_jacket = this.dkd_material(dkd_wearing.includes('dkd_raincoat') ? dkd_brand.dkd_color : dkd_brand.dkd_uniform, .8); const dkd_skin = this.dkd_material('#b69a84', .8);
    this.dkd_bikeKind = dkd_kind;
    if (dkd_kind === 'car' || dkd_kind === 'van') {
      this.dkd_box(this.dkd_bike, [1.8, .65, 3.9], [0, .83, 0], dkd_paint); this.dkd_box(this.dkd_bike, [1.68, dkd_kind === 'van' ? 1.8 : .8, dkd_kind === 'van' ? 3 : 2.4], [0, dkd_kind === 'van' ? 1.95 : 1.55, -.15], dkd_dark); this.dkd_box(this.dkd_bike, [1.5, .65, .04], [0, 1.7, 1.07], this.dkd_material('#4c6d82', .18, .4));
      for (const dkd_side of [-1, 1]) for (const dkd_axle of [-1.25, 1.25]) this.dkd_wheels.push(this.dkd_cylinder(this.dkd_bike, .40, .22, [dkd_side * .91, .43, dkd_axle], dkd_rubber, [0, 0, Math.PI / 2]));
      for (const dkd_side of [-1, 1]) this.dkd_box(this.dkd_bike, [.48, .2, .05], [dkd_side * .59, 1, 1.98], new dkd_three.MeshBasicMaterial({ color: '#fbecd3' }));
      return;
    }
    for (const dkd_axle of [-.98, 1.08]) {
      const dkd_wheel = new dkd_three.Group(); dkd_wheel.position.set(0, .40, dkd_axle); this.dkd_bike.add(dkd_wheel); this.dkd_wheels.push(dkd_wheel);
      const dkd_tire = new dkd_three.Mesh(new dkd_three.TorusGeometry(.30, .105, 10, 26), dkd_rubber); dkd_tire.rotation.y = Math.PI / 2; dkd_wheel.add(dkd_tire); this.dkd_cylinder(dkd_wheel, .24, .13, [0, 0, 0], dkd_steel, [0, 0, Math.PI / 2]);
      this.dkd_cylinder(dkd_wheel, .19, .14, [0, 0, 0], dkd_dark, [0, 0, Math.PI / 2]);
      for (let dkd_spoke = 0; dkd_spoke < 5; dkd_spoke++) { const dkd_mesh = this.dkd_box(dkd_wheel, [.15, .025, .43], [0, 0, 0], dkd_steel); dkd_mesh.rotation.x = dkd_spoke * Math.PI / 5; }
    }
    this.dkd_box(this.dkd_bike, [.60, .38, 1.14], [0, .70, -.43], dkd_paint); this.dkd_box(this.dkd_bike, [.47, .14, .90], [0, .94, -.45], dkd_rubber); this.dkd_box(this.dkd_bike, [.48, .10, .70], [0, .38, .26], dkd_dark);
    this.dkd_cylinder(this.dkd_bike, dkd_wearing.includes('dkd_exhaust') ? .16 : .13, dkd_wearing.includes('dkd_exhaust') ? .82 : .62, [.34, .55, -.78], dkd_steel, [Math.PI / 2, 0, 0]);
    const dkd_front = this.dkd_box(this.dkd_bike, [.62, .75, .24], [0, .79, .77], dkd_paint); dkd_front.rotation.x = -.23;
    this.dkd_box(this.dkd_bike, [.72, .25, .40], [0, 1.31, .77], dkd_paint); this.dkd_box(this.dkd_bike, [.46, .16, .02], [0, 1.30, .98], new dkd_three.MeshBasicMaterial({ color: '#f5f1d6' }));
    for (const dkd_side of [-1, 1]) { this.dkd_cylinder(this.dkd_bike, .042, .85, [dkd_side * .15, .81, .99], dkd_steel, [-.20, 0, 0]); this.dkd_cylinder(this.dkd_bike, .04, .35, [dkd_side * .46, 1.34, .72], dkd_rubber, [0, 0, Math.PI / 2]); this.dkd_cylinder(this.dkd_bike, .018, .3, [dkd_side * .47, 1.56, .81], dkd_steel, [0, 0, -.25 * dkd_side]); this.dkd_box(this.dkd_bike, [.17, .10, .07], [dkd_side * .51, 1.71, .82], dkd_steel); }
    this.dkd_box(this.dkd_bike, [.42, .15, .035], [0, .89, -1.04], new dkd_three.MeshBasicMaterial({ color: '#de5f43' }));
    this.dkd_box(this.dkd_bike, [.66, .63, .68], [0, 1.38, -.92], dkd_paint); this.dkd_box(this.dkd_bike, [.68, .08, .70], [0, 1.72, -.92], dkd_dark);
    const dkd_companyLogo = this.dkd_sign((this.dkd_state.dkd_profile?.dkd_company || 'LAST MILE').toUpperCase(), .58, '#15262b', .21); dkd_companyLogo.position.set(0, 1.4, -1.27); dkd_companyLogo.rotation.y = Math.PI; this.dkd_bike.add(dkd_companyLogo);
    this.dkd_box(this.dkd_bike, [.40, .55, .3], [0, 1.32, -.16], dkd_jacket); this.dkd_box(this.dkd_bike, [.27, .06, .02], [0, 1.33, -.321], new dkd_three.MeshBasicMaterial({ color: '#dbe4b7' }));
    for (const dkd_side of [-1, 1]) {
      const dkd_upperArm = this.dkd_cylinder(this.dkd_bike, .085, .43, [dkd_side * .29, 1.4, .10], dkd_jacket, [1.02, 0, -.35 * dkd_side]);
      this.dkd_cylinder(this.dkd_bike, .068, .39, [dkd_side * .40, 1.33, .43], dkd_jacket, [Math.PI / 2, 0, 0]); this.dkd_box(this.dkd_bike, [.13, .11, .14], [dkd_side * .46, 1.34, .66], dkd_rubber);
      this.dkd_cylinder(this.dkd_bike, .10, .53, [dkd_side * .22, .89, .13], dkd_dark, [1.1, 0, -.15 * dkd_side]); this.dkd_cylinder(this.dkd_bike, .075, .41, [dkd_side * .25, .60, .35], dkd_dark, [-.18, 0, 0]); this.dkd_box(this.dkd_bike, [.18, .12, .34], [dkd_side * .25, .38, .43], dkd_rubber);
    }
    this.dkd_cylinder(this.dkd_bike, .075, .13, [0, 1.67, -.10], dkd_skin);
    const dkd_helmet = new dkd_three.Mesh(new dkd_three.SphereGeometry(.25, 22, 14), dkd_dark); dkd_helmet.scale.set(1, 1.08, 1.1); dkd_helmet.position.set(0, 1.91, -.03); this.dkd_bike.add(dkd_helmet);
    const dkd_visor = new dkd_three.Mesh(new dkd_three.SphereGeometry(.256, 18, 8, 0, Math.PI * 2, .35, 1.1), this.dkd_material('#577b8f', .11, .6)); dkd_visor.rotation.x = Math.PI / 2; dkd_visor.position.copy(dkd_helmet.position); this.dkd_bike.add(dkd_visor);
    this.dkd_box(this.dkd_bike, [.15, .025, .24], [0, 1.46, .58], this.dkd_material('#7ed9cd', .3));
    if (dkd_wearing.includes('dkd_mount')) this.dkd_box(this.dkd_bike, [.20, .033, .31], [.22, 1.49, .61], this.dkd_material('#83d7cf', .25));
    if (dkd_wearing.includes('dkd_helmet') || this.dkd_state.dkd_cosmetics.includes('dkd_streak7')) this.dkd_box(this.dkd_bike, [.045, .03, .30], [0, 2.18, -.03], dkd_paint);
    if (dkd_wearing.includes('dkd_jacket')) this.dkd_box(this.dkd_bike, [.39, .045, .035], [0, 1.43, -.335], new dkd_three.MeshBasicMaterial({ color: '#d5e5c9' }));
    for (const dkd_side of [-1, 1]) {
      if (dkd_wearing.includes('dkd_gloves')) this.dkd_box(this.dkd_bike, [.08, .03, .10], [dkd_side * .46, 1.40, .66], dkd_paint);
      if (dkd_wearing.includes('dkd_boots')) this.dkd_box(this.dkd_bike, [.20, .055, .35], [dkd_side * .25, .33, .43], dkd_steel);
      if (dkd_wearing.includes('dkd_pants')) this.dkd_box(this.dkd_bike, [.02, .32, .065], [dkd_side * .33, .73, .30], dkd_paint);
      if (dkd_wearing.includes('dkd_livery') || this.dkd_state.dkd_cosmetics.includes('dkd_streak14')) this.dkd_box(this.dkd_bike, [.012, .10, .70], [dkd_side * .306, .74, -.39], new dkd_three.MeshBasicMaterial({ color: '#d5e5c9' }));
      if (dkd_wearing.includes('dkd_bag')) this.dkd_box(this.dkd_bike, [.02, .6, .06], [dkd_side * .23, 1.39, -1.27], dkd_dark);
    }
    if (dkd_wearing.includes('dkd_plate')) { const dkd_plate = this.dkd_sign(dkd_brand.dkd_plate, .38, '#18232b', .11); dkd_plate.material.color.set('#f6f1d9'); dkd_plate.position.set(0, .70, -1.09); dkd_plate.rotation.y = Math.PI; this.dkd_bike.add(dkd_plate); }
    if (dkd_kind === 'motorcycle') { const dkd_tank = new dkd_three.Mesh(new dkd_three.SphereGeometry(.30, 16, 10), dkd_paint); dkd_tank.scale.set(1, .65, 1.6); dkd_tank.position.set(0, .96, .28); this.dkd_bike.add(dkd_tank); }
  }
  dkd_buildTraffic() {
    this.dkd_trafficGroup = new dkd_three.Group(); this.dkd_scene.add(this.dkd_trafficGroup); this.dkd_trafficParts = [];
    const dkd_parts = [ { dkd_size: [1.65, .62, 3.8], dkd_at: [0, .70, 0], dkd_color: '#9fa9b0' }, { dkd_size: [1.45, .65, 1.95], dkd_at: [0, 1.31, -.1], dkd_color: '#334c60' }, { dkd_size: [1.4, .15, .06], dkd_at: [0, .83, 1.92], dkd_color: '#f0e7cb', dkd_basic: true }, { dkd_size: [1.4, .15, .06], dkd_at: [0, .82, -1.92], dkd_color: '#df654d', dkd_basic: true } ];
    for (const dkd_side of [-1, 1]) for (const dkd_axle of [-1.18, 1.18]) dkd_parts.push({ dkd_size: [.18, .49, .57], dkd_at: [dkd_side * .83, .36, dkd_axle], dkd_color: '#172027' });
    for (const dkd_part of dkd_parts) { const dkd_mesh = new dkd_three.InstancedMesh(new dkd_three.BoxGeometry(...dkd_part.dkd_size), dkd_part.dkd_basic ? new dkd_three.MeshBasicMaterial({ color: dkd_part.dkd_color }) : this.dkd_material(dkd_part.dkd_color, .4, .35), 40); dkd_mesh.frustumCulled = false; dkd_mesh.count = 0; this.dkd_trafficGroup.add(dkd_mesh); this.dkd_trafficParts.push({ dkd_mesh, dkd_at: dkd_part.dkd_at }); }
  }
  dkd_buildWeather() {
    const dkd_random = dkd_rng(562); this.dkd_rainPositions = new Float32Array(900 * 6); this.dkd_rainSeeds = [];
    for (let dkd_index = 0; dkd_index < 900; dkd_index++) this.dkd_rainSeeds.push([dkd_random() * 100 - 50, dkd_random() * 35, dkd_random() * 100 - 50]);
    const dkd_geometry = new dkd_three.BufferGeometry(); dkd_geometry.setAttribute('position', new dkd_three.BufferAttribute(this.dkd_rainPositions, 3));
    this.dkd_rain = new dkd_three.LineSegments(dkd_geometry, new dkd_three.LineBasicMaterial({ color: '#aac3d3', transparent: true, opacity: .33, depthWrite: false })); this.dkd_rain.frustumCulled = false; this.dkd_scene.add(this.dkd_rain);
  }
  dkd_setRoute(dkd_run) {
    for (const dkd_child of [...this.dkd_navigation.children]) { this.dkd_navigation.remove(dkd_child); dkd_child.geometry.dispose(); dkd_child.material.dispose(); }
    const dkd_points = dkd_run.dkd_route.dkd_nodes.map(dkd_node => { const dkd_point = this.dkd_graph.dkd_points[dkd_node]; return new dkd_three.Vector3(dkd_point[0], .18, dkd_point[1]); });
    const dkd_line = new dkd_three.Line(new dkd_three.BufferGeometry().setFromPoints(dkd_points), new dkd_three.LineBasicMaterial({ color: '#e4ff5e', transparent: true, opacity: .65 })); this.dkd_navigation.add(dkd_line);
    const dkd_arrows = [];
    for (let dkd_index = 1; dkd_index < dkd_points.length; dkd_index++) { const dkd_start = dkd_points[dkd_index - 1]; const dkd_end = dkd_points[dkd_index]; const dkd_length = dkd_start.distanceTo(dkd_end); const dkd_heading = Math.atan2(dkd_end.x - dkd_start.x, dkd_end.z - dkd_start.z); for (let dkd_step = 4; dkd_step < dkd_length; dkd_step += 15) dkd_arrows.push({ dkd_position: [dkd_start.x + Math.sin(dkd_heading) * dkd_step, .19, dkd_start.z + Math.cos(dkd_heading) * dkd_step], dkd_rotation: [-Math.PI / 2, 0, -dkd_heading], dkd_scale: [1.15, 1.7, 1] }); }
    const dkd_shape = new dkd_three.Shape(); dkd_shape.moveTo(-.65, -.65); dkd_shape.lineTo(0, .55); dkd_shape.lineTo(.65, -.65); dkd_shape.lineTo(0, -.25); dkd_shape.closePath(); this.dkd_instances(this.dkd_navigation, new dkd_three.ShapeGeometry(dkd_shape), new dkd_three.MeshBasicMaterial({ color: '#e4ff5e', side: dkd_three.DoubleSide }), dkd_arrows);
    const dkd_target = this.dkd_graph.dkd_points[dkd_run.dkd_order.dkd_to]; this.dkd_marker.position.set(dkd_target[0], .2, dkd_target[1]);
    this.dkd_blockers = this.dkd_blockers || new dkd_three.Group(); if (!this.dkd_blockers.parent) this.dkd_world.add(this.dkd_blockers); this.dkd_blockers.traverse(dkd_object => { if (dkd_object.isMesh) { dkd_object.geometry.dispose(); dkd_object.material.dispose(); } }); this.dkd_blockers.clear();
    for (const dkd_id of dkd_run.dkd_closed) { const dkd_edge = this.dkd_graph.dkd_edges[dkd_id]; const dkd_start = this.dkd_graph.dkd_points[dkd_edge.dkd_from]; const dkd_end = this.dkd_graph.dkd_points[dkd_edge.dkd_to]; const dkd_mid = [(dkd_start[0] + dkd_end[0]) / 2, .75, (dkd_start[1] + dkd_end[1]) / 2]; this.dkd_box(this.dkd_blockers, [dkd_edge.dkd_width, 1.4, .45], dkd_mid, this.dkd_material('#e7914e'), Math.atan2(dkd_end[0] - dkd_start[0], dkd_end[1] - dkd_start[1])); }
  }
  dkd_setMode(dkd_mode) { this.dkd_mode = dkd_mode; const dkd_drive = dkd_mode === 'drive' || dkd_mode === 'city'; this.dkd_world.visible = dkd_drive; this.dkd_hub.visible = !dkd_drive && dkd_mode !== 'vault'; this.dkd_vault.visible = dkd_mode === 'vault'; this.dkd_bike.visible = dkd_mode !== 'vault'; this.dkd_navigation.visible = dkd_mode === 'drive'; this.dkd_marker.visible = dkd_mode === 'drive'; this.dkd_trafficGroup.visible = dkd_mode === 'drive'; this.dkd_rain.visible = dkd_drive; this.dkd_ghost.visible = false; }
  dkd_resize() {
    const dkd_width = this.dkd_renderer.domElement.clientWidth || window.innerWidth; const dkd_height = this.dkd_renderer.domElement.clientHeight || window.innerHeight; this.dkd_camera.aspect = dkd_width / dkd_height; this.dkd_camera.updateProjectionMatrix();
    const dkd_quality = this.dkd_state.dkd_settings.dkd_quality; this.dkd_renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dkd_quality === 'low' ? .8 : dkd_quality === 'balanced' ? 1.15 : 1.6)); this.dkd_renderer.setSize(dkd_width, dkd_height, false); this.dkd_lastQuality = dkd_quality;
  }
  dkd_update(dkd_dt, dkd_run = null) {
    this.dkd_time += dkd_dt; if (this.dkd_lastQuality !== this.dkd_state.dkd_settings.dkd_quality) this.dkd_resize();
    if (this.dkd_mode === 'drive' && dkd_run) {
      this.dkd_bike.position.set(dkd_run.dkd_position[0], .06, dkd_run.dkd_position[1]); this.dkd_bike.rotation.y = dkd_run.dkd_heading;
      const dkd_lean = dkd_angle(dkd_run.dkd_heading - (this.dkd_lastHeading ?? dkd_run.dkd_heading)); this.dkd_bike.rotation.z = dkd_clamp(-dkd_lean * dkd_run.dkd_speed * 2.5, -.3, .3); this.dkd_lastHeading = dkd_run.dkd_heading;
      this.dkd_wheels.forEach(dkd_wheel => { if (dkd_wheel.isGroup) dkd_wheel.rotation.x += dkd_run.dkd_speed * dkd_dt / .35; });
      const dkd_near = this.dkd_state.dkd_settings.dkd_camera === 'near'; const dkd_high = this.dkd_state.dkd_settings.dkd_camera === 'high'; const dkd_back = dkd_near ? 5 : dkd_high ? 13 : 8.5; const dkd_height = dkd_near ? 3.1 : dkd_high ? 11 : 5.7;
      this.dkd_cameraTarget.set(dkd_run.dkd_position[0] - Math.sin(dkd_run.dkd_heading) * dkd_back, dkd_height, dkd_run.dkd_position[1] - Math.cos(dkd_run.dkd_heading) * dkd_back); if (this.dkd_cameraSnap) { this.dkd_camera.position.copy(this.dkd_cameraTarget); this.dkd_cameraSnap = false; } else this.dkd_camera.position.lerp(this.dkd_cameraTarget, 1 - Math.exp(-dkd_dt * 8));
      this.dkd_lookTarget.set(dkd_run.dkd_position[0] + Math.sin(dkd_run.dkd_heading) * 14, 2.1, dkd_run.dkd_position[1] + Math.cos(dkd_run.dkd_heading) * 14); this.dkd_camera.lookAt(this.dkd_lookTarget);
      const dkd_night = dkd_run.dkd_order.dkd_night; const dkd_blackout = dkd_run.dkd_order.dkd_type === 'final' || dkd_run.dkd_event?.dkd_id === 'dkd_power';
      this.dkd_scene.background.set(dkd_night ? '#17293c' : '#a9becb'); this.dkd_scene.fog.color.copy(this.dkd_scene.background); this.dkd_scene.fog.near = dkd_run.dkd_weather.dkd_id === 'dkd_fog' ? 12 : 55; this.dkd_scene.fog.far = dkd_run.dkd_weather.dkd_fog;
      this.dkd_hemi.intensity = dkd_night ? dkd_blackout ? .9 : 1.45 : 2.5; this.dkd_sun.intensity = dkd_night ? .75 : 2.4; this.dkd_buildingMaterial.emissiveIntensity = dkd_blackout ? 0 : dkd_night ? .25 : .02; this.dkd_lamps.visible = !dkd_blackout;
      this.dkd_asphaltMaterial.roughness = dkd_run.dkd_weather.dkd_rain ? .24 : .73;
      this.dkd_headlamp.visible = dkd_run.dkd_headlight; this.dkd_headlamp.position.set(dkd_run.dkd_position[0] + Math.sin(dkd_run.dkd_heading), 1.25, dkd_run.dkd_position[1] + Math.cos(dkd_run.dkd_heading)); this.dkd_headlamp.target.position.set(dkd_run.dkd_position[0] + Math.sin(dkd_run.dkd_heading) * 20, .0, dkd_run.dkd_position[1] + Math.cos(dkd_run.dkd_heading) * 20);
      this.dkd_navigation.visible = dkd_run.dkd_signal; this.dkd_marker.children[1].rotation.y += dkd_dt;
      for (const dkd_part of this.dkd_trafficParts) { dkd_part.dkd_mesh.count = dkd_run.dkd_traffic.length; dkd_run.dkd_traffic.forEach((dkd_car, dkd_index) => { this.dkd_dummy.position.set(dkd_car.dkd_position[0] + Math.cos(dkd_car.dkd_heading) * dkd_part.dkd_at[0] + Math.sin(dkd_car.dkd_heading) * dkd_part.dkd_at[2], dkd_part.dkd_at[1], dkd_car.dkd_position[1] - Math.sin(dkd_car.dkd_heading) * dkd_part.dkd_at[0] + Math.cos(dkd_car.dkd_heading) * dkd_part.dkd_at[2]); this.dkd_dummy.rotation.set(0, dkd_car.dkd_heading, 0); this.dkd_dummy.scale.set(1, 1, 1); this.dkd_dummy.updateMatrix(); dkd_part.dkd_mesh.setMatrixAt(dkd_index, this.dkd_dummy.matrix); }); dkd_part.dkd_mesh.instanceMatrix.needsUpdate = true; }
      this.dkd_rain.visible = dkd_run.dkd_weather.dkd_rain > 0; const dkd_count = this.dkd_state.dkd_settings.dkd_quality === 'low' ? 220 : 700; this.dkd_rain.geometry.setDrawRange(0, dkd_count * 2);
      if (this.dkd_rain.visible) { for (let dkd_index = 0; dkd_index < dkd_count; dkd_index++) { const dkd_seed = this.dkd_rainSeeds[dkd_index]; const dkd_heightNow = (dkd_seed[1] - this.dkd_time * (dkd_run.dkd_weather.dkd_id === 'dkd_snow' ? 2.5 : 19) % 35 + 35) % 35; const dkd_base = dkd_index * 6; this.dkd_rainPositions[dkd_base] = dkd_run.dkd_position[0] + dkd_seed[0]; this.dkd_rainPositions[dkd_base + 1] = dkd_heightNow; this.dkd_rainPositions[dkd_base + 2] = dkd_run.dkd_position[1] + dkd_seed[2]; this.dkd_rainPositions[dkd_base + 3] = this.dkd_rainPositions[dkd_base] + .12; this.dkd_rainPositions[dkd_base + 4] = dkd_heightNow + (dkd_run.dkd_weather.dkd_id === 'dkd_snow' ? .12 : .75); this.dkd_rainPositions[dkd_base + 5] = this.dkd_rainPositions[dkd_base + 2]; } this.dkd_rain.geometry.attributes.position.needsUpdate = true; }
      const dkd_ghost = this.dkd_state.dkd_ghost; this.dkd_ghost.visible = Boolean(dkd_ghost && dkd_run.dkd_order.dkd_type === 'final' && dkd_ghost.dkd_season === this.dkd_state.dkd_season);
      if (this.dkd_ghost.visible) { const dkd_frame = dkd_ghost.dkd_frames[Math.min(dkd_ghost.dkd_frames.length - 1, Math.floor(dkd_run.dkd_elapsed * 2))]; this.dkd_ghost.position.set(dkd_frame[1], .07, dkd_frame[2]); this.dkd_ghost.rotation.y = dkd_frame[3]; }
    } else {
      this.dkd_bike.position.set(0, .05, 0); this.dkd_bike.rotation.set(0, -.4, 0); this.dkd_scene.background.set('#192631'); this.dkd_scene.fog.color.set('#192631'); this.dkd_scene.fog.near = 28; this.dkd_scene.fog.far = 90; this.dkd_hemi.intensity = 2; this.dkd_sun.intensity = 2.5; this.dkd_headlamp.visible = false;
      if (this.dkd_mode === 'vault') { this.dkd_camera.position.set(Math.sin(this.dkd_time * .07) * 1.2, 4.5, 13.5); this.dkd_camera.lookAt(0, 3.3, -3); }
      else { const dkd_phase = Math.sin(this.dkd_time * .10) * .22; this.dkd_camera.position.set(4.2 + dkd_phase * 2, 2.8, 6.2); this.dkd_camera.lookAt(-.15, 1.30, -.65); }
    }
    this.dkd_renderer.render(this.dkd_scene, this.dkd_camera);
  }
  dkd_photo() { this.dkd_renderer.render(this.dkd_scene, this.dkd_camera); return this.dkd_renderer.domElement.toDataURL('image/jpeg', .9); }
  dkd_refreshBrand(dkd_kind = this.dkd_bikeKind) { this.dkd_hubLevels.forEach((dkd_group, dkd_index) => { dkd_group.visible = this.dkd_state.dkd_garage > dkd_index; }); this.dkd_buildBike(dkd_kind); this.dkd_hub.remove(this.dkd_companySign); this.dkd_companySign.geometry.dispose(); this.dkd_companySign.material.map.dispose(); this.dkd_companySign.material.dispose(); this.dkd_companySign = this.dkd_sign(this.dkd_state.dkd_profile?.dkd_company?.toUpperCase() || 'LAST MILE', 10, this.dkd_state.dkd_brand.dkd_color, 1.75); this.dkd_companySign.position.set(-.5, 6.8, -6.72); this.dkd_hub.add(this.dkd_companySign); }
}

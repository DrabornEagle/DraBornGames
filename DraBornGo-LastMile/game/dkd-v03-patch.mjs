// DraBornGo / Last Mile v0.3 gameplay, camera, model and audio update.
// Loaded after the v0.2 compatibility patches so older saves remain usable.

const dkd_v03_modelPack = dkd_v03_modelChunk0 + dkd_v03_modelChunk1 + dkd_v03_modelChunk2 + dkd_v03_modelChunk3 + dkd_v03_modelChunk4 + dkd_v03_modelChunk5 + dkd_v03_modelChunk6 + dkd_v03_modelChunk7 + dkd_v03_modelChunk8;

// v0.3 defaults: free steering and the high driving camera. Existing saves are
// migrated once, then the player's later setting choices are preserved.
const dkd_v03_baseDefaultState = dkd_defaultState;
dkd_defaultState = function() {
  const dkd_state = dkd_v03_baseDefaultState();
  dkd_state.dkd_settings.dkd_assist = false;
  dkd_state.dkd_settings.dkd_camera = 'high';
  dkd_state.dkd_settings.dkd_music = .82;
  dkd_state.dkd_settings.dkd_effects = .9;
  dkd_state.dkd_settings.dkd_v03DefaultsApplied = true;
  return dkd_state;
};

const dkd_v03_baseRestoreState = dkd_restoreState;
dkd_restoreState = function(dkd_raw) {
  const dkd_state = dkd_v03_baseRestoreState(dkd_raw);
  if (dkd_raw?.dkd_settings?.dkd_v03DefaultsApplied !== true) {
    dkd_state.dkd_settings.dkd_assist = false;
    dkd_state.dkd_settings.dkd_camera = 'high';
    if (!Number.isFinite(dkd_raw?.dkd_settings?.dkd_music) || dkd_raw.dkd_settings.dkd_music <= .55) dkd_state.dkd_settings.dkd_music = .82;
    if (!Number.isFinite(dkd_raw?.dkd_settings?.dkd_effects) || dkd_raw.dkd_settings.dkd_effects <= .8) dkd_state.dkd_settings.dkd_effects = .9;
  }
  dkd_state.dkd_settings.dkd_v03DefaultsApplied = true;
  return dkd_state;
};

function dkd_v03_disposeBike(dkd_bike) {
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

function dkd_v03_need(dkd_offset, dkd_length, dkd_total, dkd_label) {
  if (dkd_offset < 0 || dkd_length < 0 || dkd_offset + dkd_length > dkd_total) throw new Error(`v0.3 model verisi eksik: ${dkd_label}`);
}

function dkd_v03_readScooterRider() {
  const dkd_binary = atob(dkd_v03_modelPack);
  const dkd_bytes = new Uint8Array(dkd_binary.length);
  for (let dkd_index = 0; dkd_index < dkd_binary.length; dkd_index++) dkd_bytes[dkd_index] = dkd_binary.charCodeAt(dkd_index);
  dkd_v03_need(0, 6, dkd_bytes.length, 'başlık');
  const dkd_view = new DataView(dkd_bytes.buffer, dkd_bytes.byteOffset, dkd_bytes.byteLength);
  const dkd_signature = String.fromCharCode(...dkd_bytes.slice(0, 4));
  if (dkd_signature !== 'DK31') throw new Error('v0.3 scooter + sürücü paketi geçersiz.');
  const dkd_meshCount = dkd_view.getUint16(4, true);
  if (dkd_meshCount < 1 || dkd_meshCount > 96) throw new Error('v0.3 model mesh sayısı geçersiz.');

  const dkd_group = new dkd_three.Group();
  let dkd_offset = 6;
  for (let dkd_meshIndex = 0; dkd_meshIndex < dkd_meshCount; dkd_meshIndex++) {
    dkd_v03_need(dkd_offset, 35, dkd_bytes.length, `mesh ${dkd_meshIndex + 1} başlığı`);
    const dkd_vertexCount = dkd_view.getUint16(dkd_offset, true);
    const dkd_faceCount = dkd_view.getUint16(dkd_offset + 2, true);
    if (dkd_vertexCount < 3 || dkd_vertexCount > 12000 || dkd_faceCount < 1 || dkd_faceCount > 24000) throw new Error(`v0.3 mesh ${dkd_meshIndex + 1} boyutu geçersiz.`);
    const dkd_red = dkd_bytes[dkd_offset + 4];
    const dkd_green = dkd_bytes[dkd_offset + 5];
    const dkd_blue = dkd_bytes[dkd_offset + 6];
    const dkd_alpha = dkd_bytes[dkd_offset + 7];
    const dkd_metalness = dkd_bytes[dkd_offset + 8] / 255;
    const dkd_roughness = dkd_bytes[dkd_offset + 9] / 255;
    const dkd_opacity = dkd_bytes[dkd_offset + 10] / 255;
    const dkd_min = [
      dkd_view.getFloat32(dkd_offset + 11, true),
      dkd_view.getFloat32(dkd_offset + 15, true),
      dkd_view.getFloat32(dkd_offset + 19, true)
    ];
    const dkd_max = [
      dkd_view.getFloat32(dkd_offset + 23, true),
      dkd_view.getFloat32(dkd_offset + 27, true),
      dkd_view.getFloat32(dkd_offset + 31, true)
    ];
    if (![...dkd_min, ...dkd_max].every(dkd_value => Number.isFinite(dkd_value) && Math.abs(dkd_value) < 100)) throw new Error(`v0.3 mesh ${dkd_meshIndex + 1} sınırı geçersiz.`);
    if (!dkd_min.every((dkd_value, dkd_axis) => dkd_value <= dkd_max[dkd_axis])) throw new Error(`v0.3 mesh ${dkd_meshIndex + 1} sınır sırası geçersiz.`);

    dkd_offset += 35;
    dkd_v03_need(dkd_offset, dkd_vertexCount * 3, dkd_bytes.length, `mesh ${dkd_meshIndex + 1} konum verisi`);
    const dkd_positions = new Float32Array(dkd_vertexCount * 3);
    for (let dkd_vertex = 0; dkd_vertex < dkd_vertexCount; dkd_vertex++) {
      for (let dkd_axis = 0; dkd_axis < 3; dkd_axis++) {
        const dkd_quantized = dkd_bytes[dkd_offset++];
        dkd_positions[dkd_vertex * 3 + dkd_axis] = dkd_min[dkd_axis] + (dkd_max[dkd_axis] - dkd_min[dkd_axis]) * dkd_quantized / 255;
      }
    }
    const dkd_indices = new Uint16Array(dkd_faceCount * 3);
    let dkd_previousIndex = 0;
    for (let dkd_index = 0; dkd_index < dkd_indices.length; dkd_index++) {
      let dkd_unsigned = 0;
      let dkd_shift = 0;
      let dkd_byte = 0;
      do {
        dkd_v03_need(dkd_offset, 1, dkd_bytes.length, `mesh ${dkd_meshIndex + 1} indeks verisi`);
        dkd_byte = dkd_bytes[dkd_offset++];
        dkd_unsigned |= (dkd_byte & 0x7f) << dkd_shift;
        dkd_shift += 7;
        if (dkd_shift > 28) throw new Error(`v0.3 mesh ${dkd_meshIndex + 1} indeks kodu geçersiz.`);
      } while (dkd_byte & 0x80);
      const dkd_delta = (dkd_unsigned >>> 1) ^ -(dkd_unsigned & 1);
      dkd_previousIndex += dkd_delta;
      if (dkd_previousIndex < 0 || dkd_previousIndex >= dkd_vertexCount) throw new Error(`v0.3 mesh ${dkd_meshIndex + 1} indeks verisi geçersiz.`);
      dkd_indices[dkd_index] = dkd_previousIndex;
    }

    const dkd_geometry = new dkd_three.BufferGeometry();
    dkd_geometry.setAttribute('position', new dkd_three.BufferAttribute(dkd_positions, 3));
    dkd_geometry.setIndex(new dkd_three.BufferAttribute(dkd_indices, 1));
    dkd_geometry.computeVertexNormals();
    dkd_geometry.computeBoundingSphere();
    const dkd_hex = `#${dkd_red.toString(16).padStart(2, '0')}${dkd_green.toString(16).padStart(2, '0')}${dkd_blue.toString(16).padStart(2, '0')}`;
    const dkd_material = new dkd_three.MeshStandardMaterial({
      color: new dkd_three.Color(dkd_hex),
      metalness: dkd_metalness,
      roughness: dkd_roughness,
      transparent: dkd_opacity < .99 || dkd_alpha < 250,
      opacity: Math.min(dkd_opacity, dkd_alpha / 255),
      depthWrite: dkd_opacity > .72
    });
    dkd_group.add(new dkd_three.Mesh(dkd_geometry, dkd_material));
  }
  if (dkd_offset !== dkd_bytes.length) throw new Error('v0.3 scooter + sürücü paket sonu geçersiz.');
  return dkd_group;
}

// Replace the temporary v0.2 rider with the uploaded coloured scooter + rider
// model. Other vehicles continue using their existing procedural geometry.
const dkd_v03_baseBuildBike = dkd_Scene.prototype.dkd_buildBike;
dkd_Scene.prototype.dkd_buildBike = function(dkd_kind = 'scooter') {
  if (dkd_kind !== 'scooter' || this.dkd_state.dkd_equipped !== 'dkd_city50') return dkd_v03_baseBuildBike.call(this, dkd_kind);
  try {
    if (this.dkd_bike) {
      this.dkd_scene.remove(this.dkd_bike);
      dkd_v03_disposeBike(this.dkd_bike);
    }
    this.dkd_bike = new dkd_three.Group();
    this.dkd_scene.add(this.dkd_bike);
    this.dkd_wheels = [];
    this.dkd_bikeKind = dkd_kind;
    const dkd_model = dkd_v03_readScooterRider();
    dkd_model.scale.setScalar(1.16);
    this.dkd_bike.add(dkd_model);
    return this.dkd_bike;
  } catch (dkd_error) {
    console.warn('v0.3 scooter + sürücü modeli okunamadı; güvenli modele dönülüyor.', dkd_error);
    return dkd_v03_baseBuildBike.call(this, dkd_kind);
  }
};

// Draw arrows in the actual route direction. The shape tip is local -Y;
// rotating -90° around X maps that tip to local +Z, then Y rotation aligns it
// with the road segment's start -> end heading.
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
  const dkd_line = new dkd_three.Line(
    new dkd_three.BufferGeometry().setFromPoints(dkd_points),
    new dkd_three.LineBasicMaterial({ color: '#e4ff5e', transparent: true, opacity: .72 })
  );
  this.dkd_navigation.add(dkd_line);

  const dkd_shape = new dkd_three.Shape();
  dkd_shape.moveTo(0, -.9);
  dkd_shape.lineTo(-.58, .48);
  dkd_shape.lineTo(0, .18);
  dkd_shape.lineTo(.58, .48);
  dkd_shape.closePath();

  const dkd_arrows = [];
  for (let dkd_index = 1; dkd_index < dkd_points.length; dkd_index++) {
    const dkd_start = dkd_points[dkd_index - 1];
    const dkd_end = dkd_points[dkd_index];
    const dkd_length = dkd_start.distanceTo(dkd_end);
    const dkd_heading = Math.atan2(dkd_end.x - dkd_start.x, dkd_end.z - dkd_start.z);
    for (let dkd_step = 5; dkd_step < dkd_length; dkd_step += 12) {
      dkd_arrows.push({
        dkd_position: [
          dkd_start.x + Math.sin(dkd_heading) * dkd_step,
          .205,
          dkd_start.z + Math.cos(dkd_heading) * dkd_step
        ],
        dkd_rotation: [-Math.PI / 2, dkd_heading, 0],
        dkd_scale: [.92, 1.22, 1]
      });
    }
  }
  if (dkd_arrows.length) this.dkd_instances(
    this.dkd_navigation,
    new dkd_three.ShapeGeometry(dkd_shape),
    new dkd_three.MeshBasicMaterial({ color: '#e4ff5e', side: dkd_three.DoubleSide, transparent: true, opacity: .92 }),
    dkd_arrows
  );
};

// Wider company-centre camera plus two-finger pinch zoom. Driving camera remains
// controlled by the normal Near / Chase / High setting.
const dkd_v03_baseSceneUpdate = dkd_Scene.prototype.dkd_update;
dkd_Scene.prototype.dkd_update = function(dkd_dt, dkd_run = null) {
  const dkd_garage = this.dkd_mode === 'garage';
  const dkd_fov = dkd_garage ? 62 : 57;
  if (Math.abs(this.dkd_camera.fov - dkd_fov) > .01) {
    this.dkd_camera.fov = dkd_fov;
    this.dkd_camera.updateProjectionMatrix();
  }
  if (!dkd_garage) return dkd_v03_baseSceneUpdate.call(this, dkd_dt, dkd_run);

  const dkd_render = this.dkd_renderer.render;
  this.dkd_renderer.render = () => {};
  try {
    dkd_v03_baseSceneUpdate.call(this, dkd_dt, dkd_run);
  } finally {
    this.dkd_renderer.render = dkd_render;
  }
  const dkd_zoom = dkd_clamp(this.dkd_v03GarageZoom ?? 1.16, .72, 1.68);
  const dkd_phase = Math.sin(this.dkd_time * .10) * .22;
  this.dkd_camera.position.set((4.55 + dkd_phase * 2.0) * dkd_zoom, 3.25 * dkd_zoom, 7.45 * dkd_zoom);
  this.dkd_camera.lookAt(-.12, 1.24, -.72);
  dkd_render.call(this.dkd_renderer, this.dkd_scene, this.dkd_camera);
};

const dkd_v03_baseBind = dkd_Game.prototype.dkd_bind;
dkd_Game.prototype.dkd_bind = function() {
  dkd_v03_baseBind.call(this);
  const dkd_canvas = document.getElementById('dkd-canvas');
  if (!dkd_canvas) return;
  this.dkd_v03Pointers = new Map();
  this.dkd_v03PinchDistance = 0;
  this.dkd_v03PinchZoom = this.dkd_scene.dkd_v03GarageZoom ?? 1.16;

  const dkd_distanceBetween = () => {
    const dkd_points = [...this.dkd_v03Pointers.values()];
    if (dkd_points.length < 2) return 0;
    return Math.hypot(dkd_points[0][0] - dkd_points[1][0], dkd_points[0][1] - dkd_points[1][1]);
  };
  dkd_canvas.addEventListener('pointerdown', dkd_event => {
    if (this.dkd_scene.dkd_mode !== 'garage') return;
    this.dkd_v03Pointers.set(dkd_event.pointerId, [dkd_event.clientX, dkd_event.clientY]);
    if (this.dkd_v03Pointers.size === 2) {
      this.dkd_v03PinchDistance = dkd_distanceBetween();
      this.dkd_v03PinchZoom = this.dkd_scene.dkd_v03GarageZoom ?? 1.16;
    }
  }, { passive: true });
  dkd_canvas.addEventListener('pointermove', dkd_event => {
    if (!this.dkd_v03Pointers.has(dkd_event.pointerId) || this.dkd_scene.dkd_mode !== 'garage') return;
    this.dkd_v03Pointers.set(dkd_event.pointerId, [dkd_event.clientX, dkd_event.clientY]);
    if (this.dkd_v03Pointers.size !== 2 || this.dkd_v03PinchDistance < 10) return;
    const dkd_now = dkd_distanceBetween();
    if (dkd_now < 10) return;
    this.dkd_scene.dkd_v03GarageZoom = dkd_clamp(this.dkd_v03PinchZoom * this.dkd_v03PinchDistance / dkd_now, .72, 1.68);
    dkd_event.preventDefault();
  }, { passive: false });
  const dkd_releasePointer = dkd_event => {
    this.dkd_v03Pointers.delete(dkd_event.pointerId);
    if (this.dkd_v03Pointers.size < 2) this.dkd_v03PinchDistance = 0;
  };
  dkd_canvas.addEventListener('pointerup', dkd_releasePointer);
  dkd_canvas.addEventListener('pointercancel', dkd_releasePointer);
  dkd_canvas.addEventListener('wheel', dkd_event => {
    if (this.dkd_scene.dkd_mode !== 'garage') return;
    this.dkd_scene.dkd_v03GarageZoom = dkd_clamp((this.dkd_scene.dkd_v03GarageZoom ?? 1.16) + Math.sign(dkd_event.deltaY) * .08, .72, 1.68);
    dkd_event.preventDefault();
  }, { passive: false });
};

// Arriving at the destination now completes the delivery automatically. Final
// story jobs still require their mandatory intermediate stops.
const dkd_v03_baseUpdateHud = dkd_Game.prototype.dkd_updateHud;
dkd_Game.prototype.dkd_updateHud = function() {
  dkd_v03_baseUpdateHud.call(this);
  const dkd_run = this.dkd_run;
  if (!dkd_run || this.dkd_pageName !== 'drive' || dkd_run.dkd_failed || dkd_run.dkd_finished || this.dkd_v03AutoDelivering) return;
  if (dkd_run.dkd_pendingStops?.length) return;
  const dkd_destination = this.dkd_graph.dkd_points[dkd_run.dkd_order.dkd_to];
  if (!dkd_destination) return;
  const dkd_arrivalDistance = dkd_distance(dkd_run.dkd_position, dkd_destination);
  if (dkd_arrivalDistance > 10) return;
  dkd_run.dkd_routeIndex = dkd_run.dkd_route.dkd_nodes.length;
  dkd_run.dkd_speed = 0;
  this.dkd_v03AutoDelivering = true;
  try {
    this.dkd_action('deliver');
  } finally {
    this.dkd_v03AutoDelivering = false;
  }
};

// Phone branding.
const dkd_v03_basePhoneView = dkd_Game.prototype.dkd_view_phone;
dkd_Game.prototype.dkd_view_phone = function() {
  return dkd_v03_basePhoneView.call(this).replace('DRA TELEFON /', 'DraBornGo /');
};

// Louder, denser synth mix and refreshed feedback effects. No external audio
// files are required, keeping Expo Go startup fully offline.
const dkd_v03_baseAudioStart = dkd_Audio.prototype.dkd_start;
dkd_Audio.prototype.dkd_start = function() {
  dkd_v03_baseAudioStart.call(this);
  if (!this.dkd_context) return;
  this.dkd_master.gain.value = .88;
  this.dkd_tracks = ['Neon Vardiya', 'Gece Rotası', 'Yağmur Hattı', 'Şehir Nabzı', 'Son Paket'];
};

const dkd_v03_baseNote = dkd_Audio.prototype.dkd_note;
dkd_Audio.prototype.dkd_note = function(dkd_frequency, dkd_duration, dkd_volume, dkd_type = 'sine', dkd_target = this.dkd_music, dkd_when = null) {
  const dkd_gain = dkd_target === this.dkd_music ? 1.65 : dkd_target === this.dkd_effects ? 1.22 : 1;
  return dkd_v03_baseNote.call(this, dkd_frequency, dkd_duration, Math.min(.7, dkd_volume * dkd_gain), dkd_type, dkd_target, dkd_when);
};

dkd_Audio.prototype.dkd_effect = function(dkd_kind) {
  this.dkd_start();
  if (!this.dkd_context) return;
  const dkd_now = this.dkd_context.currentTime;
  if (dkd_kind === 'success') {
    [[523.25,0],[659.25,.09],[783.99,.18],[1046.5,.32]].forEach(([dkd_frequency, dkd_delay], dkd_index) => this.dkd_note(dkd_frequency, .34 + dkd_index * .05, .15 - dkd_index * .015, 'triangle', this.dkd_effects, dkd_now + dkd_delay));
  } else if (dkd_kind === 'ding') {
    this.dkd_note(740, .16, .17, 'triangle', this.dkd_effects, dkd_now);
    this.dkd_note(1110, .25, .12, 'sine', this.dkd_effects, dkd_now + .07);
  } else if (dkd_kind === 'horn') {
    this.dkd_note(311.13, .38, .24, 'sawtooth', this.dkd_effects, dkd_now);
    this.dkd_note(392, .38, .14, 'square', this.dkd_effects, dkd_now);
  } else if (dkd_kind === 'hit') {
    this.dkd_note(64, .30, .38, 'sawtooth', this.dkd_effects, dkd_now);
    this.dkd_note(118, .14, .22, 'square', this.dkd_effects, dkd_now + .015);
  } else {
    this.dkd_note(620, .07, .12, 'triangle', this.dkd_effects, dkd_now);
  }
};

const dkd_v03_baseAudioUpdate = dkd_Audio.prototype.dkd_update;
dkd_Audio.prototype.dkd_update = function(dkd_run) {
  dkd_v03_baseAudioUpdate.call(this, dkd_run);
  if (!this.dkd_context || this.dkd_context.state !== 'running') return;
  this.dkd_music.gain.value = Math.min(1.25, this.dkd_state.dkd_settings.dkd_music * 1.18);
  this.dkd_effects.gain.value = Math.min(1.18, this.dkd_state.dkd_settings.dkd_effects * 1.08);
  const dkd_active = dkd_run && !dkd_run.dkd_paused && !dkd_run.dkd_finished && !dkd_run.dkd_failed;
  if (!dkd_active || this.dkd_muted || this.dkd_state.dkd_settings.dkd_music <= .01) return;
  const dkd_now = this.dkd_context.currentTime;
  if (!Number.isFinite(this.dkd_v03NextPulse) || this.dkd_v03NextPulse < dkd_now - 1) this.dkd_v03NextPulse = dkd_now + .04;
  if (!Number.isFinite(this.dkd_v03Pulse)) this.dkd_v03Pulse = 0;
  const dkd_roots = [
    [55,65.41,73.42,82.41],
    [49,58.27,65.41,73.42],
    [65.41,73.42,82.41,98],
    [61.74,73.42,82.41,92.5],
    [43.65,55,65.41,73.42]
  ][this.dkd_track % 5];
  while (this.dkd_v03NextPulse < dkd_now + .10) {
    const dkd_root = dkd_roots[Math.floor(this.dkd_v03Pulse / 8) % dkd_roots.length];
    if (this.dkd_v03Pulse % 4 === 0) {
      this.dkd_note(dkd_root, .24, .055, 'sawtooth', this.dkd_music, this.dkd_v03NextPulse);
      this.dkd_note(dkd_root * 2, .42, .028, 'triangle', this.dkd_music, this.dkd_v03NextPulse);
    }
    if (this.dkd_v03Pulse % 2 === 1) this.dkd_note(dkd_root * [4,5,6,8][Math.floor(this.dkd_v03Pulse / 2) % 4], .08, .023, 'square', this.dkd_music, this.dkd_v03NextPulse);
    if (this.dkd_v03Pulse % 8 === 4) {
      this.dkd_note(dkd_root * 3, .55, .024, 'sine', this.dkd_music, this.dkd_v03NextPulse);
      this.dkd_note(dkd_root * 4, .55, .018, 'sine', this.dkd_music, this.dkd_v03NextPulse);
    }
    this.dkd_v03Pulse++;
    this.dkd_v03NextPulse += .16 + (this.dkd_track % 3) * .012;
  }
};

// DraBornGo / Last Mile v0.3 re-uploaded scooter + rider integration.
// The user-supplied combined GLB was validated, converted once to a compact
// mobile runtime package (DK32), and is decoded entirely offline in Expo Go.

function dkd_v03_reuploadedNeed(dkd_offset, dkd_length, dkd_total, dkd_label) {
  if (dkd_offset < 0 || dkd_length < 0 || dkd_offset + dkd_length > dkd_total) throw new Error(`Yüklenen model verisi eksik: ${dkd_label}`);
}

function dkd_v03_reuploadedReadModel() {
  const dkd_base64 = dkd_v03_reuploadedModelChunks.join('');
  if (!dkd_base64 || dkd_base64.length < 1000) throw new Error('Yüklenen scooter + sürücü modeli bulunamadı.');
  const dkd_binary = atob(dkd_base64);
  const dkd_bytes = new Uint8Array(dkd_binary.length);
  for (let dkd_index = 0; dkd_index < dkd_binary.length; dkd_index++) dkd_bytes[dkd_index] = dkd_binary.charCodeAt(dkd_index);
  dkd_v03_reuploadedNeed(0, 6, dkd_bytes.length, 'başlık');

  const dkd_view = new DataView(dkd_bytes.buffer, dkd_bytes.byteOffset, dkd_bytes.byteLength);
  const dkd_signature = String.fromCharCode(...dkd_bytes.slice(0, 4));
  if (dkd_signature !== 'DK32') throw new Error('Yüklenen scooter + sürücü modeli geçersiz.');
  const dkd_meshCount = dkd_view.getUint16(4, true);
  if (dkd_meshCount !== 68) throw new Error('Yüklenen model parça sayısı geçersiz.');

  const dkd_group = new dkd_three.Group();
  dkd_group.name = 'dkd_uploaded_scooter_rider_model';
  let dkd_offset = 6;
  let dkd_totalVertices = 0;
  let dkd_totalFaces = 0;

  for (let dkd_meshIndex = 0; dkd_meshIndex < dkd_meshCount; dkd_meshIndex++) {
    // DK32 mesh header: vertexCount(2), faceCount(2), RGBA(4), metalness(1),
    // roughness(1), min xyz(12), max xyz(12) = 34 bytes.
    dkd_v03_reuploadedNeed(dkd_offset, 34, dkd_bytes.length, `mesh ${dkd_meshIndex + 1} başlığı`);
    const dkd_vertexCount = dkd_view.getUint16(dkd_offset, true);
    const dkd_faceCount = dkd_view.getUint16(dkd_offset + 2, true);
    if (dkd_vertexCount < 3 || dkd_vertexCount > 12000 || dkd_faceCount < 1 || dkd_faceCount > 24000) throw new Error(`Yüklenen mesh ${dkd_meshIndex + 1} boyutu geçersiz.`);

    const dkd_red = dkd_bytes[dkd_offset + 4];
    const dkd_green = dkd_bytes[dkd_offset + 5];
    const dkd_blue = dkd_bytes[dkd_offset + 6];
    const dkd_alpha = dkd_bytes[dkd_offset + 7];
    const dkd_metalness = dkd_bytes[dkd_offset + 8] / 255;
    const dkd_roughness = dkd_bytes[dkd_offset + 9] / 255;
    const dkd_min = [
      dkd_view.getFloat32(dkd_offset + 10, true),
      dkd_view.getFloat32(dkd_offset + 14, true),
      dkd_view.getFloat32(dkd_offset + 18, true)
    ];
    const dkd_max = [
      dkd_view.getFloat32(dkd_offset + 22, true),
      dkd_view.getFloat32(dkd_offset + 26, true),
      dkd_view.getFloat32(dkd_offset + 30, true)
    ];
    if (![...dkd_min, ...dkd_max].every(dkd_value => Number.isFinite(dkd_value) && Math.abs(dkd_value) < 100)) throw new Error(`Yüklenen mesh ${dkd_meshIndex + 1} sınırı geçersiz.`);
    if (!dkd_min.every((dkd_value, dkd_axis) => dkd_value <= dkd_max[dkd_axis])) throw new Error(`Yüklenen mesh ${dkd_meshIndex + 1} sınır sırası geçersiz.`);
    dkd_offset += 34;

    dkd_v03_reuploadedNeed(dkd_offset, dkd_vertexCount * 3, dkd_bytes.length, `mesh ${dkd_meshIndex + 1} konum verisi`);
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
        dkd_v03_reuploadedNeed(dkd_offset, 1, dkd_bytes.length, `mesh ${dkd_meshIndex + 1} indeks verisi`);
        dkd_byte = dkd_bytes[dkd_offset++];
        dkd_unsigned |= (dkd_byte & 0x7f) << dkd_shift;
        dkd_shift += 7;
        if (dkd_shift > 28) throw new Error(`Yüklenen mesh ${dkd_meshIndex + 1} indeks kodu geçersiz.`);
      } while (dkd_byte & 0x80);
      const dkd_delta = (dkd_unsigned >>> 1) ^ -(dkd_unsigned & 1);
      dkd_previousIndex += dkd_delta;
      if (dkd_previousIndex < 0 || dkd_previousIndex >= dkd_vertexCount) throw new Error(`Yüklenen mesh ${dkd_meshIndex + 1} indeks verisi geçersiz.`);
      dkd_indices[dkd_index] = dkd_previousIndex;
    }

    const dkd_geometry = new dkd_three.BufferGeometry();
    dkd_geometry.setAttribute('position', new dkd_three.BufferAttribute(dkd_positions, 3));
    dkd_geometry.setIndex(new dkd_three.BufferAttribute(dkd_indices, 1));
    dkd_geometry.computeVertexNormals();
    dkd_geometry.computeBoundingSphere();

    const dkd_color = new dkd_three.Color(dkd_red / 255, dkd_green / 255, dkd_blue / 255);
    const dkd_opacity = dkd_alpha / 255;
    const dkd_material = new dkd_three.MeshStandardMaterial({
      color: dkd_color,
      metalness: dkd_clamp(dkd_metalness, 0, 1),
      roughness: dkd_clamp(dkd_roughness, .04, 1),
      transparent: dkd_alpha < 250,
      opacity: dkd_opacity,
      depthWrite: dkd_opacity > .72,
      side: dkd_three.DoubleSide
    });
    const dkd_mesh = new dkd_three.Mesh(dkd_geometry, dkd_material);
    dkd_mesh.name = `dkd_uploaded_mesh_${dkd_meshIndex}`;
    dkd_group.add(dkd_mesh);
    dkd_totalVertices += dkd_vertexCount;
    dkd_totalFaces += dkd_faceCount;
  }

  if (dkd_offset !== dkd_bytes.length) throw new Error('Yüklenen scooter + sürücü paket sonu geçersiz.');
  if (dkd_totalVertices !== 5942 || dkd_totalFaces !== 11244) throw new Error('Yüklenen scooter + sürücü geometri toplamı geçersiz.');
  dkd_group.scale.setScalar(1.16);
  return dkd_group;
}

function dkd_v03_reuploadedDisposeBike(dkd_bike) {
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

// This patch is loaded last, so the actual re-uploaded combined scooter+rider
// replaces the temporary safe/procedural City 50 model everywhere it is shown.
const dkd_v03_reuploadedBaseBuildBike = dkd_Scene.prototype.dkd_buildBike;
dkd_Scene.prototype.dkd_buildBike = function(dkd_kind = 'scooter') {
  if (dkd_kind !== 'scooter' || this.dkd_state?.dkd_equipped !== 'dkd_city50') return dkd_v03_reuploadedBaseBuildBike.call(this, dkd_kind);
  try {
    const dkd_model = dkd_v03_reuploadedReadModel();
    if (this.dkd_bike) {
      this.dkd_scene.remove(this.dkd_bike);
      dkd_v03_reuploadedDisposeBike(this.dkd_bike);
    }
    this.dkd_bike = new dkd_three.Group();
    this.dkd_bike.name = 'dkd_city50_reuploaded_scooter_rider';
    this.dkd_bike.add(dkd_model);
    this.dkd_scene.add(this.dkd_bike);
    this.dkd_wheels = [];
    this.dkd_bikeKind = dkd_kind;
    return this.dkd_bike;
  } catch (dkd_error) {
    console.warn('Yeniden yüklenen scooter + sürücü modeli açılamadı; güvenli modele dönülüyor.', dkd_error);
    return dkd_v03_reuploadedBaseBuildBike.call(this, dkd_kind);
  }
};

// New installs and existing careers migrated to this build start with High
// rendering quality. Once applied, later manual quality choices are preserved.
const dkd_v03_reuploadedBaseDefaultState = dkd_defaultState;
dkd_defaultState = function() {
  const dkd_state = dkd_v03_reuploadedBaseDefaultState();
  dkd_state.dkd_settings.dkd_quality = 'high';
  dkd_state.dkd_settings.dkd_reuploadedHighQualityApplied = true;
  return dkd_state;
};

const dkd_v03_reuploadedBaseRestoreState = dkd_restoreState;
dkd_restoreState = function(dkd_raw) {
  const dkd_state = dkd_v03_reuploadedBaseRestoreState(dkd_raw);
  if (dkd_raw?.dkd_settings?.dkd_reuploadedHighQualityApplied !== true) dkd_state.dkd_settings.dkd_quality = 'high';
  dkd_state.dkd_settings.dkd_reuploadedHighQualityApplied = true;
  return dkd_state;
};

// Remove only the level-zero “İlk garajın” helper text from the home page.
const dkd_v03_reuploadedBaseHomeView = dkd_Game.prototype.dkd_view_home;
dkd_Game.prototype.dkd_view_home = function(...dkd_args) {
  return dkd_v03_reuploadedBaseHomeView.apply(this, dkd_args)
    .replace(/<small[^>]*>\s*İlk garajın\s*<\/small>/i, '');
};

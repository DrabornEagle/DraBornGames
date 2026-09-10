// DraBornGo / Last Mile v0.3 re-uploaded scooter + rider integration.
// The validated user model is stored as eight small gzip/base64 chunks. Android
// WebView decompresses it once, entirely offline, then the exact combined
// scooter+rider geometry replaces the temporary City 50 model.

function dkd_v03_reuploadedNeed(dkd_offset, dkd_length, dkd_total, dkd_label) {
  if (dkd_offset < 0 || dkd_length < 0 || dkd_offset + dkd_length > dkd_total) throw new Error(`Yüklenen model verisi eksik: ${dkd_label}`);
}

let dkd_v03_reuploadedBytesPromise = null;

async function dkd_v03_reuploadedReadBytes() {
  if (dkd_v03_reuploadedBytesPromise) return dkd_v03_reuploadedBytesPromise;
  dkd_v03_reuploadedBytesPromise = (async () => {
    const dkd_base64 = [
      dkd_v03_reuploadedGzipChunk0,
      dkd_v03_reuploadedGzipChunk1,
      dkd_v03_reuploadedGzipChunk2,
      dkd_v03_reuploadedGzipChunk3,
      dkd_v03_reuploadedGzipChunk4,
      dkd_v03_reuploadedGzipChunk5,
      dkd_v03_reuploadedGzipChunk6,
      dkd_v03_reuploadedGzipChunk7
    ].join('');
    if (!dkd_base64 || dkd_base64.length < 1000) throw new Error('Yüklenen scooter + sürücü modeli bulunamadı.');
    if (typeof DecompressionStream !== 'function') throw new Error('Bu Android WebView gzip model açmayı desteklemiyor.');

    const dkd_binary = atob(dkd_base64);
    const dkd_compressed = new Uint8Array(dkd_binary.length);
    for (let dkd_index = 0; dkd_index < dkd_binary.length; dkd_index++) dkd_compressed[dkd_index] = dkd_binary.charCodeAt(dkd_index);

    const dkd_stream = new Blob([dkd_compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
    const dkd_bytes = new Uint8Array(await new Response(dkd_stream).arrayBuffer());
    if (dkd_bytes.length !== dkd_v03_reuploadedExpectedBytes) throw new Error(`Yüklenen model boyutu geçersiz: ${dkd_bytes.length}`);
    if (String.fromCharCode(...dkd_bytes.slice(0, 4)) !== 'DK32') throw new Error('Yüklenen scooter + sürücü modeli geçersiz.');
    return dkd_bytes;
  })().catch(dkd_error => {
    dkd_v03_reuploadedBytesPromise = null;
    throw dkd_error;
  });
  return dkd_v03_reuploadedBytesPromise;
}

function dkd_v03_reuploadedBuildModel(dkd_bytes) {
  dkd_v03_reuploadedNeed(0, 6, dkd_bytes.length, 'başlık');
  const dkd_view = new DataView(dkd_bytes.buffer, dkd_bytes.byteOffset, dkd_bytes.byteLength);
  const dkd_meshCount = dkd_view.getUint16(4, true);
  if (dkd_meshCount !== 68) throw new Error('Yüklenen model parça sayısı geçersiz.');

  const dkd_group = new dkd_three.Group();
  dkd_group.name = 'dkd_uploaded_scooter_rider_model';
  let dkd_offset = 6;
  let dkd_totalVertices = 0;
  let dkd_totalFaces = 0;

  for (let dkd_meshIndex = 0; dkd_meshIndex < dkd_meshCount; dkd_meshIndex++) {
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

    const dkd_material = new dkd_three.MeshStandardMaterial({
      color: new dkd_three.Color(dkd_red / 255, dkd_green / 255, dkd_blue / 255),
      metalness: dkd_clamp(dkd_metalness, 0, 1),
      roughness: dkd_clamp(dkd_roughness, .04, 1),
      transparent: dkd_alpha < 250,
      opacity: dkd_alpha / 255,
      depthWrite: dkd_alpha / 255 > .72,
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

function dkd_v03_reuploadedDisposeObject(dkd_object) {
  if (!dkd_object) return;
  const dkd_materials = new Set();
  dkd_object.traverse(dkd_child => {
    if (!dkd_child.isMesh) return;
    dkd_child.geometry?.dispose?.();
    if (Array.isArray(dkd_child.material)) dkd_child.material.forEach(dkd_material => dkd_materials.add(dkd_material));
    else if (dkd_child.material) dkd_materials.add(dkd_child.material);
  });
  for (const dkd_material of dkd_materials) {
    dkd_material.map?.dispose?.();
    dkd_material.dispose?.();
  }
}

const dkd_v03_reuploadedBaseBuildBike = dkd_Scene.prototype.dkd_buildBike;
dkd_Scene.prototype.dkd_buildBike = function(dkd_kind = 'scooter') {
  const dkd_fallback = dkd_v03_reuploadedBaseBuildBike.call(this, dkd_kind);
  if (dkd_kind !== 'scooter' || this.dkd_state?.dkd_equipped !== 'dkd_city50' || !dkd_fallback) return dkd_fallback;

  const dkd_token = (this.dkd_v03ModelLoadToken || 0) + 1;
  this.dkd_v03ModelLoadToken = dkd_token;
  dkd_v03_reuploadedReadBytes()
    .then(dkd_bytes => dkd_v03_reuploadedBuildModel(dkd_bytes))
    .then(dkd_model => {
      if (this.dkd_v03ModelLoadToken !== dkd_token || this.dkd_state?.dkd_equipped !== 'dkd_city50' || this.dkd_bike !== dkd_fallback) {
        dkd_v03_reuploadedDisposeObject(dkd_model);
        return;
      }
      const dkd_bike = new dkd_three.Group();
      dkd_bike.name = 'dkd_city50_reuploaded_scooter_rider';
      dkd_bike.position.copy(dkd_fallback.position);
      dkd_bike.rotation.copy(dkd_fallback.rotation);
      dkd_bike.scale.copy(dkd_fallback.scale);
      dkd_bike.add(dkd_model);
      this.dkd_scene.remove(dkd_fallback);
      dkd_v03_reuploadedDisposeObject(dkd_fallback);
      this.dkd_bike = dkd_bike;
      this.dkd_scene.add(dkd_bike);
      this.dkd_wheels = [];
      this.dkd_bikeKind = dkd_kind;
    })
    .catch(dkd_error => console.warn('Yeniden yüklenen scooter + sürücü modeli açılamadı; güvenli modele devam ediliyor.', dkd_error));
  return dkd_fallback;
};

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

const dkd_v03_reuploadedBaseHomeView = dkd_Game.prototype.dkd_view_home;
dkd_Game.prototype.dkd_view_home = function(...dkd_args) {
  return dkd_v03_reuploadedBaseHomeView.apply(this, dkd_args)
    .replace(/<small[^>]*>\s*İlk garajın\s*<\/small>/i, '');
};

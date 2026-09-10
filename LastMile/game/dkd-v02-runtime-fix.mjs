// DraBornGo / Last Mile v0.2 phone runtime fix.
// The packed starter scooter contains a six-byte separator after the first mesh.
// Desktop build tests did not exercise the binary parser, so Android WebView hit
// DataView bounds while treating those separator bytes as a mesh header.

function dkd_v02_scooterHeader(dkd_bytes, dkd_view, dkd_offset) {
  if (dkd_offset < 0 || dkd_offset + 35 > dkd_bytes.length) return null;
  const dkd_vertexCount = dkd_view.getUint16(dkd_offset, true);
  const dkd_faceCount = dkd_view.getUint16(dkd_offset + 2, true);
  if (dkd_vertexCount < 3 || dkd_vertexCount > 5000 || dkd_faceCount < 1 || dkd_faceCount > 10000) return null;

  const dkd_alpha = dkd_bytes[dkd_offset + 7];
  if (dkd_alpha < 120) return null;

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
  const dkd_bounds = [...dkd_min, ...dkd_max];
  if (!dkd_bounds.every(dkd_value => Number.isFinite(dkd_value) && Math.abs(dkd_value) < 100)) return null;
  if (!dkd_min.every((dkd_value, dkd_axis) => dkd_value <= dkd_max[dkd_axis])) return null;

  const dkd_end = dkd_offset + 35 + dkd_vertexCount * 6 + dkd_faceCount * 6;
  if (dkd_end > dkd_bytes.length) return null;
  return { dkd_offset, dkd_vertexCount, dkd_faceCount, dkd_min, dkd_max, dkd_end };
}

function dkd_v02_findScooterHeader(dkd_bytes, dkd_view, dkd_from) {
  const dkd_limit = Math.min(dkd_bytes.length - 35, dkd_from + 512);
  for (let dkd_offset = dkd_from; dkd_offset <= dkd_limit; dkd_offset++) {
    const dkd_header = dkd_v02_scooterHeader(dkd_bytes, dkd_view, dkd_offset);
    if (dkd_header) return dkd_header;
  }
  return null;
}

// Replace the original parser with a validated, bounds-safe version. It accepts
// exact headers directly and only scans forward when the current offset is not a
// valid mesh header. This skips the known six-byte separator without weakening
// the rest of the binary format validation.
dkd_v02_readScooter = function() {
  const dkd_binary = atob(dkd_v02_scooterPack);
  const dkd_bytes = new Uint8Array(dkd_binary.length);
  for (let dkd_index = 0; dkd_index < dkd_binary.length; dkd_index++) dkd_bytes[dkd_index] = dkd_binary.charCodeAt(dkd_index);
  if (dkd_bytes.length < 6) throw new Error('Başlangıç motosikleti verisi eksik.');

  const dkd_view = new DataView(dkd_bytes.buffer, dkd_bytes.byteOffset, dkd_bytes.byteLength);
  const dkd_ascii = String.fromCharCode(...dkd_bytes.slice(0, 4));
  if (dkd_ascii !== 'DK20') throw new Error('Başlangıç motosikleti verisi geçersiz.');

  const dkd_meshCount = dkd_view.getUint16(4, true);
  if (dkd_meshCount < 1 || dkd_meshCount > 64) throw new Error('Başlangıç motosikleti mesh sayısı geçersiz.');

  const dkd_group = new dkd_three.Group();
  let dkd_offset = 6;
  for (let dkd_meshIndex = 0; dkd_meshIndex < dkd_meshCount; dkd_meshIndex++) {
    let dkd_header = dkd_v02_scooterHeader(dkd_bytes, dkd_view, dkd_offset);
    if (!dkd_header) dkd_header = dkd_v02_findScooterHeader(dkd_bytes, dkd_view, dkd_offset + 1);
    if (!dkd_header) throw new Error(`Başlangıç motosikleti mesh ${dkd_meshIndex + 1} okunamadı.`);

    const dkd_start = dkd_header.dkd_offset;
    const dkd_vertexCount = dkd_header.dkd_vertexCount;
    const dkd_faceCount = dkd_header.dkd_faceCount;
    const dkd_red = dkd_bytes[dkd_start + 4];
    const dkd_green = dkd_bytes[dkd_start + 5];
    const dkd_blue = dkd_bytes[dkd_start + 6];
    const dkd_alpha = dkd_bytes[dkd_start + 7];
    const dkd_metalness = dkd_bytes[dkd_start + 8] / 255;
    const dkd_roughness = dkd_bytes[dkd_start + 9] / 255;
    const dkd_opacity = dkd_bytes[dkd_start + 10] / 255;

    let dkd_cursor = dkd_start + 35;
    const dkd_positions = new Float32Array(dkd_vertexCount * 3);
    for (let dkd_vertex = 0; dkd_vertex < dkd_vertexCount; dkd_vertex++) {
      for (let dkd_axis = 0; dkd_axis < 3; dkd_axis++) {
        const dkd_quantized = dkd_view.getUint16(dkd_cursor, true);
        dkd_cursor += 2;
        dkd_positions[dkd_vertex * 3 + dkd_axis] = dkd_header.dkd_min[dkd_axis] + (dkd_header.dkd_max[dkd_axis] - dkd_header.dkd_min[dkd_axis]) * dkd_quantized / 65535;
      }
    }

    const dkd_indices = new Uint16Array(dkd_faceCount * 3);
    for (let dkd_index = 0; dkd_index < dkd_indices.length; dkd_index++) {
      const dkd_value = dkd_view.getUint16(dkd_cursor, true);
      dkd_cursor += 2;
      if (dkd_value >= dkd_vertexCount) throw new Error(`Başlangıç motosikleti mesh ${dkd_meshIndex + 1} indeks verisi geçersiz.`);
      dkd_indices[dkd_index] = dkd_value;
    }
    if (dkd_cursor !== dkd_header.dkd_end) throw new Error(`Başlangıç motosikleti mesh ${dkd_meshIndex + 1} uzunluğu geçersiz.`);

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
    dkd_offset = dkd_header.dkd_end;
  }

  if (dkd_offset !== dkd_bytes.length) throw new Error('Başlangıç motosikleti paket sonu geçersiz.');
  return dkd_group;
};

// A malformed model must never prevent the 3D game from opening. If a future
// asset regression slips through, fall back to the built-in procedural scooter
// instead of showing the WebView/WebGL error screen.
const dkd_v02_runtimeBuildBike = dkd_Scene.prototype.dkd_buildBike;
dkd_Scene.prototype.dkd_buildBike = function(dkd_kind = 'scooter') {
  try {
    return dkd_v02_runtimeBuildBike.call(this, dkd_kind);
  } catch (dkd_error) {
    if (dkd_kind !== 'scooter' || this.dkd_state.dkd_equipped !== 'dkd_city50') throw dkd_error;
    console.warn('Modern başlangıç scooterı okunamadı; güvenli yerleşik modele dönülüyor.', dkd_error);
    return dkd_v02_baseBuildBike.call(this, dkd_kind);
  }
};

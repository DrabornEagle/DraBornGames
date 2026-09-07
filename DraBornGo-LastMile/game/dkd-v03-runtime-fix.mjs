// DraBornGo / Last Mile v0.3 runtime hardening.
// Each uploaded model chunk is an independently padded base64 segment. Decode
// them separately before concatenating the bytes; joining the encoded strings
// directly can corrupt the stream at internal '=' padding boundaries.

function dkd_v03_modelBytes() {
  const dkd_chunks = [
    dkd_v03_modelChunk0,
    dkd_v03_modelChunk1,
    dkd_v03_modelChunk2,
    dkd_v03_modelChunk3,
    dkd_v03_modelChunk4,
    dkd_v03_modelChunk5,
    dkd_v03_modelChunk6,
    dkd_v03_modelChunk7,
    dkd_v03_modelChunk8
  ];
  const dkd_parts = dkd_chunks.map(dkd_chunk => {
    const dkd_binary = atob(dkd_chunk);
    const dkd_part = new Uint8Array(dkd_binary.length);
    for (let dkd_index = 0; dkd_index < dkd_binary.length; dkd_index++) dkd_part[dkd_index] = dkd_binary.charCodeAt(dkd_index);
    return dkd_part;
  });
  const dkd_total = dkd_parts.reduce((dkd_sum, dkd_part) => dkd_sum + dkd_part.length, 0);
  const dkd_bytes = new Uint8Array(dkd_total);
  let dkd_offset = 0;
  for (const dkd_part of dkd_parts) {
    dkd_bytes.set(dkd_part, dkd_offset);
    dkd_offset += dkd_part.length;
  }
  return dkd_bytes;
}

dkd_v03_readScooterRider = function() {
  const dkd_bytes = dkd_v03_modelBytes();
  dkd_v03_need(0, 6, dkd_bytes.length, 'başlık');
  const dkd_view = new DataView(dkd_bytes.buffer, dkd_bytes.byteOffset, dkd_bytes.byteLength);
  const dkd_signature = String.fromCharCode(...dkd_bytes.slice(0, 4));
  if (dkd_signature !== 'DK31') throw new Error('v0.3 scooter + sürücü paketi geçersiz.');
  const dkd_meshCount = dkd_view.getUint16(4, true);
  if (dkd_meshCount !== 26) throw new Error('v0.3 model mesh sayısı geçersiz.');

  const dkd_group = new dkd_three.Group();
  let dkd_offset = 6;
  let dkd_totalVertices = 0;
  let dkd_totalFaces = 0;
  for (let dkd_meshIndex = 0; dkd_meshIndex < dkd_meshCount; dkd_meshIndex++) {
    dkd_v03_need(dkd_offset, 35, dkd_bytes.length, `mesh ${dkd_meshIndex + 1} başlığı`);
    const dkd_vertexCount = dkd_view.getUint16(dkd_offset, true);
    const dkd_faceCount = dkd_view.getUint16(dkd_offset + 2, true);
    if (dkd_vertexCount < 3 || dkd_vertexCount > 12000 || dkd_faceCount < 1 || dkd_faceCount > 24000) throw new Error(`v0.3 mesh ${dkd_meshIndex + 1} boyutu geçersiz.`);
    dkd_totalVertices += dkd_vertexCount;
    dkd_totalFaces += dkd_faceCount;

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
  if (dkd_totalVertices !== 5942 || dkd_totalFaces !== 11244) throw new Error('v0.3 scooter + sürücü geometri toplamı geçersiz.');
  return dkd_group;
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

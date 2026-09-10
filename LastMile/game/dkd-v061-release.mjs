// DraBornGo / Last Mile v0.6.1 release hotfix.
// Starter vehicle/rider replacement, calmer home music, resilient customer portraits,
// stale-version cleanup and Google Play preparation hooks.

const dkd_v061Previous = {
  dkd_buildBike: dkd_Scene.prototype.dkd_buildBike,
  dkd_render: dkd_Game.prototype.dkd_render,
  dkd_view_settings: dkd_Game.prototype.dkd_view_settings,
  dkd_view_privacy: dkd_Game.prototype.dkd_view_privacy,
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_receive: dkd_Game.prototype.dkd_receive,
};

function dkd_v061Need(dkd_offset, dkd_length, dkd_total, dkd_label) {
  if (dkd_offset < 0 || dkd_length < 0 || dkd_offset + dkd_length > dkd_total) {
    throw new Error(`v0.6.1 model verisi eksik: ${dkd_label}`);
  }
}

let dkd_v061ModelBytesPromise = null;

async function dkd_v061ReadModelBytes() {
  if (dkd_v061ModelBytesPromise) return dkd_v061ModelBytesPromise;
  dkd_v061ModelBytesPromise = (async () => {
    const dkd_base64 = [dkd_v061ModelChunk0, dkd_v061ModelChunk1, dkd_v061ModelChunk2, dkd_v061ModelChunk3, dkd_v061ModelChunk4, dkd_v061ModelChunk5].join('');
    if (!dkd_base64 || dkd_base64.length < 1000) throw new Error('v0.6.1 başlangıç motosikleti verisi bulunamadı.');
    if (typeof DecompressionStream !== 'function') throw new Error('Bu Android WebView gzip model açmayı desteklemiyor.');

    const dkd_binary = atob(dkd_base64);
    const dkd_compressed = new Uint8Array(dkd_binary.length);
    for (let dkd_index = 0; dkd_index < dkd_binary.length; dkd_index += 1) {
      dkd_compressed[dkd_index] = dkd_binary.charCodeAt(dkd_index);
    }

    const dkd_stream = new Blob([dkd_compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
    const dkd_bytes = new Uint8Array(await new Response(dkd_stream).arrayBuffer());
    if (dkd_bytes.length !== dkd_v061ModelExpectedBytes) {
      throw new Error(`v0.6.1 model boyutu geçersiz: ${dkd_bytes.length}`);
    }
    if (String.fromCharCode(...dkd_bytes.slice(0, 4)) !== 'DK61') {
      throw new Error('v0.6.1 başlangıç motosikleti başlığı geçersiz.');
    }
    return dkd_bytes;
  })().catch(dkd_error => {
    dkd_v061ModelBytesPromise = null;
    throw dkd_error;
  });
  return dkd_v061ModelBytesPromise;
}

function dkd_v061BuildStarterModel(dkd_bytes) {
  dkd_v061Need(0, 6, dkd_bytes.length, 'başlık');
  const dkd_view = new DataView(dkd_bytes.buffer, dkd_bytes.byteOffset, dkd_bytes.byteLength);
  const dkd_meshCount = dkd_view.getUint16(4, true);
  if (dkd_meshCount !== dkd_v061ModelMeshCount) throw new Error('v0.6.1 model parça sayısı geçersiz.');

  const dkd_group = new dkd_three.Group();
  dkd_group.name = 'dkd_v061_yamaha_soulgt125_quaternius_rider';
  let dkd_offset = 6;
  let dkd_totalVertices = 0;
  let dkd_totalFaces = 0;

  for (let dkd_meshIndex = 0; dkd_meshIndex < dkd_meshCount; dkd_meshIndex += 1) {
    dkd_v061Need(dkd_offset, 34, dkd_bytes.length, `mesh ${dkd_meshIndex + 1} başlığı`);
    const dkd_vertexCount = dkd_view.getUint16(dkd_offset, true);
    const dkd_faceCount = dkd_view.getUint16(dkd_offset + 2, true);
    if (dkd_vertexCount < 3 || dkd_vertexCount > 65534 || dkd_faceCount < 1 || dkd_faceCount > 65534) {
      throw new Error(`v0.6.1 mesh ${dkd_meshIndex + 1} boyutu geçersiz.`);
    }

    const dkd_red = dkd_bytes[dkd_offset + 4];
    const dkd_green = dkd_bytes[dkd_offset + 5];
    const dkd_blue = dkd_bytes[dkd_offset + 6];
    const dkd_alpha = dkd_bytes[dkd_offset + 7];
    const dkd_metalness = dkd_bytes[dkd_offset + 8] / 255;
    const dkd_roughness = dkd_bytes[dkd_offset + 9] / 255;
    const dkd_min = [
      dkd_view.getFloat32(dkd_offset + 10, true),
      dkd_view.getFloat32(dkd_offset + 14, true),
      dkd_view.getFloat32(dkd_offset + 18, true),
    ];
    const dkd_max = [
      dkd_view.getFloat32(dkd_offset + 22, true),
      dkd_view.getFloat32(dkd_offset + 26, true),
      dkd_view.getFloat32(dkd_offset + 30, true),
    ];
    if (![...dkd_min, ...dkd_max].every(dkd_value => Number.isFinite(dkd_value) && Math.abs(dkd_value) < 100)) {
      throw new Error(`v0.6.1 mesh ${dkd_meshIndex + 1} sınırı geçersiz.`);
    }
    dkd_offset += 34;

    dkd_v061Need(dkd_offset, dkd_vertexCount * 3, dkd_bytes.length, `mesh ${dkd_meshIndex + 1} konum`);
    const dkd_positions = new Float32Array(dkd_vertexCount * 3);
    for (let dkd_vertex = 0; dkd_vertex < dkd_vertexCount; dkd_vertex += 1) {
      for (let dkd_axis = 0; dkd_axis < 3; dkd_axis += 1) {
        const dkd_quantized = dkd_bytes[dkd_offset++];
        dkd_positions[dkd_vertex * 3 + dkd_axis] = dkd_min[dkd_axis] + (dkd_max[dkd_axis] - dkd_min[dkd_axis]) * dkd_quantized / 255;
      }
    }

    const dkd_indices = new Uint16Array(dkd_faceCount * 3);
    let dkd_previousIndex = 0;
    for (let dkd_index = 0; dkd_index < dkd_indices.length; dkd_index += 1) {
      let dkd_unsigned = 0;
      let dkd_shift = 0;
      let dkd_byte = 0;
      do {
        dkd_v061Need(dkd_offset, 1, dkd_bytes.length, `mesh ${dkd_meshIndex + 1} indeks`);
        dkd_byte = dkd_bytes[dkd_offset++];
        dkd_unsigned |= (dkd_byte & 0x7f) << dkd_shift;
        dkd_shift += 7;
        if (dkd_shift > 28) throw new Error(`v0.6.1 mesh ${dkd_meshIndex + 1} indeks kodu geçersiz.`);
      } while (dkd_byte & 0x80);
      const dkd_delta = (dkd_unsigned >>> 1) ^ -(dkd_unsigned & 1);
      dkd_previousIndex += dkd_delta;
      if (dkd_previousIndex < 0 || dkd_previousIndex >= dkd_vertexCount) throw new Error(`v0.6.1 mesh ${dkd_meshIndex + 1} indeks verisi geçersiz.`);
      dkd_indices[dkd_index] = dkd_previousIndex;
    }

    const dkd_geometry = new dkd_three.BufferGeometry();
    dkd_geometry.setAttribute('position', new dkd_three.BufferAttribute(dkd_positions, 3));
    dkd_geometry.setIndex(new dkd_three.BufferAttribute(dkd_indices, 1));
    dkd_geometry.computeVertexNormals();
    dkd_geometry.computeBoundingSphere();

    const dkd_material = new dkd_three.MeshStandardMaterial({
      color: new dkd_three.Color(dkd_red / 255, dkd_green / 255, dkd_blue / 255),
      metalness: dkd_clamp(dkd_metalness, 0, 1), roughness: dkd_clamp(dkd_roughness, .08, 1),
      transparent: dkd_alpha < 250, opacity: dkd_alpha / 255, depthWrite: dkd_alpha > 180, side: dkd_three.DoubleSide,
    });
    const dkd_mesh = new dkd_three.Mesh(dkd_geometry, dkd_material);
    dkd_mesh.name = `dkd_v061_model_mesh_${dkd_meshIndex}`;
    dkd_group.add(dkd_mesh);
    dkd_totalVertices += dkd_vertexCount; dkd_totalFaces += dkd_faceCount;
  }

  if (dkd_offset !== dkd_bytes.length) throw new Error('v0.6.1 model paket sonu geçersiz.');
  if (dkd_totalVertices !== dkd_v061ModelVertexCount || dkd_totalFaces !== dkd_v061ModelFaceCount) throw new Error('v0.6.1 model geometri toplamı geçersiz.');
  return dkd_group;
}

function dkd_v061DisposeObject(dkd_object, dkd_disposeGeometry = true) {
  if (!dkd_object) return;
  const dkd_materials = new Set();
  dkd_object.traverse(dkd_child => {
    if (!dkd_child.isMesh) return;
    if (dkd_disposeGeometry) dkd_child.geometry?.dispose?.();
    if (Array.isArray(dkd_child.material)) dkd_child.material.forEach(dkd_material => dkd_materials.add(dkd_material));
    else if (dkd_child.material) dkd_materials.add(dkd_child.material);
  });
  for (const dkd_material of dkd_materials) { dkd_material.map?.dispose?.(); dkd_material.dispose?.(); }
}

dkd_Scene.prototype.dkd_buildBike = function dkd_v061BuildBike(dkd_kind = 'scooter') {
  const dkd_fallback = dkd_v061Previous.dkd_buildBike.call(this, dkd_kind);
  const dkd_isStarter = dkd_kind === 'scooter' && this.dkd_state?.dkd_equipped === 'dkd_city50' && dkd_fallback;
  if (!dkd_isStarter) return dkd_fallback;
  this.dkd_v03ModelLoadToken = (this.dkd_v03ModelLoadToken || 0) + 1;
  const dkd_token = (this.dkd_v061ModelLoadToken || 0) + 1;
  this.dkd_v061ModelLoadToken = dkd_token;
  dkd_v061ReadModelBytes().then(dkd_bytes => dkd_v061BuildStarterModel(dkd_bytes)).then(dkd_model => {
    if (this.dkd_v061ModelLoadToken !== dkd_token || this.dkd_state?.dkd_equipped !== 'dkd_city50' || this.dkd_bike !== dkd_fallback) { dkd_v061DisposeObject(dkd_model); return; }
    const dkd_bike = new dkd_three.Group();
    dkd_bike.name = 'dkd_city50_v061_yamaha_soulgt125_rider';
    dkd_bike.position.copy(dkd_fallback.position); dkd_bike.rotation.copy(dkd_fallback.rotation); dkd_bike.scale.copy(dkd_fallback.scale); dkd_bike.add(dkd_model);
    this.dkd_scene.remove(dkd_fallback); dkd_v061DisposeObject(dkd_fallback); this.dkd_bike = dkd_bike; this.dkd_scene.add(dkd_bike); this.dkd_wheels = []; this.dkd_bikeKind = dkd_kind;
    if (this.dkd_ghost) {
      const dkd_ghostWasVisible = this.dkd_ghost.visible === true; const dkd_oldGhost = this.dkd_ghost; this.dkd_scene.remove(dkd_oldGhost); dkd_v061DisposeObject(dkd_oldGhost);
      const dkd_ghost = dkd_bike.clone(true); dkd_ghost.traverse(dkd_object => { if (dkd_object.isMesh) dkd_object.material = new dkd_three.MeshBasicMaterial({ color: '#65d5d0', transparent: true, opacity: .23, depthWrite: false }); });
      dkd_ghost.visible = dkd_ghostWasVisible; this.dkd_ghost = dkd_ghost; this.dkd_scene.add(dkd_ghost);
    }
  }).catch(dkd_error => console.warn('v0.6.1 başlangıç motosikleti açılamadı; güvenli scooter modeli kullanılıyor.', dkd_error));
  return dkd_fallback;
};

function dkd_v061PortraitInfo(dkd_source) {
  if (typeof dkd_source !== 'string' || !dkd_source.startsWith('data:image/')) return null;
  const dkd_comma = dkd_source.indexOf(','); if (dkd_comma < 0) return null;
  const dkd_meta = dkd_source.slice(0, dkd_comma).toLowerCase(); const dkd_payload = dkd_source.slice(dkd_comma + 1);
  if (!dkd_meta.includes(';base64') || dkd_payload.length < 1200) return null;
  try {
    const dkd_bytes = atob(dkd_payload); if (dkd_bytes.length < 2800) return null;
    if (dkd_meta.includes('jpeg') || dkd_meta.includes('jpg')) { if (dkd_bytes.charCodeAt(0) !== 0xff || dkd_bytes.charCodeAt(1) !== 0xd8 || dkd_bytes.charCodeAt(dkd_bytes.length - 2) !== 0xff || dkd_bytes.charCodeAt(dkd_bytes.length - 1) !== 0xd9) return null; return { dkd_source, dkd_bytes: dkd_bytes.length }; }
    if (dkd_meta.includes('png')) { if (dkd_bytes.slice(1, 4) !== 'PNG') return null; return { dkd_source, dkd_bytes: dkd_bytes.length }; }
    if (dkd_meta.includes('webp')) { if (dkd_bytes.slice(0, 4) !== 'RIFF' || dkd_bytes.slice(8, 12) !== 'WEBP') return null; return { dkd_source, dkd_bytes: dkd_bytes.length }; }
  } catch {}
  return null;
}

const dkd_v061KnownPortraits = [dkd_v06AvatarSelin,dkd_v06AvatarEce,dkd_v06AvatarMira,dkd_v06AvatarDeniz,dkd_v06AvatarLara,dkd_v06AvatarAda,dkd_v06AvatarAsya,dkd_v06AvatarIrem,dkd_v06AvatarDuru,dkd_v06AvatarElif].filter(Boolean);
const dkd_v061SafePortraitPool = Array.from(new Set([...dkd_v06CustomerPortraitPool,...dkd_v061KnownPortraits])).filter(dkd_source => dkd_v061PortraitInfo(dkd_source));
if (dkd_v061SafePortraitPool.length < 8) dkd_v061SafePortraitPool.splice(0, dkd_v061SafePortraitPool.length, ...dkd_v061KnownPortraits);

dkd_v06AssignCustomerPortraits = function dkd_v061AssignCustomerPortraits(dkd_game) {
  const dkd_orders = Array.isArray(dkd_game?.dkd_orders) ? dkd_game.dkd_orders : []; const dkd_poolSize = dkd_v061SafePortraitPool.length; if (!dkd_poolSize || !dkd_orders.length) return;
  const dkd_used = new Set(); const dkd_stableOrders = dkd_orders.map((dkd_order, dkd_index) => ({ dkd_order, dkd_index, dkd_key: dkd_v06CustomerOrderKey(dkd_order, dkd_index) })).sort((dkd_first, dkd_second) => dkd_first.dkd_key.localeCompare(dkd_second.dkd_key));
  for (const dkd_entry of dkd_stableOrders) { let dkd_portraitIndex = dkd_v06CustomerPoolHash(dkd_entry.dkd_key) % dkd_poolSize; if (dkd_used.size < dkd_poolSize) { let dkd_guard = 0; while (dkd_used.has(dkd_portraitIndex) && dkd_guard < dkd_poolSize) { dkd_portraitIndex = (dkd_portraitIndex + 1) % dkd_poolSize; dkd_guard += 1; } } dkd_used.add(dkd_portraitIndex); dkd_entry.dkd_order.dkd_customerPortraitIndex = dkd_portraitIndex; }
};
window.dkd_v061AvatarError = function dkd_v061AvatarError(dkd_image, dkd_startIndex) { if (!dkd_image) return; const dkd_attempt = Number(dkd_image.dataset.dkdFallbackAttempt || 0) + 1; dkd_image.dataset.dkdFallbackAttempt = String(dkd_attempt); if (dkd_attempt <= dkd_v061SafePortraitPool.length) { const dkd_next = (Number(dkd_startIndex || 0) + dkd_attempt) % dkd_v061SafePortraitPool.length; dkd_image.src = dkd_v061SafePortraitPool[dkd_next]; return; } dkd_image.onerror = null; dkd_image.src = dkd_v06AvatarSelin; };
dkd_v06CustomerOrderAvatar = function dkd_v061CustomerOrderAvatar(dkd_order, dkd_large = false) { const dkd_poolSize = dkd_v061SafePortraitPool.length; const dkd_indexRaw = Number(dkd_order?.dkd_customerPortraitIndex); const dkd_index = Number.isInteger(dkd_indexRaw) && dkd_poolSize ? ((dkd_indexRaw % dkd_poolSize) + dkd_poolSize) % dkd_poolSize : 0; const dkd_source = dkd_v061SafePortraitPool[dkd_index] || dkd_v06AvatarSelin; const dkd_name = dkd_escape(dkd_order?.dkd_cloudCustomerName || 'Müşteri'); return `<img class="dkd-avatar${dkd_large ? ' dkd-large' : ''}" src="${dkd_source}" alt="" aria-label="${dkd_name} müşteri profil fotoğrafı" decoding="async" onerror="window.dkd_v061AvatarError(this,${dkd_index})"/>`; };

function dkd_v061InstallStyles() { if (document.getElementById('dkd-v061-style')) return; const dkd_style = document.createElement('style'); dkd_style.id = 'dkd-v061-style'; dkd_style.textContent = `.dkd-avatar{object-fit:cover!important;object-position:center center!important;background:#1a2a42!important;overflow:hidden!important;color:transparent!important;text-indent:-9999px!important}.dkd-avatar.dkd-large{object-position:center center!important}`; document.head.appendChild(dkd_style); }
dkd_v061InstallStyles();

function dkd_v061CreateHomeMusicBuffer(dkd_context) { const dkd_bpm=72,dkd_beats=16,dkd_sampleRate=dkd_context.sampleRate,dkd_seconds=dkd_beats*60/dkd_bpm,dkd_length=Math.max(1,Math.floor(dkd_seconds*dkd_sampleRate)),dkd_buffer=dkd_context.createBuffer(1,dkd_length,dkd_sampleRate),dkd_data=dkd_buffer.getChannelData(0),dkd_tau=Math.PI*2,dkd_roots=[55,65.41,73.42,49],dkd_notes=[1.5,2,2.5,3,2,1.5,3,2.5]; for(let dkd_index=0;dkd_index<dkd_length;dkd_index+=1){const dkd_time=dkd_index/dkd_sampleRate,dkd_beat=dkd_time*dkd_bpm/60,dkd_beatIndex=Math.floor(dkd_beat),dkd_beatPhase=dkd_beat-dkd_beatIndex,dkd_eighth=dkd_beat*2,dkd_eighthIndex=Math.floor(dkd_eighth),dkd_eighthPhase=dkd_eighth-dkd_eighthIndex,dkd_root=dkd_roots[Math.floor(dkd_beatIndex/4)%dkd_roots.length],dkd_breathe=.72+.28*Math.sin(dkd_tau*dkd_time/dkd_seconds);let dkd_sample=Math.sin(dkd_tau*dkd_root*dkd_time)*.075*dkd_breathe;dkd_sample+=Math.sin(dkd_tau*dkd_root*1.5*dkd_time)*.032*dkd_breathe;dkd_sample+=Math.sin(dkd_tau*dkd_root*.5*dkd_time)*.028;const dkd_pluckFrequency=dkd_root*dkd_notes[dkd_eighthIndex%dkd_notes.length],dkd_pluckEnvelope=Math.exp(-dkd_eighthPhase*4.7);dkd_sample+=Math.sin(dkd_tau*dkd_pluckFrequency*dkd_time)*dkd_pluckEnvelope*.038;dkd_sample+=Math.sin(dkd_tau*dkd_pluckFrequency*2*dkd_time)*dkd_pluckEnvelope*.008;if(dkd_beatIndex%4===0)dkd_sample+=Math.sin(dkd_tau*42*dkd_time)*Math.exp(-dkd_beatPhase*9)*.026;dkd_data[dkd_index]=dkd_sample/(1+Math.abs(dkd_sample)*.55)}return dkd_buffer; }
function dkd_v061StopHomeMusic(dkd_audio){if(!dkd_audio?.dkd_v061HomeSource)return;dkd_v05StopSource(dkd_audio.dkd_v061HomeSource);dkd_audio.dkd_v061HomeSource=null}
function dkd_v061ApplyHomeMusic(dkd_game,dkd_page){const dkd_audio=dkd_game?.dkd_audio;if(!dkd_audio)return;if(dkd_page!=='home'){if(dkd_audio.dkd_v061HomeSource){dkd_v061StopHomeMusic(dkd_audio);if(!dkd_game?.dkd_run?.dkd_active){dkd_v05SwitchTrack(dkd_audio,dkd_audio.dkd_v05MenuTrack??dkd_audio.dkd_track??0,'menu');dkd_v05ApplyMusicMode(dkd_audio,false)}}return}dkd_audio.dkd_start();if(!dkd_v05PrepareAudio(dkd_audio)||!dkd_audio.dkd_context)return;if(!dkd_audio.dkd_v061HomeBuffer)dkd_audio.dkd_v061HomeBuffer=dkd_v061CreateHomeMusicBuffer(dkd_audio.dkd_context);if(!dkd_audio.dkd_v061HomeSource){dkd_v05StopSource(dkd_audio.dkd_v05MenuSource);dkd_audio.dkd_v05MenuSource=null;const dkd_source=dkd_audio.dkd_context.createBufferSource();dkd_source.buffer=dkd_audio.dkd_v061HomeBuffer;dkd_source.loop=true;dkd_source.connect(dkd_audio.dkd_v04MenuMusic);dkd_source.start(dkd_audio.dkd_context.currentTime+.01);dkd_audio.dkd_v061HomeSource=dkd_source}const dkd_setting=dkd_clamp(Number(dkd_audio.dkd_state?.dkd_settings?.dkd_music)||0,0,1);dkd_audio.dkd_v04MenuMusic.gain.setTargetAtTime(dkd_setting*.78,dkd_audio.dkd_context.currentTime,.22);dkd_audio.dkd_v04DriveMusic.gain.setTargetAtTime(0,dkd_audio.dkd_context.currentTime,.16);dkd_audio.dkd_v04Mode='v061-calm-home'}
dkd_Game.prototype.dkd_render=function dkd_v061Render(dkd_page){const dkd_result=dkd_v061Previous.dkd_render.call(this,dkd_page);dkd_v061ApplyHomeMusic(this,dkd_page);return dkd_result};

dkd_Game.prototype.dkd_view_settings=function dkd_v061Settings(){return String(dkd_v061Previous.dkd_view_settings.call(this)).replace(/v0\.5\s*·\s*Çevrimiçi kariyer/g,'v0.6.1 · Çevrimiçi kariyer').replace(/v0\.6(?!\.\d)/g,'v0.6.1').replace('VERİ VE DENEME KAPSAMI','GİZLİLİK VE HESAP')};
const dkd_v061PrivacyUrl='https://www.draborneagle.com/draborngo/lastmile/gizlilik/';const dkd_v061DeleteUrl='https://www.draborneagle.com/draborngo/lastmile/hesap-silme/';
dkd_Game.prototype.dkd_view_privacy=function dkd_v061Privacy(){const dkd_body=`<span class="dkd-kicker">DRABORNGO / LAST MILE · v0.6.1</span><h2 style="margin:12px 0">Gizlilik ve hesap.</h2><p class="dkd-muted dkd-text-sm">Hesap, bulut kariyeri ve teslimat verileri güvenli Last-Mile sunucu katmanında işlenir. Mevcut Android sürümü hassas GPS, mikrofon veya rehber izni istemez; oyun rotaları sanal koordinatlardır.</p><div class="dkd-space"></div><div class="dkd-card"><h3>Gizlilik Politikası</h3><p class="dkd-muted dkd-text-sm" style="margin-top:8px">Toplanan veriler, kullanım amaçları, hizmet sağlayıcılar, saklama ve silme esasları web üzerindeki güncel politikada açıklanır.</p><div class="dkd-space"></div>${dkd_button('GİZLİLİK POLİTİKASINI AÇ','v061-open-privacy','shield','dkd-secondary')}</div><div class="dkd-space"></div><div class="dkd-card"><h3>Hesap ve Veri Silme</h3><p class="dkd-muted dkd-text-sm" style="margin-top:8px">Oturum açtığın hesabı ve ilişkili Last-Mile verilerini kalıcı olarak silebilirsin. Uygulamaya erişemiyorsan web üzerinden de silme talebi gönderebilirsin.</p><div class="dkd-space"></div>${dkd_button('HESAP SİLME SAYFASINI AÇ','v061-open-delete','info','dkd-secondary')}<div class="dkd-space"></div>${dkd_button('HESABIMI VE VERİLERİMİ SİL','v061-delete-account','close','dkd-warning')}</div><div class="dkd-space"></div><small>Geliştirici: DraBornEagle · Gizlilik iletişimi: draborneagle@gmail.com</small>`;return this.dkd_page('Gizlilik ve hesap',dkd_body)};
dkd_Game.prototype.dkd_action=function dkd_v061Action(dkd_action){if(dkd_action==='v061-open-privacy'){this.dkd_send('open-url',{dkd_url:dkd_v061PrivacyUrl});return}if(dkd_action==='v061-open-delete'){this.dkd_send('open-url',{dkd_url:dkd_v061DeleteUrl});return}if(dkd_action==='v061-delete-account'){const dkd_confirmed=window.confirm('Last Mile hesabın ve ilişkili bulut kariyer verilerin kalıcı olarak silinecek. Bu işlem geri alınamaz. Devam edilsin mi?');if(!dkd_confirmed)return;this.dkd_send('auth-delete-account',{});this.dkd_toast('Hesap silme isteği gönderiliyor…');return}return dkd_v061Previous.dkd_action.call(this,dkd_action)};
dkd_Game.prototype.dkd_receive=function dkd_v061Receive(dkd_payload){const dkd_result=dkd_v061Previous.dkd_receive.call(this,dkd_payload);if(dkd_payload?.dkd_type==='auth-account-deleted'){this.dkd_v04Authenticated=false;this.dkd_v04AuthEmail='';this.dkd_v04Cloud=null;this.dkd_orders=[];this.dkd_toast('Last Mile hesabın ve ilişkili verilerin silindi.');setTimeout(()=>this.dkd_render('login'),80)}return dkd_result};
window.dkd_lastMileRelease='v0.6.1';window.dkd_lastMileCustomerPortraitCount=dkd_v061SafePortraitPool.length;window.dkd_lastMileStarterModel={dkd_name:'Yamaha SoulGT 125',dkd_rider:'Quaternius Worker Male',dkd_meshes:dkd_v061ModelMeshCount,dkd_vertices:dkd_v061ModelVertexCount,dkd_faces:dkd_v061ModelFaceCount};

// DraBornGo / Last Mile v0.6.1 device hotfix.
// Fixes Expo Go/WebView starter-model fallback and physically isolates home/menu audio from drive audio.

const dkd_v061DevicePrevious = {
  dkd_startRun: dkd_Game.prototype.dkd_startRun,
  dkd_render: dkd_Game.prototype.dkd_render,
};

let dkd_v061DeviceRawBytes = null;

function dkd_v061DeviceReadRawBytes() {
  if (dkd_v061DeviceRawBytes) return dkd_v061DeviceRawBytes;
  if (typeof dkd_v061ModelRawBase64 !== 'string' || dkd_v061ModelRawBase64.length < 1000) {
    throw new Error('v0.6.1 cihaz model paketi bulunamadı.');
  }
  const dkd_binary = atob(dkd_v061ModelRawBase64);
  const dkd_bytes = new Uint8Array(dkd_binary.length);
  for (let dkd_index = 0; dkd_index < dkd_binary.length; dkd_index += 1) dkd_bytes[dkd_index] = dkd_binary.charCodeAt(dkd_index);
  if (dkd_bytes.length !== dkd_v061ModelExpectedBytes) throw new Error(`v0.6.1 cihaz model boyutu geçersiz: ${dkd_bytes.length}`);
  if (String.fromCharCode(...dkd_bytes.slice(0, 4)) !== 'DK61') throw new Error('v0.6.1 cihaz model başlığı geçersiz.');
  dkd_v061DeviceRawBytes = dkd_bytes;
  return dkd_v061DeviceRawBytes;
}

function dkd_v061DeviceReplaceGhost(dkd_scene, dkd_bike) {
  if (!dkd_scene.dkd_ghost) return;
  const dkd_visible = dkd_scene.dkd_ghost.visible === true;
  const dkd_oldGhost = dkd_scene.dkd_ghost;
  dkd_scene.dkd_scene.remove(dkd_oldGhost);
  dkd_v061DisposeObject(dkd_oldGhost);
  const dkd_ghost = dkd_bike.clone(true);
  dkd_ghost.traverse(dkd_object => {
    if (!dkd_object.isMesh) return;
    dkd_object.geometry = dkd_object.geometry.clone();
    dkd_object.material = new dkd_three.MeshBasicMaterial({ color: '#65d5d0', transparent: true, opacity: .23, depthWrite: false });
  });
  dkd_ghost.visible = dkd_visible;
  dkd_scene.dkd_ghost = dkd_ghost;
  dkd_scene.dkd_scene.add(dkd_ghost);
}

// Bypass the asynchronous gzip-dependent v0.6.1 wrapper. The build step now injects
// the already-inflated DK61 bytes, so the exact Yamaha + rider mesh is available synchronously.
dkd_Scene.prototype.dkd_buildBike = function dkd_v061DeviceBuildBike(dkd_kind = 'scooter') {
  const dkd_fallback = dkd_v061Previous.dkd_buildBike.call(this, dkd_kind);
  const dkd_isStarter = dkd_kind === 'scooter' && this.dkd_state?.dkd_equipped === 'dkd_city50' && dkd_fallback;
  if (!dkd_isStarter) return dkd_fallback;

  // Invalidate any older async v0.3/v0.6.1 replacement started by compatibility layers.
  this.dkd_v03ModelLoadToken = (this.dkd_v03ModelLoadToken || 0) + 1;
  this.dkd_v061ModelLoadToken = (this.dkd_v061ModelLoadToken || 0) + 1;

  try {
    const dkd_model = dkd_v061BuildStarterModel(dkd_v061DeviceReadRawBytes());
    const dkd_bike = new dkd_three.Group();
    dkd_bike.name = 'dkd_city50_v061_device_yamaha_soulgt125_rider';
    dkd_bike.position.copy(dkd_fallback.position);
    dkd_bike.rotation.copy(dkd_fallback.rotation);
    dkd_bike.scale.copy(dkd_fallback.scale);
    dkd_bike.add(dkd_model);

    this.dkd_scene.remove(dkd_fallback);
    dkd_v061DisposeObject(dkd_fallback);
    this.dkd_bike = dkd_bike;
    this.dkd_scene.add(dkd_bike);
    this.dkd_wheels = [];
    this.dkd_bikeKind = dkd_kind;
    dkd_v061DeviceReplaceGhost(this, dkd_bike);
    return dkd_bike;
  } catch (dkd_error) {
    console.warn('v0.6.1 gerçek başlangıç motosikleti açılamadı.', dkd_error);
    return dkd_fallback;
  }
};

function dkd_v061DeviceStopSource(dkd_source) {
  if (!dkd_source) return;
  try { dkd_source.stop(); } catch {}
  try { dkd_source.disconnect(); } catch {}
}

function dkd_v061DeviceStopMenuMusic(dkd_audio) {
  if (!dkd_audio) return;
  if (typeof dkd_v061StopHomeMusic === 'function') dkd_v061StopHomeMusic(dkd_audio);
  dkd_v061DeviceStopSource(dkd_audio.dkd_v05MenuSource);
  dkd_v061DeviceStopSource(dkd_audio.dkd_v04MenuLoopSource);
  dkd_audio.dkd_v05MenuSource = null;
  dkd_audio.dkd_v04MenuLoopSource = null;
  if (typeof dkd_v04StopMusicVoices === 'function') dkd_v04StopMusicVoices(dkd_audio);
  if (dkd_audio.dkd_context && dkd_audio.dkd_v04MenuMusic?.gain) {
    dkd_audio.dkd_v04MenuMusic.gain.cancelScheduledValues(dkd_audio.dkd_context.currentTime);
    dkd_audio.dkd_v04MenuMusic.gain.setValueAtTime(0, dkd_audio.dkd_context.currentTime);
  }
}

function dkd_v061DeviceEnforceDriveOnly(dkd_game) {
  const dkd_audio = dkd_game?.dkd_audio;
  if (!dkd_audio?.dkd_context) return;
  dkd_v061DeviceStopMenuMusic(dkd_audio);
  const dkd_music = dkd_clamp(Number(dkd_audio.dkd_state?.dkd_settings?.dkd_music) || 0, 0, 1);
  if (dkd_audio.dkd_v04DriveMusic?.gain) {
    dkd_audio.dkd_v04DriveMusic.gain.cancelScheduledValues(dkd_audio.dkd_context.currentTime);
    dkd_audio.dkd_v04DriveMusic.gain.setTargetAtTime(dkd_music * .92, dkd_audio.dkd_context.currentTime, .06);
  }
  dkd_audio.dkd_v04Mode = 'v061-drive-only';
}

dkd_Game.prototype.dkd_startRun = function dkd_v061DeviceStartRun() {
  // Stop the Courier Center/Home source before v0.5 starts the selected driving track.
  dkd_v061DeviceStopMenuMusic(this.dkd_audio);
  const dkd_result = dkd_v061DevicePrevious.dkd_startRun.call(this);
  if (this.dkd_run) dkd_v061DeviceEnforceDriveOnly(this);
  return dkd_result;
};

dkd_Game.prototype.dkd_render = function dkd_v061DeviceRender(dkd_page) {
  const dkd_result = dkd_v061DevicePrevious.dkd_render.call(this, dkd_page);
  if (this.dkd_run?.dkd_active || this.dkd_scene?.dkd_mode === 'drive') dkd_v061DeviceEnforceDriveOnly(this);
  return dkd_result;
};

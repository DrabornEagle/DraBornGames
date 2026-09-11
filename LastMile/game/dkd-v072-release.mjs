// DraBornGo / LastMile v0.7.2 shared Android + Web release normalization.
const dkd_v072Version = 'v0.7.2';
const dkd_v072PreviousRender = dkd_Game.prototype.dkd_render;
const dkd_v072PreviousSettings = dkd_Game.prototype.dkd_view_settings;
const dkd_v072PreviousMusic = dkd_Game.prototype.dkd_view_music;

function dkd_v072Text(dkd_value) {
  return String(dkd_value || '')
    .replaceAll('v0.7.1', dkd_v072Version)
    .replaceAll('V0.7 / OYUN MÜZİĞİ', 'V0.7.2 / OYUN MÜZİĞİ')
    .replaceAll('v0.7 ses motoru:', 'v0.7.2 ses motoru:')
    .replaceAll('Menü ve vardiya müzikleri fiziksel MP3 dosyalarından oynatılır.', 'Kurye Merkezi ana menüsünde InnerLight, vardiya sürüşünde SeMeNota fiziksel MP3 olarak oynatılır.')
    .replaceAll('Yeni soundtrack build sırasında stereo WAV olarak oluşturulur ve 192 kbps MP3 dosyalarına dönüştürülür. Oyun çalışırken nota sentezlenmez.', 'Oyunda yalnızca iki gerçek MP3 vardır: Kurye Merkezi ana menüsünde InnerLight, vardiya sürüşünde SeMeNota. Oyun çalışırken nota veya melodi sentezlenmez.')
    .replaceAll('STEREO 44.1K', 'MP3 / 44.1K');
}

function dkd_v072NormalizeVisible(dkd_root) {
  if (!dkd_root) return;
  for (const dkd_chip of dkd_root.querySelectorAll?.('.dkd-version') || []) dkd_chip.textContent = dkd_v072Version;
  const dkd_walker = document.createTreeWalker(dkd_root, NodeFilter.SHOW_TEXT);
  const dkd_nodes = [];
  while (dkd_walker.nextNode()) dkd_nodes.push(dkd_walker.currentNode);
  for (const dkd_node of dkd_nodes) {
    const dkd_value = String(dkd_node.nodeValue || '');
    const dkd_next = dkd_v072Text(dkd_value);
    if (dkd_next !== dkd_value) dkd_node.nodeValue = dkd_next;
  }
}

dkd_Game.prototype.dkd_view_settings = function dkd_v072SettingsView() {
  return dkd_v072Text(dkd_v072PreviousSettings.call(this));
};

dkd_Game.prototype.dkd_view_music = function dkd_v072MusicView() {
  return dkd_v072Text(dkd_v072PreviousMusic.call(this));
};

dkd_Game.prototype.dkd_render = function dkd_v072Render(dkd_page, dkd_arg = null) {
  const dkd_result = dkd_v072PreviousRender.call(this, dkd_page, dkd_arg);
  dkd_v072NormalizeVisible(this.dkd_root);
  return dkd_result;
};

if (window.dkd_lastMileV07) {
  window.dkd_lastMileV07.dkd_version = dkd_v072Version;
  window.dkd_lastMileV07.dkd_audioRuntime = 'physical-mp3-two-track';
  window.dkd_lastMileV07.dkd_tracks = ['InnerLight.mp3', 'SeMeNota.mp3'];
}
window.dkd_lastMileV072 = {
  dkd_version: dkd_v072Version,
  dkd_androidVersionCode: 1,
  dkd_expoSdk: 57,
  dkd_cameraDefault: 'chase',
  dkd_audioRuntime: 'physical-mp3-two-track',
  dkd_menuTrack: 'InnerLight.mp3',
  dkd_driveTrack: 'SeMeNota.mp3',
  dkd_webAndroidSharedSource: true,
};

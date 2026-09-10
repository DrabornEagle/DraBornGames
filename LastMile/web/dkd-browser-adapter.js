const dkd_ref = dkd_value => ({ current: dkd_value });
const dkd_session = dkd_ref(null);
const dkd_cloudReady = dkd_ref(false);
const dkd_cloudSaveBusy = dkd_ref(false);
const dkd_cloudSavePending = dkd_ref(null);
const dkd_writeQueue = dkd_ref(Promise.resolve());
const dkd_latestSave = dkd_ref(null);
const dkd_receive = dkd_payload => window.dkd_nativeReceive?.(dkd_payload);
const dkd_AsyncStorage = {
  getItem: async dkd_key => localStorage.getItem(dkd_key),
  setItem: async (dkd_key, dkd_value) => localStorage.setItem(dkd_key, dkd_value),
  removeItem: async dkd_key => localStorage.removeItem(dkd_key),
};
const dkd_setBootstrap = () => {};
const dkd_setReloadKey = () => location.reload();
const dkd_Linking = { openURL: async dkd_url => { window.open(dkd_url, '_blank', 'noopener,noreferrer'); } };
const dkd_Haptics = {
  NotificationFeedbackType: { Success: 'success' }, ImpactFeedbackStyle: { Light: 'light' },
  notificationAsync: async () => { navigator.vibrate?.([30, 30, 30]); },
  impactAsync: async () => { navigator.vibrate?.(15); },
};
const dkd_Speech = {
  stop: async () => { window.speechSynthesis?.cancel(); },
  speak: dkd_text => {
    if (!window.speechSynthesis) return;
    const dkd_utterance = new SpeechSynthesisUtterance(dkd_text);
    dkd_utterance.lang = 'tr-TR'; dkd_utterance.rate = .95;
    window.speechSynthesis.speak(dkd_utterance);
  },
};
const dkd_ImagePicker = {
  launchImageLibraryAsync: () => new Promise((dkd_resolve, dkd_reject) => {
    const dkd_input = document.createElement('input');
    dkd_input.type = 'file'; dkd_input.accept = 'image/jpeg,image/png,image/webp';
    dkd_input.addEventListener('cancel', () => dkd_resolve({ canceled: true, assets: [] }), { once: true });
    dkd_input.onchange = async () => {
      try {
        const dkd_file = dkd_input.files?.[0];
        if (!dkd_file) return dkd_resolve({ canceled: true, assets: [] });
        if (dkd_file.size > 10 * 1024 * 1024) throw new Error('Lütfen 10 MB altında bir fotoğraf seç.');
        const dkd_bitmap = await createImageBitmap(dkd_file);
        const dkd_canvas = document.createElement('canvas');
        dkd_canvas.width = 512; dkd_canvas.height = 512;
        const dkd_size = Math.min(dkd_bitmap.width, dkd_bitmap.height);
        dkd_canvas.getContext('2d').drawImage(dkd_bitmap, (dkd_bitmap.width - dkd_size) / 2, (dkd_bitmap.height - dkd_size) / 2, dkd_size, dkd_size, 0, 0, 512, 512);
        dkd_bitmap.close();
        dkd_resolve({ canceled: false, assets: [{ mimeType: 'image/jpeg', base64: dkd_canvas.toDataURL('image/jpeg', .75).split(',')[1] }] });
      } catch (dkd_issue) { dkd_reject(dkd_issue); }
    };
    dkd_input.click();
  }),
};
const dkd_share = async (dkd_text, dkd_name, dkd_mime, dkd_base64 = false) => {
  const dkd_bytes = dkd_base64 ? Uint8Array.from(atob(dkd_text), dkd_char => dkd_char.charCodeAt(0)) : dkd_text;
  const dkd_blob = new Blob([dkd_bytes], { type: dkd_mime });
  const dkd_link = document.createElement('a');
  dkd_link.href = URL.createObjectURL(dkd_blob);
  dkd_link.download = dkd_name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 90);
  document.body.append(dkd_link); dkd_link.click(); dkd_link.remove();
  setTimeout(() => URL.revokeObjectURL(dkd_link.href), 30000);
};
try {
  dkd_latestSave.current = localStorage.getItem(dkd_saveKey);
  window.dkd_bootstrap = JSON.parse(dkd_latestSave.current || 'null');
  dkd_session.current = JSON.parse(localStorage.getItem(dkd_authKey) || 'null');
} catch {
  // Leave an unreadable save in storage, so it can be recovered rather than overwritten.
  throw new Error('Tarayıcı kaydı okunamadı. Site verilerini silmeden önce kaydını yedekle.');
}
document.addEventListener('visibilitychange', () => {
  dkd_receive({ dkd_type: document.hidden ? 'background' : 'foreground' });
  if (document.hidden) void dkd_Speech.stop();
});
window.addEventListener('online', () => { void dkd_flushCloudSave(); });

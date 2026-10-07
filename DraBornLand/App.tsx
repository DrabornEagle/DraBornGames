import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, BackHandler, Modal, Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { GAME_HTML } from './generated/game-html';

const SAVE_KEY = 'drabornland-save-v1';
const MAX_SAVE_LENGTH = 2 * 1024 * 1024;

// Insert into the HTML itself: Android's beforeContentLoaded injection is not
// guaranteed to run before an inline game script on every WebView version.
function htmlWithSave(save: unknown): string {
  const value = JSON.stringify(save ?? null).replace(/</g, '\\u003c');
  return GAME_HTML.replace('<head>', `<head><script>window.__NATIVE_SAVE__=${value};window.__NATIVE_PLATFORM__=${JSON.stringify(Platform.OS)};</script>`);
}

export default function App() {
  const view = useRef<WebView<object>>(null);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadId, setLoadId] = useState(0);
  const [exportData, setExportData] = useState<string | null>(null);

  const sendEvent = useCallback((name: string) => {
    const detail = JSON.stringify(name);
    view.current?.injectJavaScript(`(() => { if(typeof window.__DRABORN_NATIVE_EVENT__==='function') window.__DRABORN_NATIVE_EVENT__(${detail}); window.dispatchEvent(new CustomEvent('draborn:native',{detail:${detail}})); })();true;`);
  }, []);

  const loadSave = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await writeQueue.current;
      const raw = await AsyncStorage.getItem(SAVE_KEY);
      let save: unknown = null;
      if (raw) {
        try { save = JSON.parse(raw); } catch { /* Keep a corrupt save until the player imports a replacement. */ }
      }
      setHtml(htmlWithSave(save));
      setLoadId(id => id + 1);
    } catch {
      setError('Yerel kayıt okunamadı. Uygulamayı yeniden deneyebilirsin.');
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadSave(); }, [loadSave]);

  useEffect(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', () => {
      sendEvent('back');
      return true;
    });
    const appState = AppState.addEventListener('change', state => sendEvent(state === 'active' ? 'resume' : 'pause'));
    return () => { back.remove(); appState.remove(); };
  }, [sendEvent]);

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data) as { type?: string; data?: unknown; message?: string; id?: number };
      if (message.type === 'save' && typeof message.data === 'object' && message.data !== null) {
        const raw = JSON.stringify(message.data);
        const id = typeof message.id === 'number' && Number.isSafeInteger(message.id) ? message.id : undefined;
        const acknowledge = (ok: boolean) => {
          const detail = JSON.stringify({ ok, id });
          view.current?.injectJavaScript(`window.dispatchEvent(new CustomEvent('draborn:save-result',{detail:${detail}}));true;`);
        };
        if (raw.length > MAX_SAVE_LENGTH) { acknowledge(false); return; }
        // Queue writes to preserve the newest snapshot when several saves arrive together.
        writeQueue.current = writeQueue.current.then(async () => {
          await AsyncStorage.setItem(SAVE_KEY, raw);
          acknowledge(true);
        }).catch(() => {
          acknowledge(false);
        });
      } else if (message.type === 'ready') {
        setLoading(false);
      } else if (message.type === 'export' && typeof message.data === 'object' && message.data !== null) {
        sendEvent('pause');
        setExportData(JSON.stringify(message.data));
      } else if (message.type === 'error') {
        setError(message.message || 'Oyun başlatılamadı. Yeniden deneyebilirsin.');
        setLoading(false);
      }
    } catch { /* Ignore unrelated WebView messages. */ }
  }, [sendEvent]);

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      {html && !error && (
        <WebView<object>
          key={loadId}
          ref={view}
          style={styles.webview}
          source={{ html, baseUrl: 'https://drabornland.local/' }}
          originWhitelist={['about:blank', 'https://drabornland.local']}
          onShouldStartLoadWithRequest={request => request.url === 'about:blank' || request.url.startsWith('https://drabornland.local/') || request.url.startsWith('data:') || request.url.startsWith('blob:')}
          javaScriptEnabled
          domStorageEnabled
          scrollEnabled={false}
          bounces={false}
          overScrollMode="never"
          androidLayerType="hardware"
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          setSupportMultipleWindows={false}
          onMessage={handleMessage}
          onLoadEnd={() => setLoading(false)}
          onError={event => { setError(event.nativeEvent.description); setLoading(false); }}
          onRenderProcessGone={() => { setError('Android oyun görünümünü kapattı. Kaydını yeniden yükleyebilirsin.'); setLoading(false); }}
        />
      )}
      {(loading || error) && (
        <View style={styles.overlay}>
          <Text style={styles.brand}>DRABORN<Text style={styles.gold}>LAND</Text></Text>
          <Text style={styles.subtitle}>Kayıp adanın çağrısı</Text>
          {loading && !error && <ActivityIndicator size="large" color="#e5b96b" style={styles.spinner} />}
          <Text style={styles.message}>{error || 'Ada hazırlanıyor…'}</Text>
          {error && <Pressable style={styles.retry} onPress={() => { void loadSave(); }}><Text style={styles.retryText}>YENİDEN DENE</Text></Pressable>}
        </View>
      )}
      <Modal visible={exportData !== null} transparent animationType="fade" onRequestClose={() => { setExportData(null); sendEvent('resume'); }}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Kaydı başka cihaza taşı</Text>
            <Text style={styles.modalHelp}>Bu metni paylaş veya seçip kopyala. Web ya da Android oyun menüsünde “Kaydı içe aktar” alanına yapıştır.</Text>
            <ScrollView style={styles.saveText}><Text selectable style={styles.saveCode} accessibilityLabel="DraBornLand kayıt JSON metni">{exportData || ''}</Text></ScrollView>
            <View style={styles.modalActions}>
              <Pressable style={styles.retry} onPress={() => { if (exportData) void Share.share({ message: exportData, title: 'DraBornLand yerel kayıt' }).catch(() => {}); }}><Text style={styles.retryText}>PAYLAŞ</Text></Pressable>
              <Pressable style={styles.close} onPress={() => { setExportData(null); sendEvent('resume'); }}><Text style={styles.closeText}>OYUNA DÖN</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#071419' },
  webview: { flex: 1, backgroundColor: '#071419' },
  overlay: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: '#071419', alignItems: 'center', justifyContent: 'center', padding: 32 },
  brand: { color: '#f5efe1', fontSize: 34, fontWeight: '800', letterSpacing: 4 },
  gold: { color: '#e5b96b' },
  subtitle: { color: '#8faaa6', marginTop: 12, letterSpacing: 2 },
  spinner: { marginTop: 26 },
  message: { color: '#c5d3cd', marginTop: 20, textAlign: 'center', maxWidth: 420 },
  retry: { paddingHorizontal: 28, paddingVertical: 15, backgroundColor: '#e5b96b', borderRadius: 6, marginTop: 24 },
  retryText: { color: '#10211e', fontWeight: '700', letterSpacing: 1 },
  modalBackdrop: { flex: 1, backgroundColor: '#000b', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#10211e', padding: 24, borderRadius: 12, width: '100%', maxWidth: 680, maxHeight: '96%' },
  modalTitle: { color: '#f5efe1', fontWeight: '700', fontSize: 20 },
  modalHelp: { color: '#b1c4bc', marginTop: 10, marginBottom: 12, fontSize: 13 },
  saveText: { backgroundColor: '#071419', borderRadius: 6, padding: 12, height: 96 },
  saveCode: { color: '#d5e2db', fontSize: 11 },
  modalActions: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  close: { padding: 16, marginTop: 24 },
  closeText: { color: '#c5d3cd', fontWeight: '700' },
});

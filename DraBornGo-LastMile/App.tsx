import { createElement as dkd_createElement, useEffect as dkd_useEffect, useMemo as dkd_useMemo, useRef as dkd_useRef, useState as dkd_useState } from 'react';
import { ActivityIndicator as dkd_ActivityIndicator, AppState as dkd_AppState, BackHandler as dkd_BackHandler, Pressable as dkd_Pressable, Text as dkd_Text, View as dkd_View } from 'react-native';
import { WebView as dkd_WebView, type WebViewMessageEvent as dkd_WebViewMessageEvent } from 'react-native-webview';
import { SafeAreaProvider as dkd_SafeAreaProvider, useSafeAreaInsets as dkd_useSafeAreaInsets } from 'react-native-safe-area-context';
import dkd_AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar as dkd_StatusBar } from 'expo-status-bar';
import * as dkd_ImagePicker from 'expo-image-picker';
import * as dkd_FileSystem from 'expo-file-system/legacy';
import * as dkd_Sharing from 'expo-sharing';
import * as dkd_Haptics from 'expo-haptics';
import * as dkd_Speech from 'expo-speech';
import { dkd_gameHtml } from './src/generated/dkd-game-html';

const dkd_saveKey = 'dkd_lastmile_native_v1';
const dkd_maxMessage = 5 * 1024 * 1024;
type dkd_Payload = { dkd_type: string; dkd_data?: unknown };

function dkd_Container() {
  const dkd_insets = dkd_useSafeAreaInsets();
  const dkd_web = dkd_useRef<dkd_WebView>(null);
  const [dkd_bootstrap, dkd_setBootstrap] = dkd_useState<string | null>(null);
  const [dkd_error, dkd_setError] = dkd_useState('');
  const [dkd_reloadKey, dkd_setReloadKey] = dkd_useState(0);
  const [dkd_storageAttempt, dkd_setStorageAttempt] = dkd_useState(0);
  const dkd_writeQueue = dkd_useRef<Promise<void>>(Promise.resolve());
  const dkd_latestSave = dkd_useRef<string | null>(null);
  const dkd_shareBusy = dkd_useRef(false);

  const dkd_receive = (dkd_payload: dkd_Payload) => {
    dkd_web.current?.injectJavaScript(`window.dkd_nativeReceive && window.dkd_nativeReceive(${JSON.stringify(dkd_payload).replace(/</g, '\\u003c')}); true;`);
  };

  dkd_useEffect(() => {
    let dkd_alive = true;
    dkd_AsyncStorage.getItem(dkd_saveKey).then(dkd_value => {
      if (!dkd_alive) return;
      if (dkd_value) { const dkd_saved = JSON.parse(dkd_value); if (!dkd_saved?.dkd_career || dkd_saved.dkd_career.dkd_schema !== 1) throw new Error('Kayıt biçimi geçersiz.'); }
      dkd_latestSave.current = dkd_value;
      dkd_setBootstrap(dkd_value || 'null');
    }).catch(() => {
      if (dkd_alive) dkd_setError('Kayıt okunamadı. Kayıt üzerine yazılmadı. Expo Go’yu yeniden açıp tekrar dene.');
    });
    const dkd_subscription = dkd_AppState.addEventListener('change', dkd_status => {
      dkd_receive({ dkd_type: dkd_status === 'active' ? 'foreground' : 'background' });
      if (dkd_status !== 'active') void dkd_Speech.stop();
    });
    const dkd_back = dkd_BackHandler.addEventListener('hardwareBackPress', () => { dkd_receive({ dkd_type: 'back' }); return true; });
    return () => { dkd_alive = false; dkd_subscription.remove(); dkd_back.remove(); void dkd_Speech.stop(); };
  }, [dkd_storageAttempt]);

  const dkd_html = dkd_useMemo(() => dkd_gameHtml.replace('/*DKD_BOOTSTRAP*/', `window.dkd_bootstrap=${(dkd_bootstrap || 'null').replace(/</g, '\\u003c')};`), [dkd_bootstrap]);

  const dkd_share = async (dkd_text: string, dkd_name: string, dkd_mime: string, dkd_base64 = false) => {
    if (dkd_shareBusy.current) return;
    dkd_shareBusy.current = true;
    let dkd_path: string | null = null;
    try {
      if (!await dkd_Sharing.isAvailableAsync()) throw new Error('Bu cihazda dosya paylaşımı kullanılamıyor.');
      if (!dkd_FileSystem.cacheDirectory) throw new Error('Geçici dosya alanı açılamadı.');
      const dkd_filename = dkd_name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 90);
      dkd_path = `${dkd_FileSystem.cacheDirectory}${dkd_filename}`;
      await dkd_FileSystem.writeAsStringAsync(dkd_path, dkd_text, { encoding: dkd_base64 ? dkd_FileSystem.EncodingType.Base64 : dkd_FileSystem.EncodingType.UTF8 });
      await dkd_Sharing.shareAsync(dkd_path, { mimeType: dkd_mime, dialogTitle: 'LAST MILE dosyasını paylaş veya kaydet' });
    } finally {
      // Keep the private cache file available while the selected Android app reads its URI.
      // The next export reuses the same filename; Android may reclaim this cache.
      dkd_shareBusy.current = false;
    }
  };

  const dkd_onMessage = async (dkd_event: dkd_WebViewMessageEvent) => {
    try {
      if (dkd_event.nativeEvent.data.length > dkd_maxMessage) throw new Error('İşlem verisi izin verilen boyutu aşıyor.');
      const dkd_message = JSON.parse(dkd_event.nativeEvent.data);
      const dkd_data = dkd_message.dkd_data;
      if (dkd_message.dkd_type === 'save') {
        if (!dkd_data?.dkd_career || dkd_data.dkd_career.dkd_schema !== 1) throw new Error('Kayıt biçimi geçersiz.');
        const dkd_serialized = JSON.stringify(dkd_data);
        dkd_latestSave.current = dkd_serialized;
        dkd_writeQueue.current = dkd_writeQueue.current.catch(() => {}).then(() => dkd_AsyncStorage.setItem(dkd_saveKey, dkd_serialized));
        await dkd_writeQueue.current;
      } else if (dkd_message.dkd_type === 'pick-photo') {
        const dkd_result = await dkd_ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: .55, base64: true });
        if (!dkd_result.canceled && dkd_result.assets[0]?.base64) {
          const dkd_asset = dkd_result.assets[0];
          const dkd_photo = `data:${dkd_asset.mimeType || 'image/jpeg'};base64,${dkd_asset.base64}`;
          if (dkd_photo.length > 900000) throw new Error('Fotoğraf çok büyük. Daha küçük bir görsel seç.');
          dkd_receive({ dkd_type: 'photo', dkd_data: dkd_photo });
        }
      } else if (dkd_message.dkd_type === 'haptic') {
        if (dkd_data?.dkd_kind === 'success') await dkd_Haptics.notificationAsync(dkd_Haptics.NotificationFeedbackType.Success);
        else await dkd_Haptics.impactAsync(dkd_Haptics.ImpactFeedbackStyle.Light);
      } else if (dkd_message.dkd_type === 'share-file') {
        if (typeof dkd_data?.dkd_data !== 'string' || !/^data:image\/(png|jpeg);base64,/.test(dkd_data.dkd_data)) throw new Error('Paylaşılacak görsel geçersiz.');
        await dkd_share(dkd_data.dkd_data.split(',')[1], String(dkd_data.dkd_name || 'LAST-MILE.png'), String(dkd_data.dkd_mime || 'image/png'), true);
      } else if (dkd_message.dkd_type === 'export-json') {
        if (typeof dkd_data?.dkd_text !== 'string') throw new Error('Yedek boş.');
        JSON.parse(dkd_data.dkd_text);
        await dkd_share(dkd_data.dkd_text, String(dkd_data.dkd_name || 'LAST-MILE.json'), 'application/json');
      } else if (dkd_message.dkd_type === 'speak') {
        await dkd_Speech.stop();
        dkd_Speech.speak(String(dkd_data?.dkd_text || '').slice(0, 600), { language: 'tr-TR', rate: .95 });
      } else if (dkd_message.dkd_type === 'stop-speech') await dkd_Speech.stop();
      else if (dkd_message.dkd_type === 'reload') {
        await dkd_writeQueue.current.catch(() => {});
        dkd_setBootstrap(dkd_latestSave.current || 'null');
        dkd_setReloadKey(dkd_previous => dkd_previous + 1);
      }
    } catch (dkd_issue) {
      dkd_receive({ dkd_type: 'error', dkd_data: dkd_issue instanceof Error ? dkd_issue.message : 'İşlem tamamlanamadı.' });
    }
  };

  return dkd_createElement(dkd_View, { style: { flex: 1, backgroundColor: '#090f16', paddingTop: dkd_insets.top, paddingBottom: dkd_insets.bottom } },
    dkd_createElement(dkd_StatusBar, { style: 'light' }),
    dkd_error ? dkd_createElement(dkd_View, { style: { flex: 1, padding: 24, justifyContent: 'center', gap: 18 } },
      dkd_createElement(dkd_Text, { style: { color: '#e4ff5e', fontSize: 25, fontWeight: '800' }, selectable: true }, 'LAST MILE'),
      dkd_createElement(dkd_Text, { style: { color: '#d9e1e5', fontSize: 16, lineHeight: 25 }, selectable: true }, dkd_error),
      dkd_createElement(dkd_Pressable, { onPress: () => { dkd_setError(''); if (dkd_bootstrap === null) dkd_setStorageAttempt(dkd_previous => dkd_previous + 1); else { dkd_setBootstrap(dkd_latestSave.current || dkd_bootstrap); dkd_setReloadKey(dkd_previous => dkd_previous + 1); } }, style: { padding: 18, backgroundColor: '#e4ff5e', borderRadius: 12 } }, dkd_createElement(dkd_Text, { style: { color: '#122219', fontWeight: '700', textAlign: 'center' } }, 'Tekrar dene')))
      : dkd_bootstrap === null ? dkd_createElement(dkd_ActivityIndicator, { size: 'large', color: '#e4ff5e', style: { flex: 1 } })
      : dkd_createElement(dkd_WebView, {
        key: dkd_reloadKey,
        ref: dkd_web,
        source: { html: dkd_html },
        originWhitelist: ['*'],
        javaScriptEnabled: true,
        domStorageEnabled: true,
        androidLayerType: 'hardware',
        mediaPlaybackRequiresUserAction: false,
        allowsInlineMediaPlayback: true,
        overScrollMode: 'never',
        scrollEnabled: false,
        setSupportMultipleWindows: false,
        allowFileAccess: false,
        allowUniversalAccessFromFileURLs: false,
        textZoom: 100,
        style: { flex: 1, backgroundColor: '#090f16' },
        onMessage: dkd_onMessage,
        onShouldStartLoadWithRequest: dkd_request => dkd_request.url === 'about:blank' || dkd_request.url.startsWith('data:text/html'),
        onError: () => dkd_setError('Oyun ekranı yüklenemedi. Yeniden açıp tekrar dene.'),
        onRenderProcessGone: () => dkd_setError('Android oyun ekranını kapattı. Kaydedilmiş kariyerin korunuyor; aktif teslimatı yeniden denemen gerekir.'),
      })
  );
}

export default function dkd_App() { return dkd_createElement(dkd_SafeAreaProvider, null, dkd_createElement(dkd_Container)); }

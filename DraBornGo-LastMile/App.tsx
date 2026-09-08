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
const dkd_authKey = 'dkd_lastmile_auth_v04';
const dkd_maxMessage = 5 * 1024 * 1024;
const dkd_supabaseUrl = 'https://guuwomvszlwhkmstewfl.supabase.co';
const dkd_supabaseKey = 'sb_publishable_bf1URxrlLlvMQ8e1Z7oxkQ_jx9mvy5g';
const dkd_edgeUrl = `${dkd_supabaseUrl}/functions/v1/dkd-last-mile-api`;

type dkd_Payload = { dkd_type: string; dkd_data?: any };
type dkd_Session = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in?: number;
  token_type?: string;
  user?: {
    id?: string;
    email?: string;
    app_metadata?: Record<string, unknown>;
    user_metadata?: Record<string, unknown>;
  };
};

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
  const dkd_session = dkd_useRef<dkd_Session | null>(null);
  const dkd_cloudReady = dkd_useRef(false);
  const dkd_cloudSaveBusy = dkd_useRef(false);
  const dkd_cloudSavePending = dkd_useRef<any>(null);

  const dkd_receive = (dkd_payload: dkd_Payload) => {
    dkd_web.current?.injectJavaScript(`window.dkd_nativeReceive && window.dkd_nativeReceive(${JSON.stringify(dkd_payload).replace(/</g, '\\u003c')}); true;`);
  };

  const dkd_storeSession = async (dkd_value: dkd_Session | null) => {
    dkd_session.current = dkd_value;
    if (dkd_value) await dkd_AsyncStorage.setItem(dkd_authKey, JSON.stringify(dkd_value));
    else await dkd_AsyncStorage.removeItem(dkd_authKey);
  };

  const dkd_authFetch = async (dkd_path: string, dkd_body: Record<string, unknown>, dkd_accessToken = '') => {
    const dkd_response = await fetch(`${dkd_supabaseUrl}${dkd_path}`, {
      method: 'POST',
      headers: {
        apikey: dkd_supabaseKey,
        'Content-Type': 'application/json',
        ...(dkd_accessToken ? { Authorization: `Bearer ${dkd_accessToken}` } : {}),
      },
      body: JSON.stringify(dkd_body),
    });
    const dkd_json = await dkd_response.json().catch(() => ({}));
    if (!dkd_response.ok) throw new Error(String(dkd_json?.msg || dkd_json?.message || dkd_json?.error_description || dkd_json?.error || 'Oturum işlemi başarısız.'));
    return dkd_json as dkd_Session;
  };

  const dkd_refreshSession = async () => {
    const dkd_current = dkd_session.current;
    if (!dkd_current?.refresh_token) return null;
    const dkd_expiresAt = Number(dkd_current.expires_at || 0);
    if (dkd_expiresAt > Math.floor(Date.now() / 1000) + 60 && dkd_current.access_token) return dkd_current;
    try {
      const dkd_refreshed = await dkd_authFetch('/auth/v1/token?grant_type=refresh_token', { refresh_token: dkd_current.refresh_token });
      await dkd_storeSession(dkd_refreshed);
      return dkd_refreshed;
    } catch {
      await dkd_storeSession(null);
      dkd_cloudReady.current = false;
      return null;
    }
  };

  const dkd_emitAuth = async () => {
    const dkd_current = await dkd_refreshSession();
    dkd_receive({
      dkd_type: 'auth-state',
      dkd_data: {
        dkd_authenticated: Boolean(dkd_current?.access_token),
        dkd_email: dkd_current?.user?.email || '',
      },
    });
  };

  const dkd_edge = async (dkd_action: string, dkd_data: Record<string, unknown> = {}) => {
    const dkd_current = await dkd_refreshSession();
    if (!dkd_current?.access_token) throw new Error('Oturum açman gerekiyor.');
    const dkd_response = await fetch(dkd_edgeUrl, {
      method: 'POST',
      headers: {
        apikey: dkd_supabaseKey,
        Authorization: `Bearer ${dkd_current.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dkd_action, ...dkd_data }),
    });
    const dkd_json = await dkd_response.json().catch(() => ({}));
    if (!dkd_response.ok || dkd_json?.dkd_ok === false || dkd_json?.dkd_error) {
      throw new Error(String(dkd_json?.dkd_error || 'Last-Mile sunucu işlemi başarısız.'));
    }
    return dkd_json;
  };

  const dkd_bootstrapCloud = async () => {
    try {
      const dkd_result = await dkd_edge('bootstrap');
      dkd_cloudReady.current = dkd_result?.dkd_data?.dkd_enabled === true;
      dkd_receive({ dkd_type: 'cloud-bootstrap', dkd_data: dkd_result });
    } catch (dkd_issue) {
      dkd_cloudReady.current = false;
      dkd_receive({ dkd_type: 'cloud-error', dkd_data: dkd_issue instanceof Error ? dkd_issue.message : 'Last-Mile bağlantısı kurulamadı.' });
    }
  };

  const dkd_flushCloudSave = async () => {
    if (dkd_cloudSaveBusy.current || !dkd_cloudReady.current || !dkd_cloudSavePending.current) return;
    const dkd_gameState = dkd_cloudSavePending.current;
    dkd_cloudSavePending.current = null;
    dkd_cloudSaveBusy.current = true;
    try {
      await dkd_edge('save_progress', { dkd_game_state: dkd_gameState });
    } catch {
      dkd_cloudSavePending.current = dkd_gameState;
    } finally {
      dkd_cloudSaveBusy.current = false;
      if (dkd_cloudSavePending.current) setTimeout(() => void dkd_flushCloudSave(), 1200);
    }
  };

  dkd_useEffect(() => {
    let dkd_alive = true;
    Promise.all([dkd_AsyncStorage.getItem(dkd_saveKey), dkd_AsyncStorage.getItem(dkd_authKey)]).then(([dkd_value, dkd_authValue]) => {
      if (!dkd_alive) return;
      if (dkd_value) {
        const dkd_saved = JSON.parse(dkd_value);
        if (!dkd_saved?.dkd_career || dkd_saved.dkd_career.dkd_schema !== 1) throw new Error('Kayıt biçimi geçersiz.');
      }
      if (dkd_authValue) {
        try { dkd_session.current = JSON.parse(dkd_authValue); } catch { dkd_session.current = null; }
      }
      dkd_latestSave.current = dkd_value;
      dkd_setBootstrap(dkd_value || 'null');
    }).catch(() => {
      if (dkd_alive) dkd_setError('Kayıt okunamadı. Kayıt üzerine yazılmadı. Expo Go’yu yeniden açıp tekrar dene.');
    });

    const dkd_subscription = dkd_AppState.addEventListener('change', dkd_status => {
      dkd_receive({ dkd_type: dkd_status === 'active' ? 'foreground' : 'background' });
      if (dkd_status === 'active') void dkd_emitAuth();
      else void dkd_Speech.stop();
    });
    const dkd_back = dkd_BackHandler.addEventListener('hardwareBackPress', () => { dkd_receive({ dkd_type: 'back' }); return true; });
    return () => {
      dkd_alive = false;
      dkd_subscription.remove();
      dkd_back.remove();
      void dkd_Speech.stop();
    };
  }, [dkd_storageAttempt]);

  const dkd_html = dkd_useMemo(
    () => dkd_gameHtml.replace('/*DKD_BOOTSTRAP*/', `window.dkd_bootstrap=${(dkd_bootstrap || 'null').replace(/</g, '\\u003c')};`),
    [dkd_bootstrap],
  );

  const dkd_share = async (dkd_text: string, dkd_name: string, dkd_mime: string, dkd_base64 = false) => {
    if (dkd_shareBusy.current) return;
    dkd_shareBusy.current = true;
    try {
      if (!await dkd_Sharing.isAvailableAsync()) throw new Error('Bu cihazda dosya paylaşımı kullanılamıyor.');
      if (!dkd_FileSystem.cacheDirectory) throw new Error('Geçici dosya alanı açılamadı.');
      const dkd_filename = dkd_name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 90);
      const dkd_path = `${dkd_FileSystem.cacheDirectory}${dkd_filename}`;
      await dkd_FileSystem.writeAsStringAsync(dkd_path, dkd_text, { encoding: dkd_base64 ? dkd_FileSystem.EncodingType.Base64 : dkd_FileSystem.EncodingType.UTF8 });
      await dkd_Sharing.shareAsync(dkd_path, { mimeType: dkd_mime, dialogTitle: 'SON KİLOMETRE dosyasını paylaş veya kaydet' });
    } finally {
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
      } else if (dkd_message.dkd_type === 'auth-state-request') {
        await dkd_emitAuth();
      } else if (dkd_message.dkd_type === 'auth-login') {
        const dkd_email = String(dkd_data?.dkd_email || '').trim().toLowerCase();
        const dkd_password = String(dkd_data?.dkd_password || '');
        if (!dkd_email || dkd_password.length < 6) throw new Error('E-posta ve şifreyi kontrol et.');
        const dkd_loggedIn = await dkd_authFetch('/auth/v1/token?grant_type=password', { email: dkd_email, password: dkd_password });
        await dkd_storeSession(dkd_loggedIn);
        dkd_cloudReady.current = false;
        dkd_receive({ dkd_type: 'auth-state', dkd_data: { dkd_authenticated: true, dkd_email: dkd_loggedIn.user?.email || dkd_email } });
      } else if (dkd_message.dkd_type === 'auth-signup') {
        const dkd_email = String(dkd_data?.dkd_email || '').trim().toLowerCase();
        const dkd_password = String(dkd_data?.dkd_password || '');
        const dkd_fullName = String(dkd_data?.dkd_full_name || '').trim().slice(0, 80);
        const dkd_username = String(dkd_data?.dkd_username || '').trim().slice(0, 40);
        const dkd_companyName = String(dkd_data?.dkd_company_name || '').trim().slice(0, 80);
        const dkd_phone = String(dkd_data?.dkd_phone || '').replace(/[^+0-9]/g, '').slice(0, 30);
        if (!dkd_email || dkd_password.length < 6 || dkd_fullName.length < 3 || !/^[A-Za-z0-9_]{3,22}$/.test(dkd_username) || dkd_companyName.length < 2 || !/^\+?\d{10,15}$/.test(dkd_phone)) {
          throw new Error('Kayıt bilgilerini kontrol et.');
        }
        const dkd_signedUp = await dkd_authFetch('/auth/v1/signup', {
          email: dkd_email,
          password: dkd_password,
          data: {
            dkd_full_name: dkd_fullName,
            dkd_username,
            dkd_company_name: dkd_companyName,
            dkd_phone,
          },
        });
        if (dkd_signedUp?.access_token && dkd_signedUp?.refresh_token) {
          await dkd_storeSession(dkd_signedUp);
          dkd_cloudReady.current = false;
          dkd_receive({
            dkd_type: 'auth-signup-result',
            dkd_data: {
              dkd_authenticated: true,
              dkd_confirmation_required: false,
              dkd_email: dkd_signedUp.user?.email || dkd_email,
            },
          });
        } else {
          dkd_receive({
            dkd_type: 'auth-signup-result',
            dkd_data: {
              dkd_authenticated: false,
              dkd_confirmation_required: true,
              dkd_email,
            },
          });
        }
      } else if (dkd_message.dkd_type === 'auth-logout') {
        const dkd_current = await dkd_refreshSession();
        if (dkd_current?.access_token) {
          try { await dkd_authFetch('/auth/v1/logout', {}, dkd_current.access_token); } catch {}
        }
        await dkd_storeSession(null);
        dkd_cloudReady.current = false;
        dkd_cloudSavePending.current = null;
        dkd_receive({ dkd_type: 'auth-state', dkd_data: { dkd_authenticated: false, dkd_email: '', dkd_logged_out: true } });
      } else if (dkd_message.dkd_type === 'cloud-bootstrap') {
        await dkd_bootstrapCloud();
      } else if (dkd_message.dkd_type === 'cloud-claim-jobs') {
        const dkd_count = Math.max(1, Math.min(6, Math.floor(Number(dkd_data?.dkd_count || 4))));
        const dkd_level = Math.max(1, Math.floor(Number(dkd_data?.dkd_level || 1)));
        const dkd_jobs = [];
        for (let dkd_index = 0; dkd_index < dkd_count; dkd_index++) {
          const dkd_result = await dkd_edge('claim_job', { dkd_level });
          if (dkd_result?.dkd_data) dkd_jobs.push(dkd_result.dkd_data);
        }
        dkd_receive({ dkd_type: 'cloud-jobs', dkd_data: dkd_jobs });
      } else if (dkd_message.dkd_type === 'cloud-accept-job') {
        const dkd_jobId = String(dkd_data?.dkd_job_id || '');
        if (dkd_jobId) {
          await dkd_edge('accept_job', { dkd_job_id: dkd_jobId });
          dkd_receive({ dkd_type: 'cloud-job-accepted', dkd_data: { dkd_job_id: dkd_jobId } });
        }
      } else if (dkd_message.dkd_type === 'cloud-cancel-job') {
        const dkd_jobId = String(dkd_data?.dkd_job_id || '');
        if (dkd_jobId) {
          await dkd_edge('cancel_job', { dkd_job_id: dkd_jobId, dkd_reason: String(dkd_data?.dkd_reason || 'user_cancelled').slice(0, 120) });
          dkd_receive({ dkd_type: 'cloud-job-cancelled', dkd_data: { dkd_job_id: dkd_jobId } });
        }
      } else if (dkd_message.dkd_type === 'cloud-complete-job') {
        const dkd_jobId = String(dkd_data?.dkd_job_id || '');
        if (dkd_jobId) {
          await dkd_edge('complete_job', { dkd_job_id: dkd_jobId, dkd_metrics: dkd_data?.dkd_metrics || {} });
          dkd_receive({ dkd_type: 'cloud-job-complete', dkd_data: { dkd_job_id: dkd_jobId } });
        }
      } else if (dkd_message.dkd_type === 'admin-demo-toggle') {
        const dkd_result = await dkd_edge('toggle_demo', { dkd_enabled: dkd_data?.dkd_enabled === true });
        dkd_cloudReady.current = dkd_result?.dkd_data?.dkd_enabled === true;
        dkd_receive({ dkd_type: 'cloud-bootstrap', dkd_data: dkd_result });
      } else if (dkd_message.dkd_type === 'cloud-save') {
        if (dkd_data?.dkd_game_state && dkd_cloudReady.current) {
          dkd_cloudSavePending.current = dkd_data.dkd_game_state;
          void dkd_flushCloudSave();
        }
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
        await dkd_share(dkd_data.dkd_data.split(',')[1], String(dkd_data.dkd_name || 'Son-Kilometre.png'), String(dkd_data.dkd_mime || 'image/png'), true);
      } else if (dkd_message.dkd_type === 'export-json') {
        if (typeof dkd_data?.dkd_text !== 'string') throw new Error('Dosya verisi boş.');
        JSON.parse(dkd_data.dkd_text);
        await dkd_share(dkd_data.dkd_text, String(dkd_data.dkd_name || 'Son-Kilometre.json'), 'application/json');
      } else if (dkd_message.dkd_type === 'speak') {
        await dkd_Speech.stop();
        dkd_Speech.speak(String(dkd_data?.dkd_text || '').slice(0, 600), { language: 'tr-TR', rate: .95 });
      } else if (dkd_message.dkd_type === 'stop-speech') {
        await dkd_Speech.stop();
      } else if (dkd_message.dkd_type === 'reload') {
        await dkd_writeQueue.current.catch(() => {});
        dkd_setBootstrap(dkd_latestSave.current || 'null');
        dkd_setReloadKey(dkd_previous => dkd_previous + 1);
      }
    } catch (dkd_issue) {
      const dkd_message = dkd_issue instanceof Error ? dkd_issue.message : 'İşlem tamamlanamadı.';
      const dkd_raw = String(dkd_event.nativeEvent.data);
      if (dkd_raw.includes('cloud-') || dkd_raw.includes('admin-demo')) dkd_receive({ dkd_type: 'cloud-error', dkd_data: dkd_message });
      else dkd_receive({ dkd_type: 'error', dkd_data: dkd_message });
    }
  };

  return dkd_createElement(
    dkd_View,
    { style: { flex: 1, backgroundColor: '#0c1224', paddingTop: dkd_insets.top, paddingBottom: dkd_insets.bottom } },
    dkd_createElement(dkd_StatusBar, { style: 'light' }),
    dkd_error
      ? dkd_createElement(
          dkd_View,
          { style: { flex: 1, padding: 24, justifyContent: 'center', gap: 18 } },
          dkd_createElement(dkd_Text, { style: { color: '#e4ff5e', fontSize: 25, fontWeight: '800' }, selectable: true }, 'SON KİLOMETRE'),
          dkd_createElement(dkd_Text, { style: { color: '#d9e1e5', fontSize: 16, lineHeight: 25 }, selectable: true }, dkd_error),
          dkd_createElement(
            dkd_Pressable,
            {
              onPress: () => {
                dkd_setError('');
                if (dkd_bootstrap === null) dkd_setStorageAttempt(dkd_previous => dkd_previous + 1);
                else {
                  dkd_setBootstrap(dkd_latestSave.current || dkd_bootstrap);
                  dkd_setReloadKey(dkd_previous => dkd_previous + 1);
                }
              },
              style: { padding: 18, backgroundColor: '#e4ff5e', borderRadius: 12 },
            },
            dkd_createElement(dkd_Text, { style: { color: '#162c3d', fontWeight: '700', textAlign: 'center' } }, 'Tekrar dene'),
          ),
        )
      : dkd_bootstrap === null
        ? dkd_createElement(dkd_ActivityIndicator, { size: 'large', color: '#e4ff5e', style: { flex: 1 } })
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
            style: { flex: 1, backgroundColor: '#0c1224' },
            onMessage: dkd_onMessage,
            onLoadEnd: () => void dkd_emitAuth(),
            onShouldStartLoadWithRequest: dkd_request => dkd_request.url === 'about:blank' || dkd_request.url.startsWith('data:text/html'),
            onError: () => dkd_setError('Oyun ekranı yüklenemedi. Yeniden açıp tekrar dene.'),
            onRenderProcessGone: () => dkd_setError('Android oyun ekranını kapattı. Kaydedilmiş kariyerin korunuyor; aktif teslimatı yeniden denemen gerekir.'),
          }),
  );
}

export default function dkd_App() {
  return dkd_createElement(dkd_SafeAreaProvider, null, dkd_createElement(dkd_Container));
}

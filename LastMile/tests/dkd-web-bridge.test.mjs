import dkd_test from 'node:test';
import dkd_assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs/promises';
import * as dkd_vm from 'node:vm';
import dkd_ts from 'typescript';

const dkd_root = new URL('../', import.meta.url);
async function dkd_browser(dkd_responder) {
  const dkd_source = await dkd_fs.readFile(new URL('App.tsx', dkd_root), 'utf8');
  const dkd_adapter = await dkd_fs.readFile(new URL('web/dkd-browser-adapter.js', dkd_root), 'utf8');
  const dkd_slice = (dkd_start, dkd_end) => dkd_source.slice(dkd_source.indexOf(dkd_start), dkd_source.indexOf(dkd_end, dkd_source.indexOf(dkd_start)));
  const dkd_code = dkd_ts.transpileModule(`(()=>{${dkd_slice('const dkd_saveKey', 'type dkd_Payload')}\n${dkd_adapter}\n${dkd_slice('  const dkd_storeSession', '  dkd_useEffect')}\n${dkd_slice('  const dkd_onMessage', '\n  return dkd_createElement')}\nwindow.dkd_testSend=dkd_onMessage;})();`, { compilerOptions: { target: dkd_ts.ScriptTarget.ES2020 } }).outputText;
  const dkd_messages = [], dkd_requests = [], dkd_storage = new Map();
  const dkd_context = dkd_vm.createContext({
    window: { addEventListener() {}, dkd_nativeReceive: dkd_payload => dkd_messages.push(dkd_payload) },
    document: { addEventListener() {} }, navigator: {}, console,
    localStorage: { getItem: dkd_key => dkd_storage.get(dkd_key) || null, setItem: (dkd_key, dkd_value) => dkd_storage.set(dkd_key, dkd_value), removeItem: dkd_key => dkd_storage.delete(dkd_key) },
    fetch: async (dkd_url, dkd_options) => { dkd_requests.push({ dkd_url, ...dkd_options }); return dkd_responder(dkd_url, dkd_options); },
    setTimeout, clearTimeout, URL, Blob, Uint8Array,
  });
  new dkd_vm.Script(dkd_code).runInContext(dkd_context);
  return { dkd_messages, dkd_requests, dkd_storage, dkd_send: (dkd_type, dkd_data) => dkd_context.window.dkd_testSend({ nativeEvent: { data: JSON.stringify({ dkd_type, dkd_data }) } }) };
}

dkd_test('browser uses the native auth handler and restores account progress from the same server', async () => {
  const dkd_client = await dkd_browser(async dkd_url => ({ ok: true, json: async () => dkd_url.includes('/auth/') ? { access_token: 'test-token', refresh_token: 'test-refresh', expires_at: Math.floor(Date.now()/1000)+3600, user: { email: 'test@example.invalid' } } : { dkd_ok: true, dkd_data: { dkd_enabled: true, dkd_progress: { dkd_schema: 1, dkd_xp: 320 } } } }));
  await dkd_client.dkd_send('auth-login', { dkd_email: 'test@example.invalid', dkd_password: 'test-only-password' });
  await dkd_client.dkd_send('cloud-bootstrap', {});
  dkd_assert.equal(dkd_client.dkd_messages[0].dkd_type, 'auth-state');
  dkd_assert.equal(dkd_client.dkd_messages[1].dkd_data.dkd_data.dkd_progress.dkd_xp, 320);
  dkd_assert.equal(dkd_client.dkd_requests[1].headers.Authorization, 'Bearer test-token');
  dkd_assert.equal(JSON.parse(dkd_client.dkd_requests[1].body).dkd_action, 'bootstrap');
  dkd_assert.equal(dkd_client.dkd_requests.length, 2);
});

dkd_test('browser persistence validates saves and retains the last valid career on invalid input', async () => {
  const dkd_client = await dkd_browser(() => { throw new Error('Unexpected network'); });
  await dkd_client.dkd_send('save', { dkd_career: { dkd_schema: 1, dkd_xp: 42 } });
  await dkd_client.dkd_send('save', { dkd_career: { dkd_schema: 99, dkd_xp: 0 } });
  dkd_assert.equal(JSON.parse(dkd_client.dkd_storage.get('dkd_lastmile_native_v1')).dkd_career.dkd_xp, 42);
  dkd_assert.equal(dkd_client.dkd_messages.at(-1).dkd_type, 'error');
});

dkd_test('browser reports login rejection and does not emit an authenticated state', async () => {
  const dkd_client = await dkd_browser(async () => ({ ok: false, json: async () => ({ message: 'Invalid login credentials' }) }));
  await dkd_client.dkd_send('auth-login', { dkd_email: 'test@example.invalid', dkd_password: 'test-only-password' });
  dkd_assert.equal(dkd_client.dkd_messages[0].dkd_type, 'error');
  dkd_assert.equal(dkd_client.dkd_storage.has('dkd_lastmile_auth_v04'), false);
});

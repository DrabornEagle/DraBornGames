#!/usr/bin/env python3
from pathlib import Path


dkd_root = Path(__file__).resolve().parents[1]
dkd_app = dkd_root / 'App.tsx'
dkd_source = dkd_app.read_text(encoding='utf-8')
dkd_marker = 'function dkd_LoadingScreen()'

if dkd_marker not in dkd_source:
    dkd_component = r'''function dkd_LoadingScreen() {
  return dkd_createElement(
    dkd_View,
    { style: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0c1224', paddingHorizontal: 28 } },
    dkd_createElement(
      dkd_View,
      { style: { width: '100%', maxWidth: 390, alignItems: 'center', paddingVertical: 34, paddingHorizontal: 24, borderWidth: 1, borderColor: '#314c68', borderRadius: 30, backgroundColor: '#111f35' } },
      dkd_createElement(
        dkd_View,
        { style: { width: 92, height: 92, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#50749a', borderRadius: 28, backgroundColor: '#172d49' } },
        dkd_createElement(dkd_ActivityIndicator, { size: 'large', color: '#70e0d2' }),
      ),
      dkd_createElement(dkd_Text, { style: { marginTop: 22, color: '#84e3d5', fontSize: 11, fontWeight: '900', letterSpacing: 2.2 } }, 'DRABORNGO'),
      dkd_createElement(dkd_Text, { style: { marginTop: 8, color: '#f4f7ff', fontSize: 28, fontWeight: '900', letterSpacing: 2.4, textAlign: 'center' } }, 'SON KİLOMETRE'),
      dkd_createElement(dkd_Text, { style: { marginTop: 11, color: '#aebfd4', fontSize: 15, fontWeight: '600', textAlign: 'center' } }, 'Şehrin hazırlanıyor…'),
      dkd_createElement(
        dkd_View,
        { style: { width: '100%', flexDirection: 'row', gap: 7, marginTop: 24 } },
        dkd_createElement(dkd_View, { style: { height: 7, flex: 1.4, borderRadius: 7, backgroundColor: '#70e0d2' } }),
        dkd_createElement(dkd_View, { style: { height: 7, flex: 1, borderRadius: 7, backgroundColor: '#7fa9ff' } }),
        dkd_createElement(dkd_View, { style: { height: 7, flex: .8, borderRadius: 7, backgroundColor: '#b89cff' } }),
        dkd_createElement(dkd_View, { style: { height: 7, flex: .55, borderRadius: 7, backgroundColor: '#e4ff5e' } }),
      ),
      dkd_createElement(dkd_Text, { style: { marginTop: 15, color: '#71859d', fontSize: 11, fontWeight: '700', letterSpacing: .5 } }, 'KARİYER · ŞEHİR · SİPARİŞLER'),
    ),
  );
}

'''
    dkd_anchor = 'function dkd_Container() {'
    if dkd_anchor not in dkd_source:
        raise SystemExit('App.tsx loading component insertion point not found.')
    dkd_source = dkd_source.replace(dkd_anchor, dkd_component + dkd_anchor, 1)

    dkd_old = "? dkd_createElement(dkd_ActivityIndicator, { size: 'large', color: '#e4ff5e', style: { flex: 1 } })"
    dkd_new = '? dkd_createElement(dkd_LoadingScreen)'
    if dkd_old not in dkd_source:
        raise SystemExit('App.tsx legacy loading indicator not found.')
    dkd_source = dkd_source.replace(dkd_old, dkd_new, 1)
    dkd_app.write_text(dkd_source, encoding='utf-8')
    print('DKD native startup loading screen polished.')
else:
    print('DKD native startup loading screen already current.')

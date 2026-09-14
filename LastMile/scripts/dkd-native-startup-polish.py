#!/usr/bin/env python3
from pathlib import Path


dkd_root = Path(__file__).resolve().parents[1]
dkd_app = dkd_root / 'App.tsx'
dkd_source = dkd_app.read_text(encoding='utf-8')

# Keep this script idempotent: it replaces the complete loading component every run,
# so an older generated loader can never survive into a signed APK.
dkd_source = dkd_source.replace(
    "ActivityIndicator as dkd_ActivityIndicator, AppState as dkd_AppState",
    "ActivityIndicator as dkd_ActivityIndicator, Animated as dkd_Animated, AppState as dkd_AppState",
)

dkd_start = dkd_source.find('function dkd_LoadingScreen()')
dkd_end = dkd_source.find('function dkd_Container()', dkd_start)
if dkd_start < 0 or dkd_end < 0:
    raise SystemExit('App.tsx loading component replacement point not found.')

dkd_component = r'''function dkd_LoadingScreen() {
  const dkd_loaderTravel = dkd_useRef(new dkd_Animated.Value(0)).current;
  dkd_useEffect(() => {
    const dkd_animation = dkd_Animated.loop(
      dkd_Animated.sequence([
        dkd_Animated.timing(dkd_loaderTravel, { toValue: 1, duration: 1150, useNativeDriver: true }),
        dkd_Animated.timing(dkd_loaderTravel, { toValue: 0, duration: 720, useNativeDriver: true }),
      ]),
    );
    dkd_animation.start();
    return () => dkd_animation.stop();
  }, [dkd_loaderTravel]);
  const dkd_routeX = dkd_loaderTravel.interpolate({ inputRange: [0, 1], outputRange: [-92, 92] });
  const dkd_signalScale = dkd_loaderTravel.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1.08] });

  return dkd_createElement(
    dkd_View,
    { style: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#081426', paddingHorizontal: 20 } },
    dkd_createElement(
      dkd_View,
      { style: { width: '100%', maxWidth: 400, padding: 18, borderWidth: 1, borderColor: '#31597a', borderTopWidth: 7, borderTopColor: '#67dfd1', borderRadius: 28, backgroundColor: '#122741' } },
      dkd_createElement(
        dkd_View,
        { style: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } },
        dkd_createElement(
          dkd_View,
          { style: { flexDirection: 'row', alignItems: 'center', gap: 8 } },
          dkd_createElement(dkd_Animated.View, { style: { width: 11, height: 11, borderRadius: 6, backgroundColor: '#e4ff5e', transform: [{ scale: dkd_signalScale }] } }),
          dkd_createElement(dkd_Text, { style: { color: '#80e4d7', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 } }, 'DRABORNGO · LAST MILE'),
        ),
        dkd_createElement(dkd_Text, { style: { color: '#b8c8dc', fontSize: 10, fontWeight: '900' } }, 'v0.7.5'),
      ),
      dkd_createElement(
        dkd_View,
        { style: { marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 15 } },
        dkd_createElement(
          dkd_View,
          { style: { width: 76, height: 76, borderWidth: 1, borderColor: '#5479a4', borderRadius: 24, backgroundColor: '#1d3a5c', alignItems: 'center', justifyContent: 'center' } },
          dkd_createElement(dkd_ActivityIndicator, { size: 'large', color: '#e4ff5e' }),
        ),
        dkd_createElement(
          dkd_View,
          { style: { flex: 1 } },
          dkd_createElement(dkd_Text, { style: { color: '#ffffff', fontSize: 26, lineHeight: 30, fontWeight: '900', letterSpacing: 1.2 } }, 'SON KİLOMETRE'),
          dkd_createElement(dkd_Text, { style: { marginTop: 5, color: '#aabed4', fontSize: 14, fontWeight: '700' } }, 'Şehrin hazırlanıyor…'),
        ),
      ),
      dkd_createElement(
        dkd_View,
        { style: { overflow: 'hidden', height: 15, marginTop: 25, borderWidth: 1, borderColor: '#3d607e', borderRadius: 999, backgroundColor: '#0a1a2e', justifyContent: 'center' } },
        dkd_createElement(dkd_View, { style: { position: 'absolute', left: 10, right: 10, height: 3, borderRadius: 3, backgroundColor: '#35506d' } }),
        dkd_createElement(dkd_Animated.View, { style: { alignSelf: 'center', width: 58, height: 7, borderRadius: 7, backgroundColor: '#67dfd1', transform: [{ translateX: dkd_routeX }] } }),
      ),
      dkd_createElement(
        dkd_View,
        { style: { flexDirection: 'row', gap: 7, marginTop: 13 } },
        dkd_createElement(dkd_View, { style: { height: 6, flex: 1.5, borderRadius: 6, backgroundColor: '#67dfd1' } }),
        dkd_createElement(dkd_View, { style: { height: 6, flex: 1, borderRadius: 6, backgroundColor: '#78a6ff' } }),
        dkd_createElement(dkd_View, { style: { height: 6, flex: .8, borderRadius: 6, backgroundColor: '#dc8ebe' } }),
        dkd_createElement(dkd_View, { style: { height: 6, flex: .55, borderRadius: 6, backgroundColor: '#e4ff5e' } }),
      ),
      dkd_createElement(
        dkd_View,
        { style: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 } },
        dkd_createElement(dkd_Text, { style: { color: '#83a0bb', fontSize: 9, fontWeight: '900', letterSpacing: 1 } }, 'ROTA'),
        dkd_createElement(dkd_Text, { style: { color: '#83a0bb', fontSize: 9, fontWeight: '900', letterSpacing: 1 } }, 'KURYE'),
        dkd_createElement(dkd_Text, { style: { color: '#83a0bb', fontSize: 9, fontWeight: '900', letterSpacing: 1 } }, 'SİPARİŞLER'),
        dkd_createElement(dkd_Text, { style: { color: '#83a0bb', fontSize: 9, fontWeight: '900', letterSpacing: 1 } }, 'ŞEHİR'),
      ),
    ),
  );
}

'''

dkd_source = dkd_source[:dkd_start] + dkd_component + dkd_source[dkd_end:]
dkd_app.write_text(dkd_source, encoding='utf-8')
print('DKD native startup loader replaced with modern animated v0.7.5 screen.')

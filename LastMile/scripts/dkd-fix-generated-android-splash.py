#!/usr/bin/env python3
from pathlib import Path
import re

# Run AFTER `expo prebuild --platform android`. Android 12+ always creates a system
# starting window; omitting Expo's splash image is not enough because the platform can
# fall back to a masked launcher/adaptive icon. Force that system icon to a transparent
# drawable while keeping the branded dark background. The React loader then becomes
# the first visible Last Mine UI.
dkd_root = Path(__file__).resolve().parents[1]
dkd_res = dkd_root / 'android' / 'app' / 'src' / 'main' / 'res'
if not dkd_res.exists():
    raise SystemExit('Generated Android res directory not found. Run expo prebuild first.')

dkd_drawable = dkd_res / 'drawable'
dkd_drawable.mkdir(parents=True, exist_ok=True)
(dkd_drawable / 'dkd_transparent_splash.xml').write_text('''<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">
  <size android:width="1dp" android:height="1dp" />
  <solid android:color="@android:color/transparent" />
</shape>
''', encoding='utf-8')

dkd_values = dkd_res / 'values'
dkd_values.mkdir(parents=True, exist_ok=True)
(dkd_values / 'dkd_startup_colors.xml').write_text('''<?xml version="1.0" encoding="utf-8"?>
<resources>
  <color name="dkd_startup_background">#081426</color>
</resources>
''', encoding='utf-8')

dkd_changed = 0
for dkd_styles in dkd_res.glob('values*/styles.xml'):
    dkd_text = dkd_styles.read_text(encoding='utf-8')
    dkd_original = dkd_text
    dkd_text = re.sub(
        r'(<item\s+name="(?:android:)?windowSplashScreenAnimatedIcon"\s*>).*?(</item>)',
        r'\1@drawable/dkd_transparent_splash\2',
        dkd_text,
        flags=re.S,
    )
    dkd_text = re.sub(
        r'(<item\s+name="(?:android:)?windowSplashScreenBackground"\s*>).*?(</item>)',
        r'\1@color/dkd_startup_background\2',
        dkd_text,
        flags=re.S,
    )
    dkd_text = re.sub(
        r'(<item\s+name="(?:android:)?windowSplashScreenIconBackgroundColor"\s*>).*?(</item>)',
        r'\1@android:color/transparent\2',
        dkd_text,
        flags=re.S,
    )
    # Pre-Android-12 generated themes can still use a drawable starting window.
    dkd_text = re.sub(
        r'(<item\s+name="android:windowBackground"\s*>)@drawable/splashscreen(</item>)',
        r'\1@color/dkd_startup_background\2',
        dkd_text,
    )
    if dkd_text != dkd_original:
        dkd_styles.write_text(dkd_text, encoding='utf-8')
        dkd_changed += 1

# Expo normally creates the SplashScreen style. If its current template did not emit an
# explicit animated-icon item, add one so Android cannot fall back to the launcher icon.
for dkd_styles in dkd_res.glob('values*/styles.xml'):
    dkd_text = dkd_styles.read_text(encoding='utf-8')
    if 'SplashScreen' not in dkd_text or 'windowSplashScreenAnimatedIcon' in dkd_text:
        continue
    dkd_pattern = re.compile(r'(<style\b[^>]*(?:SplashScreen|Splash)[^>]*>)(.*?)(</style>)', re.S)
    dkd_match = dkd_pattern.search(dkd_text)
    if not dkd_match:
        continue
    dkd_body = dkd_match.group(2)
    dkd_body += '\n    <item name="windowSplashScreenAnimatedIcon">@drawable/dkd_transparent_splash</item>\n'
    dkd_body += '    <item name="windowSplashScreenBackground">@color/dkd_startup_background</item>\n'
    dkd_text = dkd_text[:dkd_match.start()] + dkd_match.group(1) + dkd_body + dkd_match.group(3) + dkd_text[dkd_match.end():]
    dkd_styles.write_text(dkd_text, encoding='utf-8')
    dkd_changed += 1

# Remove any generated legacy splash bitmap/layout content from the system starting
# window. This does not touch the launcher icon used on the home screen.
dkd_legacy = dkd_drawable / 'splashscreen.xml'
if dkd_legacy.exists():
    dkd_legacy.write_text('''<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
  <item android:drawable="@color/dkd_startup_background" />
</layer-list>
''', encoding='utf-8')

# Fail closed if a generated Android 12 splash style still points at a visible icon.
dkd_style_dump = '\n'.join(dkd_file.read_text(encoding='utf-8') for dkd_file in dkd_res.glob('values*/styles.xml'))
for dkd_match in re.finditer(r'<item\s+name="(?:android:)?windowSplashScreenAnimatedIcon"\s*>(.*?)</item>', dkd_style_dump, re.S):
    if '@drawable/dkd_transparent_splash' not in dkd_match.group(1):
        raise SystemExit(f'Visible Android splash icon remains: {dkd_match.group(1).strip()}')

print(f'DKD Android system splash fixed: transparent icon + dark background ({dkd_changed} style files patched).')

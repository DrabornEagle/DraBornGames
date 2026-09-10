# DraBornGo / Last Mile v0.6.1

## Release status

**COMPLETED — 10 September 2026**

- Production source of truth after promotion: `main`.
- Public release metadata remains `v0.6.1`, Android `versionCode 601`, Expo SDK 57.
- Android/Expo Go device fixes were staged on `work/DraBornGo-LastMile-v0.6.2` without changing the public release number.
- APK generation is intentionally disabled during this Expo Go validation stage.
- Public Last Mile legal pages are deployed by the DrabornEagle public web Pages workflow.

## Starter motorcycle + rider

The old starter scooter/rider is replaced by the uploaded Yamaha SoulGT 125 + Quaternius Worker Male package.

- Source licences/credits remain in `game/models/v061/CREDITS.md`.
- Mobile representation: 28 meshes, 3,397 vertices, 5,909 faces.
- Canonical DK61 geometry: **29,530 bytes**, SHA-256 `8dc66ee133b1651571ebfcd8c74238b091c45a4a9405ea25a2bf57c62f51e2a1`.
- DK61 is inflated and verified at build time, then embedded for synchronous Expo Go/WebView construction.
- `game/dkd-v061-device-hotfix.mjs` replaces the old starter fallback synchronously.
- Earlier device testing added the authored-axis correction. The final real-device screenshots then proved the complete motorcycle+rider assembly was still 180° opposite the route direction.
- `game/dkd-v061-final-device-fix.mjs` therefore turns the **complete uploaded motorcycle+rider assembly an additional 180°**, preserving the uploaded relative rider/seat transform instead of moving the motorcycle and rider independently.
- The correction applies only to starter vehicle `dkd_city50` / `İlk Motorum` in both Courier Center and driving scenes.

## Audio

- Courier Center now uses a **completely new 48 BPM soft night-ambient WebAudio track**, not the previous 54/72 BPM home source.
- The track uses reduced output gain and resumes after the first Android user gesture if WebAudio initially starts suspended.
- Entering driving mode physically stops/disconnects Courier Center sources, menu loop sources, old procedural music voices and the menu HTML media player; menu gain is hard-set to zero.
- Drive rendering continuously enforces this separation so a stale home/menu source cannot restart during a delivery.
- Driving tracks do not loop one song forever. When one finishes, the playlist advances to a different driving track.
- Supabase Last-Mile config is aligned to `calm_night_48`, `home_bpm = 48`, while the drive profile remains `urban_pulse`.

## Tasks / special customers

- Page argument preservation fixes the previous `Cannot read properties of undefined (reading 'dkd_age')` error in the Tasks/Special Customer flow.
- `vip`, `chat` and `call` keep their requested customer id through the complete render/auth/audio wrapper chain.
- Missing/stale VIP references show a Turkish recovery surface instead of a raw JavaScript exception.

## Vehicle capacity

- Real cloud orders and the run validator now use the same authenticated `dkd_requiredLoad` value.
- A 7 kg order on the 12 kg starter vehicle therefore passes capacity validation instead of inheriting an unrelated local package-class weight.

## Customer portraits

- Structurally invalid/truncated JPEG, PNG and WebP payloads are excluded from the safe pool.
- Runtime image errors fall back to another validated portrait.
- The Android-corrupted Mira payload is quarantined from dynamic order pools.
- Portrait assignment remains deterministic per order and consistent between Siparişler and Mesajlar.

## Privacy, account deletion and support

Public legal URLs:

- https://www.draborneagle.com/draborngo/lastmile/
- https://www.draborneagle.com/draborngo/lastmile/gizlilik/
- https://www.draborneagle.com/draborngo/lastmile/hesap-silme/

App path: **Ayarlar → Gizlilik Politikası ve Hesap Silme**.

- Public support/privacy contact: **support@draborneagle.com**.
- The old Gmail address is no longer shown to players on the Last Mile website or in the player-facing privacy/account UI.
- The owner/admin authentication identity is intentionally not rewritten by the build system; changing a public support address must not change authorization identity.
- Authenticated non-admin players can permanently delete their Last-Mile data and corresponding Supabase Auth user through the protected Edge Function. The admin/owner account remains protected.

Google Play preparation files remain in `store_assets/google_play/`.

## Supabase production

Applied v0.6.1 migrations include:
- `dkd_lastmile_v061_release_google_play`
- `dkd_lastmile_v061_runtime_repair_audio54` (historical intermediate repair)
- `dkd_lastmile_v061_final_device_audio48` (authoritative current home audio profile)

Current expected config:
- `dkd_runtime.version = 0.6.1`
- `dkd_audio.home_profile = calm_night_48`
- `dkd_audio.menu_profile = calm_night_48`
- `dkd_audio.home_bpm = 48`
- `dkd_audio.drive_profile = urban_pulse`
- delete-data RPC remains service-role-only
- Edge Function API contract remains v0.6.1

## Validation gates

The release is considered complete only after the promoted `main` commit passes:
1. deterministic DK61 game build,
2. all Node regression tests,
3. TypeScript typecheck,
4. Expo SDK dependency validation,
5. Android JavaScript export without APK,
6. generated-file equality/source hygiene,
7. production Supabase config verification,
8. public legal-page deployment verification.

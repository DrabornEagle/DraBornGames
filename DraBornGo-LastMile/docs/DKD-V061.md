# DraBornGo / Last Mile v0.6.1

## Release status

**COMPLETED — 10 September 2026**

- Production source of truth after promotion: `main`.
- v0.6.1 was originally promoted from `work/DraBornGo-LastMile-v0.6.1`; the Android/Expo Go device hotfix was then validated on `work/DraBornGo-LastMile-v0.6.2` without changing public release metadata.
- Final device-hotfix validation passed **154 Node tests**, TypeScript typecheck, Expo SDK dependency validation, deterministic generated-file verification and Android JavaScript export without producing an APK.
- Public Last Mile legal pages are deployed by the DrabornEagle public web Pages workflow.
- Supabase Last-Mile runtime and Edge Function remain aligned to v0.6.1; the device hotfix changes no database contract.

## Release scope

- Expo Go development release; APK is intentionally not produced.
- Expo SDK 57 dependency family retained for current Expo Go testing.
- App version `0.6.1`, Android `versionCode 601`.
- Supabase changes remain limited to the dedicated `Last-Mile` area and the private `dkd_lastmile_*` service facade.

## Starter motorcycle + rider

The old `İlk Motorum` scooter/rider is replaced by the user-provided external model package:

- Yamaha SoulGT 125 scooter source model — CC BY attribution retained in `game/models/v061/CREDITS.md`.
- Quaternius Worker Male rider source — CC0 attribution/source retained in the same credits file.
- Mobile representation: 28 meshes, 3,397 vertices, 5,909 faces.
- Canonical DK61 geometry: **29,530 bytes**, SHA-256 `8dc66ee133b1651571ebfcd8c74238b091c45a4a9405ea25a2bf57c62f51e2a1`.
- A device report exposed a corrupted checked-in base64 chunk: `dkd-v061-model-4.mjs` contained one accidental extra `i` character at offset 2837. The source chunk was repaired and the complete gzip payload was validated against the canonical DK61 byte count, header and SHA-256 above.
- The old runtime path depended on Android WebView `DecompressionStream('gzip')`, so failure could leave the visible fallback scooter in place. The build now inflates and verifies DK61 at build time and embeds the verified raw geometry for synchronous Expo Go/WebView construction.
- `game/dkd-v061-device-hotfix.mjs` is the final runtime layer and replaces the starter fallback synchronously. Older asynchronous v0.3/v0.6.1 replacement tokens are invalidated so they cannot overwrite the corrected model.
- Replacement applies only to the starter `dkd_city50` vehicle.

## Audio

- Home/Courier Center keeps its dedicated calm modern night-electronic profile at 72 BPM.
- Driving tracks remain separate.
- Starting a shift now physically stops and disconnects every home/menu music source before the driving track is started.
- Menu gain is forced to zero in drive mode, stale menu loop/source references are cleared, and drive render continuously enforces the drive-only state so Courier Center music cannot restart during gameplay.
- Home/menu and driving buses therefore no longer overlap by design.
- Supabase audio config continues to report `calm_night_72` for home/menu.

## Customer portrait reliability

- Customer portraits are structurally validated before assignment.
- Truncated JPEGs and malformed PNG/WebP data are excluded from the safe pool.
- Runtime `img.onerror` selects another validated portrait instead of showing an empty/broken avatar or alt-text overflow.
- Assignment remains deterministic per order and consistent between Siparişler and Mesajlar.

## Version cleanup

- Player-visible release remains v0.6.1.
- Stale `v0.5 · Çevrimiçi kariyer` text is upgraded to `v0.6.1 · Çevrimiçi kariyer`.
- Historical compatibility layers remain bundled but are not presented as the active release.

## Google Play / privacy preparation

Public legal URLs:

- https://www.draborneagle.com/draborngo/lastmile/
- https://www.draborneagle.com/draborngo/lastmile/gizlilik/
- https://www.draborneagle.com/draborngo/lastmile/hesap-silme/

App path: **Ayarlar → Gizlilik ve hesap**.

An authenticated non-admin player can permanently delete the Last-Mile account from the app. The JWT-protected Edge Function calls a service-role-only deletion RPC for Last-Mile user rows and then deletes the corresponding Supabase Auth user. The admin/owner account is protected from this player deletion endpoint.

Google Play preparation files are stored in `store_assets/google_play/`.

## Supabase production

Applied migration: `dkd_lastmile_v061_release_google_play`.

Verified runtime:
- `dkd_runtime.version = 0.6.1`
- `dkd_audio.home_profile = calm_night_72`
- `dkd_audio.home_bpm = 72`
- delete-data RPC executable only by `service_role`
- `dkd-last-mile-api` production Edge Function v8 ACTIVE, JWT verification enabled

## Validation gates — completed

The final v0.6.1 Android/Expo Go device-hotfix work tree passed:
1. deterministic game bundle generation with canonical DK61 integrity validation,
2. all 154 Node tests including device model and audio isolation regressions,
3. TypeScript typecheck,
4. Expo SDK dependency check,
5. Android JavaScript export without APK generation,
6. source hygiene check,
7. unchanged Supabase v0.6.1 runtime/function contract,
8. public legal-page deployment verification.

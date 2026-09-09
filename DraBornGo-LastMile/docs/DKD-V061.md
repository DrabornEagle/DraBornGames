# DraBornGo / Last Mile v0.6.1

## Release scope

- Expo Go development release; APK is intentionally not produced.
- Expo SDK 57 dependency family retained for current Expo Go testing.
- App version `0.6.1`, Android `versionCode 601`.
- Source of truth after promotion: `main`.
- Supabase changes are limited to the dedicated `Last-Mile` area and the private `dkd_lastmile_*` service facade.

## Starter motorcycle + rider

The old `İlk Motorum` scooter/rider is replaced at runtime by the user-provided external model package:

- Yamaha SoulGT 125 scooter source model — CC BY attribution retained in `game/models/v061/CREDITS.md`.
- Quaternius Worker Male rider source — CC0 attribution/source retained in the same credits file.
- Mobile representation: 28 meshes, 3,397 vertices, 5,909 faces.
- Custom DK61 gzip/base64 geometry is bundled offline for Android WebView/Expo Go use.
- Replacement applies only to the starter `dkd_city50` vehicle and supersedes the older asynchronous v0.3 model replacement.

## Audio

- Home page receives a dedicated calm modern night-electronic profile at 72 BPM.
- Driving tracks remain separate.
- Home/menu and driving buses are isolated so tracks do not overlap.
- Supabase audio config reports `calm_night_72` for home/menu.

## Customer portrait reliability

- Customer portraits are structurally validated before assignment.
- Truncated JPEGs and malformed PNG/WebP data are excluded from the safe pool.
- Runtime `img.onerror` selects another validated portrait instead of showing an empty/broken avatar or alt-text overflow.
- Assignment remains deterministic per order and consistent between Siparişler and Mesajlar.

## Version cleanup

- Player-visible release is v0.6.1.
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

## Validation gates

Before promotion to `main`, v0.6.1 must pass:
1. deterministic game bundle generation,
2. all Node tests,
3. TypeScript typecheck,
4. Expo SDK dependency check,
5. Android JavaScript export without APK generation,
6. source hygiene check,
7. Supabase runtime/function verification,
8. public legal-page deployment verification.

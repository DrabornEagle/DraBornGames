# DraBornGo / Last Mile v0.6.1

## Release status

**COMPLETED — 10 September 2026**

- Production source of truth after promotion: `main`.
- v0.6.1 was originally promoted from `work/DraBornGo-LastMile-v0.6.1`; Android/Expo Go device fixes were validated on `work/DraBornGo-LastMile-v0.6.2` without changing public release metadata.
- Final runtime-repair validation passes **162 Node tests**, TypeScript typecheck, Expo SDK dependency validation, deterministic generated-file verification and Android JavaScript export without producing an APK.
- Public Last Mile legal pages are deployed by the DrabornEagle public web Pages workflow.
- Supabase remains on the v0.6.1 contract; only the dedicated Last-Mile audio configuration was aligned to the new 54 BPM Courier Center profile.

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
- The build inflates and verifies DK61 at build time and embeds verified raw geometry for synchronous Expo Go/WebView construction.
- `game/dkd-v061-device-hotfix.mjs` replaces the starter fallback synchronously. Older asynchronous v0.3/v0.6.1 replacement tokens are invalidated so they cannot overwrite the corrected model.
- `game/dkd-v061-runtime-repair.mjs` is the final layer. It rotates the imported Yamaha+rider child configuration by +90° on Y so its authored axis matches the game's forward axis in both Courier Center and driving views.
- Replacement and orientation correction apply only to the starter `dkd_city50` vehicle.

## Audio

- Courier Center now uses a calmer **54 BPM** generated night-ambient profile at reduced gain.
- Starting a shift physically stops and disconnects home/menu sources before driving audio starts.
- Home/menu HTML media players are silenced while the dedicated Courier Center source is active.
- Driving tracks use a playlist instead of looping one track forever: when a track ends, playback advances to a different driving track and continues through the drive set.
- Menu and driving buses remain mutually exclusive so Courier Center and drive music cannot overlap.
- Supabase Last-Mile audio config is aligned to `calm_night_54` / `home_bpm = 54` by migration `20260910003618_dkd_lastmile_v061_runtime_repair_audio54`.

## Tasks / special customers

- The v0.6/v0.6.1 render wrappers previously dropped the second page argument used by `vip`, `chat` and `call` pages. This caused the Tasks/Special Customer flow to open `dkd_view_vip` without a customer id and fail while reading `dkd_age`.
- The final runtime preserves page arguments through the full auth/audio wrapper chain.
- Missing or stale VIP references now render a safe Turkish recovery page instead of exposing a raw JavaScript error.

## Vehicle capacity

- Real cloud orders display their server-reported `dkd_requiredLoad`.
- The old core run validator could still validate the local fallback package-class weight (for example a mapped 65 kg class) even when the cloud order was actually 7 kg.
- Run creation now uses the same authenticated server-reported load used by the order UI and preflight check, then restores the shared package definition.
- A 7 kg order on the 12 kg starter vehicle therefore passes capacity validation as shown in the order card.

## Customer portrait reliability

- Customer portraits are structurally validated before assignment.
- Truncated JPEGs and malformed PNG/WebP data are excluded from the safe pool.
- Runtime `img.onerror` selects another validated portrait instead of showing an empty/broken avatar or alt-text overflow.
- The visually corrupted Mira portrait reported on Android is explicitly quarantined from both dynamic portrait pools; Mira falls back to the safe legacy avatar.
- The same corrupted payload can no longer be assigned to real-order customers such as the affected Pelin card.
- Assignment remains deterministic per order and consistent between Siparişler and Mesajlar.

## Privacy and account deletion

Public legal URLs:

- https://www.draborneagle.com/draborngo/lastmile/
- https://www.draborneagle.com/draborngo/lastmile/gizlilik/
- https://www.draborneagle.com/draborngo/lastmile/hesap-silme/

App path: **Ayarlar → Gizlilik Politikası ve Hesap Silme**.

The current Settings override had hidden the existing privacy/account page. The runtime repair explicitly restores the in-app entry. The page exposes the privacy link, account-deletion information and the authenticated deletion action. An authenticated non-admin player can permanently delete Last-Mile data and the corresponding Supabase Auth user through the JWT-protected Edge Function. The admin/owner account remains protected from the player deletion endpoint.

Google Play preparation files remain in `store_assets/google_play/`.

## Supabase production

Applied migrations relevant to v0.6.1:
- `dkd_lastmile_v061_release_google_play`
- `20260910003618_dkd_lastmile_v061_runtime_repair_audio54`

Verified runtime/config intent:
- `dkd_runtime.version = 0.6.1`
- `dkd_audio.home_profile = calm_night_54`
- `dkd_audio.menu_profile = calm_night_54`
- `dkd_audio.home_bpm = 54`
- delete-data RPC executable only by `service_role`
- `dkd-last-mile-api` remains the v0.6.1 production function; this runtime repair does not change its API contract.

## Validation gates — completed

The final v0.6.1 Android/Expo Go runtime-repair work tree passes:
1. deterministic game bundle generation with canonical DK61 integrity validation,
2. all 162 Node tests including model, privacy, page-argument, capacity, portrait and audio-playlist regressions,
3. TypeScript typecheck,
4. Expo SDK dependency check,
5. Android JavaScript export without APK generation,
6. JavaScript/source whitespace checks,
7. Last-Mile-only Supabase audio profile alignment,
8. unchanged v0.6.1 Edge Function API contract,
9. public legal-page deployment remains available.

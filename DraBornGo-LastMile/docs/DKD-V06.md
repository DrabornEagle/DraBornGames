# DraBornGo / Last Mile v0.6

## Release scope

- Expo Go development release; no APK output.
- Expo SDK 57 dependency family is preserved.
- Application version: `0.6.0`.
- Android `versionCode`: `600`.
- GitHub source of truth: `main`.
- Supabase scope: only the dedicated `Last-Mile` data area and the `dkd_lastmile_*` RPC facade.

## v0.6 changes

- Order/customer cards use a validated customer portrait pool.
- Embedded portrait data is checked before assignment; malformed/partial JPEG, PNG or WebP data is excluded automatically.
- If an image still fails at browser decode time, the card immediately switches to a known-good bundled portrait instead of showing a blank frame or broken-image alt text.
- Source portrait duplicates are removed at runtime and the already-bundled local portraits are available as safe fallbacks without generating new artwork.
- Portrait assignment is deterministic per order id and stays consistent across Siparişler and Mesajlar.
- Concurrent visible orders avoid portrait reuse while unused portraits remain available.
- Real customer notes, roles, origins and destinations are rendered from cloud job data.
- A Last-Mile-only idempotent content migration adds/upserts 47 active v0.6 customer profiles plus 32 expanded real mission templates.
- Existing real content is preserved. Production totals after the migration are 60 active non-demo customers and 54 active non-demo mission templates.
- The legacy `dkd_emre` compatibility id renders the Elif profile to keep old saves valid without showing a mismatched identity.
- Admin progression is fixed at level 50 (`384160 XP`) both in runtime and server persistence.
- Company registration requires a Turkish vehicle plate such as `06 ABC 123`.
- Plate is preserved in game state and persisted to `Last-Mile.dkd_lastmile_profiles.dkd_plate_no` during authenticated cloud save.
- Reward Vault active banner reads `ÖDÜLLER AKTİF`.
- Supabase runtime/bootstrap reports version `0.6`.
- `dkd-last-mile-api` is ACTIVE and uses JWT verification.

## Production Supabase status — 10 Eylül 2026

Production migration `dkd_lastmile_v06_customer_content` has been applied and verified directly against the live DraBornGo project.

Verified state:

- v0.6 customer rows: `47 / 47`
- v0.6 mission templates: `32 / 32`
- total active non-demo customers: `60`
- total active non-demo mission templates: `54`
- live season enabled with skill-competition reward mode and verification required
- physical rewards enabled
- admin level: `50`
- admin XP: `384160`
- admin unlimited wallet/VIP/all-city entitlements enabled
- demo mode disabled by default and admin-only toggle preserved
- public `dkd_lastmile_*` RPC execution denied to `anon` and `authenticated`; `service_role` only
- Last-Mile tables keep RLS enabled with no broad direct-client policies; access flows through the JWT Edge Function and private RPC facade
- Last-Mile dışındaki DraBornGo / DraBornGate veri alanları değiştirilmedi

The repository migration remains at:

`supabase/migrations/20260909212000_dkd_lastmile_v06_customer_content.sql`

`scripts/dkd-supabase-push-termux.sh` is retained only as an authorized maintenance/re-apply utility. Normal Termux installation no longer requires a Supabase token, CLI login, link, or database push.

## Validation gates

The release has passed:

1. deterministic game bundle generation,
2. Node test suite,
3. TypeScript typecheck,
4. Expo dependency compatibility check,
5. Android JavaScript export without APK generation,
6. production Last-Mile migration and database verification.

## Termux

For a fresh install or safe update, use the repository installer. It fetches `main`, preserves local divergent/dirty work through the safe sync flow, installs dependencies when needed, and starts the Expo Go development server.

```bash
pkg update -y && pkg upgrade -y && pkg install -y git nodejs-lts util-linux curl && \
bash -o pipefail -c 'curl -fsSL https://raw.githubusercontent.com/DrabornEagle/DraBornGames/main/DraBornGo-LastMile/scripts/dkd-install.sh | bash'
```

Existing installation manual verification:

```bash
cd "$HOME/projects/DraBornGames/DraBornGo-LastMile"
bash scripts/dkd-sync.sh once
npm ci --no-audit --no-fund
npm run verify
npm run start:clear
```

For continuous GitHub-to-local checking, run `bash scripts/dkd-sync.sh watch` in a separate Termux session. The script preserves divergent commits and dirty files before moving local `main` to `origin/main`.

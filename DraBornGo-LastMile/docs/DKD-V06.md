# DraBornGo / Last Mile v0.6

## Release scope

- Expo Go development release; no APK output.
- Expo SDK 57 dependency family is preserved.
- Application version: `0.6.0`.
- Android `versionCode`: `600`.
- GitHub source of truth: `main` after release promotion.
- Supabase scope: only the dedicated `Last-Mile` data area and the `dkd_lastmile_*` RPC facade.

## v0.6 changes

- Order/customer cards use a 47-profile customer portrait pool.
- Source portrait duplicates are removed at runtime; two missing unique slots are completed from the already-bundled Selin/Ece local portraits without generating new artwork.
- Portrait assignment is deterministic per order id and stays consistent across Siparişler and Mesajlar.
- Concurrent visible orders avoid portrait reuse while unused portraits remain available.
- Real customer notes, roles, origins and destinations are rendered from cloud job data.
- A Last-Mile-only idempotent content migration adds/upserts 47 active customer profiles plus the expanded real mission-template pool.
- The legacy `dkd_emre` compatibility id renders the Elif profile to keep old saves valid without showing a mismatched identity.
- Admin progression is fixed at level 50 (`384160 XP`) both in runtime and server persistence.
- Company registration requires a Turkish vehicle plate such as `06 ABC 123`.
- Plate is preserved in game state and persisted to `Last-Mile.dkd_lastmile_profiles.dkd_plate_no` during authenticated cloud save.
- Reward Vault active banner reads `ÖDÜLLER AKTİF`.
- Supabase runtime/bootstrap reports version `0.6`.
- `dkd-last-mile-api` uses JWT verification.

## Validation gates

Release promotion requires:

1. deterministic game bundle generation,
2. Node test suite,
3. TypeScript typecheck,
4. Expo dependency compatibility check,
5. Android JavaScript export without APK generation,
6. Last-Mile production migration from an authorized Supabase CLI/session.

GitHub CI verifies gates 1-5. The production database migration requires an authorized Supabase account; the chat connector currently has no SQL write permission for this project.

## Supabase production sync

The migration is stored at:

`supabase/migrations/20260909212000_dkd_lastmile_v06_customer_content.sql`

From an authorized Termux session:

```bash
cd ~/projects/DraBornGames/DraBornGo-LastMile
npx supabase@latest login
npx supabase@latest link --project-ref dpcwciapowxqocvswxce
npx supabase@latest db push
```

## Termux

Use the repository's safe sync script instead of force-cleaning local work:

```bash
cd ~/projects/DraBornGames/DraBornGo-LastMile
bash scripts/dkd-sync.sh once
npm ci --no-audit --no-fund
npm run verify
npm run start:clear
```

For continuous GitHub-to-local checking, run `bash scripts/dkd-sync.sh watch` in a separate Termux session. The script preserves divergent commits and dirty files before moving local `main` to `origin/main`.

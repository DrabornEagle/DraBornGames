# DraBornGo / Last Mile v0.6.1 — Google Play Data Safety preparation

This file is a release-preparation checklist for Play Console. Re-check the final production APK/AAB and all enabled SDKs immediately before submission.

## Current v0.6.1 implementation

- No third-party advertising SDK is bundled.
- Last-Mile account/authentication and cloud game data use Supabase.
- Network traffic to Supabase/Edge Functions is HTTPS encrypted in transit.
- Account deletion is available in-app and through a public web resource.
- Android manifest currently blocks fine/coarse location, microphone and contacts permissions.
- Gameplay route positions are virtual in-game coordinates and are not the device's precise physical location.
- Optional profile photo access occurs only after an explicit image-picker action by the user.

## Data categories currently used

### Personal info
- Name: account/profile creation.
- Email address: authentication, account recovery/identity and support.
- Phone number: Last-Mile account/profile.
- User IDs / username: account identity.
- Company name: player-created in-game company identity.
- Vehicle plate: player company/starter-vehicle profile.
- Optional profile photo: player profile when selected by the user.

### App activity / gameplay
- Game progress: level, XP, wallet, delivery count, career state.
- Delivery/job activity: accepted/completed/cancelled delivery state and mission progress.
- Season/final participation and reward verification state where applicable.
- Gameplay integrity metrics used for anti-cheat/result verification.

### App/account identifiers
- Supabase Auth user ID and authenticated session data required to operate the account and cloud sync.

## Purpose mapping

The above data is used for app functionality, authentication/account management, cloud save/sync, fraud/abuse prevention, customer support and reward/final verification. It is not sold to advertisers.

## Deletion

Authenticated players can use **Ayarlar → Gizlilik ve hesap → HESABIMI VE VERİLERİMİ SİL**. The server removes account-linked Last-Mile profile, progress, jobs, reward claims/entitlements and then deletes the Supabase Auth user. Admin/owner account deletion is protected from the player deletion endpoint.

External deletion resource:
https://www.draborneagle.com/draborngo/lastmile/hesap-silme/

Privacy Policy:
https://www.draborneagle.com/draborngo/lastmile/gizlilik/

## Before Play submission

- Build the exact release artifact first, then inspect the final merged Android manifest.
- Re-check every dependency/SDK for additional automatic collection.
- Fill Play Console answers from the actual release artifact, not from this draft alone.
- Confirm target audience/age settings and Families requirements separately.
- Confirm any payments/subscriptions implementation before declaring financial/purchase data handling.

Release: v0.6.1 · Android versionCode 601 · Last reviewed 10 September 2026

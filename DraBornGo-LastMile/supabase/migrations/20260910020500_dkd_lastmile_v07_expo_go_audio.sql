-- DraBornGo / Last Mile v0.7 — Expo Go test release runtime/audio alignment.
-- One soundtrack owner at a time prevents Courier Center music from surviving into a shift.

update "Last-Mile".dkd_lastmile_system_config
set dkd_value = jsonb_set(coalesce(dkd_value, '{}'::jsonb), '{version}', '"0.7"'::jsonb, true),
    dkd_updated_at = now()
where dkd_key = 'dkd_runtime';

update "Last-Mile".dkd_lastmile_system_config
set dkd_value = coalesce(dkd_value, '{}'::jsonb) || jsonb_build_object(
      'home_bpm', 82,
      'home_profile', 'v07_game_score_home',
      'menu_profile', 'v07_game_score_home',
      'drive_profile', 'v07_game_score_drive',
      'crossfade_ms', 0,
      'single_owner', true,
      'expo_go_sdk', 57,
      'android_version_code', 1
    ),
    dkd_updated_at = now()
where dkd_key = 'dkd_audio';

-- DraBornGo / Last Mile v0.6.1 final device audio alignment.
-- Scope: dedicated Last-Mile runtime configuration only.

update "Last-Mile".dkd_lastmile_system_config
set dkd_value = coalesce(dkd_value, '{}'::jsonb) || jsonb_build_object(
  'home_bpm', 48,
  'home_profile', 'calm_night_48',
  'menu_profile', 'calm_night_48',
  'drive_profile', 'urban_pulse',
  'crossfade_ms', 650
)
where dkd_key = 'dkd_audio';

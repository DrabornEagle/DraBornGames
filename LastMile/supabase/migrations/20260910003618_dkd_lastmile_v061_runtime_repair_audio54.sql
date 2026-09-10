-- DraBornGo / Last Mile v0.6.1 runtime repair
-- Scope: dedicated Last-Mile system configuration only.
-- Aligns production metadata with the calmer Courier Center soundtrack used by the final runtime layer.

update "Last-Mile".dkd_lastmile_system_config
set dkd_value = jsonb_set(
  jsonb_set(
    jsonb_set(dkd_value, '{home_bpm}', '54'::jsonb, true),
    '{home_profile}', to_jsonb('calm_night_54'::text), true
  ),
  '{menu_profile}', to_jsonb('calm_night_54'::text), true
)
where dkd_key = 'dkd_audio';

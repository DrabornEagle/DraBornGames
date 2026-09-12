update "Last-Mile".dkd_lastmile_system_config
set dkd_value = jsonb_set(
      jsonb_set(dkd_value, '{version}', '"0.7.5"'::jsonb, true),
      '{android_version_code}', '1'::jsonb, true
    ),
    dkd_updated_at = now()
where dkd_key = 'dkd_runtime';

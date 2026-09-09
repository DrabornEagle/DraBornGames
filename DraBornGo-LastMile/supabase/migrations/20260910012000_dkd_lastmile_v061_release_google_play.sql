-- DraBornGo / Last Mile v0.6.1 production release migration.
-- Scope is intentionally limited to the dedicated Last-Mile area plus its private service RPC.

update "Last-Mile".dkd_lastmile_system_config
set dkd_value = jsonb_set(coalesce(dkd_value, '{}'::jsonb), '{version}', '"0.6.1"'::jsonb, true),
    dkd_updated_at = now()
where dkd_key = 'dkd_runtime';

update "Last-Mile".dkd_lastmile_system_config
set dkd_value = coalesce(dkd_value, '{}'::jsonb) || jsonb_build_object(
      'menu_profile', 'calm_night_72',
      'home_profile', 'calm_night_72',
      'home_bpm', 72,
      'crossfade_ms', 650
    ),
    dkd_updated_at = now()
where dkd_key = 'dkd_audio';

create or replace function public.dkd_lastmile_delete_account_data(dkd_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = 'Last-Mile', public
as $$
begin
  if dkd_user_id is null then
    raise exception 'dkd_user_id_required';
  end if;

  delete from "Last-Mile".dkd_lastmile_reward_claims where dkd_lastmile_reward_claims.dkd_user_id = dkd_lastmile_delete_account_data.dkd_user_id;
  delete from "Last-Mile".dkd_lastmile_delivery_jobs where dkd_lastmile_delivery_jobs.dkd_user_id = dkd_lastmile_delete_account_data.dkd_user_id;
  delete from "Last-Mile".dkd_lastmile_player_progress where dkd_lastmile_player_progress.dkd_user_id = dkd_lastmile_delete_account_data.dkd_user_id;
  delete from "Last-Mile".dkd_lastmile_admin_entitlements where dkd_lastmile_admin_entitlements.dkd_user_id = dkd_lastmile_delete_account_data.dkd_user_id;
  delete from "Last-Mile".dkd_lastmile_profiles where dkd_lastmile_profiles.dkd_user_id = dkd_lastmile_delete_account_data.dkd_user_id;
  return true;
end;
$$;

revoke all on function public.dkd_lastmile_delete_account_data(uuid) from public, anon, authenticated;
grant execute on function public.dkd_lastmile_delete_account_data(uuid) to service_role;

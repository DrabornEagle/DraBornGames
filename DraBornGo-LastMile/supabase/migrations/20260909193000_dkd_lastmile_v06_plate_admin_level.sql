-- DraBornGo / Last Mile v0.6
-- Scope: only the dedicated "Last-Mile" schema and its public RPC facade.

alter table "Last-Mile".dkd_lastmile_profiles
  add column if not exists dkd_plate_no text;

alter table "Last-Mile".dkd_lastmile_profiles
  drop constraint if exists dkd_lastmile_profiles_plate_format_check;

alter table "Last-Mile".dkd_lastmile_profiles
  add constraint dkd_lastmile_profiles_plate_format_check
  check (
    dkd_plate_no is null
    or dkd_plate_no ~ '^[0-9]{2} [A-ZÇĞİÖŞÜ]{1,3} [0-9]{2,4}$'
  );

create or replace function public.dkd_lastmile_save_progress(
  dkd_user_id uuid,
  dkd_game_state jsonb,
  dkd_level integer,
  dkd_xp bigint,
  dkd_wallet bigint,
  dkd_deliveries integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  dkd_state jsonb := coalesce($2,'{}'::jsonb);
  dkd_saved_wallet bigint := greatest(0,$5);
  dkd_saved_level integer := greatest(1,$3);
  dkd_saved_xp bigint := greatest(0,$4);
  dkd_admin boolean := false;
  dkd_plate text := null;
  dkd_latest_score jsonb := null;
  dkd_active_season "Last-Mile".dkd_lastmile_seasons%rowtype;
  dkd_reward_id text := null;
  dkd_score_value bigint := 0;
begin
  if not "Last-Mile".dkd_lastmile_is_active($1) then return false; end if;
  dkd_admin := "Last-Mile".dkd_lastmile_is_admin($1);

  dkd_plate := upper(regexp_replace(trim(coalesce(
    nullif(dkd_state #>> '{dkd_profile,dkd_plate}',''),
    nullif(dkd_state #>> '{dkd_brand,dkd_plate}','')
  )), '\s+', ' ', 'g'));
  if dkd_plate !~ '^[0-9]{2} [A-ZÇĞİÖŞÜ]{1,3} [0-9]{2,4}$' then
    dkd_plate := null;
  end if;

  if dkd_plate is not null then
    update "Last-Mile".dkd_lastmile_profiles
       set dkd_plate_no = dkd_plate,
           dkd_updated_at = now()
     where dkd_user_id = $1;
  end if;

  if dkd_admin then
    dkd_saved_wallet := 99999999;
    dkd_saved_level := 50;
    dkd_saved_xp := 384160;
    dkd_state := jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(dkd_state,'{dkd_wallet}','99999999'::jsonb,true),
            '{dkd_tokens}','99999999'::jsonb,true
          ),
          '{dkd_vipTrust}','100'::jsonb,true
        ),
        '{dkd_adminAllCities}','true'::jsonb,true
      ),
      '{dkd_xp}','384160'::jsonb,true
    );
  end if;

  insert into "Last-Mile".dkd_lastmile_player_progress(
    dkd_user_id,dkd_game_state,dkd_level,dkd_xp,dkd_wallet,dkd_deliveries,dkd_last_sync_at
  )
  values($1,dkd_state,dkd_saved_level,dkd_saved_xp,dkd_saved_wallet,greatest(0,$6),now())
  on conflict on constraint dkd_lastmile_player_progress_pkey do update set
    dkd_game_state=excluded.dkd_game_state,
    dkd_level=excluded.dkd_level,
    dkd_xp=excluded.dkd_xp,
    dkd_wallet=excluded.dkd_wallet,
    dkd_deliveries=excluded.dkd_deliveries,
    dkd_last_sync_at=now(),
    dkd_updated_at=now();

  if jsonb_typeof(dkd_state->'dkd_scores')='array' and jsonb_array_length(dkd_state->'dkd_scores')>0 then
    dkd_latest_score := dkd_state->'dkd_scores'->(jsonb_array_length(dkd_state->'dkd_scores')-1);
  end if;

  if dkd_latest_score is not null
     and coalesce(dkd_latest_score->>'dkd_audit','')='LOCAL_CHECK_PASSED'
     and coalesce((dkd_latest_score->>'dkd_training')::boolean,false)=false then
    select dkd_season_row.* into dkd_active_season
    from "Last-Mile".dkd_lastmile_seasons as dkd_season_row
    where dkd_season_row.dkd_is_active
      and now() between dkd_season_row.dkd_starts_at and dkd_season_row.dkd_ends_at
    order by dkd_season_row.dkd_number
    limit 1;

    if dkd_active_season.dkd_id is not null
       and coalesce(dkd_latest_score->>'dkd_season','')=dkd_active_season.dkd_id then
      dkd_score_value := greatest(0,least(100000,coalesce((dkd_latest_score->>'dkd_score')::bigint,0)));
      select dkd_reward_row.dkd_id into dkd_reward_id
      from "Last-Mile".dkd_lastmile_season_rewards as dkd_reward_row
      where dkd_reward_row.dkd_season_id=dkd_active_season.dkd_id
        and dkd_reward_row.dkd_slot_id=coalesce(dkd_latest_score->>'dkd_prize','')
        and dkd_reward_row.dkd_is_active
      limit 1;

      if dkd_reward_id is not null and dkd_score_value>0 then
        insert into "Last-Mile".dkd_lastmile_reward_claims(
          dkd_user_id,dkd_season_id,dkd_reward_id,dkd_final_score,dkd_status,dkd_eligibility_snapshot
        )
        values(
          $1,
          dkd_active_season.dkd_id,
          dkd_reward_id,
          dkd_score_value,
          'pending_verification',
          jsonb_build_object(
            'source','authenticated_cloud_save',
            'local_audit','LOCAL_CHECK_PASSED',
            'server_completed_jobs',(
              select count(*)
              from "Last-Mile".dkd_lastmile_delivery_jobs as dkd_job_row
              where dkd_job_row.dkd_user_id=$1 and dkd_job_row.dkd_status='completed'
            ),
            'submitted_at',now(),
            'reward_mode','skill_competition'
          )
        )
        on conflict on constraint dkd_lastmile_reward_claims_dkd_user_id_dkd_season_id_key
        do update set
          dkd_reward_id=excluded.dkd_reward_id,
          dkd_final_score=greatest("Last-Mile".dkd_lastmile_reward_claims.dkd_final_score,excluded.dkd_final_score),
          dkd_status=case
            when "Last-Mile".dkd_lastmile_reward_claims.dkd_status in ('approved','fulfilled')
              then "Last-Mile".dkd_lastmile_reward_claims.dkd_status
            else 'pending_verification'
          end,
          dkd_eligibility_snapshot=excluded.dkd_eligibility_snapshot,
          dkd_updated_at=now();
      end if;
    end if;
  end if;
  return true;
end;
$function$;

create or replace function public.dkd_lastmile_bootstrap(dkd_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  dkd_profile "Last-Mile".dkd_lastmile_profiles%rowtype;
  dkd_runtime jsonb := coalesce((select dkd_config.dkd_value from "Last-Mile".dkd_lastmile_system_config as dkd_config where dkd_config.dkd_key='dkd_runtime'),'{}'::jsonb);
  dkd_admin boolean := false;
  dkd_demo boolean := false;
  dkd_current_season jsonb := null;
begin
  select * into dkd_profile from "Last-Mile".dkd_lastmile_profiles as dkd_profile_source where dkd_profile_source.dkd_user_id=$1;
  if dkd_profile.dkd_user_id is null or dkd_profile.dkd_is_active is not true then
    return jsonb_build_object('dkd_enabled',false,'dkd_role','player','dkd_is_admin',false,'dkd_demo_enabled',false,'dkd_version','0.6');
  end if;
  dkd_admin := dkd_profile.dkd_role='admin';
  dkd_demo := dkd_admin and coalesce(dkd_profile.dkd_demo_enabled,false);
  select to_jsonb(dkd_season) into dkd_current_season
  from "Last-Mile".dkd_lastmile_seasons as dkd_season
  where dkd_season.dkd_is_active and now() between dkd_season.dkd_starts_at and dkd_season.dkd_ends_at
  order by dkd_season.dkd_number limit 1;
  return jsonb_build_object(
    'dkd_enabled',true,
    'dkd_role',dkd_profile.dkd_role,
    'dkd_is_admin',dkd_admin,
    'dkd_demo_enabled',dkd_demo,
    'dkd_version','0.6',
    'dkd_profile',to_jsonb(dkd_profile),
    'dkd_runtime',dkd_runtime,
    'dkd_features',coalesce((select dkd_config.dkd_value from "Last-Mile".dkd_lastmile_system_config as dkd_config where dkd_config.dkd_key='dkd_features'),'{}'::jsonb),
    'dkd_audio',coalesce((select dkd_config.dkd_value from "Last-Mile".dkd_lastmile_system_config as dkd_config where dkd_config.dkd_key='dkd_audio'),'{}'::jsonb),
    'dkd_live_season',coalesce((select dkd_config.dkd_value from "Last-Mile".dkd_lastmile_system_config as dkd_config where dkd_config.dkd_key='dkd_live_season'),'{}'::jsonb),
    'dkd_current_season',dkd_current_season,
    'dkd_seasons',coalesce((select jsonb_agg(to_jsonb(dkd_season) order by dkd_season.dkd_number) from "Last-Mile".dkd_lastmile_seasons as dkd_season where dkd_season.dkd_is_active),'[]'::jsonb),
    'dkd_rewards',coalesce((select jsonb_agg(to_jsonb(dkd_reward) order by dkd_reward.dkd_season_id,dkd_reward.dkd_sort) from "Last-Mile".dkd_lastmile_season_rewards as dkd_reward where dkd_reward.dkd_is_active),'[]'::jsonb),
    'dkd_admin_entitlements',case when dkd_admin then (select to_jsonb(dkd_entitlement) from "Last-Mile".dkd_lastmile_admin_entitlements as dkd_entitlement where dkd_entitlement.dkd_user_id=$1) else null end,
    'dkd_city_packages',coalesce((select jsonb_agg(to_jsonb(dkd_city) order by dkd_city.dkd_sort) from "Last-Mile".dkd_lastmile_city_packages as dkd_city where dkd_city.dkd_is_active),'[]'::jsonb),
    'dkd_zones',coalesce((select jsonb_agg(to_jsonb(dkd_zone) order by dkd_zone.dkd_name) from "Last-Mile".dkd_lastmile_city_zones as dkd_zone where dkd_zone.dkd_is_active),'[]'::jsonb),
    'dkd_packages',coalesce((select jsonb_agg(to_jsonb(dkd_package) order by dkd_package.dkd_min_level,dkd_package.dkd_name) from "Last-Mile".dkd_lastmile_content_packages as dkd_package where dkd_package.dkd_is_active and (not dkd_package.dkd_is_demo or dkd_demo)),'[]'::jsonb),
    'dkd_customers',coalesce((select jsonb_agg(to_jsonb(dkd_customer) order by dkd_customer.dkd_name) from "Last-Mile".dkd_lastmile_content_customers as dkd_customer where dkd_customer.dkd_is_active and (not dkd_customer.dkd_is_demo or dkd_demo)),'[]'::jsonb),
    'dkd_missions',coalesce((select jsonb_agg(to_jsonb(dkd_mission) order by dkd_mission.dkd_min_level,dkd_mission.dkd_name) from "Last-Mile".dkd_lastmile_mission_templates as dkd_mission where dkd_mission.dkd_is_active and (not dkd_mission.dkd_is_demo or dkd_demo)),'[]'::jsonb),
    'dkd_progress',(select dkd_progress.dkd_game_state from "Last-Mile".dkd_lastmile_player_progress as dkd_progress where dkd_progress.dkd_user_id=$1)
  );
end;
$function$;

update "Last-Mile".dkd_lastmile_system_config
set dkd_value = jsonb_set(coalesce(dkd_value,'{}'::jsonb), '{version}', '"0.6"'::jsonb, true),
    dkd_updated_at = now()
where dkd_key = 'dkd_runtime';

update "Last-Mile".dkd_lastmile_system_config
set dkd_value = jsonb_set(coalesce(dkd_value,'{}'::jsonb), '{admin_level}', '50'::jsonb, true),
    dkd_updated_at = now()
where dkd_key = 'dkd_admin';

update "Last-Mile".dkd_lastmile_player_progress as dkd_progress
set dkd_level = 50,
    dkd_xp = 384160,
    dkd_game_state = jsonb_set(coalesce(dkd_progress.dkd_game_state,'{}'::jsonb), '{dkd_xp}', '384160'::jsonb, true),
    dkd_last_sync_at = now(),
    dkd_updated_at = now()
from "Last-Mile".dkd_lastmile_profiles as dkd_profile
where dkd_profile.dkd_user_id = dkd_progress.dkd_user_id
  and dkd_profile.dkd_role = 'admin';

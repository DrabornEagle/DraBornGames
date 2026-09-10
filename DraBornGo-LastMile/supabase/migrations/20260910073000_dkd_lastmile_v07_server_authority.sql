-- DraBornGo / Last Mile v0.7
-- Server-authoritative progression and physical reward verification.
-- Scope is intentionally limited to the isolated "Last-Mile" schema and
-- public.dkd_lastmile_* RPC bridges used only by dkd-last-mile-api.

alter table "Last-Mile".dkd_lastmile_player_progress
  add column if not exists dkd_server_xp bigint not null default 0,
  add column if not exists dkd_server_level integer not null default 1,
  add column if not exists dkd_server_wallet bigint not null default 0,
  add column if not exists dkd_server_deliveries integer not null default 0,
  add column if not exists dkd_server_storm_deliveries integer not null default 0,
  add column if not exists dkd_server_updated_at timestamptz not null default now(),
  add column if not exists dkd_server_authority_version integer not null default 1;

alter table "Last-Mile".dkd_lastmile_delivery_jobs
  add column if not exists dkd_season_id text references "Last-Mile".dkd_lastmile_seasons(dkd_id),
  add column if not exists dkd_server_verified boolean not null default false,
  add column if not exists dkd_server_elapsed_sec integer,
  add column if not exists dkd_server_xp_awarded integer not null default 0,
  add column if not exists dkd_server_wallet_awarded integer not null default 0;

alter table "Last-Mile".dkd_lastmile_reward_claims
  add column if not exists dkd_server_verified boolean not null default false,
  add column if not exists dkd_server_score bigint not null default 0,
  add column if not exists dkd_submitted_score bigint not null default 0,
  add column if not exists dkd_reviewed_by uuid references auth.users(id) on delete set null,
  add column if not exists dkd_reviewed_at timestamptz,
  add column if not exists dkd_review_note text,
  add column if not exists dkd_verification_version integer not null default 1;

create table if not exists "Last-Mile".dkd_lastmile_security_events (
  dkd_id uuid primary key default gen_random_uuid(),
  dkd_user_id uuid not null references auth.users(id) on delete cascade,
  dkd_job_id uuid references "Last-Mile".dkd_lastmile_delivery_jobs(dkd_id) on delete set null,
  dkd_event_type text not null,
  dkd_severity text not null default 'info' check (dkd_severity in ('info','warning','critical')),
  dkd_payload jsonb not null default '{}'::jsonb,
  dkd_created_at timestamptz not null default now()
);

alter table "Last-Mile".dkd_lastmile_security_events enable row level security;
revoke all on table "Last-Mile".dkd_lastmile_security_events from public, anon, authenticated;
grant select, insert, update, delete on table "Last-Mile".dkd_lastmile_security_events to service_role;

create index if not exists dkd_lastmile_delivery_jobs_season_verified_idx
  on "Last-Mile".dkd_lastmile_delivery_jobs(dkd_season_id, dkd_server_verified, dkd_completed_at desc);
create index if not exists dkd_lastmile_reward_claims_reviewed_by_idx
  on "Last-Mile".dkd_lastmile_reward_claims(dkd_reviewed_by);
create index if not exists dkd_lastmile_security_events_user_created_idx
  on "Last-Mile".dkd_lastmile_security_events(dkd_user_id, dkd_created_at desc);
create index if not exists dkd_lastmile_security_events_job_idx
  on "Last-Mile".dkd_lastmile_security_events(dkd_job_id);
create index if not exists dkd_lastmile_security_events_type_created_idx
  on "Last-Mile".dkd_lastmile_security_events(dkd_event_type, dkd_created_at desc);

-- Pre-v0.7 completion rows are deliberately NOT promoted to trusted progress.
-- They were created before the hardened completion verifier existed.
update "Last-Mile".dkd_lastmile_player_progress as dkd_progress
set dkd_server_level = case
      when exists (
        select 1 from "Last-Mile".dkd_lastmile_profiles as dkd_profile
        where dkd_profile.dkd_user_id=dkd_progress.dkd_user_id and dkd_profile.dkd_role='admin'
      ) then 50 else greatest(1, dkd_progress.dkd_server_level) end,
    dkd_server_xp = case
      when exists (
        select 1 from "Last-Mile".dkd_lastmile_profiles as dkd_profile
        where dkd_profile.dkd_user_id=dkd_progress.dkd_user_id and dkd_profile.dkd_role='admin'
      ) then 384160 else greatest(0, dkd_progress.dkd_server_xp) end,
    dkd_server_wallet = case
      when exists (
        select 1 from "Last-Mile".dkd_lastmile_profiles as dkd_profile
        where dkd_profile.dkd_user_id=dkd_progress.dkd_user_id and dkd_profile.dkd_role='admin'
      ) then 99999999 else greatest(0, dkd_progress.dkd_server_wallet) end,
    dkd_server_updated_at=now(),
    dkd_server_authority_version=1;

create or replace function public.dkd_lastmile_bootstrap(dkd_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path=''
as $$
declare
  dkd_profile "Last-Mile".dkd_lastmile_profiles%rowtype;
  dkd_runtime jsonb := coalesce((select dkd_config.dkd_value from "Last-Mile".dkd_lastmile_system_config as dkd_config where dkd_config.dkd_key='dkd_runtime'),'{}'::jsonb);
  dkd_admin boolean := false;
  dkd_demo boolean := false;
  dkd_current_season jsonb := null;
  dkd_server_progress jsonb := null;
begin
  select * into dkd_profile
  from "Last-Mile".dkd_lastmile_profiles as dkd_profile_source
  where dkd_profile_source.dkd_user_id=$1;

  if dkd_profile.dkd_user_id is null or dkd_profile.dkd_is_active is not true then
    return jsonb_build_object(
      'dkd_enabled',false,
      'dkd_role','player',
      'dkd_is_admin',false,
      'dkd_demo_enabled',false,
      'dkd_version','0.7'
    );
  end if;

  dkd_admin := dkd_profile.dkd_role='admin';
  dkd_demo := dkd_admin and coalesce(dkd_profile.dkd_demo_enabled,false);

  insert into "Last-Mile".dkd_lastmile_player_progress(dkd_user_id)
  values($1)
  on conflict on constraint dkd_lastmile_player_progress_pkey do nothing;

  if dkd_admin then
    update "Last-Mile".dkd_lastmile_player_progress as dkd_progress
    set dkd_server_level=50,
        dkd_server_xp=384160,
        dkd_server_wallet=99999999,
        dkd_server_updated_at=now(),
        dkd_server_authority_version=1
    where dkd_progress.dkd_user_id=$1;
  end if;

  select jsonb_build_object(
    'dkd_level',dkd_progress.dkd_server_level,
    'dkd_xp',dkd_progress.dkd_server_xp,
    'dkd_wallet',dkd_progress.dkd_server_wallet,
    'dkd_deliveries',dkd_progress.dkd_server_deliveries,
    'dkd_storm_deliveries',dkd_progress.dkd_server_storm_deliveries,
    'dkd_updated_at',dkd_progress.dkd_server_updated_at,
    'dkd_authority_version',dkd_progress.dkd_server_authority_version
  ) into dkd_server_progress
  from "Last-Mile".dkd_lastmile_player_progress as dkd_progress
  where dkd_progress.dkd_user_id=$1;

  select to_jsonb(dkd_season) into dkd_current_season
  from "Last-Mile".dkd_lastmile_seasons as dkd_season
  where dkd_season.dkd_is_active and now() between dkd_season.dkd_starts_at and dkd_season.dkd_ends_at
  order by dkd_season.dkd_number limit 1;

  return jsonb_build_object(
    'dkd_enabled',true,
    'dkd_role',dkd_profile.dkd_role,
    'dkd_is_admin',dkd_admin,
    'dkd_demo_enabled',dkd_demo,
    'dkd_version','0.7',
    'dkd_profile',to_jsonb(dkd_profile),
    'dkd_runtime',dkd_runtime,
    'dkd_features',coalesce((select dkd_config.dkd_value from "Last-Mile".dkd_lastmile_system_config as dkd_config where dkd_config.dkd_key='dkd_features'),'{}'::jsonb),
    'dkd_audio',coalesce((select dkd_config.dkd_value from "Last-Mile".dkd_lastmile_system_config as dkd_config where dkd_config.dkd_key='dkd_audio'),'{}'::jsonb),
    'dkd_live_season',coalesce((select dkd_config.dkd_value from "Last-Mile".dkd_lastmile_system_config as dkd_config where dkd_config.dkd_key='dkd_live_season'),'{}'::jsonb),
    'dkd_current_season',dkd_current_season,
    'dkd_server_progress',dkd_server_progress,
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
$$;

create or replace function public.dkd_lastmile_claim_job(dkd_user_id uuid, dkd_level integer)
returns jsonb
language plpgsql
security definer
set search_path=''
as $$
declare
  dkd_profile "Last-Mile".dkd_lastmile_profiles%rowtype;
  dkd_demo boolean := false;
  dkd_server_level integer := 1;
  dkd_open_jobs integer := 0;
  dkd_season_id text := null;
  dkd_mission "Last-Mile".dkd_lastmile_mission_templates%rowtype;
  dkd_package "Last-Mile".dkd_lastmile_content_packages%rowtype;
  dkd_customer "Last-Mile".dkd_lastmile_content_customers%rowtype;
  dkd_origin "Last-Mile".dkd_lastmile_city_zones%rowtype;
  dkd_destination "Last-Mile".dkd_lastmile_city_zones%rowtype;
  dkd_weather text;
  dkd_reward integer;
  dkd_job "Last-Mile".dkd_lastmile_delivery_jobs%rowtype;
begin
  select * into dkd_profile
  from "Last-Mile".dkd_lastmile_profiles as dkd_profile_source
  where dkd_profile_source.dkd_user_id=$1 and dkd_profile_source.dkd_is_active=true;
  if dkd_profile.dkd_user_id is null then raise exception 'player_required'; end if;

  dkd_demo := dkd_profile.dkd_role='admin' and coalesce(dkd_profile.dkd_demo_enabled,false);

  insert into "Last-Mile".dkd_lastmile_player_progress(dkd_user_id)
  values($1)
  on conflict on constraint dkd_lastmile_player_progress_pkey do nothing;

  if dkd_profile.dkd_role='admin' then
    dkd_server_level := 50;
    update "Last-Mile".dkd_lastmile_player_progress as dkd_progress
    set dkd_server_level=50, dkd_server_xp=384160, dkd_server_wallet=99999999,
        dkd_server_updated_at=now(), dkd_server_authority_version=1
    where dkd_progress.dkd_user_id=$1;
  else
    select greatest(1, dkd_progress.dkd_server_level) into dkd_server_level
    from "Last-Mile".dkd_lastmile_player_progress as dkd_progress
    where dkd_progress.dkd_user_id=$1;
  end if;

  -- Remove abandoned offers/accepts from the active pool without granting progress.
  update "Last-Mile".dkd_lastmile_delivery_jobs as dkd_jobs
  set dkd_status='cancelled',
      dkd_metrics=coalesce(dkd_jobs.dkd_metrics,'{}'::jsonb) || jsonb_build_object('dkd_server_reason','offer_expired'),
      dkd_updated_at=now()
  where dkd_jobs.dkd_user_id=$1 and dkd_jobs.dkd_status='offered'
    and dkd_jobs.dkd_created_at < now()-interval '30 minutes';

  update "Last-Mile".dkd_lastmile_delivery_jobs as dkd_jobs
  set dkd_status='failed',
      dkd_metrics=coalesce(dkd_jobs.dkd_metrics,'{}'::jsonb) || jsonb_build_object('dkd_server_reason','accepted_job_abandoned'),
      dkd_updated_at=now()
  where dkd_jobs.dkd_user_id=$1 and dkd_jobs.dkd_status='accepted'
    and coalesce(dkd_jobs.dkd_started_at,dkd_jobs.dkd_created_at) < now()-interval '12 hours';

  select count(*) into dkd_open_jobs
  from "Last-Mile".dkd_lastmile_delivery_jobs as dkd_jobs
  where dkd_jobs.dkd_user_id=$1 and dkd_jobs.dkd_status in ('offered','accepted');
  if dkd_open_jobs >= 6 then raise exception 'job_pool_full'; end if;

  select dkd_season.dkd_id into dkd_season_id
  from "Last-Mile".dkd_lastmile_seasons as dkd_season
  where dkd_season.dkd_is_active and now() between dkd_season.dkd_starts_at and dkd_season.dkd_ends_at
  order by dkd_season.dkd_number limit 1;

  select * into dkd_mission
  from "Last-Mile".dkd_lastmile_mission_templates as dkd_mission_source
  where dkd_mission_source.dkd_is_active
    and dkd_mission_source.dkd_min_level <= dkd_server_level
    and (not dkd_mission_source.dkd_is_demo or dkd_demo)
  order by random() limit 1;
  if dkd_mission.dkd_id is null then raise exception 'no_mission_available'; end if;

  select * into dkd_package
  from "Last-Mile".dkd_lastmile_content_packages as dkd_package_source
  where dkd_package_source.dkd_id=dkd_mission.dkd_package_id and dkd_package_source.dkd_is_active;

  select * into dkd_customer
  from "Last-Mile".dkd_lastmile_content_customers as dkd_customer_source
  where dkd_customer_source.dkd_is_active
    and dkd_customer_source.dkd_package_id=dkd_mission.dkd_package_id
    and (not dkd_customer_source.dkd_is_demo or dkd_demo)
  order by random() limit 1;

  select * into dkd_origin from "Last-Mile".dkd_lastmile_city_zones as dkd_zone where dkd_zone.dkd_is_active order by random() limit 1;
  select * into dkd_destination from "Last-Mile".dkd_lastmile_city_zones as dkd_zone where dkd_zone.dkd_is_active and dkd_zone.dkd_id<>dkd_origin.dkd_id order by random() limit 1;
  dkd_weather := dkd_mission.dkd_weather_pool[1 + floor(random()*array_length(dkd_mission.dkd_weather_pool,1))::integer];
  dkd_reward := dkd_mission.dkd_reward_min + floor(random()*(dkd_mission.dkd_reward_max-dkd_mission.dkd_reward_min+1))::integer;

  insert into "Last-Mile".dkd_lastmile_delivery_jobs(
    dkd_user_id,dkd_template_id,dkd_package_id,dkd_origin_zone_id,dkd_destination_zone_id,
    dkd_weather_id,dkd_reward,dkd_time_limit_sec,dkd_status,dkd_season_id,dkd_server_verified
  ) values(
    $1,dkd_mission.dkd_id,dkd_mission.dkd_package_id,dkd_origin.dkd_id,dkd_destination.dkd_id,
    dkd_weather,dkd_reward,dkd_mission.dkd_time_limit_sec,'offered',dkd_season_id,false
  ) returning * into dkd_job;

  return jsonb_build_object(
    'dkd_job',to_jsonb(dkd_job),
    'dkd_mission',to_jsonb(dkd_mission),
    'dkd_package',to_jsonb(dkd_package),
    'dkd_customer',case when dkd_customer.dkd_id is null then null else to_jsonb(dkd_customer) end,
    'dkd_origin',to_jsonb(dkd_origin),
    'dkd_destination',to_jsonb(dkd_destination),
    'dkd_server_level',dkd_server_level
  );
end;
$$;

create or replace function public.dkd_lastmile_accept_job(dkd_user_id uuid, dkd_job_id uuid)
returns jsonb
language plpgsql
security definer
set search_path=''
as $$
declare
  dkd_job "Last-Mile".dkd_lastmile_delivery_jobs%rowtype;
begin
  if not "Last-Mile".dkd_lastmile_is_active($1) then raise exception 'player_required'; end if;

  update "Last-Mile".dkd_lastmile_delivery_jobs as dkd_jobs
  set dkd_status='accepted', dkd_started_at=now(), dkd_updated_at=now()
  where dkd_jobs.dkd_id=$2 and dkd_jobs.dkd_user_id=$1 and dkd_jobs.dkd_status='offered'
    and dkd_jobs.dkd_created_at >= now()-interval '30 minutes'
  returning dkd_jobs.* into dkd_job;

  if dkd_job.dkd_id is null then
    select * into dkd_job
    from "Last-Mile".dkd_lastmile_delivery_jobs as dkd_jobs
    where dkd_jobs.dkd_id=$2 and dkd_jobs.dkd_user_id=$1 and dkd_jobs.dkd_status='accepted';
  end if;
  if dkd_job.dkd_id is null then raise exception 'job_not_found_or_expired'; end if;
  return to_jsonb(dkd_job);
end;
$$;

create or replace function public.dkd_lastmile_complete_job(dkd_user_id uuid, dkd_job_id uuid, dkd_metrics jsonb)
returns jsonb
language plpgsql
security definer
set search_path=''
as $$
declare
  dkd_job "Last-Mile".dkd_lastmile_delivery_jobs%rowtype;
  dkd_progress "Last-Mile".dkd_lastmile_player_progress%rowtype;
  dkd_admin boolean := false;
  dkd_elapsed integer := 0;
  dkd_verified boolean := false;
  dkd_xp_gain integer := 0;
  dkd_wallet_gain integer := 0;
  dkd_storm_gain integer := 0;
  dkd_safe_metrics jsonb := '{}';
begin
  if not "Last-Mile".dkd_lastmile_is_active($1) then raise exception 'player_required'; end if;
  dkd_admin := "Last-Mile".dkd_lastmile_is_admin($1);

  select * into dkd_job
  from "Last-Mile".dkd_lastmile_delivery_jobs as dkd_jobs
  where dkd_jobs.dkd_id=$2 and dkd_jobs.dkd_user_id=$1
  for update;

  if dkd_job.dkd_id is null then raise exception 'job_not_found'; end if;
  if dkd_job.dkd_status='completed' then
    return to_jsonb(dkd_job) || jsonb_build_object('dkd_idempotent',true);
  end if;
  if dkd_job.dkd_status<>'accepted' or dkd_job.dkd_started_at is null then
    raise exception 'job_not_accepted';
  end if;

  dkd_elapsed := greatest(0, floor(extract(epoch from (now()-dkd_job.dkd_started_at)))::integer);
  dkd_verified := dkd_elapsed >= 30 and dkd_elapsed <= greatest(1800, dkd_job.dkd_time_limit_sec*3);
  dkd_xp_gain := case when dkd_verified then greatest(10,least(500,50 + dkd_job.dkd_reward/20)) else 0 end;
  dkd_wallet_gain := case when dkd_verified then greatest(0,dkd_job.dkd_reward) else 0 end;
  dkd_storm_gain := case when dkd_verified and dkd_job.dkd_weather_id='dkd_storm' then 1 else 0 end;

  dkd_safe_metrics := jsonb_build_object(
    'dkd_server_verified',dkd_verified,
    'dkd_server_elapsed_sec',dkd_elapsed,
    'dkd_server_reward',dkd_job.dkd_reward,
    'dkd_server_xp_awarded',dkd_xp_gain,
    'dkd_server_wallet_awarded',dkd_wallet_gain,
    'dkd_client_metrics',coalesce($3,'{}'::jsonb)
  );

  update "Last-Mile".dkd_lastmile_delivery_jobs as dkd_jobs
  set dkd_status='completed',
      dkd_metrics=dkd_safe_metrics,
      dkd_completed_at=now(),
      dkd_server_verified=dkd_verified,
      dkd_server_elapsed_sec=dkd_elapsed,
      dkd_server_xp_awarded=dkd_xp_gain,
      dkd_server_wallet_awarded=dkd_wallet_gain,
      dkd_updated_at=now()
  where dkd_jobs.dkd_id=$2
  returning dkd_jobs.* into dkd_job;

  insert into "Last-Mile".dkd_lastmile_player_progress(dkd_user_id)
  values($1)
  on conflict on constraint dkd_lastmile_player_progress_pkey do nothing;

  if dkd_verified then
    if dkd_admin then
      update "Last-Mile".dkd_lastmile_player_progress as dkd_progress_row
      set dkd_server_xp=384160,
          dkd_server_level=50,
          dkd_server_wallet=99999999,
          dkd_server_deliveries=dkd_progress_row.dkd_server_deliveries+1,
          dkd_server_storm_deliveries=dkd_progress_row.dkd_server_storm_deliveries+dkd_storm_gain,
          dkd_server_updated_at=now(),
          dkd_server_authority_version=1
      where dkd_progress_row.dkd_user_id=$1;
    else
      update "Last-Mile".dkd_lastmile_player_progress as dkd_progress_row
      set dkd_server_xp=dkd_progress_row.dkd_server_xp+dkd_xp_gain,
          dkd_server_wallet=dkd_progress_row.dkd_server_wallet+dkd_wallet_gain,
          dkd_server_deliveries=dkd_progress_row.dkd_server_deliveries+1,
          dkd_server_storm_deliveries=dkd_progress_row.dkd_server_storm_deliveries+dkd_storm_gain,
          dkd_server_level=greatest(1,least(999,1+floor(sqrt((dkd_progress_row.dkd_server_xp+dkd_xp_gain)::numeric/160))::integer)),
          dkd_server_updated_at=now(),
          dkd_server_authority_version=1
      where dkd_progress_row.dkd_user_id=$1;
    end if;
  else
    insert into "Last-Mile".dkd_lastmile_security_events(dkd_user_id,dkd_job_id,dkd_event_type,dkd_severity,dkd_payload)
    values($1,$2,'dkd_implausible_completion','warning',jsonb_build_object(
      'dkd_elapsed_sec',dkd_elapsed,
      'dkd_time_limit_sec',dkd_job.dkd_time_limit_sec,
      'dkd_reason',case when dkd_elapsed<30 then 'too_fast' else 'too_late' end
    ));
  end if;

  select * into dkd_progress
  from "Last-Mile".dkd_lastmile_player_progress as dkd_progress_row
  where dkd_progress_row.dkd_user_id=$1;

  return to_jsonb(dkd_job) || jsonb_build_object(
    'dkd_server_progress',jsonb_build_object(
      'dkd_level',dkd_progress.dkd_server_level,
      'dkd_xp',dkd_progress.dkd_server_xp,
      'dkd_wallet',dkd_progress.dkd_server_wallet,
      'dkd_deliveries',dkd_progress.dkd_server_deliveries,
      'dkd_storm_deliveries',dkd_progress.dkd_server_storm_deliveries
    )
  );
end;
$$;

create or replace function public.dkd_lastmile_submit_reward_claim(dkd_user_id uuid, dkd_reward_id text, dkd_final_score bigint)
returns jsonb
language plpgsql
security definer
set search_path=''
as $$
declare
  dkd_season "Last-Mile".dkd_lastmile_seasons%rowtype;
  dkd_reward "Last-Mile".dkd_lastmile_season_rewards%rowtype;
  dkd_claim "Last-Mile".dkd_lastmile_reward_claims%rowtype;
  dkd_verified_count integer := 0;
  dkd_storm_count integer := 0;
  dkd_server_score bigint := 0;
begin
  if not "Last-Mile".dkd_lastmile_is_active($1) then raise exception 'account_not_active'; end if;

  select dkd_season_row.* into dkd_season
  from "Last-Mile".dkd_lastmile_seasons as dkd_season_row
  where dkd_season_row.dkd_is_active
    and now() between dkd_season_row.dkd_starts_at and dkd_season_row.dkd_ends_at
  order by dkd_season_row.dkd_number limit 1;
  if dkd_season.dkd_id is null then raise exception 'no_active_season'; end if;

  select dkd_reward_row.* into dkd_reward
  from "Last-Mile".dkd_lastmile_season_rewards as dkd_reward_row
  where dkd_reward_row.dkd_id=$2
    and dkd_reward_row.dkd_season_id=dkd_season.dkd_id
    and dkd_reward_row.dkd_is_active;
  if dkd_reward.dkd_id is null then raise exception 'reward_not_available'; end if;

  select count(*),
         count(*) filter (where dkd_job.dkd_weather_id='dkd_storm')
    into dkd_verified_count,dkd_storm_count
  from "Last-Mile".dkd_lastmile_delivery_jobs as dkd_job
  where dkd_job.dkd_user_id=$1
    and dkd_job.dkd_season_id=dkd_season.dkd_id
    and dkd_job.dkd_status='completed'
    and dkd_job.dkd_server_verified=true;

  if dkd_verified_count < 100 or dkd_storm_count < 10 then
    raise exception 'server_final_requirements_not_met';
  end if;

  select coalesce(sum(dkd_scored.dkd_job_score),0)::bigint into dkd_server_score
  from (
    select greatest(500,least(1000,
      round(500 + 500 * greatest(0::numeric,least(1::numeric,
        (dkd_job.dkd_time_limit_sec-dkd_job.dkd_server_elapsed_sec)::numeric /
        greatest(1,dkd_job.dkd_time_limit_sec-60)::numeric
      )))::integer
    ))::bigint as dkd_job_score
    from "Last-Mile".dkd_lastmile_delivery_jobs as dkd_job
    where dkd_job.dkd_user_id=$1
      and dkd_job.dkd_season_id=dkd_season.dkd_id
      and dkd_job.dkd_status='completed'
      and dkd_job.dkd_server_verified=true
    order by dkd_job.dkd_completed_at desc
    limit 100
  ) as dkd_scored;

  insert into "Last-Mile".dkd_lastmile_reward_claims(
    dkd_user_id,dkd_season_id,dkd_reward_id,dkd_final_score,dkd_status,dkd_eligibility_snapshot,
    dkd_server_verified,dkd_server_score,dkd_submitted_score,dkd_verification_version
  ) values(
    $1,dkd_season.dkd_id,dkd_reward.dkd_id,dkd_server_score,'pending_verification',
    jsonb_build_object(
      'source','server_authority_v1',
      'server_verified_jobs',dkd_verified_count,
      'server_storm_jobs',dkd_storm_count,
      'server_score',dkd_server_score,
      'submitted_score',greatest(0,coalesce($3,0)),
      'manual_review_required',true,
      'reward_mode','skill_competition',
      'submitted_at',now()
    ),
    true,dkd_server_score,greatest(0,coalesce($3,0)),1
  )
  on conflict on constraint dkd_lastmile_reward_claims_dkd_user_id_dkd_season_id_key
  do update set
    dkd_reward_id=case when "Last-Mile".dkd_lastmile_reward_claims.dkd_status in ('approved','fulfilled') then "Last-Mile".dkd_lastmile_reward_claims.dkd_reward_id else excluded.dkd_reward_id end,
    dkd_final_score=case when "Last-Mile".dkd_lastmile_reward_claims.dkd_status in ('approved','fulfilled') then "Last-Mile".dkd_lastmile_reward_claims.dkd_final_score else excluded.dkd_final_score end,
    dkd_status=case when "Last-Mile".dkd_lastmile_reward_claims.dkd_status in ('approved','fulfilled') then "Last-Mile".dkd_lastmile_reward_claims.dkd_status else 'pending_verification' end,
    dkd_eligibility_snapshot=case when "Last-Mile".dkd_lastmile_reward_claims.dkd_status in ('approved','fulfilled') then "Last-Mile".dkd_lastmile_reward_claims.dkd_eligibility_snapshot else excluded.dkd_eligibility_snapshot end,
    dkd_server_verified=case when "Last-Mile".dkd_lastmile_reward_claims.dkd_status in ('approved','fulfilled') then "Last-Mile".dkd_lastmile_reward_claims.dkd_server_verified else true end,
    dkd_server_score=case when "Last-Mile".dkd_lastmile_reward_claims.dkd_status in ('approved','fulfilled') then "Last-Mile".dkd_lastmile_reward_claims.dkd_server_score else excluded.dkd_server_score end,
    dkd_submitted_score=greatest("Last-Mile".dkd_lastmile_reward_claims.dkd_submitted_score,excluded.dkd_submitted_score),
    dkd_verification_version=1,
    dkd_updated_at=now()
  returning * into dkd_claim;

  return to_jsonb(dkd_claim);
end;
$$;

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
set search_path=''
as $$
declare
  dkd_state jsonb := coalesce($2,'{}'::jsonb);
  dkd_saved_wallet bigint := greatest(0,least(1000000000,coalesce($5,0)));
  dkd_saved_level integer := greatest(1,least(999,coalesce($3,1)));
  dkd_saved_xp bigint := greatest(0,least(1000000000,coalesce($4,0)));
  dkd_saved_deliveries integer := greatest(0,least(1000000,coalesce($6,0)));
  dkd_admin boolean := false;
  dkd_plate text := null;
  dkd_latest_score jsonb := null;
  dkd_active_season "Last-Mile".dkd_lastmile_seasons%rowtype;
  dkd_reward_id text := null;
  dkd_submitted_score bigint := 0;
  dkd_verified_count integer := 0;
  dkd_storm_count integer := 0;
  dkd_server_score bigint := 0;
begin
  if not "Last-Mile".dkd_lastmile_is_active($1) then return false; end if;
  dkd_admin := "Last-Mile".dkd_lastmile_is_admin($1);

  dkd_plate := upper(regexp_replace(trim(coalesce(
    nullif(dkd_state #>> '{dkd_profile,dkd_plate}',''),
    nullif(dkd_state #>> '{dkd_brand,dkd_plate}','')
  )), '\s+', ' ', 'g'));
  if dkd_plate !~ '^[0-9]{2} [A-ZÇĞİÖŞÜ]{1,3} [0-9]{2,4}$' then dkd_plate := null; end if;

  if dkd_plate is not null then
    update "Last-Mile".dkd_lastmile_profiles
    set dkd_plate_no=dkd_plate, dkd_updated_at=now()
    where dkd_user_id=$1;
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
    dkd_user_id,dkd_game_state,dkd_level,dkd_xp,dkd_wallet,dkd_deliveries,dkd_last_sync_at,
    dkd_server_xp,dkd_server_level,dkd_server_wallet,dkd_server_deliveries,dkd_server_storm_deliveries,
    dkd_server_updated_at,dkd_server_authority_version
  ) values(
    $1,dkd_state,dkd_saved_level,dkd_saved_xp,dkd_saved_wallet,dkd_saved_deliveries,now(),
    case when dkd_admin then 384160 else 0 end,
    case when dkd_admin then 50 else 1 end,
    case when dkd_admin then 99999999 else 0 end,
    0,0,now(),1
  )
  on conflict on constraint dkd_lastmile_player_progress_pkey do update set
    dkd_game_state=excluded.dkd_game_state,
    dkd_level=excluded.dkd_level,
    dkd_xp=excluded.dkd_xp,
    dkd_wallet=excluded.dkd_wallet,
    dkd_deliveries=excluded.dkd_deliveries,
    dkd_server_xp=case when dkd_admin then 384160 else "Last-Mile".dkd_lastmile_player_progress.dkd_server_xp end,
    dkd_server_level=case when dkd_admin then 50 else "Last-Mile".dkd_lastmile_player_progress.dkd_server_level end,
    dkd_server_wallet=case when dkd_admin then 99999999 else "Last-Mile".dkd_lastmile_player_progress.dkd_server_wallet end,
    dkd_server_updated_at=case when dkd_admin then now() else "Last-Mile".dkd_lastmile_player_progress.dkd_server_updated_at end,
    dkd_server_authority_version=1,
    dkd_last_sync_at=now(),
    dkd_updated_at=now();

  -- Client state may request verification, but it cannot create an eligible claim
  -- unless 100 server-verified season jobs and 10 server-verified storm jobs exist.
  if jsonb_typeof(dkd_state->'dkd_scores')='array' and jsonb_array_length(dkd_state->'dkd_scores')>0 then
    dkd_latest_score := dkd_state->'dkd_scores'->(jsonb_array_length(dkd_state->'dkd_scores')-1);
  end if;

  if dkd_latest_score is not null
     and coalesce(dkd_latest_score->>'dkd_audit','')='LOCAL_CHECK_PASSED'
     and coalesce(dkd_latest_score->>'dkd_training','false')='false' then
    select dkd_season_row.* into dkd_active_season
    from "Last-Mile".dkd_lastmile_seasons as dkd_season_row
    where dkd_season_row.dkd_is_active
      and now() between dkd_season_row.dkd_starts_at and dkd_season_row.dkd_ends_at
    order by dkd_season_row.dkd_number limit 1;

    if dkd_active_season.dkd_id is not null
       and coalesce(dkd_latest_score->>'dkd_season','')=dkd_active_season.dkd_id then
      select dkd_reward_row.dkd_id into dkd_reward_id
      from "Last-Mile".dkd_lastmile_season_rewards as dkd_reward_row
      where dkd_reward_row.dkd_season_id=dkd_active_season.dkd_id
        and dkd_reward_row.dkd_slot_id=coalesce(dkd_latest_score->>'dkd_prize','')
        and dkd_reward_row.dkd_is_active
      limit 1;

      begin
        dkd_submitted_score := greatest(0,least(100000,coalesce((dkd_latest_score->>'dkd_score')::bigint,0)));
      exception when others then
        dkd_submitted_score := 0;
      end;

      if dkd_reward_id is not null then
        select count(*), count(*) filter (where dkd_job.dkd_weather_id='dkd_storm')
          into dkd_verified_count,dkd_storm_count
        from "Last-Mile".dkd_lastmile_delivery_jobs as dkd_job
        where dkd_job.dkd_user_id=$1
          and dkd_job.dkd_season_id=dkd_active_season.dkd_id
          and dkd_job.dkd_status='completed'
          and dkd_job.dkd_server_verified=true;

        if dkd_verified_count>=100 and dkd_storm_count>=10 then
          select coalesce(sum(dkd_scored.dkd_job_score),0)::bigint into dkd_server_score
          from (
            select greatest(500,least(1000,
              round(500 + 500 * greatest(0::numeric,least(1::numeric,
                (dkd_job.dkd_time_limit_sec-dkd_job.dkd_server_elapsed_sec)::numeric /
                greatest(1,dkd_job.dkd_time_limit_sec-60)::numeric
              )))::integer
            ))::bigint as dkd_job_score
            from "Last-Mile".dkd_lastmile_delivery_jobs as dkd_job
            where dkd_job.dkd_user_id=$1
              and dkd_job.dkd_season_id=dkd_active_season.dkd_id
              and dkd_job.dkd_status='completed'
              and dkd_job.dkd_server_verified=true
            order by dkd_job.dkd_completed_at desc
            limit 100
          ) as dkd_scored;

          insert into "Last-Mile".dkd_lastmile_reward_claims(
            dkd_user_id,dkd_season_id,dkd_reward_id,dkd_final_score,dkd_status,dkd_eligibility_snapshot,
            dkd_server_verified,dkd_server_score,dkd_submitted_score,dkd_verification_version
          ) values(
            $1,dkd_active_season.dkd_id,dkd_reward_id,dkd_server_score,'pending_verification',
            jsonb_build_object(
              'source','server_authority_v1',
              'local_final_present',true,
              'server_verified_jobs',dkd_verified_count,
              'server_storm_jobs',dkd_storm_count,
              'server_score',dkd_server_score,
              'submitted_score',dkd_submitted_score,
              'manual_review_required',true,
              'reward_mode','skill_competition',
              'submitted_at',now()
            ),
            true,dkd_server_score,dkd_submitted_score,1
          )
          on conflict on constraint dkd_lastmile_reward_claims_dkd_user_id_dkd_season_id_key
          do update set
            dkd_reward_id=case when "Last-Mile".dkd_lastmile_reward_claims.dkd_status in ('approved','fulfilled') then "Last-Mile".dkd_lastmile_reward_claims.dkd_reward_id else excluded.dkd_reward_id end,
            dkd_final_score=case when "Last-Mile".dkd_lastmile_reward_claims.dkd_status in ('approved','fulfilled') then "Last-Mile".dkd_lastmile_reward_claims.dkd_final_score else excluded.dkd_final_score end,
            dkd_status=case when "Last-Mile".dkd_lastmile_reward_claims.dkd_status in ('approved','fulfilled') then "Last-Mile".dkd_lastmile_reward_claims.dkd_status else 'pending_verification' end,
            dkd_eligibility_snapshot=case when "Last-Mile".dkd_lastmile_reward_claims.dkd_status in ('approved','fulfilled') then "Last-Mile".dkd_lastmile_reward_claims.dkd_eligibility_snapshot else excluded.dkd_eligibility_snapshot end,
            dkd_server_verified=case when "Last-Mile".dkd_lastmile_reward_claims.dkd_status in ('approved','fulfilled') then "Last-Mile".dkd_lastmile_reward_claims.dkd_server_verified else true end,
            dkd_server_score=case when "Last-Mile".dkd_lastmile_reward_claims.dkd_status in ('approved','fulfilled') then "Last-Mile".dkd_lastmile_reward_claims.dkd_server_score else excluded.dkd_server_score end,
            dkd_submitted_score=greatest("Last-Mile".dkd_lastmile_reward_claims.dkd_submitted_score,excluded.dkd_submitted_score),
            dkd_verification_version=1,
            dkd_updated_at=now();
        end if;
      end if;
    end if;
  end if;

  return true;
end;
$$;

create or replace function public.dkd_lastmile_reward_queue(dkd_admin_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path=''
as $$
begin
  if not "Last-Mile".dkd_lastmile_is_admin($1) then raise exception 'admin_required'; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'dkd_claim',to_jsonb(dkd_claim),
      'dkd_reward',to_jsonb(dkd_reward),
      'dkd_season',to_jsonb(dkd_season),
      'dkd_player',jsonb_build_object(
        'dkd_user_id',dkd_profile.dkd_user_id,
        'dkd_full_name',dkd_profile.dkd_full_name,
        'dkd_username',dkd_profile.dkd_username,
        'dkd_company_name',dkd_profile.dkd_company_name,
        'dkd_email',dkd_profile.dkd_email,
        'dkd_phone',dkd_profile.dkd_phone,
        'dkd_plate_no',dkd_profile.dkd_plate_no
      )
    ) order by dkd_claim.dkd_created_at)
    from "Last-Mile".dkd_lastmile_reward_claims as dkd_claim
    join "Last-Mile".dkd_lastmile_season_rewards as dkd_reward on dkd_reward.dkd_id=dkd_claim.dkd_reward_id
    join "Last-Mile".dkd_lastmile_seasons as dkd_season on dkd_season.dkd_id=dkd_claim.dkd_season_id
    join "Last-Mile".dkd_lastmile_profiles as dkd_profile on dkd_profile.dkd_user_id=dkd_claim.dkd_user_id
    where dkd_claim.dkd_status='pending_verification'
  ),'[]'::jsonb);
end;
$$;

create or replace function public.dkd_lastmile_review_reward_claim(
  dkd_admin_user_id uuid,
  dkd_claim_id uuid,
  dkd_decision text,
  dkd_note text
)
returns jsonb
language plpgsql
security definer
set search_path=''
as $$
declare
  dkd_claim "Last-Mile".dkd_lastmile_reward_claims%rowtype;
  dkd_safe_decision text := lower(trim(coalesce($3,'')));
  dkd_safe_note text := left(trim(coalesce($4,'')),1000);
begin
  if not "Last-Mile".dkd_lastmile_is_admin($1) then raise exception 'admin_required'; end if;
  if dkd_safe_decision not in ('approved','rejected','fulfilled') then raise exception 'invalid_decision'; end if;
  if length(dkd_safe_note)<3 then raise exception 'review_note_required'; end if;

  select * into dkd_claim
  from "Last-Mile".dkd_lastmile_reward_claims as dkd_claim_row
  where dkd_claim_row.dkd_id=$2
  for update;
  if dkd_claim.dkd_id is null then raise exception 'claim_not_found'; end if;

  if dkd_safe_decision='approved' then
    if dkd_claim.dkd_status<>'pending_verification' then raise exception 'claim_not_pending'; end if;
    if dkd_claim.dkd_server_verified is not true then raise exception 'reward_server_verification_required'; end if;
  elsif dkd_safe_decision='fulfilled' then
    if dkd_claim.dkd_status<>'approved' or dkd_claim.dkd_server_verified is not true then raise exception 'claim_not_approved'; end if;
  elsif dkd_safe_decision='rejected' then
    if dkd_claim.dkd_status not in ('pending_verification','approved') then raise exception 'claim_not_reviewable'; end if;
  end if;

  update "Last-Mile".dkd_lastmile_reward_claims as dkd_claim_row
  set dkd_status=dkd_safe_decision,
      dkd_reviewed_by=$1,
      dkd_reviewed_at=now(),
      dkd_review_note=dkd_safe_note,
      dkd_updated_at=now()
  where dkd_claim_row.dkd_id=$2
  returning * into dkd_claim;

  insert into "Last-Mile".dkd_lastmile_admin_audit(dkd_admin_user_id,dkd_action,dkd_payload)
  values($1,'dkd_reward_claim_reviewed',jsonb_build_object(
    'dkd_claim_id',$2,
    'dkd_decision',dkd_safe_decision,
    'dkd_note',dkd_safe_note,
    'dkd_server_verified',dkd_claim.dkd_server_verified,
    'dkd_server_score',dkd_claim.dkd_server_score
  ));

  return to_jsonb(dkd_claim);
end;
$$;

create or replace function "Last-Mile".dkd_lastmile_guard_reward_stock()
returns trigger
language plpgsql
security definer
set search_path=''
as $$
declare
  dkd_quantity integer := 0;
  dkd_used integer := 0;
begin
  if new.dkd_status not in ('approved','fulfilled') then return new; end if;
  if new.dkd_server_verified is not true then raise exception 'reward_server_verification_required'; end if;

  select dkd_reward.dkd_quantity into dkd_quantity
  from "Last-Mile".dkd_lastmile_season_rewards as dkd_reward
  where dkd_reward.dkd_id=new.dkd_reward_id;

  select count(*) into dkd_used
  from "Last-Mile".dkd_lastmile_reward_claims as dkd_claim
  where dkd_claim.dkd_reward_id=new.dkd_reward_id
    and dkd_claim.dkd_status in ('approved','fulfilled')
    and dkd_claim.dkd_id<>new.dkd_id;

  if dkd_used >= coalesce(dkd_quantity,0) then raise exception 'reward_stock_exhausted'; end if;
  return new;
end;
$$;

update "Last-Mile".dkd_lastmile_system_config
set dkd_value = dkd_value || jsonb_build_object(
      'server_authority',true,
      'server_authority_version',1,
      'server_reward_verification',true,
      'manual_reward_review',true
    ),
    dkd_updated_at=now()
where dkd_key='dkd_features';

update "Last-Mile".dkd_lastmile_system_config
set dkd_value = dkd_value || jsonb_build_object(
      'verification_required',true,
      'server_verified_jobs_required',100,
      'server_verified_storm_jobs_required',10,
      'manual_review_required',true
    ),
    dkd_updated_at=now()
where dkd_key='dkd_live_season';

-- Lock all Last-Mile RPC/trigger execution back to service_role only.
revoke all on function public.dkd_lastmile_bootstrap(uuid) from public, anon, authenticated;
revoke all on function public.dkd_lastmile_claim_job(uuid,integer) from public, anon, authenticated;
revoke all on function public.dkd_lastmile_accept_job(uuid,uuid) from public, anon, authenticated;
revoke all on function public.dkd_lastmile_complete_job(uuid,uuid,jsonb) from public, anon, authenticated;
revoke all on function public.dkd_lastmile_save_progress(uuid,jsonb,integer,bigint,bigint,integer) from public, anon, authenticated;
revoke all on function public.dkd_lastmile_submit_reward_claim(uuid,text,bigint) from public, anon, authenticated;
revoke all on function public.dkd_lastmile_reward_queue(uuid) from public, anon, authenticated;
revoke all on function public.dkd_lastmile_review_reward_claim(uuid,uuid,text,text) from public, anon, authenticated;
revoke all on function "Last-Mile".dkd_lastmile_guard_reward_stock() from public, anon, authenticated;

grant execute on function public.dkd_lastmile_bootstrap(uuid) to service_role;
grant execute on function public.dkd_lastmile_claim_job(uuid,integer) to service_role;
grant execute on function public.dkd_lastmile_accept_job(uuid,uuid) to service_role;
grant execute on function public.dkd_lastmile_complete_job(uuid,uuid,jsonb) to service_role;
grant execute on function public.dkd_lastmile_save_progress(uuid,jsonb,integer,bigint,bigint,integer) to service_role;
grant execute on function public.dkd_lastmile_submit_reward_claim(uuid,text,bigint) to service_role;
grant execute on function public.dkd_lastmile_reward_queue(uuid) to service_role;
grant execute on function public.dkd_lastmile_review_reward_claim(uuid,uuid,text,text) to service_role;
grant execute on function "Last-Mile".dkd_lastmile_guard_reward_stock() to service_role;

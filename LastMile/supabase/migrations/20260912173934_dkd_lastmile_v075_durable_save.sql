-- DraBornGo / Last Mile v0.7.5
-- Durable cross-device save, append-only event journal, device sessions and season order totals.
-- This source mirrors the migration already applied to Supabase project guuwomvszlwhkmstewfl.

create table if not exists "Last-Mile".dkd_lastmile_game_saves (
  dkd_user_id uuid primary key references auth.users(id) on delete cascade,
  dkd_schema_version integer not null default 2 check (dkd_schema_version >= 2),
  dkd_revision bigint not null default 0 check (dkd_revision >= 0),
  dkd_game_state jsonb not null default '{}'::jsonb,
  dkd_platform text not null default 'unknown',
  dkd_app_version text not null default '0.7.5',
  dkd_device_id text,
  dkd_last_client_event_id text,
  dkd_created_at timestamptz not null default now(),
  dkd_updated_at timestamptz not null default now()
);

create table if not exists "Last-Mile".dkd_lastmile_game_events (
  dkd_id bigint generated always as identity primary key,
  dkd_user_id uuid not null references auth.users(id) on delete cascade,
  dkd_client_event_id text not null,
  dkd_session_id text,
  dkd_event_type text not null,
  dkd_payload jsonb not null default '{}'::jsonb,
  dkd_platform text not null default 'unknown',
  dkd_app_version text not null default '0.7.5',
  dkd_device_id text,
  dkd_occurred_at timestamptz not null default now(),
  dkd_created_at timestamptz not null default now(),
  constraint dkd_lastmile_game_events_user_event_key unique (dkd_user_id, dkd_client_event_id),
  constraint dkd_lastmile_game_events_client_check check (char_length(dkd_client_event_id) between 8 and 160),
  constraint dkd_lastmile_game_events_type_check check (char_length(dkd_event_type) between 2 and 80)
);

create table if not exists "Last-Mile".dkd_lastmile_device_sessions (
  dkd_user_id uuid not null references auth.users(id) on delete cascade,
  dkd_device_id text not null,
  dkd_platform text not null default 'unknown',
  dkd_app_version text not null default '0.7.5',
  dkd_session_id text,
  dkd_first_seen_at timestamptz not null default now(),
  dkd_last_seen_at timestamptz not null default now(),
  dkd_last_revision bigint not null default 0,
  primary key (dkd_user_id, dkd_device_id)
);

create table if not exists "Last-Mile".dkd_lastmile_season_order_stats (
  dkd_user_id uuid not null references auth.users(id) on delete cascade,
  dkd_season_id text not null references "Last-Mile".dkd_lastmile_seasons(dkd_id) on delete cascade,
  dkd_season_starts_at timestamptz not null,
  dkd_season_ends_at timestamptz not null,
  dkd_total_orders bigint not null default 0 check (dkd_total_orders >= 0),
  dkd_first_order_at timestamptz,
  dkd_last_order_at timestamptz,
  dkd_updated_at timestamptz not null default now(),
  primary key (dkd_user_id, dkd_season_id)
);

create index if not exists dkd_lastmile_game_events_user_created_idx on "Last-Mile".dkd_lastmile_game_events(dkd_user_id, dkd_created_at desc);
create index if not exists dkd_lastmile_game_events_type_created_idx on "Last-Mile".dkd_lastmile_game_events(dkd_event_type, dkd_created_at desc);
create index if not exists dkd_lastmile_season_order_stats_season_idx on "Last-Mile".dkd_lastmile_season_order_stats(dkd_season_id, dkd_total_orders desc);

alter table "Last-Mile".dkd_lastmile_game_saves enable row level security;
alter table "Last-Mile".dkd_lastmile_game_events enable row level security;
alter table "Last-Mile".dkd_lastmile_device_sessions enable row level security;
alter table "Last-Mile".dkd_lastmile_season_order_stats enable row level security;

revoke all on "Last-Mile".dkd_lastmile_game_saves from anon, authenticated;
revoke all on "Last-Mile".dkd_lastmile_game_events from anon, authenticated;
revoke all on "Last-Mile".dkd_lastmile_device_sessions from anon, authenticated;
revoke all on "Last-Mile".dkd_lastmile_season_order_stats from anon, authenticated;
grant all on "Last-Mile".dkd_lastmile_game_saves to service_role;
grant all on "Last-Mile".dkd_lastmile_game_events to service_role;
grant all on "Last-Mile".dkd_lastmile_device_sessions to service_role;
grant all on "Last-Mile".dkd_lastmile_season_order_stats to service_role;

create or replace function public.dkd_lastmile_sync_save(
  dkd_user_id uuid,
  dkd_client_event_id text,
  dkd_session_id text,
  dkd_game_state jsonb,
  dkd_platform text default 'unknown',
  dkd_app_version text default '0.7.5',
  dkd_device_id text default null,
  dkd_occurred_at timestamptz default now()
) returns jsonb
language plpgsql security definer set search_path=''
as $$
declare
  dkd_state jsonb := coalesce($4,'{}'::jsonb);
  dkd_event_row_id bigint;
  dkd_revision_value bigint := 0;
  dkd_admin boolean := false;
  dkd_plate text := null;
  dkd_latest_score jsonb := null;
  dkd_active_season "Last-Mile".dkd_lastmile_seasons%rowtype;
  dkd_reward_id text := null;
  dkd_score_value bigint := 0;
begin
  if $1 is null or not "Last-Mile".dkd_lastmile_is_active($1) then raise exception 'dkd_user_not_active'; end if;
  if $2 is null or char_length($2) < 8 then raise exception 'dkd_client_event_id_required'; end if;
  if jsonb_typeof(dkd_state) <> 'object' then raise exception 'dkd_game_state_invalid'; end if;

  insert into "Last-Mile".dkd_lastmile_game_events(dkd_user_id,dkd_client_event_id,dkd_session_id,dkd_event_type,dkd_payload,dkd_platform,dkd_app_version,dkd_device_id,dkd_occurred_at)
  values($1,left($2,160),left($3,160),'state_saved',jsonb_build_object('dkd_deliveries',greatest(0,coalesce((dkd_state->>'dkd_deliveries')::bigint,0)),'dkd_wallet',greatest(0,coalesce((dkd_state->>'dkd_wallet')::bigint,0)),'dkd_xp',greatest(0,coalesce((dkd_state->>'dkd_xp')::bigint,0))),left(coalesce(nullif($5,''),'unknown'),40),left(coalesce(nullif($6,''),'0.7.5'),40),left($7,160),coalesce($8,now()))
  on conflict on constraint dkd_lastmile_game_events_user_event_key do nothing returning dkd_id into dkd_event_row_id;

  if dkd_event_row_id is null then
    select dkd_save.dkd_revision into dkd_revision_value from "Last-Mile".dkd_lastmile_game_saves dkd_save where dkd_save.dkd_user_id=$1;
    return jsonb_build_object('dkd_ok',true,'dkd_duplicate',true,'dkd_revision',coalesce(dkd_revision_value,0),'dkd_synced_at',now());
  end if;

  dkd_admin := "Last-Mile".dkd_lastmile_is_admin($1);
  dkd_plate := upper(regexp_replace(trim(coalesce(nullif(dkd_state #>> '{dkd_profile,dkd_plate}',''),nullif(dkd_state #>> '{dkd_brand,dkd_plate}',''))),'\s+',' ','g'));
  if dkd_plate !~ '^[0-9]{2} [A-ZÇĞİÖŞÜ]{1,3} [0-9]{2,4}$' then dkd_plate:=null; end if;
  if dkd_plate is not null then update "Last-Mile".dkd_lastmile_profiles dkd_profile set dkd_plate_no=dkd_plate,dkd_updated_at=now() where dkd_profile.dkd_user_id=$1; end if;

  if dkd_admin then
    dkd_state:=jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(dkd_state,'{dkd_wallet}','99999999'::jsonb,true),'{dkd_tokens}','99999999'::jsonb,true),'{dkd_vipTrust}','100'::jsonb,true),'{dkd_adminAllCities}','true'::jsonb,true),'{dkd_xp}','384160'::jsonb,true);
  end if;

  insert into "Last-Mile".dkd_lastmile_game_saves(dkd_user_id,dkd_schema_version,dkd_revision,dkd_game_state,dkd_platform,dkd_app_version,dkd_device_id,dkd_last_client_event_id,dkd_created_at,dkd_updated_at)
  values($1,2,1,dkd_state,left(coalesce(nullif($5,''),'unknown'),40),left(coalesce(nullif($6,''),'0.7.5'),40),left($7,160),left($2,160),now(),now())
  on conflict on constraint dkd_lastmile_game_saves_pkey do update set dkd_schema_version=2,dkd_revision="Last-Mile".dkd_lastmile_game_saves.dkd_revision+1,dkd_game_state=excluded.dkd_game_state,dkd_platform=excluded.dkd_platform,dkd_app_version=excluded.dkd_app_version,dkd_device_id=excluded.dkd_device_id,dkd_last_client_event_id=excluded.dkd_last_client_event_id,dkd_updated_at=now()
  returning "Last-Mile".dkd_lastmile_game_saves.dkd_revision into dkd_revision_value;

  if nullif($7,'') is not null then
    insert into "Last-Mile".dkd_lastmile_device_sessions(dkd_user_id,dkd_device_id,dkd_platform,dkd_app_version,dkd_session_id,dkd_first_seen_at,dkd_last_seen_at,dkd_last_revision)
    values($1,left($7,160),left(coalesce(nullif($5,''),'unknown'),40),left(coalesce(nullif($6,''),'0.7.5'),40),left($3,160),now(),now(),dkd_revision_value)
    on conflict on constraint dkd_lastmile_device_sessions_pkey do update set dkd_platform=excluded.dkd_platform,dkd_app_version=excluded.dkd_app_version,dkd_session_id=excluded.dkd_session_id,dkd_last_seen_at=now(),dkd_last_revision=excluded.dkd_last_revision;
  end if;

  if jsonb_typeof(dkd_state->'dkd_scores')='array' and jsonb_array_length(dkd_state->'dkd_scores')>0 then dkd_latest_score:=dkd_state->'dkd_scores'->(jsonb_array_length(dkd_state->'dkd_scores')-1); end if;
  if dkd_latest_score is not null and coalesce(dkd_latest_score->>'dkd_audit','')='LOCAL_CHECK_PASSED' and coalesce((dkd_latest_score->>'dkd_training')::boolean,false)=false then
    select dkd_season_row.* into dkd_active_season from "Last-Mile".dkd_lastmile_seasons dkd_season_row where dkd_season_row.dkd_is_active and now() between dkd_season_row.dkd_starts_at and dkd_season_row.dkd_ends_at order by dkd_season_row.dkd_number limit 1;
    if dkd_active_season.dkd_id is not null and coalesce(dkd_latest_score->>'dkd_season','')=dkd_active_season.dkd_id then
      dkd_score_value:=greatest(0,least(100000,coalesce((dkd_latest_score->>'dkd_score')::bigint,0)));
      select dkd_reward_row.dkd_id into dkd_reward_id from "Last-Mile".dkd_lastmile_season_rewards dkd_reward_row where dkd_reward_row.dkd_season_id=dkd_active_season.dkd_id and dkd_reward_row.dkd_slot_id=coalesce(dkd_latest_score->>'dkd_prize','') and dkd_reward_row.dkd_is_active limit 1;
      if dkd_reward_id is not null and dkd_score_value>0 then
        insert into "Last-Mile".dkd_lastmile_reward_claims(dkd_user_id,dkd_season_id,dkd_reward_id,dkd_final_score,dkd_status,dkd_eligibility_snapshot)
        values($1,dkd_active_season.dkd_id,dkd_reward_id,dkd_score_value,'pending_verification',jsonb_build_object('source','authenticated_cloud_save_v075','local_audit','LOCAL_CHECK_PASSED','save_revision',dkd_revision_value,'submitted_at',now(),'reward_mode','skill_competition'))
        on conflict on constraint dkd_lastmile_reward_claims_dkd_user_id_dkd_season_id_key do update set dkd_reward_id=excluded.dkd_reward_id,dkd_final_score=greatest("Last-Mile".dkd_lastmile_reward_claims.dkd_final_score,excluded.dkd_final_score),dkd_status=case when "Last-Mile".dkd_lastmile_reward_claims.dkd_status in ('approved','fulfilled') then "Last-Mile".dkd_lastmile_reward_claims.dkd_status else 'pending_verification' end,dkd_eligibility_snapshot=excluded.dkd_eligibility_snapshot,dkd_updated_at=now();
      end if;
    end if;
  end if;

  return jsonb_build_object('dkd_ok',true,'dkd_duplicate',false,'dkd_revision',dkd_revision_value,'dkd_synced_at',now());
end;
$$;

create or replace function public.dkd_lastmile_log_event(
  dkd_user_id uuid,
  dkd_client_event_id text,
  dkd_session_id text,
  dkd_event_type text,
  dkd_payload jsonb default '{}'::jsonb,
  dkd_platform text default 'unknown',
  dkd_app_version text default '0.7.5',
  dkd_device_id text default null,
  dkd_occurred_at timestamptz default now()
) returns jsonb
language plpgsql security definer set search_path=''
as $$
declare
  dkd_event_row_id bigint;
  dkd_event_at timestamptz:=coalesce($9,now());
  dkd_season "Last-Mile".dkd_lastmile_seasons%rowtype;
  dkd_count integer:=1;
  dkd_total bigint:=0;
  dkd_revision_value bigint:=0;
begin
  if $1 is null or not "Last-Mile".dkd_lastmile_is_active($1) then raise exception 'dkd_user_not_active'; end if;
  if $2 is null or char_length($2)<8 then raise exception 'dkd_client_event_id_required'; end if;
  if $4 is null or char_length($4)<2 then raise exception 'dkd_event_type_required'; end if;

  insert into "Last-Mile".dkd_lastmile_game_events(dkd_user_id,dkd_client_event_id,dkd_session_id,dkd_event_type,dkd_payload,dkd_platform,dkd_app_version,dkd_device_id,dkd_occurred_at)
  values($1,left($2,160),left($3,160),left($4,80),coalesce($5,'{}'::jsonb),left(coalesce(nullif($6,''),'unknown'),40),left(coalesce(nullif($7,''),'0.7.5'),40),left($8,160),dkd_event_at)
  on conflict on constraint dkd_lastmile_game_events_user_event_key do nothing returning dkd_id into dkd_event_row_id;

  select coalesce(dkd_save.dkd_revision,0) into dkd_revision_value from "Last-Mile".dkd_lastmile_game_saves dkd_save where dkd_save.dkd_user_id=$1;
  if dkd_event_row_id is null then return jsonb_build_object('dkd_ok',true,'dkd_duplicate',true,'dkd_revision',coalesce(dkd_revision_value,0),'dkd_synced_at',now()); end if;

  if nullif($8,'') is not null then
    insert into "Last-Mile".dkd_lastmile_device_sessions(dkd_user_id,dkd_device_id,dkd_platform,dkd_app_version,dkd_session_id,dkd_first_seen_at,dkd_last_seen_at,dkd_last_revision)
    values($1,left($8,160),left(coalesce(nullif($6,''),'unknown'),40),left(coalesce(nullif($7,''),'0.7.5'),40),left($3,160),now(),now(),coalesce(dkd_revision_value,0))
    on conflict on constraint dkd_lastmile_device_sessions_pkey do update set dkd_platform=excluded.dkd_platform,dkd_app_version=excluded.dkd_app_version,dkd_session_id=excluded.dkd_session_id,dkd_last_seen_at=now(),dkd_last_revision=excluded.dkd_last_revision;
  end if;

  if $4='order_completed' then
    begin dkd_count:=greatest(1,least(50,coalesce(($5->>'dkd_count')::integer,1))); exception when others then dkd_count:=1; end;
    select dkd_season_row.* into dkd_season from "Last-Mile".dkd_lastmile_seasons dkd_season_row where dkd_season_row.dkd_is_active and dkd_event_at between dkd_season_row.dkd_starts_at and dkd_season_row.dkd_ends_at order by dkd_season_row.dkd_number limit 1;
    if dkd_season.dkd_id is not null then
      insert into "Last-Mile".dkd_lastmile_season_order_stats(dkd_user_id,dkd_season_id,dkd_season_starts_at,dkd_season_ends_at,dkd_total_orders,dkd_first_order_at,dkd_last_order_at,dkd_updated_at)
      values($1,dkd_season.dkd_id,dkd_season.dkd_starts_at,dkd_season.dkd_ends_at,dkd_count,dkd_event_at,dkd_event_at,now())
      on conflict on constraint dkd_lastmile_season_order_stats_pkey do update set dkd_total_orders="Last-Mile".dkd_lastmile_season_order_stats.dkd_total_orders+excluded.dkd_total_orders,dkd_first_order_at=least(coalesce("Last-Mile".dkd_lastmile_season_order_stats.dkd_first_order_at,excluded.dkd_first_order_at),excluded.dkd_first_order_at),dkd_last_order_at=greatest(coalesce("Last-Mile".dkd_lastmile_season_order_stats.dkd_last_order_at,excluded.dkd_last_order_at),excluded.dkd_last_order_at),dkd_updated_at=now()
      returning "Last-Mile".dkd_lastmile_season_order_stats.dkd_total_orders into dkd_total;
    end if;
  end if;

  return jsonb_build_object('dkd_ok',true,'dkd_duplicate',false,'dkd_revision',coalesce(dkd_revision_value,0),'dkd_season_id',dkd_season.dkd_id,'dkd_season_total_orders',coalesce(dkd_total,0),'dkd_synced_at',now());
end;
$$;

revoke all on function public.dkd_lastmile_sync_save(uuid,text,text,jsonb,text,text,text,timestamptz) from public, anon, authenticated;
revoke all on function public.dkd_lastmile_log_event(uuid,text,text,text,jsonb,text,text,text,timestamptz) from public, anon, authenticated;
grant execute on function public.dkd_lastmile_sync_save(uuid,text,text,jsonb,text,text,text,timestamptz) to service_role;
grant execute on function public.dkd_lastmile_log_event(uuid,text,text,text,jsonb,text,text,text,timestamptz) to service_role;

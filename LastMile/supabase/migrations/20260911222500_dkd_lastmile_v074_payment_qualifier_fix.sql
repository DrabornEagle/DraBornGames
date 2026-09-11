-- Fix PL/pgSQL parameter/column ambiguity found by live v0.7.4 bootstrap test.
create or replace function public.dkd_lastmile_payment_bootstrap(dkd_user_id uuid)
returns jsonb language plpgsql security definer set search_path to '' as $$
declare dkd_is_admin boolean:=false; dkd_current_season_id text; dkd_payment jsonb;
begin
 select coalesce(dkd_profile.dkd_role='admin',false) into dkd_is_admin from "Last-Mile".dkd_lastmile_profiles dkd_profile where dkd_profile.dkd_user_id=$1 and dkd_profile.dkd_is_active=true;
 select dkd_season.dkd_id into dkd_current_season_id from "Last-Mile".dkd_lastmile_seasons dkd_season where dkd_season.dkd_is_active and now() between dkd_season.dkd_starts_at and dkd_season.dkd_ends_at order by dkd_season.dkd_number limit 1;
 select to_jsonb(dkd_row) into dkd_payment from (select dkd_pay.dkd_id,dkd_pay.dkd_season_id,dkd_pay.dkd_option_id,dkd_pay.dkd_amount,dkd_pay.dkd_currency,dkd_pay.dkd_note,dkd_pay.dkd_status,dkd_pay.dkd_submitted_at,dkd_pay.dkd_reviewed_at,dkd_pay.dkd_review_note from "Last-Mile".dkd_lastmile_season_payments dkd_pay where dkd_pay.dkd_user_id=$1 and dkd_pay.dkd_season_id=dkd_current_season_id order by dkd_pay.dkd_submitted_at desc limit 1) dkd_row;
 return jsonb_build_object('dkd_enforced',not dkd_is_admin,'dkd_is_admin',dkd_is_admin,'dkd_current_season_id',dkd_current_season_id,'dkd_payment',dkd_payment,
 'dkd_accounts',coalesce((select jsonb_agg(to_jsonb(dkd_account) order by dkd_account.dkd_sort) from "Last-Mile".dkd_lastmile_payment_accounts dkd_account where dkd_account.dkd_is_active),'[]'::jsonb),
 'dkd_options',coalesce((select jsonb_agg(to_jsonb(dkd_option) order by dkd_option.dkd_sort) from "Last-Mile".dkd_lastmile_season_payment_options dkd_option where dkd_option.dkd_is_active),'[]'::jsonb),
 'dkd_seasons',coalesce((select jsonb_agg(to_jsonb(dkd_season) order by dkd_season.dkd_number) from "Last-Mile".dkd_lastmile_seasons dkd_season where dkd_season.dkd_is_active),'[]'::jsonb));
end $$;

create or replace function public.dkd_lastmile_payment_submit_data(dkd_user_id uuid,dkd_option_id text,dkd_receipt_data text,dkd_note text) returns jsonb language plpgsql security definer set search_path to '' as $$
declare dkd_option_row "Last-Mile".dkd_lastmile_season_payment_options%rowtype; dkd_payment_row "Last-Mile".dkd_lastmile_season_payments%rowtype;
begin
 if length(coalesce($3,''))>4200000 or coalesce($3,'')!~'^data:image/(jpeg|png|webp);base64,' then raise exception 'receipt_invalid_or_too_large'; end if;
 select * into dkd_option_row from "Last-Mile".dkd_lastmile_season_payment_options dkd_option where dkd_option.dkd_id=$2 and dkd_option.dkd_is_active=true;
 if dkd_option_row.dkd_id is null then raise exception 'payment_option_not_found'; end if;
 if not exists(select 1 from "Last-Mile".dkd_lastmile_seasons dkd_season where dkd_season.dkd_id=dkd_option_row.dkd_season_id and dkd_season.dkd_is_active and now() between dkd_season.dkd_starts_at and dkd_season.dkd_ends_at) then raise exception 'season_not_current'; end if;
 if exists(select 1 from "Last-Mile".dkd_lastmile_season_payments dkd_pay where dkd_pay.dkd_user_id=$1 and dkd_pay.dkd_season_id=dkd_option_row.dkd_season_id and dkd_pay.dkd_status in('pending','approved')) then raise exception 'payment_already_submitted'; end if;
 insert into "Last-Mile".dkd_lastmile_season_payments(dkd_user_id,dkd_season_id,dkd_option_id,dkd_amount,dkd_currency,dkd_receipt_data,dkd_note) values($1,dkd_option_row.dkd_season_id,dkd_option_row.dkd_id,dkd_option_row.dkd_amount,dkd_option_row.dkd_currency,left($3,4200000),left(coalesce($4,''),1000)) returning * into dkd_payment_row;
 return to_jsonb(dkd_payment_row)-'dkd_receipt_data';
end $$;

-- LastMile v0.7.4: repair receipt submit discovered by live Web/Android flow.
-- Production table existed before the v0.7.4 CREATE TABLE and therefore did not inherit
-- the intended receipt_path default. Keep the insert explicit as well, so retries are safe.
alter table "Last-Mile".dkd_lastmile_season_payments
  alter column dkd_receipt_path set default 'database://receipt';

create or replace function public.dkd_lastmile_payment_submit_data(
  dkd_user_id uuid,
  dkd_option_id text,
  dkd_receipt_data text,
  dkd_note text
) returns jsonb
language plpgsql security definer set search_path to '' as $$
declare
  dkd_option_row "Last-Mile".dkd_lastmile_season_payment_options%rowtype;
  dkd_existing_row "Last-Mile".dkd_lastmile_season_payments%rowtype;
  dkd_payment_row "Last-Mile".dkd_lastmile_season_payments%rowtype;
begin
  select * into dkd_option_row
    from "Last-Mile".dkd_lastmile_season_payment_options dkd_option
   where dkd_option.dkd_id=$2 and dkd_option.dkd_is_active=true;
  if dkd_option_row.dkd_id is null then raise exception 'payment_option_not_found'; end if;

  if not exists(
    select 1 from "Last-Mile".dkd_lastmile_seasons dkd_season
     where dkd_season.dkd_id=dkd_option_row.dkd_season_id
       and dkd_season.dkd_is_active
       and now() between dkd_season.dkd_starts_at and dkd_season.dkd_ends_at
  ) then raise exception 'season_not_current'; end if;

  select * into dkd_existing_row
    from "Last-Mile".dkd_lastmile_season_payments dkd_pay
   where dkd_pay.dkd_user_id=$1
     and dkd_pay.dkd_season_id=dkd_option_row.dkd_season_id
     and dkd_pay.dkd_status in ('pending','approved')
   order by dkd_pay.dkd_submitted_at desc
   limit 1;
  if dkd_existing_row.dkd_id is not null then
    return to_jsonb(dkd_existing_row)-'dkd_receipt_data';
  end if;

  if length(coalesce($3,''))>4200000
     or coalesce($3,'')!~'^data:image/(jpeg|png|webp);base64,'
  then raise exception 'receipt_invalid_or_too_large'; end if;

  insert into "Last-Mile".dkd_lastmile_season_payments(
    dkd_user_id,dkd_season_id,dkd_option_id,dkd_amount,dkd_currency,
    dkd_receipt_path,dkd_receipt_data,dkd_note
  ) values(
    $1,dkd_option_row.dkd_season_id,dkd_option_row.dkd_id,
    dkd_option_row.dkd_amount,dkd_option_row.dkd_currency,
    'database://receipt',left($3,4200000),left(coalesce($4,''),1000)
  ) returning * into dkd_payment_row;

  return to_jsonb(dkd_payment_row)-'dkd_receipt_data';
end $$;

revoke all on function public.dkd_lastmile_payment_submit_data(uuid,text,text,text) from public,anon,authenticated;
grant execute on function public.dkd_lastmile_payment_submit_data(uuid,text,text,text) to service_role;

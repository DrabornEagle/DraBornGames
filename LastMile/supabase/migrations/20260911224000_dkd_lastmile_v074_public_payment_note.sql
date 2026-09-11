-- LastMile v0.7.4: admin-managed public note shown below IBAN details.
alter table "Last-Mile".dkd_lastmile_payment_accounts
  add column if not exists dkd_public_note text not null default '';

create or replace function public.dkd_lastmile_admin_payment_account_save(
  dkd_admin_user_id uuid,
  dkd_account_id text,
  dkd_bank_name text,
  dkd_account_holder text,
  dkd_iban text,
  dkd_public_note text
) returns jsonb
language plpgsql security definer set search_path to '' as $$
declare dkd_row "Last-Mile".dkd_lastmile_payment_accounts%rowtype;
begin
  if not exists(
    select 1 from "Last-Mile".dkd_lastmile_profiles
    where dkd_user_id=$1 and dkd_role='admin' and dkd_is_active
  ) then raise exception 'admin_required'; end if;
  update "Last-Mile".dkd_lastmile_payment_accounts
     set dkd_bank_name=left(trim(coalesce($3,'')),80),
         dkd_account_holder=left(trim(coalesce($4,'')),100),
         dkd_iban=left(upper(trim(coalesce($5,''))),40),
         dkd_public_note=left(trim(coalesce($6,'')),600),
         dkd_updated_by=$1,
         dkd_updated_at=now()
   where dkd_id=$2
   returning * into dkd_row;
  if dkd_row.dkd_id is null then raise exception 'payment_account_not_found'; end if;
  return to_jsonb(dkd_row);
end $$;

create or replace function public.dkd_lastmile_complete_job(dkd_user_id uuid,dkd_job_id uuid,dkd_metrics jsonb)
returns jsonb language plpgsql security definer set search_path to '' as $$
declare dkd_action text:=coalesce($3->>'dkd_v074_action','');
begin
  if $2='00000000-0000-0000-0000-000000000974'::uuid then
    if dkd_action='payment_submit' then
      return public.dkd_lastmile_payment_submit_data($1,$3->>'dkd_option_id',$3->>'dkd_receipt_data',$3->>'dkd_note');
    elsif dkd_action='admin_account_save' then
      return public.dkd_lastmile_admin_payment_account_save($1,$3->>'dkd_account_id',$3->>'dkd_bank_name',$3->>'dkd_account_holder',$3->>'dkd_iban',$3->>'dkd_public_note');
    elsif dkd_action='admin_option_save' then
      return public.dkd_lastmile_admin_payment_option_save($1,$3->>'dkd_option_id',greatest(0,coalesce(($3->>'dkd_amount')::numeric,0)),$3->>'dkd_description');
    end if;
    raise exception 'unknown_v074_bridge_action';
  end if;
  return public.dkd_lastmile_complete_job_v073($1,$2,$3);
end $$;

revoke all on function public.dkd_lastmile_admin_payment_account_save(uuid,text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.dkd_lastmile_admin_payment_account_save(uuid,text,text,text,text,text) to service_role;

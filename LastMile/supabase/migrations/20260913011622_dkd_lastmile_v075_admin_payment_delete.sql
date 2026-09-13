-- Last Mile v0.7.5 — admin-only deletion of an incoming season-payment record.
-- Scope is intentionally limited to the "Last-Mile" season payment table.

create or replace function public.dkd_lastmile_admin_payment_delete(dkd_admin_user_id uuid, dkd_payment_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  dkd_deleted_id uuid;
  dkd_deleted_user_id uuid;
  dkd_deleted_season_id text;
begin
  if not exists (
    select 1
    from "Last-Mile".dkd_lastmile_profiles
    where dkd_user_id = $1
      and dkd_role = 'admin'
      and dkd_is_active
  ) then
    raise exception 'admin_required';
  end if;

  delete from "Last-Mile".dkd_lastmile_season_payments
  where dkd_id = $2
  returning dkd_id, dkd_user_id, dkd_season_id
  into dkd_deleted_id, dkd_deleted_user_id, dkd_deleted_season_id;

  if dkd_deleted_id is null then
    raise exception 'payment_not_found';
  end if;

  return jsonb_build_object(
    'dkd_deleted', true,
    'dkd_payment_id', dkd_deleted_id,
    'dkd_user_id', dkd_deleted_user_id,
    'dkd_season_id', dkd_deleted_season_id
  );
end
$function$;

revoke all on function public.dkd_lastmile_admin_payment_delete(uuid, uuid) from public, anon, authenticated;
grant execute on function public.dkd_lastmile_admin_payment_delete(uuid, uuid) to service_role;

create or replace function public.dkd_lastmile_complete_job(dkd_user_id uuid, dkd_job_id uuid, dkd_metrics jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  dkd_action text := coalesce($3->>'dkd_v074_action', '');
begin
  if $2 = '00000000-0000-0000-0000-000000000974'::uuid then
    if dkd_action = 'payment_submit' then
      return public.dkd_lastmile_payment_submit_data($1, $3->>'dkd_option_id', $3->>'dkd_receipt_data', $3->>'dkd_note');
    elsif dkd_action = 'admin_account_save' then
      return public.dkd_lastmile_admin_payment_account_save($1, $3->>'dkd_account_id', $3->>'dkd_bank_name', $3->>'dkd_account_holder', $3->>'dkd_iban', $3->>'dkd_public_note');
    elsif dkd_action = 'admin_option_save' then
      return public.dkd_lastmile_admin_payment_option_save($1, $3->>'dkd_option_id', greatest(0, coalesce(($3->>'dkd_amount')::numeric, 0)), $3->>'dkd_description');
    elsif dkd_action = 'admin_payment_delete' then
      if coalesce($3->>'dkd_payment_id', '') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
        raise exception 'invalid_payment_id';
      end if;
      return public.dkd_lastmile_admin_payment_delete($1, ($3->>'dkd_payment_id')::uuid);
    end if;
    raise exception 'unknown_v074_bridge_action';
  end if;
  return public.dkd_lastmile_complete_job_v073($1, $2, $3);
end
$function$;

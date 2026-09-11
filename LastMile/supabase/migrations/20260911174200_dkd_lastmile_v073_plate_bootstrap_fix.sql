create or replace function public.dkd_lastmile_set_plate(dkd_user_id uuid, dkd_plate_no text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $dkd$
declare
  dkd_normalized text := upper(regexp_replace(trim(coalesce(dkd_plate_no, '')), '\s+', ' ', 'g'));
begin
  if dkd_normalized !~ '^[0-9]{2} [A-ZÇĞİÖŞÜ]{1,3} [0-9]{2,4}$' then
    return false;
  end if;

  update "Last-Mile".dkd_lastmile_profiles
  set dkd_plate_no = dkd_normalized,
      dkd_updated_at = now()
  where dkd_lastmile_profiles.dkd_user_id = dkd_lastmile_set_plate.dkd_user_id;

  return found;
end;
$dkd$;

revoke all on function public.dkd_lastmile_set_plate(uuid, text) from public;
grant execute on function public.dkd_lastmile_set_plate(uuid, text) to service_role;

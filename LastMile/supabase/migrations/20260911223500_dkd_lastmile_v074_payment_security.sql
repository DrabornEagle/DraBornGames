-- Payment data and receipts are server-only. The native client reaches these through the authenticated Edge bridge.
alter table "Last-Mile".dkd_lastmile_payment_accounts enable row level security;
alter table "Last-Mile".dkd_lastmile_season_payment_options enable row level security;
alter table "Last-Mile".dkd_lastmile_season_payments enable row level security;
revoke all on table "Last-Mile".dkd_lastmile_payment_accounts from public,anon,authenticated;
revoke all on table "Last-Mile".dkd_lastmile_season_payment_options from public,anon,authenticated;
revoke all on table "Last-Mile".dkd_lastmile_season_payments from public,anon,authenticated;
grant select,insert,update,delete on table "Last-Mile".dkd_lastmile_payment_accounts to service_role;
grant select,insert,update,delete on table "Last-Mile".dkd_lastmile_season_payment_options to service_role;
grant select,insert,update,delete on table "Last-Mile".dkd_lastmile_season_payments to service_role;

revoke all on function public.dkd_lastmile_bootstrap_v073(uuid) from public,anon,authenticated;
revoke all on function public.dkd_lastmile_claim_job_v073(uuid,integer) from public,anon,authenticated;
revoke all on function public.dkd_lastmile_complete_job_v073(uuid,uuid,jsonb) from public,anon,authenticated;
revoke all on function public.dkd_lastmile_accept_job_v073(uuid,uuid) from public,anon,authenticated;
revoke all on function public.dkd_lastmile_cancel_job_v073(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.dkd_lastmile_bootstrap_v073(uuid),public.dkd_lastmile_claim_job_v073(uuid,integer),public.dkd_lastmile_complete_job_v073(uuid,uuid,jsonb),public.dkd_lastmile_accept_job_v073(uuid,uuid),public.dkd_lastmile_cancel_job_v073(uuid,uuid,text) to service_role;

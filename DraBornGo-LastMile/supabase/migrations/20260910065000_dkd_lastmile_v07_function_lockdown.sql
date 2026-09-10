-- DraBornGo / Last Mile v0.7 defense-in-depth function lockdown.
-- Direct mobile access to the Last-Mile schema is already disabled; these
-- revokes also remove PostgreSQL's default PUBLIC execute privilege from the
-- two trigger functions. Existing triggers continue to use the functions.

revoke execute on function "Last-Mile".dkd_lastmile_guard_reward_stock() from public, anon, authenticated;
revoke execute on function "Last-Mile".dkd_lastmile_touch_updated_at() from public, anon, authenticated;

grant execute on function "Last-Mile".dkd_lastmile_guard_reward_stock() to service_role;
grant execute on function "Last-Mile".dkd_lastmile_touch_updated_at() to service_role;

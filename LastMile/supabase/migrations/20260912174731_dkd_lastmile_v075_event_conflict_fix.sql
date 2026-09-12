-- Live migration mirror for v0.7.5.
-- Production log_event uses the unique (dkd_user_id, dkd_client_event_id) constraint so retries cannot double-count season orders.
select 1;

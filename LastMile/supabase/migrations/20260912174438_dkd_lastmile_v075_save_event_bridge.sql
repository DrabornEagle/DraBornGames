-- Live migration mirror for v0.7.5.
-- save_progress is bridged to dkd_lastmile_sync_save + dkd_lastmile_log_event so existing Android/Web bridge calls use the new durable engine.
select 1;

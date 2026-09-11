-- Cover v0.7.4 payment foreign keys reported by the Supabase performance advisor.
create index if not exists dkd_lastmile_payment_options_season_idx on "Last-Mile".dkd_lastmile_season_payment_options(dkd_season_id);
create index if not exists dkd_lastmile_payment_options_account_idx on "Last-Mile".dkd_lastmile_season_payment_options(dkd_account_id);
create index if not exists dkd_lastmile_season_payments_season_idx on "Last-Mile".dkd_lastmile_season_payments(dkd_season_id);
create index if not exists dkd_lastmile_season_payments_option_idx on "Last-Mile".dkd_lastmile_season_payments(dkd_option_id);

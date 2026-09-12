-- Last Mile v0.7.5 reward label normalization.
-- Scope is intentionally limited to the Last-Mile schema and the Season 01 tablet reward.
update "Last-Mile".dkd_lastmile_season_rewards
set dkd_name = 'Apple iPad PRO',
    dkd_subtitle = 'Sezon 01 Apple iPad PRO ödülü'
where dkd_id = 'dkd_s01_tablet'
  and dkd_season_id = 'dkd_season01'
  and dkd_name = 'Premium Tablet';

-- Live migration mirror for v0.7.5.
-- The production function removes both legacy and v0.7.5 save/event/session/season-stat rows before auth deletion.
-- Final function definition is maintained by the live migration chain and documented in DKD-V075.md.
select 1;

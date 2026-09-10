import dkd_assert from 'node:assert/strict';
import { readFile as dkd_readFile } from 'node:fs/promises';
import { dirname as dkd_dirname, join as dkd_join } from 'node:path';
import { fileURLToPath as dkd_fileURLToPath } from 'node:url';
import dkd_test from 'node:test';

const dkd_root = dkd_join(dkd_dirname(dkd_fileURLToPath(import.meta.url)), '..');
const dkd_edgePath = dkd_join(dkd_root, 'supabase/functions/dkd-last-mile-api/index.ts');
const dkd_migrationPath = dkd_join(dkd_root, 'supabase/migrations/20260910073427_dkd_lastmile_v07_server_authority.sql');

const dkd_readSources = async () => Promise.all([
  dkd_readFile(dkd_edgePath, 'utf8'),
  dkd_readFile(dkd_migrationPath, 'utf8'),
]);

dkd_test('v0.7 görev seviyesi istemciden yetki kaynağı olarak alınmaz', async () => {
  const [dkd_edge, dkd_migration] = await dkd_readSources();
  dkd_assert.doesNotMatch(dkd_edge, /Number\(dkd_body\.dkd_level/);
  dkd_assert.match(dkd_edge, /dkd_lastmile_claim_job[\s\S]*dkd_level:\s*1/);
  dkd_assert.match(dkd_migration, /dkd_mission_source\.dkd_min_level\s*<=\s*dkd_server_level/);
  dkd_assert.match(dkd_migration, /dkd_server_level/);
});

dkd_test('v0.7 istemci kaydı server-authoritative sayaçları ezemez', async () => {
  const [, dkd_migration] = await dkd_readSources();
  dkd_assert.match(dkd_migration, /dkd_server_xp=case when dkd_admin then 384160 else "Last-Mile"\.dkd_lastmile_player_progress\.dkd_server_xp end/);
  dkd_assert.match(dkd_migration, /dkd_server_level=case when dkd_admin then 50 else "Last-Mile"\.dkd_lastmile_player_progress\.dkd_server_level end/);
  dkd_assert.match(dkd_migration, /dkd_server_wallet=case when dkd_admin then 99999999 else "Last-Mile"\.dkd_lastmile_player_progress\.dkd_server_wallet end/);
});

dkd_test('v0.7 görev tamamlama accepted durumunu ve sunucu zamanını zorunlu kılar', async () => {
  const [, dkd_migration] = await dkd_readSources();
  dkd_assert.match(dkd_migration, /dkd_job\.dkd_status<>'accepted'/);
  dkd_assert.match(dkd_migration, /dkd_elapsed:=greatest\(0,floor\(extract\(epoch from \(now\(\)-dkd_job\.dkd_started_at\)\)\)::integer\)/);
  dkd_assert.match(dkd_migration, /dkd_elapsed>=30/);
  dkd_assert.match(dkd_migration, /dkd_implausible_completion/);
});

dkd_test('v0.7 fiziksel ödül sadece doğrulanmış sezon koşullarıyla açılır', async () => {
  const [dkd_edge, dkd_migration] = await dkd_readSources();
  dkd_assert.match(dkd_migration, /dkd_verified_count<100 or dkd_storm_count<10/);
  dkd_assert.match(dkd_migration, /server_final_requirements_not_met/);
  dkd_assert.match(dkd_migration, /manual_review_required/);
  dkd_assert.match(dkd_migration, /dkd_server_score/);
  dkd_assert.match(dkd_edge, /admin_reward_queue/);
  dkd_assert.match(dkd_edge, /review_reward_claim/);
});

dkd_test('v0.7 Last Mile yetkili RPC yüzeyi service_role ile kilitlidir', async () => {
  const [, dkd_migration] = await dkd_readSources();
  for (const dkd_function of [
    'dkd_lastmile_bootstrap',
    'dkd_lastmile_claim_job',
    'dkd_lastmile_accept_job',
    'dkd_lastmile_complete_job',
    'dkd_lastmile_save_progress',
    'dkd_lastmile_submit_reward_claim',
    'dkd_lastmile_reward_queue',
    'dkd_lastmile_review_reward_claim',
  ]) {
    dkd_assert.match(dkd_migration, new RegExp(`revoke all on function public\\.${dkd_function}`));
    dkd_assert.match(dkd_migration, new RegExp(`grant execute on function public\\.${dkd_function}`));
  }
});

import dkd_test from 'node:test';
import dkd_assert from 'node:assert/strict';
import * as dkd_fs from 'node:fs/promises';

const dkd_hotfix = await dkd_fs.readFile(new URL('../game/dkd-v074-gameplay-account-hotfix.mjs', import.meta.url), 'utf8');
const dkd_builder = await dkd_fs.readFile(new URL('../scripts/dkd-build-game-v07.mjs', import.meta.url), 'utf8');

dkd_test('v0.7.4 shared bundle loads gameplay/account hotfix last', () => {
  dkd_assert.match(dkd_builder, /dkd-v074-login-payment-notice-fix\.mjs','dkd-v074-gameplay-account-hotfix\.mjs/);
  dkd_assert.match(dkd_hotfix, /dkd_monotonicFinalProgress: true/);
  dkd_assert.match(dkd_hotfix, /dkd_driveUtilityIconsReduced: true/);
  dkd_assert.match(dkd_hotfix, /dkd_obstacleCollisionTightened: true/);
});

dkd_test('Final progress is count based and reputation remains a separate gate', () => {
  dkd_assert.match(dkd_hotfix, /dkd_master.*\/ 100/);
  dkd_assert.match(dkd_hotfix, /dkd_chapter.*\/ 6/);
  dkd_assert.match(dkd_hotfix, /dkd_storm.*\/ 10/);
  dkd_assert.match(dkd_hotfix, /dkd_reputationSeparateFinalGate: true/);
  dkd_assert.match(dkd_hotfix, /İtibar \$\{dkd_reputationValue\}\/90/);
});

dkd_test('collision requires the tightened visible obstacle footprint', () => {
  dkd_assert.match(dkd_hotfix, /dkd_v05DriveFixObstacleContact = function/);
  dkd_assert.match(dkd_hotfix, /dkd_obstacleHalfWidth/);
  dkd_assert.match(dkd_hotfix, /dkd_bikeHalfWidth = \.27/);
  dkd_assert.match(dkd_hotfix, /dkd_bikeHalfLength = \.54/);
});

dkd_test('account progress is backed up and cloud save is requested before logout', () => {
  dkd_assert.match(dkd_hotfix, /dkd_lastmile_account_backup_v074_/);
  dkd_assert.match(dkd_hotfix, /dkd_cloud\.dkd_progress = dkd_backup/);
  dkd_assert.match(dkd_hotfix, /dkd_send\('cloud-save'/);
  dkd_assert.match(dkd_hotfix, /İlerleme kaydediliyor/);
});

dkd_test('ACELE ET popup is new-registration only, durable, and excluded from admin', () => {
  dkd_assert.match(dkd_hotfix, /auth-signup-result/);
  dkd_assert.match(dkd_hotfix, /dkd_lastmile_new_registration_notice_pending_v074_/);
  dkd_assert.match(dkd_hotfix, /dkd_lastmile_new_registration_notice_seen_v074_/);
  dkd_assert.match(dkd_hotfix, /dkd_v074IsAdmin/);
  dkd_assert.match(dkd_hotfix, /localStorage\.setItem\(dkd_seenKey, '1'\)/);
  dkd_assert.match(dkd_hotfix, /dkd_rewardNoticeNewRegistrationOnly: true/);
  dkd_assert.match(dkd_hotfix, /dkd_rewardNoticeNeverForAdmin: true/);
  dkd_assert.match(dkd_hotfix, /dkd_rewardNoticeOncePerAccount: true/);
});

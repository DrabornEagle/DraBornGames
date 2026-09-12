// DraBornGo / Last Mile v0.7.4 — cross-device progress and progress-display repair.
// Loaded after all v0.7.4 UI patches so one canonical Final percentage is used everywhere.

const dkd_v074AccountSyncPrevious = {
  dkd_save: dkd_Game.prototype.dkd_save,
  dkd_receive: dkd_Game.prototype.dkd_receive,
};

function dkd_v074AccountSyncStateRank(dkd_state) {
  if (!dkd_state || dkd_state.dkd_schema !== 1) return null;
  return [
    Math.max(0, Number(dkd_state.dkd_deliveries) || 0),
    Math.max(0, Number(dkd_state.dkd_master) || 0),
    Math.max(0, Number(dkd_state.dkd_chapter) || 0),
    Math.max(0, Number(dkd_state.dkd_storm) || 0),
    Math.max(0, Number(dkd_state.dkd_xp) || 0),
    Array.isArray(dkd_state.dkd_completedRuns) ? dkd_state.dkd_completedRuns.length : 0,
  ];
}

function dkd_v074AccountSyncIsAhead(dkd_candidate, dkd_reference) {
  const dkd_candidateRank = dkd_v074AccountSyncStateRank(dkd_candidate);
  const dkd_referenceRank = dkd_v074AccountSyncStateRank(dkd_reference);
  if (!dkd_candidateRank) return false;
  if (!dkd_referenceRank) return true;
  for (let dkd_index = 0; dkd_index < dkd_candidateRank.length; dkd_index++) {
    if (dkd_candidateRank[dkd_index] === dkd_referenceRank[dkd_index]) continue;
    return dkd_candidateRank[dkd_index] > dkd_referenceRank[dkd_index];
  }
  return false;
}

function dkd_v074AccountSyncCloudObject(dkd_payload) {
  const dkd_response = dkd_payload?.dkd_data || {};
  return dkd_response?.dkd_data || dkd_response;
}

function dkd_v074AccountSyncBestLocal(dkd_game, dkd_email) {
  const dkd_candidates = [];
  if (dkd_game?.dkd_career?.dkd_schema === 1 && dkd_game.dkd_career.dkd_profile) {
    dkd_candidates.push(dkd_game.dkd_career);
  }
  if (typeof dkd_v074GameplayReadBackup === 'function') {
    const dkd_backup = dkd_v074GameplayReadBackup(dkd_email);
    if (dkd_backup?.dkd_schema === 1) dkd_candidates.push(dkd_backup);
  }
  return dkd_candidates.reduce(
    (dkd_best, dkd_candidate) => dkd_v074AccountSyncIsAhead(dkd_candidate, dkd_best) ? dkd_candidate : dkd_best,
    null,
  );
}

// The base progress bars and Reward Vault already use dkd_progress(). Make the home and
// delivery-result percentages use that exact same canonical formula instead of a second one.
if (typeof dkd_v074GameplayFinalProgress === 'function') {
  dkd_v074GameplayFinalProgress = function dkd_v074AccountSyncFinalProgress(dkd_state) {
    return dkd_progress(dkd_state);
  };
}

dkd_Game.prototype.dkd_receive = function dkd_v074AccountSyncReceive(dkd_payload) {
  let dkd_recoveredLocalProgress = false;
  if (dkd_payload?.dkd_type === 'cloud-bootstrap') {
    const dkd_cloud = dkd_v074AccountSyncCloudObject(dkd_payload);
    const dkd_email = typeof dkd_v074GameplayEmail === 'function'
      ? dkd_v074GameplayEmail(this, dkd_cloud?.dkd_profile?.dkd_email)
      : String(dkd_cloud?.dkd_profile?.dkd_email || '').trim().toLocaleLowerCase('tr-TR');
    const dkd_local = dkd_v074AccountSyncBestLocal(this, dkd_email);
    const dkd_server = dkd_cloud?.dkd_progress;
    if (dkd_local && dkd_v074AccountSyncIsAhead(dkd_local, dkd_server)) {
      dkd_cloud.dkd_progress = dkd_local;
      dkd_recoveredLocalProgress = true;
    }
  }

  const dkd_result = dkd_v074AccountSyncPrevious.dkd_receive.call(this, dkd_payload);
  if (dkd_recoveredLocalProgress && this.dkd_v04Authenticated && this.dkd_v04CloudReady) {
    this.dkd_save();
  }
  return dkd_result;
};

// An authenticated career save is account data, not browser data. Keep the existing local
// backup, but cancel the old 650 ms debounce and hand the newest state to the cloud bridge
// immediately so tab close/background/navigation cannot silently discard it.
dkd_Game.prototype.dkd_save = function dkd_v074AccountSyncSave() {
  const dkd_result = dkd_v074AccountSyncPrevious.dkd_save.call(this);
  if (this.dkd_v04Authenticated && this.dkd_v04CloudReady && this.dkd_career?.dkd_schema === 1) {
    if (this.dkd_v04SaveTimer) {
      clearTimeout(this.dkd_v04SaveTimer);
      this.dkd_v04SaveTimer = null;
    }
    this.dkd_send('cloud-save', { dkd_game_state: this.dkd_career });
  }
  return dkd_result;
};

window.dkd_lastMileV074 = {
  ...(window.dkd_lastMileV074 || {}),
  dkd_crossDeviceProgressSync: true,
  dkd_cloudSaveImmediate: true,
  dkd_localProgressRecovery: true,
  dkd_canonicalFinalProgress: true,
};

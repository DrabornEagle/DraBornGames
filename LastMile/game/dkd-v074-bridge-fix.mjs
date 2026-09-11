// v0.7.4 compatibility bridge: keeps the existing Expo native shell unchanged.
// Payment operations travel through the already supported cloud job messages.
const dkd_v074BridgePreviousAction = dkd_Game.prototype.dkd_action;
const dkd_v074BridgePreviousReceive = dkd_Game.prototype.dkd_receive;
const dkd_v074BridgePreviousAdminView = dkd_Game.prototype.dkd_view_v074adminpayments;

function dkd_v074BridgeHasPayment(dkd_game, dkd_id) {
  return (dkd_game?.dkd_v074AdminPanel?.dkd_payments || []).some(dkd_item => String(dkd_item.dkd_id) === String(dkd_id));
}

dkd_Game.prototype.dkd_view_v074adminpayments = function dkd_v074BridgeAdminView() {
  for (const dkd_payment of this.dkd_v074AdminPanel?.dkd_payments || []) {
    if (dkd_payment?.dkd_receipt_data && !dkd_payment.dkd_receipt_url) dkd_payment.dkd_receipt_url = dkd_payment.dkd_receipt_data;
  }
  return dkd_v074BridgePreviousAdminView.call(this);
};

dkd_Game.prototype.dkd_receive = function dkd_v074BridgeReceive(dkd_payload) {
  const dkd_jobId = String(dkd_payload?.dkd_data?.dkd_job_id || '');
  if (['cloud-job-accepted','cloud-job-cancelled'].includes(dkd_payload?.dkd_type) && dkd_v074BridgeHasPayment(this, dkd_jobId)) {
    this.dkd_toast(dkd_payload.dkd_type === 'cloud-job-accepted' ? 'Ödeme onaylandı.' : 'Ödeme reddedildi.');
    this.dkd_v074AdminPanel = null;
    this.dkd_render('v074adminpayments');
    this.dkd_send('cloud-claim-jobs', { dkd_count: 1, dkd_level: 974 });
    return;
  }
  return dkd_v074BridgePreviousReceive.call(this, dkd_payload);
};

dkd_Game.prototype.dkd_action = function dkd_v074BridgeAction(dkd_action) {
  const [dkd_command,...dkd_parts] = String(dkd_action || '').split(':');
  const dkd_value = dkd_parts.join(':');
  if (dkd_command === 'v074-admin-approve') {
    this.dkd_send('cloud-accept-job', { dkd_job_id: dkd_value });
    return;
  }
  if (dkd_command === 'v074-admin-reject') {
    const dkd_reason = String(document.getElementById(`dkd-v074-review-${dkd_value}`)?.value || 'Dekont doğrulanamadı.').slice(0,500);
    this.dkd_send('cloud-cancel-job', { dkd_job_id: dkd_value, dkd_reason });
    return;
  }
  return dkd_v074BridgePreviousAction.call(this, dkd_action);
};

window.dkd_lastMileV074Bridge = { dkd_existingNativeCloudChannel: true, dkd_inlineReceiptReview: true };

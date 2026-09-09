// DraBornGo / Last Mile v0.5 live-season final verification surface.
// Loaded after the live-season/admin layer. A valid local Final score is persisted through
// the authenticated cloud save; the server turns that save into a pending season claim.

const dkd_v05VerifyPrevious = {
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_view_verification: dkd_Game.prototype.dkd_view_verification,
  dkd_view_guide: dkd_Game.prototype.dkd_view_guide,
};

function dkd_v05VerifyCurrentReward(dkd_game) {
  const dkd_season = dkd_v05LiveCurrentSeason(dkd_game);
  return dkd_v05LiveSeasonRewards(dkd_game, dkd_season?.dkd_id || 'dkd_season01')
    .find(dkd_reward => dkd_reward.dkd_slot_id === dkd_game?.dkd_state?.dkd_prize)
    || dkd_v05LiveSeasonRewards(dkd_game, dkd_season?.dkd_id || 'dkd_season01')[0]
    || null;
}

dkd_Game.prototype.dkd_action = function dkd_v05VerifyAction(dkd_action) {
  const dkd_result = dkd_v05VerifyPrevious.dkd_action.call(this, dkd_action);
  if (dkd_action === 'deliver' && this.dkd_result?.dkd_type === 'final') {
    const dkd_auditPassed = this.dkd_result?.dkd_audit?.dkd_status === 'LOCAL_CHECK_PASSED';
    const dkd_training = this.dkd_state?.dkd_training === true;
    const dkd_reward = dkd_v05VerifyCurrentReward(this);
    this.dkd_state.dkd_liveSeasonSubmission = {
      dkd_status: dkd_auditPassed && !dkd_training ? 'pending_verification' : 'not_eligible',
      dkd_reward_id: dkd_reward?.dkd_id || '',
      dkd_reward_name: dkd_reward?.dkd_name || '',
      dkd_score: Number(this.dkd_result?.dkd_score?.dkd_total || 0),
      dkd_at: Date.now(),
    };
    // dkd_save is already the authenticated v0.5 cloud-save wrapper. The private
    // Last-Mile save RPC creates/updates a pending reward claim only after a Final
    // score with LOCAL_CHECK_PASSED reaches the server.
    this.dkd_save();
  }
  return dkd_result;
};

dkd_Game.prototype.dkd_view_verification = function dkd_v05VerifyView() {
  const dkd_result = this.dkd_result;
  if (!dkd_result) return dkd_v05VerifyPrevious.dkd_view_verification.call(this);
  const dkd_auditPassed = dkd_result.dkd_audit?.dkd_status === 'LOCAL_CHECK_PASSED';
  const dkd_training = this.dkd_state?.dkd_training === true;
  const dkd_reward = dkd_v05VerifyCurrentReward(this);
  const dkd_season = dkd_v05LiveCurrentSeason(this);
  const dkd_number = String(dkd_season?.dkd_number || 1).padStart(2, '0');
  const dkd_pending = dkd_auditPassed && !dkd_training;
  const dkd_statusText = dkd_pending
    ? 'Final skorun hesabına kaydedildi ve sunucu doğrulama kuyruğuna gönderildi.'
    : dkd_training
      ? 'Yönetici test koşusu gerçek sezon sıralamasına ve ödül doğrulamasına gönderilmez.'
      : 'Yerel hareket kontrolü geçmediği için bu koşu ödül doğrulamasına gönderilmedi.';
  const dkd_steps = [
    [true, 'Final telemetrisi ve kariyer kaydı oluşturuldu'],
    [dkd_auditPassed, dkd_auditPassed ? 'Yerel hareket kontrolü geçti' : 'Yerel hareket kontrolü başarısız'],
    [dkd_pending, dkd_pending ? 'Final skoru Last-Mile sunucusuna gönderiliyor' : 'Sunucu ödül başvurusu oluşturulmadı'],
    [dkd_pending, dkd_pending ? 'Durum: Doğrulama bekliyor' : 'Durum: Uygun değil'],
  ];
  return this.dkd_page('FİNAL TAMAMLANDI', `
    <div class="dkd-result-head">
      <div class="dkd-trophy">${dkd_icon(dkd_pending ? 'fingerprint' : 'check')}</div>
      <span class="dkd-kicker">GERÇEK SEZON ${dkd_number} · ${dkd_escape(dkd_season?.dkd_name || 'BÜYÜK FIRTINA')}</span>
      <h1>Son kilometre.<br/>Tamamlandı.</h1>
      <p class="dkd-muted dkd-text-sm" style="margin-top:12px">${dkd_escape(dkd_statusText)}</p>
    </div>
    <div class="dkd-card dkd-steps">${dkd_steps.map(dkd_step => `<div class="dkd-list-line">${dkd_icon(dkd_step[0] ? 'check' : 'close')} ${dkd_escape(dkd_step[1])}</div>`).join('')}</div>
    <div class="dkd-space"></div>
    ${dkd_reward ? `<div class="dkd-card"><span class="dkd-kicker">SEÇTİĞİN SEZON ÖDÜLÜ</span><div class="dkd-row" style="margin-top:12px"><span class="dkd-icon-tile">${dkd_icon(dkd_v05LiveRewardIcon(dkd_reward))}</span><div><h3>${dkd_escape(dkd_reward.dkd_name)}</h3><small>${dkd_escape(dkd_reward.dkd_subtitle || '')}</small></div></div></div><div class="dkd-space"></div>` : ''}
    <span class="dkd-kicker" style="display:block;text-align:center">FİNAL SKORU</span>
    <div class="dkd-score-big">${dkd_money(dkd_result.dkd_score.dkd_total)}</div>
    <p class="dkd-muted dkd-text-sm" style="text-align:center">100.000 üzerinden · ${dkd_time(dkd_result.dkd_time)}</p>
    <div class="dkd-space"></div>
    ${[['Paket doğruluğu',dkd_result.dkd_score.dkd_accuracy,25],['Süre',dkd_result.dkd_score.dkd_punctuality,25],['Hasarsızlık',dkd_result.dkd_score.dkd_damage,20],['Güvenli sürüş',dkd_result.dkd_score.dkd_safety,20],['Rota verimliliği',dkd_result.dkd_score.dkd_efficiency,10]].map(dkd_stat=>`<div class="dkd-between dkd-text-sm" style="padding:8px 0"><span class="dkd-muted">${dkd_stat[0]} · %${dkd_stat[2]}</span><b>${Math.round(dkd_stat[1]*100)}%</b></div>`).join('')}
    <div class="dkd-space"></div>
    <div class="dkd-notice">${dkd_pending ? 'Ödül hakkı bu ekranda otomatik verilmez. Sezon sonuçları beceri skoruna göre sıralanır; sunucu telemetrisi ve hesap uygunluğu doğrulandıktan sonra stok adedi kadar hak sahibi onaylanır.' : dkd_escape(dkd_result.dkd_audit?.dkd_reasons?.join(' · ') || 'Bu koşu gerçek sezon doğrulamasına alınmadı.')}</div>
  `, dkd_button('ŞİRKET MERKEZİNE DÖN','home','garage'));
};

dkd_Game.prototype.dkd_view_guide = function dkd_v05VerifyGuide() {
  let dkd_html = dkd_v05VerifyPrevious.dkd_view_guide.call(this);
  dkd_html = String(dkd_html)
    .replace(/<h3>Final puanlaması \/ deneme<\/h3>/g, '<h3>Final puanlaması / gerçek sezon</h3>')
    .replace(/Eşit yerel skorda daha kısa süre öne geçer\.[^<]*/g, 'Eşit doğrulanmış skorda daha kısa süre öne geçer. Gerçek sezon ödülleri beceri yarışmasıyla belirlenir; Final sonucu sunucu doğrulamasından geçer.');
  return dkd_html;
};

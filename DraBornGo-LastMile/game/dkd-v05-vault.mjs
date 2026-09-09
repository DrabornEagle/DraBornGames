// DraBornGo / Last Mile v0.5 full-screen prize vault.
function dkd_v05PrizeAccent(dkd_prizeId) {
  if (dkd_prizeId === 'dkd_phone') return '#e982b7';
  if (dkd_prizeId === 'dkd_tablet') return '#65c9c2';
  return '#a99bea';
}

function dkd_v05RequirementIcon(dkd_name) {
  const dkd_text = String(dkd_name || '').toLocaleLowerCase('tr-TR');
  if (dkd_text.includes('usta')) return 'star';
  if (dkd_text.includes('hik')) return 'message';
  if (dkd_text.includes('fırt') || dkd_text.includes('yag') || dkd_text.includes('yağ')) return 'rain';
  if (dkd_text.includes('itibar') || dkd_text.includes('puan')) return 'badge';
  return 'flag';
}

dkd_Game.prototype.dkd_view_vault = function dkd_v05Vault() {
  const dkd_state = this.dkd_state;
  const dkd_prize = dkd_prizes.find(dkd_item => dkd_item.dkd_id === dkd_state.dkd_prize) || dkd_prizes[0];
  const dkd_percent = dkd_progress(dkd_state);
  const dkd_accent = dkd_v05PrizeAccent(dkd_prize.dkd_id);
  const dkd_requirements = dkd_finalRequirements(dkd_state);
  const dkd_requirementColors = ['#65c9c2', '#8aa7ee', '#edc56e', '#e982b7'];
  const dkd_prizeColors = { dkd_phone: '#e982b7', dkd_laptop: '#a99bea', dkd_tablet: '#65c9c2' };
  const dkd_requirementCards = dkd_requirements.map((dkd_item, dkd_index) => {
    const dkd_have = Math.min(Number(dkd_item.dkd_need) || 0, Math.floor(Number(dkd_item.dkd_have) || 0));
    const dkd_need = Math.max(1, Number(dkd_item.dkd_need) || 1);
    return `<div class="dkd-v05-req" style="--dkd-req:${dkd_requirementColors[dkd_index % dkd_requirementColors.length]}"><div class="dkd-v05-req-head"><span class="dkd-v05-req-icon">${dkd_icon(dkd_v05RequirementIcon(dkd_item.dkd_name),18)}</span><b>${dkd_have}/${dkd_need}</b></div><h3>${dkd_escape(dkd_item.dkd_name)}</h3>${dkd_progressBar(dkd_have,dkd_need)}</div>`;
  }).join('');

  return `<div class="dkd-screen dkd-v05-vault">${this.dkd_header('ÖDÜL KASASI','Sezon hedef merkezinin tamamı')}<div class="dkd-v05-vault-body">
    <section class="dkd-v05-vault-hero" style="--dkd-vault-accent:${dkd_accent}">
      <div class="dkd-v05-vault-hero-top"><div><span class="dkd-kicker">SEZON 01 · BÜYÜK FIRTINA</span><h1>${dkd_escape(dkd_prize.dkd_name)} hedefi</h1><p>${dkd_escape(dkd_prize.dkd_sub)} · Final Görevi yolunda tüm ilerlemen tek ekranda.</p></div><span class="dkd-v05-vault-icon">${dkd_icon(dkd_prize.dkd_icon)}</span></div>
      <div class="dkd-v05-vault-percent">%${dkd_percent}</div>
      <div class="dkd-v05-vault-progress"><span style="width:${dkd_clamp(dkd_percent,0,100)}%"></span></div>
      <div class="dkd-v05-vault-mini"><div><b>${dkd_state.dkd_master}</b><small>USTA TESLİMAT</small></div><div><b>${dkd_state.dkd_chapter}/6</b><small>HİKÂYE</small></div><div><b>${Math.min(10,dkd_state.dkd_storm)}/10</b><small>FIRTINA</small></div></div>
    </section>

    <section class="dkd-v05-vault-section"><div class="dkd-v05-vault-section-head"><div><span class="dkd-kicker">HEDEFİNİ SEÇ</span><h2>Sezon vitrini</h2></div><small>Seçimin ana ekranda<br/>anında güncellenir.</small></div><div class="dkd-v05-prize-grid">${dkd_prizes.map(dkd_item => `<button class="dkd-v05-prize ${dkd_item.dkd_id===dkd_state.dkd_prize?'dkd-selected':''}" style="--dkd-prize:${dkd_prizeColors[dkd_item.dkd_id] || '#8aa7ee'}" data-dkd-action="prize:${dkd_item.dkd_id}">${dkd_icon(dkd_item.dkd_icon)}<b>${dkd_escape(dkd_item.dkd_name)}</b><small>${dkd_escape(dkd_item.dkd_sub)}</small></button>`).join('')}</div></section>

    <section class="dkd-v05-vault-section"><div class="dkd-v05-vault-section-head"><div><span class="dkd-kicker">FİNAL ROTASI</span><h2>Kilidi açan hedefler</h2></div><small>${dkd_requirements.filter(dkd_item => Number(dkd_item.dkd_have) >= Number(dkd_item.dkd_need)).length}/${dkd_requirements.length} tamamlandı</small></div><div class="dkd-v05-requirements">${dkd_requirementCards}</div></section>

    <section class="dkd-v05-final-card"><div class="dkd-between"><div><span class="dkd-kicker">SON TESLİMAT</span><h3 style="margin-top:5px">${dkd_finalUnlocked(dkd_state)?'Final Görevi hazır.':'Final Görevi henüz kilitli.'}</h3></div>${dkd_icon(dkd_finalUnlocked(dkd_state)?'trophy':'lock',26)}</div>${dkd_button(dkd_finalUnlocked(dkd_state)?'FİNAL GÖREVİNE GİR':'HEDEFLERİ TAMAMLA','final',dkd_finalUnlocked(dkd_state)?'trophy':'lock',dkd_finalUnlocked(dkd_state)?'':'dkd-secondary')}</section>
    <div class="dkd-v05-vault-note">Fiziksel ödül hakkı bu geliştirme sürümünde aktif değildir. Gerçek sezon açıldığında ürün modeli, adet, uygunluk ve doğrulama kuralları başlamadan önce açıkça ilan edilir.</div>
  </div></div>`;
};

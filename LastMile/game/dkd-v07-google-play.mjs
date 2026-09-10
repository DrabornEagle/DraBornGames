// DraBornGo / Last Mile v0.7 — Google Play policy guard.
// This layer is bundled for every target but is a strict no-op unless the Play build
// pipeline sets window.dkd_googlePlayBuild=true in the bootstrap script.
// It does not change driving, career, graphics, controls, scoring or non-Play builds.

if (typeof window !== 'undefined' && window.dkd_googlePlayBuild === true) {
  const dkd_v07PlayPrevious = {
    dkd_save: dkd_Game.prototype.dkd_save,
    dkd_page: dkd_Game.prototype.dkd_page,
    dkd_view_home: dkd_Game.prototype.dkd_view_home,
    dkd_view_vault: dkd_Game.prototype.dkd_view_vault,
    dkd_view_phone: dkd_Game.prototype.dkd_view_phone,
  };

  const dkd_v07PlayTargets = {
    dkd_phone: { dkd_name: 'TELEFON HEDEFİ', dkd_sub: 'Oyun içi vitrin hedefi' },
    dkd_laptop: { dkd_name: 'OYUN BİLGİSAYARI HEDEFİ', dkd_sub: 'Oyun içi vitrin hedefi' },
    dkd_tablet: { dkd_name: 'TABLET HEDEFİ', dkd_sub: 'Oyun içi vitrin hedefi' },
  };

  function dkd_v07PlayTarget(dkd_slotId) {
    return dkd_v07PlayTargets[String(dkd_slotId || '')] || { dkd_name: 'SEZON HEDEFİ', dkd_sub: 'Oyun içi vitrin hedefi' };
  }

  function dkd_v07PlayReplaceAll(dkd_value, dkd_search, dkd_replacement) {
    if (!dkd_search) return String(dkd_value || '');
    return String(dkd_value || '').split(String(dkd_search)).join(String(dkd_replacement));
  }

  function dkd_v07PlayRewardRows(dkd_game) {
    try {
      return typeof dkd_v05LiveCloudRewards === 'function' ? dkd_v05LiveCloudRewards(dkd_game) : [];
    } catch {
      return [];
    }
  }

  function dkd_v07PlaySanitize(dkd_html, dkd_game) {
    let dkd_output = String(dkd_html || '');
    for (const dkd_reward of dkd_v07PlayRewardRows(dkd_game)) {
      const dkd_target = dkd_v07PlayTarget(dkd_reward?.dkd_slot_id);
      const dkd_rewardName = String(dkd_reward?.dkd_name || '');
      const dkd_rewardSubtitle = String(dkd_reward?.dkd_subtitle || '');
      if (dkd_rewardName) dkd_output = dkd_v07PlayReplaceAll(dkd_output, dkd_escape(dkd_rewardName), dkd_escape(dkd_target.dkd_name));
      if (dkd_rewardSubtitle) dkd_output = dkd_v07PlayReplaceAll(dkd_output, dkd_escape(dkd_rewardSubtitle), dkd_escape(dkd_target.dkd_sub));
    }

    const dkd_knownPhysicalNames = [
      'iPhone 18 Pro Max', 'MSI Gaming Laptop', 'Premium Tablet', 'PlayStation 5 Pro',
      'ROG Ally X', 'Meta Quest 3S', 'MacBook Air', 'iPad Pro', 'Apple Watch Ultra',
      'Galaxy S Ultra', 'Lenovo Legion Gaming Laptop', 'Steam Deck OLED',
    ];
    for (const dkd_name of dkd_knownPhysicalNames) {
      const dkd_nameLower = dkd_name.toLocaleLowerCase('tr-TR');
      const dkd_target = dkd_nameLower.includes('tablet') || dkd_nameLower.includes('ipad') ? dkd_v07PlayTargets.dkd_tablet
        : dkd_nameLower.includes('laptop') || dkd_nameLower.includes('macbook') || dkd_nameLower.includes('rog') || dkd_nameLower.includes('steam') || dkd_nameLower.includes('playstation') ? dkd_v07PlayTargets.dkd_laptop
          : dkd_v07PlayTargets.dkd_phone;
      dkd_output = dkd_v07PlayReplaceAll(dkd_output, dkd_name, dkd_target.dkd_name);
    }

    const dkd_textReplacements = [
      ['GERÇEK SEZON', 'SEZON'],
      ['FİZİKSEL ÖDÜLLER AKTİF', 'OYUN İÇİ HEDEFLER'],
      ['Hangi fiziksel ödül', 'Hangi oyun içi hedef'],
      ['Sezon ödülünü seç', 'Sezon hedefini seç'],
      ['SEÇTİĞİN SEZON ÖDÜLÜ', 'SEÇTİĞİN SEZON HEDEFİ'],
      ['ÖDÜL KASASI', 'HEDEF KASASI'],
      ['Sezon 01 ödülleri', 'Sezon 01 hedefleri'],
      ['Sıradaki hediyeler', 'Sıradaki hedefler'],
      ['Her sezon<br/>3 yeni hediye.', 'Her sezon<br/>3 yeni hedef.'],
      ['Her sezonda<br/>yeni 3 ödül.', 'Her sezonda<br/>3 yeni hedef.'],
      ['Beceri yarışması · Final Görevi<br/>Sunucu doğrulaması', 'Final Görevi · Oyun içi ilerleme<br/>Gerçek dünya ödülü yok'],
      ['Final Görevi ve beceri skoru tamamlandığında sunucu doğrulama süreci bu ödül için çalışır.', 'Final Görevi ve beceri skoru yalnızca oyun içi ilerleme ve sıralama için kullanılır. Google Play sürümünde fiziksel ürün, nakit veya gerçek dünya değeri verilmez.'],
      ['Final skorun hesabına kaydedildi ve sunucu doğrulama kuyruğuna gönderildi.', 'Final skorun hesabına oyun içi ilerleme olarak kaydedildi. Google Play sürümünde gerçek dünya ödülü oluşturulmaz.'],
      ['Yönetici test koşusu gerçek sezon sıralamasına ve ödül doğrulamasına gönderilmez.', 'Yönetici test koşusu normal sezon sıralamasına gönderilmez.'],
      ['Yerel hareket kontrolü geçmediği için bu koşu ödül doğrulamasına gönderilmedi.', 'Yerel hareket kontrolü geçmediği için bu koşu skor doğrulamasına gönderilmedi.'],
      ['Final skoru Last-Mile sunucusuna gönderiliyor', 'Final skoru oyun hesabına kaydediliyor'],
      ['Sunucu ödül başvurusu oluşturulmadı', 'Gerçek dünya ödülü oluşturulmaz'],
      ['Durum: Doğrulama bekliyor', 'Durum: Oyun içi skor kaydedildi'],
      ['Ödül hakkı bu ekranda otomatik verilmez. Sezon sonuçları beceri skoruna göre sıralanır; sunucu telemetrisi ve hesap uygunluğu doğrulandıktan sonra stok adedi kadar hak sahibi onaylanır.', 'Google Play sürümünde sezon ve Final sonuçları yalnızca oyun içi skor, ilerleme ve sıralama içindir. Fiziksel ürün, nakit veya gerçek dünya değeri kazanılamaz.'],
      ['Gerçek sezon ödülleri beceri yarışmasıyla belirlenir; Final sonucu sunucu doğrulamasından geçer.', 'Google Play sürümünde sezon hedefleri yalnızca oyun içi ilerlemedir; Final sonucu skor ve bütünlük kontrolünden geçer.'],
    ];
    for (const dkd_replacement of dkd_textReplacements) dkd_output = dkd_v07PlayReplaceAll(dkd_output, dkd_replacement[0], dkd_replacement[1]);

    dkd_output = dkd_output.replace(/>\s*\d+\s+ADET\s*</g, '>OYUN İÇİ<');
    return dkd_output;
  }

  function dkd_v07PlayScrubSubmission(dkd_game) {
    const dkd_submission = dkd_game?.dkd_state?.dkd_liveSeasonSubmission;
    if (!dkd_submission) return;
    dkd_game.dkd_state.dkd_liveSeasonSubmission = {
      ...dkd_submission,
      dkd_status: 'play_virtual_only',
      dkd_reward_id: '',
      dkd_reward_name: '',
    };
  }

  dkd_Game.prototype.dkd_save = function dkd_v07PlaySave() {
    dkd_v07PlayScrubSubmission(this);
    return dkd_v07PlayPrevious.dkd_save.call(this);
  };

  dkd_Game.prototype.dkd_page = function dkd_v07PlayPage(dkd_title, dkd_body, dkd_footer) {
    return dkd_v07PlayPrevious.dkd_page.call(
      this,
      dkd_v07PlaySanitize(dkd_title, this),
      dkd_v07PlaySanitize(dkd_body, this),
      dkd_v07PlaySanitize(dkd_footer, this),
    );
  };

  dkd_Game.prototype.dkd_view_home = function dkd_v07PlayHome() {
    return dkd_v07PlaySanitize(dkd_v07PlayPrevious.dkd_view_home.call(this), this);
  };

  dkd_Game.prototype.dkd_view_vault = function dkd_v07PlayVault() {
    return dkd_v07PlaySanitize(dkd_v07PlayPrevious.dkd_view_vault.call(this), this);
  };

  dkd_Game.prototype.dkd_view_phone = function dkd_v07PlayPhone() {
    return dkd_v07PlaySanitize(dkd_v07PlayPrevious.dkd_view_phone.call(this), this);
  };
}

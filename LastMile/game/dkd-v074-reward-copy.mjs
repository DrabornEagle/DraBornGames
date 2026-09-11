// DraBornGo / LastMile v0.7.4 seasonal reward copy — shared Android/Expo + Web.
// Removes obsolete demo-only reward wording now that seasonal prize delivery is part of the live flow.
const dkd_v074RewardCopyPreviousChoose = dkd_Game.prototype.dkd_view_choose;

dkd_Game.prototype.dkd_view_choose = function dkd_v074RewardCopyChoose() {
  return String(dkd_v074RewardCopyPreviousChoose.call(this) || '')
    .replace('Hedefini seç', 'Sezon ödülünü seç')
    .replace(
      'Seçimin kariyer ekranında ilerleme kartı olarak görünür. Bu deneme gerçek ödül vermez.',
      'Seçtiğin büyük ödül kariyer ekranında sezon hedefin olur. Oyundaki görevleri tamamlayıp sezonu bitirdiğinde ödül teslim sürecine geçersin.'
    )
    .replaceAll(' · Deneme hedef', ' · Sezon büyük ödülü');
};

window.dkd_lastMileV074 = {
  ...(window.dkd_lastMileV074 || {}),
  dkd_rewardCopyCurrent: true,
};

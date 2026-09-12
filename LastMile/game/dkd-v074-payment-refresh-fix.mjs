// DraBornGo / Last Mile v0.7.4 — payment refresh/restore stability layer.
// The payment gate may receive a requested `home` route and redirect it internally to
// `v074payment`. UI enhancement must therefore follow the rendered DOM, not only the
// originally requested route name. This keeps login, browser refresh, Expo WebView
// reload and cloud re-render behavior identical.

const dkd_v074RefreshPreviousRender = dkd_Game.prototype.dkd_render;
let dkd_v074RefreshFrame = 0;

function dkd_v074RefreshPaymentVisible(dkd_game) {
  const dkd_root = dkd_game?.dkd_root;
  return Boolean(dkd_root?.querySelector?.('.dkd-v074-pay'));
}

function dkd_v074RefreshSyncPayment(dkd_game) {
  if (!dkd_v074RefreshPaymentVisible(dkd_game)) return;
  if (typeof dkd_v074SeasonDecoratePayment === 'function') dkd_v074SeasonDecoratePayment(dkd_game);
}

function dkd_v074RefreshSchedule(dkd_game) {
  queueMicrotask(() => dkd_v074RefreshSyncPayment(dkd_game));
  if (dkd_v074RefreshFrame) cancelAnimationFrame(dkd_v074RefreshFrame);
  dkd_v074RefreshFrame = requestAnimationFrame(() => {
    dkd_v074RefreshFrame = 0;
    dkd_v074RefreshSyncPayment(dkd_game);
  });
}

dkd_Game.prototype.dkd_render = function dkd_v074RefreshStableRender(dkd_page, dkd_arg = null) {
  const dkd_result = dkd_v074RefreshPreviousRender.call(this, dkd_page, dkd_arg);
  dkd_v074RefreshSchedule(this);
  return dkd_result;
};

// A restored authenticated session can receive its payment-center bootstrap after the
// first paint. Observe only the game root and re-apply the idempotent decorator when
// that asynchronous render replaces the payment DOM.
function dkd_v074RefreshObserveRoot(dkd_game) {
  const dkd_root = dkd_game?.dkd_root;
  if (!dkd_root || dkd_root.dataset.dkdV074RefreshObserved === 'true' || typeof MutationObserver !== 'function') return;
  dkd_root.dataset.dkdV074RefreshObserved = 'true';
  const dkd_observer = new MutationObserver(() => {
    if (dkd_v074RefreshPaymentVisible(dkd_game)) dkd_v074RefreshSchedule(dkd_game);
  });
  dkd_observer.observe(dkd_root, { childList: true, subtree: true });
  dkd_game.dkd_v074RefreshObserver = dkd_observer;
}

queueMicrotask(() => {
  const dkd_game = typeof dkd_v07Game !== 'undefined' ? dkd_v07Game : null;
  if (dkd_game) {
    dkd_v074RefreshObserveRoot(dkd_game);
    dkd_v074RefreshSchedule(dkd_game);
  }
});

window.dkd_lastMileV074 = {
  ...(window.dkd_lastMileV074 || {}),
  dkd_paymentRefreshStable: true,
  dkd_paymentDecorationByRenderedDom: true,
  dkd_futureSeasonRebindAfterRefresh: true,
};

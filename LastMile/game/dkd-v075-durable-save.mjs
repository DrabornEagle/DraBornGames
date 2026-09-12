// DraBornGo / Last Mile v0.7.5 — durable Supabase save + season order center.
// Shared by Android and Web. Every meaningful action receives an idempotent client event id.
const dkd_v075Previous = {
  dkd_save: dkd_Game.prototype.dkd_save,
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_render: dkd_Game.prototype.dkd_render,
  dkd_frame: dkd_Game.prototype.dkd_frame,
};
const dkd_v075Version = 'v0.7.5';
const dkd_v075SessionId = `session-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`;

function dkd_v075Id(dkd_prefix = 'event') {
  try { if (globalThis.crypto?.randomUUID) return `${dkd_prefix}-${globalThis.crypto.randomUUID()}`; } catch {}
  return `${dkd_prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,14)}`;
}

function dkd_v075DeviceId() {
  const dkd_key = 'dkd_lastmile_device_v075';
  try {
    let dkd_value = localStorage.getItem(dkd_key);
    if (!dkd_value) { dkd_value = dkd_v075Id('device'); localStorage.setItem(dkd_key, dkd_value); }
    return dkd_value;
  } catch { return dkd_v075Id('device-volatile'); }
}
const dkd_v075Device = dkd_v075DeviceId();

function dkd_v075Platform() {
  const dkd_agent = String(globalThis.navigator?.userAgent || '');
  return /Android/i.test(dkd_agent) && /(\bwv\b|Version\/4\.0)/i.test(dkd_agent) ? 'android' : 'web';
}

function dkd_v075CloudReady(dkd_game) {
  return dkd_game?.dkd_v04Authenticated === true && dkd_game?.dkd_v04CloudReady === true && dkd_game?.dkd_career;
}

function dkd_v075Mark(dkd_game, dkd_type, dkd_payload = {}) {
  if (!dkd_v075CloudReady(dkd_game)) return false;
  dkd_game.dkd_career.dkd_cloudEvent = {
    dkd_id: dkd_v075Id(dkd_type || 'event'),
    dkd_type: String(dkd_type || 'player_action').slice(0,80),
    dkd_session_id: dkd_v075SessionId,
    dkd_device_id: dkd_v075Device,
    dkd_platform: dkd_v075Platform(),
    dkd_payload: dkd_payload && typeof dkd_payload === 'object' ? dkd_payload : {},
    dkd_at: new Date().toISOString(),
  };
  return true;
}

function dkd_v075InstallStyles() {
  if (document.getElementById('dkd-v075-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v075-style';
  dkd_style.textContent = `
    .dkd-drive-tools{transform:translateY(58px)!important}
    .dkd-v075-season-orders{margin:0 16px 14px;padding:14px;border:1px solid #496682;border-left:7px solid #72e6d0;border-radius:20px;background:#14283f;color:#eef8ff}
    .dkd-v075-season-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}
    .dkd-v075-season-head b{font-size:15px;letter-spacing:.25px}.dkd-v075-season-head small{font-size:10px;color:#a9bfd3}
    .dkd-v075-season-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 0;border-top:1px solid #35526d}
    .dkd-v075-season-row:first-of-type{border-top:0}.dkd-v075-season-row b{display:block;font-size:12px}.dkd-v075-season-row small{display:block;margin-top:3px;font-size:10px;color:#9fb4c9;line-height:1.35}
    .dkd-v075-season-total{min-width:74px;text-align:right;font-size:18px;font-weight:950;color:#fff2bd}.dkd-v075-season-total small{font-size:9px;color:#b8c9dc}
    @media(max-height:680px){.dkd-drive-tools{transform:translateY(44px)!important}}
  `;
  document.head.appendChild(dkd_style);
}
dkd_v075InstallStyles();

function dkd_v075Date(dkd_value) {
  try { return new Date(dkd_value).toLocaleDateString('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric'}); } catch { return '—'; }
}

function dkd_v075SeasonStats(dkd_game) {
  const dkd_rows = Array.isArray(dkd_game?.dkd_v04Cloud?.dkd_season_order_stats) ? dkd_game.dkd_v04Cloud.dkd_season_order_stats : [];
  return dkd_rows.map(dkd_row => ({ ...dkd_row, dkd_total_orders: Math.max(0, Number(dkd_row?.dkd_total_orders || 0) + Number(dkd_game?.dkd_v075LocalSeasonAdds?.[dkd_row?.dkd_season_id] || 0)) }));
}

function dkd_v075MountSeasonOrders(dkd_game) {
  if (dkd_game?.dkd_pageName !== 'home' || !dkd_game?.dkd_root) return;
  dkd_game.dkd_root.querySelector('.dkd-v075-season-orders')?.remove();
  const dkd_bottom = dkd_game.dkd_root.querySelector('.dkd-home-bottom');
  if (!dkd_bottom) return;
  const dkd_stats = dkd_v075SeasonStats(dkd_game);
  const dkd_panel = document.createElement('section');
  dkd_panel.className = 'dkd-v075-season-orders';
  dkd_panel.setAttribute('aria-label','Kurye Merkezi sezon toplam siparişleri');
  dkd_panel.innerHTML = `<div class="dkd-v075-season-head"><div><b>KURYE MERKEZİ · TOPLAM SİPARİŞ</b><small>Sezon başlangıcından bitimine kadar</small></div>${dkd_icon('box',20)}</div>${dkd_stats.length ? dkd_stats.map(dkd_row => `<div class="dkd-v075-season-row"><div><b>SEZON ${Number(dkd_row.dkd_season_number || 0)} · ${dkd_escape(dkd_row.dkd_season_name || 'Sezon')}</b><small>${dkd_v075Date(dkd_row.dkd_starts_at)} — ${dkd_v075Date(dkd_row.dkd_ends_at)}</small></div><div class="dkd-v075-season-total">${Number(dkd_row.dkd_total_orders || 0).toLocaleString('tr-TR')}<small>SİPARİŞ</small></div></div>`).join('') : '<div class="dkd-v075-season-row"><div><b>SEZON VERİSİ HAZIRLANIYOR</b><small>Sunucu bağlantısı yenilendiğinde toplamlar burada görünecek.</small></div><div class="dkd-v075-season-total">—</div></div>'}`;
  dkd_bottom.parentElement?.insertBefore(dkd_panel, dkd_bottom);
}

function dkd_v075NormalizeVersions(dkd_root) {
  if (!dkd_root) return;
  for (const dkd_chip of dkd_root.querySelectorAll?.('.dkd-version') || []) dkd_chip.textContent = dkd_v075Version;
  const dkd_walker = document.createTreeWalker(dkd_root, NodeFilter.SHOW_TEXT);
  const dkd_nodes = [];
  while (dkd_walker.nextNode()) dkd_nodes.push(dkd_walker.currentNode);
  for (const dkd_node of dkd_nodes) {
    const dkd_value = String(dkd_node.nodeValue || '');
    const dkd_next = dkd_value.replace(/v0\.7\.4/gi, dkd_v075Version);
    if (dkd_next !== dkd_value) dkd_node.nodeValue = dkd_next;
  }
}

dkd_Game.prototype.dkd_save = function dkd_v075Save() {
  let dkd_marked = false;
  if (dkd_v075CloudReady(this) && !this.dkd_career.dkd_cloudEvent) dkd_marked = dkd_v075Mark(this,'state_checkpoint',{dkd_page:this.dkd_pageName || 'unknown'});
  const dkd_result = dkd_v075Previous.dkd_save.call(this);
  if ((dkd_marked || this.dkd_career?.dkd_cloudEvent) && this.dkd_career) this.dkd_career.dkd_cloudEvent = null;
  return dkd_result;
};

dkd_Game.prototype.dkd_action = function dkd_v075Action(dkd_action) {
  const dkd_beforeDeliveries = Number(this.dkd_career?.dkd_deliveries || 0);
  const dkd_beforePage = this.dkd_pageName || 'unknown';
  const dkd_result = dkd_v075Previous.dkd_action.call(this, dkd_action);
  if (!dkd_v075CloudReady(this)) return dkd_result;
  const dkd_afterDeliveries = Number(this.dkd_career?.dkd_deliveries || 0);
  const dkd_completed = Math.max(0, dkd_afterDeliveries - dkd_beforeDeliveries);
  const dkd_type = dkd_completed > 0 ? 'order_completed' : 'player_action';
  const dkd_payload = {
    dkd_action: String(dkd_action || '').slice(0,160),
    dkd_page_before: dkd_beforePage,
    dkd_page_after: this.dkd_pageName || dkd_beforePage,
    dkd_delivery_delta: dkd_completed,
    dkd_count: dkd_completed || 1,
    dkd_deliveries: dkd_afterDeliveries,
    dkd_wallet: Number(this.dkd_career?.dkd_wallet || 0),
    dkd_xp: Number(this.dkd_career?.dkd_xp || 0),
  };
  if (dkd_completed > 0) {
    const dkd_active = dkd_v075SeasonStats(this).find(dkd_row => Date.now() >= new Date(dkd_row.dkd_starts_at).getTime() && Date.now() <= new Date(dkd_row.dkd_ends_at).getTime());
    if (dkd_active?.dkd_season_id) {
      this.dkd_v075LocalSeasonAdds ||= {};
      this.dkd_v075LocalSeasonAdds[dkd_active.dkd_season_id] = Number(this.dkd_v075LocalSeasonAdds[dkd_active.dkd_season_id] || 0) + dkd_completed;
    }
  }
  dkd_v075Mark(this,dkd_type,dkd_payload);
  this.dkd_save();
  return dkd_result;
};

dkd_Game.prototype.dkd_render = function dkd_v075Render(dkd_pageName, dkd_arg = null) {
  const dkd_result = dkd_v075Previous.dkd_render.call(this, dkd_pageName, dkd_arg);
  dkd_v075NormalizeVersions(this.dkd_root);
  dkd_v075MountSeasonOrders(this);
  return dkd_result;
};

dkd_Game.prototype.dkd_frame = function dkd_v075Frame(dkd_timestamp) {
  if (dkd_v075CloudReady(this) && this.dkd_run && !this.dkd_run.dkd_finished && !this.dkd_run.dkd_paused && dkd_timestamp - Number(this.dkd_v075LastDriveSync || 0) >= 5000) {
    this.dkd_v075LastDriveSync = dkd_timestamp;
    const dkd_run = this.dkd_run;
    dkd_v075Mark(this,'drive_checkpoint',{
      dkd_job_id: String(dkd_run?.dkd_order?.dkd_cloudJobId || ''),
      dkd_elapsed_sec: Math.round(Number(dkd_run?.dkd_elapsed || 0)),
      dkd_distance_m: Math.round(Number(dkd_run?.dkd_distance || 0)),
      dkd_position: Array.isArray(dkd_run?.dkd_position) ? dkd_run.dkd_position.map(dkd_value => Math.round(Number(dkd_value || 0)*10)/10) : [],
      dkd_heading: Math.round(Number(dkd_run?.dkd_heading || 0)*1000)/1000,
      dkd_damage: Math.round(Number(dkd_run?.dkd_damage || 0)),
      dkd_quality: Math.round(Number(dkd_run?.dkd_quality || 0)),
      dkd_battery: Math.round(Number(dkd_run?.dkd_battery || 0)),
    });
    this.dkd_save();
  }
  return dkd_v075Previous.dkd_frame.call(this, dkd_timestamp);
};

window.dkd_lastMileV075 = { dkd_version: dkd_v075Version, dkd_durableCloudSave: true, dkd_seasonOrderStats: true, dkd_driveCheckpointMs: 5000 };

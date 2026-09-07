import { dkd_roadData } from './data/dkd-roads.mjs';
import { dkd_vehicles, dkd_packages, dkd_weathers, dkd_customers, dkd_events, dkd_vips, dkd_seasons, dkd_cosmetics, dkd_blackStory } from './dkd-data.mjs';

export const dkd_clamp = (dkd_value, dkd_low, dkd_high) => Math.max(dkd_low, Math.min(dkd_high, dkd_value));
export const dkd_distance = (dkd_first, dkd_second) => Math.hypot(dkd_first[0] - dkd_second[0], dkd_first[1] - dkd_second[1]);
export const dkd_angle = dkd_value => Math.atan2(Math.sin(dkd_value), Math.cos(dkd_value));
export function dkd_rng(dkd_seed) {
  let dkd_counter = dkd_seed >>> 0;
  return () => { dkd_counter += 0x6d2b79f5; let dkd_result = Math.imul(dkd_counter ^ (dkd_counter >>> 15), 1 | dkd_counter); dkd_result ^= dkd_result + Math.imul(dkd_result ^ (dkd_result >>> 7), 61 | dkd_result); return ((dkd_result ^ (dkd_result >>> 14)) >>> 0) / 4294967296; };
}
export const dkd_dayKey = (dkd_now = Date.now()) => new Date(dkd_now).toISOString().slice(0, 10);
export const dkd_level = dkd_state => 1 + Math.floor(Math.sqrt(dkd_state.dkd_xp / 160));
export function dkd_defaultState() {
  return { dkd_schema: 1, dkd_profile: null, dkd_wallet: 900, dkd_xp: 0, dkd_master: 0, dkd_deliveries: 0, dkd_onTime: 0, dkd_damageFree: 0, dkd_storm: 0, dkd_night: 0, dkd_distance: 0, dkd_ratingTotal: 0, dkd_vipTrust: 0, dkd_tokens: 0, dkd_vip: null, dkd_chapter: 0, dkd_prize: 'dkd_laptop', dkd_season: 'dkd_season01', dkd_tutorial: false, dkd_fullCareer: false, dkd_equipped: 'dkd_city50', dkd_owned: ['dkd_city50'], dkd_upgrades: { dkd_engine: 0, dkd_grip: 0, dkd_bag: 0 }, dkd_fleet: { dkd_city50: { dkd_fuel: 100, dkd_condition: 100 } }, dkd_garage: 0, dkd_brand: { dkd_color: '#e4ff5e', dkd_logo: 'eagle', dkd_uniform: '#233d44', dkd_plate: '06 LAST 01' }, dkd_cosmetics: [], dkd_wearing: [], dkd_settings: { dkd_quality: 'balanced', dkd_music: .55, dkd_effects: .8, dkd_assist: true, dkd_haptics: true, dkd_camera: 'chase', dkd_steering: .7 }, dkd_reviews: [], dkd_transactions: [], dkd_messages: [], dkd_scores: [], dkd_ghost: null, dkd_black: 0, dkd_daily: { dkd_date: '', dkd_deliveries: 0, dkd_clean: 0, dkd_vip: 0, dkd_rain: 0, dkd_distance: 0, dkd_rated: 0, dkd_claimed: false }, dkd_streak: { dkd_last: '', dkd_days: 0, dkd_claimed: [] }, dkd_training: false, dkd_completedRuns: [], dkd_lastRun: null };
}
// Saves are explicitly untrusted. They are local demo progression, never prize evidence.
export function dkd_restoreState(dkd_raw) {
  const dkd_state = dkd_defaultState();
  if (!dkd_raw || typeof dkd_raw !== 'object' || dkd_raw.dkd_schema !== 1) return dkd_state;
  for (const dkd_key of ['dkd_wallet', 'dkd_xp', 'dkd_master', 'dkd_deliveries', 'dkd_onTime', 'dkd_damageFree', 'dkd_storm', 'dkd_night', 'dkd_distance', 'dkd_ratingTotal', 'dkd_vipTrust', 'dkd_tokens', 'dkd_chapter', 'dkd_garage', 'dkd_black']) if (Number.isFinite(dkd_raw[dkd_key])) dkd_state[dkd_key] = dkd_clamp(dkd_raw[dkd_key], 0, 99999999);
  for (const dkd_key of ['dkd_tutorial', 'dkd_fullCareer', 'dkd_training']) dkd_state[dkd_key] = dkd_raw[dkd_key] === true;
  if (dkd_raw.dkd_profile && typeof dkd_raw.dkd_profile.dkd_company === 'string') {
    dkd_state.dkd_profile = {};
    for (const dkd_key of ['dkd_name', 'dkd_username', 'dkd_phone', 'dkd_company']) dkd_state.dkd_profile[dkd_key] = String(dkd_raw.dkd_profile[dkd_key] || '').slice(0, 60);
    dkd_state.dkd_profile.dkd_photo = /^data:image\/(png|jpeg|webp);base64,/.test(dkd_raw.dkd_profile.dkd_photo || '') && dkd_raw.dkd_profile.dkd_photo.length < 900000 ? dkd_raw.dkd_profile.dkd_photo : '';
  }
  dkd_state.dkd_owned = Array.isArray(dkd_raw.dkd_owned) ? [...new Set(['dkd_city50', ...dkd_raw.dkd_owned.filter(dkd_id => dkd_vehicles.some(dkd_vehicle => dkd_vehicle.dkd_id === dkd_id))])] : ['dkd_city50'];
  if (dkd_state.dkd_owned.includes(dkd_raw.dkd_equipped)) dkd_state.dkd_equipped = dkd_raw.dkd_equipped;
  for (const dkd_id of dkd_state.dkd_owned) dkd_state.dkd_fleet[dkd_id] = { dkd_fuel: dkd_clamp(Number(dkd_raw.dkd_fleet?.[dkd_id]?.dkd_fuel ?? 100) || 0, 0, 100), dkd_condition: dkd_clamp(Number(dkd_raw.dkd_fleet?.[dkd_id]?.dkd_condition ?? 100) || 0, 0, 100) };
  for (const dkd_key of Object.keys(dkd_state.dkd_upgrades)) dkd_state.dkd_upgrades[dkd_key] = Math.floor(dkd_clamp(Number(dkd_raw.dkd_upgrades?.[dkd_key]) || 0, 0, 5));
  if (['dkd_phone', 'dkd_laptop', 'dkd_tablet'].includes(dkd_raw.dkd_prize)) dkd_state.dkd_prize = dkd_raw.dkd_prize;
  if (dkd_seasons.some(dkd_season => dkd_season.dkd_id === dkd_raw.dkd_season)) dkd_state.dkd_season = dkd_raw.dkd_season;
  if (dkd_vips.some(dkd_vip => dkd_vip.dkd_customer === dkd_raw.dkd_vip)) dkd_state.dkd_vip = dkd_raw.dkd_vip;
  for (const dkd_key of ['dkd_color', 'dkd_uniform']) if (/^#[0-9a-f]{6}$/i.test(dkd_raw.dkd_brand?.[dkd_key] || '')) dkd_state.dkd_brand[dkd_key] = dkd_raw.dkd_brand[dkd_key];
  if (['eagle', 'bolt', 'diamond'].includes(dkd_raw.dkd_brand?.dkd_logo)) dkd_state.dkd_brand.dkd_logo = dkd_raw.dkd_brand.dkd_logo;
  dkd_state.dkd_brand.dkd_plate = String(dkd_raw.dkd_brand?.dkd_plate || '06 LAST 01').replace(/[^A-Za-z0-9 ]/g, '').slice(0, 12);
  const dkd_settings = dkd_raw.dkd_settings || {};
  if (['low', 'balanced', 'high'].includes(dkd_settings.dkd_quality)) dkd_state.dkd_settings.dkd_quality = dkd_settings.dkd_quality;
  if (['chase', 'near', 'high'].includes(dkd_settings.dkd_camera)) dkd_state.dkd_settings.dkd_camera = dkd_settings.dkd_camera;
  for (const dkd_key of ['dkd_music', 'dkd_effects', 'dkd_steering']) if (Number.isFinite(dkd_settings[dkd_key])) dkd_state.dkd_settings[dkd_key] = dkd_clamp(dkd_settings[dkd_key], 0, 1);
  for (const dkd_key of ['dkd_assist', 'dkd_haptics']) if (typeof dkd_settings[dkd_key] === 'boolean') dkd_state.dkd_settings[dkd_key] = dkd_settings[dkd_key];
  const dkd_items = dkd_key => Array.isArray(dkd_raw[dkd_key]) ? dkd_raw[dkd_key].slice(-80).filter(dkd_item => dkd_item && typeof dkd_item === 'object' && !Array.isArray(dkd_item)) : [];
  const dkd_text = dkd_value => typeof dkd_value === 'string' ? dkd_value.slice(0, 600) : '';
  const dkd_number = dkd_value => Number.isFinite(dkd_value) ? dkd_clamp(dkd_value, 0, 9999999999999) : 0;
  const dkd_customerValid = dkd_id => dkd_customers.some(dkd_customer => dkd_customer.dkd_id === dkd_id);
  dkd_state.dkd_reviews = dkd_items('dkd_reviews').filter(dkd_item => dkd_customerValid(dkd_item.dkd_customer) && Number.isFinite(dkd_item.dkd_rating)).map(dkd_item => ({ dkd_customer: dkd_item.dkd_customer, dkd_rating: dkd_clamp(dkd_item.dkd_rating, 1, 5), dkd_text: dkd_text(dkd_item.dkd_text), dkd_at: dkd_number(dkd_item.dkd_at) }));
  dkd_state.dkd_transactions = dkd_items('dkd_transactions').filter(dkd_item => Number.isFinite(dkd_item.dkd_amount)).map(dkd_item => ({ dkd_label: dkd_text(dkd_item.dkd_label), dkd_amount: dkd_clamp(dkd_item.dkd_amount, -99999999, 99999999), dkd_at: dkd_number(dkd_item.dkd_at) }));
  dkd_state.dkd_messages = dkd_items('dkd_messages').filter(dkd_item => dkd_customerValid(dkd_item.dkd_from) && typeof dkd_item.dkd_text === 'string').map(dkd_item => ({ dkd_from: dkd_item.dkd_from, dkd_text: dkd_text(dkd_item.dkd_text), dkd_own: dkd_item.dkd_own === true, dkd_at: dkd_number(dkd_item.dkd_at) }));
  dkd_state.dkd_scores = dkd_items('dkd_scores').filter(dkd_item => Number.isFinite(dkd_item.dkd_score) && Number.isFinite(dkd_item.dkd_time) && dkd_seasons.some(dkd_season => dkd_season.dkd_id === dkd_item.dkd_season)).map(dkd_item => ({ dkd_score: Math.round(dkd_clamp(dkd_item.dkd_score, 0, 100000)), dkd_time: dkd_number(dkd_item.dkd_time), dkd_prize: ['dkd_phone','dkd_laptop','dkd_tablet'].includes(dkd_item.dkd_prize) ? dkd_item.dkd_prize : 'dkd_laptop', dkd_season: dkd_item.dkd_season, dkd_training: dkd_item.dkd_training === true, dkd_audit: dkd_item.dkd_audit === 'LOCAL_CHECK_PASSED' ? 'LOCAL_CHECK_PASSED' : 'LOCAL_INVALID', dkd_at: dkd_number(dkd_item.dkd_at) }));
  dkd_state.dkd_completedRuns = Array.isArray(dkd_raw.dkd_completedRuns) ? dkd_raw.dkd_completedRuns.filter(dkd_id => typeof dkd_id === 'string' && dkd_id.startsWith('dkd_run_') && dkd_id.length < 100).slice(-80) : [];
  for (const [dkd_key, dkd_max] of [['dkd_chapter',6],['dkd_garage',3],['dkd_black',4],['dkd_vipTrust',100]]) dkd_state[dkd_key] = Math.floor(dkd_clamp(dkd_state[dkd_key],0,dkd_max));
  for (const dkd_key of ['dkd_cosmetics', 'dkd_wearing']) if (Array.isArray(dkd_raw[dkd_key])) dkd_state[dkd_key] = dkd_raw[dkd_key].filter(dkd_id => typeof dkd_id === 'string' && dkd_id.startsWith('dkd_')).slice(0, 40);
  if (dkd_raw.dkd_daily?.dkd_date === dkd_dayKey()) for (const dkd_key of Object.keys(dkd_state.dkd_daily)) if (typeof dkd_raw.dkd_daily[dkd_key] === typeof dkd_state.dkd_daily[dkd_key]) dkd_state.dkd_daily[dkd_key] = dkd_raw.dkd_daily[dkd_key];
  if (typeof dkd_raw.dkd_streak?.dkd_last === 'string') dkd_state.dkd_streak = { dkd_last: dkd_raw.dkd_streak.dkd_last, dkd_days: dkd_clamp(Number(dkd_raw.dkd_streak.dkd_days) || 0, 0, 999), dkd_claimed: Array.isArray(dkd_raw.dkd_streak.dkd_claimed) ? dkd_raw.dkd_streak.dkd_claimed.filter(Number.isFinite) : [] };
  if (dkd_seasons.some(dkd_item => dkd_item.dkd_id === dkd_raw.dkd_ghost?.dkd_season) && Number.isFinite(dkd_raw.dkd_ghost?.dkd_time) && dkd_raw.dkd_ghost.dkd_time > 0 && Array.isArray(dkd_raw.dkd_ghost.dkd_frames) && dkd_raw.dkd_ghost.dkd_frames.length > 1 && dkd_raw.dkd_ghost.dkd_frames.length < 2400 && dkd_raw.dkd_ghost.dkd_frames.every((dkd_frame, dkd_index, dkd_frames) => Array.isArray(dkd_frame) && dkd_frame.length === 5 && dkd_frame.every(Number.isFinite) && dkd_frame[0] >= 0 && (dkd_index === 0 || dkd_frame[0] > dkd_frames[dkd_index - 1][0]))) dkd_state.dkd_ghost = { dkd_season: dkd_raw.dkd_ghost.dkd_season, dkd_time: dkd_raw.dkd_ghost.dkd_time, dkd_frames: dkd_raw.dkd_ghost.dkd_frames.map(dkd_frame => [...dkd_frame]) };
  return dkd_state;
}
export function dkd_tickDay(dkd_state, dkd_now = Date.now()) {
  const dkd_today = dkd_dayKey(dkd_now);
  if (dkd_state.dkd_daily.dkd_date !== dkd_today) dkd_state.dkd_daily = { ...dkd_defaultState().dkd_daily, dkd_date: dkd_today };
  if (dkd_state.dkd_streak.dkd_last !== dkd_today) { dkd_state.dkd_streak.dkd_days = dkd_state.dkd_streak.dkd_last === dkd_dayKey(dkd_now - 86400000) ? dkd_state.dkd_streak.dkd_days + 1 : 1; dkd_state.dkd_streak.dkd_last = dkd_today; }
}
export function dkd_transaction(dkd_state, dkd_amount, dkd_label) {
  if (!Number.isFinite(dkd_amount) || dkd_state.dkd_wallet + dkd_amount < 0) return false;
  dkd_state.dkd_wallet += Math.round(dkd_amount);
  dkd_state.dkd_transactions.push({ dkd_label, dkd_amount: Math.round(dkd_amount), dkd_at: Date.now() });
  dkd_state.dkd_transactions = dkd_state.dkd_transactions.slice(-60);
  return true;
}
export function dkd_buyVehicle(dkd_state, dkd_id) {
  const dkd_vehicle = dkd_vehicles.find(dkd_item => dkd_item.dkd_id === dkd_id);
  if (!dkd_vehicle || dkd_state.dkd_owned.includes(dkd_id) || dkd_level(dkd_state) < dkd_vehicle.dkd_level) return false;
  if (!dkd_transaction(dkd_state, -dkd_vehicle.dkd_price, `${dkd_vehicle.dkd_name} satın alındı`)) return false;
  dkd_state.dkd_owned.push(dkd_id); dkd_state.dkd_equipped = dkd_id; dkd_state.dkd_fleet[dkd_id] = { dkd_fuel: 100, dkd_condition: 100 }; return true;
}
export function dkd_vehicleStats(dkd_state, dkd_final = false) {
  const dkd_vehicle = dkd_vehicles.find(dkd_item => dkd_item.dkd_id === (dkd_final ? 'dkd_125' : dkd_state.dkd_equipped)) || dkd_vehicles[0];
  if (dkd_final) return { ...dkd_vehicle };
  return { ...dkd_vehicle, dkd_speed: dkd_vehicle.dkd_speed * (1 + dkd_state.dkd_upgrades.dkd_engine * .035), dkd_accel: dkd_vehicle.dkd_accel * (1 + dkd_state.dkd_upgrades.dkd_engine * .06), dkd_grip: Math.min(1.15, dkd_vehicle.dkd_grip + dkd_state.dkd_upgrades.dkd_grip * .04) };
}

export class dkd_MinHeap {
  constructor() { this.dkd_values = []; }
  dkd_push(dkd_item) { let dkd_index = this.dkd_values.length; this.dkd_values.push(dkd_item); while (dkd_index > 0) { const dkd_parent = (dkd_index - 1) >> 1; if (this.dkd_values[dkd_parent][0] <= dkd_item[0]) break; this.dkd_values[dkd_index] = this.dkd_values[dkd_parent]; dkd_index = dkd_parent; } this.dkd_values[dkd_index] = dkd_item; }
  dkd_pop() { const dkd_first = this.dkd_values[0]; const dkd_last = this.dkd_values.pop(); if (this.dkd_values.length) { let dkd_index = 0; while (dkd_index * 2 + 1 < this.dkd_values.length) { let dkd_child = dkd_index * 2 + 1; if (dkd_child + 1 < this.dkd_values.length && this.dkd_values[dkd_child + 1][0] < this.dkd_values[dkd_child][0]) dkd_child++; if (this.dkd_values[dkd_child][0] >= dkd_last[0]) break; this.dkd_values[dkd_index] = this.dkd_values[dkd_child]; dkd_index = dkd_child; } this.dkd_values[dkd_index] = dkd_last; } return dkd_first; }
}
export function dkd_createGraph(dkd_data = dkd_roadData) {
  const dkd_edges = dkd_data.dkd_roads.map((dkd_road, dkd_index) => ({ ...dkd_road, dkd_id: dkd_index, dkd_length: dkd_distance(dkd_data.dkd_points[dkd_road.dkd_from], dkd_data.dkd_points[dkd_road.dkd_to]) }));
  const dkd_adj = dkd_data.dkd_points.map(() => []);
  for (const dkd_edge of dkd_edges) {
    if (dkd_edge.dkd_length < .1) continue;
    if (dkd_edge.dkd_direction !== -1) dkd_adj[dkd_edge.dkd_from].push({ dkd_to: dkd_edge.dkd_to, dkd_edge: dkd_edge.dkd_id });
    if (dkd_edge.dkd_direction !== 1) dkd_adj[dkd_edge.dkd_to].push({ dkd_to: dkd_edge.dkd_from, dkd_edge: dkd_edge.dkd_id });
  }
  const dkd_graph = { dkd_points: dkd_data.dkd_points, dkd_edges, dkd_adj, dkd_hub: 0, dkd_grid: new Map() };
  dkd_graph.dkd_hub = dkd_data.dkd_points.map((dkd_point, dkd_index) => ({ dkd_index, dkd_distance: dkd_distance(dkd_point, [0, 120]) })).filter(dkd_item => dkd_adj[dkd_item.dkd_index].length >= 2).sort((dkd_first, dkd_second) => dkd_first.dkd_distance - dkd_second.dkd_distance)[0]?.dkd_index || 0;
  for (const dkd_edge of dkd_edges) {
    const dkd_start = dkd_graph.dkd_points[dkd_edge.dkd_from]; const dkd_end = dkd_graph.dkd_points[dkd_edge.dkd_to];
    for (let dkd_column = Math.floor(Math.min(dkd_start[0], dkd_end[0]) / 60) - 1; dkd_column <= Math.floor(Math.max(dkd_start[0], dkd_end[0]) / 60) + 1; dkd_column++) for (let dkd_row = Math.floor(Math.min(dkd_start[1], dkd_end[1]) / 60) - 1; dkd_row <= Math.floor(Math.max(dkd_start[1], dkd_end[1]) / 60) + 1; dkd_row++) { const dkd_key = `${dkd_column},${dkd_row}`; if (!dkd_graph.dkd_grid.has(dkd_key)) dkd_graph.dkd_grid.set(dkd_key, []); dkd_graph.dkd_grid.get(dkd_key).push(dkd_edge.dkd_id); }
  }
  return dkd_graph;
}
export function dkd_pathfind(dkd_graph, dkd_start, dkd_end, dkd_mode = 'safe', dkd_closed = new Set()) {
  if (!dkd_graph.dkd_points[dkd_start] || !dkd_graph.dkd_points[dkd_end]) return null;
  const dkd_costs = new Float64Array(dkd_graph.dkd_points.length).fill(Infinity);
  const dkd_previous = new Int32Array(dkd_costs.length).fill(-1); const dkd_links = new Int32Array(dkd_costs.length).fill(-1);
  const dkd_heap = new dkd_MinHeap(); dkd_costs[dkd_start] = 0; dkd_heap.dkd_push([0, dkd_start]);
  while (dkd_heap.dkd_values.length) {
    const [dkd_cost, dkd_current] = dkd_heap.dkd_pop(); if (dkd_cost > dkd_costs[dkd_current]) continue; if (dkd_current === dkd_end) break;
    for (const dkd_link of dkd_graph.dkd_adj[dkd_current]) {
      if (dkd_closed.has(dkd_link.dkd_edge)) continue;
      const dkd_edge = dkd_graph.dkd_edges[dkd_link.dkd_edge]; const dkd_nextCost = dkd_cost + dkd_edge.dkd_length * (dkd_mode === 'safe' && dkd_edge.dkd_width < 10 ? 1.65 : 1);
      if (dkd_nextCost < dkd_costs[dkd_link.dkd_to]) { dkd_costs[dkd_link.dkd_to] = dkd_nextCost; dkd_previous[dkd_link.dkd_to] = dkd_current; dkd_links[dkd_link.dkd_to] = dkd_edge.dkd_id; dkd_heap.dkd_push([dkd_nextCost, dkd_link.dkd_to]); }
    }
  }
  if (!Number.isFinite(dkd_costs[dkd_end])) return null;
  const dkd_nodes = [dkd_end]; const dkd_routeEdges = []; let dkd_current = dkd_end;
  while (dkd_current !== dkd_start) { dkd_routeEdges.push(dkd_links[dkd_current]); dkd_current = dkd_previous[dkd_current]; dkd_nodes.push(dkd_current); }
  dkd_nodes.reverse(); dkd_routeEdges.reverse();
  return { dkd_nodes, dkd_edges: dkd_routeEdges, dkd_distance: dkd_routeEdges.reduce((dkd_total, dkd_id) => dkd_total + dkd_graph.dkd_edges[dkd_id].dkd_length, 0), dkd_mode };
}
export function dkd_project(dkd_point, dkd_start, dkd_end) {
  const dkd_dx = dkd_end[0] - dkd_start[0]; const dkd_dz = dkd_end[1] - dkd_start[1]; const dkd_fraction = dkd_clamp(((dkd_point[0] - dkd_start[0]) * dkd_dx + (dkd_point[1] - dkd_start[1]) * dkd_dz) / (dkd_dx * dkd_dx + dkd_dz * dkd_dz || 1), 0, 1);
  const dkd_at = [dkd_start[0] + dkd_dx * dkd_fraction, dkd_start[1] + dkd_dz * dkd_fraction]; return { dkd_at, dkd_fraction, dkd_distance: dkd_distance(dkd_point, dkd_at) };
}
export function dkd_viaRoute(dkd_graph, dkd_start, dkd_stops, dkd_mode = 'safe', dkd_closed = new Set()) {
  const dkd_result = { dkd_nodes: [dkd_start], dkd_edges: [], dkd_distance: 0, dkd_mode };
  let dkd_current = dkd_start;
  for (const dkd_stop of dkd_stops) { const dkd_leg = dkd_pathfind(dkd_graph, dkd_current, dkd_stop, dkd_mode, dkd_closed); if (!dkd_leg) return null; dkd_result.dkd_nodes.push(...dkd_leg.dkd_nodes.slice(1)); dkd_result.dkd_edges.push(...dkd_leg.dkd_edges); dkd_result.dkd_distance += dkd_leg.dkd_distance; dkd_current = dkd_stop; }
  return dkd_result;
}
export function dkd_nearestRoad(dkd_graph, dkd_position) {
  const dkd_candidates = dkd_graph.dkd_grid.get(`${Math.floor(dkd_position[0] / 60)},${Math.floor(dkd_position[1] / 60)}`) || dkd_graph.dkd_edges.map(dkd_edge => dkd_edge.dkd_id);
  let dkd_best = null;
  for (const dkd_id of dkd_candidates) { const dkd_edge = dkd_graph.dkd_edges[dkd_id]; const dkd_projection = dkd_project(dkd_position, dkd_graph.dkd_points[dkd_edge.dkd_from], dkd_graph.dkd_points[dkd_edge.dkd_to]); if (!dkd_best || dkd_projection.dkd_distance < dkd_best.dkd_distance) dkd_best = { ...dkd_projection, dkd_edge }; }
  return dkd_best;
}
export function dkd_payFormula(dkd_package, dkd_distanceMeters, dkd_weather, dkd_isNight, dkd_risky, dkd_vip = false) {
  const dkd_base = dkd_package.dkd_base + dkd_distanceMeters * .14;
  const dkd_weatherPay = dkd_base * (dkd_weather.dkd_bonus - 1);
  const dkd_nightPay = dkd_isNight ? dkd_base * .2 : 0;
  const dkd_riskPay = dkd_risky ? dkd_base * .15 : 0;
  const dkd_vipPay = dkd_vip ? dkd_base * .5 : 0;
  return { dkd_base: Math.round(dkd_base), dkd_weather: Math.round(dkd_weatherPay), dkd_night: Math.round(dkd_nightPay), dkd_risk: Math.round(dkd_riskPay), dkd_vip: Math.round(dkd_vipPay), dkd_clean: 120, dkd_total: Math.round(dkd_base) + Math.round(dkd_weatherPay) + Math.round(dkd_nightPay) + Math.round(dkd_riskPay) + Math.round(dkd_vipPay) + 120 };
}
export function dkd_makeOrder(dkd_state, dkd_graph, dkd_seed, dkd_type = 'normal', dkd_targetOverride = null) {
  const dkd_random = dkd_rng(dkd_seed); const dkd_final = dkd_type === 'final'; const dkd_tutorial = dkd_type === 'tutorial';
  const dkd_weatherId = dkd_final ? dkd_seasons.find(dkd_item => dkd_item.dkd_id === dkd_state.dkd_season).dkd_weather : dkd_tutorial ? 'dkd_clear' : dkd_weathers[Math.floor(dkd_random() * dkd_weathers.length)].dkd_id;
  const dkd_weather = dkd_weathers.find(dkd_item => dkd_item.dkd_id === dkd_weatherId);
  const dkd_available = dkd_packages.filter(dkd_item => dkd_item.dkd_level <= dkd_level(dkd_state) && dkd_item.dkd_id !== 'dkd_black');
  const dkd_isVip = dkd_type === 'vip' || dkd_type === 'vip-repeat';
  const dkd_customer = dkd_isVip ? dkd_customers.find(dkd_item => dkd_item.dkd_id === dkd_state.dkd_vip) : dkd_customers[Math.floor(dkd_random() * dkd_customers.length)];
  const dkd_package = dkd_tutorial ? dkd_packages[0] : dkd_final ? dkd_packages[7] : dkd_type === 'black' ? dkd_packages[13] : dkd_isVip ? dkd_packages.find(dkd_item => dkd_item.dkd_id === dkd_customer.dkd_kind) : dkd_available[Math.floor(dkd_random() * dkd_available.length)];
  let dkd_route = null; let dkd_target = dkd_targetOverride;
  const dkd_candidates = dkd_graph.dkd_points.map((dkd_point, dkd_index) => dkd_index).filter(dkd_index => { const dkd_range = dkd_distance(dkd_graph.dkd_points[dkd_graph.dkd_hub], dkd_graph.dkd_points[dkd_index]); return dkd_range > (dkd_tutorial ? 100 : dkd_final ? 600 : 220) && dkd_range < (dkd_tutorial ? 280 : 1100); });
  for (let dkd_attempt = 0; dkd_attempt < 180; dkd_attempt++) {
    dkd_target = dkd_targetOverride ?? dkd_candidates[Math.floor(dkd_random() * dkd_candidates.length)];
    dkd_route = dkd_pathfind(dkd_graph, dkd_graph.dkd_hub, dkd_target, 'safe');
    if (dkd_route && dkd_route.dkd_distance > 90 && dkd_route.dkd_distance < (dkd_tutorial ? 500 : 2800)) break; dkd_route = null;
  }
  if (!dkd_route) throw new Error('Ulaşılabilir teslimat rotası bulunamadı.');
  let dkd_stops = [dkd_target];
  if (dkd_final) {
    for (let dkd_attempt = 0; dkd_attempt < 80; dkd_attempt++) {
      const dkd_firstStop = dkd_candidates[Math.floor(dkd_random() * dkd_candidates.length)]; const dkd_secondStop = dkd_candidates[Math.floor(dkd_random() * dkd_candidates.length)];
      if (dkd_distance(dkd_graph.dkd_points[dkd_firstStop], dkd_graph.dkd_points[dkd_secondStop]) < 450) continue;
      const dkd_finalRoute = dkd_viaRoute(dkd_graph, dkd_graph.dkd_hub, [dkd_firstStop, dkd_secondStop, dkd_target]);
      if (dkd_finalRoute && dkd_finalRoute.dkd_distance >= 2500 && dkd_finalRoute.dkd_distance < 4800) { dkd_stops = [dkd_firstStop, dkd_secondStop, dkd_target]; dkd_route = dkd_finalRoute; break; }
    }
    if (dkd_stops.length < 3) throw new Error('Final kontrol noktaları hazırlanamadı.');
  }
  const dkd_short = dkd_final ? dkd_route : dkd_pathfind(dkd_graph, dkd_graph.dkd_hub, dkd_target, 'risk') || dkd_route;
  const dkd_isNight = dkd_tutorial ? false : dkd_final ? true : dkd_random() > .25;
  const dkd_destinationNames = ['Nova Residence', 'Atlas Plaza', 'Orbit Teknoloji', 'Mavi Klinik', 'Central Otel', 'Frame Stüdyo', 'Ada Bakım Merkezi', 'Pulse Etkinlik', 'North Depo', 'Luna Restoran'];
  return { dkd_id: `${dkd_type}-${dkd_seed}`, dkd_story: dkd_type === 'black' ? dkd_blackStory[Math.min(2, Math.max(0, dkd_state.dkd_black - 1))] : null, dkd_seed, dkd_type, dkd_stops, dkd_customer: dkd_customer.dkd_id, dkd_package: dkd_package.dkd_id, dkd_weather: dkd_weather.dkd_id, dkd_night: dkd_isNight, dkd_from: dkd_graph.dkd_hub, dkd_to: dkd_target, dkd_destination: dkd_final ? 'THE LAST DELIVERY · Servis Girişi' : `${dkd_destinationNames[Math.floor(dkd_random() * dkd_destinationNames.length)]} · Teslimat Girişi`, dkd_safe: dkd_route, dkd_risk: dkd_short, dkd_deadline: dkd_final ? 660 : Math.round(dkd_route.dkd_distance / (dkd_package.dkd_id === 'dkd_emergency' || dkd_package.dkd_id === 'dkd_medical' ? 7 : 5.5) + (dkd_tutorial ? 110 : 70)), dkd_offer: dkd_payFormula(dkd_package, dkd_route.dkd_distance, dkd_weather, dkd_isNight, false, dkd_isVip), dkd_chapter: dkd_state.dkd_chapter };
}
export function dkd_finalRequirements(dkd_state) {
  return [ { dkd_name: 'Master Delivery', dkd_have: dkd_state.dkd_master, dkd_need: 100 }, { dkd_name: 'VIP hikâyesi', dkd_have: dkd_state.dkd_chapter, dkd_need: 6 }, { dkd_name: 'Fırtına teslimatı', dkd_have: dkd_state.dkd_storm, dkd_need: 10 }, { dkd_name: 'Şirket itibarı', dkd_have: dkd_state.dkd_deliveries ? Math.min(100, dkd_state.dkd_ratingTotal / dkd_state.dkd_deliveries * 20) : 0, dkd_need: 90 } ];
}
export const dkd_finalUnlocked = dkd_state => dkd_finalRequirements(dkd_state).every(dkd_item => dkd_item.dkd_have >= dkd_item.dkd_need);
export const dkd_progress = dkd_state => Math.round(dkd_finalRequirements(dkd_state).reduce((dkd_sum, dkd_item) => dkd_sum + Math.min(1, dkd_item.dkd_have / dkd_item.dkd_need), 0) * 25);
export function dkd_chooseVip(dkd_state, dkd_id) {
  if (dkd_state.dkd_vip || dkd_state.dkd_tokens < 1 || !dkd_vips.some(dkd_vip => dkd_vip.dkd_customer === dkd_id)) return false;
  dkd_state.dkd_tokens--; dkd_state.dkd_vip = dkd_id; dkd_state.dkd_chapter = 0; dkd_state.dkd_vipTrust = 30; return true;
}
export function dkd_createRun(dkd_state, dkd_graph, dkd_order, dkd_mode = 'safe', dkd_now = Date.now()) {
  if (dkd_order.dkd_type !== 'tutorial' && !dkd_state.dkd_fullCareer) throw new Error('Önce ücretsiz demo kariyerini aç.');
  if (dkd_order.dkd_type === 'final' && !dkd_finalUnlocked(dkd_state)) throw new Error('Final Contract koşulları tamamlanmadı.');
  const dkd_vehicle = dkd_vehicleStats(dkd_state, dkd_order.dkd_type === 'final');
  const dkd_package = dkd_packages.find(dkd_item => dkd_item.dkd_id === dkd_order.dkd_package);
  if (dkd_package.dkd_weight > dkd_vehicle.dkd_storage) throw new Error('Araç kapasitesi bu pakete yetmiyor.');
  const dkd_fleet = dkd_order.dkd_type === 'final' ? { dkd_fuel: 100, dkd_condition: 100 } : dkd_state.dkd_fleet[dkd_vehicle.dkd_id];
  if (dkd_fleet.dkd_fuel < 5 || dkd_fleet.dkd_condition < 10) throw new Error('Garajda yakıt ve bakım gerekiyor.');
  const dkd_route = dkd_mode === 'risk' && dkd_order.dkd_type !== 'final' ? dkd_order.dkd_risk : dkd_order.dkd_safe;
  const dkd_start = dkd_graph.dkd_points[dkd_route.dkd_nodes[0]]; const dkd_next = dkd_graph.dkd_points[dkd_route.dkd_nodes[1]];
  return { dkd_id: `dkd_run_${dkd_now}_${dkd_order.dkd_seed}`, dkd_order, dkd_vehicle, dkd_route, dkd_pendingStops: [...dkd_order.dkd_stops], dkd_routeIndex: 1, dkd_position: [...dkd_start], dkd_heading: Math.atan2(dkd_next[0] - dkd_start[0], dkd_next[1] - dkd_start[1]), dkd_speed: 0, dkd_elapsed: 0, dkd_distance: 0, dkd_damage: 0, dkd_quality: 100, dkd_fuel: dkd_fleet.dkd_fuel, dkd_condition: dkd_fleet.dkd_condition, dkd_temperature: 45, dkd_battery: dkd_order.dkd_type === 'final' ? 19 : 100, dkd_collisions: 0, dkd_wrongWay: 0, dkd_offroad: 0, dkd_checkpoints: [], dkd_telemetry: [], dkd_nextSample: 0, dkd_closed: new Set(), dkd_event: null, dkd_eventTriggered: false, dkd_weather: dkd_weathers.find(dkd_item => dkd_item.dkd_id === dkd_order.dkd_weather), dkd_startedAt: dkd_now, dkd_paused: false, dkd_finished: false, dkd_failed: '', dkd_headlight: true, dkd_collisionCooldown: 0, dkd_signal: true, dkd_signalMessaged: false, dkd_recovery: 0, dkd_notifications: [], dkd_traffic: [], dkd_ghostBeaten: false, dkd_mode, dkd_assist: dkd_order.dkd_type === 'final' ? true : dkd_state.dkd_settings.dkd_assist, dkd_upgradeBag: dkd_order.dkd_type === 'final' ? 0 : dkd_state.dkd_upgrades.dkd_bag };
}
export function dkd_hit(dkd_run, dkd_severity = 1) {
  if (dkd_run.dkd_collisionCooldown > 0) return false;
  const dkd_package = dkd_packages.find(dkd_item => dkd_item.dkd_id === dkd_run.dkd_order.dkd_package);
  dkd_run.dkd_damage = dkd_clamp(dkd_run.dkd_damage + dkd_severity * 7 * dkd_package.dkd_sensitivity, 0, 100); dkd_run.dkd_condition = dkd_clamp(dkd_run.dkd_condition - dkd_severity * 4 / dkd_run.dkd_vehicle.dkd_durability, 0, 100); dkd_run.dkd_collisions++; dkd_run.dkd_speed *= .28; dkd_run.dkd_collisionCooldown = 2; return true;
}
export function dkd_reroute(dkd_run, dkd_graph, dkd_addClosure = false) {
  const dkd_near = dkd_nearestRoad(dkd_graph, dkd_run.dkd_position);
  const dkd_legalNodes = dkd_near.dkd_edge.dkd_direction === 1 ? [dkd_near.dkd_edge.dkd_to] : dkd_near.dkd_edge.dkd_direction === -1 ? [dkd_near.dkd_edge.dkd_from] : [dkd_near.dkd_edge.dkd_from, dkd_near.dkd_edge.dkd_to];
  const dkd_candidates = dkd_legalNodes.sort((dkd_first, dkd_second) => dkd_distance(dkd_graph.dkd_points[dkd_first], dkd_run.dkd_position) - dkd_distance(dkd_graph.dkd_points[dkd_second], dkd_run.dkd_position));
  const dkd_blocked = dkd_addClosure ? dkd_run.dkd_route.dkd_edges[Math.min(dkd_run.dkd_routeIndex + 5, dkd_run.dkd_route.dkd_edges.length - 2)] : null;
  if (dkd_blocked != null) dkd_run.dkd_closed.add(dkd_blocked);
  let dkd_newRoute = null;
  for (const dkd_node of dkd_candidates) { dkd_newRoute = dkd_viaRoute(dkd_graph, dkd_node, dkd_run.dkd_pendingStops || [dkd_run.dkd_order.dkd_to], dkd_run.dkd_mode, dkd_run.dkd_closed); if (dkd_newRoute && dkd_newRoute.dkd_nodes.length > 1) break; }
  if (!dkd_newRoute || dkd_newRoute.dkd_nodes.length < 2) { if (dkd_blocked != null) dkd_run.dkd_closed.delete(dkd_blocked); return false; }
  dkd_run.dkd_route = dkd_newRoute; dkd_run.dkd_routeIndex = 0; return true;
}
export function dkd_stepRun(dkd_run, dkd_graph, dkd_input, dkd_delta) {
  if (dkd_run.dkd_paused || dkd_run.dkd_finished || dkd_run.dkd_failed) return;
  const dkd_dt = dkd_clamp(dkd_delta, 0, 1 / 20); const dkd_vehicle = dkd_run.dkd_vehicle; const dkd_weather = dkd_run.dkd_weather;
  dkd_run.dkd_elapsed += dkd_dt; dkd_run.dkd_collisionCooldown = Math.max(0, dkd_run.dkd_collisionCooldown - dkd_dt);
  const dkd_targetIndex = Math.min(dkd_run.dkd_routeIndex, dkd_run.dkd_route.dkd_nodes.length - 1);
  const dkd_target = dkd_graph.dkd_points[dkd_run.dkd_route.dkd_nodes[dkd_targetIndex]];
  let dkd_aim = dkd_target;
  if (dkd_targetIndex > 0) {
    const dkd_previousPoint = dkd_graph.dkd_points[dkd_run.dkd_route.dkd_nodes[dkd_targetIndex - 1]];
    const dkd_projection = dkd_project(dkd_run.dkd_position, dkd_previousPoint, dkd_target);
    const dkd_fraction = dkd_clamp(dkd_projection.dkd_fraction + (8 + dkd_run.dkd_speed * .5) / Math.max(1, dkd_distance(dkd_previousPoint, dkd_target)), 0, 1);
    dkd_aim = [dkd_previousPoint[0] + (dkd_target[0] - dkd_previousPoint[0]) * dkd_fraction, dkd_previousPoint[1] + (dkd_target[1] - dkd_previousPoint[1]) * dkd_fraction];
  }
  const dkd_targetAngle = Math.atan2(dkd_aim[0] - dkd_run.dkd_position[0], dkd_aim[1] - dkd_run.dkd_position[1]);
  const dkd_turnError = dkd_angle(dkd_targetAngle - dkd_run.dkd_heading);
  const dkd_grip = dkd_weather.dkd_grip * dkd_vehicle.dkd_grip;
  let dkd_steer = dkd_clamp(dkd_input.dkd_steer || 0, -1, 1);
  if (dkd_run.dkd_assist && Math.abs(dkd_steer) < .08) dkd_steer = dkd_clamp(dkd_turnError * 2.4, -.95, .95);
  const dkd_maxSpeed = dkd_vehicle.dkd_speed / 3.6 * (dkd_run.dkd_temperature > 100 ? .6 : 1) * (dkd_run.dkd_condition < 25 ? .65 : 1);
  const dkd_afterTarget = dkd_graph.dkd_points[dkd_run.dkd_route.dkd_nodes[Math.min(dkd_targetIndex + 1, dkd_run.dkd_route.dkd_nodes.length - 1)]];
  const dkd_nextHeading = Math.atan2(dkd_afterTarget[0] - dkd_target[0], dkd_afterTarget[1] - dkd_target[1]);
  const dkd_upcomingTurn = dkd_targetIndex < dkd_run.dkd_route.dkd_nodes.length - 1 ? Math.abs(dkd_angle(dkd_nextHeading - dkd_run.dkd_heading)) * dkd_clamp((32 - dkd_distance(dkd_run.dkd_position, dkd_target)) / 22, 0, 1) : 0;
  const dkd_turnDemand = Math.max(Math.abs(dkd_turnError), dkd_upcomingTurn);
  const dkd_gripSlowdown = dkd_run.dkd_assist && dkd_turnDemand > .26 ? Math.min(dkd_maxSpeed, Math.max(2.4, (5.8 + dkd_grip * 3) / (1 + dkd_turnDemand * 1.8))) : dkd_maxSpeed;
  const dkd_accel = (dkd_input.dkd_gas ? dkd_vehicle.dkd_accel : -.65) - (dkd_input.dkd_brake ? 11 * dkd_grip : 0) - dkd_run.dkd_speed * .035;
  dkd_run.dkd_speed = dkd_clamp(dkd_run.dkd_speed + dkd_accel * dkd_dt, 0, dkd_maxSpeed);
  if (dkd_run.dkd_speed > dkd_gripSlowdown) dkd_run.dkd_speed = Math.max(dkd_gripSlowdown, dkd_run.dkd_speed - dkd_dt * 11);
  dkd_run.dkd_heading = dkd_angle(dkd_run.dkd_heading + dkd_steer * (1.25 + dkd_vehicle.dkd_handling) * dkd_grip * Math.min(1, dkd_run.dkd_speed / 3) * dkd_dt);
  const dkd_wind = Math.sin(dkd_run.dkd_elapsed * .65 + dkd_run.dkd_order.dkd_seed) * dkd_weather.dkd_wind * (1.1 - dkd_vehicle.dkd_weather * .5) * dkd_dt;
  const dkd_move = dkd_run.dkd_speed * dkd_dt;
  dkd_run.dkd_position[0] += Math.sin(dkd_run.dkd_heading) * dkd_move + dkd_wind;
  dkd_run.dkd_position[1] += Math.cos(dkd_run.dkd_heading) * dkd_move;
  dkd_run.dkd_distance += dkd_move;
  const dkd_road = dkd_nearestRoad(dkd_graph, dkd_run.dkd_position);
  if (dkd_road.dkd_distance > dkd_road.dkd_edge.dkd_width / 2 + 1.5) { dkd_run.dkd_offroad += dkd_dt; dkd_run.dkd_speed = Math.min(dkd_run.dkd_speed, Math.max(3, dkd_run.dkd_speed - 10 * dkd_dt)); }
  if (dkd_road.dkd_distance > dkd_road.dkd_edge.dkd_width / 2 + 6) { dkd_hit(dkd_run, .45); const dkd_ratio = (dkd_road.dkd_edge.dkd_width / 2 + 3) / dkd_road.dkd_distance; dkd_run.dkd_position = [dkd_road.dkd_at[0] + (dkd_run.dkd_position[0] - dkd_road.dkd_at[0]) * dkd_ratio, dkd_road.dkd_at[1] + (dkd_run.dkd_position[1] - dkd_road.dkd_at[1]) * dkd_ratio]; }
  if (dkd_run.dkd_closed.has(dkd_road.dkd_edge.dkd_id) && dkd_road.dkd_distance < dkd_road.dkd_edge.dkd_width / 2 && dkd_road.dkd_fraction > .3 && dkd_road.dkd_fraction < .7) { dkd_hit(dkd_run, .7); dkd_run.dkd_speed = 0; }
  if (dkd_road.dkd_edge.dkd_direction !== 0 && dkd_run.dkd_speed > 2) { const dkd_start = dkd_graph.dkd_points[dkd_road.dkd_edge.dkd_from]; const dkd_end = dkd_graph.dkd_points[dkd_road.dkd_edge.dkd_to]; const dkd_legalAngle = Math.atan2((dkd_end[0] - dkd_start[0]) * dkd_road.dkd_edge.dkd_direction, (dkd_end[1] - dkd_start[1]) * dkd_road.dkd_edge.dkd_direction); if (Math.abs(dkd_angle(dkd_legalAngle - dkd_run.dkd_heading)) > Math.PI * .65) dkd_run.dkd_wrongWay += dkd_dt; }
  while (dkd_run.dkd_routeIndex < dkd_run.dkd_route.dkd_nodes.length && dkd_distance(dkd_run.dkd_position, dkd_graph.dkd_points[dkd_run.dkd_route.dkd_nodes[dkd_run.dkd_routeIndex]]) < (dkd_run.dkd_assist ? 6 : 13)) { const dkd_node = dkd_run.dkd_route.dkd_nodes[dkd_run.dkd_routeIndex]; dkd_run.dkd_checkpoints.push({ dkd_node, dkd_time: dkd_run.dkd_elapsed }); if (dkd_run.dkd_pendingStops?.[0] === dkd_node) { dkd_run.dkd_pendingStops.shift(); if (dkd_run.dkd_order.dkd_type === 'final') dkd_run.dkd_notifications.push({ dkd_title: 'CHECKPOINT', dkd_text: `${3 - dkd_run.dkd_pendingStops.length} / 3 kontrol noktası geçildi.` }); } dkd_run.dkd_routeIndex++; }
  dkd_run.dkd_fuel = Math.max(0, dkd_run.dkd_fuel - dkd_move * .0016 * dkd_vehicle.dkd_fuel);
  dkd_run.dkd_temperature = dkd_clamp(dkd_run.dkd_temperature + ((dkd_weather.dkd_temperature > 35 && dkd_input.dkd_gas ? .22 : -.045) + dkd_run.dkd_speed * .001) * dkd_dt, 40, 125);
  dkd_run.dkd_battery = Math.max(0, dkd_run.dkd_battery - dkd_dt * .015);
  const dkd_package = dkd_packages.find(dkd_item => dkd_item.dkd_id === dkd_run.dkd_order.dkd_package);
  let dkd_decay = dkd_package.dkd_decay * (dkd_package.dkd_id === 'dkd_frozen' && dkd_weather.dkd_temperature > 35 ? 2 : 1);
  if (dkd_package.dkd_id === 'dkd_electronics') dkd_decay += dkd_weather.dkd_rain * .026;
  dkd_run.dkd_quality = Math.max(0, dkd_run.dkd_quality - dkd_decay * dkd_dt / (1 + dkd_run.dkd_upgradeBag * .25));
  if (dkd_run.dkd_elapsed >= dkd_run.dkd_nextSample && dkd_run.dkd_telemetry.length < 2200) { dkd_run.dkd_telemetry.push([Math.round(dkd_run.dkd_elapsed * 100) / 100, Math.round(dkd_run.dkd_position[0] * 10) / 10, Math.round(dkd_run.dkd_position[1] * 10) / 10, Math.round(dkd_run.dkd_heading * 1000) / 1000, Math.round(dkd_run.dkd_speed * 100) / 100]); dkd_run.dkd_nextSample += .5; }
  if (!dkd_run.dkd_eventTriggered && dkd_run.dkd_order.dkd_type !== 'tutorial' && dkd_run.dkd_elapsed > (dkd_run.dkd_order.dkd_type === 'final' ? 28 : 42)) {
    dkd_run.dkd_eventTriggered = true; const dkd_event = dkd_events[dkd_run.dkd_order.dkd_seed % dkd_events.length]; dkd_run.dkd_event = dkd_event;
    const dkd_changed = dkd_event.dkd_closure && dkd_reroute(dkd_run, dkd_graph, true);
    dkd_run.dkd_notifications.push({ dkd_title: dkd_event.dkd_name, dkd_text: dkd_event.dkd_closure && !dkd_changed ? 'Yakındaki kapatma rotanı etkilemiyor. Trafik yavaşladı.' : dkd_event.dkd_text, dkd_routeChanged: dkd_changed });
  }
  if (dkd_run.dkd_order.dkd_type === 'final' && dkd_run.dkd_elapsed > 48 && dkd_run.dkd_elapsed < 75) { dkd_run.dkd_signal = false; if (!dkd_run.dkd_signalMessaged) { dkd_run.dkd_signalMessaged = true; dkd_run.dkd_notifications.push({ dkd_title: 'SIGNAL LOST', dkd_text: 'Müşteri: Son kayıtlı güzergâhı takip et. Servis girişinde bekliyorum.' }); } } else dkd_run.dkd_signal = true;
  if (dkd_run.dkd_elapsed > dkd_run.dkd_order.dkd_deadline + 60) dkd_run.dkd_failed = 'Teslimat penceresi kapandı.';
  if (dkd_run.dkd_damage >= 100 || dkd_run.dkd_quality <= 0) dkd_run.dkd_failed = 'Paket teslim edilebilir durumda değil.';
  if (dkd_run.dkd_fuel <= 0) dkd_run.dkd_failed = 'Yakıt tükendi. Garajda doldurabilirsin.';
  if (dkd_run.dkd_condition <= 0) dkd_run.dkd_failed = 'Araç servis gerektiriyor.';
}
export function dkd_canDeliver(dkd_run, dkd_graph) {
  return !dkd_run.dkd_failed && !dkd_run.dkd_finished && (!dkd_run.dkd_pendingStops || !dkd_run.dkd_pendingStops.length) && dkd_run.dkd_routeIndex >= dkd_run.dkd_route.dkd_nodes.length && dkd_run.dkd_speed < 1.5 && dkd_distance(dkd_run.dkd_position, dkd_graph.dkd_points[dkd_run.dkd_order.dkd_to]) < 20;
}
export function dkd_auditLocal(dkd_run) {
  const dkd_reasons = [];
  if (dkd_run.dkd_recovery > 0) dkd_reasons.push('Yola dönüş yardımı kullanıldı');
  if (dkd_run.dkd_telemetry.length < 3) dkd_reasons.push('Yetersiz hareket örneği');
  for (let dkd_index = 1; dkd_index < dkd_run.dkd_telemetry.length; dkd_index++) {
    const dkd_before = dkd_run.dkd_telemetry[dkd_index - 1]; const dkd_after = dkd_run.dkd_telemetry[dkd_index]; const dkd_dt = dkd_after[0] - dkd_before[0];
    if (!dkd_after.every(Number.isFinite) || dkd_dt <= 0 || dkd_after[4] > dkd_run.dkd_vehicle.dkd_speed / 3.6 + .8 || dkd_distance([dkd_before[1], dkd_before[2]], [dkd_after[1], dkd_after[2]]) > dkd_dt * (dkd_run.dkd_vehicle.dkd_speed / 3.6 + 4) + 2) { dkd_reasons.push('Hareket sınırı aşımı'); break; }
  }
  return { dkd_status: dkd_reasons.length ? 'LOCAL_INVALID' : 'LOCAL_CHECK_PASSED', dkd_reasons, dkd_serverVerified: false, dkd_prizeEligible: false };
}
export function dkd_scoreRun(dkd_run) {
  const dkd_accuracy = dkd_clamp(dkd_run.dkd_quality / 100, 0, 1);
  const dkd_punctuality = dkd_clamp(1 - Math.max(0, dkd_run.dkd_elapsed - dkd_run.dkd_order.dkd_deadline * .55) / (dkd_run.dkd_order.dkd_deadline * .65), 0, 1);
  const dkd_damage = dkd_clamp(1 - dkd_run.dkd_damage / 100, 0, 1);
  const dkd_safety = dkd_clamp(1 - dkd_run.dkd_collisions * .1 - dkd_run.dkd_wrongWay * .006 - dkd_run.dkd_offroad * .004 - dkd_run.dkd_recovery * .2, 0, 1);
  const dkd_efficiency = dkd_clamp(dkd_run.dkd_order.dkd_safe.dkd_distance / Math.max(1, dkd_run.dkd_distance), 0, 1);
  return { dkd_total: Math.round((dkd_accuracy * .25 + dkd_punctuality * .25 + dkd_damage * .20 + dkd_safety * .20 + dkd_efficiency * .10) * 100000), dkd_accuracy, dkd_punctuality, dkd_damage, dkd_safety, dkd_efficiency };
}
export function dkd_completeRun(dkd_state, dkd_run, dkd_graph) {
  if (!dkd_canDeliver(dkd_run, dkd_graph) || dkd_state.dkd_completedRuns.includes(dkd_run.dkd_id)) return null;
  dkd_run.dkd_finished = true; dkd_tickDay(dkd_state);
  const dkd_audit = dkd_auditLocal(dkd_run); const dkd_score = dkd_scoreRun(dkd_run); const dkd_onTime = dkd_run.dkd_elapsed <= dkd_run.dkd_order.dkd_deadline;
  const dkd_clean = dkd_run.dkd_damage < 1; const dkd_master = dkd_clean && dkd_onTime && dkd_run.dkd_quality >= 85 && dkd_run.dkd_wrongWay < 2 && dkd_run.dkd_offroad < 8 && dkd_run.dkd_recovery === 0;
  const dkd_package = dkd_packages.find(dkd_item => dkd_item.dkd_id === dkd_run.dkd_order.dkd_package);
  const dkd_breakdown = dkd_payFormula(dkd_package, dkd_run.dkd_order.dkd_safe.dkd_distance, dkd_run.dkd_weather, dkd_run.dkd_order.dkd_night, dkd_run.dkd_mode === 'risk', ['vip','vip-repeat'].includes(dkd_run.dkd_order.dkd_type));
  const dkd_pay = Math.max(0, Math.round((dkd_breakdown.dkd_total - (dkd_clean ? 0 : 120)) * (dkd_onTime ? 1 : .65) * (1 - dkd_run.dkd_damage / 200)));
  const dkd_rating = Math.round(dkd_clamp(5 - dkd_run.dkd_damage / 30 - (dkd_onTime ? 0 : 1) - (100 - dkd_run.dkd_quality) / 60, 1, 5) * 10) / 10;
  const dkd_xp = Math.round(95 + dkd_run.dkd_distance / 18 + (dkd_master ? 75 : 0));
  dkd_state.dkd_completedRuns.push(dkd_run.dkd_id); dkd_state.dkd_completedRuns = dkd_state.dkd_completedRuns.slice(-80);
  dkd_state.dkd_deliveries++; dkd_state.dkd_onTime += Number(dkd_onTime); dkd_state.dkd_damageFree += Number(dkd_clean); dkd_state.dkd_ratingTotal += dkd_rating; dkd_state.dkd_xp += dkd_xp; dkd_state.dkd_distance += dkd_run.dkd_distance;
  if (dkd_master) { dkd_state.dkd_master++; if (dkd_state.dkd_master % 100 === 0) dkd_state.dkd_tokens++; }
  const dkd_storm = ['dkd_storm', 'dkd_flood'].includes(dkd_run.dkd_weather.dkd_id); if (dkd_storm && dkd_onTime) dkd_state.dkd_storm++;
  if (dkd_run.dkd_order.dkd_night) dkd_state.dkd_night++;
  dkd_state.dkd_daily.dkd_deliveries++; dkd_state.dkd_daily.dkd_clean += Number(dkd_clean); dkd_state.dkd_daily.dkd_distance += dkd_run.dkd_distance; dkd_state.dkd_daily.dkd_rain += Number(dkd_run.dkd_weather.dkd_rain > 0); dkd_state.dkd_daily.dkd_rated += Number(dkd_rating >= 4.8);
  if (dkd_run.dkd_order.dkd_type === 'vip' && dkd_onTime && dkd_run.dkd_damage < 20 && dkd_run.dkd_order.dkd_chapter === dkd_state.dkd_chapter) { dkd_state.dkd_chapter = Math.min(6, dkd_state.dkd_chapter + 1); dkd_state.dkd_vipTrust = Math.min(100, dkd_state.dkd_vipTrust + 12); }
  if (['vip','vip-repeat'].includes(dkd_run.dkd_order.dkd_type) || dkd_run.dkd_order.dkd_package === 'dkd_vip') dkd_state.dkd_daily.dkd_vip++;
  if (dkd_run.dkd_order.dkd_type === 'tutorial') dkd_state.dkd_tutorial = true;
  if (dkd_run.dkd_order.dkd_type === 'black') dkd_state.dkd_black = Math.min(4, dkd_state.dkd_black + 1);
  else if (dkd_state.dkd_black === 0 && dkd_run.dkd_order.dkd_package === 'dkd_electronics' && dkd_run.dkd_order.dkd_night && dkd_master) dkd_state.dkd_black = 1;
  dkd_transaction(dkd_state, dkd_pay, `${dkd_run.dkd_order.dkd_destination} teslimatı`);
  const dkd_review = dkd_master ? 'Yağmur, trafik… Hiçbiri fark etmedi. Tam zamanında ve kusursuz!' : !dkd_clean ? 'Hızlı geldi ama paket biraz zarar görmüştü.' : !dkd_onTime ? 'Paket sağlamdı. Biraz daha erken gelebilirdi.' : 'Teslimat girişini hemen buldu. Teşekkürler!';
  dkd_state.dkd_reviews.push({ dkd_customer: dkd_run.dkd_order.dkd_customer, dkd_rating, dkd_text: dkd_review, dkd_at: Date.now() }); dkd_state.dkd_reviews = dkd_state.dkd_reviews.slice(-40);
  dkd_state.dkd_messages.push({ dkd_from: dkd_run.dkd_order.dkd_customer, dkd_text: dkd_master ? 'Paketi kusursuz ulaştırdın. Seninle tekrar çalışmak isterim.' : 'Teslimat için teşekkürler. Bir sonraki işte yine haberleşelim.', dkd_at: Date.now() }); dkd_state.dkd_messages = dkd_state.dkd_messages.slice(-60);
  if (dkd_run.dkd_order.dkd_type !== 'final') dkd_state.dkd_fleet[dkd_run.dkd_vehicle.dkd_id] = { dkd_fuel: dkd_run.dkd_fuel, dkd_condition: dkd_run.dkd_condition };
  if (dkd_run.dkd_order.dkd_type === 'final') {
    if (dkd_audit.dkd_status === 'LOCAL_CHECK_PASSED' && dkd_state.dkd_ghost?.dkd_season === dkd_state.dkd_season && dkd_run.dkd_elapsed < dkd_state.dkd_ghost.dkd_time) { dkd_run.dkd_ghostBeaten = true; dkd_transaction(dkd_state, 350, 'Yerel Ghost geçildi / rota bonusu'); }
    dkd_state.dkd_scores.push({ dkd_score: dkd_score.dkd_total, dkd_time: dkd_run.dkd_elapsed, dkd_prize: dkd_state.dkd_prize, dkd_season: dkd_state.dkd_season, dkd_training: dkd_state.dkd_training, dkd_audit: dkd_audit.dkd_status, dkd_at: Date.now() }); dkd_state.dkd_scores = dkd_state.dkd_scores.slice(-30);
    if (dkd_audit.dkd_status === 'LOCAL_CHECK_PASSED' && (!dkd_state.dkd_ghost || dkd_state.dkd_ghost.dkd_season !== dkd_state.dkd_season || dkd_run.dkd_elapsed < dkd_state.dkd_ghost.dkd_time)) dkd_state.dkd_ghost = { dkd_season: dkd_state.dkd_season, dkd_time: dkd_run.dkd_elapsed, dkd_frames: dkd_run.dkd_telemetry };
  }
  const dkd_result = { dkd_ghostBonus: dkd_run.dkd_ghostBeaten ? 350 : 0, dkd_pay, dkd_xp, dkd_rating, dkd_master, dkd_clean, dkd_onTime, dkd_score, dkd_audit, dkd_time: dkd_run.dkd_elapsed, dkd_distance: dkd_run.dkd_distance, dkd_review, dkd_type: dkd_run.dkd_order.dkd_type, dkd_customer: dkd_run.dkd_order.dkd_customer, dkd_breakdown };
  dkd_state.dkd_lastRun = dkd_result; return dkd_result;
}
export function dkd_dailyRequirements(dkd_state) { return [{ dkd_name: '5 hasarsız teslimat', dkd_have: dkd_state.dkd_daily.dkd_clean, dkd_need: 5 }, { dkd_name: '3 VIP teslimatı', dkd_have: dkd_state.dkd_daily.dkd_vip, dkd_need: 3 }, { dkd_name: '12 km sürüş', dkd_have: dkd_state.dkd_daily.dkd_distance / 1000, dkd_need: 12 }, { dkd_name: 'Yağmurda 2 teslimat', dkd_have: dkd_state.dkd_daily.dkd_rain, dkd_need: 2 }, { dkd_name: '4.8+ puanlı teslimat', dkd_have: dkd_state.dkd_daily.dkd_rated, dkd_need: 1 }]; }
export function dkd_claimDaily(dkd_state) { dkd_tickDay(dkd_state); if (dkd_state.dkd_daily.dkd_claimed || !dkd_dailyRequirements(dkd_state).every(dkd_item => dkd_item.dkd_have >= dkd_item.dkd_need)) return false; dkd_state.dkd_daily.dkd_claimed = true; dkd_transaction(dkd_state, 750, 'Günlük kasa'); if (!dkd_state.dkd_cosmetics.includes('dkd_dailybadge')) dkd_state.dkd_cosmetics.push('dkd_dailybadge'); return true; }
export function dkd_npcReply(dkd_state, dkd_customerId, dkd_text) {
  const dkd_customer = dkd_customers.find(dkd_item => dkd_item.dkd_id === dkd_customerId) || dkd_customers[0]; const dkd_normal = dkd_text.toLocaleLowerCase('tr-TR');
  if (/ödül|telefon numara|gerçek|iphone|kazan/.test(dkd_normal)) return 'Ben kurgusal bir oyun karakteriyim. Bu demoda fiziksel ödül ve gerçek görüşme yok. Kariyerindeki görevlere yardımcı olabilirim.';
  if (/rota|nerede|adres|yol/.test(dkd_normal)) return `${dkd_customer.dkd_note} Navigasyon, oyun için oluşturulan teslimat girişini gösteriyor.`;
  if (/merhaba|selam|nasıl/.test(dkd_normal)) return `Merhaba ${dkd_state.dkd_profile?.dkd_username || 'kurye'}. ${dkd_customer.dkd_trait === 'Titiz' ? 'Dakiklik benim için önemli. Birlikte iyi işler yapabiliriz.' : 'Şehirde her teslimat yeni bir hikâye. Hazırsan yola çıkalım.'}`;
  if (dkd_state.dkd_vip === dkd_customerId) return dkd_vips.find(dkd_vip => dkd_vip.dkd_customer === dkd_customerId).dkd_lines[Math.min(5, dkd_state.dkd_chapter)];
  return dkd_state.dkd_lastRun?.dkd_master ? 'Son teslimatın çok iyiydi. Aynı özeni sıradaki pakette de görmek isterim.' : `${dkd_customer.dkd_note} Paketi dikkatli taşı, acele ederken güvenliği unutma.`;
}

export function dkd_initTraffic(dkd_run, dkd_graph, dkd_count = 24) {
  const dkd_random = dkd_rng(dkd_run.dkd_order.dkd_seed + 919);
  const dkd_traffic = [];
  for (let dkd_index = 0; dkd_index < dkd_count; dkd_index++) {
    const dkd_edge = dkd_graph.dkd_edges[Math.floor(dkd_random() * dkd_graph.dkd_edges.length)];
    const dkd_reverse = dkd_edge.dkd_direction === -1 || (dkd_edge.dkd_direction === 0 && dkd_random() > .5);
    dkd_traffic.push({ dkd_from: dkd_reverse ? dkd_edge.dkd_to : dkd_edge.dkd_from, dkd_to: dkd_reverse ? dkd_edge.dkd_from : dkd_edge.dkd_to, dkd_edge: dkd_edge.dkd_id, dkd_fraction: dkd_random(), dkd_speed: 4 + dkd_random() * 6, dkd_position: [0, 0], dkd_heading: 0, dkd_color: Math.floor(dkd_random() * 5), dkd_seed: dkd_index });
  }
  dkd_run.dkd_traffic = dkd_traffic;
}
export function dkd_stepTraffic(dkd_run, dkd_graph, dkd_dt) {
  if (dkd_run.dkd_paused || dkd_run.dkd_finished || dkd_run.dkd_failed) return;
  for (const dkd_car of dkd_run.dkd_traffic) {
    const dkd_start = dkd_graph.dkd_points[dkd_car.dkd_from]; const dkd_end = dkd_graph.dkd_points[dkd_car.dkd_to]; const dkd_length = Math.max(1, dkd_distance(dkd_start, dkd_end));
    if (!dkd_run.dkd_closed.has(dkd_car.dkd_edge)) dkd_car.dkd_fraction += dkd_dt * dkd_car.dkd_speed * (dkd_run.dkd_event?.dkd_traffic || 1) / dkd_length;
    dkd_car.dkd_heading = Math.atan2(dkd_end[0] - dkd_start[0], dkd_end[1] - dkd_start[1]);
    const dkd_lane = Math.min(2.4, dkd_graph.dkd_edges[dkd_car.dkd_edge].dkd_width / 4);
    dkd_car.dkd_position = [dkd_start[0] + (dkd_end[0] - dkd_start[0]) * Math.min(1, dkd_car.dkd_fraction) + Math.cos(dkd_car.dkd_heading) * dkd_lane, dkd_start[1] + (dkd_end[1] - dkd_start[1]) * Math.min(1, dkd_car.dkd_fraction) - Math.sin(dkd_car.dkd_heading) * dkd_lane];
    if (dkd_car.dkd_fraction >= 1) {
      const dkd_next = dkd_graph.dkd_adj[dkd_car.dkd_to].filter(dkd_link => !dkd_run.dkd_closed.has(dkd_link.dkd_edge) && dkd_link.dkd_to !== dkd_car.dkd_from);
      if (dkd_next.length) { const dkd_choice = dkd_next[(dkd_car.dkd_seed + Math.floor(dkd_run.dkd_elapsed / 15)) % dkd_next.length]; dkd_car.dkd_from = dkd_car.dkd_to; dkd_car.dkd_to = dkd_choice.dkd_to; dkd_car.dkd_edge = dkd_choice.dkd_edge; dkd_car.dkd_fraction = 0; }
      else { const dkd_return = dkd_graph.dkd_adj[dkd_car.dkd_to].find(dkd_link => !dkd_run.dkd_closed.has(dkd_link.dkd_edge)); if (dkd_return) { dkd_car.dkd_from = dkd_car.dkd_to; dkd_car.dkd_to = dkd_return.dkd_to; dkd_car.dkd_edge = dkd_return.dkd_edge; dkd_car.dkd_fraction = 0; } }
    }
    const dkd_relative = [dkd_run.dkd_position[0] - dkd_car.dkd_position[0], dkd_run.dkd_position[1] - dkd_car.dkd_position[1]];
    const dkd_side = Math.abs(dkd_relative[0] * Math.cos(dkd_car.dkd_heading) - dkd_relative[1] * Math.sin(dkd_car.dkd_heading));
    const dkd_forward = Math.abs(dkd_relative[0] * Math.sin(dkd_car.dkd_heading) + dkd_relative[1] * Math.cos(dkd_car.dkd_heading));
    if (dkd_side < 1.35 && dkd_forward < 2.7 && dkd_run.dkd_elapsed > 4) dkd_hit(dkd_run, dkd_clamp((dkd_run.dkd_speed + dkd_car.dkd_speed) / 14, .4, 2));
  }
}

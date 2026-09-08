// DraBornGo / Last Mile v0.4 runtime bridge.
// Loaded last so it can replace legacy local-demo surfaces without touching v0.3 3D model patches.

const dkd_v04Original = {
  dkd_bind: dkd_Game.prototype.dkd_bind,
  dkd_receive: dkd_Game.prototype.dkd_receive,
  dkd_render: dkd_Game.prototype.dkd_render,
  dkd_save: dkd_Game.prototype.dkd_save,
  dkd_action: dkd_Game.prototype.dkd_action,
  dkd_refreshOrders: dkd_Game.prototype.dkd_refreshOrders,
  dkd_view_intro: dkd_Game.prototype.dkd_view_intro,
  dkd_view_home: dkd_Game.prototype.dkd_view_home,
  dkd_view_phone: dkd_Game.prototype.dkd_view_phone,
  dkd_view_dispatch: dkd_Game.prototype.dkd_view_dispatch,
  dkd_view_choose: dkd_Game.prototype.dkd_view_choose,
  dkd_view_vault: dkd_Game.prototype.dkd_view_vault,
  dkd_view_messages: dkd_Game.prototype.dkd_view_messages,
  dkd_view_call: dkd_Game.prototype.dkd_view_call,
  dkd_view_settings: dkd_Game.prototype.dkd_view_settings,
  dkd_view_guide: dkd_Game.prototype.dkd_view_guide,
  dkd_view_verification: dkd_Game.prototype.dkd_view_verification,
};

const dkd_v04AudioOriginal = {
  dkd_start: dkd_Audio.prototype.dkd_start,
  dkd_effect: dkd_Audio.prototype.dkd_effect,
  dkd_pause: dkd_Audio.prototype.dkd_pause,
};

function dkd_v04ClockParts() {
  const dkd_timeText = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false });
  const dkd_parts = dkd_timeText.split(':');
  return { dkd_hour: dkd_parts[0] || '00', dkd_minute: dkd_parts[1] || '00', dkd_text: `${dkd_parts[0] || '00'}:${dkd_parts[1] || '00'}` };
}

function dkd_v04Seed(dkd_value) {
  let dkd_hash = 2166136261;
  const dkd_text = String(dkd_value || 'lastmile');
  for (let dkd_index = 0; dkd_index < dkd_text.length; dkd_index++) {
    dkd_hash ^= dkd_text.charCodeAt(dkd_index);
    dkd_hash = Math.imul(dkd_hash, 16777619);
  }
  return Math.abs(dkd_hash >>> 0) || 571;
}

function dkd_v04Init(dkd_game) {
  if (dkd_game.dkd_v04Initialized) return;
  dkd_game.dkd_v04Initialized = true;
  dkd_game.dkd_v04AuthKnown = false;
  dkd_game.dkd_v04Authenticated = false;
  dkd_game.dkd_v04AdminReady = false;
  dkd_game.dkd_v04CloudChecking = false;
  dkd_game.dkd_v04AuthEmail = '';
  dkd_game.dkd_v04Cloud = null;
  dkd_game.dkd_v04JobsLoading = false;
  dkd_game.dkd_v04JobsLoaded = false;
  dkd_game.dkd_v04SaveTimer = null;
  dkd_game.dkd_test = null;
  if (dkd_game.dkd_career) dkd_game.dkd_career.dkd_training = false;
  if (dkd_game.dkd_state?.dkd_training) {
    dkd_game.dkd_state = dkd_game.dkd_career;
    if (dkd_game.dkd_audio) dkd_game.dkd_audio.dkd_state = dkd_game.dkd_state;
    if (dkd_game.dkd_scene) dkd_game.dkd_scene.dkd_state = dkd_game.dkd_state;
  }
  if (Array.isArray(dkd_demoRankings)) dkd_demoRankings.splice(0, dkd_demoRankings.length);
  if (dkd_game.dkd_audio) {
    dkd_game.dkd_audio.dkd_tracks = ['Neon Vardiya', 'Islak Asfalt', 'Åžehir NabzÄ±', 'Gece HattÄ±', 'Åžafak RotasÄ±'];
  }
}

function dkd_v04MergeCatalog(dkd_game, dkd_cloud) {
  const dkd_serverPackages = Array.isArray(dkd_cloud?.dkd_packages) ? dkd_cloud.dkd_packages : [];
  for (const dkd_source of dkd_serverPackages) {
    let dkd_target = dkd_packages.find(dkd_item => dkd_item.dkd_id === dkd_source.dkd_id);
    const dkd_values = {
      dkd_id: String(dkd_source.dkd_id || ''),
      dkd_name: String(dkd_source.dkd_name || 'Last-Mile Paketi'),
      dkd_tr: String(dkd_source.dkd_name || 'Last-Mile paketi').toLocaleLowerCase('tr-TR'),
      dkd_icon: String(dkd_source.dkd_icon || 'box'),
      dkd_base: Math.max(0, Number(dkd_source.dkd_base_reward) || 0),
      dkd_weight: Math.max(1, Math.ceil(Number(dkd_source.dkd_weight_kg) || 1)),
      dkd_decay: Math.max(0, Number(dkd_source.dkd_decay) || 0),
      dkd_sensitivity: Math.max(.1, Number(dkd_source.dkd_sensitivity) || 1),
      dkd_level: Math.max(1, Math.floor(Number(dkd_source.dkd_min_level) || 1)),
      dkd_note: String(dkd_source.dkd_note || 'Last-Mile gÃ¶rev koÅŸullarÄ±nÄ± takip et.'),
    };
    if (dkd_target) Object.assign(dkd_target, dkd_values);
    else if (dkd_values.dkd_id) dkd_packages.push(dkd_values);
  }

  const dkd_serverCustomers = Array.isArray(dkd_cloud?.dkd_customers) ? dkd_cloud.dkd_customers : [];
  for (const dkd_source of dkd_serverCustomers) {
    let dkd_target = dkd_customers.find(dkd_item => dkd_item.dkd_id === dkd_source.dkd_id);
    const dkd_values = {
      dkd_id: String(dkd_source.dkd_id || ''),
      dkd_name: String(dkd_source.dkd_name || 'Teslim NoktasÄ±'),
      dkd_age: 21,
      dkd_role: String(dkd_source.dkd_role || 'Teslimat noktasÄ±'),
      dkd_trait: String(dkd_source.dkd_trait || 'Standart'),
      dkd_color: String(dkd_source.dkd_color || '#d7b294'),
      dkd_hair: String(dkd_source.dkd_hair || '#322b2a'),
      dkd_note: String(dkd_source.dkd_note || 'Teslimat giriÅŸini kullan.'),
      dkd_kind: String(dkd_source.dkd_package_id || 'dkd_hot'),
      dkd_lastmile: true,
    };
    if (dkd_target) Object.assign(dkd_target, dkd_values);
    else if (dkd_values.dkd_id) dkd_customers.push(dkd_values);
  }

  dkd_game.dkd_v04Cloud = dkd_cloud;
}

function dkd_v04ServerCustomer(dkd_game, dkd_packageId) {
  const dkd_cloudCustomers = Array.isArray(dkd_game.dkd_v04Cloud?.dkd_customers) ? dkd_game.dkd_v04Cloud.dkd_customers : [];
  const dkd_source = dkd_cloudCustomers.find(dkd_item => dkd_item.dkd_package_id === dkd_packageId) || dkd_cloudCustomers[0];
  if (dkd_source) return dkd_customers.find(dkd_item => dkd_item.dkd_id === dkd_source.dkd_id) || dkd_customers[0];
  return dkd_customers[0];
}

function dkd_v04CreateCloudOrder(dkd_game, dkd_serverEntry, dkd_index) {
  const dkd_job = dkd_serverEntry?.dkd_job || {};
  const dkd_mission = dkd_serverEntry?.dkd_mission || {};
  const dkd_origin = dkd_serverEntry?.dkd_origin || {};
  const dkd_destination = dkd_serverEntry?.dkd_destination || {};
  const dkd_seed = dkd_v04Seed(dkd_job.dkd_id || `${Date.now()}-${dkd_index}`);
  const dkd_order = dkd_makeOrder(dkd_game.dkd_state, dkd_game.dkd_graph, dkd_seed, 'normal');
  const dkd_packageId = String(dkd_job.dkd_package_id || dkd_mission.dkd_package_id || dkd_order.dkd_package);
  const dkd_package = dkd_packages.find(dkd_item => dkd_item.dkd_id === dkd_packageId) || dkd_packages[0];
  const dkd_customer = dkd_v04ServerCustomer(dkd_game, dkd_packageId);
  const dkd_weatherId = dkd_weathers.some(dkd_item => dkd_item.dkd_id === dkd_job.dkd_weather_id) ? dkd_job.dkd_weather_id : 'dkd_clear';
  const dkd_reward = Math.max(0, Math.floor(Number(dkd_job.dkd_reward) || Number(dkd_package.dkd_base) || 0));
  dkd_order.dkd_id = `dkd_cloud_${dkd_job.dkd_id || dkd_seed}`;
  dkd_order.dkd_cloudJobId = String(dkd_job.dkd_id || '');
  dkd_order.dkd_cloudMissionId = String(dkd_mission.dkd_id || '');
  dkd_order.dkd_cloudMissionName = String(dkd_mission.dkd_name || 'Last-Mile GÃ¶revi');
  dkd_order.dkd_cloudDescription = String(dkd_mission.dkd_description || 'GÃ¶rev merkezden canlÄ± olarak oluÅŸturuldu.');
  dkd_order.dkd_cloudOrigin = String(dkd_origin.dkd_name || 'Kurye Merkezi');
  dkd_order.dkd_cloudDestination = String(dkd_destination.dkd_name || 'Teslimat BÃ¶lgesi');
  dkd_order.dkd_serverReward = dkd_reward;
  dkd_order.dkd_customer = dkd_customer.dkd_id;
  dkd_order.dkd_package = dkd_package.dkd_id;
  dkd_order.dkd_weather = dkd_weatherId;
  dkd_order.dkd_destination = `${dkd_order.dkd_cloudDestination} Â· ${dkd_order.dkd_cloudMissionName}`;
  dkd_order.dkd_deadline = Math.max(90, Number(dkd_job.dkd_time_²È="25‘)½‰%°‘­‘}É•…Í½¸è€Í¡¥™Ñ}…‰…¹‘½¹•œô¤ì(€€€ô(€€€¥˜€¡‘­‘}½µµ…¹€ôôô€‘•±¥Ù•Èœ€˜˜Ñ¡¥Ì¹‘­‘}ÉÕ¸ü¹‘­‘}½É‘•Èü¹‘­‘}±½Õ‘)½‰%¤ì(€€€€€½¹ÍÐ‘­‘}±½Õ‘=É‘•È€ôÑ¡¥Ì¹‘­‘}ÉÕ¸¹‘­‘}½É‘•Èì(€€€€€½¹ÍÐ‘­‘}©½‰%€ô‘­‘}±½Õ‘=É‘•È¹‘­‘}±½Õ‘)½‰%ì(€€€€€½¹ÍÐ‘­‘}Í•ÉÙ•ÉI•Ý…É€ô5…Ñ ¹µ…à À°5…Ñ ¹™±½½È¡9Õµ‰•È¡‘­‘}±½Õ‘=É‘•È¹‘­‘}Í•ÉÙ•ÉI•Ý…É¤ñð€À¤¤ì(€€€€€‘­‘}ØÀÑ=É¥¥¹…°¹‘­‘}…Ñ¥½¸¹…±°¡Ñ¡¥Ì°‘­‘}…Ñ¥½¸¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹‘­‘}É•ÍÕ±Ð€˜˜‘­‘}Í•ÉÙ•ÉI•Ý…É€ø€À¤ì(€€€€€€€½¹ÍÐ‘­‘}‘•±Ñ„€ô‘­‘}Í•ÉÙ•ÉI•Ý…É€´9Õµ‰•È¡Ñ¡¥Ì¹‘­‘}É•ÍÕ±Ð¹‘­‘}Á…äñð€À¤ì(€€€€€€€Ñ¡¥Ì¹‘­‘}ÍÑ…Ñ”¹‘­‘}Ý…±±•Ð€ô5…Ñ ¹µ…à À°Ñ¡¥Ì¹‘­‘}ÍÑ…Ñ”¹‘­‘}Ý…±±•Ð€¬‘­‘}‘•±Ñ„¤ì(€€€€€€€½¹ÍÐ‘­‘}±…ÍÑQÉ…¹Í…Ñ¥½¸€ôÑ¡¥Ì¹‘­‘}ÍÑ…Ñ”¹‘­‘}ÑÉ…¹Í…Ñ¥½¹ÍmÑ¡¥Ì¹‘­‘}ÍÑ…Ñ”¹‘­‘}ÑÉ…¹Í…Ñ¥½¹Ì¹±•¹Ñ €´€Åtì(€€€€€€€¥˜€¡‘­‘}±…ÍÑQÉ…¹Í…Ñ¥½¸¤‘­‘}±…ÍÑQÉ…¹Í…Ñ¥½¸¹‘­‘}…µ½Õ¹Ð€ô‘­‘}Í•ÉÙ•ÉI•Ý…Éì(€€€€€€€Ñ¡¥Ì¹‘­‘}É•ÍÕ±Ð¹‘­‘}Á…ä€ô‘­‘}Í•ÉÙ•ÉI•Ý…Éì(€€€€€€€¥˜€¡Ñ¡¥Ì¹‘­‘}ÍÑ…Ñ”¹‘­‘}±…ÍÑIÕ¸¤Ñ¡¥Ì¹‘­‘}ÍÑ…Ñ”¹‘­‘}±…ÍÑIÕ¸¹‘­‘}Á…ä€ô‘­‘}Í•ÉÙ•ÉI•Ý…Éì(€€€€€€€Ñ¡¥Ì¹‘­‘}Í•¹ ±½Õµ½µÁ±•Ñ”µ©½ˆœ°ì(€€€€€€€€€‘­‘}©½‰}¥è‘­‘}©½‰%°(€€€€€€€€€‘­‘}µ•ÑÉ¥Ìèì(€€€€€€€€€€€‘­‘}•±…ÁÍ•èÑ¡¥Ì¹‘­‘}É•ÍÕ±Ð¹‘­‘}Ñ¥µ”°(€€€€€€€€€€€‘­‘}‘¥ÍÑ…¹”èÑ¡¥Ì¹‘­‘}É•ÍÕ±Ð¹‘­‘}‘¥ÍÑ…¹”°(€€€€€€€€€€€‘­‘}É…Ñ¥¹œèÑ¡¥Ì¹‘­‘}É•ÍÕ±Ð¹‘­‘}É…Ñ¥¹œ°(€€€€€€€€€€€‘­‘}µ…ÍÑ•ÈèÑ¡¥Ì¹‘­‘}É•ÍÕ±Ð¹‘­‘}µ…ÍÑ•È°(€€€€€€€€€€€‘­‘}±•…¸èÑ¡¥Ì¹‘­‘}É•ÍÕ±Ð¹‘­‘}±•…¸°(€€€€€€€€€€€‘­‘}½¹}Ñ¥µ”èÑ¡¥Ì¹‘­‘}É•ÍÕ±Ð¹‘­‘}½¹Q¥µ”°(€€€€€€€€€€€‘­‘}Í½É”èÑ¡¥Ì¹‘­‘}É•ÍÕ±Ð¹‘­‘}Í½É”ü¹‘­‘}Ñ½Ñ…°ñð€À°(€€€€€€€€€€€‘­‘}É•Ý…Éè‘­‘}Í•ÉÙ•ÉI•Ý…É°(€€€€€€€€€ô°(€€€€€€€ô¤ì(€€€€€€€Ñ¡¥Ì¹‘­‘}Í…Ù” ¤ì(€€€€€€€¥˜€¡Ñ¡¥Ì¹‘­‘}Á…•9…µ”€ôôô€É•ÍÕ±Ðœ¤Ñ¡¥Ì¹‘­‘}É•¹‘•È É•ÍÕ±Ðœ¤ì(€€€€€ô(€€€€€É•ÑÕÉ¸ì(€€€ô(€€€‘­‘}ØÀÑ=É¥¥¹…°¹‘­‘}…Ñ¥½¸¹…±°¡Ñ¡¥Ì°‘­‘}…Ñ¥½¸¤ì(€€€¥˜€¡‘­‘}½µµ…¹€ôôô€ÑÉ…¬œ€˜˜Ñ¡¥Ì¹‘­‘}…Õ‘¥¼¤ì(€€€€€Ñ¡¥Ì¹‘­‘}…Õ‘¥¼¹‘­‘}ØÀÑÉ¥Ù•	•…Ð€ô€Àì(€€€€€Ñ¡¥Ì¹‘­‘}…Õ‘¥¼¹‘­‘}ØÀÑÉ¥Ù•9•áÐ€ôÑ¡¥Ì¹‘­‘}…Õ‘¥¼¹‘­‘}½¹Ñ•áÐü¹ÕÉÉ•¹ÑQ¥µ”ñð€Àì(€€€ô(€ô°)ô¤ì()=‰©•Ð¹…ÍÍ¥¸¡‘­‘}Õ‘¥¼¹ÁÉ½Ñ½ÑåÁ”°ì(€‘­‘}ÍÑ…ÉÐ ¤ì(€€€‘­‘}ØÀÑÕ‘¥½=É¥¥¹…°¹‘­‘}ÍÑ…ÉÐ¹…±°¡Ñ¡¥Ì¤ì(€€€¥˜€ …Ñ¡¥Ì¹‘­‘}½¹Ñ•áÐñðÑ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ5ÕÍ¥Œ¤É•ÑÕÉ¸ì(€€€½¹ÍÐ‘­‘}¹½Ü€ôÑ¡¥Ì¹‘­‘}½¹Ñ•áÐ¹ÕÉÉ•¹ÑQ¥µ”ì(€€€Ñ¡¥Ì¹‘­‘}µÕÍ¥Œ¹…¥¸¹Í•ÑY…±Õ•ÑQ¥µ” À°‘­‘}¹½Ü¤ì(€€€Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ5ÕÍ¥Œ€ôÑ¡¥Ì¹‘­‘}½¹Ñ•áÐ¹É•…Ñ•…¥¸ ¤ì(€€€Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•5ÕÍ¥Œ€ôÑ¡¥Ì¹‘­‘}½¹Ñ•áÐ¹É•…Ñ•…¥¸ ¤ì(€€€Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ5ÕÍ¥Œ¹…¥¸¹Ù…±Õ”€ô€Àì(€€€Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•5ÕÍ¥Œ¹…¥¸¹Ù…±Õ”€ô€Àì(€€€Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ5ÕÍ¥Œ¹½¹¹•Ð¡Ñ¡¥Ì¹‘­‘}µ…ÍÑ•È¤ì(€€€Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•5ÕÍ¥Œ¹½¹¹•Ð¡Ñ¡¥Ì¹‘­‘}µ…ÍÑ•È¤ì(€€€Ñ¡¥Ì¹‘­‘}ØÀÑM•¹”€ô€µ•¹Ôœì(€€€Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ	•…Ð€ô€Àì(€€€Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•	•…Ð€ô€Àì(€€€Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ9•áÐ€ô‘­‘}¹½Ü€¬€¸ÀÔì(€€€Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•9•áÐ€ô‘­‘}¹½Ü€¬€¸ÀÔì(€ô°((€‘­‘}Í•ÑM•¹”¡‘­‘}Í•¹”¤ì(€€€Ñ¡¥Ì¹‘­‘}ÍÑ…ÉÐ ¤ì(€€€½¹ÍÐ‘­‘}¹•áÑM•¹”€ô‘­‘}Í•¹”€ôôô€‘É¥Ù”œ€ü€‘É¥Ù”œ€è€µ•¹Ôœì(€€€¥˜€¡Ñ¡¥Ì¹‘­‘}ØÀÑM•¹”€ôôô‘­‘}¹•áÑM•¹”¤É•ÑÕÉ¸ì(€€€Ñ¡¥Ì¹‘­‘}ØÀÑM•¹”€ô‘­‘}¹•áÑM•¹”ì(€€€¥˜€ …Ñ¡¥Ì¹‘­‘}½¹Ñ•áÐ¤É•ÑÕÉ¸ì(€€€½¹ÍÐ‘­‘}¹½Ü€ôÑ¡¥Ì¹‘­‘}½¹Ñ•áÐ¹ÕÉÉ•¹ÑQ¥µ”ì(€€€¥˜€¡‘­‘}¹•áÑM•¹”€ôôô€‘É¥Ù”œ¤ì(€€€€€Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•9•áÐ€ô‘­‘}¹½Ü€¬€¸ÀÐì(€€€€€Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•	•…Ð€ô€Àì(€€€ô•±Í”ì(€€€€€Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ9•áÐ€ô‘­‘}¹½Ü€¬€¸ÀÐì(€€€€€Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ	•…Ð€ô€Àì(€€€ô(€ô°((€‘­‘}•™™•Ð¡‘­‘}­¥¹¤ì(€€€Ñ¡¥Ì¹‘­‘}ÍÑ…ÉÐ ¤ì(€€€¥˜€ …Ñ¡¥Ì¹‘­‘}½¹Ñ•áÐñðÑ¡¥Ì¹‘­‘}µÕÑ•¤É•ÑÕÉ¸ì(€€€½¹ÍÐ‘­‘}¹½Ü€ôÑ¡¥Ì¹‘­‘}½¹Ñ•áÐ¹ÕÉÉ•¹ÑQ¥µ”ì(€€€¥˜€¡‘­‘}­¥¹€ôôô€ÍÕ•ÍÌœ¤ì(€€€€€Ñ¡¥Ì¹‘­‘}¹½Ñ” ÔÈÌ¸ÈÔ°€¸Äà°€¸ÄØ°€ÑÉ¥…¹±”œ°Ñ¡¥Ì¹‘­‘}•™™•ÑÌ°‘­‘}¹½Ü¤ì(€€€€€Ñ¡¥Ì¹‘­‘}¹½Ñ” ÜàÌ¸ää°€¸ÈØ°€¸ÄÐ°€Í¥¹”œ°Ñ¡¥Ì¹‘­‘}•™™•ÑÌ°‘­‘}¹½Ü€¬€¸Àà¤ì(€€€€€Ñ¡¥Ì¹‘­‘}¹½Ñ” ÄÀÐØ¸Ô°€¸ÐÈ°€¸ÄÈ°€Í¥¹”œ°Ñ¡¥Ì¹‘­‘}•™™•ÑÌ°‘­‘}¹½Ü€¬€¸ÄØ¤ì(€€€€€Ñ¡¥Ì¹‘­‘}¹½Ñ” ÄÌÀ¸àÄ°€¸ÌÈ°€¸ÄÈ°€ÑÉ¥…¹±”œ°Ñ¡¥Ì¹‘­‘}•™™•ÑÌ°‘­‘}¹½Ü¤ì(€€€€€É•ÑÕÉ¸ì(€€€ô(€€€¥˜€¡‘­‘}­¥¹€ôôô€‘¥¹œœ¤ì(€€€€€Ñ¡¥Ì¹‘­‘}¹½Ñ” ØÔä¸ÈÔ°€¸ÄÈ°€¸ÄÌ°€ÑÉ¥…¹±”œ°Ñ¡¥Ì¹‘­‘}•™™•ÑÌ°‘­‘}¹½Ü¤ì(€€€€€Ñ¡¥Ì¹‘­‘}¹½Ñ” äàÜ¸ÜÜ°€¸Äà°€¸Àà°€Í¥¹”œ°Ñ¡¥Ì¹‘­‘}•™™•ÑÌ°‘­‘}¹½Ü€¬€¸ÀÔÔ¤ì(€€€€€É•ÑÕÉ¸ì(€€€ô(€€€¥˜€¡‘­‘}­¥¹€ôôô€¡¥Ðœ¤ì(€€€€€Ñ¡¥Ì¹‘­‘}¹½Ñ” ÜÌ¸ÐÈ°€¸ÈÐ°€¸Ì°€Í…ÝÑ½½Ñ œ°Ñ¡¥Ì¹‘­‘}•™™•ÑÌ°‘­‘}¹½Ü¤ì(€€€€€Ñ¡¥Ì¹‘­‘}¹½Ñ” ÄÄÀ°€¸Àä°€¸ÄØ°€ÍÅÕ…É”œ°Ñ¡¥Ì¹‘­‘}•™™•ÑÌ°‘­‘}¹½Ü€¬€¸ÀÈÔ¤ì(€€€€€É•ÑÕÉ¸ì(€€€ô(€€€‘­‘}ØÀÑÕ‘¥½=É¥¥¹…°¹‘­‘}•™™•Ð¹…±°¡Ñ¡¥Ì°‘­‘}­¥¹¤ì(€ô°((€‘­‘}ÕÁ‘…Ñ”¡‘­‘}ÉÕ¸¤ì(€€€¥˜€ …Ñ¡¥Ì¹‘­‘}½¹Ñ•áÐñðÑ¡¥Ì¹‘­‘}½¹Ñ•áÐ¹ÍÑ…Ñ”€„ôô€ÉÕ¹¹¥¹œœ¤É•ÑÕÉ¸ì(€€€Ñ¡¥Ì¹‘­‘}ÍÑ…ÉÐ ¤ì(€€€½¹ÍÐ‘­‘}¹½Ü€ôÑ¡¥Ì¹‘­‘}½¹Ñ•áÐ¹ÕÉÉ•¹ÑQ¥µ”ì(€€€½¹ÍÐ‘­‘}µÕÍ¥1•Ù•°€ô‘­‘}±…µÀ¡9Õµ‰•È¡Ñ¡¥Ì¹‘­‘}ÍÑ…Ñ”¹‘­‘}Í•ÑÑ¥¹Ì¹‘­‘}µÕÍ¥Œ¤ñð€À°€À°€Ä¤ì(€€€½¹ÍÐ‘­‘}•™™•Ñ1•Ù•°€ô‘­‘}±…µÀ¡9Õµ‰•È¡Ñ¡¥Ì¹‘­‘}ÍÑ…Ñ”¹‘­‘}Í•ÑÑ¥¹Ì¹‘­‘}•™™•ÑÌ¤ñð€À°€À°€Ä¤ì(€€€Ñ¡¥Ì¹‘­‘}•™™•ÑÌ¹…¥¸¹Í•ÑQ…É•ÑÑQ¥µ”¡‘­‘}•™™•Ñ1•Ù•°°‘­‘}¹½Ü°€¸ÀÔ¤ì(€€€Ñ¡¥Ì¹‘­‘}µÕÍ¥Œ¹…¥¸¹Í•ÑQ…É•ÑÑQ¥µ” À°‘­‘}¹½Ü°€¸ÀÌ¤ì(€€€½¹ÍÐ‘­‘}‘É¥Ù•M•¹”€ôÑ¡¥Ì¹‘­‘}ØÀÑM•¹”€ôôô€‘É¥Ù”œì(€€€Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ5ÕÍ¥Œ¹…¥¸¹Í•ÑQ…É•ÑÑQ¥µ”¡‘­‘}‘É¥Ù•M•¹”€ü€À€è‘­‘}µÕÍ¥1•Ù•°€¨€¸ÜÈ°‘­‘}¹½Ü°€¸ÈÈ¤ì(€€€Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•5ÕÍ¥Œ¹…¥¸¹Í•ÑQ…É•ÑÑQ¥µ”¡‘­‘}‘É¥Ù•M•¹”€ü‘­‘}µÕÍ¥1•Ù•°€è€À°‘­‘}¹½Ü°€¸ÈÈ¤ì((€€€½¹ÍÐ‘­‘}…Ñ¥Ù”€ô‘­‘}ÉÕ¸€˜˜€…‘­‘}ÉÕ¸¹‘­‘}Á…ÕÍ•€˜˜€…‘­‘}ÉÕ¸¹‘­‘}™¥¹¥Í¡•€˜˜€…‘­‘}ÉÕ¸¹‘­‘}™…¥±•ì(€€€Ñ¡¥Ì¹‘­‘}µ½Ñ½É…¥¸¹…¥¸¹Í•ÑQ…É•ÑÑQ¥µ”¡‘­‘}…Ñ¥Ù”€ü€¸ÀÄÐ€¬‘­‘}ÉÕ¸¹‘­‘}ÍÁ••€¨€¸ÀÀÐ€è€À°‘­‘}¹½Ü°€¸Àà¤ì(€€€Ñ¡¥Ì¹‘­‘}µ½Ñ½È¹™É•ÅÕ•¹ä¹Í•ÑQ…É•ÑÑQ¥µ”¡‘­‘}…Ñ¥Ù”€ü€ÐÐ€¬‘­‘}ÉÕ¸¹‘­‘}ÍÁ••€¨€Ô¸È€è€ÐÐ°‘­‘}¹½Ü°€¸ÀÜ¤ì(€€€Ñ¡¥Ì¹‘­‘}É…¥¹…¥¸¹…¥¸¹Í•ÑQ…É•ÑÑQ¥µ”¡‘­‘}…Ñ¥Ù”€ü‘­‘}ÉÕ¸¹‘­‘}Ý•…Ñ¡•È¹‘­‘}É…¥¸€¨€¸Ð€¬5…Ñ ¹…‰Ì¡‘­‘}ÉÕ¸¹‘­‘}Ý•…Ñ¡•È¹‘­‘}Ý¥¹ñð€À¤€¨€¸ÀÄÈ€è€À°‘­‘}¹½Ü°€¸Ì¤ì((€€€¥˜€ …‘­‘}‘É¥Ù•M•¹”¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ9•áÐ€ð‘­‘}¹½Ü€´€¸Ü¤Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ9•áÐ€ô‘­‘}¹½Ü€¬€¸ÀÐì(€€€€€½¹ÍÐ‘­‘}É½½ÑÌ€ôlÄÄÀ°€ÄÐØ¸àÌ°€ÄÌÀ¸àÄ°€ÄØÐ¸àÅtì(€€€€€Ý¡¥±”€¡Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ9•áÐ€ð‘­‘}¹½Ü€¬€¸ÄÈ¤ì(€€€€€€€½¹ÍÐ‘­‘}É½½Ð€ô‘­‘}É½½ÑÍm5…Ñ ¹™±½½È¡Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ	•…Ð€¼€à¤€”‘­‘}É½½ÑÌ¹±•¹Ñ¡tì(€€€€€€€¥˜€¡Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ	•…Ð€”€Ð€ôôô€À¤Ñ¡¥Ì¹‘­‘}¹½Ñ”¡‘­‘}É½½Ð°€¸ÜÈ°€¸Àä°€Í¥¹”œ°Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ5ÕÍ¥Œ°Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ9•áÐ¤ì(€€€€€€€¥˜€¡Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ	•…Ð€”€à€ôôô€À¤Ñ¡¥Ì¹‘­‘}¹½Ñ”¡‘­‘}É½½Ð€¼€È°€Ä¸Ô°€¸ÀÔÔ°€ÑÉ¥…¹±”œ°Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ5ÕÍ¥Œ°Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ9•áÐ¤ì(€€€€€€€¥˜€¡Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ	•…Ð€”€Ð€ôôô€È¤Ñ¡¥Ì¹‘­‘}¹½Ñ”¡‘­‘}É½½Ð€¨€È°€¸ÌÈ°€¸ÀÌÔ°€ÑÉ¥…¹±”œ°Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ5ÕÍ¥Œ°Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ9•áÐ¤ì(€€€€€€€Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ	•…Ð¬¬ì(€€€€€€€Ñ¡¥Ì¹‘­‘}ØÀÑ5•¹Õ9•áÐ€¬ô€¸ÌÐì(€€€€€ô(€€€€€É•ÑÕÉ¸ì(€€€ô((€€€½¹ÍÐ‘­‘}Í•ÑÌ€ôl(€€€€€lÄÄÀ°€ÄÌÀ¸àÄ°€ÄØÐ¸àÄ°€ÄÐØ¸àÍt°(€€€€€läà°€ÄÄØ¸ÔÐ°€ÄÐØ¸àÌ°€ÄÌÀ¸àÅt°(€€€€€lÄÌÀ¸àÄ°€ÄÔÔ¸ÔØ°€ÄäØ°€ÄÜÐ¸ØÅt°(€€€€€lÄÈÌ¸ÐÜ°€ÄÐØ¸àÌ°€ÄàÔ°€ÄØÐ¸àÅt°(€€€€€làÜ¸ÌÄ°€ÄÀÌ¸àÌ°€ÄÌÀ¸àÄ°€ÄÄØ¸ÔÑt°(€€€tì(€€€½¹ÍÐ‘­‘}¹½Ñ•Ì€ô‘­‘}Í•ÑÍm5…Ñ ¹…‰Ì¡9Õµ‰•È¡Ñ¡¥Ì¹‘­‘}ÑÉ…¬¤ñð€À¤€”‘­‘}Í•ÑÌ¹±•¹Ñ¡tì(€€€¥˜€¡Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•9•áÐ€ð‘­‘}¹½Ü€´€¸Ü¤Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•9•áÐ€ô‘­‘}¹½Ü€¬€¸ÀÐì(€€€Ý¡¥±”€¡Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•9•áÐ€ð‘­‘}¹½Ü€¬€¸ÄÈ¤ì(€€€€€½¹ÍÐ‘­‘}É½½Ð€ô‘­‘}¹½Ñ•Ím5…Ñ ¹™±½½È¡Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•	•…Ð€¼€ÄØ¤€”€Ñtì(€€€€€¥˜€¡Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•	•…Ð€”€Ð€ôôô€À¤ì(€€€€€€€Ñ¡¥Ì¹‘­‘}¹½Ñ”¡‘­‘}É½½Ð€¼€È°€¸ÌÐ°€¸ÄÔ°€Í¥¹”œ°Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•5ÕÍ¥Œ°Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•9•áÐ¤ì(€€€€€€€Ñ¡¥Ì¹‘­‘}¹½Ñ” Ðä°€¸ÄÈ°€¸ÄÐ°€ÑÉ¥…¹±”œ°Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•5ÕÍ¥Œ°Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•9•áÐ¤ì(€€€€€ô(€€€€€¥˜€¡Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•	•…Ð€”€È€ôôô€À¤Ñ¡¥Ì¹‘­‘}¹½Ñ”¡‘­‘}É½½Ð€¨lÈ°Ì°È¸Ô°Ñum5…Ñ ¹™±½½È¡Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•	•…Ð€¼€È¤€”€Ñt°€¸Äà°€¸ÀÌÔ°€ÑÉ¥…¹±”œ°Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•5ÕÍ¥Œ°Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•9•áÐ¤ì(€€€€€¥˜€¡Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•	•…Ð€”€à€ôôô€Ð¤Ñ¡¥Ì¹‘­‘}¹½Ñ” ÄäØ°€¸ÀÔÔ°€¸ÀÐÔ°€ÍÅÕ…É”œ°Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•5ÕÍ¥Œ°Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•9•áÐ¤ì(€€€€€Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•	•…Ð¬¬ì(€€€€€Ñ¡¥Ì¹‘­‘}ØÀÑÉ¥Ù•9•áÐ€¬ô€¸ÄàÔì(€€€ô(€ô°((€‘­‘}Á…ÕÍ”¡‘­‘}Á…ÕÍ•¤ì(€€€‘­‘}ØÀÑÕ‘¥½=É¥¥¹…°¹‘­‘}Á…ÕÍ”¹…±°¡Ñ¡¥Ì°‘­‘}Á…ÕÍ•¤ì(€ô°)ô¤ì(
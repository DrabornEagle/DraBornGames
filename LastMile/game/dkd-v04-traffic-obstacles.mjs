// DraBornGo / Last Mile v0.4 traffic, obstacle and continuous-audio hotfix.
// Loaded last so these rules are authoritative for the current Expo Go build.

const dkd_v04TrafficPreviousAudioStart = dkd_Audio.prototype.dkd_start;
const dkd_v04TrafficPreviousSceneBuildTraffic = dkd_Scene.prototype.dkd_buildTraffic;
const dkd_v04TrafficPreviousSetRoute = dkd_Scene.prototype.dkd_setRoute;
const dkd_v04TrafficPreviousFrame = dkd_Game.prototype.dkd_frame;
const dkd_v04TrafficBaseInitTraffic = dkd_initTraffic;
const dkd_v04TrafficBaseStepRun = dkd_stepRun;

function dkd_v04TrafficInstallStyles() {
  if (document.getElementById('dkd-v04-traffic-obstacles-style')) return;
  const dkd_style = document.createElement('style');
  dkd_style.id = 'dkd-v04-traffic-obstacles-style';
  dkd_style.textContent = `
    .dkd-home-header .dkd-profile-pills{margin-top:52px!important;margin-bottom:6px!important}
    .dkd-v04-brand-pills{display:grid!important;grid-template-columns:max-content max-content!important;align-items:center!important;justify-content:start!important;gap:8px!important}
    .dkd-v04-brand-pills>span:nth-child(1){grid-column:1 / 3!important;justify-self:start}
    .dkd-v04-brand-pills>span:nth-child(2){grid-column:1!important}
    .dkd-v04-brand-pills>span:nth-child(3){grid-column:2!important}
    @media(max-height:760px){.dkd-home-header .dkd-profile-pills{margin-top:44px!important}}
    @media(max-width:370px){.dkd-v04-brand-pills{grid-template-columns:max-content minmax(0,1fr)!important}.dkd-v04-brand-pills>span{font-size:10px!important}}
  `;
  document.head.appendChild(dkd_style);
}

dkd_v04TrafficInstallStyles();

function dkd_v04TrafficSoftClip(dkd_value) {
  return dkd_value / (1 + Math.abs(dkd_value) * .72);
}

function dkd_v04TrafficNoise(dkd_index, dkd_seed) {
  let dkd_value = Math.imul((dkd_index + 1) ^ dkd_seed, 1597334677);
  dkd_value ^= dkd_value >>> 13;
  dkd_value = Math.imul(dkd_value, 3812015801);
  dkd_value ^= dkd_value >>> 16;
  return ((dkd_value >>> 0) / 2147483648) - 1;
}

function dkd_v04TrafficCreateMusicBuffer(dkd_context, dkd_kind) {
  const dkd_sampleRate = dkd_context.sampleRate;
  const dkd_drive = dkd_kind === 'drive';
  const dkd_bpm = dkd_drive ? 128 : 96;
  const dkd_beats = 16;
  const dkd_seconds = dkd_beats * 60 / dkd_bpm;
  const dkd_length = Math.max(1, Math.floor(dkd_sampleRate * dkd_seconds));
  const dkd_buffer = dkd_context.createBuffer(1, dkd_length, dkd_sampleRate);
  const dkd_data = dkd_buffer.getChannelData(0);
  const dkd_roots = dkd_drive ? [55, 65.41, 49, 73.42] : [73.42, 58.27, 87.31, 65.41];
  const dkd_tau = Math.PI * 2;

  for (let dkd_index = 0; dkd_index < dkd_length; dkd_index++) {
    const dkd_time = dkd_index / dkd_sampleRate;
    const dkd_beat = dkd_time * dkd_bpm / 60;
    const dkd_beatIndex = Math.floor(dkd_beat);
    const dkd_beatPhase = dkd_beat - dkd_beatIndex;
    const dkd_eighth = dkd_beat * 2;
    const dkd_eighthIndex = Math.floor(dkd_eighth);
    const dkd_eighthPhase = dkd_eighth - dkd_eighthIndex;
    const dkd_sixteenth = dkd_beat * 4;
    const dkd_sixteenthIndex = Math.floor(dkd_sixteenth);
    const dkd_sixteenthPhase = dkd_sixteenth - dkd_sixteenthIndex;
    const dkd_root = dkd_roots[Math.floor(dkd_beatIndex / 4) % dkd_roots.length];
    let dkd_sample = 0;

    if (dkd_drive) {
      const dkd_kickEnvelope = Math.exp(-dkd_beatPhase * 17);
      const dkd_kickFrequency = 46 + 30 * Math.exp(-dkd_beatPhase * 20);
      dkd_sample += Math.sin(dkd_tau * dkd_kickFrequency * dkd_time) * dkd_kickEnvelope * .31;

      const dkd_bassSequence = [1, 1, 1.5, 1, 1.25, 1, 2, 1.5];
      const dkd_bassFrequency = dkd_root * dkd_bassSequence[dkd_eighthIndex % dkd_bassSequence.length];
      const dkd_bassEnvelope = .45 + .55 * Math.exp(-dkd_eighthPhase * 4.5);
      dkd_sample += Math.sin(dkd_tau * dkd_bassFrequency * dkd_time) * dkd_bassEnvelope * .20;
      dkd_sample += Math.sin(dkd_tau * dkd_bassFrequency * 2 * dkd_time) * dkd_bassEnvelope * .055;

      const dkd_arpSequence = [2, 3, 4, 5, 3, 4, 6, 5, 2.5, 4, 5, 6, 3, 5, 6, 8];
      const dkd_arpFrequency = dkd_root * dkd_arpSequence[dkd_sixteenthIndex % dkd_arpSequence.length];
      const dkd_arpEnvelope = Math.exp(-dkd_sixteenthPhase * 7.5);
      const dkd_arpPhase = Math.sin(dkd_tau * dkd_arpFrequency * dkd_time);
      dkd_sample += Math.tanh(dkd_arpPhase * 2.5) * dkd_arpEnvelope * .072;

      const dkd_snareBeat = dkd_beatIndex % 4;
      if (dkd_snareBeat === 1 || dkd_snareBeat === 3) {
        dkd_sample += dkd_v04TrafficNoise(dkd_index, 9409) * Math.exp(-dkd_beatPhase * 15) * .10;
      }
      const dkd_hatPhase = (dkd_beat * 4) % 1;
      dkd_sample += dkd_v04TrafficNoise(dkd_index, 5719) * Math.exp(-dkd_hatPhase * 26) * .022;

      const dkd_padEnvelope = .62 + .38 * Math.sin(dkd_tau * dkd_time / dkd_seconds);
      dkd_sample += Math.sin(dkd_tau * dkd_root * 2 * dkd_time) * dkd_padEnvelope * .035;
      dkd_sample += Math.sin(dkd_tau * dkd_root * 2.5 * dkd_time) * dkd_padEnvelope * .024;
    } else {
      const dkd_padPulse = .72 + .28 * Math.sin(dkd_tau * dkd_time / dkd_seconds);
      dkd_sample += Math.sin(dkd_tau * dkd_root * dkd_time) * dkd_padPulse * .13;
      dkd_sample += Math.sin(dkd_tau * dkd_root * 1.5 * dkd_time) * dkd_padPulse * .075;
      dkd_sample += Math.sin(dkd_tau * dkd_root * 2 * dkd_time) * dkd_padPulse * .042;

      const dkd_pluckSequence = [2, 2.5, 3, 4, 3, 2.5, 4, 5];
      const dkd_pluckFrequency = dkd_root * dkd_pluckSequence[dkd_eighthIndex % dkd_pluckSequence.length];
      const dkd_pluckEnvelope = Math.exp(-dkd_eighthPhase * 6.2);
      dkd_sample += Math.sin(dkd_tau * dkd_pluckFrequency * dkd_time) * dkd_pluckEnvelope * .105;
      dkd_sample += Math.sin(dkd_tau * dkd_pluckFrequency * 2 * dkd_time) * dkd_pluckEnvelope * .026;

      const dkd_softKick = Math.exp(-dkd_beatPhase * 15);
      dkd_sample += Math.sin(dkd_tau * 48 * dkd_time) * dkd_softKick * .12;
      if (dkd_beatIndex % 4 === 2) dkd_sample += dkd_v04TrafficNoise(dkd_index, 4211) * Math.exp(-dkd_beatPhase * 18) * .035;
    }

    dkd_data[dkd_index] = dkd_v04TrafficSoftClip(dkd_sample);
  }
  return dkd_buffer;
}

function dkd_v04TrafficEnsureLoopMusic(dkd_audio) {
  if (!dkd_audio?.dkd_context || dkd_audio.dkd_v04LoopMusicReady) return;
  if (!dkd_audio.dkd_v04MenuMusic || !dkd_audio.dkd_v04DriveMusic) return;

  dkd_v04StopMusicVoices(dkd_audio);
  const dkd_menuSource = dkd_audio.dkd_context.createBufferSource();
  const dkd_driveSource = dkd_audio.dkd_context.createBufferSource();
  dkd_menuSource.buffer = dkd_v04TrafficCreateMusicBuffer(dkd_audio.dkd_context, 'menu');
  dkd_driveSource.buffer = dkd_v04TrafficCreateMusicBuffer(dkd_audio.dkd_context, 'drive');
  dkd_menuSource.loop = true;
  dkd_driveSource.loop = true;
  dkd_menuSource.connect(dkd_audio.dkd_v04MenuMusic);
  dkd_driveSource.connect(dkd_audio.dkd_v04DriveMusic);
  const dkd_now = dkd_audio.dkd_context.currentTime;
  dkd_menuSource.start(dkd_now);
  dkd_driveSource.start(dkd_now);
  dkd_audio.dkd_v04MenuLoopSource = dkd_menuSource;
  dkd_audio.dkd_v04DriveLoopSource = dkd_driveSource;
  dkd_audio.dkd_v04LoopMusicReady = true;
  dkd_audio.dkd_v04Mode = 'menu-continuous';
  dkd_audio.dkd_tracks = ['Ankara Gece Hattı', 'Şehir Akışı', 'Yağmur Altında', 'Gece Vardiyası', 'Son Kilometre'];
}

dkd_Audio.prototype.dkd_start = function dkd_v04TrafficAudioStart() {
  dkd_v04TrafficPreviousAudioStart.call(this);
  dkd_v04TrafficEnsureLoopMusic(this);
};

// dkd_v04Render calls this on every page render. Keep one stable mode name so UI clicks never reset the song.
dkd_v04ApplyMusicMode = function dkd_v04ContinuousMusicMode(dkd_audio, dkd_drive) {
  if (!dkd_audio?.dkd_context || !dkd_audio.dkd_v04MenuMusic || !dkd_audio.dkd_v04DriveMusic) return;
  dkd_v04TrafficEnsureLoopMusic(dkd_audio);
  const dkd_now = dkd_audio.dkd_context.currentTime;
  const dkd_setting = dkd_clamp(Number(dkd_audio.dkd_state?.dkd_settings?.dkd_music) || 0, 0, 1);
  const dkd_menuVolume = Math.min(1.28, dkd_setting * 1.62);
  const dkd_driveVolume = Math.min(1.42, dkd_setting * 1.78);
  dkd_audio.dkd_v04Mode = dkd_drive ? 'drive-continuous' : 'menu-continuous';
  dkd_audio.dkd_v04MenuMusic.gain.setTargetAtTime(dkd_drive ? 0 : dkd_menuVolume, dkd_now, .10);
  dkd_audio.dkd_v04DriveMusic.gain.setTargetAtTime(dkd_drive ? dkd_driveVolume : 0, dkd_now, .10);
};

dkd_Audio.prototype.dkd_update = function dkd_v04TrafficAudioUpdate(dkd_run) {
  if (!this.dkd_context || this.dkd_context.state !== 'running') return;
  dkd_v04TrafficEnsureLoopMusic(this);
  if (this.dkd_v04MusicVoices?.size) dkd_v04StopMusicVoices(this);
  const dkd_active = Boolean(dkd_run && !dkd_run.dkd_paused && !dkd_run.dkd_finished && !dkd_run.dkd_failed);
  const dkd_now = this.dkd_context.currentTime;
  this.dkd_master.gain.setTargetAtTime(.82, dkd_now, .12);
  this.dkd_effects.gain.setTargetAtTime(dkd_clamp(Number(this.dkd_state.dkd_settings.dkd_effects) || 0, 0, 1), dkd_now, .06);
  this.dkd_motorGain.gain.setTargetAtTime(dkd_active ? .015 + dkd_run.dkd_speed * .0037 : 0, dkd_now, .06);
  this.dkd_motor.frequency.setTargetAtTime(dkd_active ? 44 + dkd_run.dkd_speed * 5.25 : 44, dkd_now, .06);
  this.dkd_rainGain.gain.setTargetAtTime(
    dkd_active ? dkd_run.dkd_weather.dkd_rain * .40 + Math.abs(dkd_run.dkd_weather.dkd_wind || 0) * .010 : 0,
    dkd_now,
    .18,
  );
  dkd_v04ApplyMusicMode(this, dkd_active);
};

// Raise traffic capacity before the Scene instance is constructed.
dkd_Scene.prototype.dkd_buildTraffic = function dkd_v04TrafficBuildTraffic() {
  this.dkd_trafficGroup = new dkd_three.Group();
  this.dkd_scene.add(this.dkd_trafficGroup);
  this.dkd_trafficParts = [];
  const dkd_capacity = 64;
  const dkd_parts = [
    { dkd_size: [1.65, .62, 3.8], dkd_at: [0, .70, 0], dkd_color: '#9fa9b0' },
    { dkd_size: [1.45, .65, 1.95], dkd_at: [0, 1.31, -.1], dkd_color: '#334c60' },
    { dkd_size: [1.4, .15, .06], dkd_at: [0, .83, 1.92], dkd_color: '#f0e7cb', dkd_basic: true },
    { dkd_size: [1.4, .15, .06], dkd_at: [0, .82, -1.92], dkd_color: '#df654d', dkd_basic: true },
  ];
  for (const dkd_side of [-1, 1]) for (const dkd_axle of [-1.18, 1.18]) {
    dkd_parts.push({ dkd_size: [.18, .49, .57], dkd_at: [dkd_side * .83, .36, dkd_axle], dkd_color: '#172027' });
  }
  for (const dkd_part of dkd_parts) {
    const dkd_material = dkd_part.dkd_basic
      ? new dkd_three.MeshBasicMaterial({ color: dkd_part.dkd_color })
      : this.dkd_material(dkd_part.dkd_color, .4, .35);
    const dkd_mesh = new dkd_three.InstancedMesh(new dkd_three.BoxGeometry(...dkd_part.dkd_size), dkd_material, dkd_capacity);
    dkd_mesh.frustumCulled = false;
    dkd_mesh.count = 0;
    this.dkd_trafficGroup.add(dkd_mesh);
    this.dkd_trafficParts.push({ dkd_mesh, dkd_at: dkd_part.dkd_at });
  }
};

// Existing routes used 32 cars. Keep at least 54 active city vehicles.
dkd_initTraffic = function dkd_v04DenseTraffic(dkd_run, dkd_graph, dkd_count = 24) {
  return dkd_v04TrafficBaseInitTraffic(dkd_run, dkd_graph, Math.max(Number(dkd_count) || 0, 54));
};

function dkd_v04TrafficRouteKey(dkd_run) {
  return Array.isArray(dkd_run?.dkd_route?.dkd_nodes) ? dkd_run.dkd_route.dkd_nodes.join('.') : '';
}

function dkd_v04TrafficGenerateObstacles(dkd_run, dkd_graph) {
  const dkd_routeKey = dkd_v04TrafficRouteKey(dkd_run);
  if (!dkd_routeKey) return [];
  const dkd_random = dkd_rng((Number(dkd_run.dkd_order?.dkd_seed) || 571) + 14041 + dkd_routeKey.length * 17);
  const dkd_candidates = [];
  const dkd_nodes = dkd_run.dkd_route.dkd_nodes;

  for (let dkd_index = 2; dkd_index < dkd_nodes.length - 2; dkd_index++) {
    const dkd_start = dkd_graph.dkd_points[dkd_nodes[dkd_index - 1]];
    const dkd_end = dkd_graph.dkd_points[dkd_nodes[dkd_index]];
    const dkd_length = dkd_distance(dkd_start, dkd_end);
    if (dkd_length < 20) continue;
    dkd_candidates.push({ dkd_index, dkd_start, dkd_end, dkd_length });
  }

  for (let dkd_index = dkd_candidates.length - 1; dkd_index > 0; dkd_index--) {
    const dkd_swap = Math.floor(dkd_random() * (dkd_index + 1));
    [dkd_candidates[dkd_index], dkd_candidates[dkd_swap]] = [dkd_candidates[dkd_swap], dkd_candidates[dkd_index]];
  }

  const dkd_targetCount = Math.min(9, Math.max(5, Math.ceil(dkd_nodes.length / 9)));
  const dkd_obstacles = [];
  for (const dkd_candidate of dkd_candidates.slice(0, dkd_targetCount)) {
    const dkd_fraction = .32 + dkd_random() * .38;
    const dkd_heading = Math.atan2(
      dkd_candidate.dkd_end[0] - dkd_candidate.dkd_start[0],
      dkd_candidate.dkd_end[1] - dkd_candidate.dkd_start[1],
    );
    const dkd_center = [
      dkd_candidate.dkd_start[0] + (dkd_candidate.dkd_end[0] - dkd_candidate.dkd_start[0]) * dkd_fraction,
      dkd_candidate.dkd_start[1] + (dkd_candidate.dkd_end[1] - dkd_candidate.dkd_start[1]) * dkd_fraction,
    ];
    const dkd_near = dkd_nearestRoad(dkd_graph, dkd_center);
    const dkd_width = Math.max(6, Number(dkd_near?.dkd_edge?.dkd_width) || 8);
    const dkd_side = dkd_random() > .5 ? 1 : -1;
    const dkd_lateral = dkd_side * Math.min(2.15, Math.max(1.15, dkd_width * .18));
    const dkd_typeRoll = dkd_random();
    const dkd_type = dkd_typeRoll < .34 ? 'barrier' : dkd_typeRoll < .68 ? 'cones' : 'crate';
    dkd_obstacles.push({
      dkd_id: `dkd_obstacle_${dkd_candidate.dkd_index}_${dkd_obstacles.length}`,
      dkd_type,
      dkd_position: [
        dkd_center[0] + Math.cos(dkd_heading) * dkd_lateral,
        dkd_center[1] - Math.sin(dkd_heading) * dkd_lateral,
      ],
      dkd_heading,
      dkd_radius: dkd_type === 'barrier' ? 1.65 : dkd_type === 'cones' ? 1.15 : 1.05,
      dkd_severity: .72 + dkd_random() * .48,
      dkd_hitAt: -999,
    });
  }
  dkd_run.dkd_obstacles = dkd_obstacles;
  dkd_run.dkd_obstacleRouteKey = dkd_routeKey;
  return dkd_obstacles;
}

function dkd_v04TrafficDisposeGroup(dkd_group) {
  if (!dkd_group) return;
  dkd_group.traverse(dkd_object => {
    if (!dkd_object.isMesh) return;
    try { dkd_object.geometry?.dispose(); } catch {}
    try { dkd_object.material?.dispose(); } catch {}
  });
  dkd_group.clear();
}

function dkd_v04TrafficDrawObstacles(dkd_scene, dkd_run) {
  if (!dkd_scene.dkd_obstacleGroup) {
    dkd_scene.dkd_obstacleGroup = new dkd_three.Group();
    dkd_scene.dkd_world.add(dkd_scene.dkd_obstacleGroup);
  }
  dkd_v04TrafficDisposeGroup(dkd_scene.dkd_obstacleGroup);

  for (const dkd_obstacle of dkd_run.dkd_obstacles || []) {
    const dkd_group = new dkd_three.Group();
    dkd_group.position.set(dkd_obstacle.dkd_position[0], .02, dkd_obstacle.dkd_position[1]);
    dkd_group.rotation.y = dkd_obstacle.dkd_heading;
    dkd_scene.dkd_obstacleGroup.add(dkd_group);

    if (dkd_obstacle.dkd_type === 'barrier') {
      dkd_scene.dkd_box(dkd_group, [3.0, .62, .42], [0, .72, 0], dkd_scene.dkd_material('#e58a43', .48, .08));
      dkd_scene.dkd_box(dkd_group, [2.45, .10, .46], [0, .72, .23], new dkd_three.MeshBasicMaterial({ color: '#f4e9c6' }));
      for (const dkd_side of [-1, 1]) dkd_scene.dkd_box(dkd_group, [.18, 1.05, .18], [dkd_side * 1.18, .45, 0], dkd_scene.dkd_material('#454b53'));
    } else if (dkd_obstacle.dkd_type === 'cones') {
      for (const dkd_side of [-.62, 0, .62]) {
        const dkd_cone = new dkd_three.Mesh(new dkd_three.ConeGeometry(.34, .86, 10), dkd_scene.dkd_material('#ef7f43', .62, .02));
        dkd_cone.position.set(dkd_side, .45, 0);
        dkd_group.add(dkd_cone);
        dkd_scene.dkd_box(dkd_group, [.62, .08, .62], [dkd_side, .06, 0], dkd_scene.dkd_material('#262d34'));
      }
    } else {
      dkd_scene.dkd_box(dkd_group, [1.25, 1.15, 1.25], [0, .59, 0], dkd_scene.dkd_material('#9c6c3c', .82, .01));
      dkd_scene.dkd_box(dkd_group, [1.31, .10, .16], [0, .61, .64], new dkd_three.MeshBasicMaterial({ color: '#e6c58d' }));
    }
  }
}

dkd_Scene.prototype.dkd_setRoute = function dkd_v04TrafficSetRoute(dkd_run) {
  const dkd_result = dkd_v04TrafficPreviousSetRoute.call(this, dkd_run);
  const dkd_routeKey = dkd_v04TrafficRouteKey(dkd_run);
  if (!Array.isArray(dkd_run.dkd_obstacles) || dkd_run.dkd_obstacleRouteKey !== dkd_routeKey) {
    dkd_v04TrafficGenerateObstacles(dkd_run, this.dkd_graph);
  }
  dkd_v04TrafficDrawObstacles(this, dkd_run);
  return dkd_result;
};

function dkd_v04TrafficCargoHealth(dkd_run) {
  return Math.max(0, Math.floor(Math.min(Number(dkd_run?.dkd_quality) || 0, 100 - (Number(dkd_run?.dkd_damage) || 0))));
}

dkd_stepRun = function dkd_v04ObstacleStepRun(dkd_run, dkd_graph, dkd_input, dkd_delta) {
  dkd_v04TrafficBaseStepRun(dkd_run, dkd_graph, dkd_input, dkd_delta);
  if (!dkd_run || dkd_run.dkd_finished) return;

  if (!dkd_run.dkd_failed) {
    for (const dkd_obstacle of dkd_run.dkd_obstacles || []) {
      if (dkd_run.dkd_elapsed - dkd_obstacle.dkd_hitAt < 2.6) continue;
      if (dkd_distance(dkd_run.dkd_position, dkd_obstacle.dkd_position) > dkd_obstacle.dkd_radius + .68) continue;
      const dkd_speedFactor = dkd_clamp(dkd_run.dkd_speed / 11, .25, 1.45);
      const dkd_severity = dkd_clamp(dkd_obstacle.dkd_severity * (.62 + dkd_speedFactor), .55, 1.72);
      if (dkd_hit(dkd_run, dkd_severity)) {
        dkd_obstacle.dkd_hitAt = dkd_run.dkd_elapsed;
        dkd_run.dkd_quality = Math.max(0, dkd_run.dkd_quality - 1.4 * dkd_severity);
        const dkd_health = dkd_v04TrafficCargoHealth(dkd_run);
        dkd_run.dkd_notifications.push({ dkd_title: 'YOL ENGELİ', dkd_text: `Çarpışma kargoya zarar verdi. Kargo bütünlüğü %${dkd_health}.` });
      }
    }
  }

  if (dkd_v04TrafficCargoHealth(dkd_run) <= 0) {
    dkd_run.dkd_failed = 'Kargo bütünlüğü %0. Sipariş otomatik iptal edildi.';
  }
};

dkd_Game.prototype.dkd_frame = function dkd_v04TrafficFrame(dkd_timestamp) {
  const dkd_result = dkd_v04TrafficPreviousFrame.call(this, dkd_timestamp);
  const dkd_run = this.dkd_run;
  if (
    dkd_run?.dkd_failed &&
    dkd_v04TrafficCargoHealth(dkd_run) <= 0 &&
    !dkd_run.dkd_v04CargoFailureSynced
  ) {
    dkd_run.dkd_v04CargoFailureSynced = true;
    const dkd_jobId = String(dkd_run.dkd_order?.dkd_cloudJobId || '');
    if (dkd_jobId) {
      dkd_run.dkd_v04FailedCloudJobId = dkd_jobId;
      this.dkd_send('cloud-cancel-job', { dkd_job_id: dkd_jobId, dkd_reason: 'cargo_destroyed' });
      dkd_run.dkd_order.dkd_cloudJobId = '';
    }
    this.dkd_toast('Kargo %0 · Sipariş iptal edildi.');
  }
  return dkd_result;
};

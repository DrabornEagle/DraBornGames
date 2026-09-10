// DraBornGo / Last Mile v0.5 city-density + audio isolation + company-sign hotfix.
// Loaded after the roadwork/audio layer. Keeps menu and driving MP3 playback mutually exclusive,
// pins the company wall sign to the far screen-left side of the hub, and adds dense Ankara street detail.

const dkd_v05CityAudioPrevious = {
  dkd_audioUpdate: dkd_Audio.prototype.dkd_update,
  dkd_sceneBuildCity: dkd_Scene.prototype.dkd_buildCity,
  dkd_sceneBuildHub: dkd_Scene.prototype.dkd_buildHub,
  dkd_sceneRefreshBrand: dkd_Scene.prototype.dkd_refreshBrand,
  dkd_sceneUpdate: dkd_Scene.prototype.dkd_update,
};

function dkd_v05CityAudioHardSwitch(dkd_audio, dkd_index, dkd_restart = false) {
  if (!dkd_v05RoadAudioEnsure(dkd_audio)) return;
  const dkd_players = dkd_audio.dkd_v05MediaPlayers || [];
  if (!dkd_players.length) return;
  const dkd_safeIndex = Math.max(0, Math.min(dkd_players.length - 1, Number(dkd_index) || 0));
  const dkd_target = dkd_players[dkd_safeIndex];
  const dkd_changed = dkd_audio.dkd_v05MediaCurrentIndex !== dkd_safeIndex || dkd_audio.dkd_v05MediaCurrent !== dkd_target;

  // Cancel the previous 650 ms crossfade. Menu and driving music must never overlap.
  dkd_audio.dkd_v05MediaFadeToken = (Number(dkd_audio.dkd_v05MediaFadeToken) || 0) + 1;
  dkd_players.forEach((dkd_player, dkd_playerIndex) => {
    if (dkd_playerIndex === dkd_safeIndex) return;
    try { dkd_player.pause(); } catch {}
    try { dkd_player.volume = 0; } catch {}
  });

  if (dkd_changed && dkd_restart) {
    try { dkd_target.currentTime = 0; } catch {}
  }
  dkd_audio.dkd_v05MediaCurrent = dkd_target;
  dkd_audio.dkd_v05MediaCurrentIndex = dkd_safeIndex;
  dkd_target.volume = dkd_v05RoadAudioTargetVolume(dkd_audio);
  if (!dkd_audio.dkd_muted && dkd_target.paused) dkd_target.play().catch(() => {});
}

dkd_Audio.prototype.dkd_update = function dkd_v05CityAudioUpdate(dkd_run) {
  // Use the pre-media update chain for motor/rain/effects, then own MP3 selection here.
  const dkd_result = dkd_v05RoadAudioPrevious.dkd_audioUpdate.call(this, dkd_run);
  dkd_v05RoadAudioEnsure(this);
  dkd_v05RoadAudioMuteProcedural(this);

  const dkd_active = Boolean(dkd_run && !dkd_run.dkd_paused && !dkd_run.dkd_finished && !dkd_run.dkd_failed);
  if (dkd_active) {
    const dkd_driveIndex = dkd_v05RoadAudioChooseDrive(this, dkd_run);
    const dkd_globalIndex = dkd_v05RoadAudioDriveGlobalIndex(dkd_driveIndex);
    dkd_v05CityAudioHardSwitch(this, dkd_globalIndex, this.dkd_v05MediaCurrentIndex !== dkd_globalIndex);
  } else if (Number.isFinite(this.dkd_v05MediaPreviewTrack)) {
    const dkd_previewIndex = dkd_v05RoadAudioDriveGlobalIndex(this.dkd_v05MediaPreviewTrack);
    dkd_v05CityAudioHardSwitch(this, dkd_previewIndex, false);
  } else {
    dkd_v05CityAudioHardSwitch(this, dkd_v05RoadAudioMenuIndex(), false);
  }
  return dkd_result;
};

function dkd_v05CityPinCompanySign(dkd_scene) {
  if (!dkd_scene?.dkd_companySign) return;
  // Hub camera is on +X looking toward the centre: negative X is screen-left.
  // -6.25 deliberately places the company identity on the far-left wall instead of the right crop.
  dkd_scene.dkd_companySign.position.x = -6.25;
  dkd_scene.dkd_companySign.position.y = 6.72;
  dkd_scene.dkd_companySign.position.z = -6.72;
}

dkd_Scene.prototype.dkd_buildHub = function dkd_v05CityBuildHub() {
  const dkd_result = dkd_v05CityAudioPrevious.dkd_sceneBuildHub.call(this);
  dkd_v05CityPinCompanySign(this);
  return dkd_result;
};

dkd_Scene.prototype.dkd_refreshBrand = function dkd_v05CityRefreshBrand(dkd_kind = this.dkd_bikeKind) {
  const dkd_result = dkd_v05CityAudioPrevious.dkd_sceneRefreshBrand.call(this, dkd_kind);
  dkd_v05CityPinCompanySign(this);
  return dkd_result;
};

function dkd_v05CityInstances(dkd_scene, dkd_parent, dkd_geometry, dkd_material, dkd_items) {
  if (!dkd_items.length) return null;
  return dkd_scene.dkd_instances(dkd_parent, dkd_geometry, dkd_material, dkd_items);
}

function dkd_v05CityRoadsidePosition(dkd_start, dkd_heading, dkd_step, dkd_side, dkd_offset) {
  const dkd_centerX = dkd_start[0] + Math.sin(dkd_heading) * dkd_step;
  const dkd_centerZ = dkd_start[1] + Math.cos(dkd_heading) * dkd_step;
  return [
    dkd_centerX + Math.cos(dkd_heading) * dkd_offset * dkd_side,
    dkd_centerZ - Math.sin(dkd_heading) * dkd_offset * dkd_side,
  ];
}

dkd_Scene.prototype.dkd_buildCity = function dkd_v05CityBuildCity() {
  const dkd_result = dkd_v05CityAudioPrevious.dkd_sceneBuildCity.call(this);
  const dkd_group = new dkd_three.Group();
  dkd_group.name = 'dkd_v05_city_detail';
  this.dkd_world.add(dkd_group);
  this.dkd_v05CityDetail = dkd_group;

  const dkd_random = dkd_rng(5092026);
  const dkd_trunks = [];
  const dkd_crowns = [];
  const dkd_planters = [];
  const dkd_benchSeats = [];
  const dkd_benchBacks = [];
  const dkd_bins = [];
  const dkd_bollards = [];
  const dkd_shelterRoofs = [];
  const dkd_shelterBacks = [];
  const dkd_adBoards = [];
  const dkd_extraLampPoles = [];
  const dkd_extraLampHeads = [];

  for (const dkd_edge of this.dkd_graph.dkd_edges) {
    const dkd_start = this.dkd_graph.dkd_points[dkd_edge.dkd_from];
    const dkd_end = this.dkd_graph.dkd_points[dkd_edge.dkd_to];
    const dkd_heading = Math.atan2(dkd_end[0] - dkd_start[0], dkd_end[1] - dkd_start[1]);
    if (dkd_edge.dkd_length < 18) continue;

    // Dense roadside tree line: roughly every 18-28 m, usually on both sides.
    for (let dkd_step = 9 + dkd_random() * 7; dkd_step < dkd_edge.dkd_length - 7; dkd_step += 18 + dkd_random() * 10) {
      for (const dkd_side of [-1, 1]) {
        if (dkd_trunks.length >= 1100 || dkd_random() < .16) continue;
        const dkd_offset = dkd_edge.dkd_width / 2 + 4.15 + dkd_random() * 1.15;
        const [dkd_x, dkd_z] = dkd_v05CityRoadsidePosition(dkd_start, dkd_heading, dkd_step, dkd_side, dkd_offset);
        const dkd_height = 3.7 + dkd_random() * 2.4;
        const dkd_radius = 2.1 + dkd_random() * 1.45;
        dkd_trunks.push({ dkd_position: [dkd_x, dkd_height * .43, dkd_z], dkd_scale: [.38 + dkd_random() * .18, dkd_height * .86, .38 + dkd_random() * .18] });
        dkd_crowns.push({ dkd_position: [dkd_x, dkd_height + 1.7, dkd_z], dkd_scale: [dkd_radius, 2.7 + dkd_random() * 1.6, dkd_radius], dkd_color: ['#315a49','#3b6852','#426f55','#2f624d'][Math.floor(dkd_random() * 4)] });
        if (dkd_random() > .52) dkd_planters.push({ dkd_position: [dkd_x, .25, dkd_z], dkd_scale: [1.65, .5, 1.65], dkd_rotation: [0, dkd_heading, 0], dkd_color: dkd_random() > .5 ? '#727b76' : '#806f62' });
      }
    }

    // Frequent lamps and bollards make long roads feel like streets instead of empty strips.
    for (let dkd_step = 16; dkd_step < dkd_edge.dkd_length - 8; dkd_step += 38 + Math.floor(dkd_random() * 13)) {
      const dkd_side = dkd_random() > .5 ? 1 : -1;
      const dkd_offset = dkd_edge.dkd_width / 2 + 2.15;
      const [dkd_x, dkd_z] = dkd_v05CityRoadsidePosition(dkd_start, dkd_heading, dkd_step, dkd_side, dkd_offset);
      if (dkd_extraLampPoles.length < 650) {
        dkd_extraLampPoles.push({ dkd_position: [dkd_x, 3.7, dkd_z], dkd_scale: [.12, 7.4, .12] });
        dkd_extraLampHeads.push({ dkd_position: [dkd_x, 7.43, dkd_z], dkd_scale: [.72, .12, .52], dkd_rotation: [0, dkd_heading, 0] });
      }
      for (const dkd_bollardSide of [-1, 1]) {
        if (dkd_bollards.length >= 900) break;
        const [dkd_bx, dkd_bz] = dkd_v05CityRoadsidePosition(dkd_start, dkd_heading, Math.min(dkd_edge.dkd_length - 4, dkd_step + dkd_bollardSide * 2.2), dkd_side, dkd_edge.dkd_width / 2 + 1.55);
        dkd_bollards.push({ dkd_position: [dkd_bx, .45, dkd_bz], dkd_scale: [.16, .9, .16] });
      }
    }

    // Benches, bins, bus shelters and ad boards at realistic intervals.
    if (dkd_edge.dkd_length > 42) {
      const dkd_propCount = Math.max(1, Math.floor(dkd_edge.dkd_length / 95));
      for (let dkd_prop = 0; dkd_prop < dkd_propCount; dkd_prop++) {
        const dkd_step = 14 + ((dkd_prop + .35 + dkd_random() * .3) / dkd_propCount) * Math.max(12, dkd_edge.dkd_length - 28);
        const dkd_side = dkd_random() > .5 ? 1 : -1;
        const dkd_offset = dkd_edge.dkd_width / 2 + 3.1;
        const [dkd_x, dkd_z] = dkd_v05CityRoadsidePosition(dkd_start, dkd_heading, Math.min(dkd_edge.dkd_length - 8, dkd_step), dkd_side, dkd_offset);
        if (dkd_random() > .28 && dkd_benchSeats.length < 260) {
          dkd_benchSeats.push({ dkd_position: [dkd_x, .62, dkd_z], dkd_scale: [.58, .18, 2.25], dkd_rotation: [0, dkd_heading, 0] });
          const dkd_backOffset = .32 * dkd_side;
          dkd_benchBacks.push({ dkd_position: [dkd_x + Math.cos(dkd_heading) * dkd_backOffset, 1.05, dkd_z - Math.sin(dkd_heading) * dkd_backOffset], dkd_scale: [.16, .92, 2.25], dkd_rotation: [0, dkd_heading, 0] });
        }
        if (dkd_bins.length < 300) {
          const [dkd_binX, dkd_binZ] = dkd_v05CityRoadsidePosition(dkd_start, dkd_heading, Math.min(dkd_edge.dkd_length - 7, dkd_step + 3.0), dkd_side, dkd_offset + .25);
          dkd_bins.push({ dkd_position: [dkd_binX, .55, dkd_binZ], dkd_scale: [.45, 1.1, .45], dkd_color: dkd_random() > .45 ? '#315e59' : '#475666' });
        }
        if (dkd_edge.dkd_width >= 9 && dkd_random() > .62 && dkd_shelterRoofs.length < 85) {
          const [dkd_stopX, dkd_stopZ] = dkd_v05CityRoadsidePosition(dkd_start, dkd_heading, Math.min(dkd_edge.dkd_length - 9, dkd_step + 6), dkd_side, dkd_edge.dkd_width / 2 + 4.15);
          dkd_shelterRoofs.push({ dkd_position: [dkd_stopX, 2.85, dkd_stopZ], dkd_scale: [2.4, .16, 4.4], dkd_rotation: [0, dkd_heading, 0] });
          const dkd_backShift = 1.05 * dkd_side;
          dkd_shelterBacks.push({ dkd_position: [dkd_stopX + Math.cos(dkd_heading) * dkd_backShift, 1.55, dkd_stopZ - Math.sin(dkd_heading) * dkd_backShift], dkd_scale: [.14, 2.45, 4.15], dkd_rotation: [0, dkd_heading, 0] });
        }
        if (dkd_random() > .68 && dkd_adBoards.length < 130) {
          const [dkd_adX, dkd_adZ] = dkd_v05CityRoadsidePosition(dkd_start, dkd_heading, Math.min(dkd_edge.dkd_length - 8, dkd_step + 9), -dkd_side, dkd_edge.dkd_width / 2 + 4.35);
          dkd_adBoards.push({ dkd_position: [dkd_adX, 1.7, dkd_adZ], dkd_scale: [.18, 2.4, 3.1], dkd_rotation: [0, dkd_heading, 0], dkd_color: ['#d77ea8','#669fc1','#d19a59','#5ca89d'][Math.floor(dkd_random() * 4)] });
        }
      }
    }
  }

  dkd_v05CityInstances(this, dkd_group, new dkd_three.CylinderGeometry(1, 1.12, 1, 7), this.dkd_material('#51483d', .92), dkd_trunks);
  dkd_v05CityInstances(this, dkd_group, new dkd_three.IcosahedronGeometry(1, 1), this.dkd_material('#3b6650', .86), dkd_crowns);
  dkd_v05CityInstances(this, dkd_group, new dkd_three.BoxGeometry(1, 1, 1), this.dkd_material('#76766f', .88), dkd_planters);
  dkd_v05CityInstances(this, dkd_group, new dkd_three.BoxGeometry(1, 1, 1), this.dkd_material('#75624d', .78), dkd_benchSeats);
  dkd_v05CityInstances(this, dkd_group, new dkd_three.BoxGeometry(1, 1, 1), this.dkd_material('#5e5144', .82), dkd_benchBacks);
  dkd_v05CityInstances(this, dkd_group, new dkd_three.CylinderGeometry(1, .88, 1, 8), this.dkd_material('#3f5d61', .7, .08), dkd_bins);
  dkd_v05CityInstances(this, dkd_group, new dkd_three.CylinderGeometry(1, 1, 1, 8), this.dkd_material('#67727c', .58, .2), dkd_bollards);
  dkd_v05CityInstances(this, dkd_group, new dkd_three.BoxGeometry(1, 1, 1), this.dkd_material('#65717d', .42, .28), dkd_shelterRoofs);
  dkd_v05CityInstances(this, dkd_group, new dkd_three.BoxGeometry(1, 1, 1), new dkd_three.MeshStandardMaterial({ color: '#7595a6', roughness: .34, metalness: .15, transparent: true, opacity: .42 }), dkd_shelterBacks);
  dkd_v05CityInstances(this, dkd_group, new dkd_three.BoxGeometry(1, 1, 1), this.dkd_material('#c8849e', .42, .12), dkd_adBoards);
  dkd_v05CityInstances(this, dkd_group, new dkd_three.BoxGeometry(1, 1, 1), this.dkd_material('#69747d', .38, .44), dkd_extraLampPoles);
  this.dkd_v05CityLampHeads = dkd_v05CityInstances(this, dkd_group, new dkd_three.BoxGeometry(1, 1, 1), new dkd_three.MeshBasicMaterial({ color: '#f1d9ad' }), dkd_extraLampHeads);

  this.dkd_v05CityDetailCounts = {
    dkd_trees: dkd_trunks.length,
    dkd_benches: dkd_benchSeats.length,
    dkd_bins: dkd_bins.length,
    dkd_shelters: dkd_shelterRoofs.length,
    dkd_ads: dkd_adBoards.length,
    dkd_lamps: dkd_extraLampPoles.length,
  };
  return dkd_result;
};

dkd_Scene.prototype.dkd_update = function dkd_v05CitySceneUpdate(dkd_dt, dkd_run = null) {
  const dkd_result = dkd_v05CityAudioPrevious.dkd_sceneUpdate.call(this, dkd_dt, dkd_run);
  if (this.dkd_v05CityLampHeads) this.dkd_v05CityLampHeads.visible = this.dkd_lamps?.visible !== false;
  return dkd_result;
};

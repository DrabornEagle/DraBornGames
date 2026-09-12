// DraBornGo / Last Mile v0.4 route-focused traffic density.
// Loaded after the traffic/obstacle patch so increased traffic is visible on the player's actual route.

const dkd_v04RouteTrafficPreviousInit = dkd_initTraffic;

dkd_initTraffic = function dkd_v04RouteFocusedTraffic(dkd_run, dkd_graph, dkd_count = 24) {
  const dkd_isTutorial = dkd_run?.dkd_order?.dkd_type === 'tutorial';
  const dkd_requestedCount = Math.max(0, Number(dkd_count) || 0);
  const dkd_initialCount = dkd_isTutorial
    ? Math.min(14, Math.max(10, dkd_requestedCount || 12))
    : Math.max(dkd_requestedCount, 54);
  dkd_v04RouteTrafficPreviousInit(dkd_run, dkd_graph, dkd_initialCount);

  const dkd_startPosition = Array.isArray(dkd_run?.dkd_position) ? [...dkd_run.dkd_position] : null;
  if (dkd_isTutorial && dkd_startPosition && Array.isArray(dkd_run.dkd_traffic)) {
    dkd_run.dkd_traffic = dkd_run.dkd_traffic.filter(dkd_car => {
      if (!Array.isArray(dkd_car?.dkd_position)) return true;
      return Math.hypot(
        Number(dkd_car.dkd_position[0]) - Number(dkd_startPosition[0]),
        Number(dkd_car.dkd_position[1]) - Number(dkd_startPosition[1]),
      ) >= 32;
    });
  }

  const dkd_routeEdgesAll = Array.isArray(dkd_run?.dkd_route?.dkd_edges)
    ? dkd_run.dkd_route.dkd_edges.filter(dkd_edgeId => dkd_graph.dkd_edges[dkd_edgeId])
    : [];
  const dkd_routeEdges = dkd_routeEdgesAll.length > 3 ? dkd_routeEdgesAll.slice(1, -1) : dkd_routeEdgesAll;
  if (!dkd_routeEdges.length || !Array.isArray(dkd_run.dkd_traffic)) return;

  const dkd_focusCount = Math.min(dkd_isTutorial ? 4 : 22, dkd_run.dkd_traffic.length);
  const dkd_random = dkd_rng((Number(dkd_run.dkd_order?.dkd_seed) || 571) + 28771);

  for (let dkd_index = 0; dkd_index < dkd_focusCount; dkd_index++) {
    const dkd_edgeId = dkd_routeEdges[(dkd_index * 3 + Math.floor(dkd_random() * dkd_routeEdges.length)) % dkd_routeEdges.length];
    const dkd_edge = dkd_graph.dkd_edges[dkd_edgeId];
    if (!dkd_edge) continue;

    const dkd_reverse = dkd_edge.dkd_direction === -1 || (dkd_edge.dkd_direction === 0 && dkd_index % 2 === 1);
    const dkd_from = dkd_reverse ? dkd_edge.dkd_to : dkd_edge.dkd_from;
    const dkd_to = dkd_reverse ? dkd_edge.dkd_from : dkd_edge.dkd_to;
    const dkd_start = dkd_graph.dkd_points[dkd_from];
    const dkd_end = dkd_graph.dkd_points[dkd_to];
    if (!dkd_start || !dkd_end) continue;

    const dkd_fraction = .12 + ((dkd_index * .173 + dkd_random() * .19) % .76);
    const dkd_heading = Math.atan2(dkd_end[0] - dkd_start[0], dkd_end[1] - dkd_start[1]);
    const dkd_lane = Math.min(2.4, Number(dkd_edge.dkd_width || 8) / 4);
    const dkd_car = dkd_run.dkd_traffic[dkd_index];
    const dkd_position = [
      dkd_start[0] + (dkd_end[0] - dkd_start[0]) * dkd_fraction + Math.cos(dkd_heading) * dkd_lane,
      dkd_start[1] + (dkd_end[1] - dkd_start[1]) * dkd_fraction - Math.sin(dkd_heading) * dkd_lane,
    ];
    if (dkd_isTutorial && dkd_startPosition && Math.hypot(
      dkd_position[0] - Number(dkd_startPosition[0]),
      dkd_position[1] - Number(dkd_startPosition[1]),
    ) < 36) continue;

    dkd_car.dkd_from = dkd_from;
    dkd_car.dkd_to = dkd_to;
    dkd_car.dkd_edge = dkd_edgeId;
    dkd_car.dkd_fraction = dkd_fraction;
    dkd_car.dkd_speed = 4.4 + (dkd_index % 7) * .72 + dkd_random() * 1.1;
    dkd_car.dkd_heading = dkd_heading;
    dkd_car.dkd_position = dkd_position;
    dkd_car.dkd_routeFocused = true;
  }
};

function formatStep(step) {
  const { maneuver } = step;

  return {
    instruction: maneuver.type + (maneuver.modifier ? ` ${maneuver.modifier}` : ''),
    name: step.name || '',
    distance: step.distance,
    duration: step.duration,
    maneuver: {
      type: maneuver.type,
      modifier: maneuver.modifier || null,
      location: maneuver.location,
    },
  };
}

export function formatRoute(route) {
  return {
    distance: route.distance,
    duration: route.duration,
    geometry: route.geometry,
    steps: route.legs.flatMap(leg => leg.steps.map(formatStep)),
  };
}

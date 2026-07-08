const RescueTeams = (() => {
  let teams = [];

  async function loadTeams() {
    try {
      const res = await fetch("data/rescue_teams.json");
      const data = await res.json();
      teams = data.teams;
    } catch (e) {
      console.warn("Could not load rescue team data:", e);
      teams = [];
    }
    return teams;
  }

  function findNearest(lat, lon) {
    if (!teams.length) return null;
    let best = null;
    let bestDist = Infinity;
    for (const t of teams) {
      const d = RiskEngine.haversine(lat, lon, t.lat, t.lon);
      if (d < bestDist) {
        bestDist = d;
        best = t;
      }
    }
    return { ...best, distanceKm: bestDist / 1000 };
  }

  return { loadTeams, findNearest };
})();

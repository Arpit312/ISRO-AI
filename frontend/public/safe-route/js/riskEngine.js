const RiskEngine = (() => {
  const EARTH_R = 6371000; 

  function haversine(lat1, lon1, lat2, lon2) {
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * EARTH_R * Math.asin(Math.sqrt(a));
  }

  function buildGrid(lat, lon, radiusKm, n = 5) {
    const points = [];
    const step = (radiusKm * 2) / (n - 1);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const dxKm = -radiusKm + i * step;
        const dyKm = -radiusKm + j * step;
        const dLat = dyKm / 111.32;
        const dLon = dxKm / (111.32 * Math.cos((lat * Math.PI) / 180));
        points.push({ lat: lat + dLat, lon: lon + dLon });
      }
    }
    return points;
  }

  async function fetchElevations(points) {
    const chunks = [];
    for (let i = 0; i < points.length; i += 90) chunks.push(points.slice(i, i + 90));
    const results = [];
    for (const chunk of chunks) {
      const locs = chunk.map((p) => `${p.lat.toFixed(5)},${p.lon.toFixed(5)}`).join("|");
      try {
        const res = await fetch(`https://api.opentopodata.org/v1/srtm90m?locations=${locs}`);
        const data = await res.json();
        data.results.forEach((r, idx) => (chunk[idx].elevation = r.elevation ?? 0));
      } catch (e) {
        console.warn("Elevation lookup failed, defaulting to 0:", e);
        chunk.forEach((p) => (p.elevation = 0));
      }
      results.push(...chunk);
    }
    return results;
  }

  async function fetchHazardFeatures(lat, lon, radiusKm) {
    const d = radiusKm / 111.32;
    const bbox = [lat - d, lon - d, lat + d, lon + d].join(",");
    const query = `
      [out:json][timeout:25];
      (
        way["natural"="water"](${bbox});
        way["waterway"](${bbox});
        way["landuse"="reservoir"](${bbox});
        way["highway"](${bbox});
      );
      out center;
    `;
    try {
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });
      const data = await res.json();
      const water = [];
      const roads = [];
      data.elements.forEach((el) => {
        const c = el.center;
        if (!c) return;
        if (el.tags && el.tags.highway) roads.push([c.lat, c.lon]);
        else water.push([c.lat, c.lon]);
      });
      return { water, roads };
    } catch (e) {
      console.warn("Overpass lookup failed, hazard layers empty:", e);
      return { water: [], roads: [] };
    }
  }

  function nearestDistance(point, featureList) {
    if (!featureList.length) return Infinity;
    let min = Infinity;
    for (const [flat, flon] of featureList) {
      const dist = haversine(point.lat, point.lon, flat, flon);
      if (dist < min) min = dist;
    }
    return min;
  }

  function scoreCandidates(points, hazards, elevRange) {
    const { min: eMin, max: eMax } = elevRange;
    return points.map((p) => {
      const waterDist = nearestDistance(p, hazards.water);
      const roadDist = nearestDistance(p, hazards.roads);

      const elevScore = eMax > eMin ? (p.elevation - eMin) / (eMax - eMin) : 0.5;
      const waterScore = Math.min(waterDist / 300, 1); 
      const roadScore = 1 - Math.min(roadDist / 500, 1); 

      const score = elevScore * 0.45 + waterScore * 0.35 + roadScore * 0.2;

      return { ...p, waterDist, roadDist, score };
    });
  }

  async function scan(lat, lon, radiusKm, onProgress) {
    onProgress?.("Building scan grid…");
    const grid = buildGrid(lat, lon, radiusKm, 5);

    onProgress?.(`Fetching elevation for ${grid.length} points…`);
    await fetchElevations(grid);
    const elevations = grid.map((p) => p.elevation);
    const elevRange = { min: Math.min(...elevations), max: Math.max(...elevations) };

    onProgress?.("Fetching water bodies & road network…");
    const hazards = await fetchHazardFeatures(lat, lon, radiusKm);

    onProgress?.("Scoring candidate zones…");
    const scored = scoreCandidates(grid, hazards, elevRange);
    scored.sort((a, b) => b.score - a.score);

    const usable = scored.filter((p) => haversine(p.lat, p.lon, lat, lon) > 150);

    return usable.slice(0, 3);
  }

  return { scan, haversine };
})();

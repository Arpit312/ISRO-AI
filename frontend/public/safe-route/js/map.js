const AppMap = (() => {
  let map, userMarker, safeMarkers = [], rescueMarker, routeLines = [];

  function init() {
    map = L.map("map", { zoomControl: true }).setView([22.9734, 78.6569], 5); 

    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        maxZoom: 18,
      }
    );

    const labels = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",
      { subdomains: "abcd", maxZoom: 19, opacity: 0.9 }
    );

    satellite.addTo(map);
    labels.addTo(map);

    map.on("click", (e) => {
      if (window.onMapClick) window.onMapClick(e.latlng.lat, e.latlng.lng);
    });

    return map;
  }

  function setUserLocation(lat, lon) {
    if (userMarker) map.removeLayer(userMarker);
    userMarker = L.circleMarker([lat, lon], {
      radius: 9,
      color: "#4d8dff",
      fillColor: "#4d8dff",
      fillOpacity: 0.9,
      weight: 2,
    })
      .addTo(map)
      .bindPopup("Your location");
    map.setView([lat, lon], 13);
  }

  function clearScanLayers() {
    safeMarkers.forEach((m) => map.removeLayer(m));
    safeMarkers = [];
    if (rescueMarker) map.removeLayer(rescueMarker);
    routeLines.forEach((r) => map.removeLayer(r));
    routeLines = [];
  }

  function plotSafeZones(zones) {
    zones.forEach((z, i) => {
      const marker = L.circleMarker([z.lat, z.lon], {
        radius: i === 0 ? 10 : 7,
        color: "#2dd4a7",
        fillColor: "#2dd4a7",
        fillOpacity: i === 0 ? 0.95 : 0.6,
        weight: i === 0 ? 3 : 1.5,
      })
        .addTo(map)
        .bindPopup(
          `<b>${i === 0 ? "Safest zone" : "Alternate zone"}</b><br/>Safety score: ${(z.score * 100).toFixed(0)}/100`
        );
      safeMarkers.push(marker);
    });
  }

  function plotRescueTeam(team) {
    rescueMarker = L.circleMarker([team.lat, team.lon], {
      radius: 9,
      color: "#f2a93c",
      fillColor: "#f2a93c",
      fillOpacity: 0.9,
      weight: 2,
    })
      .addTo(map)
      .bindPopup(`<b>${team.name}</b><br/>${team.type}`);
  }

  async function drawRoute(fromLatLon, toLatLon, color) {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${fromLatLon[1]},${fromLatLon[0]};${toLatLon[1]},${toLatLon[0]}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data.routes || !data.routes.length) return null;
      const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
      const line = L.polyline(coords, { color, weight: 4, opacity: 0.85 }).addTo(map);
      routeLines.push(line);
      return data.routes[0]; 
    } catch (e) {
      console.warn("Routing failed, falling back to straight line:", e);
      const line = L.polyline([fromLatLon, toLatLon], {
        color,
        weight: 3,
        opacity: 0.6,
        dashArray: "6 6",
      }).addTo(map);
      routeLines.push(line);
      return null;
    }
  }

  function fitToAll(points) {
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40] });
  }

  return { init, setUserLocation, clearScanLayers, plotSafeZones, plotRescueTeam, drawRoute, fitToAll };
})();

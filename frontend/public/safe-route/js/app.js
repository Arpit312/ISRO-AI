(async function () {
  const state = { userLat: null, userLon: null, safeZone: null, safeZones: [], rescueTeam: null };

  const statusPill = document.getElementById("statusPill");
  const btnLocate = document.getElementById("btnLocate");
  const btnScan = document.getElementById("btnScan");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const coordsBox = document.getElementById("coordsBox");
  const radiusInput = document.getElementById("radiusInput");
  const radiusVal = document.getElementById("radiusVal");
  const scanProgress = document.getElementById("scanProgress");
  const scanProgressText = document.getElementById("scanProgressText");
  const resultsBlock = document.getElementById("resultsBlock");
  const sosBlock = document.getElementById("sosBlock");
  const safeZoneCard = document.getElementById("safeZoneCard");
  const rescueCard = document.getElementById("rescueCard");
  const btnSOS = document.getElementById("btnSOS");

  AppMap.init();
  await RescueTeams.loadTeams();

  function setStatus(text, mode) {
    statusPill.className = "status-pill" + (mode ? " " + mode : "");
    statusPill.innerHTML = `<span class="dot"></span> ${text}`;
  }

  function setUserLocation(lat, lon) {
    state.userLat = lat;
    state.userLon = lon;
    coordsBox.textContent = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
    AppMap.setUserLocation(lat, lon);
    AppMap.clearScanLayers();
    resultsBlock.style.display = "none";
    sosBlock.style.display = "none";
    btnScan.disabled = false;
    setStatus("Location set — ready to scan", "ok");
  }

  // 1. Use my location
  btnLocate.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Geolocation isn't available in this browser. Try clicking on the map instead.");
      return;
    }
    setStatus("Locating…", "busy");
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation(pos.coords.latitude, pos.coords.longitude),
      () => {
        setStatus("Could not get location", "");
        alert("Location access denied. Try searching a place name or clicking the map.");
      }
    );
  });

  // 2. Search a place (Nominatim geocoding, free, no key)
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = searchInput.value.trim();
    if (!q) return;
    setStatus("Searching…", "busy");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`
      );
      const data = await res.json();
      if (!data.length) {
        setStatus("Place not found", "");
        alert("Couldn't find that place. Try a more specific name, or click the map directly.");
        return;
      }
      setUserLocation(parseFloat(data[0].lat), parseFloat(data[0].lon));
    } catch (err) {
      setStatus("Search failed", "");
      alert("Search request failed — check your connection and try again.");
    }
  });

  // 3. Click on map to drop a pin
  window.onMapClick = (lat, lon) => setUserLocation(lat, lon);

  // radius slider
  radiusInput.addEventListener("input", () => {
    radiusVal.textContent = `${radiusInput.value} km`;
  });

  btnScan.addEventListener("click", async () => {
    if (state.userLat == null) return;
    btnScan.disabled = true;
    scanProgress.classList.remove("hidden");
    setStatus("Scanning…", "busy");
    AppMap.clearScanLayers();

    const radiusKm = parseInt(radiusInput.value, 10);

    try {
      const zones = await RiskEngine.scan(state.userLat, state.userLon, radiusKm, (msg) => {
        scanProgressText.textContent = msg;
      });

      state.safeZones = zones;
      state.safeZone = zones[0] || null;
      state.rescueTeam = RescueTeams.findNearest(state.userLat, state.userLon);

      AppMap.plotSafeZones(zones);
      if (state.rescueTeam) AppMap.plotRescueTeam(state.rescueTeam);

      const pointsToFit = [[state.userLat, state.userLon]];
      if (state.safeZone) {
        pointsToFit.push([state.safeZone.lat, state.safeZone.lon]);
        await AppMap.drawRoute(
          [state.userLat, state.userLon],
          [state.safeZone.lat, state.safeZone.lon],
          "#2dd4a7"
        );
      }
      if (state.rescueTeam) {
        pointsToFit.push([state.rescueTeam.lat, state.rescueTeam.lon]);
        await AppMap.drawRoute(
          [state.rescueTeam.lat, state.rescueTeam.lon],
          [state.userLat, state.userLon],
          "#f2a93c"
        );
      }
      AppMap.fitToAll(pointsToFit);

      renderResults();
      setStatus("Scan complete", "ok");
    } catch (err) {
      console.error(err);
      setStatus("Scan failed — see console", "");
    } finally {
      scanProgress.classList.add("hidden");
      btnScan.disabled = false;
    }
  });

  function renderResults() {
    resultsBlock.style.display = "block";
    sosBlock.style.display = "block";

    if (state.safeZone) {
      const distKm = (
        RiskEngine.haversine(state.userLat, state.userLon, state.safeZone.lat, state.safeZone.lon) / 1000
      ).toFixed(2);
      safeZoneCard.innerHTML = `
        <div class="rc-title">Safest zone <span class="rc-score">${(state.safeZone.score * 100).toFixed(0)}/100</span></div>
        <div class="rc-meta">${distKm} km away · elevation ${Math.round(state.safeZone.elevation)} m</div>
        <div class="rc-meta">${Math.round(state.safeZone.waterDist)} m from water · ${Math.round(state.safeZone.roadDist)} m from nearest road</div>
      `;
    } else {
      safeZoneCard.innerHTML = `<div class="rc-meta">No safer zone found in this radius — try increasing the scan radius.</div>`;
    }

    if (state.rescueTeam) {
      rescueCard.innerHTML = `
        <div class="rc-title">${state.rescueTeam.name}</div>
        <div class="rc-meta">${state.rescueTeam.type}</div>
        <div class="rc-meta">${state.rescueTeam.distanceKm.toFixed(1)} km away</div>
      `;
    } else {
      rescueCard.innerHTML = `<div class="rc-meta">No rescue team data available.</div>`;
    }
  }

  btnSOS.addEventListener("click", () => {
    SOS.wireLinks(state);
  });
})();

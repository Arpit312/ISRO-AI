const SOS = (() => {

  const DEMO_CONTACT_NUMBER = "911234567890";

  function buildMessage(state) {
    const { userLat, userLon, safeZone, rescueTeam } = state;
    const mapsLink = `https://maps.google.com/?q=${userLat.toFixed(5)},${userLon.toFixed(5)}`;

    let msg = `SOS — I need help.\nMy location: ${mapsLink}`;
    if (safeZone) {
      const distKm = (RiskEngine.haversine(userLat, userLon, safeZone.lat, safeZone.lon) / 1000).toFixed(2);
      msg += `\nNearest identified safe zone: ${distKm} km away.`;
    }
    if (rescueTeam) {
      msg += `\nNearest rescue unit: ${rescueTeam.name} (~${rescueTeam.distanceKm.toFixed(1)} km).`;
    }
    msg += `\nSent via SAFE-ROUTE at ${new Date().toLocaleString()}`;
    return msg;
  }

  function wireLinks(state) {
    const msg = buildMessage(state);
    const encoded = encodeURIComponent(msg);

    // Also POST to our new backend database for the Admin Dashboard
    fetch('/api/sos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lat: state.userLat,
        lon: state.userLon,
        message: msg,
        // Since we don't have user profiles in this prototype, we'll use a random name
        // In a real app this would come from the logged in user
        senderName: `User-${Math.floor(Math.random() * 10000)}` 
      })
    }).catch(err => console.error("Failed to sync SOS to admin HQ:", err));

    const waLink = document.getElementById("sosWhatsapp");
    waLink.href = `https://wa.me/${DEMO_CONTACT_NUMBER}?text=${encoded}`;

    const smsLink = document.getElementById("sosSMS");
    smsLink.href = `sms:${DEMO_CONTACT_NUMBER}?body=${encoded}`;

    document.getElementById("sosCopy").onclick = () => {
      navigator.clipboard.writeText(msg).then(() => {
        const btn = document.getElementById("sosCopy");
        const original = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = original), 1500);
      });
    };

    document.getElementById("sosOptions").classList.remove("hidden");
  }

  return { buildMessage, wireLinks };
})();

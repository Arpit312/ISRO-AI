const SOS = (() => {
  // Demo contact number in international format, no leading +/00.
  // Replace with a real emergency contact / control-room number before use.
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

const USER_AGENT = "BookingApp/1.0 (local-dev-geocoding)";

function buildSearchVariants({ name, address, city }) {
  const safeName = String(name ?? "").trim();
  const safeAddress = String(address ?? "").trim();
  const safeCity = String(city ?? "").trim();

  return [
    `${safeName}, ${safeAddress}, ${safeCity}`,
    `${safeAddress}, ${safeCity}`,
    `${safeName}, ${safeCity}`,
    `${safeAddress}`,
    `${safeCity}`,
  ].filter((q) => q.length > 0);
}

async function fetchJson(url, signal) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

function parseNominatimResult(payload) {
  if (!Array.isArray(payload) || payload.length === 0) return null;
  const first = payload[0];
  const lat = Number(first?.lat);
  const lng = Number(first?.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

function parsePhotonResult(payload) {
  const coords = payload?.features?.[0]?.geometry?.coordinates;
  if (!Array.isArray(coords) || coords.length < 2) return null;
  const lng = Number(coords[0]);
  const lat = Number(coords[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

export async function geocodeHotel(hotel, { timeoutMs = 8000 } = {}) {
  const variants = buildSearchVariants(hotel);

  for (const query of variants) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`;
      const nominatimPayload = await fetchJson(nominatimUrl, controller.signal);
      const nominatimPoint = parseNominatimResult(nominatimPayload);
      if (nominatimPoint) return nominatimPoint;
    } catch {
    } finally {
      clearTimeout(timeout);
    }

    const controller2 = new AbortController();
    const timeout2 = setTimeout(() => controller2.abort(), timeoutMs);
    try {
      const photonUrl = `https://photon.komoot.io/api/?limit=1&q=${encodeURIComponent(query)}`;
      const photonPayload = await fetchJson(photonUrl, controller2.signal);
      const photonPoint = parsePhotonResult(photonPayload);
      if (photonPoint) return photonPoint;
    } catch {
    } finally {
      clearTimeout(timeout2);
    }
  }

  return null;
}

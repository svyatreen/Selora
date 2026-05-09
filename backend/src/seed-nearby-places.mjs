import pg from 'pg';

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

const CATEGORY_CONFIG = {
  restaurant: { filter: '[amenity~"^(restaurant|fast_food|food_court)$"]', radii: [1500, 3000, 6000, 12000, 25000] },
  cafe: { filter: '[amenity~"^(cafe|coffee_shop)$"]', radii: [1200, 2500, 5000, 10000, 20000] },
  bar: { filter: '[amenity~"^(bar|pub|biergarten)$"]', radii: [1200, 2500, 5000, 10000, 20000] },
  shopping: { filter: '[shop~"^(mall|department_store|supermarket|convenience)$"]', radii: [1500, 3000, 6000, 12000, 25000] },
  attraction: { filter: '[tourism~"^(attraction|viewpoint|theme_park|gallery)$"]', radii: [2000, 5000, 10000, 20000, 50000] },
  park: { filter: '[leisure=park]', radii: [1500, 3000, 6000, 12000, 25000] },
  pharmacy: { filter: '[amenity=pharmacy]', radii: [1000, 2500, 5000, 10000, 20000] },
  atm: { filter: '[amenity=atm]', radii: [800, 1500, 3000, 6000, 12000] },
};

const KEY_DISTANCE_TARGETS = [
  { type: 'supermarket', nameRu: 'Ближайший супермаркет', nameEn: 'Nearest supermarket', filter: '[shop=supermarket]', radius: 30000 },
  { type: 'pharmacy', nameRu: 'Ближайшая аптека', nameEn: 'Nearest pharmacy', filter: '[amenity=pharmacy]', radius: 15000 },
  { type: 'museum', nameRu: 'Ближайший музей', nameEn: 'Nearest museum', filter: '[tourism=museum]', radius: 50000 },
  { type: 'park', nameRu: 'Ближайший парк', nameEn: 'Nearest park', filter: '[leisure=park]', radius: 30000 },
  { type: 'metro', nameRu: 'Ближайшая станция метро', nameEn: 'Nearest metro station', filter: '[railway=station][station=subway]', radius: 60000 },
  { type: 'shopping_mall', nameRu: 'Торговый центр', nameEn: 'Shopping mall', filter: '[shop=mall]', radius: 60000 },
  { type: 'attraction', nameRu: 'Ближайшая достопримечательность', nameEn: 'Nearest attraction', filter: '[tourism~"^(attraction|viewpoint|theme_park)$"]', radius: 70000 },
  { type: 'airport', nameRu: 'Ближайший аэропорт', nameEn: 'Nearest airport', filter: '[aeroway=aerodrome]', radius: 120000 },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildOverpassQuery(filter, lat, lng, radiusMeters) {
  return `
    [out:json][timeout:25];
    (
      node${filter}(around:${radiusMeters},${lat},${lng});
      way${filter}(around:${radiusMeters},${lat},${lng});
      relation${filter}(around:${radiusMeters},${lat},${lng});
    );
    out center 200;
  `;
}

async function fetchOverpass(query) {
  let lastError = null;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(query),
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error('Overpass request failed');
}

function mapElementToPlace(element, category, lat, lng) {
  const tags = element?.tags ?? {};
  const pointLat = element?.lat ?? element?.center?.lat;
  const pointLng = element?.lon ?? element?.center?.lon;
  if (!Number.isFinite(pointLat) || !Number.isFinite(pointLng)) return null;

  const name = tags.name || tags['name:en'] || tags['name:ru'] || tags.brand;
  if (!name) return null;

  const km = distanceKm(lat, lng, pointLat, pointLng);
  return {
    osmId: Number(element.id),
    type: String(element.type ?? 'osm'),
    category,
    name: String(name),
    nameRu: tags['name:ru'] ? String(tags['name:ru']) : null,
    nameEn: tags['name:en'] ? String(tags['name:en']) : null,
    cuisine: tags.cuisine ? String(tags.cuisine) : null,
    opening_hours: tags.opening_hours ? String(tags.opening_hours) : null,
    website: tags.website || tags['contact:website'] ? String(tags.website || tags['contact:website']) : null,
    phone: tags.phone || tags['contact:phone'] ? String(tags.phone || tags['contact:phone']) : null,
    address: [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(' ') || null,
    latitude: Number(pointLat),
    longitude: Number(pointLng),
    distanceKm: Math.round(km * 1000) / 1000,
    walkMinutes: Math.max(1, Math.round(km * 12)),
    source: 'live_osm_seed',
  };
}

async function getCategoryPlaces(lat, lng, category, minCount = 6) {
  const config = CATEGORY_CONFIG[category];
  const dedup = new Map();

  for (const radius of config.radii) {
    const query = buildOverpassQuery(config.filter, lat, lng, radius);
    try {
      const payload = await fetchOverpass(query);
      for (const element of payload?.elements ?? []) {
        const place = mapElementToPlace(element, category, lat, lng);
        if (!place) continue;
        const dedupKey = `${place.name.toLowerCase()}::${place.latitude.toFixed(5)}::${place.longitude.toFixed(5)}`;
        if (!dedup.has(dedupKey)) dedup.set(dedupKey, place);
      }
      if (dedup.size >= minCount) break;
    } catch {
    }
    await sleep(120);
  }

  return Array.from(dedup.values())
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, minCount);
}

async function getNearestByFilter(lat, lng, filter) {
  const query = buildOverpassQuery(filter, lat, lng, 120000);
  const payload = await fetchOverpass(query);
  const items = (payload?.elements ?? [])
    .map((element) => mapElementToPlace(element, 'distance', lat, lng))
    .filter(Boolean)
    .sort((a, b) => a.distanceKm - b.distanceKm);
  return items[0] ?? null;
}

async function buildKeyDistances(lat, lng) {
  const distances = [];
  for (const target of KEY_DISTANCE_TARGETS) {
    try {
      const nearest = await getNearestByFilter(lat, lng, target.filter);
      if (!nearest) continue;
      distances.push({
        type: target.type,
        nameRu: nearest.nameRu || target.nameRu,
        nameEn: nearest.nameEn || nearest.name || target.nameEn,
        distanceKm: Math.round(nearest.distanceKm * 10) / 10,
        durationWalkMin:
          nearest.distanceKm <= 3
            ? Math.max(2, Math.round(nearest.distanceKm * 12))
            : null,
        durationDriveMin: Math.max(2, Math.round(nearest.distanceKm * 2)),
        source: 'live_osm_seed',
      });
    } catch {
    }
    await sleep(100);
  }

  return distances.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 10);
}

const { rows: hotels } = await client.query(
  'SELECT id, city, latitude, longitude FROM hotels WHERE latitude IS NOT NULL AND longitude IS NOT NULL',
);

console.log(`Seeding real nearby places for ${hotels.length} hotels...`);

let updated = 0;
for (const hotel of hotels) {
  const lat = Number(hotel.latitude);
  const lng = Number(hotel.longitude);

  const nearbyPlaces = {};
  for (const category of Object.keys(CATEGORY_CONFIG)) {
    const places = await getCategoryPlaces(lat, lng, category, 6);
    nearbyPlaces[category] = places;
  }

  const keyDistances = await buildKeyDistances(lat, lng);

  await client.query(
    'UPDATE hotels SET nearby_places = $1::jsonb, key_distances = $2::jsonb WHERE id = $3',
    [JSON.stringify(nearbyPlaces), JSON.stringify(keyDistances), hotel.id],
  );

  updated++;
  console.log(
    `#${updated}/${hotels.length} hotel_id=${hotel.id} city=${hotel.city} done`,
  );
  await sleep(180);
}

await client.end();
console.log(`✓ Seeded real nearby places for ${updated} hotels`);

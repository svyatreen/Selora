import pg from "pg";
import { resolveHotelCoordinates } from "./lib/hotel-coordinates.mjs";
import { geocodeHotel } from "./lib/geocode-hotel.mjs";

const { Client } = pg;

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const { rows: hotels } = await client.query(
  "SELECT id, name, city, address FROM hotels ORDER BY id ASC",
);

let updated = 0;
let missing = 0;
let geocoded = 0;
let fallbackResolved = 0;

const cache = new Map();
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

for (const hotel of hotels) {
  const cacheKey = `${hotel.name}|${hotel.address}|${hotel.city}`;
  let coords = cache.get(cacheKey) ?? null;

  if (!coords) {
    coords = await geocodeHotel(hotel);
    if (coords) {
      geocoded += 1;
      cache.set(cacheKey, coords);
    }
  }

  if (!coords) {
    coords = resolveHotelCoordinates(hotel);
    if (coords) {
      fallbackResolved += 1;
    }
  }

  if (!coords) {
    missing += 1;
    console.warn(`No coordinates for hotel #${hotel.id}: ${hotel.name}`);
    continue;
  }

  await client.query(
    "UPDATE hotels SET latitude = $1, longitude = $2 WHERE id = $3",
    [coords.lat, coords.lng, hotel.id],
  );
  updated += 1;

  await wait(1100);
}

await client.end();
console.log(
  `Backfilled coordinates for ${updated} hotels. ` +
    `Geocoded: ${geocoded}. Fallback: ${fallbackResolved}.` +
    (missing ? ` Missing: ${missing}.` : ""),
);

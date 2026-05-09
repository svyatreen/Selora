import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });

await import('./reset-demo-data.mjs');
await import('./seed-extended.mjs');
await import('./seed-reviews.mjs');
await import('./seed-features.mjs');
await import('./seed-nearby-places.mjs');
await import('./backfill-hotel-coordinates.mjs');

console.log(
  'Demo seed complete (hotels/rooms/descriptions/real coordinates + reviews/features).',
);

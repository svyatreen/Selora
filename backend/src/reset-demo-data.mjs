import pg from 'pg';

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });

await client.connect();

await client.query(`
  TRUNCATE TABLE
    recently_viewed,
    favorites,
    bookings,
    reviews,
    rooms,
    hotels
  RESTART IDENTITY CASCADE;
`);

await client.end();
console.log(
  'Demo hotel data wiped (hotels/rooms/reviews/bookings/favorites/recently_viewed).',
);

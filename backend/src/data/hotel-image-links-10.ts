const HOTEL_COUNT = 220;
const LINKS_PER_HOTEL = 10;

const TOPICS = [
  'hotel-room',
  'luxury-hotel',
  'hotel-suite',
  'hotel-lobby',
  'hotel-interior',
  'hotel-pool',
  'hotel-building',
  'resort',
  'boutique-hotel',
  'hotel-bedroom',
] as const;

function buildLink(hotelIndex: number, imageIndex: number): string {
  const topic = TOPICS[(hotelIndex + imageIndex) % TOPICS.length];
  const sig = hotelIndex * LINKS_PER_HOTEL + imageIndex + 1;
  return `https://source.unsplash.com/1600x900/?${topic}&sig=${sig}`;
}

export const HOTEL_IMAGE_LINKS_10: Record<string, string[]> = {};

for (let hotel = 1; hotel <= HOTEL_COUNT; hotel++) {
  const hotelKey = `HOTEL_${String(hotel).padStart(3, '0')}`;
  HOTEL_IMAGE_LINKS_10[hotelKey] = [];
  for (let i = 0; i < LINKS_PER_HOTEL; i++) {
    HOTEL_IMAGE_LINKS_10[hotelKey].push(buildLink(hotel, i));
  }
}

export const TOTAL_HOTEL_IMAGE_LINKS = HOTEL_COUNT * LINKS_PER_HOTEL;

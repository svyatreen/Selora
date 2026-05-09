type HotelImageInput = {
  hotelName: string;
  city?: string | null;
};

const UNSPLASH_BASE = 'https://source.unsplash.com/1600x900/?';

const HOTEL_IMAGE_TOPICS = [
  'luxury-hotel-room',
  'hotel-bedroom-interior',
  'hotel-suite-interior',
  'modern-hotel-lobby',
  'hotel-reception',
  'boutique-hotel-room',
  'five-star-hotel-room',
  'hotel-bathroom-marble',
  'hotel-balcony-view',
  'hotel-restaurant-interior',
  'hotel-breakfast',
  'hotel-bar-interior',
  'hotel-pool',
  'hotel-spa',
  'hotel-facade',
  'city-hotel-exterior',
  'resort-hotel-aerial',
  'hotel-corridor-design',
  'hotel-lounge',
  'hotel-penthouse-suite',
  'business-hotel-room',
  'romantic-hotel-room',
  'minimalist-hotel-room',
  'cozy-hotel-room',
  'hotel-window-view',
  'hotel-terrace',
  'hotel-rooftop',
  'hotel-garden',
  'hotel-entrance',
  'luxury-resort',
] as const;

function normalizeToken(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildUnsplashQuery(hotelName: string, city: string, topic: string): string {
  const nameToken = normalizeToken(hotelName);
  const cityToken = normalizeToken(city || 'city');
  const topicToken = normalizeToken(topic);
  return `${topicToken},hotel,${nameToken},${cityToken}`;
}

function makeUnsplashUrl(query: string, index: number): string {
  return `${UNSPLASH_BASE}${encodeURIComponent(query)}&sig=${index + 1}`;
}

export function buildHotelUnsplashImages(input: HotelImageInput): string[] {
  const hotelName = input.hotelName.trim();
  const city = (input.city ?? '').trim();

  return HOTEL_IMAGE_TOPICS.map((topic, index) => {
    const query = buildUnsplashQuery(hotelName, city, topic);
    return makeUnsplashUrl(query, index);
  });
}

export function buildUnsplashImagesByHotel<T extends { name: string; city?: string | null }>(
  hotels: T[],
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const hotel of hotels) {
    result[hotel.name] = buildHotelUnsplashImages({
      hotelName: hotel.name,
      city: hotel.city ?? '',
    });
  }

  return result;
}


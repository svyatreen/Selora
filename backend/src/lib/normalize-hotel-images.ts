const UNSPLASH_HOSTS = new Set([
  'images.unsplash.com',
  'source.unsplash.com',
]);

const DEFAULT_WIDTH = '1200';
const DEFAULT_HEIGHT = '800';
const DEFAULT_QUALITY = '85';

export function normalizeHotelImageUrl(rawUrl: string): string {
  const value = rawUrl.trim();
  if (!value) {
    return value;
  }

  try {
    const url = new URL(value);
    if (!UNSPLASH_HOSTS.has(url.hostname)) {
      return value;
    }

    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('w', DEFAULT_WIDTH);
    url.searchParams.set('h', DEFAULT_HEIGHT);
    url.searchParams.set('q', DEFAULT_QUALITY);
    return url.toString();
  } catch {
    return value;
  }
}

export function normalizeHotelImages(images: string[] | null | undefined): string[] {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.map(normalizeHotelImageUrl);
}

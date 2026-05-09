import { Router, type IRouter } from 'express';
import {
  db,
  hotelsTable,
  roomsTable,
  bookingsTable,
  reviewsTable,
} from '../db';
import {
  eq,
  like,
  or,
  and,
  gte,
  lte,
  sql,
  desc,
  asc,
  inArray,
} from 'drizzle-orm';
import { requireAdmin } from '../middlewares/requireAuth';
import {
  ListHotelsQueryParams,
  CreateHotelBody,
  GetHotelParams,
  UpdateHotelParams,
  UpdateHotelBody,
  DeleteHotelParams,
  GetSimilarHotelsParams,
} from '../zod';
import {
  resolveHotelDescription,
  resolveLang,
  resolveRoomDescription,
} from '../lib/resolve-description';
import { normalizeHotelImages } from '../lib/normalize-hotel-images';
import {
  buildFallbackKeyDistances,
  buildPreparedNearbyPlaces,
  normalizeNearbyCategory,
  resolveFallbackCityCenter,
  type NearbyCategory,
} from '../lib/nearby-fallback';

const router: IRouter = Router();


function buildHotelWithMeta(
  hotel: typeof hotelsTable.$inferSelect,
  reviewCount: number,
  minPrice: number | null,
  lang: ReturnType<typeof resolveLang>,
) {
  return {
    id: hotel.id,
    name: hotel.name,
    description: resolveHotelDescription(hotel, lang),
    city: hotel.city,
    address: hotel.address,
    latitude: hotel.latitude,
    longitude: hotel.longitude,
    rating: hotel.rating,
    stars: hotel.stars,
    amenities: hotel.amenities,
    images: normalizeHotelImages(hotel.images),
    reviewCount,
    minPrice,
    createdAt: hotel.createdAt,
    description_ru: hotel.description_ru,
    description_en: hotel.description_en,
    amenitiesExtended: hotel.amenitiesExtended ?? {},
    languages: hotel.languages ?? [],
    checkInTime: hotel.checkInTime,
    checkOutTime: hotel.checkOutTime,
    earlyCheckIn: hotel.earlyCheckIn,
    lateCheckOut: hotel.lateCheckOut,
    parking: hotel.parking,
    accessibility: hotel.accessibility,
    petPolicy: hotel.petPolicy,
    childPolicy: hotel.childPolicy,
    paymentMethods: hotel.paymentMethods ?? [],
    popularBadge: hotel.popularBadge,
    includedInPrice: hotel.includedInPrice ?? [],
    notIncluded: hotel.notIncluded ?? [],
    keyDistances: buildFallbackKeyDistances({
      city: hotel.city,
      latitude:
        hotel.latitude ??
        resolveFallbackCityCenter(hotel.city)?.latitude ??
        null,
      longitude:
        hotel.longitude ??
        resolveFallbackCityCenter(hotel.city)?.longitude ??
        null,
      limit: 8,
    }),
  };
}

router.get('/hotels', async (req, res): Promise<void> => {
  const lang = resolveLang(req);
  const query = ListHotelsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { search, city, minRating, stars, sortBy, sortOrder } = query.data;
  const minPrice = query.data.minPrice;
  const maxPrice = query.data.maxPrice;

  const conditions = [];

  if (search) {
    conditions.push(
      or(
        like(hotelsTable.name, `%${search}%`),
        like(hotelsTable.city, `%${search}%`),
        like(hotelsTable.description_ru, `%${search}%`),
        like(hotelsTable.description_en, `%${search}%`),
      ),
    );
  }

  if (city) {
    conditions.push(like(hotelsTable.city, `%${city}%`));
  }

  if (minRating != null) {
    conditions.push(gte(hotelsTable.rating, Number(minRating)));
  }

  if (stars != null) {
    conditions.push(eq(hotelsTable.stars, Number(stars)));
  }

  const hotels = await db
    .select()
    .from(hotelsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const hotelIds = hotels.map((h) => h.id);

  if (hotelIds.length === 0) {
    res.json([]);
    return;
  }

  const reviewCounts = await db
    .select({
      hotelId: reviewsTable.hotelId,
      count: sql<number>`count(*)::int`,
    })
    .from(reviewsTable)
    .where(inArray(reviewsTable.hotelId, hotelIds))
    .groupBy(reviewsTable.hotelId);

  const roomPrices = await db
    .select({
      hotelId: roomsTable.hotelId,
      minPrice: sql<number>`min(${roomsTable.price})::float`,
    })
    .from(roomsTable)
    .where(inArray(roomsTable.hotelId, hotelIds))
    .groupBy(roomsTable.hotelId);

  const reviewMap = new Map(reviewCounts.map((r) => [r.hotelId, r.count]));
  const priceMap = new Map(roomPrices.map((r) => [r.hotelId, r.minPrice]));

  let result = hotels.map((h) =>
    buildHotelWithMeta(
      h,
      reviewMap.get(h.id) ?? 0,
      priceMap.get(h.id) ?? null,
      lang,
    ),
  );

  if (minPrice != null) {
    result = result.filter(
      (h) => h.minPrice == null || h.minPrice >= Number(minPrice),
    );
  }
  if (maxPrice != null) {
    result = result.filter(
      (h) => h.minPrice == null || h.minPrice <= Number(maxPrice),
    );
  }

  if (sortBy === 'price') {
    result.sort((a, b) => {
      const ap = a.minPrice ?? Infinity;
      const bp = b.minPrice ?? Infinity;
      return sortOrder === 'desc' ? bp - ap : ap - bp;
    });
  } else if (sortBy === 'rating') {
    result.sort((a, b) =>
      sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating,
    );
  } else if (sortBy === 'popularity') {
    result.sort((a, b) =>
      sortOrder === 'desc'
        ? b.reviewCount - a.reviewCount
        : a.reviewCount - b.reviewCount,
    );
  }

  res.json(result);
});

router.get('/admin/hotels', requireAdmin, async (req, res): Promise<void> => {
  const lang = resolveLang(req);
  const page = Math.max(1, parseInt((req.query.page as string) ?? '1', 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt((req.query.limit as string) ?? '12', 10) || 12));
  const search = ((req.query.search as string) ?? '').trim();
  const offset = (page - 1) * limit;

  const conditions = [];
  if (search) {
    conditions.push(
      or(
        like(hotelsTable.name, `%${search}%`),
        like(hotelsTable.city, `%${search}%`),
      ),
    );
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(hotelsTable)
    .where(where);

  const hotels = await db
    .select()
    .from(hotelsTable)
    .where(where)
    .orderBy(asc(hotelsTable.id))
    .limit(limit)
    .offset(offset);

  const hotelIds = hotels.map((h) => h.id);
  if (hotelIds.length === 0) {
    res.json({ data: [], total, page, totalPages: Math.ceil(total / limit) });
    return;
  }

  const reviewCounts = await db
    .select({ hotelId: reviewsTable.hotelId, count: sql<number>`count(*)::int` })
    .from(reviewsTable)
    .where(inArray(reviewsTable.hotelId, hotelIds))
    .groupBy(reviewsTable.hotelId);

  const roomPrices = await db
    .select({ hotelId: roomsTable.hotelId, minPrice: sql<number>`min(${roomsTable.price})::float` })
    .from(roomsTable)
    .where(inArray(roomsTable.hotelId, hotelIds))
    .groupBy(roomsTable.hotelId);

  const reviewMap = new Map(reviewCounts.map((r) => [r.hotelId, r.count]));
  const priceMap = new Map(roomPrices.map((r) => [r.hotelId, r.minPrice]));

  const data = hotels.map((h) =>
    buildHotelWithMeta(h, reviewMap.get(h.id) ?? 0, priceMap.get(h.id) ?? null, lang),
  );

  res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
});

router.get('/hotels/stats', async (req, res): Promise<void> => {
  const lang = resolveLang(req);
  const [totalHotelsRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(hotelsTable);
  const [totalBookingsRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(bookingsTable);

  const cityCounts = await db
    .select({
      city: hotelsTable.city,
      count: sql<number>`count(*)::int`,
    })
    .from(hotelsTable)
    .groupBy(hotelsTable.city)
    .orderBy(desc(sql`count(*)`), asc(hotelsTable.city));

  const topHotels = await db
    .select()
    .from(hotelsTable)
    .orderBy(desc(hotelsTable.rating))
    .limit(12);

  const topHotelIds = topHotels.map((h) => h.id);
  const reviewCounts =
    topHotelIds.length > 0
      ? await db
          .select({
            hotelId: reviewsTable.hotelId,
            count: sql<number>`count(*)::int`,
          })
          .from(reviewsTable)
          .where(inArray(reviewsTable.hotelId, topHotelIds))
          .groupBy(reviewsTable.hotelId)
      : [];

  const roomPrices =
    topHotelIds.length > 0
      ? await db
          .select({
            hotelId: roomsTable.hotelId,
            minPrice: sql<number>`min(${roomsTable.price})::float`,
          })
          .from(roomsTable)
          .where(inArray(roomsTable.hotelId, topHotelIds))
          .groupBy(roomsTable.hotelId)
      : [];

  const reviewMap = new Map(reviewCounts.map((r) => [r.hotelId, r.count]));
  const priceMap = new Map(roomPrices.map((r) => [r.hotelId, r.minPrice]));

  res.json({
    totalHotels: totalHotelsRow.count,
    totalBookings: totalBookingsRow.count,
    featuredCities: cityCounts,
    topHotels: topHotels.map((h) =>
      buildHotelWithMeta(
        h,
        reviewMap.get(h.id) ?? 0,
        priceMap.get(h.id) ?? null,
        lang,
      ),
    ),
  });
});

router.post('/hotels', requireAdmin, async (req, res): Promise<void> => {
  const lang = resolveLang(req);
  const parsed = CreateHotelBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [hotel] = await db
    .insert(hotelsTable)
    .values({
      ...parsed.data,
      amenities: parsed.data.amenities ?? [],
      images: normalizeHotelImages(parsed.data.images),
    })
    .returning();

  res.status(201).json(buildHotelWithMeta(hotel, 0, null, lang));
});

router.get('/hotels/:id', async (req, res): Promise<void> => {
  const lang = resolveLang(req);
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetHotelParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [hotel] = await db
    .select()
    .from(hotelsTable)
    .where(eq(hotelsTable.id, params.data.id));
  if (!hotel) {
    res.status(404).json({ error: 'Hotel not found' });
    return;
  }

  const rooms = await db
    .select()
    .from(roomsTable)
    .where(eq(roomsTable.hotelId, hotel.id));
  const [reviewRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(reviewsTable)
    .where(eq(reviewsTable.hotelId, hotel.id));
  const [priceRow] = await db
    .select({ minPrice: sql<number>`min(${roomsTable.price})::float` })
    .from(roomsTable)
    .where(eq(roomsTable.hotelId, hotel.id));

  res.json({
    ...buildHotelWithMeta(
      hotel,
      reviewRow?.count ?? 0,
      priceRow?.minPrice ?? null,
      lang,
    ),
    rooms: rooms.map((r) => ({
      ...r,
      description: resolveRoomDescription(r, lang),
    })),
  });
});

router.patch('/hotels/:id', requireAdmin, async (req, res): Promise<void> => {
  const lang = resolveLang(req);
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateHotelParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateHotelBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [hotel] = await db
    .update(hotelsTable)
    .set(
      parsed.data.images !== undefined
        ? {
            ...parsed.data,
            images: normalizeHotelImages(parsed.data.images),
          }
        : parsed.data,
    )
    .where(eq(hotelsTable.id, params.data.id))
    .returning();

  if (!hotel) {
    res.status(404).json({ error: 'Hotel not found' });
    return;
  }

  res.json(buildHotelWithMeta(hotel, 0, null, lang));
});

router.delete('/hotels/:id', requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteHotelParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [hotel] = await db
    .delete(hotelsTable)
    .where(eq(hotelsTable.id, params.data.id))
    .returning();
  if (!hotel) {
    res.status(404).json({ error: 'Hotel not found' });
    return;
  }

  res.sendStatus(204);
});

const NEARBY_CACHE = new Map<string, { ts: number; data: unknown }>();
const NEARBY_TTL_MS = 24 * 60 * 60 * 1000;

router.get('/hotels/:id/nearby', async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid hotel id' });
    return;
  }
  const category = normalizeNearbyCategory(req.query.category as string | undefined);
  const radiusMeters = Math.min(
    3000,
    Math.max(200, parseInt((req.query.radius as string) ?? '1500', 10) || 1500),
  );
  const limit = Math.min(
    25,
    Math.max(1, parseInt((req.query.limit as string) ?? '12', 10) || 12),
  );

  const [hotel] = await db.select().from(hotelsTable).where(eq(hotelsTable.id, id));
  if (!hotel) {
    res.status(404).json({ error: 'Hotel not found' });
    return;
  }
  const fallbackCenter = resolveFallbackCityCenter(hotel.city);
  const center =
    hotel.latitude != null && hotel.longitude != null
      ? { latitude: hotel.latitude, longitude: hotel.longitude }
      : fallbackCenter;
  const minimumPlaces = 6;
  const targetCount = Math.max(minimumPlaces, limit);
  const preparedPlaces =
    center == null
      ? []
      : buildPreparedNearbyPlaces({
          city: hotel.city,
          latitude: center.latitude,
          longitude: center.longitude,
          category,
          limit: targetCount,
          minCount: minimumPlaces,
        });
  const cacheKey = `${id}:${category}:${radiusMeters}:${limit}:prepared-only`;
  const cached = NEARBY_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.ts < NEARBY_TTL_MS) {
    res.json({ ...(cached.data as object), cached: true });
    return;
  }

  const result = {
    center,
    radius: radiusMeters,
    category,
    places: preparedPlaces,
    source: 'prepared_only',
  };
  NEARBY_CACHE.set(cacheKey, { ts: Date.now(), data: result });
  res.json({ ...result, cached: false });
});

router.get('/hotels/:id/similar', async (req, res): Promise<void> => {
  const lang = resolveLang(req);
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetSimilarHotelsParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [hotel] = await db
    .select()
    .from(hotelsTable)
    .where(eq(hotelsTable.id, params.data.id));
  if (!hotel) {
    res.json([]);
    return;
  }

  const similar = await db
    .select()
    .from(hotelsTable)
    .where(
      and(
        eq(hotelsTable.city, hotel.city),
        sql`${hotelsTable.id} != ${params.data.id}`,
      ),
    )
    .limit(4);

  const similarIds = similar.map((h) => h.id);
  const reviewCounts =
    similarIds.length > 0
      ? await db
          .select({
            hotelId: reviewsTable.hotelId,
            count: sql<number>`count(*)::int`,
          })
          .from(reviewsTable)
          .where(inArray(reviewsTable.hotelId, similarIds))
          .groupBy(reviewsTable.hotelId)
      : [];

  const roomPrices =
    similarIds.length > 0
      ? await db
          .select({
            hotelId: roomsTable.hotelId,
            minPrice: sql<number>`min(${roomsTable.price})::float`,
          })
          .from(roomsTable)
          .where(inArray(roomsTable.hotelId, similarIds))
          .groupBy(roomsTable.hotelId)
      : [];

  const reviewMap = new Map(reviewCounts.map((r) => [r.hotelId, r.count]));
  const priceMap = new Map(roomPrices.map((r) => [r.hotelId, r.minPrice]));

  res.json(
    similar.map((h) =>
      buildHotelWithMeta(
        h,
        reviewMap.get(h.id) ?? 0,
        priceMap.get(h.id) ?? null,
        lang,
      ),
    ),
  );
});

export default router;

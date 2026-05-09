import { Router, type IRouter } from 'express';
import {
  db,
  recentlyViewedTable,
  hotelsTable,
  reviewsTable,
  roomsTable,
} from '../db';
import { eq, and, inArray, sql, desc } from 'drizzle-orm';
import { requireAuth } from '../middlewares/requireAuth';
import {
  resolveHotelDescription,
  resolveLang,
} from '../lib/resolve-description';

const router: IRouter = Router();

router.get('/recently-viewed', requireAuth, async (req, res): Promise<void> => {
  const lang = resolveLang(req);
  const recent = await db
    .select()
    .from(recentlyViewedTable)
    .where(eq(recentlyViewedTable.userId, req.user!.userId))
    .orderBy(desc(recentlyViewedTable.viewedAt))
    .limit(8);

  const hotelIds = recent.map((r) => r.hotelId);
  if (hotelIds.length === 0) {
    res.json([]);
    return;
  }

  const hotels = await db
    .select()
    .from(hotelsTable)
    .where(inArray(hotelsTable.id, hotelIds));

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
  const hotelMap = new Map(hotels.map((h) => [h.id, h]));

  res.json(
    recent
      .map((r) => {
        const h = hotelMap.get(r.hotelId);
        if (!h) return null;
        return {
          id: h.id,
          name: h.name,
          description: resolveHotelDescription(h, lang),
          city: h.city,
          address: h.address,
          latitude: h.latitude,
          longitude: h.longitude,
          rating: h.rating,
          stars: h.stars,
          amenities: h.amenities,
          images: h.images,
          reviewCount: reviewMap.get(h.id) ?? 0,
          minPrice: priceMap.get(h.id) ?? null,
          createdAt: h.createdAt,
          viewedAt: r.viewedAt,
        };
      })
      .filter((x) => x !== null),
  );
});

router.post(
  '/recently-viewed/:hotelId',
  requireAuth,
  async (req, res): Promise<void> => {
    const rawId = Array.isArray(req.params.hotelId)
      ? req.params.hotelId[0]
      : req.params.hotelId;
    const hotelId = parseInt(rawId, 10);
    if (!Number.isFinite(hotelId)) {
      res.status(400).json({ error: 'Invalid hotelId' });
      return;
    }

    const [hotel] = await db
      .select({ id: hotelsTable.id })
      .from(hotelsTable)
      .where(eq(hotelsTable.id, hotelId));
    if (!hotel) {
      res.status(404).json({ error: 'Hotel not found' });
      return;
    }

    const [existing] = await db
      .select()
      .from(recentlyViewedTable)
      .where(
        and(
          eq(recentlyViewedTable.userId, req.user!.userId),
          eq(recentlyViewedTable.hotelId, hotelId),
        ),
      );

    if (existing) {
      await db
        .update(recentlyViewedTable)
        .set({ viewedAt: new Date() })
        .where(eq(recentlyViewedTable.id, existing.id));
      res.sendStatus(204);
      return;
    }

    await db.insert(recentlyViewedTable).values({
      userId: req.user!.userId,
      hotelId,
    });
    res.sendStatus(204);
  },
);

export default router;

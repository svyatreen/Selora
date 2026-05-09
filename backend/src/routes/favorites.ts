import { Router, type IRouter } from 'express';
import {
  db,
  favoritesTable,
  hotelsTable,
  reviewsTable,
  roomsTable,
} from '../db';
import { eq, and, inArray, sql } from 'drizzle-orm';
import { requireAuth } from '../middlewares/requireAuth';
import { AddFavoriteParams, RemoveFavoriteParams } from '../zod';
import {
  resolveHotelDescription,
  resolveLang,
} from '../lib/resolve-description';

const router: IRouter = Router();

router.get('/favorites', requireAuth, async (req, res): Promise<void> => {
  const lang = resolveLang(req);
  const favorites = await db
    .select()
    .from(favoritesTable)
    .where(eq(favoritesTable.userId, req.user!.userId));

  const hotelIds = favorites.map((f) => f.hotelId);
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

  res.json(
    hotels.map((h) => ({
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
    })),
  );
});

router.post(
  '/favorites/:hotelId',
  requireAuth,
  async (req, res): Promise<void> => {
    const rawId = Array.isArray(req.params.hotelId)
      ? req.params.hotelId[0]
      : req.params.hotelId;
    const params = AddFavoriteParams.safeParse({
      hotelId: parseInt(rawId, 10),
    });
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const [existing] = await db
      .select()
      .from(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, req.user!.userId),
          eq(favoritesTable.hotelId, params.data.hotelId),
        ),
      );

    if (existing) {
      res
        .status(201)
        .json({
          id: existing.id,
          userId: existing.userId,
          hotelId: existing.hotelId,
        });
      return;
    }

    const [fav] = await db
      .insert(favoritesTable)
      .values({ userId: req.user!.userId, hotelId: params.data.hotelId })
      .returning();

    res
      .status(201)
      .json({ id: fav.id, userId: fav.userId, hotelId: fav.hotelId });
  },
);

router.delete(
  '/favorites/:hotelId',
  requireAuth,
  async (req, res): Promise<void> => {
    const rawId = Array.isArray(req.params.hotelId)
      ? req.params.hotelId[0]
      : req.params.hotelId;
    const params = RemoveFavoriteParams.safeParse({
      hotelId: parseInt(rawId, 10),
    });
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    await db
      .delete(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, req.user!.userId),
          eq(favoritesTable.hotelId, params.data.hotelId),
        ),
      );

    res.sendStatus(204);
  },
);

export default router;

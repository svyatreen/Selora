import { Router, type IRouter } from "express";
import { db, reviewsTable, usersTable, hotelsTable } from "../db";
import { eq, sql } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/requireAuth";
import {
  GetHotelReviewsParams,
  CreateReviewParams,
  CreateReviewBody,
  DeleteReviewParams,
} from "../zod";

const router: IRouter = Router();

router.get("/hotels/:hotelId/reviews", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.hotelId) ? req.params.hotelId[0] : req.params.hotelId;
  const params = GetHotelReviewsParams.safeParse({ hotelId: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const rawLimit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
  const rawOffset = Array.isArray(req.query.offset) ? req.query.offset[0] : req.query.offset;

  const defaultLimit = 10;
  const limitParsed = rawLimit != null ? parseInt(rawLimit as string, 10) : defaultLimit;
  const offsetParsed = rawOffset != null ? parseInt(rawOffset as string, 10) : 0;

  const limit = Number.isFinite(limitParsed)
    ? Math.min(Math.max(limitParsed, 1), 50)
    : defaultLimit;
  const offset = Number.isFinite(offsetParsed) ? Math.max(offsetParsed, 0) : 0;

  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.hotelId, params.data.hotelId))
    .orderBy(sql`${reviewsTable.createdAt} desc`)
    .limit(limit)
    .offset(offset);

  const userIds = [...new Set(reviews.map((r) => r.userId))];
  const users =
    userIds.length > 0
      ? await db.select({ id: usersTable.id, name: usersTable.name, email: usersTable.email, role: usersTable.role, createdAt: usersTable.createdAt }).from(usersTable)
      : [];

  const userMap = new Map(users.map((u) => [u.id, u]));

  res.json(
    reviews.map((r) => ({
      ...r,
      user: userMap.get(r.userId) ?? { id: r.userId, name: "Unknown", email: "", role: "USER", createdAt: r.createdAt },
    }))
  );
});

router.post("/hotels/:hotelId/reviews", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.hotelId) ? req.params.hotelId[0] : req.params.hotelId;
  const params = CreateReviewParams.safeParse({ hotelId: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [review] = await db
    .insert(reviewsTable)
    .values({
      userId: req.user!.userId,
      hotelId: params.data.hotelId,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    })
    .returning();

  const [ratingRow] = await db
    .select({ avg: sql<number>`avg(${reviewsTable.rating})::float` })
    .from(reviewsTable)
    .where(eq(reviewsTable.hotelId, params.data.hotelId));

  await db
    .update(hotelsTable)
    .set({ rating: ratingRow?.avg ?? 0 })
    .where(eq(hotelsTable.id, params.data.hotelId));

  const [user] = await db
    .select({ id: usersTable.id, name: usersTable.name, email: usersTable.email, role: usersTable.role, createdAt: usersTable.createdAt })
    .from(usersTable)
    .where(eq(usersTable.id, req.user!.userId));

  res.status(201).json({ ...review, user });
});

router.delete("/reviews/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteReviewParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [review] = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.id, params.data.id));

  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }

  if (review.userId !== req.user!.userId && req.user!.role !== "ADMIN") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  await db.delete(reviewsTable).where(eq(reviewsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;

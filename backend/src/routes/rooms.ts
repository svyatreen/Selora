import { Router, type IRouter } from 'express';
import { db, roomsTable, bookingsTable, roomRatePlansTable, hotelsTable } from '../db';
import { eq, and, or, ilike, sql, asc, desc, inArray } from 'drizzle-orm';
import { requireAdmin } from '../middlewares/requireAuth';
import {
  GetRoomsByHotelParams,
  GetRoomsByHotelQueryParams,
  CreateRoomParams,
  CreateRoomBody,
  UpdateRoomParams,
  UpdateRoomBody,
  DeleteRoomParams,
} from '../zod';
import {
  resolveLang,
  resolveRoomDescription,
} from '../lib/resolve-description';
import * as zod from 'zod';

const router: IRouter = Router();

router.get('/hotels/:hotelId/rooms', async (req, res): Promise<void> => {
  const lang = resolveLang(req);
  const rawId = Array.isArray(req.params.hotelId)
    ? req.params.hotelId[0]
    : req.params.hotelId;
  const params = GetRoomsByHotelParams.safeParse({
    hotelId: parseInt(rawId, 10),
  });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const queryParams = GetRoomsByHotelQueryParams.safeParse(req.query);
  const { checkIn, checkOut } = queryParams.success ? queryParams.data : {};

  const rooms = await db
    .select()
    .from(roomsTable)
    .where(eq(roomsTable.hotelId, params.data.hotelId));

  const checkInDate = checkIn ? new Date(checkIn) : null;
  const checkOutDate = checkOut ? new Date(checkOut) : null;

  const roomsWithAvailability = await Promise.all(
    rooms.map(async (room) => {
      let bookedCount = 0;
      if (checkInDate && checkOutDate) {
        const [overlappingCount] = await db
          .select({
            count: sql<number>`count(*)::int`,
          })
          .from(bookingsTable)
          .where(
            and(
              eq(bookingsTable.roomId, room.id),
              sql`${bookingsTable.status} != 'cancelled'`,
              sql`${bookingsTable.checkIn} < ${checkOutDate.toISOString()}::timestamptz`,
              sql`${bookingsTable.checkOut} > ${checkInDate.toISOString()}::timestamptz`,
            ),
          );
        bookedCount = overlappingCount?.count ?? 0;
      }

      const remainingRooms = Math.max(0, room.totalRooms - bookedCount);
      return {
        ...room,
        description: resolveRoomDescription(room, lang),
        remainingRooms,
        isAvailable: remainingRooms > 0,
      };
    }),
  );

  res.json(roomsWithAvailability);
});

router.get('/admin/rooms', requireAdmin, async (req, res): Promise<void> => {
  const lang = resolveLang(req);
  const page = Math.max(1, parseInt((req.query.page as string) ?? '1', 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt((req.query.limit as string) ?? '12', 10) || 12));
  const search = ((req.query.search as string) ?? '').trim();
  const hotelId = req.query.hotelId ? parseInt(req.query.hotelId as string, 10) : null;
  const offset = (page - 1) * limit;

  const conditions: any[] = [];
  if (hotelId && Number.isFinite(hotelId)) conditions.push(eq(roomsTable.hotelId, hotelId));
  if (search) {
    conditions.push(
      or(
        ilike(hotelsTable.name, `%${search}%`),
        ilike(sql`${roomsTable.type}::text`, `%${search}%`),
      ),
    );
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(roomsTable)
    .leftJoin(hotelsTable, eq(roomsTable.hotelId, hotelsTable.id))
    .where(where);

  const rows = await db
    .select({ room: roomsTable, hotelName: hotelsTable.name })
    .from(roomsTable)
    .leftJoin(hotelsTable, eq(roomsTable.hotelId, hotelsTable.id))
    .where(where)
    .orderBy(asc(roomsTable.hotelId), asc(roomsTable.id))
    .limit(limit)
    .offset(offset);

  const data = rows.map(({ room, hotelName }) => ({
    ...room,
    description: resolveRoomDescription(room, lang),
    hotelName: hotelName ?? '',
  }));

  res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
});

router.post(
  '/hotels/:hotelId/rooms',
  requireAdmin,
  async (req, res): Promise<void> => {
    const rawId = Array.isArray(req.params.hotelId)
      ? req.params.hotelId[0]
      : req.params.hotelId;
    const params = CreateRoomParams.safeParse({ hotelId: parseInt(rawId, 10) });
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const parsed = CreateRoomBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const descRu = parsed.data.description_ru ?? parsed.data.description ?? null;
    const descEn = parsed.data.description_en ?? parsed.data.description ?? null;
    const descLegacy = descRu ?? descEn ?? '';

    const [{ roomCount }] = await db
      .select({ roomCount: sql<number>`count(*)::int` })
      .from(roomsTable)
      .where(eq(roomsTable.hotelId, params.data.hotelId));

    if (roomCount >= 4) {
      res.status(400).json({ error: 'Для этого отеля уже добавлены все 4 типа номеров (Одноместный, Двухместный, Делюкс, Люкс). Удалите существующий тип, чтобы добавить другой.' });
      return;
    }

    let room: any;
    try {
      const [inserted] = await db
        .insert(roomsTable)
        .values({
          type: parsed.data.type,
          price: parsed.data.price,
          guests: parsed.data.guests ?? 2,
          totalRooms: parsed.data.totalRooms ?? 1,
          description: descLegacy,
          description_ru: descRu,
          description_en: descEn,
          hotelId: params.data.hotelId,
          images: parsed.data.images ?? [],
          sizeSqm: parsed.data.sizeSqm ?? null,
          floor: parsed.data.floor ?? null,
          viewType: parsed.data.viewType ?? null,
          soundproofing: parsed.data.soundproofing ?? false,
          nonSmoking: parsed.data.nonSmoking ?? true,
          freeItems: parsed.data.freeItems ?? [],
          amenitiesDetailed: (parsed.data.amenitiesDetailed as any) ?? {},
        })
        .returning();
      room = inserted;
    } catch (err: any) {
      const pgCode = err?.code ?? (err?.cause as any)?.code;
      if (pgCode === '23505') {
        res.status(409).json({ error: 'Номер такого типа уже существует для этого отеля. Выберите другой тип или отредактируйте существующий номер.' });
        return;
      }
      throw err;
    }

    res.status(201).json(room);
  },
);

router.get('/rooms/:id', async (req, res): Promise<void> => {
  const lang = resolveLang(req);
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid room ID' });
    return;
  }

  const [room] = await db
    .select()
    .from(roomsTable)
    .where(eq(roomsTable.id, id));
  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }

  const { checkIn, checkOut } = req.query as {
    checkIn?: string;
    checkOut?: string;
  };

  if (!checkIn || !checkOut) {
    res.json({
      ...room,
      description: resolveRoomDescription(room, lang),
      remainingRooms: room.totalRooms,
      isAvailable: room.totalRooms > 0,
    });
    return;
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const [overlappingCount] = await db
    .select({
      count: sql<number>`count(*)::int`,
    })
    .from(bookingsTable)
    .where(
      and(
        eq(bookingsTable.roomId, room.id),
        sql`${bookingsTable.status} != 'cancelled'`,
        sql`${bookingsTable.checkIn} < ${checkOutDate.toISOString()}::timestamptz`,
        sql`${bookingsTable.checkOut} > ${checkInDate.toISOString()}::timestamptz`,
      ),
    );
  const bookedCount = overlappingCount?.count ?? 0;
  const remainingRooms = Math.max(0, room.totalRooms - bookedCount);

  res.json({
    ...room,
    description: resolveRoomDescription(room, lang),
    remainingRooms,
    isAvailable: remainingRooms > 0,
  });
});

router.get('/rooms/:id/rate-plans', async (req, res): Promise<void> => {
  const lang = resolveLang(req);
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid room ID' });
    return;
  }
  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, id));
  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }
  const plans = await db
    .select()
    .from(roomRatePlansTable)
    .where(eq(roomRatePlansTable.roomId, id))
    .orderBy(asc(roomRatePlansTable.priceModifier));
  res.json(
    plans.map((p) => ({
      id: p.id,
      code: p.code,
      nameRu: p.nameRu,
      nameEn: p.nameEn,
      descriptionRu: p.descriptionRu,
      descriptionEn: p.descriptionEn,
      name: lang === 'ru' ? p.nameRu : p.nameEn,
      description: lang === 'ru' ? p.descriptionRu : p.descriptionEn,
      priceModifier: p.priceModifier,
      pricePerNight: Math.round(room.price * (1 + p.priceModifier) * 100) / 100,
      refundable: p.refundable,
      includesBreakfast: p.includesBreakfast,
      includesDinner: p.includesDinner,
      freeCancellationHours: p.freeCancellationHours,
      lateCheckoutIncluded: p.lateCheckoutIncluded,
    })),
  );
});

const RatePlanBody = zod.object({
  code: zod.string(),
  nameRu: zod.string(),
  nameEn: zod.string(),
  descriptionRu: zod.string().nullish(),
  descriptionEn: zod.string().nullish(),
  priceModifier: zod.number().default(0),
  refundable: zod.boolean().default(true),
  includesBreakfast: zod.boolean().default(false),
  includesDinner: zod.boolean().default(false),
  freeCancellationHours: zod.number().nullish(),
  lateCheckoutIncluded: zod.boolean().default(false),
});

const RatePlanUpdateBody = zod.object({
  nameRu: zod.string().optional(),
  nameEn: zod.string().optional(),
  descriptionRu: zod.string().nullish(),
  descriptionEn: zod.string().nullish(),
  priceModifier: zod.number().optional(),
  refundable: zod.boolean().optional(),
  includesBreakfast: zod.boolean().optional(),
  includesDinner: zod.boolean().optional(),
  freeCancellationHours: zod.number().nullish(),
  lateCheckoutIncluded: zod.boolean().optional(),
});

router.post('/rooms/:id/rate-plans', requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const roomId = parseInt(rawId, 10);
  if (isNaN(roomId)) { res.status(400).json({ error: 'Invalid room ID' }); return; }

  const parsed = RatePlanBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  let plan: any;
  try {
    const [inserted] = await db.insert(roomRatePlansTable).values({
      roomId,
      ...parsed.data,
    }).returning();
    plan = inserted;
  } catch (err: any) {
    const pgCode = err?.code ?? (err?.cause as any)?.code;
    if (pgCode === '23505') {
      res.status(409).json({ error: 'Тариф с таким кодом уже существует для этого номера. Измените код тарифа.' });
      return;
    }
    throw err;
  }

  res.status(201).json(plan);
});

router.patch('/rooms/:id/rate-plans/:planId', requireAdmin, async (req, res): Promise<void> => {
  const planId = parseInt(req.params.planId, 10);
  if (isNaN(planId)) { res.status(400).json({ error: 'Invalid plan ID' }); return; }

  const parsed = RatePlanUpdateBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [plan] = await db.update(roomRatePlansTable).set(parsed.data as any).where(eq(roomRatePlansTable.id, planId)).returning();
  if (!plan) { res.status(404).json({ error: 'Plan not found' }); return; }

  res.json(plan);
});

router.delete('/rooms/:id/rate-plans/:planId', requireAdmin, async (req, res): Promise<void> => {
  const planId = parseInt(req.params.planId, 10);
  if (isNaN(planId)) { res.status(400).json({ error: 'Invalid plan ID' }); return; }

  const [plan] = await db.delete(roomRatePlansTable).where(eq(roomRatePlansTable.id, planId)).returning();
  if (!plan) { res.status(404).json({ error: 'Plan not found' }); return; }

  res.sendStatus(204);
});

router.patch('/rooms/:id', requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateRoomParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateRoomBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { description, description_ru, description_en, ...rest } = parsed.data;
  const setData: any = { ...rest };

  if (description_ru !== undefined) setData.description_ru = description_ru;
  if (description_en !== undefined) setData.description_en = description_en;

  const legacyDesc =
    description_ru !== undefined ? (description_ru ?? description ?? null) :
    description_en !== undefined ? (description_en ?? description ?? null) :
    description !== undefined ? description : undefined;
  if (legacyDesc !== undefined) setData.description = legacyDesc ?? '';

  const [room] = await db
    .update(roomsTable)
    .set(setData)
    .where(eq(roomsTable.id, params.data.id))
    .returning();

  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }

  res.json(room);
});

router.delete('/rooms/:id', requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteRoomParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [room] = await db
    .delete(roomsTable)
    .where(eq(roomsTable.id, params.data.id))
    .returning();
  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }

  res.sendStatus(204);
});

export default router;

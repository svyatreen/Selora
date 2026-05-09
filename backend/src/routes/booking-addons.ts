import { Router, type IRouter } from 'express';
import { db, bookingAddonsTable } from '../db';
import { eq, isNull, or, asc } from 'drizzle-orm';
import { resolveLang } from '../lib/resolve-description';
import { requireAdmin } from '../middlewares/requireAuth';
import * as zod from 'zod';

const router: IRouter = Router();

router.get('/booking-addons', async (req, res): Promise<void> => {
  const lang = resolveLang(req);
  const hotelIdRaw = req.query.hotelId as string | undefined;
  const hotelId = hotelIdRaw ? parseInt(hotelIdRaw, 10) : null;

  const where = hotelId
    ? or(isNull(bookingAddonsTable.hotelId), eq(bookingAddonsTable.hotelId, hotelId))
    : isNull(bookingAddonsTable.hotelId);

  const rows = await db
    .select()
    .from(bookingAddonsTable)
    .where(where)
    .orderBy(asc(bookingAddonsTable.category), asc(bookingAddonsTable.price));

  res.json(
    rows.map((a) => ({
      id: a.id,
      code: a.code,
      hotelId: a.hotelId,
      nameRu: a.nameRu,
      nameEn: a.nameEn,
      descriptionRu: a.descriptionRu,
      descriptionEn: a.descriptionEn,
      name: lang === 'ru' ? a.nameRu : a.nameEn,
      description: lang === 'ru' ? a.descriptionRu : a.descriptionEn,
      icon: a.icon,
      category: a.category,
      price: a.price,
      unit: a.unit,
      maxQuantity: a.maxQuantity,
    })),
  );
});

const AddonBody = zod.object({
  hotelId: zod.number().nullish(),
  code: zod.string(),
  nameRu: zod.string(),
  nameEn: zod.string(),
  descriptionRu: zod.string().nullish(),
  descriptionEn: zod.string().nullish(),
  icon: zod.string().nullish(),
  category: zod.string(),
  price: zod.number(),
  unit: zod.enum(['per_booking', 'per_night', 'per_guest', 'per_person', 'per_day', 'per_session']).default('per_booking'),
  maxQuantity: zod.number().default(1),
});

const AddonUpdateBody = zod.object({
  nameRu: zod.string().optional(),
  nameEn: zod.string().optional(),
  descriptionRu: zod.string().nullish(),
  descriptionEn: zod.string().nullish(),
  icon: zod.string().nullish(),
  category: zod.string().optional(),
  price: zod.number().optional(),
  unit: zod.enum(['per_booking', 'per_night', 'per_guest', 'per_person', 'per_day', 'per_session']).optional(),
  maxQuantity: zod.number().optional(),
});

router.post('/booking-addons', requireAdmin, async (req, res): Promise<void> => {
  const parsed = AddonBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const values = {
    hotelId: parsed.data.hotelId ?? null,
    code: parsed.data.code,
    nameRu: parsed.data.nameRu,
    nameEn: parsed.data.nameEn,
    descriptionRu: parsed.data.descriptionRu ?? null,
    descriptionEn: parsed.data.descriptionEn ?? null,
    icon: parsed.data.icon ?? null,
    category: parsed.data.category,
    price: parsed.data.price,
    unit: parsed.data.unit,
    maxQuantity: parsed.data.maxQuantity,
  };

  const [addon] = await db.insert(bookingAddonsTable).values(values)
    .onConflictDoUpdate({
      target: [bookingAddonsTable.code, bookingAddonsTable.hotelId],
      set: {
        nameRu: values.nameRu,
        nameEn: values.nameEn,
        descriptionRu: values.descriptionRu,
        descriptionEn: values.descriptionEn,
        icon: values.icon,
        category: values.category,
        price: values.price,
        unit: values.unit,
        maxQuantity: values.maxQuantity,
      },
    }).returning();

  res.status(201).json(addon);
});

router.patch('/booking-addons/:id', requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: 'Invalid addon ID' }); return; }

  const parsed = AddonUpdateBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [addon] = await db.update(bookingAddonsTable).set(parsed.data as any).where(eq(bookingAddonsTable.id, id)).returning();
  if (!addon) { res.status(404).json({ error: 'Addon not found' }); return; }

  res.json(addon);
});

router.delete('/booking-addons/:id', requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: 'Invalid addon ID' }); return; }

  const [addon] = await db.delete(bookingAddonsTable).where(eq(bookingAddonsTable.id, id)).returning();
  if (!addon) { res.status(404).json({ error: 'Addon not found' }); return; }

  res.sendStatus(204);
});

export default router;

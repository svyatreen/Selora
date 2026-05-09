import { Router, type IRouter } from 'express';
import {
  db,
  bookingsTable,
  roomsTable,
  hotelsTable,
  usersTable,
  paymentMethodsTable,
  roomRatePlansTable,
  bookingAddonsTable,
  bookingAddonSelectionsTable,
} from '../db';
import { eq, and, or, sql, inArray, like, desc } from 'drizzle-orm';
import { z } from 'zod';
import { requireAuth, requireAdmin } from '../middlewares/requireAuth';
import {
  GetBookingParams,
  CancelBookingParams,
  PayBookingParams,
} from '../zod';
import {
  sendMail,
  emailBookingPaid,
  emailBookingConfirmed,
  emailBookingCancelled,
} from '../lib/mailer';
import { stripe } from '../lib/stripe';
import { logger } from '../lib/logger';

const ROOM_TYPE_LABELS: Record<string, string> = {
  single: 'Одноместный номер',
  double: 'Двухместный номер',
  deluxe: 'Делюкс',
  suite: 'Люкс',
};
function formatRoomType(type: string): string {
  return ROOM_TYPE_LABELS[type] ?? type;
}

const CreateBookingBody = z.object({
  roomId: z.coerce.number().int().positive(),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  guests: z.coerce.number().int().min(1).max(8).optional(),
  ratePlanCode: z.string().optional(),
  currency: z.string().optional(),
  exchangeRate: z.number().positive().optional(),
  addons: z
    .array(
      z.object({
        addonId: z.coerce.number().int().positive(),
        quantity: z.coerce.number().int().min(1).max(20).default(1),
      }),
    )
    .optional(),
});
import {
  resolveHotelDescription,
  resolveLang,
  resolveRoomDescription,
} from '../lib/resolve-description';

const PayBookingExtendedBody = z.object({
  paymentIntentId: z.string().optional(),
  savedCardId: z.number().int().positive().optional(),
  saveCard: z.boolean().optional(),
});

const router: IRouter = Router();

async function bookingWithDetails(
  booking: typeof bookingsTable.$inferSelect,
  lang: ReturnType<typeof resolveLang>,
) {
  const [room] = await db
    .select()
    .from(roomsTable)
    .where(eq(roomsTable.id, booking.roomId));
  const [hotel] = await db
    .select()
    .from(hotelsTable)
    .where(eq(hotelsTable.id, room?.hotelId ?? 0));

  let ratePlan: { refundable: boolean } | null = null;
  if (booking.ratePlanCode && room) {
    const [plan] = await db
      .select()
      .from(roomRatePlansTable)
      .where(
        and(
          eq(roomRatePlansTable.roomId, room.id),
          eq(roomRatePlansTable.code, booking.ratePlanCode),
        ),
      );
    if (plan) {
      ratePlan = { refundable: plan.refundable };
    }
  }

  return {
    ...booking,
    ratePlan,
    room: room
      ? {
          ...room,
          description: resolveRoomDescription(room, lang),
        }
      : null,
    hotel: hotel
      ? {
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
          images: hotel.images,
          reviewCount: 0,
          minPrice: null,
          createdAt: hotel.createdAt,
        }
      : null,
  };
}

router.get('/bookings', requireAdmin, async (req, res): Promise<void> => {
  const page = Math.max(1, parseInt((req.query.page as string) ?? '1', 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt((req.query.limit as string) ?? '15', 10) || 15));
  const search = ((req.query.search as string) ?? '').trim();
  const status = (req.query.status as string | undefined);
  const offset = (page - 1) * limit;

  const conditions: any[] = [];
  if (status && status !== 'all') {
    conditions.push(eq(bookingsTable.status, status as any));
  }
  if (search) {
    conditions.push(
      or(
        like(usersTable.name, `%${search}%`),
        like(usersTable.email, `%${search}%`),
        like(hotelsTable.name, `%${search}%`),
      ),
    );
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(bookingsTable)
    .leftJoin(usersTable, eq(bookingsTable.userId, usersTable.id))
    .leftJoin(roomsTable, eq(bookingsTable.roomId, roomsTable.id))
    .leftJoin(hotelsTable, eq(roomsTable.hotelId, hotelsTable.id))
    .where(where);

  const rows = await db
    .select({
      booking: bookingsTable,
      user: { id: usersTable.id, name: usersTable.name, email: usersTable.email },
      room: { id: roomsTable.id, type: roomsTable.type, hotelId: roomsTable.hotelId },
      hotel: { id: hotelsTable.id, name: hotelsTable.name },
    })
    .from(bookingsTable)
    .leftJoin(usersTable, eq(bookingsTable.userId, usersTable.id))
    .leftJoin(roomsTable, eq(bookingsTable.roomId, roomsTable.id))
    .leftJoin(hotelsTable, eq(roomsTable.hotelId, hotelsTable.id))
    .where(where)
    .orderBy(desc(bookingsTable.createdAt))
    .limit(limit)
    .offset(offset);

  const data = rows.map(({ booking, user, room, hotel }) => ({
    ...booking,
    user: user?.id ? user : null,
    room: room?.id ? room : null,
    hotel: hotel?.id ? hotel : null,
  }));

  res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
});

router.get('/rooms/:id/availability', async (req, res): Promise<void> => {
  const roomId = parseInt(req.params.id, 10);
  if (isNaN(roomId)) { res.status(400).json({ error: 'Invalid room ID' }); return; }

  const checkIn = req.query.checkIn as string;
  const checkOut = req.query.checkOut as string;

  if (!checkIn || !checkOut) {
    res.status(400).json({ error: 'checkIn and checkOut are required' });
    return;
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime()) || checkInDate >= checkOutDate) {
    res.status(400).json({ error: 'Invalid date range' });
    return;
  }

  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, roomId));
  if (!room) { res.status(404).json({ error: 'Room not found' }); return; }

  const [overlappingCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(bookingsTable)
    .where(
      and(
        eq(bookingsTable.roomId, roomId),
        sql`${bookingsTable.status} != 'cancelled'`,
        sql`${bookingsTable.checkIn}::date < ${checkOut}::date`,
        sql`${bookingsTable.checkOut}::date > ${checkIn}::date`,
      ),
    );

  const booked = overlappingCount?.count ?? 0;
  const available = Math.max(0, room.totalRooms - booked);

  res.json({ available, total: room.totalRooms, booked });
});

router.post('/bookings', requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { roomId, checkIn, checkOut, ratePlanCode, addons, currency, exchangeRate } = parsed.data;
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkInDate >= checkOutDate) {
    res.status(400).json({ error: 'Check-out must be after check-in' });
    return;
  }

  const [room] = await db
    .select()
    .from(roomsTable)
    .where(eq(roomsTable.id, roomId));
  if (!room) {
    res.status(400).json({ error: 'Room not found' });
    return;
  }

  const [overlappingCount] = await db
    .select({
      count: sql<number>`count(*)::int`,
    })
    .from(bookingsTable)
    .where(
      and(
        eq(bookingsTable.roomId, roomId),
        sql`${bookingsTable.status} != 'cancelled'`,
        sql`${bookingsTable.checkIn}::date < ${checkOut}::date`,
        sql`${bookingsTable.checkOut}::date > ${checkIn}::date`,
      ),
    );

  const remainingRooms = Math.max(
    0,
    room.totalRooms - (overlappingCount?.count ?? 0),
  );
  if (remainingRooms <= 0) {
    res
      .status(400)
      .json({ error: 'Room is not available for the selected dates' });
    return;
  }

  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  let pricePerNight = room.price;
  if (ratePlanCode) {
    const [plan] = await db
      .select()
      .from(roomRatePlansTable)
      .where(
        and(
          eq(roomRatePlansTable.roomId, roomId),
          eq(roomRatePlansTable.code, ratePlanCode),
        ),
      );
    if (plan) {
      pricePerNight = Math.round(room.price * (1 + plan.priceModifier) * 100) / 100;
    }
  }

  let addonsTotal = 0;
  const validatedAddons: Array<{ addonId: number; quantity: number; price: number }> = [];
  if (addons && addons.length > 0) {
    const ids = addons.map((a) => a.addonId);
    const rows = await db
      .select()
      .from(bookingAddonsTable)
      .where(inArray(bookingAddonsTable.id, ids));
    const byId = new Map(rows.map((r) => [r.id, r]));
    for (const sel of addons) {
      const a = byId.get(sel.addonId);
      if (!a) continue;
      const qty = Math.max(1, Math.min(a.maxQuantity, sel.quantity));
      let line = a.price * qty;
      if (a.unit === 'per_night') line *= nights;
      addonsTotal += line;
      validatedAddons.push({ addonId: a.id, quantity: qty, price: a.price });
    }
  }

  const SERVICE_FEE = 0.1;
  const totalPrice = Math.round((pricePerNight * nights + addonsTotal) * (1 + SERVICE_FEE) * 100) / 100;
  const bookingCurrency = currency || 'USD';
  const bookingExchangeRate = (exchangeRate && exchangeRate > 0) ? exchangeRate : null;

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      userId: req.user!.userId,
      roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
      currency: bookingCurrency,
      exchangeRate: bookingExchangeRate,
      ratePlanCode: ratePlanCode ?? null,
      status: 'pending',
    })
    .returning();

  if (validatedAddons.length > 0) {
    await db.insert(bookingAddonSelectionsTable).values(
      validatedAddons.map((va) => ({
        bookingId: booking.id,
        addonId: va.addonId,
        quantity: va.quantity,
        priceAtBooking: va.price,
      })),
    );
  }

  const [bookingUser] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId));
  const [bookingRoom] = await db.select().from(roomsTable).where(eq(roomsTable.id, roomId));
  const [bookingHotel] = bookingRoom
    ? await db.select().from(hotelsTable).where(eq(hotelsTable.id, bookingRoom.hotelId))
    : [null];

  res.status(201).json(booking);
});

router.post('/bookings/:id/create-payment-intent', requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetBookingParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, params.data.id));
  if (!booking) { res.status(404).json({ error: 'Booking not found' }); return; }
  if (booking.userId !== req.user!.userId && req.user!.role !== 'ADMIN') {
    res.status(403).json({ error: 'Forbidden' }); return;
  }
  if (booking.status !== 'pending') {
    res.status(400).json({ error: 'Booking is not pending' }); return;
  }

  const [bookingUser] = await db.select().from(usersTable).where(eq(usersTable.id, booking.userId));

  if (!stripe) {
    res.status(503).json({ error: 'Payment processing is not configured' });
    return;
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(booking.totalPrice * 100),
    currency: 'usd',
    metadata: { bookingId: String(booking.id), userId: String(booking.userId) },
    receipt_email: bookingUser?.email,
    description: `Selora booking #${booking.id}`,
  });

  res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
});

router.get('/bookings/:id', requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetBookingParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const lang = resolveLang(req);

  const [booking] = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.id, params.data.id));

  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  if (booking.userId !== req.user!.userId && req.user!.role !== 'ADMIN') {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  res.json(await bookingWithDetails(booking, lang));
});

router.post(
  '/bookings/:id/confirm',
  requireAdmin,
  async (req, res): Promise<void> => {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId, 10);
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid booking id' });
      return;
    }
    const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id));
    if (!booking) { res.status(404).json({ error: 'Booking not found' }); return; }
    if (booking.status === 'verified') { res.status(400).json({ error: 'Already verified' }); return; }
    if (booking.status === 'cancelled') { res.status(400).json({ error: 'Cannot confirm cancelled booking' }); return; }
    if (booking.status === 'pending') { res.status(400).json({ error: 'Cannot confirm unpaid booking' }); return; }
    const lang = resolveLang(req);
    const [updated] = await db.update(bookingsTable).set({ status: 'verified' }).where(eq(bookingsTable.id, id)).returning();
    const [confirmUser] = await db.select().from(usersTable).where(eq(usersTable.id, booking.userId));
    const [confirmRoom] = await db.select().from(roomsTable).where(eq(roomsTable.id, booking.roomId));
    const [confirmHotel] = confirmRoom ? await db.select().from(hotelsTable).where(eq(hotelsTable.id, confirmRoom.hotelId)) : [null];
    if (confirmUser && confirmRoom && confirmHotel) {
      const fmt = (d: Date) => new Date(d).toLocaleDateString('ru-RU');
      const nights = Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24));
      sendMail({
        to: confirmUser.email,
        ...emailBookingConfirmed({
          name: confirmUser.name,
          bookingId: booking.id,
          hotelName: confirmHotel.name,
          roomName: formatRoomType(confirmRoom.type),
          checkIn: fmt(booking.checkIn),
          checkOut: fmt(booking.checkOut),
          nights,
          totalPrice: booking.totalPrice,
          currency: booking.currency,
          exchangeRate: booking.exchangeRate,
        }),
      }).catch((err) => {
        logger.error({ err, bookingId: booking.id, email: confirmUser.email }, "Failed to send booking confirmed email");
      });
    }
    res.json(await bookingWithDetails(updated, lang));
  },
);

router.post(
  '/bookings/:id/cancel',
  requireAuth,
  async (req, res): Promise<void> => {
    const rawId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const params = CancelBookingParams.safeParse({ id: parseInt(rawId, 10) });
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const [booking] = await db
      .select()
      .from(bookingsTable)
      .where(eq(bookingsTable.id, params.data.id));

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    if (booking.userId !== req.user!.userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    if (booking.status === 'cancelled') {
      res.status(400).json({ error: 'Booking is already cancelled' });
      return;
    }

    const [updated] = await db
      .update(bookingsTable)
      .set({ status: 'cancelled' })
      .where(eq(bookingsTable.id, params.data.id))
      .returning();

    const [cancelUser] = await db.select().from(usersTable).where(eq(usersTable.id, booking.userId));
    const [cancelRoom] = await db.select().from(roomsTable).where(eq(roomsTable.id, booking.roomId));
    const [cancelHotel] = cancelRoom
      ? await db.select().from(hotelsTable).where(eq(hotelsTable.id, cancelRoom.hotelId))
      : [null];
    if (cancelUser && cancelRoom && cancelHotel) {
      const fmt = (d: Date) => new Date(d).toLocaleDateString('ru-RU');
      const cancelNights = Math.ceil(
        (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24),
      );
      sendMail({
        to: cancelUser.email,
        ...emailBookingCancelled({
          name: cancelUser.name,
          bookingId: booking.id,
          hotelName: cancelHotel.name,
          roomName: formatRoomType(cancelRoom.type),
          checkIn: fmt(booking.checkIn),
          checkOut: fmt(booking.checkOut),
          nights: cancelNights,
          totalPrice: booking.totalPrice,
          currency: booking.currency,
          exchangeRate: booking.exchangeRate,
        }),
      }).catch((err) => {
        logger.error({ err, bookingId: booking.id, email: cancelUser.email }, "Failed to send booking cancelled email");
      });
    }

    res.json(updated);
  },
);

router.post(
  '/bookings/:id/pay',
  requireAuth,
  async (req, res): Promise<void> => {
    const rawId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const params = PayBookingParams.safeParse({ id: parseInt(rawId, 10) });
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const parsed = PayBookingExtendedBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [booking] = await db
      .select()
      .from(bookingsTable)
      .where(eq(bookingsTable.id, params.data.id));

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    if (booking.userId !== req.user!.userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    if (booking.status !== 'pending') {
      res
        .status(400)
        .json({ error: 'Booking cannot be paid in its current state' });
      return;
    }

    const { paymentIntentId, savedCardId, saveCard } = parsed.data;

    if (paymentIntentId) {
      if (!stripe) {
        res.status(503).json({ error: 'Payment processing is not configured' });
        return;
      }
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (pi.status !== 'succeeded') {
        res.status(400).json({ error: `Payment not completed (status: ${pi.status})` });
        return;
      }
      if (pi.metadata?.bookingId !== String(params.data.id)) {
        res.status(400).json({ error: 'Payment intent does not match this booking' });
        return;
      }
      const pmId = typeof pi.payment_method === 'string' ? pi.payment_method : pi.payment_method?.id;
      if (pmId && saveCard) {
        try {
          const pm = await stripe.paymentMethods.retrieve(pmId);
          if (pm.card) {
            const existing = await db.select({ id: paymentMethodsTable.id })
              .from(paymentMethodsTable)
              .where(eq(paymentMethodsTable.userId, req.user!.userId));
            const isDefault = existing.length === 0;
            await db.insert(paymentMethodsTable).values({
              userId: req.user!.userId,
              brand: pm.card.brand.charAt(0).toUpperCase() + pm.card.brand.slice(1),
              last4: pm.card.last4,
              expMonth: pm.card.exp_month,
              expYear: pm.card.exp_year,
              cardholderName: pm.billing_details.name ?? '',
              isDefault,
            }).onConflictDoNothing();
          }
        } catch (_) {}
      }
    } else if (savedCardId) {
      const [card] = await db
        .select()
        .from(paymentMethodsTable)
        .where(and(eq(paymentMethodsTable.id, savedCardId), eq(paymentMethodsTable.userId, req.user!.userId)));
      if (!card) { res.status(400).json({ error: 'Saved card not found' }); return; }
    } else {
      res.status(400).json({ error: 'Payment method required' });
      return;
    }

    const [updated] = await db
      .update(bookingsTable)
      .set({ status: 'confirmed' })
      .where(eq(bookingsTable.id, params.data.id))
      .returning();

    const [payUser] = await db.select().from(usersTable).where(eq(usersTable.id, booking.userId));
    const [payRoom] = await db.select().from(roomsTable).where(eq(roomsTable.id, booking.roomId));
    const [payHotel] = payRoom
      ? await db.select().from(hotelsTable).where(eq(hotelsTable.id, payRoom.hotelId))
      : [null];
    if (payUser && payRoom && payHotel) {
      const fmt = (d: Date) => new Date(d).toLocaleDateString('ru-RU');
      const nights = Math.ceil(
        (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24),
      );
      sendMail({
        to: payUser.email,
        ...emailBookingPaid({
          name: payUser.name,
          bookingId: booking.id,
          hotelName: payHotel.name,
          roomName: formatRoomType(payRoom.type),
          checkIn: fmt(booking.checkIn),
          checkOut: fmt(booking.checkOut),
          nights,
          totalPrice: booking.totalPrice,
          currency: booking.currency,
          exchangeRate: booking.exchangeRate,
        }),
      }).catch((err) => {
        logger.error({ err, bookingId: booking.id, email: payUser.email }, "Failed to send booking paid email");
      });
    }

    res.json(updated);
  },
);

export default router;

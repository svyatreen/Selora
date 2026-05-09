import app from "./app";
import { logger } from "./lib/logger";
import { db, bookingsTable, usersTable, roomsTable, hotelsTable } from "./db";
import { eq, and, lt } from "drizzle-orm";
import { sendMail, emailBookingCancelled } from "./lib/mailer";

const rawPort = process.env["PORT"] ?? "8080";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const PENDING_EXPIRY_MS = 30 * 60 * 1000;

async function expirePendingBookings() {
  try {
    const expiryTime = new Date(Date.now() - PENDING_EXPIRY_MS);
    const expired = await db
      .update(bookingsTable)
      .set({ status: "cancelled" })
      .where(
        and(
          eq(bookingsTable.status, "pending"),
          lt(bookingsTable.createdAt, expiryTime),
        ),
      )
      .returning();

    if (expired.length > 0) {
      logger.info({ count: expired.length }, "Auto-expired pending bookings");

      for (const booking of expired) {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, booking.userId));
        const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, booking.roomId));
        const [hotel] = room
          ? await db.select().from(hotelsTable).where(eq(hotelsTable.id, room.hotelId))
          : [null];
        if (user && room && hotel) {
          const fmt = (d: Date) => new Date(d).toLocaleDateString("ru-RU");
          const nights = Math.ceil(
            (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24),
          );
          sendMail({
            to: user.email,
            ...emailBookingCancelled({
              name: user.name,
              bookingId: booking.id,
              hotelName: hotel.name,
              roomName: room.type,
              checkIn: fmt(booking.checkIn),
              checkOut: fmt(booking.checkOut),
              nights,
              totalPrice: booking.totalPrice,
              currency: booking.currency,
              exchangeRate: booking.exchangeRate,
            }),
          }).catch(() => {});
        }
      }
    }
  } catch (err) {
    logger.error({ err }, "Failed to auto-expire pending bookings");
  }
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  setInterval(expirePendingBookings, 5 * 60 * 1000);
  setTimeout(expirePendingBookings, 10_000);
});

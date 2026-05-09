import app from "./app";
import { logger } from "./lib/logger";
import { db, bookingsTable, usersTable, roomsTable, hotelsTable } from "./db";
import { eq, and, lt } from "drizzle-orm";
import { sendMail, emailBookingCancelled } from "./lib/mailer";

const port = Number(process.env.PORT);

if (!port) {
  throw new Error("PORT is required");
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
        const [user] = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, booking.userId));

        const [room] = await db
          .select()
          .from(roomsTable)
          .where(eq(roomsTable.id, booking.roomId));

        const [hotel] = room
          ? await db
              .select()
              .from(hotelsTable)
              .where(eq(hotelsTable.id, room.hotelId))
          : [null];

        if (user && room && hotel) {
          sendMail({
            to: user.email,
            subject: "Booking cancelled",
            text: `Booking ${booking.id} cancelled`,
          }).catch(() => {});
        }
      }
    }
  } catch (err) {
    logger.error({ err }, "Failed to expire bookings");
  }
}

app.listen(port, "0.0.0.0", () => {
  logger.info({ port }, "Server running");

  setInterval(expirePendingBookings, 5 * 60 * 1000);
  setTimeout(expirePendingBookings, 10_000);
});
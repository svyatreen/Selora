import { pgTable, serial, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { hotelsTable } from "./hotels";

export const recentlyViewedTable = pgTable(
  "recently_viewed",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    hotelId: integer("hotel_id").notNull().references(() => hotelsTable.id, { onDelete: "cascade" }),
    viewedAt: timestamp("viewed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userHotelUnique: uniqueIndex("recently_viewed_user_hotel_unique").on(table.userId, table.hotelId),
  })
);

export type RecentlyViewed = typeof recentlyViewedTable.$inferSelect;

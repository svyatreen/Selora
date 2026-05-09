import { pgTable, text, serial, integer, real, jsonb, boolean, timestamp, unique } from "drizzle-orm/pg-core";
import { hotelsTable } from "./hotels";
import { bookingsTable } from "./bookings";

export const bookingAddonsTable = pgTable(
  "booking_addons",
  {
    id: serial("id").primaryKey(),
    hotelId: integer("hotel_id").references(() => hotelsTable.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    nameRu: text("name_ru").notNull(),
    nameEn: text("name_en").notNull(),
    descriptionRu: text("description_ru"),
    descriptionEn: text("description_en"),
    icon: text("icon"),
    category: text("category").notNull(),
    price: real("price").notNull(),
    unit: text("unit").notNull().default("per_booking"),
    maxQuantity: integer("max_quantity").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    addonsCodeHotelUnique: unique("addons_code_hotel_unique").on(table.code, table.hotelId),
  }),
);

export type BookingAddon = typeof bookingAddonsTable.$inferSelect;

export const bookingAddonSelectionsTable = pgTable("booking_addon_selections", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookingsTable.id, { onDelete: "cascade" }),
  addonId: integer("addon_id").notNull().references(() => bookingAddonsTable.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  priceAtBooking: real("price_at_booking").notNull(),
});

export type BookingAddonSelection = typeof bookingAddonSelectionsTable.$inferSelect;

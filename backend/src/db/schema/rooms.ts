import { pgTable, text, serial, timestamp, integer, real, pgEnum, unique, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { hotelsTable } from "./hotels";

type AmenitiesDetailedMap = { [key: string]: string[] };

export const roomTypeEnum = pgEnum("room_type", ["single", "double", "deluxe", "suite"]);

export const roomsTable = pgTable(
  "rooms",
  {
    id: serial("id").primaryKey(),
    hotelId: integer("hotel_id").notNull().references(() => hotelsTable.id, { onDelete: "cascade" }),
    type: roomTypeEnum("type").notNull(),
    price: real("price").notNull(),
    guests: integer("guests").notNull().default(1),
    totalRooms: integer("total_rooms").notNull().default(1),
    description: text("description").notNull(),
    description_ru: text("description_ru"),
    description_en: text("description_en"),
    images: text("images").array().notNull().default([]),

    sizeSqm: integer("size_sqm"),
    floor: text("floor"),
    viewType: text("view_type"),
    bedConfiguration: jsonb("bed_configuration").$type<Array<{ type: string; count: number }>>().default([]),
    bathType: text("bath_type"),
    soundproofing: boolean("soundproofing").notNull().default(false),
    nonSmoking: boolean("non_smoking").notNull().default(true),
    amenitiesDetailed: jsonb("amenities_detailed").$type<AmenitiesDetailedMap>().default({}),
    freeItems: text("free_items").array().notNull().default([]),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    hotelRoomTypeUnique: unique("rooms_hotel_id_type_unique").on(table.hotelId, table.type),
  }),
);

export const insertRoomSchema = createInsertSchema(roomsTable).omit({ id: true, createdAt: true });
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof roomsTable.$inferSelect;

export const roomRatePlansTable = pgTable(
  "room_rate_plans",
  {
    id: serial("id").primaryKey(),
    roomId: integer("room_id").notNull().references(() => roomsTable.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    nameRu: text("name_ru").notNull(),
    nameEn: text("name_en").notNull(),
    descriptionRu: text("description_ru"),
    descriptionEn: text("description_en"),
    priceModifier: real("price_modifier").notNull().default(0),
    refundable: boolean("refundable").notNull().default(true),
    includesBreakfast: boolean("includes_breakfast").notNull().default(false),
    includesDinner: boolean("includes_dinner").notNull().default(false),
    freeCancellationHours: integer("free_cancellation_hours"),
    lateCheckoutIncluded: boolean("late_checkout_included").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    roomCodeUnique: unique("rate_plans_room_code_unique").on(table.roomId, table.code),
  }),
);

export type RoomRatePlan = typeof roomRatePlansTable.$inferSelect;

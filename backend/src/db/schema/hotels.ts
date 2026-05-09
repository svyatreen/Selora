import { pgTable, text, serial, timestamp, integer, real, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

type AmenitiesMap = { [key: string]: string[] };

type NearbyPlace = {
  osmId: number;
  type: string;
  category: string;
  name: string;
  nameRu?: string | null;
  nameEn?: string | null;
  cuisine?: string | null;
  opening_hours?: string | null;
  website?: string | null;
  phone?: string | null;
  address?: string | null;
  latitude: number;
  longitude: number;
  distanceKm: number;
  walkMinutes: number;
};

type NearbyPlacesMap = { [key: string]: NearbyPlace[] };

export const hotelsTable = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  description_ru: text("description_ru"),
  description_en: text("description_en"),
  city: text("city").notNull(),
  address: text("address").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  rating: real("rating").notNull().default(0),
  stars: integer("stars").notNull().default(3),
  amenities: text("amenities").array().notNull().default([]),
  images: text("images").array().notNull().default([]),

  amenitiesExtended: jsonb("amenities_extended").$type<AmenitiesMap>().default({}),
  languages: text("languages").array().notNull().default([]),
  checkInTime: text("check_in_time"),
  checkOutTime: text("check_out_time"),
  earlyCheckIn: jsonb("early_check_in").$type<{ available: boolean; fee: number; currency?: string }>(),
  lateCheckOut: jsonb("late_check_out").$type<{ available: boolean; fee: number; currency?: string }>(),
  parking: jsonb("parking").$type<{ available: boolean; free: boolean; covered: boolean; valet: boolean; price?: number; currency?: string }>(),
  accessibility: jsonb("accessibility").$type<{ wheelchairAccessible: boolean; elevator: boolean; rampedEntrance: boolean; accessibleRooms: boolean; brailleSignage: boolean; hearingAssistance: boolean }>(),
  petPolicy: jsonb("pet_policy").$type<{ allowed: boolean; maxWeightKg?: number; fee?: number; restrictions?: string }>(),
  childPolicy: jsonb("child_policy").$type<{ allowed: boolean; ageGroups: Array<{ from: number; to: number; pricing: 'free' | 'reduced' | 'full' }> }>(),
  paymentMethods: text("payment_methods").array().notNull().default([]),
  popularBadge: text("popular_badge"),
  includedInPrice: text("included_in_price").array().notNull().default([]),
  notIncluded: text("not_included").array().notNull().default([]),
  keyDistances: jsonb("key_distances").$type<Array<{ type: string; nameRu: string; nameEn: string; distanceKm: number; durationWalkMin?: number; durationDriveMin?: number }>>().default([]),
  nearbyPlaces: jsonb("nearby_places").$type<NearbyPlacesMap>().default({}),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertHotelSchema = createInsertSchema(hotelsTable).omit({ id: true, createdAt: true, rating: true });
export type InsertHotel = z.infer<typeof insertHotelSchema>;
export type Hotel = typeof hotelsTable.$inferSelect;

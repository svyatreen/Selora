import type { Request } from "express";

export type Lang = "en" | "ru";

export function resolveLang(req: Request): Lang {
  const header = req.header("x-selora-lang");
  if (header === "en") return "en";
  return "ru";
}

export function resolveHotelDescription(hotel: any, lang: Lang): string {
  if (lang === "en") return hotel.description_en ?? hotel.description_ru ?? hotel.description ?? "";
  return hotel.description_ru ?? hotel.description_en ?? hotel.description ?? "";
}

export function resolveRoomDescription(room: any, lang: Lang): string {
  if (lang === "en") return room.description_en ?? room.description_ru ?? room.description ?? "";
  return room.description_ru ?? room.description_en ?? room.description ?? "";
}


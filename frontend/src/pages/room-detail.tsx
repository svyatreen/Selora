import { useState, useEffect } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { ru as ruLocale } from "date-fns/locale";
import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@/api/custom-fetch";
import {
  useGetRoom, getGetRoomQueryKey,
  useGetHotel, getGetHotelQueryKey,
  useGetRoomsByHotel, getGetRoomsByHotelQueryKey,
  useCreateBooking,
} from "@/api";
import { RoomDetailedAmenities } from "@/components/room/RoomDetailedAmenities";
import { FreeItemsList } from "@/components/room/FreeItemsList";
import { RatePlanSelector } from "@/components/room/RatePlanSelector";
import { AddonsSelector, type AddonSelection } from "@/components/room/AddonsSelector";
import type { RoomExtensions, RatePlan, BookingAddon } from "@/lib/extended-types";
import { format, differenceInCalendarDays } from "date-fns";
import { cn } from "@/lib/utils";
import { paragraphsWithoutLast, removeLastParagraphPreview } from "@/lib/description-utils";
import {
  ArrowLeft, Star, Users, BedDouble, Maximize2, Wifi, Coffee,
  Tv, Wind, Check, CalendarDays, ChevronLeft, ChevronRight, Shield,
  Clock, CreditCard, Mountain, UserCheck, CigaretteOff, Volume2,
} from "lucide-react";
import { VIEW_LABELS } from "@/lib/amenity-codes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DateRangePopover } from "@/components/ui/date-range-popover";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useStayDates } from "@/hooks/use-stay-dates";
import { toast } from "sonner";

const ROOM_TYPE_COLORS: Record<string, string> = {
  single: "bg-blue-500/10 text-blue-700 border-blue-200",
  double: "bg-green-500/10 text-green-700 border-green-200",
  deluxe: "bg-amber-500/10 text-amber-700 border-amber-200",
  suite: "bg-purple-500/10 text-purple-700 border-purple-200",
};

export default function RoomDetail() {
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { formatPrice, currency, rates } = useCurrency();
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.resolvedLanguage === "ru" ? ruLocale : undefined;
  const currentLang = i18n.resolvedLanguage === "en" ? "en" : "ru";
  const hId = parseInt(hotelId, 10);
  const rId = parseInt(roomId, 10);

  const [activeImage, setActiveImage] = useState(0);
  const [date, setDate] = useStayDates();

  useEffect(() => { window.scrollTo(0, 0); }, [roomId]);

  const checkInStr = date.from ? format(date.from, "yyyy-MM-dd") : undefined;
  const checkOutStr = date.to ? format(date.to, "yyyy-MM-dd") : undefined;

  const { data: room, isLoading: isLoadingRoom } = useGetRoom(
    rId,
    { checkIn: checkInStr, checkOut: checkOutStr },
    {
      query: {
        enabled: !!rId,
        queryKey: [...getGetRoomQueryKey(rId, { checkIn: checkInStr, checkOut: checkOutStr }), currentLang],
        placeholderData: keepPreviousData,
      },
      request: { headers: { "x-selora-lang": currentLang } },
    }
  );

  const { data: hotel, isLoading: isLoadingHotel } = useGetHotel(hId, {
    query: { enabled: !!hId, queryKey: [...getGetHotelQueryKey(hId), currentLang] },
    request: { headers: { "x-selora-lang": currentLang } },
  });

  const { data: allRooms } = useGetRoomsByHotel(hId, {}, {
    query: { enabled: !!hId, queryKey: [...getGetRoomsByHotelQueryKey(hId, {}), currentLang] },
    request: { headers: { "x-selora-lang": currentLang } },
  });

  const createBooking = useCreateBooking();
  const nights = date.from && date.to ? differenceInCalendarDays(date.to, date.from) : 0;

  const [selectedRatePlan, setSelectedRatePlan] = useState<string>("standard");
  const [addonSelections, setAddonSelections] = useState<AddonSelection[]>([]);

  const { data: ratePlans } = useQuery({
    queryKey: ["room-rate-plans", rId, currentLang],
    enabled: !!rId,
    queryFn: () =>
      customFetch<RatePlan[]>(`/api/rooms/${rId}/rate-plans`, {
        headers: { "x-selora-lang": currentLang },
      }),
  });

  const { data: bookingAddons } = useQuery({
    queryKey: ["booking-addons", hId, currentLang],
    enabled: !!hId,
    queryFn: () =>
      customFetch<BookingAddon[]>(`/api/booking-addons?hotelId=${hId}`, {
        headers: { "x-selora-lang": currentLang },
      }),
  });

  const { data: availability, isLoading: isLoadingAvailability } = useQuery({
    queryKey: ["room-availability", rId, checkInStr, checkOutStr],
    enabled: !!rId && !!checkInStr && !!checkOutStr,
    queryFn: () =>
      customFetch<{ available: number; total: number; booked: number }>(
        `/api/rooms/${rId}/availability?checkIn=${checkInStr}&checkOut=${checkOutStr}`,
      ),
  });

  const isDateSelected = !!date.from && !!date.to;
  const availableCount = isDateSelected ? (availability?.available ?? null) : null;
  const isUnavailableForDates = availableCount !== null && availableCount <= 0;

  const handleBook = () => {
    if (!isAuthenticated) {
      toast.error(t("room.loginToBook"));
      setLocation("/login");
      return;
    }
    if (!date.from || !date.to) {
      toast.error(t("room.selectDatesError"));
      return;
    }
    createBooking.mutate(
      {
        data: {
          roomId: rId,
          checkIn: format(date.from, "yyyy-MM-dd"),
          checkOut: format(date.to, "yyyy-MM-dd"),
          ratePlanCode: selectedRatePlan,
          addons: addonSelections,
          currency: currency.code,
          exchangeRate: rates[currency.code] ?? 1,
        } as any,
      },
      {
        onSuccess: (booking) => { setLocation(`/booking/${booking.id}`); },
        onError: (err: any) => { toast.error(err?.error || t("room.bookingFailed")); },
      }
    );
  };

  if (isLoadingRoom || isLoadingHotel || !room || !hotel) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-pulse space-y-6">
          <div className="h-6 w-1/3 bg-muted rounded" />
          <div className="aspect-[16/7] w-full bg-muted rounded-2xl" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-muted rounded-xl" />)}
          </div>
        </div>
      </Layout>
    );
  }

  const roomType = room.type in ROOM_TYPE_COLORS ? room.type : "single";
  const typeColor = ROOM_TYPE_COLORS[roomType];
  const typeLabel = t(`room.type.${roomType}`);
  const typeSize = t(`room.info.${roomType}.size`);
  const typeBeds = t(`room.info.${roomType}.beds`);
  const typeFeatures = t(`room.info.${roomType}.features`, { returnObjects: true }) as string[];

  const images = room.images?.length ? room.images : [];

  const rx = room as typeof room & RoomExtensions;
  const hx = hotel as typeof hotel & { checkInTime?: string | null; checkOutTime?: string | null };
  const hotelCheckIn = hx?.checkInTime ?? null;
  const hotelCheckOut = hx?.checkOutTime ?? null;
  const activePlan = ratePlans?.find((p) => p.code === selectedRatePlan) ?? null;
  const effectiveNightly = activePlan?.pricePerNight ?? room.price;
  const roomTotal = effectiveNightly * (nights || 1);

  const addonsTotal = addonSelections.reduce((sum, sel) => {
    const a = bookingAddons?.find((x) => x.id === sel.addonId);
    if (!a) return sum;
    let multiplier = 1;
    if (a.unit === "per_night") multiplier = nights || 1;
    if (a.unit === "per_guest") multiplier = room.guests;
    return sum + a.price * sel.quantity * multiplier;
  }, 0);

  const taxes = (roomTotal + addonsTotal) * 0.1;
  const grandTotal = roomTotal + addonsTotal + taxes;

  const otherRooms = allRooms?.filter((r) => r.id !== rId).slice(0, 3) || [];
  const roomDescriptionParagraphs = paragraphsWithoutLast(room.description);

  const ratePlanStrings = {
    title: t("room.ratePlans.title"),
    perNight: t("room.perNightSlash"),
    refundable: t("room.ratePlans.refundable"),
    nonRefundable: t("room.ratePlans.nonRefundable"),
    freeCancellation: t("room.ratePlans.freeCancellation"),
    hours: t("room.ratePlans.hours"),
    breakfast: t("room.ratePlans.breakfast"),
    dinner: currentLang === "ru" ? "Ужин" : "Dinner",
    lateCheckout: t("room.ratePlans.lateCheckout"),
    save: t("room.ratePlans.save"),
    selected: t("room.ratePlans.selected"),
  };

  const addonsStrings = {
    title: t("room.addons.title"),
    subtitle: t("room.addons.subtitle"),
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 max-w-7xl py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/hotels" className="hover:text-foreground transition-colors">{t("room.hotelsBreadcrumb")}</Link>
            <span>/</span>
            <Link href={`/hotels/${hId}`} className="hover:text-foreground transition-colors">{hotel.name}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{typeLabel}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back button + title */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>

            <div className="flex items-center gap-3 flex-wrap mb-2">
              <Badge variant="outline" className={`${typeColor} font-semibold px-3 py-1`}>
                {typeLabel}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-medium">{hotel.rating.toFixed(1)}</span>
                <span>({t("hotel.reviewsCount", { count: hotel.reviewCount })})</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              {typeLabel} — {hotel.name}
            </h1>
            <p className="text-muted-foreground mt-1">{hotel.city}, {hotel.address}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-muted-foreground">{t("room.perNightFrom")}</span>
            <span className="text-4xl font-bold text-primary">{formatPrice(room.price)}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-10">
          {images.length > 0 ? (
            <div className="relative aspect-[16/7] rounded-2xl overflow-hidden group mb-3 bg-muted shadow-lg">
              <img
                src={images[activeImage]}
                alt={`${typeLabel} ${activeImage + 1}`}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((p) => (p - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white border border-black hover:bg-white/90 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5 text-black" />
                  </button>
                  <button
                    onClick={() => setActiveImage((p) => (p + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white border border-black hover:bg-white/90 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5 text-black" />
                  </button>
                </>
              )}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {activeImage + 1} / {images.length}
              </div>
            </div>
          ) : (
            <div className="aspect-[16/7] rounded-2xl bg-muted mb-3 shadow-lg" />
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Room Stats - Quick Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-secondary/40 rounded-xl p-4 text-center">
                <BedDouble className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">{t("room.bedType")}</p>
                <p className="font-semibold text-sm">{typeBeds}</p>
              </div>
              <div className="bg-secondary/40 rounded-xl p-4 text-center">
                <Maximize2 className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">{t("room.roomSize")}</p>
                <p className="font-semibold text-sm">
                  {rx.sizeSqm ? `${rx.sizeSqm} ${currentLang === "ru" ? "м²" : "m²"}` : typeSize}
                </p>
              </div>
              <div className="bg-secondary/40 rounded-xl p-4 text-center">
                <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">{t("room.maxGuests")}</p>
                <p className="font-semibold text-sm">{t("room.upToGuestsShort", { count: room.guests })}</p>
              </div>
              <div className="bg-secondary/40 rounded-xl p-4 text-center">
                <Mountain className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">{t("room.view")}</p>
                <p className="font-semibold text-sm">
                  {rx.viewType && VIEW_LABELS[rx.viewType]
                    ? (currentLang === "ru" ? VIEW_LABELS[rx.viewType].ru : VIEW_LABELS[rx.viewType].en)
                    : (currentLang === "ru" ? "Без вида" : "No view")}
                </p>
              </div>
            </div>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">{t("room.aboutRoom")}</h2>
              <div className="space-y-3">
                {roomDescriptionParagraphs.map((p, idx) => (
                  <p key={`${idx}`} className="text-muted-foreground leading-relaxed text-lg text-justify">
                    {p}
                  </p>
                ))}
              </div>
            </section>

            {/* Free Items */}
            <FreeItemsList
              items={rx.freeItems}
              lang={currentLang}
              title={t("room.freeItems")}
            />

            {/* Detailed Amenities */}
            {rx.amenitiesDetailed && Object.keys(rx.amenitiesDetailed).length > 0 ? (
              <RoomDetailedAmenities
                amenities={rx.amenitiesDetailed}
                lang={currentLang}
                title={t("room.allRoomAmenities")}
                showMore={t("room.showMore")}
                showLess={t("room.showLess")}
              />
            ) : (
              <section>
                <h2 className="text-2xl font-serif font-bold mb-6">{t("room.whatsIncluded")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {typeFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 bg-secondary/30 rounded-lg px-4 py-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Policies */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-serif font-bold mb-6">{t("room.policies")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 rounded-xl bg-secondary/25 border border-border p-4 min-h-[120px]">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" /> {t("room.checkInOut")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentLang === "ru" ? "Заезд:" : "Check-in:"}{" "}
                    <span className="font-medium text-foreground">
                      {currentLang === "ru" ? `с ${hotelCheckIn || "15:00"}` : `from ${hotelCheckIn || "3:00 PM"}`}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentLang === "ru" ? "Выезд:" : "Check-out:"}{" "}
                    <span className="font-medium text-foreground">
                      {currentLang === "ru" ? `до ${hotelCheckOut || "11:00"}` : `by ${hotelCheckOut || "11:00 AM"}`}
                    </span>
                  </p>
                </div>
                <div className="space-y-2 rounded-xl bg-secondary/25 border border-border p-4 min-h-[120px]">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" /> {t("room.cancellationPolicy")}
                  </h3>
                  <p className="text-sm text-muted-foreground">{t("room.cancellationText")}</p>
                </div>
                <div className="space-y-2 rounded-xl bg-secondary/25 border border-border p-4 min-h-[120px]">
                  <h3 className="font-semibold flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-primary" /> {currentLang === "ru" ? "Удостоверение личности" : "ID required"}
                  </h3>
                  <p className="text-sm text-muted-foreground">{currentLang === "ru" ? "При заселении требуется документ, удостоверяющий личность." : "A valid photo ID is required at check-in."}</p>
                </div>
                <div className="space-y-2 rounded-xl bg-secondary/25 border border-border p-4 min-h-[120px]">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CigaretteOff className="h-4 w-4 text-primary" /> {currentLang === "ru" ? "Курение запрещено" : "No smoking"}
                  </h3>
                  <p className="text-sm text-muted-foreground">{currentLang === "ru" ? "Во всех номерах и общественных зонах действует полный запрет на курение." : "Smoking is prohibited in rooms and common areas."}</p>
                </div>
                <div className="space-y-2 rounded-xl bg-secondary/25 border border-border p-4 min-h-[120px]">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-primary" /> {currentLang === "ru" ? "Тихие часы" : "Quiet hours"}
                  </h3>
                  <p className="text-sm text-muted-foreground">{currentLang === "ru" ? "Просим соблюдать тишину с 22:00 до 08:00." : "Please keep noise to a minimum from 10:00 PM to 8:00 AM."}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right: Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-primary p-6 text-white">
                <div className="text-sm opacity-80 mb-1">{t("hotel.startingFrom")}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">{formatPrice(effectiveNightly)}</span>
                  <span className="opacity-80">{t("room.perNightSlash")}</span>
                </div>
                {!room.isAvailable && (
                  <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200 mt-2">
                    {t("room.notAvailable")}
                  </Badge>
                )}
                {room.isAvailable && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 mt-2">
                    {t("room.available")}
                  </Badge>
                )}
              </div>

              <div className="p-6 space-y-5">
                {/* Date Picker */}
                <div>
                  <p className="text-sm font-semibold mb-2">{t("room.selectDates")}</p>
                  <DateRangePopover value={date} onChange={setDate} pricePerNight={effectiveNightly} totalWithTaxes={nights > 0 ? grandTotal : undefined} />
                </div>

                {/* Availability indicator */}
                {isDateSelected && !isLoadingAvailability && availableCount !== null && (
                  <div className={`flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-2 ${
                    isUnavailableForDates
                      ? "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"
                      : availableCount <= 3
                      ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                      : "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400"
                  }`}>
                    <span className={`h-2 w-2 rounded-full flex-shrink-0 ${
                      isUnavailableForDates ? "bg-red-500" : availableCount <= 3 ? "bg-amber-500" : "bg-green-500"
                    }`} />
                    {isUnavailableForDates
                      ? (currentLang === "ru" ? "Нет свободных номеров на эти даты" : "No rooms available for these dates")
                      : currentLang === "ru"
                      ? `Свободно: ${availableCount} из ${availability?.total}`
                      : `Available: ${availableCount} of ${availability?.total}`
                    }
                  </div>
                )}

                {/* Rate Plan Selector */}
                {ratePlans && ratePlans.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <RatePlanSelector
                      plans={ratePlans}
                      selected={selectedRatePlan}
                      onSelect={setSelectedRatePlan}
                      formatPrice={formatPrice}
                      s={ratePlanStrings}
                    />
                  </div>
                )}

                {/* Addons Selector */}
                {bookingAddons && bookingAddons.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <AddonsSelector
                      addons={bookingAddons}
                      selections={addonSelections}
                      onChange={setAddonSelections}
                      formatPrice={formatPrice}
                      lang={currentLang}
                      s={addonsStrings}
                    />
                  </div>
                )}

                {/* Price Breakdown */}
                {nights > 0 && (
                  <div className="bg-secondary/30 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t("room.perNights", { count: nights, price: formatPrice(effectiveNightly) })}</span>
                      <span>{formatPrice(roomTotal)}</span>
                    </div>
                    {addonsTotal > 0 && (
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{t("room.addons.lineLabel")}</span>
                        <span>{formatPrice(addonsTotal)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t("room.taxesFees")}</span>
                      <span>{formatPrice(taxes)}</span>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between font-bold">
                      <span>{t("room.total")}</span>
                      <span className="text-primary">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full h-12 text-base font-semibold"
                  disabled={!room.isAvailable || !date.from || !date.to || createBooking.isPending || isUnavailableForDates}
                  onClick={handleBook}
                >
                  {createBooking.isPending
                    ? t("room.processing")
                    : !date.from || !date.to
                    ? t("room.selectToBook")
                    : isUnavailableForDates
                    ? (currentLang === "ru" ? "Нет свободных мест" : "No rooms available")
                    : room.isAvailable
                    ? t("room.reserve", { price: formatPrice(grandTotal) })
                    : t("room.notAvailableShort")}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  {t("room.noChargeYet")}
                </p>

                <div className="flex items-center justify-center gap-6 pt-2 border-t text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> {t("room.securePayment")}</div>
                  <div className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> {t("room.bestPriceGuarantee")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Rooms in Hotel */}
        {otherRooms.length > 0 && (
          <section className="mt-16 pt-10 border-t">
            <h2 className="text-2xl font-serif font-bold mb-6">{t("room.otherRooms", { hotel: hotel.name })}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherRooms.map((r) => {
                const rType = r.type in ROOM_TYPE_COLORS ? r.type : "single";
                const rColor = ROOM_TYPE_COLORS[rType];
                const rLabel = t(`room.type.${rType}`);
                return (
                  <Link key={r.id} href={`/hotels/${hId}/rooms/${r.id}`}>
                    <div className="group border rounded-2xl overflow-hidden bg-card hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer">
                      {r.images?.[0] && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={r.images[0]}
                            alt={rLabel}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Badge variant="outline" className={`${rColor} text-xs mb-1`}>{rLabel}</Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" /> {t("room.upToGuests", { count: r.guests })}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{formatPrice(r.price)}</p>
                            <p className="text-xs text-muted-foreground">{t("room.perNightSlash")}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 text-justify">
                          {removeLastParagraphPreview(r.description)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}

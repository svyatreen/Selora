import { useState, useRef } from 'react';
import { useEffect } from 'react';
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import {
  useGetHotel,
  getGetHotelQueryKey,
  useGetRoomsByHotel,
  getGetRoomsByHotelQueryKey,
  getGetHotelReviewsQueryKey,
  useCreateBooking,
  useGetSimilarHotels,
  getGetSimilarHotelsQueryKey,
  useCreateReview,
  type ReviewWithUser,
} from '@/api';
import { useParams, Link, useLocation } from 'wouter';
import {
  MapPin,
  Star,
  Wifi,
  Coffee,
  Dumbbell,
  Car,
  Utensils,
  Check,
  CalendarDays,
  Users,
  Heart,
  ArrowRight,
  Waves,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRangePopover } from '@/components/ui/date-range-popover';
import {
  format,
  addDays,
  differenceInCalendarDays,
  startOfDay,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useStayDates } from '@/hooks/use-stay-dates';
import { toast } from 'sonner';
import { HotelCard } from '@/components/ui/hotel-card';
import { Textarea } from '@/components/ui/textarea';
import { customFetch } from '@/api/custom-fetch';
import { useTranslation } from 'react-i18next';
import { ru as ruLocale } from 'date-fns/locale';
import {
  removeLastParagraphPreview,
  splitIntoParagraphs,
} from '@/lib/description-utils';
import { HotelLocationMap } from '@/components/maps/HotelLocationMap';
import { SafeBoundary } from '@/components/SafeBoundary';
import { HotelExtendedAmenities } from '@/components/hotel/HotelExtendedAmenities';
import { HotelKeyDistances } from '@/components/hotel/HotelKeyDistances';
import { HotelInfoBlock } from '@/components/hotel/HotelInfoBlock';
import { HotelNearbyPlaces } from '@/components/hotel/HotelNearbyPlaces';
import { POPULAR_BADGE_LABELS, HOTEL_AMENITY_LABELS, tCode } from '@/lib/amenity-codes';
import type { HotelExtensions } from '@/lib/extended-types';

export default function HotelDetail() {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.resolvedLanguage === 'ru' ? ruLocale : undefined;
  const currentLang = i18n.resolvedLanguage === 'en' ? 'en' : 'ru';
  const { id } = useParams<{ id: string }>();
  const hotelId = parseInt(id, 10);
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { formatPrice, currency, rates } = useCurrency();

  const [date, setDate] = useStayDates();

  const { data: hotel, isLoading: isLoadingHotel } = useGetHotel(hotelId, {
    query: {
      enabled: !!hotelId,
      queryKey: [...getGetHotelQueryKey(hotelId), currentLang],
    },
    request: { headers: { 'x-selora-lang': currentLang } },
  });

  const checkInStr = date.from ? format(date.from, 'yyyy-MM-dd') : undefined;
  const checkOutStr = date.to ? format(date.to, 'yyyy-MM-dd') : undefined;

  const { data: rooms, isLoading: isLoadingRooms } = useGetRoomsByHotel(
    hotelId,
    {
      checkIn: checkInStr,
      checkOut: checkOutStr,
    },
    {
      query: {
        enabled: !!hotelId,
        queryKey: [
          ...getGetRoomsByHotelQueryKey(hotelId, {
            checkIn: checkInStr,
            checkOut: checkOutStr,
          }),
          currentLang,
        ],
        placeholderData: keepPreviousData,
      },
      request: { headers: { 'x-selora-lang': currentLang } },
    },
  );

  const REVIEW_PAGE_SIZE = 10;
  const [reviewPage, setReviewPage] = useState(1);
  const reviewOffset = (reviewPage - 1) * REVIEW_PAGE_SIZE;
  const reviewsSectionRef = useRef<HTMLElement | null>(null);
  const isFirstReviewPageRender = useRef(true);

  // Scroll to top of reviews when changing pages (skip the initial render)
  useEffect(() => {
    if (isFirstReviewPageRender.current) {
      isFirstReviewPageRender.current = false;
      return;
    }
    reviewsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [reviewPage]);

  const { data: reviewsRaw, isLoading: isLoadingReviews } = useQuery({
    queryKey: [...getGetHotelReviewsQueryKey(hotelId), reviewPage],
    enabled: !!hotelId,
    placeholderData: keepPreviousData,
    queryFn: () =>
      customFetch<ReviewWithUser[]>(
        `/api/hotels/${hotelId}/reviews?limit=${REVIEW_PAGE_SIZE + 1}&offset=${reviewOffset}`,
      ),
  });

  const reviews = reviewsRaw?.slice(0, REVIEW_PAGE_SIZE) ?? [];
  const hasNext = (reviewsRaw?.length ?? 0) > REVIEW_PAGE_SIZE;

  const { data: similarHotels } = useGetSimilarHotels(hotelId, {
    query: {
      enabled: !!hotelId,
      queryKey: getGetSimilarHotelsQueryKey(hotelId),
    },
  });

  const queryClient = useQueryClient();
  const createBooking = useCreateBooking();
  const createReview = useCreateReview();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [activeHotelImage, setActiveHotelImage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setReviewPage(1);
  }, [hotelId]);

  useEffect(() => {
    if (isAuthenticated && hotelId) {
      customFetch(`/api/recently-viewed/${hotelId}`, {
        method: 'POST',
        credentials: 'include',
      })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['/api/recently-viewed'] });
        })
        .catch(() => {});
    }
  }, [isAuthenticated, hotelId, queryClient]);

  const handleBookRoom = (roomId: number) => {
    if (!isAuthenticated) {
      toast.error(t('hotel.loginToBook'));
      setLocation('/login');
      return;
    }

    if (!date.from || !date.to) {
      toast.error(t('hotel.selectDatesError'));
      return;
    }

    createBooking.mutate(
      {
        data: {
          roomId,
          checkIn: format(date.from, 'yyyy-MM-dd'),
          checkOut: format(date.to, 'yyyy-MM-dd'),
          currency: currency.code,
          exchangeRate: rates[currency.code] ?? 1,
        } as any,
      },
      {
        onSuccess: (booking) => {
          setLocation(`/booking/${booking.id}`);
        },
        onError: (error: any) => {
          toast.error(error?.error || t('hotel.bookFailed'));
        },
      },
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    createReview.mutate(
      {
        hotelId,
        data: {
          rating: reviewRating,
          comment: reviewComment,
        },
      },
      {
        onSuccess: () => {
          toast.success(t('hotel.reviewSuccess'));
          setReviewComment('');
          setReviewRating(5);
          setReviewPage(1);
          queryClient.invalidateQueries({
            queryKey: getGetHotelReviewsQueryKey(hotelId),
          });
          queryClient.invalidateQueries({
            queryKey: getGetHotelQueryKey(hotelId),
          });
        },
        onError: (error: any) => {
          toast.error(error?.error || t('hotel.reviewFailed'));
        },
      },
    );
  };

  if (isLoadingHotel || !hotel) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 animate-pulse">
          <div className="h-10 w-2/3 bg-muted rounded mb-4"></div>
          <div className="h-6 w-1/3 bg-muted rounded mb-8"></div>
          <div className="aspect-21/9 w-full bg-muted rounded-xl mb-8"></div>
        </div>
      </Layout>
    );
  }

  const getAmenityIcon = (name: string) => {
    const l = name.toLowerCase();
    if (l.includes('wifi')) return <Wifi className="h-5 w-5" />;
    if (l.includes('pool')) return <Waves className="h-5 w-5" />;
    if (l.includes('spa')) return <Heart className="h-5 w-5" />;
    if (l.includes('gym') || l.includes('fitness'))
      return <Dumbbell className="h-5 w-5" />;
    if (l.includes('restaurant') || l.includes('dining'))
      return <Utensils className="h-5 w-5" />;
    if (l.includes('bar')) return <Coffee className="h-5 w-5" />;
    if (l.includes('parking')) return <Car className="h-5 w-5" />;
    return <Check className="h-5 w-5" />;
  };

  const nights =
    date.from && date.to ? differenceInCalendarDays(date.to, date.from) : 0;

  const hx = hotel as typeof hotel & HotelExtensions;
  const popularBadge = hx.stars >= 4 && hx.popularBadge
    ? POPULAR_BADGE_LABELS[hx.popularBadge]
    : null;
  const infoBlockStrings = {
    title: t('hotel.infoBlock.title'),
    languages: t('hotel.infoBlock.languages'),
    checkIn: t('hotel.infoBlock.checkIn'),
    checkOut: t('hotel.infoBlock.checkOut'),
    earlyCheckIn: t('hotel.infoBlock.earlyCheckIn'),
    lateCheckOut: t('hotel.infoBlock.lateCheckOut'),
    available: t('hotel.infoBlock.available'),
    fee: t('hotel.infoBlock.fee'),
    parking: t('hotel.infoBlock.parking'),
    parkingFree: t('hotel.infoBlock.parkingFree'),
    parkingPaid: t('hotel.infoBlock.parkingPaid'),
    parkingCovered: t('hotel.infoBlock.parkingCovered'),
    parkingValet: t('hotel.infoBlock.parkingValet'),
    accessibility: t('hotel.infoBlock.accessibility'),
    pets: t('hotel.infoBlock.pets'),
    petsAllowed: t('hotel.infoBlock.petsAllowed'),
    petsNotAllowed: t('hotel.infoBlock.petsNotAllowed'),
    upToKg: t('hotel.infoBlock.upToKg'),
    children: t('hotel.infoBlock.children'),
    childrenAllAges: t('hotel.infoBlock.childrenAllAges'),
    childrenNotAllowed: t('hotel.infoBlock.childrenNotAllowed'),
    free: t('hotel.infoBlock.free'),
    reduced: t('hotel.infoBlock.reduced'),
    full: t('hotel.infoBlock.full'),
    payment: t('hotel.infoBlock.payment'),
    yearsOld: t('hotel.infoBlock.yearsOld'),
    accessFeatures: {
      wheelchair: t('hotel.infoBlock.access.wheelchair'),
      elevator: t('hotel.infoBlock.access.elevator'),
      ramped: t('hotel.infoBlock.access.ramped'),
      rooms: t('hotel.infoBlock.access.rooms'),
      braille: t('hotel.infoBlock.access.braille'),
      hearing: t('hotel.infoBlock.access.hearing'),
    },
  };
  const nearbyStrings = {
    title: t('hotel.nearby.title'),
    subtitle: t('hotel.nearby.subtitle'),
    empty: t('hotel.nearby.empty'),
    walkMin: t('hotel.nearby.walkMin'),
    fromHotel: t('hotel.nearby.fromHotel'),
    errorLoading: t('hotel.nearby.errorLoading'),
    loading: t('hotel.nearby.loading'),
    categories: {
      restaurant: t('hotel.nearby.cat.restaurant'),
      cafe: t('hotel.nearby.cat.cafe'),
      bar: t('hotel.nearby.cat.bar'),
      shopping: t('hotel.nearby.cat.shopping'),
      attraction: t('hotel.nearby.cat.attraction'),
      park: t('hotel.nearby.cat.park'),
      pharmacy: t('hotel.nearby.cat.pharmacy'),
      atm: t('hotel.nearby.cat.atm'),
    },
  };

  return (
    <Layout>
      {/* Header & Gallery */}
      <div className="bg-background pb-12">
        <div className="container mx-auto px-4 pt-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {t('hotel.starHotel', {
                    count: hotel.stars,
                    defaultValue: `${hotel.stars} Star Hotel`,
                  })}
                </Badge>
                {popularBadge && (
                  <Badge
                    variant="outline"
                    className={`font-semibold border ${popularBadge.color}`}
                  >
                    ★ {currentLang === 'ru' ? popularBadge.ru : popularBadge.en}
                  </Badge>
                )}
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium">{hotel.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground text-sm">
                    (
                    {t('hotel.reviewsCount', {
                      count: hotel.reviewCount,
                      defaultValue: `${hotel.reviewCount} reviews`,
                    })}
                    )
                  </span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 tracking-tight">
                {hotel.name}
              </h1>
              <div className="flex items-center text-muted-foreground text-lg">
                <MapPin className="mr-2 h-5 w-5" />
                <span>
                  {hotel.address}, {hotel.city}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 bg-secondary/50 p-4 rounded-xl border border-border">
              <div className="text-sm text-muted-foreground">
                {t('hotel.startingFrom')}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">
                  {formatPrice(hotel.minPrice || 0)}
                </span>
                <span className="text-muted-foreground">
                  {t('hotel.perNight')}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-12">
            {hotel.images.length > 0 ? (
              <div className="relative aspect-[16/7] rounded-2xl overflow-hidden group bg-muted shadow-lg">
                <img
                  src={hotel.images[activeHotelImage]}
                  alt={`${hotel.name} ${activeHotelImage + 1}`}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {hotel.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveHotelImage((p) => (p - 1 + hotel.images.length) % hotel.images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white border border-black hover:bg-white/90 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="h-5 w-5 text-black" />
                    </button>
                    <button
                      onClick={() => setActiveHotelImage((p) => (p + 1) % hotel.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white border border-black hover:bg-white/90 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="h-5 w-5 text-black" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {activeHotelImage + 1} / {hotel.images.length}
                </div>
              </div>
            ) : (
              <div className="aspect-[16/7] rounded-2xl bg-muted shadow-lg" />
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* About */}
              <section>
                <SafeBoundary>
                  <HotelLocationMap
                    hotelName={hotel.name}
                    address={hotel.address}
                    city={hotel.city}
                    latitude={hotel.latitude}
                    longitude={hotel.longitude}
                  />
                </SafeBoundary>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold mb-4">
                  {t('hotel.aboutProperty')}
                </h2>
                <div className="space-y-4">
                  {splitIntoParagraphs(hotel.description).map((p, idx) => (
                    <p
                      key={`${idx}`}
                      className="text-muted-foreground leading-relaxed text-lg text-justify"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </section>

              {/* Amenities */}
              <section>
                <h2 className="text-2xl font-serif font-bold mb-6">
                  {t('hotel.popularAmenities')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                  {hotel.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 text-foreground"
                    >
                      <div className="bg-secondary p-2 rounded-lg text-primary">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span className="font-medium">
                        {tCode(HOTEL_AMENITY_LABELS, amenity, currentLang)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <HotelExtendedAmenities
                amenitiesExtended={hx.amenitiesExtended}
                lang={currentLang}
                title={t('hotel.allAmenities')}
                showAllLabel={t('hotel.showAll')}
                showLessLabel={t('hotel.showLess')}
              />

              {hotel.latitude && hotel.longitude && (
                <HotelKeyDistances
                  distances={hx.keyDistances}
                  lang={currentLang}
                  title={t('hotel.keyDistances')}
                  walkLabel={t('hotel.minWalk')}
                  driveLabel={t('hotel.minDrive')}
                />
              )}

              <HotelInfoBlock
                hotel={hx}
                lang={currentLang}
                formatPrice={formatPrice}
                s={infoBlockStrings}
              />

              {hotel.latitude && hotel.longitude && (
                <HotelNearbyPlaces
                  hotelId={hotelId}
                  lang={currentLang}
                  s={nearbyStrings}
                />
              )}

              {/* Reviews */}
              <section ref={reviewsSectionRef} className="pt-8 border-t scroll-mt-24">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-serif font-bold">
                    {t('hotel.guestReviews')}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Star className="h-6 w-6 fill-primary text-primary" />
                    <span className="text-2xl font-bold">
                      {hotel.rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground ml-1">/ 5</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {isLoadingReviews && !reviewsRaw && (
                    <>
                      {Array.from({ length: REVIEW_PAGE_SIZE }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-secondary/30 p-6 rounded-xl border border-border/50 animate-pulse"
                        >
                          <div className="h-6 bg-muted/60 rounded w-2/3 mb-3" />
                          <div className="h-4 bg-muted/60 rounded w-full mb-2" />
                          <div className="h-4 bg-muted/60 rounded w-5/6 mb-2" />
                          <div className="h-4 bg-muted/60 rounded w-4/6" />
                        </div>
                      ))}
                    </>
                  )}

                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-secondary/30 p-6 rounded-xl border border-border/50"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {review.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold">{review.user?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(
                                new Date(review.createdAt),
                                'MMM d, yyyy',
                                { locale: dateLocale },
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-background px-2 py-1 rounded-md shadow-sm">
                          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                          <span className="text-sm font-medium">
                            {review.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground whitespace-pre-line text-justify leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}

                  {!isLoadingReviews && !reviewsRaw?.length && (
                    <p className="text-muted-foreground italic">
                      {t('hotel.noReviews')}
                    </p>
                  )}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={reviewPage <= 1 || isLoadingReviews}
                    onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
                    className="w-full sm:w-auto"
                  >
                    {currentLang === 'ru' ? 'Предыдущие' : 'Previous'}
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    {currentLang === 'ru'
                      ? `Страница ${reviewPage}`
                      : `Page ${reviewPage}`}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!hasNext || isLoadingReviews}
                    onClick={() => setReviewPage((p) => p + 1)}
                    className="w-full sm:w-auto"
                  >
                    {currentLang === 'ru' ? 'Следующие' : 'Next'}
                  </Button>
                </div>

                {isAuthenticated && (
                  <div className="mt-8 bg-secondary/20 p-6 rounded-xl border border-border">
                    <h3 className="font-semibold mb-4">
                      {t('hotel.leaveReview')}
                    </h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-6 w-6 ${reviewRating >= star ? 'fill-primary text-primary' : 'text-muted'}`}
                              />
                            </button>
                          ))}
                        </div>
                        <Textarea
                          placeholder={t('hotel.reviewPlaceholder')}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="resize-none"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={
                          createReview.isPending || !reviewComment.trim()
                        }
                      >
                        {createReview.isPending
                          ? t('hotel.submitting')
                          : t('hotel.submitReview')}
                      </Button>
                    </form>
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar / Room Picker */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card border border-border rounded-2xl shadow-lg p-6 flex flex-col gap-6">
                <h3 className="text-xl font-serif font-bold">
                  {t('hotel.selectDates')}
                </h3>

                <div className="grid gap-2">
                  <DateRangePopover value={date} onChange={setDate} />
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-xl font-serif font-bold">
                    {t('hotel.availableRooms')}
                  </h3>
                  {nights > 0 ? (
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('hotel.pricesShownFor', { count: nights })}
                    </p>
                  ) : null}

                  {isLoadingRooms ? (
                    <div className="space-y-4">
                      <div className="h-32 bg-muted rounded-xl animate-pulse"></div>
                      <div className="h-32 bg-muted rounded-xl animate-pulse"></div>
                    </div>
                  ) : rooms?.length ? (
                    <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                      {rooms.map((room) => (
                        <div
                          key={room.id}
                          className={cn(
                            'border rounded-xl overflow-hidden transition-all',
                            room.isAvailable
                              ? 'bg-background hover:border-primary/50 hover:shadow-md'
                              : 'bg-muted/50 opacity-60',
                          )}
                        >
                          {/* Room thumbnail */}
                          {room.images?.[0] && (
                            <div className="h-32 overflow-hidden">
                              <img
                                src={room.images[0]}
                                alt={`${room.type} room`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold capitalize text-base">
                                {t(`room.type.${room.type}`, {
                                  defaultValue: t('hotel.roomTypeName', {
                                    type: room.type,
                                  }),
                                })}
                              </h4>
                              <div className="text-right">
                                <span className="font-bold">
                                  {formatPrice(room.price)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {' '}{t('hotel.perNight')}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                              <Users className="h-3.5 w-3.5" />
                              <span>
                                {t('hotel.guestsUpTo', { count: room.guests })}
                              </span>
                              <span>·</span>
                              <span>
                                {t('hotel.roomsLeft', {
                                  count: room.remainingRooms ?? 0,
                                })}
                              </span>
                            </div>

                            <p className="text-xs text-muted-foreground mb-4 line-clamp-2 text-justify">
                              {removeLastParagraphPreview(room.description)}
                            </p>

                            <div className="flex gap-2">
                              <Link
                                href={`/hotels/${hotelId}/rooms/${room.id}`}
                                className="flex-1"
                              >
                                <Button
                                  variant="outline"
                                  className="w-full text-xs h-8 gap-1"
                                >
                                  {t('hotel.viewDetails')}{' '}
                                  <ArrowRight className="h-3 w-3" />
                                </Button>
                              </Link>
                              <Button
                                className="flex-1 text-xs h-8"
                                disabled={
                                  !room.isAvailable ||
                                  !date.from ||
                                  !date.to ||
                                  createBooking.isPending
                                }
                                onClick={() => handleBookRoom(room.id)}
                                variant={
                                  room.isAvailable ? 'default' : 'secondary'
                                }
                              >
                                {createBooking.isPending
                                  ? '…'
                                  : room.isAvailable
                                    ? t('hotel.bookNow')
                                    : t('hotel.unavailable')}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      {t('hotel.noRooms')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Hotels */}
      {similarHotels && similarHotels.length > 0 && (
        <section className="py-16 bg-secondary/30 border-t">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-serif font-bold mb-8">
              {t('hotel.youMightAlsoLike')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarHotels.slice(0, 3).map((similarHotel) => (
                <HotelCard key={similarHotel.id} hotel={similarHotel} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

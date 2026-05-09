import { useEffect } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { customFetch } from '@/api/custom-fetch';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCompareList } from '@/components/hotel/CompareButton';
import {
  GitCompare, X, MapPin, Star, ArrowRight, Trash2, Check, XCircle,
} from 'lucide-react';
import {
  HOTEL_AMENITY_LABELS,
  POPULAR_BADGE_LABELS,
  LANGUAGE_LABELS,
  tCode,
} from '@/lib/amenity-codes';
import type { HotelExtensions } from '@/lib/extended-types';

type FullHotel = {
  id: number;
  name: string;
  city: string;
  address: string;
  rating: number;
  stars: number;
  reviewCount: number;
  minPrice?: number | null;
  images: string[];
  amenities: string[];
} & HotelExtensions;

export default function ComparePage() {
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency();
  const lang = i18n.resolvedLanguage === 'en' ? 'en' : 'ru';
  const compare = useCompareList();
  const ids = compare.list;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: hotels, isLoading } = useQuery({
    queryKey: ['compare-hotels', ids, lang],
    enabled: ids.length > 0,
    queryFn: async () => {
      const res = await Promise.all(
        ids.map((id) =>
          customFetch<FullHotel>(`/api/hotels/${id}`, {
            headers: { 'x-selora-lang': lang },
          }).catch(() => null),
        ),
      );
      return res.filter((h): h is FullHotel => h !== null);
    },
  });

  const list = hotels || [];

  const renderBoolRow = (
    label: string,
    values: Array<boolean | null | undefined>,
  ) => (
    <tr className="border-t border-border/60">
      <td className="py-3 pr-4 text-sm text-muted-foreground sticky left-0 bg-background">
        {label}
      </td>
      {values.map((v, i) => (
        <td key={i} className="py-3 px-3 text-center align-middle">
          {v ? (
            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 inline" />
          ) : (
            <XCircle className="h-4 w-4 text-rose-400 dark:text-rose-500 inline" />
          )}
        </td>
      ))}
    </tr>
  );

  const renderTextRow = (
    label: string,
    values: Array<string | number | null | undefined>,
  ) => (
    <tr className="border-t border-border/60">
      <td className="py-3 pr-4 text-sm text-muted-foreground sticky left-0 bg-background">
        {label}
      </td>
      {values.map((v, i) => (
        <td key={i} className="py-3 px-3 text-center text-sm font-medium align-middle">
          {v == null || v === '' ? <span className="text-muted-foreground">—</span> : v}
        </td>
      ))}
    </tr>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GitCompare className="h-6 w-6 text-primary" />
              <h1 className="text-3xl md:text-4xl font-serif font-bold">
                {t('compare.pageTitle')}
              </h1>
            </div>
            <p className="text-muted-foreground">
              {t('compare.pageSubtitle', { count: list.length })}
            </p>
          </div>
          {list.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => compare.clear()}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {t('compare.clearAll')}
            </Button>
          )}
        </div>

        {ids.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <GitCompare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t('compare.emptyTitle')}</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {t('compare.emptyText')}
            </p>
            <Link href="/hotels">
              <Button size="lg" className="gap-2">
                {t('compare.browseHotels')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ids.map((id) => (
              <div key={id} className="h-96 rounded-2xl bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full border-separate border-spacing-0 min-w-[800px]">
              <thead>
                <tr>
                  <th className="w-44 sticky left-0 bg-background"></th>
                  {list.map((h) => (
                    <th
                      key={h.id}
                      className="p-3 text-left align-top min-w-[220px]"
                    >
                      <div className="bg-card border border-border rounded-2xl overflow-hidden">
                        <div className="relative h-32 bg-muted">
                          {h.images?.[0] && (
                            <img
                              src={h.images[0]}
                              alt={h.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <button
                            onClick={() => compare.remove(h.id)}
                            className="absolute top-2 right-2 h-7 w-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                            title={t('compare.remove')}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                          {h.stars >= 4 && h.popularBadge && POPULAR_BADGE_LABELS[h.popularBadge] && (
                            <span className={`absolute bottom-2 left-2 text-[10px] font-bold uppercase px-2 py-1 rounded-md border ${POPULAR_BADGE_LABELS[h.popularBadge].color}`}>
                              {lang === 'ru' ? POPULAR_BADGE_LABELS[h.popularBadge].ru : POPULAR_BADGE_LABELS[h.popularBadge].en}
                            </span>
                          )}
                        </div>
                        <div className="p-3 space-y-1.5">
                          <Link
                            href={`/hotels/${h.id}`}
                            className="font-bold text-sm hover:text-primary line-clamp-2 block"
                          >
                            {h.name}
                          </Link>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{h.city}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            <span className="font-semibold">{h.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground">
                              · {h.reviewCount}
                            </span>
                          </div>
                          {h.minPrice != null && (
                            <p className="text-base font-bold text-primary pt-1">
                              {formatPrice(h.minPrice)}
                              <span className="text-[10px] text-muted-foreground font-normal ml-1">
                                {t('hotel.perNight')}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {renderTextRow(
                  t('compare.fields.stars'),
                  list.map((h) => '★'.repeat(h.stars)),
                )}
                {renderTextRow(
                  t('compare.fields.rating'),
                  list.map((h) => h.rating.toFixed(1)),
                )}
                {renderTextRow(
                  t('compare.fields.price'),
                  list.map((h) =>
                    h.minPrice != null ? formatPrice(h.minPrice) : null,
                  ),
                )}
                {renderTextRow(
                  t('compare.fields.checkInOut'),
                  list.map((h) =>
                    h.checkInTime && h.checkOutTime
                      ? `${h.checkInTime} / ${h.checkOutTime}`
                      : null,
                  ),
                )}
                {renderBoolRow(
                  t('compare.fields.parkingFree'),
                  list.map((h) => h.parking?.available && h.parking?.free),
                )}
                {renderBoolRow(
                  t('compare.fields.wheelchair'),
                  list.map((h) => h.accessibility?.wheelchairAccessible),
                )}
                {renderBoolRow(
                  t('compare.fields.pets'),
                  list.map((h) => h.petPolicy?.allowed),
                )}
                {renderBoolRow(
                  t('compare.fields.children'),
                  list.map((h) => h.childPolicy?.allowed),
                )}
                {renderTextRow(
                  t('compare.fields.languages'),
                  list.map((h) => {
                    if (!h.languages || h.languages.length === 0) return null;
                    const flags = h.languages
                      .slice(0, 6)
                      .map((c) => LANGUAGE_LABELS[c]?.flag || '🌐')
                      .join(' ');
                    return `${flags} (${h.languages.length})`;
                  }),
                )}
                {renderTextRow(
                  t('compare.fields.amenities'),
                  list.map((h) => h.amenities?.length || 0),
                )}
                <tr className="border-t border-border/60">
                  <td className="py-3 pr-4 text-sm text-muted-foreground sticky left-0 bg-background align-top">
                    {t('compare.fields.topAmenities')}
                  </td>
                  {list.map((h, i) => (
                    <td key={i} className="py-3 px-3 align-top">
                      <ul className="text-xs space-y-1">
                        {(h.amenities || []).slice(0, 5).map((c) => (
                          <li
                            key={c}
                            className="flex items-start gap-1 text-foreground"
                          >
                            <Check className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                            {tCode(HOTEL_AMENITY_LABELS, c, lang)}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td></td>
                  {list.map((h) => (
                    <td key={h.id} className="p-3 pt-4">
                      <Link href={`/hotels/${h.id}`} className="block">
                        <Button size="sm" className="w-full gap-2">
                          {t('compare.viewHotel')}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { customFetch } from '@/api/custom-fetch';
import {
  Utensils, Coffee, ShoppingBag, MapPin, Beer, Trees, Hospital,
  CreditCard, Footprints, ExternalLink, Globe, Phone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NearbyPlace, NearbyResponse } from '@/lib/extended-types';

const CATEGORIES = [
  { code: 'restaurant', icon: Utensils },
  { code: 'cafe', icon: Coffee },
  { code: 'bar', icon: Beer },
  { code: 'shopping', icon: ShoppingBag },
  { code: 'attraction', icon: MapPin },
  { code: 'park', icon: Trees },
  { code: 'pharmacy', icon: Hospital },
  { code: 'atm', icon: CreditCard },
] as const;

type Strings = {
  title: string;
  subtitle: string;
  empty: string;
  walkMin: string;
  fromHotel: string;
  errorLoading: string;
  loading: string;
  categories: Record<string, string>;
};

export function HotelNearbyPlaces({
  hotelId,
  lang,
  s,
}: {
  hotelId: number;
  lang: 'ru' | 'en';
  s: Strings;
}) {
  const [active, setActive] = useState<string>('restaurant');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['hotel-nearby', hotelId, active],
    queryFn: () =>
      customFetch<NearbyResponse>(
        `/api/hotels/${hotelId}/nearby?category=${active}&limit=12`,
      ),
    staleTime: 1000 * 60 * 30,
    retry: 1,
    enabled: !!hotelId,
  });

  const places = useMemo<NearbyPlace[]>(
    () => data?.places ?? [],
    [data],
  );

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-2xl font-serif font-bold">{s.title}</h2>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
        {CATEGORIES.map(({ code, icon: Icon }) => (
          <button
            key={code}
            onClick={() => setActive(code)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
              active === code
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-background border-border hover:border-primary/50 text-foreground',
            )}
          >
            <Icon className="h-4 w-4" />
            {s.categories[code] || code}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-muted/50 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-muted-foreground italic py-6 text-center">
          {s.errorLoading}
        </p>
      )}

      {!isLoading && !isError && places.length === 0 && (
        <p className="text-sm text-muted-foreground italic py-6 text-center">
          {s.empty}
        </p>
      )}

      {places.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {places.map((p) => {
            const name =
              (lang === 'ru' ? p.nameRu : p.nameEn) || p.name;
            return (
              <div
                key={p.osmId}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-medium text-sm flex-1">{name}</p>
                  <span className="flex-shrink-0 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    {p.distanceKm < 1
                      ? `${Math.round(p.distanceKm * 1000)} ${lang === 'ru' ? 'м' : 'm'}`
                      : `${p.distanceKm.toFixed(1)} ${lang === 'ru' ? 'км' : 'km'}`}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <Footprints className="h-3 w-3" />
                    {p.walkMinutes} {s.walkMin}
                  </span>
                  {p.cuisine && (
                    <span className="capitalize">· {p.cuisine.replace(/;/g, ', ')}</span>
                  )}
                </div>
                {(p.website || p.phone) && (
                  <div className="flex items-center gap-3 text-xs mt-2 pt-2 border-t border-border/50">
                    {p.website && (
                      <a
                        href={p.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Globe className="h-3 w-3" />
                        {lang === 'ru' ? 'Сайт' : 'Website'}
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                    {p.phone && (
                      <a
                        href={`tel:${p.phone}`}
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Phone className="h-3 w-3" />
                        {p.phone}
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

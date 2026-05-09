import type { ReactElement } from 'react';
import {
  MapPin, Navigation, Footprints, Car, Plane, TramFront, ShoppingCart, Trees,
  Pill, Landmark, ShoppingBag, UtensilsCrossed, Hospital, Banknote, Coffee,
} from 'lucide-react';

type KeyDistance = {
  type: string;
  nameRu: string;
  nameEn: string;
  distanceKm: number;
  durationWalkMin?: number | null;
  durationDriveMin?: number | null;
};

const TYPE_ICON: Record<string, ReactElement> = {
  airport: <Plane className="h-4 w-4" />,
  city_center: <MapPin className="h-4 w-4" />,
  beach: <MapPin className="h-4 w-4" />,
  station: <Navigation className="h-4 w-4" />,
  metro: <TramFront className="h-4 w-4" />,
  supermarket: <ShoppingCart className="h-4 w-4" />,
  park: <Trees className="h-4 w-4" />,
  pharmacy: <Pill className="h-4 w-4" />,
  museum: <Landmark className="h-4 w-4" />,
  mall: <ShoppingBag className="h-4 w-4" />,
  shopping_mall: <ShoppingBag className="h-4 w-4" />,
  restaurant_district: <UtensilsCrossed className="h-4 w-4" />,
  hospital: <Hospital className="h-4 w-4" />,
  atm: <Banknote className="h-4 w-4" />,
  cafe_district: <Coffee className="h-4 w-4" />,
  district: <MapPin className="h-4 w-4" />,
};

type Props = {
  distances: KeyDistance[] | null | undefined;
  lang: 'ru' | 'en';
  title: string;
  walkLabel: string;
  driveLabel: string;
};

export function HotelKeyDistances({
  distances,
  lang,
  title,
  walkLabel,
  driveLabel,
}: Props) {
  if (!distances || distances.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-serif font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {distances.map((d, i) => {
          const name = lang === 'ru' ? d.nameRu : d.nameEn;
          const icon = TYPE_ICON[d.type] || <MapPin className="h-4 w-4" />;
          return (
            <div
              key={`${d.type}-${i}`}
              className="flex items-start gap-3 bg-secondary/30 rounded-xl p-4 border border-border/50"
            >
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{name}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                  <span className="font-semibold text-foreground">
                    {d.distanceKm < 1
                      ? `${Math.round(d.distanceKm * 1000)} ${lang === 'ru' ? 'м' : 'm'}`
                      : `${d.distanceKm.toFixed(1)} ${lang === 'ru' ? 'км' : 'km'}`}
                  </span>
                  {d.durationWalkMin != null && d.durationWalkMin <= 30 && (
                    <span className="flex items-center gap-1">
                      <Footprints className="h-3 w-3" />
                      {d.durationWalkMin} {walkLabel}
                    </span>
                  )}
                  {d.durationDriveMin != null && d.durationDriveMin > 0 && (
                    <span className="flex items-center gap-1">
                      <Car className="h-3 w-3" />
                      {d.durationDriveMin} {driveLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

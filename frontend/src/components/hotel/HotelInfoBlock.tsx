import {
  Languages, Car, Accessibility, Baby, Dog, Clock,
} from 'lucide-react';
import { LANGUAGE_LABELS } from '@/lib/amenity-codes';

type Hotel = {
  languages?: string[] | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  earlyCheckIn?: { available: boolean; fee: number; currency?: string } | null;
  lateCheckOut?: { available: boolean; fee: number; currency?: string } | null;
  parking?: {
    available: boolean;
    free: boolean;
    covered: boolean;
    valet: boolean;
    kind?: string;
    price?: number;
    currency?: string;
  } | null;
  accessibility?: {
    wheelchairAccessible: boolean;
    elevator: boolean;
    rampedEntrance: boolean;
    accessibleRooms: boolean;
    brailleSignage: boolean;
    hearingAssistance: boolean;
  } | null;
  petPolicy?: {
    allowed: boolean;
    maxWeightKg?: number;
    fee?: number;
    restrictions?: string;
  } | null;
  childPolicy?: {
    allowed: boolean;
    ageGroups: Array<{ from: number; to: number; pricing: 'free' | 'reduced' | 'full' }>;
  } | null;
};

// Parking kind label dictionary
const PARKING_KIND_LABELS: Record<string, { ru: string; en: string }> = {
  underground: { ru: 'Подземная парковка', en: 'Underground parking' },
  underground_free: { ru: 'Бесплатная подземная парковка', en: 'Free underground parking' },
  covered: { ru: 'Крытая парковка', en: 'Covered parking' },
  open: { ru: 'Открытая парковка', en: 'Open-air parking' },
  open_paid: { ru: 'Открытая парковка', en: 'Open-air parking' },
  valet: { ru: 'Парковка с парковщиком (valet)', en: 'Valet parking' },
};

type Strings = {
  title: string;
  languages: string;
  checkIn: string;
  checkOut: string;
  earlyCheckIn: string;
  lateCheckOut: string;
  available: string;
  fee: string;
  parking: string;
  parkingFree: string;
  parkingPaid: string;
  parkingCovered: string;
  parkingValet: string;
  accessibility: string;
  pets: string;
  petsAllowed: string;
  petsNotAllowed: string;
  upToKg: string;
  children: string;
  childrenAllAges: string;
  childrenNotAllowed: string;
  free: string;
  reduced: string;
  full: string;
  payment: string;
  yearsOld: string;
  accessFeatures: {
    wheelchair: string;
    elevator: string;
    ramped: string;
    rooms: string;
    braille: string;
    hearing: string;
  };
};

export function HotelInfoBlock({
  hotel,
  lang,
  formatPrice,
  s,
}: {
  hotel: Hotel;
  lang: 'ru' | 'en';
  formatPrice: (n: number) => string;
  s: Strings;
}) {
  const showLangs = hotel.languages && hotel.languages.length > 0;
  const showParking = !!hotel.parking;
  const showAccess = !!hotel.accessibility;
  const showPet = !!hotel.petPolicy;
  const showChild = !!hotel.childPolicy;
  const showCheckIn = !!hotel.checkInTime;

  if (
    !showLangs && !showParking && !showAccess && !showPet && !showChild &&
    !showCheckIn
  ) return null;

  // Hide wheelchair & braille per requirements
  const HIDDEN_ACCESS_KEYS = new Set(['wheelchairAccessible', 'brailleSignage']);
  const accessActive = hotel.accessibility
    ? Object.entries(hotel.accessibility).filter(
        ([k, v]) => v === true && !HIDDEN_ACCESS_KEYS.has(k),
      )
    : [];

  const accessLabel = (key: string) => {
    switch (key) {
      case 'wheelchairAccessible': return s.accessFeatures.wheelchair;
      case 'elevator': return s.accessFeatures.elevator;
      case 'rampedEntrance': return s.accessFeatures.ramped;
      case 'accessibleRooms': return s.accessFeatures.rooms;
      case 'brailleSignage': return s.accessFeatures.braille;
      case 'hearingAssistance': return s.accessFeatures.hearing;
      default: return key;
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-serif font-bold mb-6">{s.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showCheckIn && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{s.checkIn} / {s.checkOut}</h3>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">{s.checkIn}: </span>
                <span className="font-medium">{hotel.checkInTime}</span>
              </p>
              <p>
                <span className="text-muted-foreground">{s.checkOut}: </span>
                <span className="font-medium">{hotel.checkOutTime}</span>
              </p>
            </div>
          </div>
        )}

        {showLangs && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Languages className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{s.languages}</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {hotel.languages!.map((code) => {
                const meta = LANGUAGE_LABELS[code];
                const label = meta ? (lang === 'ru' ? meta.ru : meta.en) : code;
                return (
                  <span
                    key={code}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary text-xs font-medium"
                  >
                    {meta?.flag && <span className="text-sm">{meta.flag}</span>}
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {showParking && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Car className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{s.parking}</h3>
            </div>
            {hotel.parking!.available ? (
              <div className="space-y-2">
                {hotel.parking!.kind && PARKING_KIND_LABELS[hotel.parking!.kind] && (
                  <p className="text-sm font-medium">
                    {lang === 'ru'
                      ? PARKING_KIND_LABELS[hotel.parking!.kind].ru
                      : PARKING_KIND_LABELS[hotel.parking!.kind].en}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <span className={`px-2 py-1 rounded-md font-medium ${
                    hotel.parking!.free
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                  }`}>
                    {hotel.parking!.free
                      ? s.parkingFree
                      : `${s.parkingPaid}${
                          hotel.parking!.price ? ` · ${formatPrice(hotel.parking!.price)}` : ''
                        }`}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>
        )}

        {showAccess && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Accessibility className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{s.accessibility}</h3>
            </div>
            {accessActive.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {accessActive.map(([k]) => (
                  <li key={k} className="text-muted-foreground">
                    • {accessLabel(k)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>
        )}

        {showPet && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Dog className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{s.pets}</h3>
            </div>
            {hotel.petPolicy!.allowed ? (
              <div className="space-y-1 text-sm">
                <p className="font-medium text-emerald-700 dark:text-emerald-300">
                  ✓ {s.petsAllowed}
                </p>
                {hotel.petPolicy!.maxWeightKg && (
                  <p className="text-muted-foreground">
                    {s.upToKg}: {hotel.petPolicy!.maxWeightKg} {lang === 'ru' ? 'кг' : 'kg'}
                  </p>
                )}
                {hotel.petPolicy!.fee != null && hotel.petPolicy!.fee > 0 && (
                  <p className="text-muted-foreground">
                    {s.fee}: {formatPrice(hotel.petPolicy!.fee)}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{s.petsNotAllowed}</p>
            )}
          </div>
        )}

        {showChild && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Baby className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{s.children}</h3>
            </div>
            {hotel.childPolicy!.allowed ? (
              <div className="space-y-2 text-sm">
                <p className="font-medium text-emerald-700 dark:text-emerald-300">
                  ✓ {s.childrenAllAges}
                </p>
                {(hotel.childPolicy!.ageGroups ?? []).map((g, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 text-xs bg-secondary/40 rounded-md px-2 py-1">
                    <span className="text-muted-foreground">
                      {g.from}–{g.to} {s.yearsOld}
                    </span>
                    <span className="font-medium">
                      {g.pricing === 'free' ? s.free :
                       g.pricing === 'reduced' ? s.reduced : s.full}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{s.childrenNotAllowed}</p>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
